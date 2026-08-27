-- =====================================================
-- SEEDER FEATURES: 001_event_categories.sql
-- =====================================================

INSERT INTO event_categories (id, tenant_id, name, slug, description, created_at, updated_at) VALUES
-- Rektorat Global Categories
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Seminar', 'seminar', 'Acara seminar dan kuliah tamu', NOW(), NOW()),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Workshop', 'workshop', 'Pelatihan dan workshop praktis', NOW(), NOW()),
('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Webinar', 'webinar', 'Seminar berbasis online', NOW(), NOW()),
('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Kompetisi', 'kompetisi', 'Ajang lomba dan kompetisi mahasiswa', NOW(), NOW()),
('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'Konferensi', 'konferensi', 'Konferensi ilmiah dan forum akademik', NOW(), NOW()),

-- Fakultas Specific Categories (e.g. FASILKOM)
('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Hackathon & Tech Expo', 'hackathon-tech-expo', 'Ajang kompetisi coding dan pameran inovasi Fasilkom', NOW(), NOW()),
('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 'Expo Rekayasa Keteknikan', 'expo-keteknikan', 'Pameran proyek inovasi Fakultas Teknik', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
