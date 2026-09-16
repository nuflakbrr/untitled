import type { AboutValuesProps } from '@/interfaces/features/about';

export const AboutValues = ({ items }: AboutValuesProps) => (
  <section className="bg-eventkan-navy px-4 py-20 text-white sm:px-6 sm:py-24">
    <div className="mx-auto max-w-295">
      <h2 className="font-display mt-5 max-w-215 text-[clamp(36px,5vw,58px)] font-extrabold leading-[1.02] tracking-tighter">
        Dibuat untuk operasional yang lebih rapi tanpa menghilangkan rasa event.
      </h2>
      <p className="mt-5 max-w-160 text-lg leading-relaxed text-white/65">
        Cepat dipahami, mudah dipakai, dan membantu proses acara berjalan lebih tertata.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.title}
            className={`flex min-h-62.5 flex-col justify-between rounded-[22px] p-6 ${item.className}`}
          >
            <span className="text-xs font-extrabold tracking-[.06em]">{item.label}</span>
            <div>
              <h3 className="font-display text-[28px] font-extrabold leading-[1.05] tracking-[-.04em]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed opacity-75">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
