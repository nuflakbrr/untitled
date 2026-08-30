# Frontend ↔ Backend Gap Audit

Tanggal audit: 2026-08-30

Scope: seluruh route yang diregistrasikan di `apps/backend/internal/modules/**/main.*.go`, kontrak DTO/service/repository terkait, serta konsumennya di `apps/frontend/src/auth/actions.ts`, `apps/frontend/src/lib/api/**`, dan App Router.
Definisi gap: kemampuan backend yang tidak tersedia/berbeda di frontend, kebutuhan frontend yang tidak didukung backend, atau kontrak keamanan/data yang membuat kedua sisi berperilaku tidak konsisten.

## Legenda

- **CRITICAL**: memungkinkan eskalasi hak akses atau kebocoran lintas tenant.
- **HIGH**: alur utama salah/rusak, kontrol keamanan dapat dilewati, atau data dapat tidak konsisten.
- **MEDIUM**: fitur backend tidak dapat digunakan dari frontend atau kontrak data/UX tidak lengkap.
- **LOW**: dokumentasi, metadata, atau konsistensi yang tidak langsung memblokir alur utama.
- **Terintegrasi**: endpoint utama sudah memiliki caller; bukan berarti seluruh field, error, dan variasi alurnya sudah lengkap.

## Ringkasan cakupan route

| Modul | Kondisi integrasi |
| --- | --- |
| Auth | Sebagian; login, me, logout, switch tenant ada, tetapi refresh/revocation dan role tenant bermasalah |
| Permission | CRUD terintegrasi; guard, error handling, dan konsistensi taxonomy belum aman |
| Role | CRUD + assignment permission ada; role per membership tenant belum diterapkan oleh authz |
| Tenant | CRUD ada; konfigurasi payment gateway dan public tenant API belum dipakai |
| User | CRUD/ban ada; multi-tenant, role assignment, revocation, dan boundary masih memiliki gap kritis |
| Event & kategori | Public read ada; seluruh pengelolaan admin/lifecycle belum tersedia |
| Registration | Create + daftar milik peserta ada; cancel, daftar peserta event, dan export belum tersedia |
| Payment | Checkout ada; proof, detail, verification, riwayat, dan rekonsiliasi belum lengkap |
| Attendance | Tidak memiliki caller frontend |
| Certificate | Participant list/verify ada; template, generate, dan job monitoring belum tersedia |
| Article/category | Public read ada; admin CRUD dan publishing contract belum tersedia |
| Gallery | Public read terbatas; admin CRUD/filter/pagination belum tersedia |
| Testimonial | Participant create/list ada; public/admin moderation tidak ada |
| Support | Tidak memiliki caller frontend |
| Audit log | Tidak memiliki caller frontend |

## 1. Keamanan autentikasi, PBAC, dan isolasi tenant

