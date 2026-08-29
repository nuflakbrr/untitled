package service

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"
	"unicode"

	"venturo-skeleton-go/internal/modules/features/event/domain"
	"venturo-skeleton-go/internal/modules/features/event/dto"
	"venturo-skeleton-go/internal/modules/features/event/repository"

	"github.com/jackc/pgx/v5/pgconn"
)

var (
	ErrCategorySlugExists = errors.New("event category slug already exists")
	ErrInvalidEvent       = errors.New("invalid event data")
	ErrInvalidLifecycle   = errors.New("invalid event status transition")
	ErrCompletedImmutable = errors.New("completed event can only be changed by a superadmin")
)

type EventRepository interface {
	FindPublic(ctx context.Context, filter dto.EventQuery) ([]*domain.Event, int64, error)
	FindPublicBySlug(ctx context.Context, slug string) (*domain.Event, error)
	FindByID(ctx context.Context, id string, scopeTenantID *string) (*domain.Event, error)
	SlugExists(ctx context.Context, slug string) (bool, error)
	Create(ctx context.Context, event *domain.Event) error
	Update(ctx context.Context, event *domain.Event, scopeTenantID *string) error
	UpdateStatus(ctx context.Context, id string, current, next domain.EventStatus, scopeTenantID *string) error
	Delete(ctx context.Context, id string, scopeTenantID *string) error
}

type CategoryRepository interface {
	FindAll(ctx context.Context, tenantID *string) ([]*domain.Category, error)
	FindByID(ctx context.Context, id string, scopeTenantID *string) (*domain.Category, error)
	FindAccessible(ctx context.Context, id, tenantID string) (*domain.Category, error)
	FindBySlug(ctx context.Context, tenantID, slug string) (*domain.Category, error)
	Create(ctx context.Context, category *domain.Category) error
	Update(ctx context.Context, category *domain.Category, scopeTenantID *string) error
	Delete(ctx context.Context, id string, scopeTenantID *string) error
}

type EventService struct {
	events     EventRepository
	categories CategoryRepository
}

func NewEventService(events *repository.EventRepository, categories *repository.CategoryRepository) *EventService {
	return &EventService{events: events, categories: categories}
}

func NewEventServiceWithInterfaces(events EventRepository, categories CategoryRepository) *EventService {
	return &EventService{events: events, categories: categories}
}

func (s *EventService) ListCategories(ctx context.Context, tenantID *string) ([]dto.CategoryResponse, error) {
	categories, err := s.categories.FindAll(ctx, tenantID)
	if err != nil {
		return nil, err
	}
	result := make([]dto.CategoryResponse, 0, len(categories))
	for _, category := range categories {
		result = append(result, toCategoryResponse(category))
	}
	return result, nil
}

func (s *EventService) CreateCategory(ctx context.Context, tenantID string, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	name := strings.TrimSpace(req.Name)
	slug := slugify(name)
	if slug == "" {
		return nil, fmt.Errorf("%w: category name must contain letters or numbers", ErrInvalidEvent)
	}
	if existing, err := s.categories.FindBySlug(ctx, tenantID, slug); err == nil && existing != nil {
		return nil, ErrCategorySlugExists
	} else if err != nil && !errors.Is(err, repository.ErrCategoryNotFound) {
		return nil, err
	}

	category := &domain.Category{TenantID: &tenantID, Name: name, Slug: slug, Description: trimOptional(req.Description)}
	if err := s.categories.Create(ctx, category); err != nil {
		if isUniqueViolation(err, "uq_event_categories_tenant_slug") {
			return nil, ErrCategorySlugExists
		}
		return nil, err
	}
	response := toCategoryResponse(category)
	return &response, nil
}

func (s *EventService) UpdateCategory(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	category, err := s.categories.FindByID(ctx, id, scopeTenantID)
	if err != nil {
		return nil, err
	}
	if category.TenantID == nil {
		return nil, fmt.Errorf("%w: global categories are seed-managed", ErrInvalidEvent)
	}
	if req.Name != nil {
		name := strings.TrimSpace(*req.Name)
		slug := slugify(name)
		if slug == "" {
			return nil, fmt.Errorf("%w: category name must contain letters or numbers", ErrInvalidEvent)
		}
		if existing, findErr := s.categories.FindBySlug(ctx, *category.TenantID, slug); findErr == nil && existing.ID != category.ID {
			return nil, ErrCategorySlugExists
		} else if findErr != nil && !errors.Is(findErr, repository.ErrCategoryNotFound) {
			return nil, findErr
		}
		category.Name = name
		category.Slug = slug
	}
	if req.Description != nil {
		category.Description = trimOptional(req.Description)
	}
	if err := s.categories.Update(ctx, category, scopeTenantID); err != nil {
		return nil, err
	}
	response := toCategoryResponse(category)
	return &response, nil
}

