# Frontend↔Backend Gap Closure — Handoff

## Why this exists

User directive: "aku gamau frontend ada gap dengan backend, berlaku untuk semua endpoint yang ada di backend." A full route audit (backend `internal/router/router.go` + every module's `main.*.go` vs frontend `src/auth/actions.ts` + `src/lib/api/*`) found a large surface of backend endpoints with no frontend caller, plus one real architecture bug (not just a missing feature). This file tracks that closure effort across sessions.

## Status

- [x] **#1 — Fix article/faq/site-content backend mismatch** (DONE, verified live in browser)
- [ ] #2 — Admin UI: Event + Event Category CRUD
- [x] **#3 — Admin UI: user ban/unban controls** (DONE: server action + controls in user table)
- [x] **#4 — Admin UI: permission master-data CRUD** (DONE on this branch)
- [ ] #5 — Admin UI: tenant payment gateway config
- [ ] #6 — Admin UI: audit log viewer
- [ ] #7 — Feature: attendance scan + stats UI
- [ ] #8 — Feature: payment proof upload + admin verification
- [ ] #9 — Feature: certificate template editor + generation UI
- [ ] #10 — Feature: registration admin list/export + cancel UI
- [ ] #11 — Feature: support inbox + public contact form
- [ ] #12 — Admin UI: gallery CRUD

Work through in this order (roughly cheapest/highest-value first) unless a task blocks another.

## #1 — done, what changed

**Root cause**: `apps/frontend/src/lib/api/{articles,faq,site-content}.ts` and `endpoints.ts` targeted a `marketplace-be` API contract (`/api/articles`, `/api/faq`, `/api/site-content`) that does not exist anywhere in this monorepo. The real backend (`apps/backend`) serves `/features/v1/articles` with a completely different response shape. This meant the article module built this week was invisible to the public site.

**Backend** (`apps/backend/internal/modules/features/content/`):
- `dto.ArticleQuery` gained `Search` (`form:"search"`, ILIKE on title) and `CategoryID` (`form:"category"`, uuid) — the frontend already sent these params but the backend silently ignored them.
- `ArticleRepository.FindAll` signature grew two params (`search, categoryID string`) to apply those filters. `ContentService.ListArticles` and both test fakes (`content_test.go`, `content_coverage_test.go`) updated to match.
- `docs/openapi.yaml`/`docs/openapi.json` updated for the new query params. Also fixed **4 pre-existing YAML indentation bugs** (`/features/v1/events`, `/events/{id}`, `/events/{slug}`, `/event-categories` were at column 0 instead of nested under `paths:`) that made the whole file YAML-invalid — unrelated to this task, found while validating.

**Frontend** (`apps/frontend/src/lib/api/`):
- `endpoints.ts`: `articles.list/details/categories` repointed to `features/v1/articles`, `features/v1/articles/by-slug/{slug}`, `features/v1/article-categories`. `faq`/`siteContent` **left untouched** — apps/backend has no such module at all, so per the user's own scope ("endpoints yang ada di backend") there's nothing to wire up. Comment updated so the next person doesn't go looking for a `marketplace-be` service that isn't part of this repo.
- `articles.ts`: added `rawArticleSchema`/`rawArticleCategorySchema` matching the real backend DTOs (backend has no `excerpt`/`author`/`published_at`/nested category object — only `id, tenant_id, title, content, cover, slug, created_by_id, category_ids[]`, and categories are just `{id, name}`, no slug). Added `toArticleListItem()` / `toExcerpt()` mapping helpers so the **public type shapes (`ArticleListItem`, `Article`, `ArticleCategory`) and every consuming component are unchanged** — `article-item.tsx`, `article-list.tsx`, `article-details-view.tsx`, `article-filters.tsx` needed zero edits.
  - `excerpt` ← first ~160 chars of `content` with HTML tags stripped.
  - `author` ← fixed generic label `"Tim Redaksi"` (backend only has `created_by_id`, no public display name — revisit if/when the backend exposes one).
  - `published_at` ← always `null`; UI already falls back to `created_at` (`fDate(article.published_at ?? article.created_at)`).
  - `category` ← resolved from `category_ids[0]` against a `Map<id,name>` built from `getArticleCategories()`, fetched alongside the article list/detail request. `ArticleCategory.slug` is populated with the category **id** (backend has no slug column) — safe because nothing routes on it, it's only used as the `?category=` filter value and a React key.
- Verified live: created a real category + article via the API, loaded `/article` and `/article/[slug]` in a browser, confirmed cover image / excerpt / category badge / category-filter chip all work against real data, then deleted the test records.

## Remaining gaps and audit context

### Re-audit 2026-08-30

- Confirmed gap: backend `POST /core/v1/users/:id/ban` and `/:id/unban` had no frontend caller although user rows already expose `banned`. Added admin controls backed by server actions; ban requests use a server-owned audit reason and both paths revalidate the user list.
- Stale item corrected: permission master-data CRUD and role-permission linking are already integrated under `/dashboard/access/permissions` and `/dashboard/access/roles`.
- Verified: full Bruno API suite passed (104 requests, 204 tests); a temporary account completed ban → status read → unban → cleanup; browser smoke test completed the same UI toggle without console errors.

From the original audit (module → backend routes unused by frontend):

- **Event/EventCategory** (`/features/v1/events`, `/event-categories`): all 6 write endpoints exist; `/dashboard/events` page is an explicit disabled placeholder ("coming Sprint 7.2"). Only public `GET` list/detail are wired.
- **User ban/unban**: `POST /core/v1/users/:id/ban`, `/:id/unban` exist, zero frontend caller. Cheapest task — just a dialog + two server actions on the existing users admin page.
- **Permission master data**: `POST/PUT/DELETE /core/v1/roles/permissions(/:id)` exist. Frontend only wires role↔permission *linking* (`PUT /roles/:id/permissions`), never permission CRUD itself.
- **Tenant payment gateway**: `GET/PUT /core/v1/tenants/:id/payment-gateway` exist (iPaymu creds + manual bank), zero UI.
- **Audit log**: `GET /core/v1/audit-logs` exists, 0% used — no viewer anywhere.
- **Attendance**: `POST /features/v1/attendances/scan`, `GET .../event/:eventID/stats` exist, 0% used — no check-in/scanner UI, no stats dashboard.
- **Payment verification**: `POST /payments/:id/proof` (participant proof upload), `POST /payments/:id/verify` (admin approve/reject), `GET /payments/registration/:id` — all unused.
- **Certificates**: `PUT/GET /certificates/templates/event/:eventID`, `POST /certificates/event/:eventID/generate`, `GET /certificates/jobs/:id` — no template editor, no generate/monitor UI.
- **Registrations admin**: `GET /registrations/event/:eventID` (+`/export`), `DELETE /registrations/:id` — no per-event registrant list/export for panitia, no cancel button for participants.
- **Support**: entire `support-messages` module (create/list/update-status) has no frontend caller — no public contact form, no admin inbox.
- **Gallery admin**: `POST/PUT/DELETE /features/v1/galleries` unused; public `GET` is called via a raw `fetch` in `src/lib/api/events.ts` that bypasses the normal `apiFetch`/ky lane — worth normalizing while adding admin CRUD.

## Working pattern established in #1 (reuse this)

1. Read the real backend DTO/handler/repository before touching frontend — don't assume the old contract docs or comments are accurate (they weren't, for content).
2. If the backend is missing a capability the frontend UI already has a control for (search box, filter chips), it's fair game to add a small, additive backend param+filter rather than degrade the UI — that's what "no gap" means in both directions. Keep it minimal (no new migrations, no breaking signature changes beyond adding params).
3. Prefer mapping/derivation in the frontend fetcher over changing every consuming component's prop shape — smaller diff, lower risk.
4. Update `docs/openapi.yaml` **and** regenerate `docs/openapi.json` from it (`python3 -c "import yaml,json; json.dump(yaml.safe_load(open('docs/openapi.yaml')), open('docs/openapi.json','w'), indent=2, ensure_ascii=False)"`) — don't hand-edit the JSON separately, they'll drift.
5. Verify live, not just `tsc:check`/`go build`: sign in as the relevant role via the running dev servers (backend on :8000 via `air`, frontend on :3000 via `next dev`), exercise the real flow with chrome-devtools MCP tools, create-then-delete any throwaway data through the real API.
6. Backend quality gate hook runs `go test` on every edit — expect it to catch every mock/interface signature you forget to update; fix forward, don't fight it.

## Environment notes for whoever continues

- Backend dev server: `air` (hot reload) already running against local Postgres/Redis; Redis was down in this session (`redis-cli ping` refused) — backend has a documented fallback to direct DB queries in dev, so this didn't block anything, but don't be surprised if permission-cache behavior looks uncached.
- Test accounts (password `password` for all): `superadmin.univ@gmail.com` (root_superadmin), `superadmin.fasilkom@gmail.com` / `superadmin.teknik@gmail.com` (tenant-scoped superadmin, useful for cross-tenant boundary testing), `peserta@gmail.com` (participant).
- `apps/backend/tests/api/` is a Bruno suite (`make test-api`) — it now includes tenant/role/user boundary tests added earlier this session (see git log); extend it per feature rather than starting a new suite.
