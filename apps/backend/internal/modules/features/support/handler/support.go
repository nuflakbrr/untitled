package handler

import (
	"context"
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/support/dto"
	"venturo-skeleton-go/internal/modules/features/support/repository"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type Service interface {
	Create(ctx context.Context, req dto.CreateSupportMessageRequest) (*dto.SupportMessageResponse, error)
	List(ctx context.Context, scopeTenantID *string, query dto.SupportMessageQuery) ([]dto.SupportMessageResponse, int64, error)
	UpdateStatus(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateStatusRequest) error
}

type SupportHandler struct {
	service Service
}

func NewSupportHandler(service Service) *SupportHandler {
	return &SupportHandler{service: service}
}

// Create is intentionally public — a participant with a registration
// problem may not be able to sign in, so this doubles as a "contact us"
// form (see service.Create for why it never accepts a client-supplied user_id).
func (h *SupportHandler) Create(c *gin.Context) {
	var req dto.CreateSupportMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	message, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to submit support message", err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Support message submitted successfully", message)
}

func (h *SupportHandler) List(c *gin.Context) {
	var query dto.SupportMessageQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	messages, total, err := h.service.List(c.Request.Context(), scope, query)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve support messages", err.Error())
		return
	}
	page, limit := query.Page, query.Limit
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}
	response.SuccessWithPagination(c, http.StatusOK, "Support messages retrieved successfully", messages, page, limit, total)
}

func (h *SupportHandler) UpdateStatus(c *gin.Context) {
	var req dto.UpdateStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	if err := h.service.UpdateStatus(c.Request.Context(), c.Param("id"), scope, req); err != nil {
		if errors.Is(err, repository.ErrMessageNotFound) {
			response.Error(c, http.StatusNotFound, "Support message not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to update support message status", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Support message status updated successfully", nil)
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
