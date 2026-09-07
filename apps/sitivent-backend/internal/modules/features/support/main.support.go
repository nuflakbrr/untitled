package support

import (
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/support/handler"
	"venturo-skeleton-go/internal/modules/features/support/repository"
	"venturo-skeleton-go/internal/modules/features/support/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	Handler    *handler.SupportHandler
	Service    *service.SupportService
	Repository *repository.SupportRepository
}

func Initialize(db *pgxpool.Pool) *Module {
	supportRepository := repository.NewSupportRepository(db)
	supportService := service.NewSupportService(supportRepository)
	return &Module{
		Handler: handler.NewSupportHandler(supportService), Service: supportService, Repository: supportRepository,
	}
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	messages := router.Group("/support-messages")
	{
		messages.POST("", m.Handler.Create)
		messages.GET("", middleware.JWTAuth(), middleware.RequirePermission("support.read"), m.Handler.List)
		messages.PATCH("/:id/status", middleware.JWTAuth(), middleware.RequirePermission("support.update"), m.Handler.UpdateStatus)
	}
}
