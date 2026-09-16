import type { FC } from 'react';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

import type { LegalPageLayoutProps } from '@/interfaces/legal';

const LegalPageLayout: FC<LegalPageLayoutProps> = ({
  title,
  description,
  lastUpdated,
  noticeTitle,
  notice,
  sections,
  ctaTitle,
  ctaDescription,
}) => (
  <div className="min-h-screen bg-eventkan-canvas font-sans text-eventkan-ink antialiased">
    <section className="px-4 pb-12 pt-16 sm:px-6 lg:pb-16 lg:pt-20">
      <div className="mx-auto max-w-295">
        <h1 className="font-display mt-5 max-w-220 text-[clamp(48px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em]">
          {title}
        </h1>
        <p className="mt-5 max-w-180 text-lg leading-relaxed text-eventkan-muted">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-eventkan-ink/10 bg-eventkan-surface px-3 py-2 text-xs font-bold text-eventkan-muted">
            Terakhir diperbarui · {lastUpdated}
          </span>
        </div>
      </div>
    </section>

    <section className="px-4 pb-24 sm:px-6">
      <div className="mx-auto grid max-w-295 grid-cols-1 items-start gap-7 lg:grid-cols-[minmax(230px,.34fr)_minmax(0,1fr)]">
        <aside className="hidden space-y-5 lg:sticky lg:top-28 lg:block">
          <div className="rounded-[24px] bg-eventkan-navy p-6 text-white shadow-[0_18px_50px_rgba(17,35,63,.12)]">
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
                  <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-eventkan-accent opacity-0 transition group-hover:opacity-100" />
                  {section.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <article className="rounded-[28px] border border-eventkan-ink/10 bg-eventkan-surface p-6 shadow-[0_16px_45px_rgba(17,35,63,.05)] sm:p-8 lg:p-13">
          <div className="mb-8 rounded-[18px] border border-eventkan-accent/20 bg-eventkan-peach p-5 text-sm leading-relaxed text-eventkan-muted">
            <strong className="font-display mb-1 block text-eventkan-navy">{noticeTitle}</strong>
            {notice}
          </div>

          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border-t border-eventkan-ink/10 py-7 first:border-t-0 first:pt-0"
            >
              <h2 className="font-display text-[clamp(24px,3vw,32px)] font-extrabold leading-tight tracking-[-.04em] text-eventkan-navy">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3">
                {section.content.map((paragraph, index) => (
                  <p key={index} className="max-w-190 text-base leading-relaxed text-eventkan-muted">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}

          <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[20px] bg-eventkan-green p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-extrabold tracking-[-.03em] text-eventkan-navy">
                {ctaTitle}
              </h2>
              <p className="mt-1 text-sm text-eventkan-navy/65">{ctaDescription}</p>
            </div>
            <Link
              href="/help"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-eventkan-navy px-4.5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-eventkan-navy-hover"
            >
              Pusat Bantuan{' '}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
            </Link>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full border border-eventkan-navy px-4.5 py-3 text-sm font-bold text-eventkan-navy transition hover:bg-eventkan-navy hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Kembali ke Beranda
            </Link>
          </div>
        </article>
      </div>
    </section>
  </div>
);

export default LegalPageLayout;
