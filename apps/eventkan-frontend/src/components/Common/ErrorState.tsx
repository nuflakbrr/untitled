'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { ErrorStateProps } from '@/interfaces/error';

import { getErrorActions } from './_libs/getErrorActions.libs';
import { getErrorContent } from './_constants/errorContent.constants';

const ErrorState: FC<ErrorStateProps> = ({ code, error }) => {
  const meta = getErrorContent(code);
  const [primaryAction, secondaryAction] = getErrorActions(code);
  const accent = 'var(--eventkan-accent)';

  return (
    <main className="grid min-h-dvh place-items-center bg-[radial-gradient(circle_at_85%_15%,rgba(255,122,69,.1),transparent_28rem),var(--eventkan-canvas)] p-4 sm:p-7">
      <section className="w-full max-w-350 rounded-[32px] border border-eventkan-ink/10 bg-eventkan-surface p-5 shadow-[0_18px_50px_rgba(17,35,63,.08)] sm:p-8">
        <nav className="flex items-center justify-between gap-5" aria-label="Navigasi error">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Beranda EVENTKAN">
            <span className="font-display grid h-9 w-9 -rotate-3 place-items-center rounded-[12px] bg-eventkan-navy text-lg font-extrabold text-white">
              S
            </span>
            <span className="font-display text-xl font-extrabold tracking-[-.04em] text-eventkan-navy">
              EVENTKAN
            </span>
          </Link>
          <Link
            href="/events"
            className="hidden items-center gap-2 group rounded-full px-4.5 py-3 text-sm font-bold text-eventkan-navy transition hover:bg-eventkan-canvas sm:inline-flex"
          >
            Jelajahi Event{' '}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
          </Link>
        </nav>

        <div className="grid items-center gap-9 px-2 py-13 sm:px-5 sm:py-18 lg:grid-cols-[.9fr_1.1fr] lg:gap-14">
          <div className="relative w-fit">
            <span
              className="absolute right-[-8%] top-[-9%] z-0 aspect-square w-[34%] rounded-full"
              style={{ background: accent }}
              aria-hidden="true"
            />
            <span className="font-display relative z-10 text-[clamp(92px,16vw,180px)] font-extrabold leading-[.78] tracking-[-.08em] text-eventkan-navy">
              {code}
            </span>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-eventkan-ink/10 bg-white/55 px-3 py-2 text-[13px] font-bold text-eventkan-navy">
              <span
                className="h-2 w-2 rounded-full animate-pulse shadow-[0_0_0_5px_rgba(255,122,69,.14)]"
                style={{ background: accent }}
              />
              {meta.badge}
            </span>
            <h1 className="font-display mt-4 max-w-155 text-[clamp(36px,5vw,62px)] font-extrabold leading-none tracking-tighter text-eventkan-ink">
              {meta.titlePrefix} <span className="text-eventkan-accent">{meta.titleSuffix}</span>
            </h1>
            <p className="mt-5 max-w-140 text-[17px] leading-relaxed text-eventkan-muted">
              {meta.description}
            </p>

            {error && (
              <div className="mt-6 rounded-[18px] border border-eventkan-ink/10 bg-eventkan-canvas px-5 py-4 text-left">
                <p className="font-mono text-xs font-bold uppercase tracking-[.14em] text-eventkan-muted">
                  Detail error
                </p>
                <p className="mt-2 wrap-break-word font-mono text-sm text-[#b8473d]">
                  {error.name}: {error.message}
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={primaryAction.href}
                className="inline-flex items-center gap-2 group rounded-full bg-eventkan-navy px-4.5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--eventkan-navy-hover)]"
              >
                {primaryAction.label}{' '}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
              </Link>
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center gap-2 rounded-full px-4.5 py-3 text-sm font-bold text-eventkan-navy transition hover:bg-eventkan-canvas"
              >
                {secondaryAction.label}
              </Link>
            </div>

            <div className="mt-6 border-t border-eventkan-ink/10 pt-5 text-[13px] text-eventkan-muted">
              Kalau kamu sampai ke halaman ini dari sebuah link EVENTKAN, kamu bisa kembali ke
              halaman sebelumnya atau coba akses menu utama.
            </div>
          </div>
        </div>

        {/* <footer className="flex flex-col gap-2 border-t border-eventkan-ink/10 pt-5 text-xs text-eventkan-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Error {code}</span>
          <span>EVENTKAN · Event kampus tanpa ribet administratif</span>
        </footer> */}
      </section>
    </main>
  );
};

export default ErrorState;
