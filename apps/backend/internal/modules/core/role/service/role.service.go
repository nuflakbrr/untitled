package service

import (
	"context"

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

func (s *RoleService) GetAll(ctx context.Context) ([]dto.RoleResponse, error) {
	roles, err := s.roleRepo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var resps []dto.RoleResponse
	for _, r := range roles {
		resps = append(resps, dto.RoleResponse{
			ID:          r.ID,
			Name:        r.Name,
			Description: r.Description,
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
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}, nil
}
