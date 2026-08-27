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
		roles.GET("/:id", middleware.RequirePermission("role.read"), m.Handler.GetByID)
	}
}
