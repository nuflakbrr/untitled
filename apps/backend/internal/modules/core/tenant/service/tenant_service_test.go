package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"venturo-skeleton-go/internal/modules/core/tenant/domain"
	"venturo-skeleton-go/internal/modules/core/tenant/dto"
)

// ─── Mock Repo ────────────────────────────────────────────────────────────────

type mockTenantRepo struct {
	findAllFn              func(context.Context, dto.TenantQueryFilter) ([]*domain.Tenant, int64, error)
	findByIDFn             func(context.Context, string) (*domain.Tenant, error)
	findBySlugFn           func(context.Context, string) (*domain.Tenant, error)
	createFn               func(context.Context, *domain.Tenant) error
	updateFn               func(context.Context, *domain.Tenant) error
	deleteFn               func(context.Context, string) error
	getPaymentGatewayFn    func(context.Context, string) (*domain.TenantPaymentGateway, error)
	upsertPaymentGatewayFn func(context.Context, *domain.TenantPaymentGateway) error
}

func (m *mockTenantRepo) FindAll(ctx context.Context, f dto.TenantQueryFilter) ([]*domain.Tenant, int64, error) {
	if m.findAllFn != nil {
		return m.findAllFn(ctx, f)
	}
	return nil, 0, nil
}
func (m *mockTenantRepo) FindByID(ctx context.Context, id string) (*domain.Tenant, error) {
	if m.findByIDFn != nil {
		return m.findByIDFn(ctx, id)
	}
	return nil, errors.New("not found")
}
func (m *mockTenantRepo) FindBySlug(ctx context.Context, slug string) (*domain.Tenant, error) {
	if m.findBySlugFn != nil {
		return m.findBySlugFn(ctx, slug)
	}
	return nil, errors.New("not found")
}
func (m *mockTenantRepo) Create(ctx context.Context, t *domain.Tenant) error {
	if m.createFn != nil {
		return m.createFn(ctx, t)
	}
	return nil
}
func (m *mockTenantRepo) Update(ctx context.Context, t *domain.Tenant) error {
	if m.updateFn != nil {
		return m.updateFn(ctx, t)
	}
	return nil
}
func (m *mockTenantRepo) Delete(ctx context.Context, id string) error {
	if m.deleteFn != nil {
		return m.deleteFn(ctx, id)
	}
	return nil
}
func (m *mockTenantRepo) GetPaymentGateway(ctx context.Context, tenantID string) (*domain.TenantPaymentGateway, error) {
	if m.getPaymentGatewayFn != nil {
		return m.getPaymentGatewayFn(ctx, tenantID)
	}
	return nil, nil
}
func (m *mockTenantRepo) UpsertPaymentGateway(ctx context.Context, pg *domain.TenantPaymentGateway) error {
	if m.upsertPaymentGatewayFn != nil {
		return m.upsertPaymentGatewayFn(ctx, pg)
	}
	return nil
}

// ─── Helper ───────────────────────────────────────────────────────────────────

