'use client';

import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';
import Image from 'next/image';
import { type FC, useState } from 'react';
import { Tag, Calendar } from 'lucide-react';

import type { Gallery } from '@/interfaces/features/galleries';

import { Dialog, DialogTitle, DialogContent, DialogDescription } from '@/components/ui/dialog';

import { getBentoSpans } from '../../_libs/getBentoSpans';
import { useGalleryPagination } from '../_hooks/useGalleryPagination';

interface GalleryGridProps {
  initialItems: Gallery[];
}

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
            className={`group relative cursor-pointer overflow-hidden rounded-[24px] border border-[#111927]/10 bg-[#fffdf8] shadow-[0_12px_30px_rgba(17,35,63,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(17,35,63,.1)] ${getBentoSpans(idx)}`}
          >
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#11233f]/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
              <span className="translate-y-2 rounded-full border border-white/70 bg-white px-4 py-2 text-xs font-bold text-[#11233f] shadow-md transition-transform duration-300 group-hover:translate-y-0">
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
        <DialogContent className="w-[calc(100vw-2rem)] max-h-[92vh] overflow-hidden rounded-[30px] border border-[#111927]/10 bg-[#f6f3eb] p-0 shadow-[0_24px_70px_rgba(17,35,63,.16)] sm:max-w-4xl lg:max-w-6xl">
          {selectedItem && (
            <div className="flex max-h-[92vh] flex-col overflow-y-auto md:flex-row md:overflow-hidden">
              <div className="relative flex aspect-4/3 w-full shrink-0 items-center justify-center bg-[#11233f] md:aspect-auto md:min-h-135 md:flex-1">
                <Image
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  fill
                  unoptimized
                  className="object-cover"
                  priority
                />
              </div>

              <div className="flex w-full shrink-0 flex-col justify-between overflow-y-auto border-t border-[#111927]/10 bg-[#fffdf8] p-6 sm:p-8 md:w-90 md:border-l md:border-t-0">
                <div className="space-y-8">
                  {/* <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#111927]/10 bg-white/70 px-3 py-2 text-[11px] font-bold text-[#11233f]">
                      Dokumentasi
                    </span>
                    {selectedItem.featured && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#ff7a45]/20 bg-[#ffe5d8] px-3 py-2 text-[11px] font-bold text-[#b84a2a]">
                        Featured
                      </span>
                    )}
                  </div> */}

                  <div className="space-y-3">
                    <DialogTitle className="font-display text-[clamp(24px,3vw,32px)] font-extrabold leading-[1.05] tracking-[-.04em] text-[#11233f]">
                      {selectedItem.title}
                    </DialogTitle>
                    <DialogDescription className="hidden">
                      Detail foto {selectedItem.title}
                    </DialogDescription>
                    {selectedItem.description && (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#6c7280]">
                        {selectedItem.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 space-y-4 border-t border-[#111927]/10 pt-6 text-sm text-[#6c7280]">
                  {selectedItem.event && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 shrink-0 text-[#ff7a45]" />
                      <span className="font-semibold text-[#11233f]">
                        {selectedItem.event.title}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-[#ff7a45]" />
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
