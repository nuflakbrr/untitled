package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"venturo-skeleton-go/internal/modules/features/event/domain"
	"venturo-skeleton-go/internal/modules/features/event/dto"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrEventNotFound      = errors.New("event not found")
	ErrEventStatusChanged = errors.New("event status changed concurrently")
)

const eventSelect = `
	SELECT e.id, e.tenant_id, e.category_id, e.title, e.slug, e.description,
	       e.banner, e.start_date, e.end_date, e.start_time, e.end_time,
	       e.location, e.meeting_link, e.event_type::text, e.online_attendance,
	       e.registration_deadline, e.quota, e.price, e.status::text,
	       e.certificate_enabled, e.published_at, e.created_at, e.updated_at,
	       e.deleted_at, e.created_by_id,
	       c.id, c.tenant_id, c.name, c.slug, c.description
	FROM events e
	LEFT JOIN event_categories c ON c.id = e.category_id`

type EventRepository struct {
	db *pgxpool.Pool
}

func NewEventRepository(db *pgxpool.Pool) *EventRepository {
	return &EventRepository{db: db}
}

func (r *EventRepository) FindPublic(ctx context.Context, filter dto.EventQuery) ([]*domain.Event, int64, error) {
	conditions := []string{"e.deleted_at IS NULL", "e.status <> 'DRAFT'"}
	args := make([]any, 0, 8)
	add := func(condition string, value any) {
		args = append(args, value)
		conditions = append(conditions, fmt.Sprintf(condition, len(args)))
	}

	if filter.CategorySlug != "" {
		add("c.slug = $%d", filter.CategorySlug)
	}
	if filter.TenantID != "" {
		add("e.tenant_id = $%d", filter.TenantID)
	}
	if filter.Status != "" {
		add("e.status = $%d::event_status", filter.Status)
	} else {
		conditions = append(conditions, "e.status = 'PUBLISHED'")
	}
	if filter.EventType != "" {
		add("e.event_type = $%d::event_type", filter.EventType)
	}
	if filter.Search != "" {
		add("(e.title ILIKE $%[1]d OR e.description ILIKE $%[1]d)", "%"+filter.Search+"%")
	}

	where := " WHERE " + strings.Join(conditions, " AND ")
	var total int64
	if err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM events e LEFT JOIN event_categories c ON c.id = e.category_id"+where, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("count events: %w", err)
	}

	limit := filter.Limit
	if limit <= 0 {
		limit = 10
	}
	page := filter.Page
	if page <= 0 {
		page = 1
	}
	args = append(args, limit, (page-1)*limit)
	query := eventSelect + where + fmt.Sprintf(" ORDER BY e.start_date ASC LIMIT $%d OFFSET $%d", len(args)-1, len(args))

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("query events: %w", err)
	}
	defer rows.Close()

	events := make([]*domain.Event, 0)
	for rows.Next() {
		event, err := scanEvent(rows)
		if err != nil {
			return nil, 0, err
		}
		events = append(events, event)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("iterate events: %w", err)
	}
	return events, total, nil
}

func (r *EventRepository) FindPublicBySlug(ctx context.Context, slug string) (*domain.Event, error) {
	event, err := scanEvent(r.db.QueryRow(ctx, eventSelect+" WHERE e.slug = $1 AND e.deleted_at IS NULL AND e.status <> 'DRAFT'", slug))
	if err != nil {
		return nil, err
	}
	if err := r.loadRelations(ctx, event); err != nil {
		return nil, err
	}
	return event, nil
}

func (r *EventRepository) FindByID(ctx context.Context, id string, scopeTenantID *string) (*domain.Event, error) {
	query := eventSelect + " WHERE e.id = $1 AND e.deleted_at IS NULL"
	args := []any{id}
	if scopeTenantID != nil {
		query += " AND e.tenant_id = $2"
		args = append(args, *scopeTenantID)
	}
	event, err := scanEvent(r.db.QueryRow(ctx, query, args...))
	if err != nil {
		return nil, err
	}
	if err := r.loadRelations(ctx, event); err != nil {
		return nil, err
	}
	return event, nil
}

func (r *EventRepository) SlugExists(ctx context.Context, slug string) (bool, error) {
	var exists bool
	if err := r.db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM events WHERE slug = $1)", slug).Scan(&exists); err != nil {
		return false, fmt.Errorf("check event slug: %w", err)
	}
	return exists, nil
}

