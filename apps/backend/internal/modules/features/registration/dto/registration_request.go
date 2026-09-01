package dto

type CreateRegistrationRequest struct {
	EventID          string `json:"event_id" binding:"required,uuid4"`
	OnlineAttendance bool   `json:"online_attendance"`
}

type AttendanceProofRequest struct {
	ProofURL string `json:"proof_url" binding:"required,url,max=2048"`
}

type AttendanceProofReviewRequest struct {
	Status string `json:"status" binding:"required,oneof=APPROVED REJECTED"`
}

type RegistrationQuery struct {
	Status         string `form:"status" binding:"omitempty,oneof=WAITING_PAYMENT REGISTERED CANCELLED CHECKED_IN"`
	IncludeDeleted bool   `form:"include_deleted"`
	Page           int    `form:"page,default=1" binding:"min=1"`
	Limit          int    `form:"limit,default=10" binding:"min=1,max=100"`
}
