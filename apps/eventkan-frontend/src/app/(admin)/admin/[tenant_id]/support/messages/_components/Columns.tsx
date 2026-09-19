'use client';

import 'moment-timezone';

import type { Row, ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { SupportMessage } from '@/interfaces/features/support';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';
import {
  SUPPORT_STATUS_CONFIG,
  getSupportCategoryClass,
  formatSupportStatusLabel,
  formatSupportCategoryLabel,
} from '@/lib/formatAdminBadgeLabel';

import CellAction from './CellAction';
import { useCellAction } from '../_hooks/useCellAction';

const StatusCell = ({ row }: { row: Row<SupportMessage> }) => {
  const data = row.original;
  const { updateStatus, isStatusUpdating } = useCellAction(data.id);

  const config =
    SUPPORT_STATUS_CONFIG[data.status as keyof typeof SUPPORT_STATUS_CONFIG] ||
    SUPPORT_STATUS_CONFIG.PENDING;
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`shrink-0 gap-1 rounded-full border-0 px-2.5 py-1 text-[10px] font-medium ${config.className}`}
      >
        <span>{formatSupportStatusLabel(data.status)}</span>
      </Badge>
      <select
        value={data.status}
        disabled={isStatusUpdating || data.status === 'RESOLVED'}
        onChange={(e) => updateStatus(e.target.value as 'PENDING' | 'PROCESS' | 'RESOLVED')}
        className="cursor-pointer rounded-lg border border-eventkan-ink/10 bg-eventkan-surface px-2 py-0.5 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="PENDING" disabled={data.status !== 'PENDING'}>
          Menunggu
        </option>
        <option value="PROCESS" disabled={data.status === 'RESOLVED'}>
          Proses
        </option>
        <option value="RESOLVED">Selesai</option>
      </select>
    </div>
  );
};

const Columns: ColumnDef<SupportMessage>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Tanggal" />,
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-eventkan-muted">
        {moment(row.original.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMM YYYY')}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} label="Pengirim" />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.name}</span>
        <span className="text-sm leading-relaxed text-eventkan-muted">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <SortableTableHeader column={column} label="Kategori" />,
    cell: ({ row }) => (
      <span
        className={`w-fit rounded-full border-0 px-2.5 py-1 text-[10px] font-medium ${getSupportCategoryClass(row.original.category)}`}
      >
        {formatSupportCategoryLabel(row.original.category)}
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableTableHeader column={column} label="Subjek & Kronologi" />,
    cell: ({ row }) => (
      <div className="flex min-w-0 max-w-xs flex-col">
        <span className="font-display block max-w-full truncate text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.title}</span>
        <span className="line-clamp-2 max-w-md text-sm leading-relaxed text-eventkan-muted">
          {row.original.chronology}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableTableHeader column={column} label="Status" />,
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
