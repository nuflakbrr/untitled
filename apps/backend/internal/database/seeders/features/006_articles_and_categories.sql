-- =====================================================
-- SEEDER FEATURES: 006_articles_and_categories.sql
-- =====================================================

-- 1. Insert Article Categories
INSERT INTO article_categories (id, name, created_at, updated_at) VALUES
('90000000-0000-0000-0000-000000000001', 'Tips & Trik', NOW(), NOW()),
('90000000-0000-0000-0000-000000000002', 'Berita & Pengumuman', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();

-- 2. Insert Article
INSERT INTO articles (
    id,
    title,
    slug,
    content,
    cover,
    created_by_id,
    created_at,
    updated_at
) VALUES (
    '90000000-0000-0000-0001-000000000001',
    'Tips Menghadiri Seminar Hybrid di SITIVENT',
    'tips-menghadiri-seminar-hybrid-di-sitivent',
    'Menghadiri seminar secara hybrid memerlukan persiapan baik dari segi teknis koneksi maupun kehadiran offline. Pastikan Anda memeriksa jenis tiket dan QR Code kehadiran Anda sebelum acara dimulai.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    '00000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    cover = EXCLUDED.cover,
    updated_at = NOW();

-- 3. Connect Article to Categories (Pivot Table _article_to_article_category)
INSERT INTO _article_to_article_category ("A", "B") VALUES
('90000000-0000-0000-0001-000000000001', '90000000-0000-0000-0000-000000000001'),
('90000000-0000-0000-0001-000000000001', '90000000-0000-0000-0000-000000000002')
ON CONFLICT ("A", "B") DO NOTHING;

