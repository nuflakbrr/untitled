-- =====================================================
-- SEEDER FEATURES: 005_galleries.sql
-- =====================================================

INSERT INTO galleries (
    id,
    title,
    description,
    image_url,
    featured,
    event_id,
    created_at,
    updated_at
) VALUES
(
    '80000000-0000-0000-0001-000000000001',
    'Sesi Pembukaan Seminar AI',
    'Suasana kemeriahan sesi pembukaan Seminar Teknologi & Inovasi 2026.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '20000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000002',
    'Workshop Flutter Praktis',
    'Peserta mencoba membuat aplikasi mobile pertama mereka dengan Flutter.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '20000000-0000-0000-0001-000000000002',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000003',
    'Diskusi Panel Start-up',
    'Diskusi panel interaktif bersama pakar industri mengenai pendanaan startup.',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '20000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000004',
    'Presentasi Finalis Kompetisi Hackathon',
    'Finalis mendemonstrasikan prototipe aplikasi IoT mereka di hadapan dewan juri.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    FALSE,
    '20000000-0000-0000-0001-000000000003',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000005',
    'Antusiasme Audien',
    'Audien antusias mendengarkan materi dari pembicara global.',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '20000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000006',
    'Foto Bersama Panitia dan Pembicara',
    'Sesi dokumentasi foto bersama setelah penutupan event selesai.',
    'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800&auto=format&fit=crop&q=60',
    FALSE,
    '20000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    featured = EXCLUDED.featured,
    updated_at = NOW();

