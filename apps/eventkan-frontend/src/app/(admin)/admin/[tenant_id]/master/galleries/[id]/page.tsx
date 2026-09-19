import type { FC } from 'react';

import { notFound } from 'next/navigation';

import type { Gallery } from '@/interfaces/features/galleries';

import { getGalleryById } from '@/services/admin/galleries';

import GalleryForm from './_components/GalleryForm';

type Props = {
  params: Promise<{ id: string }>;
};

const GalleryDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const isNew = id === 'new';

  let initialData: Gallery | null = null;

  if (!isNew) {
    const result = await getGalleryById(id);
    if (result.success && result.data) {
      initialData = result.data as Gallery;
    } else {
      return notFound();
    }
  }

  return <GalleryForm initialData={initialData} />;
};

export default GalleryDetailCMS;
