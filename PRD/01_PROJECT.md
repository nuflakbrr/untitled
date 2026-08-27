# About Project & Product Roadmap - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> **Product Name**: SITIVENT (Untitled Monorepo)  
> **Target Domain**: Sistem Informasi & Manajemen Event Universitas (Hierarchical Multi-Tenant: Rektorat & Fakultas)  
> **Target Event**: Seminar Ilmiah, Workshop Akademik, Webinar, Kompetisi Mahasiswa, Konferensi Internasional, Expo Kampus, Dies Natalis, dan Wisuda.

---

## 1. Deskripsi Produk

**SITIVENT** adalah platform manajemen dan pendaftaran event berskala enterprise yang dirancang khusus untuk ekosistem **Perguruan Tinggi / Universitas** menggunakan arsitektur **Hierarchical Multi-Tenant** di atas **Turborepo Polyglot Monorepo** (Go Gin REST API Backend + Next.js 16 App Router Frontend + PostgreSQL + Redis).

SITIVENT memfasilitasi seluruh siklus hidup penyelenggaraan acara kampus:
- **Hierarchical Multi-Tenancy**: Tenant Utama (Rektorat / Universitas) dan Child Tenants (Fakultas / Departemen / Unit Kerja).
- **Akun Superadmin Mandiri**: Tiap tenant (Rektorat maupun Fakultas) memiliki 1 akun Superadmin tersendiri untuk mengelola operasionalnya.
- **Event Terisolasi per Fakultas/Rektorat**: Fakultas mengelola event, kategori, kuota, pembicara, dan sertifikat masing-masing secara independen.
- **Pendaftaran Peserta Universal**: Mahasiswa dan peserta umum cukup memiliki 1 akun universal untuk mendaftar ke event di fakultas manapun maupun event universitas.
- **Verifikasi Pembayaran & Presensi QR**: Verifikasi bukti transfer manual oleh panitia fakultas dan pemindaian kehadiran real-time via kamera perangkat di lokasi acara.
- **Sertifikat Digital & E-Signature Pejabat**: Template builder dengan tanda tangan digital resmi Dekan / Rektor / Ketua Panitia serta portal verifikasi publik.

---

## 2. Sasaran Pengguna (Target Personas)

1. **Super Administrator Universitas (Rektorat)**:
   - Memiliki kendali penuh atas sistem, manajemen master tenant fakultas, monitoring analitik lintas fakultas, dan penyelenggaraan event universitas.
2. **Super Administrator Fakultas**:
   - Memiliki kendali penuh atas satu fakultas (manajemen akun panitia fakultas, akun scanner, monitoring performa event fakultas).
3. **Panitia Acara Fakultas (Organizer)**:
   - Membuat, mempublikasikan, dan mengelola event fakultas, fasilitas, narasumber, template sertifikat, dan verifikasi bukti transfer.
4. **Petugas Scanner (Gate Staff)**:
   - Memindai tiket QR Code peserta di gerbang masuk venue acara fakultas untuk presensi instan.
5. **Peserta (Mahasiswa & Umum)**:
   - Menjelajahi katalog event antar-fakultas, mendaftar, mengunggah bukti bayar, menggunakan tiket QR, dan mengunduh sertifikat resmi.
