package registration

import (
	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/registration/handler"
	"venturo-skeleton-go/internal/modules/features/registration/repository"
	"venturo-skeleton-go/internal/modules/features/registration/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	Handler    *handler.RegistrationHandler
	Service    *service.RegistrationService
	Repository *repository.RegistrationRepository
}

func Initialize(db *pgxpool.Pool) *Module {
	registrationRepository := repository.NewRegistrationRepository(db)
	registrationService := service.NewRegistrationService(registrationRepository)
	return &Module{
		Handler: handler.NewRegistrationHandler(registrationService),
		Service: registrationService, Repository: registrationRepository,
	}
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	registrations := router.Group("/registrations", middleware.JWTAuth())
	{
		registrations.POST("", middleware.RequirePermission("registrations.create"), m.Handler.Register)
		registrations.GET("/me", middleware.RequirePermission("registrations.read"), m.Handler.ListMine)
		registrations.DELETE("/:id", middleware.RequirePermission("registrations.cancel"), m.Handler.CancelMine)
		registrations.POST("/:id/attendance-proof", middleware.RequirePermission("registrations.create"), m.Handler.SubmitAttendanceProof)
		registrations.PATCH("/:id/attendance-proof", middleware.RequirePermission("attendance.scan"), m.Handler.ReviewAttendanceProof)
		registrations.GET("/event/:eventID", middleware.RequirePermission("registrations.read"), m.Handler.ListByEvent)
		registrations.GET("/event/:eventID/export", middleware.RequirePermission("registrations.read"), m.Handler.ExportByEvent)
	}
}