1. **CRITICAL — Non-root dapat membuat `root_superadmin`.** Handler create user hanya memaksa tenant untuk non-root, tetapi tidak menolak role `root_superadmin`; handler update justru memiliki penolakan tersebut. Login kemudian memperlakukan nama role itu sebagai bypass global. Evidence: `apps/backend/internal/modules/core/user/handler/user.handler.go`, `apps/backend/internal/modules/core/auth/service/auth.service.go`.
2. **CRITICAL — Non-root dapat mengirim `tenant_ids` lintas tenant saat create user.** Handler mengubah `tenant_id`, tetapi tidak membersihkan/membatasi seluruh `tenant_ids`; service menyimpan membership yang dikirim client. Direct API caller dapat mencoba memberi akses organisasi lain.
3. **CRITICAL — `user_has_tenants.role_id` tidak menjadi sumber authorization.** Permission resolution membaca role global user/role-permission dan mengabaikan role membership tenant. Skema multi-tenant mengizinkan role per tenant, tetapi keputusan akses tidak memakainya. Evidence: `apps/backend/internal/shared/authz/service.go`, `apps/backend/internal/modules/core/role/repository/role.repository.go`, migration `000012_create_user_tenant_access.up.sql`.
4. **CRITICAL — `tenantID` pada `GetUserPermissions` praktis diabaikan.** Pemanggil memberikan tenant aktif, tetapi query permission tidak membatasi assignment sesuai tenant tersebut.
5. **CRITICAL — Switch tenant menandatangani JWT dengan role global.** `SwitchTenant` mengganti tenant claim tetapi tetap memakai `user.Role`/`user.RoleID`, bukan role dari membership tenant terpilih.
6. **CRITICAL — Membership tenant tidak menjamin role yang sesuai tenant.** Akun dapat terlihat multi-tenant di switcher, tetapi otoritasnya tetap berasal dari satu role global.
7. **HIGH — Refresh token dapat melewati revocation access token.** Route refresh bersifat public dan langsung memanggil helper refresh tanpa middleware revocation yang dipakai protected route. Evidence: `auth/main.auth.go`, `auth/handler/auth.handler.go`, `pkg/jwt/jwt.go`.
8. **HIGH — Refresh menerima claim token lama lalu membuat JTI baru.** Revocation JTI lama tidak cukup bila token lama masih dapat dipakai ke endpoint refresh.
9. **HIGH — Refresh mempercayai claim role/tenant lama.** Perubahan role, ban, penghapusan akun, atau pencabutan membership tidak dibaca ulang dari database sebelum token baru diterbitkan.
10. **HIGH — Ban user tidak mencabut semua sesi aktif.** Middleware JWT tidak memeriksa status banned ke database pada setiap request dan operasi ban tidak merevoke seluruh JTI user.
11. **HIGH — Hapus akun tidak mencabut seluruh sesi.** Cookie frontend dapat hilang, tetapi token lain yang telah diterbitkan tidak otomatis masuk daftar revocation.
12. **HIGH — Update password hanya mencabut sesi/JTI saat ini.** Sesi user pada perangkat lain tetap valid; requirement UX mengarah pada logout global setelah perubahan password.
13. **HIGH — Revocation fail-open saat Redis tidak tersedia.** Protected request tetap dapat diterima ketika store revocation gagal, sehingga jaminan logout/revoke berubah sesuai kondisi infrastruktur.
14. **HIGH — Tidak ada model session/token family.** Backend tidak dapat mencabut seluruh refresh/access token milik user secara deterministik per perangkat atau global.
15. **HIGH — Kontrak refresh token tidak konsisten.** DTO mendefinisikan refresh token, sedangkan handler membaca bearer token; frontend juga mengirim access token dan hanya menyimpan access token. Evidence: `auth/dto/refresh.dto.go`, `apps/frontend/src/auth/actions.ts`.
16. **MEDIUM — DTO logout tidak sesuai implementasi.** DTO mensyaratkan `refresh_token`, handler mengabaikan body dan memakai claim access token, frontend mengirim tanpa body.
17. **MEDIUM — Field response login dibuang frontend.** Backend mengembalikan `refresh_token`, `token_type`, user, tenant, role, permissions; parser frontend hanya mempertahankan subset lalu memanggil `/me` lagi.
18. **MEDIUM — Google OAuth hanya berupa DTO/identity support.** Tidak ada route auth Google yang terdaftar dan tidak ada tombol/caller frontend meski komentar kontraknya mengindikasikan fitur tersebut.
19. **HIGH — Daftar user dibatasi primary `users.tenant_id`.** Secondary membership pada tabel relasi tidak ikut menjadi boundary/filter yang konsisten, sehingga user multi-tenant dapat hilang dari daftar tenant yang sebenarnya ia ikuti.
20. **HIGH — Boundary update/delete user tidak sepenuhnya berbasis membership.** Validasi organisasi cenderung memakai tenant utama, bukan seluruh assignment multi-tenant.
21. **HIGH — Perubahan role/membership tidak menginvalidasi cache permission secara konsisten.** User dapat mempertahankan hak lama sampai cache kedaluwarsa.
22. **HIGH — Mutation user + membership tidak atomic.** Create/update user dan perubahan relasi tenant berlangsung sebagai operasi terpisah; kegagalan parsial dapat meninggalkan user tanpa membership atau membership setengah tersimpan.
23. **HIGH — Satu `role_id` diterapkan ke semua tenant yang dipilih.** Model frontend tidak dapat memberi user role berbeda di dua organisasi, padahal tabel membership memiliki `role_id` per relasi.
24. **HIGH — Empty membership tidak dapat membersihkan assignment.** Backend hanya update bila list tidak kosong dan frontend menghilangkan field ketika tidak ada checkbox; user tidak dapat dikosongkan dari seluruh organisasi melalui UI.
25. **MEDIUM — `UserResponse.tenant_ids` dideklarasikan tetapi mapper tidak mengisinya.** Frontend tidak menerima assignment aktual untuk pre-check form edit. Evidence: `apps/backend/internal/modules/core/user/service/user.service.go`.
26. **MEDIUM — Form user mengirim nama role, bukan identifier role.** Custom role hasil CRUD tidak sejalan dengan enum/nama role tetap pada create/update user dan dapat kehilangan association permission.
27. **MEDIUM — Frontend belum memodelkan role per tenant.** Checkbox organisasi dan satu select role memberikan kesan multi-tenant penuh padahal payload tidak mewakili pasangan `{tenant_id, role_id}`.
28. **MEDIUM — Guard frontend tidak identik dengan guard backend.** Sidebar menyembunyikan menu, tetapi sebagian server action/page hanya mengecek authenticated/admin, bukan permission resource yang spesifik.
29. **MEDIUM — Halaman create/edit dapat dibuka tanpa permission create/update yang tepat.** Backend akan menolak mutation, tetapi frontend tidak memberi boundary/error state sejak awal.
30. **MEDIUM — Tombol edit/delete tetap dirender berdasarkan akses baca.** Pengguna baru mengetahui tidak berwenang setelah request mutation gagal.
31. **MEDIUM — Error 401/403/409 admin mutation tidak selalu diteruskan ke form.** Revalidation dapat berlangsung meski write gagal sehingga UI terlihat seolah berhasil.
32. **MEDIUM — Active tenant hanya tersirat di JWT.** Tidak ada abstraksi eksplisit di frontend untuk memastikan setiap server action memakai token tenant terbaru setelah switch.
33. **MEDIUM — Non-root tenant reader ditolak oleh pembatas frontend.** Backend punya permission `tenant.read`, tetapi action/UI tertentu mengharuskan superadmin sehingga PBAC granular tidak benar-benar dapat dipakai.
34. **LOW — Endpoint `/auth/me` dan payload session menduplikasi sumber data.** Login response kaya data, tetapi frontend selalu merekonstruksi session; ini memperbesar peluang drift schema.

