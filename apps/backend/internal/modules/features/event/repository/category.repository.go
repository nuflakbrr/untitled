package repository

import (
	"context"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/event/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrCategoryNotFound = errors.New("event category not found")

type CategoryRepository struct {
	db *pgxpool.Pool
}

func NewCategoryRepository(db *pgxpool.Pool) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) FindAll(ctx context.Context, tenantID *string) ([]*domain.Category, error) {
	query := `
		SELECT ec.id, ec.tenant_id, ec.name, ec.slug, ec.description, ec.created_at, ec.updated_at
		FROM event_categories ec`
	args := []any{}
	if tenantID != nil && *tenantID != "" {
		query += `
			LEFT JOIN core.tenants t ON t.id = ec.tenant_id
			WHERE (ec.tenant_id IS NULL OR t.type = 'ROOT' OR ec.tenant_id = $1)`
		args = append(args, *tenantID)
	} else {
		// Public listing without a tenant must expose every active category.
		// Tenant-scoped callers still use the restricted branch above.
	}
	query += " ORDER BY ec.tenant_id NULLS FIRST, ec.name ASC"

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query event categories: %w", err)
	}
	defer rows.Close()

	categories := make([]*domain.Category, 0)
	for rows.Next() {
		category := new(domain.Category)
		if err := rows.Scan(&category.ID, &category.TenantID, &category.Name, &category.Slug, &category.Description, &category.CreatedAt, &category.UpdatedAt); err != nil {
			return nil, fmt.Errorf("scan event category: %w", err)
		}
		categories = append(categories, category)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate event categories: %w", err)
	}
	return categories, nil
}

func (r *CategoryRepository) FindByID(ctx context.Context, id string, scopeTenantID *string) (*domain.Category, error) {
	query := `
		SELECT id, tenant_id, name, slug, description, created_at, updated_at
		FROM event_categories WHERE id = $1`
	args := []any{id}
	if scopeTenantID != nil {
		query += " AND tenant_id = $2"
		args = append(args, *scopeTenantID)
	}

	category := new(domain.Category)
	err := r.db.QueryRow(ctx, query, args...).Scan(
		&category.ID, &category.TenantID, &category.Name, &category.Slug,
		&category.Description, &category.CreatedAt, &category.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrCategoryNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("find event category: %w", err)
	}
	return category, nil
}

func (r *CategoryRepository) FindAccessible(ctx context.Context, id, tenantID string) (*domain.Category, error) {
	category := new(domain.Category)
	err := r.db.QueryRow(ctx, `
		SELECT ec.id, ec.tenant_id, ec.name, ec.slug, ec.description, ec.created_at, ec.updated_at
		FROM event_categories ec
		LEFT JOIN core.tenants t ON t.id = ec.tenant_id
		WHERE ec.id = $1 AND (ec.tenant_id IS NULL OR t.type = 'ROOT' OR ec.tenant_id = $2)
	`, id, tenantID).Scan(
		&category.ID, &category.TenantID, &category.Name, &category.Slug,
		&category.Description, &category.CreatedAt, &category.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrCategoryNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("find accessible event category: %w", err)
	}
	return category, nil
}

func (r *CategoryRepository) FindBySlug(ctx context.Context, tenantID, slug string) (*domain.Category, error) {
	category := new(domain.Category)
	err := r.db.QueryRow(ctx, `
		SELECT id, tenant_id, name, slug, description, created_at, updated_at
		FROM event_categories WHERE tenant_id = $1 AND slug = $2
	`, tenantID, slug).Scan(
		&category.ID, &category.TenantID, &category.Name, &category.Slug,
		&category.Description, &category.CreatedAt, &category.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrCategoryNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("find event category by slug: %w", err)
	}
	return category, nil
}

func (r *CategoryRepository) Create(ctx context.Context, category *domain.Category) error {
	err := r.db.QueryRow(ctx, `
		INSERT INTO event_categories (tenant_id, name, slug, description)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`, category.TenantID, category.Name, category.Slug, category.Description).Scan(
		&category.ID, &category.CreatedAt, &category.UpdatedAt,
	)
	if err != nil {
		return fmt.Errorf("create event category: %w", err)
	}
	return nil
}

func (r *CategoryRepository) Update(ctx context.Context, category *domain.Category, scopeTenantID *string) error {
	query := `
		UPDATE event_categories
		SET name = $2, slug = $3, description = $4, updated_at = NOW()
		WHERE id = $1`
	args := []any{category.ID, category.Name, category.Slug, category.Description}
	if scopeTenantID != nil {
		query += " AND tenant_id = $5"
		args = append(args, *scopeTenantID)
	}
	query += " RETURNING updated_at"

	err := r.db.QueryRow(ctx, query, args...).Scan(&category.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrCategoryNotFound
	}
	if err != nil {
		return fmt.Errorf("update event category: %w", err)
	}
	return nil
}

func (r *CategoryRepository) Delete(ctx context.Context, id string, scopeTenantID *string) error {
	query := "DELETE FROM event_categories WHERE id = $1"
	args := []any{id}
	if scopeTenantID != nil {
		query += " AND tenant_id = $2"
		args = append(args, *scopeTenantID)
	}

	tag, err := r.db.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("delete event category: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrCategoryNotFound
	}
	return nil
}
