package handler

import (
	"context"
	"errors"
	"net/http"
	"strings"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/certificate/dto"
	"venturo-skeleton-go/internal/modules/features/certificate/repository"
	"venturo-skeleton-go/internal/modules/features/certificate/service"
	"venturo-skeleton-go/internal/shared/response"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type Service interface {
	UpsertTemplate(context.Context, string, *string, dto.UpsertTemplateRequest) (*dto.TemplateResponse, error)
	GetTemplate(context.Context, string, *string) (*dto.TemplateResponse, error)
	Generate(context.Context, string, string, *string, dto.GenerateRequest) (*dto.JobResponse, error)
	GetJob(context.Context, string, *string) (*dto.JobResponse, error)
	Verify(context.Context, string) (*dto.CertificateResponse, error)
	ListMine(context.Context, string) ([]dto.CertificateResponse, error)
}

type CertificateHandler struct{ service Service }

func NewCertificateHandler(service Service) *CertificateHandler {
	return &CertificateHandler{service: service}
}

func (h *CertificateHandler) UpsertTemplate(c *gin.Context) {
	claims, ok := certificateClaims(c)
	if !ok {
		return
	}
	var req dto.UpsertTemplateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	result, err := h.service.UpsertTemplate(c.Request.Context(), c.Param("eventID"), organizerScope(claims), req)
	if err != nil {
		writeCertificateError(c, err, "Failed to save certificate template")
		return
	}
	response.Success(c, http.StatusOK, "Certificate template saved successfully", result)
}

func (h *CertificateHandler) GetTemplate(c *gin.Context) {
	claims, ok := certificateClaims(c)
	if !ok {
		return
	}
	result, err := h.service.GetTemplate(c.Request.Context(), c.Param("eventID"), organizerScope(claims))
	if err != nil {
		writeCertificateError(c, err, "Failed to retrieve certificate template")
		return
	}
	response.Success(c, http.StatusOK, "Certificate template retrieved successfully", result)
}

func (h *CertificateHandler) Generate(c *gin.Context) {
	claims, ok := certificateClaims(c)
	if !ok {
		return
	}
	var req dto.GenerateRequest
	if c.Request.ContentLength > 0 {
		if err := c.ShouldBindJSON(&req); err != nil {
			response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
			return
		}
	}
	result, err := h.service.Generate(c.Request.Context(), c.Param("eventID"), claims.UserID, organizerScope(claims), req)
	if err != nil {
		writeCertificateError(c, err, "Failed to queue certificate generation")
		return
	}
	response.Success(c, http.StatusAccepted, "Certificate generation queued successfully", result)
}

func (h *CertificateHandler) GetJob(c *gin.Context) {
	claims, ok := certificateClaims(c)
	if !ok {
		return
	}
	result, err := h.service.GetJob(c.Request.Context(), c.Param("id"), organizerScope(claims))
	if err != nil {
		writeCertificateError(c, err, "Failed to retrieve certificate generation job")
		return
	}
	response.Success(c, http.StatusOK, "Certificate generation job retrieved successfully", result)
}

func (h *CertificateHandler) Verify(c *gin.Context) {
	result, err := h.service.Verify(c.Request.Context(), strings.TrimPrefix(c.Param("identifier"), "/"))
	if err != nil {
		writeCertificateError(c, err, "Failed to verify certificate")
		return
	}
	response.Success(c, http.StatusOK, "Certificate is valid", result)
}

func (h *CertificateHandler) ListMine(c *gin.Context) {
	claims, ok := certificateClaims(c)
	if !ok {
		return
	}
	result, err := h.service.ListMine(c.Request.Context(), claims.UserID)
	if err != nil {
		writeCertificateError(c, err, "Failed to retrieve certificates")
		return
	}
	response.Success(c, http.StatusOK, "Certificates retrieved successfully", result)
}

func certificateClaims(c *gin.Context) (*jwtpkg.Claims, bool) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil || claims.UserID == "" {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return nil, false
	}
	return claims, true
}

func organizerScope(claims *jwtpkg.Claims) *string {
	if claims.IsSuperAdmin {
		return nil
	}
	tenantID := claims.TenantID
	return &tenantID
}

func writeCertificateError(c *gin.Context, err error, fallback string) {
	switch {
	case errors.Is(err, repository.ErrTemplateNotFound),
		errors.Is(err, repository.ErrCertificateNotFound),
		errors.Is(err, repository.ErrGenerationJobNotFound):
		response.Error(c, http.StatusNotFound, "Certificate resource not found", "")
	case errors.Is(err, repository.ErrGenerationJobActive), errors.Is(err, repository.ErrCertificateExists):
		response.Error(c, http.StatusConflict, err.Error(), "")
	case errors.Is(err, repository.ErrEventNotEligible), errors.Is(err, repository.ErrNoEligibleParticipants),
		errors.Is(err, service.ErrInvalidRequest):
		response.Error(c, http.StatusUnprocessableEntity, err.Error(), "")
	default:
		response.Error(c, http.StatusInternalServerError, fallback, err.Error())
	}
}
