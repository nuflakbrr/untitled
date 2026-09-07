package service

import (
	"context"
	"errors"
	"testing"
	"time"

	"venturo-skeleton-go/internal/modules/features/event/domain"
	"venturo-skeleton-go/internal/modules/features/event/dto"
	"venturo-skeleton-go/internal/modules/features/event/repository"

	"github.com/jackc/pgx/v5/pgconn"
)

func stringPtr(value string) *string { return &value }

type mockEventRepository struct {
	findPublicFn   func(context.Context, dto.EventQuery) ([]*domain.Event, int64, error)
	findBySlugFn   func(context.Context, string) (*domain.Event, error)
	findByIDFn     func(context.Context, string, *string) (*domain.Event, error)
	slugExistsFn   func(context.Context, string) (bool, error)
	createFn       func(context.Context, *domain.Event) error
	updateFn       func(context.Context, *domain.Event, *string) error
	updateStatusFn func(context.Context, string, domain.EventStatus, domain.EventStatus, *string) error
	deleteFn       func(context.Context, string, *string) error
}

func (m *mockEventRepository) FindPublic(ctx context.Context, query dto.EventQuery) ([]*domain.Event, int64, error) {
	if m.findPublicFn != nil {
		return m.findPublicFn(ctx, query)
	}
	return nil, 0, nil
}
func (m *mockEventRepository) FindPublicBySlug(ctx context.Context, slug string) (*domain.Event, error) {
	if m.findBySlugFn != nil {
		return m.findBySlugFn(ctx, slug)
	}
	return nil, repository.ErrEventNotFound
}
func (m *mockEventRepository) FindByID(ctx context.Context, id string, scope *string) (*domain.Event, error) {
	if m.findByIDFn != nil {
		return m.findByIDFn(ctx, id, scope)
	}
	return nil, repository.ErrEventNotFound
}
func (m *mockEventRepository) SlugExists(ctx context.Context, slug string) (bool, error) {
	if m.slugExistsFn != nil {
		return m.slugExistsFn(ctx, slug)
	}
	return false, nil
}
func (m *mockEventRepository) Create(ctx context.Context, event *domain.Event) error {
	if m.createFn != nil {
		return m.createFn(ctx, event)
	}
	return nil
}
func (m *mockEventRepository) Update(ctx context.Context, event *domain.Event, scope *string) error {
	if m.updateFn != nil {
		return m.updateFn(ctx, event, scope)
	}
	return nil
}
func (m *mockEventRepository) UpdateStatus(ctx context.Context, id string, current, next domain.EventStatus, scope *string) error {
	if m.updateStatusFn != nil {
		return m.updateStatusFn(ctx, id, current, next, scope)
	}
	return nil
}
func (m *mockEventRepository) Delete(ctx context.Context, id string, scope *string) error {
	if m.deleteFn != nil {
		return m.deleteFn(ctx, id, scope)
	}
	return nil
}

type mockCategoryRepository struct {
	findAllFn        func(context.Context, *string) ([]*domain.Category, error)
	findAccessibleFn func(context.Context, string, string) (*domain.Category, error)
	findByIDFn       func(context.Context, string, *string) (*domain.Category, error)
	findBySlugFn     func(context.Context, string, string) (*domain.Category, error)
	createFn         func(context.Context, *domain.Category) error
	updateFn         func(context.Context, *domain.Category, *string) error
	deleteFn         func(context.Context, string, *string) error
}

