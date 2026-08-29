package service

import (
	"context"
	"testing"

	"venturo-skeleton-go/internal/modules/features/content/domain"
	"venturo-skeleton-go/internal/modules/features/content/dto"
	"venturo-skeleton-go/internal/modules/features/content/repository"
)

type fakeArticleRepo struct {
	slugs    map[string]bool
	created  *domain.Article
	updated  *domain.Article
	byID     map[string]*domain.Article
	deleteFn func(ctx context.Context, id string, scopeTenantID *string) error
}

func newFakeArticleRepo() *fakeArticleRepo {
	return &fakeArticleRepo{slugs: map[string]bool{}, byID: map[string]*domain.Article{}}
}

func (f *fakeArticleRepo) FindAll(context.Context, *string, int, int) ([]*domain.Article, int64, error) {
	return nil, 0, nil
}
func (f *fakeArticleRepo) FindByID(_ context.Context, id string) (*domain.Article, error) {
	if a, ok := f.byID[id]; ok {
		return a, nil
	}
	return f.created, nil
}
func (f *fakeArticleRepo) FindBySlug(context.Context, string) (*domain.Article, error) {
	return nil, nil
}
func (f *fakeArticleRepo) SlugExists(_ context.Context, slug string) (bool, error) {
	return f.slugs[slug], nil
}
func (f *fakeArticleRepo) Create(_ context.Context, a *domain.Article) error {
	a.ID = "article-1"
	f.created = a
	return nil
}
func (f *fakeArticleRepo) Update(_ context.Context, a *domain.Article, _ *string) error {
	f.updated = a
	f.byID[a.ID] = a
	return nil
}
func (f *fakeArticleRepo) Delete(ctx context.Context, id string, scopeTenantID *string) error {
	if f.deleteFn != nil {
		return f.deleteFn(ctx, id, scopeTenantID)
	}
	return nil
}

func TestCreateArticle_GeneratesUniqueSlug(t *testing.T) {
	repo := newFakeArticleRepo()
	repo.slugs["campus-news"] = true // simulate an existing article with the base slug
	svc := NewContentServiceWithInterfaces(repo, nil, nil)

	resp, err := svc.CreateArticle(context.Background(), "tenant-1", "user-1", dto.CreateArticleRequest{Title: "Campus News", Content: "body"})
	if err != nil {
		t.Fatalf("CreateArticle: %v", err)
	}
	if resp.Slug != "campus-news-2" {
		t.Fatalf("expected slug collision to produce campus-news-2, got %q", resp.Slug)
	}
}

func TestCreateArticle_GlobalWhenNoTenant(t *testing.T) {
	repo := newFakeArticleRepo()
	svc := NewContentServiceWithInterfaces(repo, nil, nil)

	resp, err := svc.CreateArticle(context.Background(), "", "user-1", dto.CreateArticleRequest{Title: "Global Announcement", Content: "body"})
	if err != nil {
		t.Fatalf("CreateArticle: %v", err)
	}
	if resp.TenantID != nil {
		t.Fatalf("expected nil tenant_id for a global article, got %v", *resp.TenantID)
	}
}

func TestDeleteArticle_ScopedToTenant(t *testing.T) {
	repo := newFakeArticleRepo()
	var seenScope *string
	repo.deleteFn = func(_ context.Context, id string, scopeTenantID *string) error {
		seenScope = scopeTenantID
		return nil
	}
	svc := NewContentServiceWithInterfaces(repo, nil, nil)

	tenant := "tenant-fasilkom"
	if err := svc.DeleteArticle(context.Background(), "article-1", &tenant); err != nil {
		t.Fatalf("DeleteArticle: %v", err)
	}
	if seenScope == nil || *seenScope != "tenant-fasilkom" {
		t.Fatalf("expected delete to be scoped to caller's tenant, got %v", seenScope)
	}
}

type fakeGalleryRepo struct {
	lastFilter repository.GalleryFilter
}

func (f *fakeGalleryRepo) FindAll(_ context.Context, filter repository.GalleryFilter, _, _ int) ([]*domain.Gallery, int64, error) {
	f.lastFilter = filter
	return nil, 0, nil
}
func (f *fakeGalleryRepo) FindByID(context.Context, string) (*domain.Gallery, error) { return nil, nil }
func (f *fakeGalleryRepo) Create(_ context.Context, g *domain.Gallery) error {
	g.ID = "gallery-1"
	return nil
}
func (f *fakeGalleryRepo) Update(context.Context, *domain.Gallery, *string) error { return nil }
func (f *fakeGalleryRepo) Delete(context.Context, string, *string) error          { return nil }

func TestListGalleries_PassesFilterThrough(t *testing.T) {
	repo := &fakeGalleryRepo{}
	svc := NewContentServiceWithInterfaces(nil, nil, repo)

	if _, _, err := svc.ListGalleries(context.Background(), dto.GalleryQuery{TenantID: "tenant-1", EventID: "event-1"}); err != nil {
		t.Fatalf("ListGalleries: %v", err)
	}
	if repo.lastFilter.TenantID == nil || *repo.lastFilter.TenantID != "tenant-1" {
		t.Fatalf("expected tenant filter to reach repository, got %v", repo.lastFilter.TenantID)
	}
	if repo.lastFilter.EventID == nil || *repo.lastFilter.EventID != "event-1" {
		t.Fatalf("expected event filter to reach repository, got %v", repo.lastFilter.EventID)
	}
}

type fakeCategoryRepo struct {
	created *domain.ArticleCategory
}

func (f *fakeCategoryRepo) FindAll(context.Context) ([]*domain.ArticleCategory, error) {
	return nil, nil
}
func (f *fakeCategoryRepo) Create(_ context.Context, c *domain.ArticleCategory) error {
	c.ID = "category-1"
	f.created = c
	return nil
}
func (f *fakeCategoryRepo) Update(context.Context, *domain.ArticleCategory) error { return nil }
func (f *fakeCategoryRepo) Delete(context.Context, string) error                  { return nil }

func TestCreateCategory(t *testing.T) {
	repo := &fakeCategoryRepo{}
	svc := NewContentServiceWithInterfaces(nil, repo, nil)

	resp, err := svc.CreateCategory(context.Background(), dto.CreateCategoryRequest{Name: "Prestasi"})
	if err != nil {
		t.Fatalf("CreateCategory: %v", err)
	}
	if resp.ID != "category-1" || resp.Name != "Prestasi" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestCreateGallery(t *testing.T) {
	repo := &fakeGalleryRepo{}
	svc := NewContentServiceWithInterfaces(nil, nil, repo)

	resp, err := svc.CreateGallery(context.Background(), "tenant-1", dto.CreateGalleryRequest{Title: "Dokumentasi", ImageURL: "https://cdn.local/x.png"})
	if err != nil {
		t.Fatalf("CreateGallery: %v", err)
	}
	if resp.ID != "gallery-1" || resp.TenantID == nil || *resp.TenantID != "tenant-1" {
		t.Fatalf("unexpected response: %+v", resp)
	}
}

func TestSlugify(t *testing.T) {
	if got := slugify("  Hello, World! 2026  "); got != "hello-world-2026" {
		t.Fatalf("slugify = %q", got)
	}
}
