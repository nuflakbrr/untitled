# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Untitled Backend** (internal codename **SITIVENT**) is a university event/attendance/certificate platform built with Go, Gin, and PostgreSQL (`pgx/v5`). It implements a **hierarchical multi-tenancy** model (Universitas → Fakultas → Jurusan → Unit) with RBAC, JWT auth, event registration/payment, attendance scanning, and certificate issuance.

This package is also wired into the root Turborepo (`bun run dev|build|test|lint` from the monorepo root delegate here via `package.json`), but Go tooling (`go`, `make`) is the primary interface for day-to-day work in this directory.

## Development Commands

```bash
cp .env.example .env           # Configure environment variables
make db-setup                  # Run migrations and seeders (fresh setup)
make dev                       # Start with hot reload (Air)
make run                       # Run without hot reload (go run cmd/api/main.go)
make build                     # Build production binary -> bin/untitled-api
```

### Database

Migrations and seeders are split into **two independently-versioned tracks**, `core` and `features`, each tracked in its own `schema_migrations_<module>` table:

```bash
make migrate-up                        # Run all pending migrations (both tracks)
make migrate-down MODULE=core          # Rollback last migration for one track (core|features)
make migrate-create NAME=x MODULE=core # New migration file under internal/database/migrations/<module>
make migrate-force V=1 MODULE=core     # Force a track to a specific version if the migrate state is stuck
make migrate-version                   # Show current version of both tracks

make seed-core                         # Run internal/database/seeders/core/*.sql in filename order (via psql)
make seed-features                     # Same, for seeders/features
make seed                              # Both
make db-reset                          # DROP + recreate DB, then db-setup (destructive)
```

Seeders are plain `.sql` files executed in lexical filename order by `psql` (see `Makefile`) — not a migration framework. When a migration adds a table that another table/query depends on (e.g. a join table meant to be derived from existing rows), the corresponding seeder must populate it too; the migration's own backfill only runs once, against whatever data existed at migration time.

### Testing

```bash
go test ./internal/modules/core/auth/...   # One package
go test -run TestName ./path/to/pkg        # One test
make test                                  # go test -v -race -count=1 ./...
make test-coverage                         # + coverprofile, then `go tool cover -func`
make test-short                            # go test -short (skips integration-tagged tests)
make test-api BASE_URL=... [BAIL=--bail]   # Black-box API tests against a running server (tests/run-api-tests.sh)
```

`make test-api` requires the server running (default `http://localhost:8000`) and a seeded database — it drives real HTTP requests, not Go tests.

## Architecture

### Multi-tenancy is hierarchical, not flat company_id

Tenants (`core.tenants`) form a tree via `parent_id`, typed by `tenant_type`: `ROOT` (Rektorat/Universitas) → `FACULTY` → `DEPARTMENT` → `UNIT`. A user's home tenant is `users.tenant_id`; a JWT is scoped to one **active** tenant at a time (`claims.TenantID`), switched via `POST /core/v1/auth/switch-tenant`.

- `root_superadmin` bypasses tenant scoping entirely and can switch into any tenant.
- Every other user can only switch into tenants they have a row for in `core.user_has_tenants` (`user_id, tenant_id, role_id`) — checked server-side by `UserRepository.HasTenantAccess`. This table is **not** auto-populated by migrations alone; the `003_users_and_accounts.sql` core seeder must insert into it whenever it inserts/updates a user's `tenant_id`, or switch-tenant silently breaks for every non-root account after a fresh `db-reset`.
- `GET /core/v1/auth/my-tenants` returns the tenants a caller may switch into (all tenants for root, or their `user_has_tenants` rows otherwise) — this is what feeds a tenant-switcher UI; it is not an authorization check by itself.
- Repository queries that return tenant-scoped data must filter by `tenant_id` derived from JWT claims (`middleware.GetUserFromContext`), never from client-supplied input (header/body) — an `X-Tenant-ID` header exists for a few explicitly-public listing endpoints and the superadmin switcher path only.
- `middleware.TenantContext()` (global) and `middleware.RequireTenantContext()` (opt-in) manage a separate context-key-based tenant value (`ContextKeyTenantID` etc.) used by very little code today; prefer reading tenant scope from JWT claims directly unless you've confirmed a handler actually consumes those context keys.

