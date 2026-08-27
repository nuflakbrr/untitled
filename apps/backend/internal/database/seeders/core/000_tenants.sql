-- Seed Tenants (Root Rektorat & Child Fakultas)
INSERT INTO tenants (id, name, slug, code, type, parent_id, website, description, settings, created_at, updated_at)
VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Universitas Mandiri Nusantara (Rektorat)',
    'rektorat',
    'UMN',
    'ROOT',
    NULL,
    'https://umn.ac.id',
    'Kantor Rektorat & Pusat Administrasi Universitas Mandiri Nusantara',
    '{"themeColor": "#1E3A8A", "isRoot": true}'::jsonb,
    NOW(),
    NOW()
),
(
    '10000000-0000-0000-0000-000000000002',
    'Fakultas Ilmu Komputer',
    'fasilkom',
    'FASILKOM',
    'FACULTY',
    '10000000-0000-0000-0000-000000000001',
    'https://cs.umn.ac.id',
    'Fakultas Ilmu Komputer & Teknologi Informasi',
    '{"themeColor": "#0284C7", "facultyCode": "CS"}'::jsonb,
    NOW(),
    NOW()
),
(
    '10000000-0000-0000-0000-000000000003',
    'Fakultas Teknik',
    'teknik',
    'FT',
    'FACULTY',
    '10000000-0000-0000-0000-000000000001',
    'https://eng.umn.ac.id',
    'Fakultas Teknik & Rekayasa Industri',
    '{"themeColor": "#D97706", "facultyCode": "ENG"}'::jsonb,
    NOW(),
    NOW()
),
(
    '10000000-0000-0000-0000-000000000004',
    'Fakultas Ekonomi & Bisnis',
    'feb',
    'FEB',
    'FACULTY',
    '10000000-0000-0000-0000-000000000001',
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
    website = EXCLUDED.website,
    description = EXCLUDED.description,
    settings = EXCLUDED.settings,
    updated_at = NOW();

