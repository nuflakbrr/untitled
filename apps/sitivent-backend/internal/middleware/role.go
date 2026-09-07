package middleware

import (
	"net/http"
	"strings"

	"venturo-skeleton-go/internal/shared/authz"
	"venturo-skeleton-go/internal/shared/response"
	"venturo-skeleton-go/pkg/logger"

	"github.com/gin-gonic/gin"
)

var authzService *authz.Service

// SetAuthzService registers the permission-lookup backend
func SetAuthzService(s *authz.Service) {
	authzService = s
}

// RequireRole checks if user has at least one of the required roles
func RequireRole(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := GetUserFromContext(c)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "Authentication required", "")
			c.Abort()
			return
		}

		// Root superadmin bypasses role check
		if claims.IsSuperAdmin {
			c.Next()
			return
		}

		if !claims.HasAnyRole(roles...) {
			logger.Warn("User lacks required role",
				logger.String("user_id", claims.UserID),
				logger.String("required_roles", strings.Join(roles, ",")),
			)
			response.Error(c, http.StatusForbidden, "Insufficient role permissions", "")
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequirePermission checks if user has the specific permission in Redis/DB
func RequirePermission(permission string) gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := GetUserFromContext(c)
		if err != nil {
			response.Error(c, http.StatusUnauthorized, "Authentication required", "")
			c.Abort()
			return
		}

		// Root superadmin has full bypass
		if claims.IsSuperAdmin {
			c.Next()
			return
		}

		if authzService == nil {
			logger.Error("Authz service is not initialized")
			response.Error(c, http.StatusInternalServerError, "Authorization service unavailable", "")
			c.Abort()
			return
		}

		hasPerm, err := authzService.Has(c.Request.Context(), claims.UserID, claims.TenantID, permission)
		if err != nil || !hasPerm {
			logger.Warn("User lacks required permission",
				logger.String("user_id", claims.UserID),
				logger.String("permission", permission),
			)
			response.Error(c, http.StatusForbidden, "You do not have permission to perform this action", "")
			c.Abort()
			return
		}

		c.Next()
	}
}
