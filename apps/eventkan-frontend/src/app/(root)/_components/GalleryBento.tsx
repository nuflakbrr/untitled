import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { getPublicGalleries } from '@/services/public/galleries';

import { getBentoSpans } from '../_libs/getBentoSpans.libs';

const GalleryBento: FC = async () => {
  const response = await getPublicGalleries(1, 5, true);
  const galleries = (response.data || []).filter((item) => item.imageUrl?.trim());

  if (galleries.length === 0) return null;

  return (
    <section id="galeri-unggulan" className="border-t border-eventkan-ink/10 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-295">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display max-w-190 text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-.04em]">
              Lihat keseruannya sebelum ikut meramaikan.
            </h2>
            <p className="mt-5 max-w-155 text-[17px] leading-relaxed text-eventkan-muted">
              Intip momen dari berbagai kegiatan kampus dan temukan event yang ingin kamu datangi
              berikutnya.
            </p>
          </div>
          <Link
            href={'/gallery' as Route}
            className="inline-flex group shrink-0 items-center gap-2 rounded-full border border-eventkan-navy px-4.5 py-3 font-bold text-eventkan-navy transition hover:-translate-y-0.5 hover:bg-eventkan-navy hover:text-white"
          >
            Lihat semua galeri{' '}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4.5">
          {galleries.map((item, idx) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-[24px] border border-eventkan-ink/10 bg-eventkan-surface shadow-[0_12px_30px_rgba(17,35,63,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(17,35,63,.1)] ${getBentoSpans(idx)}`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(17,35,63,.9),rgba(17,35,63,.18)_65%,transparent)]" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
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
      </div>
    </section>
  );
};

export default GalleryBento;
