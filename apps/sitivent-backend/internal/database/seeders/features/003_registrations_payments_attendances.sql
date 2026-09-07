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
    'cbec1bfe-d5c4-4f8b-93d4-0efcba9dd715',
    '2093030b-adb4-4803-9af2-13a6c1ad8b1a',
    '130bcee7-2cd8-45f1-8d5f-2a104d411ed7',
    'REG-SCAN-1-2026',
    'valid-token-scan1-12345',
    FALSE,
    'REGISTERED',
    NOW(),
    NOW()
),
-- Peserta Scan 2 → Seminar (gratis), CHECKED_IN
(
    'b68a3fc3-c27a-44f3-9a5f-d05e5910aab0',
    '2093030b-adb4-4803-9af2-13a6c1ad8b1a',
    '44b29e55-b172-4aa6-8f7a-229b0ff558e2',
    'REG-SCAN-2-2026',
    'used-token-scan2-99999',
    FALSE,
    'CHECKED_IN',
    NOW(),
    NOW()
),
-- Peserta Mandiri → Webinar (gratis), REGISTERED
(
    '0f77a14c-56af-437f-a974-088c82fbcf45',
    '2d802a9d-970d-4a80-adcd-091d4d7b1c3d',
    '4dcf1bcc-9f81-49bf-a1d4-41031ca97187',
    'REG-PESERTA-GRATIS2-2026',
    'cert-blocked-token-888',
    TRUE,
    'REGISTERED',
    NOW(),
    NOW()
),
-- Peserta Berbayar → Workshop, WAITING_PAYMENT
(
    'fe579b04-e087-47ec-86fa-adc8dc31a77c',
    'b62644fd-67db-4a89-8de9-b8b796086a2e',
    '62091730-0a40-4962-b56f-5cd44f9a9ffb',
    'REG-BERBAYAR-WAITING-2026',
    'qr-berbayar-waiting-111',
    FALSE,
    'WAITING_PAYMENT',
    NOW(),
    NOW()
),
-- Peserta Mandiri → Workshop, REGISTERED (PAID)
(
    'e3b251b9-b6af-47fb-980c-2d0e089e04ac',
    'b62644fd-67db-4a89-8de9-b8b796086a2e',
    '4dcf1bcc-9f81-49bf-a1d4-41031ca97187',
    'REG-BERBAYAR-PAID-2026',
    'qr-berbayar-paid-222',
    FALSE,
    'REGISTERED',
    NOW(),
    NOW()
),
-- Peserta Scan 1 → Konferensi, WAITING_PAYMENT
(
    '71faeb86-8116-45e8-99f9-aa629b254520',
    '1b0b2df2-87ab-412d-a3ae-8434f90ea1f5',
    '130bcee7-2cd8-45f1-8d5f-2a104d411ed7',
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
    '1e10f313-2581-4a8c-86a0-c5a0ae6f6c15',
    'b68a3fc3-c27a-44f3-9a5f-d05e5910aab0',
    NOW(),
    '48e8167e-0105-4242-b6db-9bb12dc84bce',
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
    '09a2a6fd-fee7-4911-b6cf-82d62f7b01c5',
    'fe579b04-e087-47ec-86fa-adc8dc31a77c',
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
    'd273ee36-1220-4de5-912b-d1144bd9916a',
    'e3b251b9-b6af-47fb-980c-2d0e089e04ac',
    150000,
    'PAID',
    'https://placehold.co/800x600?text=Bukti+Pembayaran',
    NOW(),
    '48e8167e-0105-4242-b6db-9bb12dc84bce',
    NOW(),
    NOW()
),
-- Payment WAITING for REG-KONF-2026
(
    'ba055f02-8eff-4d7d-b11f-cc5563a125f5',
    '71faeb86-8116-45e8-99f9-aa629b254520',
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
