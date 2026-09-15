package dto

import "time"

type ScanResponse struct {
	RegistrationID     string    `json:"registration_id"`
	RegistrationNumber string    `json:"registration_number"`
	ParticipantName    string    `json:"participant_name"`
	ParticipantEmail   string    `json:"participant_email"`
	EventID            string    `json:"event_id"`
	EventTitle         string    `json:"event_title"`
	ScanTime           time.Time `json:"scan_time"`
	Status             string    `json:"status"`
}

type AttendanceStatsResponse struct {
	EventID         string `json:"event_id"`
	TotalRegistered int64  `json:"total_registered"`
	TotalCheckedIn  int64  `json:"total_checked_in"`
}
