package handler

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/event/domain"
	"venturo-skeleton-go/internal/modules/features/event/dto"
	"venturo-skeleton-go/internal/modules/features/event/repository"
	"venturo-skeleton-go/internal/modules/features/event/service"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type mockHandlerService struct {
	listCategoriesFn func(context.Context, *string) ([]dto.CategoryResponse, error)
	createCategoryFn func(context.Context, string, dto.CreateCategoryRequest) (*dto.CategoryResponse, error)
	updateCategoryFn func(context.Context, string, *string, dto.UpdateCategoryRequest) (*dto.CategoryResponse, error)
	deleteCategoryFn func(context.Context, string, *string) error
	listEventsFn     func(context.Context, dto.EventQuery) ([]dto.EventResponse, int64, error)
	getEventFn       func(context.Context, string) (*dto.EventResponse, error)
	createEventFn    func(context.Context, string, string, dto.CreateEventRequest) (*dto.EventResponse, error)
	updateEventFn    func(context.Context, string, *string, bool, dto.UpdateEventRequest) (*dto.EventResponse, error)
	updateStatusFn   func(context.Context, string, *string, domain.EventStatus) (*dto.EventResponse, error)
	deleteEventFn    func(context.Context, string, *string) error
}

func (m *mockHandlerService) ListCategories(ctx context.Context, tenantID *string) ([]dto.CategoryResponse, error) {
	if m.listCategoriesFn != nil {
		return m.listCategoriesFn(ctx, tenantID)
	}
	return nil, nil
}
func (m *mockHandlerService) CreateCategory(ctx context.Context, tenantID string, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
	if m.createCategoryFn != nil {
		return m.createCategoryFn(ctx, tenantID, req)
	}
	return nil, nil
}
func (m *mockHandlerService) UpdateCategory(ctx context.Context, id string, scope *string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
	if m.updateCategoryFn != nil {
		return m.updateCategoryFn(ctx, id, scope, req)
	}
	return nil, nil
}
func (m *mockHandlerService) DeleteCategory(ctx context.Context, id string, scope *string) error {
	if m.deleteCategoryFn != nil {
		return m.deleteCategoryFn(ctx, id, scope)
	}
	return nil
}
func (m *mockHandlerService) ListPublicEvents(ctx context.Context, query dto.EventQuery) ([]dto.EventResponse, int64, error) {
	if m.listEventsFn != nil {
		return m.listEventsFn(ctx, query)
	}
	return nil, 0, nil
}
func (m *mockHandlerService) GetPublicEvent(ctx context.Context, slug string) (*dto.EventResponse, error) {
	if m.getEventFn != nil {
		return m.getEventFn(ctx, slug)
	}
	return nil, repository.ErrEventNotFound
}
func (m *mockHandlerService) CreateEvent(ctx context.Context, tenantID, userID string, req dto.CreateEventRequest) (*dto.EventResponse, error) {
	return m.createEventFn(ctx, tenantID, userID, req)
}
func (m *mockHandlerService) UpdateEvent(ctx context.Context, id string, scope *string, allowCompleted bool, req dto.UpdateEventRequest) (*dto.EventResponse, error) {
	return m.updateEventFn(ctx, id, scope, allowCompleted, req)
}
func (m *mockHandlerService) UpdateEventStatus(ctx context.Context, id string, scope *string, status domain.EventStatus) (*dto.EventResponse, error) {
	if m.updateStatusFn != nil {
		return m.updateStatusFn(ctx, id, scope, status)
	}
	return nil, nil
}
func (m *mockHandlerService) DeleteEvent(ctx context.Context, id string, scope *string) error {
	if m.deleteEventFn != nil {
		return m.deleteEventFn(ctx, id, scope)
	}
	return nil
}

func validEventJSON() string {
	return `{
		"title":"Workshop Go","description":"Workshop practical",
		"start_date":"2026-10-20T00:00:00Z","end_date":"2026-10-21T00:00:00Z",
		"start_time":"09:00","end_time":"17:00","location":"Lab 3",
		"event_type":"OFFLINE","registration_deadline":"2026-10-18T00:00:00Z",
		"quota":40,"price":150000
	}`
}

