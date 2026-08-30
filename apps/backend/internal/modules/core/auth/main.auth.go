package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"venturo-skeleton-go/internal/config"
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/auth/handler"
	"venturo-skeleton-go/internal/modules/core/auth/service"
	tenantRepo "venturo-skeleton-go/internal/modules/core/tenant/repository"
	userRepo "venturo-skeleton-go/internal/modules/core/user/repository"
)

type AuthModule struct {
	Handler *handler.AuthHandler
	Service *service.AuthService
}

func Initialize(db *pgxpool.Pool, cfg *config.Config) *AuthModule {
	userRepository := userRepo.NewUserRepository(db)
	tenantRepository := tenantRepo.NewTenantRepository(db)
	authService := service.NewAuthService(userRepository, tenantRepository, cfg)
	authHandler := handler.NewAuthHandler(authService)

	return &AuthModule{
		Handler: authHandler,
		Service: authService,
	}
}

func (m *AuthModule) SetupRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		// Public routes
		auth.POST("/signup", m.Handler.SignUp)
		auth.POST("/signin", m.Handler.SignIn)
		auth.POST("/refresh", m.Handler.Refresh)

		// Protected routes
		auth.GET("/me", middleware.JWTAuth(), m.Handler.GetMe)
		auth.POST("/logout", middleware.JWTAuth(), m.Handler.Logout)
		auth.POST("/switch-tenant", middleware.JWTAuth(), m.Handler.SwitchTenant)
	}
}
