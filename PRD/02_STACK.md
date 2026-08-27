# Technology Stack - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Seluruh pengembangan fitur wajib memanfaatkan ekosistem stack monorepo yang sudah terpasang. Dilarang menginstal library alternatif tanpa kebutuhan arsitektural yang jelas.

---

## 1. Monorepo & Build Tooling

- **Monorepo Manager**: [Turborepo 2.x](https://turbo.build/) (Pipeline orchestration, task caching)
- **Package Manager / Runtime Tooling**: [Bun](https://bun.sh/) (Frontend & Workspace dependency management)
- **Git Hooks & Quality Gate**: Husky 9 + `lint-staged` + Prettier 3
- **Automation / Make Runner**: GNU Make (Native local setup & optional Docker workflow)

---

## 2. Backend Stack (`apps/backend`)

- **Language**: [Go 1.25+](https://go.dev/) (Golang)
- **Web Framework**: [Gin Web Framework](https://gin-gonic.com/) (`github.com/gin-gonic/gin`)
- **Structured Logging**: [Uber Zap](https://github.com/uber-go/zap) + `gin-contrib/zap`
- **Database Driver & Pooling**: `github.com/lib/pq` / `pgx` (PostgreSQL Connection Pooling)
- **Database Migrations**: [golang-migrate](https://github.com/golang-migrate/migrate) (Modular Core & Features migration tables)
- **In-Memory Cache & Session/Permission Storage**: [Redis 7](https://redis.io/) (`github.com/redis/go-redis/v9`)
- **Authentication & JWT**: `github.com/golang-jwt/jwt/v5` + Bcrypt (`golang.org/x/crypto/bcrypt`)
- **Hot Reload Development**: [Air](https://github.com/air-verse/air)
- **Cloud Storage**: Google Cloud Storage (`cloud.google.com/go/storage`) / ImageKit API
- **Email Service**: Go Native SMTP (`net/smtp`) with HTML template rendering
- **Third-party Integrations**: Firebase Admin SDK (`firebase.google.com/go/v4`)

---

## 3. Frontend Stack (`apps/frontend`)

- **Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router, Turbopack, React Compiler support)
- **UI Library**: [React 19.2.6](https://react.dev/) & `react-dom 19.2.6`
- **Language**: [TypeScript 5.9+](https://www.typescriptlang.org/)
- **UI Design System**: Material UI v9 (`@mui/material`, `@mui/lab`, `@mui/x-date-pickers`, `@mui/material-nextjs`) + Zone/Minimal UI base
- **Styling**: Emotion (`@emotion/react`, `@emotion/styled`) + [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography**: `@iconify/react`
- **Animation & Transitions**: `framer-motion 12.38+`
- **Form Management**: [React Hook Form 7.75+](https://react-hook-form.com/) + [Zod 4.4+](https://zod.dev/) + `@hookform/resolvers`
- **Server State & Caching**: [TanStack React Query v5](https://tanstack.com/query/latest) (`@tanstack/react-query`)
- **HTTP Client**: [Ky](https://github.com/sindresorhus/ky) (Fetch-based HTTP client)
- **Media & Viewer**: `yet-another-react-lightbox`, `react-player`, `embla-carousel-react`
- **Phone Input**: `react-phone-number-input`, `mui-one-time-password-input`

---

## 4. Database & Storage

- **Database**: [PostgreSQL 16/17/18](https://www.postgresql.org/)
- **Primary Keys**: UUID v4 (`VARCHAR(36)` generated via `gen_random_uuid()::text`)
- **Seeding Engine**: Pure Idempotent SQL Scripts (`apps/backend/internal/database/seeders/{core,features}`)
- **Cache & Key-Value Store**: Redis 7

---

## 5. Security & Access Control

- **Architecture**: Permission-Based Access Control (PBAC) with multi-role support
- **Backend Middleware**: `RequireAuth()`, `RequirePermission(perm)`, `RequireRole(role)` with Redis permission cache TTL
- **Frontend Guards**: Route proxy, AuthProvider context, and `usePermission` UI directive
