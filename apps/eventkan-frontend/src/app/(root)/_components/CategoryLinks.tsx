'use client';

import type { FC } from 'react';

import Link from 'next/link';

import type { CategoryLinksProps } from '@/interfaces/features/events';

import { cn } from '@/lib/utils';

import { useCategoryLinks } from '../_hooks/useCategoryLinks';
import { getCategoryConfig } from '../_libs/getCategoryConfig.libs';

const CategoryLinks: FC<CategoryLinksProps> = ({ categories }) => {
  const {
    activeCategory,
    categoryNavRef,
    createCategoryHref,
    handleCategoryWheel,
    showLeftFade,
    showRightFade,
  } = useCategoryLinks(categories.length);

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
