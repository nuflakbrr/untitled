package jwt

import (
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var (
	ErrInvalidToken     = errors.New("invalid token")
	ErrExpiredToken     = errors.New("token has expired")
	ErrTokenNotProvided = errors.New("token not provided")
	ErrInvalidSignature = errors.New("invalid token signature")
	ErrInvalidJWTSecret = errors.New("JWT_SECRET not set or too short")
)

const (
	MinSecretLength = 32 // Minimum length for JWT secret in characters
)

// ValidateSecret validates that JWT_SECRET is set and meets minimum requirements
func ValidateSecret(env string) error {
	secret := os.Getenv("JWT_SECRET")

	if env == "production" {
		if secret == "" {
			return fmt.Errorf("%w: JWT_SECRET environment variable must be set in production", ErrInvalidJWTSecret)
		}

		if len(secret) < MinSecretLength {
			return fmt.Errorf("%w: JWT_SECRET must be at least %d characters long (current: %d)",
				ErrInvalidJWTSecret, MinSecretLength, len(secret))
		}

		if secret == "untitled-development-secret-change-in-production" {
			return fmt.Errorf("%w: cannot use default development secret in production", ErrInvalidJWTSecret)
		}
	} else {
		if secret != "" && len(secret) < MinSecretLength {
			fmt.Printf("WARNING: JWT_SECRET is shorter than recommended minimum of %d characters\n", MinSecretLength)
		}
	}

	return nil
}

// GetSecret returns JWT secret from environment variable
func GetSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "untitled-development-secret-change-in-production"
	}
	return []byte(secret)
}

// GetExpirationTime returns token expiration duration from environment
func GetExpirationTime() time.Duration {
	expStr := os.Getenv("JWT_EXPIRATION")
	if expStr == "" {
		return 24 * time.Hour // Default 24 hours
	}

	duration, err := time.ParseDuration(expStr)
	if err != nil {
		return 24 * time.Hour // Fallback to 24 hours
	}

	return duration
}

// GenerateToken generates a new JWT token with multi-tenant user claims.
func GenerateToken(
	userID, tenantID, tenantName, tenantSlug, tenantCode, tenantType, email, name, role, roleID string,
	isSuperAdmin bool,
	roles []string,
) (string, error) {
	now := time.Now()
	expirationTime := GetExpirationTime()

	claims := &Claims{
		UserID:       userID,
		TenantID:     tenantID,
		TenantName:   tenantName,
		TenantSlug:   tenantSlug,
		TenantCode:   tenantCode,
		TenantType:   tenantType,
		Email:        email,
		Name:         name,
		Role:         role,
		RoleID:       roleID,
		IsSuperAdmin: isSuperAdmin,
		Roles:        roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(now.Add(expirationTime)),
			IssuedAt:  jwt.NewNumericDate(now),
			NotBefore: jwt.NewNumericDate(now),
			Issuer:    "untitled-api",
			Subject:   userID,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(GetSecret())
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// ParseToken parses and validates a JWT token string
func ParseToken(tokenString string) (*Claims, error) {
	if tokenString == "" {
		return nil, ErrTokenNotProvided
	}

	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return GetSecret(), nil
	})
	var claims *Claims
	if token != nil {
		claims, _ = token.Claims.(*Claims)
	}

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return claims, ErrExpiredToken
		}
		if errors.Is(err, jwt.ErrSignatureInvalid) {
			return nil, ErrInvalidSignature
		}
		return nil, fmt.Errorf("%w: %v", ErrInvalidToken, err)
	}

	if claims == nil || !token.Valid {
		return nil, ErrInvalidToken
	}

	return claims, nil
}

// ValidateToken validates a token and returns claims if valid
func ValidateToken(tokenString string) (*Claims, error) {
	return ParseToken(tokenString)
}

// RefreshToken generates a new token from an existing valid token
func RefreshToken(oldTokenString string) (string, error) {
	claims, err := ParseToken(oldTokenString)
	if err != nil {
		if !errors.Is(err, ErrExpiredToken) {
			return "", err
		}
	}
	if claims == nil {
		return "", ErrInvalidToken
	}

	return GenerateToken(
		claims.UserID,
		claims.TenantID,
		claims.TenantName,
		claims.TenantSlug,
		claims.TenantCode,
		claims.TenantType,
		claims.Email,
		claims.Name,
		claims.Role,
		claims.RoleID,
		claims.IsSuperAdmin,
		claims.Roles,
	)
}
