package handler

import (
	"errors"
	"net/http"

	"eventkan-backend/internal/middleware"
	"eventkan-backend/internal/modules/core/auth/dto"
	authRepo "eventkan-backend/internal/modules/core/auth/repository"
	"eventkan-backend/internal/modules/core/auth/service"
	userRepo "eventkan-backend/internal/modules/core/user/repository"
	"eventkan-backend/internal/shared/response"
	"eventkan-backend/pkg/jwt"
	"eventkan-backend/pkg/logger"

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
		logger.Warn("Failed to revoke token during logout", logger.Err(err))
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

func (h *AuthHandler) RequestPasswordReset(c *gin.Context) {
	var req dto.RequestPasswordResetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Email tidak valid", err.Error())
		return
	}

	if err := h.service.RequestPasswordReset(c.Request.Context(), req.Email); err != nil {
		logger.Error("Password reset request failed", logger.Err(err))
	}

	response.Success(c, http.StatusOK, "Jika email terdaftar, tautan reset akan dikirim", nil)
}

func (h *AuthHandler) ConfirmPasswordReset(c *gin.Context) {
	var req dto.ConfirmPasswordResetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Data reset password tidak valid", err.Error())
		return
	}

	if err := h.service.ResetPassword(c.Request.Context(), req.Token, req.NewPassword); err != nil {
		if errors.Is(err, service.ErrPasswordResetUnavailable) {
			response.Error(c, http.StatusInternalServerError, "Reset password tidak tersedia", "")
			return
		}
		if errors.Is(err, authRepo.ErrPasswordResetTokenInvalid) {
			response.Error(c, http.StatusBadRequest, "Token reset password tidak valid atau telah kedaluwarsa", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal mereset password", "")
		return
	}

	response.Success(c, http.StatusOK, "Password berhasil diperbarui", nil)
}

func (h *AuthHandler) RequestAccountReactivation(c *gin.Context) {
	var req dto.RequestAccountReactivationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Email tidak valid", err.Error())
		return
	}

	if err := h.service.RequestAccountReactivation(c.Request.Context(), req.Email); err != nil {
		if !errors.Is(err, service.ErrAccountReactivationUnavailable) {
			logger.Error("Account reactivation request failed", logger.Err(err))
		}
	}

	response.Success(c, http.StatusOK, "Jika akun dapat diaktifkan kembali, tautan akan dikirim ke email tersebut", nil)
}

func (h *AuthHandler) ConfirmAccountReactivation(c *gin.Context) {
	var req dto.ConfirmAccountReactivationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Token aktivasi tidak valid", err.Error())
		return
	}

	if err := h.service.ReactivateAccount(c.Request.Context(), req.Token); err != nil {
		if errors.Is(err, service.ErrAccountReactivationUnavailable) {
			response.Error(c, http.StatusInternalServerError, "Aktivasi akun tidak tersedia", "")
			return
		}
		if errors.Is(err, authRepo.ErrAccountReactivationTokenInvalid) {
			response.Error(c, http.StatusBadRequest, "Tautan aktivasi tidak valid atau telah kedaluwarsa", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Gagal mengaktifkan akun", "")
		return
	}

	response.Success(c, http.StatusOK, "Akun berhasil diaktifkan kembali", nil)
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
