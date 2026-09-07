package repository

import (
	"context"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/attendance/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrTokenNotFound    = errors.New("QR code not found")
	ErrEventMismatch    = errors.New("QR code does not belong to this event")
	ErrNotEligible      = errors.New("ticket is not eligible for check-in")
	ErrAlreadyCheckedIn = errors.New("participant has already checked in")
)

type AttendanceRepository struct {
	db *pgxpool.Pool
}

func NewAttendanceRepository(db *pgxpool.Pool) *AttendanceRepository {
	return &AttendanceRepository{db: db}
}

// Scan validates a qr_token against event_id (and, unless scopeTenantID is
// nil for a root superadmin, against the scanner's own tenant) and records
// check-in atomically. It always returns whatever participant/event context
// it managed to resolve — even on error — so callers can surface a useful
// message (e.g. "already checked in at 14:02") instead of a bare failure.
func (r *AttendanceRepository) Scan(ctx context.Context, qrToken, eventID, scannerID string, scopeTenantID *string) (*domain.Attendance, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, fmt.Errorf("begin attendance scan: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	att := &domain.Attendance{}
	var registrationID, regEventID, regStatus string
	conditions := "r.qr_token = $1 AND r.deleted_at IS NULL"
	args := []any{qrToken}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		conditions += fmt.Sprintf(" AND e.tenant_id = $%d", len(args))
	}
	err = tx.QueryRow(ctx, `
		SELECT r.id, r.event_id, r.status::text, r.registration_number,
		       COALESCE(u.name, ''), u.email, e.title
		FROM registrations r
		JOIN events e ON e.id = r.event_id
		JOIN core.users u ON u.id = r.user_id
		WHERE `+conditions+`
		FOR UPDATE OF r
	`, args...).Scan(&registrationID, &regEventID, &regStatus, &att.RegistrationNumber, &att.ParticipantName, &att.ParticipantEmail, &att.EventTitle)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrTokenNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("lookup registration by qr token: %w", err)
	}
	att.RegistrationID = registrationID
	att.EventID = regEventID

	if regEventID != eventID {
		return att, ErrEventMismatch
	}

	switch regStatus {
	case "WAITING_PAYMENT", "CANCELLED":
		return att, ErrNotEligible
	case "CHECKED_IN":
		_ = tx.QueryRow(ctx, `SELECT scan_time FROM attendances WHERE registration_id = $1`, registrationID).Scan(&att.ScanTime)
		return att, ErrAlreadyCheckedIn
	case "REGISTERED":
		// proceed to check-in below
	default:
		return att, ErrNotEligible
	}

	tag, err := tx.Exec(ctx, `UPDATE registrations SET status = 'CHECKED_IN', updated_at = NOW() WHERE id = $1 AND status = 'REGISTERED'`, registrationID)
	if err != nil {
		return att, fmt.Errorf("activate check-in: %w", err)
	}
	if tag.RowsAffected() == 0 {
		// Lost a race with another scan between the SELECT and this UPDATE.
		_ = tx.QueryRow(ctx, `SELECT scan_time FROM attendances WHERE registration_id = $1`, registrationID).Scan(&att.ScanTime)
		return att, ErrAlreadyCheckedIn
	}

	att.ID = uuid.NewString()
	att.ScannerID = scannerID
	att.Status = domain.StatusSuccess
	if err := tx.QueryRow(ctx, `
		INSERT INTO attendances (id, registration_id, scanner_id, status)
		VALUES ($1, $2, $3, 'SUCCESS')
		RETURNING scan_time
	`, att.ID, registrationID, scannerID).Scan(&att.ScanTime); err != nil {
		return att, fmt.Errorf("insert attendance: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return att, fmt.Errorf("commit attendance scan: %w", err)
	}
	return att, nil
}

func (r *AttendanceRepository) StatsByEvent(ctx context.Context, eventID string, scopeTenantID *string) (*domain.EventStats, error) {
	conditions := "r.event_id = $1 AND r.deleted_at IS NULL"
	args := []any{eventID}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		conditions += fmt.Sprintf(" AND e.tenant_id = $%d", len(args))
	}
	stats := &domain.EventStats{EventID: eventID}
	err := r.db.QueryRow(ctx, `
		SELECT
			COUNT(*) FILTER (WHERE r.status IN ('REGISTERED', 'CHECKED_IN')),
			COUNT(*) FILTER (WHERE r.status = 'CHECKED_IN')
		FROM registrations r
		JOIN events e ON e.id = r.event_id
		WHERE `+conditions, args...,
	).Scan(&stats.TotalRegistered, &stats.TotalCheckedIn)
	if err != nil {
		return nil, fmt.Errorf("count attendance stats: %w", err)
	}
	return stats, nil
}