func (m *mockCategoryRepository) FindAll(ctx context.Context, tenantID *string) ([]*domain.Category, error) {
	if m.findAllFn != nil {
		return m.findAllFn(ctx, tenantID)
	}
	return nil, nil
}
func (m *mockCategoryRepository) FindByID(ctx context.Context, id string, scope *string) (*domain.Category, error) {
	if m.findByIDFn != nil {
		return m.findByIDFn(ctx, id, scope)
	}
	return nil, repository.ErrCategoryNotFound
}
func (m *mockCategoryRepository) FindAccessible(ctx context.Context, id, tenantID string) (*domain.Category, error) {
	if m.findAccessibleFn != nil {
		return m.findAccessibleFn(ctx, id, tenantID)
	}
	return &domain.Category{ID: id}, nil
}
func (m *mockCategoryRepository) FindBySlug(ctx context.Context, tenantID, slug string) (*domain.Category, error) {
	if m.findBySlugFn != nil {
		return m.findBySlugFn(ctx, tenantID, slug)
	}
	return nil, repository.ErrCategoryNotFound
}
func (m *mockCategoryRepository) Create(ctx context.Context, category *domain.Category) error {
	if m.createFn != nil {
		return m.createFn(ctx, category)
	}
	return nil
}
func (m *mockCategoryRepository) Update(ctx context.Context, category *domain.Category, scope *string) error {
	if m.updateFn != nil {
		return m.updateFn(ctx, category, scope)
	}
	return nil
}
func (m *mockCategoryRepository) Delete(ctx context.Context, id string, scope *string) error {
	if m.deleteFn != nil {
		return m.deleteFn(ctx, id, scope)
	}
	return nil
}

func validCreateEventRequest() dto.CreateEventRequest {
	return dto.CreateEventRequest{
		Title: " Workshop Go & Next.js ", Description: "Practical workshop",
		StartDate: time.Date(2026, 10, 20, 0, 0, 0, 0, time.UTC),
		EndDate:   time.Date(2026, 10, 21, 0, 0, 0, 0, time.UTC),
		StartTime: "09:00", EndTime: "17:00", Location: "Lab 3",
		EventType: "OFFLINE", RegistrationDeadline: time.Date(2026, 10, 18, 0, 0, 0, 0, time.UTC),
		Quota: 40, Price: 150000,
		Speakers: []dto.SpeakerRequest{{Name: "Default Speaker", Title: stringPtr("Lead"), Company: stringPtr("Company"), CompanyURL: stringPtr("https://company.test"), GitHub: stringPtr("https://github.com/speaker"), Instagram: stringPtr("https://instagram.com/speaker"), LinkedIn: stringPtr("https://linkedin.com/speaker"), Avatar: stringPtr("https://example.com/avatar.webp")}},
		Benefits: []dto.BenefitRequest{{Title: "Default Benefit", Description: stringPtr("Benefit description"), Icon: stringPtr("Gift")}},
	}
}

func validEvent(status domain.EventStatus) *domain.Event {
	req := validCreateEventRequest()
	return &domain.Event{
		ID: "event-1", TenantID: "tenant-a", Title: req.Title, Slug: "workshop-go-next-js",
		Description: req.Description, StartDate: req.StartDate, EndDate: req.EndDate,
		StartTime: req.StartTime, EndTime: req.EndTime, Location: req.Location,
		EventType: domain.EventTypeOffline, RegistrationDeadline: req.RegistrationDeadline,
		Quota: req.Quota, Price: req.Price, Status: status,
		Speakers: []domain.Speaker{{ID: "speaker-1", Name: "Default Speaker", Title: stringPtr("Lead"), Company: stringPtr("Company"), CompanyURL: stringPtr("https://company.test"), GitHub: stringPtr("https://github.com/speaker"), Instagram: stringPtr("https://instagram.com/speaker"), LinkedIn: stringPtr("https://linkedin.com/speaker"), Avatar: stringPtr("https://example.com/avatar.webp")}},
		Benefits: []domain.Benefit{{ID: "benefit-1", Title: "Default Benefit", Description: stringPtr("Benefit description"), Icon: stringPtr("Gift")}},
	}
}

