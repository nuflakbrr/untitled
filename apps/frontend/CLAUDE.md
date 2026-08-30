# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

**Untitled Frontend** (internal codename **SITIVENT**) — Next.js 16 (App Router) + MUI 9 + TypeScript, built on the Zone UI v4.6.0 (Minimals) template. It has grown beyond the original marketing-skeleton scope into the full product frontend for a university event platform: a **public site** (home, events, articles, gallery, registration/checkout), an **admin dashboard** (`/dashboard/*` — access control: users/roles/permissions/tenants, events), and a **participant portal** (`/participant/*` — transactions, certificates, profile), plus shared `/auth/*` sign-in/sign-up.

Data comes from the Go backend (`apps/backend` in this monorepo) through **two distinct lanes** — see "API/data layer" below; don't assume one pattern covers both. Mock data in [src/\_mock/](src/_mock/) only feeds the component gallery and a couple of static fallbacks — do not build new features on mocks.

Step-by-step recipes live in [docs/](docs/): `recipes/add-a-page.md`, `recipes/add-an-api-endpoint.md`, `branding.md` (per-client checklist), `deployment.md`. Treat `docs/distribution.md`'s branch model (`production` / `template-default-4.6.0`) as aspirational, not current state — this repo's actual branches are `main` plus `feat/*` topic branches; no `production` or `template-default-*` branch exists here.

## Commands

Dev server and build run on **port 3000** (`next dev -p 3000` / `next start -p 3000`).

```sh
bun run dev         # start dev server
bun run build       # production build
bun run start       # serve production build

bun run lint        # eslint over src/**/*.{js,jsx,ts,tsx}
bun run lint:fix    # eslint --fix
bun run fm:check    # prettier --check
bun run fm:fix      # prettier --write
bun run fix:all     # lint:fix + fm:fix (run before committing)

bun run tsc:check   # tsc --noEmit --pretty (type-check; primary correctness gate)
bun run tsc:watch   # type-check in watch mode
```

`bun test` is wired as the `test` script but there are currently no `*.test.ts(x)` files in `src/` — `tsc:check` + lint are the real verification gates today, enforced by husky (`pre-commit`: lint-staged; `pre-push`: `tsc:check`) and CI (`Jenkinsfile`: install → lint → fm:check → tsc:check → build). Bun is the package manager and runtime; never commit `package-lock.json`/`yarn.lock`.

**Docker:** `docker compose up -d --build` — multi-stage standalone image on port 80, env from `.env.prod` (gitignored). `NEXT_PUBLIC_*` values are baked in at image **build** time (changing them needs a rebuild, not a restart); server-only vars (`API_URL`, `REVALIDATE_TOKEN`) flow at runtime via compose `env_file`. `output: 'standalone'` only activates when `BUILD_STANDALONE=true`.

## Architecture

### Two separate areas, two different composition patterns

**Public/marketing routes** (`(root)`, `(home)` if present, `(simple)`) strictly follow **page → view → section**:

- `src/app/<route>/page.tsx` — thin Server Component: `metadata`, server-side fetch, renders one `*View`.
- `src/app/<route>/layout.tsx` — wraps in `MainLayout`/`SimpleLayout`.
- `src/sections/<vertical>/view/<name>-view.tsx` — the `'use client'` View composing the page from sections.
- `src/sections/<vertical>/<name>-section.tsx` — presentational building blocks.

**Admin dashboard (`(dashboard)`) and participant portal (`(participant)`)** are flatter: `page.tsx` is an async Server Component that calls `requireSession()`/`requireParticipantSession()` (redirects to sign-in / 403 if unauthorized) and renders MUI + form/CRUD components directly or from local files alongside the route (e.g. `access-resource-page.tsx`, `admin-crud.tsx`) — there is no `sections/dashboard/view/...` layer to mirror. Don't force the marketing pattern onto these routes.

When adding a marketing page, follow the chain above (see `docs/recipes/add-a-page.md`). When adding a dashboard/participant page, look at a sibling under `src/app/(dashboard)/dashboard/access/` first.

### API/data layer — two lanes, do not mix them

1. **Public content lane** — [src/lib/api/](src/lib/api/), reference impl [src/lib/api/articles.ts](src/lib/api/articles.ts). Unauthenticated `ky` instance (`src/lib/api/client.ts`) that injects an `X-Company-Slug` header (from `NEXT_PUBLIC_COMPANY_SLUG`) and unwraps the `{ data, message, meta, errors }` envelope into a typed `ApiError` on failure. Pattern: `endpoints.ts` entry → zod schema at the fetch boundary (no `as`-casts) → fetcher via `apiFetch` → query-key factory → `'use client'` hooks in `use-*.ts` (intentionally not re-exported from the barrel — server code must not import client hooks). Three data-flow modes by SEO/interactivity need: RSC props with static fallback (home hero), prefetch + `HydrationBoundary` for interactive lists (article list, TanStack SSR — see [src/lib/query/](src/lib/query/)), or pure RSC + `revalidate`/`generateMetadata` (article detail).
2. **Authenticated app lane** — [src/auth/actions.ts](src/auth/actions.ts) + [src/auth/server.ts](src/auth/server.ts). Next.js Server Actions (`'use server'`) call `fetchBackend(path, token, init)` — a plain `fetch` wrapper that attaches `Authorization: Bearer <token>` from the httpOnly session cookie (`SESSION_COOKIE`, set by `signInAction`/`switchTenantAction`). No `X-Company-Slug` header here. This lane drives sign-in/up, `GET /core/v1/auth/me` (session hydration via `sessionFromToken`), tenant switching, and every dashboard/participant CRUD action.

