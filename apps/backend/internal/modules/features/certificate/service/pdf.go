package service

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"strconv"
	"strings"
	"time"

	"venturo-skeleton-go/internal/modules/features/certificate/domain"

	"github.com/signintech/gopdf"
	qrcode "github.com/skip2/go-qrcode"
	"golang.org/x/image/font/gofont/gobold"
	"golang.org/x/image/font/gofont/goregular"
)

const maxAssetBytes = 10 << 20

type PDFInput struct {
	CertificateNumber string
	VerificationURL   string
	IssuedAt          time.Time
	Issue             *domain.IssueData
	Template          *domain.Template
}

type PDFGenerator interface {
	Generate(ctx context.Context, input PDFInput) ([]byte, error)
}

type GoPDFGenerator struct{ client *http.Client }

func NewGoPDFGenerator(timeout time.Duration) *GoPDFGenerator {
	dialer := &net.Dialer{Timeout: timeout}
	transport := &http.Transport{DialContext: func(ctx context.Context, network, address string) (net.Conn, error) {
		host, port, err := net.SplitHostPort(address)
		if err != nil {
			return nil, fmt.Errorf("parse asset address: %w", err)
		}
		ips, err := net.DefaultResolver.LookupIP(ctx, "ip", host)
		if err != nil {
			return nil, fmt.Errorf("resolve asset host: %w", err)
		}
		for _, ip := range ips {
			if publicIP(ip) {
				return dialer.DialContext(ctx, network, net.JoinHostPort(ip.String(), port))
			}
		}
		return nil, fmt.Errorf("asset host does not resolve to a public IP")
	}}
	return &GoPDFGenerator{client: &http.Client{Timeout: timeout, Transport: transport}}
}

func (g *GoPDFGenerator) Generate(ctx context.Context, input PDFInput) ([]byte, error) {
	if input.Issue == nil || input.Template == nil {
		return nil, fmt.Errorf("certificate issue data and template are required")
	}
	pdf := &gopdf.GoPdf{}
	pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4Landscape})
	pdf.AddPage()
	if err := pdf.AddTTFFontData("regular", goregular.TTF); err != nil {
		return nil, fmt.Errorf("load regular font: %w", err)
	}
	if err := pdf.AddTTFFontData("bold", gobold.TTF); err != nil {
		return nil, fmt.Errorf("load bold font: %w", err)
	}
	if input.Template.BackgroundURL != "" {
		asset, err := g.loadAsset(ctx, input.Template.BackgroundURL)
		if err != nil {
			return nil, fmt.Errorf("load certificate background: %w", err)
		}
		if err := addImage(pdf, asset, 0, 0, 842, 595); err != nil {
			return nil, fmt.Errorf("draw certificate background: %w", err)
		}
	}

	if input.Template.ShowHeader {
		if err := centeredText(pdf, "bold", 18, color(input.Template.HeaderColor, 35, 44, 64), 60, 35, input.Template.HeaderText); err != nil {
			return nil, err
		}
		if err := centeredText(pdf, "regular", 11, color(input.Template.HeaderColor, 75, 85, 99), 94, 24, input.Template.HeaderSubtitle); err != nil {
			return nil, err
		}
	}
	if err := centeredText(pdf, "bold", 34, color(input.Template.TitleColor, 17, 24, 39), 145, 48, "SERTIFIKAT"); err != nil {
		return nil, err
	}
	if err := centeredText(pdf, "regular", 14, color(input.Template.ContentColor, 55, 65, 81), 205, 25, "Diberikan kepada"); err != nil {
		return nil, err
	}
	if err := centeredText(pdf, "bold", 27, color(input.Template.PrimaryColor, 15, 118, 110), 237, 42, input.Issue.ParticipantName); err != nil {
		return nil, err
	}
	if err := centeredText(pdf, "regular", 14, color(input.Template.ContentColor, 55, 65, 81), 294, 28, "atas partisipasinya dalam"); err != nil {
		return nil, err
	}
	if err := centeredText(pdf, "bold", 19, color(input.Template.ContentColor, 31, 41, 55), 327, 36, input.Issue.EventTitle); err != nil {
		return nil, err
	}

	details := make([]string, 0, 2)
	if input.Template.ShowEventDate {
		details = append(details, input.Issue.EventDate.Format("2 January 2006"))
	}
	if input.Template.ShowEventLocation && input.Issue.EventLocation != "" {
		details = append(details, input.Issue.EventLocation)
	}
	if len(details) > 0 {
		if err := centeredText(pdf, "regular", 11, color(input.Template.ContentColor, 75, 85, 99), 370, 22, strings.Join(details, " · ")); err != nil {
			return nil, err
		}
	}

	qr, err := qrcode.Encode(input.VerificationURL, qrcode.Medium, 150)
	if err != nil {
		return nil, fmt.Errorf("generate verification QR: %w", err)
	}
	if err := addImage(pdf, qr, 58, 440, 88, 88); err != nil {
		return nil, fmt.Errorf("draw verification QR: %w", err)
	}
	if err := drawFooter(pdf, input); err != nil {
		return nil, err
	}
	if err := g.drawSignatures(ctx, pdf, input.Template.Signatures); err != nil {
		return nil, err
	}
	content, err := pdf.GetBytesPdfReturnErr()
	if err != nil {
		return nil, fmt.Errorf("encode certificate PDF: %w", err)
	}
	return content, nil
}

