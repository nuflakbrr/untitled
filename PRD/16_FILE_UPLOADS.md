# File Upload & Media Management - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Seluruh aset media (banner event, foto pembicara, avatar pengguna, bukti pembayaran, galeri dokumentasi, dan template sertifikat) dikelola menggunakan layanan Cloud Storage (Google Cloud Storage / ImageKit) dengan validasi tipe file yang ketat.

---

## 1. Arsitektur Unggah Media

- **Storage Provider**: Google Cloud Storage (`cloud.google.com/go/storage`) atau ImageKit API.
- **Handling di Backend**:
  - Endpoint `POST /features/v1/uploads` menerima payload multipart form data.
  - Memvalidasi MIME type (`image/jpeg`, `image/png`, `image/webp`, `application/pdf`).
  - Menghasilkan nama file UUID acak guna mencegah tabrakan nama dan *path traversal*.
  - Mengunggah file ke bucket cloud dan mengembalikan URL publik ke client.

---

## 2. Struktur Folder Penyimpanan Media

File diorganisasikan ke dalam subdirektori tematik:

```text
Storage Root /
├── events/            # Banner dan poster kegiatan event
├── speakers/          # Foto profil narasumber dan pembicara
├── avatars/           # Foto profil pengguna terdaftar
├── payments/          # Bukti transfer pembayaran tiket
├── galleries/         # Foto dokumentasi kegiatan acara
├── certificates/      # Latar belakang template sertifikat
└── signatures/        # Gambar tanda tangan digital transparan
```

---

## 3. Format & Batasan Berkas (Allowed Types & Limits)

| Kategori | Ekstensi yang Diizinkan | Batas Ukuran Maksimal | Pemrosesan Tambahan |
| :--- | :--- | :--- | :--- |
| **Banner Event & Cover Artikel** | `.jpg`, `.jpeg`, `.png`, `.webp` | 5 MB | Pemotongan rasio via Cropper |
| **Avatar & Speaker Photo** | `.jpg`, `.jpeg`, `.png`, `.webp` | 2 MB | Pemotongan rasio 1:1 |
| **Bukti Transfer Pembayaran** | `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf` | 5 MB | Sanitasi nama file |
| **Template Sertifikat** | `.jpg`, `.jpeg`, `.png`, `.webp` | 10 MB | Resolusi tinggi |
| **E-Signatures** | `.png`, `.webp` (Transparan) | 2 MB | Latar transparan |
