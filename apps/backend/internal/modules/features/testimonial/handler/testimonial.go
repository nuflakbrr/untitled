package handler

import (
	"errors"
	"github.com/gin-gonic/gin"
	"net/http"
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/testimonial/dto"
	"venturo-skeleton-go/internal/modules/features/testimonial/repository"
	"venturo-skeleton-go/internal/shared/response"
)

type Handler struct{ repo *repository.Repository }

func New(repo *repository.Repository) *Handler { return &Handler{repo: repo} }

func (h *Handler) Create(c *gin.Context) {
	claims, _ := middleware.GetUserFromContext(c)
	var req dto.CreateTestimonialRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	result, err := h.repo.Create(c, claims.UserID, c.Param("id"), req)
	if errors.Is(err, repository.ErrNotEligible) {
		response.Error(c, http.StatusForbidden, "Review hanya tersedia setelah kamu hadir di event yang selesai", "")
		return
	}
	if err != nil {
		response.Error(c, http.StatusConflict, "Review sudah pernah dibuat atau gagal disimpan", "")
		return
	}
	response.Success(c, http.StatusCreated, "Review berhasil disimpan", result)
}

func (h *Handler) ListMine(c *gin.Context) {
	claims, _ := middleware.GetUserFromContext(c)
	results, err := h.repo.ListMine(c, claims.UserID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve reviews", "")
		return
	}
	response.Success(c, http.StatusOK, "Reviews retrieved successfully", results)
}
