'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { ChevronsUpDown } from 'lucide-react';

import type { EventCategory } from '@/interfaces/features/events';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import CellAction from './CellAction';

const Columns: ColumnDef<EventCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="h-auto p-0 font-extrabold text-eventkan-muted hover:bg-transparent hover:text-eventkan-ink"
      >
        Nama Kategori
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm font-extrabold tracking-[-.02em] text-eventkan-ink">
            {row.original.name}
          </span>
          {row.original.deletedAt && (
            <Badge
              variant="outline"
              className="border-eventkan-peach/40 bg-eventkan-peach text-[10px] text-eventkan-peach-ink"
            >
              Terhapus
            </Badge>
          )}
        </div>
        <span className="font-mono text-[10px] text-eventkan-muted">{row.original.slug}</span>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-xs text-xs text-eventkan-muted">
        {row.original.description || '-'}
      </span>
    ),
  },
  {
    accessorKey: '_count',
    header: 'Jumlah Event',
    cell: ({ row }) => (
      <Badge className="rounded-full border-0 bg-eventkan-canvas px-2 py-1 text-[10px] font-extrabold text-eventkan-ink">
        {row.original.eventsCount ?? row.original._count?.events ?? 0} event
      </Badge>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        className={
          row.original.deletedAt
            ? 'rounded-full border-0 bg-eventkan-peach px-2 py-1 text-[10px] font-extrabold text-eventkan-peach-ink'
            : 'rounded-full border-0 bg-eventkan-green px-2 py-1 text-[10px] font-extrabold text-eventkan-green-ink'
        }
      >
        {row.original.deletedAt ? 'Terhapus' : 'Aktif'}
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
