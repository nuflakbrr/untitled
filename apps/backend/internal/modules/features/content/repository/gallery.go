package repository

import (
	"context"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/content/domain"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrGalleryNotFound = errors.New("gallery not found")

const gallerySelect = `SELECT id, tenant_id, title, description, image_url, featured, event_id, created_at, updated_at FROM galleries`

type GalleryRepository struct {
	db *pgxpool.Pool
}

func NewGalleryRepository(db *pgxpool.Pool) *GalleryRepository {
	return &GalleryRepository{db: db}
}

type GalleryFilter struct {
	TenantID *string
	EventID  *string
	Featured *bool
}

func (r *GalleryRepository) FindAll(ctx context.Context, filter GalleryFilter, page, limit int) ([]*domain.Gallery, int64, error) {
	conditions := []string{"1 = 1"}
	args := []any{}
	if filter.TenantID != nil {
		args = append(args, *filter.TenantID)
		conditions = append(conditions, fmt.Sprintf("tenant_id = $%d", len(args)))
	}
	if filter.EventID != nil {
		args = append(args, *filter.EventID)
		conditions = append(conditions, fmt.Sprintf("event_id = $%d", len(args)))
	}
	if filter.Featured != nil {
		args = append(args, *filter.Featured)
		conditions = append(conditions, fmt.Sprintf("featured = $%d", len(args)))
	}
	where := " WHERE " + joinAnd(conditions)

	var total int64
	if err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM galleries"+where, args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("count galleries: %w", err)
	}

	args = append(args, limit, (page-1)*limit)
	rows, err := r.db.Query(ctx, gallerySelect+where+fmt.Sprintf(" ORDER BY created_at DESC LIMIT $%d OFFSET $%d", len(args)-1, len(args)), args...)
	if err != nil {
		return nil, 0, fmt.Errorf("query galleries: %w", err)
	}
	defer rows.Close()

	galleries, err := scanGalleries(rows)
	if err != nil {
		return nil, 0, err
	}
	return galleries, total, nil
}

func (r *GalleryRepository) FindByID(ctx context.Context, id string) (*domain.Gallery, error) {
	gallery := new(domain.Gallery)
	err := r.db.QueryRow(ctx, gallerySelect+" WHERE id = $1", id).Scan(
		&gallery.ID, &gallery.TenantID, &gallery.Title, &gallery.Description,
		&gallery.ImageURL, &gallery.Featured, &gallery.EventID, &gallery.CreatedAt, &gallery.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrGalleryNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("find gallery: %w", err)
	}
	return gallery, nil
}

func (r *GalleryRepository) Create(ctx context.Context, gallery *domain.Gallery) error {
	gallery.ID = uuid.NewString()
	err := r.db.QueryRow(ctx, `
		INSERT INTO galleries (id, tenant_id, title, description, image_url, featured, event_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING created_at, updated_at
	`, gallery.ID, gallery.TenantID, gallery.Title, gallery.Description, gallery.ImageURL, gallery.Featured, gallery.EventID,
	).Scan(&gallery.CreatedAt, &gallery.UpdatedAt)
	if err != nil {
		return fmt.Errorf("create gallery: %w", err)
	}
	return nil
}

func (r *GalleryRepository) Update(ctx context.Context, gallery *domain.Gallery, scopeTenantID *string) error {
	query := `
		UPDATE galleries SET title = $2, description = $3, image_url = $4, featured = $5, event_id = $6, updated_at = NOW()
		WHERE id = $1`
	args := []any{gallery.ID, gallery.Title, gallery.Description, gallery.ImageURL, gallery.Featured, gallery.EventID}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		query += fmt.Sprintf(" AND tenant_id = $%d", len(args))
	}
	query += " RETURNING updated_at"

	err := r.db.QueryRow(ctx, query, args...).Scan(&gallery.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrGalleryNotFound
	}
	if err != nil {
		return fmt.Errorf("update gallery: %w", err)
	}
	return nil
}

func (r *GalleryRepository) Delete(ctx context.Context, id string, scopeTenantID *string) error {
	query := "DELETE FROM galleries WHERE id = $1"
	args := []any{id}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		query += fmt.Sprintf(" AND tenant_id = $%d", len(args))
	}
	tag, err := r.db.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("delete gallery: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrGalleryNotFound
	}
	return nil
}

func scanGalleries(rows pgx.Rows) ([]*domain.Gallery, error) {
	galleries := make([]*domain.Gallery, 0)
	for rows.Next() {
		gallery := new(domain.Gallery)
		if err := rows.Scan(
			&gallery.ID, &gallery.TenantID, &gallery.Title, &gallery.Description,
			&gallery.ImageURL, &gallery.Featured, &gallery.EventID, &gallery.CreatedAt, &gallery.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan gallery: %w", err)
		}
		galleries = append(galleries, gallery)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate galleries: %w", err)
	}
	return galleries, nil
}

func joinAnd(conditions []string) string {
	result := conditions[0]
	for _, c := range conditions[1:] {
		result += " AND " + c
	}
	return result
}