func (s *EventService) DeleteCategory(ctx context.Context, id string, scopeTenantID *string) error {
	category, err := s.categories.FindByID(ctx, id, scopeTenantID)
	if err != nil {
		return err
	}
	if category.TenantID == nil {
		return fmt.Errorf("%w: global categories are seed-managed", ErrInvalidEvent)
	}
	return s.categories.Delete(ctx, id, scopeTenantID)
}

func (s *EventService) ListPublicEvents(ctx context.Context, filter dto.EventQuery) ([]dto.EventResponse, int64, error) {
	events, total, err := s.events.FindPublic(ctx, filter)
	if err != nil {
		return nil, 0, err
	}
	result := make([]dto.EventResponse, 0, len(events))
	for _, event := range events {
		result = append(result, toEventResponse(event))
	}
	return result, total, nil
}

func (s *EventService) GetPublicEvent(ctx context.Context, slug string) (*dto.EventResponse, error) {
	event, err := s.events.FindPublicBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	response := toEventResponse(event)
	return &response, nil
}

func (s *EventService) CreateEvent(ctx context.Context, tenantID, userID string, req dto.CreateEventRequest) (*dto.EventResponse, error) {
	event := &domain.Event{
		TenantID: tenantID, CategoryID: normalizeID(req.CategoryID), Title: strings.TrimSpace(req.Title),
		Description: strings.TrimSpace(req.Description), Banner: trimOptional(req.Banner),
		StartDate: req.StartDate, EndDate: req.EndDate, StartTime: strings.TrimSpace(req.StartTime),
		EndTime: strings.TrimSpace(req.EndTime), Location: strings.TrimSpace(req.Location),
		MeetingLink: trimOptional(req.MeetingLink), EventType: domain.EventType(req.EventType),
		OnlineAttendance: req.OnlineAttendance, RegistrationDeadline: req.RegistrationDeadline,
		Quota: req.Quota, Price: req.Price, Status: domain.EventStatusDraft,
		CertificateEnabled: req.CertificateEnabled, CreatedByID: &userID,
		Speakers: speakersFromRequest(req.Speakers), Benefits: benefitsFromRequest(req.Benefits),
	}
	if err := validateEvent(event); err != nil {
		return nil, err
	}
	if err := s.validateCategory(ctx, event.CategoryID, tenantID); err != nil {
		return nil, err
	}

	for attempt := 0; attempt < 3; attempt++ {
		slug, err := s.uniqueEventSlug(ctx, event.Title)
		if err != nil {
			return nil, err
		}
		event.Slug = slug
		if err := s.events.Create(ctx, event); err != nil {
			if isUniqueViolation(err, "events_slug_key") {
				continue
			}
			return nil, err
		}
		response := toEventResponse(event)
		return &response, nil
	}
	return nil, fmt.Errorf("create event after slug retries: %w", ErrInvalidEvent)
}

func (s *EventService) UpdateEvent(ctx context.Context, id string, scopeTenantID *string, allowCompleted bool, req dto.UpdateEventRequest) (*dto.EventResponse, error) {
	event, err := s.events.FindByID(ctx, id, scopeTenantID)
	if err != nil {
		return nil, err
	}
	if event.Status == domain.EventStatusCompleted && !allowCompleted {
		return nil, ErrCompletedImmutable
	}
	applyEventUpdate(event, req)
	if err := validateEvent(event); err != nil {
		return nil, err
	}
	if err := s.validateCategory(ctx, event.CategoryID, event.TenantID); err != nil {
		return nil, err
	}
	if err := s.events.Update(ctx, event, scopeTenantID); err != nil {
		return nil, err
	}
	response := toEventResponse(event)
	return &response, nil
}

func (s *EventService) UpdateEventStatus(ctx context.Context, id string, scopeTenantID *string, next domain.EventStatus) (*dto.EventResponse, error) {
	event, err := s.events.FindByID(ctx, id, scopeTenantID)
	if err != nil {
		return nil, err
	}
	if !canTransition(event.Status, next) {
		return nil, fmt.Errorf("%w: %s to %s", ErrInvalidLifecycle, event.Status, next)
	}
	if err := s.events.UpdateStatus(ctx, id, event.Status, next, scopeTenantID); err != nil {
		return nil, err
	}
	event.Status = next
	if next == domain.EventStatusPublished && event.PublishedAt == nil {
		now := time.Now()
		event.PublishedAt = &now
	}
	response := toEventResponse(event)
	return &response, nil
}

