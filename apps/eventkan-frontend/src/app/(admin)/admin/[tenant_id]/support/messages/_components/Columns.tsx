'use client';

import 'moment-timezone';

import type { Row, ColumnDef } from '@tanstack/react-table';
import type { SupportMessage } from '@/interfaces/features/support';

import moment from 'moment';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSupportMessageStatusAction } from '@/services/participant/support';

import CellAction from './CellAction';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    className:
      'border-rose-200 bg-rose-50/50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-950/20 dark:text-rose-400',
  },
  PROCESS: {
    label: 'Diproses',
    className:
      'border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400',
  },
  RESOLVED: {
    label: 'Selesai',
    className:
      'border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400',
  },
} as const;

const categoryClass = (category: string) => {
  const value = category.toLowerCase();
  if (value.includes('bayar') || value.includes('payment'))
    return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-950/20 dark:text-emerald-400';
  if (value.includes('event'))
    return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-950/20 dark:text-blue-400';
  if (value.includes('akun') || value.includes('account'))
    return 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-500/30 dark:bg-violet-950/20 dark:text-violet-400';
  return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-400';
};

const StatusCell = ({ row }: { row: Row<SupportMessage> }) => {
  const queryClient = useQueryClient();
  const data = row.original;

  const { mutate: handleUpdateStatus, isPending } = useMutation({
    mutationFn: async (status: 'PENDING' | 'PROCESS' | 'RESOLVED') => {
      const res = await updateSupportMessageStatusAction(data.id, status);
      if (!res.success) {
        throw new Error(res.error ?? 'Gagal memperbarui status.');
      }
      return res.data;
    },
    onSuccess: () => {
      toast.success('Status pengaduan berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const config = STATUS_CONFIG[data.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`shrink-0 gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.className}`}
      >
        <span>{config.label}</span>
      </Badge>
      <select
        value={data.status}
        disabled={isPending || data.status === 'RESOLVED'}
        onChange={(e) => handleUpdateStatus(e.target.value as 'PENDING' | 'PROCESS' | 'RESOLVED')}
        className="px-2 py-0.5 text-xs rounded-lg border bg-white dark:bg-zinc-950 outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
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
    header: 'Tanggal',
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {moment(row.original.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMM YYYY')}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Pengirim',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm">{row.original.name}</span>
        <span className="text-xs text-muted-foreground">{row.original.email}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => (
      <span
        className={`w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryClass(row.original.category)}`}
      >
        {row.original.category}
      </span>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Subjek & Kronologi',
    cell: ({ row }) => (
      <div className="flex min-w-0 max-w-xs flex-col">
        <span className="block max-w-full truncate text-sm font-medium">{row.original.title}</span>
        <span className="block max-w-full truncate text-xs text-muted-foreground">
          {row.original.chronology}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
