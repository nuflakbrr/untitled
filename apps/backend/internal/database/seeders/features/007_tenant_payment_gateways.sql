-- =====================================================
-- SEEDER FEATURES: 007_tenant_payment_gateways.sql
-- =====================================================

INSERT INTO tenant_payment_gateways (
    id,
    tenant_id,
    provider,
    is_active,
    api_key,
    virtual_account,
    env,
    bank_name,
    bank_account_number,
    bank_account_holder,
    created_at,
    updated_at
) VALUES
-- 1. Rektorat / Universitas (iPaymu + Rekening BNI)
(
    '60000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'IPAYMU',
    TRUE,
    'SANDBOX_API_KEY_REKTORAT_UMN_2026',
    '081211111111',
    'sandbox',
    'Bank BNI',
    '0123456789',
    'Universitas Mandiri Nusantara (Kas Rektorat)',
    NOW(),
    NOW()
),
-- 2. Fakultas Ilmu Komputer (iPaymu + Rekening Mandiri)
(
    '60000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'IPAYMU',
    TRUE,
    'SANDBOX_API_KEY_FASILKOM_UMN_2026',
    '081222222222',
    'sandbox',
    'Bank Mandiri',
    '1370001234567',
    'Fakultas Ilmu Komputer UMN (Kas Event)',
    NOW(),
    NOW()
),
-- 3. Fakultas Teknik (iPaymu + Rekening BRI)
(
    '60000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'IPAYMU',
    TRUE,
    'SANDBOX_API_KEY_TEKNIK_UMN_2026',
    '081233333333',
    'sandbox',
    'Bank BRI',
    '002101001234567',
    'Fakultas Teknik UMN (Kas Kegiatan)',
    NOW(),
    NOW()
),
-- 4. Fakultas Ekonomi & Bisnis (iPaymu + Rekening BSI)
(
    '60000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000004',
    'IPAYMU',
    TRUE,
    'SANDBOX_API_KEY_FEB_UMN_2026',
    '081244444444',
    'sandbox',
    'Bank Syariah Indonesia (BSI)',
    '7123456789',
    'FEB UMN (Kas Panitia)',
    NOW(),
    NOW()
)
ON CONFLICT (tenant_id) DO UPDATE SET
    provider = EXCLUDED.provider,
    is_active = EXCLUDED.is_active,
    api_key = EXCLUDED.api_key,
    virtual_account = EXCLUDED.virtual_account,
    env = EXCLUDED.env,
    bank_name = EXCLUDED.bank_name,
    bank_account_number = EXCLUDED.bank_account_number,
    bank_account_holder = EXCLUDED.bank_account_holder,
    updated_at = NOW();