## 2. Permission, role, organisasi, dan akun admin

1. **HIGH — Taxonomy permission ganda.** Seed/usage memiliki variasi `article.*` vs `articles.*` dan `article.category.*` vs `article_categories.*`; assignment yang tampak benar bisa tidak cocok dengan middleware route.
2. **HIGH — Permission kategori event tidak konsisten.** Permission `event.categories.*` tersedia tetapi route kategori memakai keluarga permission event lain, membuat checkbox yang dipilih tidak selalu memberi akses aktual.
3. **HIGH — Root admin membuat role global tanpa pilihan scope.** Frontend tidak bisa membuat role khusus organisasi target meski backend response memiliki konteks tenant.
4. **MEDIUM — Frontend membuang `RoleResponse.tenant_id`.** Tabel/edit page tidak dapat menjelaskan apakah role global atau milik organisasi.
5. **MEDIUM — Assignment permission pada create role bukan transaksi tunggal.** Role dapat berhasil dibuat sementara assignment gagal, menghasilkan role kosong.
6. **MEDIUM — Response assignment permission diabaikan.** Frontend revalidate/redirect tanpa memastikan PUT assignment sukses.
7. **MEDIUM — Root role tampak tanpa checkbox terpilih ketika backend tidak mengembalikan assignment sesuai sumber authorization.** UI dan effective permissions tidak memiliki satu endpoint sumber kebenaran yang jelas.
8. **MEDIUM — Tidak ada tampilan effective permission user.** Admin hanya melihat role dan master permission, bukan hasil akhir per user + organisasi aktif.
9. **MEDIUM — Tidak ada deteksi permission orphan.** Menghapus permission yang masih dipakai role tidak dipresentasikan sebagai impact/confirmation di UI.
10. **MEDIUM — Tidak ada bulk assignment/search permission pada role.** Semua permission dirender sebagai daftar panjang tanpa grouping domain, filter, select-all per domain, atau indikator inherited/effective.
11. **MEDIUM — Role list tidak memiliki pagination/search server-side yang sepadan dengan resource besar.** Collection selalu dimuat sekaligus.
12. **MEDIUM — Permission list tidak memiliki pagination/search server-side.** Debounce search tabel hanya berguna bila query diteruskan ke backend; saat ini data collection cenderung dimuat penuh.
13. **MEDIUM — User list hardcode `page=1&limit=100`.** Backend mendukung page, limit, search, role, tenant, banned dan metadata pagination; frontend membuang metadata.
14. **MEDIUM — Tenant list hardcode `page=1&limit=100`.** Backend mendukung search/type/parent/page/limit, frontend tidak mengekspos kontrak penuh.
15. **MEDIUM — Filter user backend tidak seluruhnya tersedia di UI.** Filter role, organisasi, dan banned tidak memanfaatkan query backend.
16. **MEDIUM — Filter organisasi backend tidak seluruhnya tersedia di UI.** Type dan parent filter tidak menjadi state server-side tabel.
17. **MEDIUM — `AdminUser` membuang metadata penting.** `tenant_ids`, tenant name/code, ban reason/expiry, verification state, dan timestamps tidak ditampilkan/divalidasi.
18. **MEDIUM — Tenant form membuang sebagian field backend.** `logo_url`, `website`, serta beberapa metadata organisasi belum dapat dikelola penuh dari form.
19. **MEDIUM — Ban reason/expiry tidak dapat diinput admin.** Backend dapat menyimpan konteks ban tetapi UI memakai alasan server-owned sederhana/tidak menampilkan expiry.
20. **MEDIUM — Tidak ada unambiguous primary organization editor.** Checkbox multi-organisasi tidak menjelaskan mana `users.tenant_id` utama dan mana secondary membership.
21. **MEDIUM — Tidak ada validasi frontend parent hierarchy.** Select parent dapat menawarkan kombinasi type/parent yang backend kemudian tolak atau yang berpotensi membentuk hierarchy tidak valid.
22. **MEDIUM — Tidak ada perlindungan UI untuk delete organisasi yang masih dipakai.** Dampak FK/member/event tidak dijelaskan sebelum request.
23. **MEDIUM — Konfigurasi payment gateway tenant tidak memiliki halaman/caller.** Backend `GET/PUT /core/v1/tenants/:id/payment-gateway` tidak terintegrasi.
24. **MEDIUM — Status credential gateway tidak dapat ditampilkan.** Field seperti `has_api_key`, provider, environment, dan rekening manual tidak punya representasi frontend.
25. **MEDIUM — Audit log tidak memiliki viewer frontend.** `GET /core/v1/audit-logs` tidak digunakan, padahal perubahan PBAC sensitif perlu dapat diaudit.
26. **LOW — Label teknis masih bocor ke UI.** Nama permission mentah, role internal, status enum, dan identifier masih muncul tanpa padanan bahasa pengguna pada beberapa halaman.