func TestCreateUsesJWTenantAndIgnoresHeaderForFacultyAdmin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := &mockHandlerService{createEventFn: func(_ context.Context, tenantID, userID string, _ dto.CreateEventRequest) (*dto.EventResponse, error) {
		if tenantID != "tenant-fasilkom" {
			t.Errorf("tenantID = %q", tenantID)
		}
		if userID != "admin-fasilkom" {
			t.Errorf("userID = %q", userID)
		}
		return &dto.EventResponse{ID: "event-1", TenantID: tenantID}, nil
	}}
	router := gin.New()
	router.POST("/events", func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "admin-fasilkom", TenantID: "tenant-fasilkom"})
		c.Next()
	}, NewEventHandler(service).Create)
	req := httptest.NewRequest(http.MethodPost, "/events", strings.NewReader(validEventJSON()))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Tenant-ID", "tenant-teknik")
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)
	if recorder.Code != http.StatusCreated {
		t.Fatalf("status = %d, body = %s", recorder.Code, recorder.Body.String())
	}
}

func TestUpdateForeignEventReturnsNotFound(t *testing.T) {
	gin.SetMode(gin.TestMode)
	service := &mockHandlerService{updateEventFn: func(_ context.Context, _ string, scope *string, allowCompleted bool, _ dto.UpdateEventRequest) (*dto.EventResponse, error) {
		if scope == nil || *scope != "tenant-fasilkom" {
			t.Fatalf("scope = %v", scope)
		}
		if allowCompleted {
			t.Fatal("non-superadmin must not edit completed events")
		}
		return nil, repository.ErrEventNotFound
	}}
	router := gin.New()
	router.PUT("/events/:id", func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "admin-fasilkom", TenantID: "tenant-fasilkom"})
		c.Next()
	}, NewEventHandler(service).Update)
	req := httptest.NewRequest(http.MethodPut, "/events/ft-event", strings.NewReader(`{"title":"Hijack"}`))
	req.Header.Set("Content-Type", "application/json")
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)
	if recorder.Code != http.StatusNotFound {
		t.Fatalf("status = %d, body = %s", recorder.Code, recorder.Body.String())
	}
}

func TestPublicListRejectsDraftFilter(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/events", NewEventHandler(&mockHandlerService{}).GetAll)
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/events?status=DRAFT", nil))
	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, body = %s", recorder.Code, recorder.Body.String())
	}
}

