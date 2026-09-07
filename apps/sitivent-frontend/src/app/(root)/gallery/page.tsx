import type { Metadata } from 'next';

import api from '@/lib/api';
import { Empty, EmptyTitle, EmptyHeader, EmptyDescription } from '@/components/ui/empty';

import GalleryGrid from './_components/GalleryGrid';
import GalleryHeader from './_components/GalleryHeader';

export const metadata: Metadata = {
  title: 'Galeri Foto - SITIVENT',
  description:
    'Lihat dokumentasi foto keseruan dan kenangan indah dari event-event teknologi terbaik kami.',
};

export default async function PublicGalleryPage() {
  // 1. Fetch data from DB (Clean database query concern)
  let galleries: any[] = [];
  try { galleries = (await api.get('/features/v1/galleries', { params: { page: 1, limit: 10 } })).data.data ?? []; } catch { /* empty state */ }

  // 2. Map data to client schema
  const mapped = galleries.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    imageUrl: item.imageUrl ?? item.image_url ?? '',
    featured: item.featured,
    eventId: item.eventId ?? item.event_id,
    createdAt: String(item.createdAt ?? item.created_at),
    updatedAt: String(item.updatedAt ?? item.updated_at),
    event: item.event,
  }));

  return (
    <section
      className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16"
      style={{ background: '#FAF9F5' }}
    >
      {/* SOLID: Extracted Gallery Header component */}
      <GalleryHeader />

      {/* Grid Section */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        {mapped.length === 0 ? (
          <Empty
            className="py-24 border rounded-2xl bg-white dark:bg-zinc-900 shadow-xs"
            style={{ borderColor: '#E3DACC' }}
          >
            <EmptyHeader>
              <EmptyTitle>Foto Tidak Ditemukan</EmptyTitle>
              <EmptyDescription>
                Saat ini belum ada dokumentasi foto yang ditambahkan.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <GalleryGrid initialItems={mapped} />
        )}
      </div>
    </section>
  );
}
