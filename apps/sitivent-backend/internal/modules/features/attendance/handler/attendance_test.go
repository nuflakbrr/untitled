package handler

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/attendance/dto"
	"venturo-skeleton-go/internal/modules/features/attendance/repository"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type mockService struct {
	scanFn  func(ctx context.Context, scannerID string, scope *string, req dto.ScanRequest) (*dto.ScanResponse, error)
	statsFn func(ctx context.Context, eventID string, scope *string) (*dto.AttendanceStatsResponse, error)
}

func (m *mockService) Scan(ctx context.Context, scannerID string, scope *string, req dto.ScanRequest) (*dto.ScanResponse, error) {
	return m.scanFn(ctx, scannerID, scope, req)
}

func (m *mockService) StatsByEvent(ctx context.Context, eventID string, scope *string) (*dto.AttendanceStatsResponse, error) {
	return m.statsFn(ctx, eventID, scope)
}

func authAs(userID, tenantID string, superadmin bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: userID, TenantID: tenantID, IsSuperAdmin: superadmin})
		c.Next()
	}
}

func TestAttendanceHandlerHappyPaths(t *testing.T) {
	gin.SetMode(gin.TestMode)
	calls := map[string]bool{}
	fake := &mockService{
		scanFn: func(_ context.Context, scannerID string, scope *string, req dto.ScanRequest) (*dto.ScanResponse, error) {
			calls["scan"] = scannerID == "scanner-1" && scope != nil && *scope == "tenant-a" && req.QRToken == "tok-1"
			return &dto.ScanResponse{RegistrationID: "reg-1", Status: "SUCCESS"}, nil
		},
		statsFn: func(_ context.Context, eventID string, scope *string) (*dto.AttendanceStatsResponse, error) {
			calls["stats"] = eventID == "event-1" && scope != nil && *scope == "tenant-a"
			return &dto.AttendanceStatsResponse{EventID: eventID, TotalRegistered: 10, TotalCheckedIn: 3}, nil
		},
	}
	handler := NewAttendanceHandler(fake)
	router := gin.New()
	router.POST("/attendances/scan", authAs("scanner-1", "tenant-a", false), handler.Scan)
	router.GET("/attendances/event/:eventID/stats", authAs("scanner-1", "tenant-a", false), handler.StatsByEvent)

	for _, tt := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPost, "/attendances/scan", `{"qr_token":"tok-1","event_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`, http.StatusOK},
		{http.MethodGet, "/attendances/event/event-1/stats", "", http.StatusOK},
	} {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, req)
		if recorder.Code != tt.want {
			t.Errorf("%s %s status = %d, body = %s", tt.method, tt.path, recorder.Code, recorder.Body.String())
		}
	}
	for _, name := range []string{"scan", "stats"} {
		if !calls[name] {
			t.Errorf("%s did not receive expected input", name)
		}
	}
}

func TestAttendanceHandlerRootSuperadminIsUnscoped(t *testing.T) {
	gin.SetMode(gin.TestMode)
	var seenScope *string
	seen := false
	fake := &mockService{scanFn: func(_ context.Context, _ string, scope *string, _ dto.ScanRequest) (*dto.ScanResponse, error) {
		seenScope, seen = scope, true
		return &dto.ScanResponse{}, nil
	}}
	handler := NewAttendanceHandler(fake)
	router := gin.New()
	router.POST("/attendances/scan", authAs("root-1", "", true), handler.Scan)

	recorder := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodPost, "/attendances/scan", strings.NewReader(`{"qr_token":"tok-1","event_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`))
	req.Header.Set("Content-Type", "application/json")
	router.ServeHTTP(recorder, req)

	if !seen || seenScope != nil {
		t.Fatalf("root superadmin scan must pass a nil (unscoped) tenant, got %v", seenScope)
	}
}

func TestAttendanceHandlerValidationAndAuthentication(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewAttendanceHandler(&mockService{})
	router := gin.New()
	router.POST("/attendances/scan", handler.Scan)
	router.GET("/attendances/event/:eventID/stats", handler.StatsByEvent)

	for _, tt := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPost, "/attendances/scan", `{}`, http.StatusBadRequest},
		{http.MethodPost, "/attendances/scan", `{"qr_token":"tok-1","event_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`, http.StatusUnauthorized},
		{http.MethodGet, "/attendances/event/event-1/stats", "", http.StatusUnauthorized},
	} {
		recorder := httptest.NewRecorder()
		req := httptest.NewRequest(tt.method, tt.path, strings.NewReader(tt.body))
		req.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, req)
		if recorder.Code != tt.want {
			t.Errorf("%s %s status = %d, want %d, body = %s", tt.method, tt.path, recorder.Code, tt.want, recorder.Body.String())
		}
	}
}

func TestAttendanceErrorMappings(t *testing.T) {
	gin.SetMode(gin.TestMode)
	tests := []struct {
		name string
		err  error
		want int
	}{
		{"token not found", repository.ErrTokenNotFound, http.StatusNotFound},
		{"event mismatch", repository.ErrEventMismatch, http.StatusNotFound},
		{"not eligible", repository.ErrNotEligible, http.StatusBadRequest},
		{"already checked in", repository.ErrAlreadyCheckedIn, http.StatusConflict},
		{"unknown", context.DeadlineExceeded, http.StatusInternalServerError},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			fake := &mockService{scanFn: func(context.Context, string, *string, dto.ScanRequest) (*dto.ScanResponse, error) {
				return &dto.ScanResponse{RegistrationID: "reg-1"}, tt.err
			}}
			handler := NewAttendanceHandler(fake)
			router := gin.New()
			router.POST("/attendances/scan", authAs("scanner-1", "tenant-a", false), handler.Scan)
			recorder := httptest.NewRecorder()
			req := httptest.NewRequest(http.MethodPost, "/attendances/scan", strings.NewReader(`{"qr_token":"tok-1","event_id":"2093030b-adb4-4803-9af2-13a6c1ad8b1a"}`))
			req.Header.Set("Content-Type", "application/json")
			router.ServeHTTP(recorder, req)
			if recorder.Code != tt.want {
				t.Errorf("status = %d, want %d, body = %s", recorder.Code, tt.want, recorder.Body.String())
			}
		})
	}
}
