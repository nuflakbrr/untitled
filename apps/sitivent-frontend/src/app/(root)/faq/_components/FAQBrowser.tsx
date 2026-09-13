'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { X, Plus, SearchX, ArrowRight } from 'lucide-react';
import { useRef, useMemo, useState, useEffect } from 'react';

import type { FAQBrowserProps } from '@/interfaces/features/faq';

import { cn } from '@/lib/utils';

import EmptyState from '../../_components/EmptyState';
import { faqItems, faqCategories, faqCategoryLabels } from '../_constants/faq';

const FAQBrowser: FC<FAQBrowserProps> = ({ selectedCategory, onCategoryChange }) => {
  const filteredFAQs = useMemo(
    () =>
      faqItems.filter((faq) => selectedCategory === 'semua' || faq.category === selectedCategory),
    [selectedCategory]
  );
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqItems[0]?.id ?? null);
  const categoryNavRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  useEffect(() => {
    setOpenFaqId(filteredFAQs[0]?.id ?? null);
  }, [filteredFAQs]);

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
  }, []);

  return (
    <>
      <div className="mb-10 border-y border-[#111927]/10 py-4">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
          <p className="shrink-0 text-sm font-bold text-[#11233f]">
            Cari jawaban berdasarkan topik
          </p>
          <div className="relative min-w-0 flex-1 sm:ml-auto sm:w-0 sm:flex-1">
            <div
              ref={categoryNavRef}
              className="flex min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1 touch-pan-x select-none sm:justify-end"
              style={{ scrollbarWidth: 'thin' }}
            >
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onCategoryChange(category.id)}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-full border px-3.5 py-2 text-[13px] font-bold transition',
                    selectedCategory === category.id
                      ? 'border-[#11233f] bg-[#11233f] text-white'
                      : 'border-[#111927]/10 bg-transparent text-[#6c7280] hover:border-[#11233f] hover:bg-[#f6f3eb] hover:text-[#11233f]'
                  )}
                >
                  {category.label}
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
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-extrabold tracking-[-.04em] text-[#11233f] sm:text-[28px]">
          Pertanyaan umum
        </h2>
        <span className="shrink-0 text-xs font-semibold text-[#6c7280]">
          {filteredFAQs.length} pertanyaan
        </span>
      </div>

      <div className="mt-5 grid items-start gap-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="grid gap-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <details
                key={faq.id}
                open={openFaqId === faq.id}
                className="group overflow-hidden rounded-[20px] border border-[#111927]/10 bg-[#fffdf8] shadow-[0_8px_24px_rgba(17,35,63,.03)]"
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenFaqId((currentId) => (currentId === faq.id ? null : faq.id));
                  }}
                  className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-left marker:hidden sm:p-5.5 [&::-webkit-details-marker]:hidden"
                >
                  <span className="min-w-0">
                    <strong className="font-display block text-base font-extrabold leading-tight text-[#11233f] sm:text-lg">
                      {faq.question}
                    </strong>
                    <small className="mt-1.5 block text-xs font-semibold text-[#6c7280]">
                      {faqCategoryLabels[faq.category]}
                    </small>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#111927]/10 text-[#11233f] transition group-open:bg-[#11233f] group-open:text-white">
                    <Plus className="h-4 w-4 group-open:hidden" />
                    <X className="hidden h-4 w-4 group-open:block" />
                  </span>
                </summary>
                <div className="px-5 pb-5.5 sm:px-5.5">
                  <p className="border-l-2 border-[#ff7a45] pl-4 text-sm leading-relaxed text-[#6c7280]">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))
          ) : (
            <EmptyState
              icon={SearchX}
              title="Tidak ada pertanyaan yang cocok"
              description="Coba pilih kategori lain."
            />
          )}
        </div>

        <aside className="rounded-[22px] bg-[#f7df86] p-6 lg:sticky lg:top-28">
          <h3 className="font-display text-[26px] font-extrabold leading-[1.05] tracking-[-.04em] text-[#11233f]">
            Masih belum menemukan jawaban?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#11233f]/65">
            Kirim pertanyaan melalui Pusat Bantuan supaya masalahmu bisa ditangani lebih
            terstruktur.
          </p>
          <Link
            href="/help"
            className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#11233f] px-4.5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458]"
          >
            Hubungi Kami{' '}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
          </Link>
        </aside>
      </div>
    </>
  );
};

export default FAQBrowser;
