package user

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/user/handler"
	"venturo-skeleton-go/internal/modules/core/user/repository"
	"venturo-skeleton-go/internal/modules/core/user/service"
)

type UserModule struct {
	Handler    *handler.UserHandler
	Service    *service.UserService
	Repository *repository.UserRepository
}

func Initialize(db *pgxpool.Pool) *UserModule {
	repo := repository.NewUserRepository(db)
	svc := service.NewUserService(repo)
	h := handler.NewUserHandler(svc)

	return &UserModule{
		Handler:    h,
		Service:    svc,
		Repository: repo,
	}
}

// SetupRoutes registers routes for user module
func (m *UserModule) SetupRoutes(router *gin.RouterGroup) {
	users := router.Group("/users")
	users.Use(middleware.JWTAuth())
	{
		// Self profile endpoints
		users.PUT("/me", m.Handler.UpdateMe)
		users.POST("/change-password", m.Handler.ChangePassword)

		// Administrative user management endpoints
		users.GET("", middleware.RequirePermission("user.read"), m.Handler.GetAll)
		users.GET("/:id", middleware.RequirePermission("user.read"), m.Handler.GetByID)
		users.POST("", middleware.RequirePermission("user.create"), m.Handler.Create)
		users.PUT("/:id", middleware.RequirePermission("user.update"), m.Handler.Update)
		users.DELETE("/:id", middleware.RequirePermission("user.delete"), m.Handler.Delete)

		// Ban / Unban endpoints
		users.POST("/:id/ban", middleware.RequirePermission("user.update"), m.Handler.BanUser)
		users.POST("/:id/unban", middleware.RequirePermission("user.update"), m.Handler.UnbanUser)
	}
}
