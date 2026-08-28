package handler

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/payment/dto"
	"venturo-skeleton-go/internal/modules/features/payment/repository"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type mockService struct {
	checkoutFn          func(context.Context, string, dto.CheckoutRequest) (*dto.PaymentResponse, error)
	handleWebhookFn     func(context.Context, dto.WebhookPayload) error
	submitProofFn       func(context.Context, string, string, dto.SubmitProofRequest) error
	verifyProofFn       func(context.Context, *string, string, string, dto.VerifyProofRequest) error
	getByRegistrationFn func(context.Context, string, string, bool, string) (*dto.PaymentResponse, error)
}

func (m *mockService) Checkout(ctx context.Context, userID string, req dto.CheckoutRequest) (*dto.PaymentResponse, error) {
	return m.checkoutFn(ctx, userID, req)
}
func (m *mockService) HandleWebhook(ctx context.Context, payload dto.WebhookPayload) error {
	return m.handleWebhookFn(ctx, payload)
}
func (m *mockService) SubmitProof(ctx context.Context, userID, paymentID string, req dto.SubmitProofRequest) error {
	return m.submitProofFn(ctx, userID, paymentID, req)
}
func (m *mockService) VerifyProof(ctx context.Context, scope *string, approverID, paymentID string, req dto.VerifyProofRequest) error {
	return m.verifyProofFn(ctx, scope, approverID, paymentID, req)
}
func (m *mockService) GetByRegistration(ctx context.Context, callerUserID, callerTenantID string, callerIsSuperAdmin bool, registrationID string) (*dto.PaymentResponse, error) {
	return m.getByRegistrationFn(ctx, callerUserID, callerTenantID, callerIsSuperAdmin, registrationID)
}

func authAs(userID, tenantID string, superadmin bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: userID, TenantID: tenantID, IsSuperAdmin: superadmin})
		c.Next()
	}
}

func TestPaymentHandlerHappyPaths(t *testing.T) {
	gin.SetMode(gin.TestMode)
	calls := map[string]bool{}
	fake := &mockService{
		checkoutFn: func(_ context.Context, userID string, req dto.CheckoutRequest) (*dto.PaymentResponse, error) {
			calls["checkout"] = userID == "user-1" && req.RegistrationID == "2093030b-adb4-4803-9af2-13a6c1ad8b1a"
			return &dto.PaymentResponse{ID: "pay-1"}, nil
		},
		handleWebhookFn: func(_ context.Context, payload dto.WebhookPayload) error {
			calls["webhook"] = payload.TransactionID == "trx-1"
			return nil
		},
		submitProofFn: func(_ context.Context, userID, paymentID string, req dto.SubmitProofRequest) error {
			calls["proof"] = userID == "user-1" && paymentID == "pay-1" && req.ProofURL == "https://cdn.local/proof.png"
			return nil
		},
		verifyProofFn: func(_ context.Context, scope *string, approverID, paymentID string, req dto.VerifyProofRequest) error {
			calls["verify"] = approverID == "panitia-1" && paymentID == "pay-1" && req.Approve && scope != nil && *scope == "tenant-a"
			return nil
		},
		getByRegistrationFn: func(_ context.Context, callerUserID, callerTenantID string, callerIsSuperAdmin bool, registrationID string) (*dto.PaymentResponse, error) {
			calls["get"] = registrationID == "reg-1" && callerUserID == "user-1"
			return &dto.PaymentResponse{ID: "pay-1"}, nil
		},
	}
	handler := NewPaymentHandler(fake)
	router := gin.New()
	router.POST("/payments/webhook/ipaymu", handler.Webhook)
	router.POST("/payments/checkout", authAs("user-1", "tenant-a", false), handler.Checkout)
	router.POST("/payments/:id/proof", authAs("user-1", "tenant-a", false), handler.SubmitProof)
	router.POST("/payments/:id/verify", authAs("panitia-1", "tenant-a", false), handler.VerifyProof)
	router.GET("/payments/registration/:registrationID", authAs("user-1", "tenant-a", false), handler.GetByRegistration)

	for _, tt := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPost, "/payments/checkout", `{"registration_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`, http.StatusCreated},
		{http.MethodPost, "/payments/webhook/ipaymu", `trx_id=trx-1`, http.StatusOK},
		{http.MethodPost, "/payments/pay-1/proof", `{"proof_url":"https://cdn.local/proof.png"}`, http.StatusOK},
		{http.MethodPost, "/payments/pay-1/verify", `{"approve":true}`, http.StatusOK},
		{http.MethodGet, "/payments/registration/reg-1", "", http.StatusOK},
	} {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		if tt.method == http.MethodPost && tt.path == "/payments/webhook/ipaymu" {
			req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		} else {
			req.Header.Set("Content-Type", "application/json")
		}
		router.ServeHTTP(recorder, req)
		if recorder.Code != tt.want {
			t.Errorf("%s %s status = %d, body = %s", tt.method, tt.path, recorder.Code, recorder.Body.String())
		}
	}
	for _, name := range []string{"checkout", "webhook", "proof", "verify", "get"} {
		if !calls[name] {
			t.Errorf("%s did not receive expected input", name)
		}
	}
}

