package handler

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/content/dto"
	"venturo-skeleton-go/internal/modules/features/content/repository"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

var errHandlerCoverage = errors.New("handler error")

type articleHandlerMock struct {
	listFn   func(context.Context, *string, dto.ArticleQuery) ([]dto.ArticleResponse, int64, error)
	getFn    func(context.Context, string) (*dto.ArticleResponse, error)
	createFn func(context.Context, string, string, dto.CreateArticleRequest) (*dto.ArticleResponse, error)
	updateFn func(context.Context, string, *string, dto.UpdateArticleRequest) (*dto.ArticleResponse, error)
	deleteFn func(context.Context, string, *string) error
}

func (m *articleHandlerMock) ListArticles(ctx context.Context, scope *string, query dto.ArticleQuery) ([]dto.ArticleResponse, int64, error) {
	return m.listFn(ctx, scope, query)
}
func (m *articleHandlerMock) GetArticleBySlug(ctx context.Context, slug string) (*dto.ArticleResponse, error) {
	return m.getFn(ctx, slug)
}
func (m *articleHandlerMock) CreateArticle(ctx context.Context, tenant, user string, req dto.CreateArticleRequest) (*dto.ArticleResponse, error) {
	return m.createFn(ctx, tenant, user, req)
}
func (m *articleHandlerMock) UpdateArticle(ctx context.Context, id string, scope *string, req dto.UpdateArticleRequest) (*dto.ArticleResponse, error) {
	return m.updateFn(ctx, id, scope, req)
}
func (m *articleHandlerMock) DeleteArticle(ctx context.Context, id string, scope *string) error {
	return m.deleteFn(ctx, id, scope)
}

type categoryHandlerMock struct {
	listFn   func(context.Context) ([]dto.CategoryResponse, error)
	createFn func(context.Context, dto.CreateCategoryRequest) (*dto.CategoryResponse, error)
	updateFn func(context.Context, string, dto.UpdateCategoryRequest) (*dto.CategoryResponse, error)
	deleteFn func(context.Context, string) error
}

func (m *categoryHandlerMock) ListCategories(ctx context.Context) ([]dto.CategoryResponse, error) {
	return m.listFn(ctx)
}
func (m *categoryHandlerMock) CreateCategory(ctx context.Context, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	return m.createFn(ctx, req)
}
func (m *categoryHandlerMock) UpdateCategory(ctx context.Context, id string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	return m.updateFn(ctx, id, req)
}
func (m *categoryHandlerMock) DeleteCategory(ctx context.Context, id string) error {
	return m.deleteFn(ctx, id)
}

type galleryHandlerMock struct {
	listFn   func(context.Context, dto.GalleryQuery) ([]dto.GalleryResponse, int64, error)
	createFn func(context.Context, string, dto.CreateGalleryRequest) (*dto.GalleryResponse, error)
	updateFn func(context.Context, string, *string, dto.UpdateGalleryRequest) (*dto.GalleryResponse, error)
	deleteFn func(context.Context, string, *string) error
}

func (m *galleryHandlerMock) ListGalleries(ctx context.Context, query dto.GalleryQuery) ([]dto.GalleryResponse, int64, error) {
	return m.listFn(ctx, query)
}
func (m *galleryHandlerMock) CreateGallery(ctx context.Context, tenant string, req dto.CreateGalleryRequest) (*dto.GalleryResponse, error) {
	return m.createFn(ctx, tenant, req)
}
func (m *galleryHandlerMock) UpdateGallery(ctx context.Context, id string, scope *string, req dto.UpdateGalleryRequest) (*dto.GalleryResponse, error) {
	return m.updateFn(ctx, id, scope, req)
}
func (m *galleryHandlerMock) DeleteGallery(ctx context.Context, id string, scope *string) error {
	return m.deleteFn(ctx, id, scope)
}

func contentRequest(method, pattern, path, body string, claims *jwtpkg.Claims, handler gin.HandlerFunc) *httptest.ResponseRecorder {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	handlers := []gin.HandlerFunc{}
	if claims != nil {
		handlers = append(handlers, func(c *gin.Context) {
			middleware.SetUserContext(c, claims)
			c.Next()
		})
	}
	handlers = append(handlers, handler)
	router.Handle(method, pattern, handlers...)
	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, strings.NewReader(body))
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}
	router.ServeHTTP(recorder, req)
	return recorder
}

