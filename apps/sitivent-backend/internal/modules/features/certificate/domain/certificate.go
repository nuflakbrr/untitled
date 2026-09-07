package domain

import "time"

const (
	NumberModeAuto   = "AUTO"
	NumberModeManual = "MANUAL"

	JobPending   = "PENDING"
	JobRunning   = "RUNNING"
	JobCompleted = "COMPLETED"
	JobPartial   = "PARTIAL"
	JobFailed    = "FAILED"
)

type Template struct {
	ID                 string
	TenantID           string
	EventID            string
	BackgroundURL      string
	NumberTemplate     string
	NumberMode         string
	ShowIssuedDate     bool
	ShowEventDate      bool
	ShowEventLocation  bool
	ShowHeader         bool
	HeaderText         string
	HeaderSubtitle     string
	HeaderFont         string
	HeaderColor        string
	TitleFont          string
	TitleColor         string
	ContentFont        string
	ContentColor       string
	PrimaryColor       string
	FooterMarginBottom int
	Signatures         []Signature
	CreatedAt          time.Time
	UpdatedAt          time.Time
}

type Signature struct {
	ID           string `json:"id"`
	TemplateID   string `json:"template_id"`
	Name         string `json:"name"`
	Title        string `json:"title"`
	SignatureURL string `json:"signature_url"`
	Order        int    `json:"order"`
}

type Certificate struct {
	ID                string
	RegistrationID    string
	EventID           string
	UserID            string
	CertificateNumber string
	PDFURL            string
	DownloadURL       string
	ParticipantName   string
	ParticipantEmail  string
	EventTitle        string
	TenantName        string
	EventDate         time.Time
	EventLocation     string
	Signatures        []Signature
	CreatedAt         time.Time
	UpdatedAt         time.Time
}

type IssueData struct {
	RegistrationID     string
	RegistrationNumber string
	UserID             string
	ParticipantName    string
	ParticipantEmail   string
	RegistrationStatus string
	EventID            string
	EventTitle         string
	EventSlug          string
	EventStatus        string
	EventDate          time.Time
	EventLocation      string
	CertificateEnabled bool
	TenantID           string
	TenantCode         string
	TenantName         string
	Template           *Template
}

type GenerationJob struct {
	ID            string
	EventID       string
	TenantID      string
	CreatedByID   string
	Status        string
	Total         int
	Processed     int
	Failed        int
	ManualNumbers map[string]string
	LastError     string
	StartedAt     *time.Time
	FinishedAt    *time.Time
	CreatedAt     time.Time
	UpdatedAt     time.Time
}
