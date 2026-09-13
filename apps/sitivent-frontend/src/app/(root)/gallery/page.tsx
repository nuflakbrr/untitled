import { genPageMetadata } from '@/app/seo';
import { getPublicGalleries } from '@/services/public/galleries';

import GalleryGrid from './_components/GalleryGrid';
import GalleryHeader from './_components/GalleryHeader';

export const metadata = genPageMetadata({
  title: 'Galeri Foto',
  description:
    'Lihat dokumentasi foto keseruan dan kenangan indah dari event-event teknologi terbaik kami.',
});

export default async function PublicGalleryPage() {
  const { data: galleries } = await getPublicGalleries(1, 10);

  return (
    <section className="min-h-screen bg-[#f6f3eb] pb-24 text-[#111927]">
      <GalleryHeader />

      <div className="mx-auto max-w-295 px-4 md:px-0">
        {galleries.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center rounded-[24px] border border-[#111927]/10 bg-[#fffdf8] px-6 py-16 text-center shadow-[0_18px_50px_rgba(17,35,63,.05)]">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#ffe5d8] text-[#ff7a45]">
              <span className="font-display text-xl font-extrabold">S</span>
            </div>
            <h2 className="font-display mt-5 text-2xl font-extrabold tracking-[-.03em] text-[#11233f]">
              Dokumentasi belum tersedia
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6c7280]">
              Foto kegiatan akan tampil di sini setelah dokumentasi event diunggah.
            </p>
          </div>
        ) : (
          <GalleryGrid initialItems={galleries} />
        )}
      </div>
    </section>
  );
}
