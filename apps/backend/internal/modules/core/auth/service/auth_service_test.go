package service

import (
	"context"
	"errors"
	"os"
	"testing"
	"time"

	authDto "venturo-skeleton-go/internal/modules/core/auth/dto"
	tenantDomain "venturo-skeleton-go/internal/modules/core/tenant/domain"
	tenantDto "venturo-skeleton-go/internal/modules/core/tenant/dto"
	userDomain "venturo-skeleton-go/internal/modules/core/user/domain"

	"golang.org/x/crypto/bcrypt"
)

// ─── Mock Implementations ────────────────────────────────────────────────────

type mockUserRepo struct {
	findByEmailFn func(ctx context.Context, email string) (*userDomain.User, error)
	findByIDFn    func(ctx context.Context, id string) (*userDomain.User, error)
	createFn      func(ctx context.Context, user *userDomain.User, password string) error
}

func (m *mockUserRepo) FindByEmail(ctx context.Context, email string) (*userDomain.User, error) {
	if m.findByEmailFn != nil {
		return m.findByEmailFn(ctx, email)
	}
	return nil, errors.New("not found")
}

func (m *mockUserRepo) FindByID(ctx context.Context, id string) (*userDomain.User, error) {
	if m.findByIDFn != nil {
		return m.findByIDFn(ctx, id)
	}
	return nil, errors.New("not found")
}

func (m *mockUserRepo) Create(ctx context.Context, user *userDomain.User, password string) error {
	if m.createFn != nil {
		return m.createFn(ctx, user, password)
	}
	return nil
}

type mockTenantRepo struct {
	findByIDFn   func(ctx context.Context, id string) (*tenantDomain.Tenant, error)
	findBySlugFn func(ctx context.Context, slug string) (*tenantDomain.Tenant, error)
	findAllFn    func(ctx context.Context, filter tenantDto.TenantQueryFilter) ([]*tenantDomain.Tenant, int64, error)
}

func (m *mockTenantRepo) FindByID(ctx context.Context, id string) (*tenantDomain.Tenant, error) {
	if m.findByIDFn != nil {
		return m.findByIDFn(ctx, id)
	}
	return nil, errors.New("not found")
}

func (m *mockTenantRepo) FindBySlug(ctx context.Context, slug string) (*tenantDomain.Tenant, error) {
	if m.findBySlugFn != nil {
		return m.findBySlugFn(ctx, slug)
	}
	return nil, errors.New("not found")
}

func (m *mockTenantRepo) FindAll(ctx context.Context, filter tenantDto.TenantQueryFilter) ([]*tenantDomain.Tenant, int64, error) {
	if m.findAllFn != nil {
		return m.findAllFn(ctx, filter)
	}
	return nil, 0, nil
}

type mockPermReader struct {
	perms []string
	err   error
}