func TestCreateEventGeneratesUniqueSlugAndLocksTenant(t *testing.T) {
	var created *domain.Event
	checkedTenant := ""
	categoryID := "category-1"
	events := &mockEventRepository{
		slugExistsFn: func(_ context.Context, slug string) (bool, error) {
			return slug == "workshop-go-next-js", nil
		},
		createFn: func(_ context.Context, event *domain.Event) error {
			created = event
			event.ID = "new-event"
			return nil
		},
	}
	categories := &mockCategoryRepository{findAccessibleFn: func(_ context.Context, id, tenantID string) (*domain.Category, error) {
		checkedTenant = tenantID
		return &domain.Category{ID: id}, nil
	}}
	svc := NewEventServiceWithInterfaces(events, categories)
	req := validCreateEventRequest()
	req.CategoryID = &categoryID

	response, err := svc.CreateEvent(context.Background(), "tenant-a", "user-a", req)
	if err != nil {
		t.Fatalf("CreateEvent() error = %v", err)
	}
	if response.Slug != "workshop-go-next-js-2" {
		t.Errorf("slug = %q", response.Slug)
	}
	if checkedTenant != "tenant-a" || created.TenantID != "tenant-a" {
		t.Error("tenant scope was not preserved")
	}
	if created.CreatedByID == nil || *created.CreatedByID != "user-a" {
		t.Error("creator was not preserved")
	}
	if created.Status != domain.EventStatusDraft {
		t.Errorf("status = %s, want DRAFT", created.Status)
	}
}

func TestCreateEventRejectsInvalidDates(t *testing.T) {
	created := false
	events := &mockEventRepository{createFn: func(context.Context, *domain.Event) error { created = true; return nil }}
	svc := NewEventServiceWithInterfaces(events, &mockCategoryRepository{})
	req := validCreateEventRequest()
	req.EndDate = req.StartDate.Add(-time.Hour)

	_, err := svc.CreateEvent(context.Background(), "tenant-a", "user-a", req)
	if !errors.Is(err, ErrInvalidEvent) {
		t.Fatalf("error = %v, want ErrInvalidEvent", err)
	}
	if created {
		t.Error("repository Create must not be called for invalid input")
	}
}

func TestCreateEventRejectsForeignCategory(t *testing.T) {
	categoryID := "foreign-category"
	svc := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
		findAccessibleFn: func(context.Context, string, string) (*domain.Category, error) {
			return nil, repository.ErrCategoryNotFound
		},
	})
	req := validCreateEventRequest()
	req.CategoryID = &categoryID

	_, err := svc.CreateEvent(context.Background(), "tenant-a", "user-a", req)
	if !errors.Is(err, repository.ErrCategoryNotFound) {
		t.Fatalf("error = %v", err)
	}
}

func TestUpdateEventStatusLifecycle(t *testing.T) {
	tests := []struct {
		name          string
		current, next domain.EventStatus
		wantErr       bool
	}{
		{"draft publishes", domain.EventStatusDraft, domain.EventStatusPublished, false},
		{"published closes", domain.EventStatusPublished, domain.EventStatusClosed, false},
		{"closed completes", domain.EventStatusClosed, domain.EventStatusCompleted, false},
		{"draft cannot complete", domain.EventStatusDraft, domain.EventStatusCompleted, true},
		{"completed cannot reopen", domain.EventStatusCompleted, domain.EventStatusPublished, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			updated := false
			events := &mockEventRepository{
				findByIDFn: func(context.Context, string, *string) (*domain.Event, error) { return validEvent(tt.current), nil },
				updateStatusFn: func(_ context.Context, _ string, current, next domain.EventStatus, _ *string) error {
					if current != tt.current || next != tt.next {
						t.Fatalf("transition = %s to %s", current, next)
					}
					updated = true
					return nil
				},
			}
			svc := NewEventServiceWithInterfaces(events, &mockCategoryRepository{})
			_, err := svc.UpdateEventStatus(context.Background(), "event-1", nil, tt.next)
			if tt.wantErr && !errors.Is(err, ErrInvalidLifecycle) {
				t.Fatalf("error = %v", err)
			}
			if !tt.wantErr && err != nil {
				t.Fatalf("unexpected error = %v", err)
			}
			if updated == tt.wantErr {
				t.Errorf("repository update called = %v", updated)
			}
		})
	}
}

