import type { FC } from 'react';
import type { Gallery } from '@/interfaces/features/galleries';

import { notFound } from 'next/navigation';
import { getGalleryById } from '@/services/admin/galleries';

import GalleryForm from './_components/GalleryForm';

type Props = {
  params: Promise<{ id: string }>;
};

const GalleryDetailCMS: FC<Props> = async ({ params }) => {
  const { id } = await params;
  const isEdit = id !== 'new';

  let initialData: Gallery | null = null;

  if (isEdit) {
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
