package dto

import "time"

type EventQuery struct {
	CategorySlug   string `form:"category_slug"`
	TenantID       string `form:"tenant_id"`
	Status         string `form:"status" binding:"omitempty,oneof=DRAFT PUBLISHED CLOSED COMPLETED"`
	EventType      string `form:"event_type" binding:"omitempty,oneof=ONLINE OFFLINE"`
	Search         string `form:"search"`
	IncludeDeleted bool   `form:"include_deleted"`
	Page           int    `form:"page,default=1" binding:"min=1"`
	Limit          int    `form:"limit,default=10" binding:"min=1,max=100"`
}

type CreateCategoryRequest struct {
	Name        string  `json:"name" binding:"required,max=150"`
	Description *string `json:"description"`
}

type UpdateCategoryRequest struct {
	Name        *string `json:"name" binding:"omitempty,min=1,max=150"`
	Description *string `json:"description"`
}

type SpeakerRequest struct {
	Name       string  `json:"name" binding:"required,max=255"`
	Title      *string `json:"title"`
	Company    *string `json:"company"`
	CompanyURL *string `json:"company_url"`
	GitHub     *string `json:"github"`
	Instagram  *string `json:"instagram"`
	LinkedIn   *string `json:"linked_in"`
	Avatar     *string `json:"avatar"`
	Order      int     `json:"order" binding:"min=0"`
}

type BenefitRequest struct {
	Title       string  `json:"title" binding:"required,max=255"`
	Description *string `json:"description"`
	Icon        *string `json:"icon"`
	Order       int     `json:"order" binding:"min=0"`
}

type CreateEventRequest struct {
	Title                string           `json:"title" binding:"required,max=255"`
	CategoryID           *string          `json:"category_id"`
	Description          string           `json:"description" binding:"required"`
	Banner               *string          `json:"banner"`
	StartDate            time.Time        `json:"start_date" binding:"required"`
	EndDate              time.Time        `json:"end_date" binding:"required"`
	StartTime            string           `json:"start_time" binding:"required"`
	EndTime              string           `json:"end_time" binding:"required"`
	Location             string           `json:"location" binding:"required"`
	MeetingLink          *string          `json:"meeting_link"`
	EventType            string           `json:"event_type" binding:"required,oneof=ONLINE OFFLINE"`
	OnlineAttendance     bool             `json:"online_attendance"`
	RegistrationDeadline time.Time        `json:"registration_deadline" binding:"required"`
	Quota                int              `json:"quota" binding:"required,min=1"`
	Price                int64            `json:"price" binding:"min=0"`
	CertificateEnabled   bool             `json:"certificate_enabled"`
	Speakers             []SpeakerRequest `json:"speakers" binding:"omitempty,dive"`
	Benefits             []BenefitRequest `json:"benefits" binding:"omitempty,dive"`
}

type UpdateEventRequest struct {
	Title                *string           `json:"title" binding:"omitempty,min=1,max=255"`
	CategoryID           *string           `json:"category_id"`
	Description          *string           `json:"description" binding:"omitempty,min=1"`
	Banner               *string           `json:"banner"`
	StartDate            *time.Time        `json:"start_date"`
	EndDate              *time.Time        `json:"end_date"`
	StartTime            *string           `json:"start_time"`
	EndTime              *string           `json:"end_time"`
	Location             *string           `json:"location" binding:"omitempty,min=1"`
	MeetingLink          *string           `json:"meeting_link"`
	EventType            *string           `json:"event_type" binding:"omitempty,oneof=ONLINE OFFLINE"`
	OnlineAttendance     *bool             `json:"online_attendance"`
	RegistrationDeadline *time.Time        `json:"registration_deadline"`
	Quota                *int              `json:"quota" binding:"omitempty,min=1"`
	Price                *int64            `json:"price" binding:"omitempty,min=0"`
	CertificateEnabled   *bool             `json:"certificate_enabled"`
	Speakers             *[]SpeakerRequest `json:"speakers" binding:"omitempty,dive"`
	Benefits             *[]BenefitRequest `json:"benefits" binding:"omitempty,dive"`
}

type UpdateEventStatusRequest struct {
	Status string `json:"status" binding:"required,oneof=PUBLISHED CLOSED COMPLETED"`
}
