package handler

import (
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/user/dto"
	"venturo-skeleton-go/internal/modules/core/user/repository"
	"venturo-skeleton-go/internal/modules/core/user/service"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

// GetAll handles GET /core/v1/users
func (h *UserHandler) GetAll(c *gin.Context) {
	var params dto.UserQueryParams
	if err := c.ShouldBindQuery(&params); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}

	claims, _ := middleware.GetUserFromContext(c)
	// Non-root superadmin can only see users inside their own tenant
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		params.ScopeTenantID = &claims.TenantID
	}

	users, total, err := h.service.GetAll(c.Request.Context(), params)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve users", err.Error())
		return
	}

	response.SuccessWithPagination(c, http.StatusOK, "Users retrieved successfully", users, params.Page, params.Limit, total)
}

// GetByID handles GET /core/v1/users/:id
func (h *UserHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	user, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			response.Error(c, http.StatusNotFound, "User not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve user", err.Error())
		return
	}

	// Tenant boundary check for non-root admins
	claims, _ := middleware.GetUserFromContext(c)
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		if user.TenantID == nil || *user.TenantID != claims.TenantID {
			response.Error(c, http.StatusForbidden, "You do not have access to users outside your tenant", "")
			return
		}
	}

	response.Success(c, http.StatusOK, "User retrieved successfully", user)
}

// Create handles POST /core/v1/users
func (h *UserHandler) Create(c *gin.Context) {
	var req dto.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	claims, _ := middleware.GetUserFromContext(c)
	// If tenant admin creates a user, lock the tenant_id to their tenant
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		req.TenantID = &claims.TenantID
	}

	user, err := h.service.Create(c.Request.Context(), req)
	if err != nil {
		if errors.Is(err, repository.ErrEmailAlreadyTaken) {
			response.Error(c, http.StatusConflict, "Email already taken", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to create user", err.Error())
		return
	}

	response.Success(c, http.StatusCreated, "User created successfully", user)
}

// Update handles PUT /core/v1/users/:id
func (h *UserHandler) Update(c *gin.Context) {
	id := c.Param("id")
	var req dto.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	user, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			response.Error(c, http.StatusNotFound, "User not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to update user", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "User updated successfully", user)
}

// Delete handles DELETE /core/v1/users/:id
func (h *UserHandler) Delete(c *gin.Context) {
	if err := h.service.Delete(c.Request.Context(), c.Param("id")); err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			response.Error(c, http.StatusNotFound, "User not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to delete user", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "User deleted successfully", nil)
}

// UpdateMe handles PUT /core/v1/users/me
func (h *UserHandler) UpdateMe(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	var req dto.UpdateMeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	user, err := h.service.UpdateMe(c.Request.Context(), claims.UserID, req)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to update profile", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "Profile updated successfully", user)
}

// DeleteMe handles DELETE /core/v1/users/me.
func (h *UserHandler) DeleteMe(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	if err := h.service.Delete(c.Request.Context(), claims.UserID); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to delete account", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Account deleted successfully", nil)
}

// ChangePassword handles POST /core/v1/users/change-password
func (h *UserHandler) ChangePassword(c *gin.Context) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
		return
	}

	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	if err := h.service.ChangePassword(c.Request.Context(), claims.UserID, req); err != nil {
		if errors.Is(err, service.ErrInvalidCurrentPassword) {
			response.Error(c, http.StatusBadRequest, "Current password is incorrect", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to change password", err.Error())
		return
	}
	if err := middleware.RevokeToken(c.Request.Context(), claims); err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to revoke session", "")
		return
	}

	response.Success(c, http.StatusOK, "Password changed successfully", nil)
}

// BanUser handles POST /core/v1/users/:id/ban
func (h *UserHandler) BanUser(c *gin.Context) {
	claims, _ := middleware.GetUserFromContext(c)
	targetID := c.Param("id")

	var req dto.BanUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}

	actorID := ""
	if claims != nil {
		actorID = claims.UserID
	}

	if err := h.service.BanUser(c.Request.Context(), actorID, targetID, req); err != nil {
		if errors.Is(err, service.ErrCannotBanSelf) {
			response.Error(c, http.StatusBadRequest, "Cannot ban your own account", "")
			return
		}
		if errors.Is(err, repository.ErrUserNotFound) {
			response.Error(c, http.StatusNotFound, "User not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to ban user", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "User has been banned", nil)
}

// UnbanUser handles POST /core/v1/users/:id/unban
func (h *UserHandler) UnbanUser(c *gin.Context) {
	targetID := c.Param("id")
	if err := h.service.UnbanUser(c.Request.Context(), targetID); err != nil {
		if errors.Is(err, repository.ErrUserNotFound) {
			response.Error(c, http.StatusNotFound, "User not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to unban user", err.Error())
		return
	}

	response.Success(c, http.StatusOK, "User has been unbanned", nil)
}
