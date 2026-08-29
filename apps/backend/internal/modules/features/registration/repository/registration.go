package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"
	"unicode"

	"venturo-skeleton-go/internal/modules/features/registration/domain"
	"venturo-skeleton-go/internal/modules/features/registration/dto"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrRegistrationNotFound  = errors.New("registration not found")
	ErrEventNotAvailable     = errors.New("event is not available for registration")
	ErrRegistrationClosed    = errors.New("event registration is closed")
	ErrDuplicateRegistration = errors.New("user is already registered for this event")
	ErrQuotaFull             = errors.New("event quota is full")
	ErrOnlineUnavailable     = errors.New("online attendance is not available for this event")
	ErrQRTokenExists         = errors.New("registration QR token already exists")
	ErrPaymentInProgress     = errors.New("registration cannot be cancelled after payment has started")
)

const registrationSelect = `
	SELECT r.id, r.event_id, e.title, e.slug, e.banner, e.tenant_id, t.code,
	       r.user_id, COALESCE(u.name, ''), u.email, r.registration_number,
	       r.qr_token, r.online_attendance, r.status::text, e.price,
	       r.created_at, r.updated_at, r.deleted_at, e.start_date, e.location,
	       e.event_type::text,
	       CASE WHEN r.status = 'CHECKED_IN' THEN 'HADIR' ELSE 'BELUM HADIR' END,
	       CASE WHEN c.id IS NOT NULL THEN 'TERBIT'
            WHEN e.certificate_enabled THEN 'MENUNGGU TERBIT'
            ELSE 'TIDAK TERSEDIA' END
	FROM registrations r
	JOIN events e ON e.id = r.event_id
	JOIN core.tenants t ON t.id = e.tenant_id
	JOIN core.users u ON u.id = r.user_id
	LEFT JOIN certificates c ON c.registration_id = r.id`

type RegistrationRepository struct {
	db *pgxpool.Pool
}

func NewRegistrationRepository(db *pgxpool.Pool) *RegistrationRepository {
	return &RegistrationRepository{db: db}
}

func (r *RegistrationRepository) Create(ctx context.Context, userID, eventID string, onlineAttendance bool, qrToken string) (*domain.Registration, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin registration: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	registration := &domain.Registration{ID: uuid.NewString(), EventID: eventID, UserID: userID, QRToken: qrToken, OnlineAttendance: onlineAttendance}
	var eventStatus string
	var eventQuota int
	var eventAllowsOnline bool
	var registrationDeadline, eventStart time.Time
	err = tx.QueryRow(ctx, `
		SELECT e.title, e.slug, e.tenant_id, t.code, e.quota, e.price,
		       e.online_attendance, e.registration_deadline, e.start_date,
		       e.status::text, COALESCE(u.name, ''), u.email
		FROM events e
		JOIN core.tenants t ON t.id = e.tenant_id
		JOIN core.users u ON u.id = $2
		WHERE e.id = $1 AND e.deleted_at IS NULL
		FOR UPDATE OF e
	`, eventID, userID).Scan(
		&registration.EventTitle, &registration.EventSlug, &registration.TenantID,
		&registration.TenantCode, &eventQuota, &registration.Price, &eventAllowsOnline,
		&registrationDeadline, &eventStart, &eventStatus, &registration.UserName, &registration.UserEmail,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrEventNotAvailable
	}
	if err != nil {
		return nil, fmt.Errorf("lock registration event: %w", err)
	}
	if eventStatus != "PUBLISHED" {
		return nil, ErrEventNotAvailable
	}
	if time.Now().After(registrationDeadline) {
		return nil, ErrRegistrationClosed
	}
	if onlineAttendance && !eventAllowsOnline {
		return nil, ErrOnlineUnavailable
	}

	var duplicate bool
	if err := tx.QueryRow(ctx, `
		SELECT EXISTS(
			SELECT 1 FROM registrations
			WHERE event_id = $1 AND user_id = $2 AND deleted_at IS NULL
			  AND status IN ('WAITING_PAYMENT', 'REGISTERED', 'CHECKED_IN')
		)
	`, eventID, userID).Scan(&duplicate); err != nil {
		return nil, fmt.Errorf("check duplicate registration: %w", err)
	}
	if duplicate {
		return nil, ErrDuplicateRegistration
	}

	var occupied, counter int64
	if err := tx.QueryRow(ctx, `
		SELECT COUNT(*) FILTER (
			WHERE deleted_at IS NULL AND status IN ('WAITING_PAYMENT', 'REGISTERED', 'CHECKED_IN')
		), COUNT(*)
		FROM registrations WHERE event_id = $1
	`, eventID).Scan(&occupied, &counter); err != nil {
		return nil, fmt.Errorf("count event registrations: %w", err)
	}
	if occupied >= int64(eventQuota) {
		return nil, ErrQuotaFull
	}

	registration.RegistrationNumber = makeRegistrationNumber(registration.TenantCode, registration.EventSlug, eventStart.Year(), counter+1)
	registration.Status = domain.StatusRegistered
	if registration.Price > 0 {
		registration.Status = domain.StatusWaitingPayment
	}
	err = tx.QueryRow(ctx, `
		INSERT INTO registrations (
			id, event_id, user_id, registration_number, qr_token, online_attendance, status
		) VALUES ($1, $2, $3, $4, $5, $6, $7::registration_status)
		RETURNING created_at, updated_at
	`, registration.ID, registration.EventID, registration.UserID, registration.RegistrationNumber,
		registration.QRToken, registration.OnlineAttendance, registration.Status,
	).Scan(&registration.CreatedAt, &registration.UpdatedAt)
	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" && pgErr.ConstraintName == "registrations_qr_token_key" {
			return nil, ErrQRTokenExists
		}
		return nil, fmt.Errorf("insert registration: %w", err)
	}
	if registration.Price > 0 {
		_, err = tx.Exec(ctx, `
			INSERT INTO payments (id, registration_id, amount, status, provider)
			VALUES (
				$1, $2, $3, 'WAITING',
				COALESCE((
					SELECT provider FROM tenant_payment_gateways
					WHERE tenant_id = $4 AND is_active = TRUE
				), 'MANUAL')
			)
		`, uuid.NewString(), registration.ID, registration.Price, registration.TenantID)
		if err != nil {
			return nil, fmt.Errorf("insert registration payment: %w", err)
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return nil, fmt.Errorf("commit registration: %w", err)
	}
	return registration, nil
}

