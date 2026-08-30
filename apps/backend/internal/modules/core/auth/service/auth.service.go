package service

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"venturo-skeleton-go/internal/config"
	"venturo-skeleton-go/internal/modules/core/auth/dto"
	tenantDomain "venturo-skeleton-go/internal/modules/core/tenant/domain"
	tenantDto "venturo-skeleton-go/internal/modules/core/tenant/dto"
	tenantRepo "venturo-skeleton-go/internal/modules/core/tenant/repository"
	userDomain "venturo-skeleton-go/internal/modules/core/user/domain"
	userRepo "venturo-skeleton-go/internal/modules/core/user/repository"
	"venturo-skeleton-go/pkg/jwt"

	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUserBanned         = errors.New("user account has been banned")
	ErrTenantNotFound     = errors.New("tenant not found")
	ErrUnauthorizedSwitch = errors.New("you do not have permission to switch to this tenant")
)

const (
	RolePesertaID = "096401d0-a130-4d9b-a596-d0cb26554402"
)

// PermissionReader is satisfied by authz.AuthzService.
type PermissionReader interface {
	GetPermissions(ctx context.Context, userID, tenantID string) ([]string, error)
}

// UserRepository is satisfied by *userRepo.UserRepository (and mocks in tests).
type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*userDomain.User, error)
	FindByID(ctx context.Context, id string) (*userDomain.User, error)
	Create(ctx context.Context, user *userDomain.User, password string) error
}

type TenantAccessReader interface {
	HasTenantAccess(ctx context.Context, userID, tenantID string) (bool, error)
	ListAccessibleTenants(ctx context.Context, userID string) ([]*userDomain.TenantAccess, error)
}

// TenantRepository is satisfied by *tenantRepo.TenantRepository (and mocks in tests).
type TenantRepository interface {
	FindByID(ctx context.Context, id string) (*tenantDomain.Tenant, error)
	FindBySlug(ctx context.Context, slug string) (*tenantDomain.Tenant, error)
	FindAll(ctx context.Context, filter tenantDto.TenantQueryFilter) ([]*tenantDomain.Tenant, int64, error)
}

type AuthService struct {
	userRepo         UserRepository
	tenantRepo       TenantRepository
	cfg              *config.Config
	permissionReader PermissionReader
}

// NewAuthService wires concrete repository implementations.
func NewAuthService(
	uRepo *userRepo.UserRepository,
	tRepo *tenantRepo.TenantRepository,
	cfg *config.Config,
) *AuthService {
	return &AuthService{
		userRepo:   uRepo,
		tenantRepo: tRepo,
		cfg:        cfg,
	}
}

// NewAuthServiceWithInterfaces allows injection of mock repositories (used in tests).
func NewAuthServiceWithInterfaces(uRepo UserRepository, tRepo TenantRepository, cfg *config.Config) *AuthService {
	return &AuthService{
		userRepo:   uRepo,
		tenantRepo: tRepo,
		cfg:        cfg,
	}
}

func (s *AuthService) SetPermissionReader(pr PermissionReader) {
	s.permissionReader = pr
}

