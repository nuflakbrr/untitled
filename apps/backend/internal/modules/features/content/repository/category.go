package repository

import (
	"context"
	"errors"
	"fmt"

	"venturo-skeleton-go/internal/modules/features/content/domain"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrCategoryNotFound = errors.New("article category not found")

type CategoryRepository struct {
	db *pgxpool.Pool
}

func NewCategoryRepository(db *pgxpool.Pool) *CategoryRepository {
	return &CategoryRepository{db: db}
}

func (r *CategoryRepository) FindAll(ctx context.Context) ([]*domain.ArticleCategory, error) {
	rows, err := r.db.Query(ctx, `SELECT id, name, created_at, updated_at FROM article_categories ORDER BY name ASC`)
	if err != nil {
		return nil, fmt.Errorf("query article categories: %w", err)
	}
	defer rows.Close()

	categories := make([]*domain.ArticleCategory, 0)
	for rows.Next() {
		category := new(domain.ArticleCategory)
		if err := rows.Scan(&category.ID, &category.Name, &category.CreatedAt, &category.UpdatedAt); err != nil {
			return nil, fmt.Errorf("scan article category: %w", err)
		}
		categories = append(categories, category)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate article categories: %w", err)
	}
	return categories, nil
}

func (r *CategoryRepository) Create(ctx context.Context, category *domain.ArticleCategory) error {
	err := r.db.QueryRow(ctx, `
		INSERT INTO article_categories (name) VALUES ($1)
		RETURNING id, created_at, updated_at
	`, category.Name).Scan(&category.ID, &category.CreatedAt, &category.UpdatedAt)
	if err != nil {
		return fmt.Errorf("create article category: %w", err)
	}
	return nil
}

func (r *CategoryRepository) Update(ctx context.Context, category *domain.ArticleCategory) error {
	err := r.db.QueryRow(ctx, `
		UPDATE article_categories SET name = $2, updated_at = NOW() WHERE id = $1
		RETURNING updated_at
	`, category.ID, category.Name).Scan(&category.UpdatedAt)
	if errors.Is(err, pgx.ErrNoRows) {
		return ErrCategoryNotFound
	}
	if err != nil {
		return fmt.Errorf("update article category: %w", err)
	}
	return nil
}

func (r *CategoryRepository) Delete(ctx context.Context, id string) error {
	tag, err := r.db.Exec(ctx, `DELETE FROM article_categories WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete article category: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrCategoryNotFound
	}
	return nil
}