func (g *GoPDFGenerator) drawSignatures(ctx context.Context, pdf *gopdf.GoPdf, signatures []domain.Signature) error {
	if len(signatures) == 0 {
		return nil
	}
	width := 540.0 / float64(len(signatures))
	for index, signature := range signatures {
		x := 240 + float64(index)*width
		asset, err := g.loadAsset(ctx, signature.SignatureURL)
		if err != nil {
			return fmt.Errorf("load signature %q: %w", signature.Name, err)
		}
		if err := addImage(pdf, asset, x+width/2-45, 425, 90, 50); err != nil {
			return fmt.Errorf("draw signature %q: %w", signature.Name, err)
		}
		if err := textInRect(pdf, "bold", 10, [3]uint8{31, 41, 55}, x, 478, width, 18, signature.Name); err != nil {
			return err
		}
		if err := textInRect(pdf, "regular", 9, [3]uint8{75, 85, 99}, x, 496, width, 16, signature.Title); err != nil {
			return err
		}
	}
	return nil
}

func (g *GoPDFGenerator) loadAsset(ctx context.Context, url string) ([]byte, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, fmt.Errorf("create asset request: %w", err)
	}
	resp, err := g.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("asset server returned %s", resp.Status)
	}
	data, err := io.ReadAll(io.LimitReader(resp.Body, maxAssetBytes+1))
	if err != nil {
		return nil, fmt.Errorf("read asset: %w", err)
	}
	if len(data) > maxAssetBytes {
		return nil, fmt.Errorf("asset exceeds %d bytes", maxAssetBytes)
	}
	return data, nil
}

func drawFooter(pdf *gopdf.GoPdf, input PDFInput) error {
	if err := textInRect(pdf, "bold", 9, [3]uint8{31, 41, 55}, 40, 532, 260, 16, input.CertificateNumber); err != nil {
		return err
	}
	issued := ""
	if input.Template.ShowIssuedDate {
		issued = "Diterbitkan " + input.IssuedAt.Format("2 January 2006")
	}
	return textInRect(pdf, "regular", 8, [3]uint8{75, 85, 99}, 40, 550, 260, 14, issued)
}

func centeredText(pdf *gopdf.GoPdf, font string, size float64, rgb [3]uint8, y, height float64, value string) error {
	return textInRect(pdf, font, size, rgb, 60, y, 722, height, value)
}

func textInRect(pdf *gopdf.GoPdf, font string, size float64, rgb [3]uint8, x, y, width, height float64, value string) error {
	if err := pdf.SetFont(font, "", size); err != nil {
		return fmt.Errorf("set certificate font: %w", err)
	}
	pdf.SetTextColor(rgb[0], rgb[1], rgb[2])
	pdf.SetXY(x, y)
	if err := pdf.CellWithOption(&gopdf.Rect{W: width, H: height}, value, gopdf.CellOption{Align: gopdf.Center | gopdf.Middle}); err != nil {
		return fmt.Errorf("draw certificate text: %w", err)
	}
	return nil
}

func addImage(pdf *gopdf.GoPdf, data []byte, x, y, width, height float64) error {
	holder, err := gopdf.ImageHolderByReader(bytes.NewReader(data))
	if err != nil {
		return err
	}
	return pdf.ImageByHolder(holder, x, y, &gopdf.Rect{W: width, H: height})
}

func color(value string, fallbackR, fallbackG, fallbackB uint8) [3]uint8 {
	value = strings.TrimPrefix(value, "#")
	if len(value) != 6 {
		return [3]uint8{fallbackR, fallbackG, fallbackB}
	}
	parsed, err := strconv.ParseUint(value, 16, 32)
	if err != nil {
		return [3]uint8{fallbackR, fallbackG, fallbackB}
	}
	return [3]uint8{uint8(parsed >> 16), uint8(parsed >> 8), uint8(parsed)}
}

func publicIP(ip net.IP) bool {
	return ip != nil && !ip.IsLoopback() && !ip.IsPrivate() && !ip.IsUnspecified() &&
		!ip.IsLinkLocalUnicast() && !ip.IsLinkLocalMulticast() && !ip.IsMulticast()
}
