'use client';

import type { ColumnDef } from '@tanstack/react-table';

import Image from 'next/image';
import { useState } from 'react';
import { Star, Search } from 'lucide-react';

import type { Gallery } from '@/interfaces/features/galleries';

import { Badge } from '@/components/ui/badge';
import { formatGalleryFeaturedLabel } from '@/lib/formatAdminBadgeLabel';
import SortableTableHeader from '@/components/Common/SortableTableHeader';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';

import CellAction from './CellAction';

const Columns: ColumnDef<Gallery>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Foto',
    cell: ({ row }) => <PhotoCell row={row} />,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableTableHeader column={column} label="Judul Foto" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-display line-clamp-1 text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.title}</span>
        {row.original.event && (
          <span className="line-clamp-1 text-sm leading-relaxed text-eventkan-muted">
            Event: {row.original.event.title}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-md text-sm leading-relaxed text-eventkan-muted">
        {row.original.description || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'featured',
    header: ({ column }) => <SortableTableHeader column={column} label="Tampil di Landing" />,
    cell: ({ row }) =>
      row.original.featured ? (
        <Badge
          variant="default"
          className="flex w-fit items-center gap-1 rounded-full border-0 bg-eventkan-yellow px-2.5 py-1 text-[10px] font-medium text-eventkan-ink"
        >
          <Star className="w-3 h-3 fill-white" /> {formatGalleryFeaturedLabel(true)}
        </Badge>
      ) : (
        <Badge variant="outline" className="w-fit rounded-full border-0 bg-eventkan-canvas px-2.5 py-1 text-[10px] font-medium text-eventkan-muted">
          {formatGalleryFeaturedLabel(false)}
        </Badge>
      ),
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const PhotoCell = ({ row }: { row: { original: Gallery } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const gallery = row.original;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={gallery.imageUrl}
        title={gallery.title}
        aspectRatio="video"
      />
      <div
        className="relative h-10 w-16 min-w-16 rounded-md overflow-hidden border bg-eventkan-canvas flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
        onClick={() => gallery.imageUrl && setIsPreviewOpen(true)}
      >
        <Image
          src={gallery.imageUrl}
          alt={gallery.title}
          loading="lazy"
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          fill
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Search className="h-4 w-4 text-white" />
        </div>
      </div>
    </>
  );
};

export default Columns;