func TestEventAndCategoryHandlerHappyPaths(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tenantID := "tenant-fasilkom"
	calls := map[string]bool{}
	fake := &mockHandlerService{
		listCategoriesFn: func(_ context.Context, scope *string) ([]dto.CategoryResponse, error) {
			calls["list-categories"] = scope != nil && *scope == tenantID
			return []dto.CategoryResponse{{ID: "category-1", Name: "Workshop"}}, nil
		},
		createCategoryFn: func(_ context.Context, tenant string, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
			calls["create-category"] = tenant == tenantID && req.Name == "Workshop"
			return &dto.CategoryResponse{ID: "category-1", Name: req.Name}, nil
		},
		updateCategoryFn: func(_ context.Context, id string, scope *string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
			calls["update-category"] = id == "category-1" && scope != nil && *scope == tenantID && req.Name != nil
			return &dto.CategoryResponse{ID: id, Name: *req.Name}, nil
		},
		deleteCategoryFn: func(_ context.Context, id string, scope *string) error {
			calls["delete-category"] = id == "category-1" && scope != nil && *scope == tenantID
			return nil
		},
		listEventsFn: func(_ context.Context, query dto.EventQuery) ([]dto.EventResponse, int64, error) {
			calls["list-events"] = query.TenantID == tenantID && query.Page == 1 && query.Limit == 10
			return []dto.EventResponse{{ID: "event-1", Slug: "event-1"}}, 1, nil
		},
		getEventFn: func(_ context.Context, slug string) (*dto.EventResponse, error) {
			calls["get-event"] = slug == "event-1"
			return &dto.EventResponse{ID: "event-1", Slug: slug}, nil
		},
		updateStatusFn: func(_ context.Context, id string, scope *string, status domain.EventStatus) (*dto.EventResponse, error) {
			calls["status-event"] = id == "event-1" && scope != nil && *scope == tenantID && status == domain.EventStatusPublished
			return &dto.EventResponse{ID: id, Status: string(status)}, nil
		},
		deleteEventFn: func(_ context.Context, id string, scope *string) error {
			calls["delete-event"] = id == "event-1" && scope != nil && *scope == tenantID
			return nil
		},
	}
	events := NewEventHandler(fake)
	categories := NewCategoryHandler(fake)
	auth := func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "admin", TenantID: tenantID, Role: "panitia"})
		c.Next()
	}
	router := gin.New()
	router.GET("/events", events.GetAll)
	router.GET("/events/:slug", events.GetBySlug)
	router.PATCH("/events/:id/status", auth, events.UpdateStatus)
	router.DELETE("/events/:id", auth, events.Delete)
	router.GET("/categories", categories.GetAll)
	router.POST("/categories", auth, categories.Create)
	router.PUT("/categories/:id", auth, categories.Update)
	router.DELETE("/categories/:id", auth, categories.Delete)

	tests := []struct {
		method, path, body string
		want               int
	}{
		{http.MethodGet, "/events?tenant_id=" + tenantID, "", http.StatusOK},
		{http.MethodGet, "/events/event-1", "", http.StatusOK},
		{http.MethodPatch, "/events/event-1/status", `{"status":"PUBLISHED"}`, http.StatusOK},
		{http.MethodDelete, "/events/event-1", "", http.StatusOK},
		{http.MethodGet, "/categories?tenant_id=" + tenantID, "", http.StatusOK},
		{http.MethodPost, "/categories", `{"name":"Workshop"}`, http.StatusCreated},
		{http.MethodPut, "/categories/category-1", `{"name":"Workshop Baru"}`, http.StatusOK},
		{http.MethodDelete, "/categories/category-1", "", http.StatusOK},
	}
	for _, tt := range tests {
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		if tt.body != "" {
			req.Header.Set("Content-Type", "application/json")
		}
		recorder := httptest.NewRecorder()
		router.ServeHTTP(recorder, req)
		if recorder.Code != tt.want {
			t.Fatalf("%s %s status = %d, body = %s", tt.method, tt.path, recorder.Code, recorder.Body.String())
		}
	}
	for _, name := range []string{"list-events", "get-event", "status-event", "delete-event", "list-categories", "create-category", "update-category", "delete-category"} {
		if !calls[name] {
			t.Errorf("%s did not receive expected scope/input", name)
		}
	}
}

func TestWriteEventErrorMappings(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tests := []struct {
		err  error
		want int
	}{
		{repository.ErrEventNotFound, http.StatusNotFound},
		{service.ErrCategorySlugExists, http.StatusConflict},
		{service.ErrInvalidLifecycle, http.StatusConflict},
		{repository.ErrEventStatusChanged, http.StatusConflict},
		{service.ErrCompletedImmutable, http.StatusForbidden},
		{service.ErrInvalidEvent, http.StatusUnprocessableEntity},
		{errors.New("database unavailable"), http.StatusInternalServerError},
	}
	for _, tt := range tests {
		recorder := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(recorder)
		writeEventError(ctx, tt.err, "failed")
		if recorder.Code != tt.want {
			t.Errorf("error %v status = %d, want %d", tt.err, recorder.Code, tt.want)
		}
	}
}

func TestRootUpdateCanTargetHeaderTenantAndCompletedEvent(t *testing.T) {
	gin.SetMode(gin.TestMode)
	fake := &mockHandlerService{updateEventFn: func(_ context.Context, _ string, scope *string, allowCompleted bool, _ dto.UpdateEventRequest) (*dto.EventResponse, error) {
		if scope != nil || !allowCompleted {
			t.Fatalf("scope = %v, allowCompleted = %v", scope, allowCompleted)
		}
		return &dto.EventResponse{ID: "event-1"}, nil
	}}
	router := gin.New()
	router.PUT("/events/:id", func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "root", TenantID: "root-tenant", Role: "root_superadmin", IsSuperAdmin: true})
		c.Next()
	}, NewEventHandler(fake).Update)
	req := httptest.NewRequest(http.MethodPut, "/events/event-1", strings.NewReader(`{"title":"Updated"}`))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Tenant-ID", "tenant-fasilkom")
	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, req)
	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d, body = %s", recorder.Code, recorder.Body.String())
	}
}

