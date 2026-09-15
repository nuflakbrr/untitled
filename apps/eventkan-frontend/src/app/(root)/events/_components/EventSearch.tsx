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
          <h1 className="font-display mt-5 max-w-225 text-[clamp(46px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em] text-[#111927]">
            Temukan event yang cocok kamu datangi.
          </h1>
          <p className="mt-5 max-w-162.5 text-[17px] leading-relaxed text-[#6c7280]">
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
                      ? 'border-[#11233f] bg-[#11233f] text-white'
                      : 'border-[#111927]/10 bg-white/45 text-[#4b5565] hover:border-[#11233f]/40 hover:bg-[#fffdf8] hover:text-[#11233f]'
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
                        ? 'border-[#ff7a45] bg-[#ffe5d8] text-[#b84a2a]'
                        : 'border-[#111927]/10 bg-white/45 text-[#4b5565] hover:border-[#11233f]/40 hover:bg-[#fffdf8] hover:text-[#11233f]'
                    )}
                  >
                    {category.name}
                  </Link>
                ))}
              </nav>
              {showLeftFade && (
                <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r from-[#f6f3eb] to-transparent" />
              )}
              {showRightFade && (
                <span className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-linear-to-l from-[#f6f3eb] to-transparent" />
              )}
            </div>

            <div className="relative order-first w-full shrink-0 sm:order-0 sm:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7280]" />
              <Input
                type="search"
                placeholder="Cari event atau lokasi..."
                value={value}
                onChange={handleInputChange}
                onKeyDown={(event) => event.key === 'Enter' && submitSearch()}
                className="h-11 rounded-[14px] border-[#111927]/10 bg-[#fffdf8] pl-11 text-[#11233f] outline-none placeholder:text-[#6c7280]/70 focus:border-[#ff7a45] focus:ring-3 focus:ring-[#ff7a45]/15"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchBanner;
