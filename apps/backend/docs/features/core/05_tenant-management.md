# Backend Feature: Manajemen Tenant (Universitas & Fakultas) - SITIVENT

> **Version**: 1.0.0  
> **Module**: Core / Tenant Management & Hierarchical Multi-Tenancy  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL + Redis

---

## 1. Konsep Hierarki Tenant

1. **Root Tenant (Rektorat / Universitas)**:
   - `id`: `10000000-0000-0000-0000-000000000001`
   - `type`: `ROOT`, `parent_id`: `NULL`
   - Memiliki wewenang CRUD tenant fakultas dan monitoring agregat seluruh universitas.
2. **Child Tenants (Fakultas / Unit Kerja)**:
   - `type`: `FACULTY`, `parent_id`: `<ID_Rektorat>`
   - Memiliki 1 akun Superadmin Fakultas untuk mengelola event, panitia, kuota, dan sertifikat khusus fakultasnya sendiri.

---

## 2. Arsitektur Data `tenants`

- **Tabel**: `tenants`
  - `id`: VARCHAR(36) PK
  - `name`: Nama institusi / fakultas (contoh: "Fakultas Ilmu Komputer")
  - `slug`: Identifier URL unik (contoh: "fasilkom")
  - `code`: Kode singkatan unik (contoh: "FASILKOM")
  - `type`: `ROOT`, `FACULTY`, `DEPARTMENT`, `UNIT`
  - `parent_id`: FK self-referencing ke `tenants(id)`
  - `logo_url`, `website`, `description`, `settings` (JSONB)
  - `created_at`, `updated_at`, `deleted_at`

---

## 3. Middleware Tenant Scoping (`middleware.TenantContext()`)

1. Mengidentifikasi konteks tenant dari:
   - Claim JWT `tenant_id` (untuk pengguna terotentikasi).
   - Header `X-Tenant-ID` / Query param `?tenant_id=` (untuk request publik / switcher).
2. Menyimpan `TenantID` ke dalam `gin.Context`.
3. Handler dan Repository secara otomatis memfilter kueri data berdasarkan `TenantID` tersebut.
