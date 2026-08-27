# Frontend Feature: Performa & Optimasi SEO - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: SEO, Metadata & Core Web Vitals  
> **Stack**: Next.js 16 App Router + Turbopack

---

## 1. Konfigurasi Metadata SEO

- **Root Layout (`src/app/layout.tsx`)**:
  - Favicon, dynamic title template (`%s | SITIVENT`), deskripsi aplikasi.
  - OpenGraph image dan Twitter summary card.
- **Dynamic SEO**:
  - Halaman detail event dan artikel mengimplementasikan fungsi Next.js `generateMetadata()` untuk mengekstrak banner, judul, dan sinopsis secara real-time.

---

## 2. Optimasi Core Web Vitals (LCP, FID, CLS)

- Lazy loading seluruh gambar dengan `next/image` bawaan.
- Code-splitting komponen berat (Scanner kamera, Markdown parser, Chart analytics) menggunakan `next/dynamic` (`ssr: false`).
- Font optimal sans-serif dimuat melalui `next/font`.
