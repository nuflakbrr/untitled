package handler

import (
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/tenant/dto"
	"venturo-skeleton-go/internal/modules/core/tenant/repository"
	"venturo-skeleton-go/internal/modules/core/tenant/service"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type TenantHandler struct {
	service *service.TenantService
}

func NewTenantHandler(service *service.TenantService) *TenantHandler {
	return &TenantHandler{service: service}
}

// GetAll handles GET /core/v1/tenants
func (h *TenantHandler) GetAll(c *gin.Context) {
	var filter dto.TenantQueryFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	claims, _ := middleware.GetUserFromContext(c)
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		filter.ScopeTenantID = &claims.TenantID
	}

	tenants, total, err := h.service.GetAll(c.Request.Context(), filter)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve tenants", err.Error())
		return
	}

	response.SuccessWithPagination(c, http.StatusOK, "Tenants retrieved successfully", tenants, filter.Page, filter.Limit, total)
}

// GetByID handles GET /core/v1/tenants/:id
func (h *TenantHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	tenant, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrTenantNotFound) {
			response.Error(c, http.StatusNotFound, "Tenant not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve tenant", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Tenant retrieved successfully", tenant)
}

// GetBySlug handles GET /core/v1/tenants/by-slug/:slug
func (h *TenantHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	tenant, err := h.service.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, repository.ErrTenantNotFound) {
			response.Error(c, http.StatusNotFound, "Tenant not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve tenant", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Tenant retrieved successfully", tenant)
}

// Create handles POST /core/v1/tenants
func (h *TenantHandler) Create(c *gin.Context) {
	var req dto.CreateTenantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	claims, _ := middleware.GetUserFromContext(c)
	// A non-root tenant admin may only create a direct child of their own
	// tenant, never a ROOT tenant or a tenant parented elsewhere.
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		if req.Type == "ROOT" {
			response.Error(c, http.StatusForbidden, "You cannot create a ROOT tenant", "")
			return
		}
		req.ParentID = &claims.TenantID
	}

	tenant, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrSlugAlreadyExists) || errors.Is(err, service.ErrCodeAlreadyExists) {
			response.Error(c, http.StatusConflict, err.Error(), "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create tenant", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "Tenant created successfully", tenant)
}

// checkTenantBoundary blocks a non-root tenant admin from acting on any
// tenant other than their own or one of its direct children. Writes a 403
// and returns false if blocked.
func (h *TenantHandler) checkTenantBoundary(c *gin.Context, id string) bool {
	claims, _ := middleware.GetUserFromContext(c)
	if claims == nil || claims.IsSuperAdmin || claims.TenantID == "" {
		return true
	}
	if id == claims.TenantID {
		return true
	}
	target, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		return true // let the caller's own not-found handling report it
	}
	if target.ParentID == nil || *target.ParentID != claims.TenantID {
		response.Error(c, http.StatusForbidden, "You do not have access to this tenant", "")
		return false
	}
	return true
}

// Update handles PUT /core/v1/tenants/:id
func (h *TenantHandler) Update(c *gin.Context) {
	id := c.Param("id")
	if !h.checkTenantBoundary(c, id) {
		return
	}
	var req dto.UpdateTenantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	claims, _ := middleware.GetUserFromContext(c)
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		if req.Type != nil && *req.Type == "ROOT" {
			response.Error(c, http.StatusForbidden, "You cannot change a tenant to ROOT", "")
			return
		}
		// A child administrator cannot detach or re-parent its own tenant or
		// any direct child outside the active tenant subtree.
		if id != claims.TenantID {
			parentID := claims.TenantID
			req.ParentID = &parentID
		} else {
			// Keep the tenant's existing parent unchanged.
			req.ParentID = nil
		}
	}

	tenant, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrTenantNotFound) {
			response.Error(c, http.StatusNotFound, "Tenant not found", "")
			return
		}
		if errors.Is(err, service.ErrSlugAlreadyExists) {
			response.Error(c, http.StatusConflict, err.Error(), "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to update tenant", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Tenant updated successfully", tenant)
}

// Delete handles DELETE /core/v1/tenants/:id
func (h *TenantHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	if !h.checkTenantBoundary(c, id) {
		return
	}
	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if errors.Is(err, repository.ErrTenantNotFound) {
			response.Error(c, http.StatusNotFound, "Tenant not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to delete tenant", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Tenant deleted successfully", nil)
}

// GetPaymentGateway handles GET /core/v1/tenants/:id/payment-gateway
func (h *TenantHandler) GetPaymentGateway(c *gin.Context) {
	id := c.Param("id")
	if !h.checkTenantBoundary(c, id) {
		return
	}
	pg, err := h.service.GetPaymentGateway(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrTenantNotFound) {
			response.Error(c, http.StatusNotFound, "Tenant not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve payment gateway settings", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Payment gateway settings retrieved", pg)
}

// UpdatePaymentGateway handles PUT /core/v1/tenants/:id/payment-gateway
func (h *TenantHandler) UpdatePaymentGateway(c *gin.Context) {
	id := c.Param("id")
	if !h.checkTenantBoundary(c, id) {
		return
	}
	var req dto.UpdatePaymentGatewayRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	pg, err := h.service.UpdatePaymentGateway(c.Request.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrTenantNotFound) {
			response.Error(c, http.StatusNotFound, "Tenant not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to update payment gateway settings", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Payment gateway settings updated successfully", pg)
}
