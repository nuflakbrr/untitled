package domain

import "time"

type Status string

const (
	StatusSuccess Status = "SUCCESS"
	StatusFailed  Status = "FAILED"
)

// Attendance mirrors the attendances table, enriched with participant/event
// context (via joins) so scan responses and error messages can identify the
// participant without a second round trip.
type Attendance struct {
	ID                 string
	RegistrationID     string
	RegistrationNumber string
	ParticipantName    string
	ParticipantEmail   string
	EventID            string
	EventTitle         string
	ScanTime           time.Time
	ScannerID          string
	Status             Status
}

type EventStats struct {
	EventID         string
	TotalRegistered int64
	TotalCheckedIn  int64
}