func (r *EventRepository) Create(ctx context.Context, event *domain.Event) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin create event: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	event.ID = uuid.NewString()
	err = tx.QueryRow(ctx, `
		INSERT INTO events (
			id, tenant_id, category_id, title, slug, description, banner,
			start_date, end_date, start_time, end_time, location, meeting_link,
			event_type, online_attendance, registration_deadline, quota, price,
			status, certificate_enabled, published_at, created_by_id
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
			$14::event_type, $15, $16, $17, $18, $19::event_status, $20, $21, $22
		) RETURNING created_at, updated_at
	`, event.ID, event.TenantID, event.CategoryID, event.Title, event.Slug, event.Description,
		event.Banner, event.StartDate, event.EndDate, event.StartTime, event.EndTime,
		event.Location, event.MeetingLink, event.EventType, event.OnlineAttendance,
		event.RegistrationDeadline, event.Quota, event.Price, event.Status,
		event.CertificateEnabled, event.PublishedAt, event.CreatedByID,
	).Scan(&event.CreatedAt, &event.UpdatedAt)
	if err != nil {
		return fmt.Errorf("insert event: %w", err)
	}

	if err := replaceRelations(ctx, tx, event); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit create event: %w", err)
	}
	return nil
}

func (r *EventRepository) Update(ctx context.Context, event *domain.Event, scopeTenantID *string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin update event: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	query := `
		UPDATE events SET category_id = $2, title = $3, description = $4, banner = $5,
			start_date = $6, end_date = $7, start_time = $8, end_time = $9,
			location = $10, meeting_link = $11, event_type = $12::event_type,
			online_attendance = $13, registration_deadline = $14, quota = $15,
			price = $16, certificate_enabled = $17, updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL`
	args := []any{event.ID, event.CategoryID, event.Title, event.Description, event.Banner,
		event.StartDate, event.EndDate, event.StartTime, event.EndTime, event.Location,
		event.MeetingLink, event.EventType, event.OnlineAttendance, event.RegistrationDeadline,
		event.Quota, event.Price, event.CertificateEnabled}
	if scopeTenantID != nil {
		query += " AND tenant_id = $18"
		args = append(args, *scopeTenantID)
	}
	query += " RETURNING updated_at"
	if err := tx.QueryRow(ctx, query, args...).Scan(&event.UpdatedAt); errors.Is(err, pgx.ErrNoRows) {
		return ErrEventNotFound
	} else if err != nil {
		return fmt.Errorf("update event: %w", err)
	}

	if _, err := tx.Exec(ctx, "DELETE FROM event_speakers WHERE event_id = $1", event.ID); err != nil {
		return fmt.Errorf("replace event speakers: %w", err)
	}
	if _, err := tx.Exec(ctx, "DELETE FROM event_benefits WHERE event_id = $1", event.ID); err != nil {
		return fmt.Errorf("replace event benefits: %w", err)
	}
	if err := replaceRelations(ctx, tx, event); err != nil {
		return err
	}
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("commit update event: %w", err)
	}
	return nil
}

func (r *EventRepository) UpdateStatus(ctx context.Context, id string, current, next domain.EventStatus, scopeTenantID *string) error {
	query := `
		UPDATE events SET status = $2::event_status,
			published_at = CASE WHEN $2 = 'PUBLISHED' THEN COALESCE(published_at, NOW()) ELSE published_at END,
			updated_at = NOW()
		WHERE id = $1 AND deleted_at IS NULL AND status = $3::event_status`
	args := []any{id, next, current}
	if scopeTenantID != nil {
		query += " AND tenant_id = $4"
		args = append(args, *scopeTenantID)
	}
	tag, err := r.db.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("update event status: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrEventStatusChanged
	}
	return nil
}

func (r *EventRepository) Delete(ctx context.Context, id string, scopeTenantID *string) error {
	query := "UPDATE events SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL"
	args := []any{id}
	if scopeTenantID != nil {
		query += " AND tenant_id = $2"
		args = append(args, *scopeTenantID)
	}
	tag, err := r.db.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("delete event: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrEventNotFound
	}
	return nil
}

type rowScanner interface {
	Scan(dest ...any) error
}

