# Architecture Principles & Design - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> **Paradigm**: Hierarchical Multi-Tenant (Universitas & Fakultas), Turborepo Polyglot Monorepo, Go Clean Architecture (Gin REST API), Next.js 16 App Router, Multi-Tenant PBAC Access Guard

---

## 1. Prinsip Utama Desain Monorepo & Multi-Tenancy

1. **Hierarchical Multi-Tenant Isolation**:
   - **Root Tenant (Rektorat / Universitas)**: `parent_id = NULL`, `type = ROOT`. Memiliki hak kelola global seluruh fakultas dan penyelenggaraan event universitas.
   - **Child Tenants (Fakultas / Departemen)**: `parent_id = <ID_Rektorat>`, `type = FACULTY`. Mengelola event, kuota, panitia, scanner, dan sertifikat khusus fakultasnya sendiri.
   - **Tenant Scoping Middleware**: Backend menyuntikkan `tenant_id` secara otomatis ke dalam query context berdasarkan claims JWT pengguna atau header `X-Tenant-ID`.

2. **Polyglot Monorepo Separation**:
   - `apps/backend/`: Layanan REST API performa tinggi berbasis **Go 1.25+ (Gin)** yang menangani seluruh operasi basis data, transaksi multi-tenant, autentikasi JWT, antrean email, verifikasi pembayaran, dan presensi QR.
   - `apps/frontend/`: Aplikasi antarmuka berbasis **Next.js 16 (React 19)** yang melayani portal publik, dashboard admin panitia fakultas/rektorat, dan dashboard peserta mandiri.
   - `packages/`: Paket utilitas dan tipe bersama antarlayanan monorepo.

3. **Clean Layered Architecture di Backend (`apps/backend`)**:
   - **Handler Layer (`internal/handlers/`)**: Menangani binding HTTP request, validasi struct, dan format response standard envelope (`pkg/response`).
   - **Service Layer (`internal/services/`)**: Inti logika bisnis, validasi aturan domain multi-tenant, dan orkestrasi antar-repository.
   - **Repository Layer (`internal/repositories/`)**: Abstraksi kueri database PostgreSQL (`sql.Tx`, tenant scoping filters, batching, row locking).
   - **Middleware Layer (`internal/middleware/`)**: JWT extraction, Tenant Context, CORS, Zap structured logging, dan PBAC permission checks via Redis.

---

## 2. Struktur Route & API Endpoints

### A. Next.js 16 Route Groups (`apps/frontend/src/app/`)

```text
src/app/
├── (admin)/               # Panel Administrator Fakultas & Universitas
│   └── admin/
│       ├── dashboard/     # Analitik & ringkasan statistik (Tenant-scoped)
│       ├── tenants/       # Manajemen Tenant Fakultas (Root Superadmin only)
│       ├── events/        # CRUD Event fakultas, kategori, pembicara, fasilitas
│       ├── registrations/ # Manajemen peserta & verifikasi pembayaran
│       ├── attendance/    # QR Scanner & validasi kehadiran
│       ├── certificates/  # Template builder & penerbitan sertifikat fakultas
│       ├── articles/      # Publikasi artikel kampus & fakultas
│       ├── galleries/     # Dokumentasi foto kegiatan fakultas
│       ├── users/         # Manajemen akun panitia & scanner fakultas
│       └── support/       # Tiket pesan bantuan peserta
│
├── (participant)/         # Panel Peserta Mandiri (Universal)
│   └── participant/
│       ├── dashboard/     # Kartu event terdekat dari berbagai fakultas
│       ├── events/        # Riwayat pendaftaran event & tiket QR
│       ├── payments/      # Status pembayaran & form upload bukti transfer
│       ├── certificates/  # Unduh sertifikat digital
│       └── profile/       # Data diri peserta
│
├── (auth)/                # Autentikasi Publik
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── reset-password/
│
├── (root)/                # Portal Landing Page & Katalog Publik
│   ├── page.tsx           # Landing page utama dengan selector fakultas
│   ├── events/            # Katalog event publik dengan filter fakultas
│   ├── articles/          # Berita kampus & artikel fakultas
│   └── gallery/           # Galeri dokumentasi kampus
```

### B. Arsitektur REST API Backend (`apps/backend/`)

1. **Core Module (`/core/v1/`)**:
   - `/auth`: Sign in, Sign up peserta universal, Refresh token, Forgot/Reset password.
   - `/tenants`: CRUD data tenant fakultas, list fakultas publik, switch context.
   - `/users`: Manajemen pengguna, assign role fakultas, pembekuan akun (Ban).
   - `/roles` & `/permissions`: Manajemen jabatan dan matriks perizinan.
   - `/audit-logs`: Riwayat audit trail transaksi sensitif per tenant.
2. **Features Module (`/features/v1/`)**:
   - `/events`: Katalog publik, pencarian, CRUD event fakultas, publikasi.
   - `/event-categories`: Kategori event global & spesifik fakultas.
   - `/registrations`: Pendaftaran event universal, tiket QR token.
   - `/payments`: Upload bukti transfer, verifikasi panitia fakultas.
   - `/attendances`: Check-in scanner kamera, riwayat presensi.
   - `/certificates`: Desain template fakultas, tanda tangan Dekan/Rektor, verifikasi publik.
   - `/articles`, `/galleries`, `/support-messages`, `/uploads`, `/dashboard/stats`.

---

## 3. Pola Keamanan & Otorisasi Berlapis

1. **Token JWT & Tenant Scoping**: Payload JWT memuat `user_id`, `tenant_id`, dan `roles`.
2. **Middleware PBAC Guard**: Validasi izin membaca dari cache Redis `user_permissions:{userId}:{tenantId}`.
3. **Data Scoping Guard**: Repository otomatis menambahkan klausa `WHERE tenant_id = $1` untuk mencegah kebocoran data antar-fakultas. Superadmin Universitas memiliki opsi `view_all` untuk memonitor seluruh fakultas.
