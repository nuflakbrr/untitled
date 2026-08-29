package dto

import "time"

type SupportMessageResponse struct {
	ID         string    `json:"id"`
	TenantID   *string   `json:"tenant_id,omitempty"`
	Email      string    `json:"email"`
	Phone      string    `json:"phone"`
	Name       string    `json:"name"`
	Title      string    `json:"title"`
	Category   string    `json:"category"`
	Chronology string    `json:"chronology"`
	Status     string    `json:"status"`
	UserID     *string   `json:"user_id,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}
