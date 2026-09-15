'use client';

import 'moment-timezone';
import 'moment/locale/id';

import moment from 'moment';
import { type ColumnDef } from '@tanstack/react-table';
import { Star, Video, Edit3, FileDown, ChevronsUpDown, MessageSquarePlus } from 'lucide-react';

import type { ParticipantRegistration } from '@/interfaces/features/registrations';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { eventHistoryTableHeaderClass } from '../_libs/tableStyles';
import { getEventHistoryStatusConfig } from '../_libs/getEventHistoryStatusConfig';

const Columns = (
  onOpenTestimonial: (registration: ParticipantRegistration) => void
): ColumnDef<ParticipantRegistration>[] => [
  {
    accessorKey: 'registrationNumber',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className={eventHistoryTableHeaderClass}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        No. Registrasi
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs font-semibold tracking-[-.01em] text-[#4b5565]">
        {row.original.registrationNumber}
      </span>
    ),
  },
  {
    accessorKey: 'event',
    header: () => <span className={eventHistoryTableHeaderClass}>Event</span>,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-display text-sm font-semibold tracking-[-.02em] text-[#111927]">
          {row.original.event.title}
        </span>
        <span className="mt-0.5 text-xs text-[#6c7280]">{row.original.event.location}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: () => <span className={eventHistoryTableHeaderClass}>Status</span>,
    cell: ({ row }) => {
      const status = getEventHistoryStatusConfig(row.original.status);

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
    header: () => <span className={eventHistoryTableHeaderClass}>Tanggal Daftar</span>,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-[#4b5565]">
        {moment(row.original.createdAt)
          .tz('Asia/Jakarta')
          .locale('id')
          .format('DD MMM YYYY, HH:mm')}
      </span>
    ),
  },
  {
    accessorKey: 'certificate',
    header: () => <span className={eventHistoryTableHeaderClass}>Sertifikat</span>,
    cell: ({ row }) => {
      const certificate = row.original.certificates?.[0];
      const canDownload =
        row.original.status === 'CHECKED_IN' &&
        row.original.event.certificateEnabled &&
        certificate;

      return canDownload ? (
        <Button asChild variant="outline" size="xs" className="gap-1 text-xs font-bold">
          <a href={certificate.downloadUrl} target="_blank" rel="noopener noreferrer">
            <FileDown className="mr-1 h-3.5 w-3.5" /> Unduh
          </a>
        </Button>
      ) : (
        <span className="text-xs text-[#6c7280]">Belum tersedia</span>
      );
    },
  },
  {
    accessorKey: 'meetingLink',
    header: () => <span className={eventHistoryTableHeaderClass}>Link Meeting</span>,
    cell: ({ row }) =>
      row.original.event.eventType === 'ONLINE' && row.original.event.meetingLink ? (
        <Button asChild variant="outline" size="xs" className="gap-1 text-xs font-bold">
          <a href={row.original.event.meetingLink} target="_blank" rel="noopener noreferrer">
            <Video className="mr-1 h-3.5 w-3.5" /> Gabung
          </a>
        </Button>
      ) : (
        <span className="text-xs text-[#6c7280]">Belum tersedia</span>
      ),
  },
  {
    accessorKey: 'testimonial',
    header: () => <span className={eventHistoryTableHeaderClass}>Testimoni</span>,
    cell: ({ row }) => {
      const registration = row.original;
      const isEligible =
        registration.status === 'CHECKED_IN' && registration.event.status === 'COMPLETED';

      if (!isEligible) return <span className="text-xs text-[#6c7280]">Belum tersedia</span>;

      return registration.testimonial ? (
        <Button
          variant="outline"
          size="xs"
          className="gap-1 border-[#ff7a45]/20 bg-[#ffe5d8]/55 text-xs font-bold text-[#b84a2a] hover:bg-[#ffe5d8]"
          onClick={() => onOpenTestimonial(registration)}
        >
          <Star className="h-3.5 w-3.5 fill-[#ff7a45] text-[#ff7a45]" />
          <span>{registration.testimonial.rating}/5</span>
          <Edit3 className="ml-0.5 h-3 w-3 opacity-60" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="xs"
          className="gap-1 text-xs"
          onClick={() => onOpenTestimonial(registration)}
        >
          <MessageSquarePlus className="h-3.5 w-3.5 text-[#ff7a45]" />
          Beri Ulasan
        </Button>
      );
    },
  },
];

export default Columns;
