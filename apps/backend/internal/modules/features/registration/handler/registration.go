package handler

import (
	"context"
	"errors"
	"fmt"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/registration/dto"
	"venturo-skeleton-go/internal/modules/features/registration/repository"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type Service interface {
	Register(ctx context.Context, userID string, req dto.CreateRegistrationRequest) (*dto.RegistrationResponse, error)
	ListMine(ctx context.Context, userID string, query dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error)
	ListByEvent(ctx context.Context, eventID string, scopeTenantID *string, query dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error)
	CancelMine(ctx context.Context, id, userID string) error
	ExportByEvent(ctx context.Context, eventID string, scopeTenantID *string) ([]byte, error)
}

type RegistrationHandler struct {
	service Service
}

func NewRegistrationHandler(service Service) *RegistrationHandler {
	return &RegistrationHandler{service: service}
}

func (h *RegistrationHandler) Register(c *gin.Context) {
	var req dto.CreateRegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	userID, ok := actorUserID(c)
	if !ok {
		return
	}
	registration, err := h.service.Register(c.Request.Context(), userID, req)
	if err != nil {
		writeRegistrationError(c, err, "Failed to register for event")
		return
	}
	response.Success(c, http.StatusCreated, "Event registration created successfully", registration)
}

func (h *RegistrationHandler) ListMine(c *gin.Context) {
	var query dto.RegistrationQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	userID, ok := actorUserID(c)
	if !ok {
		return
	}
	registrations, total, err := h.service.ListMine(c.Request.Context(), userID, query)
	if err != nil {
		writeRegistrationError(c, err, "Failed to retrieve registrations")
		return
	}
	response.SuccessWithPagination(c, http.StatusOK, "Registrations retrieved successfully", registrations, query.Page, query.Limit, total)
}

func (h *RegistrationHandler) CancelMine(c *gin.Context) {
	userID, ok := actorUserID(c)
	if !ok {
		return
	}
	if err := h.service.CancelMine(c.Request.Context(), c.Param("id"), userID); err != nil {
		writeRegistrationError(c, err, "Failed to cancel registration")
		return
	}
	response.Success(c, http.StatusOK, "Registration cancelled successfully", nil)
}

func (h *RegistrationHandler) ListByEvent(c *gin.Context) {
	var query dto.RegistrationQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	registrations, total, err := h.service.ListByEvent(c.Request.Context(), c.Param("eventID"), scope, query)
	if err != nil {
		writeRegistrationError(c, err, "Failed to retrieve event registrations")
		return
	}
	response.SuccessWithPagination(c, http.StatusOK, "Event registrations retrieved successfully", registrations, query.Page, query.Limit, total)
}

func (h *RegistrationHandler) ExportByEvent(c *gin.Context) {
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	eventID := c.Param("eventID")
	content, err := h.service.ExportByEvent(c.Request.Context(), eventID, scope)
	if err != nil {
		writeRegistrationError(c, err, "Failed to export event registrations")
		return
	}
	c.Header("Content-Disposition", fmt.Sprintf(`attachment; filename="registrations-%s.xlsx"`, eventID))
	c.Data(http.StatusOK, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", content)
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

func writeRegistrationError(c *gin.Context, err error, fallback string) {
	switch {
	case errors.Is(err, repository.ErrRegistrationNotFound), errors.Is(err, repository.ErrEventNotAvailable):
		response.Error(c, http.StatusNotFound, "Resource not found", "")
	case errors.Is(err, repository.ErrDuplicateRegistration), errors.Is(err, repository.ErrQuotaFull), errors.Is(err, repository.ErrPaymentInProgress):
		response.Error(c, http.StatusConflict, err.Error(), "")
	case errors.Is(err, repository.ErrRegistrationClosed), errors.Is(err, repository.ErrOnlineUnavailable):
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), "")
	default:
		response.Error(c, http.StatusInternalServerError, fallback, err.Error())
	}
}