func (m *mockPermReader) GetPermissions(_ context.Context, _, _ string) ([]string, error) {
	return m.perms, m.err
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func setupJWTEnv(t *testing.T) {
	t.Helper()
	os.Setenv("JWT_SECRET", "test-super-secret-at-least-32-chars-long!")
	t.Cleanup(func() { os.Unsetenv("JWT_SECRET") })
}

func hashPwd(t *testing.T, plain string) string {
	t.Helper()
	b, err := bcrypt.GenerateFromPassword([]byte(plain), bcrypt.MinCost)
	if err != nil {
		t.Fatalf("bcrypt.GenerateFromPassword: %v", err)
	}
	return string(b)
}

func ptr(s string) *string { return &s }

func rektoratTenant() *tenantDomain.Tenant {
	return &tenantDomain.Tenant{
		ID:        "c9711506-d356-4704-a32e-0543dfe3e104",
		Name:      "Universitas Mandiri Nusantara (Rektorat)",
		Slug:      "rektorat",
		Code:      "UMN",
		Type:      tenantDomain.TenantTypeRoot,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func newSvc(u UserRepository, t TenantRepository) *AuthService {
	return NewAuthServiceWithInterfaces(u, t, nil)
}

// ─── SignIn Tests ─────────────────────────────────────────────────────────────

func TestSignIn_Success(t *testing.T) {
	setupJWTEnv(t)

	tid := "c9711506-d356-4704-a32e-0543dfe3e104"
	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, email string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:           "48e8167e-0105-4242-b6db-9bb12dc84bce",
				Email:        email,
				Name:         "Superadmin Universitas",
				Role:         "root_superadmin",
				RoleID:       "22b345bc-6566-4a25-86be-a4b63de6353e",
				TenantID:     &tid,
				PasswordHash: hashPwd(t, "password"),
				Banned:       false,
			}, nil
		},
	}
	tRepo := &mockTenantRepo{
		findByIDFn: func(_ context.Context, _ string) (*tenantDomain.Tenant, error) {
			return rektoratTenant(), nil
		},
	}

	svc := newSvc(uRepo, tRepo)
	svc.SetPermissionReader(&mockPermReader{perms: []string{"admin.access", "events.read"}})

	resp, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "superadmin.univ@untitled.ac.id",
		Password: "password",
	})

	if err != nil {
		t.Fatalf("SignIn() unexpected error: %v", err)
	}
	if resp.AccessToken == "" {
		t.Error("expected access_token, got empty string")
	}
	if resp.Role != "root_superadmin" {
		t.Errorf("Role = %q, want %q", resp.Role, "root_superadmin")
	}
	if resp.Tenant == nil {
		t.Fatal("expected tenant in response, got nil")
	}
	if resp.Tenant.Slug != "rektorat" {
		t.Errorf("Tenant.Slug = %q, want %q", resp.Tenant.Slug, "rektorat")
	}
	if len(resp.Permissions) != 2 {
		t.Errorf("Permissions count = %d, want 2", len(resp.Permissions))
	}
}

func TestSignIn_InvalidPassword(t *testing.T) {
	setupJWTEnv(t)

	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, email string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:           "user-abc",
				Email:        email,
				PasswordHash: hashPwd(t, "correct-password"),
				Banned:       false,
			}, nil
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	_, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "test@untitled.ac.id",
		Password: "wrong-password",
	})

	if !errors.Is(err, ErrInvalidCredentials) {
		t.Errorf("error = %v, want ErrInvalidCredentials", err)
	}
}

func TestSignIn_UserNotFound(t *testing.T) {
	setupJWTEnv(t)

	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, _ string) (*userDomain.User, error) {
			return nil, errors.New("user not found in db")
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	_, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "nobody@untitled.ac.id",
		Password: "password",
	})

	if !errors.Is(err, ErrInvalidCredentials) {
		t.Errorf("error = %v, want ErrInvalidCredentials", err)
	}
}

func TestSignIn_PermanentlyBannedUser(t *testing.T) {
	setupJWTEnv(t)

	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, email string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:           "banned-user",
				Email:        email,
				PasswordHash: hashPwd(t, "password"),
				Banned:       true,
				BanExpires:   nil,
			}, nil
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	_, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "banned@untitled.ac.id",
		Password: "password",
	})

	if !errors.Is(err, ErrUserBanned) {
		t.Errorf("error = %v, want ErrUserBanned", err)
	}
}

func TestSignIn_TemporaryBan_NotExpired(t *testing.T) {
	setupJWTEnv(t)

	future := time.Now().Add(24 * time.Hour)
	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, email string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:           "temp-banned",
				Email:        email,
				PasswordHash: hashPwd(t, "password"),
				Banned:       true,
				BanExpires:   &future,
			}, nil
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	_, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "temp@untitled.ac.id",
		Password: "password",
	})

	if !errors.Is(err, ErrUserBanned) {
		t.Errorf("error = %v, want ErrUserBanned (active temporary ban)", err)
	}
}

