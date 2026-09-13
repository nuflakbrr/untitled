'use client';

import type { FC } from 'react';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { X, Plus, ArrowRight, MessageSquare } from 'lucide-react';

import { cn } from '@/lib/utils';
import { siteMetadata } from '@/data/siteMetadata';

import { faqItems, faqCategories, faqCategoryLabels } from './_constants/faq';

const FAQPage: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('semua');

  const filteredFAQs = useMemo(
    () =>
      faqItems.filter((faq) => selectedCategory === 'semua' || faq.category === selectedCategory),
    [selectedCategory]
  );

  return (
    <div className="min-h-screen bg-[#f6f3eb] text-[#111927] antialiased">
      <section className="relative overflow-hidden px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:pb-16">
        <div className="relative mx-auto max-w-295">
          <h1 className="font-display mt-5 max-w-230 text-[clamp(48px,7vw,80px)] font-extrabold leading-[.98] tracking-[-.06em]">
            Punya pertanyaan? Mulai dari sini.
          </h1>
          <p className="mt-5 max-w-175 text-lg leading-relaxed text-[#6c7280]">
            Temukan jawaban seputar akun, pendaftaran event, e-ticket, pembayaran, refund, dan
            kebutuhan penyelenggara.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-295">
          <div className="mb-10 border-y border-[#111927]/10 py-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
              <p className="shrink-0 text-sm font-bold text-[#11233f]">
                Cari jawaban berdasarkan topik
              </p>
              <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 sm:ml-auto sm:flex-none sm:justify-end">
                {faqCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
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
                filteredFAQs.map((faq, index) => (
                  <details
                    key={faq.id}
                    open={index === 0 && selectedCategory === 'semua'}
                    className="group overflow-hidden rounded-[20px] border border-[#111927]/10 bg-[#fffdf8] shadow-[0_8px_24px_rgba(17,35,63,.03)]"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 p-5 text-left marker:hidden sm:p-5.5 [&::-webkit-details-marker]:hidden">
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
                <div className="rounded-[20px] border border-dashed border-[#111927]/15 bg-[#fffdf8] px-6 py-12 text-center">
                  <h3 className="font-display text-lg font-extrabold text-[#11233f]">
                    Tidak ada pertanyaan yang cocok.
                  </h3>
                  <p className="mt-1 text-sm text-[#6c7280]">Coba pilih kategori lain.</p>
                </div>
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

          <div className="mt-16 rounded-[30px] bg-[#ff7a45] p-7 text-white sm:p-10 lg:p-11">
            <div className="flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display max-w-full text-[clamp(32px,5vw,50px)] font-extrabold leading-none tracking-tighter">
                  Butuh bantuan langsung?
                </h2>
                <p className="mt-3 max-w-140 text-sm leading-relaxed text-white/80 sm:text-base">
                  Tim SITIVENT siap membantu kamu menyelesaikan kendala sebelum event dimulai.
                </p>
              </div>
              <Link
                href={`mailto:${siteMetadata.email}`}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-4.5 py-3 text-sm font-bold text-[#11233f] transition hover:-translate-y-0.5"
              >
                <MessageSquare className="h-4 w-4" />
                Email Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
