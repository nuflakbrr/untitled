package domain

import "time"

type Article struct {
	ID          string
	TenantID    *string
	Title       string
	Content     string
	Cover       *string
	Slug        string
	CreatedByID *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
	CategoryIDs []string
}

type ArticleCategory struct {
	ID        string
	Name      string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Gallery struct {
	ID          string
	TenantID    *string
	Title       string
	Description *string
	ImageURL    string
	Featured    bool
	EventID     *string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
