# UI/UX & Design Guidelines - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Pedoman antarmuka pengguna berbasis **Material UI v9 (Minimal/Zone UI Base)** dan **Tailwind CSS v4** dengan dukungan penjenamaan fakultas (*Faculty Theming & Branding*).

---

## 1. Prinsip Desain & Identitas Visual

1. **Clean, Modern, & Enterprise-Ready**:
   - Layout lapang dengan kontras visual tinggi, radius sudut halus (`8px` – `16px`), dan bayangan elevasi halus (*subtle elevation shadows*).
   - Tipografi menggunakan font modern sans-serif yang mudah dibaca di layar desktop maupun mobile.

2. **Dukungan Tema Terang & Gelap (Dark & Light Mode)**:
   - Warna palette tema dikonfigurasi secara tersentralisasi di `apps/frontend/src/theme/core/palette.ts`.
   - Komponen wajib mendukung mode gelap tanpa merusak kontras teks atau elemen interaktif.

3. **Faculty Branding & Tenant Accent Colors**:
   - Setiap fakultas dapat memiliki warna aksen primer dan logo tersendiri (misal: Biru Fasilkom, Oranye Teknik, Hijau FEB) yang diinjeksikan secara dinamis melalui tema context.

---

## 2. Iconography & Ilustrasi

- Gunakan komponen `<Iconify />` yang memuat icon pack terstandarisasi (`eva`, `solar`, `mingcute`, `material-symbols`).
- Hindari menyematkan file SVG inline yang besar secara berulang.

---

## 3. Aksesibilitas (A11y) & SEO

- Semua tombol aksi, gambar, dan input form wajib memiliki atribut aksesibilitas (`aria-label`, `alt`, `label`).
- Metadata SEO (OpenGraph, title dinamis, Twitter cards) dikonfigurasi melalui metadata API Next.js 16 di `layout.tsx` dan `page.tsx`.
