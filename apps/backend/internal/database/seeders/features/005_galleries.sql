-- =====================================================
-- SEEDER FEATURES: 005_galleries.sql
-- =====================================================

INSERT INTO galleries (
    id,
    tenant_id,
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
    '10000000-0000-0000-0000-000000000001',
    'Sesi Pembukaan Seminar Dies Natalis',
    'Suasana kemeriahan sesi pembukaan Seminar Dies Natalis 2026 di Auditorium Rektorat.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '20000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Workshop Full-Stack Fasilkom',
    'Mahasiswa Fasilkom membuat arsitektur aplikasi monorepo modern.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '20000000-0000-0000-0001-000000000003',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'Demonstrasi Robotika FT',
    'Sesi demonstrasi prototipe robotika industri di Expo Keteknikan FT.',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '20000000-0000-0000-0001-000000000004',
    NOW(),
    NOW()
),
(
    '80000000-0000-0000-0001-000000000004',
    '10000000-0000-0000-0000-000000000004',
    'Presentasi Business Case FEB',
    'Finalis mempresentasikan strategi analisis bisnis di hadapan dewan juri FEB.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    FALSE,
    '20000000-0000-0000-0001-000000000005',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    featured = EXCLUDED.featured,
    updated_at = NOW();
