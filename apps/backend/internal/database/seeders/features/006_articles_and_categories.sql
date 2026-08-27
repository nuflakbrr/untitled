-- =====================================================
-- SEEDER FEATURES: 006_articles_and_categories.sql
-- =====================================================

-- 1. Insert Article Categories
INSERT INTO article_categories (id, name, created_at, updated_at) VALUES
('a780afc8-1893-4370-91fc-0ba1144b3c29', 'Tips & Panduan Akademik', NOW(), NOW()),
('45f9f649-c342-4941-8201-11b28e84bf6f', 'Berita & Pengumuman Rektorat', NOW(), NOW()),
('700a5e07-25fb-4ad9-a535-04d35d422bb3', 'Kabar Fakultas & Mahasiswa', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();

-- 2. Insert Articles with Tenant Scoping
INSERT INTO articles (
    id,
    tenant_id,
    title,
    slug,
    content,
    cover,
    created_by_id,
    created_at,
    updated_at
) VALUES (
    '74fc6240-f61a-4ca5-93c2-eb823176cacd',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'Panduan Menghadiri Seminar Hybrid di SITIVENT Kampus',
    'panduan-menghadiri-seminar-hybrid-di-sitivent',
    'Menghadiri seminar secara hybrid di lingkungan universitas memerlukan persiapan baik dari segi teknis koneksi maupun kehadiran offline. Pastikan Anda memeriksa jenis tiket dan QR Code kehadiran Anda sebelum acara dimulai.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    '48e8167e-0105-4242-b6db-9bb12dc84bce',
    NOW(),
    NOW()
),
(
    'aa5d9631-8806-4711-b160-d05c125d1e84',
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'Fasilkom Luncurkan Inovasi Laboratorium Kecerdasan Buatan',
    'fasilkom-luncurkan-lab-ai',
    'Fakultas Ilmu Komputer resmi mengumumkan pembukaan laboratorium riset AI terbaru untuk mendukung kegiatan praktikum dan lomba mahasiswa.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
    '355f936d-e2b6-4ed3-8385-455115f605a3',
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    cover = EXCLUDED.cover,
    updated_at = NOW();

-- 3. Connect Article to Categories (Pivot Table _article_to_article_category)
INSERT INTO _article_to_article_category ("A", "B") VALUES
('74fc6240-f61a-4ca5-93c2-eb823176cacd', 'a780afc8-1893-4370-91fc-0ba1144b3c29'),
('74fc6240-f61a-4ca5-93c2-eb823176cacd', '45f9f649-c342-4941-8201-11b28e84bf6f'),
('aa5d9631-8806-4711-b160-d05c125d1e84', '700a5e07-25fb-4ad9-a535-04d35d422bb3')
ON CONFLICT ("A", "B") DO NOTHING;