func assertStatus(t *testing.T, recorder *httptest.ResponseRecorder, want int) {
	t.Helper()
	if recorder.Code != want {
		t.Fatalf("status = %d, want %d, body = %s", recorder.Code, want, recorder.Body.String())
	}
}

func validArticleBody() string {
	return `{"title":"Campus News","content":"News body"}`
}

func validGalleryBody() string {
	return `{"title":"Gallery","image_url":"https://example.com/image.jpg"}`
}

func TestArticleHandlerCoverage(t *testing.T) {
	claims := &jwtpkg.Claims{UserID: "user-1", TenantID: "tenant-1"}
	root := &jwtpkg.Claims{UserID: "root", IsSuperAdmin: true}
	mock := &articleHandlerMock{
		listFn: func(context.Context, *string, dto.ArticleQuery) ([]dto.ArticleResponse, int64, error) {
			return []dto.ArticleResponse{{ID: "article-1"}}, 1, nil
		},
		getFn: func(context.Context, string) (*dto.ArticleResponse, error) {
			return &dto.ArticleResponse{ID: "article-1"}, nil
		},
		createFn: func(context.Context, string, string, dto.CreateArticleRequest) (*dto.ArticleResponse, error) {
			return &dto.ArticleResponse{ID: "article-1"}, nil
		},
		updateFn: func(context.Context, string, *string, dto.UpdateArticleRequest) (*dto.ArticleResponse, error) {
			return &dto.ArticleResponse{ID: "article-1"}, nil
		},
		deleteFn: func(context.Context, string, *string) error { return nil },
	}
	handler := NewArticleHandler(mock)

	assertStatus(t, contentRequest(http.MethodGet, "/articles", "/articles", "", nil, handler.List), http.StatusOK)
	assertStatus(t, contentRequest(http.MethodGet, "/articles", "/articles?page=0", "", nil, handler.List), http.StatusBadRequest)
	mock.listFn = func(context.Context, *string, dto.ArticleQuery) ([]dto.ArticleResponse, int64, error) {
		return nil, 0, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodGet, "/articles", "/articles", "", nil, handler.List), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodGet, "/articles/:slug", "/articles/article", "", nil, handler.GetBySlug), http.StatusOK)
	mock.getFn = func(context.Context, string) (*dto.ArticleResponse, error) { return nil, repository.ErrArticleNotFound }
	assertStatus(t, contentRequest(http.MethodGet, "/articles/:slug", "/articles/missing", "", nil, handler.GetBySlug), http.StatusNotFound)
	mock.getFn = func(context.Context, string) (*dto.ArticleResponse, error) { return nil, errHandlerCoverage }
	assertStatus(t, contentRequest(http.MethodGet, "/articles/:slug", "/articles/broken", "", nil, handler.GetBySlug), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodPost, "/articles", "/articles", validArticleBody(), claims, handler.Create), http.StatusCreated)
	assertStatus(t, contentRequest(http.MethodPost, "/articles", "/articles", `{}`, claims, handler.Create), http.StatusBadRequest)
	assertStatus(t, contentRequest(http.MethodPost, "/articles", "/articles", validArticleBody(), nil, handler.Create), http.StatusUnauthorized)
	mock.createFn = func(context.Context, string, string, dto.CreateArticleRequest) (*dto.ArticleResponse, error) {
		return nil, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodPost, "/articles", "/articles", validArticleBody(), claims, handler.Create), http.StatusInternalServerError)

	mock.updateFn = func(context.Context, string, *string, dto.UpdateArticleRequest) (*dto.ArticleResponse, error) {
		return &dto.ArticleResponse{ID: "article-1"}, nil
	}
	assertStatus(t, contentRequest(http.MethodPut, "/articles/:id", "/articles/article-1", validArticleBody(), claims, handler.Update), http.StatusOK)
	assertStatus(t, contentRequest(http.MethodPut, "/articles/:id", "/articles/article-1", `{}`, claims, handler.Update), http.StatusBadRequest)
	assertStatus(t, contentRequest(http.MethodPut, "/articles/:id", "/articles/article-1", validArticleBody(), nil, handler.Update), http.StatusUnauthorized)
	assertStatus(t, contentRequest(http.MethodPut, "/articles/:id", "/articles/article-1", validArticleBody(), &jwtpkg.Claims{UserID: "user-1"}, handler.Update), http.StatusForbidden)
	assertStatus(t, contentRequest(http.MethodPut, "/articles/:id", "/articles/article-1", validArticleBody(), root, handler.Update), http.StatusOK)
	mock.updateFn = func(context.Context, string, *string, dto.UpdateArticleRequest) (*dto.ArticleResponse, error) {
		return nil, repository.ErrArticleNotFound
	}
	assertStatus(t, contentRequest(http.MethodPut, "/articles/:id", "/articles/article-1", validArticleBody(), claims, handler.Update), http.StatusNotFound)
	mock.updateFn = func(context.Context, string, *string, dto.UpdateArticleRequest) (*dto.ArticleResponse, error) {
		return nil, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodPut, "/articles/:id", "/articles/article-1", validArticleBody(), claims, handler.Update), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodDelete, "/articles/:id", "/articles/article-1", "", claims, handler.Delete), http.StatusOK)
	assertStatus(t, contentRequest(http.MethodDelete, "/articles/:id", "/articles/article-1", "", nil, handler.Delete), http.StatusUnauthorized)
	mock.deleteFn = func(context.Context, string, *string) error { return repository.ErrArticleNotFound }
	assertStatus(t, contentRequest(http.MethodDelete, "/articles/:id", "/articles/article-1", "", claims, handler.Delete), http.StatusNotFound)
	mock.deleteFn = func(context.Context, string, *string) error { return errHandlerCoverage }
	assertStatus(t, contentRequest(http.MethodDelete, "/articles/:id", "/articles/article-1", "", claims, handler.Delete), http.StatusInternalServerError)
}

