-- =====================================================
-- SEEDER FEATURES: 004_support_messages.sql
-- =====================================================

INSERT INTO support_messages (
    id,
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
    'Peserta Mandiri',
    'peserta@gmail.com',
    '081234567890',
    'Gagal mengunduh sertifikat event webinar',
    'Event',
    'Saya sudah terdaftar dan hadir di webinar UI/UX, namun ketika mencoba mengunduh sertifikat selalu muncul pesan error "Sertifikat tidak tersedia". Mohon bantuannya.',
    'PENDING',
    '00000000-0000-0000-0001-000000000004',
    NOW(),
    NOW()
),
(
    '70000000-0000-0000-0001-000000000002',
    'Budi Santoso',
    'budi.santoso@example.com',
    '082198765432',
    'Pembayaran workshop sudah ditransfer tapi status masih waiting',
    'Pembayaran & Tiket',
    'Saya telah melakukan transfer untuk workshop Full-Stack Next.js pada tanggal 5 Oktober 2026 sejumlah Rp 150.000 ke rekening yang tertera. Namun status pembayaran saya masih WAITING PAYMENT hingga saat ini. Bukti transfer sudah saya upload di sistem.',
    'PROCESS',
    NULL,
    NOW(),
    NOW()
),
(
    '70000000-0000-0000-0001-000000000003',
    'Anisa Putri',
    'anisa.putri@student.ac.id',
    '089512345678',
    'Tidak bisa login ke akun',
    'Akun',
    'Saya tidak bisa login menggunakan email dan password yang saya daftarkan. Sudah mencoba reset password namun email reset tidak kunjung datang. Tolong bantu akses akun saya kembali.',
    'RESOLVED',
    NULL,
    NOW(),
    NOW()
),
(
    '70000000-0000-0000-0001-000000000004',
    'Peserta Berbayar',
    'peserta-berbayar@gmail.com',
    '085612345678',
    'Pertanyaan mengenai refund event yang dibatalkan',
    'Pembayaran & Tiket',
    'Apakah ada kebijakan refund jika event dibatalkan oleh panitia? Saya ingin mengetahui prosedur pengembalian dana jika terjadi pembatalan mendadak.',
    'PENDING',
    '00000000-0000-0000-0001-000000000005',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    status = EXCLUDED.status,
    chronology = EXCLUDED.chronology,
    updated_at = NOW();