### Module structure

Every domain module (`internal/modules/{core,features}/<name>/`) follows:

```
<name>/
├── domain/              # Entities (plain structs, `db`/`json` tags)
├── dto/                 # Request/response DTOs with `binding` validation tags
├── handler/              # Gin handlers
├── repository/          # pgx queries
├── service/              # Business logic, defines narrow interfaces over repos for testability/mocking
└── main.<name>.go        # Initialize(db, ...) *Module + SetupRoutes(router *gin.RouterGroup)
```

`core` modules: `auth`, `user`, `role`, `tenant`. `features` modules: `event` (+ categories), `registration`, `payment`, `attendance`, `certificate`, `content` (articles/galleries), `support`, `testimonial`. All modules are wired in [internal/router/router.go](internal/router/router.go) under two route groups: `/core/v1/...` and `/features/v1/...`. A few `Initialize()` signatures differ (e.g. `certificate.Initialize` takes a `context.Context` and returns an error) — check the module's `main.*.go` before assuming the common `Initialize(db)` shape.

Service layers commonly declare a local interface (e.g. `TenantRepository`, `UserRepository` in `auth/service`) satisfied by the concrete repository *and* a test mock, rather than depending on the concrete repo type directly — follow this pattern when adding cross-module service dependencies.

### Auth & RBAC

- Chain: `middleware.JWTAuth()` (validates JWT, populates request context via `middleware.SetUserContext`) → `middleware.RequireRole(...)` and/or `middleware.RequirePermission(...)` for authorization. There is no `RequireAllRoles`/`RequireAnyPermission`/`RequireAllPermissions` — only `RequireRole(roles ...string)` (any-of) and `RequirePermission(permission string)` exist; don't assume the richer set without checking `internal/middleware/role.go`.
- Permissions are resolved and cached per `(userID, tenantID)` by `internal/shared/authz.Service`, Redis-backed with a TTL (`cfg.Redis.PermissionTTL`); if Redis is unreachable at boot, the app falls back to direct DB lookups (dev-only fallback — production requires Redis, see `router.Setup`).
- `POST /core/v1/auth/switch-tenant` issues a new JWT scoped to the target tenant with fresh permissions for that tenant.
- Read claims via `middleware.GetUserFromContext(c)` / `middleware.MustGetUserFromContext(c)`, not by re-parsing the Authorization header.

### Responses & errors

Use [internal/shared/response/](internal/shared/response/): `response.Success`, `response.SuccessWithPagination` (not `Paginated`), `response.Error`, `response.ValidationError`. Handlers should not build the JSON envelope by hand.

### Logging

Structured logging via `pkg/logger` (Zap + Ginzap middleware): colored console/Debug in development, JSON/Info in production. Fatal logger calls in `cmd/api/main.go` intentionally crash boot (missing JWT secret, DB connection failure).

### OpenAPI contract

`docs/openapi.yaml`/`docs/openapi.json` are served statically at `/openapi.yaml`/`/openapi.json` and are the source of truth consumed by other repos in the monorepo (e.g. frontend's `api-contract-reader`). Keep them in sync when changing request/response shapes — `docs/api-contract/` and `docs/features/` hold supporting contract docs per module.

## Common Gotchas

- **Migration tracks are independent**: `make migrate-version`/`migrate-down`/`migrate-force` all require `MODULE=core` or `MODULE=features`; forgetting it fails fast with an explicit error from the Makefile target.
- **Seeder/migration drift**: a migration's one-time `INSERT ... SELECT` backfill (e.g. `000012_create_user_tenant_access.up.sql`) only sees rows that exist *at migration time* — on a fresh `db-reset`, migrations run before seeders populate any users, so that backfill is a no-op. If a table is meant to always mirror seeded user data, the seeder must populate it explicitly (see `user_has_tenants` above).
- **`.env`** is loaded both by the app config and directly by `make` (`include .env`) — keep `DB_*` vars there in sync with `config.Load()`'s expectations.
- Hot reload is Air (`.air.toml`), build errors logged to `build-errors.log`.