func TestCategoryHandlerCoverage(t *testing.T) {
	mock := &categoryHandlerMock{
		listFn: func(context.Context) ([]dto.CategoryResponse, error) {
			return []dto.CategoryResponse{{ID: "category-1"}}, nil
		},
		createFn: func(context.Context, dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
			return &dto.CategoryResponse{ID: "category-1"}, nil
		},
		updateFn: func(context.Context, string, dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
			return &dto.CategoryResponse{ID: "category-1"}, nil
		},
		deleteFn: func(context.Context, string) error { return nil },
	}
	handler := NewCategoryHandler(mock)
	valid := `{"name":"News"}`
	assertStatus(t, contentRequest(http.MethodGet, "/categories", "/categories", "", nil, handler.List), http.StatusOK)
	mock.listFn = func(context.Context) ([]dto.CategoryResponse, error) { return nil, errHandlerCoverage }
	assertStatus(t, contentRequest(http.MethodGet, "/categories", "/categories", "", nil, handler.List), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodPost, "/categories", "/categories", valid, nil, handler.Create), http.StatusCreated)
	assertStatus(t, contentRequest(http.MethodPost, "/categories", "/categories", `{}`, nil, handler.Create), http.StatusBadRequest)
	mock.createFn = func(context.Context, dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
		return nil, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodPost, "/categories", "/categories", valid, nil, handler.Create), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodPut, "/categories/:id", "/categories/category-1", valid, nil, handler.Update), http.StatusOK)
	assertStatus(t, contentRequest(http.MethodPut, "/categories/:id", "/categories/category-1", `{}`, nil, handler.Update), http.StatusBadRequest)
	mock.updateFn = func(context.Context, string, dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
		return nil, repository.ErrCategoryNotFound
	}
	assertStatus(t, contentRequest(http.MethodPut, "/categories/:id", "/categories/category-1", valid, nil, handler.Update), http.StatusNotFound)
	mock.updateFn = func(context.Context, string, dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
		return nil, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodPut, "/categories/:id", "/categories/category-1", valid, nil, handler.Update), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodDelete, "/categories/:id", "/categories/category-1", "", nil, handler.Delete), http.StatusOK)
	mock.deleteFn = func(context.Context, string) error { return repository.ErrCategoryNotFound }
	assertStatus(t, contentRequest(http.MethodDelete, "/categories/:id", "/categories/category-1", "", nil, handler.Delete), http.StatusNotFound)
	mock.deleteFn = func(context.Context, string) error { return errHandlerCoverage }
	assertStatus(t, contentRequest(http.MethodDelete, "/categories/:id", "/categories/category-1", "", nil, handler.Delete), http.StatusInternalServerError)
}

