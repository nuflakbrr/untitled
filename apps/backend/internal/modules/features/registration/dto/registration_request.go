package dto

type CreateRegistrationRequest struct {
	EventID          string `json:"event_id" binding:"required,uuid4"`
	OnlineAttendance bool   `json:"online_attendance"`
}

type RegistrationQuery struct {
	Status string `form:"status" binding:"omitempty,oneof=WAITING_PAYMENT REGISTERED CANCELLED CHECKED_IN"`
	Page   int    `form:"page,default=1" binding:"min=1"`
	Limit  int    `form:"limit,default=10" binding:"min=1,max=100"`
}
