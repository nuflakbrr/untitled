package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"venturo-skeleton-go/internal/modules/core/user/domain"
	"venturo-skeleton-go/internal/modules/core/user/dto"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrUserNotFound      = errors.New("user not found")
	ErrEmailAlreadyTaken = errors.New("email already taken")
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

// FindAll retrieves users with pagination and multi-tenant scoping
func (r *UserRepository) FindAll(ctx context.Context, params dto.UserQueryParams) ([]*domain.User, int64, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	if params.Search != "" {
		conditions = append(conditions, fmt.Sprintf("(u.email ILIKE $%d OR u.name ILIKE $%d)", argIdx, argIdx))
		args = append(args, "%"+params.Search+"%")
		argIdx++
	}

	if params.Role != "" {
		conditions = append(conditions, fmt.Sprintf("u.role = $%d", argIdx))
		args = append(args, params.Role)
		argIdx++
	}

	// Scoping: If caller has ScopeTenantID (non-root), enforce it
	if params.ScopeTenantID != nil && *params.ScopeTenantID != "" {
		conditions = append(conditions, fmt.Sprintf("u.tenant_id = $%d", argIdx))
		args = append(args, *params.ScopeTenantID)
		argIdx++
	} else if params.TenantID != nil && *params.TenantID != "" {
		// Root admin querying specific tenant
		conditions = append(conditions, fmt.Sprintf("u.tenant_id = $%d", argIdx))
		args = append(args, *params.TenantID)
		argIdx++
	}

	if params.Banned != nil {
		conditions = append(conditions, fmt.Sprintf("u.banned = $%d", argIdx))
		args = append(args, *params.Banned)
		argIdx++
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM users u %s", whereClause)
	var total int64
	if err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %w", err)
	}

	limit := params.Limit
	if limit <= 0 {
		limit = 10
	}
	offset := (params.Page - 1) * limit
	if offset < 0 {
		offset = 0
	}

	query := fmt.Sprintf(`
		SELECT u.id, u.tenant_id, u.email, u.name, u.email_verified, u.image,
		       u.role, u.banned, u.ban_reason, u.ban_expires, u.role_id,
		       u.created_at, u.updated_at,
		       t.name as tenant_name, t.slug as tenant_slug, t.code as tenant_code, t.type::text as tenant_type
		FROM users u
		LEFT JOIN tenants t ON u.tenant_id = t.id
		%s
		ORDER BY u.created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereClause, argIdx, argIdx+1)

	args = append(args, limit, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query users: %w", err)
	}
	defer rows.Close()

	var users []*domain.User
	for rows.Next() {
		u := &domain.User{}
		if err := rows.Scan(
			&u.ID, &u.TenantID, &u.Email, &u.Name, &u.EmailVerified, &u.Image,
			&u.Role, &u.Banned, &u.BanReason, &u.BanExpires, &u.RoleID,
			&u.CreatedAt, &u.UpdatedAt,
			&u.TenantName, &u.TenantSlug, &u.TenantCode, &u.TenantType,
		); err != nil {
			return nil, 0, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, u)
	}

	return users, total, nil
}

// FindByID retrieves a user by ID
func (r *UserRepository) FindByID(ctx context.Context, id string) (*domain.User, error) {
	query := `
		SELECT u.id, u.tenant_id, u.email, u.name, u.email_verified, u.image,
		       u.role, u.banned, u.ban_reason, u.ban_expires, u.role_id,
		       u.created_at, u.updated_at,
		       t.name as tenant_name, t.slug as tenant_slug, t.code as tenant_code, t.type::text as tenant_type,
		       COALESCE(a.password, '') as password
		FROM users u
		LEFT JOIN tenants t ON u.tenant_id = t.id
		LEFT JOIN accounts a ON u.id = a.user_id AND a.provider_id = 'credential'
		WHERE u.id = $1
	`
	u := &domain.User{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&u.ID, &u.TenantID, &u.Email, &u.Name, &u.EmailVerified, &u.Image,
		&u.Role, &u.Banned, &u.BanReason, &u.BanExpires, &u.RoleID,
		&u.CreatedAt, &u.UpdatedAt,
		&u.TenantName, &u.TenantSlug, &u.TenantCode, &u.TenantType,
		&u.PasswordHash,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to find user by id: %w", err)
	}

	return u, nil
}

// FindByEmail retrieves a user with password by email
func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `
		SELECT u.id, u.tenant_id, u.email, u.name, u.email_verified, u.image,
		       u.role, u.banned, u.ban_reason, u.ban_expires, u.role_id,
		       u.created_at, u.updated_at,
		       t.name as tenant_name, t.slug as tenant_slug, t.code as tenant_code, t.type::text as tenant_type,
		       COALESCE(a.password, '') as password
		FROM users u
		LEFT JOIN tenants t ON u.tenant_id = t.id
		LEFT JOIN accounts a ON u.id = a.user_id AND a.provider_id = 'credential'
		WHERE LOWER(u.email) = LOWER($1)
	`
	u := &domain.User{}
	err := r.db.QueryRow(ctx, query, email).Scan(
		&u.ID, &u.TenantID, &u.Email, &u.Name, &u.EmailVerified, &u.Image,
		&u.Role, &u.Banned, &u.BanReason, &u.BanExpires, &u.RoleID,
		&u.CreatedAt, &u.UpdatedAt,
		&u.TenantName, &u.TenantSlug, &u.TenantCode, &u.TenantType,
		&u.PasswordHash,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, fmt.Errorf("failed to find user by email: %w", err)
	}

	return u, nil
}

// Create creates a user, account credentials, and role join table row in a transaction
func (r *UserRepository) Create(ctx context.Context, user *domain.User, passwordHash string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// 1. Insert User
	userQuery := `
		INSERT INTO users (tenant_id, email, name, email_verified, role, role_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	if err := tx.QueryRow(
		ctx, userQuery,
		user.TenantID, user.Email, user.Name, user.EmailVerified, user.Role, user.RoleID,
	).Scan(&user.ID, &user.CreatedAt, &user.UpdatedAt); err != nil {
		if strings.Contains(err.Error(), "unique") || strings.Contains(err.Error(), "duplicate") {
			return ErrEmailAlreadyTaken
		}
		return fmt.Errorf("failed to insert user: %w", err)
	}

	// 2. Insert Account Credential
	accountQuery := `
		INSERT INTO accounts (account_id, provider_id, user_id, password, created_at, updated_at)
		VALUES ($1, 'credential', $2, $3, NOW(), NOW())
	`
	if _, err := tx.Exec(ctx, accountQuery, user.Email, user.ID, passwordHash); err != nil {
		return fmt.Errorf("failed to insert account: %w", err)
	}

	// 3. Connect to _role_to_user
	if user.RoleID != "" {
		roleUserQuery := `
			INSERT INTO _role_to_user ("A", "B")
			VALUES ($1, $2)
			ON CONFLICT DO NOTHING
		`
		if _, err := tx.Exec(ctx, roleUserQuery, user.RoleID, user.ID); err != nil {
			return fmt.Errorf("failed to link role: %w", err)
		}
	}

	return tx.Commit(ctx)
}

// Update updates user profile details
func (r *UserRepository) Update(ctx context.Context, user *domain.User) error {
	query := `
		UPDATE users
		SET name = $1, image = $2, tenant_id = $3, role = $4, role_id = $5, updated_at = NOW()
		WHERE id = $6
		RETURNING updated_at
	`
	return r.db.QueryRow(
		ctx, query,
		user.Name, user.Image, user.TenantID, user.Role, user.RoleID, user.ID,
	).Scan(&user.UpdatedAt)
}

// UpdatePassword updates the password in accounts table
func (r *UserRepository) UpdatePassword(ctx context.Context, userID, newPasswordHash string) error {
	query := `
		UPDATE accounts
		SET password = $1, updated_at = NOW()
		WHERE user_id = $2 AND provider_id = 'credential'
	`
	cmdTag, err := r.db.Exec(ctx, query, newPasswordHash, userID)
	if err != nil {
		return fmt.Errorf("failed to update password: %w", err)
	}
	if cmdTag.RowsAffected() == 0 {
		return ErrUserNotFound
	}
	return nil
}

// BanUser updates banned status on user
func (r *UserRepository) BanUser(ctx context.Context, userID, reason string, expiresAt *time.Time) error {
	query := `
		UPDATE users
		SET banned = TRUE, ban_reason = $1, ban_expires = $2, updated_at = NOW()
		WHERE id = $3
	`
	cmdTag, err := r.db.Exec(ctx, query, reason, expiresAt, userID)
	if err != nil {
		return fmt.Errorf("failed to ban user: %w", err)
	}
	if cmdTag.RowsAffected() == 0 {
		return ErrUserNotFound
	}
	return nil
}

// UnbanUser removes banned status from user
func (r *UserRepository) UnbanUser(ctx context.Context, userID string) error {
	query := `
		UPDATE users
		SET banned = FALSE, ban_reason = NULL, ban_expires = NULL, updated_at = NOW()
		WHERE id = $1
	`
	cmdTag, err := r.db.Exec(ctx, query, userID)
	if err != nil {
		return fmt.Errorf("failed to unban user: %w", err)
	}
	if cmdTag.RowsAffected() == 0 {
		return ErrUserNotFound
	}
	return nil
}
