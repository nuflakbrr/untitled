'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { Registration } from '@/interfaces/features/registrations';

import { Badge } from '@/components/ui/badge';
import { RegistrationStatus } from '@/interfaces/enums';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<Registration>[] = [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => <SortableTableHeader column={column} label="No. Registrasi" />,
    cell: ({ row }) => <span className="font-mono text-sm text-eventkan-ink">{row.original.registrationNumber}</span>,
  },
  {
    accessorKey: 'event',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => {
      const event = row.original.event;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-eventkan-ink">{event?.title}</span>
          {event?.price > 0 ? (
            <span className="text-xs font-medium text-eventkan-accent">Berbayar</span>
          ) : (
            <span className="text-xs font-medium text-eventkan-green-ink">Gratis</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'user',
    header: ({ column }) => <SortableTableHeader column={column} label="Peserta" />,
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-eventkan-ink">{user?.name || '-'}</span>
          <span className="text-xs text-eventkan-muted">{user?.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <SortableTableHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusClass = (val: typeof status) => {
        switch (val) {
          case RegistrationStatus.WAITING_PAYMENT:
            return 'bg-eventkan-yellow text-eventkan-ink border-eventkan-yellow/30';
          case RegistrationStatus.REGISTERED:
            return 'bg-eventkan-green text-eventkan-green-ink border-eventkan-green/30';
          case RegistrationStatus.CANCELLED:
            return 'bg-eventkan-peach text-eventkan-peach-ink border-eventkan-peach/30';
          case RegistrationStatus.CHECKED_IN:
            return 'bg-eventkan-navy/8 text-eventkan-navy border-eventkan-navy/10';
          default:
            return '';
        }
      };
      const getStatusLabel = (val: typeof status) => {
        switch (val) {
          case RegistrationStatus.WAITING_PAYMENT:
            return 'Menunggu Pembayaran';
          case RegistrationStatus.REGISTERED:
            return 'Terdaftar';
          case RegistrationStatus.CANCELLED:
            return 'Dibatalkan';
          case RegistrationStatus.CHECKED_IN:
            return 'Hadir';
          default:
            return val;
        }
      };
      return (
        <Badge
          variant="outline"
          className={`px-1.5 py-0.5 text-xs font-medium sm:text-sm ${getStatusClass(status)}`}
        >
          {getStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Tanggal" />,
    cell: ({ row }) => {
      const formattedDate = moment(row.original.createdAt)
        .clone()
        .locale('id')
        .tz('Asia/Jakarta')
        .format('DD MMM, HH:mm');
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
