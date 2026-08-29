package service

import (
	"context"

	"venturo-skeleton-go/internal/modules/features/support/domain"
	"venturo-skeleton-go/internal/modules/features/support/dto"
	"venturo-skeleton-go/internal/modules/features/support/repository"
)

type Repository interface {
	Create(ctx context.Context, message *domain.SupportMessage) error
	FindAll(ctx context.Context, scopeTenantID *string, status string, page, limit int) ([]*domain.SupportMessage, int64, error)
	UpdateStatus(ctx context.Context, id, status string, scopeTenantID *string) error
}

type SupportService struct {
	repository Repository
}

func NewSupportService(repo *repository.SupportRepository) *SupportService {
	return NewSupportServiceWithInterfaces(repo)
}

func NewSupportServiceWithInterfaces(repo Repository) *SupportService {
	return &SupportService{repository: repo}
}

// Create is reachable without authentication (a public "contact us" style
// form), so userID is deliberately not accepted here — trusting a
// client-supplied user_id would let anyone attach a complaint to someone
// else's account.
func (s *SupportService) Create(ctx context.Context, req dto.CreateSupportMessageRequest) (*dto.SupportMessageResponse, error) {
	message := &domain.SupportMessage{
		TenantID: nilIfEmpty(req.TenantID), Email: req.Email, Phone: req.Phone, Name: req.Name,
		Title: req.Title, Category: req.Category, Chronology: req.Chronology, Status: domain.StatusPending,
	}
	if err := s.repository.Create(ctx, message); err != nil {
		return nil, err
	}
	response := toResponse(message)
	return &response, nil
}

func (s *SupportService) List(ctx context.Context, scopeTenantID *string, query dto.SupportMessageQuery) ([]dto.SupportMessageResponse, int64, error) {
	page, limit := query.Page, query.Limit
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}
	messages, total, err := s.repository.FindAll(ctx, scopeTenantID, query.Status, page, limit)
	if err != nil {
		return nil, 0, err
	}
	responses := make([]dto.SupportMessageResponse, 0, len(messages))
	for _, message := range messages {
		responses = append(responses, toResponse(message))
	}
	return responses, total, nil
}

func (s *SupportService) UpdateStatus(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateStatusRequest) error {
	return s.repository.UpdateStatus(ctx, id, req.Status, scopeTenantID)
}

func nilIfEmpty(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}

func toResponse(message *domain.SupportMessage) dto.SupportMessageResponse {
	return dto.SupportMessageResponse{
		ID: message.ID, TenantID: message.TenantID, Email: message.Email, Phone: message.Phone, Name: message.Name,
		Title: message.Title, Category: message.Category, Chronology: message.Chronology, Status: message.Status,
		UserID: message.UserID, CreatedAt: message.CreatedAt, UpdatedAt: message.UpdatedAt,
	}
}
