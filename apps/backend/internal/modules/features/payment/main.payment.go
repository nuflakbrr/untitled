package payment

import (
	"venturo-skeleton-go/internal/config"
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/payment/handler"
	"venturo-skeleton-go/internal/modules/features/payment/repository"
	"venturo-skeleton-go/internal/modules/features/payment/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	Handler    *handler.PaymentHandler
	Service    *service.PaymentService
	Repository *repository.PaymentRepository
}

func Initialize(db *pgxpool.Pool, cfg *config.Config) *Module {
	paymentRepository := repository.NewPaymentRepository(db)
	paymentService := service.NewPaymentService(paymentRepository, cfg.Payment.PublicBaseURL, cfg.Payment.HTTPTimeout)
	return &Module{
		Handler: handler.NewPaymentHandler(paymentService), Service: paymentService, Repository: paymentRepository,
	}
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	router.POST("/payments/webhook/ipaymu", m.Handler.Webhook)

	payments := router.Group("/payments", middleware.JWTAuth())
	{
		payments.POST("/checkout", middleware.RequirePermission("payments.checkout"), m.Handler.Checkout)
		payments.POST("/:id/proof", middleware.RequirePermission("payments.checkout"), m.Handler.SubmitProof)
		payments.POST("/:id/verify", middleware.RequirePermission("payments.verify"), m.Handler.VerifyProof)
		payments.GET("/registration/:registrationID", middleware.RequirePermission("payments.read"), m.Handler.GetByRegistration)
	}
}
