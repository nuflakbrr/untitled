-- =====================================================
-- SEEDER CORE: 003_users_and_accounts.sql
-- Password untuk semua akun: "password"
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =====================================================

-- 1. Insert Users with Tenant Scoping
INSERT INTO core.users (id, tenant_id, email, name, email_verified, image, role, role_id, created_at, updated_at) VALUES
('48e8167e-0105-4242-b6db-9bb12dc84bce', 'c9711506-d356-4704-a32e-0543dfe3e104', 'superadmin.univ@gmail.com', 'Superadmin Universitas (Rektorat)', TRUE, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'root_superadmin', '22b345bc-6566-4a25-86be-a4b63de6353e', NOW(), NOW()),
('355f936d-e2b6-4ed3-8385-455115f605a3', '20492a21-59c3-4edf-bb64-1eaa6cf11deb', 'superadmin.fasilkom@gmail.com', 'Superadmin FASILKOM', TRUE, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'superadmin', '9a0b32f2-61f1-4048-82fd-1a84b489255c', NOW(), NOW()),
('8d0f1b93-ecf3-4488-851f-343defd33246', '0ae41d16-bc49-4a88-b079-94def1b5b3ff', 'superadmin.teknik@gmail.com', 'Superadmin Fakultas Teknik', TRUE, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'superadmin', '9a0b32f2-61f1-4048-82fd-1a84b489255c', NOW(), NOW()),
('81537a6d-d297-450b-ab75-5b8a888842f2', '2f36ab3a-bc06-4652-8bc4-cc8f7a703eb9', 'superadmin.feb@gmail.com', 'Superadmin FEB', TRUE, 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'superadmin', '9a0b32f2-61f1-4048-82fd-1a84b489255c', NOW(), NOW()),
('f01e763a-5729-4734-a40e-61b6b16f7450', '20492a21-59c3-4edf-bb64-1eaa6cf11deb', 'panitia.fasilkom@gmail.com', 'Panitia Event FASILKOM', TRUE, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', 'panitia', '96866579-bb48-4eb8-8e60-003ab562f8e1', NOW(), NOW()),
('d04410fc-542d-43a2-b9d0-90b3ad6e5b8a', '0ae41d16-bc49-4a88-b079-94def1b5b3ff', 'panitia.teknik@gmail.com', 'Panitia Event FT', TRUE, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', 'panitia', '96866579-bb48-4eb8-8e60-003ab562f8e1', NOW(), NOW()),
('0702c5aa-dfd8-4908-aa4e-9a5f54c981f7', '20492a21-59c3-4edf-bb64-1eaa6cf11deb', 'scanner.fasilkom@gmail.com', 'Petugas Scanner FASILKOM', TRUE, NULL, 'scanner', '6e08eba3-e925-45e8-82ef-86103816567b', NOW(), NOW()),
('ef0ff24e-68d1-4713-aeb6-b7f61af6e761', '0ae41d16-bc49-4a88-b079-94def1b5b3ff', 'scanner.teknik@gmail.com', 'Petugas Scanner FT', TRUE, NULL, 'scanner', '6e08eba3-e925-45e8-82ef-86103816567b', NOW(), NOW()),
('4dcf1bcc-9f81-49bf-a1d4-41031ca97187', NULL, 'peserta@gmail.com', 'Peserta Universal Mandiri', TRUE, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', 'peserta', '096401d0-a130-4d9b-a596-d0cb26554402', NOW(), NOW()),
('62091730-0a40-4962-b56f-5cd44f9a9ffb', NULL, 'peserta-berbayar@gmail.com', 'Peserta Berbayar', TRUE, NULL, 'peserta', '096401d0-a130-4d9b-a596-d0cb26554402', NOW(), NOW()),
('130bcee7-2cd8-45f1-8d5f-2a104d411ed7', NULL, 'peserta-scan-1@gmail.com', 'Peserta Scan 1', TRUE, NULL, 'peserta', '096401d0-a130-4d9b-a596-d0cb26554402', NOW(), NOW()),
('44b29e55-b172-4aa6-8f7a-229b0ff558e2', NULL, 'peserta-scan-2@gmail.com', 'Peserta Scan 2', TRUE, NULL, 'peserta', '096401d0-a130-4d9b-a596-d0cb26554402', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    image = EXCLUDED.image,
    role = EXCLUDED.role,
    role_id = EXCLUDED.role_id,
    updated_at = NOW();

-- 2. Insert Accounts (Credentials)
INSERT INTO core.accounts (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES
('47def472-fd2a-431c-b842-e3c200e7e90f', 'superadmin.univ@untitled.ac.id', 'credential', '48e8167e-0105-4242-b6db-9bb12dc84bce', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('86b4322b-ea61-4ef6-8635-349d5d0150fb', 'superadmin.fasilkom@untitled.ac.id', 'credential', '355f936d-e2b6-4ed3-8385-455115f605a3', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('af46b3ca-fbf3-4904-9e37-311992f8a907', 'superadmin.teknik@untitled.ac.id', 'credential', '8d0f1b93-ecf3-4488-851f-343defd33246', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('2182b055-5ada-4653-9b1d-c545e25def59', 'superadmin.feb@untitled.ac.id', 'credential', '81537a6d-d297-450b-ab75-5b8a888842f2', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('92076eae-79c5-45d8-a05e-2cdadc29ddcf', 'panitia.fasilkom@untitled.ac.id', 'credential', 'f01e763a-5729-4734-a40e-61b6b16f7450', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('99a9fe9a-bd7b-429a-991e-57e150b342a9', 'panitia.teknik@untitled.ac.id', 'credential', 'd04410fc-542d-43a2-b9d0-90b3ad6e5b8a', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('2ba5415e-f0dc-406a-ae57-8d9945a445f8', 'scanner.fasilkom@untitled.ac.id', 'credential', '0702c5aa-dfd8-4908-aa4e-9a5f54c981f7', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('0fdd243b-3e5b-42be-986b-f1d0bbd0301b', 'scanner.teknik@untitled.ac.id', 'credential', 'ef0ff24e-68d1-4713-aeb6-b7f61af6e761', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('b2662f61-191a-4418-b0e4-1a9aa302dca0', 'peserta@untitled.ac.id', 'credential', '4dcf1bcc-9f81-49bf-a1d4-41031ca97187', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('ba5fae91-9539-45bd-b385-b8d98cfe445e', 'peserta-berbayar@gmail.com', 'credential', '62091730-0a40-4962-b56f-5cd44f9a9ffb', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('b1229778-5bba-4bdb-a29e-f04f1d6bb434', 'peserta-scan-1@gmail.com', 'credential', '130bcee7-2cd8-45f1-8d5f-2a104d411ed7', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW()),
('7660742b-e2b4-4ac5-873f-d99a73b900ff', 'peserta-scan-2@gmail.com', 'credential', '44b29e55-b172-4aa6-8f7a-229b0ff558e2', '$2a$10$NGxjuqFCFKt4tN426NnTDuQdoKEJtl4oFfUeIWtENxG9whD4nbePO', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    account_id = EXCLUDED.account_id,
    password = EXCLUDED.password,
    updated_at = NOW();

-- 3. Connect Users to Roles in core._role_to_user join table
INSERT INTO core._role_to_user ("A", "B") VALUES
('22b345bc-6566-4a25-86be-a4b63de6353e', '48e8167e-0105-4242-b6db-9bb12dc84bce'),
('9a0b32f2-61f1-4048-82fd-1a84b489255c', '355f936d-e2b6-4ed3-8385-455115f605a3'),
('9a0b32f2-61f1-4048-82fd-1a84b489255c', '8d0f1b93-ecf3-4488-851f-343defd33246'),
('9a0b32f2-61f1-4048-82fd-1a84b489255c', '81537a6d-d297-450b-ab75-5b8a888842f2'),
('96866579-bb48-4eb8-8e60-003ab562f8e1', 'f01e763a-5729-4734-a40e-61b6b16f7450'),
('96866579-bb48-4eb8-8e60-003ab562f8e1', 'd04410fc-542d-43a2-b9d0-90b3ad6e5b8a'),
('6e08eba3-e925-45e8-82ef-86103816567b', '0702c5aa-dfd8-4908-aa4e-9a5f54c981f7'),
('6e08eba3-e925-45e8-82ef-86103816567b', 'ef0ff24e-68d1-4713-aeb6-b7f61af6e761'),
('096401d0-a130-4d9b-a596-d0cb26554402', '4dcf1bcc-9f81-49bf-a1d4-41031ca97187'),
('096401d0-a130-4d9b-a596-d0cb26554402', '62091730-0a40-4962-b56f-5cd44f9a9ffb'),
('096401d0-a130-4d9b-a596-d0cb26554402', '130bcee7-2cd8-45f1-8d5f-2a104d411ed7'),
('096401d0-a130-4d9b-a596-d0cb26554402', '44b29e55-b172-4aa6-8f7a-229b0ff558e2')
ON CONFLICT ("A", "B") DO NOTHING;

-- 4. Populate user_has_tenants (multi-tenant access map) from the seeded users.
-- Without this, HasTenantAccess() always returns false for non-root users and
-- switch-tenant is rejected for every seeded account.
INSERT INTO core.user_has_tenants (user_id, tenant_id, role_id)
SELECT id, tenant_id, role_id FROM core.users WHERE tenant_id IS NOT NULL
ON CONFLICT (user_id, tenant_id) DO UPDATE SET role_id = EXCLUDED.role_id, updated_at = NOW();

-- Keep every seeded login account on the same Gmail domain.
UPDATE core.users
SET email = regexp_replace(email, '@untitled\.ac\.id$', '@gmail.com')
WHERE email LIKE '%@untitled.ac.id';

UPDATE core.accounts AS accounts
SET account_id = users.email
FROM core.users AS users
WHERE accounts.user_id = users.id;
