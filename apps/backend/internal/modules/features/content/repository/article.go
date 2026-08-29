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

var ErrArticleNotFound = errors.New("article not found")

const articleSelect = `
	SELECT a.id, a.tenant_id, a.title, a.content, a.cover, a.slug, a.created_by_id, a.created_at, a.updated_at
	FROM articles a`

type ArticleRepository struct {
	db *pgxpool.Pool
}

func NewArticleRepository(db *pgxpool.Pool) *ArticleRepository {
	return &ArticleRepository{db: db}
}

// FindAll returns global (tenant_id NULL), ROOT-tenant, and the caller's own
// tenant articles — same visibility rule as event_categories.
func (r *ArticleRepository) FindAll(ctx context.Context, scopeTenantID *string, page, limit int) ([]*domain.Article, int64, error) {
	conditions := "a.tenant_id IS NULL OR t.type = 'ROOT'"
	args := []any{}
	if scopeTenantID != nil && *scopeTenantID != "" {
		args = append(args, *scopeTenantID)
		conditions += fmt.Sprintf(" OR a.tenant_id = $%d", len(args))
	}
	base := articleSelect + " LEFT JOIN core.tenants t ON t.id = a.tenant_id WHERE (" + conditions + ")"

	var total int64
	if err := r.db.QueryRow(ctx, "SELECT COUNT(*) FROM articles a LEFT JOIN core.tenants t ON t.id = a.tenant_id WHERE ("+conditions+")", args...).Scan(&total); err != nil {
		return nil, 0, fmt.Errorf("count articles: %w", err)
	}

	args = append(args, limit, (page-1)*limit)
	rows, err := r.db.Query(ctx, base+fmt.Sprintf(" ORDER BY a.created_at DESC LIMIT $%d OFFSET $%d", len(args)-1, len(args)), args...)
	if err != nil {
		return nil, 0, fmt.Errorf("query articles: %w", err)
	}
	defer rows.Close()

	articles, err := scanArticles(rows)
	if err != nil {
		return nil, 0, err
	}
	if err := r.attachCategories(ctx, articles); err != nil {
		return nil, 0, err
	}
	return articles, total, nil
}

func (r *ArticleRepository) FindByID(ctx context.Context, id string) (*domain.Article, error) {
	article, err := r.scanOne(ctx, articleSelect+" WHERE a.id = $1", id)
	if err != nil {
		return nil, err
	}
	if err := r.attachCategories(ctx, []*domain.Article{article}); err != nil {
		return nil, err
	}
	return article, nil
}

func (r *ArticleRepository) FindBySlug(ctx context.Context, slug string) (*domain.Article, error) {
	article, err := r.scanOne(ctx, articleSelect+" WHERE a.slug = $1", slug)
	if err != nil {
		return nil, err
	}
	if err := r.attachCategories(ctx, []*domain.Article{article}); err != nil {
		return nil, err
	}
	return article, nil
}

func (r *ArticleRepository) SlugExists(ctx context.Context, slug string) (bool, error) {
	var exists bool
	if err := r.db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM articles WHERE slug = $1)", slug).Scan(&exists); err != nil {
		return false, fmt.Errorf("check article slug: %w", err)
	}
	return exists, nil
}

func (r *ArticleRepository) Create(ctx context.Context, article *domain.Article) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin create article: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	article.ID = uuid.NewString()
	if err := tx.QueryRow(ctx, `
		INSERT INTO articles (id, tenant_id, title, content, cover, slug, created_by_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING created_at, updated_at
	`, article.ID, article.TenantID, article.Title, article.Content, article.Cover, article.Slug, article.CreatedByID,
	).Scan(&article.CreatedAt, &article.UpdatedAt); err != nil {
		return fmt.Errorf("create article: %w", err)
	}
	if err := linkCategories(ctx, tx, article.ID, article.CategoryIDs); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (r *ArticleRepository) Update(ctx context.Context, article *domain.Article, scopeTenantID *string) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin update article: %w", err)
	}
	defer func() { _ = tx.Rollback(ctx) }()

	query := `UPDATE articles SET title = $2, content = $3, cover = $4, updated_at = NOW() WHERE id = $1`
	args := []any{article.ID, article.Title, article.Content, article.Cover}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		query += fmt.Sprintf(" AND tenant_id = $%d", len(args))
	}
	query += " RETURNING updated_at"

	if err := tx.QueryRow(ctx, query, args...).Scan(&article.UpdatedAt); errors.Is(err, pgx.ErrNoRows) {
		return ErrArticleNotFound
	} else if err != nil {
		return fmt.Errorf("update article: %w", err)
	}

	if _, err := tx.Exec(ctx, `DELETE FROM _article_to_article_category WHERE "A" = $1`, article.ID); err != nil {
		return fmt.Errorf("clear article categories: %w", err)
	}
	if err := linkCategories(ctx, tx, article.ID, article.CategoryIDs); err != nil {
		return err
	}
	return tx.Commit(ctx)
}

func (r *ArticleRepository) Delete(ctx context.Context, id string, scopeTenantID *string) error {
	query := "DELETE FROM articles WHERE id = $1"
	args := []any{id}
	if scopeTenantID != nil {
		args = append(args, *scopeTenantID)
		query += fmt.Sprintf(" AND tenant_id = $%d", len(args))
	}
	tag, err := r.db.Exec(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("delete article: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrArticleNotFound
	}
	return nil
}

func linkCategories(ctx context.Context, tx pgx.Tx, articleID string, categoryIDs []string) error {
	for _, categoryID := range categoryIDs {
		if _, err := tx.Exec(ctx, `INSERT INTO _article_to_article_category ("A", "B") VALUES ($1, $2) ON CONFLICT DO NOTHING`, articleID, categoryID); err != nil {
			return fmt.Errorf("link article category: %w", err)
		}
	}
	return nil
}

func (r *ArticleRepository) attachCategories(ctx context.Context, articles []*domain.Article) error {
	for _, article := range articles {
		rows, err := r.db.Query(ctx, `SELECT "B" FROM _article_to_article_category WHERE "A" = $1`, article.ID)
		if err != nil {
			return fmt.Errorf("query article categories: %w", err)
		}
		categoryIDs := make([]string, 0)
		for rows.Next() {
			var categoryID string
			if err := rows.Scan(&categoryID); err != nil {
				rows.Close()
				return fmt.Errorf("scan article category: %w", err)
			}
			categoryIDs = append(categoryIDs, categoryID)
		}
		rows.Close()
		article.CategoryIDs = categoryIDs
	}
	return nil
}

func (r *ArticleRepository) scanOne(ctx context.Context, query string, args ...any) (*domain.Article, error) {
	article := new(domain.Article)
	err := r.db.QueryRow(ctx, query, args...).Scan(
		&article.ID, &article.TenantID, &article.Title, &article.Content,
		&article.Cover, &article.Slug, &article.CreatedByID, &article.CreatedAt, &article.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrArticleNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("find article: %w", err)
	}
	return article, nil
}

func scanArticles(rows pgx.Rows) ([]*domain.Article, error) {
	articles := make([]*domain.Article, 0)
	for rows.Next() {
		article := new(domain.Article)
		if err := rows.Scan(
			&article.ID, &article.TenantID, &article.Title, &article.Content,
			&article.Cover, &article.Slug, &article.CreatedByID, &article.CreatedAt, &article.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan article: %w", err)
		}
		articles = append(articles, article)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate articles: %w", err)
	}
	return articles, nil
}
