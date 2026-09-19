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
          className={`font-medium capitalize px-2 py-0.5 ${
            isOnline
              ? 'border-eventkan-peach/30 bg-eventkan-peach text-eventkan-peach-ink'
              : 'border-eventkan-navy/10 bg-eventkan-navy/8 text-eventkan-navy'
          }`}
        >
          {type}
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
            className="border-eventkan-green/30 bg-eventkan-green text-eventkan-green-ink"
          >
            Gratis
          </Badge>
        );
      }
      return <span className="font-medium text-sm">{formatCurrency(price)}</span>;
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
        <span>
          {registered} / <span className="font-medium text-eventkan-ink">{quota}</span>
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
            return 'border-eventkan-ink/10 bg-eventkan-canvas text-eventkan-muted';
          case EventStatus.PUBLISHED:
            return 'border-eventkan-green/30 bg-eventkan-green text-eventkan-green-ink';
          case EventStatus.CLOSED:
            return 'border-eventkan-peach/30 bg-eventkan-peach text-eventkan-peach-ink';
          case EventStatus.COMPLETED:
            return 'border-eventkan-navy/10 bg-eventkan-navy/8 text-eventkan-navy';
          default:
            return '';
        }
      };
      return (
        <Badge
          variant="outline"
          className={`font-medium capitalize px-2 py-0.5 ${getStatusClass(status)}`}
        >
          {status}
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
        <span className="text-sm text-eventkan-muted">
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
          className="relative h-10 w-16 min-w-16 rounded-md overflow-hidden border bg-muted flex items-center justify-center cursor-zoom-in hover:ring-2 hover:ring-primary/20 transition-all group"
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
            <span className="truncate text-sm font-medium leading-snug text-eventkan-ink">{event.title}</span>
            {event.deletedAt && (
              <Badge
                variant="outline"
                className="shrink-0 border-eventkan-peach/30 bg-eventkan-peach text-[10px] text-eventkan-peach-ink"
              >
                Terhapus
              </Badge>
            )}
          </div>
          <span className="truncate font-mono text-xs text-eventkan-muted">/{event.slug}</span>
        </div>
      </div>
    </>
  );
};

export default Columns;
