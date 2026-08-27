# Coding Standards & Conventions - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Pedoman standar penulisan kode untuk Go Backend dan Next.js Frontend dalam arsitektur monorepo polyglot.

---

## 1. Standar Pengembangan Backend (Go 1.25+)

1. **Struktur & Package Layout**:
   - Gunakan **Standard Go Project Layout** (`cmd/`, `internal/`, `pkg/`).
   - Kode internal domain dilarang diekspor ke luar `internal/`.
   - Hindari *circular dependency* antar package di dalam `internal/`.

2. **Error Handling & Logging**:
   - Kembalikan error secara eksplisit (`if err != nil { return nil, err }`).
   - Dilarang menggunakan `panic()` di dalam request handler.
   - Gunakan **Uber Zap structured logger** (`logger.Info(...)`, `logger.Error(..., zap.Error(err))`) alih-alih `fmt.Println`.

3. **Database Operations & Safe Transactions**:
   - Selalu gunakan parameterized queries (`$1, $2, ...`) untuk mencegah SQL Injection.
   - Operasi multi-tabel (misal: pendaftaran event + pemotongan kuota) wajib dibungkus dalam transaksi `sql.Tx` atau `pgx.Tx` dengan rollback otomatis jika terjadi kegagalan.

4. **Standard Response Envelope**:
   - Seluruh endpoint API wajib mengembalikan format JSON standar melalui `pkg/response`:
     ```json
     {
       "success": true,
       "message": "Event berhasil dibuat",
       "data": { ... },
       "pagination": { "page": 1, "limit": 10, "total": 100 }
     }
     ```

---

## 2. Standar Pengembangan Frontend (Next.js 16 / React 19)

1. **React 19 & App Router Priorities**:
   - Utamakan **React Server Components (RSC)** pada halaman layout dan fetching data awal.
   - Gunakan directive `"use client"` hanya pada komponen yang memiliki state, interactivity, atau browser hooks.

2. **UI & Component Architecture**:
   - Manfaatkan Material UI v9 theme token (`src/theme/`) dan utility classes Tailwind CSS v4.
   - Pisahkan tampilan visual menjadi *Atomic Components* (`src/components/`) dan *Composite Sections* (`src/sections/`).

3. **Form Handling & Validation**:
   - Seluruh formulir wajib menggunakan `react-hook-form` terintegrasi dengan skema validasi `zod` melalui `@hookform/resolvers/zod`.

4. **State Management & Caching**:
   - Gunakan `TanStack React Query` untuk operasi server state (fetching, cache invalidation, optimistic update).
   - Simpan data global auth/user di React Context (`src/auth/`).

---

## 3. Konvensi Penamaan (Naming Conventions)

| Target | Bahasa | Konvensi | Contoh |
| :--- | :--- | :--- | :--- |
| **Go Packages** | Go | Lowercase, single-word | `handlers`, `services`, `models` |
| **Go Structs & Interfaces**| Go | PascalCase | `EventService`, `CreateEventRequest` |
| **Go Functions / Methods** | Go | PascalCase (exported), camelCase (private) | `FindByID`, `validateQuota` |
| **React Components** | TypeScript | PascalCase | `EventCard.tsx`, `PhoneInput.tsx` |
| **Custom Hooks** | TypeScript | camelCase (prefix `use`) | `useAuth.ts`, `usePermission.ts` |
| **Database Tables & Columns**| SQL | snake_case, plural tables | `event_categories`, `created_at` |
| **REST API Endpoints** | HTTP | kebab-case, plural nouns | `/features/v1/event-categories` |
