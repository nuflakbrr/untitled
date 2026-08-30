package service

import (
	"context"
	"fmt"
	"strings"
	"unicode"

	"venturo-skeleton-go/internal/modules/features/content/domain"
	"venturo-skeleton-go/internal/modules/features/content/dto"
	"venturo-skeleton-go/internal/modules/features/content/repository"
)

type ArticleRepository interface {
	FindAll(ctx context.Context, scopeTenantID *string, page, limit int, search, categoryID string) ([]*domain.Article, int64, error)
	FindByID(ctx context.Context, id string) (*domain.Article, error)
	FindBySlug(ctx context.Context, slug string) (*domain.Article, error)
	SlugExists(ctx context.Context, slug string) (bool, error)
	Create(ctx context.Context, article *domain.Article) error
	Update(ctx context.Context, article *domain.Article, scopeTenantID *string) error
	Delete(ctx context.Context, id string, scopeTenantID *string) error
}

type CategoryRepository interface {
	FindAll(ctx context.Context) ([]*domain.ArticleCategory, error)
	Create(ctx context.Context, category *domain.ArticleCategory) error
	Update(ctx context.Context, category *domain.ArticleCategory) error
	Delete(ctx context.Context, id string) error
}

type GalleryRepository interface {
	FindAll(ctx context.Context, filter repository.GalleryFilter, page, limit int) ([]*domain.Gallery, int64, error)
	FindByID(ctx context.Context, id string) (*domain.Gallery, error)
	EventAccessible(ctx context.Context, eventID string, scopeTenantID *string) (bool, error)
	Create(ctx context.Context, gallery *domain.Gallery) error
	Update(ctx context.Context, gallery *domain.Gallery, scopeTenantID *string) error
	Delete(ctx context.Context, id string, scopeTenantID *string) error
}

type ContentService struct {
	articles   ArticleRepository
	categories CategoryRepository
	galleries  GalleryRepository
}

func NewContentService(articles *repository.ArticleRepository, categories *repository.CategoryRepository, galleries *repository.GalleryRepository) *ContentService {
	return NewContentServiceWithInterfaces(articles, categories, galleries)
}

func NewContentServiceWithInterfaces(articles ArticleRepository, categories CategoryRepository, galleries GalleryRepository) *ContentService {
	return &ContentService{articles: articles, categories: categories, galleries: galleries}
}

// ─── Articles ───────────────────────────────────────────────────────────────

func (s *ContentService) ListArticles(ctx context.Context, scopeTenantID *string, query dto.ArticleQuery) ([]dto.ArticleResponse, int64, error) {
	page, limit := pagination(query.Page, query.Limit)
	tenantFilter := scopeTenantID
	if query.TenantID != "" {
		tenantFilter = &query.TenantID
	}
	articles, total, err := s.articles.FindAll(ctx, tenantFilter, page, limit, query.Search, query.CategoryID)
	if err != nil {
		return nil, 0, err
	}
	return toArticleResponses(articles), total, nil
}

func (s *ContentService) GetArticleBySlug(ctx context.Context, slug string) (*dto.ArticleResponse, error) {
	article, err := s.articles.FindBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	response := toArticleResponse(article)
	return &response, nil
}

func (s *ContentService) CreateArticle(ctx context.Context, tenantID, creatorID string, req dto.CreateArticleRequest) (*dto.ArticleResponse, error) {
	slug, err := s.uniqueArticleSlug(ctx, req.Title)
	if err != nil {
		return nil, err
	}
	article := &domain.Article{
		TenantID: nilIfEmpty(tenantID), Title: req.Title, Content: req.Content,
		Cover: nilIfEmpty(req.Cover), Slug: slug, CreatedByID: nilIfEmpty(creatorID), CategoryIDs: req.CategoryIDs,
	}
	if err := s.articles.Create(ctx, article); err != nil {
		return nil, err
	}
	response := toArticleResponse(article)
	return &response, nil
}

func (s *ContentService) UpdateArticle(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateArticleRequest) (*dto.ArticleResponse, error) {
	article := &domain.Article{
		ID: id, Title: req.Title, Content: req.Content, Cover: nilIfEmpty(req.Cover), CategoryIDs: req.CategoryIDs,
	}
	if err := s.articles.Update(ctx, article, scopeTenantID); err != nil {
		return nil, err
	}
	updated, err := s.articles.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	response := toArticleResponse(updated)
	return &response, nil
}

func (s *ContentService) DeleteArticle(ctx context.Context, id string, scopeTenantID *string) error {
	return s.articles.Delete(ctx, id, scopeTenantID)
}

func (s *ContentService) uniqueArticleSlug(ctx context.Context, title string) (string, error) {
	base := slugify(title)
	if base == "" {
		base = "article"
	}
	for suffix := 1; ; suffix++ {
		candidate := base
		if suffix > 1 {
			candidate = fmt.Sprintf("%s-%d", base, suffix)
		}
		exists, err := s.articles.SlugExists(ctx, candidate)
		if err != nil {
			return "", err
		}
		if !exists {
			return candidate, nil
		}
	}
}

// ─── Article Categories ─────────────────────────────────────────────────────

func (s *ContentService) ListCategories(ctx context.Context) ([]dto.CategoryResponse, error) {
	categories, err := s.categories.FindAll(ctx)
	if err != nil {
		return nil, err
	}
	responses := make([]dto.CategoryResponse, 0, len(categories))
	for _, category := range categories {
		responses = append(responses, toCategoryResponse(category))
	}
	return responses, nil
}

