# Contributing & Development Workflow - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Pedoman alur kerja pengembangan, batasan AI Agent, dan konvensi git commit untuk monorepo polyglot.

---

## 1. Panduan Pengembangan untuk AI Agent

Saat menghasilkan atau memodifikasi kode di repository ini, AI wajib:

- **Mematuhi Arsitektur Monorepo**: Menempatkan kode backend di `apps/backend/` dan antarmuka di `apps/frontend/`.
- **Menggunakan Stack yang Tersedia**: Dilarang menginstal library alternatif jika pustaka yang setara sudah ada.
- **Mempertahankan Type Safety**: Dilarang menggunakan tipe `any` di TypeScript maupun `interface{}`/`any` serampangan di Go.
- **Memvalidasi Hak Akses**: Setiap endpoint administratif di Go wajib dilindungi middleware `middleware.RequirePermission("module.action")`.
- **Menjaga Granularitas Migrasi**: Setiap tabel baru harus memiliki file migrasi up/down mandiri (`1 migration = 1 table`).
- **Idempotent Seed**: Seluruh seeder SQL wajib menggunakan klausa `ON CONFLICT`.

---

## 2. Batasan AI Agent (Restrictions)

AI Agent **DILARANG KERAS**:

1. Mengubah struktur monorepo Turborepo yang sudah berjalan.
2. Mengabaikan validasi keamanan dan role guard di middleware backend.
3. Melakukan hardcode nilai kredensial atau rahasia langsung di source code.
4. Menghapus guard keamanan (seperti self-deletion check atau superadmin protection).
5. Menggunakan Docker secara paksa jika user meminta workflow native local setup.

---

## 3. Konvensi Git Commit (Conventional Commits)

Format pesan commit mengikuti standar **Conventional Commits**:

```text
<type>(<scope>): <short summary>

[optional body]
```

Contoh:

```bash
git commit -m "feat(backend): add QR code scan endpoint for event attendance"
git commit -m "fix(frontend): resolve phone-input typescript type errors"
git commit -m "chore: setup bun package manager and ignore lockfiles"
```
