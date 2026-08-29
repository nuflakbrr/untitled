-- =====================================================
-- SEEDER CORE: 002_roles_and_role_permissions.sql
-- =====================================================

-- 1. Insert Roles
INSERT INTO core.roles (id, name, description, created_at, updated_at) VALUES
('22b345bc-6566-4a25-86be-a4b63de6353e', 'root_superadmin', 'Super Administrator Universitas (Rektorat) dengan akses penuh ke seluruh tenant', NOW(), NOW()),
('9a0b32f2-61f1-4048-82fd-1a84b489255c', 'superadmin', 'Super Administrator Fakultas dengan akses penuh ke data fakultasnya', NOW(), NOW()),
('96866579-bb48-4eb8-8e60-003ab562f8e1', 'panitia', 'Panitia event dengan akses manajemen event dan absensi fakultas', NOW(), NOW()),
('6e08eba3-e925-45e8-82ef-86103816567b', 'scanner', 'Petugas pemindaian kehadiran peserta fakultas', NOW(), NOW()),
('096401d0-a130-4d9b-a596-d0cb26554402', 'peserta', 'Peserta universal (mahasiswa & umum) dengan akses pendaftaran lintas fakultas', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    updated_at = NOW();

-- 2. Role Permissions: Root Superadmin (Universitas / Rektorat - All permissions)
INSERT INTO core.role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM core.roles r
CROSS JOIN core.permissions p
WHERE r.name = 'root_superadmin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3. Role Permissions: Superadmin (Fakultas - All permissions except root tenant management)
INSERT INTO core.role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM core.roles r
CROSS JOIN core.permissions p
WHERE r.name = 'superadmin' AND p.name NOT IN ('tenant.create', 'tenant.delete')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 4. Role Permissions: Panitia
INSERT INTO core.role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM core.roles r
JOIN core.permissions p ON p.name IN (
    'admin.access',
    'events.read',
    'events.create',
    'events.update',
    'events.publish',
    'event.categories.read',
    'registrations.read',
    'payments.read',
    'payments.verify',
    'attendance.scan',
    'attendance.read',
    'certificates.read',
    'certificates.create',
    'support.read',
    'support.update',
    'articles.read',
    'articles.create',
    'articles.update',
    'articles.delete',
    'article_categories.read',
    'galleries.read',
    'galleries.create',
    'galleries.update',
    'galleries.delete'
)
WHERE r.name = 'panitia'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 5. Role Permissions: Scanner
INSERT INTO core.role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM core.roles r
JOIN core.permissions p ON p.name IN (
    'admin.access',
    'attendance.scan',
    'registrations.read'
)
WHERE r.name = 'scanner'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 6. Role Permissions: Peserta
INSERT INTO core.role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM core.roles r
JOIN core.permissions p ON p.name IN (
    'events.read',
    'registrations.read',
    'registrations.create',
    'registrations.cancel',
    'payments.checkout',
    'payments.read',
    'certificates.read',
    'certificates.download',
    'participant.dashboard'
)
WHERE r.name = 'peserta'
ON CONFLICT (role_id, permission_id) DO NOTHING;
