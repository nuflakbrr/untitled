package dto

import "time"

type CreateRoleRequest struct {
	Name        string  `json:"name" binding:"required,min=2,max=100"`
	Description *string `json:"description"`
}
type UpdateRoleRequest struct {
	Name        *string `json:"name" binding:"omitempty,min=2,max=100"`
	Description *string `json:"description"`
}
type SetRolePermissionsRequest struct {
	PermissionIDs []string `json:"permission_ids"`
}
type CreatePermissionRequest struct {
	Name        string `json:"name" binding:"required,min=2,max=150"`
	Description string `json:"description" binding:"max=500"`
}
type UpdatePermissionRequest struct {
	Name        *string `json:"name" binding:"omitempty,min=2,max=150"`
	Description *string `json:"description" binding:"omitempty,max=500"`
}

// RoleResponse represents role data in response
type RoleResponse struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	TenantID    *string   `json:"tenant_id,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// PermissionResponse represents a permission item
type PermissionResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}
