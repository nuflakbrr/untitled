package handler

import (
	"context"
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/attendance/dto"
	"venturo-skeleton-go/internal/modules/features/attendance/repository"
	"venturo-skeleton-go/internal/shared/response"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type Service interface {
	Scan(ctx context.Context, scannerID string, scopeTenantID *string, req dto.ScanRequest) (*dto.ScanResponse, error)
	StatsByEvent(ctx context.Context, eventID string, scopeTenantID *string) (*dto.AttendanceStatsResponse, error)
}

type AttendanceHandler struct {
	service Service
}

func NewAttendanceHandler(service Service) *AttendanceHandler {
	return &AttendanceHandler{service: service}
}

func (h *AttendanceHandler) Scan(c *gin.Context) {
	var req dto.ScanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	claims, ok := scannerClaims(c)
	if !ok {
		return
	}
	scope := organizerScopeFromClaims(claims)
	result, err := h.service.Scan(c.Request.Context(), claims.UserID, scope, req)
	if err != nil {
		writeAttendanceError(c, err, result, "Failed to process check-in")
		return
	}
	response.Success(c, http.StatusOK, "Check-in successful", result)
}

func (h *AttendanceHandler) StatsByEvent(c *gin.Context) {
	claims, ok := scannerClaims(c)
	if !ok {
		return
	}
	scope := organizerScopeFromClaims(claims)
	stats, err := h.service.StatsByEvent(c.Request.Context(), c.Param("eventID"), scope)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve attendance stats", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Attendance stats retrieved successfully", stats)
}

func scannerClaims(c *gin.Context) (*jwtpkg.Claims, bool) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil || claims.UserID == "" {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return nil, false
	}
	return claims, true
}

// organizerScopeFromClaims returns nil for a root superadmin (unscoped
// access across every tenant) or the caller's own tenant otherwise, so a
// Fasilkom scanner/panitia can never check in or view stats for another
// faculty's event.
func organizerScopeFromClaims(claims *jwtpkg.Claims) *string {
	if claims.IsSuperAdmin {
		return nil
	}
	tenantID := claims.TenantID
	return &tenantID
}

func writeAttendanceError(c *gin.Context, err error, result *dto.ScanResponse, fallback string) {
	switch {
	case errors.Is(err, repository.ErrTokenNotFound), errors.Is(err, repository.ErrEventMismatch):
		response.Error(c, http.StatusNotFound, "QR code is invalid for this event", "")
	case errors.Is(err, repository.ErrNotEligible):
		response.Success(c, http.StatusBadRequest, "Ticket is not eligible for check-in", result)
	case errors.Is(err, repository.ErrAlreadyCheckedIn):
		response.Success(c, http.StatusConflict, "Participant has already checked in", result)
	default:
		response.Error(c, http.StatusInternalServerError, fallback, err.Error())
	}
}