func TestPaymentHandlerValidationAndAuthentication(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewPaymentHandler(&mockService{})
	router := gin.New()
	router.POST("/payments/checkout", handler.Checkout)
	router.POST("/payments/:id/proof", handler.SubmitProof)
	router.POST("/payments/:id/verify", handler.VerifyProof)
	router.GET("/payments/registration/:registrationID", handler.GetByRegistration)

	for _, tt := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPost, "/payments/checkout", `{}`, http.StatusBadRequest},
		{http.MethodPost, "/payments/checkout", `{"registration_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`, http.StatusUnauthorized},
		{http.MethodPost, "/payments/pay-1/proof", `{}`, http.StatusBadRequest},
		{http.MethodPost, "/payments/pay-1/proof", `{"proof_url":"https://cdn.local/x.png"}`, http.StatusUnauthorized},
		{http.MethodPost, "/payments/pay-1/verify", `{}`, http.StatusUnauthorized},
		{http.MethodGet, "/payments/registration/reg-1", "", http.StatusUnauthorized},
	} {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, req)
		if recorder.Code != tt.want {
			t.Errorf("%s %s status = %d, want %d, body = %s", tt.method, tt.path, recorder.Code, tt.want, recorder.Body.String())
		}
	}
}

func TestPaymentErrorMappings(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tests := []struct {
		name string
		err  error
		want int
	}{
		{"not found", repository.ErrRegistrationNotFound, http.StatusNotFound},
		{"payment not found", repository.ErrPaymentNotFound, http.StatusNotFound},
		{"gateway not configured", repository.ErrGatewayNotConfigured, http.StatusNotFound},
		{"already paid", repository.ErrAlreadyPaid, http.StatusConflict},
		{"not payable", repository.ErrNotPayable, http.StatusUnprocessableEntity},
		{"unknown", context.DeadlineExceeded, http.StatusInternalServerError},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			fake := &mockService{checkoutFn: func(context.Context, string, dto.CheckoutRequest) (*dto.PaymentResponse, error) {
				return nil, tt.err
			}}
			handler := NewPaymentHandler(fake)
			router := gin.New()
			router.POST("/payments/checkout", authAs("user-1", "tenant-a", false), handler.Checkout)
			recorder := httptest.NewRecorder()
			req := httptest.NewRequest(http.MethodPost, "/payments/checkout", strings.NewReader(`{"registration_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`))
			req.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(recorder, req)
			if recorder.Code != tt.want {
				t.Errorf("status = %d, want %d, body = %s", recorder.Code, tt.want, recorder.Body.String())
			}
		})
	}
}

func TestOrganizerScope(t *testing.T) {
	gin.SetMode(gin.TestMode)
	t.Run("participant forbidden", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(recorder)
		middleware.SetUserContext(ctx, &jwtpkg.Claims{UserID: "participant"})
		if scope, ok := organizerScope(ctx); ok || scope != nil || recorder.Code != http.StatusForbidden {
			t.Fatalf("scope = %v, ok = %v, status = %d", scope, ok, recorder.Code)
		}
	})
	t.Run("root unscoped", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(recorder)
		middleware.SetUserContext(ctx, &jwtpkg.Claims{UserID: "root", IsSuperAdmin: true})
		if scope, ok := organizerScope(ctx); !ok || scope != nil {
			t.Fatalf("scope = %v, ok = %v", scope, ok)
		}
	})
}
