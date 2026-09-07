package audit

import "time"

// AuditLog represents an audit log entry in SITIVENT
type AuditLog struct {
	ID        string    `json:"id"`
	TenantID  *string   `json:"tenant_id,omitempty"`
	UserID    *string   `json:"user_id,omitempty"`
	Action    string    `json:"action"`
	Entity    string    `json:"entity"`
	EntityID  string    `json:"entity_id"`
	OldValues []byte    `json:"-"`
	NewValues []byte    `json:"-"`
	IPAddress *string   `json:"ip_address,omitempty"`
	UserAgent *string   `json:"user_agent,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
