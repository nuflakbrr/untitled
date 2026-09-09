# Test Case: Create Role & Permissions (TC052)

## Skenario Pengujian
Memastikan Super Admin dapat membuat jabatan/role baru dan menyematkan daftar hak akses (permissions).

## Prasyarat
- Super Admin ter-login di `/admin/c9711506-d356-4704-a32e-0543dfe3e104/managements/roles`.

## Kondisi
- **Input**:
  - Nama Role: `Panitia Event`
  - Hak Akses: `event.read`, `attendance.scan`
- **Output yang Diharapkan**:
  - Role baru beserta hak aksesnya terdaftar di database.

## Langkah-Langkah Pengujian
1. Buka `/admin/c9711506-d356-4704-a32e-0543dfe3e104/managements/roles`.
2. Klik "+ Tambah Jabatan".
3. Masukkan nama role dan centang izin yang diberikan.
4. Klik Simpan.
5. Verifikasi role baru tampil di tabel manajemen jabatan.
