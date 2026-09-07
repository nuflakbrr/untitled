package service

import (
	"context"
	"testing"

	"venturo-skeleton-go/internal/modules/features/support/domain"
	"venturo-skeleton-go/internal/modules/features/support/dto"
)

type fakeRepo struct {
	created      *domain.SupportMessage
	lastScope    *string
	lastStatus   string
	updateStatFn func(ctx context.Context, id, status string, scopeTenantID *string) error
}

func (f *fakeRepo) Create(_ context.Context, m *domain.SupportMessage) error {
	m.ID = "support-1"
	f.created = m
	return nil
}
func (f *fakeRepo) FindAll(_ context.Context, scopeTenantID *string, status string, _, _ int) ([]*domain.SupportMessage, int64, error) {
	f.lastScope, f.lastStatus = scopeTenantID, status
	return nil, 0, nil
}
func (f *fakeRepo) UpdateStatus(ctx context.Context, id, status string, scopeTenantID *string) error {
	if f.updateStatFn != nil {
		return f.updateStatFn(ctx, id, status, scopeTenantID)
	}
	return nil
}

func TestCreate_NeverAcceptsClientSuppliedUserID(t *testing.T) {
	repo := &fakeRepo{}
	svc := NewSupportServiceWithInterfaces(repo)

	resp, err := svc.Create(context.Background(), dto.CreateSupportMessageRequest{
		Email: "peserta@example.com", Phone: "0812345678", Name: "Budi",
		Title: "Tidak bisa daftar", Category: "registration", Chronology: "Sudah mencoba berkali-kali tapi gagal terus",
	})
	if err != nil {
		t.Fatalf("Create: %v", err)
	}
	if resp.UserID != nil {
		t.Fatalf("public support submission must never carry a user_id, got %v", *resp.UserID)
	}
	if resp.Status != domain.StatusPending {
		t.Fatalf("expected new message to default to PENDING, got %s", resp.Status)
	}
}

func TestList_PassesTenantScopeAndStatusFilter(t *testing.T) {
	repo := &fakeRepo{}
	svc := NewSupportServiceWithInterfaces(repo)

	tenant := "tenant-fasilkom"
	if _, _, err := svc.List(context.Background(), &tenant, dto.SupportMessageQuery{Status: domain.StatusResolved}); err != nil {
		t.Fatalf("List: %v", err)
	}
	if repo.lastScope == nil || *repo.lastScope != "tenant-fasilkom" {
		t.Fatalf("expected tenant scope to reach repository, got %v", repo.lastScope)
	}
	if repo.lastStatus != domain.StatusResolved {
		t.Fatalf("expected status filter to reach repository, got %q", repo.lastStatus)
	}
}

func TestUpdateStatus_ScopedToTenant(t *testing.T) {
	repo := &fakeRepo{}
	var seenScope *string
	repo.updateStatFn = func(_ context.Context, id, status string, scopeTenantID *string) error {
		seenScope = scopeTenantID
		return nil
	}
	svc := NewSupportServiceWithInterfaces(repo)

	tenant := "tenant-fasilkom"
	if err := svc.UpdateStatus(context.Background(), "support-1", &tenant, dto.UpdateStatusRequest{Status: domain.StatusInProgress}); err != nil {
		t.Fatalf("UpdateStatus: %v", err)
	}
	if seenScope == nil || *seenScope != "tenant-fasilkom" {
		t.Fatalf("expected update to be scoped to caller's tenant, got %v", seenScope)
	}
}
