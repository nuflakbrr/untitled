'use client';

import 'moment/locale/id';
import 'moment-timezone';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';
import { ChevronDown, ChevronRight } from 'lucide-react';

import type { AdminTenantRow } from '@/interfaces/features/tenants';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns = (): ColumnDef<AdminTenantRow>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} label="Nama Tenant" />,
    cell: ({ row }) => (
      <div
        className="flex items-center gap-1"
        style={{ paddingLeft: `${(row.original.depth ?? 0) * 24}px` }}
      >
        {row.original.hasChildren ? (
          <button type="button" onClick={row.original.onToggle} className="cursor-pointer rounded p-1 hover:bg-eventkan-canvas" aria-label="Toggle tenant children">
            {row.original.isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : <span className="w-6" />}
        <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-eventkan-muted">{row.original.code}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => <SortableTableHeader column={column} label="Tipe" />,
    cell: ({ row }) => (
      <Badge className={tenantTypeClass(row.original.type)}>{row.original.type}</Badge>
    ),
  },
  {
    accessorKey: 'parentName',
    header: ({ column }) => <SortableTableHeader column={column} label="Tenant Induk" />,
    cell: ({ row }) => <span className="text-sm text-eventkan-muted">{row.original.parentName || '-'}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Dibuat" />,
    cell: ({ row }) =>
      row.original.createdAt
        ? moment(row.original.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMM YYYY')
        : <span className="text-sm text-eventkan-muted">-</span>,
  },
  { id: 'action', header: 'Aksi', cell: ({ row }) => <CellAction data={row.original} /> },
];

function tenantTypeClass(type: string) {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes('root') || normalizedType.includes('university')) {
    return 'border-eventkan-peach/30 bg-eventkan-peach text-eventkan-peach-ink hover:bg-eventkan-peach';
  }

  if (normalizedType.includes('faculty') || normalizedType.includes('fakultas')) {
    return 'border-eventkan-navy/10 bg-eventkan-navy/8 text-eventkan-navy hover:bg-eventkan-navy/8';
  }

  return 'border-eventkan-ink/10 bg-eventkan-canvas text-eventkan-muted hover:bg-eventkan-canvas';
}

export default Columns;
