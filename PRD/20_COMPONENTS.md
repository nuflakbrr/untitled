# Component Rules & Architecture - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Seluruh pengembangan antarmuka wajib mengacu pada sistem komponen terstruktur di bawah direktori `apps/frontend/src/components/`, `src/sections/`, dan `src/layouts/`.

---

## 1. Pembagian Hierarki Komponen Frontend (`apps/frontend/src/`)

```text
src/
├── components/                # Komponen Atomik & Reusable Primitives
│   ├── animate/               # Motion variants & motion viewport containers
│   ├── carousel/              # Carousel slider wrappers & arrow navigations
│   ├── country-select/        # Country picker dropdown & flags
│   ├── custom-breadcrumbs/   # Breadcrumbs navigasi hierarkis
│   ├── hook-form/             # RHF form field wrappers (RHFTextField, RHFSelect, etc.)
│   ├── iconify/               # Universal Iconify component
│   ├── image/                 # Responsive lazy-loading image wrapper
│   ├── label/                 # Status badge / pill labels
│   ├── lightbox/              # Fullscreen image viewer & gallery modal
│   ├── loading-screen/        # Full-page & section loading indicators
│   ├── logo/                  # Logo brand universitas / fakultas
│   ├── markdown/              # HTML/Markdown parser & renderer
│   ├── nav-section/           # Sidebar & drawer navigation blocks
│   ├── phone-input/           # International phone number input
│   ├── player/                # Video/media stream player
│   └── scrollbar/             # Custom simplebar scroll container
│
├── layouts/                   # Shell & Frame Layouts
│   ├── main/                  # Layout navigasi publik (Header, Footer, Faculty Switcher)
│   ├── dashboard/             # Layout panel Admin & Peserta (Sidebar, NavHeader, Tenant Badge)
│   ├── auth/                  # Layout halaman login, register, reset password
│   └── config-nav.tsx         # Konfigurasi menu sidebar & permission mapping
│
└── sections/                  # Tampilan Fitur / Composite Feature Views
    ├── home/                  # Hero banner, event carousels, CTA fakultas
    ├── events/                # Event list view, filter sidebar per fakultas, event detail view
    ├── tenants/               # Manajemen tenant fakultas (CRUD fakultas, switcher)
    ├── auth/                  # Form login, register universal, verifikasi
    ├── dashboard/             # Widget analitik, kartu event terdekat
    ├── account/               # Form profil, reset kata sandi
    ├── articles/              # Artikel list, detail artikel, share buttons
    └── support/               # Tiket form bantuan & kontak kami
```

---

## 2. Pola Form Handling (`src/components/hook-form/`)

Formulir dibangun menggunakan `react-hook-form` terintegrasi dengan skema `zod`:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, Field } from 'src/components/hook-form';

const methods = useForm({
  resolver: zodResolver(eventSchema),
  defaultValues,
});

<Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
  <Field.Text name="title" label="Judul Event" />
  <Field.Select name="categoryId" label="Kategori">
    {categories.map((cat) => (
      <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
    ))}
  </Field.Select>
</Form>
```

---

## 3. Feedback, Loading & Empty States

- **Loading**: Gunakan `<LoadingScreen />` atau `<CircularProgress />` dari MUI untuk state transisi data.
- **Empty State**: Gunakan `<SearchNotFound />` saat pencarian data atau filter fakultas tidak menghasilkan hasil.