## 3. Event dan kategori event

1. **HIGH — Admin event page masih placeholder non-fungsional.** Backend menyediakan create/update/delete/status, tetapi `/dashboard/events` belum mengelola event. Evidence: `apps/frontend/src/app/(dashboard)/dashboard/events/page.tsx`, `apps/backend/internal/modules/features/event/main.event.go`.
2. **HIGH — Tidak ada UI lifecycle event.** Transisi `DRAFT → PUBLISHED → CLOSED → COMPLETED` tidak dapat dijalankan penyelenggara dari dashboard.
3. **HIGH — Tidak ada form create event.** Field tanggal, deadline, kuota, harga, tipe, lokasi/link, banner, sertifikat, kategori, benefit, dan speaker tidak dapat dikelola admin.
4. **HIGH — Tidak ada halaman edit event.** Endpoint PUT event tidak memiliki caller.
5. **HIGH — Tidak ada delete event UI.** Endpoint DELETE tidak memiliki confirmation/action frontend.
6. **HIGH — Event category hanya read-only di frontend.** POST/PUT/DELETE kategori tidak punya halaman admin.
7. **MEDIUM — Public search event tidak diteruskan ke API secara lengkap.** Modal mengarahkan `?search=`, tetapi root event page/fetcher terutama memodelkan kategori dan limit tetap.
8. **MEDIUM — Public event list hardcode `limit=50`.** Pagination metadata backend dibuang; event ke-51 dan seterusnya tidak dapat dijelajahi.
9. **MEDIUM — Filter backend event belum dipetakan semua.** Type, tenant, status/date/order yang tersedia atau dibutuhkan tidak memiliki kontrak query UI terpadu.
10. **MEDIUM — Home stats diturunkan dari subset event.** Angka statistik dapat salah bila hanya menghitung list publik yang dipaginasi/truncated.
11. **HIGH — Deteksi “sudah terdaftar” hanya mengandalkan halaman pertama registrasi peserta.** User dengan lebih dari 20 registrasi dapat melihat tombol daftar lagi pada event lama.
12. **MEDIUM — “Sisa kuota” memakai quota total.** Public detail tidak memiliki/menampilkan field remaining seat yang dihitung dari registrasi aktif.
13. **HIGH — Public event DTO mengekspos data sensitif operasional.** Meeting link dan email creator berpotensi keluar melalui endpoint unauthenticated sebelum seharusnya diberikan.
14. **MEDIUM — Event price/status di beberapa card bergantung adapter parsial.** Semua card tidak memakai satu normalized event contract sehingga harga gratis/berbayar dapat berbeda antar halaman.
15. **MEDIUM — Speaker/benefit relation tidak memiliki admin interaction.** Backend relation tersedia, tetapi tidak ada assignment editor frontend.
16. **MEDIUM — Tidak ada preview validasi sebelum publish.** Missing field yang membuat publish gagal hanya diketahui setelah mutation backend.
17. **MEDIUM — Tidak ada UI daftar peserta per event dari konteks event admin.** Halaman event tidak terhubung ke route registrations event.

