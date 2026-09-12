import type { FC } from 'react';

import { features } from '../_constants/features';

const Features: FC = () => (
  <section id="fitur" className="rounded-t-[38px] bg-[#11233f] px-4 py-24 text-white sm:px-6">
    <div className="mx-auto max-w-295">
      <div className="max-w-190">
        <h2 className="font-display max-w-190 text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-.04em]">
          Dari registrasi sampai sertifikat.
        </h2>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/63">
          Tidak perlu berpindah dari form pendaftaran ke chat panitia. SITIVENT menyatukan tiket,
          check-in, kehadiran, dan sertifikat dalam satu alur, jadi peserta bisa lebih fokus
          menikmati acara dan panitia lebih mudah mengelola event.
        </p>
      </div>

      <div className="mt-13.5 grid gap-4.5 md:grid-cols-12">
        {features.map(([title, description], index) => (
          <article
            key={title}
            className={`flex min-h-67.5 flex-col justify-between overflow-hidden rounded-[24px] p-7 ${index === 0 ? 'bg-[#ff7a45] md:col-span-7' : index === 1 ? 'bg-[#fffdf8] text-[#111927] md:col-span-5' : index === 2 ? 'bg-[#f7df86] text-[#111927] md:col-span-5' : 'bg-[#bfe4c7] text-[#111927] md:col-span-7'}`}
          >
            <span className="grid h-10.5 w-10.5 place-items-center rounded-full border border-current text-[13px] font-bold opacity-80">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="font-display max-w-120 text-[clamp(26px,3vw,38px)] font-extrabold leading-[1.05] tracking-[-.045em]">
                {title}
              </h3>
              <p className="mt-3 max-w-120 text-sm opacity-70">{description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