func TestUpdateEventForwardsTenantScope(t *testing.T) {
	scope := "tenant-a"
	events := &mockEventRepository{findByIDFn: func(_ context.Context, _ string, got *string) (*domain.Event, error) {
		if got == nil || *got != scope {
			t.Fatalf("scope = %v, want %s", got, scope)
		}
		return nil, repository.ErrEventNotFound
	}}
	svc := NewEventServiceWithInterfaces(events, &mockCategoryRepository{})
	_, err := svc.UpdateEvent(context.Background(), "foreign-event", &scope, false, dto.UpdateEventRequest{})
	if !errors.Is(err, repository.ErrEventNotFound) {
		t.Fatalf("error = %v", err)
	}
}

func TestCreateCategoryNormalizesNameAndSlug(t *testing.T) {
	var created *domain.Category
	svc := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
		createFn: func(_ context.Context, category *domain.Category) error {
			created = category
			category.ID = "new-category"
			return nil
		},
	})
	response, err := svc.CreateCategory(context.Background(), "tenant-a", dto.CreateCategoryRequest{Name: "  Kuliah Umum & Seminar  "})
	if err != nil {
		t.Fatalf("CreateCategory() error = %v", err)
	}
	if response.Slug != "kuliah-umum-seminar" || created.Name != "Kuliah Umum & Seminar" {
		t.Errorf("response = %+v", response)
	}
}

func TestUpdateCompletedEventRequiresSuperadmin(t *testing.T) {
	updated := false
	events := &mockEventRepository{
		findByIDFn: func(context.Context, string, *string) (*domain.Event, error) {
			return validEvent(domain.EventStatusCompleted), nil
		},
		updateFn: func(context.Context, *domain.Event, *string) error {
			updated = true
			return nil
		},
	}
	svc := NewEventServiceWithInterfaces(events, &mockCategoryRepository{})
	_, err := svc.UpdateEvent(context.Background(), "event-1", nil, false, dto.UpdateEventRequest{})
	if !errors.Is(err, ErrCompletedImmutable) {
		t.Fatalf("error = %v", err)
	}
	if updated {
		t.Error("completed event was updated without superadmin access")
	}
	if _, err := svc.UpdateEvent(context.Background(), "event-1", nil, true, dto.UpdateEventRequest{}); err != nil {
		t.Fatalf("superadmin update error = %v", err)
	}
}

func TestUpdateGlobalCategoryIsRejected(t *testing.T) {
	svc := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
		findByIDFn: func(context.Context, string, *string) (*domain.Category, error) {
			return &domain.Category{ID: "global", Name: "Seminar", Slug: "seminar"}, nil
		},
	})
	description := "changed"
	_, err := svc.UpdateCategory(context.Background(), "global", nil, dto.UpdateCategoryRequest{Description: &description})
	if !errors.Is(err, ErrInvalidEvent) {
		t.Fatalf("error = %v", err)
	}
}

func TestCreateEventRetriesConcurrentSlugCollision(t *testing.T) {
	createCalls := 0
	baseNowExists := false
	events := &mockEventRepository{
		slugExistsFn: func(_ context.Context, slug string) (bool, error) {
			return slug == "workshop-go-next-js" && baseNowExists, nil
		},
		createFn: func(_ context.Context, event *domain.Event) error {
			createCalls++
			if createCalls == 1 {
				baseNowExists = true
				return &pgconn.PgError{Code: "23505", ConstraintName: "events_slug_key"}
			}
			event.ID = "event-2"
			return nil
		},
	}
	svc := NewEventServiceWithInterfaces(events, &mockCategoryRepository{})
	response, err := svc.CreateEvent(context.Background(), "tenant-a", "user-a", validCreateEventRequest())
	if err != nil {
		t.Fatalf("CreateEvent() error = %v", err)
	}
	if response.Slug != "workshop-go-next-js-2" || createCalls != 2 {
		t.Fatalf("slug = %q, create calls = %d", response.Slug, createCalls)
	}
}

