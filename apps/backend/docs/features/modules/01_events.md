# Backend Feature: Manajemen Event - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Event Management  
> **Stack**: Go 1.25+ (Gin) + PostgreSQL + GCS/ImageKit

---

## 1. Arsitektur Data Event

Data event dikelola pada tabel PostgreSQL `events` beserta tabel relasi pendukungnya:

- **Tabel Utama**: `events`
  - `id` (VARCHAR(36) PK)
  - `title`, `slug` (UNIQUE)
  - `description` (HTML rich content)
  - `banner` (Cloud storage URL)
  - `start_date`, `end_date`, `start_time`, `end_time`
  - `location`, `event_type` (`ONLINE`/`OFFLINE`), `online_attendance`, `meeting_link`
  - `registration_deadline`, `quota`, `price`
  - `status` (`DRAFT`, `PUBLISHED`, `CLOSED`, `COMPLETED`)
  - `certificate_enabled`, `published_at`, `category_id`, `created_by_id`, `deleted_at`
- **Tabel Terkait**:
  - `event_categories`: Kategori acara (Seminar, Workshop, Webinar, Kompetisi, Konferensi).
  - `event_speakers`: Pembicara / narasumber (nama, titel, instansi, media sosial, avatar).
  - `event_benefits`: Fasilitas / benefit peserta (judul, deskripsi, ikon, urutan).
  - `certificate_templates`: Template desain sertifikat kustom untuk event terkait.

---

## 2. Alur Siklus Hidup Event (Event Lifecycle)

1. **`DRAFT`**: Status awal saat event dibuat. Tersembunyi dari katalog publik.
2. **`PUBLISHED`**: Event aktif dan tampil di katalog publik untuk menerima pendaftaran peserta baru.
3. **`CLOSED`**: Pendaftaran ditutup (kuota terpenuhi, lewat deadline, atau ditutup manual oleh admin/panitia).
4. **`COMPLETED`**: Event selesai diselenggarakan. Mengizinkan penerbitan sertifikat bagi peserta yang hadir (`CHECKED_IN`).

---

## 3. Validasi & Logika Bisnis (Service Layer)

1. **Validasi Kuota**: Nilai kuota minimal `1` (`quota >= 1`).
2. **Validasi Deadline**: Batas waktu pendaftaran (`registration_deadline`) harus $\le$ tanggal mulai (`start_date`).
3. **Validasi Tanggal**: `end_date >= start_date`.
4. **Proteksi Modifikasi Event Selesai**: Event berstatus `COMPLETED` tidak boleh diubah kecuali oleh pengguna ber-role `superadmin`.
5. **Soft Delete**: Penghapusan data mengisi `deleted_at = NOW()` tanpa menghapus baris fisik basis data.
