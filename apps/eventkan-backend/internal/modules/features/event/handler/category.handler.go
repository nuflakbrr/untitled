package handler

import (
	"context"
	"net/http"

	"eventkan-backend/internal/modules/features/event/dto"
	"eventkan-backend/internal/shared/response"

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
	if c.Request.URL.Query().Get("page") != "" || c.Request.URL.Query().Get("limit") != "" || c.Request.URL.Query().Get("search") != "" || c.Request.URL.Query().Get("include_deleted") != "" {
		var filter dto.CategoryQuery
		if err := c.ShouldBindQuery(&filter); err != nil {
			response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
			return
		}
		if filter.Page == 0 {
			filter.Page = 1
		}
		if filter.Limit == 0 {
			filter.Limit = 10
		}
		if paged, ok := h.service.(PagedCategoryService); ok {
			categories, total, err := paged.ListCategoriesPaged(c.Request.Context(), tenantID, filter)
			if err != nil {
				response.Error(c, http.StatusInternalServerError, "Failed to retrieve event categories", err.Error())
				return
			}
			response.SuccessWithPagination(c, http.StatusOK, "Event categories retrieved successfully", categories, filter.Page, filter.Limit, total)
			return
		}
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

func (h *CategoryHandler) PermanentDelete(c *gin.Context) {
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	service, ok := h.service.(interface {
		PermanentDeleteCategory(context.Context, string, *string) error
	})
	if !ok {
		response.Error(c, http.StatusNotImplemented, "Permanent delete unavailable", "")
		return
	}
	if err := service.PermanentDeleteCategory(c.Request.Context(), c.Param("id"), scope); err != nil {
		writeEventError(c, err, "Failed to permanently delete event category")
		return
	}
	response.Success(c, http.StatusOK, "Event category permanently deleted", nil)
}

func (h *CategoryHandler) Restore(c *gin.Context) {
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	service, ok := h.service.(interface {
		RestoreCategory(context.Context, string, *string) error
	})
	if !ok {
		response.Error(c, http.StatusNotImplemented, "Category restore unavailable", "")
		return
	}
	if err := service.RestoreCategory(c.Request.Context(), c.Param("id"), scope); err != nil {
		writeEventError(c, err, "Failed to restore event category")
		return
	}
	response.Success(c, http.StatusOK, "Event category restored successfully", nil)
}
