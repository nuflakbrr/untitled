package repository

import (
	"context"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/support/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrMessageNotFound = errors.New("support message not found")

const supportSelect = `SELECT id, tenant_id, email, phone, name, title, category, chronology, status, user_id, created_at, updated_at FROM support_messages`

type SupportRepository struct {
	db *pgxpool.Pool
}

func NewSupportRepository(db *pgxpool.Pool) *SupportRepository {
	return &SupportRepository{db: db}
}

func (r *SupportRepository) Create(ctx context.Context, message *domain.SupportMessage) error {
	message.ID = uuid.NewString()
	if message.Status == "" {
		message.Status = domain.StatusPending
	}
	err := r.db.QueryRow(ctx, `
		INSERT INTO support_messages (id, tenant_id, email, phone, name, title, category, chronology, status, user_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING created_at, updated_at
	`, message.ID, message.TenantID, message.Email, message.Phone, message.Name, message.Title,
		message.Category, message.Chronology, message.Status, message.UserID,
	).Scan(&message.CreatedAt, &message.UpdatedAt)
	if err != nil {
		return fmt.Errorf("create support message: %w", err)
	}
	return nil
}

func (r *SupportRepository) FindAll(ctx context.Context, scopeTenantID *string, status string, page, limit int) ([]*domain.SupportMessage, int64, error) {
	conditions := []string{"1 = 1"}
	args := []any{}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		conditions = append(conditions, fmt.Sprintf("tenant_id = $%d", len(args)))
	}
	if status != "" {
		args = append(args, status)
		conditions = append(conditions, fmt.Sprintf("status = $%d", len(args)))
	}
	where := " WHERE " + joinAnd(conditions)

	var total int64
	if err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM support_messages"+where, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("count support messages: %w", err)
	}

	args = append(args, limit, (page-1)*limit)
	rows, err := r.db.Query(ctx, supportSelect+where+fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", len(args)-1, len(args)), args...)
	if err != nil {
		return nil, 0, fmt.Errorf("query support messages: %w", err)
	}
	defer rows.Close()

	messages := make([]*domain.SupportMessage, 0)
	for rows.Next() {
		message := new(domain.SupportMessage)
		if err := rows.Scan(
			&message.ID, &message.TenantID, &message.Email, &message.Phone, &message.Name, &message.Title,
			&message.Category, &message.Chronology, &message.Status, &message.UserID, &message.CreatedAt, &message.UpdatedAt,
		); err != nil {
			return nil, 0, fmt.Errorf("scan support message: %w", err)
		}
		messages = append(messages, message)
	}
	if err := rows.Err(); err != nil {
		return nil, 0, fmt.Errorf("iterate support messages: %w", err)
	}
	return messages, total, nil
}

func (r *SupportRepository) UpdateStatus(ctx context.Context, id, status string, scopeTenantID *string) error {
	query := `UPDATE support_messages SET status = $2, updated_at = NOW() WHERE id = $1`
	args := []any{id, status}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		query += fmt.Sprintf(" AND tenant_id = $%d", len(args))
	}
	tag, err := r.db.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("update support message status: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrMessageNotFound
	}
	return nil
}

func joinAnd(conditions []string) string {
	result := conditions[0]
	for _, c := range conditions[1:] {
		result += " AND " + c
	}
	return result
}
