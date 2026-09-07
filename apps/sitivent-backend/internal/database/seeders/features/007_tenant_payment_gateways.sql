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
    '94449c8b-2516-4a15-a976-c0ad9201263f',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'IPAYMU',
    TRUE,
    'SANDBOX297E82DB-650D-4812-A047-09EE1A0B427A',
    '0000005155343604',
    'sandbox',
    'Bank BNI',
    '0123456789',
    'Universitas Mandiri Nusantara (Kas Rektorat)',
    NOW(),
    NOW()
),
-- 2. Fakultas Ilmu Komputer (iPaymu + Rekening Mandiri)
(
    'c61e17f7-5f91-443f-be89-b3120cbaaf73',
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'IPAYMU',
    TRUE,
    'SANDBOX297E82DB-650D-4812-A047-09EE1A0B427A',
    '0000005155343604',
    'sandbox',
    'Bank Mandiri',
    '1370001234567',
    'Fakultas Ilmu Komputer UMN (Kas Event)',
    NOW(),
    NOW()
),
-- 3. Fakultas Teknik (iPaymu + Rekening BRI)
(
    '9a389817-67f5-4c33-8069-db4ff463338f',
    '0ae41d16-bc49-4a88-b079-94def1b5b3ff',
    'IPAYMU',
    TRUE,
    'SANDBOX297E82DB-650D-4812-A047-09EE1A0B427A',
    '0000005155343604',
    'sandbox',
    'Bank BRI',
    '002101001234567',
    'Fakultas Teknik UMN (Kas Kegiatan)',
    NOW(),
    NOW()
),
-- 4. Fakultas Ekonomi & Bisnis (iPaymu + Rekening BSI)
(
    '3e71ffe8-ddd4-452b-be13-e6707cb709d0',
    '2f36ab3a-bc06-4652-8bc4-cc8f7a703eb9',
    'IPAYMU',
    TRUE,
    'SANDBOX297E82DB-650D-4812-A047-09EE1A0B427A',
    '0000005155343604',
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
