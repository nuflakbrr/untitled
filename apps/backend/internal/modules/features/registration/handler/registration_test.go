package handler

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/registration/dto"
	"venturo-skeleton-go/internal/modules/features/registration/repository"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type mockHandlerService struct {
	registerFn      func(context.Context, string, dto.CreateRegistrationRequest) (*dto.RegistrationResponse, error)
	listMineFn      func(context.Context, string, dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error)
	listByEventFn   func(context.Context, string, *string, dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error)
	cancelMineFn    func(context.Context, string, string) error
	exportByEventFn func(context.Context, string, *string) ([]byte, error)
}

func (m *mockHandlerService) Register(ctx context.Context, userID string, req dto.CreateRegistrationRequest) (*dto.RegistrationResponse, error) {
	if m.registerFn == nil {
		return nil, nil
	}
	return m.registerFn(ctx, userID, req)
}

func (m *mockHandlerService) ListMine(ctx context.Context, userID string, query dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
	if m.listMineFn == nil {
		return nil, 0, nil
	}
	return m.listMineFn(ctx, userID, query)
}

func (m *mockHandlerService) ListByEvent(ctx context.Context, eventID string, scope *string, query dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
	if m.listByEventFn == nil {
		return nil, 0, nil
	}
	return m.listByEventFn(ctx, eventID, scope, query)
}

func (m *mockHandlerService) CancelMine(ctx context.Context, id, userID string) error {
	if m.cancelMineFn == nil {
		return nil
	}
	return m.cancelMineFn(ctx, id, userID)
}

func (m *mockHandlerService) ExportByEvent(ctx context.Context, eventID string, scope *string) ([]byte, error) {
	if m.exportByEventFn == nil {
		return nil, nil
	}
	return m.exportByEventFn(ctx, eventID, scope)
}

func TestRegistrationHandlerHappyPaths(t *testing.T) {
	gin.SetMode(gin.TestMode)
	const eventID = "2093030b-adb4-4803-9af2-13a6c1ad8b1a"
	calls := map[string]bool{}
	fake := &mockHandlerService{
		registerFn: func(_ context.Context, userID string, req dto.CreateRegistrationRequest) (*dto.RegistrationResponse, error) {
			calls["register"] = userID == "user-1" && req.EventID == eventID
			return &dto.RegistrationResponse{ID: "registration-1", EventID: req.EventID}, nil
		},
		listMineFn: func(_ context.Context, userID string, query dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
			calls["mine"] = userID == "user-1" && query.Page == 1 && query.Limit == 10
			return []dto.RegistrationResponse{{ID: "registration-1"}}, 1, nil
		},
		listByEventFn: func(_ context.Context, gotEventID string, scope *string, _ dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
			calls["event"] = gotEventID == eventID && scope != nil && *scope == "tenant-a"
			return []dto.RegistrationResponse{{ID: "registration-1"}}, 1, nil
		},
		cancelMineFn: func(_ context.Context, id, userID string) error {
			calls["cancel"] = id == "registration-1" && userID == "user-1"
			return nil
		},
		exportByEventFn: func(_ context.Context, gotEventID string, scope *string) ([]byte, error) {
			calls["export"] = gotEventID == eventID && scope != nil && *scope == "tenant-a"
			return []byte("xlsx"), nil
		},
	}
	handler := NewRegistrationHandler(fake)
	auth := func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "user-1", TenantID: "tenant-a"})
		c.Next()
	}
	router := gin.New()
	router.POST("/registrations", auth, handler.Register)
	router.GET("/registrations/me", auth, handler.ListMine)
	router.DELETE("/registrations/:id", auth, handler.CancelMine)
	router.GET("/registrations/event/:eventID", auth, handler.ListByEvent)
	router.GET("/registrations/event/:eventID/export", auth, handler.ExportByEvent)
	tests := []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPost, "/registrations", `{"event_id":"` + eventID + `"}`, http.StatusCreated},
		{http.MethodGet, "/registrations/me", "", http.StatusOK},
		{http.MethodDelete, "/registrations/registration-1", "", http.StatusOK},
		{http.MethodGet, "/registrations/event/" + eventID, "", http.StatusOK},
		{http.MethodGet, "/registrations/event/" + eventID + "/export", "", http.StatusOK},
	}
	for _, tt := range tests {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, req)
		if recorder.Code != tt.want {
			t.Errorf("%s %s status = %d, body = %s", tt.method, tt.path, recorder.Code, recorder.Body.String())
		}
	}
	for _, name := range []string{"register", "mine", "cancel", "event", "export"} {
		if !calls[name] {
			t.Errorf("%s did not receive expected input", name)
		}
	}
}

