'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { Role } from '@/interfaces/features/roles';

import { Badge } from '@/components/ui/badge';
import { formatPermissionLabel } from '@/lib/formatAdminBadgeLabel';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} label="Nama Jabatan" />,
    cell: ({ row }) => (
      <div className="font-display text-sm font-semibold tracking-[-.02em] text-eventkan-ink">
        {row.getValue('name')}
      </div>
    ),
  },
  {
    accessorKey: 'permissions',
    header: 'Hak Akses',
    cell: ({ row }) => {
      const permissions = row.original.permissions || [];
      const displayPermissions = permissions.slice(0, 5);
      const remainingCount = permissions.length - 5;

      const getPermissionColor = (name: string) => {
        const method = name.split('.')[1] || name;
        switch (method) {
          case 'read':
            return 'bg-eventkan-navy/8 text-eventkan-navy';
          case 'create':
            return 'bg-eventkan-green text-eventkan-green-ink';
          case 'update':
            return 'bg-eventkan-yellow text-eventkan-ink';
          case 'delete':
            return 'bg-eventkan-peach text-eventkan-peach-ink';
          case 'access':
            return 'bg-eventkan-accent/10 text-eventkan-accent';
          default:
        return 'bg-eventkan-canvas text-eventkan-muted';
        }
      };

      if (permissions.length === 0) {
        return <div className="text-sm leading-relaxed text-eventkan-muted">-</div>;
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-100">
          {displayPermissions.map((permission) => (
            <Badge
              key={permission.id}
              variant="outline"
              className={`rounded-full border-0 px-2.5 py-1 text-[10px] font-medium ${getPermissionColor(permission.name)}`}
            >
              {formatPermissionLabel(permission.name)}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline" className="rounded-full border-0 bg-eventkan-canvas px-2.5 py-1 text-[10px] font-medium text-eventkan-muted">
              +{remainingCount} lainnya
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Deskripsi',
    cell: ({ row }) => (
      <div className="line-clamp-2 max-w-md text-sm leading-relaxed text-eventkan-muted">
        {row.getValue('description') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Terakhir Diperbarui" />,
    cell: ({ row }) => {
      const date = row.original;
      return (
        <span className="text-sm leading-relaxed text-eventkan-muted">
          {moment(date.updatedAt || new Date())
            .tz('Asia/Jakarta')
            .locale('id')
            .format('DD MMMM YYYY, HH:mm')}
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

export default Columns;
