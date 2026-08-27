-- =====================================================
-- SEEDER FEATURES: 006_articles_and_categories.sql
-- =====================================================

-- 1. Insert Article Categories
INSERT INTO article_categories (id, name, created_at, updated_at) VALUES
('90000000-0000-0000-0000-000000000001', 'Tips & Panduan Akademik', NOW(), NOW()),
('90000000-0000-0000-0000-000000000002', 'Berita & Pengumuman Rektorat', NOW(), NOW()),
('90000000-0000-0000-0000-000000000003', 'Kabar Fakultas & Mahasiswa', NOW(), NOW())
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
    '90000000-0000-0000-0001-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Panduan Menghadiri Seminar Hybrid di SITIVENT Kampus',
    'panduan-menghadiri-seminar-hybrid-di-sitivent',
    'Menghadiri seminar secara hybrid di lingkungan universitas memerlukan persiapan baik dari segi teknis koneksi maupun kehadiran offline. Pastikan Anda memeriksa jenis tiket dan QR Code kehadiran Anda sebelum acara dimulai.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    '00000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
),
(
    '90000000-0000-0000-0001-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Fasilkom Luncurkan Inovasi Laboratorium Kecerdasan Buatan',
    'fasilkom-luncurkan-lab-ai',
    'Fakultas Ilmu Komputer resmi mengumumkan pembukaan laboratorium riset AI terbaru untuk mendukung kegiatan praktikum dan lomba mahasiswa.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
    '00000000-0000-0000-0001-000000000002',
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
('90000000-0000-0000-0001-000000000001', '90000000-0000-0000-0000-000000000001'),
('90000000-0000-0000-0001-000000000001', '90000000-0000-0000-0000-000000000002'),
('90000000-0000-0000-0001-000000000002', '90000000-0000-0000-0000-000000000003')
ON CONFLICT ("A", "B") DO NOTHING;
