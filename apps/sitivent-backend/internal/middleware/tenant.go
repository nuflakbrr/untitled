package middleware

import (
	"net/http"

	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

const (
	ContextKeyTenantID   = "tenant_id"
	ContextKeyTenantSlug = "tenant_slug"
	ContextKeyTenantType = "tenant_type"
)

// TenantContext middleware extracts tenant context from JWT claims or X-Tenant-ID header
func TenantContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := GetUserFromContext(c)
		if err == nil && claims != nil {
			if claims.TenantID != "" {
				c.Set(ContextKeyTenantID, claims.TenantID)
				c.Set(ContextKeyTenantSlug, claims.TenantSlug)
				c.Set(ContextKeyTenantType, claims.TenantType)
			}
		}

		// Fallback to X-Tenant-ID header for public/switcher endpoints
		headerTenantID := c.GetHeader("X-Tenant-ID")
		if headerTenantID != "" {
			c.Set(ContextKeyTenantID, headerTenantID)
		}

		c.Next()
	}
}

// RequireTenantContext ensures that a valid tenant_id exists in the context
func RequireTenantContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := GetUserFromContext(c)
		if err != nil || claims == nil {
			response.Error(c, http.StatusUnauthorized, "Authentication required", "")
			c.Abort()
			return
		}

		// Root superadmin bypasses requirement unless specified
		if claims.IsSuperAdmin {
			c.Next()
			return
		}

		tenantID, exists := c.Get(ContextKeyTenantID)
		if !exists || tenantID == "" {
			response.Error(c, http.StatusForbidden, "Tenant context required for this operation", "")
			c.Abort()
			return
		}

		c.Next()
	}
}

// GetTenantIDFromContext retrieves the tenant ID from gin.Context
func GetTenantIDFromContext(c *gin.Context) string {
	if val, exists := c.Get(ContextKeyTenantID); exists {
		if id, ok := val.(string); ok {
			return id
		}
	}
	return ""
}

