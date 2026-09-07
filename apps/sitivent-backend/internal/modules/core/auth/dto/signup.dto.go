package dto

// SignUpRequest represents universal participant registration request
type SignUpRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required,min=2,max=255"`
	Password string `json:"password" binding:"required,min=8"`
}

// SignUpResponse represents universal signup response
type SignUpResponse struct {
	Message string   `json:"message"`
	User    UserInfo `json:"user"`
}
