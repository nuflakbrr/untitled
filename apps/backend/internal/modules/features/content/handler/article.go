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

type ArticleService interface {
	ListArticles(ctx context.Context, scopeTenantID *string, query dto.ArticleQuery) ([]dto.ArticleResponse, int64, error)
	GetArticleBySlug(ctx context.Context, slug string) (*dto.ArticleResponse, error)
	CreateArticle(ctx context.Context, tenantID, creatorID string, req dto.CreateArticleRequest) (*dto.ArticleResponse, error)
	UpdateArticle(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateArticleRequest) (*dto.ArticleResponse, error)
	DeleteArticle(ctx context.Context, id string, scopeTenantID *string) error
}

type ArticleHandler struct {
	service ArticleService
}

func NewArticleHandler(service ArticleService) *ArticleHandler {
	return &ArticleHandler{service: service}
}

func (h *ArticleHandler) List(c *gin.Context) {
	var query dto.ArticleQuery
	if err := c.ShouldBindQuery(&query); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	articles, total, err := h.service.ListArticles(c.Request.Context(), nil, query)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve articles", err.Error())
		return
	}
	response.SuccessWithPagination(c, http.StatusOK, "Articles retrieved successfully", articles, query.Page, query.Limit, total)
}

func (h *ArticleHandler) GetBySlug(c *gin.Context) {
	article, err := h.service.GetArticleBySlug(c.Request.Context(), c.Param("slug"))
	if err != nil {
		writeArticleError(c, err, "Failed to retrieve article")
		return
	}
	response.Success(c, http.StatusOK, "Article retrieved successfully", article)
}

func (h *ArticleHandler) Create(c *gin.Context) {
	var req dto.CreateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	claims, ok := actorClaims(c)
	if !ok {
		return
	}
	article, err := h.service.CreateArticle(c.Request.Context(), claims.TenantID, claims.UserID, req)
	if err != nil {
		writeArticleError(c, err, "Failed to create article")
		return
	}
	response.Success(c, http.StatusCreated, "Article created successfully", article)
}

func (h *ArticleHandler) Update(c *gin.Context) {
	var req dto.UpdateArticleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	article, err := h.service.UpdateArticle(c.Request.Context(), c.Param("id"), scope, req)
	if err != nil {
		writeArticleError(c, err, "Failed to update article")
		return
	}
	response.Success(c, http.StatusOK, "Article updated successfully", article)
}

func (h *ArticleHandler) Delete(c *gin.Context) {
	scope, ok := organizerScope(c)
	if !ok {
		return
	}
	if err := h.service.DeleteArticle(c.Request.Context(), c.Param("id"), scope); err != nil {
		writeArticleError(c, err, "Failed to delete article")
		return
	}
	response.Success(c, http.StatusOK, "Article deleted successfully", nil)
}

func writeArticleError(c *gin.Context, err error, fallback string) {
	if errors.Is(err, repository.ErrArticleNotFound) {
		response.Error(c, http.StatusNotFound, "Article not found", "")
		return
	}
	response.Error(c, http.StatusInternalServerError, fallback, err.Error())
}