func TestHandlerValidationAndAuthentication(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewRegistrationHandler(&mockHandlerService{})
	router := gin.New()
	router.POST("/registrations", handler.Register)
	router.GET("/registrations/me", handler.ListMine)
	router.DELETE("/registrations/:id", handler.CancelMine)
	router.GET("/registrations/event/:eventID", handler.ListByEvent)
	router.GET("/registrations/event/:eventID/export", handler.ExportByEvent)
	for _, tt := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPost, "/registrations", `{}`, http.StatusBadRequest},
		{http.MethodPost, "/registrations", `{"event_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`, http.StatusUnauthorized},
		{http.MethodGet, "/registrations/me", "", http.StatusUnauthorized},
		{http.MethodDelete, "/registrations/id", "", http.StatusUnauthorized},
		{http.MethodGet, "/registrations/event/id", "", http.StatusUnauthorized},
		{http.MethodGet, "/registrations/event/id/export", "", http.StatusUnauthorized},
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

func TestHandlerRejectsInvalidQueries(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewRegistrationHandler(&mockHandlerService{})
	auth := func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "user", TenantID: "tenant"})
		c.Next()
	}
	router := gin.New()
	router.GET("/registrations/me", auth, handler.ListMine)
	router.GET("/registrations/event/:eventID", auth, handler.ListByEvent)
	for _, path := range []string{
		"/registrations/me?status=INVALID",
		"/registrations/event/event-1?limit=101",
	} {
		recorder := httptest.NewRecorder()
		router.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, path, nil))
		if recorder.Code != http.StatusBadRequest {
			t.Errorf("GET %s status = %d", path, recorder.Code)
		}
	}
}

func TestOrganizerScope(t *testing.T) {
	gin.SetMode(gin.TestMode)
	t.Run("participant forbidden", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(recorder)
		middleware.SetUserContext(ctx, &jwtpkg.Claims{UserID: "participant"})
		if scope, ok := organizerScope(ctx); ok || scope != nil || recorder.Code != http.StatusForbidden {
			t.Fatalf("scope = %v, ok = %v, status = %d", scope, ok, recorder.Code)
		}
	})
	t.Run("root unscoped", func(t *testing.T) {
		recorder := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(recorder)
		middleware.SetUserContext(ctx, &jwtpkg.Claims{UserID: "root", IsSuperAdmin: true})
		if scope, ok := organizerScope(ctx); !ok || scope != nil {
			t.Fatalf("scope = %v, ok = %v", scope, ok)
		}
	})
}

func TestRegistrationErrorMappings(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tests := []struct {
		err  error
		want int
	}{
		{repository.ErrRegistrationNotFound, http.StatusNotFound},
		{repository.ErrEventNotAvailable, http.StatusNotFound},
		{repository.ErrDuplicateRegistration, http.StatusConflict},
		{repository.ErrQuotaFull, http.StatusConflict},
		{repository.ErrRegistrationClosed, http.StatusUnprocessableEntity},
		{repository.ErrOnlineUnavailable, http.StatusUnprocessableEntity},
		{errors.New("database unavailable"), http.StatusInternalServerError},
	}
	for _, tt := range tests {
		recorder := httptest.NewRecorder()
		ctx, _ := gin.CreateTestContext(recorder)
		writeRegistrationError(ctx, tt.err, "failed")
		if recorder.Code != tt.want {
			t.Errorf("error %v status = %d, want %d", tt.err, recorder.Code, tt.want)
		}
	}
}

func TestHandlerServiceErrors(t *testing.T) {
	gin.SetMode(gin.TestMode)
	dbErr := errors.New("database unavailable")
	fake := &mockHandlerService{
		registerFn: func(context.Context, string, dto.CreateRegistrationRequest) (*dto.RegistrationResponse, error) {
			return nil, dbErr
		},
		listMineFn: func(context.Context, string, dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
			return nil, 0, dbErr
		},
		listByEventFn: func(context.Context, string, *string, dto.RegistrationQuery) ([]dto.RegistrationResponse, int64, error) {
			return nil, 0, dbErr
		},
		cancelMineFn:    func(context.Context, string, string) error { return dbErr },
		exportByEventFn: func(context.Context, string, *string) ([]byte, error) { return nil, dbErr },
	}
	handler := NewRegistrationHandler(fake)
	auth := func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: "user", TenantID: "tenant"})
		c.Next()
	}
	router := gin.New()
	router.POST("/registrations", auth, handler.Register)
	router.GET("/registrations/me", auth, handler.ListMine)
	router.DELETE("/registrations/:id", auth, handler.CancelMine)
	router.GET("/registrations/event/:eventID", auth, handler.ListByEvent)
	router.GET("/registrations/event/:eventID/export", auth, handler.ExportByEvent)
	for _, tt := range []struct {
		method, path, body string
	}{
		{http.MethodPost, "/registrations", `{"event_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`},
		{http.MethodGet, "/registrations/me", ""},
		{http.MethodDelete, "/registrations/id", ""},
		{http.MethodGet, "/registrations/event/id", ""},
		{http.MethodGet, "/registrations/event/id/export", ""},
	} {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, req)
		if recorder.Code != http.StatusInternalServerError {
			t.Errorf("%s %s status = %d", tt.method, tt.path, recorder.Code)
		}
	}
}