## 4. Registrasi dan pembayaran

1. **HIGH — Participant registration list hardcode `page=1&limit=20`.** Dashboard, transactions, ticket, dan pemeriksaan status dapat kehilangan data lama.
2. **HIGH — Halaman sukses registrasi mencari registration dalam 20 item pertama.** Identifier valid dapat tampil 404 setelah user memiliki banyak registrasi.
3. **MEDIUM — Pagination metadata `/registrations/me` dibuang.** Tidak ada load more/server pagination pada riwayat peserta.
4. **MEDIUM — Endpoint cancel registration tidak memiliki caller.** `DELETE /features/v1/registrations/:id` tidak tersedia sebagai aksi peserta/admin.
5. **HIGH — Tidak ada daftar registrant per event untuk penyelenggara.** `GET /registrations/event/:eventID` tidak memiliki tabel/filter frontend.
6. **MEDIUM — Export registrant tidak memiliki caller.** Endpoint export tidak memiliki download CTA/admin flow.
7. **HIGH — Halaman “Riwayat transaksi” sebenarnya memakai data registrasi.** Metode, channel, amount, payment status, paid time, dan transaction ID tidak berasal dari resource payment.
8. **HIGH — Tidak ada endpoint riwayat/list payment peserta.** Backend hanya menyediakan lookup payment berdasarkan registration, sehingga frontend harus N+1 atau backend perlu endpoint agregat.
9. **MEDIUM — Lookup payment by registration tidak digunakan frontend.** Detail pembayaran yang sudah tersedia tetap tidak ditampilkan.
10. **HIGH — Manual payment proof upload tidak memiliki UI.** `POST /payments/:id/proof` tidak punya form upload/status.
11. **HIGH — Admin verification payment tidak memiliki UI.** `POST /payments/:id/verify` tidak punya inbox approve/reject.
12. **MEDIUM — Tidak ada alasan penolakan pembayaran yang tampil ke peserta.** Error/status backend tidak dipresentasikan sebagai langkah pemulihan.
13. **HIGH — Kontrak checkout manual dan gateway tercampur.** Response manual berisi detail bank tanpa `payment_url`, sedangkan frontend pernah menganggap URL kosong sebagai kegagalan checkout.
14. **MEDIUM — Event gratis dan berbayar belum memiliki kontrak outcome tunggal.** Gratis langsung registered, berbayar redirect gateway; UI membutuhkan discriminated result yang eksplisit, bukan inferensi `price === 0`/URL.
15. **MEDIUM — Payment return mempercayai query provider untuk pesan UX.** Status final seharusnya direkonsiliasi dengan backend payment/registration sebelum menyatakan sukses.
16. **HIGH — Dashboard dapat tetap `WAITING_PAYMENT` setelah callback bila mapping transaction/reference tidak menemukan row.** Webhook 200 tidak membuktikan update terjadi; response perlu membedakan processed vs unmatched/idempotent.
17. **HIGH — Webhook mengembalikan sukses untuk kasus no-op.** Provider tidak mendapat sinyal retry saat reference tidak cocok, sementara peserta tetap waiting.
18. **MEDIUM — Tidak ada reconciliation endpoint/job.** Bila callback hilang, admin/participant tidak dapat meminta backend mengecek status iPaymu berdasarkan transaction ID.
19. **MEDIUM — Status iPaymu `escrow/settled/berhasil` tidak dipetakan transparan ke status domain.** UI hanya melihat status registration dan menyembunyikan status provider.
20. **MEDIUM — Error registrasi/checkout tidak memiliki error code contract yang stabil.** Frontend pernah mengandalkan query `?error=...`; kini perlu typed action result/modal yang konsisten.
21. **MEDIUM — Duplicate checkout/resume flow belum jelas.** User dengan registration waiting perlu CTA melanjutkan payment existing, bukan membuat registration/payment baru.
22. **MEDIUM — Idempotency checkout tidak diekspos ke frontend.** Double click/retry dapat memicu beberapa request tanpa key yang dikelola client.
23. **MEDIUM — Event gratis tidak memiliki receipt/confirmation resource yang sama dengan payment.** Halaman sukses harus menjelaskan bahwa tidak ada pembayaran, tetapi tetap memberi nomor registrasi/tiket.
24. **LOW — Istilah status enum backend tampil mentah.** `WAITING_PAYMENT`, `REGISTERED`, `PAID`, dll. belum selalu diterjemahkan konsisten.

