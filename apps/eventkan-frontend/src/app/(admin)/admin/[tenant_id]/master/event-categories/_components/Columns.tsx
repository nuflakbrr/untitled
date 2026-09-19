'use client';

import type { ColumnDef } from '@tanstack/react-table';

import type { EventCategory } from '@/interfaces/features/events';

import { Badge } from '@/components/ui/badge';
import { formatDeletedStatusLabel } from '@/lib/formatAdminBadgeLabel';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<EventCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} label="Nama Kategori" />,
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="flex items-center gap-2.5">
          <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">
            {row.original.name}
          </span>
          {row.original.deletedAt && (
            <Badge
              variant="outline"
              className="border-eventkan-peach/40 bg-eventkan-peach px-2 py-1 text-[10px] font-medium text-eventkan-peach-ink"
            >
              {formatDeletedStatusLabel(true)}
            </Badge>
          )}
        </div>
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
    accessorFn: (row) => row.eventsCount ?? row._count?.events ?? 0,
    id: 'eventCount',
    header: ({ column }) => <SortableTableHeader column={column} label="Jumlah Event" />,
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-eventkan-ink">
        {row.original.eventsCount ?? row.original._count?.events ?? 0}{' '}
        <span className="font-normal text-eventkan-muted">event</span>
      </span>
    ),
  },
  {
    id: 'status',
    accessorFn: (row) => (row.deletedAt ? 0 : 1),
    header: ({ column }) => <SortableTableHeader column={column} label="Status" />,
    cell: ({ row }) => (
      <Badge
        className={
          row.original.deletedAt
            ? 'rounded-full border-0 bg-eventkan-peach px-2.5 py-1 text-[10px] font-medium text-eventkan-peach-ink'
            : 'rounded-full border-0 bg-eventkan-green px-2.5 py-1 text-[10px] font-medium text-eventkan-green-ink'
        }
      >
        {formatDeletedStatusLabel(Boolean(row.original.deletedAt))}
      </Badge>
    ),
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
