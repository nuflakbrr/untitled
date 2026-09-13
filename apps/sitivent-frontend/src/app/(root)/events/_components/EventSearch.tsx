'use client';

import type { Route } from 'next';
import type { FC, ChangeEvent } from 'react';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import type { EventCategory } from '@/interfaces/features/events';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface SearchBannerProps {
  categories: EventCategory[];
}

const SearchBanner: FC<SearchBannerProps> = ({ categories }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const activeCategory = searchParams.get('category');
  const [value, setValue] = useState(query);
  const categoryNavRef = useRef<HTMLElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const nav = categoryNavRef.current;
    if (!nav) return;

    const updateFades = () => {
      setShowLeftFade(nav.scrollLeft > 0);
      setShowRightFade(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 1);
    };

    updateFades();
    nav.addEventListener('scroll', updateFades, { passive: true });
    window.addEventListener('resize', updateFades);

    return () => {
      nav.removeEventListener('scroll', updateFades);
      window.removeEventListener('resize', updateFades);
    };
  }, [categories.length]);

  useEffect(() => {
    setValue(query);
  }, [query]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const updateUrl = useCallback(
    (newQuery: string) => {
      const trimmed = newQuery.trim();
      if (trimmed === query) return;

      const params = new URLSearchParams(searchParams.toString());
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      params.delete('page');

      const queryString = params.toString();
      router.replace((queryString ? `${pathname}?${queryString}` : pathname) as Route, {
        scroll: false,
      });
    },
    [pathname, query, router, searchParams]
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => updateUrl(nextValue), 400);
  };

  const submitSearch = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    updateUrl(value);
  };

  const categoryHref = (slug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (slug) params.set('category', slug);
    else params.delete('category');

    const queryString = params.toString();
    return (queryString ? `${pathname}?${queryString}` : pathname) as Route;
  };

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
            <div className="relative min-w-0 flex-1">
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

            <div className="relative w-full shrink-0 sm:max-w-md">
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