func scanEvent(row rowScanner) (*domain.Event, error) {
	event := new(domain.Event)
	var eventType, status string
	var categoryID, categoryTenantID, categoryName, categorySlug, categoryDescription *string
	err := row.Scan(
		&event.ID, &event.TenantID, &event.CategoryID, &event.Title, &event.Slug,
		&event.Description, &event.Banner, &event.StartDate, &event.EndDate,
		&event.StartTime, &event.EndTime, &event.Location, &event.MeetingLink,
		&eventType, &event.OnlineAttendance, &event.RegistrationDeadline,
		&event.Quota, &event.Price, &status, &event.CertificateEnabled,
		&event.PublishedAt, &event.CreatedAt, &event.UpdatedAt, &event.DeletedAt,
		&event.CreatedByID, &categoryID, &categoryTenantID, &categoryName,
		&categorySlug, &categoryDescription,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrEventNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("scan event: %w", err)
	}
	event.EventType = domain.EventType(eventType)
	event.Status = domain.EventStatus(status)
	if categoryID != nil {
		event.Category = &domain.Category{
			ID: *categoryID, TenantID: categoryTenantID, Name: *categoryName,
			Slug: *categorySlug, Description: categoryDescription,
		}
	}
	return event, nil
}

func (r *EventRepository) loadRelations(ctx context.Context, event *domain.Event) error {
	speakerRows, err := r.db.Query(ctx, `
		SELECT id, event_id, name, title, company, company_url, github, instagram, linked_in, avatar, "order"
		FROM event_speakers WHERE event_id = $1 ORDER BY "order", created_at
	`, event.ID)
	if err != nil {
		return fmt.Errorf("query event speakers: %w", err)
	}
	defer speakerRows.Close()
	for speakerRows.Next() {
		var speaker domain.Speaker
		if err := speakerRows.Scan(&speaker.ID, &speaker.EventID, &speaker.Name, &speaker.Title,
			&speaker.Company, &speaker.CompanyURL, &speaker.GitHub, &speaker.Instagram,
			&speaker.LinkedIn, &speaker.Avatar, &speaker.Order); err != nil {
			return fmt.Errorf("scan event speaker: %w", err)
		}
		event.Speakers = append(event.Speakers, speaker)
	}
	if err := speakerRows.Err(); err != nil {
		return fmt.Errorf("iterate event speakers: %w", err)
	}

	benefitRows, err := r.db.Query(ctx, `
		SELECT id, event_id, title, description, icon, "order"
		FROM event_benefits WHERE event_id = $1 ORDER BY "order", created_at
	`, event.ID)
	if err != nil {
		return fmt.Errorf("query event benefits: %w", err)
	}
	defer benefitRows.Close()
	for benefitRows.Next() {
		var benefit domain.Benefit
		if err := benefitRows.Scan(&benefit.ID, &benefit.EventID, &benefit.Title,
			&benefit.Description, &benefit.Icon, &benefit.Order); err != nil {
			return fmt.Errorf("scan event benefit: %w", err)
		}
		event.Benefits = append(event.Benefits, benefit)
	}
	if err := benefitRows.Err(); err != nil {
		return fmt.Errorf("iterate event benefits: %w", err)
	}
	return nil
}

func replaceRelations(ctx context.Context, tx pgx.Tx, event *domain.Event) error {
	for i := range event.Speakers {
		speaker := &event.Speakers[i]
		if speaker.ID == "" {
			speaker.ID = uuid.NewString()
		}
		speaker.EventID = event.ID
		_, err := tx.Exec(ctx, `
			INSERT INTO event_speakers
				(id, event_id, name, title, company, company_url, github, instagram, linked_in, avatar, "order")
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		`, speaker.ID, speaker.EventID, speaker.Name, speaker.Title, speaker.Company,
			speaker.CompanyURL, speaker.GitHub, speaker.Instagram, speaker.LinkedIn,
			speaker.Avatar, speaker.Order)
		if err != nil {
			return fmt.Errorf("insert event speaker: %w", err)
		}
	}
	for i := range event.Benefits {
		benefit := &event.Benefits[i]
		if benefit.ID == "" {
			benefit.ID = uuid.NewString()
		}
		benefit.EventID = event.ID
		_, err := tx.Exec(ctx, `
			INSERT INTO event_benefits (id, event_id, title, description, icon, "order")
			VALUES ($1, $2, $3, $4, $5, $6)
		`, benefit.ID, benefit.EventID, benefit.Title, benefit.Description, benefit.Icon, benefit.Order)
		if err != nil {
			return fmt.Errorf("insert event benefit: %w", err)
		}
	}
	return nil
}
