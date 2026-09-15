package audit

import (
	"encoding/json"
	"time"
)

// ListQueryParams drives the GET /core/v1/audit-logs endpoint
type ListQueryParams struct {
	Entity   string  `form:"entity"`
	EntityID string  `form:"entity_id" binding:"omitempty,uuid"`
	UserID   string  `form:"user_id" binding:"omitempty,uuid"`
	TenantID *string `form:"tenant_id" binding:"omitempty,uuid"`
	Action   string  `form:"action"`
	Page     int     `form:"page,default=1" binding:"min=1"`
	Limit    int     `form:"limit,default=50" binding:"min=1,max=200"`
}

// AuditLogResponse is the API-facing view of an audit row
type AuditLogResponse struct {
	ID        string         `json:"id"`
	TenantID  *string        `json:"tenant_id,omitempty"`
	UserID    *string        `json:"user_id,omitempty"`
	Action    string         `json:"action"`
	Entity    string         `json:"entity"`
	EntityID  string         `json:"entity_id"`
	OldValues map[string]any `json:"old_values,omitempty"`
	NewValues map[string]any `json:"new_values,omitempty"`
	IPAddress *string        `json:"ip_address,omitempty"`
	UserAgent *string        `json:"user_agent,omitempty"`
	CreatedAt time.Time      `json:"created_at"`
}

// ToResponse converts a domain AuditLog into its API response form
func ToResponse(l *AuditLog) AuditLogResponse {
	resp := AuditLogResponse{
		ID:        l.ID,
		TenantID:  l.TenantID,
		UserID:    l.UserID,
		Action:    l.Action,
		Entity:    l.Entity,
		EntityID:  l.EntityID,
		IPAddress: l.IPAddress,
		UserAgent: l.UserAgent,
		CreatedAt: l.CreatedAt,
	}
	if len(l.OldValues) > 0 {
		var o map[string]any
		if err := json.Unmarshal(l.OldValues, &o); err == nil {
			resp.OldValues = o
		}
	}
	if len(l.NewValues) > 0 {
		var n map[string]any
		if err := json.Unmarshal(l.NewValues, &n); err == nil {
			resp.NewValues = n
		}
	}
	return resp
}
