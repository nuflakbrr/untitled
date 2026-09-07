package handler

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/payment/dto"
	"venturo-skeleton-go/internal/modules/features/payment/repository"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type Service interface {
	Checkout(ctx context.Context, userID string, req dto.CheckoutRequest) (*dto.PaymentResponse, error)
	HandleWebhook(ctx context.Context, payload dto.WebhookPayload) error
	SubmitProof(ctx context.Context, userID, paymentID string, req dto.SubmitProofRequest) error
	VerifyProof(ctx context.Context, scopeTenantID *string, approverID, paymentID string, req dto.VerifyProofRequest) error
	GetByRegistration(ctx context.Context, callerUserID, callerTenantID string, callerIsSuperAdmin bool, registrationID string) (*dto.PaymentResponse, error)
}

type PaymentHandler struct {
	service Service
}

func NewPaymentHandler(service Service) *PaymentHandler {
	return &PaymentHandler{service: service}
}

func (h *PaymentHandler) Checkout(c *gin.Context) {
	var req dto.CheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	userID, ok := actorUserID(c)
	if !ok {
		return
	}
	payment, err := h.service.Checkout(c.Request.Context(), userID, req)
	if err != nil {
		writePaymentError(c, err, "Failed to open checkout")
		return
	}
	response.Success(c, http.StatusCreated, "Checkout created successfully", payment)
}

// Webhook is intentionally NOT behind JWTAuth — iPaymu calls this
// server-to-server. The service independently re-verifies the transaction
// with iPaymu before trusting anything from this body (see HandleWebhook).
func (h *PaymentHandler) Webhook(c *gin.Context) {
	payload, err := parseWebhookPayload(c)
	if err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid webhook payload", err.Error())
		return
	}
	if err := h.service.HandleWebhook(c.Request.Context(), payload); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to process webhook", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Webhook processed", nil)
}

func parseWebhookPayload(c *gin.Context) (dto.WebhookPayload, error) {
	raw, err := c.GetRawData()
	if err != nil {
		return dto.WebhookPayload{}, err
	}
	values, _ := url.ParseQuery(string(raw))
	payload := dto.WebhookPayload{
		TransactionID: values.Get("trx_id"),
		ReferenceID:   values.Get("reference_id"),
		StatusCode:    values.Get("status_code"),
	}
	if payload.TransactionID == "" {
		var values map[string]any
		if err := json.Unmarshal(raw, &values); err != nil {
			return dto.WebhookPayload{}, err
		}
		payload.TransactionID = webhookValue(values["trx_id"])
		payload.ReferenceID = webhookValue(values["reference_id"])
		payload.StatusCode = webhookValue(values["status_code"])
	}
	if payload.TransactionID == "" {
		return dto.WebhookPayload{}, errors.New("trx_id is required")
	}
	return payload, nil
}

func webhookValue(value any) string {
	if value == nil {
		return ""
	}
	return fmt.Sprint(value)
}

func (h *PaymentHandler) SubmitProof(c *gin.Context) {
	var req dto.SubmitProofRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	userID, ok := actorUserID(c)
	if !ok {
		return
	}
	if err := h.service.SubmitProof(c.Request.Context(), userID, c.Param("id"), req); err != nil {
		writePaymentError(c, err, "Failed to submit payment proof")
		return
	}
	response.Success(c, http.StatusOK, "Payment proof submitted successfully", nil)
}

func (h *PaymentHandler) VerifyProof(c *gin.Context) {
	var req dto.VerifyProofRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return
	}
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	if err := h.service.VerifyProof(c.Request.Context(), scope, claims.UserID, c.Param("id"), req); err != nil {
		writePaymentError(c, err, "Failed to verify payment proof")
		return
	}
	response.Success(c, http.StatusOK, "Payment proof reviewed successfully", nil)
}

func (h *PaymentHandler) GetByRegistration(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil || claims.UserID == "" {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return
	}
	payment, err := h.service.GetByRegistration(c.Request.Context(), claims.UserID, claims.TenantID, claims.IsSuperAdmin, c.Param("registrationID"))
	if err != nil {
		writePaymentError(c, err, "Failed to retrieve payment")
		return
	}
	response.Success(c, http.StatusOK, "Payment retrieved successfully", payment)
}

func actorUserID(c *gin.Context) (string, bool) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil || claims.UserID == "" {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return "", false
	}
	return claims.UserID, true
}

func organizerScope(c *gin.Context) (*string, bool) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return nil, false
	}
	if claims.IsSuperAdmin {
		return nil, true
	}
	if claims.TenantID == "" {
		response.Error(c, http.StatusForbidden, "Tenant context required", "")
		return nil, false
	}
	scope := claims.TenantID
	return &scope, true
}

func writePaymentError(c *gin.Context, err error, fallback string) {
	switch {
	case errors.Is(err, repository.ErrRegistrationNotFound), errors.Is(err, repository.ErrPaymentNotFound), errors.Is(err, repository.ErrGatewayNotConfigured):
		response.Error(c, http.StatusNotFound, "Resource not found", "")
	case errors.Is(err, repository.ErrAlreadyPaid), errors.Is(err, repository.ErrCheckoutInProgress):
		response.Error(c, http.StatusConflict, err.Error(), "")
	case errors.Is(err, repository.ErrNotPayable):
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), "")
	default:
		response.Error(c, http.StatusInternalServerError, fallback, err.Error())
	}
}
