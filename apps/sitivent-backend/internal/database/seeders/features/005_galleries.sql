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
    '822d50b2-0442-42f6-8edf-3c801365b3ae',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'Sesi Pembukaan Seminar Dies Natalis',
    'Suasana kemeriahan sesi pembukaan Seminar Dies Natalis 2026 di Auditorium Rektorat.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '2093030b-adb4-4803-9af2-13a6c1ad8b1a',
    NOW(),
    NOW()
),
(
    'e77f5bb6-3f13-45f4-a62d-7db97c5a27d2',
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'Workshop Full-Stack Fasilkom',
    'Mahasiswa Fasilkom membuat arsitektur aplikasi monorepo modern.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
    TRUE,
    'b62644fd-67db-4a89-8de9-b8b796086a2e',
    NOW(),
    NOW()
),
(
    'a19cffea-18b4-4531-9647-f66ceca3eecf',
    '0ae41d16-bc49-4a88-b079-94def1b5b3ff',
    'Demonstrasi Robotika FT',
    'Sesi demonstrasi prototipe robotika industri di Expo Keteknikan FT.',
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60',
    TRUE,
    '1b0b2df2-87ab-412d-a3ae-8434f90ea1f5',
    NOW(),
    NOW()
),
(
    '03c031f6-36bc-403c-b319-220483943b9a',
    '2f36ab3a-bc06-4652-8bc4-cc8f7a703eb9',
    'Presentasi Business Case FEB',
    'Finalis mempresentasikan strategi analisis bisnis di hadapan dewan juri FEB.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    FALSE,
    '0cab550d-5978-4ed3-a505-8a02e6e20144',
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