func (r *RegistrationRepository) ListMine(ctx context.Context, userID string, query dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
	return r.list(ctx, []string{"r.user_id = $1"}, []any{userID}, query)
}

func (r *RegistrationRepository) ListByEvent(ctx context.Context, eventID string, scopeTenantID *string, query dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
	conditions := []string{"r.event_id = $1"}
	args := []any{eventID}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		conditions = append(conditions, fmt.Sprintf("e.tenant_id = $%d", len(args)))
	}
	return r.list(ctx, conditions, args, query)
}

func (r *RegistrationRepository) ListForExport(ctx context.Context, eventID string, scopeTenantID *string) ([]*domain.Registration, error) {
	conditions := []string{"r.event_id = $1"}
	args := []any{eventID}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		conditions = append(conditions, fmt.Sprintf("e.tenant_id = $%d", len(args)))
	}
	rows, err := r.db.Query(ctx, registrationSelect+" WHERE "+strings.Join(conditions, " AND ")+" ORDER BY r.created_at ASC", args...)
	if err != nil {
		return nil, fmt.Errorf("query registrations for export: %w", err)
	}
	defer rows.Close()
	registrations, err := scanRegistrations(rows)
	if err != nil {
		return nil, err
	}
	return registrations, nil
}

func (r *RegistrationRepository) CancelMine(ctx context.Context, id, userID string) error {
	tag, err := r.db.Exec(ctx, `
		UPDATE registrations r
		SET status = 'CANCELLED', deleted_at = NOW(), updated_at = NOW()
		WHERE r.id = $1 AND r.user_id = $2 AND r.deleted_at IS NULL
		  AND r.status IN ('WAITING_PAYMENT', 'REGISTERED')
		  AND NOT EXISTS (
			SELECT 1 FROM payments p
			WHERE p.registration_id = r.id
			  AND (p.checkout_token IS NOT NULL OR p.transaction_id IS NOT NULL OR p.proof_url IS NOT NULL)
		  )
	`, id, userID)
	if err != nil {
		return fmt.Errorf("cancel registration: %w", err)
	}
	if tag.RowsAffected() == 0 {
		var paymentInProgress bool
		if err := r.db.QueryRow(ctx, `
			SELECT EXISTS(
				SELECT 1 FROM registrations r
				JOIN payments p ON p.registration_id = r.id
				WHERE r.id = $1 AND r.user_id = $2 AND r.deleted_at IS NULL
				  AND r.status IN ('WAITING_PAYMENT', 'REGISTERED')
				  AND (p.checkout_token IS NOT NULL OR p.transaction_id IS NOT NULL OR p.proof_url IS NOT NULL)
			)
		`, id, userID).Scan(&paymentInProgress); err != nil {
			return fmt.Errorf("check registration payment progress: %w", err)
		}
		if paymentInProgress {
			return ErrPaymentInProgress
		}
		return ErrRegistrationNotFound
	}
	return nil
}

