package handler

import (
	"errors"
	"net/http"

	"venturo-skeleton-go/internal/modules/core/role/repository"
	"venturo-skeleton-go/internal/modules/core/role/service"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

type RoleHandler struct {
	service *service.RoleService
}

func NewRoleHandler(service *service.RoleService) *RoleHandler {
	return &RoleHandler{service: service}
}

// GetAll handles GET /core/v1/roles
func (h *RoleHandler) GetAll(c *gin.Context) {
	roles, err := h.service.GetAll(c.Request.Context())
	if err != nil {
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve roles", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Roles retrieved successfully", roles)
}

// GetByID handles GET /core/v1/roles/:id
func (h *RoleHandler) GetByID(c *gin.Context) {
	id := c.Param("id")
	role, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, repository.ErrRoleNotFound) {
			response.Error(c, http.StatusNotFound, "Role not found", "")
			return
		}
		response.Error(c, http.StatusInternalServerError, "Failed to retrieve role", err.Error())
		return
	}
	response.Success(c, http.StatusOK, "Role retrieved successfully", role)
}
