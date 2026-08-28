package service

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	"venturo-skeleton-go/internal/modules/features/registration/domain"
	"venturo-skeleton-go/internal/modules/features/registration/dto"
	"venturo-skeleton-go/internal/modules/features/registration/repository"

	"github.com/xuri/excelize/v2"
)

type mockRegistrationRepository struct {
	createFn        func(context.Context, string, string, bool, string) (*domain.Registration, error)
	listMineFn      func(context.Context, string, dto.RegistrationQuery) ([]*domain.Registration, int64, error)
	listByEventFn   func(context.Context, string, *string, dto.RegistrationQuery) ([]*domain.Registration, int64, error)
	listForExportFn func(context.Context, string, *string) ([]*domain.Registration, error)
	cancelMineFn    func(context.Context, string, string) error
}

func (m *mockRegistrationRepository) Create(ctx context.Context, userID, eventID string, online bool, token string) (*domain.Registration, error) {
	return m.createFn(ctx, userID, eventID, online, token)
}

func (m *mockRegistrationRepository) ListMine(ctx context.Context, userID string, query dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
	if m.listMineFn == nil {
		return nil, 0, nil
	}
	return m.listMineFn(ctx, userID, query)
}

func (m *mockRegistrationRepository) ListByEvent(ctx context.Context, eventID string, scope *string, query dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
	if m.listByEventFn == nil {
		return nil, 0, nil
	}
	return m.listByEventFn(ctx, eventID, scope, query)
}

func (m *mockRegistrationRepository) ListForExport(ctx context.Context, eventID string, scope *string) ([]*domain.Registration, error) {
	if m.listForExportFn == nil {
		return nil, nil
	}
	return m.listForExportFn(ctx, eventID, scope)
}

func (m *mockRegistrationRepository) CancelMine(ctx context.Context, id, userID string) error {
	if m.cancelMineFn == nil {
		return nil
	}
	return m.cancelMineFn(ctx, id, userID)
}

func registrationFixture(userID string) *domain.Registration {
	now := time.Date(2026, 9, 2, 10, 0, 0, 0, time.UTC)
	return &domain.Registration{
		ID: "registration-" + userID, EventID: "event-1", EventTitle: "Workshop Go",
		EventSlug: "workshop-go", TenantID: "tenant-a", TenantCode: "FASILKOM",
		UserID: userID, UserName: "Participant", UserEmail: userID + "@example.com",
		RegistrationNumber: "REG-FASILKOM-WORKSHOP-GO-2026-00001", QRToken: "token",
		Status: domain.StatusRegistered, CreatedAt: now, UpdatedAt: now,
	}
}

func TestRegisterCreatesTicketAndRetriesQRTokenCollision(t *testing.T) {
	calls := 0
	repo := &mockRegistrationRepository{createFn: func(_ context.Context, userID, eventID string, online bool, token string) (*domain.Registration, error) {
		calls++
		if calls == 1 {
			return nil, repository.ErrQRTokenExists
		}
		if userID != "user-1" || eventID != "event-1" || !online || token != "token-2" {
			t.Fatalf("unexpected create arguments: %q %q %v %q", userID, eventID, online, token)
		}
		registration := registrationFixture(userID)
		registration.QRToken = token
		return registration, nil
	}}
	tokenCalls := 0
	svc := NewRegistrationServiceWithInterfaces(repo, func() (string, error) {
		tokenCalls++
		return fmt.Sprintf("token-%d", tokenCalls), nil
	})
	response, err := svc.Register(context.Background(), "user-1", dto.CreateRegistrationRequest{EventID: "event-1", OnlineAttendance: true})
	if err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	if calls != 2 || response.QRToken != "token-2" || response.Status != string(domain.StatusRegistered) {
		t.Fatalf("calls = %d, response = %+v", calls, response)
	}
}