func (r *RegistrationRepository) list(ctx context.Context, conditions []string, args []any, query dto.RegistrationQuery) ([]*domain.Registration, int64, error) {
	conditions = append(conditions, "r.deleted_at IS NULL")
	if query.Status != "" {
		args = append(args, query.Status)
		conditions = append(conditions, fmt.Sprintf("r.status = $%d::registration_status", len(args)))
	}
	where := " WHERE " + strings.Join(conditions, " AND ")
	var total int64
	if err := r.db.QueryRow(ctx, "SELECT COUNT(*) "+registrationSelect[strings.Index(registrationSelect, "FROM"):]+where, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("count registrations: %w", err)
	}
	page, limit := pagination(query)
	args = append(args, limit, (page-1)*limit)
	rows, err := r.db.Query(ctx, registrationSelect+where+fmt.Sprintf(" ORDER BY r.created_at DESC LIMIT $%d OFFSET $%d", len(args)-1, len(args)), args...)
	if err != nil {
		return nil, 0, fmt.Errorf("query registrations: %w", err)
	}
	defer rows.Close()
	registrations, err := scanRegistrations(rows)
	if err != nil {
		return nil, 0, err
	}
	return registrations, total, nil
}

func scanRegistrations(rows pgx.Rows) ([]*domain.Registration, error) {
	registrations := make([]*domain.Registration, 0)
	for rows.Next() {
		registration := new(domain.Registration)
		var status string
		if err := rows.Scan(
			&registration.ID, &registration.EventID, &registration.EventTitle, &registration.EventSlug,
			&registration.EventBanner,
			&registration.TenantID, &registration.TenantCode, &registration.UserID,
			&registration.UserName, &registration.UserEmail, &registration.RegistrationNumber,
			&registration.QRToken, &registration.OnlineAttendance, &status, &registration.Price,
			&registration.CreatedAt, &registration.UpdatedAt, &registration.DeletedAt,
			&registration.EventStartDate, &registration.EventLocation, &registration.EventType,
			&registration.AttendanceStatus, &registration.CertificateStatus,
		); err != nil {
			return nil, fmt.Errorf("scan registration: %w", err)
		}
		registration.Status = domain.Status(status)
		registrations = append(registrations, registration)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate registrations: %w", err)
	}
	return registrations, nil
}

func pagination(query dto.RegistrationQuery) (int, int) {
	page, limit := query.Page, query.Limit
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}
	return page, limit
}

func makeRegistrationNumber(tenantCode, eventSlug string, year int, counter int64) string {
	code := identifierPart(tenantCode)
	slug := identifierPart(eventSlug)
	suffix := fmt.Sprintf("-%d-%05d", year, counter)
	prefix := "REG-" + code + "-"
	maxSlug := 100 - len(prefix) - len(suffix)
	if maxSlug < 1 {
		maxSlug = 1
	}
	if len(slug) > maxSlug {
		slug = strings.Trim(slug[:maxSlug], "-")
	}
	return prefix + slug + suffix
}

func identifierPart(value string) string {
	var builder strings.Builder
	dash := false
	for _, char := range strings.ToUpper(strings.TrimSpace(value)) {
		if unicode.IsLetter(char) || unicode.IsDigit(char) {
			builder.WriteRune(char)
			dash = false
		} else if builder.Len() > 0 && !dash {
			builder.WriteByte('-')
			dash = true
		}
	}
	return strings.Trim(builder.String(), "-")
}
