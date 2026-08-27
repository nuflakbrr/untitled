-- =====================================================
-- SEEDER FEATURES: 001_event_categories.sql
-- =====================================================

INSERT INTO event_categories (id, name, slug, description, created_at, updated_at) VALUES
('20000000-0000-0000-0000-000000000001', 'Seminar', 'seminar', 'Acara seminar dan kuliah tamu', NOW(), NOW()),
('20000000-0000-0000-0000-000000000002', 'Workshop', 'workshop', 'Pelatihan dan workshop praktis', NOW(), NOW()),
('20000000-0000-0000-0000-000000000003', 'Webinar', 'webinar', 'Seminar berbasis online', NOW(), NOW()),
('20000000-0000-0000-0000-000000000004', 'Kompetisi', 'kompetisi', 'Ajang lomba dan kompetisi', NOW(), NOW()),
('20000000-0000-0000-0000-000000000005', 'Konferensi', 'konferensi', 'Konferensi ilmiah dan forum', NOW(), NOW())
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = NOW();

