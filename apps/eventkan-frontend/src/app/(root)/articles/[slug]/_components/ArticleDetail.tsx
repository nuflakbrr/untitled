'use client';

import Link from 'next/link';
import { type FC, useState } from 'react';
import {
  Tag,
  Copy,
  Info,
  User,
  Check,
  Clock,
  Link2,
  BookOpen,
  Calendar,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';

import type { ArticleDetailClientProps } from '@/interfaces/features/articles';

import { LinkedInIcon, WhatsAppIcon } from '@/components/Common/CustomIcons';

import { useArticleDetail } from '../_hooks/useArticleDetail';

export const ArticleDetailClient: FC<ArticleDetailClientProps> = ({ initialArticle }) => {
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const currentArticle = initialArticle;
  const {
    copied,
    shareCopied,
    hoveredTerm,
    hoveredTermDef,
    wordCount,
    readTimeMinutes,
    tocItems,
    handleCopyMarkdown,
    handleCopyLink,
    handleShare,
    showTermDefinition,
    clearTermDefinition,
  } = useArticleDetail(currentArticle);

  return (
    <div className="min-h-screen bg-eventkan-canvas font-sans text-eventkan-ink antialiased">
      {/* Custom Styles Injection */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glossary-term {
          border-bottom: 1px dashed var(--eventkan-accent);
          cursor: help;
          position: relative;
        }
        .glossary-popover {
          position: absolute;
          bottom: 125%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--eventkan-navy);
          color: var(--eventkan-surface);
          padding: 8px 12px;
          border-radius: 14px;
          font-size: 12px;
          width: 220px;
          z-index: 50;
          box-shadow: 0 18px 50px rgba(17,35,63,.16);
          pointer-events: none;
        }
        .glossary-popover::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 6px solid transparent;
          border-top-color: var(--eventkan-navy);
        }
      `,
        }}
      />

      <section className="px-4 pb-10 pt-14 sm:px-6 sm:pt-18 lg:pb-12 lg:pt-20">
        <div className="mx-auto max-w-295 space-y-5">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm font-bold text-eventkan-muted transition hover:text-eventkan-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Artikel
          </Link>

          <div className="w-full space-y-4 text-center">
            <h1 className="font-display w-full text-center text-[clamp(44px,7vw,78px)] font-extrabold leading-[.98] tracking-[-.06em] text-eventkan-ink">
              {currentArticle.title}
            </h1>

            <div className="flex justify-center flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-eventkan-muted">
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-eventkan-accent" />
                {currentArticle.category || ''}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-eventkan-accent" />
                {currentArticle.date || ''}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-eventkan-accent" />
                {readTimeMinutes} menit baca
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-eventkan-accent" />
                {wordCount} kata
              </span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-eventkan-accent" />
                Ditulis oleh: {currentArticle.author}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & TOC Layout Grid */}
      <div className="mx-auto max-w-295 px-4 pb-24 md:px-0">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-8">
          {/* Main Content Reader Card */}
          <main className="mx-auto w-full max-w-215 space-y-8 rounded-[26px] border border-eventkan-ink/10 bg-eventkan-surface p-5 shadow-[0_18px_50px_rgba(17,35,63,.05)] sm:p-8 lg:translate-x-8 lg:p-10">
            <div className="space-y-4">
              {currentArticle.cover && (
                <div className="relative h-72 w-full overflow-hidden rounded-[24px] border border-eventkan-ink/10 bg-[var(--eventkan-navy-hover)] sm:h-90 md:h-115">
                  <img
                    src={currentArticle.cover}
                    alt={currentArticle.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* TL;DR card if available */}
              {currentArticle.tldr && (
                <div
                  id="ringkasan"
                  className="rounded-r-[18px] border-l-4 border-eventkan-accent bg-eventkan-peach p-4"
                >
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-eventkan-peach-ink">
                    <Info className="w-3.5 h-3.5" />
                    Ringkasan Cepat
                  </div>
                  <p className="text-sm leading-relaxed text-eventkan-muted">
                    {currentArticle.tldr.split(' ').map((word, i) => {
                      const cleanWord = word.replace(/[^a-zA-Z]/g, '');
                      const jargonDef = currentArticle.jargon
                        ? currentArticle.jargon[cleanWord] ||
                          currentArticle.jargon[cleanWord.toLowerCase()]
                        : null;
                      if (jargonDef) {
                        return (
                          <span key={i} className="relative inline-block group">
                            <span
                              className="glossary-term cursor-help text-eventkan-peach-ink"
                              onMouseEnter={() => showTermDefinition(cleanWord, jargonDef)}
                              onMouseLeave={clearTermDefinition}
                            >
                              {word}
                            </span>{' '}
                            {hoveredTerm === cleanWord && (
                              <span className="glossary-popover">{hoveredTermDef}</span>
                            )}
                          </span>
                        );
                      }
                      return word + ' ';
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Render Rich Body Content or Interactive Elements */}
            {currentArticle.isDb && currentArticle.content ? (
              <p
                id="konten-utama"
                className="prose max-w-none text-base leading-relaxed text-eventkan-muted"
              >
                {currentArticle.content?.replace(/<[^>]*>?/gm, '')}
              </p>
            ) : (
              <>
                {/* Interactive Flowchart Process */}
                {currentArticle.flowchart && (
                  <div id="alur-proses" className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-eventkan-muted">
                      Alur Proses Interaktif
                    </h3>
                    <div className="overflow-x-auto rounded-[18px] border border-eventkan-ink/10 bg-eventkan-canvas p-4">
                      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 min-w-125">
                        {currentArticle.flowchart.map((step, idx) => (
                          <div
                            key={idx}
                            className="flex-1 flex flex-col md:flex-row items-center gap-2"
                          >
                            {/* Process box */}
                            <div
                              className={`flex-1 w-full p-3 rounded-lg border text-center transition-all hover:scale-102 hover:shadow ${
                                step.type === 'decision'
                                  ? 'border-eventkan-accent bg-eventkan-peach/60'
                                  : 'border-eventkan-ink/10 bg-eventkan-surface'
                              }`}
                              title={step.detail}
                            >
                              <div className="mb-1 text-[9px] font-bold text-eventkan-muted">
                                Langkah {idx + 1}
                              </div>
                              <div className="font-display line-clamp-1 text-xs font-bold text-eventkan-navy">
                                {step.label}
                              </div>
                              <div className="mt-1 line-clamp-2 text-[9px] leading-normal text-eventkan-muted">
                                {step.detail}
                              </div>
                            </div>

                            {/* Arrow */}
                            {idx < currentArticle.flowchart!.length - 1 && (
                              <ChevronRight className="h-4 w-4 shrink-0 rotate-90 text-eventkan-accent md:rotate-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Section 1: Detailed Steps Accordions */}
                {currentArticle.steps && (
                  <div id="langkah-langkah" className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-eventkan-muted">
                      Langkah Demi Langkah
                    </h3>
                    <div className="space-y-3">
                      {currentArticle.steps.map((step, idx) => (
                        <details
                          key={idx}
                          className="group overflow-hidden rounded-[18px] border border-eventkan-ink/10 bg-eventkan-surface"
                          open={idx === 0}
                        >
                          <summary className="flex cursor-pointer select-none items-center justify-between p-4 text-sm font-bold text-eventkan-navy transition-colors hover:bg-eventkan-canvas md:text-base">
                            <span className="flex items-center gap-3">
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-eventkan-peach text-xs font-bold text-eventkan-peach-ink">
                                {idx + 1}
                              </span>
                              {step.title}
                            </span>
                            <span className="rounded-full border border-eventkan-ink/10 bg-eventkan-canvas px-2 py-0.5 text-[10px] text-eventkan-muted">
                              {step.location}
                            </span>
                          </summary>
                          <div className="border-t border-eventkan-ink/10 bg-eventkan-canvas/40 px-4 pb-4 pt-1 text-xs leading-relaxed text-eventkan-muted md:text-sm">
                            {step.body}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 2: Tabbed Code Blocks */}
                {currentArticle.tabs && (
                  <div id="implementasi-kode" className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-eventkan-muted">
                      Contoh Implementasi Kode
                    </h3>
                    <div className="overflow-hidden rounded-[18px] border border-[var(--eventkan-navy-hover)] bg-eventkan-navy text-[var(--eventkan-surface)]">
                      {/* Tab switcher */}
                      <div className="flex border-b border-[var(--eventkan-navy-hover)] bg-[var(--eventkan-navy-hover)]">
                        {currentArticle.tabs.map((tab, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTabIdx(idx)}
                            className={`cursor-pointer border-r border-[var(--eventkan-navy-hover)] px-4 py-2 text-xs transition-all ${
                              activeTabIdx === idx
                                ? 'border-b-2 border-b-[var(--eventkan-accent)] bg-eventkan-navy font-semibold text-[var(--eventkan-surface)]'
                                : 'text-white/60 hover:text-white'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Preformatted Code */}
                      <pre className="p-4 overflow-x-auto text-[11px] md:text-xs font-mono leading-relaxed max-h-75">
                        <code>{currentArticle.tabs[activeTabIdx]?.code}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Section 3: FAQ */}
                {currentArticle.faqs && (
                  <div id="faq" className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-eventkan-muted">
                      Pertanyaan Sering Diajukan (FAQ)
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentArticle.faqs.map((faq, idx) => (
                        <div
                          key={idx}
                          className="space-y-2 rounded-[18px] border border-eventkan-ink/10 bg-eventkan-canvas p-4"
                        >
                          <dt className="flex items-start gap-2 text-sm font-bold text-eventkan-navy">
                            <span className="font-bold text-eventkan-accent">Q:</span>
                            {faq.q}
                          </dt>
                          <dd className="pl-4 text-xs leading-relaxed text-eventkan-muted">{faq.a}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </>
            )}
          </main>

          {/* Table of Contents Sticky Sidebar */}
          <aside className="hidden space-y-6 lg:sticky lg:top-28 lg:block">
            <div className="rounded-[22px] border border-eventkan-ink/10 bg-eventkan-surface p-5 shadow-[0_18px_50px_rgba(17,35,63,.06)]">
              <h4 className="mb-4 border-b border-eventkan-ink/10 pb-2 text-xs font-bold uppercase tracking-widest text-eventkan-muted">
                Daftar Isi
              </h4>
              <ul className="space-y-3">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="group flex items-center gap-2 text-xs font-semibold text-eventkan-muted transition-all hover:text-eventkan-accent"
                    >
                      <ChevronRight className="h-3 w-3 text-eventkan-accent opacity-0 transition-opacity group-hover:opacity-100" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-6 border-t border-eventkan-ink/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-widest text-eventkan-muted">
                  Bagikan artikel
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    aria-label="Copy link artikel"
                    className="group relative grid size-10 cursor-pointer place-items-center rounded-full border border-eventkan-ink/10 bg-transparent text-eventkan-navy transition hover:border-eventkan-navy hover:bg-eventkan-canvas"
                  >
                    <Link2 className="h-4 w-4" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-eventkan-navy px-2.5 py-1.5 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      {shareCopied ? 'Link tersalin' : 'Copy link'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare('whatsapp')}
                    aria-label="Bagikan ke WhatsApp"
                    className="group relative grid size-10 cursor-pointer place-items-center rounded-full border border-eventkan-ink/10 bg-transparent text-eventkan-navy transition hover:border-eventkan-navy hover:bg-eventkan-canvas"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-eventkan-navy px-2.5 py-1.5 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      WhatsApp
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleShare('linkedin')}
                    aria-label="Bagikan ke LinkedIn"
                    className="group relative grid size-10 cursor-pointer place-items-center rounded-full border border-eventkan-ink/10 bg-transparent text-eventkan-navy transition hover:border-eventkan-navy hover:bg-eventkan-canvas"
                  >
                    <LinkedInIcon className="h-4 w-4" />
                    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-eventkan-navy px-2.5 py-1.5 text-[10px] font-bold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      LinkedIn
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Markdown Copy Action */}
            <button
              onClick={handleCopyMarkdown}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-eventkan-navy px-4 py-3 text-xs font-bold text-white transition-all hover:bg-[var(--eventkan-navy-hover)]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-[var(--eventkan-green)]" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-white" />
                  Salin Ringkasan (MD)
                </>
              )}
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailClient;
