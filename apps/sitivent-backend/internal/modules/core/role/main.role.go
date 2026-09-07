package role

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/role/handler"
	"venturo-skeleton-go/internal/modules/core/role/repository"
	"venturo-skeleton-go/internal/modules/core/role/service"
)

type RoleModule struct {
	Handler    *handler.RoleHandler
	Service    *service.RoleService
	Repository *repository.RoleRepository
}

func Initialize(db *pgxpool.Pool) *RoleModule {
	repo := repository.NewRoleRepository(db)
	svc := service.NewRoleService(repo)
	h := handler.NewRoleHandler(svc)

	return &RoleModule{
		Handler:    h,
		Service:    svc,
		Repository: repo,
	}
}

// SetupRoutes registers routes for role module
func (m *RoleModule) SetupRoutes(router *gin.RouterGroup) {
	roles := router.Group("/roles")
	roles.Use(middleware.JWTAuth())
	{
		roles.GET("", middleware.RequirePermission("role.read"), m.Handler.GetAll)
		roles.GET("/permissions", middleware.RequirePermission("permission.read"), m.Handler.Permissions)
		roles.POST("/permissions", middleware.RequirePermission("permission.create"), m.Handler.CreatePermission)
		roles.PUT("/permissions/:id", middleware.RequirePermission("permission.update"), m.Handler.UpdatePermission)
		roles.DELETE("/permissions/:id", middleware.RequirePermission("permission.delete"), m.Handler.DeletePermission)
		roles.GET("/:id", middleware.RequirePermission("role.read"), m.Handler.GetByID)
		roles.POST("", middleware.RequirePermission("role.create"), m.Handler.Create)
		roles.PUT("/:id", middleware.RequirePermission("role.update"), m.Handler.Update)
		roles.DELETE("/:id", middleware.RequirePermission("role.delete"), m.Handler.Delete)
		roles.PUT("/:id/permissions", middleware.RequirePermission("role.update"), m.Handler.SetPermissions)
		roles.GET("/:id/permissions", middleware.RequirePermission("role.read"), m.Handler.PermissionIDs)
	}
}
