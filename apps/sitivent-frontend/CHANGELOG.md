# Changelog Utama - SITIVENT

Semua perubahan dan rilis penting pada proyek ini didokumentasikan di bawah ini berdasarkan riwayat komit pada branch `main`.

---

## [1.3.0] - 2026-07-25
### Fixed & Security
- Fix: Security check audit remediations across management modules and public routes (`47533d8`).
- Fix: Delete unused callback URL parameter (`1e423d8`).
- Chore: Update Playwright configuration & automated end-to-end test cases (`9f56860`, `2d49e74`, `dbff06d`).
- Chore: Add email provider domain blocking rules (`892490a`).
- Refactor: Modularize service layer into `admin`, `participant`, and `public` domain subdirectories.

## [1.2.0] - 2026-07-24 / 2026-07-25
### Added
- Feat: Comprehensive Playwright automated test scenario & test cases suite (`04bd10a`, `5c4e0a4`).
- Fix: Automated linting & code formatting rule integration (`9eb8496`).

## [1.1.0] - 2026-07-23
### Added
- Feat: Online attendance system with direct meeting confirmation (`ed78abf`).
- Feat: Testimonial banner & public feedback showcase (`69986bf`, `d52bb5f`).
- Feat: Participant interactive tour guide walkthrough (`2b05617`, `3363f73`).
- Feat: Excel data export for admin management reports (`6f5677d`).
- Feat: Newsletter subscription system & branded footer integration (`8bbf756`).
- Feat: SITIVENT branding logo & auth page brand identity (`90fc3de`, `339ce5d`).
- Feat: Fallback components & lazy loading optimizations (`35c0737`, `954b6c7`).
### Fixed
- Fix: Automatic assignment of `peserta` role upon user registration (`de04f0d`).
- Fix: Email queuing and background notification dispatcher (`2a45b8b`).
- Fix: Responsive layouts across desktop and mobile screens (`2ba290f`, `926033f`, `86f7d96`).
- Fix: QR code check-in state handling (`095fae7`).

## [1.0.0] - 2026-07-21 / 2026-07-22
### Added
- Feat: Mobile QR scanner with camera flash toggle & eruda debugging tools (`752e807`, `9bce6b8`).
- Feat: Superadmin & Panitia self-registration restriction guard (`73f2f7d`).
- Feat: Testimonial submission & rating system (`0b57b0b`).
- Feat: ImageKit storage integration & database migration update (`3e7ba32`, `29e5172`).
### Fixed
- Fix: Timezone date parsing & formatting consistency (`99b8c1f`, `4e241aa`).
- Fix: Scanner loading states & build compatibility (`ca6d836`, `b8f7f1a`, `0c7615d`, `ea5af25`).

## [0.9.0] - 2026-07-14 / 2026-07-18
### Added
- Feat: Participant profile management & secure password change (`41edb47`).
- Feat: Email verification & OTP authentication flow (`5fdb9f2`, `cb69ea5`).
- Feat: Publications module & Article management (`26308a0`).
### Fixed
- Fix: Restricted email domain policy for student/participant registrations (`2f846a6`).
- Fix: Camera permission request & scanner canvas handling (`f1a47c9`).

## [0.8.0] - 2026-07-13
### Added
- Feat: Gallery documentation bento layout (`770d46b`, `69964b3`).
- Feat: Support ticket system & participant helpdesk (`a3a9bca`).
- Feat: Dynamic route redirection & logout confirmation modal (`1b96165`, `fc0c25e`).
### Fixed
- Fix: Debouncing for search filters & active menu state indicators (`7aba316`, `016062c`).
- Fix: Profile picture cropper & hero banner display issues (`2eff2fa`, `b3a7a8d`).

## [0.5.0] - 2026-07-11 / 2026-07-12
### Added
- Feat: Certificate generator & template builder (`b334ab3`).
- Feat: Event registration & online payment gateway (`1ec7c1c`).
- Feat: Landing page & public event browsing UI (`91e9041`).
- Feat: Event categories taxonomy & navigation links (`5410a2f`, `a7b3710`).

## [0.1.0] - 2026-07-08 / 2026-07-10
### Added
- Feat: Initial project initialization (`2498a1f`).
- Feat: Core dependencies & UI component library setup (`f39129d`).
- Feat: QR Code Scanner page for event attendance (`71850b9`).
- Feat: CMS Admin Event Management & service architecture (`0c3bcdd`, `a851c85`).
- Feat: Middleware auth proxy & route security framework (`258a645`).
