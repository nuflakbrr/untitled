package dto

type CreateArticleRequest struct {
	Title       string   `json:"title" binding:"required,min=3,max=255"`
	Content     string   `json:"content" binding:"required"`
	Cover       string   `json:"cover" binding:"omitempty,url"`
	CategoryIDs []string `json:"category_ids" binding:"omitempty,dive,uuid4"`
}

type UpdateArticleRequest struct {
	Title       string   `json:"title" binding:"required,min=3,max=255"`
	Content     string   `json:"content" binding:"required"`
	Cover       string   `json:"cover" binding:"omitempty,url"`
	CategoryIDs []string `json:"category_ids" binding:"omitempty,dive,uuid4"`
}

type ArticleQuery struct {
	TenantID   string `form:"tenant_id" binding:"omitempty,uuid4"`
	Search     string `form:"search" binding:"omitempty,max=255"`
	CategoryID string `form:"category" binding:"omitempty,uuid4"`
	Page       int    `form:"page,default=1" binding:"min=1"`
	Limit      int    `form:"limit,default=10" binding:"min=1,max=100"`
}

type CreateCategoryRequest struct {
	Name string `json:"name" binding:"required,min=2,max=150"`
}

type UpdateCategoryRequest struct {
	Name string `json:"name" binding:"required,min=2,max=150"`
}

type CreateGalleryRequest struct {
	Title       string `json:"title" binding:"required,min=3,max=255"`
	Description string `json:"description" binding:"omitempty,max=1000"`
	ImageURL    string `json:"image_url" binding:"required,url"`
	Featured    bool   `json:"featured"`
	EventID     string `json:"event_id" binding:"omitempty,uuid4"`
}

type UpdateGalleryRequest struct {
	Title       string `json:"title" binding:"required,min=3,max=255"`
	Description string `json:"description" binding:"omitempty,max=1000"`
	ImageURL    string `json:"image_url" binding:"required,url"`
	Featured    bool   `json:"featured"`
	EventID     string `json:"event_id" binding:"omitempty,uuid4"`
}

type GalleryQuery struct {
	TenantID string `form:"tenant_id" binding:"omitempty,uuid4"`
	EventID  string `form:"event_id" binding:"omitempty,uuid4"`
	Featured *bool  `form:"featured"`
	Page     int    `form:"page,default=1" binding:"min=1"`
	Limit    int    `form:"limit,default=10" binding:"min=1,max=100"`
}
