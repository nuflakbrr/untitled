// Package ipaymu is a minimal client for the iPaymu Payment v2 API.
//
// Signature algorithm and the /api/v2/payment (Redirect Payment) request
// shape are verified against iPaymu's official sample:
// https://github.com/ipaymu/ipaymu-payment-v2-sample-go
//
// The /api/v2/transaction (Check Transaction) endpoint is used to
// independently re-verify a webhook notification before payment state changes.
package ipaymu

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	SandboxBaseURL    = "https://sandbox.ipaymu.com/api/v2"
	ProductionBaseURL = "https://my.ipaymu.com/api/v2"
)

type Client struct {
	baseURL    string
	va         string
	apiKey     string
	httpClient *http.Client
}

// NewClient builds an iPaymu client scoped to a single tenant's credentials.
// env must be "production" to use the live endpoint; anything else (including
// empty) resolves to the sandbox, matching tenant_payment_gateways.env default.
func NewClient(env, va, apiKey string, timeout time.Duration) *Client {
	baseURL := SandboxBaseURL
	if env == "production" {
		baseURL = ProductionBaseURL
	}
	if timeout <= 0 {
		timeout = 30 * time.Second
	}
	return &Client{
		baseURL:    baseURL,
		va:         va,
		apiKey:     apiKey,
		httpClient: &http.Client{Timeout: timeout},
	}
}

type CreatePaymentRequest struct {
	Product     []string `json:"product"`
	Qty         []int    `json:"qty"`
	Price       []int64  `json:"price"`
	ReturnURL   string   `json:"returnUrl"`
	CancelURL   string   `json:"cancelUrl"`
	NotifyURL   string   `json:"notifyUrl"`
	ReferenceID string   `json:"referenceId"`
	BuyerName   string   `json:"buyerName,omitempty"`
	BuyerEmail  string   `json:"buyerEmail,omitempty"`
	BuyerPhone  string   `json:"buyerPhone,omitempty"`
}

type CreatePaymentData struct {
	SessionID     string `json:"SessionId"`
	TransactionID string `json:"TransactionId"`
	URL           string `json:"Url"`
}

type envelope struct {
	Status  int             `json:"Status"`
	Success bool            `json:"Success"`
	Message string          `json:"Message"`
	Data    json.RawMessage `json:"Data"`
}

// CreatePayment opens a hosted checkout session (Redirect Payment) covering
// QRIS, Virtual Account, and e-wallet methods on iPaymu's own page, and
// returns the URL the participant should be redirected to.
func (c *Client) CreatePayment(ctx context.Context, req CreatePaymentRequest) (*CreatePaymentData, error) {
	body, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("marshal create payment request: %w", err)
	}
	var data CreatePaymentData
	if err := c.doSigned(ctx, http.MethodPost, "/payment", body, &data); err != nil {
		return nil, err
	}
	return &data, nil
}

type TransactionStatus struct {
	TransactionID         int64  `json:"TransactionId"`
	ReferenceID           string `json:"ReferenceId"`
	Status                int    `json:"Status"`
	TransactionStatusCode any    `json:"transaction_status_code"`
	StatusDesc            string `json:"StatusDesc"`
	Via                   string `json:"Via"`
	Channel               string `json:"Channel"`
	Amount                int64  `json:"Amount"`
}

func (s TransactionStatus) EffectiveStatus() int {
	switch value := s.TransactionStatusCode.(type) {
	case float64:
		return int(value)
	case string:
		if parsed, err := strconv.Atoi(value); err == nil {
			return parsed
		}
	}
	return s.Status
}

// CheckTransaction re-queries iPaymu directly for the authoritative status of
// a transaction, keyed by the numeric trx_id sent in iPaymu's callback.
func (c *Client) CheckTransaction(ctx context.Context, transactionID string) (*TransactionStatus, error) {
	numericID, err := strconv.ParseInt(transactionID, 10, 64)
	if err != nil {
		return nil, fmt.Errorf("invalid ipaymu transaction id %q: %w", transactionID, err)
	}
	body, err := json.Marshal(map[string]int64{"transactionId": numericID})
	if err != nil {
		return nil, fmt.Errorf("marshal check transaction request: %w", err)
	}
	var status TransactionStatus
	if err := c.doSigned(ctx, http.MethodPost, "/transaction", body, &status); err != nil {
		return nil, err
	}
	return &status, nil
}

func (c *Client) doSigned(ctx context.Context, method, path string, body []byte, out any) error {
	req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("build ipaymu request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("va", c.va)
	req.Header.Set("signature", Sign(method, c.va, c.apiKey, body))

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("call ipaymu %s: %w", path, err)
	}
	defer func() { _ = resp.Body.Close() }()

	raw, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("read ipaymu response: %w", err)
	}

	var env envelope
	if err := json.Unmarshal(raw, &env); err != nil {
		return fmt.Errorf("decode ipaymu envelope (status %d): %w", resp.StatusCode, err)
	}
	if !env.Success {
		return fmt.Errorf("ipaymu error (status %d): %s", env.Status, env.Message)
	}
	if out != nil && len(env.Data) > 0 {
		if err := json.Unmarshal(env.Data, out); err != nil {
			return fmt.Errorf("decode ipaymu data: %w", err)
		}
	}
	return nil
}

// Sign implements iPaymu's v2 request signature:
// HMAC-SHA256(key=apiKey, message="METHOD:va:lowercase(hex(sha256(body))):apiKey"),
// hex-encoded. Exported standalone so it can be unit-tested against iPaymu's
// published sample without spinning up an HTTP server.
func Sign(method, va, apiKey string, body []byte) string {
	bodyHash := sha256.Sum256(body)
	bodyHashHex := strings.ToLower(hex.EncodeToString(bodyHash[:]))
	stringToSign := fmt.Sprintf("%s:%s:%s:%s", method, va, bodyHashHex, apiKey)

	mac := hmac.New(sha256.New, []byte(apiKey))
	mac.Write([]byte(stringToSign))
	return hex.EncodeToString(mac.Sum(nil))
}
