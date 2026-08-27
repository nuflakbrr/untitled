-- =====================================================
-- SEEDER CORE: 001_permissions.sql
-- =====================================================

INSERT INTO permissions (id, name, description, created_at, updated_at) VALUES
-- Core / Administration Module
('10000000-0000-0000-0000-000000000001', 'permission.read', 'Melihat daftar hak akses', NOW(), NOW()),
('10000000-0000-0000-0000-000000000002', 'permission.create', 'Membuat hak akses baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000003', 'permission.update', 'Mengubah data hak akses', NOW(), NOW()),
('10000000-0000-0000-0000-000000000004', 'permission.delete', 'Menghapus hak akses', NOW(), NOW()),
('10000000-0000-0000-0000-000000000005', 'role.read', 'Melihat daftar jabatan', NOW(), NOW()),
('10000000-0000-0000-0000-000000000006', 'role.create', 'Membuat jabatan baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000007', 'role.update', 'Mengubah data jabatan', NOW(), NOW()),
('10000000-0000-0000-0000-000000000008', 'role.delete', 'Menghapus jabatan', NOW(), NOW()),
('10000000-0000-0000-0000-000000000009', 'user.read', 'Melihat daftar pengguna', NOW(), NOW()),
('10000000-0000-0000-0000-000000000010', 'user.create', 'Membuat pengguna baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000011', 'user.update', 'Mengubah data pengguna', NOW(), NOW()),
('10000000-0000-0000-0000-000000000012', 'user.delete', 'Menghapus pengguna', NOW(), NOW()),
('10000000-0000-0000-0000-000000000013', 'admin.access', 'Mengakses dashboard admin', NOW(), NOW()),

-- Event Categories Module
('10000000-0000-0000-0000-000000000014', 'event.categories.read', 'Melihat daftar event kategori', NOW(), NOW()),
('10000000-0000-0000-0000-000000000015', 'event.categories.create', 'Membuat event kategori baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000016', 'event.categories.update', 'Mengubah data event kategori', NOW(), NOW()),
('10000000-0000-0000-0000-000000000017', 'event.categories.delete', 'Menghapus event kategori', NOW(), NOW()),

-- Articles Module
('10000000-0000-0000-0000-000000000018', 'article.read', 'Melihat daftar artikel', NOW(), NOW()),
('10000000-0000-0000-0000-000000000019', 'article.create', 'Membuat artikel baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000020', 'article.update', 'Mengubah data artikel', NOW(), NOW()),
('10000000-0000-0000-0000-000000000021', 'article.delete', 'Menghapus artikel', NOW(), NOW()),
('10000000-0000-0000-0000-000000000022', 'article.category.read', 'Melihat daftar kategori artikel', NOW(), NOW()),
('10000000-0000-0000-0000-000000000023', 'article.category.create', 'Membuat kategori artikel baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000024', 'article.category.update', 'Mengubah data kategori artikel', NOW(), NOW()),
('10000000-0000-0000-0000-000000000025', 'article.category.delete', 'Menghapus kategori artikel', NOW(), NOW()),

-- Galleries Module
('10000000-0000-0000-0000-000000000026', 'galleries.read', 'Melihat daftar galeri', NOW(), NOW()),
('10000000-0000-0000-0000-000000000027', 'galleries.create', 'Membuat galeri baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000028', 'galleries.update', 'Mengubah data galeri', NOW(), NOW()),
('10000000-0000-0000-0000-000000000029', 'galleries.delete', 'Menghapus galeri', NOW(), NOW()),

-- Testimonies Module
('10000000-0000-0000-0000-000000000030', 'testimonies.read', 'Melihat daftar testimoni', NOW(), NOW()),
('10000000-0000-0000-0000-000000000031', 'testimonies.create', 'Membuat testimoni baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000032', 'testimonies.update', 'Mengubah data testimoni', NOW(), NOW()),
('10000000-0000-0000-0000-000000000033', 'testimonies.delete', 'Menghapus testimoni', NOW(), NOW()),

-- Event Module
('10000000-0000-0000-0000-000000000034', 'events.read', 'Melihat daftar event', NOW(), NOW()),
('10000000-0000-0000-0000-000000000035', 'events.create', 'Membuat event baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000036', 'events.update', 'Mengubah data event', NOW(), NOW()),
('10000000-0000-0000-0000-000000000037', 'events.delete', 'Menghapus event', NOW(), NOW()),
('10000000-0000-0000-0000-000000000038', 'events.publish', 'Mempublikasikan event', NOW(), NOW()),

-- Registration Module
('10000000-0000-0000-0000-000000000039', 'registrations.read', 'Melihat daftar registrasi', NOW(), NOW()),

-- Payment Module
('10000000-0000-0000-0000-000000000040', 'payments.verify', 'Memverifikasi pembayaran', NOW(), NOW()),

-- Certificate Module
('10000000-0000-0000-0000-000000000041', 'certificates.read', 'Melihat sertifikat', NOW(), NOW()),
('10000000-0000-0000-0000-000000000042', 'certificates.create', 'Membuat sertifikat baru', NOW(), NOW()),
('10000000-0000-0000-0000-000000000043', 'certificates.download', 'Mengunduh sertifikat', NOW(), NOW()),

-- Attendance Module
('10000000-0000-0000-0000-000000000044', 'attendance.scan', 'Melakukan pemindaian kehadiran', NOW(), NOW()),

-- Support Module
('10000000-0000-0000-0000-000000000045', 'support.read', 'Melihat pesan dukungan', NOW(), NOW()),
('10000000-0000-0000-0000-000000000046', 'support.update', 'Mengubah status pesan dukungan', NOW(), NOW()),

-- Participant Module
('10000000-0000-0000-0000-000000000047', 'participant.dashboard', 'Mengakses dashboard peserta', NOW(), NOW())
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    updated_at = NOW();

