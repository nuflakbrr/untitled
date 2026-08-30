package handler

import (
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/core/role/dto"
	"venturo-skeleton-go/internal/modules/core/role/repository"
	"venturo-skeleton-go/internal/modules/core/role/service"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type RoleHandler struct {
	service *service.RoleService
}

func (h *RoleHandler) Create(c *gin.Context) {
	var req dto.CreateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Validation error", err.Error())
		return
	}

	claims, _ := middleware.GetUserFromContext(c)
	var tenantID *string
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		tenantID = &claims.TenantID
	}

	role, err := h.service.Create(c, req, tenantID)
	if err != nil {
		response.Error(c, 409, "Failed to create role", "")
		return
	}
	response.Success(c, 201, "Role created successfully", role)
}

// checkRoleBoundary blocks a non-root caller from touching a global template
// role or another tenant's custom role. Writes a 403 and returns false if blocked.
func (h *RoleHandler) checkRoleBoundary(c *gin.Context, id string) bool {
	claims, _ := middleware.GetUserFromContext(c)
	if claims == nil || claims.IsSuperAdmin || claims.TenantID == "" {
		return true
	}
	role, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		return true // let the caller's own not-found handling report it
	}
	if role.TenantID == nil || *role.TenantID != claims.TenantID {
		response.Error(c, http.StatusForbidden, "You do not have access to this role", "")
		return false
	}
	return true
}

func (h *RoleHandler) Update(c *gin.Context) {
	if !h.checkRoleBoundary(c, c.Param("id")) {
		return
	}
	var req dto.UpdateRoleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Validation error", err.Error())
		return
	}
	if err := h.service.Update(c, c.Param("id"), req); err != nil {
		response.Error(c, 500, "Failed to update role", "")
		return
	}
	response.Success(c, 200, "Role updated successfully", nil)
}
func (h *RoleHandler) Delete(c *gin.Context) {
	if !h.checkRoleBoundary(c, c.Param("id")) {
		return
	}
	if err := h.service.Delete(c, c.Param("id")); err != nil {
		response.Error(c, 500, "Failed to delete role", "")
		return
	}
	response.Success(c, 200, "Role deleted successfully", nil)
}
func (h *RoleHandler) Permissions(c *gin.Context) {
	permissions, err := h.service.Permissions(c)
	if err != nil {
		response.Error(c, 500, "Failed to retrieve permissions", "")
		return
	}
	response.Success(c, 200, "Permissions retrieved successfully", permissions)
}
func (h *RoleHandler) CreatePermission(c *gin.Context) {
	var req dto.CreatePermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Validation error", err.Error())
		return
	}
	p, err := h.service.CreatePermission(c, req)
	if err != nil {
		response.Error(c, 409, "Failed to create permission", "")
		return
	}
	response.Success(c, 201, "Permission created successfully", p)
}
func (h *RoleHandler) UpdatePermission(c *gin.Context) {
	var req dto.UpdatePermissionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Validation error", err.Error())
		return
	}
	if err := h.service.UpdatePermission(c, c.Param("id"), req); err != nil {
		response.Error(c, 500, "Failed to update permission", "")
		return
	}
	response.Success(c, 200, "Permission updated successfully", nil)
}
func (h *RoleHandler) DeletePermission(c *gin.Context) {
	if err := h.service.DeletePermission(c, c.Param("id")); err != nil {
		response.Error(c, 500, "Failed to delete permission", "")
		return
	}
	response.Success(c, 200, "Permission deleted successfully", nil)
}
func (h *RoleHandler) SetPermissions(c *gin.Context) {
	if !h.checkRoleBoundary(c, c.Param("id")) {
		return
	}
	var req dto.SetRolePermissionsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, 400, "Validation error", err.Error())
		return
	}
	if err := h.service.SetPermissions(c, c.Param("id"), req.PermissionIDs); err != nil {
		response.Error(c, 500, "Failed to update role permissions", "")
		return
	}
	response.Success(c, 200, "Role permissions updated successfully", nil)
}
func (h *RoleHandler) PermissionIDs(c *gin.Context) {
	if !h.checkRoleBoundary(c, c.Param("id")) {
		return
	}
	ids, err := h.service.PermissionIDs(c, c.Param("id"))
	if err != nil {
		response.Error(c, 500, "Failed to retrieve role permissions", "")
		return
	}
	response.Success(c, 200, "Role permissions retrieved successfully", ids)
}

func NewRoleHandler(service *service.RoleService) *RoleHandler {
	return &RoleHandler{service: service}
}

// GetAll handles GET /core/v1/roles
func (h *RoleHandler) GetAll(c *gin.Context) {
	claims, _ := middleware.GetUserFromContext(c)
	var scopeTenantID *string
	if claims != nil && !claims.IsSuperAdmin && claims.TenantID != "" {
		scopeTenantID = &claims.TenantID
	}

	roles, err := h.service.GetAll(c.Request.Context(), scopeTenantID)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve roles", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Roles retrieved successfully", roles)
}

// GetByID handles GET /core/v1/roles/:id
func (h *RoleHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	if !h.checkRoleBoundary(c, id) {
		return
	}
	role, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrRoleNotFound) {
			response.Error(c, http.StatusNotFound, "Role not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve role", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Role retrieved successfully", role)
}
