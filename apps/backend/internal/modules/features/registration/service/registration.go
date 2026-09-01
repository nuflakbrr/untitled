package service

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/registration/domain"
	"venturo-skeleton-go/internal/modules/features/registration/dto"
	"venturo-skeleton-go/internal/modules/features/registration/repository"

	"github.com/xuri/excelize/v2"
)

type RegistrationRepository interface {
	Create(ctx context.Context, userID, eventID string, onlineAttendance bool, qrToken string) (*domain.Registration, error)
	ListMine(ctx context.Context, userID string, query dto.RegistrationQuery) ([]*domain.Registration, int64, error)
	ListByEvent(ctx context.Context, eventID string, scopeTenantID *string, query dto.RegistrationQuery) ([]*domain.Registration, int64, error)
	ListForExport(ctx context.Context, eventID string, scopeTenantID *string) ([]*domain.Registration, error)
	CancelMine(ctx context.Context, id, userID string) error
}

type tokenGenerator func() (string, error)

type RegistrationService struct {
	repository    RegistrationRepository
	generateToken tokenGenerator
}

func NewRegistrationService(registrationRepository *repository.RegistrationRepository) *RegistrationService {
	return NewRegistrationServiceWithInterfaces(registrationRepository, secureQRToken)
}

func NewRegistrationServiceWithInterfaces(registrationRepository RegistrationRepository, generator tokenGenerator) *RegistrationService {
	return &RegistrationService{repository: registrationRepository, generateToken: generator}
}

func (s *RegistrationService) Register(ctx context.Context, userID string, req dto.CreateRegistrationRequest) (*dto.RegistrationResponse, error) {
	for attempt := 0; attempt < 3; attempt++ {
		token, err := s.generateToken()
		if err != nil {
			return nil, fmt.Errorf("generate registration QR token: %w", err)
		}
		registration, err := s.repository.Create(ctx, userID, req.EventID, req.OnlineAttendance, token)
		if errors.Is(err, repository.ErrQRTokenExists) {
			continue
		}
		if err != nil {
			return nil, err
		}
		response := toResponse(registration)
		return &response, nil
	}
	return nil, fmt.Errorf("register after QR token retries: %w", repository.ErrQRTokenExists)
}

func (s *RegistrationService) ListMine(ctx context.Context, userID string, query dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
	registrations, total, err := s.repository.ListMine(ctx, userID, query)
	if err != nil {
		return nil, 0, err
	}
	return toResponses(registrations), total, nil
}

func (s *RegistrationService) ListByEvent(ctx context.Context, eventID string, scopeTenantID *string, query dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
	registrations, total, err := s.repository.ListByEvent(ctx, eventID, scopeTenantID, query)
	if err != nil {
		return nil, 0, err
	}
	return toResponses(registrations), total, nil
}

func (s *RegistrationService) CancelMine(ctx context.Context, id, userID string) error {
	return s.repository.CancelMine(ctx, id, userID)
}

func (s *RegistrationService) ExportByEvent(ctx context.Context, eventID string, scopeTenantID *string) ([]byte, error) {
	registrations, err := s.repository.ListForExport(ctx, eventID, scopeTenantID)
	if err != nil {
		return nil, err
	}
	workbook := excelize.NewFile()
	defer func() { _ = workbook.Close() }()
	const sheet = "Registrations"
	if err := workbook.SetSheetName("Sheet1", sheet); err != nil {
		return nil, fmt.Errorf("rename registration worksheet: %w", err)
	}
	headers := []any{"Registration Number", "Participant", "Email", "Status", "Attendance Mode", "Registered At"}
	if err := workbook.SetSheetRow(sheet, "A1", &headers); err != nil {
		return nil, fmt.Errorf("write registration export header: %w", err)
	}
	for index, registration := range registrations {
		attendanceMode := "OFFLINE"
		if registration.OnlineAttendance {
			attendanceMode = "ONLINE"
		}
		row := []any{
			registration.RegistrationNumber, registration.UserName, registration.UserEmail,
			registration.Status, attendanceMode, registration.CreatedAt.Format("2006-01-02 15:04:05"),
		}
		cell := fmt.Sprintf("A%d", index+2)
		if err := workbook.SetSheetRow(sheet, cell, &row); err != nil {
			return nil, fmt.Errorf("write registration export row: %w", err)
		}
	}
	if err := workbook.SetColWidth(sheet, "A", "F", 24); err != nil {
		return nil, fmt.Errorf("format registration export: %w", err)
	}
	buffer, err := workbook.WriteToBuffer()
	if err != nil {
		return nil, fmt.Errorf("generate registration workbook: %w", err)
	}
	return buffer.Bytes(), nil
}

func secureQRToken() (string, error) {
	buffer := make([]byte, 32)
	if _, err := rand.Read(buffer); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(buffer), nil
}

func toResponses(registrations []*domain.Registration) []dto.RegistrationResponse {
	responses := make([]dto.RegistrationResponse, 0, len(registrations))
	for _, registration := range registrations {
		responses = append(responses, toResponse(registration))
	}
	return responses
}

func toResponse(registration *domain.Registration) dto.RegistrationResponse {
	return dto.RegistrationResponse{
		ID: registration.ID, EventID: registration.EventID, EventTitle: registration.EventTitle,
		EventSlug: registration.EventSlug, EventBanner: registration.EventBanner,
		TenantID: registration.TenantID, TenantCode: registration.TenantCode,
		EventStartDate: registration.EventStartDate, EventLocation: registration.EventLocation,
		EventType: registration.EventType, EventStatus: registration.EventStatus, AttendanceStatus: registration.AttendanceStatus,
		CertificateStatus: registration.CertificateStatus,
		UserID:            registration.UserID, UserName: registration.UserName, UserEmail: registration.UserEmail,
		RegistrationNumber: registration.RegistrationNumber, QRToken: registration.QRToken,
		OnlineAttendance: registration.OnlineAttendance, Status: string(registration.Status), Price: registration.Price,
		CreatedAt: registration.CreatedAt, UpdatedAt: registration.UpdatedAt, DeletedAt: registration.DeletedAt,
	}
}
