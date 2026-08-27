# Certificate Module - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Modul penerbitan dan verifikasi sertifikat digital dinamis yang dilengkapi dengan _Certificate Template Builder_, dukungan multi tanda tangan elektronik (_E-Signature_), dan verifikasi publik.

---

## 1. Syarat Penerbitan Sertifikat (Issuance Prerequisites)

Sertifikat digital hanya digenerate untuk peserta jika memenuhi ketiga syarat berikut:

1. **Fitur Sertifikat Aktif**: `events.certificate_enabled === true`.
2. **Kehadiran Terkonfirmasi**: Peserta telah melakukan check-in dengan `registrations.status === 'CHECKED_IN'`.
3. **Event Selesai / Terkonfirmasi**: `events.status === 'COMPLETED'` atau panitia memicu generate sertifikat.

---

## 2. Skema & Model Desain Sertifikat

### A. Template Sertifikat (`certificate_templates`)

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36) PK` | Identifier unik template (UUID v4) |
| `event_id` | `VARCHAR(36) UNIQUE` | Relasi 1-to-1 ke tabel `events(id)` |
| `background_url` | `TEXT` | URL gambar latar sertifikat di ImageKit / GCS |
| `number_template` | `VARCHAR(255)` | Pola nomor sertifikat (default: `CERT/{SLUG}/{REG_NO}`) |
| `number_mode` | `cert_number_mode` | Enum: `AUTO` atau `MANUAL` |
| `show_issued_date` | `BOOLEAN` | Menampilkan tanggal terbit sertifikat |
| `show_event_date` | `BOOLEAN` | Menampilkan tanggal event |
| `show_event_location` | `BOOLEAN` | Menampilkan lokasi event |
| `show_header` | `BOOLEAN` | Menampilkan header atas |
| `header_text` | `VARCHAR(255)` | Teks judul header (default: "SITIVENT") |
| `header_subtitle` | `VARCHAR(255)` | Subjudul header |
| `header_font` / `header_color` | `VARCHAR(100)` | Tipografi dan warna header |
| `title_font` / `title_color` | `VARCHAR(100)` | Tipografi dan warna judul sertifikat |
| `content_font` / `content_color` | `VARCHAR(100)` | Tipografi dan warna teks isi sertifikat |
| `primary_color` | `VARCHAR(50)` | Warna aksen utama template |
| `footer_margin_bottom` | `INTEGER` | Jarak margin bawah footer |

### B. Tanda Tangan Elektronik (`certificate_signatures`)

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36) PK` | Identifier unik tanda tangan (UUID v4) |
| `template_id` | `VARCHAR(36)` | Relasi FK ke `certificate_templates(id)` |
| `name` | `VARCHAR(255)` | Nama penandatangan (contoh: "Dr. Budi Santoso, M.Kom.") |
| `title` | `VARCHAR(255)` | Jabatan penandatangan (contoh: "Ketua Pelaksana") |
| `signature_url` | `TEXT` | URL gambar tanda tangan PNG/WebP transparan |
| `order` | `INTEGER` | Urutan penataan posisi tanda tangan |

### C. Rekod Sertifikat Terbit (`certificates`)

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36) PK` | Identifier unik sertifikat (UUID v4) |
| `registration_id` | `VARCHAR(36)` | Relasi FK ke `registrations(id)` |
| `event_id` | `VARCHAR(36)` | Relasi FK ke `events(id)` |
| `user_id` | `VARCHAR(36)` | Relasi FK ke `users(id)` penerima |
| `certificate_number` | `VARCHAR(255) UNIQUE` | Nomor seri sertifikat yang telah di-resolve |
| `template_url` | `TEXT` | Snapshot background template |
| `pdf_url` | `TEXT` | Link unduh file PDF sertifikat |
| `download_url` | `TEXT` | Link unduh file gambar PNG sertifikat |
| `download_time` | `TIMESTAMPTZ` | Waktu pertama kali peserta mengunduh sertifikat |

---

## 3. Halaman Verifikasi Publik (`/certificates/:id`)

- Siapapun (publik, institusi, recruiter) dapat memvalidasi keaslian sertifikat melalui URL publik `/certificates/[id]` atau pemindaian QR Code di bagian bawah sertifikat fisik/digital.
- Halaman menampilkan nama lengkap peserta, judul event, tanggal acara, status keabsahan, dan identitas penandatangan.
