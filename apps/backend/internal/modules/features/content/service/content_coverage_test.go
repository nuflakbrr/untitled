package service

import (
	"context"
	"errors"
	"testing"

	"venturo-skeleton-go/internal/modules/features/content/domain"
	"venturo-skeleton-go/internal/modules/features/content/dto"
	"venturo-skeleton-go/internal/modules/features/content/repository"
)

var errCoverage = errors.New("coverage error")

type coverageArticleRepo struct {
	findAllFn    func(context.Context, *string, int, int, string, string) ([]*domain.Article, int64, error)
	findByIDFn   func(context.Context, string) (*domain.Article, error)
	findBySlugFn func(context.Context, string) (*domain.Article, error)
	slugExistsFn func(context.Context, string) (bool, error)
	createFn     func(context.Context, *domain.Article) error
	updateFn     func(context.Context, *domain.Article, *string) error
	deleteFn     func(context.Context, string, *string) error
}

func (r *coverageArticleRepo) FindAll(ctx context.Context, scope *string, page, limit int, search, categoryID string) ([]*domain.Article, int64, error) {
	return r.findAllFn(ctx, scope, page, limit, search, categoryID)
}
func (r *coverageArticleRepo) FindByID(ctx context.Context, id string) (*domain.Article, error) {
	return r.findByIDFn(ctx, id)
}
func (r *coverageArticleRepo) FindBySlug(ctx context.Context, slug string) (*domain.Article, error) {
	return r.findBySlugFn(ctx, slug)
}
func (r *coverageArticleRepo) SlugExists(ctx context.Context, slug string) (bool, error) {
	return r.slugExistsFn(ctx, slug)
}
func (r *coverageArticleRepo) Create(ctx context.Context, article *domain.Article) error {
	return r.createFn(ctx, article)
}
func (r *coverageArticleRepo) Update(ctx context.Context, article *domain.Article, scope *string) error {
	return r.updateFn(ctx, article, scope)
}
func (r *coverageArticleRepo) Delete(ctx context.Context, id string, scope *string) error {
	return r.deleteFn(ctx, id, scope)
}

type coverageCategoryRepo struct {
	findAllFn func(context.Context) ([]*domain.ArticleCategory, error)
	createFn  func(context.Context, *domain.ArticleCategory) error
	updateFn  func(context.Context, *domain.ArticleCategory) error
	deleteFn  func(context.Context, string) error
}

func (r *coverageCategoryRepo) FindAll(ctx context.Context) ([]*domain.ArticleCategory, error) {
	return r.findAllFn(ctx)
}
func (r *coverageCategoryRepo) Create(ctx context.Context, category *domain.ArticleCategory) error {
	return r.createFn(ctx, category)
}
func (r *coverageCategoryRepo) Update(ctx context.Context, category *domain.ArticleCategory) error {
	return r.updateFn(ctx, category)
}
func (r *coverageCategoryRepo) Delete(ctx context.Context, id string) error {
	return r.deleteFn(ctx, id)
}

type coverageGalleryRepo struct {
	findAllFn         func(context.Context, repository.GalleryFilter, int, int) ([]*domain.Gallery, int64, error)
	findByIDFn        func(context.Context, string) (*domain.Gallery, error)
	eventAccessibleFn func(context.Context, string, *string) (bool, error)
	createFn          func(context.Context, *domain.Gallery) error
	updateFn          func(context.Context, *domain.Gallery, *string) error
	deleteFn          func(context.Context, string, *string) error
}

func (r *coverageGalleryRepo) FindAll(ctx context.Context, filter repository.GalleryFilter, page, limit int) ([]*domain.Gallery, int64, error) {
	return r.findAllFn(ctx, filter, page, limit)
}
func (r *coverageGalleryRepo) FindByID(ctx context.Context, id string) (*domain.Gallery, error) {
	return r.findByIDFn(ctx, id)
}
func (r *coverageGalleryRepo) EventAccessible(ctx context.Context, id string, scope *string) (bool, error) {
	return r.eventAccessibleFn(ctx, id, scope)
}
func (r *coverageGalleryRepo) Create(ctx context.Context, gallery *domain.Gallery) error {
	return r.createFn(ctx, gallery)
}
func (r *coverageGalleryRepo) Update(ctx context.Context, gallery *domain.Gallery, scope *string) error {
	return r.updateFn(ctx, gallery, scope)
}
func (r *coverageGalleryRepo) Delete(ctx context.Context, id string, scope *string) error {
	return r.deleteFn(ctx, id, scope)
}

