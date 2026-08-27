# Event Module - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Modul utama penyelenggaraan event kampus yang mengelola informasi acara per fakultas/rektorat, pembicara, fasilitas, kuota, harga, dan siklus hidup penerbitan event.

---

## 1. Skema & Atribut Data Event

Tabel PostgreSQL `events` mencakup atribut:

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36) PK` | Identifier unik event (UUID v4) |
| `tenant_id` | `VARCHAR(36) NOT NULL` | Relasi FK ke `tenants(id)` (Fakultas / Rektorat) |
| `title` | `VARCHAR(255)` | Judul event |
| `slug` | `VARCHAR(255) UNIQUE` | URL-friendly identifier yang digenerate otomatis |
| `description` | `TEXT` | Konten deskripsi kaya format HTML (Tiptap / RichText) |
| `banner` | `TEXT` | URL gambar cover/banner di ImageKit / GCS |
| `start_date` | `TIMESTAMPTZ` | Tanggal mulai acara |
| `end_date` | `TIMESTAMPTZ` | Tanggal selesai acara |
| `start_time` | `VARCHAR(10)` | Waktu mulai (contoh: "09:00") |
| `end_time` | `VARCHAR(10)` | Waktu selesai (contoh: "17:00") |
| `location` | `VARCHAR(255)` | Lokasi fisik (ruang aula fakultas) atau link online |
| `event_type` | `event_type` | Enum: `ONLINE` atau `OFFLINE` |
| `online_attendance` | `BOOLEAN` | Flag apakah presensi dapat dilakukan secara daring |
| `meeting_link` | `TEXT` | URL pertemuan virtual (Zoom / Google Meet) untuk event online |
| `registration_deadline` | `TIMESTAMPTZ` | Batas akhir penerimaan pendaftaran peserta |
| `quota` | `INTEGER` | Kapasitas maksimal peserta |
| `price` | `INTEGER` | Harga tiket dalam Rupiah (`0` = Gratis) |
| `status` | `event_status` | Enum: `DRAFT`, `PUBLISHED`, `CLOSED`, `COMPLETED` |
| `certificate_enabled` | `BOOLEAN` | Flag apakah event menerbitkan sertifikat digital |
| `published_at` | `TIMESTAMPTZ` | Waktu publikasi ke publik |
| `category_id` | `VARCHAR(36)` | Relasi FK ke `event_categories(id)` |
| `created_by_id` | `VARCHAR(36)` | Relasi FK ke `users(id)` panitia pembuat event |
| `deleted_at` | `TIMESTAMPTZ` | Waktu soft delete |

---

## 2. Isolasi Event per Tenant (Fakultas / Rektorat)

1. **Event Fakultas (Child Tenant)**:
   - Panitia Fakultas hanya dapat membuat, melihat, dan mengedit event dengan `events.tenant_id = user.tenant_id`.
   - Kuota peserta dan registrasi dikelola independen oleh panitia fakultas terkait.
2. **Event Universitas (Root Tenant)**:
   - Rektorat dapat membuat event berskala universitas (`events.tenant_id = root_tenant_id`) seperti Dies Natalis, Kuliah Umum Rektor, atau Wisuda.
3. **Katalog Publik Gabungan**:
   - Pengunjung publik dapat melihat seluruh event dari semua fakultas dengan filter interaktif berdasarkan fakultas (`?faculty=fasilkom`).
