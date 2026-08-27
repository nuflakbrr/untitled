# Folder Structure - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> **Monorepo Layout**: Turborepo, `apps/backend/` (Go Gin REST API), `apps/frontend/` (Next.js 16 App Router), `packages/` (Shared Packages)

```text
untitled/
├── .husky/                                # Git hooks (pre-commit, pre-push)
├── apps/
│   ├── backend/                           # Go REST API Service (Port 8080)
│   │   ├── cmd/
│   │   │   └── api/
│   │   │       └── main.go                # Entrypoint server Go
│   │   ├── internal/
│   │   │   ├── config/                    # Environment & struct configuration
│   │   │   ├── database/                  # PostgreSQL connection & migrations
│   │   │   │   ├── migrations/            # 1 migration 1 table
│   │   │   │   │   ├── core/              # Users, sessions, roles, permissions, audit
│   │   │   │   │   └── features/          # Events, registrations, payments, certs, etc.
│   │   │   │   └── seeders/               # Idempotent pure SQL seeders
│   │   │   │       ├── core/              # Seed permissions, roles, users & accounts
│   │   │   │       └── features/          # Seed event categories, events, galleries, etc.
│   │   │   ├── handlers/                  # HTTP Handlers (Core & Features)
│   │   │   ├── middleware/                # Auth, CORS, Zap logging, PBAC guards
│   │   │   ├── models/                    # Database structs & domain models
│   │   │   ├── repositories/              # SQL queries & database operations
│   │   │   ├── router/                    # Gin routing & endpoint registration
│   │   │   └── services/                  # Business logic & domain services
│   │   ├── pkg/
│   │   │   ├── email/                     # SMTP email service & HTML templates
│   │   │   ├── firebase/                  # Firebase ID token verification
│   │   │   ├── jwt/                       # JWT generation & claim parsing
│   │   │   ├── logger/                    # Uber Zap structured logger
│   │   │   └── response/                  # Standardized JSON response envelope
│   │   ├── .env.example
│   │   ├── Makefile                       # Backend migration, seed, build, and dev commands
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── package.json                   # Turborepo task wrapper for Go
│   │
│   └── frontend/                          # Next.js 16 App Router (Port 8002)
│       ├── public/                        # Static assets, logos, and icons
│       ├── src/
│       │   ├── app/                       # Next.js App Router Route Groups
│       │   │   ├── (admin)/               # Route group dashboard admin
│       │   │   ├── (participant)/         # Route group dashboard peserta
│       │   │   ├── (auth)/                # Route group login/register
│       │   │   ├── (root)/                # Route group public landing & catalog
│       │   │   ├── layout.tsx             # Root layout
│       │   │   └── globals.css            # Global CSS styling
│       │   ├── assets/                    # Static datasets (countries, menu list)
│       │   ├── components/                # Reusable UI components (MUI / Tailwind)
│       │   ├── hooks/                     # Custom React hooks (useAuth, usePermission)
│       │   ├── layouts/                   # Dashboard & Public layout shells
│       │   ├── routes/                    # Route paths & navigation definitions
│       │   ├── sections/                  # Feature-specific UI views & form components
│       │   ├── services/                  # API clients (Ky + TanStack Query)
│       │   ├── theme/                     # MUI v9 Theme configuration & palettes
│       │   ├── types/                     # TypeScript interfaces & DTOs
│       │   └── utils/                     # Formatters, date helpers, storage
│       ├── .env.example
│       ├── package.json                   # Frontend dependencies (Bun)
│       ├── tsconfig.json
│       └── next.config.ts
│
├── packages/                              # Shared packages across apps
│   └── README.md
│
├── PRD/                                   # Product Requirement Documents & Architecture
├── AGENTS.md                              # AI Agent Guidelines & PRD Index
├── Makefile                               # Root commands (make dev, make build, make db-setup)
├── turbo.json                             # Turborepo pipeline configuration
├── package.json                           # Monorepo root workspace configuration (Bun)
└── docker-compose.yml                     # Optional local PostgreSQL & Redis service
```
