# Backend Feature: Galeri Kegiatan - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Documentation Galleries  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL

---

## 1. Arsitektur Data Galeri

- **Tabel**: `galleries`
  - `id`: VARCHAR(36) PK
  - `title`: Judul dokumentasi
  - `description`: Deskripsi singkat momen
  - `image_url`: URL foto dokumentasi
  - `featured`: Boolean (tampil di highlight landing page)
  - `event_id`: FK ke `events(id)`
  - `created_at`, `updated_at`

---

## 2. Operasi Endpoint

- `GET /features/v1/galleries`: Mengambil daftar foto dengan filter event dan status featured.
- `POST /features/v1/galleries`: Menambah foto dokumentasi baru (Permission: `galleries.create`).
- `DELETE /features/v1/galleries/:id`: Menghapus foto galeri (Permission: `galleries.delete`).
