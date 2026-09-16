'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { Search } from 'lucide-react';

import type { EventSearchProps } from '@/interfaces/features/events';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

import { useEventSearch } from '../_hooks/useEventSearch';

const SearchBanner: FC<EventSearchProps> = ({ categories }) => {
  const {
    activeCategory,
    categoryHref,
    categoryNavRef,
    handleInputChange,
    showLeftFade,
    showRightFade,
    submitSearch,
    value,
  } = useEventSearch({ categoryCount: categories.length });

  return (
    <>
      <section className="px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20">
        <div className="mx-auto max-w-295">
          <h1 className="font-display mt-5 max-w-225 text-[clamp(46px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em] text-eventkan-ink">
            Temukan event yang cocok kamu datangi.
          </h1>
          <p className="mt-5 max-w-162.5 text-[17px] leading-relaxed text-eventkan-muted">
            Seminar, workshop, webinar, konferensi, dan kompetisi dalam satu tempat. Cari event
            berdasarkan topik, lokasi, atau format yang paling cocok buatmu.
          </p>
        </div>
      </section>

      <section className="px-4 pb-8 sm:px-6 sm:pb-10">
        <div className="mx-auto max-w-295">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative order-last min-w-0 flex-1 sm:order-0">
              <nav
                aria-label="Filter kategori event"
                ref={categoryNavRef}
                className="flex min-w-0 flex-1 gap-2 overflow-x-auto overscroll-x-contain touch-pan-x"
                style={{ scrollbarWidth: 'thin' }}
              >
                <Link
                  href={categoryHref()}
                  className={cn(
                    'shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-bold transition',
                    !activeCategory
                      ? 'border-eventkan-navy bg-eventkan-navy text-white'
                      : 'border-eventkan-ink/10 bg-white/45 text-[#4b5565] hover:border-eventkan-navy/40 hover:bg-eventkan-surface hover:text-eventkan-navy'
                  )}
                >
                  Semua
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={categoryHref(category.slug)}
                    className={cn(
                      'shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-bold transition',
                      activeCategory === category.slug
                        ? 'border-eventkan-accent bg-eventkan-peach text-eventkan-peach-ink'
                        : 'border-eventkan-ink/10 bg-white/45 text-[#4b5565] hover:border-eventkan-navy/40 hover:bg-eventkan-surface hover:text-eventkan-navy'
                    )}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
              {showLeftFade && (
                <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r from-eventkan-canvas to-transparent" />
              )}
              {showRightFade && (
                <span className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-linear-to-l from-eventkan-canvas to-transparent" />
              )}
            </div>

            <div className="relative order-first w-full shrink-0 sm:order-0 sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-eventkan-muted" />
              <Input
                type="search"
                placeholder="Cari event atau lokasi..."
                value={value}
                onChange={handleInputChange}
                onKeyDown={(event) => event.key === 'Enter' && submitSearch()}
                className="h-11 rounded-[14px] border-eventkan-ink/10 bg-eventkan-surface pl-11 text-eventkan-navy outline-none placeholder:text-eventkan-muted/70 focus:border-eventkan-accent focus:ring-3 focus:ring-eventkan-accent/15"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchBanner;
