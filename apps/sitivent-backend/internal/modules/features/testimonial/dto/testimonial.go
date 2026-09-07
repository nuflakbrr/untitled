package dto

type CreateTestimonialRequest struct {
	Rating  int    `json:"rating" binding:"required,min=1,max=5"`
	Comment string `json:"comment" binding:"required,min=3,max=2000"`
}

type TestimonialResponse struct {
	ID             string `json:"id"`
	RegistrationID string `json:"registration_id"`
	EventID        string `json:"event_id"`
	Rating         int    `json:"rating"`
	Comment        string `json:"comment"`
}
