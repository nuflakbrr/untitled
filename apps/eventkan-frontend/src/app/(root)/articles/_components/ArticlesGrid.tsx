'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { Clock, Search, BookOpen, ArrowRight } from 'lucide-react';

import type { ArticlesGridProps } from '@/interfaces/features/articles';

import EmptyState from '@/components/Common/EmptyState';

import ArticleCover from './ArticleCover';
import { useArticlesGrid } from '../_hooks/useArticlesGrid';

const ArticlesGrid: FC<ArticlesGridProps> = ({ initialItems, categories: availableCategories }) => {
  const {
    categoryFilter,
    categoryListRef,
    categories,
    coverStyles,
    featured,
    remainingItems,
    searchTerm,
    setCategoryFilter,
    showLeftFade,
    showRightFade,
    updateSearch,
  } = useArticlesGrid(initialItems, availableCategories);

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col gap-4 border-b border-[#111927]/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative order-last min-w-0 flex-1 lg:order-0">
          <div
            ref={categoryListRef}
            className="flex min-w-0 gap-2 overflow-x-auto"
            style={{ scrollbarWidth: 'thin' }}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[13px] font-bold transition ${categoryFilter === category ? 'border-[#11233f] bg-[#11233f] text-white' : 'border-[#111927]/10 bg-white/45 text-[#4b5565] hover:border-[#11233f]/35 hover:text-[#11233f]'}`}
              >
                {category}
              </button>
            ))}
          </div>
          {showLeftFade && (
            <span className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r from-[#f6f3eb] to-transparent" />
          )}
          {showRightFade && (
            <span className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-linear-to-l from-[#f6f3eb] to-transparent" />
          )}
        </div>
        <label className="relative order-first block w-full shrink-0 lg:order-0 lg:max-w-100">
          <span className="sr-only">Cari artikel</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7280]" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => updateSearch(event.target.value)}
            placeholder="Cari artikel..."
            className="w-full rounded-[14px] border border-[#111927]/10 bg-[#fffdf8] py-3 pl-11 pr-4 text-sm text-[#11233f] outline-none transition placeholder:text-[#6c7280]/70 focus:border-[#11233f] focus:ring-3 focus:ring-[#11233f]/15"
          />
        </label>
      </div>

      {featured ? (
        <>
          <article className="group grid min-w-0 overflow-hidden rounded-[28px] bg-[#11233f] text-white shadow-[0_18px_50px_rgba(17,35,63,.08)] lg:grid-cols-[1.12fr_.88fr]">
            <ArticleCover className={`${coverStyles[0]} min-h-82.5 sm:min-h-100 lg:min-h-115`} />
            <div className="flex min-w-0 flex-col justify-center p-6 sm:p-9 lg:p-10">
              <div className="flex min-w-0 items-center gap-2 text-xs font-bold text-white/65">
                <span className="min-w-0 truncate">
                  {featured.categories?.join(' · ') || featured.category}
                </span>
                <span className="shrink-0">·</span>
                <span className="shrink-0 whitespace-nowrap">{featured.readTime}</span>
              </div>
              <h2 className="font-display mt-4 max-w-125 wrap-break-word text-[clamp(32px,4vw,52px)] font-extrabold leading-[1.02] tracking-tighter">
                {featured.title}
              </h2>
              <p className="mt-5 max-w-120 text-sm leading-relaxed text-white/68 sm:text-base">
                {featured.description}
              </p>
              <Link
                href={`/articles/${featured.id}`}
                className="group/link mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4.5 py-3 font-bold text-[#11233f] transition hover:-translate-y-0.5"
              >
                Baca artikel
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:-rotate-45" />
              </Link>
            </div>
          </article>

          {remainingItems.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {remainingItems.map((article, index) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] shadow-[0_12px_30px_rgba(17,35,63,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(17,35,63,.1)]"
                >
                  <ArticleCover className={`${coverStyles[index + 1]} h-65`} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[#6c7280]">
                      <span>{article.date}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {article.readTime}
                      </span>
                    </div>
                    <h3 className="font-display mt-3 line-clamp-2 text-xl font-bold leading-tight tracking-tight text-[#11233f]">
                      {article.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#6c7280]">
                      {article.description}
                    </p>
                    <Link
                      href={`/articles/${article.id}`}
                      className="group/link mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#11233f] transition hover:text-[#ff7a45]"
                    >
                      Baca selengkapnya
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Artikel belum ditemukan"
          description="Coba gunakan kata kunci lain atau pilih kategori yang berbeda."
        />
      )}
    </div>
  );
};

export default ArticlesGrid;
