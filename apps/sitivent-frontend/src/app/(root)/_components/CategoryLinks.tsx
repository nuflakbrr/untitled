'use client';

import type { Route } from 'next';
import type { FC, WheelEvent } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Tag, Mic2, Code2, Laptop, MonitorPlay, MessageSquare } from 'lucide-react';

import type { EventCategory } from '@/interfaces/features/events';

import { cn } from '@/lib/utils';

// Keep category icons recognizable while the visual treatment stays on-brand.
const getCategoryConfig = (slug: string) => {
  const norm = slug.toLowerCase();
  if (norm.includes('seminar')) {
    return { icon: Mic2 };
  }
  if (norm.includes('workshop')) {
    return { icon: Laptop };
  }
  if (norm.includes('webinar')) {
    return { icon: MonitorPlay };
  }
  if (norm.includes('bootcamp')) {
    return { icon: Code2 };
  }
  if (norm.includes('talk') || norm.includes('show') || norm.includes('wicara')) {
    return { icon: MessageSquare };
  }
  return { icon: Tag };
};

interface CategoryLinksProps {
  categories: EventCategory[];
}

const CategoryLinks: FC<CategoryLinksProps> = ({ categories }) => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category');
  const categoryNavRef = useRef<HTMLElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

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

  const handleCategoryWheel = (event: WheelEvent<HTMLElement>) => {
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (!delta || event.currentTarget.scrollWidth <= event.currentTarget.clientWidth) return;

    event.preventDefault();
    event.currentTarget.scrollLeft += delta;
  };

  // Dynamic helper to create target href maintaining existing params
  const createCategoryHref = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page'); // Reset pagination on category change
    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }
    const queryString = params.toString();
    return (queryString ? `/events?${queryString}` : '/events') as Route;
  };

  return (
    <div className="mb-10 border-y border-[#111927]/10 py-4">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-40">
        <p className="shrink-0 text-sm font-bold text-[#11233f]">Jelajahi berdasarkan minatmu</p>
        <div className="relative min-w-0 sm:w-0 sm:flex-1">
          <nav
            aria-label="Kategori event"
            ref={categoryNavRef}
            className="flex min-w-0 flex-nowrap gap-2 overflow-x-auto overscroll-x-contain pb-1 touch-pan-x select-none sm:justify-start"
            style={{ scrollbarWidth: 'thin' }}
            onWheel={handleCategoryWheel}
          >
            <Link
              href={createCategoryHref()}
              className={cn(
                'inline-flex shrink-0 items-center rounded-full border px-3.5 py-2 text-sm font-bold whitespace-nowrap transition duration-200',
                !activeCategory
                  ? 'border-[#11233f] bg-[#11233f] text-white'
                  : 'border-[#111927]/15 text-[#11233f] hover:border-[#11233f] hover:bg-[#fffdf8]'
              )}
            >
              Semua event
            </Link>

            {categories.map((cat) => {
              const Icon = getCategoryConfig(cat.slug).icon;
              const isActive = activeCategory === cat.slug;

              return (
                <Link
                  key={cat.id}
                  href={createCategoryHref(cat.slug)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-bold whitespace-nowrap transition duration-200',
                    isActive
                      ? 'border-[#11233f] bg-[#11233f] text-white'
                      : 'border-[#111927]/15 text-[#11233f] hover:border-[#11233f] hover:bg-[#fffdf8]'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.name}
                </Link>
              );
            })}
          </nav>
          {showLeftFade && (
            <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r from-[#f6f3eb] to-transparent" />
          )}
          {showRightFade && (
            <span className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-linear-to-l from-[#f6f3eb] to-transparent" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryLinks;
