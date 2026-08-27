package audit

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

type ListFilter struct {
	TenantID *string
	UserID   string
	Entity   string
	EntityID string
	Action   string
	Page     int
	Limit    int
}

func (r *Repository) List(ctx context.Context, f ListFilter) ([]AuditLog, int64, error) {
	var conds []string
	var args []any
	argIdx := 1

	if f.TenantID != nil && *f.TenantID != "" {
		conds = append(conds, fmt.Sprintf("tenant_id = $%d", argIdx))
		args = append(args, *f.TenantID)
		argIdx++
	}
	if f.UserID != "" {
		conds = append(conds, fmt.Sprintf("user_id = $%d", argIdx))
		args = append(args, f.UserID)
		argIdx++
	}
	if f.Entity != "" {
		conds = append(conds, fmt.Sprintf("entity = $%d", argIdx))
		args = append(args, f.Entity)
		argIdx++
	}
	if f.EntityID != "" {
		conds = append(conds, fmt.Sprintf("entity_id = $%d", argIdx))
		args = append(args, f.EntityID)
		argIdx++
	}
	if f.Action != "" {
		conds = append(conds, fmt.Sprintf("action = $%d", argIdx))
		args = append(args, f.Action)
		argIdx++
	}

	whereClause := ""
	if len(conds) > 0 {
		whereClause = "WHERE " + strings.Join(conds, " AND ")
	}

	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM audit_logs %s", whereClause)
	var total int64
	if err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("audit count failed: %w", err)
	}

	limit := f.Limit
	if limit <= 0 {
		limit = 50
	}
	offset := (f.Page - 1) * limit
	if offset < 0 {
		offset = 0
	}

	query := fmt.Sprintf(`
		SELECT id, tenant_id, user_id, action, entity, entity_id,
		       old_values, new_values, ip_address, user_agent, created_at
		FROM audit_logs
		%s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argIdx, argIdx+1)

	args = append(args, limit, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("audit query failed: %w", err)
	}
	defer rows.Close()

	var list []AuditLog
	for rows.Next() {
		var l AuditLog
		if err := rows.Scan(
			&l.ID, &l.TenantID, &l.UserID, &l.Action, &l.Entity, &l.EntityID,
			&l.OldValues, &l.NewValues, &l.IPAddress, &l.UserAgent, &l.CreatedAt,
		); err != nil {
			return nil, 0, fmt.Errorf("audit scan failed: %w", err)
		}
		list = append(list, l)
	}

	return list, total, nil
}
