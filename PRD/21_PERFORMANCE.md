# Performance & Optimization Rules - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Pedoman optimasi performa backend Go, rendering Next.js, efisiensi bandwidth, kueri PostgreSQL, dan in-memory cache Redis.

---

## 1. Backend & Database Optimization (Go 1.25+)

- **Connection Pooling**:
  - Konfigurasi `DB_MAX_CONNS` (default: 25), `DB_MIN_CONNS` (default: 5), dan `DB_MAX_CONN_LIFETIME` (1 jam) untuk efisiensi koneksi PostgreSQL.
- **Redis In-Memory Permission Caching**:
  - Pengecekan permission PBAC membaca dari cache Redis (`user_permissions:{userId}`) untuk respon otorisasi sub-milidetik.
- **Selective Column Queries**:
  - Hindari `SELECT *`. Selalu cantumkan nama kolom spesifik yang dibutuhkan oleh handler dan DTO response.
- **Database Indexing**:
  - Indeks pada kolom relasi foreign key (`event_id`, `user_id`, `category_id`) dan kolom filter sering (`slug`, `status`, `registration_number`).

---

## 2. Frontend & Rendering Optimization (Next.js 16)

- **Turbopack Dev & Build**: Menggunakan Turbopack untuk kompilasi modul super cepat.
- **Dynamic Import & Code Splitting**:
  - Komponen berat yang hanya dipicu oleh interaksi user (seperti camera scanner, player, dan rich editor) wajib dimuat menggunakan `next/dynamic` dengan opsi `{ ssr: false }`.
- **TanStack React Query Cache**:
  - Manfaatkan `staleTime` dan `gcTime` pada React Query untuk mencegah redundant HTTP refetching saat navigasi antar tab halaman.
- **Image Optimization**:
  - Seluruh rendering gambar memanfaatkan komponen `next/image` atau Image component bawaan dengan lazy loading.
