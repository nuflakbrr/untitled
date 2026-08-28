package dto

import "time"

type CategoryResponse struct {
	ID          string  `json:"id"`
	TenantID    *string `json:"tenant_id,omitempty"`
	Name        string  `json:"name"`
	Slug        string  `json:"slug"`
	Description *string `json:"description,omitempty"`
}

type SpeakerResponse struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Title      *string `json:"title,omitempty"`
	Company    *string `json:"company,omitempty"`
	CompanyURL *string `json:"company_url,omitempty"`
	GitHub     *string `json:"github,omitempty"`
	Instagram  *string `json:"instagram,omitempty"`
	LinkedIn   *string `json:"linked_in,omitempty"`
	Avatar     *string `json:"avatar,omitempty"`
	Order      int     `json:"order"`
}

type BenefitResponse struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	Description *string `json:"description,omitempty"`
	Icon        *string `json:"icon,omitempty"`
	Order       int     `json:"order"`
}

type EventResponse struct {
	ID                   string            `json:"id"`
	TenantID             string            `json:"tenant_id"`
	CategoryID           *string           `json:"category_id,omitempty"`
	Category             *CategoryResponse `json:"category,omitempty"`
	Title                string            `json:"title"`
	Slug                 string            `json:"slug"`
	Description          string            `json:"description"`
	Banner               *string           `json:"banner,omitempty"`
	StartDate            time.Time         `json:"start_date"`
	EndDate              time.Time         `json:"end_date"`
	StartTime            string            `json:"start_time"`
	EndTime              string            `json:"end_time"`
	Location             string            `json:"location"`
	MeetingLink          *string           `json:"meeting_link,omitempty"`
	EventType            string            `json:"event_type"`
	OnlineAttendance     bool              `json:"online_attendance"`
	RegistrationDeadline time.Time         `json:"registration_deadline"`
	Quota                int               `json:"quota"`
	Price                int64             `json:"price"`
	Status               string            `json:"status"`
	CertificateEnabled   bool              `json:"certificate_enabled"`
	PublishedAt          *time.Time        `json:"published_at,omitempty"`
	CreatedAt            time.Time         `json:"created_at"`
	UpdatedAt            time.Time         `json:"updated_at"`
	CreatedByID          *string           `json:"created_by_id,omitempty"`
	Speakers             []SpeakerResponse `json:"speakers"`
	Benefits             []BenefitResponse `json:"benefits"`
}
