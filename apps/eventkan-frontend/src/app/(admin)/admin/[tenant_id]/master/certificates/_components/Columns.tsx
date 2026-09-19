'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { CertificateResponse } from '@/interfaces/features/certificates';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<CertificateResponse>[] = [
  {
    accessorKey: 'certificateNumber',
    header: ({ column }) => <SortableTableHeader column={column} label="Nomor Sertifikat" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs text-eventkan-ink">
        {row.original.certificateNumber}
      </span>
    ),
  },
  {
    accessorKey: 'event.title',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => (
      <div className="flex flex-col text-left">
          <span className="text-sm font-medium text-eventkan-ink">{row.original.event.title}</span>
          <span className="font-mono text-xs text-eventkan-muted">
          {row.original.registration.registrationNumber}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'user.name',
    header: ({ column }) => <SortableTableHeader column={column} label="Penerima" />,
    cell: ({ row }) => {
      const u = row.original.user;
      return (
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium capitalize text-eventkan-ink">{u.name || '-'}</span>
          <span className="text-xs text-eventkan-muted">{u.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Tanggal Terbit" />,
    cell: ({ row }) => {
      const formatted = moment(row.original.createdAt)
        .tz('Asia/Jakarta')
        .locale('id')
        .format('DD MMMM YYYY, HH:mm');
      return <span className="text-sm text-eventkan-muted">{formatted}</span>;
    },
  },
  {
    accessorKey: 'downloadTime',
    header: ({ column }) => <SortableTableHeader column={column} label="Status Unduh" />,
    cell: ({ row }) => {
      const t = row.original.downloadTime;
      if (!t) {
        return (
          <Badge variant="outline" className="border-eventkan-ink/10 bg-eventkan-canvas text-eventkan-muted">
            Belum Diunduh
          </Badge>
        );
      }
      const formatted = moment(t).tz('Asia/Jakarta').locale('id').format('DD/MM/YYYY HH:mm');
      return (
        <Badge variant="outline" className="border-eventkan-green/30 bg-eventkan-green text-eventkan-green-ink">
          Diunduh ({formatted})
        </Badge>
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
