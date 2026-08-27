-- =====================================================
-- SEEDER CORE: 002_roles_and_role_permissions.sql
-- =====================================================

-- 1. Insert Roles
INSERT INTO roles (id, name, description, created_at, updated_at) VALUES
('00000000-0000-0000-0000-000000000001', 'superadmin', 'Super Administrator dengan akses penuh ke seluruh sistem', NOW(), NOW()),
('00000000-0000-0000-0000-000000000002', 'panitia', 'Panitia event dengan akses manajemen event dan absensi', NOW(), NOW()),
('00000000-0000-0000-0000-000000000003', 'scanner', 'Petugas pemindaian kehadiran peserta', NOW(), NOW()),
('00000000-0000-0000-0000-000000000004', 'peserta', 'Peserta dengan akses pendaftaran dan sertifikat', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    updated_at = NOW();

-- 2. Role Permissions: Superadmin (All permissions)
INSERT INTO role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'superadmin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 3. Role Permissions: Panitia
INSERT INTO role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
JOIN permissions p ON p.name IN (
    'admin.access',
    'events.read',
    'events.create',
    'events.update',
    'events.publish',
    'event.categories.read',
    'registrations.read',
    'payments.verify',
    'attendance.scan',
    'certificates.read',
    'certificates.create',
    'support.read',
    'support.update'
)
WHERE r.name = 'panitia'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 4. Role Permissions: Scanner
INSERT INTO role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
JOIN permissions p ON p.name IN (
    'admin.access',
    'attendance.scan',
    'registrations.read'
)
WHERE r.name = 'scanner'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- 5. Role Permissions: Peserta
INSERT INTO role_has_permissions (role_id, permission_id, created_at, updated_at)
SELECT r.id, p.id, NOW(), NOW()
FROM roles r
JOIN permissions p ON p.name IN (
    'events.read',
    'certificates.read',
    'certificates.download',
    'participant.dashboard'
)
WHERE r.name = 'peserta'
ON CONFLICT (role_id, permission_id) DO NOTHING;

