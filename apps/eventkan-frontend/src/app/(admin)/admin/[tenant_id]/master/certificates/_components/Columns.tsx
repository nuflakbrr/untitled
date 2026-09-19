'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { CertificateResponse } from '@/interfaces/features/certificates';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';
import { formatCertificateDownloadLabel } from '@/lib/formatAdminBadgeLabel';

import CellAction from './CellAction';

const Columns: ColumnDef<CertificateResponse>[] = [
  {
    accessorKey: 'certificateNumber',
    header: ({ column }) => <SortableTableHeader column={column} label="Nomor Sertifikat" />,
    cell: ({ row }) => (
      <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">
        {row.original.certificateNumber}
      </span>
    ),
  },
  {
    accessorKey: 'event.title',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => (
      <div className="flex flex-col text-left">
          <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{row.original.event.title}</span>
          <span className="text-sm leading-relaxed text-eventkan-muted">
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
          <span className="font-display text-sm font-semibold tracking-[-.02em] capitalize text-eventkan-ink">{u.name || '-'}</span>
          <span className="text-sm leading-relaxed text-eventkan-muted">{u.email}</span>
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
      return <span className="text-sm leading-relaxed text-eventkan-muted">{formatted}</span>;
    },
  },
  {
    accessorKey: 'downloadTime',
    header: ({ column }) => <SortableTableHeader column={column} label="Status Unduh" />,
    cell: ({ row }) => {
      const t = row.original.downloadTime;
      if (!t) {
        return (
          <Badge variant="outline" className="rounded-full border-0 bg-eventkan-canvas px-2.5 py-1 text-[10px] font-medium text-eventkan-muted">
            {formatCertificateDownloadLabel(false)}
          </Badge>
        );
      }
      const formatted = moment(t).tz('Asia/Jakarta').locale('id').format('DD/MM/YYYY HH:mm');
      return (
        <Badge variant="outline" className="rounded-full border-0 bg-eventkan-green px-2.5 py-1 text-[10px] font-medium text-eventkan-green-ink">
          {formatCertificateDownloadLabel(true, formatted)}
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
