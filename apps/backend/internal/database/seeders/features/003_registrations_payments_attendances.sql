-- =====================================================
-- SEEDER FEATURES: 003_registrations_payments_attendances.sql
-- =====================================================

-- 1. Insert Registrations
INSERT INTO registrations (
    id,
    event_id,
    user_id,
    registration_number,
    qr_token,
    online_attendance,
    status,
    created_at,
    updated_at
) VALUES
-- Peserta Scan 1 → Seminar (gratis), REGISTERED
(
    '40000000-0000-0000-0001-000000000001',
    '20000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0001-000000000006',
    'REG-SCAN-1-2026',
    'valid-token-scan1-12345',
    FALSE,
    'REGISTERED',
    NOW(),
    NOW()
),
-- Peserta Scan 2 → Seminar (gratis), CHECKED_IN
(
    '40000000-0000-0000-0001-000000000002',
    '20000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0001-000000000007',
    'REG-SCAN-2-2026',
    'used-token-scan2-99999',
    FALSE,
    'CHECKED_IN',
    NOW(),
    NOW()
),
-- Peserta Mandiri → Webinar (gratis), REGISTERED
(
    '40000000-0000-0000-0001-000000000003',
    '20000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0001-000000000004',
    'REG-PESERTA-GRATIS2-2026',
    'cert-blocked-token-888',
    TRUE,
    'REGISTERED',
    NOW(),
    NOW()
),
-- Peserta Berbayar → Workshop, WAITING_PAYMENT
(
    '40000000-0000-0000-0001-000000000004',
    '20000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0001-000000000005',
    'REG-BERBAYAR-WAITING-2026',
    'qr-berbayar-waiting-111',
    FALSE,
    'WAITING_PAYMENT',
    NOW(),
    NOW()
),
-- Peserta Mandiri → Workshop, REGISTERED (PAID)
(
    '40000000-0000-0000-0001-000000000005',
    '20000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0001-000000000004',
    'REG-BERBAYAR-PAID-2026',
    'qr-berbayar-paid-222',
    FALSE,
    'REGISTERED',
    NOW(),
    NOW()
),
-- Peserta Scan 1 → Konferensi, WAITING_PAYMENT
(
    '40000000-0000-0000-0001-000000000006',
    '20000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0001-000000000006',
    'REG-KONF-2026',
    'qr-konf-333',
    FALSE,
    'WAITING_PAYMENT',
    NOW(),
    NOW()
)
ON CONFLICT (registration_number) DO UPDATE SET
    status = EXCLUDED.status,
    qr_token = EXCLUDED.qr_token,
    updated_at = NOW();

-- 2. Insert Attendance for Peserta Scan 2
INSERT INTO attendances (id, registration_id, scan_time, scanner_id, status)
VALUES (
    '50000000-0000-0000-0001-000000000001',
    '40000000-0000-0000-0001-000000000002',
    NOW(),
    '00000000-0000-0000-0001-000000000001',
    'SUCCESS'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Payments
INSERT INTO payments (
    id,
    registration_id,
    amount,
    status,
    proof_url,
    verified_at,
    verified_by_id,
    created_at,
    updated_at
) VALUES
-- Payment WAITING for REG-BERBAYAR-WAITING-2026
(
    '60000000-0000-0000-0001-000000000001',
    '40000000-0000-0000-0001-000000000004',
    150000,
    'WAITING',
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
),
-- Payment PAID for REG-BERBAYAR-PAID-2026
(
    '60000000-0000-0000-0001-000000000002',
    '40000000-0000-0000-0001-000000000005',
    150000,
    'PAID',
    'https://placehold.co/800x600?text=Bukti+Pembayaran',
    NOW(),
    '00000000-0000-0000-0001-000000000001',
    NOW(),
    NOW()
),
-- Payment WAITING for REG-KONF-2026
(
    '60000000-0000-0000-0001-000000000003',
    '40000000-0000-0000-0001-000000000006',
    75000,
    'WAITING',
    NULL,
    NULL,
    NULL,
    NOW(),
    NOW()
)
ON CONFLICT (registration_id) DO UPDATE SET
    status = EXCLUDED.status,
    amount = EXCLUDED.amount,
    proof_url = EXCLUDED.proof_url,
    verified_at = EXCLUDED.verified_at,
    verified_by_id = EXCLUDED.verified_by_id,
    updated_at = NOW();

