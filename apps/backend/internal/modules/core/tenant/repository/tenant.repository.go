package repository

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"venturo-skeleton-go/internal/modules/core/tenant/domain"
	"venturo-skeleton-go/internal/modules/core/tenant/dto"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var (
	ErrTenantNotFound = errors.New("tenant not found")
)

type TenantRepository struct {
	db *pgxpool.Pool
}

func NewTenantRepository(db *pgxpool.Pool) *TenantRepository {
	return &TenantRepository{db: db}
}

// FindAll retrieves tenants based on filter with pagination
func (r *TenantRepository) FindAll(ctx context.Context, filter dto.TenantQueryFilter) ([]*domain.Tenant, int64, error) {
	var conditions []string
	var args []interface{}
	argIdx := 1

	conditions = append(conditions, "deleted_at IS NULL")

	if filter.Search != "" {
		conditions = append(conditions, fmt.Sprintf("(name ILIKE $%d OR slug ILIKE $%d OR code ILIKE $%d)", argIdx, argIdx, argIdx))
		args = append(args, "%"+filter.Search+"%")
		argIdx++
	}

	if filter.Type != "" {
		conditions = append(conditions, fmt.Sprintf("type = $%d", argIdx))
		args = append(args, filter.Type)
		argIdx++
	}

	if filter.ParentID != "" {
		conditions = append(conditions, fmt.Sprintf("parent_id = $%d", argIdx))
		args = append(args, filter.ParentID)
		argIdx++
	}

	whereClause := strings.Join(conditions, " AND ")

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM tenants WHERE %s", whereClause)
	var total int64
	if err := r.db.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("failed to count tenants: %w", err)
	}

	// Fetch data
	limit := filter.Limit
	if limit <= 0 {
		limit = 20
	}
	offset := (filter.Page - 1) * limit
	if offset < 0 {
		offset = 0
	}

	query := fmt.Sprintf(`
		SELECT id, name, slug, code, type, parent_id, logo_url, website, description, settings, created_at, updated_at, deleted_at
		FROM tenants
		WHERE %s
		ORDER BY created_at ASC
		LIMIT $%d OFFSET $%d
	`, whereClause, argIdx, argIdx+1)

	args = append(args, limit, offset)

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to query tenants: %w", err)
	}
	defer rows.Close()

	var tenants []*domain.Tenant
	for rows.Next() {
		t := &domain.Tenant{}
		if err := rows.Scan(
			&t.ID, &t.Name, &t.Slug, &t.Code, &t.Type, &t.ParentID,
			&t.LogoURL, &t.Website, &t.Description, &t.Settings,
			&t.CreatedAt, &t.UpdatedAt, &t.DeletedAt,
		); err != nil {
			return nil, 0, fmt.Errorf("failed to scan tenant: %w", err)
		}
		tenants = append(tenants, t)
	}

	return tenants, total, nil
}

// FindByID retrieves a single tenant by ID
func (r *TenantRepository) FindByID(ctx context.Context, id string) (*domain.Tenant, error) {
	query := `
		SELECT id, name, slug, code, type, parent_id, logo_url, website, description, settings, created_at, updated_at, deleted_at
		FROM tenants
		WHERE id = $1 AND deleted_at IS NULL
	`
	t := &domain.Tenant{}
	err := r.db.QueryRow(ctx, query, id).Scan(
		&t.ID, &t.Name, &t.Slug, &t.Code, &t.Type, &t.ParentID,
		&t.LogoURL, &t.Website, &t.Description, &t.Settings,
		&t.CreatedAt, &t.UpdatedAt, &t.DeletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrTenantNotFound
		}
		return nil, fmt.Errorf("failed to find tenant by id: %w", err)
	}

	return t, nil
}

// FindBySlug retrieves a single tenant by slug
func (r *TenantRepository) FindBySlug(ctx context.Context, slug string) (*domain.Tenant, error) {
	query := `
		SELECT id, name, slug, code, type, parent_id, logo_url, website, description, settings, created_at, updated_at, deleted_at
		FROM tenants
		WHERE slug = $1 AND deleted_at IS NULL
	`
	t := &domain.Tenant{}
	err := r.db.QueryRow(ctx, query, slug).Scan(
		&t.ID, &t.Name, &t.Slug, &t.Code, &t.Type, &t.ParentID,
		&t.LogoURL, &t.Website, &t.Description, &t.Settings,
		&t.CreatedAt, &t.UpdatedAt, &t.DeletedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrTenantNotFound
		}
		return nil, fmt.Errorf("failed to find tenant by slug: %w", err)
	}

	return t, nil
}

