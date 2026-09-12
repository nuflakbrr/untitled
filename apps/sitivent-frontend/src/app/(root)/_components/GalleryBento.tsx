import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Image as ImageIcon } from 'lucide-react';

import { getGalleries } from '@/services/admin/galleries';

import { getBentoSpans } from '../_libs/getBentoSpans';

const GalleryBento: FC = async () => {
  const response = await getGalleries(1, 5, '', true);
  const galleries = (response.data || []).filter((item) => item.imageUrl?.trim());

  return (
    <section id="galeri-unggulan" className="border-t border-[#111927]/10 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-295">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display max-w-190 text-[clamp(34px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-.04em]">
              Lihat keseruannya sebelum ikut meramaikan.
            </h2>
            <p className="mt-5 max-w-155 text-[17px] leading-relaxed text-[#6c7280]">
              Intip momen dari berbagai kegiatan kampus dan temukan event yang ingin kamu datangi
              berikutnya.
            </p>
          </div>
          {galleries.length > 0 && (
            <Link
              href={'/gallery' as Route}
              className="inline-flex group shrink-0 items-center gap-2 rounded-full border border-[#11233f] px-4.5 py-3 font-bold text-[#11233f] transition hover:-translate-y-0.5 hover:bg-[#11233f] hover:text-white"
            >
              Lihat semua galeri{' '}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
            </Link>
          )}
        </div>

        {galleries.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] px-6 py-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#ffe5d8] text-[#ff7a45]">
              <ImageIcon className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#11233f]">
              Dokumentasi belum tersedia
            </h3>
            <p className="text-sm leading-relaxed text-[#6c7280]">
              Foto kegiatan akan tampil di sini setelah dokumentasi event diunggah.
            </p>
            <div className="pt-2">
              <Link
                href={'/gallery' as Route}
                className="inline-flex items-center gap-2 rounded-full bg-[#11233f] px-4.5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#1b3458]"
              >
                Kunjungi galeri <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-45 lg:grid-cols-4">
            {galleries.map((item, idx) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] shadow-[0_12px_30px_rgba(17,35,63,.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(17,35,63,.1)] ${getBentoSpans(idx)}`}
              >
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,30,36,.9),rgba(255,122,69,.16)_65%,transparent)]" />
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
        )}
      </div>
    </section>
  );
};

export default GalleryBento;
