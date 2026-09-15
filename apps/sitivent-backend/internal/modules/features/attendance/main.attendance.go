package attendance

import (
	"sitivent-backend/internal/middleware"
	"sitivent-backend/internal/modules/features/attendance/handler"
	"sitivent-backend/internal/modules/features/attendance/repository"
	"sitivent-backend/internal/modules/features/attendance/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Module struct {
	Handler    *handler.AttendanceHandler
	Service    *service.AttendanceService
	Repository *repository.AttendanceRepository
}

func Initialize(db *pgxpool.Pool) *Module {
	attendanceRepository := repository.NewAttendanceRepository(db)
	attendanceService := service.NewAttendanceService(attendanceRepository)
	return &Module{
		Handler: handler.NewAttendanceHandler(attendanceService), Service: attendanceService, Repository: attendanceRepository,
	}
}

func (m *Module) SetupRoutes(router *gin.RouterGroup) {
	attendances := router.Group("/attendances", middleware.JWTAuth())
	{
		attendances.POST("/scan", middleware.RequirePermission("attendance.scan"), m.Handler.Scan)
		attendances.GET("/event/:eventID/stats", middleware.RequirePermission("attendance.read"), m.Handler.StatsByEvent)
	}
}
