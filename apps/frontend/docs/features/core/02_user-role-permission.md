# Frontend Feature: Manajemen Pengguna & Hak Akses UI - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: User & PBAC Management UI  
> **Stack**: Next.js 16 + Material UI v9 + TanStack Query

---

## 1. Manajemen Pengguna (`src/sections/admin/users/`)

- Daftar seluruh user dengan badge status (`Active`, `Banned`) dan role.
- Modal tambah user baru (Superadmin only) dan edit role pengguna.
- Aksi pembekuan akun (Ban/Unban) dengan form alasan dan batas kedaluwarsa ban.

---

## 2. Manajemen Role & Permission (`src/sections/admin/roles/`)

- Matriks perizinan (*Permission Matrix Checklist*) untuk 39 hak akses.
- Menyimpan perubahan izin role secara langsung ke backend dengan invalidasi cache.
