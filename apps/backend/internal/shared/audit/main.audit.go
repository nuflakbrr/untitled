package audit

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"venturo-skeleton-go/internal/middleware"
)

type Module struct {
	Repository *Repository
	Service    *Service
	Handler    *Handler
}

func Initialize(db *pgxpool.Pool) *Module {
	repo := NewRepository(db)
	svc := NewService(repo)
	h := NewHandler(svc)
	return &Module{
		Repository: repo,
		Service:    svc,
		Handler:    h,
	}
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	logs := router.Group("/audit-logs")
	logs.Use(middleware.JWTAuth())
	{
		logs.GET("", middleware.RequirePermission("audit.read"), m.Handler.List)
	}
}