func TestSignIn_TemporaryBan_Expired_AllowsLogin(t *testing.T) {
	setupJWTEnv(t)

	past := time.Now().Add(-1 * time.Hour)
	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, email string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:           "expired-ban-user",
				Email:        email,
				PasswordHash: hashPwd(t, "password"),
				Banned:       true,
				BanExpires:   &past, // expired
			}, nil
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	_, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "expiredban@untitled.ac.id",
		Password: "password",
	})

	// Expired ban means user is NOT banned → should not hit ErrUserBanned
	if errors.Is(err, ErrUserBanned) {
		t.Error("SignIn with expired ban should NOT return ErrUserBanned")
	}
}

func TestSignIn_UniversalParticipant_NoTenant(t *testing.T) {
	setupJWTEnv(t)

	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, email string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:           "peserta-001",
				Email:        email,
				Name:         "Peserta Mandiri",
				Role:         "peserta",
				RoleID:       "096401d0-a130-4d9b-a596-d0cb26554402",
				TenantID:     nil,
				PasswordHash: hashPwd(t, "password"),
				Banned:       false,
			}, nil
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	resp, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "peserta@untitled.ac.id",
		Password: "password",
	})

	if err != nil {
		t.Fatalf("SignIn(peserta) unexpected error: %v", err)
	}
	if resp.Tenant != nil {
		t.Errorf("Tenant should be nil for universal participant, got %+v", resp.Tenant)
	}
	if resp.Role != "peserta" {
		t.Errorf("Role = %q, want %q", resp.Role, "peserta")
	}
}

// ─── SignUp Tests ─────────────────────────────────────────────────────────────

