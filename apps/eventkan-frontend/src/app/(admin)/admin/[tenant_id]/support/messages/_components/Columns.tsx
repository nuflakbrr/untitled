'use client';

import 'moment-timezone';

import type { Row, ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { SupportMessage } from '@/interfaces/features/support';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';
import { useCellAction } from '../_hooks/useCellAction';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    className: 'border-eventkan-peach/30 bg-eventkan-peach/60 text-eventkan-peach-ink',
  },
  PROCESS: {
    label: 'Diproses',
    className: 'border-eventkan-yellow/30 bg-eventkan-yellow/60 text-eventkan-ink',
  },
  RESOLVED: {
    label: 'Selesai',
    className: 'border-eventkan-green/30 bg-eventkan-green text-eventkan-green-ink',
  },
} as const;

const categoryClass = (category: string) => {
  const value = category.toLowerCase();
  if (value.includes('bayar') || value.includes('payment'))
    return 'border-eventkan-green/30 bg-eventkan-green text-eventkan-green-ink';
  if (value.includes('event'))
    return 'border-eventkan-navy/10 bg-eventkan-navy/8 text-eventkan-navy';
  if (value.includes('akun') || value.includes('account'))
    return 'border-eventkan-accent/20 bg-eventkan-accent/10 text-eventkan-accent';
  return 'border-eventkan-yellow/30 bg-eventkan-yellow/60 text-eventkan-ink';
};

const StatusCell = ({ row }: { row: Row<SupportMessage> }) => {
  const data = row.original;
  const { updateStatus, isStatusUpdating } = useCellAction(data.id);

  const config = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`shrink-0 gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${config.className}`}
      >
        <span>{config.label}</span>
      </Badge>
      <select
        value={data.status}
        disabled={isStatusUpdating || data.status === 'RESOLVED'}
        onChange={(e) => updateStatus(e.target.value as 'PENDING' | 'PROCESS' | 'RESOLVED')}
        className="cursor-pointer rounded-lg border border-eventkan-ink/10 bg-eventkan-surface px-2 py-0.5 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="PENDING" disabled={data.status !== 'PENDING'}>
          Pending
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
        <span className="text-sm font-medium text-eventkan-ink">{row.original.name}</span>
        <span className="text-xs text-eventkan-muted">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <SortableTableHeader column={column} label="Kategori" />,
    cell: ({ row }) => (
      <span
        className={`w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${categoryClass(row.original.category)}`}
      >
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableTableHeader column={column} label="Subjek & Kronologi" />,
    cell: ({ row }) => (
      <div className="flex min-w-0 max-w-xs flex-col">
        <span className="block max-w-full truncate text-sm font-medium">{row.original.title}</span>
        <span className="block max-w-full truncate text-xs text-eventkan-muted">
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
