package service

import (
	"context"
	"errors"
	"testing"

	"venturo-skeleton-go/internal/modules/features/support/domain"
	"venturo-skeleton-go/internal/modules/features/support/dto"
)

type coverageRepo struct {
	createFn       func(context.Context, *domain.SupportMessage) error
	findAllFn      func(context.Context, *string, string, int, int) ([]*domain.SupportMessage, int64, error)
	updateStatusFn func(context.Context, string, string, *string) error
}

func (r *coverageRepo) Create(ctx context.Context, message *domain.SupportMessage) error {
	return r.createFn(ctx, message)
}
func (r *coverageRepo) FindAll(ctx context.Context, scope *string, status string, page, limit int) ([]*domain.SupportMessage, int64, error) {
	return r.findAllFn(ctx, scope, status, page, limit)
}
func (r *coverageRepo) UpdateStatus(ctx context.Context, id, status string, scope *string) error {
	return r.updateStatusFn(ctx, id, status, scope)
}

func TestSupportServiceCoverage(t *testing.T) {
	ctx := context.Background()
	tenant := "tenant-1"
	errExpected := errors.New("expected")
	message := &domain.SupportMessage{ID: "message-1", TenantID: &tenant, Status: domain.StatusPending}
	repo := &coverageRepo{
		createFn: func(_ context.Context, got *domain.SupportMessage) error {
			got.ID = message.ID
			return nil
		},
		findAllFn: func(_ context.Context, scope *string, status string, page, limit int) ([]*domain.SupportMessage, int64, error) {
			if scope == nil || *scope != tenant || status != domain.StatusPending || page != 2 || limit != 5 {
				t.Fatalf("unexpected list arguments: scope=%v status=%q page=%d limit=%d", scope, status, page, limit)
			}
			return []*domain.SupportMessage{message}, 1, nil
		},
		updateStatusFn: func(context.Context, string, string, *string) error { return errExpected },
	}
	NewSupportService(nil)
	svc := NewSupportServiceWithInterfaces(repo)
	if got, err := svc.Create(ctx, dto.CreateSupportMessageRequest{TenantID: tenant}); err != nil || got.TenantID == nil || *got.TenantID != tenant {
		t.Fatalf("Create() = %v, %v", got, err)
	}
	if got, total, err := svc.List(ctx, &tenant, dto.SupportMessageQuery{Status: domain.StatusPending, Page: 2, Limit: 5}); err != nil || total != 1 || len(got) != 1 {
		t.Fatalf("List() = %v, %d, %v", got, total, err)
	}
	if err := svc.UpdateStatus(ctx, message.ID, &tenant, dto.UpdateStatusRequest{Status: domain.StatusResolved}); !errors.Is(err, errExpected) {
		t.Fatalf("UpdateStatus() error = %v", err)
	}
	repo.createFn = func(context.Context, *domain.SupportMessage) error { return errExpected }
	if _, err := svc.Create(ctx, dto.CreateSupportMessageRequest{}); !errors.Is(err, errExpected) {
		t.Fatalf("Create() error = %v", err)
	}
	repo.findAllFn = func(context.Context, *string, string, int, int) ([]*domain.SupportMessage, int64, error) {
		return nil, 0, errExpected
	}
	if _, _, err := svc.List(ctx, nil, dto.SupportMessageQuery{}); !errors.Is(err, errExpected) {
		t.Fatalf("List() error = %v", err)
	}
}
