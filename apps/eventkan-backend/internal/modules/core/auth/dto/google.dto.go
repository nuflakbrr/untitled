package dto

// GoogleSignInRequest is the body for POST /core/v1/auth/google.
type GoogleSignInRequest struct {
	IDToken string `json:"id_token" binding:"required"`
}

// GoogleSignInResponse represents response for Google OAuth signin
type GoogleSignInResponse struct {
	AccessToken  string      `json:"access_token"`
	RefreshToken string      `json:"refresh_token"`
	TokenType    string      `json:"token_type"`
	ExpiresIn    int         `json:"expires_in"`
	IsNewUser    bool        `json:"is_new_user"`
	User         UserInfo    `json:"user"`
	Tenant       *TenantInfo `json:"tenant,omitempty"`
	Role         string      `json:"role"`
	Permissions  []string    `json:"permissions"`
}