func TestReadAndDeleteOperations(t *testing.T) {
	tenantID := "tenant-a"
	category := &domain.Category{ID: "category-1", TenantID: &tenantID, Name: "Workshop", Slug: "workshop"}
	event := validEvent(domain.EventStatusPublished)
	event.Category = category
	event.Speakers = []domain.Speaker{{ID: "speaker-1", Name: "Alex"}}
	event.Benefits = []domain.Benefit{{ID: "benefit-1", Title: "Certificate"}}
	deleted := false
	svc := NewEventServiceWithInterfaces(&mockEventRepository{
		findPublicFn: func(_ context.Context, query dto.EventQuery) ([]*domain.Event, int64, error) {
			if query.Search != "go" {
				t.Fatalf("query = %+v", query)
			}
			return []*domain.Event{event}, 1, nil
		},
		findBySlugFn: func(_ context.Context, slug string) (*domain.Event, error) {
			if slug != event.Slug {
				t.Fatalf("slug = %q", slug)
			}
			return event, nil
		},
		deleteFn: func(_ context.Context, id string, scope *string) error {
			deleted = id == event.ID && scope != nil && *scope == tenantID
			return nil
		},
	}, &mockCategoryRepository{
		findAllFn: func(_ context.Context, scope *string) ([]*domain.Category, error) {
			if scope == nil || *scope != tenantID {
				t.Fatalf("category scope = %v", scope)
			}
			return []*domain.Category{category}, nil
		},
	})

	categories, err := svc.ListCategories(context.Background(), &tenantID)
	if err != nil || len(categories) != 1 {
		t.Fatalf("categories = %+v, error = %v", categories, err)
	}
	events, total, err := svc.ListPublicEvents(context.Background(), dto.EventQuery{Search: "go"})
	if err != nil || total != 1 || len(events) != 1 || len(events[0].Speakers) != 1 || len(events[0].Benefits) != 1 {
		t.Fatalf("events = %+v, total = %d, error = %v", events, total, err)
	}
	detail, err := svc.GetPublicEvent(context.Background(), event.Slug)
	if err != nil || detail.Category == nil || detail.Category.ID != category.ID {
		t.Fatalf("detail = %+v, error = %v", detail, err)
	}
	if err := svc.DeleteEvent(context.Background(), event.ID, &tenantID); err != nil || !deleted {
		t.Fatalf("deleted = %v, error = %v", deleted, err)
	}
}

func TestUpdateAndDeleteCategory(t *testing.T) {
	tenantID := "tenant-a"
	category := &domain.Category{ID: "category-1", TenantID: &tenantID, Name: "Workshop", Slug: "workshop"}
	updated, deleted := false, false
	svc := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
		findByIDFn: func(context.Context, string, *string) (*domain.Category, error) { return category, nil },
		findBySlugFn: func(context.Context, string, string) (*domain.Category, error) {
			return nil, repository.ErrCategoryNotFound
		},
		updateFn: func(_ context.Context, got *domain.Category, scope *string) error {
			updated = got.Name == "Tech Talk" && got.Slug == "tech-talk" && scope != nil && *scope == tenantID
			return nil
		},
		deleteFn: func(_ context.Context, id string, scope *string) error {
			deleted = id == category.ID && scope != nil && *scope == tenantID
			return nil
		},
	})
	name := " Tech Talk "
	response, err := svc.UpdateCategory(context.Background(), category.ID, &tenantID, dto.UpdateCategoryRequest{Name: &name})
	if err != nil || response.Slug != "tech-talk" || !updated {
		t.Fatalf("response = %+v, updated = %v, error = %v", response, updated, err)
	}
	if err := svc.DeleteCategory(context.Background(), category.ID, &tenantID); err != nil || !deleted {
		t.Fatalf("deleted = %v, error = %v", deleted, err)
	}
}

