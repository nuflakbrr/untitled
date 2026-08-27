# About Project & Product Roadmap - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> **Product Name**: SITIVENT (Untitled Monorepo)  
> **Target Event**: Seminar, Workshop, Webinar, Kompetisi, Konferensi Ilmiah  

---

## 1. Deskripsi Produk

**SITIVENT** (versi Untitled Monorepo) adalah platform manajemen dan pendaftaran event berskala enterprise yang dirancang menggunakan arsitektur **Turborepo Polyglot Monorepo** (Go Gin REST API Backend + Next.js 16 App Router Frontend + PostgreSQL + Redis).

SITIVENT memfasilitasi seluruh siklus hidup penyelenggaraan acara:
- Publikasi katalog event daring & luring beserta narasumber dan fasilitas.
- Pendaftaran peserta mandiri & penerbitan nomor registrasi unik beserta tiket QR Code.
- Manajemen pembayaran manual dan verifikasi bukti transfer oleh panitia.
- Pemindaian dan validasi kehadiran di lokasi acara secara langsung via kamera perangkat (HTML5 QR Scanner).
- Perancangan template sertifikat digital interaktif, otomatisasi penerbitan sertifikat bagi peserta yang hadir, dan portal publik verifikasi keaslian sertifikat via nomor sertifikat / kode QR.
- Publikasi artikel, galeri dokumentasi kegiatan, dan modul tiket pesan bantuan (support).

---

## 2. Sasaran Pengguna (Target Personas)

1. **Super Administrator**:
   - Memiliki kendali penuh atas sistem, manajemen pengguna, role, dan hak akses (PBAC).
2. **Panitia Acara (Organizer)**:
   - Membuat, mempublikasikan, dan mengelola data event, fasilitas, narasumber, template sertifikat, dan verifikasi bukti transfer.
3. **Petugas Scanner (Gate Staff)**:
   - Bertugas di gerbang masuk venue untuk memindai QR Code tiket peserta dan mencatat kehadiran secara real-time.
4. **Peserta Acara (Participant)**:
   - Mencari event, mendaftar, mengunggah bukti pembayaran, mendapatkan tiket QR, dan mengunduh e-sertifikat setelah acara selesai.

---

## 3. Status Fitur & Roadmap

| Modul Fitur | Status Backend (Go) | Status Frontend (Next.js) | Keterangan |
| :--- | :---: | :---: | :--- |
| **Authentication & PBAC** | ✅ Siap (JWT + Redis) | 🟡 Integrasi Login/Reg | Auth JWT dengan 39 permissions |
| **Event & Kategori** | ✅ Skema & Model Siap | 🟡 Integrasi UI Katalog | Dukungan Online & Offline event |
| **Pendaftaran & Tiket QR** | ✅ Skema & Model Siap | 🟡 Integrasi Form Daftar | Generate QR Token otomatis |
| **Pembayaran & Verifikasi**| ✅ Skema & Model Siap | 🟡 Upload Bukti Transfer | Status WAITING, PAID, REFUNDED |
| **Presensi & QR Scanner** | ✅ Skema & Model Siap | 🟡 Scanner Kamera | Validasi check-in instan |
| **Sertifikat Builder** | ✅ Skema & Model Siap | 🟡 Verifikasi Publik | Template kustom & tanda tangan |
| **Artikel & Galeri** | ✅ Skema & Model Siap | 🟡 Portal Berita/Galeri | Many-to-Many artikel kategori |
| **Pesan Bantuan (Support)**| ✅ Skema & Model Siap | 🟡 Form Dukungan | Tiket status PENDING/RESOLVED |
