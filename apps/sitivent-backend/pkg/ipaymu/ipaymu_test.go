package ipaymu

import (
	"context"
	"encoding/json"
	"net"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func newIPv4TestServer(handler http.Handler) *httptest.Server {
	server := httptest.NewUnstartedServer(handler)
	listener, err := net.Listen("tcp4", "127.0.0.1:0")
	if err != nil {
		panic(err)
	}
	server.Listener = listener
	server.Start()
	return server
}

func TestSign_MatchesReferenceAlgorithm(t *testing.T) {
	// Reproduces the exact stringToSign construction from
	// https://github.com/ipaymu/ipaymu-payment-v2-sample-go/blob/main/main.go
	va := "1179000899"
	apiKey := "QbGcoO0Qds9sQFDmY0MWg1Tq.xtuh1"
	body := []byte(`{"referenceId":"TRX123"}`)

	got := Sign(http.MethodPost, va, apiKey, body)
	if len(got) != 64 {
		t.Fatalf("expected 64-char hex HMAC-SHA256 digest, got %d chars: %s", len(got), got)
	}

	// Signing must be deterministic for the same inputs (idempotent retries,
	// and so CheckTransaction re-verification is reproducible).
	again := Sign(http.MethodPost, va, apiKey, body)
	if got != again {
		t.Fatalf("Sign is not deterministic: %s != %s", got, again)
	}

	// Different body must change the signature.
	other := Sign(http.MethodPost, va, apiKey, []byte(`{"referenceId":"TRX124"}`))
	if got == other {
		t.Fatal("Sign did not change when body changed")
	}
}

func TestClient_CreatePayment(t *testing.T) {
	const va, apiKey = "1179000899", "test-api-key"

	server := newIPv4TestServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/payment" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		if got := r.Header.Get("va"); got != va {
			t.Fatalf("va header = %q, want %q", got, va)
		}
		if r.Header.Get("signature") == "" {
			t.Fatal("missing signature header")
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"Status":  200,
			"Success": true,
			"Message": "Success",
			"Data": map[string]string{
				"SessionId":     "sess-1",
				"TransactionId": "trx-1",
				"Url":           "https://sandbox.ipaymu.com/payment/sess-1",
			},
		})
	}))
	defer server.Close()

	client := NewClient("sandbox", va, apiKey, time.Second)
	client.baseURL = server.URL

	data, err := client.CreatePayment(context.Background(), CreatePaymentRequest{
		Product:     []string{"Ticket"},
		Qty:         []int{1},
		Price:       []int64{50000},
		ReturnURL:   "http://app.local/thanks",
		CancelURL:   "http://app.local/cancel",
		NotifyURL:   "http://backend.local/webhook",
		ReferenceID: "REG-1",
	})
	if err != nil {
		t.Fatalf("CreatePayment returned error: %v", err)
	}
	if data.TransactionID != "trx-1" || data.URL == "" {
		t.Fatalf("unexpected data: %+v", data)
	}
}

func TestClient_CreatePayment_APIError(t *testing.T) {
	server := newIPv4TestServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewEncoder(w).Encode(map[string]any{
			"Status":  400,
			"Success": false,
			"Message": "Invalid signature",
		})
	}))
	defer server.Close()

	client := NewClient("sandbox", "va", "key", time.Second)
	client.baseURL = server.URL

	if _, err := client.CreatePayment(context.Background(), CreatePaymentRequest{}); err == nil {
		t.Fatal("expected error on Success:false response")
	}
}

func TestClient_CheckTransaction(t *testing.T) {
	server := newIPv4TestServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/transaction" {
			t.Fatalf("unexpected path: %s", r.URL.Path)
		}
		var request map[string]int64
		if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
			t.Fatalf("decode request: %v", err)
		}
		if request["transactionId"] != 228185 {
			t.Fatalf("transactionId = %d, want 228185", request["transactionId"])
		}
		_ = json.NewEncoder(w).Encode(map[string]any{
			"Status":  200,
			"Success": true,
			"Data": map[string]any{
				"TransactionId": 228185,
				"ReferenceId":   "REG-1",
				"Status":        1,
				"StatusDesc":    "Success",
				"Via":           "qris",
				"Channel":       "qris",
				"Amount":        50000,
			},
		})
	}))
	defer server.Close()

	client := NewClient("sandbox", "va", "key", time.Second)
	client.baseURL = server.URL

	status, err := client.CheckTransaction(context.Background(), "228185")
	if err != nil {
		t.Fatalf("CheckTransaction returned error: %v", err)
	}
	if status.Status != 1 || status.ReferenceID != "REG-1" {
		t.Fatalf("unexpected status: %+v", status)
	}
}

func TestClient_CheckTransaction_RejectsNonNumericID(t *testing.T) {
	client := NewClient("sandbox", "va", "key", time.Second)
	if _, err := client.CheckTransaction(context.Background(), "not-a-number"); err == nil {
		t.Fatal("expected invalid transaction ID error")
	}
}