func TestUpdateEventAppliesEditableFields(t *testing.T) {
	event := validEvent(domain.EventStatusDraft)
	title, description, banner := "Updated Event", "Updated description", "https://example.com/banner.webp"
	categoryID, startTime, endTime, location := "category-2", "10:00", "18:00", "Auditorium"
	meetingLink, eventType := "https://meet.example.com", "ONLINE"
	startDate := event.StartDate.Add(24 * time.Hour)
	endDate := event.EndDate.Add(48 * time.Hour)
	deadline := startDate.Add(-time.Hour)
	quota, price := 100, int64(25000)
	online, certificate := true, true
	speakers := []dto.SpeakerRequest{{Name: "Alex", Title: &title, Company: &title, CompanyURL: &title, GitHub: &title, Instagram: &title, LinkedIn: &title, Avatar: &title}}
	benefits := []dto.BenefitRequest{{Title: "Certificate", Description: &title, Icon: &title}}
	updated := false
	svc := NewEventServiceWithInterfaces(&mockEventRepository{
		findByIDFn: func(context.Context, string, *string) (*domain.Event, error) { return event, nil },
		updateFn: func(_ context.Context, got *domain.Event, _ *string) error {
			updated = got.Title == title && got.EventType == domain.EventTypeOnline && len(got.Speakers) == 1 && len(got.Benefits) == 1
			return nil
		},
	}, &mockCategoryRepository{})
	response, err := svc.UpdateEvent(context.Background(), event.ID, nil, false, dto.UpdateEventRequest{
		Title: &title, CategoryID: &categoryID, Description: &description, Banner: &banner,
		StartDate: &startDate, EndDate: &endDate, StartTime: &startTime, EndTime: &endTime,
		Location: &location, MeetingLink: &meetingLink, EventType: &eventType,
		OnlineAttendance: &online, RegistrationDeadline: &deadline, Quota: &quota, Price: &price,
		CertificateEnabled: &certificate, Speakers: &speakers, Benefits: &benefits,
	})
	if err != nil || response.Title != title || !updated {
		t.Fatalf("response = %+v, updated = %v, error = %v", response, updated, err)
	}
}

func TestCreateEventRejectsInvalidInput(t *testing.T) {
	tests := []struct {
		name   string
		mutate func(*dto.CreateEventRequest)
	}{
		{"missing required field", func(req *dto.CreateEventRequest) { req.Title = "" }},
		{"invalid start time", func(req *dto.CreateEventRequest) { req.StartTime = "9am" }},
		{"invalid end time", func(req *dto.CreateEventRequest) { req.EndTime = "5pm" }},
		{"deadline after start", func(req *dto.CreateEventRequest) { req.RegistrationDeadline = req.StartDate.Add(10 * time.Hour) }},
		{"non-positive quota", func(req *dto.CreateEventRequest) { req.Quota = 0 }},
		{"negative price", func(req *dto.CreateEventRequest) { req.Price = -1 }},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := validCreateEventRequest()
			tt.mutate(&req)
			_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{}).
				CreateEvent(context.Background(), "tenant-a", "user-a", req)
			if !errors.Is(err, ErrInvalidEvent) {
				t.Fatalf("error = %v, want ErrInvalidEvent", err)
			}
		})
	}
}

func TestCreateEventRejectsInvalidRelationsAndSlugErrors(t *testing.T) {
	svc := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{})
	for _, tt := range []struct {
		name   string
		mutate func(*dto.CreateEventRequest)
	}{
		{"empty title slug", func(req *dto.CreateEventRequest) { req.Title = "---" }},
		{"empty speaker name", func(req *dto.CreateEventRequest) { req.Speakers = []dto.SpeakerRequest{{}} }},
		{"empty benefit title", func(req *dto.CreateEventRequest) { req.Benefits = []dto.BenefitRequest{{}} }},
	} {
		t.Run(tt.name, func(t *testing.T) {
			req := validCreateEventRequest()
			tt.mutate(&req)
			_, err := svc.CreateEvent(context.Background(), "tenant-a", "user-a", req)
			if !errors.Is(err, ErrInvalidEvent) {
				t.Fatalf("error = %v, want ErrInvalidEvent", err)
			}
		})
	}
}

