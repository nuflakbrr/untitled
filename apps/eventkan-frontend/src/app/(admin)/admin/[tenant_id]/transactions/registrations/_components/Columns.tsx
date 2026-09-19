'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { Registration } from '@/interfaces/features/registrations';

import { Badge } from '@/components/ui/badge';
import { RegistrationStatus } from '@/interfaces/enums';
import SortableTableHeader from '@/components/Common/SortableTableHeader';
import { formatRegistrationStatusLabel } from '@/lib/formatAdminBadgeLabel';

import CellAction from './CellAction';
import AttendanceProofCell from './AttendanceProofCell';

const Columns: ColumnDef<Registration>[] = [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => <SortableTableHeader column={column} label="No. Registrasi" />,
    cell: ({ row }) => <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.registrationNumber}</span>,
  },
  {
    accessorKey: 'event',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => {
      const event = row.original.event;
      return (
        <div className="flex flex-col">
          <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{event?.title}</span>
          {event?.price > 0 ? (
            <span className="text-sm leading-relaxed text-eventkan-accent">Berbayar</span>
          ) : (
            <span className="text-sm leading-relaxed text-eventkan-green-ink">Gratis</span>
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
          <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{user?.name || '-'}</span>
          <span className="text-sm leading-relaxed text-eventkan-muted">{user?.email}</span>
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
            return 'bg-eventkan-yellow text-eventkan-ink';
          case RegistrationStatus.REGISTERED:
            return 'bg-eventkan-green text-eventkan-green-ink';
          case RegistrationStatus.CANCELLED:
            return 'bg-eventkan-peach text-eventkan-peach-ink';
          case RegistrationStatus.CHECKED_IN:
            return 'bg-eventkan-navy/8 text-eventkan-navy';
          default:
            return '';
        }
      };
      return (
        <Badge
          variant="outline"
          className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-medium ${getStatusClass(status)}`}
        >
          {formatRegistrationStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    id: 'attendanceProof',
    header: 'Bukti Kehadiran',
    cell: ({ row }) => <AttendanceProofCell data={row.original} />,
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
