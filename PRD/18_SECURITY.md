# Security Policies & Data Protection - SITIVENT (Untitled Monorepo)

> **Version**: 1.0.0  
> Pedoman keamanan komprehensif untuk melindungi integritas sistem, data pribadi peserta, isolasi data antar-tenant, dan keaslian transaksi pada arsitektur monorepo polyglot.

---

## 1. Isolasi Data Multi-Tenant (Tenant Boundary Guard)

- **Strict Tenant Scoping**:
  - Setiap query database di backend Go wajib dibatasi oleh parameter `tenant_id` dari konteks sesi pengguna terotentikasi.
  - Panitia Fakultas dilarang keras melihat atau mengubah data event, peserta, bukti transfer, atau pengaturan fakultas lain.
- **Cross-Tenant Attack Prevention**:
  - Endpoint update/delete selalu memvalidasi `WHERE id = $1 AND tenant_id = $2`.
  - Percobaan manipulasi payload `tenant_id` dari sisi client otomatis ditolak dan menghasilkan respons `403 Forbidden`.

---

## 2. Autentikasi & Pengelolaan Kredensial

- **Password Hashing**: Menggunakan algoritma **Bcrypt** (`golang.org/x/crypto/bcrypt`) dengan work cost yang aman.
- **JWT Protection**:
  - Token ditandatangani menggunakan secret minimum 32 karakter (`JWT_SECRET`).
  - Access Token memiliki waktu kedaluwarsa 24 jam dengan mekanisme Refresh Token.
  - Token divalidasi pada setiap request oleh Go Gin middleware `RequireAuth()`.

---

## 3. Validasi & Sanitasi Data (Input Sanitization)

- **Go Request Binding & Validation**: Handler di backend memvalidasi tipe data dan batasan nilai melalui struct tags validator (`binding:"required,min=..."`).
- **Skema Zod Ketat (Frontend)**: Seluruh form input divalidasi dengan Zod schema sebelum dikirim ke backend.
- **HTML Sanitization (DOMPurify)**: Konten teks kaya disanitasi menggunakan `isomorphic-dompurify` sebelum dirender di browser guna mencegah celah **Cross-Site Scripting (XSS)**.
- **SQL Injection Immunity**: Seluruh kueri database dieksekusi dengan prepared statements dan parameterized queries (`$1, $2, ...`).

---

## 4. Audit Trail & Logging

- Tabel `audit_logs` mencatat seluruh tindakan administratif yang mengubah status data sensitif beserta `tenant_id` terkait:
  - Verifikasi atau penolakan bukti pembayaran tiket fakultas.
  - Perubahan status pendaftaran atau pembatalan tiket.
  - Perubahan role atau penugasan permission user.
  - Penghapusan data master (Event, Kategori, Sertifikat).
