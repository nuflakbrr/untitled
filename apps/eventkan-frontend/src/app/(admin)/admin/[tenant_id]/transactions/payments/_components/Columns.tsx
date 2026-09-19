'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { Payment } from '@/interfaces/features/payments';

import { Badge } from '@/components/ui/badge';
import { PaymentStatus } from '@/interfaces/enums';
import { formatCurrency } from '@/lib/formatCurrency';
import { formatPaymentStatusLabel } from '@/lib/formatAdminBadgeLabel';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => <SortableTableHeader column={column} label="No. Registrasi" />,
    cell: ({ row }) => (
      <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.registration.registrationNumber}</span>
    ),
  },
  {
    accessorKey: 'event',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.registration.event.title}</span>,
  },
  {
    accessorKey: 'user',
    header: ({ column }) => <SortableTableHeader column={column} label="Peserta" />,
    cell: ({ row }) => {
      const user = row.original.registration.user;
      return (
        <div className="flex flex-col">
        <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{user.name || '-'}</span>
        <span className="text-sm leading-relaxed text-eventkan-muted">{user.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <SortableTableHeader column={column} label="Nominal" />,
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-eventkan-ink">{formatCurrency(row.original.amount)}</span>
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
            return 'bg-eventkan-yellow text-eventkan-ink';
          case PaymentStatus.PAID:
            return 'bg-eventkan-green text-eventkan-green-ink';
          case PaymentStatus.FAILED:
            return 'bg-eventkan-peach text-eventkan-peach-ink';
          case PaymentStatus.REFUNDED:
            return 'bg-eventkan-navy/8 text-eventkan-navy';
          default:
            return '';
        }
      };
      return (
        <Badge variant="outline" className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-medium ${getStatusClass(status)}`}>
          {formatPaymentStatusLabel(status)}
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
      return <span className="text-sm leading-relaxed text-eventkan-muted">{formattedDate}</span>;
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