// Create inserts a new tenant into the database
func (r *TenantRepository) Create(ctx context.Context, t *domain.Tenant) error {
	query := `
		INSERT INTO tenants (name, slug, code, type, parent_id, logo_url, website, description, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(
		ctx, query,
		t.Name, t.Slug, t.Code, t.Type, t.ParentID, t.LogoURL, t.Website, t.Description,
	).Scan(&t.ID, &t.CreatedAt, &t.UpdatedAt)
}

// Update updates an existing tenant in the database
func (r *TenantRepository) Update(ctx context.Context, t *domain.Tenant) error {
	query := `
		UPDATE tenants
		SET name = $1, slug = $2, code = $3, type = $4, parent_id = $5,
		    logo_url = $6, website = $7, description = $8, updated_at = NOW()
		WHERE id = $9 AND deleted_at IS NULL
		RETURNING updated_at
	`
	return r.db.QueryRow(
		ctx, query,
		t.Name, t.Slug, t.Code, t.Type, t.ParentID, t.LogoURL, t.Website, t.Description, t.ID,
	).Scan(&t.UpdatedAt)
}

// Delete soft-deletes a tenant
func (r *TenantRepository) Delete(ctx context.Context, id string) error {
	query := `UPDATE tenants SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`
	cmdTag, err := r.db.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete tenant: %w", err)
	}
	if cmdTag.RowsAffected() == 0 {
		return ErrTenantNotFound
	}
	return nil
}

// GetPaymentGateway retrieves the payment gateway configuration for a tenant
func (r *TenantRepository) GetPaymentGateway(ctx context.Context, tenantID string) (*domain.TenantPaymentGateway, error) {
	query := `
		SELECT id, tenant_id, provider, is_active, api_key, virtual_account, env,
		       bank_name, bank_account_number, bank_account_holder, created_at, updated_at
		FROM tenant_payment_gateways
		WHERE tenant_id = $1
	`
	pg := &domain.TenantPaymentGateway{}
	err := r.db.QueryRow(ctx, query, tenantID).Scan(
		&pg.ID, &pg.TenantID, &pg.Provider, &pg.IsActive, &pg.APIKey, &pg.VirtualAccount,
		&pg.Env, &pg.BankName, &pg.BankAccountNumber, &pg.BankAccountHolder,
		&pg.CreatedAt, &pg.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, nil // No gateway config yet
		}
		return nil, fmt.Errorf("failed to get payment gateway: %w", err)
	}
	return pg, nil
}

// UpsertPaymentGateway creates or updates the payment gateway configuration for a tenant
func (r *TenantRepository) UpsertPaymentGateway(ctx context.Context, pg *domain.TenantPaymentGateway) error {
	query := `
		INSERT INTO tenant_payment_gateways (
			tenant_id, provider, is_active, api_key, virtual_account, env,
			bank_name, bank_account_number, bank_account_holder, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()
		)
		ON CONFLICT (tenant_id) DO UPDATE SET
			provider = EXCLUDED.provider,
			is_active = EXCLUDED.is_active,
			api_key = COALESCE(EXCLUDED.api_key, tenant_payment_gateways.api_key),
			virtual_account = EXCLUDED.virtual_account,
			env = EXCLUDED.env,
			bank_name = EXCLUDED.bank_name,
			bank_account_number = EXCLUDED.bank_account_number,
			bank_account_holder = EXCLUDED.bank_account_holder,
			updated_at = NOW()
		RETURNING id, created_at, updated_at
	`
	return r.db.QueryRow(
		ctx, query,
		pg.TenantID, pg.Provider, pg.IsActive, pg.APIKey, pg.VirtualAccount, pg.Env,
		pg.BankName, pg.BankAccountNumber, pg.BankAccountHolder,
	).Scan(&pg.ID, &pg.CreatedAt, &pg.UpdatedAt)
}

