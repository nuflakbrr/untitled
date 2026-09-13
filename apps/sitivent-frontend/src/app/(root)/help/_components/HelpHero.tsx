import type { FC } from 'react';

const HelpHero: FC = () => (
  <section className="px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:pb-16">
    <div className="mx-auto max-w-295">
      <h1 className="font-display mt-5 max-w-225 text-[clamp(48px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em]">
        Ada kendala? Kita bantu sampai beres!
      </h1>
      <p className="mt-5 max-w-175 text-lg leading-relaxed text-[#6c7280]">
        Ceritakan masalahmu dengan detail. Tim SITIVENT akan membantu supaya kamu bisa kembali fokus
        ke event yang kamu ikuti atau kelola.
      </p>
    </div>
  </section>
);

export default HelpHero;
