package dto

type SignatureRequest struct {
	Name         string `json:"name" binding:"required,max=255"`
	Title        string `json:"title" binding:"omitempty,max=255"`
	SignatureURL string `json:"signature_url" binding:"required,url"`
	Order        int    `json:"order" binding:"min=0,max=10"`
}

type UpsertTemplateRequest struct {
	BackgroundURL      string             `json:"background_url" binding:"omitempty,url"`
	NumberTemplate     string             `json:"number_template" binding:"required,max=100"`
	NumberMode         string             `json:"number_mode" binding:"required,oneof=AUTO MANUAL"`
	ShowIssuedDate     bool               `json:"show_issued_date"`
	ShowEventDate      bool               `json:"show_event_date"`
	ShowEventLocation  bool               `json:"show_event_location"`
	ShowHeader         bool               `json:"show_header"`
	HeaderText         string             `json:"header_text" binding:"omitempty,max=255"`
	HeaderSubtitle     string             `json:"header_subtitle" binding:"omitempty,max=255"`
	HeaderFont         string             `json:"header_font" binding:"omitempty,max=100"`
	HeaderColor        string             `json:"header_color" binding:"omitempty,hexcolor"`
	TitleFont          string             `json:"title_font" binding:"omitempty,max=100"`
	TitleColor         string             `json:"title_color" binding:"omitempty,hexcolor"`
	ContentFont        string             `json:"content_font" binding:"omitempty,max=100"`
	ContentColor       string             `json:"content_color" binding:"omitempty,hexcolor"`
	PrimaryColor       string             `json:"primary_color" binding:"omitempty,hexcolor"`
	FooterMarginBottom int                `json:"footer_margin_bottom" binding:"min=0,max=200"`
	Signatures         []SignatureRequest `json:"signatures" binding:"max=4,dive"`
}

type GenerateRequest struct {
	ManualNumbers map[string]string `json:"manual_numbers"`
}
