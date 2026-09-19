'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';
import Image from 'next/image';
import { useState } from 'react';
import { Search } from 'lucide-react';

import type { Event } from '@/interfaces/features/events';

import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/formatCurrency';
import { EventType, EventStatus } from '@/interfaces/enums';
import SortableTableHeader from '@/components/Common/SortableTableHeader';
import ImagePreviewModal from '@/components/Common/Modals/ImagePreviewModal';
import {
  formatEventTypeLabel,
  formatEventStatusLabel,
  formatDeletedStatusLabel,
} from '@/lib/formatAdminBadgeLabel';

import CellAction from './CellAction';

const Columns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => <TitleCell row={row} />,
  },
  {
    accessorKey: 'eventType',
    header: ({ column }) => <SortableTableHeader column={column} label="Tipe" />,
    cell: ({ row }) => {
      const type = row.original.eventType;
      const isOnline = type === EventType.ONLINE;
      return (
        <Badge
          variant="outline"
          className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-medium capitalize ${
            isOnline
              ? 'bg-eventkan-peach text-eventkan-peach-ink'
              : 'bg-eventkan-navy/8 text-eventkan-navy'
          }`}
        >
          {formatEventTypeLabel(type)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <SortableTableHeader column={column} label="Biaya" />,
    cell: ({ row }) => {
      const price = row.original.price;
      if (price === 0) {
        return (
          <Badge
            variant="outline"
            className="rounded-full border-0 bg-eventkan-green px-2.5 py-1 text-[10px] font-medium text-eventkan-green-ink"
          >
            Gratis
          </Badge>
        );
      }
      return <span className="text-sm font-semibold text-eventkan-ink">{formatCurrency(price)}</span>;
    },
  },
  {
    accessorKey: 'quota',
    header: ({ column }) => <SortableTableHeader column={column} label="Peserta" />,
    cell: ({ row }) => {
      const event = row.original;
      const registered = event._count?.registrations ?? 0;
      const quota = event.quota;
      return (
        <span className="text-sm font-semibold text-eventkan-ink">
          {registered} / <span className="font-normal text-eventkan-muted">{quota}</span>
        </span>
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
          case EventStatus.DRAFT:
            return 'bg-eventkan-canvas text-eventkan-muted';
          case EventStatus.PUBLISHED:
            return 'bg-eventkan-green text-eventkan-green-ink';
          case EventStatus.CLOSED:
            return 'bg-eventkan-peach text-eventkan-peach-ink';
          case EventStatus.COMPLETED:
            return 'bg-eventkan-navy/8 text-eventkan-navy';
          default:
            return '';
        }
      };
      return (
        <Badge
          variant="outline"
          className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-medium capitalize ${getStatusClass(status)}`}
        >
          {formatEventStatusLabel(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => <SortableTableHeader column={column} label="Tanggal Mulai" />,
    cell: ({ row }) => {
      const event = row.original;
      const formattedDate = moment(event.startDate)
        .tz('Asia/Jakarta')
        .locale('id')
        .format('DD MMM YYYY');
      return (
        <span className="text-sm leading-relaxed text-eventkan-muted">
          {formattedDate}, {event.startTime}
        </span>
      );
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

const TitleCell = ({ row }: { row: { original: Event } }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const event = row.original;

  return (
    <>
      <ImagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        imageSrc={event.banner}
        title={event.title}
        aspectRatio="video"
      />
      <div className="flex items-center gap-3">
        <div
          className="relative h-10 w-16 min-w-16 rounded-md overflow-hidden border bg-eventkan-canvas flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
          onClick={() => event.banner && setIsPreviewOpen(true)}
        >
          {event.banner ? (
            <>
              <Image
                src={event.banner}
                alt={event.title}
                loading="lazy"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                fill
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
            </>
          ) : (
            <span className="text-[10px] font-medium text-eventkan-muted">EVENT</span>
          )}
        </div>
        <div className="flex flex-col text-left max-w-50 md:max-w-75">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-display truncate text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{event.title}</span>
            {event.deletedAt && (
              <Badge
                variant="outline"
                className="shrink-0 rounded-full border-0 bg-eventkan-peach px-2.5 py-1 text-[10px] font-medium text-eventkan-peach-ink"
              >
                {formatDeletedStatusLabel(true)}
              </Badge>
            )}
          </div>
          <span className="truncate text-sm leading-relaxed text-eventkan-muted">/{event.slug}</span>
        </div>
      </div>
    </>
  );
};

export default Columns;
