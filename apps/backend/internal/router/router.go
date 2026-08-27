package router

import (
	"context"
	"time"

	"venturo-skeleton-go/internal/config"
	"venturo-skeleton-go/internal/middleware"

	// Core modules for SITIVENT Multi-Tenancy
	"venturo-skeleton-go/internal/modules/core/auth"
	"venturo-skeleton-go/internal/modules/core/role"
	"venturo-skeleton-go/internal/modules/core/tenant"
	"venturo-skeleton-go/internal/modules/core/user"

	"venturo-skeleton-go/internal/shared/audit"
	"venturo-skeleton-go/internal/shared/authz"
	sharedRedis "venturo-skeleton-go/internal/shared/redis"

	"venturo-skeleton-go/pkg/logger"

	"github.com/gin-contrib/cors"
	ginzap "github.com/gin-contrib/zap"
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
)

func Setup(router *gin.Engine, db *pgxpool.Pool, cfg *config.Config) {
	log := logger.GetLogger()

	// ─── Redis & authz cache ────────────────────────────────────────
	redisClient, err := sharedRedis.New(context.Background(), cfg.Redis)
	if err != nil {
		if cfg.Server.Env == "production" {
			log.Fatal("Failed to connect to Redis", zap.Error(err))
		} else {
			log.Warn("⚠️ Redis is not available — running in fallback mode (direct DB query, caching disabled)", zap.Error(err))
			redisClient = nil
		}
	} else {
		log.Info("Redis connected successfully",
			zap.String("addr", cfg.Redis.Host+":"+cfg.Redis.Port),
			zap.Int("db", cfg.Redis.DB),
			zap.Duration("permission_ttl", cfg.Redis.PermissionTTL),
		)
	}

	// Logging & Recovery middleware
	router.Use(ginzap.Ginzap(log, time.RFC3339, true))
	router.Use(ginzap.RecoveryWithZap(log, true))

	// CORS middleware configuration
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:8002", "http://localhost:8081", "https://app.untitled.id"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Tenant-ID"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Tenant Context injector
	router.Use(middleware.TenantContext())

	// Health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":  "ok",
			"message": "SITIVENT API is running",
		})
	})

	// OpenAPI 3.0 specification static file for Apidog / Postman / Swagger tools
	router.StaticFile("/openapi.yaml", "./docs/openapi.yaml")

	// Core v1 routes
	coreV1 := router.Group("/core/v1")
	{
		// 1. Role Module
		roleModule := role.Initialize(db)
		roleModule.SetupRoutes(coreV1)

		// 2. Authz Service & Permission Cache
		authzService := authz.NewService(redisClient, roleModule.Repository, cfg.Redis.PermissionTTL)
		middleware.SetAuthzService(authzService)
		roleModule.Service.SetPermissionCacheInvalidator(authzService)

		// 3. Tenant Module
		tenantModule := tenant.Initialize(db)
		tenantModule.SetupRoutes(coreV1)

		// 4. Auth Module
		authModule := auth.Initialize(db, cfg)
		authModule.Service.SetPermissionReader(authzService)
		authModule.SetupRoutes(coreV1)

		// 5. User Module
		userModule := user.Initialize(db)
		userModule.SetupRoutes(coreV1)

		// 6. Audit Module
		auditModule := audit.Initialize(db)
		auditModule.SetupRoutes(coreV1)
	}

	log.Info("Routes setup completed", zap.Int("routes", len(router.Routes())))
}
