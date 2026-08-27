# Attendance & QR Scanner Module - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Modul validasi kehadiran peserta di lokasi acara secara langsung via kamera perangkat (HTML5 QR Scanner) dan pencatatan presensi real-time.

---

## 1. Skema & Atribut Data Kehadiran

Tabel PostgreSQL `attendances` mencakup atribut:

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `VARCHAR(36) PK` | Identifier unik presensi (UUID v4) |
| `registration_id` | `VARCHAR(36) UNIQUE` | Relasi FK ke `registrations(id)` |
| `scan_time` | `TIMESTAMPTZ NOT NULL DEFAULT NOW()` | Waktu tepat saat barcode dipindai |
| `scanner_id` | `VARCHAR(36)` | Relasi FK ke `users(id)` petugas pemindai |
| `status` | `attendance_status` | `SUCCESS`, `FAILED` |

---

## 2. Alur Kerja Pemindaian QR Code

```mermaid
sequenceDiagram
    participant Camera as Kamera Scanner (Frontend)
    participant API as Go Backend API (/features/v1/attendances/scan)
    participant DB as PostgreSQL Database

    Camera->>API: POST /features/v1/attendances/scan (qr_token, event_id)
    API->>DB: Cari data registrasi berdasarkan qr_token
    alt Token Tidak Ditemukan / Event Tidak Cocok
        API-->>Camera: 404 Not Found ("QR Code tidak valid")
    else Status Bukan REGISTERED (misal: WAITING_PAYMENT / CANCELLED)
        API-->>Camera: 400 Bad Request ("Tiket belum dibayar / dibatalkan")
    else Sudah Pernah Check-In Sebelumnya (Status: CHECKED_IN)
        API-->>Camera: 409 Conflict ("Peserta sudah melakukan check-in sebelumnya")
    else Validasi Berhasil
        API->>DB: Update Registration Status = 'CHECKED_IN'
        API->>DB: Insert Attendance (scan_time = NOW, scanner_id = User.ID, status = 'SUCCESS')
        API-->>Camera: 200 OK (Nama Peserta, Waktu Check-In, Status Hadir)
    end
```

---

## 3. Ketentuan & Keamanan Pemindaian

1. **Hak Akses Petugas**: Hanya pengguna ber-role `superadmin`, `panitia`, atau `scanner` dengan permission `attendance.scan` yang diizinkan mengakses scanner dan memanggil endpoint `/features/v1/attendances/scan`.
2. **Pencegahan Double Check-in**: Kueri pencatatan presensi bersifat atomic. Setelah status registrasi menjadi `CHECKED_IN`, percobaan scan ulang dengan token yang sama akan langsung ditolak dengan pesan peringatan waktu check-in sebelumnya.
3. **Syarat Sertifikat**: Peserta yang berstatus `CHECKED_IN` otomatis berhak mengunduh sertifikat saat event berstatus `COMPLETED`.