func TestHandlerValidationAndAuthenticationErrors(t *testing.T) {
	gin.SetMode(gin.TestMode)
	fake := &mockHandlerService{}
	events := NewEventHandler(fake)
	categories := NewCategoryHandler(fake)
	auth := func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "admin", TenantID: "tenant-a"})
		c.Next()
	}
	router := gin.New()
	router.POST("/events", auth, events.Create)
	router.PUT("/events/:id", auth, events.Update)
	router.PATCH("/events/:id/status", auth, events.UpdateStatus)
	router.POST("/categories", auth, categories.Create)
	router.PUT("/categories/:id", auth, categories.Update)
	router.DELETE("/events/:id", events.Delete)

	for _, target := range []struct{ method, path string }{
		{http.MethodPost, "/events"},
		{http.MethodPut, "/events/event-1"},
		{http.MethodPatch, "/events/event-1/status"},
		{http.MethodPost, "/categories"},
		{http.MethodPut, "/categories/category-1"},
	} {
		req := httptest.NewRequest(target.method, target.path, strings.NewReader(`{"invalid":`))
		req.Header.Set("Content-Type", "application/json")
		recorder := httptest.NewRecorder()
		router.ServeHTTP(recorder, req)
		if recorder.Code != http.StatusBadRequest {
			t.Errorf("%s %s status = %d", target.method, target.path, recorder.Code)
		}
	}

	recorder := httptest.NewRecorder()
	router.ServeHTTP(recorder, httptest.NewRequest(http.MethodDelete, "/events/event-1", nil))
	if recorder.Code != http.StatusUnauthorized {
		t.Fatalf("unauthenticated delete status = %d", recorder.Code)
	}
}

func TestHandlerPropagatesReadAndWriteErrors(t *testing.T) {
	gin.SetMode(gin.TestMode)
	fake := &mockHandlerService{
		listEventsFn: func(context.Context, dto.EventQuery) ([]dto.EventResponse, int64, error) {
			return nil, 0, errors.New("list failed")
		},
		getEventFn: func(context.Context, string) (*dto.EventResponse, error) {
			return nil, repository.ErrEventNotFound
		},
		createCategoryFn: func(context.Context, string, dto.CreateCategoryRequest) (*dto.CategoryResponse, error) {
			return nil, service.ErrCategorySlugExists
		},
		deleteCategoryFn: func(context.Context, string, *string) error { return repository.ErrCategoryNotFound },
	}
	auth := func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "admin", TenantID: "tenant-a"})
		c.Next()
	}
	router := gin.New()
	router.GET("/events", NewEventHandler(fake).GetAll)
	router.GET("/events/:slug", NewEventHandler(fake).GetBySlug)
	router.POST("/categories", auth, NewCategoryHandler(fake).Create)
	router.DELETE("/categories/:id", auth, NewCategoryHandler(fake).Delete)
	for _, tt := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodGet, "/events", "", http.StatusInternalServerError},
		{http.MethodGet, "/events/missing", "", http.StatusNotFound},
		{http.MethodPost, "/categories", `{"name":"Workshop"}`, http.StatusConflict},
		{http.MethodDelete, "/categories/missing", "", http.StatusNotFound},
	} {
		recorder := httptest.NewRecorder()
		router.ServeHTTP(recorder, httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body)))
		if recorder.Code != tt.want {
			t.Errorf("%s %s status = %d, want %d", tt.method, tt.path, recorder.Code, tt.want)
		}
	}
}

func TestActorScopeRejectsMissingTenantAndUsesRootHeader(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tests := []struct {
		name       string
		claims     *jwtpkg.Claims
		header     string
		wantStatus int
	}{
		{"root without tenant", &jwtpkg.Claims{IsSuperAdmin: true}, "", http.StatusBadRequest},
		{"faculty without tenant", &jwtpkg.Claims{}, "", http.StatusForbidden},
		{"root header tenant", &jwtpkg.Claims{IsSuperAdmin: true, TenantID: "root"}, "tenant-a", 0},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			recorder := httptest.NewRecorder()
			ctx, _ := gin.CreateTestContext(recorder)
			ctx.Request = httptest.NewRequest(http.MethodGet, "/", nil)
			ctx.Request.Header.Set("X-Tenant-ID", tt.header)
			middleware.SetUserContext(ctx, tt.claims)
			tenant, scope, _, ok := actorScope(ctx)
			if tt.wantStatus != 0 {
				if ok || recorder.Code != tt.wantStatus {
					t.Fatalf("ok = %v, status = %d", ok, recorder.Code)
				}
				return
			}
			if !ok || tenant != tt.header || scope != nil {
				t.Fatalf("tenant = %q, scope = %v, ok = %v", tenant, scope, ok)
			}
		})
	}
}

