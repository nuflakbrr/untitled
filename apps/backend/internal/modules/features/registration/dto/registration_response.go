package dto

import "time"

type RegistrationResponse struct {
	ID                 string     `json:"id"`
	EventID            string     `json:"event_id"`
	EventTitle         string     `json:"event_title"`
	EventSlug          string     `json:"event_slug"`
	EventBanner        *string    `json:"event_banner,omitempty"`
	EventStartDate     time.Time  `json:"event_start_date"`
	EventLocation      string     `json:"event_location"`
	EventType          string     `json:"event_type"`
	EventStatus        string     `json:"event_status"`
	AttendanceStatus   string     `json:"attendance_status"`
	CertificateStatus  string     `json:"certificate_status"`
	TenantID           string     `json:"tenant_id"`
	TenantCode         string     `json:"tenant_code"`
	UserID             string     `json:"user_id"`
	UserName           string     `json:"user_name"`
	UserEmail          string     `json:"user_email"`
	RegistrationNumber string     `json:"registration_number"`
	QRToken            string     `json:"qr_token"`
	OnlineAttendance   bool       `json:"online_attendance"`
	Status             string     `json:"status"`
	Price              int64      `json:"price"`
	CreatedAt          time.Time  `json:"created_at"`
	UpdatedAt          time.Time  `json:"updated_at"`
	DeletedAt          *time.Time `json:"deleted_at,omitempty"`
}
