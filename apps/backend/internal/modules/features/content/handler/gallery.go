package handler

import (
	"context"
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/modules/features/content/dto"
	"venturo-skeleton-go/internal/modules/features/content/repository"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type GalleryService interface {
	ListGalleries(ctx context.Context, query dto.GalleryQuery) ([]dto.GalleryResponse, int64, error)
	CreateGallery(ctx context.Context, tenantID string, req dto.CreateGalleryRequest) (*dto.GalleryResponse, error)
	UpdateGallery(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateGalleryRequest) (*dto.GalleryResponse, error)
	DeleteGallery(ctx context.Context, id string, scopeTenantID *string) error
}

type GalleryHandler struct {
	service GalleryService
}

func NewGalleryHandler(service GalleryService) *GalleryHandler {
	return &GalleryHandler{service: service}
}

func (h *GalleryHandler) List(c *gin.Context) {
	var query dto.GalleryQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	galleries, total, err := h.service.ListGalleries(c.Request.Context(), query)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve galleries", err.Error())
		return
	}
	page, limit := query.Page, query.Limit
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}
	response.SuccessWithPagination(c, http.StatusOK, "Galleries retrieved successfully", galleries, page, limit, total)
}

func (h *GalleryHandler) Create(c *gin.Context) {
	var req dto.CreateGalleryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	claims, ok := actorClaims(c)
	if !ok {
		return
	}
	gallery, err := h.service.CreateGallery(c.Request.Context(), claims.TenantID, req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to create gallery", err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Gallery created successfully", gallery)
}

func (h *GalleryHandler) Update(c *gin.Context) {
	var req dto.UpdateGalleryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	gallery, err := h.service.UpdateGallery(c.Request.Context(), c.Param("id"), scope, req)
	if err != nil {
		writeGalleryError(c, err, "Failed to update gallery")
		return
	}
	response.Success(c, http.StatusOK, "Gallery updated successfully", gallery)
}

func (h *GalleryHandler) Delete(c *gin.Context) {
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	if err := h.service.DeleteGallery(c.Request.Context(), c.Param("id"), scope); err != nil {
		writeGalleryError(c, err, "Failed to delete gallery")
		return
	}
	response.Success(c, http.StatusOK, "Gallery deleted successfully", nil)
}

func writeGalleryError(c *gin.Context, err error, fallback string) {
	if errors.Is(err, repository.ErrGalleryNotFound) {
		response.Error(c, http.StatusNotFound, "Gallery not found", "")
		return
	}
	response.Error(c, http.StatusInternalServerError, fallback, err.Error())
}
