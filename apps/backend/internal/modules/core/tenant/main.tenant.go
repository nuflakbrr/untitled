package tenant

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/tenant/handler"
	"venturo-skeleton-go/internal/modules/core/tenant/repository"
	"venturo-skeleton-go/internal/modules/core/tenant/service"
)

type TenantModule struct {
	Handler    *handler.TenantHandler
	Service    *service.TenantService
	Repository *repository.TenantRepository
}

func Initialize(db *pgxpool.Pool) *TenantModule {
	repo := repository.NewTenantRepository(db)
	svc := service.NewTenantService(repo)
	h := handler.NewTenantHandler(svc)

	return &TenantModule{
		Handler:    h,
		Service:    svc,
		Repository: repo,
	}
}

// SetupRoutes registers routes for tenant module
func (m *TenantModule) SetupRoutes(router *gin.RouterGroup) {
	tenants := router.Group("/tenants")
	{
		// Public routes (Katalog publik butuh list fakultas)
		tenants.GET("", m.Handler.GetAll)
		tenants.GET("/:id", m.Handler.GetByID)
		tenants.GET("/by-slug/:slug", m.Handler.GetBySlug)

		// Protected administrative routes
		tenants.POST("", middleware.JWTAuth(), middleware.RequirePermission("tenant.create"), m.Handler.Create)
		tenants.PUT("/:id", middleware.JWTAuth(), middleware.RequirePermission("tenant.update"), m.Handler.Update)
		tenants.DELETE("/:id", middleware.JWTAuth(), middleware.RequirePermission("tenant.delete"), m.Handler.Delete)

		// Payment gateway configuration
		tenants.GET("/:id/payment-gateway", middleware.JWTAuth(), middleware.RequirePermission("tenant.update"), m.Handler.GetPaymentGateway)
		tenants.PUT("/:id/payment-gateway", middleware.JWTAuth(), middleware.RequirePermission("tenant.update"), m.Handler.UpdatePaymentGateway)
	}
}

