package service

import (
	"context"

	"venturo-skeleton-go/internal/modules/features/attendance/domain"
	"venturo-skeleton-go/internal/modules/features/attendance/dto"
	"venturo-skeleton-go/internal/modules/features/attendance/repository"
)

type Repository interface {
	Scan(ctx context.Context, qrToken, eventID, scannerID string, scopeTenantID *string) (*domain.Attendance, error)
	StatsByEvent(ctx context.Context, eventID string, scopeTenantID *string) (*domain.EventStats, error)
}

type AttendanceService struct {
	repository Repository
}

func NewAttendanceService(repo *repository.AttendanceRepository) *AttendanceService {
	return NewAttendanceServiceWithInterfaces(repo)
}

func NewAttendanceServiceWithInterfaces(repo Repository) *AttendanceService {
	return &AttendanceService{repository: repo}
}

// Scan returns a partial ScanResponse alongside a non-nil error whenever the
// repository could resolve participant/event context (ineligible ticket,
// already checked in) — callers should render both, not just the error.
func (s *AttendanceService) Scan(ctx context.Context, scannerID string, scopeTenantID *string, req dto.ScanRequest) (*dto.ScanResponse, error) {
	attendance, err := s.repository.Scan(ctx, req.QRToken, req.EventID, scannerID, scopeTenantID)
	if attendance == nil {
		return nil, err
	}
	response := toResponse(attendance)
	return &response, err
}

func (s *AttendanceService) StatsByEvent(ctx context.Context, eventID string, scopeTenantID *string) (*dto.AttendanceStatsResponse, error) {
	stats, err := s.repository.StatsByEvent(ctx, eventID, scopeTenantID)
	if err != nil {
		return nil, err
	}
	return &dto.AttendanceStatsResponse{
		EventID: stats.EventID, TotalRegistered: stats.TotalRegistered, TotalCheckedIn: stats.TotalCheckedIn,
	}, nil
}

func toResponse(att *domain.Attendance) dto.ScanResponse {
	return dto.ScanResponse{
		RegistrationID: att.RegistrationID, RegistrationNumber: att.RegistrationNumber,
		ParticipantName: att.ParticipantName, ParticipantEmail: att.ParticipantEmail,
		EventID: att.EventID, EventTitle: att.EventTitle, ScanTime: att.ScanTime, Status: string(att.Status),
	}
}
