package testimonial

import (
	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"sitivent-backend/internal/middleware"
	"sitivent-backend/internal/modules/features/testimonial/handler"
	"sitivent-backend/internal/modules/features/testimonial/repository"
)

func SetupRoutes(router *gin.RouterGroup, db *pgxpool.Pool) {
	repo := repository.New(db)
	h := handler.New(repo)
	group := router.Group("/testimonials", middleware.JWTAuth())
	group.GET("/me", h.ListMine)
	group.POST("/registration/:id", h.Create)
}
