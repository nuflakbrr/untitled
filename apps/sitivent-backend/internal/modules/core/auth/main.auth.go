package auth

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"sitivent-backend/internal/config"
	"sitivent-backend/internal/middleware"
	"sitivent-backend/internal/modules/core/auth/handler"
	authRepo "sitivent-backend/internal/modules/core/auth/repository"
	"sitivent-backend/internal/modules/core/auth/service"
	tenantRepo "sitivent-backend/internal/modules/core/tenant/repository"
	userRepo "sitivent-backend/internal/modules/core/user/repository"
	emailpkg "sitivent-backend/pkg/email"
)

type AuthModule struct {
	Handler *handler.AuthHandler
	Service *service.AuthService
}

func Initialize(db *pgxpool.Pool, cfg *config.Config) *AuthModule {
	userRepository := userRepo.NewUserRepository(db)
	tenantRepository := tenantRepo.NewTenantRepository(db)
	authService := service.NewAuthService(userRepository, tenantRepository, cfg)
	var emailService emailpkg.EmailService
	smtpService, err := emailpkg.NewSMTPEmailService()
	if err != nil {
		if cfg.Server.Env == "production" {
			panic(err)
		}
		smtpService = nil
	}
	if smtpService == nil {
		emailService = &emailpkg.NoOpEmailService{}
	} else {
		emailService = smtpService
	}
	authService.SetPasswordResetDependencies(authRepo.NewPasswordResetRepository(db), emailService)
	authHandler := handler.NewAuthHandler(authService)

	return &AuthModule{
		Handler: authHandler,
		Service: authService,
	}
}

func (m *AuthModule) SetupRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	passwordResetLimiter := middleware.NewRateLimiter(5, 15*time.Minute)
	{
		// Public routes
		auth.POST("/signup", m.Handler.SignUp)
		auth.POST("/signin", m.Handler.SignIn)
		auth.POST("/refresh", m.Handler.Refresh)
		auth.POST("/password-reset/request", middleware.IPBasedRateLimiter(passwordResetLimiter, 15*time.Minute), m.Handler.RequestPasswordReset)
		auth.POST("/password-reset/confirm", middleware.IPBasedRateLimiter(passwordResetLimiter, 15*time.Minute), m.Handler.ConfirmPasswordReset)

		// Protected routes
		auth.GET("/me", middleware.JWTAuth(), m.Handler.GetMe)
		auth.POST("/logout", middleware.JWTAuth(), m.Handler.Logout)
		auth.POST("/switch-tenant", middleware.JWTAuth(), m.Handler.SwitchTenant)
		auth.GET("/my-tenants", middleware.JWTAuth(), m.Handler.MyTenants)
	}
}
