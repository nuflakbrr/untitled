package email

import (
	"net/http"
	"strings"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/shared/response"
	emailpkg "venturo-skeleton-go/pkg/email"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Handler struct {
	db      *pgxpool.Pool
	service emailpkg.EmailService
}

func NewHandler(db *pgxpool.Pool, service emailpkg.EmailService) *Handler {
	return &Handler{db: db, service: service}
}

type newsletterRequest struct {
	Email string `json:"email" binding:"required,email"`
}

func (h *Handler) SubscribeNewsletter(c *gin.Context) {
	var req newsletterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Email tidak valid", err.Error())
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))
	_, err := h.db.Exec(c.Request.Context(), `INSERT INTO newsletter_subscribers (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET updated_at = NOW()`, email)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Gagal mendaftarkan newsletter", err.Error())
		return
	}
	if err := h.service.SendNewsletterConfirmation(email); err != nil {
		response.Error(c, http.StatusBadGateway, "Gagal mengirim email konfirmasi", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Berhasil berlangganan newsletter", nil)
}

func (h *Handler) PasswordChanged(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
		return
	}
	if err := h.service.SendPasswordChangedEmail(claims.Email, claims.Name); err != nil {
		response.Error(c, http.StatusBadGateway, "Gagal mengirim notifikasi email", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Notifikasi email terkirim", nil)
}
