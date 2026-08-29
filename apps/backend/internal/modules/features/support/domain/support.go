package domain

import "time"

const (
	StatusPending    = "PENDING"
	StatusInProgress = "IN_PROGRESS"
	StatusResolved   = "RESOLVED"
	StatusRejected   = "REJECTED"
)

// SupportMessage mirrors the support_messages table. It intentionally has no
// reply/response text column — "menanggapi" (responding) only tracks a
// status transition, not a stored written reply.
type SupportMessage struct {
	ID         string
	TenantID   *string
	Email      string
	Phone      string
	Name       string
	Title      string
	Category   string
	Chronology string
	Status     string
	UserID     *string
	CreatedAt  time.Time
	UpdatedAt  time.Time
}
