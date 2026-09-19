'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { Permission } from '@/interfaces/features/permissions';

import { Checkbox } from '@/components/ui/checkbox';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<Permission>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} label="Nama Hak Akses" />,
    cell: ({ row }) => (
      <div className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <div className="line-clamp-2 max-w-md text-sm leading-relaxed text-eventkan-muted">
        {row.getValue('description') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <SortableTableHeader column={column} label="Terakhir Diperbarui" />,
    cell: ({ row }) => {
      const date = row.original;
      return (
        <span className="text-sm leading-relaxed text-eventkan-muted">
          {moment(date.updatedAt || new Date())
            .tz('Asia/Jakarta')
            .locale('id')
            .format('DD MMMM YYYY, HH:mm')}
        </span>
      );
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
