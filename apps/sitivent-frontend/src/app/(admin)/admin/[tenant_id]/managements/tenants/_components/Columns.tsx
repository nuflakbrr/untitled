'use client';

import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';
import type { AdminTenantRow } from '@/services/admin/tenants';

import moment from 'moment';
import { ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import CellAction from './CellAction';

const Columns: ColumnDef<AdminTenantRow>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Tenant <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.code}</p>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => (
      <Badge className={tenantTypeClass(row.original.type)}>{row.original.type}</Badge>
    ),
  },
  { accessorKey: 'parentName', header: 'Tenant Induk' },
  {
    accessorKey: 'createdAt',
    header: 'Dibuat',
    cell: ({ row }) =>
      row.original.createdAt
        ? moment(row.original.createdAt).locale('id').format('DD MMM YYYY')
        : '-',
  },
  { id: 'action', header: 'Aksi', cell: ({ row }) => <CellAction data={row.original} /> },
];

function tenantTypeClass(type: string) {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes('root') || normalizedType.includes('university')) {
    return 'border-red-200 bg-red-50 text-red-700 hover:bg-red-50';
  }

  if (normalizedType.includes('faculty') || normalizedType.includes('fakultas')) {
    return 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50';
  }

  return 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-50';
}

export default Columns;
