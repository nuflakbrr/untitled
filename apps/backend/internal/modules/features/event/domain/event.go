package domain

import "time"

type EventType string

const (
	EventTypeOnline  EventType = "ONLINE"
	EventTypeOffline EventType = "OFFLINE"
)

type EventStatus string

const (
	EventStatusDraft     EventStatus = "DRAFT"
	EventStatusPublished EventStatus = "PUBLISHED"
	EventStatusClosed    EventStatus = "CLOSED"
	EventStatusCompleted EventStatus = "COMPLETED"
)

type Category struct {
	ID          string
	TenantID    *string
	Name        string
	Slug        string
	Description *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type Speaker struct {
	ID         string
	EventID    string
	Name       string
	Title      *string
	Company    *string
	CompanyURL *string
	GitHub     *string
	Instagram  *string
	LinkedIn   *string
	Avatar     *string
	Order      int
}

type Benefit struct {
	ID          string
	EventID     string
	Title       string
	Description *string
	Icon        *string
	Order       int
}

type Tenant struct {
	ID      string
	Name    string
	Slug    string
	Code    string
	Type    string
	LogoURL *string
	Website *string
}

type Creator struct {
	ID        string
	Name      string
	Email     string
	AvatarURL *string
}

type Event struct {
	ID                   string
	TenantID             string
	Tenant               *Tenant
	CategoryID           *string
	Category             *Category
	Title                string
	Slug                 string
	Description          string
	Banner               *string
	StartDate            time.Time
	EndDate              time.Time
	StartTime            string
	EndTime              string
	Location             string
	MeetingLink          *string
	EventType            EventType
	OnlineAttendance     bool
	RegistrationDeadline time.Time
	Quota                int
	Price                int64
	Status               EventStatus
	CertificateEnabled   bool
	PublishedAt          *time.Time
	CreatedAt            time.Time
	UpdatedAt            time.Time
	DeletedAt            *time.Time
	CreatedByID          *string
	Creator              *Creator
	Speakers             []Speaker
	Benefits             []Benefit
}
