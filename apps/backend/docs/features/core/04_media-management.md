# Backend Feature: Manajemen Media Cloud - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Features / Cloud Storage & Media Uploads  
> **Stack**: Go 1.25+ (Gin) + GCS / ImageKit API

---

## 1. Alur Unggah Berkas

- **Endpoint**: `POST /features/v1/uploads`
- **MIME Types**: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- **Maksimal Ukuran**: 5 MB (10 MB untuk template sertifikat)
- **Sanitasi**: Nama file diubah secara acak menjadi UUID v4 untuk mencegah tabrakan nama dan *directory traversal*.

---

## 2. Struktur Direktori Cloud

- `events/`: Poster dan banner event
- `speakers/`: Foto profil pembicara
- `avatars/`: Avatar profil user
- `payments/`: Foto bukti transfer
- `galleries/`: Foto dokumentasi acara
- `certificates/`: Background template sertifikat
- `signatures/`: Tanda tangan elektronik transparan
