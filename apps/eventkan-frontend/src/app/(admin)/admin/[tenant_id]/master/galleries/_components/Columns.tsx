'use client';

import type { ColumnDef } from '@tanstack/react-table';

import Image from 'next/image';
import { useState } from 'react';
import { Star, Search } from 'lucide-react';

import type { Gallery } from '@/interfaces/features/galleries';

import { Badge } from '@/components/ui/badge';
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
        <span className="line-clamp-1 text-sm font-medium text-eventkan-ink">{row.original.title}</span>
        {row.original.event && (
          <span className="line-clamp-1 text-xs font-sans text-eventkan-muted">
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
      <span className="line-clamp-2 max-w-xs text-sm text-eventkan-muted">
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
          className="flex w-fit items-center gap-1 bg-eventkan-yellow text-eventkan-ink hover:bg-eventkan-yellow/90"
        >
          <Star className="w-3 h-3 fill-white" /> Featured
        </Badge>
      ) : (
        <Badge variant="outline" className="w-fit text-eventkan-muted">
          Standard
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
        className="relative h-10 w-16 min-w-16 rounded-md overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
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
