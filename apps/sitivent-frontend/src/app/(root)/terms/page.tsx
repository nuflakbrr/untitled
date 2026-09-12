import type { FC } from 'react';
import type { Metadata } from 'next';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';

export const metadata: Metadata = genPageMetadata({
  title: 'Syarat & Ketentuan',
  description:
    'Baca syarat dan ketentuan penggunaan platform SITIVENT sebelum menggunakan layanan kami.',
});

interface Section {
  id: string;
  title: string;
  content: string[];
}

const sections: Section[] = [
  {
    id: 'penerimaan',
    title: '1. Penerimaan Syarat',
    content: [
      'Dengan mengakses atau menggunakan platform SITIVENT (situs web, aplikasi, dan layanan terkait), Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui Syarat & Ketentuan ini secara penuh.',
      'Jika Anda tidak menyetujui salah satu ketentuan di sini, harap hentikan penggunaan layanan kami. Kami berhak memperbarui syarat ini kapan saja; penggunaan berkelanjutan setelah pembaruan dianggap sebagai persetujuan.',
    ],
  },
  {
    id: 'akun',
    title: '2. Akun Pengguna',
    content: [
      'Untuk menggunakan fitur tertentu di SITIVENT, Anda perlu membuat akun. Anda bertanggung jawab menjaga kerahasiaan kredensial akun (email dan password) dan semua aktivitas yang terjadi di bawah akun Anda.',
      'Anda wajib memberikan informasi yang akurat, lengkap, dan terkini saat mendaftar. Kami berhak menangguhkan atau menghapus akun yang terbukti menggunakan informasi palsu atau menyesatkan.',
      'Anda dilarang membuat akun untuk orang lain tanpa izin mereka, mengoperasikan beberapa akun secara bersamaan untuk tujuan yang tidak sah, atau mentransfer akun kepada pihak lain.',
    ],
  },
  {
    id: 'layanan',
    title: '3. Penggunaan Layanan',
    content: [
      'SITIVENT adalah platform yang mempertemukan penyelenggara event dengan peserta. Kami menyediakan infrastruktur untuk mendaftarkan, mengelola, dan mengikuti berbagai jenis event, baik online maupun offline.',
      'Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan tidak melanggar hukum yang berlaku di Indonesia, hak pihak ketiga, atau ketentuan dalam dokumen ini.',
      'Dilarang keras: menyebarkan konten yang bersifat SARA, mengandung kebencian, pornografi, atau ilegal; melakukan scraping atau pengambilan data platform secara otomatis tanpa izin; mencoba mengeksploitasi kerentanan keamanan sistem kami.',
    ],
  },
  {
    id: 'event',
    title: '4. Pendaftaran & Pembatalan Event',
    content: [
      'Dengan mendaftar ke sebuah event melalui SITIVENT, Anda tunduk pada syarat spesifik yang ditetapkan oleh penyelenggara event tersebut, termasuk kebijakan pembatalan dan pengembalian dana.',
      'SITIVENT berfungsi sebagai perantara dan tidak bertanggung jawab atas kualitas, keamanan, atau penyelenggaraan event yang dibuat oleh pihak ketiga (penyelenggara independen).',
      'Jika terjadi pembatalan event oleh penyelenggara, proses pengembalian dana (jika ada) akan dilakukan sesuai kebijakan penyelenggara. Kami akan memfasilitasi komunikasi namun tidak memiliki kewajiban pengembalian dana atas nama penyelenggara.',
    ],
  },
  {
    id: 'konten',
    title: '5. Konten Pengguna',
    content: [
      'Anda tetap memiliki hak cipta atas konten yang Anda unggah ke SITIVENT (foto profil, deskripsi, ulasan, dll). Dengan mengunggah konten tersebut, Anda memberikan SITIVENT lisensi non-eksklusif, bebas royalti, untuk menampilkan, mendistribusikan, dan mempromosikan konten tersebut dalam konteks operasional platform.',
      'Anda bertanggung jawab penuh atas konten yang Anda bagikan dan memastikan bahwa konten tersebut tidak melanggar hak cipta, merek dagang, atau hak kekayaan intelektual pihak lain.',
    ],
  },
  {
    id: 'pembayaran',
    title: '6. Pembayaran & Biaya',
    content: [
      'Beberapa event di SITIVENT mungkin dikenakan biaya pendaftaran. Semua transaksi diproses melalui penyedia pembayaran pihak ketiga yang telah diverifikasi. SITIVENT tidak menyimpan data kartu kredit atau informasi rekening bank Anda.',
      'Semua harga yang ditampilkan sudah termasuk pajak yang berlaku kecuali dinyatakan lain. Bukti pembayaran akan dikirimkan melalui email yang terdaftar.',
    ],
  },
  {
    id: 'kekayaan-intelektual',
    title: '7. Hak Kekayaan Intelektual',
    content: [
      'Seluruh konten, desain, logo, merek dagang, dan kode platform SITIVENT adalah milik atau dilisensikan kepada SITIVENT dan dilindungi oleh hukum hak cipta yang berlaku.',
      'Anda tidak diperkenankan menyalin, mendistribusikan, memodifikasi, atau membuat karya turunan dari aset platform kami tanpa izin tertulis dari SITIVENT.',
    ],
  },
  {
    id: 'batasan-tanggung-jawab',
    title: '8. Batasan Tanggung Jawab',
    content: [
      'SITIVENT disediakan "sebagaimana adanya" tanpa jaminan apapun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa platform akan selalu tersedia, bebas kesalahan, atau memenuhi ekspektasi tertentu.',
      'Sepanjang diizinkan oleh hukum yang berlaku, SITIVENT tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami.',
    ],
  },
  {
    id: 'penghentian',
    title: '9. Penghentian Layanan',
    content: [
      'Kami berhak menangguhkan atau menghentikan akses Anda ke SITIVENT kapan saja jika Anda melanggar Syarat & Ketentuan ini, tanpa pemberitahuan sebelumnya dan tanpa kewajiban ganti rugi.',
      'Anda dapat menghapus akun Anda kapan saja melalui pengaturan profil. Penghapusan akun tidak otomatis membatalkan pendaftaran event yang sudah terkonfirmasi.',
    ],
  },
  {
    id: 'hukum',
    title: '10. Hukum yang Berlaku',
    content: [
      'Syarat & Ketentuan ini diatur dan ditafsirkan berdasarkan hukum Republik Indonesia. Setiap sengketa yang timbul akan diselesaikan terlebih dahulu melalui musyawarah mufakat. Jika tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Pengadilan Negeri yang berwenang di Indonesia.',
    ],
  },
  {
    id: 'kontak',
    title: '11. Kontak',
    content: [
      'Pertanyaan terkait Syarat & Ketentuan ini dapat diajukan melalui halaman Kontak kami atau melalui email naufalakbar378@gmail.com. Kami berupaya merespons dalam 3 hari kerja.',
    ],
  },
];