func sampleTenant(id, name, slug, code string, ttype domain.TenantType) *domain.Tenant {
	return &domain.Tenant{
		ID:        id,
		Name:      name,
		Slug:      slug,
		Code:      code,
		Type:      ttype,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func newTestSvc(repo *mockTenantRepo) *TenantService {
	return NewTenantServiceWithInterface(repo)
}

// ─── GetAll ───────────────────────────────────────────────────────────────────

func TestGetAll_ReturnsTenants(t *testing.T) {
	tenants := []*domain.Tenant{
		sampleTenant("id-1", "Rektorat", "rektorat", "UMN", domain.TenantTypeRoot),
		sampleTenant("id-2", "FASILKOM", "fasilkom", "FASILKOM", domain.TenantTypeFaculty),
	}
	svc := newTestSvc(&mockTenantRepo{
		findAllFn: func(_ context.Context, _ dto.TenantQueryFilter) ([]*domain.Tenant, int64, error) {
			return tenants, 2, nil
		},
	})

	list, total, err := svc.GetAll(context.Background(), dto.TenantQueryFilter{Page: 1, Limit: 20})
	if err != nil {
		t.Fatalf("GetAll() error = %v", err)
	}
	if total != 2 {
		t.Errorf("total = %d, want 2", total)
	}
	if len(list) != 2 {
		t.Errorf("len(list) = %d, want 2", len(list))
	}
	if list[0].Slug != "rektorat" {
		t.Errorf("list[0].Slug = %q, want rektorat", list[0].Slug)
	}
}

func TestGetAll_EmptyResult(t *testing.T) {
	svc := newTestSvc(&mockTenantRepo{
		findAllFn: func(_ context.Context, _ dto.TenantQueryFilter) ([]*domain.Tenant, int64, error) {
			return []*domain.Tenant{}, 0, nil
		},
	})

	list, total, err := svc.GetAll(context.Background(), dto.TenantQueryFilter{})
	if err != nil {
		t.Fatalf("GetAll() error = %v", err)
	}
	if total != 0 || len(list) != 0 {
		t.Errorf("expected empty result, got total=%d len=%d", total, len(list))
	}
}

// ─── GetByID ──────────────────────────────────────────────────────────────────

func TestGetByID_Found(t *testing.T) {
	tenant := sampleTenant("c9711506", "Rektorat", "rektorat", "UMN", domain.TenantTypeRoot)
	svc := newTestSvc(&mockTenantRepo{
		findByIDFn: func(_ context.Context, _ string) (*domain.Tenant, error) {
			return tenant, nil
		},
	})

	resp, err := svc.GetByID(context.Background(), "c9711506")
	if err != nil {
		t.Fatalf("GetByID() error = %v", err)
	}
	if resp.Slug != "rektorat" {
		t.Errorf("Slug = %q, want rektorat", resp.Slug)
	}
	if resp.Type != "ROOT" {
		t.Errorf("Type = %q, want ROOT", resp.Type)
	}
}

func TestGetByID_NotFound(t *testing.T) {
	svc := newTestSvc(&mockTenantRepo{
		findByIDFn: func(_ context.Context, _ string) (*domain.Tenant, error) {
			return nil, errors.New("tenant not found")
		},
	})

	_, err := svc.GetByID(context.Background(), "nonexistent")
	if err == nil {
		t.Error("GetByID(nonexistent) should return error, got nil")
	}
}

// ─── GetBySlug ────────────────────────────────────────────────────────────────

func TestGetBySlug_Found(t *testing.T) {
	tenant := sampleTenant("id-2", "FASILKOM", "fasilkom", "FASILKOM", domain.TenantTypeFaculty)
	svc := newTestSvc(&mockTenantRepo{
		findBySlugFn: func(_ context.Context, slug string) (*domain.Tenant, error) {
			if slug == "fasilkom" {
				return tenant, nil
			}
			return nil, errors.New("not found")
		},
	})

	resp, err := svc.GetBySlug(context.Background(), "fasilkom")
	if err != nil {
		t.Fatalf("GetBySlug() error = %v", err)
	}
	if resp.Code != "FASILKOM" {
		t.Errorf("Code = %q, want FASILKOM", resp.Code)
	}
}

func TestGetBySlug_NotFound(t *testing.T) {
	svc := newTestSvc(&mockTenantRepo{})

	_, err := svc.GetBySlug(context.Background(), "doesnotexist")
	if err == nil {
		t.Error("GetBySlug(nonexistent) should return error, got nil")
	}
}

// ─── Create ───────────────────────────────────────────────────────────────────

func TestCreate_Success(t *testing.T) {
	svc := newTestSvc(&mockTenantRepo{
		findBySlugFn: func(_ context.Context, _ string) (*domain.Tenant, error) {
			return nil, errors.New("not found") // slug is free
		},
		createFn: func(_ context.Context, t *domain.Tenant) error {
			t.ID = "new-id"
			return nil
		},
	})

	resp, err := svc.Create(context.Background(), dto.CreateTenantRequest{
		Name: "  Fakultas Hukum  ",
		Slug: "  FH  ",
		Code: "  fh  ",
		Type: "FACULTY",
	})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}
	if resp.Slug != "fh" {
		t.Errorf("Slug should be lowercased+trimmed, got %q", resp.Slug)
	}
	if resp.Code != "FH" {
		t.Errorf("Code should be uppercased+trimmed, got %q", resp.Code)
	}
	if resp.Name != "Fakultas Hukum" {
		t.Errorf("Name should be trimmed, got %q", resp.Name)
	}
}

func TestCreate_DuplicateSlug(t *testing.T) {
	existing := sampleTenant("id-old", "FH Lama", "fh", "FHLAMA", domain.TenantTypeFaculty)
	svc := newTestSvc(&mockTenantRepo{
		findBySlugFn: func(_ context.Context, _ string) (*domain.Tenant, error) {
			return existing, nil // slug already taken
		},
	})

	_, err := svc.Create(context.Background(), dto.CreateTenantRequest{
		Name: "Fakultas Hukum Baru",
		Slug: "fh",
		Code: "FHB",
		Type: "FACULTY",
	})
	if !errors.Is(err, ErrSlugAlreadyExists) {
		t.Errorf("error = %v, want ErrSlugAlreadyExists", err)
	}
}

// ─── Delete ───────────────────────────────────────────────────────────────────

func TestDelete_Success(t *testing.T) {
	var captured string
	svc := newTestSvc(&mockTenantRepo{
		deleteFn: func(_ context.Context, id string) error {
			captured = id
			return nil
		},
	})

	if err := svc.Delete(context.Background(), "to-delete"); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}
	if captured != "to-delete" {
		t.Errorf("deleted ID = %q, want to-delete", captured)
	}
}

// ─── Update ───────────────────────────────────────────────────────────────────

func TestUpdate_SlugNormalized(t *testing.T) {
	tenant := sampleTenant("id-1", "Rektorat", "rektorat", "UMN", domain.TenantTypeRoot)
	svc := newTestSvc(&mockTenantRepo{
		findByIDFn: func(_ context.Context, _ string) (*domain.Tenant, error) {
			return tenant, nil
		},
		findBySlugFn: func(_ context.Context, _ string) (*domain.Tenant, error) {
			return nil, errors.New("not found") // new slug is free
		},
		updateFn: func(_ context.Context, _ *domain.Tenant) error {
			return nil
		},
	})

	newSlug := "  REKTORAT-BARU  "
	resp, err := svc.Update(context.Background(), "id-1", dto.UpdateTenantRequest{
		Slug: &newSlug,
	})
	if err != nil {
		t.Fatalf("Update() error = %v", err)
	}
	if resp.Slug != "rektorat-baru" {
		t.Errorf("Slug should be lower+trimmed, got %q", resp.Slug)
	}
}
