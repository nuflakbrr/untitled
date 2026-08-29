package service

import (
	"bytes"
	"context"
	"encoding/base64"
	"io"
	"net"
	"net/http"
	"strings"
	"testing"
	"time"

	"venturo-skeleton-go/internal/modules/features/certificate/domain"
)

type roundTripFunc func(*http.Request) (*http.Response, error)

func (fn roundTripFunc) RoundTrip(request *http.Request) (*http.Response, error) { return fn(request) }

func TestGoPDFGeneratorGenerate(t *testing.T) {
	generator := NewGoPDFGenerator(time.Second)
	content, err := generator.Generate(context.Background(), PDFInput{
		CertificateNumber: "CERT/FT/test/REG-001",
		VerificationURL:   "http://localhost:8000/features/v1/certificates/verify/id",
		IssuedAt:          time.Date(2026, 8, 29, 0, 0, 0, 0, time.UTC),
		Issue: &domain.IssueData{
			ParticipantName: "Naufal Akbar", EventTitle: "Seminar Teknologi",
			EventDate: time.Date(2026, 8, 28, 0, 0, 0, 0, time.UTC), EventLocation: "Malang",
		},
		Template: &domain.Template{
			ShowHeader: true, HeaderText: "SITIVENT", HeaderSubtitle: "Sertifikat Resmi",
			ShowIssuedDate: true, ShowEventDate: true, ShowEventLocation: true,
		},
	})
	if err != nil {
		t.Fatalf("Generate() error = %v", err)
	}
	if len(content) < 1_000 || !strings.HasPrefix(string(content), "%PDF-") {
		t.Fatalf("Generate() returned invalid PDF (%d bytes)", len(content))
	}
}

func TestColor(t *testing.T) {
	if got := color("#0f766e", 0, 0, 0); got != [3]uint8{15, 118, 110} {
		t.Fatalf("color() = %v", got)
	}
	if got := color("invalid", 1, 2, 3); got != [3]uint8{1, 2, 3} {
		t.Fatalf("color() fallback = %v", got)
	}
}

func TestGoPDFGeneratorRejectsMissingInput(t *testing.T) {
	if _, err := NewGoPDFGenerator(time.Second).Generate(context.Background(), PDFInput{}); err == nil {
		t.Fatal("Generate() expected missing input error")
	}
}

func TestPublicIP(t *testing.T) {
	for _, address := range []string{"127.0.0.1", "10.0.0.1", "169.254.169.254", "::1"} {
		if publicIP(net.ParseIP(address)) {
			t.Fatalf("publicIP(%s) = true", address)
		}
	}
	if !publicIP(net.ParseIP("8.8.8.8")) {
		t.Fatal("publicIP() rejected a public address")
	}
}

func TestAssetDialerRejectsInvalidAndPrivateAddresses(t *testing.T) {
	generator := NewGoPDFGenerator(100 * time.Millisecond)
	dial := generator.client.Transport.(*http.Transport).DialContext
	if _, err := dial(context.Background(), "tcp", "invalid-address"); err == nil {
		t.Fatal("DialContext() expected malformed address error")
	}
	if _, err := dial(context.Background(), "tcp", "127.0.0.1:80"); err == nil {
		t.Fatal("DialContext() expected private address error")
	}
}

func TestGoPDFGeneratorWithRemoteAssets(t *testing.T) {
	png, err := base64.StdEncoding.DecodeString("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=")
	if err != nil {
		t.Fatal(err)
	}
	generator := &GoPDFGenerator{client: &http.Client{Transport: roundTripFunc(func(*http.Request) (*http.Response, error) {
		return &http.Response{StatusCode: http.StatusOK, Status: "200 OK", Body: io.NopCloser(bytes.NewReader(png))}, nil
	})}}
	content, err := generator.Generate(context.Background(), PDFInput{
		CertificateNumber: "CERT/FT/E/R", VerificationURL: "https://example.com/verify/id", IssuedAt: time.Now(),
		Issue: &domain.IssueData{ParticipantName: "Participant", EventTitle: "Event"},
		Template: &domain.Template{
			BackgroundURL: "https://example.com/background.png",
			Signatures:    []domain.Signature{{Name: "Dean", Title: "Faculty Dean", SignatureURL: "https://example.com/signature.png"}},
		},
	})
	if err != nil {
		t.Fatalf("Generate() with assets error = %v", err)
	}
	if !strings.HasPrefix(string(content), "%PDF-") {
		t.Fatal("Generate() with assets returned invalid PDF")
	}
}

func TestLoadAssetRejectsBadStatusAndOversize(t *testing.T) {
	generator := &GoPDFGenerator{client: &http.Client{Transport: roundTripFunc(func(*http.Request) (*http.Response, error) {
		return &http.Response{StatusCode: http.StatusNotFound, Status: "404 Not Found", Body: io.NopCloser(strings.NewReader("missing"))}, nil
	})}}
	if _, err := generator.loadAsset(context.Background(), "https://example.com/missing"); err == nil {
		t.Fatal("loadAsset() expected status error")
	}
	generator.client.Transport = roundTripFunc(func(*http.Request) (*http.Response, error) {
		return &http.Response{StatusCode: http.StatusOK, Status: "200 OK", Body: io.NopCloser(io.LimitReader(zeroReader{}, maxAssetBytes+1))}, nil
	})
	if _, err := generator.loadAsset(context.Background(), "https://example.com/large"); err == nil {
		t.Fatal("loadAsset() expected size error")
	}
}

type zeroReader struct{}

func (zeroReader) Read(buffer []byte) (int, error) {
	for index := range buffer {
		buffer[index] = 0
	}
	return len(buffer), nil
}
