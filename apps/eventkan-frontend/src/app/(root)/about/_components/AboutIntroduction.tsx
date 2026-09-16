export const AboutIntroduction = () => (
  <section id="story" className="px-4 py-20 sm:px-6 sm:py-24">
    <div className="mx-auto max-w-295">
      {/* <span className="inline-flex items-center gap-2 rounded-full border border-eventkan-ink/12 bg-white/60 px-3 py-2 text-xs font-bold text-eventkan-navy">
        <span className="h-2 w-2 rounded-full bg-eventkan-accent" /> Masalah yang kami lihat
      </span> */}
      <h2 className="font-display mt-5 max-w-215 text-[clamp(36px,5vw,58px)] font-extrabold leading-[1.02] tracking-tighter">
        Banyak event masih berjalan dengan proses yang terpisah-pisah.
      </h2>
      <p className="mt-5 max-w-175 text-lg leading-relaxed text-eventkan-muted">
        Form pendaftaran, spreadsheet peserta, daftar hadir, tiket, dan sertifikat sering dikelola
        di tempat berbeda. Akibatnya, pekerjaan administrasi menjadi lebih panjang dari yang
        seharusnya.
      </p>
      <div className="mt-11 grid gap-6 lg:grid-cols-2">
        <article className="rounded-[24px] bg-eventkan-navy p-7 text-white sm:p-8">
          <h3 className="font-display text-3xl font-extrabold leading-[1.05] tracking-[-.04em]">
            Yang sering terjadi di lapangan.
          </h3>
          <div className="mt-6 grid gap-2.5 text-sm text-white/85">
            {[
              'Form registrasi dan data peserta tidak terhubung.',
              'Absensi harus direkap ulang setelah acara.',
              'Sertifikat dibagikan manual setelah event selesai.',
            ].map((item) => (
              <div key={item} className="rounded-[14px] border border-white/15 bg-white/10 p-3.5">
                {item}
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[24px] border border-eventkan-ink/12 bg-eventkan-surface p-7 sm:p-8">
          <h3 className="font-display text-3xl font-extrabold leading-[1.05] tracking-[-.04em] text-eventkan-ink">
            EVENTKAN mencoba menyederhanakannya.
          </h3>
          <p className="mt-5 text-base leading-relaxed text-eventkan-muted">
            Satu platform menghubungkan perjalanan peserta dari sebelum event sampai setelah event
            selesai.
          </p>
          <p className="mt-4 text-base leading-relaxed text-eventkan-muted">
            Tujuannya bukan menambah alat, tapi mengurangi perpindahan platform dan pekerjaan
            repetitif.
          </p>
        </article>
      </div>
    </div>
  </section>
);
