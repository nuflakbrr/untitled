package dto

// CreateTenantRequest represents the payload to create a new tenant
type CreateTenantRequest struct {
	Name        string  `json:"name" binding:"required,min=2,max=255"`
	Slug        string  `json:"slug" binding:"required,min=2,max=100"`
	Code        string  `json:"code" binding:"required,min=2,max=50"`
	Type        string  `json:"type" binding:"required,oneof=ROOT FACULTY DEPARTMENT UNIT"`
	ParentID    *string `json:"parent_id" binding:"omitempty,uuid"`
	LogoURL     *string `json:"logo_url" binding:"omitempty,url"`
	Website     *string `json:"website" binding:"omitempty,url"`
	Description *string `json:"description" binding:"omitempty"`
}

// UpdateTenantRequest represents the payload to update an existing tenant
type UpdateTenantRequest struct {
	Name        *string `json:"name" binding:"omitempty,min=2,max=255"`
	Slug        *string `json:"slug" binding:"omitempty,min=2,max=100"`
	Code        *string `json:"code" binding:"omitempty,min=2,max=50"`
	Type        *string `json:"type" binding:"omitempty,oneof=ROOT FACULTY DEPARTMENT UNIT"`
	ParentID    *string `json:"parent_id" binding:"omitempty,uuid"`
	LogoURL     *string `json:"logo_url" binding:"omitempty,url"`
	Website     *string `json:"website" binding:"omitempty,url"`
	Description *string `json:"description" binding:"omitempty"`
}

// TenantResponse represents tenant data in API responses
type TenantResponse struct {
	ID          string          `json:"id"`
	Name        string          `json:"name"`
	Slug        string          `json:"slug"`
	Code        string          `json:"code"`
	Type        string          `json:"type"`
	ParentID    *string         `json:"parent_id,omitempty"`
	Parent      *TenantResponse `json:"parent,omitempty"`
	LogoURL     *string         `json:"logo_url,omitempty"`
	Website     *string         `json:"website,omitempty"`
	Description *string         `json:"description,omitempty"`
	CreatedAt   string          `json:"created_at"`
	UpdatedAt   string          `json:"updated_at"`
}

// TenantQueryFilter represents query params for listing tenants
type TenantQueryFilter struct {
	Search   string `form:"search"`
	Type     string `form:"type"`
	ParentID string `form:"parent_id"`
	Page     int    `form:"page,default=1"`
	Limit    int    `form:"limit,default=20"`
}

// UpdatePaymentGatewayRequest represents payload to configure iPaymu / Bank settings
type UpdatePaymentGatewayRequest struct {
	Provider          string  `json:"provider" binding:"required,oneof=IPAYMU MANUAL"`
	IsActive          bool    `json:"is_active"`
	APIKey            *string `json:"api_key" binding:"omitempty"`
	VirtualAccount    *string `json:"virtual_account" binding:"omitempty"`
	Env               string  `json:"env" binding:"required,oneof=sandbox production"`
	BankName          *string `json:"bank_name" binding:"omitempty"`
	BankAccountNumber *string `json:"bank_account_number" binding:"omitempty"`
	BankAccountHolder *string `json:"bank_account_holder" binding:"omitempty"`
}

// TenantPaymentGatewayResponse represents gateway configuration response
type TenantPaymentGatewayResponse struct {
	ID                string  `json:"id"`
	TenantID          string  `json:"tenant_id"`
	Provider          string  `json:"provider"`
	IsActive          bool    `json:"is_active"`
	VirtualAccount    *string `json:"virtual_account,omitempty"`
	Env               string  `json:"env"`
	BankName          *string `json:"bank_name,omitempty"`
	BankAccountNumber *string `json:"bank_account_number,omitempty"`
	BankAccountHolder *string `json:"bank_account_holder,omitempty"`
	HasAPIKey         bool    `json:"has_api_key"`
}

