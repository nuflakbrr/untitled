# Cetak Biru Arsitektur & Panduan Dokumentasi Fitur - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Dokumen ini berfungsi sebagai peta navigasi utama dan pedoman pengembangan untuk programmer dan AI Agent dalam memahami arsitektur, tech stack, alur kerja pengembangan, serta struktur fitur di proyek **SITIVENT** versi **Turborepo Polyglot Monorepo (Go Backend + Next.js Frontend)**.

---

## 1. Ringkasan Tech Stack Monorepo

Aplikasi dibangun menggunakan arsitektur monorepo polyglot terpisah yang diorkestrasi oleh **Turborepo**:

- **Monorepo Manager**: [Turborepo 2.x](https://turbo.build/) + [Bun](https://bun.sh/)
- **Backend API (`apps/backend`)**:
  - **Language**: [Go 1.25+](https://go.dev/) (Golang)
  - **Web Framework**: [Gin](https://gin-gonic.com/) + Ginzap + CORS
  - **Database & Migration**: PostgreSQL 16/17/18 + `golang-migrate` (1 tabel per file migrasi)
  - **Caching & Permission Storage**: Redis 7
  - **Authentication**: JWT HS256 (`golang-jwt/jwt/v5`) + Bcrypt password hashing
  - **Structured Logging**: Uber Zap
  - **Hot Reload**: Air
- **Frontend Web (`apps/frontend`)**:
  - **Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router, Turbopack, React 19.2.6)
  - **UI Design System**: Material UI v9 (`@mui/material`, `@mui/lab`) + Zone/Minimal UI + Tailwind CSS v4
  - **State Management & Caching**: TanStack React Query v5
  - **Form Validation**: React Hook Form + Zod 4.4
  - **HTTP Client**: Ky
  - **Iconography & Motion**: Iconify + Framer Motion 12

---

## 2. Struktur Monorepo (`apps/backend` & `apps/frontend`)

```text
untitled/
├── apps/
│   ├── backend/               # Go Gin REST API Server (:8080)
│   │   ├── cmd/api/main.go    # Entry point & dependency injection
│   │   ├── internal/
│   │   │   ├── database/      # PostgreSQL migrations & pure SQL seeders
│   │   │   ├── handlers/      # Gin HTTP request handlers
│   │   │   ├── middleware/    # Auth, PBAC, Zap, CORS
│   │   │   ├── models/        # Go structs & domain models
│   │   │   ├── repositories/  # PostgreSQL queries & transactions
│   │   │   ├── router/        # Route groups & path mapping
│   │   │   └── services/      # Business logic & domain services
│   │   └── pkg/               # JWT, Logger, Email, Response envelope
│   │
│   └── frontend/              # Next.js 16 App Router (:8002)
│       ├── src/
│       │   ├── app/           # Route Groups: (admin), (participant), (auth), (root)
│       │   ├── components/    # Reusable atomic UI components
│       │   ├── hooks/         # Custom React hooks (useAuth, usePermission)
│       │   ├── layouts/       # Dashboard & Public layout shells
│       │   ├── sections/      # Composite feature view sections
│       │   ├── services/      # Ky API client fetchers + TanStack Query hooks
│       │   ├── theme/         # MUI v9 theme tokens & palette
│       │   └── types/         # TypeScript interface definitions
│       └── package.json       # Bun package scripts
│
├── Makefile                   # Root orchestration commands (dev, build, db-setup)
├── turbo.json                 # Turborepo task pipeline
└── package.json               # Root workspace configuration
```

---

## 3. Alur Kerja Pembuatan Fitur Baru (End-to-End Feature Workflow)

Saat membuat atau memodifikasi fitur di SITIVENT Monorepo, ikuti tahapan berikut secara berurutan:

### Langkah 1: Database Migration & Model (Backend)
1. Buat file migrasi up/down baru di `apps/backend/internal/database/migrations/features/` (1 tabel per file).
2. Tambahkan struct model di `apps/backend/internal/models/`.
3. Jalankan `make db-setup` untuk menguji migrasi dan data seeder.

### Langkah 2: Repository, Service, & Handler (Backend)
1. Buat repository di `apps/backend/internal/repositories/` dengan parameterized queries.
2. Buat service di `apps/backend/internal/services/` untuk validasi bisnis & transaksi.
3. Buat handler di `apps/backend/internal/handlers/` dan daftarkan rutenya di `apps/backend/internal/router/router.go` dengan middleware permission guard `middleware.RequirePermission("feature.action")`.

### Langkah 3: Types & API Client (Frontend)
1. Definisikan tipe DTO di `apps/frontend/src/types/`.
2. Buat skema validasi form menggunakan Zod di `src/sections/[feature]/schema.ts`.
3. Buat custom React Query hook di `apps/frontend/src/services/[feature].ts` menggunakan client `ky`.

### Langkah 4: UI Implementation & Testing (Frontend)
1. Buat komponen form dan tabel di `apps/frontend/src/sections/[feature]/`.
2. Pasang halaman di route group `apps/frontend/src/app/(admin)/admin/[feature]/page.tsx` atau `(participant)/participant/[feature]/page.tsx`.
3. Pasang guard izin UI menggunakan hook `usePermission`.
4. Jalankan `make lint` dan `make tsc` untuk verifikasi kualitas kode.
