package content

import (
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/content/handler"
	"venturo-skeleton-go/internal/modules/features/content/repository"
	"venturo-skeleton-go/internal/modules/features/content/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	ArticleHandler  *handler.ArticleHandler
	CategoryHandler *handler.CategoryHandler
	GalleryHandler  *handler.GalleryHandler
	Service         *service.ContentService
}

func Initialize(db *pgxpool.Pool) *Module {
	articleRepository := repository.NewArticleRepository(db)
	categoryRepository := repository.NewCategoryRepository(db)
	galleryRepository := repository.NewGalleryRepository(db)
	contentService := service.NewContentService(articleRepository, categoryRepository, galleryRepository)
	return &Module{
		ArticleHandler:  handler.NewArticleHandler(contentService),
		CategoryHandler: handler.NewCategoryHandler(contentService),
		GalleryHandler:  handler.NewGalleryHandler(contentService),
		Service:         contentService,
	}
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	articles := router.Group("/articles")
	{
		articles.GET("", m.ArticleHandler.List)
		articles.GET("/by-slug/:slug", m.ArticleHandler.GetBySlug)
		articles.POST("", middleware.JWTAuth(), middleware.RequirePermission("articles.create"), m.ArticleHandler.Create)
		articles.PUT("/:id", middleware.JWTAuth(), middleware.RequirePermission("articles.update"), m.ArticleHandler.Update)
		articles.DELETE("/:id", middleware.JWTAuth(), middleware.RequirePermission("articles.delete"), m.ArticleHandler.Delete)
	}

	categories := router.Group("/article-categories")
	{
		categories.GET("", m.CategoryHandler.List)
		categories.POST("", middleware.JWTAuth(), middleware.RequirePermission("article.categories.create"), m.CategoryHandler.Create)
		categories.PUT("/:id", middleware.JWTAuth(), middleware.RequirePermission("article.categories.update"), m.CategoryHandler.Update)
		categories.DELETE("/:id", middleware.JWTAuth(), middleware.RequirePermission("article.categories.delete"), m.CategoryHandler.Delete)
	}

	galleries := router.Group("/galleries")
	{
		galleries.GET("", m.GalleryHandler.List)
		galleries.POST("", middleware.JWTAuth(), middleware.RequirePermission("galleries.create"), m.GalleryHandler.Create)
		galleries.PUT("/:id", middleware.JWTAuth(), middleware.RequirePermission("galleries.update"), m.GalleryHandler.Update)
		galleries.DELETE("/:id", middleware.JWTAuth(), middleware.RequirePermission("galleries.delete"), m.GalleryHandler.Delete)
	}
}
