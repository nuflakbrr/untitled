import { Image as ImageIcon } from 'lucide-react';

import { genPageMetadata } from '@/app/seo';
import EmptyState from '@/components/Common/EmptyState';
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
          <EmptyState
            icon={ImageIcon}
            title="Dokumentasi belum tersedia"
            description="Foto kegiatan akan tampil di sini setelah dokumentasi event diunggah."
          />
        ) : (
          <GalleryGrid initialItems={galleries} />
        )}
      </div>
    </section>
  );
}