// SignIn authenticates a user and returns a multi-tenant JWT
func (s *AuthService) SignIn(ctx context.Context, req dto.SignInRequest) (*dto.SignInResponse, error) {
	user, err := s.userRepo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if user.IsBanned() {
		return nil, ErrUserBanned
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	// Resolve Tenant Info
	var tenantInfo *dto.TenantInfo
	tenantID := ""
	tenantName := ""
	tenantSlug := ""
	tenantCode := ""
	tenantType := ""

	if user.TenantID != nil && *user.TenantID != "" {
		tenantID = *user.TenantID
		t, err := s.tenantRepo.FindByID(ctx, tenantID)
		if err == nil && t != nil {
			tenantName = t.Name
			tenantSlug = t.Slug
			tenantCode = t.Code
			tenantType = string(t.Type)
			tenantInfo = &dto.TenantInfo{
				ID:      t.ID,
				Name:    t.Name,
				Slug:    t.Slug,
				Code:    t.Code,
				Type:    string(t.Type),
				LogoURL: t.LogoURL,
			}
		}
	}

	isSuperAdmin := user.Role == "root_superadmin"

	// Fetch permissions
	var perms []string
	if s.permissionReader != nil {
		perms, _ = s.permissionReader.GetPermissions(ctx, user.ID, tenantID)
	}
	if perms == nil {
		perms = []string{}
	}

	roles := []string{user.Role}

	// Generate JWT Access Token
	token, err := jwt.GenerateToken(
		user.ID, tenantID, tenantName, tenantSlug, tenantCode, tenantType,
		user.Email, user.Name, user.Role, user.RoleID, isSuperAdmin, roles,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &dto.SignInResponse{
		AccessToken:  token,
		RefreshToken: token, // Single token architecture with long-lived session
		TokenType:    "Bearer",
		ExpiresIn:    86400,
		User: dto.UserInfo{
			ID:            user.ID,
			Email:         user.Email,
			Name:          user.Name,
			TenantID:      user.TenantID,
			EmailVerified: user.EmailVerified,
			Image:         user.Image,
			Role:          user.Role,
			RoleID:        user.RoleID,
		},
		Tenant:      tenantInfo,
		Role:        user.Role,
		Permissions: perms,
	}, nil
}

// SignUp registers a new universal participant account
func (s *AuthService) SignUp(ctx context.Context, req dto.SignUpRequest) (*dto.SignUpResponse, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	user := &userDomain.User{
		TenantID:      nil, // Universal participant
		Email:         strings.ToLower(strings.TrimSpace(req.Email)),
		Name:          strings.TrimSpace(req.Name),
		EmailVerified: true,
		Role:          "peserta",
		RoleID:        RolePesertaID,
	}

	if err := s.userRepo.Create(ctx, user, string(hashedPassword)); err != nil {
		return nil, err
	}

	return &dto.SignUpResponse{
		Message: "Registrasi akun peserta berhasil",
		User: dto.UserInfo{
			ID:            user.ID,
			Email:         user.Email,
			Name:          user.Name,
			TenantID:      nil,
			EmailVerified: user.EmailVerified,
			Role:          user.Role,
			RoleID:        user.RoleID,
		},
	}, nil
}

// GetMe returns caller profile, active tenant info, and permissions
func (s *AuthService) GetMe(ctx context.Context, userID, activeTenantID string) (*dto.MeResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	var tenantInfo *dto.TenantInfo
	targetTenantID := activeTenantID
	if targetTenantID == "" && user.TenantID != nil {
		targetTenantID = *user.TenantID
	}

	if targetTenantID != "" {
		t, err := s.tenantRepo.FindByID(ctx, targetTenantID)
		if err == nil && t != nil {
			tenantInfo = &dto.TenantInfo{
				ID:      t.ID,
				Name:    t.Name,
				Slug:    t.Slug,
				Code:    t.Code,
				Type:    string(t.Type),
				LogoURL: t.LogoURL,
			}
		}
	}

	var perms []string
	if s.permissionReader != nil {
		perms, _ = s.permissionReader.GetPermissions(ctx, user.ID, targetTenantID)
	}
	if perms == nil {
		perms = []string{}
	}

	return &dto.MeResponse{
		User: dto.UserInfo{
			ID:            user.ID,
			Email:         user.Email,
			Name:          user.Name,
			TenantID:      user.TenantID,
			EmailVerified: user.EmailVerified,
			Image:         user.Image,
			Role:          user.Role,
			RoleID:        user.RoleID,
		},
		Tenant:       tenantInfo,
		Role:         user.Role,
		Permissions:  perms,
		IsSuperAdmin: user.Role == "root_superadmin",
	}, nil
}

// SwitchTenant switches active tenant context for Root Superadmin
func (s *AuthService) SwitchTenant(ctx context.Context, userID, targetTenantID string) (*dto.SwitchTenantResponse, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	// Only Root Superadmin can switch tenant arbitrarily
	if user.Role != "root_superadmin" {
		accessReader, ok := s.userRepo.(TenantAccessReader)
		if !ok {
			return nil, ErrUnauthorizedSwitch
		}
		allowed, accessErr := accessReader.HasTenantAccess(ctx, userID, targetTenantID)
		if accessErr != nil || !allowed {
			return nil, ErrUnauthorizedSwitch
		}
	}

	targetTenant, err := s.tenantRepo.FindByID(ctx, targetTenantID)
	if err != nil {
		return nil, ErrTenantNotFound
	}

	isSuperAdmin := user.Role == "root_superadmin"
	roles := []string{user.Role}

	var perms []string
	if s.permissionReader != nil {
		perms, _ = s.permissionReader.GetPermissions(ctx, user.ID, targetTenant.ID)
	}
	if perms == nil {
		perms = []string{}
	}

	token, err := jwt.GenerateToken(
		user.ID, targetTenant.ID, targetTenant.Name, targetTenant.Slug, targetTenant.Code, string(targetTenant.Type),
		user.Email, user.Name, user.Role, user.RoleID, isSuperAdmin, roles,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token: %w", err)
	}

	return &dto.SwitchTenantResponse{
		AccessToken: token,
		TokenType:   "Bearer",
		ExpiresIn:   86400,
		Tenant: dto.TenantInfo{
			ID:      targetTenant.ID,
			Name:    targetTenant.Name,
			Slug:    targetTenant.Slug,
			Code:    targetTenant.Code,
			Type:    string(targetTenant.Type),
			LogoURL: targetTenant.LogoURL,
		},
		Permissions: perms,
	}, nil
}

// MyTenants lists tenants the caller can switch into: every tenant for a
// Root Superadmin, or only the tenants explicitly granted via
// user_has_tenants for everyone else.
func (s *AuthService) MyTenants(ctx context.Context, userID, role string) ([]*userDomain.TenantAccess, error) {
	if role == "root_superadmin" {
		tenants, _, err := s.tenantRepo.FindAll(ctx, tenantDto.TenantQueryFilter{Page: 1, Limit: 500})
		if err != nil {
			return nil, err
		}
		result := make([]*userDomain.TenantAccess, 0, len(tenants))
		for _, t := range tenants {
			result = append(result, &userDomain.TenantAccess{
				TenantID:   t.ID,
				TenantName: t.Name,
				TenantSlug: t.Slug,
				TenantCode: t.Code,
				TenantType: string(t.Type),
			})
		}
		return result, nil
	}

	accessReader, ok := s.userRepo.(TenantAccessReader)
	if !ok {
		return []*userDomain.TenantAccess{}, nil
	}
	tenants, err := accessReader.ListAccessibleTenants(ctx, userID)
	if err != nil {
		return nil, err
	}
	if tenants == nil {
		tenants = []*userDomain.TenantAccess{}
	}
	return tenants, nil
}
