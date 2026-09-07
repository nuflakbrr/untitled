package handler

import (
	"net/http"

	"venturo-skeleton-go/internal/middleware"
	"venturo-skeleton-go/internal/shared/response"
	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func actorClaims(c *gin.Context) (*jwtpkg.Claims, bool) {
	claims, err := middleware.GetUserFromContext(c)
	if err != nil || claims == nil || claims.UserID == "" {
		response.Error(c, http.StatusUnauthorized, "Authentication required", "")
		return nil, false
	}
	return claims, true
}

// organizerScope returns nil for a root superadmin (unscoped access across
// every tenant) or the caller's own tenant otherwise.
func organizerScope(c *gin.Context) (*string, bool) {
	claims, ok := actorClaims(c)
	if !ok {
		return nil, false
	}
	if claims.IsSuperAdmin {
		return nil, true
	}
	if claims.TenantID == "" {
		response.Error(c, http.StatusForbidden, "Tenant context required", "")
		return nil, false
	}
	scope := claims.TenantID
	return &scope, true
}