func (s *EventService) DeleteEvent(ctx context.Context, id string, scopeTenantID *string) error {
	return s.events.Delete(ctx, id, scopeTenantID)
}

func (s *EventService) validateCategory(ctx context.Context, categoryID *string, tenantID string) error {
	if categoryID == nil {
		return nil
	}
	_, err := s.categories.FindAccessible(ctx, *categoryID, tenantID)
	return err
}

func (s *EventService) uniqueEventSlug(ctx context.Context, title string) (string, error) {
	base := slugify(title)
	if base == "" {
		return "", fmt.Errorf("%w: title must contain letters or numbers", ErrInvalidEvent)
	}
	for suffix := 1; ; suffix++ {
		candidate := base
		if suffix > 1 {
			candidate = fmt.Sprintf("%s-%d", base, suffix)
		}
		exists, err := s.events.SlugExists(ctx, candidate)
		if err != nil {
			return "", err
		}
		if !exists {
			return candidate, nil
		}
	}
}

func validateEvent(event *domain.Event) error {
	if event.Title == "" || event.Description == "" || event.Location == "" {
		return fmt.Errorf("%w: title, description, and location are required", ErrInvalidEvent)
	}
	startTime, err := time.Parse("15:04", event.StartTime)
	if err != nil {
		return fmt.Errorf("%w: start_time must use HH:MM", ErrInvalidEvent)
	}
	endTime, err := time.Parse("15:04", event.EndTime)
	if err != nil {
		return fmt.Errorf("%w: end_time must use HH:MM", ErrInvalidEvent)
	}
	start := time.Date(event.StartDate.Year(), event.StartDate.Month(), event.StartDate.Day(), startTime.Hour(), startTime.Minute(), 0, 0, event.StartDate.Location())
	end := time.Date(event.EndDate.Year(), event.EndDate.Month(), event.EndDate.Day(), endTime.Hour(), endTime.Minute(), 0, 0, event.EndDate.Location())
	if !end.After(start) {
		return fmt.Errorf("%w: event end must be after event start", ErrInvalidEvent)
	}
	if event.RegistrationDeadline.After(start) {
		return fmt.Errorf("%w: registration_deadline must not be after event start", ErrInvalidEvent)
	}
	if event.Quota < 1 || event.Price < 0 {
		return fmt.Errorf("%w: quota must be positive and price cannot be negative", ErrInvalidEvent)
	}
	for _, speaker := range event.Speakers {
		if speaker.Name == "" {
			return fmt.Errorf("%w: speaker name is required", ErrInvalidEvent)
		}
	}
	for _, benefit := range event.Benefits {
		if benefit.Title == "" {
			return fmt.Errorf("%w: benefit title is required", ErrInvalidEvent)
		}
	}
	return nil
}

func canTransition(current, next domain.EventStatus) bool {
	return current == domain.EventStatusDraft && next == domain.EventStatusPublished ||
		current == domain.EventStatusPublished && next == domain.EventStatusClosed ||
		current == domain.EventStatusClosed && next == domain.EventStatusCompleted
}

func applyEventUpdate(event *domain.Event, req dto.UpdateEventRequest) {
	if req.Title != nil {
		event.Title = strings.TrimSpace(*req.Title)
	}
	if req.CategoryID != nil {
		event.CategoryID = normalizeID(req.CategoryID)
	}
	if req.Description != nil {
		event.Description = strings.TrimSpace(*req.Description)
	}
	if req.Banner != nil {
		event.Banner = trimOptional(req.Banner)
	}
	if req.StartDate != nil {
		event.StartDate = *req.StartDate
	}
	if req.EndDate != nil {
		event.EndDate = *req.EndDate
	}
	if req.StartTime != nil {
		event.StartTime = strings.TrimSpace(*req.StartTime)
	}
	if req.EndTime != nil {
		event.EndTime = strings.TrimSpace(*req.EndTime)
	}
	if req.Location != nil {
		event.Location = strings.TrimSpace(*req.Location)
	}
	if req.MeetingLink != nil {
		event.MeetingLink = trimOptional(req.MeetingLink)
	}
	if req.EventType != nil {
		event.EventType = domain.EventType(*req.EventType)
	}
	if req.OnlineAttendance != nil {
		event.OnlineAttendance = *req.OnlineAttendance
	}
	if req.RegistrationDeadline != nil {
		event.RegistrationDeadline = *req.RegistrationDeadline
	}
	if req.Quota != nil {
		event.Quota = *req.Quota
	}
	if req.Price != nil {
		event.Price = *req.Price
	}
	if req.CertificateEnabled != nil {
		event.CertificateEnabled = *req.CertificateEnabled
	}
	if req.Speakers != nil {
		event.Speakers = speakersFromRequest(*req.Speakers)
	}
	if req.Benefits != nil {
		event.Benefits = benefitsFromRequest(*req.Benefits)
	}
}

