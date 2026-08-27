# AI Agents Guidelines - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> **Author**: Naufal Akbar Nugroho  
> **Project**: SITIVENT / Untitled Monorepo  
> **Target Domain**: Sistem Informasi & Manajemen Event Universitas (Hierarchical Multi-Tenant: Rektorat & Fakultas)  
> **Architecture**: Turborepo Monorepo (Polyglot: Go Backend + Next.js Frontend)  
> **Backend**: Go (Golang 1.25+ / Gin Web Framework / Redis / Zap Logger)  
> **Frontend**: Next.js 16 App Router (React 19, Turbopack, Material UI v9 / Minimal Zone UI, Bun)  
> **Database**: PostgreSQL (Hierarchical Multi-Tenant Scoping, UUID PKs, `golang-migrate`, SQL Seeders)  
> **Authentication**: JWT & Multi-Tenant PBAC (Permission-Based Access Control) with Redis Cache  
> **Last Updated**: 2026

Selamat datang di pedoman pengembangan AI SITIVENT (Untitled). Dokumentasi Product Requirement Document (PRD) ini dipecah menjadi beberapa modul terstruktur untuk memudahkan pemeliharaan, referensi teknis, dan kepatuhan arsitektur monorepo polyglot:

---

## Struktur Organisasi Multi-Tenant (Universitas & Fakultas)

1. **Tenant Utama (Rektorat / Universitas)**:
   - Bertindak sebagai Root Tenant (`parent_id = NULL`, `type = ROOT`).
   - Memiliki akun **Superadmin Universitas** dengan wewenang pengawasan global, monitoring lintas fakultas, dan penyelenggaraan event tingkat universitas.
2. **Tenant Children (Fakultas / Unit Kerja)**:
   - Bertindak sebagai Child Tenant (`parent_id = <ID_Rektorat>`, `type = FACULTY`).
   - Memiliki 1 akun **Superadmin Fakultas** untuk mengelola event, panitia, kuota, verifikasi bayar, absensi, dan sertifikat khusus fakultasnya sendiri.
3. **Akun Peserta (Universal)**:
   - Mahasiswa atau peserta umum memiliki akun universal yang dapat mendaftar ke event di fakultas manapun maupun event universitas.

---

## Indeks Dokumentasi PRD

### 1. Tentang Project & Roadmap

1. [01_PROJECT.md](./PRD/01_PROJECT.md) - Tentang SITIVENT, arsitektur multi-tenant universitas, deskripsi sistem, dan roadmap.

### 2. Arsitektur & Setup

2. [02_STACK.md](./PRD/02_STACK.md) - Rincian lengkap teknologi stack (Turborepo, Bun, Next.js 16, React 19, MUI v9, Tailwind v4, Go 1.25+, Gin, PostgreSQL, Redis, Zap).
3. [03_ARCHITECTURE.md](./PRD/03_ARCHITECTURE.md) - Prinsip arsitektur monorepo, tenant context isolation, REST API layer (`apps/backend`), Next.js App Router (`apps/frontend`).
4. [04_FOLDER_STRUCTURE.md](./PRD/04_FOLDER_STRUCTURE.md) - Struktur direktori monorepo (`apps/backend/`, `apps/frontend/`, `packages/`).

### 3. Konvensi & Standar Kode

5. [05_CODING_STANDARDS.md](./PRD/05_CODING_STANDARDS.md) - Standar pengembangan Go (Standard Layout, Gin handlers, Zap logging) dan Next.js (React 19, MUI, Zod forms, aksesibilitas).
6. [06_TYPESCRIPT.md](./PRD/06_TYPESCRIPT.md) - Aturan type safety ketat di frontend, larangan `any`, dan sinkronisasi tipe DTO dengan Backend.
7. [07_DATABASE.md](./PRD/07_DATABASE.md) - Konvensi skema PostgreSQL, tabel `tenants`, foreign keys `tenant_id`, UUID PKs, `golang-migrate`, SQL seeders idempotent.
8. [08_SERVICES.md](./PRD/08_SERVICES.md) - Standar Service Layer: Handlers → Services → Repositories di Go dan Ky + TanStack Query di Next.js.

