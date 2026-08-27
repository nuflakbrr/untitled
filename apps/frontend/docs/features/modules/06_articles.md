# Frontend Feature: Artikel & Publikasi UI - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Articles & News UI  
> **Stack**: Next.js 16 + Material UI v9 + DOMPurify

---

## 1. Katalog & Detail Artikel

- **List Artikel (`src/app/(root)/articles/page.tsx`)**:
  - Filter kategori artikel dan search bar debounced.
  - Kartu artikel dengan cover image, tag kategori, tanggal terbit, dan estimasi waktu baca.
- **Detail Artikel (`src/app/(root)/articles/[slug]/page.tsx`)**:
  - Render konten HTML yang telah disanitasi menggunakan `isomorphic-dompurify`.
  - Tombol share ke WhatsApp, LinkedIn, Twitter/X.
  - Daftar artikel terkait di bagian bawah.

---

## 2. Editor CMS Admin (`src/sections/admin/articles/`)

- Form CRUD artikel dengan Tiptap / RichTextEditor.
- Multi-select kategori artikel.
- Upload cover banner otomatis.
