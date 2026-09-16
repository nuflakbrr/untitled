'use client';

import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';
import Image from 'next/image';
import { type FC, useState } from 'react';
import { Tag, Calendar } from 'lucide-react';

import type { Gallery, GalleryGridProps } from '@/interfaces/features/galleries';

import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog';

import { getBentoSpans } from '../../_libs/getBentoSpans.libs';
import { useGalleryPagination } from '../_hooks/useGalleryPagination';

const GalleryGrid: FC<GalleryGridProps> = ({ initialItems }) => {
  const { hasMore, items, observerRef } = useGalleryPagination(initialItems);
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedItem(item)}
            className={`group relative cursor-pointer overflow-hidden rounded-[24px] border border-eventkan-ink/10 bg-eventkan-surface shadow-[0_12px_30px_rgba(17,35,63,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(17,35,63,.1)] ${getBentoSpans(idx)}`}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-eventkan-navy/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              <span className="translate-y-2 rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-bold text-eventkan-navy shadow-md transition-transform duration-300 group-hover:translate-y-0">
                Lihat Detail
              </span>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,35,63,.9),rgba(17,35,63,.18)_65%,transparent)]" />
            <div className="absolute inset-x-0 bottom-0 z-20 p-5 text-white">
              <h3 className="font-display line-clamp-2 text-lg font-bold leading-tight">
                {item.title}
              </h3>
              {item.description && (
                <p className="mt-1 line-clamp-2 max-w-sm text-xs text-white/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger Indicator */}
      {hasMore && (
        <div ref={observerRef} className="flex justify-center items-center py-10 mt-6">
          <div
            className="w-6 h-6 border-2 border-t-transparent animate-spin rounded-full"
            style={{ borderColor: '#D97757', borderTopColor: 'transparent' }}
          />
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="w-[calc(100vw-2rem)] max-h-[92vh] overflow-hidden rounded-[30px] border border-eventkan-ink/10 bg-eventkan-canvas p-0 shadow-[0_24px_70px_rgba(17,35,63,.16)] sm:max-w-4xl lg:max-w-6xl">
          {selectedItem && (
            <div className="flex max-h-[92vh] flex-col overflow-y-auto md:flex-row md:overflow-hidden">
              <div className="relative flex aspect-4/3 w-full shrink-0 items-center justify-center bg-eventkan-navy md:aspect-auto md:min-h-135 md:flex-1">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex w-full shrink-0 flex-col justify-between overflow-y-auto border-t border-eventkan-ink/10 bg-eventkan-surface p-6 sm:p-8 md:w-90 md:border-l md:border-t-0">
                <div className="space-y-8">
                  {/* <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-eventkan-ink/10 bg-white/70 px-3 py-2 text-[11px] font-bold text-eventkan-navy">
                      Dokumentasi
                    </span>
                    {selectedItem.featured && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-eventkan-accent/20 bg-eventkan-peach px-3 py-2 text-[11px] font-bold text-eventkan-peach-ink">
                        Featured
                      </span>
                    )}
                  </div> */}

                  <div className="space-y-3">
                    <DialogTitle className="font-display text-[clamp(24px,3vw,32px)] font-extrabold leading-[1.05] tracking-[-.04em] text-eventkan-navy">
                      {selectedItem.title}
                    </DialogTitle>
                    <DialogDescription className="hidden">
                      Detail foto {selectedItem.title}
                    </DialogDescription>
                    {selectedItem.description && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-eventkan-muted">
                        {selectedItem.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-4 border-t border-eventkan-ink/10 pt-6 text-sm text-eventkan-muted">
                  {selectedItem.event && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 shrink-0 text-eventkan-accent" />
                      <span className="font-semibold text-eventkan-navy">
                        {selectedItem.event.title}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-eventkan-accent" />
                    <span>
                      {moment(selectedItem.createdAt)
                        .tz('Asia/Jakarta')
                        .locale('id')
                        .format('DD MMMM YYYY')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryGrid;