func TestServicePropagatesRepositoryErrors(t *testing.T) {
	dbErr := errors.New("database unavailable")
	t.Run("list categories", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findAllFn: func(context.Context, *string) ([]*domain.Category, error) { return nil, dbErr },
		}).ListCategories(context.Background(), nil)
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("create category lookup", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findBySlugFn: func(context.Context, string, string) (*domain.Category, error) { return nil, dbErr },
		}).CreateCategory(context.Background(), "tenant-a", dto.CreateCategoryRequest{Name: "Workshop"})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("list events", func(t *testing.T) {
		_, _, err := NewEventServiceWithInterfaces(&mockEventRepository{
			findPublicFn: func(context.Context, dto.EventQuery) ([]*domain.Event, int64, error) { return nil, 0, dbErr },
		}, &mockCategoryRepository{}).ListPublicEvents(context.Background(), dto.EventQuery{})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("get event", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			findBySlugFn: func(context.Context, string) (*domain.Event, error) { return nil, dbErr },
		}, &mockCategoryRepository{}).GetPublicEvent(context.Background(), "event")
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
}

func TestCategoryServiceValidationAndRepositoryFailures(t *testing.T) {
	dbErr := errors.New("database unavailable")
	tenantID := "tenant-a"
	category := func() *domain.Category {
		return &domain.Category{ID: "category-1", TenantID: &tenantID, Name: "Workshop", Slug: "workshop"}
	}

	t.Run("constructor", func(t *testing.T) {
		if NewEventService(nil, nil) == nil {
			t.Fatal("constructor returned nil")
		}
	})
	t.Run("create invalid name", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{}).
			CreateCategory(context.Background(), tenantID, dto.CreateCategoryRequest{Name: "---"})
		if !errors.Is(err, ErrInvalidEvent) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("create duplicate", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findBySlugFn: func(context.Context, string, string) (*domain.Category, error) { return category(), nil },
		}).CreateCategory(context.Background(), tenantID, dto.CreateCategoryRequest{Name: "Workshop"})
		if !errors.Is(err, ErrCategorySlugExists) {
			t.Fatalf("error = %v", err)
		}
	})
	for _, tt := range []struct {
		name string
		err  error
		want error
	}{
		{"create unique violation", &pgconn.PgError{Code: "23505", ConstraintName: "uq_event_categories_tenant_slug"}, ErrCategorySlugExists},
		{"create failure", dbErr, dbErr},
	} {
		t.Run(tt.name, func(t *testing.T) {
			_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
				createFn: func(context.Context, *domain.Category) error { return tt.err },
			}).CreateCategory(context.Background(), tenantID, dto.CreateCategoryRequest{Name: "Workshop"})
			if !errors.Is(err, tt.want) {
				t.Fatalf("error = %v, want %v", err, tt.want)
			}
		})
	}
	t.Run("update lookup failure", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Category, error) { return nil, dbErr },
		}).UpdateCategory(context.Background(), "category-1", &tenantID, dto.UpdateCategoryRequest{})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("update invalid name", func(t *testing.T) {
		name := "---"
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Category, error) { return category(), nil },
		}).UpdateCategory(context.Background(), "category-1", &tenantID, dto.UpdateCategoryRequest{Name: &name})
		if !errors.Is(err, ErrInvalidEvent) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("update duplicate", func(t *testing.T) {
		name := "Seminar"
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Category, error) { return category(), nil },
			findBySlugFn: func(context.Context, string, string) (*domain.Category, error) {
				return &domain.Category{ID: "category-2"}, nil
			},
		}).UpdateCategory(context.Background(), "category-1", &tenantID, dto.UpdateCategoryRequest{Name: &name})
		if !errors.Is(err, ErrCategorySlugExists) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("update slug lookup failure", func(t *testing.T) {
		name := "Seminar"
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findByIDFn:   func(context.Context, string, *string) (*domain.Category, error) { return category(), nil },
			findBySlugFn: func(context.Context, string, string) (*domain.Category, error) { return nil, dbErr },
		}).UpdateCategory(context.Background(), "category-1", &tenantID, dto.UpdateCategoryRequest{Name: &name})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("update repository failure", func(t *testing.T) {
		description := "  "
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Category, error) { return category(), nil },
			updateFn:   func(context.Context, *domain.Category, *string) error { return dbErr },
		}).UpdateCategory(context.Background(), "category-1", &tenantID, dto.UpdateCategoryRequest{Description: &description})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("delete lookup failure", func(t *testing.T) {
		err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Category, error) { return nil, dbErr },
		}).DeleteCategory(context.Background(), "category-1", &tenantID)
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("delete global category", func(t *testing.T) {
		err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Category, error) {
				return &domain.Category{ID: "global"}, nil
			},
		}).DeleteCategory(context.Background(), "global", nil)
		if !errors.Is(err, ErrInvalidEvent) {
			t.Fatalf("error = %v", err)
		}
	})
}

