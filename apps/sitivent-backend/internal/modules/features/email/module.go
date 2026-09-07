package email

import (
	"venturo-skeleton-go/internal/config"
	"venturo-skeleton-go/internal/middleware"
	emailpkg "venturo-skeleton-go/pkg/email"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Initialize(db *pgxpool.Pool, cfg *config.Config) *Handler {
	service, err := emailpkg.NewSMTPEmailService()
	if err != nil {
		if cfg.Server.Env == "production" {
			panic(err)
		}
		service = nil
	}
	if service == nil {
		return NewHandler(db, &emailpkg.NoOpEmailService{})
	}
	return NewHandler(db, service)
}

func (h *Handler) SetupRoutes(router *gin.RouterGroup) {
	emails := router.Group("/emails")
	emails.POST("/newsletter/subscribe", h.SubscribeNewsletter)
	emails.POST("/password-changed", middleware.JWTAuth(), h.PasswordChanged)
}
