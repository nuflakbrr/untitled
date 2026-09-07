# Frontend Feature: Manajemen Tenant & Multi-Fakultas UI - SITIVENT

> **Version**: 1.0.0
> **Module**: Tenant Context & Multi-Faculty Architecture
> **Stack**: Next.js 16 (React 19) + Material UI v9 + TanStack Query

---

## 1. Komponen Tenant Switcher (`src/components/tenant-switcher/`)

- **Superadmin Universitas (Rektorat)**:
  - Dropdown di header sidebar untuk beralih konteks antar-fakultas secara instan.
  - Memilih fakultas menyuntikkan `tenant_id` ke header request Ky HTTP client.
- **Superadmin / Panitia Fakultas**:
  - Menampilkan badge nama & logo fakultas terkunci (_locked scope_).

---

## 2. Filter Fakultas di Katalog Publik (`/events`)

- Dropdown tab pemilihan fakultas penyelenggara di halaman katalog:
  - "Semua Fakultas"
  - "Rektorat (Event Universitas)"
  - "Fakultas Ilmu Komputer"
  - "Fakultas Teknik"
  - "Fakultas Ekonomi & Bisnis"
- Mengirim query parameter `?tenant_slug=fasilkom` ke API backend.
