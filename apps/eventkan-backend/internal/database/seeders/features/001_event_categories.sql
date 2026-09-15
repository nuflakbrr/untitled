-- =====================================================
-- SEEDER FEATURES: 001_event_categories.sql
-- =====================================================

INSERT INTO event_categories (id, tenant_id, name, slug, description, created_at, updated_at) VALUES
-- Rektorat Global Categories
('83780fb3-7c86-48f7-aeac-4e169a2ef760', 'c9711506-d356-4704-a32e-0543dfe3e104', 'Seminar', 'seminar', 'Acara seminar dan kuliah tamu', NOW(), NOW()),
('94c14f8f-75c7-4e70-838c-fce050460ca8', 'c9711506-d356-4704-a32e-0543dfe3e104', 'Workshop', 'workshop', 'Pelatihan dan workshop praktis', NOW(), NOW()),
('9ddd82e1-8f52-4e2f-a71a-1eee6d4a8798', 'c9711506-d356-4704-a32e-0543dfe3e104', 'Webinar', 'webinar', 'Seminar berbasis online', NOW(), NOW()),
('3ea53a64-535a-42b8-9379-1740813051be', 'c9711506-d356-4704-a32e-0543dfe3e104', 'Kompetisi', 'kompetisi', 'Ajang lomba dan kompetisi mahasiswa', NOW(), NOW()),
('3782425d-740f-42f1-8083-090252a8d118', 'c9711506-d356-4704-a32e-0543dfe3e104', 'Konferensi', 'konferensi', 'Konferensi ilmiah dan forum akademik', NOW(), NOW()),

-- Fakultas Specific Categories (e.g. FASILKOM & FT)
('8dd70d97-217b-47ad-ad37-c02fd5d1c56f', '20492a21-59c3-4edf-bb64-1eaa6cf11deb', 'Hackathon & Tech Expo', 'hackathon-tech-expo', 'Ajang kompetisi coding dan pameran inovasi Fasilkom', NOW(), NOW()),
('be9b5e2b-ae8b-48f6-a8c2-fe47c99782e4', '0ae41d16-bc49-4a88-b079-94def1b5b3ff', 'Expo Rekayasa Keteknikan', 'expo-keteknikan', 'Pameran proyek inovasi Fakultas Teknik', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    updated_at = NOW();
