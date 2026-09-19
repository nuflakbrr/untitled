'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { Payment } from '@/interfaces/features/payments';

import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@/interfaces/enums';
import { formatCurrency } from '@/lib/formatCurrency';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => <SortableTableHeader column={column} label="No. Registrasi" />,
    cell: ({ row }) => (
      <span className="font-mono text-sm text-eventkan-ink">{row.original.registration.registrationNumber}</span>
    ),
  },
  {
    accessorKey: 'event',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => <span className="text-sm font-medium text-eventkan-ink">{row.original.registration.event.title}</span>,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => <SortableTableHeader column={column} label="Peserta" />,
    cell: ({ row }) => {
      const user = row.original.registration.user;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-eventkan-ink">{user.name || '-'}</span>
          <span className="text-xs text-eventkan-muted">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <SortableTableHeader column={column} label="Nominal" />,
    cell: ({ row }) => (
      <span className="font-medium text-sm">{formatCurrency(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableTableHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusClass = (val: typeof status) => {
        switch (val) {
          case PaymentStatus.WAITING:
            return 'bg-eventkan-yellow text-eventkan-ink border-eventkan-yellow/30';
          case PaymentStatus.PAID:
            return 'bg-eventkan-green text-eventkan-green-ink border-eventkan-green/30';
          case PaymentStatus.FAILED:
            return 'bg-eventkan-peach text-eventkan-peach-ink border-eventkan-peach/30';
          case PaymentStatus.REFUNDED:
            return 'bg-eventkan-navy/8 text-eventkan-navy border-eventkan-navy/10';
          default:
            return '';
        }
      };
      const getStatusLabel = (val: typeof status) => {
        switch (val) {
          case PaymentStatus.WAITING:
            return 'Menunggu Pembayaran';
          case PaymentStatus.PAID:
            return 'Lunas';
          case PaymentStatus.FAILED:
            return 'Ditolak';
          case PaymentStatus.REFUNDED:
            return 'Dikembalikan';
          default:
            return val;
        }
      };
      return (
        <Badge variant="outline" className={`px-2 py-0.5 font-medium ${getStatusClass(status)}`}>
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Tanggal Transaksi" />,
    cell: ({ row }) => {
      const formattedDate = moment(row.original.createdAt)
        .tz('Asia/Jakarta')
        .locale('id')
        .format('DD MMM YYYY, HH:mm');
      return <span className="text-sm text-eventkan-muted">{formattedDate}</span>;
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
