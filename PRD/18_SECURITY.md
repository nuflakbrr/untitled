# Security Policies & Data Protection - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Pedoman keamanan komprehensif untuk melindungi integritas sistem, data pribadi peserta, dan keaslian transaksi pada arsitektur monorepo polyglot.

---

## 1. Autentikasi & Pengelolaan Kredensial

- **Password Hashing**: Menggunakan algoritma **Bcrypt** (`golang.org/x/crypto/bcrypt`) dengan work cost yang aman.
- **JWT Protection**:
  - Token ditandatangani menggunakan secret minimum 32 karakter (`JWT_SECRET`).
  - Access Token memiliki waktu kedaluwarsa 24 jam dengan mekanisme Refresh Token.
  - Token divalidasi pada setiap request oleh Go Gin middleware `RequireAuth()`.

---

## 2. Validasi & Sanitasi Data (Input Sanitization)

- **Go Request Binding & Validation**: Handler di backend memvalidasi tipe data dan batasan nilai melalui struct tags validator (`binding:"required,min=..."`).
- **Skema Zod Ketat (Frontend)**: Seluruh form input divalidasi dengan Zod schema sebelum dikirim ke backend.
- **HTML Sanitization (DOMPurify)**: Konten teks kaya (Rich Text deskripsi event dan artikel) disanitasi menggunakan `isomorphic-dompurify` sebelum dirender di browser guna mencegah celah **Cross-Site Scripting (XSS)**.
- **SQL Injection Immunity**: Seluruh kueri database dieksekusi dengan prepared statements dan parameterized queries (`$1, $2, ...`).

---

## 3. Proteksi Akses & Otorisasi Server-Side

- **PBAC Middleware Guards**: Validasi keamanan utama wajib berada di server Go dengan middleware `RequirePermission("module.action")` didukung oleh cache izin di Redis.
- **Proteksi Akun Tingkat Tinggi**:
  - Pencegahan penghapusan akun sendiri (_Self-Deletion Guard_).
  - Pencegahan eskalasi jabatan non-admin menjadi superadmin (_Role Escalation Guard_).
  - Pencegahan pengeditan akun superadmin oleh non-superadmin (_Superadmin Guard_).

---

## 4. Audit Trail & Logging

- Tabel `audit_logs` mencatat seluruh tindakan administratif yang mengubah status data sensitif:
  - Verifikasi atau penolakan bukti pembayaran.
  - Perubahan status pendaftaran atau pembatalan tiket.
  - Perubahan role atau penugasan permission user.
  - Penghapusan data master (Event, Kategori, Sertifikat).

---

## 5. Security Headers & CORS

- **CORS Configuration**: Gin CORS middleware membatasi domain asal hanya untuk frontend resmi (`http://localhost:8002`, domain produksi).
- **Security Headers**:
  - `X-Frame-Options: SAMEORIGIN` (mencegah Clickjacking).
  - `X-Content-Type-Options: nosniff` (mencegah MIME-type sniffing).
  - `Referrer-Policy: strict-origin-when-cross-origin`.
  - `Permissions-Policy: camera=(self), microphone=()` (akses kamera hanya untuk fitur QR scanner).
