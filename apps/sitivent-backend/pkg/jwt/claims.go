package jwt

import (
	"github.com/golang-jwt/jwt/v5"
)

// Role constants for SITIVENT Hierarchical Multi-Tenancy
const (
	RoleRootSuperAdmin = "root_superadmin"
	RoleSuperAdmin     = "superadmin"
	RolePanitia        = "panitia"
	RoleScanner        = "scanner"
	RolePeserta        = "peserta"
)

// Claims represents custom JWT claims for SITIVENT.
//
// Permissions live in Redis (internal/shared/authz) and are evaluated
// dynamically at runtime on each request.
type Claims struct {
	UserID       string   `json:"user_id"`
	TenantID     string   `json:"tenant_id,omitempty"`   // Active Tenant ID (UUID of Rektorat or Faculty)
	TenantName   string   `json:"tenant_name,omitempty"` // Name of the tenant (e.g. "Fakultas Ilmu Komputer")
	TenantSlug   string   `json:"tenant_slug,omitempty"` // URL slug of the tenant (e.g. "fasilkom")
	TenantCode   string   `json:"tenant_code,omitempty"` // Code of the tenant (e.g. "FASILKOM")
	TenantType   string   `json:"tenant_type,omitempty"` // ROOT, FACULTY, DEPARTMENT, UNIT
	Email        string   `json:"email"`
	Name         string   `json:"name"`
	Role         string   `json:"role"`
	RoleID       string   `json:"role_id"`
	IsSuperAdmin bool     `json:"is_super_admin"` // true for root_superadmin
	Roles        []string `json:"roles"`

	ScopedPermissions []string `json:"-"`

	jwt.RegisteredClaims
}

// HasScopedPermission checks for request-scoped permission
func (c *Claims) HasScopedPermission(permission string) bool {
	for _, p := range c.ScopedPermissions {
		if p == permission {
			return true
		}
	}
	return false
}

// HasRole checks if user has a specific role
func (c *Claims) HasRole(role string) bool {
	if c.Role == role {
		return true
	}
	for _, r := range c.Roles {
		if r == role {
			return true
		}
	}
	return false
}

// HasAnyRole checks if user has at least one of the specified roles
func (c *Claims) HasAnyRole(roles ...string) bool {
	for _, role := range roles {
		if c.HasRole(role) {
			return true
		}
	}
	return false
}

// HasAllRoles checks if user has all specified roles
func (c *Claims) HasAllRoles(roles ...string) bool {
	for _, role := range roles {
		if !c.HasRole(role) {
			return false
		}
	}
	return true
}
