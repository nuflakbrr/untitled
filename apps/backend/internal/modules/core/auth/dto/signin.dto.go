package dto

// SignInRequest represents signin request payload
type SignInRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// SignInResponse represents signin response
type SignInResponse struct {
	AccessToken  string      `json:"access_token"`
	RefreshToken string      `json:"refresh_token"`
	TokenType    string      `json:"token_type"`
	ExpiresIn    int         `json:"expires_in"`
	User         UserInfo    `json:"user"`
	Tenant       *TenantInfo `json:"tenant,omitempty"`
	Role         string      `json:"role"`
	Permissions  []string    `json:"permissions"`
}

// UserInfo represents basic user info in auth responses
type UserInfo struct {
	ID            string  `json:"id"`
	Email         string  `json:"email"`
	Name          string  `json:"name"`
	TenantID      *string `json:"tenant_id,omitempty"`
	EmailVerified bool    `json:"email_verified"`
	Image         *string `json:"image,omitempty"`
	Role          string  `json:"role"`
	RoleID        string  `json:"role_id"`
}

// TenantInfo represents active tenant info in auth responses
type TenantInfo struct {
	ID      string  `json:"id"`
	Name    string  `json:"name"`
	Slug    string  `json:"slug"`
	Code    string  `json:"code"`
	Type    string  `json:"type"`
	LogoURL *string `json:"logo_url,omitempty"`
}
