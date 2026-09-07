package service

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"venturo-skeleton-go/internal/modules/core/tenant/domain"
	"venturo-skeleton-go/internal/modules/core/tenant/dto"
	"venturo-skeleton-go/internal/modules/core/tenant/repository"
)

var (
	ErrSlugAlreadyExists = errors.New("tenant slug already exists")
	ErrCodeAlreadyExists = errors.New("tenant code already exists")
)

// TenantRepositoryInterface defines the contract for tenant data access.
// Satisfied by *repository.TenantRepository and mock implementations in tests.
type TenantRepositoryInterface interface {
	FindAll(ctx context.Context, filter dto.TenantQueryFilter) ([]*domain.Tenant, int64, error)
	FindByID(ctx context.Context, id string) (*domain.Tenant, error)
	FindBySlug(ctx context.Context, slug string) (*domain.Tenant, error)
	Create(ctx context.Context, t *domain.Tenant) error
	Update(ctx context.Context, t *domain.Tenant) error
	Delete(ctx context.Context, id string) error
	GetPaymentGateway(ctx context.Context, tenantID string) (*domain.TenantPaymentGateway, error)
	UpsertPaymentGateway(ctx context.Context, pg *domain.TenantPaymentGateway) error
}

type TenantService struct {
	repo TenantRepositoryInterface
}

// NewTenantService wires the concrete repository.
func NewTenantService(repo *repository.TenantRepository) *TenantService {
	return &TenantService{repo: repo}
}

// NewTenantServiceWithInterface allows injection of mock repository (used in tests).
func NewTenantServiceWithInterface(repo TenantRepositoryInterface) *TenantService {
	return &TenantService{repo: repo}
}

