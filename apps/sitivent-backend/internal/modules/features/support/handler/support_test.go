package handler

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/support/dto"
	"venturo-skeleton-go/internal/modules/features/support/repository"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

var errSupportHandler = errors.New("support handler error")

type supportHandlerMock struct {
	createFn func(context.Context, dto.CreateSupportMessageRequest) (*dto.SupportMessageResponse, error)
	listFn   func(context.Context, *string, dto.SupportMessageQuery) ([]dto.SupportMessageResponse, int64, error)
	updateFn func(context.Context, string, *string, dto.UpdateStatusRequest) error
}

func (m *supportHandlerMock) Create(ctx context.Context, req dto.CreateSupportMessageRequest) (*dto.SupportMessageResponse, error) {
	return m.createFn(ctx, req)
}
func (m *supportHandlerMock) List(ctx context.Context, scope *string, query dto.SupportMessageQuery) ([]dto.SupportMessageResponse, int64, error) {
	return m.listFn(ctx, scope, query)
}
func (m *supportHandlerMock) UpdateStatus(ctx context.Context, id string, scope *string, req dto.UpdateStatusRequest) error {
	return m.updateFn(ctx, id, scope, req)
}

func supportRequest(method, pattern, path, body string, claims *jwtpkg.Claims, handler gin.HandlerFunc) *httptest.ResponseRecorder {
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

func requireSupportStatus(t *testing.T, recorder *httptest.ResponseRecorder, want int) {
	t.Helper()
	if recorder.Code != want {
		t.Fatalf("status = %d, want %d, body = %s", recorder.Code, want, recorder.Body.String())
	}
}

func validSupportBody() string {
	return `{"email":"user@example.com","phone":"0812345678","name":"User","title":"Cannot register","category":"registration","chronology":"Registration always fails"}`
}

func TestSupportHandlerCoverage(t *testing.T) {
	claims := &jwtpkg.Claims{UserID: "user-1", TenantID: "tenant-1"}
	root := &jwtpkg.Claims{UserID: "root", IsSuperAdmin: true}
	mock := &supportHandlerMock{
		createFn: func(context.Context, dto.CreateSupportMessageRequest) (*dto.SupportMessageResponse, error) {
			return &dto.SupportMessageResponse{ID: "message-1"}, nil
		},
		listFn: func(context.Context, *string, dto.SupportMessageQuery) ([]dto.SupportMessageResponse, int64, error) {
			return []dto.SupportMessageResponse{{ID: "message-1"}}, 1, nil
		},
		updateFn: func(context.Context, string, *string, dto.UpdateStatusRequest) error { return nil },
	}
	handler := NewSupportHandler(mock)

	requireSupportStatus(t, supportRequest(http.MethodPost, "/messages", "/messages", validSupportBody(), nil, handler.Create), http.StatusCreated)
	requireSupportStatus(t, supportRequest(http.MethodPost, "/messages", "/messages", `{}`, nil, handler.Create), http.StatusBadRequest)
	mock.createFn = func(context.Context, dto.CreateSupportMessageRequest) (*dto.SupportMessageResponse, error) {
		return nil, errSupportHandler
	}
	requireSupportStatus(t, supportRequest(http.MethodPost, "/messages", "/messages", validSupportBody(), nil, handler.Create), http.StatusInternalServerError)

	requireSupportStatus(t, supportRequest(http.MethodGet, "/messages", "/messages", "", claims, handler.List), http.StatusOK)
	requireSupportStatus(t, supportRequest(http.MethodGet, "/messages", "/messages?status=INVALID", "", claims, handler.List), http.StatusBadRequest)
	requireSupportStatus(t, supportRequest(http.MethodGet, "/messages", "/messages", "", nil, handler.List), http.StatusUnauthorized)
	requireSupportStatus(t, supportRequest(http.MethodGet, "/messages", "/messages", "", &jwtpkg.Claims{UserID: "user-1"}, handler.List), http.StatusForbidden)
	requireSupportStatus(t, supportRequest(http.MethodGet, "/messages", "/messages", "", root, handler.List), http.StatusOK)
	mock.listFn = func(context.Context, *string, dto.SupportMessageQuery) ([]dto.SupportMessageResponse, int64, error) {
		return nil, 0, errSupportHandler
	}
	requireSupportStatus(t, supportRequest(http.MethodGet, "/messages", "/messages", "", claims, handler.List), http.StatusInternalServerError)

	mock.updateFn = func(context.Context, string, *string, dto.UpdateStatusRequest) error { return nil }
	requireSupportStatus(t, supportRequest(http.MethodPatch, "/messages/:id", "/messages/message-1", `{"status":"RESOLVED"}`, claims, handler.UpdateStatus), http.StatusOK)
	requireSupportStatus(t, supportRequest(http.MethodPatch, "/messages/:id", "/messages/message-1", `{}`, claims, handler.UpdateStatus), http.StatusBadRequest)
	requireSupportStatus(t, supportRequest(http.MethodPatch, "/messages/:id", "/messages/message-1", `{"status":"RESOLVED"}`, nil, handler.UpdateStatus), http.StatusUnauthorized)
	mock.updateFn = func(context.Context, string, *string, dto.UpdateStatusRequest) error {
		return repository.ErrMessageNotFound
	}
	requireSupportStatus(t, supportRequest(http.MethodPatch, "/messages/:id", "/messages/message-1", `{"status":"RESOLVED"}`, claims, handler.UpdateStatus), http.StatusNotFound)
	mock.updateFn = func(context.Context, string, *string, dto.UpdateStatusRequest) error { return errSupportHandler }
	requireSupportStatus(t, supportRequest(http.MethodPatch, "/messages/:id", "/messages/message-1", `{"status":"RESOLVED"}`, claims, handler.UpdateStatus), http.StatusInternalServerError)
}
