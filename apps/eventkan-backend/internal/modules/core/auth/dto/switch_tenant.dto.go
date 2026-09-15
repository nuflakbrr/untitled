package dto

// SwitchTenantRequest represents payload to switch active tenant context
type SwitchTenantRequest struct {
	TenantID string `json:"tenant_id" binding:"required,uuid"`
}

// SwitchTenantResponse represents response after switching active tenant context
type SwitchTenantResponse struct {
	AccessToken string      `json:"access_token"`
	TokenType   string      `json:"token_type"`
	ExpiresIn   int         `json:"expires_in"`
	Tenant      TenantInfo  `json:"tenant"`
	Permissions []string    `json:"permissions"`
}

