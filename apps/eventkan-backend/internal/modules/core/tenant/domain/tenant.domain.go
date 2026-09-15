package domain

import (
	"time"
)

// TenantType defines the level of the tenant hierarchy
type TenantType string

const (
	TenantTypeRoot       TenantType = "ROOT"       // Rektorat / Universitas
	TenantTypeFaculty    TenantType = "FACULTY"    // Fakultas
	TenantTypeDepartment TenantType = "DEPARTMENT" // Jurusan / Program Studi
	TenantTypeUnit       TenantType = "UNIT"       // UPT / Lembaga
)

// Tenant represents an organizational unit (Rektorat, Fakultas, dll.)
type Tenant struct {
	ID          string     `json:"id" db:"id"`
	Name        string     `json:"name" db:"name"`
	Slug        string     `json:"slug" db:"slug"`
	Code        string     `json:"code" db:"code"`
	Type        TenantType `json:"type" db:"type"`
	ParentID    *string    `json:"parent_id,omitempty" db:"parent_id"`
	LogoURL     *string    `json:"logo_url,omitempty" db:"logo_url"`
	Website     *string    `json:"website,omitempty" db:"website"`
	Description *string    `json:"description,omitempty" db:"description"`
	Settings    string     `json:"settings,omitempty" db:"settings"` // JSONB string
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
	DeletedAt   *time.Time `json:"deleted_at,omitempty" db:"deleted_at"`

	// Relational data
	Parent *Tenant `json:"parent,omitempty" db:"-"`
}

// TenantPaymentGateway represents iPaymu / Bank configuration for a tenant
type TenantPaymentGateway struct {
	ID                string    `json:"id" db:"id"`
	TenantID          string    `json:"tenant_id" db:"tenant_id"`
	Provider          string    `json:"provider" db:"provider"` // IPAYMU, MANUAL
	IsActive          bool      `json:"is_active" db:"is_active"`
	APIKey            *string   `json:"api_key,omitempty" db:"api_key"`
	VirtualAccount    *string   `json:"virtual_account,omitempty" db:"virtual_account"`
	Env               string    `json:"env" db:"env"` // sandbox, production
	BankName          *string   `json:"bank_name,omitempty" db:"bank_name"`
	BankAccountNumber *string   `json:"bank_account_number,omitempty" db:"bank_account_number"`
	BankAccountHolder *string   `json:"bank_account_holder,omitempty" db:"bank_account_holder"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`
}