const TermsConditions: FC = () => {
  const lastUpdated = '12 Juli 2026';

  return (
    <div className="min-h-screen bg-[#f6f3eb] font-sans text-[#111927] antialiased">
      <section className="px-4 pb-12 pt-16 sm:px-6 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-295">
          <h1 className="font-display mt-5 max-w-220 text-[clamp(48px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em] text-[#111927]">
            Syarat &amp; Ketentuan
          </h1>
          <p className="mt-5 max-w-180 text-lg leading-relaxed text-[#6c7280]">
            Aturan dasar penggunaan akun, pendaftaran event, pembayaran, konten, dan layanan
            SITIVENT.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#111927]/10 bg-[#fffdf8] px-3 py-2 text-xs font-bold text-[#6c7280]">
              Terakhir diperbarui · {lastUpdated}
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-295 grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(230px,.34fr)_minmax(0,1fr)]">
          <aside className="hidden space-y-5 lg:sticky lg:top-28 lg:block">
            <div className="rounded-[24px] bg-[#11233f] p-6 text-white shadow-[0_18px_50px_rgba(17,35,63,.12)]">
              <h2 className="font-display mt-2 text-2xl font-extrabold tracking-[-.04em]">
                Daftar Isi
              </h2>
              <nav className="mt-5 grid gap-1">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="group flex items-start gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                  >
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#ff7a45] opacity-0 transition group-hover:opacity-100" />
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <article className="rounded-[28px] border border-[#111927]/10 bg-[#fffdf8] p-6 shadow-[0_16px_45px_rgba(17,35,63,.05)] sm:p-8 lg:p-13">
            <div className="mb-8 rounded-[18px] border border-[#ff7a45]/20 bg-[#ffe5d8] p-5 text-sm leading-relaxed text-[#6c7280]">
              <strong className="font-display mb-1 block text-[#11233f]">
                Sebelum menggunakan SITIVENT
              </strong>
              Dokumen ini merupakan perjanjian hukum antara Anda dan SITIVENT. Dengan mendaftar atau
              menggunakan layanan kami, Anda dianggap telah membaca dan menyetujui seluruh ketentuan
              di bawah ini.
            </div>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border-t border-[#111927]/10 py-7 first:border-t-0 first:pt-0"
              >
                <h2 className="font-display text-[clamp(24px,3vw,32px)] font-extrabold leading-tight tracking-[-.04em] text-[#11233f]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3">
                  {section.content.map((paragraph, index) => (
                    <p key={index} className="max-w-190 text-base leading-relaxed text-[#6c7280]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[20px] bg-[#bfe4c7] p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-xl font-extrabold tracking-[-.03em] text-[#11233f]">
                  Masih ada yang belum jelas?
                </h2>
                <p className="mt-1 text-sm text-[#11233f]/65">
                  Gunakan Pusat Bantuan jika ada bagian yang perlu dijelaskan lebih lanjut.
                </p>
              </div>
              <Link
                href="/help"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#11233f] px-4.5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458]"
              >
                Pusat Bantuan ↗
              </Link>
            </div>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#11233f] px-4.5 py-3 text-sm font-bold text-[#11233f] transition hover:bg-[#11233f] hover:text-white"
              >
                ← Kembali ke Beranda
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default TermsConditions;
