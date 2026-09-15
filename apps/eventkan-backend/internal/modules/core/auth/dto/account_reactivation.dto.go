package dto

type RequestAccountReactivationRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ConfirmAccountReactivationRequest struct {
	Token string `json:"token" binding:"required"`
}
