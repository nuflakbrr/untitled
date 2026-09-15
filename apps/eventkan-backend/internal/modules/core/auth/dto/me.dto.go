package dto

// MeResponse represents response returned by GET /core/v1/auth/me
type MeResponse struct {
	User         UserInfo    `json:"user"`
	Tenant       *TenantInfo `json:"tenant,omitempty"`
	Role         string      `json:"role"`
	Permissions  []string    `json:"permissions"`
	IsSuperAdmin bool        `json:"is_super_admin"`
}
