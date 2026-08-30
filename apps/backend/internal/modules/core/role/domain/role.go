package domain

import "time"

// Role represents a role entity in SITIVENT
type Role struct {
	ID          string  `json:"id" db:"id"`
	Name        string  `json:"name" db:"name"`
	Description *string `json:"description,omitempty" db:"description"`
	// TenantID is nil for a shared/global template role (root_superadmin,
	// superadmin, panitia, scanner, peserta); set to a specific tenant's ID
	// for a custom role created by/for that tenant only.
	TenantID  *string   `json:"tenant_id,omitempty" db:"tenant_id"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

// Permission represents a permission entity in SITIVENT
type Permission struct {
	ID          string    `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description *string   `json:"description,omitempty" db:"description"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
