package dto

type CreateSupportMessageRequest struct {
	TenantID   string `json:"tenant_id" binding:"omitempty,uuid4"`
	Email      string `json:"email" binding:"required,email"`
	Phone      string `json:"phone" binding:"required,min=6,max=50"`
	Name       string `json:"name" binding:"required,min=2,max=255"`
	Title      string `json:"title" binding:"required,min=3,max=255"`
	Category   string `json:"category" binding:"required,min=2,max=100"`
	Chronology string `json:"chronology" binding:"required,min=10"`
}

type UpdateStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=PENDING IN_PROGRESS RESOLVED REJECTED"`
}

type SupportMessageQuery struct {
	Status string `form:"status" binding:"omitempty,oneof=PENDING IN_PROGRESS RESOLVED REJECTED"`
	Page   int    `form:"page,default=1" binding:"min=1"`
	Limit  int    `form:"limit,default=10" binding:"min=1,max=100"`
}
