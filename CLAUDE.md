# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Untitled** (internal codename **SITIVENT**) is a hierarchical multi-tenant university event/attendance/certificate platform, run as a Turborepo + Bun polyglot monorepo:

- `apps/backend` — Go 1.25+ / Gin / PostgreSQL / Redis REST API. See [apps/backend/CLAUDE.md](apps/backend/CLAUDE.md) for its architecture (tenant model, module layout, auth/RBAC, testing).
- `apps/frontend` — Next.js 16 / MUI 9 / TypeScript, covering the public site, admin dashboard, and participant portal. See [apps/frontend/CLAUDE.md](apps/frontend/CLAUDE.md) for its architecture (page/view/section vs. dashboard patterns, the two API lanes, auth/session).
- `packages/` — placeholder only today (see `packages/README.md`): intended for shared OpenAPI/type contracts once the frontend or backend splits further; nothing is actually published there yet.

Read the relevant app's `CLAUDE.md` before working inside it — this file only covers what spans both.

**Tenant model, in one line** (detailed in `apps/backend/CLAUDE.md`): tenants form a tree — ROOT (Rektorat/Universitas) → FACULTY → DEPARTMENT → UNIT — not a flat multi-company model; a JWT is scoped to one active tenant, switchable via `/core/v1/auth/switch-tenant` for `root_superadmin` or anyone granted access via `core.user_has_tenants`.

**Deeper product/architecture docs**: [AGENTS.md](AGENTS.md) indexes a 25-file PRD under [PRD/](PRD/) (stack, architecture, coding standards, one file per business module — event/registration/payment/attendance/certificate/emails/uploads — plus auth, security, UI guidelines, testing, contributing). Consult the relevant `PRD/NN_*.md` file for product-level rules (e.g. `17_AUTHORIZATION.md` for the PBAC role set, `07_DATABASE.md` for schema conventions) rather than re-deriving them from code alone.

## Commands

Bun is the package manager (`bun@1.2.4` pinned via `packageManager`); Turbo orchestrates tasks across `apps/*` workspaces.

```bash
make install      # bun install (all workspaces)
make dev          # bun run dev -> turbo dev (backend Air + frontend Next.js together)
make dev-fe       # frontend only: bun run --filter untitled-frontend dev
make dev-be       # backend only: bun run --filter untitled-backend dev (Air hot reload)
make build        # turbo build (both apps)
make lint         # turbo lint (ESLint on frontend, golangci-lint on backend)
make test         # turbo test (frontend `bun test` [no test files yet] + backend `go test`)
make tsc          # turbo tsc:check (frontend only; backend's tsc:check is a no-op stub)
make clean        # turbo clean

make db-setup     # delegates to apps/backend: migrate-up + seed
make db-reset     # delegates to apps/backend: drop/recreate/migrate/seed (destructive)
make docker-up    # optional: postgres:16-alpine + redis:7-alpine via docker-compose.yml
make docker-down
```

`docker-compose.yml` at root is for **local Postgres/Redis only** (ports 5432/6379) — it is not the app deployment compose file; each app has its own Docker setup for building/running the actual services (see each app's `CLAUDE.md`/Dockerfile).

Running a single backend test or a frontend-only type-check: use the app-level commands directly (`cd apps/backend && go test ./path/...`, `cd apps/frontend && bun run tsc:check`) rather than the root Turbo wrapper, which always runs across the whole workspace filter.

## Cross-cutting things to know

- **Two apps, two "tenant" vocabularies**: the backend's real model is `tenant_id` / `core.tenants` (hierarchical). The frontend's public-content API lane (`apps/frontend/src/lib/api/client.ts`) calls it `X-Company-Slug` — its own terminology, not a backend concept. Don't assume a grep for "tenant" or "company" in one app tells you anything about the other; check both `CLAUDE.md`s.
- **Port numbers in prose docs are stale in places**: this root `README.md` says the frontend dev server runs on port 8002; the frontend's actual `package.json` (`next dev -p 3000`) and its own `CLAUDE.md` say 3000. Trust the app's `package.json`/`CLAUDE.md` over the root `README.md` for ports.
- **Migrations vs. seeders can drift**: a migration's one-time backfill (`INSERT ... SELECT` from an existing table) only ever runs once, against whatever data exists *at migration time*. On a fresh `db-reset`, migrations run before any seeder inserts data, so such a backfill is a no-op — the seeder must independently populate anything meant to always mirror seeded rows. See `apps/backend/CLAUDE.md` for a concrete instance of this (`user_has_tenants`).
- Git hooks live in `.husky/` (root-level, shared by both apps via `lint-staged`); `pre-push` runs frontend `tsc:check`.
