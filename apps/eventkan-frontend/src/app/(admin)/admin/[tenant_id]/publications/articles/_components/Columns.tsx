'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';
import Image from 'next/image';
import { useState } from 'react';
import { Search } from 'lucide-react';

import type { Article } from '@/interfaces/features/articles';

import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { formatDeletedStatusLabel } from '@/lib/formatAdminBadgeLabel';
import SortableTableHeader from '@/components/Common/SortableTableHeader';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';

import CellAction from './CellAction';

const Columns: ColumnDef<Article>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableTableHeader column={column} label="Judul Artikel" />,
    cell: ({ row }) => <TitleCell row={row} />,
  },
  {
    id: 'deleted',
    accessorFn: (row) => (row.deletedAt ? 0 : 1),
    header: ({ column }) => <SortableTableHeader column={column} label="Status" />,
    cell: ({ row }) =>
      row.original.deletedAt ? (
        <Badge variant="outline" className="rounded-full border-0 bg-eventkan-peach px-2.5 py-1 text-[10px] font-medium text-eventkan-peach-ink">
          {formatDeletedStatusLabel(true)}
        </Badge>
      ) : (
        <Badge variant="outline" className="rounded-full border-0 bg-eventkan-green px-2.5 py-1 text-[10px] font-medium text-eventkan-green-ink">
          {formatDeletedStatusLabel(false)}
        </Badge>
      ),
  },
  {
    accessorKey: 'articleCategories',
    header: 'Kategori',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.articleCategories && row.original.articleCategories.length > 0 ? (
          row.original.articleCategories.map((cat) => (
            <Badge key={cat.id} variant="secondary" className="rounded-full border-0 bg-eventkan-canvas px-2.5 py-1 text-[10px] font-medium text-eventkan-muted">
              {cat.name}
            </Badge>
          ))
        ) : (
          <span className="text-sm leading-relaxed text-eventkan-muted">-</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Terakhir Diperbarui" />,
    cell: ({ row }) =>
      <span className="text-sm leading-relaxed text-eventkan-muted">
        {moment(row.original.updatedAt).tz('Asia/Jakarta').locale('id').format('DD MMMM YYYY, HH:mm')}
      </span>,
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const TitleCell = ({ row }: { row: { original: Article } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const image = row.original.cover;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={image}
        title={row.original.title}
        aspectRatio="3/2"
      />
      <div className="flex items-center gap-3 text-left">
        <div
          className="relative h-10 w-16 min-w-16 rounded-lg overflow-hidden border bg-eventkan-canvas flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
          onClick={() => image && setIsPreviewOpen(true)}
        >
          {image ? (
            <>
              <Image
                src={image}
                alt={row.original.title}
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                fill
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
            </>
          ) : (
            <span className="text-[10px] font-medium text-eventkan-muted">COVER</span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.title}</span>
          <span className="line-clamp-2 max-w-md text-sm leading-relaxed text-eventkan-muted">
            {row.original.content.replace(/<[^>]*>?/gm, '').substring(0, 50)}...
          </span>
        </div>
      </div>
    </>
  );
};

export default Columns;