## 5. Kehadiran dan sertifikat

1. **HIGH — Attendance scan tidak memiliki frontend.** `POST /features/v1/attendances/scan` tidak memiliki scanner/manual entry page.
2. **HIGH — Attendance statistics tidak memiliki frontend.** `GET /attendances/event/:eventID/stats` tidak dipakai dashboard admin.
3. **MEDIUM — QR ticket hanya dapat ditampilkan peserta, belum ada operator verification flow.** Tidak ada feedback valid/duplicate/wrong-event/expired pada scanner.
4. **MEDIUM — Status kehadiran ditampilkan mentah dari registration.** Tidak ada refresh/action yang menghubungkan perubahan hasil scan ke UI peserta/admin secara jelas.
5. **HIGH — Certificate template GET/PUT tidak memiliki editor frontend.** Penyelenggara tidak dapat mengatur template, font, styling, atau signature.
6. **HIGH — Generate certificates tidak memiliki CTA admin.** `POST /certificates/event/:eventID/generate` tidak punya caller.
7. **HIGH — Certificate job polling tidak memiliki caller.** `GET /certificates/jobs/:id` tidak dipakai untuk progres/gagal/retry.
8. **MEDIUM — Certificate count dashboard pernah hardcode/diturunkan tidak akurat.** Endpoint participant certificates sudah ada tetapi tidak selalu menjadi sumber summary.
9. **MEDIUM — Certificate route dengan identifier ber-slash memerlukan catch-all/encoding contract konsisten.** Link generator, public verify handler, dan route frontend harus memakai helper yang sama.
10. **MEDIUM — Tidak ada admin list hasil generate.** Penyelenggara tidak dapat melihat certificate per participant, kegagalan individual, atau regenerate.
11. **LOW — Certificate status vocabulary belum dinormalisasi frontend.** Status raw backend tampil berbeda antara dashboard, table, dan verify page.

## 6. Artikel, galeri, testimonial, support, dan konten situs