func speakersFromRequest(requests []dto.SpeakerRequest) []domain.Speaker {
	speakers := make([]domain.Speaker, 0, len(requests))
	for _, request := range requests {
		speakers = append(speakers, domain.Speaker{
			Name: strings.TrimSpace(request.Name), Title: trimOptional(request.Title),
			Company: trimOptional(request.Company), CompanyURL: trimOptional(request.CompanyURL),
			GitHub: trimOptional(request.GitHub), Instagram: trimOptional(request.Instagram),
			LinkedIn: trimOptional(request.LinkedIn), Avatar: trimOptional(request.Avatar), Order: request.Order,
		})
	}
	return speakers
}

func benefitsFromRequest(requests []dto.BenefitRequest) []domain.Benefit {
	benefits := make([]domain.Benefit, 0, len(requests))
	for _, request := range requests {
		benefits = append(benefits, domain.Benefit{
			Title: strings.TrimSpace(request.Title), Description: trimOptional(request.Description),
			Icon: trimOptional(request.Icon), Order: request.Order,
		})
	}
	return benefits
}

func toEventResponse(event *domain.Event) dto.EventResponse {
	response := dto.EventResponse{
		ID: event.ID, TenantID: event.TenantID, CategoryID: event.CategoryID,
		Title: event.Title, Slug: event.Slug, Description: event.Description, Banner: event.Banner,
		StartDate: event.StartDate, EndDate: event.EndDate, StartTime: event.StartTime,
		EndTime: event.EndTime, Location: event.Location, MeetingLink: event.MeetingLink,
		EventType: string(event.EventType), OnlineAttendance: event.OnlineAttendance,
		RegistrationDeadline: event.RegistrationDeadline, Quota: event.Quota, Price: event.Price,
		Status: string(event.Status), CertificateEnabled: event.CertificateEnabled,
		PublishedAt: event.PublishedAt, CreatedAt: event.CreatedAt, UpdatedAt: event.UpdatedAt,
		CreatedByID: event.CreatedByID, Speakers: make([]dto.SpeakerResponse, 0, len(event.Speakers)),
		Benefits: make([]dto.BenefitResponse, 0, len(event.Benefits)),
	}
	if event.Category != nil {
		category := toCategoryResponse(event.Category)
		response.Category = &category
	}
	if event.Tenant != nil {
		response.Tenant = &dto.TenantInfoResponse{
			ID: event.Tenant.ID, Name: event.Tenant.Name, Slug: event.Tenant.Slug,
			Code: event.Tenant.Code, Type: event.Tenant.Type, LogoURL: event.Tenant.LogoURL,
			Website: event.Tenant.Website,
		}
	}
	if event.Creator != nil {
		response.Creator = &dto.CreatorInfoResponse{
			ID: event.Creator.ID, Name: event.Creator.Name, Email: event.Creator.Email, AvatarURL: event.Creator.AvatarURL,
		}
	}
	for _, speaker := range event.Speakers {
		response.Speakers = append(response.Speakers, dto.SpeakerResponse{
			ID: speaker.ID, Name: speaker.Name, Title: speaker.Title, Company: speaker.Company,
			CompanyURL: speaker.CompanyURL, GitHub: speaker.GitHub, Instagram: speaker.Instagram,
			LinkedIn: speaker.LinkedIn, Avatar: speaker.Avatar, Order: speaker.Order,
		})
	}
	for _, benefit := range event.Benefits {
		response.Benefits = append(response.Benefits, dto.BenefitResponse{
			ID: benefit.ID, Title: benefit.Title, Description: benefit.Description, Icon: benefit.Icon, Order: benefit.Order,
		})
	}
	return response
}

func toCategoryResponse(category *domain.Category) dto.CategoryResponse {
	return dto.CategoryResponse{ID: category.ID, TenantID: category.TenantID, Name: category.Name, Slug: category.Slug, Description: category.Description}
}

func normalizeID(value *string) *string {
	if value == nil {
		return nil
	}
	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

func trimOptional(value *string) *string {
	if value == nil {
		return nil
	}
	trimmed := strings.TrimSpace(*value)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}

func slugify(value string) string {
	var builder strings.Builder
	dash := false
	for _, r := range strings.ToLower(strings.TrimSpace(value)) {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			builder.WriteRune(r)
			dash = false
		} else if builder.Len() > 0 && !dash {
			builder.WriteByte('-')
			dash = true
		}
	}
	return strings.Trim(builder.String(), "-")
}

func isUniqueViolation(err error, constraint string) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505" && pgErr.ConstraintName == constraint
}
