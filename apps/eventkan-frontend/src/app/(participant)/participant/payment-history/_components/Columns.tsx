'use client';

import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';
import { ChevronsUpDown } from 'lucide-react';
import { type ColumnDef } from '@tanstack/react-table';

import type { ParticipantPayment } from '@/interfaces/features/payments';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatCurrency';

import { participantTableHeaderClass } from '../../_libs/tableStyles.libs';
import { getPaymentStatusConfig } from '../_libs/getPaymentStatusConfig.libs';

const Columns: ColumnDef<ParticipantPayment>[] = [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className={participantTableHeaderClass}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        No. Registrasi
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs font-semibold tracking-[-.01em] text-[#4b5565]">
        {row.original.registration.registrationNumber}
      </span>
    ),
  },
  {
    accessorKey: 'event',
    header: () => <span className={participantTableHeaderClass}>Event</span>,
    cell: ({ row }) => (
      <span className="font-display text-sm font-semibold tracking-[-.02em] text-[#111927]">
        {row.original.registration.event.title}
      </span>
    ),
  },
  {
    accessorKey: 'amount',
    header: () => <span className={participantTableHeaderClass}>Nominal</span>,
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-[#11233f]">
        {formatCurrency(row.original.amount)}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <span className={participantTableHeaderClass}>Status</span>,
    cell: ({ row }) => {
      const status = getPaymentStatusConfig(row.original.status);

      return (
        <Badge
          variant="outline"
          className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${status.className}`}
        >
          {status.label}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: () => <span className={participantTableHeaderClass}>Tanggal Transaksi</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#4b5565]">
        {moment(row.original.createdAt)
          .tz('Asia/Jakarta')
          .locale('id')
          .format('DD MMM YYYY, HH:mm')}
      </span>
    ),
  },
];

export default Columns;