func TestContentServiceArticleCoverage(t *testing.T) {
	ctx := context.Background()
	tenant := "tenant-1"
	article := &domain.Article{ID: "article-1", Title: "Title", Slug: "title"}

	NewContentService(nil, nil, nil)

	repo := &coverageArticleRepo{
		findAllFn: func(_ context.Context, scope *string, page, limit int, _, _ string) ([]*domain.Article, int64, error) {
			if scope == nil || *scope != tenant || page != 2 || limit != 5 {
				t.Fatalf("unexpected list arguments: scope=%v page=%d limit=%d", scope, page, limit)
			}
			return []*domain.Article{article}, 1, nil
		},
		findBySlugFn: func(context.Context, string) (*domain.Article, error) { return article, nil },
		findByIDFn:   func(context.Context, string) (*domain.Article, error) { return article, nil },
		slugExistsFn: func(_ context.Context, slug string) (bool, error) { return false, nil },
		createFn:     func(context.Context, *domain.Article) error { return nil },
		updateFn:     func(context.Context, *domain.Article, *string) error { return nil },
		deleteFn:     func(context.Context, string, *string) error { return errCoverage },
	}
	svc := NewContentServiceWithInterfaces(repo, nil, nil)
	if got, total, err := svc.ListArticles(ctx, nil, dto.ArticleQuery{TenantID: tenant, Page: 2, Limit: 5}); err != nil || total != 1 || len(got) != 1 {
		t.Fatalf("ListArticles() = %v, %d, %v", got, total, err)
	}
	if got, err := svc.GetArticleBySlug(ctx, "title"); err != nil || got.ID != article.ID {
		t.Fatalf("GetArticleBySlug() = %v, %v", got, err)
	}
	if got, err := svc.UpdateArticle(ctx, article.ID, &tenant, dto.UpdateArticleRequest{Title: "Updated", Content: "Body"}); err != nil || got.ID != article.ID {
		t.Fatalf("UpdateArticle() = %v, %v", got, err)
	}
	if err := svc.DeleteArticle(ctx, article.ID, &tenant); !errors.Is(err, errCoverage) {
		t.Fatalf("DeleteArticle() error = %v", err)
	}

	repo.findAllFn = func(context.Context, *string, int, int, string, string) ([]*domain.Article, int64, error) { return nil, 0, errCoverage }
	if _, _, err := svc.ListArticles(ctx, nil, dto.ArticleQuery{}); !errors.Is(err, errCoverage) {
		t.Fatalf("ListArticles() error = %v", err)
	}
	repo.findBySlugFn = func(context.Context, string) (*domain.Article, error) { return nil, errCoverage }
	if _, err := svc.GetArticleBySlug(ctx, "missing"); !errors.Is(err, errCoverage) {
		t.Fatalf("GetArticleBySlug() error = %v", err)
	}
	repo.updateFn = func(context.Context, *domain.Article, *string) error { return errCoverage }
	if _, err := svc.UpdateArticle(ctx, article.ID, &tenant, dto.UpdateArticleRequest{}); !errors.Is(err, errCoverage) {
		t.Fatalf("UpdateArticle() update error = %v", err)
	}
	repo.updateFn = func(context.Context, *domain.Article, *string) error { return nil }
	repo.findByIDFn = func(context.Context, string) (*domain.Article, error) { return nil, errCoverage }
	if _, err := svc.UpdateArticle(ctx, article.ID, &tenant, dto.UpdateArticleRequest{}); !errors.Is(err, errCoverage) {
		t.Fatalf("UpdateArticle() read error = %v", err)
	}
	repo.slugExistsFn = func(context.Context, string) (bool, error) { return false, errCoverage }
	if _, err := svc.CreateArticle(ctx, tenant, "user-1", dto.CreateArticleRequest{Title: "Title"}); !errors.Is(err, errCoverage) {
		t.Fatalf("CreateArticle() slug error = %v", err)
	}
	repo.slugExistsFn = func(context.Context, string) (bool, error) { return false, nil }
	repo.createFn = func(context.Context, *domain.Article) error { return errCoverage }
	if _, err := svc.CreateArticle(ctx, tenant, "user-1", dto.CreateArticleRequest{Title: "!!!"}); !errors.Is(err, errCoverage) {
		t.Fatalf("CreateArticle() create error = %v", err)
	}
}

func TestContentServiceCategoryCoverage(t *testing.T) {
	ctx := context.Background()
	repo := &coverageCategoryRepo{
		findAllFn: func(context.Context) ([]*domain.ArticleCategory, error) {
			return []*domain.ArticleCategory{{ID: "category-1", Name: "News"}}, nil
		},
		createFn: func(context.Context, *domain.ArticleCategory) error { return errCoverage },
		updateFn: func(_ context.Context, category *domain.ArticleCategory) error {
			category.Name = "Updated"
			return nil
		},
		deleteFn: func(context.Context, string) error { return errCoverage },
	}
	svc := NewContentServiceWithInterfaces(nil, repo, nil)
	if got, err := svc.ListCategories(ctx); err != nil || len(got) != 1 {
		t.Fatalf("ListCategories() = %v, %v", got, err)
	}
	if _, err := svc.CreateCategory(ctx, dto.CreateCategoryRequest{Name: "News"}); !errors.Is(err, errCoverage) {
		t.Fatalf("CreateCategory() error = %v", err)
	}
	if got, err := svc.UpdateCategory(ctx, "category-1", dto.UpdateCategoryRequest{Name: "News"}); err != nil || got.Name != "Updated" {
		t.Fatalf("UpdateCategory() = %v, %v", got, err)
	}
	if err := svc.DeleteCategory(ctx, "category-1"); !errors.Is(err, errCoverage) {
		t.Fatalf("DeleteCategory() error = %v", err)
	}
	repo.findAllFn = func(context.Context) ([]*domain.ArticleCategory, error) { return nil, errCoverage }
	if _, err := svc.ListCategories(ctx); !errors.Is(err, errCoverage) {
		t.Fatalf("ListCategories() error = %v", err)
	}
	repo.updateFn = func(context.Context, *domain.ArticleCategory) error { return errCoverage }
	if _, err := svc.UpdateCategory(ctx, "category-1", dto.UpdateCategoryRequest{}); !errors.Is(err, errCoverage) {
		t.Fatalf("UpdateCategory() error = %v", err)
	}
}