func TestEventServiceRepositoryFailures(t *testing.T) {
	dbErr := errors.New("database unavailable")
	t.Run("slug lookup failure", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			slugExistsFn: func(context.Context, string) (bool, error) { return false, dbErr },
		}, &mockCategoryRepository{}).CreateEvent(context.Background(), "tenant-a", "user-a", validCreateEventRequest())
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("create failure", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			createFn: func(context.Context, *domain.Event) error { return dbErr },
		}, &mockCategoryRepository{}).CreateEvent(context.Background(), "tenant-a", "user-a", validCreateEventRequest())
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("slug retries exhausted", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			createFn: func(context.Context, *domain.Event) error {
				return &pgconn.PgError{Code: "23505", ConstraintName: "events_slug_key"}
			},
		}, &mockCategoryRepository{}).CreateEvent(context.Background(), "tenant-a", "user-a", validCreateEventRequest())
		if !errors.Is(err, ErrInvalidEvent) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("empty optional values normalize to nil", func(t *testing.T) {
		empty := "  "
		req := validCreateEventRequest()
		req.CategoryID, req.Banner = &empty, &empty
		response, err := NewEventServiceWithInterfaces(&mockEventRepository{}, &mockCategoryRepository{}).
			CreateEvent(context.Background(), "tenant-a", "user-a", req)
		if err != nil || response.CategoryID != nil || response.Banner != nil {
			t.Fatalf("response = %+v, error = %v", response, err)
		}
	})
	t.Run("update invalid result", func(t *testing.T) {
		empty := ""
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Event, error) {
				return validEvent(domain.EventStatusDraft), nil
			},
		}, &mockCategoryRepository{}).UpdateEvent(context.Background(), "event-1", nil, false, dto.UpdateEventRequest{Title: &empty})
		if !errors.Is(err, ErrInvalidEvent) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("update category failure", func(t *testing.T) {
		categoryID := "category-1"
		event := validEvent(domain.EventStatusDraft)
		event.CategoryID = &categoryID
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Event, error) { return event, nil },
		}, &mockCategoryRepository{
			findAccessibleFn: func(context.Context, string, string) (*domain.Category, error) { return nil, dbErr },
		}).UpdateEvent(context.Background(), "event-1", nil, false, dto.UpdateEventRequest{})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("update repository failure", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Event, error) {
				return validEvent(domain.EventStatusDraft), nil
			},
			updateFn: func(context.Context, *domain.Event, *string) error { return dbErr },
		}, &mockCategoryRepository{}).UpdateEvent(context.Background(), "event-1", nil, false, dto.UpdateEventRequest{})
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("status lookup failure", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Event, error) { return nil, dbErr },
		}, &mockCategoryRepository{}).UpdateEventStatus(context.Background(), "event-1", nil, domain.EventStatusPublished)
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
	t.Run("status update failure", func(t *testing.T) {
		_, err := NewEventServiceWithInterfaces(&mockEventRepository{
			findByIDFn: func(context.Context, string, *string) (*domain.Event, error) {
				return validEvent(domain.EventStatusDraft), nil
			},
			updateStatusFn: func(context.Context, string, domain.EventStatus, domain.EventStatus, *string) error { return dbErr },
		}, &mockCategoryRepository{}).UpdateEventStatus(context.Background(), "event-1", nil, domain.EventStatusPublished)
		if !errors.Is(err, dbErr) {
			t.Fatalf("error = %v", err)
		}
	})
}
