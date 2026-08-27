# Frontend Feature: Autentikasi & PBAC UI - SITIVENT (Untitled)

> **Version**: 1.0.0  
> **Module**: Auth & Permissions UI  
> **Stack**: Next.js 16 App Router (React 19) + Material UI v9 + TanStack Query + Ky

---

## 1. Alur Autentikasi Pengguna

1. **Sign In (`src/sections/auth/sign-in-view.tsx`)**:
   - Form input email dan password dengan validasi Zod.
   - Mengirim request ke backend `POST /core/v1/auth/signin`.
   - Menyimpan `accessToken` dan `refreshToken` di secure storage.
   - Redirect otomatis: Admin $\rightarrow$ `/admin/dashboard`, Peserta $\rightarrow$ `/participant/dashboard`.
2. **Sign Up (`src/sections/auth/sign-up-view.tsx`)**:
   - Registrasi akun peserta mandiri publik `POST /core/v1/auth/signup`.
3. **Google Sign In**:
   - Popup Firebase Google Auth di browser $\rightarrow$ Mengirim Firebase ID Token ke backend `POST /core/v1/auth/google`.

---

## 2. Otorisasi UI Guard (`usePermission` Hook)

Komponen UI menggunakan hook `usePermission` untuk menampilkan/menyembunyikan tombol aksi:

```tsx
import { usePermission } from 'src/hooks/use-permission';

export function EventActions({ eventId }: { eventId: string }) {
  const { hasPermission } = usePermission();

  return (
    <>
      {hasPermission('events.update') && <Button>Edit Event</Button>}
      {hasPermission('events.delete') && <Button color="error">Hapus</Button>}
    </>
  );
}
```
