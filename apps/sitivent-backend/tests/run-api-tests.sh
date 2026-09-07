#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# SITIVENT API End-to-End Test Runner
# Requires: backend server running on localhost:8000
# Usage:
#   ./tests/run-api-tests.sh            # run all tests
#   ./tests/run-api-tests.sh --bail     # stop on first failure
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8000}"
BAIL="${1:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COLLECTION_DIR="$SCRIPT_DIR/api"

# Find bru: check monorepo root node_modules first, then local, then PATH
MONOREPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
if [ -f "$MONOREPO_ROOT/node_modules/.bin/bru" ]; then
  BRU="$MONOREPO_ROOT/node_modules/.bin/bru"
elif [ -f "$(pwd)/node_modules/.bin/bru" ]; then
  BRU="$(pwd)/node_modules/.bin/bru"
else
  BRU="$(which bru 2>/dev/null || echo '')"
fi

if [ -z "$BRU" ] || [ ! -f "$BRU" ]; then
  echo "Error: Bruno CLI (bru) not found. Run: bun add -D @usebruno/cli"
  exit 1
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[API TEST]${NC} $1"; }
success() { echo -e "${GREEN}[PASS]${NC} $1"; }
error() { echo -e "${RED}[FAIL]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

# ── 1. Pre-flight check ───────────────────────────────────────────────────────
log "Checking server availability at $BASE_URL/health..."
if ! curl -sf "$BASE_URL/health" > /dev/null 2>&1; then
  error "Backend server is NOT running at $BASE_URL"
  echo ""
  echo "  Start the server first:  make dev  (or: cd apps/backend && go run cmd/api/main.go)"
  exit 1
fi
success "Server is up at $BASE_URL"
echo ""

# ── 2. Login as superadmin to get access token ────────────────────────────────
log "Authenticating as superadmin..."
LOGIN_RESP=$(curl -sf -X POST "$BASE_URL/core/v1/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin.univ@gmail.com","password":"password"}' 2>&1)

if [ $? -ne 0 ]; then
  error "Login failed. Check if DB is seeded (make seed)."
  exit 1
fi

ACCESS_TOKEN=$(echo "$LOGIN_RESP" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ -z "$ACCESS_TOKEN" ]; then
  error "Could not extract access_token from login response."
  echo "Response: $LOGIN_RESP"
  exit 1
fi
success "Login successful. Token acquired."
echo ""

log "Authenticating as FASILKOM superadmin..."
FASILKOM_LOGIN_RESP=$(curl -sf -X POST "$BASE_URL/core/v1/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin.fasilkom@gmail.com","password":"password"}' 2>&1)
FASILKOM_ACCESS_TOKEN=$(echo "$FASILKOM_LOGIN_RESP" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ -z "$FASILKOM_ACCESS_TOKEN" ]; then
  error "Could not extract FASILKOM access_token. Check if DB is seeded (make seed)."
  exit 1
fi
success "FASILKOM login successful."
echo ""

log "Authenticating as Teknik superadmin..."
TEKNIK_LOGIN_RESP=$(curl -sf -X POST "$BASE_URL/core/v1/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin.teknik@gmail.com","password":"password"}' 2>&1)
TEKNIK_ACCESS_TOKEN=$(echo "$TEKNIK_LOGIN_RESP" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ -z "$TEKNIK_ACCESS_TOKEN" ]; then
  error "Could not extract Teknik access_token. Check if DB is seeded (make seed)."
  exit 1
fi
success "Teknik login successful."
echo ""

log "Authenticating as participant..."
PESERTA_LOGIN_RESP=$(curl -sf -X POST "$BASE_URL/core/v1/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"peserta@gmail.com","password":"password"}' 2>&1)
PESERTA_ACCESS_TOKEN=$(echo "$PESERTA_LOGIN_RESP" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
if [ -z "$PESERTA_ACCESS_TOKEN" ]; then
  error "Could not extract participant access_token. Check if DB is seeded (make seed)."
  exit 1
fi
success "Participant login successful."
echo ""

# ── 3. Export token into env for bru ────────────────────────────────────────
# bru CLI reads env file — we patch accessToken at runtime
export ACCESS_TOKEN_ENV="$ACCESS_TOKEN"

# Create a runtime env file with the token injected
RUNTIME_ENV_FILE="/tmp/sitivent-test-env-$$.bru"
cat > "$RUNTIME_ENV_FILE" << ENVEOF
vars {
  baseUrl: $BASE_URL
  accessToken: $ACCESS_TOKEN
  rootAccessToken: $ACCESS_TOKEN
  fasilkomAccessToken: $FASILKOM_ACCESS_TOKEN
  teknikAccessToken: $TEKNIK_ACCESS_TOKEN
  pesertaAccessToken: $PESERTA_ACCESS_TOKEN
  superadminEmail: superadmin.univ@gmail.com
  superadminPassword: password
  fasilkomEmail: superadmin.fasilkom@gmail.com
  fasilkomPassword: password
  panitiaEmail: panitia.fasilkom@gmail.com
  panitiaPassword: password
  pesertaEmail: peserta@gmail.com
  pesertaPassword: password
  tenantRektoratId: c9711506-d356-4704-a32e-0543dfe3e104
  tenantFasilkomId: 20492a21-59c3-4edf-bb64-1eaa6cf11deb
  tenantTeknikId: 0ae41d16-bc49-4a88-b079-94def1b5b3ff
  crudTenantId:
  crudFacultyChildTenantId:
  crudFasilkomRoleId:
  crudTeknikRoleId:
  crudMembershipUserId:
  crudMembershipUserAccessToken:
  crudUserId:
  crudEventCategoryId:
  crudEventId:
  crudEventSlug:
  crudRegistrationId:
  crudPesertaAccessToken:
  crudQrToken:
  certificateEventId:
  certificateRegistrationId:
  certificateQrToken:
  certificateJobId:
  certificateId:
  crudArticleCategoryId:
  crudArticleId:
  crudArticleSlug:
  crudGalleryId:
  crudSupportMessageId:
}
ENVEOF

cleanup() {
  # Remove records created by CRUD suites even when a test fails midway.
  CRUD_GALLERY_ID=$(grep '^  crudGalleryId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudGalleryId:[[:space:]]*//')
  if [ -n "${CRUD_GALLERY_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/features/v1/galleries/$CRUD_GALLERY_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for gallery $CRUD_GALLERY_ID"
    else
      warn "Cleanup failed for gallery $CRUD_GALLERY_ID; remove it manually if still present."
    fi
  fi
  CRUD_ARTICLE_ID=$(grep '^  crudArticleId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudArticleId:[[:space:]]*//')
  if [ -n "${CRUD_ARTICLE_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/features/v1/articles/$CRUD_ARTICLE_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for article $CRUD_ARTICLE_ID"
    else
      warn "Cleanup failed for article $CRUD_ARTICLE_ID; remove it manually if still present."
    fi
  fi
  CRUD_ARTICLE_CATEGORY_ID=$(grep '^  crudArticleCategoryId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudArticleCategoryId:[[:space:]]*//')
  if [ -n "${CRUD_ARTICLE_CATEGORY_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/features/v1/article-categories/$CRUD_ARTICLE_CATEGORY_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for article category $CRUD_ARTICLE_CATEGORY_ID"
    else
      warn "Cleanup failed for article category $CRUD_ARTICLE_CATEGORY_ID; remove it manually if still present."
    fi
  fi
  CERTIFICATE_EVENT_ID=$(grep '^  certificateEventId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  certificateEventId:[[:space:]]*//')
  if [ -n "${CERTIFICATE_EVENT_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/features/v1/events/$CERTIFICATE_EVENT_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for certificate event $CERTIFICATE_EVENT_ID"
    else
      warn "Cleanup failed for certificate event $CERTIFICATE_EVENT_ID; remove it manually if still present."
    fi
  fi
  CRUD_REGISTRATION_ID=$(grep '^  crudRegistrationId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudRegistrationId:[[:space:]]*//')
  if [ -n "${CRUD_REGISTRATION_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/features/v1/registrations/$CRUD_REGISTRATION_ID" \
      -H "Authorization: Bearer $PESERTA_ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for registration $CRUD_REGISTRATION_ID"
    else
      warn "Cleanup failed for registration $CRUD_REGISTRATION_ID; cancel it manually if still active."
    fi
  fi
  CRUD_EVENT_ID=$(grep '^  crudEventId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudEventId:[[:space:]]*//')
  if [ -n "${CRUD_EVENT_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/features/v1/events/$CRUD_EVENT_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for event $CRUD_EVENT_ID"
    else
      warn "Cleanup failed for event $CRUD_EVENT_ID; remove it manually if still present."
    fi
  fi
  CRUD_EVENT_CATEGORY_ID=$(grep '^  crudEventCategoryId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudEventCategoryId:[[:space:]]*//')
  if [ -n "${CRUD_EVENT_CATEGORY_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/features/v1/event-categories/$CRUD_EVENT_CATEGORY_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for event category $CRUD_EVENT_CATEGORY_ID"
    else
      warn "Cleanup failed for event category $CRUD_EVENT_CATEGORY_ID; remove it manually if still present."
    fi
  fi
  CRUD_TENANT_ID=$(grep '^  crudTenantId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudTenantId:[[:space:]]*//')
  if [ -n "${CRUD_TENANT_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/core/v1/tenants/$CRUD_TENANT_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for tenant $CRUD_TENANT_ID"
    else
      warn "Cleanup failed for tenant $CRUD_TENANT_ID; remove it manually if still present."
    fi
  fi
  CRUD_FACULTY_CHILD_TENANT_ID=$(grep '^  crudFacultyChildTenantId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudFacultyChildTenantId:[[:space:]]*//')
  if [ -n "${CRUD_FACULTY_CHILD_TENANT_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/core/v1/tenants/$CRUD_FACULTY_CHILD_TENANT_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for faculty child tenant $CRUD_FACULTY_CHILD_TENANT_ID"
    else
      warn "Cleanup failed for faculty child tenant $CRUD_FACULTY_CHILD_TENANT_ID; remove it manually if still present."
    fi
  fi
  CRUD_FASILKOM_ROLE_ID=$(grep '^  crudFasilkomRoleId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudFasilkomRoleId:[[:space:]]*//')
  if [ -n "${CRUD_FASILKOM_ROLE_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/core/v1/roles/$CRUD_FASILKOM_ROLE_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for FASILKOM custom role $CRUD_FASILKOM_ROLE_ID"
    else
      warn "Cleanup failed for FASILKOM custom role $CRUD_FASILKOM_ROLE_ID; remove it manually if still present."
    fi
  fi
  CRUD_TEKNIK_ROLE_ID=$(grep '^  crudTeknikRoleId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudTeknikRoleId:[[:space:]]*//')
  if [ -n "${CRUD_TEKNIK_ROLE_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/core/v1/roles/$CRUD_TEKNIK_ROLE_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for Teknik custom role $CRUD_TEKNIK_ROLE_ID"
    else
      warn "Cleanup failed for Teknik custom role $CRUD_TEKNIK_ROLE_ID; remove it manually if still present."
    fi
  fi
  CRUD_MEMBERSHIP_USER_ID=$(grep '^  crudMembershipUserId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudMembershipUserId:[[:space:]]*//')
  if [ -n "${CRUD_MEMBERSHIP_USER_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/core/v1/users/$CRUD_MEMBERSHIP_USER_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for membership test user $CRUD_MEMBERSHIP_USER_ID"
    else
      warn "Cleanup failed for membership test user $CRUD_MEMBERSHIP_USER_ID; remove it manually if still present."
    fi
  fi
  CRUD_USER_ID=$(grep '^  crudUserId:' "$RUNTIME_ENV_FILE" 2>/dev/null | sed 's/^  crudUserId:[[:space:]]*//')
  if [ -n "${CRUD_USER_ID:-}" ]; then
    CLEANUP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
      -X DELETE "$BASE_URL/core/v1/users/$CRUD_USER_ID" \
      -H "Authorization: Bearer $ACCESS_TOKEN")
    if [ "$CLEANUP_STATUS" = "200" ] || [ "$CLEANUP_STATUS" = "404" ]; then
      success "Cleanup completed for user $CRUD_USER_ID"
    else
      warn "Cleanup failed for user $CRUD_USER_ID; remove it manually if still present."
    fi
  fi
  rm -f "$RUNTIME_ENV_FILE"
  return 0
}
trap cleanup EXIT

# ── 4. Run Bruno tests ────────────────────────────────────────────────────────
log "Running Bruno API tests..."
echo ""

BRU_ARGS=""
if [ "$BAIL" = "--bail" ]; then
	BRU_ARGS="--bail"
fi

BRU_OUTPUT=""
if BRU_OUTPUT=$(cd "$COLLECTION_DIR" && "$BRU" run . -r $BRU_ARGS --env-file "$RUNTIME_ENV_FILE" 2>&1); then
  :
else
  :
fi
printf '%s\n' "$BRU_OUTPUT"

if printf '%s\n' "$BRU_OUTPUT" | grep -q '│ Status.*✓ PASS'; then
  TOTAL_PASS=1
  TOTAL_FAIL=0
else
  TOTAL_PASS=0
  TOTAL_FAIL=1
fi

# ── 5. Summary ────────────────────────────────────────────────────────────────
echo "════════════════════════════════════════"
echo -e "  ${GREEN}PASSED:${NC} $TOTAL_PASS suite(s)"
if [ $TOTAL_FAIL -gt 0 ]; then
  echo -e "  ${RED}FAILED:${NC} API collection"
  echo "════════════════════════════════════════"
  RESULT=1
else
  echo -e "  ${GREEN}All API test suites PASSED ✅${NC}"
  echo "════════════════════════════════════════"
  RESULT=0
fi

trap - EXIT
cleanup
exit "$RESULT"
