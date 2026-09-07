-- =====================================================
-- SEEDER FEATURES: 002_events.sql
-- =====================================================

INSERT INTO events (
    id,
    tenant_id,
    title,
    slug,
    description,
    banner,
    start_date,
    end_date,
    start_time,
    end_time,
    location,
    event_type,
    online_attendance,
    registration_deadline,
    quota,
    price,
    status,
    certificate_enabled,
    published_at,
    category_id,
    created_by_id,
    created_at,
    updated_at
) VALUES
-- Event 1: Event Rektorat / Universitas
(
    '2093030b-adb4-4803-9af2-13a6c1ad8b1a',
    'c9711506-d356-4704-a32e-0543dfe3e104',
    'Seminar Dies Natalis & Inovasi Perguruan Tinggi 2026',
    'seminar-dies-natalis-2026',
    'Seminar tahunan universitas membahas perkembangan riset inovatif dan transformasi akademik Indonesia.',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60',
    '2026-10-10 00:00:00+00',
    '2026-10-10 00:00:00+00',
    '09:00',
    '12:00',
    'Auditorium Pusat Gedung Rektorat Lt. 3',
    'OFFLINE',
    FALSE,
    '2026-10-09 23:59:59+00',
    200,
    0,
    'PUBLISHED',
    TRUE,
    NOW(),
    '83780fb3-7c86-48f7-aeac-4e169a2ef760',
    '48e8167e-0105-4242-b6db-9bb12dc84bce',
    NOW(),
    NOW()
),
-- Event 2: Event Fasilkom (Webinar)
(
    '2d802a9d-970d-4a80-adcd-091d4d7b1c3d',
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'Webinar Desain UI/UX & Design Systems Fasilkom',
    'webinar-desain-ui-ux-fasilkom',
    'Webinar interaktif bersama praktisi UI/UX profesional alumni Fakultas Ilmu Komputer.',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=60',
    '2026-10-15 00:00:00+00',
    '2026-10-15 00:00:00+00',
    '13:00',
    '16:00',
    'Zoom Meeting (Link otomatis dikirim via email)',
    'ONLINE',
    TRUE,
    '2026-10-14 23:59:59+00',
    500,
    0,
    'PUBLISHED',
    TRUE,
    NOW(),
    '9ddd82e1-8f52-4e2f-a71a-1eee6d4a8798',
    '355f936d-e2b6-4ed3-8385-455115f605a3',
    NOW(),
    NOW()
),
-- Event 3: Event Fasilkom (Workshop Berbayar)
(
    'b62644fd-67db-4a89-8de9-b8b796086a2e',
    '20492a21-59c3-4edf-bb64-1eaa6cf11deb',
    'Workshop Full-Stack Go & Next.js Fasilkom',
    'workshop-fullstack-fasilkom',
    'Workshop intensif 2 hari membangun arsitektur monorepo modern dengan Go dan Next.js.',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    '2026-10-20 00:00:00+00',
    '2026-10-21 00:00:00+00',
    '09:00',
    '17:00',
    'Lab Komputer Gedung Fasilkom Lt. 3',
    'OFFLINE',
    FALSE,
    '2026-10-18 23:59:59+00',
    40,
    150000,
    'PUBLISHED',
    TRUE,
    NOW(),
    '94c14f8f-75c7-4e70-838c-fce050460ca8',
    'f01e763a-5729-4734-a40e-61b6b16f7450',
    NOW(),
    NOW()
),
-- Event 4: Event Fakultas Teknik (Expo Rekayasa)
(
    '1b0b2df2-87ab-412d-a3ae-8434f90ea1f5',
    '0ae41d16-bc49-4a88-b079-94def1b5b3ff',
    'Expo Rekayasa & Otomasi Robotika FT 2026',
    'expo-rekayasa-ft-2026',
    'Pameran proyek inovasi teknologi mesin, elektro, dan robotika karya mahasiswa Fakultas Teknik.',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=60',
    '2026-11-05 00:00:00+00',
    '2026-11-06 00:00:00+00',
    '08:00',
    '17:00',
    'Plaza Gedung Fakultas Teknik',
    'OFFLINE',
    FALSE,
    '2026-10-31 23:59:59+00',
    100,
    75000,
    'PUBLISHED',
    TRUE,
    NOW(),
    'be9b5e2b-ae8b-48f6-a8c2-fe47c99782e4',
    '8d0f1b93-ecf3-4488-851f-343defd33246',
    NOW(),
    NOW()
),
-- Event 5: Event FEB (Kompetisi Business Plan)
(
    '0cab550d-5978-4ed3-a505-8a02e6e20144',
    '2f36ab3a-bc06-4652-8bc4-cc8f7a703eb9',
    'National Business Case Competition FEB 2026',
    'national-business-case-feb',
    'Ajang kompetisi analisis studi kasus bisnis nasional untuk mahasiswa sarjana ekonomi se-Indonesia.',
    NULL,
    '2026-12-01 00:00:00+00',
    '2026-12-01 00:00:00+00',
    '08:00',
    '17:00',
    'Hall Utama FEB',
    'OFFLINE',
    FALSE,
    '2026-11-25 23:59:59+00',
    80,
    50000,
    'DRAFT',
    FALSE,
    NULL,
    '3ea53a64-535a-42b8-9379-1740813051be',
    '81537a6d-d297-450b-ab75-5b8a888842f2',
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    created_by_id = EXCLUDED.created_by_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    quota = EXCLUDED.quota,
    status = EXCLUDED.status,
    updated_at = NOW();

-- =====================================================
-- Benefits
-- =====================================================
INSERT INTO event_benefits (id, event_id, title, description, icon, "order") VALUES
-- Benefits for Workshop Fullstack Fasilkom (b62644fd-67db-4a89-8de9-b8b796086a2e)
('91011111-0001-4000-8000-000000000001', 'b62644fd-67db-4a89-8de9-b8b796086a2e', 'Sertifikat Resmi Kelulusan 16 JP', 'E-Sertifikat resmi terverifikasi barcode dari FASILKOM & Rektorat', 'solar:diploma-verified-bold-duotone', 1),
('91011111-0001-4000-8000-000000000002', 'b62644fd-67db-4a89-8de9-b8b796086a2e', 'Source Code & Starter Kit Lengkap', 'Akses repositori GitHub arsitektur monorepo polyglot Go & Next.js', 'solar:code-file-bold-duotone', 2),
('91011111-0001-4000-8000-000000000003', 'b62644fd-67db-4a89-8de9-b8b796086a2e', 'Snack, Lunch & Coffee Break 2 Hari', 'Konsumsi makan siang dan coffee break selama kegiatan workshop luring', 'solar:cup-hot-bold-duotone', 3),
('91011111-0001-4000-8000-000000000004', 'b62644fd-67db-4a89-8de9-b8b796086a2e', 'Akses Grup Discord Mentoring VIP', 'Diskusi karir, konsultasi arsitektur, dan code review bersama instruktur', 'solar:users-group-rounded-bold-duotone', 4),

-- Benefits for Seminar Dies Natalis (2093030b-adb4-4803-9af2-13a6c1ad8b1a)
('91011111-0002-4000-8000-000000000001', '2093030b-adb4-4803-9af2-13a6c1ad8b1a', 'Sertifikat Kehadiran Nasional', 'E-Certificate berskala nasional ditandatangani oleh Rektor', 'solar:diploma-verified-bold-duotone', 1),
('91011111-0002-4000-8000-000000000002', '2093030b-adb4-4803-9af2-13a6c1ad8b1a', 'Seminar Kit & Souvenir Eksklusif', 'Goodie bag, buku panduan riset perguruan tinggi, dan cinderamata', 'solar:gift-bold-duotone', 2),

-- Benefits for Webinar UI/UX Fasilkom (2d802a9d-970d-4a80-adcd-091d4d7b1c3d)
('91011111-0003-4000-8000-000000000001', '2d802a9d-970d-4a80-adcd-091d4d7b1c3d', 'E-Certificate Terverifikasi', 'Sertifikat digital resmi dengan QR code verifikasi online', 'solar:diploma-verified-bold-duotone', 1),
('91011111-0003-4000-8000-000000000002', '2d802a9d-970d-4a80-adcd-091d4d7b1c3d', 'Materi Slide & Rekaman Zoom', 'Akses seumur hidup ke rekaman video dan modul materi Figma', 'solar:videocamera-record-bold-duotone', 2)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    "order" = EXCLUDED."order",
    updated_at = NOW();

-- =====================================================
-- Speakers
-- =====================================================
INSERT INTO event_speakers (id, event_id, name, title, company, company_url, github, instagram, linked_in, avatar, "order") VALUES
-- Speakers for Workshop Fullstack Fasilkom (b62644fd-67db-4a89-8de9-b8b796086a2e)
('81011111-0001-4000-8000-000000000001', 'b62644fd-67db-4a89-8de9-b8b796086a2e', 'Naufal Akbar Nugroho', 'Lead Software Architect', 'TechLabs Indonesia', 'https://techlabs.id', 'nuflakbrr', 'nuflakbrr', 'naufalakbarnugroho', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80', 1),
('81011111-0001-4000-8000-000000000002', 'b62644fd-67db-4a89-8de9-b8b796086a2e', 'Dr. Ir. Hendra Prasetyo, M.T.', 'Dosen Sistem Terdistribusi', 'Fakultas Ilmu Komputer', 'https://cs.umn.ac.id', 'hendra-p', NULL, 'hendra-prasetyo', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80', 2),

-- Speakers for Webinar UI/UX (2d802a9d-970d-4a80-adcd-091d4d7b1c3d)
('81011111-0002-4000-8000-000000000001', '2d802a9d-970d-4a80-adcd-091d4d7b1c3d', 'Siti Rahmawati, S.Kom.', 'Senior Product Designer', 'Unicorn Tech Asia', 'https://unicorn.tech', NULL, 'sitirahma_ux', 'siti-rahmawati-ux', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80', 1),

-- Speakers for Seminar Dies Natalis (2093030b-adb4-4803-9af2-13a6c1ad8b1a)
('81011111-0003-4000-8000-000000000001', '2093030b-adb4-4803-9af2-13a6c1ad8b1a', 'Prof. Dr. Ir. Budi Santoso, M.Sc.', 'Rektor Universitas Mandiri Nusantara', 'Universitas Mandiri Nusantara', 'https://umn.ac.id', NULL, NULL, 'prof-budi-santoso', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80', 1)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    company = EXCLUDED.company,
    company_url = EXCLUDED.company_url,
    github = EXCLUDED.github,
    instagram = EXCLUDED.instagram,
    linked_in = EXCLUDED.linked_in,
    avatar = EXCLUDED.avatar,
    "order" = EXCLUDED."order",
    updated_at = NOW();
