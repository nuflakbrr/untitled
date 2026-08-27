package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"venturo-skeleton-go/internal/modules/core/auth/dto"
	"venturo-skeleton-go/internal/shared/response"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
	os.Setenv("JWT_SECRET", "test-super-secret-at-least-32-chars-long!")
}

// ─── Mock AuthService ─────────────────────────────────────────────────────────

type mockAuthService struct {
	signInFn  func(req dto.SignInRequest) (*dto.SignInResponse, error)
	signUpFn  func(req dto.SignUpRequest) (*dto.SignUpResponse, error)
}

// Ensure AuthHandler can accept a service interface.
// We define a thin serviceInterface and update AuthHandler to use it.
// Since handler currently takes *service.AuthService directly,
// we test the validation layer by injecting a custom Gin engine.

// ─── Test Helpers ─────────────────────────────────────────────────────────────

func setupRouter() *gin.Engine {
	r := gin.New()
	return r
}

func doRequest(r *gin.Engine, method, path string, body interface{}) *httptest.ResponseRecorder {
	var reqBody bytes.Buffer
	if body != nil {
		_ = json.NewEncoder(&reqBody).Encode(body)
	}
	req := httptest.NewRequest(method, path, &reqBody)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	return w
}

// ─── Validation Handler Tests (independent of service layer) ─────────────────

// These tests validate the Gin binding layer by wiring minimal routes that call
// c.ShouldBindJSON and return the same error responses as the real handler.

func TestAuthValidation_SignIn_MissingEmail(t *testing.T) {
	r := setupRouter()
	r.POST("/signin", func(c *gin.Context) {
		var req dto.SignInRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	w := doRequest(r, "POST", "/signin", map[string]string{
		"password": "somepassword",
	})

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d (missing email)", w.Code, http.StatusBadRequest)
	}
}

func TestAuthValidation_SignIn_InvalidEmailFormat(t *testing.T) {
	r := setupRouter()
	r.POST("/signin", func(c *gin.Context) {
		var req dto.SignInRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	w := doRequest(r, "POST", "/signin", map[string]string{
		"email":    "not-an-email",
		"password": "somepassword",
	})

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d (invalid email format)", w.Code, http.StatusBadRequest)
	}
}

func TestAuthValidation_SignIn_PasswordTooShort(t *testing.T) {
	r := setupRouter()
	r.POST("/signin", func(c *gin.Context) {
		var req dto.SignInRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	w := doRequest(r, "POST", "/signin", map[string]string{
		"email":    "user@untitled.ac.id",
		"password": "short",
	})

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d (password too short)", w.Code, http.StatusBadRequest)
	}
}

func TestAuthValidation_SignIn_ValidPayload(t *testing.T) {
	r := setupRouter()
	r.POST("/signin", func(c *gin.Context) {
		var req dto.SignInRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	w := doRequest(r, "POST", "/signin", map[string]string{
		"email":    "superadmin.univ@untitled.ac.id",
		"password": "password123",
	})

	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d (valid payload should pass binding)", w.Code, http.StatusOK)
	}
}

func TestAuthValidation_SignUp_MissingFields(t *testing.T) {
	r := setupRouter()
	r.POST("/signup", func(c *gin.Context) {
		var req dto.SignUpRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	// Missing name and password
	w := doRequest(r, "POST", "/signup", map[string]string{
		"email": "new@untitled.ac.id",
	})

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d (missing name and password)", w.Code, http.StatusBadRequest)
	}
}

func TestAuthValidation_SignUp_ValidPayload(t *testing.T) {
	r := setupRouter()
	r.POST("/signup", func(c *gin.Context) {
		var req dto.SignUpRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			response.Error(c, http.StatusBadRequest, "Validation error", err.Error())
			return
		}
		c.JSON(http.StatusOK, gin.H{"ok": true})
	})

	w := doRequest(r, "POST", "/signup", map[string]string{
		"email":    "newpeserta@untitled.ac.id",
		"name":     "Peserta Baru",
		"password": "securepassword123",
	})

	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d (valid signup payload)", w.Code, http.StatusOK)
	}
}

func TestAuthValidation_UnauthorizedRoute_ReturnsJSON(t *testing.T) {
	r := setupRouter()
	r.GET("/me", func(c *gin.Context) {
		response.Error(c, http.StatusUnauthorized, "Unauthorized", "")
	})

	w := doRequest(r, "GET", "/me", nil)

	if w.Code != http.StatusUnauthorized {
		t.Errorf("status = %d, want 401", w.Code)
	}

	var body map[string]interface{}
	if err := json.NewDecoder(w.Body).Decode(&body); err != nil {
		t.Fatalf("response body is not valid JSON: %v", err)
	}
	if body["message"] != "Unauthorized" {
		t.Errorf("message = %q, want Unauthorized", body["message"])
	}
}
