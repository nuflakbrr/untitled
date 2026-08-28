package handler

import (
	"net/http"

	"venturo-skeleton-go/internal/modules/features/event/dto"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service Service
}

func NewCategoryHandler(service Service) *CategoryHandler {
	return &CategoryHandler{service: service}
}

func (h *CategoryHandler) GetAll(c *gin.Context) {
	tenant := c.Query("tenant_id")
	if tenant == "" {
		tenant = c.GetHeader("X-Tenant-ID")
	}
	var tenantID *string
	if tenant != "" {
		tenantID = &tenant
	}
	categories, err := h.service.ListCategories(c.Request.Context(), tenantID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve event categories", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Event categories retrieved successfully", categories)
}

func (h *CategoryHandler) Create(c *gin.Context) {
	var req dto.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	tenantID, _, _, ok := actorScope(c)
	if !ok {
		return
	}
	category, err := h.service.CreateCategory(c.Request.Context(), tenantID, req)
	if err != nil {
		writeEventError(c, err, "Failed to create event category")
		return
	}
	response.Success(c, http.StatusCreated, "Event category created successfully", category)
}

func (h *CategoryHandler) Update(c *gin.Context) {
	var req dto.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	category, err := h.service.UpdateCategory(c.Request.Context(), c.Param("id"), scope, req)
	if err != nil {
		writeEventError(c, err, "Failed to update event category")
		return
	}
	response.Success(c, http.StatusOK, "Event category updated successfully", category)
}

func (h *CategoryHandler) Delete(c *gin.Context) {
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	if err := h.service.DeleteCategory(c.Request.Context(), c.Param("id"), scope); err != nil {
		writeEventError(c, err, "Failed to delete event category")
		return
	}
	response.Success(c, http.StatusOK, "Event category deleted successfully", nil)
}