1. **HIGH — Article CRUD backend tidak memiliki admin UI.** POST/PUT/DELETE article tidak mempunyai caller.
2. **HIGH — Article category CRUD backend tidak memiliki admin UI.** POST/PUT/DELETE category tidak mempunyai caller.
3. **HIGH — Article tidak memiliki draft/publish contract.** Backend article response tidak memodelkan status/published timestamp, sementara semua article dapat dibaca publik.
4. **MEDIUM — Adapter article membuang `tenant_id` dan `created_by_id`.** Frontend tidak dapat memberi atribusi organisasi/author yang benar.
5. **MEDIUM — Frontend memakai author generik.** Nama “Tim Redaksi” bukan data backend.
6. **MEDIUM — Frontend hanya menampilkan kategori pertama.** Backend mengembalikan `category_ids[]`, tetapi multi-category hilang.
7. **MEDIUM — Category frontend menciptakan slug/count/order/description yang tidak tersedia di backend.** Nilainya bersifat hasil asumsi/fallback, bukan source of truth.
8. **MEDIUM — Article excerpt dibuat dari content client-side.** Backend tidak punya excerpt/summary eksplisit dan stripping HTML sederhana dapat menghasilkan output buruk.
9. **MEDIUM — Article search/category filter baru bersifat partial contract.** Pastikan OpenAPI JSON/YAML dan semua query consumer memakai parameter yang sama.
10. **HIGH — Gallery admin CRUD tidak memiliki halaman/caller.** POST/PUT/DELETE gallery belum dapat digunakan.
11. **MEDIUM — Gallery page hanya meminta featured, page 1, limit 6.** Halaman galeri tidak menampilkan seluruh data database.
12. **MEDIUM — Filter gallery `event_id` tidak tersedia di UI.** Backend mendukung relasi event, frontend tidak mengekspos filter tersebut.
13. **MEDIUM — Pagination gallery dibuang.** Metadata backend tidak sampai ke page.
14. **MEDIUM — Gallery fetch memakai raw `fetch`, bukan shared API client.** Envelope validation/error handling berbeda dari event/article caller.
15. **HIGH — Support public create tidak memiliki form frontend.** `/features/v1/support-messages` tidak dipakai.
16. **HIGH — Support admin list/status tidak memiliki inbox frontend.** Admin tidak dapat mengubah `PENDING/IN_PROGRESS/RESOLVED/REJECTED`.
17. **MEDIUM — DTO support tidak punya schema/form frontend.** Email, phone, name, title, category, chronology dan error validasinya tidak dipetakan.
18. **MEDIUM — `/support` direferensikan navigasi/sitemap tetapi page route tidak tersedia atau tidak konsisten.** Link publik dapat berakhir 404.
19. **MEDIUM — Testimonial tidak memiliki public event listing contract.** Backend hanya `me` dan create by registration; halaman event tidak dapat mengambil testimoni terverifikasi.
20. **MEDIUM — Testimonial tidak memiliki moderation/admin flow.** Tidak ada approve/hide/delete/report.
21. **MEDIUM — Testimonial response terlalu tipis.** Tidak ada author display, timestamps, event metadata, atau moderation status untuk UI kaya konteks.
22. **MEDIUM — Review eligibility frontend dan backend berbeda.** Frontend cenderung memakai `CHECKED_IN`, backend juga mensyaratkan event `COMPLETED`; CTA dapat muncul terlalu dini lalu ditolak.
23. **MEDIUM — FAQ client menunjuk endpoint phantom.** `apps/frontend/src/lib/api/endpoints.ts`/`faq.ts` mengharapkan API yang tidak terdaftar di backend monorepo.
24. **MEDIUM — Site-content client menunjuk endpoint phantom.** Tidak ada route/persistence/editor backend untuk kontrak content map tersebut.
25. **MEDIUM — Coming-soon email form visual-only.** Tidak ada endpoint subscription atau action frontend; kontrol memberi affordance palsu.
26. **LOW — Translation/site override comment masih mengacu kontrak lama.** Ini menyesatkan audit dan maintenance berikutnya.

## 7. Routing, dokumentasi, schema, dan observability

