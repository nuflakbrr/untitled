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

type CategoryService interface {
	ListCategories(ctx context.Context) ([]dto.CategoryResponse, error)
	CreateCategory(ctx context.Context, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error)
	UpdateCategory(ctx context.Context, id string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error)
	DeleteCategory(ctx context.Context, id string) error
}

type CategoryHandler struct {
	service CategoryService
}

func NewCategoryHandler(service CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

func (h *CategoryHandler) List(c *gin.Context) {
	categories, err := h.service.ListCategories(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve article categories", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Article categories retrieved successfully", categories)
}

func (h *CategoryHandler) Create(c *gin.Context) {
	var req dto.CreateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	category, err := h.service.CreateCategory(c.Request.Context(), req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to create article category", err.Error())
		return
	}
	response.Success(c, http.StatusCreated, "Article category created successfully", category)
}

func (h *CategoryHandler) Update(c *gin.Context) {
	var req dto.UpdateCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	category, err := h.service.UpdateCategory(c.Request.Context(), c.Param("id"), req)
	if err != nil {
		writeCategoryError(c, err, "Failed to update article category")
		return
	}
	response.Success(c, http.StatusOK, "Article category updated successfully", category)
}

func (h *CategoryHandler) Delete(c *gin.Context) {
	if err := h.service.DeleteCategory(c.Request.Context(), c.Param("id")); err != nil {
		writeCategoryError(c, err, "Failed to delete article category")
		return
	}
	response.Success(c, http.StatusOK, "Article category deleted successfully", nil)
}

func writeCategoryError(c *gin.Context, err error, fallback string) {
	if errors.Is(err, repository.ErrCategoryNotFound) {
		response.Error(c, http.StatusNotFound, "Article category not found", "")
		return
	}
	response.Error(c, http.StatusInternalServerError, fallback, err.Error())
}
