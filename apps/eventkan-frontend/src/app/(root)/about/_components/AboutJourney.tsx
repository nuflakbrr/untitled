export const AboutJourney = () => (
  <section className="px-4 py-20 sm:px-6 sm:py-24">
    <div className="mx-auto max-w-295">
      <h2 className="font-display mt-5 max-w-215 text-[clamp(36px,5vw,58px)] font-extrabold leading-[1.02] tracking-tighter">
        Satu pengalaman dari awal sampai selesai.
      </h2>
      <div className="mt-11 grid border-t border-eventkan-ink/12 md:grid-cols-4">
        {[
          ['01', 'Temukan event', 'Lihat informasi, tanggal, lokasi, dan status pendaftaran.'],
          ['02', 'Daftar & dapat tiket', 'Registrasi dan tiket digital tersimpan di satu akun.'],
          ['03', 'QR check-in', 'Kehadiran diverifikasi lebih cepat saat peserta datang.'],
          ['04', 'Akses sertifikat', 'Sertifikat tersedia sesuai ketentuan kehadiran.'],
        ].map(([label, title, description]) => (
          <article
            key={label}
            className="border-b border-eventkan-ink/12 py-7 md:border-b-0 md:border-r md:px-5 md:first:pl-0 md:last:border-r-0"
          >
            <small className="font-extrabold text-eventkan-accent">{label}</small>
            <h3 className="font-display mt-7 text-2xl font-extrabold tracking-[-.04em]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-eventkan-muted">{description}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);
