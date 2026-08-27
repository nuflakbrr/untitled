package middleware

import (
	"net/http"
	"strings"

	"venturo-skeleton-go/internal/shared/response"
	jwtpkg "venturo-skeleton-go/pkg/jwt"
	"venturo-skeleton-go/pkg/logger"

	"github.com/gin-gonic/gin"
)

// JWTAuth is a middleware that validates JWT access tokens
func JWTAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Error(c, http.StatusUnauthorized, "Authorization header required", "")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Error(c, http.StatusUnauthorized, "Invalid authorization header format. Expected: Bearer <token>", "")
			c.Abort()
			return
		}

		tokenString := parts[1]

		claims, err := jwtpkg.ParseToken(tokenString)
		if err != nil {
			logger.Warn("Invalid token", logger.Err(err))

			var message string
			switch err {
			case jwtpkg.ErrExpiredToken:
				message = "Token has expired"
			case jwtpkg.ErrInvalidSignature:
				message = "Invalid token signature"
			default:
				message = "Invalid token"
			}

			response.Error(c, http.StatusUnauthorized, message, "")
			c.Abort()
			return
		}

		SetUserContext(c, claims)
		c.Next()
	}
}

// OptionalAuth is a middleware that extracts JWT if present but doesn't require it
func OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}

		claims, err := jwtpkg.ParseToken(parts[1])
		if err != nil {
			c.Next()
			return
		}

		SetUserContext(c, claims)
		c.Next()
	}
}
