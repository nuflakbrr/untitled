package jwt

import (
	"os"
	"testing"
)

func setupTestSecret(t *testing.T) {
	t.Helper()
	os.Setenv("JWT_SECRET", "super-secret-key-at-least-32-characters-long!")
	os.Setenv("JWT_EXPIRATION", "1h")
	t.Cleanup(func() {
		os.Unsetenv("JWT_SECRET")
		os.Unsetenv("JWT_EXPIRATION")
	})
}

func TestGenerateToken_Success(t *testing.T) {
	setupTestSecret(t)

	token, err := GenerateToken(
		"user-123", "tenant-456", "Universitas Mandiri", "rektorat", "UMN", "ROOT",
		"test@untitled.ac.id", "Test User", "root_superadmin", "role-789",
		true, []string{"root_superadmin"},
	)
	if err != nil {
		t.Fatalf("GenerateToken() error = %v", err)
	}
	if token == "" {
		t.Fatal("GenerateToken() returned empty token")
	}
}

func TestParseToken_ValidToken(t *testing.T) {
	setupTestSecret(t)

	userID := "48e8167e-0105-4242-b6db-9bb12dc84bce"
	tenantID := "c9711506-d356-4704-a32e-0543dfe3e104"
	email := "superadmin.univ@untitled.ac.id"
	role := "root_superadmin"

	token, err := GenerateToken(
		userID, tenantID, "Universitas Mandiri Nusantara", "rektorat", "UMN", "ROOT",
		email, "Superadmin Universitas", role, "role-id-123",
		true, []string{"root_superadmin"},
	)
	if err != nil {
		t.Fatalf("GenerateToken() error = %v", err)
	}

	claims, err := ParseToken(token)
	if err != nil {
		t.Fatalf("ParseToken() error = %v", err)
	}
	if claims.UserID != userID {
		t.Errorf("UserID = %v, want %v", claims.UserID, userID)
	}
	if claims.TenantID != tenantID {
		t.Errorf("TenantID = %v, want %v", claims.TenantID, tenantID)
	}
	if claims.Email != email {
		t.Errorf("Email = %v, want %v", claims.Email, email)
	}
	if claims.Role != role {
		t.Errorf("Role = %v, want %v", claims.Role, role)
	}
	if claims.TenantSlug != "rektorat" {
		t.Errorf("TenantSlug = %v, want rektorat", claims.TenantSlug)
	}
	if !claims.IsSuperAdmin {
		t.Error("IsSuperAdmin should be true")
	}
}

func TestParseToken_EmptyToken(t *testing.T) {
	_, err := ParseToken("")
	if err != ErrTokenNotProvided {
		t.Errorf("ParseToken(\"\") = %v, want ErrTokenNotProvided", err)
	}
}

func TestParseToken_InvalidToken(t *testing.T) {
	_, err := ParseToken("invalid.jwt.token.string")
	if err == nil {
		t.Error("ParseToken(invalid) should return an error, got nil")
	}
}

func TestParseToken_TamperedToken(t *testing.T) {
	setupTestSecret(t)

	token, _ := GenerateToken(
		"user-123", "tenant-456", "Test Uni", "test", "TU", "ROOT",
		"test@test.com", "Test", "superadmin", "role-1",
		true, []string{"superadmin"},
	)

	// tamper: flip last char
	tampered := token[:len(token)-1] + "X"
	_, err := ParseToken(tampered)
	if err == nil {
		t.Error("ParseToken(tampered) should return an error, got nil")
	}
}

func TestRefreshToken_ExpiredToken(t *testing.T) {
	setupTestSecret(t)
	os.Setenv("JWT_EXPIRATION", "-1s")

	token, err := GenerateToken(
		"user-123", "tenant-456", "Test Uni", "test", "TU", "ROOT",
		"test@test.com", "Test", "superadmin", "role-1",
		false, []string{"superadmin"},
	)
	if err != nil {
		t.Fatalf("GenerateToken() error = %v", err)
	}

	os.Setenv("JWT_EXPIRATION", "1h")
	refreshed, err := RefreshToken(token)
	if err != nil {
		t.Fatalf("RefreshToken(expired) error = %v", err)
	}
	if _, err := ParseToken(refreshed); err != nil {
		t.Fatalf("ParseToken(refreshed) error = %v", err)
	}
}

func TestValidateSecret_Development(t *testing.T) {
	// dev mode: short secret should just warn, not fail
	os.Setenv("JWT_SECRET", "short")
	defer os.Unsetenv("JWT_SECRET")

	if err := ValidateSecret("development"); err != nil {
		t.Errorf("ValidateSecret(dev) with short secret should not fail: %v", err)
	}
}

func TestValidateSecret_Production_Short(t *testing.T) {
	os.Setenv("JWT_SECRET", "tooshort")
	defer os.Unsetenv("JWT_SECRET")

	if err := ValidateSecret("production"); err == nil {
		t.Error("ValidateSecret(prod) with short secret should fail")
	}
}

func TestValidateSecret_Production_Default(t *testing.T) {
	os.Setenv("JWT_SECRET", "untitled-development-secret-change-in-production")
	defer os.Unsetenv("JWT_SECRET")

	if err := ValidateSecret("production"); err == nil {
		t.Error("ValidateSecret(prod) with default dev secret should fail")
	}
}

func TestValidateSecret_Production_Valid(t *testing.T) {
	os.Setenv("JWT_SECRET", "super-secret-production-key-at-least-32-chars!")
	defer os.Unsetenv("JWT_SECRET")

	if err := ValidateSecret("production"); err != nil {
		t.Errorf("ValidateSecret(prod) with strong secret should not fail: %v", err)
	}
}
