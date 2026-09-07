'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { EventCategory } from '@/interfaces/features/event-categories';

import { ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import CellAction from './CellAction';

const Columns: ColumnDef<EventCategory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Kategori
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{row.original.name}</span>
          {row.original.deletedAt && (
            <Badge
              variant="outline"
              className="border-rose-200 bg-rose-50 text-[10px] text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300"
            >
              Terhapus
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground font-mono">{row.original.slug}</span>
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
        {row.original.description || '-'}
      </span>
    ),
  },
  {
    accessorKey: '_count',
    header: 'Jumlah Event',
    cell: ({ row }) => (
      <Badge variant="outline" className="font-semibold">
        {row.original.eventsCount ?? row.original._count?.events ?? 0} event
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
