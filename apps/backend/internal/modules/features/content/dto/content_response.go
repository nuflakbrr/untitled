package dto

import "time"

type ArticleResponse struct {
	ID          string    `json:"id"`
	TenantID    *string   `json:"tenant_id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	Cover       *string   `json:"cover,omitempty"`
	Slug        string    `json:"slug"`
	CreatedByID *string   `json:"created_by_id,omitempty"`
	CategoryIDs []string  `json:"category_ids"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type CategoryResponse struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type GalleryResponse struct {
	ID          string    `json:"id"`
	TenantID    *string   `json:"tenant_id"`
	Title       string    `json:"title"`
	Description *string   `json:"description,omitempty"`
	ImageURL    string    `json:"image_url"`
	Featured    bool      `json:"featured"`
	EventID     *string   `json:"event_id,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
