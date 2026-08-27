package middleware

import (
	"errors"

	jwtpkg "venturo-skeleton-go/pkg/jwt"

	"github.com/gin-gonic/gin"
)

const (
	UserContextKey = "user"
	AuthTypeKey    = "auth_type"
)

var (
	ErrUserNotFoundInContext = errors.New("user not found in context")
)

// SetUserContext stores user claims in gin.Context
func SetUserContext(c *gin.Context, claims *jwtpkg.Claims) {
	c.Set(UserContextKey, claims)
	if claims.TenantID != "" {
		c.Set(ContextKeyTenantID, claims.TenantID)
		c.Set(ContextKeyTenantSlug, claims.TenantSlug)
		c.Set(ContextKeyTenantType, claims.TenantType)
	}
}

// GetUserFromContext retrieves user claims from gin.Context
func GetUserFromContext(c *gin.Context) (*jwtpkg.Claims, error) {
	value, exists := c.Get(UserContextKey)
	if !exists {
		return nil, ErrUserNotFoundInContext
	}

	claims, ok := value.(*jwtpkg.Claims)
	if !ok {
		return nil, ErrUserNotFoundInContext
	}

	return claims, nil
}

// MustGetUserFromContext retrieves user claims and panics if not found
func MustGetUserFromContext(c *gin.Context) *jwtpkg.Claims {
	claims, err := GetUserFromContext(c)
	if err != nil {
		panic(err)
	}
	return claims
}

// GetUserID retrieves user ID from context
func GetUserID(c *gin.Context) (string, error) {
	claims, err := GetUserFromContext(c)
	if err != nil {
		return "", err
	}
	return claims.UserID, nil
}

// GetUserEmail retrieves user email from context
func GetUserEmail(c *gin.Context) (string, error) {
	claims, err := GetUserFromContext(c)
	if err != nil {
		return "", err
	}
	return claims.Email, nil
}

// GetUserRoles retrieves user roles from context
func GetUserRoles(c *gin.Context) ([]string, error) {
	claims, err := GetUserFromContext(c)
	if err != nil {
		return nil, err
	}
	return claims.Roles, nil
}

// GetTenantID retrieves tenant ID from user claims in context
func GetTenantID(c *gin.Context) string {
	claims, err := GetUserFromContext(c)
	if err != nil {
		return ""
	}
	return claims.TenantID
}

// MustGetUserID retrieves user ID from context and panics if not found
func MustGetUserID(c *gin.Context) string {
	claims := MustGetUserFromContext(c)
	return claims.UserID
}
