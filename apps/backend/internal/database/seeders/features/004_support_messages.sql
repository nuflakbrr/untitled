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
    '70000000-0000-0000-0001-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'Peserta Mandiri',
    'peserta@untitled.com',
    '081234567890',
    'Gagal mengunduh sertifikat event webinar Fasilkom',
    'Event',
    'Saya sudah terdaftar dan hadir di webinar UI/UX Fasilkom, namun ketika mencoba mengunduh sertifikat selalu muncul pesan error "Sertifikat tidak tersedia". Mohon bantuannya.',
    'PENDING',
    '00000000-0000-0000-0001-000000000009',
    NOW(),
    NOW()
),
(
    '70000000-0000-0000-0001-000000000002',
    '10000000-0000-0000-0000-000000000002',
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
    '70000000-0000-0000-0001-000000000003',
    '10000000-0000-0000-0000-000000000001',
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
    '70000000-0000-0000-0001-000000000004',
    '10000000-0000-0000-0000-000000000003',
    'Peserta Berbayar FT',
    'peserta-berbayar@gmail.com',
    '085612345678',
    'Pertanyaan mengenai pameran expo teknik',
    'Event',
    'Apakah tiket expo robotika FT mengizinkan membawa perlengkapan pribadi untuk sesi workshop?',
    'PENDING',
    '00000000-0000-0000-0001-000000000010',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    title = EXCLUDED.title,
    status = EXCLUDED.status,
    chronology = EXCLUDED.chronology,
    updated_at = NOW();
