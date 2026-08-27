# Venturo Polyglot Monorepo (Go + Next.js)

Monorepo terintegrasi yang menggabungkan backend (**Golang**) dan frontend (**Next.js 16 + MUI 9**) menggunakan **Turborepo** dan **Bun**.

---

## Struktur Direktori

```text
.
├── apps/
│   ├── backend/             # Golang REST API (Gin + PostgreSQL + Redis)
│   │   ├── cmd/api/main.go
│   │   ├── internal/
│   │   ├── go.mod
│   │   ├── Makefile
│   │   └── package.json     # Turborepo task wrapper
│   └── frontend/            # Next.js 16 (App Router + MUI 9 + Bun)
│       ├── src/
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.ts
├── packages/                # Shared packages (OpenAPI, types, config)
│   └── README.md
├── .husky/                  # Git hooks (pre-commit lint-staged & pre-push tsc)
├── docker-compose.yml       # PostgreSQL & Redis untuk local development
├── Makefile                 # Shortcut commands
├── package.json             # Root workspace (Bun + Turbo)
├── turbo.json               # Turbo pipeline configuration
└── README.md
```

---

## Prasyarat (Prerequisites)

- [Bun](https://bun.sh/) (`>= 1.1.0`)
- [Go](https://go.dev/) (`>= 1.25`)
- [PostgreSQL](https://www.postgresql.org/) & [Redis](https://redis.io/) (lokal / native service)
- [Air](https://github.com/air-verse/air) (untuk Go live reload: `go install github.com/air-verse/air@latest`)
- [golang-migrate](https://github.com/golang-migrate/migrate) (untuk database migration Go: `brew install golang-migrate`)
- _(Opsional)_ [Docker & Docker Compose](https://www.docker.com/)

---

## Panduan Memulai (Quick Start)

### 1. Install Dependencies

```bash
make install
# atau: bun install
```

### 2. Setup Database (PostgreSQL & Redis Lokal)

Pastikan service PostgreSQL dan Redis lokal sudah berjalan (misal via Postgres.app / Homebrew `brew services start postgresql@16 redis`):

Salin file `.env` di backend dan sesuaikan kredensial DB jika diperlukan, lalu jalankan migrasi + seeding:

```bash
cp apps/backend/.env.example apps/backend/.env
make db-setup
```

Salin file `.env` di frontend:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

_(Opsional: Jika ingin menggunakan Docker untuk database, tersedia `make docker-up` dan `make docker-down`)_

### 3. Menjalankan Development Server

Jalankan seluruh service (Frontend + Backend) sekaligus:

```bash
make dev
# atau: bun run dev / turbo dev
```

Atau jalankan masing-masing service secara terpisah:

```bash
make dev-fe   # Hanya jalankan Next.js (port 8002)
make dev-be   # Hanya jalankan Go backend (port 8080)
```

---

## Perintah yang Tersedia (Available Commands)

| Command            | Deskripsi                                                           |
| :----------------- | :------------------------------------------------------------------ |
| `make install`     | Install seluruh workspace dependencies menggunakan Bun              |
| `make dev`         | Menjalankan backend Go dan frontend Next.js secara bersamaan        |
| `make dev-fe`      | Menjalankan frontend Next.js saja                                   |
| `make dev-be`      | Menjalankan backend Go saja (dengan Air hot reload)                 |
| `make build`       | Menjalankan build Go binary & Next.js production bundle             |
| `make lint`        | Menjalankan linting (ESLint di frontend & golangci-lint di backend) |
| `make test`        | Menjalankan testing di seluruh app                                  |
| `make tsc`         | Menjalankan TypeScript type check pada frontend                     |
| `make clean`       | Membersihkan cache Turbo, `.next`, dan `node_modules`               |
| `make db-setup`    | Menjalankan database migration & seeder backend (database lokal)    |
| `make db-reset`    | Drop DB, create ulang, migrasi, dan seeder (database lokal)         |
| `make docker-up`   | _(Opsional)_ Menyalakan PostgreSQL & Redis via Docker Compose       |
| `make docker-down` | _(Opsional)_ Mematikan container PostgreSQL & Redis                 |
