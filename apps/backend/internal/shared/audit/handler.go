package audit

import (
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	svc *Service
}

func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

func (h *Handler) List(c *gin.Context) {
	var params ListQueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	if params.Page == 0 {
		params.Page = 1
	}
	if params.Limit == 0 {
		params.Limit = 50
	}

	claims, err := middleware.GetUserFromContext(c)
	tenantID := params.TenantID
	if err == nil && claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		tenantID = &claims.TenantID
	}

	items, total, err := h.svc.List(c.Request.Context(), ListFilter{
		TenantID: tenantID,
		UserID:   params.UserID,
		Entity:   params.Entity,
		EntityID: params.EntityID,
		Action:   params.Action,
		Page:     params.Page,
		Limit:    params.Limit,
	})
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to list audit logs", err.Error())
		return
	}
	response.SuccessWithPagination(c, http.StatusOK, "Audit logs retrieved successfully",
		items, params.Page, params.Limit, total)
}
