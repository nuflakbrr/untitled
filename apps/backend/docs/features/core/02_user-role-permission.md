# Backend Feature: Pengguna, Jabatan & Hak Akses - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Core / User, Role, & Permission Management  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL + Redis Cache

---

## 1. Arsitektur PBAC Database

- **Tabel**:
  - `users`: Identitas user, email, nama, status banned, ban reason, ban expires.
  - `roles`: Master jabatan (`superadmin`, `panitia`, `scanner`, `peserta`).
  - `permissions`: Master izin atomic (39 permissions).
  - `role_has_permissions`: Pivot relasi role $\leftrightarrow$ permission.
  - `_role_to_user`: Pivot relasi user $\leftrightarrow$ role.

---

## 2. Operasi Endpoint

- `GET /core/v1/users`: List pengguna dengan pagination dan filter role.
- `POST /core/v1/users`: Tambah akun baru (Superadmin only).
- `PUT /core/v1/users/:id`: Edit profil atau role user.
- `PATCH /core/v1/users/:id/ban`: Ban / unban user sementara atau permanen.
- `GET /core/v1/roles`: List jabatan dan daftar permissions.
- `PUT /core/v1/roles/:id/permissions`: Assign permissions ke role (Otomatis invalidasi Redis cache).
