-- =====================================================
-- SEEDER CORE: 000_tenants.sql
-- =====================================================

INSERT INTO core.tenants (id, name, slug, code, type, parent_id, logo_url, website, description, settings, created_at, updated_at)
VALUES
(
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'Universitas Mandiri Nusantara (Rektorat)',
    'rektorat',
    'UMN',
    'ROOT',
    NULL,
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80',
    'https://umn.ac.id',
    'Kantor Rektorat & Pusat Administrasi Universitas Mandiri Nusantara',
    '{"themeColor": "#1E3A8A", "isRoot": true}'::jsonb,
    NOW(),
    NOW()
),
(
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'Fakultas Ilmu Komputer',
    'fasilkom',
    'FASILKOM',
    'FACULTY',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80',
    'https://cs.umn.ac.id',
    'Fakultas Ilmu Komputer & Teknologi Informasi',
    '{"themeColor": "#0284C7", "facultyCode": "CS"}'::jsonb,
    NOW(),
    NOW()
),
(
    '0ae41d16-bc49-4a88-b079-94def1b5b3ff',
    'Fakultas Teknik',
    'teknik',
    'FT',
    'FACULTY',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80',
    'https://eng.umn.ac.id',
    'Fakultas Teknik & Rekayasa Industri',
    '{"themeColor": "#D97706", "facultyCode": "ENG"}'::jsonb,
    NOW(),
    NOW()
),
(
    '2f36ab3a-bc06-4652-8bc4-cc8f7a703eb9',
    'Fakultas Ekonomi & Bisnis',
    'feb',
    'FEB',
    'FACULTY',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&auto=format&fit=crop&q=80',
    'https://feb.umn.ac.id',
    'Fakultas Ekonomi, Manajemen & Akuntansi Bisnis',
    '{"themeColor": "#059669", "facultyCode": "FEB"}'::jsonb,
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    code = EXCLUDED.code,
    type = EXCLUDED.type,
    parent_id = EXCLUDED.parent_id,
    logo_url = EXCLUDED.logo_url,
    website = EXCLUDED.website,
    description = EXCLUDED.description,
    settings = EXCLUDED.settings,
    updated_at = NOW();
