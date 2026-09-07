package handler

import (
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/auth/dto"
	"venturo-skeleton-go/internal/modules/core/auth/service"
	userRepo "venturo-skeleton-go/internal/modules/core/user/repository"
	"venturo-skeleton-go/internal/shared/response"
	"venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *service.AuthService
}

func NewAuthHandler(service *service.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) Logout(c *gin.Context) {
	claims, _ := middleware.GetUserFromContext(c)
	if err := middleware.RevokeToken(c.Request.Context(), claims); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to revoke session", "")
		return
	}
	response.Success(c, http.StatusOK, "Logged out successfully", nil)
}

// SignIn handles POST /core/v1/auth/signin
func (h *AuthHandler) SignIn(c *gin.Context) {
	var req dto.SignInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	resp, err := h.service.SignIn(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCredentials) {
			response.Error(c, http.StatusUnauthorized, "Invalid email or password", "")
			return
		}
		if errors.Is(err, service.ErrUserBanned) {
			response.Error(c, http.StatusForbidden, "Your account has been suspended", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Authentication failed", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Login successful", resp)
}

// SignUp handles POST /core/v1/auth/signup
func (h *AuthHandler) SignUp(c *gin.Context) {
	var req dto.SignUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	resp, err := h.service.SignUp(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, userRepo.ErrEmailAlreadyTaken) {
			response.Error(c, http.StatusConflict, "Email already registered", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Registration failed", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "Registration successful", resp)
}

// GetMe handles GET /core/v1/auth/me
func (h *AuthHandler) GetMe(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	resp, err := h.service.GetMe(c.Request.Context(), claims.UserID, claims.TenantID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to load user profile", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "User profile retrieved successfully", resp)
}

// SwitchTenant handles POST /core/v1/auth/switch-tenant
func (h *AuthHandler) SwitchTenant(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	var req dto.SwitchTenantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	resp, err := h.service.SwitchTenant(c.Request.Context(), claims.UserID, req.TenantID)
	if err != nil {
		if errors.Is(err, service.ErrUnauthorizedSwitch) {
			response.Error(c, http.StatusForbidden, "Unauthorized to switch to this tenant", "")
			return
		}
		if errors.Is(err, service.ErrTenantNotFound) {
			response.Error(c, http.StatusNotFound, "Tenant not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to switch tenant", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Tenant context switched successfully", resp)
}

// MyTenants handles GET /core/v1/auth/my-tenants
func (h *AuthHandler) MyTenants(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	tenants, err := h.service.MyTenants(c.Request.Context(), claims.UserID, claims.Role)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to load tenants", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Tenants retrieved successfully", tenants)
}

// Refresh handles POST /core/v1/auth/refresh
func (h *AuthHandler) Refresh(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		response.Error(c, http.StatusBadRequest, "Authorization token required", "")
		return
	}

	tokenStr := authHeader
	if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
		tokenStr = authHeader[7:]
	}

	newToken, err := jwt.RefreshToken(tokenStr)
	if err != nil {
		response.Error(c, http.StatusUnauthorized, "Invalid or expired token", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Token refreshed successfully", gin.H{
		"access_token": newToken,
		"token_type":   "Bearer",
		"expires_in":   86400,
	})
}
