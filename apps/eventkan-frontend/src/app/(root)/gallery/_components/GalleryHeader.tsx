import type { FC } from 'react';

const GalleryHeader: FC = () => (
  <section className="px-4 pb-14 pt-16 sm:px-6 sm:pt-20 lg:pb-16 lg:pt-24">
    <div className="mx-auto max-w-295">
      <h1 className="font-display mt-5 max-w-225 text-[clamp(46px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em] text-[#111927]">
        Momen yang tetap hidup setelah acara selesai.
      </h1>
      <p className="mt-5 max-w-162.5 text-[17px] leading-relaxed text-[#6c7280]">
        Kilas balik suasana, diskusi, workshop, dan kebersamaan dari berbagai event EVENTKAN.
      </p>
    </div>
  </section>
);

export default GalleryHeader;
