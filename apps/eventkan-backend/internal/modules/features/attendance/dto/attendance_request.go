package dto

type ScanRequest struct {
	QRToken string `json:"qr_token" binding:"required"`
	EventID string `json:"event_id" binding:"required,uuid4"`
}
