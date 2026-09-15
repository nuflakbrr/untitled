package domain

import "time"

type Status string

const (
	StatusWaitingPayment Status = "WAITING_PAYMENT"
	StatusRegistered     Status = "REGISTERED"
	StatusCancelled      Status = "CANCELLED"
	StatusCheckedIn      Status = "CHECKED_IN"
)

type Registration struct {
	ID                 string
	EventID            string
	EventTitle         string
	EventSlug          string
	EventBanner        *string
	EventStartDate     time.Time
	EventLocation      string
	EventType          string
	EventStatus        string
	AttendanceStatus   string
	CertificateStatus  string
	TenantID           string
	TenantCode         string
	UserID             string
	UserName           string
	UserEmail          string
	RegistrationNumber string
	QRToken            string
	OnlineAttendance   bool
	Status             Status
	Price              int64
	CreatedAt          time.Time
	UpdatedAt          time.Time
	DeletedAt          *time.Time
}
