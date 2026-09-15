'use client';

import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';
import { type ColumnDef } from '@tanstack/react-table';
import { FileDown, ChevronsUpDown } from 'lucide-react';

import type { CertificateResponse } from '@/interfaces/features/certificates';

import { Button } from '@/components/ui/button';

import { participantTableHeaderClass } from '../../_libs/tableStyles';

const Columns: ColumnDef<CertificateResponse>[] = [
  {
    accessorKey: 'event',
    header: () => <span className={participantTableHeaderClass}>Event</span>,
    cell: ({ row }) => (
      <span className="font-display text-sm font-extrabold tracking-[-.02em] text-[#111927]">
        {row.original.event.title}
      </span>
    ),
  },
  {
    accessorKey: 'certificateNumber',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className={participantTableHeaderClass}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        No. Sertifikat
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs font-semibold tracking-[-.01em] text-[#4b5565]">
        {row.original.certificateNumber}
      </span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: () => <span className={participantTableHeaderClass}>Tanggal Terbit</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#4b5565]">
        {moment(row.original.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMM YYYY')}
      </span>
    ),
  },
  {
    accessorKey: 'downloadUrl',
    header: () => <span className={participantTableHeaderClass}>Aksi</span>,
    cell: ({ row }) => (
      <Button asChild variant="outline" size="xs" className="gap-1 text-xs font-bold">
        <a href={row.original.downloadUrl} target="_blank" rel="noopener noreferrer">
          <FileDown className="h-3.5 w-3.5" /> Unduh
        </a>
      </Button>
    ),
  },
];

export default Columns;
