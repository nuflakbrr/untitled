package service

import (
	"context"

	"venturo-skeleton-go/internal/modules/core/role/domain"
	"venturo-skeleton-go/internal/modules/core/role/dto"
	"venturo-skeleton-go/internal/modules/core/role/repository"
)

type PermissionCacheInvalidator interface {
	InvalidateUser(ctx context.Context, userID string) error
	InvalidateAll(ctx context.Context) error
}

type RoleService struct {
	roleRepo    *repository.RoleRepository
	invalidator PermissionCacheInvalidator
}

func NewRoleService(roleRepo *repository.RoleRepository) *RoleService {
	return &RoleService{
		roleRepo: roleRepo,
	}
}

func (s *RoleService) SetPermissionCacheInvalidator(inv PermissionCacheInvalidator) {
	s.invalidator = inv
}

// GetAll returns roles visible to the caller. scopeTenantID nil means
// unrestricted (root superadmin); otherwise global roles + that tenant's own.
func (s *RoleService) GetAll(ctx context.Context, scopeTenantID *string) ([]dto.RoleResponse, error) {
	roles, err := s.roleRepo.FindAll(ctx, scopeTenantID)
	if err != nil {
		return nil, err
	}

	var resps []dto.RoleResponse
	for _, r := range roles {
		resps = append(resps, dto.RoleResponse{
			ID:          r.ID,
			Name:        r.Name,
			Description: r.Description,
			TenantID:    r.TenantID,
			CreatedAt:   r.CreatedAt,
			UpdatedAt:   r.UpdatedAt,
		})
	}
	return resps, nil
}

func (s *RoleService) GetByID(ctx context.Context, id string) (*dto.RoleResponse, error) {
	r, err := s.roleRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	return &dto.RoleResponse{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
		TenantID:    r.TenantID,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}, nil
}

// Create creates a role. tenantID nil creates a global template role
// (root superadmin only); a non-nil tenantID scopes the role to that tenant.
func (s *RoleService) Create(ctx context.Context, req dto.CreateRoleRequest, tenantID *string) (*dto.RoleResponse, error) {
	r, err := s.roleRepo.Create(ctx, req, tenantID)
	if err != nil {
		return nil, err
	}
	return &dto.RoleResponse{ID: r.ID, Name: r.Name, Description: r.Description, TenantID: r.TenantID, CreatedAt: r.CreatedAt, UpdatedAt: r.UpdatedAt}, nil
}
func (s *RoleService) Update(ctx context.Context, id string, req dto.UpdateRoleRequest) error {
	err := s.roleRepo.Update(ctx, id, req)
	if s.invalidator != nil {
		_ = s.invalidator.InvalidateAll(ctx)
	}
	return err
}
func (s *RoleService) Delete(ctx context.Context, id string) error { return s.roleRepo.Delete(ctx, id) }
func (s *RoleService) Permissions(ctx context.Context) ([]domain.Permission, error) {
	return s.roleRepo.ListPermissions(ctx)
}
func (s *RoleService) CreatePermission(ctx context.Context, req dto.CreatePermissionRequest) (*domain.Permission, error) {
	return s.roleRepo.CreatePermission(ctx, req)
}
func (s *RoleService) UpdatePermission(ctx context.Context, id string, req dto.UpdatePermissionRequest) error {
	err := s.roleRepo.UpdatePermission(ctx, id, req)
	if s.invalidator != nil {
		_ = s.invalidator.InvalidateAll(ctx)
	}
	return err
}
func (s *RoleService) DeletePermission(ctx context.Context, id string) error {
	err := s.roleRepo.DeletePermission(ctx, id)
	if s.invalidator != nil {
		_ = s.invalidator.InvalidateAll(ctx)
	}
	return err
}
func (s *RoleService) SetPermissions(ctx context.Context, id string, ids []string) error {
	err := s.roleRepo.SetPermissions(ctx, id, ids)
	if s.invalidator != nil {
		_ = s.invalidator.InvalidateAll(ctx)
	}
	return err
}
func (s *RoleService) PermissionIDs(ctx context.Context, id string) ([]string, error) {
	return s.roleRepo.GetPermissionIDs(ctx, id)
}
