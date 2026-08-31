package dto

import "time"

// CreateUserRequest represents request to create a new user
type CreateUserRequest struct {
	Email     string   `json:"email" binding:"required,email"`
	Name      string   `json:"name" binding:"required,min=2,max=255"`
	Password  string   `json:"password" binding:"required,min=8"`
	TenantID  *string  `json:"tenant_id" binding:"omitempty,uuid"`
	TenantIDs []string `json:"tenant_ids" binding:"omitempty,dive,uuid"`
	Role      string   `json:"role" binding:"required,min=2,max=100"`
	RoleID    *string  `json:"role_id" binding:"omitempty,uuid"`
}

// UpdateUserRequest represents request to update a user
type UpdateUserRequest struct {
	Name      *string  `json:"name" binding:"omitempty,min=2,max=255"`
	Image     *string  `json:"image" binding:"omitempty,url"`
	TenantID  *string  `json:"tenant_id" binding:"omitempty,uuid"`
	TenantIDs []string `json:"tenant_ids" binding:"omitempty,dive,uuid"`
	Role      *string  `json:"role" binding:"omitempty,min=2,max=100"`
	RoleID    *string  `json:"role_id" binding:"omitempty,uuid"`
}

// BanUserRequest represents request to ban or suspend a user
type BanUserRequest struct {
	Reason    string     `json:"reason" binding:"required,min=3"`
	ExpiresAt *time.Time `json:"expires_at" binding:"omitempty"`
}

// UpdateMeRequest represents request to update current user profile
type UpdateMeRequest struct {
	Name  *string `json:"name" binding:"omitempty,min=2,max=255"`
	Image *string `json:"image" binding:"omitempty,url"`
}

// ChangePasswordRequest represents request to change password
type ChangePasswordRequest struct {
	CurrentPassword string `json:"current_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=8"`
}

// UserResponse represents user data in responses
type UserResponse struct {
	ID            string     `json:"id"`
	TenantID      *string    `json:"tenant_id,omitempty"`
	TenantIDs     []string   `json:"tenant_ids,omitempty"`
	TenantName    *string    `json:"tenant_name,omitempty"`
	TenantCode    *string    `json:"tenant_code,omitempty"`
	Email         string     `json:"email"`
	Name          string     `json:"name"`
	EmailVerified bool       `json:"email_verified"`
	Image         *string    `json:"image,omitempty"`
	Role          string     `json:"role"`
	RoleID        string     `json:"role_id"`
	Banned        bool       `json:"banned"`
	BanReason     *string    `json:"ban_reason,omitempty"`
	BanExpires    *time.Time `json:"ban_expires,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at"`
}

// UserQueryParams represents query parameters for listing users
type UserQueryParams struct {
	Page     int     `form:"page,default=1" binding:"min=1"`
	Limit    int     `form:"limit,default=10" binding:"min=1,max=100"`
	Search   string  `form:"search" binding:"omitempty,max=255"`
	Role     string  `form:"role" binding:"omitempty"`
	TenantID *string `form:"tenant_id" binding:"omitempty,uuid"`
	Banned   *bool   `form:"banned"`

	// Populated from caller's JWT context by handler
	ScopeTenantID *string `form:"-" json:"-"`
}