func TestGalleryHandlerCoverage(t *testing.T) {
	claims := &jwtpkg.Claims{UserID: "user-1", TenantID: "tenant-1"}
	mock := &galleryHandlerMock{
		listFn: func(context.Context, dto.GalleryQuery) ([]dto.GalleryResponse, int64, error) {
			return []dto.GalleryResponse{{ID: "gallery-1"}}, 1, nil
		},
		createFn: func(context.Context, string, dto.CreateGalleryRequest) (*dto.GalleryResponse, error) {
			return &dto.GalleryResponse{ID: "gallery-1"}, nil
		},
		updateFn: func(context.Context, string, *string, dto.UpdateGalleryRequest) (*dto.GalleryResponse, error) {
			return &dto.GalleryResponse{ID: "gallery-1"}, nil
		},
		deleteFn: func(context.Context, string, *string) error { return nil },
	}
	handler := NewGalleryHandler(mock)
	assertStatus(t, contentRequest(http.MethodGet, "/galleries", "/galleries", "", nil, handler.List), http.StatusOK)
	assertStatus(t, contentRequest(http.MethodGet, "/galleries", "/galleries?page=0", "", nil, handler.List), http.StatusBadRequest)
	mock.listFn = func(context.Context, dto.GalleryQuery) ([]dto.GalleryResponse, int64, error) {
		return nil, 0, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodGet, "/galleries", "/galleries", "", nil, handler.List), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodPost, "/galleries", "/galleries", validGalleryBody(), claims, handler.Create), http.StatusCreated)
	assertStatus(t, contentRequest(http.MethodPost, "/galleries", "/galleries", `{}`, claims, handler.Create), http.StatusBadRequest)
	assertStatus(t, contentRequest(http.MethodPost, "/galleries", "/galleries", validGalleryBody(), nil, handler.Create), http.StatusUnauthorized)
	mock.createFn = func(context.Context, string, dto.CreateGalleryRequest) (*dto.GalleryResponse, error) {
		return nil, repository.ErrGalleryEventNotFound
	}
	assertStatus(t, contentRequest(http.MethodPost, "/galleries", "/galleries", validGalleryBody(), claims, handler.Create), http.StatusNotFound)
	mock.createFn = func(context.Context, string, dto.CreateGalleryRequest) (*dto.GalleryResponse, error) {
		return nil, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodPost, "/galleries", "/galleries", validGalleryBody(), claims, handler.Create), http.StatusInternalServerError)

	mock.updateFn = func(context.Context, string, *string, dto.UpdateGalleryRequest) (*dto.GalleryResponse, error) {
		return &dto.GalleryResponse{ID: "gallery-1"}, nil
	}
	assertStatus(t, contentRequest(http.MethodPut, "/galleries/:id", "/galleries/gallery-1", validGalleryBody(), claims, handler.Update), http.StatusOK)
	assertStatus(t, contentRequest(http.MethodPut, "/galleries/:id", "/galleries/gallery-1", `{}`, claims, handler.Update), http.StatusBadRequest)
	assertStatus(t, contentRequest(http.MethodPut, "/galleries/:id", "/galleries/gallery-1", validGalleryBody(), nil, handler.Update), http.StatusUnauthorized)
	mock.updateFn = func(context.Context, string, *string, dto.UpdateGalleryRequest) (*dto.GalleryResponse, error) {
		return nil, repository.ErrGalleryNotFound
	}
	assertStatus(t, contentRequest(http.MethodPut, "/galleries/:id", "/galleries/gallery-1", validGalleryBody(), claims, handler.Update), http.StatusNotFound)
	mock.updateFn = func(context.Context, string, *string, dto.UpdateGalleryRequest) (*dto.GalleryResponse, error) {
		return nil, errHandlerCoverage
	}
	assertStatus(t, contentRequest(http.MethodPut, "/galleries/:id", "/galleries/gallery-1", validGalleryBody(), claims, handler.Update), http.StatusInternalServerError)

	assertStatus(t, contentRequest(http.MethodDelete, "/galleries/:id", "/galleries/gallery-1", "", claims, handler.Delete), http.StatusOK)
	assertStatus(t, contentRequest(http.MethodDelete, "/galleries/:id", "/galleries/gallery-1", "", nil, handler.Delete), http.StatusUnauthorized)
	mock.deleteFn = func(context.Context, string, *string) error { return repository.ErrGalleryNotFound }
	assertStatus(t, contentRequest(http.MethodDelete, "/galleries/:id", "/galleries/gallery-1", "", claims, handler.Delete), http.StatusNotFound)
	mock.deleteFn = func(context.Context, string, *string) error { return errHandlerCoverage }
	assertStatus(t, contentRequest(http.MethodDelete, "/galleries/:id", "/galleries/gallery-1", "", claims, handler.Delete), http.StatusInternalServerError)
}
