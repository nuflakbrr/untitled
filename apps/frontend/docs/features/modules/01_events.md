# Frontend Feature: Katalog & Manajemen Event - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Events UI (Catalog & CMS)  
> **Stack**: Next.js 16 (React 19) + Material UI v9 + TanStack Query

---

## 1. Halaman Publik & Katalog Event

- **Halaman Katalog (`src/app/(root)/events/page.tsx`)**:
  - Filter sidebar berdasarkan kategori acara, format (`ONLINE`/`OFFLINE`), dan range harga.
  - Pencarian debounced berdasarkan judul event.
  - Grid kartu event responsive dengan status badge (`PUBLISHED`, `CLOSED`).
- **Halaman Detail Event (`src/app/(root)/events/[slug]/page.tsx`)**:
  - Detail tanggal, waktu, lokasi/link virtual, dan kuota tersisa.
  - Carousel profil narasumber / pembicara.
  - Daftar fasilitas dan benefit peserta.
  - Tombol CTA pendaftaran event (Memicu modal konfirmasi / login).

---

## 2. Panel Admin Event CMS

- **Tabel Event (`src/sections/admin/events/`)**:
  - Tabel TanStack Table dengan pagination server-side dan search filter.
  - Form multi-step pembuatan event (Informasi Utama, Pembicara, Fasilitas, Pengaturan Kuota & Tiket).
  - Tombol publikasi instan (`PUBLISH`/`DRAFT`).