func TestSignUp_Success(t *testing.T) {
	uRepo := &mockUserRepo{
		createFn: func(_ context.Context, user *userDomain.User, _ string) error {
			user.ID = "new-user-id-001"
			return nil
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	resp, err := svc.SignUp(context.Background(), authDto.SignUpRequest{
		Email:    "  Newpeserta@Untitled.AC.ID  ",
		Name:     "  Peserta Baru  ",
		Password: "securepassword123",
	})

	if err != nil {
		t.Fatalf("SignUp() unexpected error: %v", err)
	}
	if resp.User.Email != "newpeserta@untitled.ac.id" {
		t.Errorf("Email should be lowercased and trimmed, got %q", resp.User.Email)
	}
	if resp.User.Name != "Peserta Baru" {
		t.Errorf("Name should be trimmed, got %q", resp.User.Name)
	}
	if resp.User.Role != "peserta" {
		t.Errorf("Role = %q, want %q", resp.User.Role, "peserta")
	}
	if resp.User.TenantID != nil {
		t.Error("TenantID should be nil for new peserta")
	}
}

func TestSignUp_EmailAlreadyTaken(t *testing.T) {
	errDup := errors.New("email already taken")
	uRepo := &mockUserRepo{
		createFn: func(_ context.Context, _ *userDomain.User, _ string) error {
			return errDup
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	_, err := svc.SignUp(context.Background(), authDto.SignUpRequest{
		Email:    "existing@untitled.ac.id",
		Name:     "Someone",
		Password: "securepassword123",
	})

	if err == nil {
		t.Error("SignUp with duplicate email should return error, got nil")
	}
}

// ─── SwitchTenant Tests ───────────────────────────────────────────────────────

func TestSwitchTenant_RootSuperadmin_Success(t *testing.T) {
	setupJWTEnv(t)

	targetTenantID := "20492a21-59c3-4edf-bb64-1eaa6cf11deb"
	uRepo := &mockUserRepo{
		findByIDFn: func(_ context.Context, _ string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:     "48e8167e-0105-4242-b6db-9bb12dc84bce",
				Email:  "superadmin.univ@untitled.ac.id",
				Name:   "Superadmin Universitas",
				Role:   "root_superadmin",
				RoleID: "22b345bc-6566-4a25-86be-a4b63de6353e",
			}, nil
		},
	}
	tRepo := &mockTenantRepo{
		findByIDFn: func(_ context.Context, id string) (*tenantDomain.Tenant, error) {
			return &tenantDomain.Tenant{
				ID:        id,
				Name:      "Fakultas Ilmu Komputer",
				Slug:      "fasilkom",
				Code:      "FASILKOM",
				Type:      tenantDomain.TenantTypeFaculty,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}, nil
		},
	}
	svc := newSvc(uRepo, tRepo)
	svc.SetPermissionReader(&mockPermReader{perms: []string{"events.read"}})

	resp, err := svc.SwitchTenant(context.Background(), "48e8167e-0105-4242-b6db-9bb12dc84bce", targetTenantID)

	if err != nil {
		t.Fatalf("SwitchTenant() unexpected error: %v", err)
	}
	if resp.AccessToken == "" {
		t.Error("expected access_token after tenant switch")
	}
	if resp.Tenant.Slug != "fasilkom" {
		t.Errorf("Tenant.Slug = %q, want %q", resp.Tenant.Slug, "fasilkom")
	}
}

func TestSwitchTenant_NonRootUser_Unauthorized(t *testing.T) {
	setupJWTEnv(t)

	myTenantID := "20492a21-59c3-4edf-bb64-1eaa6cf11deb"
	otherTenantID := "0ae41d16-bc49-4a88-b079-94def1b5b3ff" // different tenant

	uRepo := &mockUserRepo{
		findByIDFn: func(_ context.Context, _ string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:       "355f936d-e2b6-4ed3-8385-455115f605a3",
				Email:    "superadmin.fasilkom@untitled.ac.id",
				Role:     "superadmin",
				TenantID: &myTenantID,
			}, nil
		},
	}
	svc := newSvc(uRepo, &mockTenantRepo{})

	_, err := svc.SwitchTenant(context.Background(), "355f936d-e2b6-4ed3-8385-455115f605a3", otherTenantID)

	if !errors.Is(err, ErrUnauthorizedSwitch) {
		t.Errorf("error = %v, want ErrUnauthorizedSwitch", err)
	}
}

func TestSwitchTenant_TenantNotFound(t *testing.T) {
	setupJWTEnv(t)

	uRepo := &mockUserRepo{
		findByIDFn: func(_ context.Context, _ string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:   "user-root",
				Role: "root_superadmin",
			}, nil
		},
	}
	tRepo := &mockTenantRepo{
		findByIDFn: func(_ context.Context, _ string) (*tenantDomain.Tenant, error) {
			return nil, errors.New("not found")
		},
	}
	svc := newSvc(uRepo, tRepo)

	_, err := svc.SwitchTenant(context.Background(), "user-root", "nonexistent-tenant-id")

	if !errors.Is(err, ErrTenantNotFound) {
		t.Errorf("error = %v, want ErrTenantNotFound", err)
	}
}

// ─── PermissionReader Tests ───────────────────────────────────────────────────

func TestSignIn_NoPermissionReader_ReturnsEmptyPerms(t *testing.T) {
	setupJWTEnv(t)

	tid := "c9711506-d356-4704-a32e-0543dfe3e104"
	uRepo := &mockUserRepo{
		findByEmailFn: func(_ context.Context, email string) (*userDomain.User, error) {
			return &userDomain.User{
				ID:           "user-no-perms",
				Email:        email,
				Role:         "superadmin",
				RoleID:       "role-id",
				TenantID:     &tid,
				PasswordHash: hashPwd(t, "password"),
				Banned:       false,
			}, nil
		},
	}
	tRepo := &mockTenantRepo{
		findByIDFn: func(_ context.Context, _ string) (*tenantDomain.Tenant, error) {
			return rektoratTenant(), nil
		},
	}
	// NO permission reader set
	svc := newSvc(uRepo, tRepo)

	resp, err := svc.SignIn(context.Background(), authDto.SignInRequest{
		Email:    "noperms@untitled.ac.id",
		Password: "password",
	})

	if err != nil {
		t.Fatalf("SignIn() unexpected error: %v", err)
	}
	if resp.Permissions == nil {
		t.Error("Permissions should be empty slice, not nil")
	}
	if len(resp.Permissions) != 0 {
		t.Errorf("expected 0 permissions without reader, got %d", len(resp.Permissions))
	}
}