func (s *ContentService) CreateCategory(ctx context.Context, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	category := &domain.ArticleCategory{Name: req.Name}
	if err := s.categories.Create(ctx, category); err != nil {
		return nil, err
	}
	response := toCategoryResponse(category)
	return &response, nil
}

func (s *ContentService) UpdateCategory(ctx context.Context, id string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	category := &domain.ArticleCategory{ID: id, Name: req.Name}
	if err := s.categories.Update(ctx, category); err != nil {
		return nil, err
	}
	response := toCategoryResponse(category)
	return &response, nil
}

func (s *ContentService) DeleteCategory(ctx context.Context, id string) error {
	return s.categories.Delete(ctx, id)
}

// ─── Galleries ───────────────────────────────────────────────────────────────

func (s *ContentService) ListGalleries(ctx context.Context, query dto.GalleryQuery) ([]dto.GalleryResponse, int64, error) {
	page, limit := pagination(query.Page, query.Limit)
	filter := repository.GalleryFilter{TenantID: nilIfEmpty(query.TenantID), EventID: nilIfEmpty(query.EventID), Featured: query.Featured}
	galleries, total, err := s.galleries.FindAll(ctx, filter, page, limit)
	if err != nil {
		return nil, 0, err
	}
	responses := make([]dto.GalleryResponse, 0, len(galleries))
	for _, gallery := range galleries {
		responses = append(responses, toGalleryResponse(gallery))
	}
	return responses, total, nil
}

func (s *ContentService) CreateGallery(ctx context.Context, tenantID string, req dto.CreateGalleryRequest) (*dto.GalleryResponse, error) {
	gallery := &domain.Gallery{
		TenantID: nilIfEmpty(tenantID), Title: req.Title, Description: nilIfEmpty(req.Description),
		ImageURL: req.ImageURL, Featured: req.Featured, EventID: nilIfEmpty(req.EventID),
	}
	if err := s.validateGalleryEvent(ctx, gallery.EventID, gallery.TenantID); err != nil {
		return nil, err
	}
	if err := s.galleries.Create(ctx, gallery); err != nil {
		return nil, err
	}
	response := toGalleryResponse(gallery)
	return &response, nil
}

func (s *ContentService) UpdateGallery(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateGalleryRequest) (*dto.GalleryResponse, error) {
	gallery := &domain.Gallery{
		ID: id, Title: req.Title, Description: nilIfEmpty(req.Description),
		ImageURL: req.ImageURL, Featured: req.Featured, EventID: nilIfEmpty(req.EventID),
	}
	if err := s.validateGalleryEvent(ctx, gallery.EventID, scopeTenantID); err != nil {
		return nil, err
	}
	if err := s.galleries.Update(ctx, gallery, scopeTenantID); err != nil {
		return nil, err
	}
	updated, err := s.galleries.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	response := toGalleryResponse(updated)
	return &response, nil
}

func (s *ContentService) DeleteGallery(ctx context.Context, id string, scopeTenantID *string) error {
	return s.galleries.Delete(ctx, id, scopeTenantID)
}

func (s *ContentService) validateGalleryEvent(ctx context.Context, eventID, scopeTenantID *string) error {
	if eventID == nil {
		return nil
	}
	accessible, err := s.galleries.EventAccessible(ctx, *eventID, scopeTenantID)
	if err != nil {
		return err
	}
	if !accessible {
		return repository.ErrGalleryEventNotFound
	}
	return nil
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

func pagination(page, limit int) (int, int) {
	if page <= 0 {
		page = 1
	}
	if limit <= 0 {
		limit = 10
	}
	return page, limit
}

func nilIfEmpty(value string) *string {
	if value == "" {
		return nil
	}
	return &value
}

func slugify(value string) string {
	var builder strings.Builder
	dash := false
	for _, r := range strings.ToLower(strings.TrimSpace(value)) {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			builder.WriteRune(r)
			dash = false
		} else if builder.Len() > 0 && !dash {
			builder.WriteByte('-')
			dash = true
		}
	}
	return strings.Trim(builder.String(), "-")
}

func toArticleResponses(articles []*domain.Article) []dto.ArticleResponse {
	responses := make([]dto.ArticleResponse, 0, len(articles))
	for _, article := range articles {
		responses = append(responses, toArticleResponse(article))
	}
	return responses
}

func toArticleResponse(article *domain.Article) dto.ArticleResponse {
	return dto.ArticleResponse{
		ID: article.ID, TenantID: article.TenantID, Title: article.Title, Content: article.Content,
		Cover: article.Cover, Slug: article.Slug, CreatedByID: article.CreatedByID, CategoryIDs: article.CategoryIDs,
		CreatedAt: article.CreatedAt, UpdatedAt: article.UpdatedAt,
	}
}

func toCategoryResponse(category *domain.ArticleCategory) dto.CategoryResponse {
	return dto.CategoryResponse{ID: category.ID, Name: category.Name, CreatedAt: category.CreatedAt, UpdatedAt: category.UpdatedAt}
}

func toGalleryResponse(gallery *domain.Gallery) dto.GalleryResponse {
	return dto.GalleryResponse{
		ID: gallery.ID, TenantID: gallery.TenantID, Title: gallery.Title, Description: gallery.Description,
		ImageURL: gallery.ImageURL, Featured: gallery.Featured, EventID: gallery.EventID,
		CreatedAt: gallery.CreatedAt, UpdatedAt: gallery.UpdatedAt,
	}
}