### 4. Modul Bisnis & Alur Kerja

9. [09_FEATURES.md](./PRD/09_FEATURES.md) - Ringkasan seluruh modul dan fitur multi-tenant sistem SITIVENT.
10. [10_EVENT_MODULE.md](./PRD/10_EVENT_MODULE.md) - Alur kerja event per tenant fakultas/rektorat, kategori, pembicara, fasilitas, online/offline, status lifecycle, dan validasi kuota.
11. [11_REGISTRATION_MODULE.md](./PRD/11_REGISTRATION_MODULE.md) - Alur pendaftaran peserta universal, nomor registrasi, QR token, dan validasi ketersediaan.
12. [12_PAYMENT_MODULE.md](./PRD/12_PAYMENT_MODULE.md) - Alur pembayaran manual, verifikasi bukti transfer panitia fakultas, status pembayaran, refund, dan audit trail.
13. [13_ATTENDANCE_MODULE.md](./PRD/13_ATTENDANCE_MODULE.md) - Mekanisme QR Code, validasi kehadiran offline, HTML5 QR scanner, dan riwayat presensi.
14. [14_CERTIFICATE_MODULE.md](./PRD/14_CERTIFICATE_MODULE.md) - Template builder dinamis fakultas, custom styling/fonts, multi-signature pejabat dekanat/rektorat, dan halaman verifikasi publik.
15. [15_EMAILS.md](./PRD/15_EMAILS.md) - Arsitektur antrean email asinkron (`email_queues`), jenis email transaksional, dan integrasi SMTP Go.
16. [16_FILE_UPLOADS.md](./PRD/16_FILE_UPLOADS.md) - Manajemen media cloud (ImageKit / GCS), kompresi WebP, pemangkasan gambar (cropper), dan pembersihan berkas.

### 5. Keamanan, UI/UX, & Kinerja

17. [17_AUTHORIZATION.md](./PRD/17_AUTHORIZATION.md) - Autentikasi JWT, Multi-Tenant PBAC (Root Superadmin, Tenant Superadmin, Panitia, Scanner, Peserta) dengan cache Redis di Go middleware.
18. [18_SECURITY.md](./PRD/18_SECURITY.md) - Kebijakan keamanan, validasi input Zod/Go validator, isolasi data antar tenant, CSRF/CORS, security headers, dan audit logging.
19. [19_UI_GUIDELINES.md](./PRD/19_UI_GUIDELINES.md) - Pedoman UI/UX modern (Material UI v9, Minimal Zone UI, Tailwind CSS v4, dark/light theme).
20. [20_COMPONENTS.md](./PRD/20_COMPONENTS.md) - Pola komponen Atomic (`components/`), Section blocks (`sections/`), Layouts, TanStack Data Table, Modals, dan Toast.
21. [21_PERFORMANCE.md](./PRD/21_PERFORMANCE.md) - Optimasi kinerja (Turbopack, Next Image, CDN, Redis Caching, Go Connection Pooling).

### 6. Pengujian, Kontribusi, & Dokumentasi

22. [22_TESTING.md](./PRD/22_TESTING.md) - Pengujian backend Go (`go test`), frontend E2E dengan Playwright, dan reset database seed multi-tenant.
23. [23_CONTRIBUTING.md](./PRD/23_CONTRIBUTING.md) - Alur kerja kontribusi monorepo, batasan AI, dan standar Conventional Commits.
24. [24_VERSIONING.md](./PRD/24_VERSIONING.md) - Panduan Semantic Versioning (SemVer), fase pre-release, dan dokumentasi changelog.
25. [25_DOCUMENTATION.md](./PRD/25_DOCUMENTATION.md) - Cetak biru arsitektur global dan workflow pembuatan fitur baru dari awal hingga akhir.
