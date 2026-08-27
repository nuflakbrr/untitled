-- =====================================================
-- SEEDER CORE: 003_users_and_accounts.sql
-- Password untuk semua akun: "password"
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =====================================================

-- 1. Insert Users with Tenant Scoping
INSERT INTO users (id, tenant_id, email, name, email_verified, role, role_id, created_at, updated_at) VALUES
-- Root Superadmin (Universitas / Rektorat)
('00000000-0000-0000-0001-000000000001', '10000000-0000-0000-0000-000000000001', 'superadmin.univ@untitled.com', 'Superadmin Universitas (Rektorat)', TRUE, 'root_superadmin', '00000000-0000-0000-0000-000000000000', NOW(), NOW()),

-- Tenant Superadmins (1 Superadmin per Fakultas)
('00000000-0000-0000-0001-000000000002', '10000000-0000-0000-0000-000000000002', 'superadmin.fasilkom@untitled.com', 'Superadmin FASILKOM', TRUE, 'superadmin', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0001-000000000003', '10000000-0000-0000-0000-000000000003', 'superadmin.teknik@untitled.com', 'Superadmin Fakultas Teknik', TRUE, 'superadmin', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
('00000000-0000-0000-0001-000000000004', '10000000-0000-0000-0000-000000000004', 'superadmin.feb@untitled.com', 'Superadmin FEB', TRUE, 'superadmin', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),

-- Panitia Event Fakultas
('00000000-0000-0000-0001-000000000005', '10000000-0000-0000-0000-000000000002', 'panitia.fasilkom@untitled.com', 'Panitia Event FASILKOM', TRUE, 'panitia', '00000000-0000-0000-0000-000000000002', NOW(), NOW()),
('00000000-0000-0000-0001-000000000006', '10000000-0000-0000-0000-000000000003', 'panitia.teknik@untitled.com', 'Panitia Event FT', TRUE, 'panitia', '00000000-0000-0000-0000-000000000002', NOW(), NOW()),

-- Petugas Scanner Fakultas
('00000000-0000-0000-0001-000000000007', '10000000-0000-0000-0000-000000000002', 'scanner.fasilkom@untitled.com', 'Petugas Scanner FASILKOM', TRUE, 'scanner', '00000000-0000-0000-0000-000000000003', NOW(), NOW()),
('00000000-0000-0000-0001-000000000008', '10000000-0000-0000-0000-000000000003', 'scanner.teknik@untitled.com', 'Petugas Scanner FT', TRUE, 'scanner', '00000000-0000-0000-0000-000000000003', NOW(), NOW()),

-- Peserta Universal (Mahasiswa & Umum)
('00000000-0000-0000-0001-000000000009', NULL, 'peserta@untitled.com', 'Peserta Universal Mandiri', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW()),
('00000000-0000-0000-0001-000000000010', NULL, 'peserta-berbayar@gmail.com', 'Peserta Berbayar', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW()),
('00000000-0000-0000-0001-000000000011', NULL, 'peserta-scan-1@gmail.com', 'Peserta Scan 1', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW()),
('00000000-0000-0000-0001-000000000012', NULL, 'peserta-scan-2@gmail.com', 'Peserta Scan 2', TRUE, 'peserta', '00000000-0000-0000-0000-000000000004', NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    role_id = EXCLUDED.role_id,
    updated_at = NOW();

-- 2. Insert Accounts (Credentials)
INSERT INTO accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('00000000-0000-0000-0002-000000000001', 'superadmin.univ@untitled.com', 'credential', '00000000-0000-0000-0001-000000000001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000002', 'superadmin.fasilkom@untitled.com', 'credential', '00000000-0000-0000-0001-000000000002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000003', 'superadmin.teknik@untitled.com', 'credential', '00000000-0000-0000-0001-000000000003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000004', 'superadmin.feb@untitled.com', 'credential', '00000000-0000-0000-0001-000000000004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000005', 'panitia.fasilkom@untitled.com', 'credential', '00000000-0000-0000-0001-000000000005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000006', 'panitia.teknik@untitled.com', 'credential', '00000000-0000-0000-0001-000000000006', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000007', 'scanner.fasilkom@untitled.com', 'credential', '00000000-0000-0000-0001-000000000007', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000008', 'scanner.teknik@untitled.com', 'credential', '00000000-0000-0000-0001-000000000008', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000009', 'peserta@untitled.com', 'credential', '00000000-0000-0000-0001-000000000009', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000010', 'peserta-berbayar@gmail.com', 'credential', '00000000-0000-0000-0001-000000000010', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000011', 'peserta-scan-1@gmail.com', 'credential', '00000000-0000-0000-0001-000000000011', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW()),
('00000000-0000-0000-0002-000000000012', 'peserta-scan-2@gmail.com', 'credential', '00000000-0000-0000-0001-000000000012', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    password = EXCLUDED.password,
    updated_at = NOW();

-- 3. Connect Users to Roles in _role_to_user join table
INSERT INTO _role_to_user ("A", "B") VALUES
('00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0001-000000000001'), -- root_superadmin
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000002'), -- superadmin fasilkom
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000003'), -- superadmin teknik
('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0001-000000000004'), -- superadmin feb
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000005'), -- panitia fasilkom
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0001-000000000006'), -- panitia teknik
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000007'), -- scanner fasilkom
('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0001-000000000008'), -- scanner teknik
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000009'), -- peserta universal
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000010'), -- peserta-berbayar
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000011'), -- peserta-scan-1
('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0001-000000000012')  -- peserta-scan-2
ON CONFLICT ("A", "B") DO NOTHING;