`X-Company-Slug`/"company" naming in lane 1 is this frontend's own vocabulary; the Go backend's actual model is a hierarchical **tenant** (not "company") reached via lane 2's JWT-scoped tenant context — don't assume the two lanes' terminology maps 1:1 when tracing a request into the backend.

### Auth & session

- [src/auth/session-provider.tsx](src/auth/session-provider.tsx) — React Context (`useSession`) wrapping `AuthSession` (user, active tenant, role, permissions, `is_super_admin`); hydrated server-side via `getServerSession()`/`requireSession()` in `src/auth/server.ts`.
- Session token lives in an httpOnly cookie (`SESSION_COOKIE`), never in JS-accessible storage.
- Route protection for `/dashboard/*` happens in **`src/proxy.ts`** (Next.js 16 renamed `middleware.ts` → `proxy.ts`; export is `proxy`, not `middleware`) — redirects to `/auth/sign-in?returnTo=...` when the session cookie is missing. The same file also gates `/components/*` (the gallery, see below) by rewriting to a disabled route unless `NEXT_PUBLIC_SHOW_COMPONENTS=true` or `NODE_ENV=development` — this enforcement must stay in `proxy.ts` because gallery pages are statically prerendered and a layout-level `notFound()` can't gate already-built HTML. `docs/deployment.md` still refers to the old `src/middleware.ts` filename — that's stale, the code is the source of truth.
- Participant routes call `requireParticipantSession()` (redirects admins to `/dashboard`); dashboard pages call `requireSession(permission?)` and/or `hasPermission()` / `isAdminSession()` from `src/auth/types.ts`.

### Component reference gallery

Check `/components` (renders [src/sections/\_examples/](src/sections/_examples/)) before writing any new UI pattern — canonical usage samples for shared components in [src/components/](src/components/) (carousel, animate, hook-form fields, image, lightbox, markdown, icons, etc.). Gating is described above. Several dependencies exist *only* for the gallery (`yet-another-react-lightbox`, `react-phone-number-input`, `@mui/lab`, `mui-one-time-password-input`, embla `fade`/`auto-height`, `@mui/x-date-pickers`) — a client build that strips the gallery can drop them too.

### Routing

All route strings live in [src/routes/paths.ts](src/routes/paths.ts) as `paths` (dynamic routes are functions, e.g. `paths.article.details(slug)`) — don't hardcode URLs. `paths.*` entries have no trailing slash; crawler-facing URLs (canonical/sitemap/JSON-LD) must end in `/` via `pathWithSlash()`. Use the navigation wrappers in [src/routes/hooks/](src/routes/hooks/) and `RouterLink` over raw `next/navigation`/`next/link`.

### Theme, forms, env

- [src/theme/](src/theme/) — CSS-variable-based MUI theme (light/dark). `SettingsProvider`/`SettingsDrawer` ([src/components/settings/](src/components/settings/)) hold runtime user-facing theme state, merged via `theme/with-settings/`; assembled in `src/app/layout.tsx`.
- Forms use **react-hook-form + Zod** via the `Field.*`/`Form` wrappers in [src/components/hook-form/](src/components/hook-form/) — do not use raw MUI inputs in forms. Samples at `/components/form-validation`.
- [src/lib/env.ts](src/lib/env.ts) is the *only* place env vars are read (zod-validated at module load — a missing/malformed required var fails the build with a clear message); consume via `CONFIG` in [src/global-config.ts](src/global-config.ts), never `process.env` directly (exception: `src/proxy.ts`, its own bundle).

## SEO rules

- Root layout owns the title template (`%s - Venturo`), default description, OG/Twitter defaults, and `opengraph-image.png`/`twitter-image.png`. Page-level `openGraph` REPLACES the root's whole object — restate everything (see `src/app/(home)/page.tsx` if present, or the relevant `(root)` page).
- Above-the-fold/LCP content must be visible in SSR HTML: no entry animations on hero H1/CTA; hero images use `visibleByDefault` + `fetchPriority: 'high'`.
- `NEXT_PUBLIC_SITE_URL` is required for production builds.

## Conventions

- **Path alias:** import internal modules as `src/...` (absolute, `baseUrl: "."`). ESLint's `perfectionist` plugin sorts imports into ordered groups (mui → routes → hooks → utils → internal → components → sections → types → relative) by line length ascending — let `bun run fix:all` handle ordering.
- SVGs import as React components via `@svgr/webpack` (webpack + turbopack, see `next.config.ts`).
- `trailingSlash: true` globally — generated URLs end in `/`.
- Prettier: single quotes, semicolons, `printWidth: 100`, `trailingComma: es5`.
- ESLint disables `@typescript-eslint/no-explicit-any`, enforces `consistent-type-imports`; unused imports/vars are auto-removable warnings (prefix intentionally-unused vars with `_`).
- Files are kebab-case; barrel `index.ts` files re-export from each directory.
- Env vars: copy `.env.example` to `.env` (documents every variable); `.env` itself is gitignored.
