package domain

import "time"

// User represents a user entity in SITIVENT
type User struct {
	ID            string     `json:"id" db:"id"`
	TenantID      *string    `json:"tenant_id,omitempty" db:"tenant_id"`
	Email         string     `json:"email" db:"email"`
	Name          string     `json:"name" db:"name"`
	EmailVerified bool       `json:"email_verified" db:"email_verified"`
	Image         *string    `json:"image,omitempty" db:"image"`
	Role          string     `json:"role" db:"role"`
	Banned        bool       `json:"banned" db:"banned"`
	BanReason     *string    `json:"ban_reason,omitempty" db:"ban_reason"`
	BanExpires    *time.Time `json:"ban_expires,omitempty" db:"ban_expires"`
	RoleID        string     `json:"role_id" db:"role_id"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt     time.Time  `json:"updated_at" db:"updated_at"`

	// Relational data
	PasswordHash string   `json:"-" db:"password"`
	Roles        []string `json:"roles" db:"-"`
	TenantName   *string  `json:"tenant_name,omitempty" db:"tenant_name"`
	TenantSlug   *string  `json:"tenant_slug,omitempty" db:"tenant_slug"`
	TenantCode   *string  `json:"tenant_code,omitempty" db:"tenant_code"`
	TenantType   *string  `json:"tenant_type,omitempty" db:"tenant_type"`
}

// IsBanned checks if user is currently banned
func (u *User) IsBanned() bool {
	if !u.Banned {
		return false
	}
	if u.BanExpires == nil {
		return true // permanent ban
	}
	return time.Now().Before(*u.BanExpires)
}

// CanLogin checks if user is allowed to authenticate
func (u *User) CanLogin() bool {
	return !u.IsBanned()
}
