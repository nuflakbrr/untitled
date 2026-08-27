package service

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"venturo-skeleton-go/internal/modules/core/user/domain"
	"venturo-skeleton-go/internal/modules/core/user/dto"
	"venturo-skeleton-go/internal/modules/core/user/repository"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCurrentPassword = errors.New("current password does not match")
	ErrCannotBanSelf           = errors.New("cannot ban your own account")
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// GetAll returns paginated user list
func (s *UserService) GetAll(ctx context.Context, params dto.UserQueryParams) ([]dto.UserResponse, int64, error) {
	users, total, err := s.repo.FindAll(ctx, params)
	if err != nil {
		return nil, 0, err
	}

	var responses []dto.UserResponse
	for _, u := range users {
		responses = append(responses, toUserResponse(u))
	}

	return responses, total, nil
}

// GetByID returns user by ID
func (s *UserService) GetByID(ctx context.Context, id string) (*dto.UserResponse, error) {
	u, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	resp := toUserResponse(u)
	return &resp, nil
}

// Create creates a new user with hashed password
func (s *UserService) Create(ctx context.Context, req dto.CreateUserRequest) (*dto.UserResponse, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	roleID := ""
	if req.RoleID != nil {
		roleID = *req.RoleID
	}

	user := &domain.User{
		TenantID:      req.TenantID,
		Email:         strings.ToLower(strings.TrimSpace(req.Email)),
		Name:          strings.TrimSpace(req.Name),
		EmailVerified: true,
		Role:          req.Role,
		RoleID:        roleID,
	}

	if err := s.repo.Create(ctx, user, string(hashedPassword)); err != nil {
		return nil, err
	}

	resp := toUserResponse(user)
	return &resp, nil
}

// Update updates user details
func (s *UserService) Update(ctx context.Context, id string, req dto.UpdateUserRequest) (*dto.UserResponse, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != nil {
		user.Name = strings.TrimSpace(*req.Name)
	}
	if req.Image != nil {
		user.Image = req.Image
	}
	if req.TenantID != nil {
		user.TenantID = req.TenantID
	}
	if req.Role != nil {
		user.Role = *req.Role
	}
	if req.RoleID != nil {
		user.RoleID = *req.RoleID
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	resp := toUserResponse(user)
	return &resp, nil
}

// UpdateMe updates profile of currently authenticated user
func (s *UserService) UpdateMe(ctx context.Context, id string, req dto.UpdateMeRequest) (*dto.UserResponse, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != nil {
		user.Name = strings.TrimSpace(*req.Name)
	}
	if req.Image != nil {
		user.Image = req.Image
	}

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, err
	}

	resp := toUserResponse(user)
	return &resp, nil
}

// ChangePassword verifies current password and sets new password
func (s *UserService) ChangePassword(ctx context.Context, id string, req dto.ChangePasswordRequest) error {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.CurrentPassword)); err != nil {
		return ErrInvalidCurrentPassword
	}

	newHash, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		return fmt.Errorf("failed to hash password: %w", err)
	}

	return s.repo.UpdatePassword(ctx, id, string(newHash))
}

// BanUser bans a user
func (s *UserService) BanUser(ctx context.Context, actorID, targetID string, req dto.BanUserRequest) error {
	if actorID == targetID {
		return ErrCannotBanSelf
	}
	return s.repo.BanUser(ctx, targetID, req.Reason, req.ExpiresAt)
}

// UnbanUser unbans a user
func (s *UserService) UnbanUser(ctx context.Context, targetID string) error {
	return s.repo.UnbanUser(ctx, targetID)
}

func toUserResponse(u *domain.User) dto.UserResponse {
	return dto.UserResponse{
		ID:            u.ID,
		TenantID:      u.TenantID,
		TenantName:    u.TenantName,
		TenantCode:    u.TenantCode,
		Email:         u.Email,
		Name:          u.Name,
		EmailVerified: u.EmailVerified,
		Image:         u.Image,
		Role:          u.Role,
		RoleID:        u.RoleID,
		Banned:        u.Banned,
		BanReason:     u.BanReason,
		BanExpires:    u.BanExpires,
		CreatedAt:     u.CreatedAt,
		UpdatedAt:     u.UpdatedAt,
	}
}