1. **MEDIUM — `/profile` dari user menu tidak cocok dengan route participant `/participant/profile`.** Link dapat 404 atau mengarah ke halaman yang tidak memiliki data/action participant.
2. **MEDIUM — Root route beberapa modul yang ditautkan belum tersedia konsisten.** Contoh support/certificate/admin feature perlu dicocokkan dengan `paths.ts` dan filesystem route.
3. **MEDIUM — OpenAPI belum memuat seluruh route runtime.** Logout dan testimonial merupakan contoh route yang dapat tidak tercatat atau tidak lengkap.
4. **HIGH — OpenAPI mendefinisikan `/events/{id}` dan `/events/{slug}` dengan bentuk path sama.** Router/API client tidak dapat membedakan dua parameter dinamis hanya dari nama; kontrak perlu path berbeda (`/by-slug/:slug`).
5. **MEDIUM — OpenAPI YAML dan JSON berisiko drift.** Keduanya disimpan bersamaan; perubahan manual pernah menyebabkan struktur/indentasi tidak sinkron.
6. **MEDIUM — Frontend schema ditulis manual terpisah dari OpenAPI/DTO Go.** Field baru mudah dibuang diam-diam oleh Zod parser atau gagal saat runtime.
7. **MEDIUM — `ApiEnvelope` frontend tidak memodelkan pagination meta secara seragam.** Banyak list parser mengambil `data` saja dan kehilangan page/total/limit.
8. **MEDIUM — Tidak ada contract test otomatis backend route ↔ frontend schema.** Build dapat lulus walau endpoint, field, enum, atau envelope berubah.
9. **MEDIUM — Tidak ada route coverage inventory yang dijalankan CI.** Endpoint baru dapat masuk backend tanpa owner/caller/status di frontend.
10. **MEDIUM — Error envelope tidak dinormalisasi untuk Server Actions.** Pesan validation/conflict/forbidden sering menjadi generic redirect atau hilang.
11. **MEDIUM — Enum backend tidak memiliki centralized frontend mapper.** Role, tenant type, registration, payment, attendance, certificate, event lifecycle, dan support status diterjemahkan tersebar.
12. **MEDIUM — Audit log tidak tersedia untuk troubleshooting mutation admin.** Backend route ada tetapi tidak ada UI; webhook/payment juga kurang correlation ID yang terlihat user/admin.
13. **LOW — Endpoint public tenant by-slug tidak memiliki consumer.** Kemampuan backend tidak dipakai untuk landing/branding tenant.
14. **LOW — Public tenant list/detail tidak punya typed fetcher bersama.** Admin action tidak dapat dipakai sebagai kontrak public karena guard dan shape berbeda.
15. **LOW — Icon runtime masih mengunduh beberapa Iconify icon online.** Bukan kontrak API, tetapi menyebabkan warning/flicker dan membuat browser QA bising.

## Integrasi yang sudah terkonfirmasi

- Auth sign-up, sign-in, `/me`, logout frontend, switch tenant, dan daftar tenant milik user memiliki caller.
- Public event list/detail/category read memiliki caller.
- Participant registration create/list dan checkout iPaymu memiliki caller.
- Participant profile, password, delete account, transactions shell, ticket QR, review create/list, dan certificate list/verify memiliki halaman/caller dasar.
- Admin permission, role, tenant, dan user CRUD memiliki halaman dasar.
- Role-permission assignment dan user ban/unban memiliki caller dasar.
- Public article list/detail/category read dan public gallery read memiliki caller dasar.

Catatan: daftar ini hanya menyatakan keberadaan caller. Gap field, authorization, pagination, mutation error, dan UX di bagian sebelumnya tetap berlaku.

## Urutan penutupan yang disarankan

1. Tutup eskalasi `root_superadmin`, pembatasan `tenant_ids`, dan authorization berbasis role membership tenant.
2. Desain session/token family; perbaiki refresh, global revocation, ban, password change, dan delete account.
3. Satukan kontrak multi-tenant user menjadi pasangan organisasi-role dan buat seluruh mutation transactional + cache invalidation.
4. Tambahkan contract/integration tests lintas root tenant, child tenant, secondary membership, role berbeda, ban, refresh, dan switch tenant.
5. Selesaikan admin Event + Category + lifecycle karena menjadi dependency registrasi, attendance, certificate, dan payment admin.
6. Selesaikan payment detail/history/proof/verify/reconciliation dan registrations list/export/cancel.
7. Selesaikan attendance scanner/stats serta certificate template/generation/job monitoring.
8. Selesaikan article/category/gallery/support admin surface dan putuskan apakah FAQ/site-content/newsletter dibangun atau UI phantom dihapus.
9. Terapkan server pagination/debounced search dan typed mutation errors untuk seluruh tabel admin/public besar.
10. Sinkronkan OpenAPI, DTO frontend, route inventory, serta tambahkan CI contract coverage.

## Verifikasi yang wajib saat gap ditutup

- Backend: targeted Go tests, package tests, `go test ./...`, lalu endpoint suite (`make test-api`) dengan PostgreSQL/Redis aktif.
- Frontend: formatter, lint terkait, TypeScript check, production build.
- Browser: role root, tenant admin, custom role, participant; desktop + mobile; cek console/network; uji 401/403/409 dan empty/loading/error states.
- Security: direct API calls (bukan hanya hidden button), cross-tenant ID tampering, stale token, revoked token, secondary membership, switch tenant, dan cache invalidation.
- Data: uji lebih dari batas pagination (20/50/100), empty membership, partial write rollback, duplicate submit, webhook duplicate/unmatched, dan identifier yang mengandung slash.
