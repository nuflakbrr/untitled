-- =====================================================
-- SEEDER FEATURES: 004_support_messages.sql
-- =====================================================

INSERT INTO support_messages (
    id,
    tenant_id,
    name,
    email,
    phone,
    title,
    category,
    chronology,
    status,
    user_id,
    created_at,
    updated_at
) VALUES
(
    '7bef2c25-89e0-49c4-bb6f-3dca571e320e',
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'Peserta Mandiri',
    'peserta@untitled.com',
    '081234567890',
    'Gagal mengunduh sertifikat event webinar Fasilkom',
    'Event',
    'Saya sudah terdaftar dan hadir di webinar UI/UX Fasilkom, namun ketika mencoba mengunduh sertifikat selalu muncul pesan error "Sertifikat tidak tersedia". Mohon bantuannya.',
    'PENDING',
    '4dcf1bcc-9f81-49bf-a1d4-41031ca97187',
    NOW(),
    NOW()
),
(
    'fa1ca36d-0054-4eae-9084-eed14c8dc7bf',
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'Budi Santoso',
    'budi.santoso@example.com',
    '082198765432',
    'Pembayaran workshop Fasilkom sudah ditransfer tapi status masih waiting',
    'Pembayaran & Tiket',
    'Saya telah melakukan transfer untuk workshop Full-Stack pada tanggal 5 Oktober 2026 sejumlah Rp 150.000 ke rekening yang tertera. Namun status pembayaran saya masih WAITING PAYMENT.',
    'PROCESS',
    NULL,
    NOW(),
    NOW()
),
(
    'ad5183d8-5b2b-4112-afc6-f88ff3b882c6',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'Anisa Putri',
    'anisa.putri@student.ac.id',
    '089512345678',
    'Tidak bisa login ke akun universitas',
    'Akun',
    'Saya tidak bisa login menggunakan email dan password yang saya daftarkan. Sudah mencoba reset password namun email reset tidak kunjung datang.',
    'RESOLVED',
    NULL,
    NOW(),
    NOW()
),
(
    '109eeef9-684e-4cd9-a1b8-5f7b5d9bb0e8',
    '0ae41d16-bc49-4a88-b079-94def1b5b3ff',
    'Peserta Berbayar FT',
    'peserta-berbayar@gmail.com',
    '085612345678',
    'Pertanyaan mengenai pameran expo teknik',
    'Event',
    'Apakah tiket expo robotika FT mengizinkan membawa perlengkapan pribadi untuk sesi workshop?',
    'PENDING',
    '62091730-0a40-4962-b56f-5cd44f9a9ffb',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    title = EXCLUDED.title,
    status = EXCLUDED.status,
    chronology = EXCLUDED.chronology,
    updated_at = NOW();
