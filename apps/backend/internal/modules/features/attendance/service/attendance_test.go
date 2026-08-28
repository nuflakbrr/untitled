package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"venturo-skeleton-go/internal/modules/features/attendance/domain"
	"venturo-skeleton-go/internal/modules/features/attendance/dto"
	"venturo-skeleton-go/internal/modules/features/attendance/repository"
)

type fakeRepo struct {
	scanFn         func(ctx context.Context, qrToken, eventID, scannerID string, scopeTenantID *string) (*domain.Attendance, error)
	statsFn        func(ctx context.Context, eventID string, scopeTenantID *string) (*domain.EventStats, error)
	lastScopeSeen  *string
	scopeWasCalled bool
}

func (f *fakeRepo) Scan(ctx context.Context, qrToken, eventID, scannerID string, scopeTenantID *string) (*domain.Attendance, error) {
	f.lastScopeSeen, f.scopeWasCalled = scopeTenantID, true
	return f.scanFn(ctx, qrToken, eventID, scannerID, scopeTenantID)
}

func (f *fakeRepo) StatsByEvent(ctx context.Context, eventID string, scopeTenantID *string) (*domain.EventStats, error) {
	return f.statsFn(ctx, eventID, scopeTenantID)
}

func TestScan_SuccessReturnsResponse(t *testing.T) {
	repo := &fakeRepo{scanFn: func(context.Context, string, string, string, *string) (*domain.Attendance, error) {
		return &domain.Attendance{RegistrationID: "reg-1", ParticipantName: "Budi", Status: domain.StatusSuccess, ScanTime: time.Now()}, nil
	}}
	svc := NewAttendanceServiceWithInterfaces(repo)

	resp, err := svc.Scan(context.Background(), "scanner-1", nil, dto.ScanRequest{QRToken: "tok", EventID: "event-1"})
	if err != nil {
		t.Fatalf("Scan: %v", err)
	}
	if resp.RegistrationID != "reg-1" || resp.Status != "SUCCESS" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestScan_AlreadyCheckedIn_ReturnsResponseAndError(t *testing.T) {
	scanTime := time.Now().Add(-time.Hour)
	repo := &fakeRepo{scanFn: func(context.Context, string, string, string, *string) (*domain.Attendance, error) {
		return &domain.Attendance{RegistrationID: "reg-1", ParticipantName: "Budi", ScanTime: scanTime}, repository.ErrAlreadyCheckedIn
	}}
	svc := NewAttendanceServiceWithInterfaces(repo)

	resp, err := svc.Scan(context.Background(), "scanner-1", nil, dto.ScanRequest{QRToken: "tok", EventID: "event-1"})
	if !errors.Is(err, repository.ErrAlreadyCheckedIn) {
		t.Fatalf("expected ErrAlreadyCheckedIn, got %v", err)
	}
	if resp == nil || resp.RegistrationID != "reg-1" || !resp.ScanTime.Equal(scanTime) {
		t.Fatalf("expected a populated response alongside the error (per DoD: 409 must carry participant + prior scan time), got %+v", resp)
	}
}

func TestScan_TokenNotFound_ReturnsNoResponse(t *testing.T) {
	repo := &fakeRepo{scanFn: func(context.Context, string, string, string, *string) (*domain.Attendance, error) {
		return nil, repository.ErrTokenNotFound
	}}
	svc := NewAttendanceServiceWithInterfaces(repo)

	resp, err := svc.Scan(context.Background(), "scanner-1", nil, dto.ScanRequest{QRToken: "bad-token", EventID: "event-1"})
	if !errors.Is(err, repository.ErrTokenNotFound) {
		t.Fatalf("expected ErrTokenNotFound, got %v", err)
	}
	if resp != nil {
		t.Fatalf("expected nil response for an unresolvable token, got %+v", resp)
	}
}

func TestScan_PassesScopeThrough(t *testing.T) {
	repo := &fakeRepo{scanFn: func(context.Context, string, string, string, *string) (*domain.Attendance, error) {
		return &domain.Attendance{}, nil
	}}
	svc := NewAttendanceServiceWithInterfaces(repo)

	tenant := "tenant-fasilkom"
	if _, err := svc.Scan(context.Background(), "scanner-1", &tenant, dto.ScanRequest{QRToken: "tok", EventID: "event-1"}); err != nil {
		t.Fatalf("Scan: %v", err)
	}
	if !repo.scopeWasCalled || repo.lastScopeSeen == nil || *repo.lastScopeSeen != "tenant-fasilkom" {
		t.Fatalf("expected tenant scope to reach the repository unchanged, got %v", repo.lastScopeSeen)
	}
}

func TestStatsByEvent(t *testing.T) {
	repo := &fakeRepo{statsFn: func(context.Context, string, *string) (*domain.EventStats, error) {
		return &domain.EventStats{EventID: "event-1", TotalRegistered: 50, TotalCheckedIn: 12}, nil
	}}
	svc := NewAttendanceServiceWithInterfaces(repo)

	stats, err := svc.StatsByEvent(context.Background(), "event-1", nil)
	if err != nil {
		t.Fatalf("StatsByEvent: %v", err)
	}
	if stats.TotalRegistered != 50 || stats.TotalCheckedIn != 12 {
		t.Fatalf("unexpected stats: %+v", stats)
	}
}
