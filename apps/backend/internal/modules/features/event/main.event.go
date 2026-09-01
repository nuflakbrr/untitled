package event

import (
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/event/handler"
	"venturo-skeleton-go/internal/modules/features/event/repository"
	"venturo-skeleton-go/internal/modules/features/event/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	EventHandler       *handler.EventHandler
	CategoryHandler    *handler.CategoryHandler
	Service            *service.EventService
	EventRepository    *repository.EventRepository
	CategoryRepository *repository.CategoryRepository
}

func Initialize(db *pgxpool.Pool) *Module {
	eventRepository := repository.NewEventRepository(db)
	categoryRepository := repository.NewCategoryRepository(db)
	eventService := service.NewEventService(eventRepository, categoryRepository)
	return &Module{
		EventHandler: handler.NewEventHandler(eventService), CategoryHandler: handler.NewCategoryHandler(eventService),
		Service: eventService, EventRepository: eventRepository, CategoryRepository: categoryRepository,
	}
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	categories := router.Group("/event-categories")
	{
		categories.GET("", m.CategoryHandler.GetAll)
		categories.POST("", middleware.JWTAuth(), middleware.RequirePermission("event.categories.create"), m.CategoryHandler.Create)
		categories.PUT("/:id", middleware.JWTAuth(), middleware.RequirePermission("event.categories.update"), m.CategoryHandler.Update)
		categories.DELETE("/:id", middleware.JWTAuth(), middleware.RequirePermission("event.categories.delete"), m.CategoryHandler.Delete)
		categories.DELETE("/:id/permanent", middleware.JWTAuth(), middleware.RequirePermission("event.categories.delete"), m.CategoryHandler.PermanentDelete)
	}

	events := router.Group("/events")
	{
		events.GET("", m.EventHandler.GetAll)
		events.GET("/admin", middleware.JWTAuth(), middleware.RequirePermission("events.read"), m.EventHandler.GetAdminAll)
		events.GET("/:slug", m.EventHandler.GetBySlug)
		events.POST("", middleware.JWTAuth(), middleware.RequirePermission("events.create"), m.EventHandler.Create)
		events.PUT("/:id", middleware.JWTAuth(), middleware.RequirePermission("events.update"), m.EventHandler.Update)
		events.PATCH("/:id/status", middleware.JWTAuth(), middleware.RequirePermission("events.publish"), m.EventHandler.UpdateStatus)
		events.DELETE("/:id", middleware.JWTAuth(), middleware.RequirePermission("events.delete"), m.EventHandler.Delete)
		events.DELETE("/:id/permanent", middleware.JWTAuth(), middleware.RequirePermission("events.delete"), m.EventHandler.PermanentDelete)
	}
}