// GetAll retrieves a list of tenants based on filters
func (s *TenantService) GetAll(ctx context.Context, filter dto.TenantQueryFilter) ([]dto.TenantResponse, int64, error) {
	tenants, total, err := s.repo.FindAll(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	var responses []dto.TenantResponse
	for _, t := range tenants {
		responses = append(responses, toTenantResponse(t))
	}

	return responses, total, nil
}

// GetByID retrieves a tenant by ID
func (s *TenantService) GetByID(ctx context.Context, id string) (*dto.TenantResponse, error) {
	t, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	resp := toTenantResponse(t)
	return &resp, nil
}

// GetBySlug retrieves a tenant by slug
func (s *TenantService) GetBySlug(ctx context.Context, slug string) (*dto.TenantResponse, error) {
	t, err := s.repo.FindBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	resp := toTenantResponse(t)
	return &resp, nil
}

// Create creates a new tenant
func (s *TenantService) Create(ctx context.Context, req dto.CreateTenantRequest) (*dto.TenantResponse, error) {
	slug := strings.ToLower(strings.TrimSpace(req.Slug))
	code := strings.ToUpper(strings.TrimSpace(req.Code))

	// Check if slug exists
	if existing, _ := s.repo.FindBySlug(ctx, slug); existing != nil {
		return nil, ErrSlugAlreadyExists
	}

	tenant := &domain.Tenant{
		Name:        strings.TrimSpace(req.Name),
		Slug:        slug,
		Code:        code,
		Type:        domain.TenantType(req.Type),
		ParentID:    req.ParentID,
		LogoURL:     req.LogoURL,
		Website:     req.Website,
		Description: req.Description,
	}

	if err := s.repo.Create(ctx, tenant); err != nil {
		return nil, fmt.Errorf("failed to create tenant: %w", err)
	}

	resp := toTenantResponse(tenant)
	return &resp, nil
}

// Update updates an existing tenant
func (s *TenantService) Update(ctx context.Context, id string, req dto.UpdateTenantRequest) (*dto.TenantResponse, error) {
	tenant, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != nil {
		tenant.Name = strings.TrimSpace(*req.Name)
	}
	if req.Slug != nil {
		newSlug := strings.ToLower(strings.TrimSpace(*req.Slug))
		if newSlug != tenant.Slug {
			if existing, _ := s.repo.FindBySlug(ctx, newSlug); existing != nil {
				return nil, ErrSlugAlreadyExists
			}
			tenant.Slug = newSlug
		}
	}
	if req.Code != nil {
		tenant.Code = strings.ToUpper(strings.TrimSpace(*req.Code))
	}
	if req.Type != nil {
		tenant.Type = domain.TenantType(*req.Type)
	}
	if req.ParentID != nil {
		tenant.ParentID = req.ParentID
	}
	if req.LogoURL != nil {
		tenant.LogoURL = req.LogoURL
	}
	if req.Website != nil {
		tenant.Website = req.Website
	}
	if req.Description != nil {
		tenant.Description = req.Description
	}

	if err := s.repo.Update(ctx, tenant); err != nil {
		return nil, fmt.Errorf("failed to update tenant: %w", err)
	}

	resp := toTenantResponse(tenant)
	return &resp, nil
}

// Delete soft-deletes a tenant
func (s *TenantService) Delete(ctx context.Context, id string) error {
	return s.repo.Delete(ctx, id)
}

// GetPaymentGateway gets gateway configuration for a tenant
func (s *TenantService) GetPaymentGateway(ctx context.Context, tenantID string) (*dto.TenantPaymentGatewayResponse, error) {
	// Verify tenant exists
	if _, err := s.repo.FindByID(ctx, tenantID); err != nil {
		return nil, err
	}

	pg, err := s.repo.GetPaymentGateway(ctx, tenantID)
	if err != nil {
		return nil, err
	}

	if pg == nil {
		return &dto.TenantPaymentGatewayResponse{
			TenantID: tenantID,
			Provider: "IPAYMU",
			IsActive: false,
			Env:      "sandbox",
		}, nil
	}

	return &dto.TenantPaymentGatewayResponse{
		ID:                pg.ID,
		TenantID:          pg.TenantID,
		Provider:          pg.Provider,
		IsActive:          pg.IsActive,
		VirtualAccount:    pg.VirtualAccount,
		Env:               pg.Env,
		BankName:          pg.BankName,
		BankAccountNumber: pg.BankAccountNumber,
		BankAccountHolder: pg.BankAccountHolder,
		HasAPIKey:         pg.APIKey != nil && *pg.APIKey != "",
	}, nil
}

// UpdatePaymentGateway configures payment gateway for a tenant
func (s *TenantService) UpdatePaymentGateway(ctx context.Context, tenantID string, req dto.UpdatePaymentGatewayRequest) (*dto.TenantPaymentGatewayResponse, error) {
	// Verify tenant exists
	if _, err := s.repo.FindByID(ctx, tenantID); err != nil {
		return nil, err
	}

	pg := &domain.TenantPaymentGateway{
		TenantID:          tenantID,
		Provider:          req.Provider,
		IsActive:          req.IsActive,
		APIKey:            req.APIKey,
		VirtualAccount:    req.VirtualAccount,
		Env:               req.Env,
		BankName:          req.BankName,
		BankAccountNumber: req.BankAccountNumber,
		BankAccountHolder: req.BankAccountHolder,
	}

	if err := s.repo.UpsertPaymentGateway(ctx, pg); err != nil {
		return nil, fmt.Errorf("failed to save payment gateway: %w", err)
	}

	return &dto.TenantPaymentGatewayResponse{
		ID:                pg.ID,
		TenantID:          pg.TenantID,
		Provider:          pg.Provider,
		IsActive:          pg.IsActive,
		VirtualAccount:    pg.VirtualAccount,
		Env:               pg.Env,
		BankName:          pg.BankName,
		BankAccountNumber: pg.BankAccountNumber,
		BankAccountHolder: pg.BankAccountHolder,
		HasAPIKey:         pg.APIKey != nil && *pg.APIKey != "",
	}, nil
}

func toTenantResponse(t *domain.Tenant) dto.TenantResponse {
	return dto.TenantResponse{
		ID:          t.ID,
		Name:        t.Name,
		Slug:        t.Slug,
		Code:        t.Code,
		Type:        string(t.Type),
		ParentID:    t.ParentID,
		LogoURL:     t.LogoURL,
		Website:     t.Website,
		Description: t.Description,
		CreatedAt:   t.CreatedAt.Format(time.RFC3339),
		UpdatedAt:   t.UpdatedAt.Format(time.RFC3339),
	}
}