func TestContentServiceGalleryCoverage(t *testing.T) {
	ctx := context.Background()
	tenant := "tenant-1"
	gallery := &domain.Gallery{ID: "gallery-1", TenantID: &tenant, Title: "Gallery", ImageURL: "https://example.com/a.jpg"}
	repo := &coverageGalleryRepo{
		findAllFn: func(_ context.Context, filter repository.GalleryFilter, page, limit int) ([]*domain.Gallery, int64, error) {
			if filter.Featured == nil || !*filter.Featured || page != 2 || limit != 5 {
				t.Fatalf("unexpected gallery filter: %+v page=%d limit=%d", filter, page, limit)
			}
			return []*domain.Gallery{gallery}, 1, nil
		},
		findByIDFn:        func(context.Context, string) (*domain.Gallery, error) { return gallery, nil },
		eventAccessibleFn: func(context.Context, string, *string) (bool, error) { return true, nil },
		createFn:          func(context.Context, *domain.Gallery) error { return nil },
		updateFn:          func(context.Context, *domain.Gallery, *string) error { return nil },
		deleteFn:          func(context.Context, string, *string) error { return errCoverage },
	}
	svc := NewContentServiceWithInterfaces(nil, nil, repo)
	featured := true
	if got, total, err := svc.ListGalleries(ctx, dto.GalleryQuery{Featured: &featured, Page: 2, Limit: 5}); err != nil || total != 1 || len(got) != 1 {
		t.Fatalf("ListGalleries() = %v, %d, %v", got, total, err)
	}
	if err := svc.DeleteGallery(ctx, gallery.ID, &tenant); !errors.Is(err, errCoverage) {
		t.Fatalf("DeleteGallery() error = %v", err)
	}

	repo.findAllFn = func(context.Context, repository.GalleryFilter, int, int) ([]*domain.Gallery, int64, error) {
		return nil, 0, errCoverage
	}
	if _, _, err := svc.ListGalleries(ctx, dto.GalleryQuery{}); !errors.Is(err, errCoverage) {
		t.Fatalf("ListGalleries() error = %v", err)
	}
	repo.eventAccessibleFn = func(context.Context, string, *string) (bool, error) { return false, errCoverage }
	if _, err := svc.CreateGallery(ctx, tenant, dto.CreateGalleryRequest{EventID: "event-1"}); !errors.Is(err, errCoverage) {
		t.Fatalf("CreateGallery() event error = %v", err)
	}
	repo.eventAccessibleFn = func(context.Context, string, *string) (bool, error) { return true, nil }
	repo.createFn = func(context.Context, *domain.Gallery) error { return errCoverage }
	if _, err := svc.CreateGallery(ctx, tenant, dto.CreateGalleryRequest{EventID: "event-1"}); !errors.Is(err, errCoverage) {
		t.Fatalf("CreateGallery() create error = %v", err)
	}
	repo.eventAccessibleFn = func(context.Context, string, *string) (bool, error) { return false, nil }
	if _, err := svc.UpdateGallery(ctx, gallery.ID, &tenant, dto.UpdateGalleryRequest{EventID: "event-2"}); !errors.Is(err, repository.ErrGalleryEventNotFound) {
		t.Fatalf("UpdateGallery() inaccessible error = %v", err)
	}
	repo.eventAccessibleFn = func(context.Context, string, *string) (bool, error) { return true, nil }
	repo.updateFn = func(context.Context, *domain.Gallery, *string) error { return errCoverage }
	if _, err := svc.UpdateGallery(ctx, gallery.ID, &tenant, dto.UpdateGalleryRequest{EventID: "event-1"}); !errors.Is(err, errCoverage) {
		t.Fatalf("UpdateGallery() update error = %v", err)
	}
	repo.updateFn = func(context.Context, *domain.Gallery, *string) error { return nil }
	repo.findByIDFn = func(context.Context, string) (*domain.Gallery, error) { return nil, errCoverage }
	if _, err := svc.UpdateGallery(ctx, gallery.ID, &tenant, dto.UpdateGalleryRequest{}); !errors.Is(err, errCoverage) {
		t.Fatalf("UpdateGallery() read error = %v", err)
	}
}
