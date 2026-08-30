package testimonial

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/testimonial/handler"
	"venturo-skeleton-go/internal/modules/features/testimonial/repository"
)

func SetupRoutes(router *gin.RouterGroup, db *pgxpool.Pool) {
	repo := repository.New(db)
	h := handler.New(repo)
	group := router.Group("/testimonials", middleware.JWTAuth())
	group.GET("/me", h.ListMine)
	group.POST("/registration/:id", h.Create)
}
