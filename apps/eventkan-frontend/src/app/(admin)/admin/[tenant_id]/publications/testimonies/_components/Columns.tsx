'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';
import { Star } from 'lucide-react';

import type { Testimonial } from '@/interfaces/features/testimonials';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: 'user.name',
    header: ({ column }) => <SortableTableHeader column={column} label="Peserta" />,
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex flex-col">
          <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{user?.name || '-'}</span>
          <span className="text-sm leading-relaxed text-eventkan-muted">{user?.email || '-'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'event.title',
    header: ({ column }) => <SortableTableHeader column={column} label="Event" />,
    cell: ({ row }) => {
      const event = row.original.event;
      return <span className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">{event?.title || '-'}</span>;
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => <SortableTableHeader column={column} label="Rating" />,
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <Badge
          variant="outline"
          className="gap-1 rounded-full border-0 bg-eventkan-yellow px-2.5 py-1 text-[10px] font-medium text-eventkan-ink"
        >
          <Star className="h-3.5 w-3.5 fill-eventkan-accent text-eventkan-accent" />
          {rating} / 5
        </Badge>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: 'Ulasan',
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-md text-sm leading-relaxed text-eventkan-muted">{row.original.comment}</span>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Tanggal" />,
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