func TestRegisterFailurePaths(t *testing.T) {
	tokenErr := errors.New("entropy unavailable")
	t.Run("token generation", func(t *testing.T) {
		svc := NewRegistrationServiceWithInterfaces(&mockRegistrationRepository{createFn: func(context.Context, string, string, bool, string) (*domain.Registration, error) {
			t.Fatal("repository should not be called")
			return nil, nil
		}}, func() (string, error) { return "", tokenErr })
		_, err := svc.Register(context.Background(), "user-1", dto.CreateRegistrationRequest{EventID: "event-1"})
		if !errors.Is(err, tokenErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("repository", func(t *testing.T) {
		dbErr := errors.New("database unavailable")
		svc := NewRegistrationServiceWithInterfaces(&mockRegistrationRepository{createFn: func(context.Context, string, string, bool, string) (*domain.Registration, error) {
			return nil, dbErr
		}}, func() (string, error) { return "token", nil })
		_, err := svc.Register(context.Background(), "user-1", dto.CreateRegistrationRequest{EventID: "event-1"})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("retry exhausted", func(t *testing.T) {
		var calls atomic.Int32
		svc := NewRegistrationServiceWithInterfaces(&mockRegistrationRepository{createFn: func(context.Context, string, string, bool, string) (*domain.Registration, error) {
			calls.Add(1)
			return nil, repository.ErrQRTokenExists
		}}, func() (string, error) { return "token", nil })
		_, err := svc.Register(context.Background(), "user-1", dto.CreateRegistrationRequest{EventID: "event-1"})
		if !errors.Is(err, repository.ErrQRTokenExists) || calls.Load() != 3 {
			t.Fatalf("calls = %d, error = %v", calls.Load(), err)
		}
	})
}

func TestRegistrationQueriesAndCancellation(t *testing.T) {
	registration := registrationFixture("user-1")
	scope := "tenant-a"
	repo := &mockRegistrationRepository{
		createFn: func(context.Context, string, string, bool, string) (*domain.Registration, error) { return nil, nil },
		listMineFn: func(_ context.Context, userID string, query dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
			if userID != "user-1" || query.Status != "REGISTERED" {
				t.Fatalf("unexpected mine query")
			}
			return []*domain.Registration{registration}, 1, nil
		},
		listByEventFn: func(_ context.Context, eventID string, gotScope *string, _ dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
			if eventID != "event-1" || gotScope == nil || *gotScope != scope {
				t.Fatalf("unexpected event scope")
			}
			return []*domain.Registration{registration}, 1, nil
		},
		cancelMineFn: func(_ context.Context, id, userID string) error {
			if id != registration.ID || userID != registration.UserID {
				t.Fatalf("unexpected cancellation")
			}
			return nil
		},
	}
	svc := NewRegistrationServiceWithInterfaces(repo, secureQRToken)
	mine, total, err := svc.ListMine(context.Background(), "user-1", dto.RegistrationQuery{Status: "REGISTERED"})
	if err != nil || total != 1 || len(mine) != 1 || mine[0].RegistrationNumber != registration.RegistrationNumber {
		t.Fatalf("mine = %+v, total = %d, error = %v", mine, total, err)
	}
	byEvent, total, err := svc.ListByEvent(context.Background(), "event-1", &scope, dto.RegistrationQuery{})
	if err != nil || total != 1 || len(byEvent) != 1 {
		t.Fatalf("by event = %+v, total = %d, error = %v", byEvent, total, err)
	}
	if err := svc.CancelMine(context.Background(), registration.ID, registration.UserID); err != nil {
		t.Fatalf("CancelMine() error = %v", err)
	}
}

func TestQueryFailuresPropagate(t *testing.T) {
	dbErr := errors.New("database unavailable")
	repo := &mockRegistrationRepository{
		createFn: func(context.Context, string, string, bool, string) (*domain.Registration, error) { return nil, nil },
		listMineFn: func(context.Context, string, dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
			return nil, 0, dbErr
		},
		listByEventFn: func(context.Context, string, *string, dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
			return nil, 0, dbErr
		},
		cancelMineFn:    func(context.Context, string, string) error { return dbErr },
		listForExportFn: func(context.Context, string, *string) ([]*domain.Registration, error) { return nil, dbErr },
	}
	svc := NewRegistrationServiceWithInterfaces(repo, secureQRToken)
	if _, _, err := svc.ListMine(context.Background(), "user", dto.RegistrationQuery{}); !errors.Is(err, dbErr) {
		t.Fatalf("ListMine() error = %v", err)
	}
	if _, _, err := svc.ListByEvent(context.Background(), "event", nil, dto.RegistrationQuery{}); !errors.Is(err, dbErr) {
		t.Fatalf("ListByEvent() error = %v", err)
	}
	if err := svc.CancelMine(context.Background(), "registration", "user"); !errors.Is(err, dbErr) {
		t.Fatalf("CancelMine() error = %v", err)
	}
	if _, err := svc.ExportByEvent(context.Background(), "event", nil); !errors.Is(err, dbErr) {
		t.Fatalf("ExportByEvent() error = %v", err)
	}
}

func TestExportByEventCreatesXLSX(t *testing.T) {
	registration := registrationFixture("user-1")
	registration.OnlineAttendance = true
	repo := &mockRegistrationRepository{
		createFn: func(context.Context, string, string, bool, string) (*domain.Registration, error) { return nil, nil },
		listForExportFn: func(_ context.Context, eventID string, scope *string) ([]*domain.Registration, error) {
			if eventID != registration.EventID || scope != nil {
				t.Fatalf("unexpected export scope")
			}
			return []*domain.Registration{registration}, nil
		},
	}
	content, err := NewRegistrationServiceWithInterfaces(repo, secureQRToken).ExportByEvent(context.Background(), registration.EventID, nil)
	if err != nil {
		t.Fatalf("ExportByEvent() error = %v", err)
	}
	workbook, err := excelize.OpenReader(bytes.NewReader(content))
	if err != nil {
		t.Fatalf("export is not a valid xlsx: %v", err)
	}
	defer func() { _ = workbook.Close() }()
	rows, err := workbook.GetRows("Registrations")
	if err != nil || len(rows) != 2 || rows[1][0] != registration.RegistrationNumber || rows[1][4] != "ONLINE" {
		t.Fatalf("rows = %+v, error = %v", rows, err)
	}
}

func TestConcurrentRegistrationsDoNotOversell(t *testing.T) {
	const quota = 5
	var mutex sync.Mutex
	accepted := 0
	repo := &mockRegistrationRepository{createFn: func(_ context.Context, userID, _ string, _ bool, token string) (*domain.Registration, error) {
		mutex.Lock()
		defer mutex.Unlock()
		if accepted >= quota {
			return nil, repository.ErrQuotaFull
		}
		accepted++
		registration := registrationFixture(userID)
		registration.QRToken = token
		return registration, nil
	}}
	var tokenCounter atomic.Int32
	svc := NewRegistrationServiceWithInterfaces(repo, func() (string, error) {
		return fmt.Sprintf("token-%d", tokenCounter.Add(1)), nil
	})
	var successes atomic.Int32
	var waitGroup sync.WaitGroup
	for index := 0; index < 50; index++ {
		waitGroup.Add(1)
		go func(user int) {
			defer waitGroup.Done()
			_, err := svc.Register(context.Background(), fmt.Sprintf("user-%d", user), dto.CreateRegistrationRequest{EventID: "event-1"})
			if err == nil {
				successes.Add(1)
				return
			}
			if !errors.Is(err, repository.ErrQuotaFull) {
				t.Errorf("unexpected registration error: %v", err)
			}
		}(index)
	}
	waitGroup.Wait()
	if successes.Load() != quota || accepted != quota {
		t.Fatalf("successes = %d, accepted = %d", successes.Load(), accepted)
	}
}

func TestSecureQRTokenIsRandomAndURLSafe(t *testing.T) {
	if NewRegistrationService(nil) == nil {
		t.Fatal("constructor returned nil")
	}
	first, err := secureQRToken()
	if err != nil {
		t.Fatalf("secureQRToken() error = %v", err)
	}
	second, err := secureQRToken()
	if err != nil {
		t.Fatalf("secureQRToken() error = %v", err)
	}
	if len(first) != 43 || first == second {
		t.Fatalf("unexpected tokens: %q %q", first, second)
	}
}
