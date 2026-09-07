package handler

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/certificate/dto"
	"venturo-skeleton-go/internal/modules/features/certificate/repository"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type serviceStub struct{ err error }

func (s *serviceStub) UpsertTemplate(context.Context, string, *string, dto.UpsertTemplateRequest) (*dto.TemplateResponse, error) {
	return &dto.TemplateResponse{ID: "template-id"}, s.err
}
func (s *serviceStub) GetTemplate(context.Context, string, *string) (*dto.TemplateResponse, error) {
	return &dto.TemplateResponse{ID: "template-id"}, s.err
}
func (s *serviceStub) Generate(context.Context, string, string, *string, dto.GenerateRequest) (*dto.JobResponse, error) {
	return &dto.JobResponse{ID: "job-id"}, s.err
}
func (s *serviceStub) GetJob(context.Context, string, *string) (*dto.JobResponse, error) {
	return &dto.JobResponse{ID: "job-id"}, s.err
}
func (s *serviceStub) Verify(context.Context, string) (*dto.CertificateResponse, error) {
	return &dto.CertificateResponse{ID: "certificate-id"}, s.err
}
func (s *serviceStub) ListMine(context.Context, string) ([]dto.CertificateResponse, error) {
	return []dto.CertificateResponse{{ID: "certificate-id"}}, s.err
}

func certificateAuth(userID, tenantID string, root bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		middleware.SetUserContext(c, &jwtpkg.Claims{UserID: userID, TenantID: tenantID, IsSuperAdmin: root})
		c.Next()
	}
}

func TestCertificateHandlerHappyPaths(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewCertificateHandler(&serviceStub{})
	router := gin.New()
	authenticated := router.Group("", certificateAuth("user-id", "tenant-id", false))
	authenticated.PUT("/templates/:eventID", handler.UpsertTemplate)
	authenticated.GET("/templates/:eventID", handler.GetTemplate)
	authenticated.POST("/events/:eventID/generate", handler.Generate)
	authenticated.GET("/jobs/:id", handler.GetJob)
	authenticated.GET("/me", handler.ListMine)
	router.GET("/verify/:identifier", handler.Verify)

	validTemplate := `{"number_template":"CERT/{TENANT}/{SLUG}/{REG_NO}","number_mode":"AUTO"}`
	for _, test := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPut, "/templates/event-id", validTemplate, http.StatusOK},
		{http.MethodGet, "/templates/event-id", "", http.StatusOK},
		{http.MethodPost, "/events/event-id/generate", `{}`, http.StatusAccepted},
		{http.MethodGet, "/jobs/job-id", "", http.StatusOK},
		{http.MethodGet, "/me", "", http.StatusOK},
		{http.MethodGet, "/verify/certificate-id", "", http.StatusOK},
	} {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(test.method, test.path, strings.NewReader(test.body))
		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, request)
		if recorder.Code != test.want {
			t.Errorf("%s %s status = %d, want %d; body=%s", test.method, test.path, recorder.Code, test.want, recorder.Body.String())
		}
	}
}

func TestCertificateHandlerValidationAndAuthentication(t *testing.T) {
	gin.SetMode(gin.TestMode)
	handler := NewCertificateHandler(&serviceStub{})
	router := gin.New()
	router.PUT("/templates/:eventID", handler.UpsertTemplate)
	router.GET("/templates/:eventID", handler.GetTemplate)
	router.POST("/events/:eventID/generate", handler.Generate)
	router.GET("/jobs/:id", handler.GetJob)
	router.GET("/me", handler.ListMine)

	for _, test := range []struct {
		method, path, body string
		want               int
	}{
		{http.MethodPut, "/templates/event-id", `{}`, http.StatusUnauthorized},
		{http.MethodGet, "/templates/event-id", "", http.StatusUnauthorized},
		{http.MethodPost, "/events/event-id/generate", `{}`, http.StatusUnauthorized},
		{http.MethodGet, "/jobs/job-id", "", http.StatusUnauthorized},
		{http.MethodGet, "/me", "", http.StatusUnauthorized},
	} {
		recorder := httptest.NewRecorder()
		request := httptest.NewRequest(test.method, test.path, strings.NewReader(test.body))
		request.Header.Set("Content-Type", "application/json")
		router.ServeHTTP(recorder, request)
		if recorder.Code != test.want {
			t.Errorf("%s %s status = %d, want %d", test.method, test.path, recorder.Code, test.want)
		}
	}

	authed := gin.New()
	authed.PUT("/templates/:eventID", certificateAuth("user-id", "tenant-id", false), handler.UpsertTemplate)
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPut, "/templates/event-id", strings.NewReader(`{}`))
	request.Header.Set("Content-Type", "application/json")
	authed.ServeHTTP(recorder, request)
	if recorder.Code != http.StatusBadRequest {
		t.Fatalf("invalid template status = %d", recorder.Code)
	}
}

func TestCertificateErrorMappings(t *testing.T) {
	gin.SetMode(gin.TestMode)
	for _, test := range []struct {
		err  error
		want int
	}{
		{repository.ErrCertificateNotFound, http.StatusNotFound},
		{repository.ErrGenerationJobActive, http.StatusConflict},
		{repository.ErrEventNotEligible, http.StatusUnprocessableEntity},
		{errors.New("database unavailable"), http.StatusInternalServerError},
	} {
		handler := NewCertificateHandler(&serviceStub{err: test.err})
		router := gin.New()
		router.GET("/verify/:identifier", handler.Verify)
		recorder := httptest.NewRecorder()
		router.ServeHTTP(recorder, httptest.NewRequest(http.MethodGet, "/verify/id", nil))
		if recorder.Code != test.want {
			t.Errorf("error %v status = %d, want %d", test.err, recorder.Code, test.want)
		}
	}
}
