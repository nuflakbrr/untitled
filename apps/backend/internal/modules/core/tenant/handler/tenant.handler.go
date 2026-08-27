package handler

import (
	"errors"
	"net/http"

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

// Update handles PUT /core/v1/tenants/:id
func (h *TenantHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req dto.UpdateTenantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
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

