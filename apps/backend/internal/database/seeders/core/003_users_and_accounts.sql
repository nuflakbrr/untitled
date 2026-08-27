-- =====================================================
-- SEEDER CORE: 003_users_and_accounts.sql
-- Password untuk semua akun: "password"
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =====================================================

-- 1. Insert Users
INSERT INTO users (id, email, name, email_verified, role, role_id, created_at, updated_at) VALUES
('00000000-0000-0000-0001-000000000001', 'super.admin@gmail.com', 'Super Admin', TRUE, 'superadmin', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0001-000000000002', 'panitia@gmail.com', 'Panitia Event', TRUE, 'panitia', '00000000-0000-0000-0000-000000000002', NOW(), NOW()),
('00000000-0000-0000-0001-000000000003', 'scanner@gmail.com', 'Petugas Scanner', TRUE, 'scanner', '00000000-0000-0000-0000-000000000003', NOW(), NOW()),
('00000000-0000-0000-0001-000000000004', 'peserta@gmail.com', 'Peserta Mandiri', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW()),
('00000000-0000-0000-0001-000000000005', 'peserta-berbayar@gmail.com', 'Peserta Berbayar', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW()),
('00000000-0000-0000-0001-000000000006', 'peserta-scan-1@gmail.com', 'Peserta Scan 1', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW()),
('00000000-0000-0000-0001-000000000007', 'peserta-scan-2@gmail.com', 'Peserta Scan 2', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    role_id = EXCLUDED.role_id,
    updated_at = NOW();

-- 2. Insert Accounts (Better Auth credential provider)
INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('00000000-0000-0000-0002-000000000001', 'super.admin@gmail.com', 'credential', '00000000-0000-0000-0001-000000000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000002', 'panitia@gmail.com', 'credential', '00000000-0000-0000-0001-000000000002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000003', 'scanner@gmail.com', 'credential', '00000000-0000-0000-0001-000000000003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000004', 'peserta@gmail.com', 'credential', '00000000-0000-0000-0001-000000000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000005', 'peserta-berbayar@gmail.com', 'credential', '00000000-0000-0000-0001-000000000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000006', 'peserta-scan-1@gmail.com', 'credential', '00000000-0000-0000-0001-000000000006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000007', 'peserta-scan-2@gmail.com', 'credential', '00000000-0000-0000-0001-000000000007', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    password = EXCLUDED.password,
    updated_at = NOW();

-- 3. Connect Users to Roles in _role_to_user join table
INSERT INTO _role_to_user ("A", "B") VALUES
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000001'), -- superadmin
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000002'), -- panitia
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000003'), -- scanner
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000004'), -- peserta
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000005'), -- peserta-berbayar
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000006'), -- peserta-scan-1
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000007')  -- peserta-scan-2
ON CONFLICT ("A", "B") DO NOTHING;
