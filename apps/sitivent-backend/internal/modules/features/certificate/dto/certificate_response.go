package dto

import "time"

type SignatureResponse struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Title        string `json:"title"`
	SignatureURL string `json:"signature_url"`
	Order        int    `json:"order"`
}

type TemplateResponse struct {
	ID                 string              `json:"id"`
	TenantID           string              `json:"tenant_id"`
	EventID            string              `json:"event_id"`
	BackgroundURL      string              `json:"background_url,omitempty"`
	NumberTemplate     string              `json:"number_template"`
	NumberMode         string              `json:"number_mode"`
	ShowIssuedDate     bool                `json:"show_issued_date"`
	ShowEventDate      bool                `json:"show_event_date"`
	ShowEventLocation  bool                `json:"show_event_location"`
	ShowHeader         bool                `json:"show_header"`
	HeaderText         string              `json:"header_text"`
	HeaderSubtitle     string              `json:"header_subtitle"`
	HeaderFont         string              `json:"header_font,omitempty"`
	HeaderColor        string              `json:"header_color,omitempty"`
	TitleFont          string              `json:"title_font,omitempty"`
	TitleColor         string              `json:"title_color,omitempty"`
	ContentFont        string              `json:"content_font,omitempty"`
	ContentColor       string              `json:"content_color,omitempty"`
	PrimaryColor       string              `json:"primary_color,omitempty"`
	FooterMarginBottom int                 `json:"footer_margin_bottom"`
	Signatures         []SignatureResponse `json:"signatures"`
	CreatedAt          time.Time           `json:"created_at"`
	UpdatedAt          time.Time           `json:"updated_at"`
}

type CertificateResponse struct {
	ID                string              `json:"id"`
	RegistrationID    string              `json:"registration_id,omitempty"`
	EventID           string              `json:"event_id"`
	CertificateNumber string              `json:"certificate_number"`
	ParticipantName   string              `json:"participant_name"`
	ParticipantEmail  string              `json:"participant_email,omitempty"`
	EventTitle        string              `json:"event_title"`
	IssuerFaculty     string              `json:"issuer_faculty"`
	EventDate         time.Time           `json:"event_date"`
	PDFURL            string              `json:"pdf_url"`
	DownloadURL       string              `json:"download_url"`
	Signatures        []SignatureResponse `json:"signatures"`
	IssuedAt          time.Time           `json:"issued_at"`
}

type JobResponse struct {
	ID         string     `json:"id"`
	EventID    string     `json:"event_id"`
	Status     string     `json:"status"`
	Total      int        `json:"total"`
	Processed  int        `json:"processed"`
	Failed     int        `json:"failed"`
	LastError  string     `json:"last_error,omitempty"`
	StartedAt  *time.Time `json:"started_at,omitempty"`
	FinishedAt *time.Time `json:"finished_at,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
	UpdatedAt  time.Time  `json:"updated_at"`
}
