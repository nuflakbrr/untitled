import type { FC } from 'react';

export const ArticlesHeader: FC = () => (
  <section className="px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:pb-14 lg:pt-24">
    <div className="mx-auto max-w-295">
      <h1 className="font-display mt-5 max-w-225 text-[clamp(46px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em] text-[#111927]">
        Jangan cuma datang. Dapatkan lebih banyak dari setiap event.
      </h1>
      <p className="mt-5 max-w-162.5 text-[17px] leading-relaxed text-[#6c7280]">
        Temukan tips untuk memilih event yang cocok, datang dengan lebih pede, dan pulang membawa
        pengalaman yang benar-benar berguna.
      </p>
    </div>
  </section>
);

export default ArticlesHeader;
