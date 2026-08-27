# Frontend Feature: Galeri Kegiatan UI - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Event Galleries & Lightbox UI  
> **Stack**: Next.js 16 + Yet-Another-React-Lightbox + Material UI v9

---

## 1. Tampilan Galeri Publik (`src/app/(root)/gallery/page.tsx`)

- Grid gambar responsif dengan lazy-loading dan placeholder skeleton.
- Filter galeri berdasarkan acara (Event selector).
- Integrasi modal **Lightbox** fullscreen untuk pratinjau foto resolusi tinggi, navigasi slide, dan zoom.

---

## 2. Manajemen Galeri Admin (`src/sections/admin/galleries/`)

- Upload banyak foto sekaligus dengan input judul dan deskripsi.
- Opsi *Toggle Featured* untuk menampilkan foto di bagian highlight beranda.