func TestRemainingHandlerErrorPaths(t *testing.T) {
	gin.SetMode(gin.TestMode)
	dbErr := errors.New("database unavailable")
	fake := &mockHandlerService{
		listCategoriesFn: func(context.Context, *string) ([]dto.CategoryResponse, error) { return nil, dbErr },
		createEventFn: func(context.Context, string, string, dto.CreateEventRequest) (*dto.EventResponse, error) {
			return nil, dbErr
		},
		updateCategoryFn: func(context.Context, string, *string, dto.UpdateCategoryRequest) (*dto.CategoryResponse, error) {
			return nil, dbErr
		},
		updateStatusFn: func(context.Context, string, *string, domain.EventStatus) (*dto.EventResponse, error) {
			return nil, dbErr
		},
		deleteEventFn: func(context.Context, string, *string) error { return dbErr },
	}
	auth := func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "admin", TenantID: "tenant-a"})
		c.Next()
	}
	events := NewEventHandler(fake)
	categories := NewCategoryHandler(fake)
	router := gin.New()
	router.GET("/categories", categories.GetAll)
	router.POST("/events", auth, events.Create)
	router.PUT("/categories/:id", auth, categories.Update)
	router.PATCH("/events/:id/status", auth, events.UpdateStatus)
	router.DELETE("/events/:id", auth, events.Delete)

	for _, tt := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodGet, "/categories", "", http.StatusInternalServerError},
		{http.MethodPost, "/events", validEventJSON(), http.StatusInternalServerError},
		{http.MethodPut, "/categories/category-1", `{"name":"Updated"}`, http.StatusInternalServerError},
		{http.MethodPatch, "/events/event-1/status", `{"status":"PUBLISHED"}`, http.StatusInternalServerError},
		{http.MethodDelete, "/events/event-1", "", http.StatusInternalServerError},
	} {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, req)
		if recorder.Code != tt.want {
			t.Errorf("%s %s status = %d, want %d", tt.method, tt.path, recorder.Code, tt.want)
		}
	}
}

func TestHandlersRejectMissingAuthenticationAfterValidBinding(t *testing.T) {
	gin.SetMode(gin.TestMode)
	events := NewEventHandler(&mockHandlerService{})
	categories := NewCategoryHandler(&mockHandlerService{})
	router := gin.New()
	router.POST("/events", events.Create)
	router.PUT("/events/:id", events.Update)
	router.PATCH("/events/:id/status", events.UpdateStatus)
	router.POST("/categories", categories.Create)
	router.PUT("/categories/:id", categories.Update)
	router.DELETE("/categories/:id", categories.Delete)

	for _, tt := range []struct {
		method, path, body string
	}{
		{http.MethodPost, "/events", validEventJSON()},
		{http.MethodPut, "/events/event-1", `{"title":"Updated"}`},
		{http.MethodPatch, "/events/event-1/status", `{"status":"PUBLISHED"}`},
		{http.MethodPost, "/categories", `{"name":"Workshop"}`},
		{http.MethodPut, "/categories/category-1", `{"name":"Updated"}`},
		{http.MethodDelete, "/categories/category-1", ""},
	} {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, req)
		if recorder.Code != http.StatusUnauthorized {
			t.Errorf("%s %s status = %d", tt.method, tt.path, recorder.Code)
		}
	}
}

func TestCategoryListUsesTenantHeader(t *testing.T) {
	gin.SetMode(gin.TestMode)
	fake := &mockHandlerService{listCategoriesFn: func(_ context.Context, tenantID *string) ([]dto.CategoryResponse, error) {
		if tenantID == nil || *tenantID != "tenant-a" {
			t.Fatalf("tenantID = %v", tenantID)
		}
		return nil, nil
	}}
	router := gin.New()
	router.GET("/categories", NewCategoryHandler(fake).GetAll)
	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/categories", nil)
	req.Header.Set("X-Tenant-ID", "tenant-a")
	router.ServeHTTP(recorder, req)
	if recorder.Code != http.StatusOK {
		t.Fatalf("status = %d", recorder.Code)
	}
}
