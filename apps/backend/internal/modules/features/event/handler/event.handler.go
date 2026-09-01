package handler

import (
	"context"
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/modules/features/event/domain"
	"venturo-skeleton-go/internal/modules/features/event/dto"
	"venturo-skeleton-go/internal/modules/features/event/repository"
	"venturo-skeleton-go/internal/modules/features/event/service"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type Service interface {
	ListCategories(ctx context.Context, tenantID *string) ([]dto.CategoryResponse, error)
	CreateCategory(ctx context.Context, tenantID string, req dto.CreateCategoryRequest) (*dto.CategoryResponse, error)
	UpdateCategory(ctx context.Context, id string, scopeTenantID *string, req dto.UpdateCategoryRequest) (*dto.CategoryResponse, error)
	DeleteCategory(ctx context.Context, id string, scopeTenantID *string) error
	ListPublicEvents(ctx context.Context, filter dto.EventQuery) ([]dto.EventResponse, int64, error)
	GetPublicEvent(ctx context.Context, slug string) (*dto.EventResponse, error)
	CreateEvent(ctx context.Context, tenantID, userID string, req dto.CreateEventRequest) (*dto.EventResponse, error)
	UpdateEvent(ctx context.Context, id string, scopeTenantID *string, allowCompleted bool, req dto.UpdateEventRequest) (*dto.EventResponse, error)
	UpdateEventStatus(ctx context.Context, id string, scopeTenantID *string, next domain.EventStatus) (*dto.EventResponse, error)
	DeleteEvent(ctx context.Context, id string, scopeTenantID *string) error
}

type EventHandler struct {
	service Service
}

func NewEventHandler(service Service) *EventHandler {
	return &EventHandler{service: service}
}

func (h *EventHandler) GetAll(c *gin.Context) {
	var filter dto.EventQuery
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	if filter.TenantID == "" {
		filter.TenantID = c.GetHeader("X-Tenant-ID")
	}
	events, total, err := h.service.ListPublicEvents(c.Request.Context(), filter)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve events", err.Error())
		return
	}
	response.SuccessWithPagination(c, http.StatusOK, "Events retrieved successfully", events, filter.Page, filter.Limit, total)
}

func (h *EventHandler) GetAdminAll(c *gin.Context) {
	var filter dto.EventQuery
	if err := c.ShouldBindQuery(&filter); err != nil {
		response.Error(c, http.StatusBadRequest, "Invalid query parameters", err.Error())
		return
	}
	filter.IncludeDeleted = true
	if filter.TenantID == "" {
		filter.TenantID = c.GetHeader("X-Tenant-ID")
	}
	events, total, err := h.service.ListPublicEvents(c.Request.Context(), filter)
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve events", err.Error())
		return
	}
	response.SuccessWithPagination(c, http.StatusOK, "Events retrieved successfully", events, filter.Page, filter.Limit, total)
}

func (h *EventHandler) GetBySlug(c *gin.Context) {
	event, err := h.service.GetPublicEvent(c.Request.Context(), c.Param("slug"))
	if err != nil {
		writeEventError(c, err, "Failed to retrieve event")
		return
	}
	response.Success(c, http.StatusOK, "Event retrieved successfully", event)
}

func (h *EventHandler) Create(c *gin.Context) {
	var req dto.CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	tenantID, _, userID, ok := actorScope(c)
	if !ok {
		return
	}
	event, err := h.service.CreateEvent(c.Request.Context(), tenantID, userID, req)
	if err != nil {
		writeEventError(c, err, "Failed to create event")
		return
	}
	response.Success(c, http.StatusCreated, "Event created successfully", event)
}

func (h *EventHandler) Update(c *gin.Context) {
	var req dto.UpdateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	claims, _ := middleware.GetUserFromContext(c)
	allowCompleted := claims != nil && (claims.IsSuperAdmin || claims.HasRole("superadmin"))
	event, err := h.service.UpdateEvent(c.Request.Context(), c.Param("id"), scope, allowCompleted, req)
	if err != nil {
		writeEventError(c, err, "Failed to update event")
		return
	}
	response.Success(c, http.StatusOK, "Event updated successfully", event)
}

func (h *EventHandler) UpdateStatus(c *gin.Context) {
	var req dto.UpdateEventStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
		return
	}
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	event, err := h.service.UpdateEventStatus(c.Request.Context(), c.Param("id"), scope, domain.EventStatus(req.Status))
	if err != nil {
		writeEventError(c, err, "Failed to update event status")
		return
	}
	response.Success(c, http.StatusOK, "Event status updated successfully", event)
}

func (h *EventHandler) Delete(c *gin.Context) {
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	if err := h.service.DeleteEvent(c.Request.Context(), c.Param("id"), scope); err != nil {
		writeEventError(c, err, "Failed to delete event")
		return
	}
	response.Success(c, http.StatusOK, "Event deleted successfully", nil)
}

func (h *EventHandler) PermanentDelete(c *gin.Context) {
	_, scope, _, ok := actorScope(c)
	if !ok {
		return
	}
	deleter, ok := h.service.(interface {
		PermanentDeleteEvent(context.Context, string, *string) error
	})
	if !ok {
		response.Error(c, http.StatusNotImplemented, "Permanent event deletion is unavailable", "")
		return
	}
	if err := deleter.PermanentDeleteEvent(c.Request.Context(), c.Param("id"), scope); err != nil {
		writeEventError(c, err, "Failed to permanently delete event")
		return
	}
	response.Success(c, http.StatusOK, "Event permanently deleted", nil)
}

func actorScope(c *gin.Context) (tenantID string, scopeTenantID *string, userID string, ok bool) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return "", nil, "", false
	}
	if claims.IsSuperAdmin {
		tenantID = c.GetHeader("X-Tenant-ID")
		if tenantID == "" {
			tenantID = claims.TenantID
		}
		if tenantID == "" {
			response.Error(c, http.StatusBadRequest, "Tenant context required", "")
			return "", nil, "", false
		}
		return tenantID, nil, claims.UserID, true
	}
	if claims.TenantID == "" {
		response.Error(c, http.StatusForbidden, "Tenant context required", "")
		return "", nil, "", false
	}
	scope := claims.TenantID
	return claims.TenantID, &scope, claims.UserID, true
}

func writeEventError(c *gin.Context, err error, fallback string) {
	switch {
	case errors.Is(err, repository.ErrEventNotFound), errors.Is(err, repository.ErrCategoryNotFound):
		response.Error(c, http.StatusNotFound, "Resource not found", "")
	case errors.Is(err, service.ErrCategorySlugExists):
		response.Error(c, http.StatusConflict, "Category already exists", "")
	case errors.Is(err, service.ErrInvalidLifecycle):
		response.Error(c, http.StatusConflict, "Invalid event status transition", err.Error())
	case errors.Is(err, repository.ErrEventStatusChanged):
		response.Error(c, http.StatusConflict, "Event status changed; refresh and try again", "")
	case errors.Is(err, service.ErrCompletedImmutable):
		response.Error(c, http.StatusForbidden, "Completed event can only be changed by a superadmin", "")
	case errors.Is(err, service.ErrInvalidEvent):
		response.Error(c, http.StatusUnprocessableEntity, "Invalid event data", err.Error())
	default:
		response.Error(c, http.StatusInternalServerError, fallback, err.Error())
	}
}
