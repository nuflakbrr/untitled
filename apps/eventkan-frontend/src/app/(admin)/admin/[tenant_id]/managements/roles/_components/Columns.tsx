'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { Role } from '@/interfaces/features/roles';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';

import CellAction from './CellAction';

const Columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} label="Nama Jabatan" />,
    cell: ({ row }) => <div className="text-sm font-medium text-eventkan-ink">{row.getValue('name')}</div>,
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
            return 'bg-eventkan-navy/8 text-eventkan-navy border-eventkan-navy/10';
          case 'create':
            return 'bg-eventkan-green text-eventkan-green-ink border-eventkan-green/30';
          case 'update':
            return 'bg-eventkan-yellow text-eventkan-ink border-eventkan-yellow/30';
          case 'delete':
            return 'bg-eventkan-peach text-eventkan-peach-ink border-eventkan-peach/30';
          case 'access':
            return 'bg-eventkan-accent/10 text-eventkan-accent border-eventkan-accent/20';
          default:
            return 'bg-eventkan-canvas text-eventkan-muted border-eventkan-ink/10';
        }
      };

      if (permissions.length === 0) return <div className="text-sm text-eventkan-muted">-</div>;

      return (
        <div className="flex flex-wrap gap-1 max-w-100">
          {displayPermissions.map((permission) => (
            <Badge
              key={permission.id}
              variant="outline"
              className={`text-[10px] px-1.5 py-0 font-medium ${getPermissionColor(permission.name)}`}
            >
              {permission.name.split('.')[1] || permission.name}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-secondary/30">
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
      <div className="max-w-75 truncate text-sm text-eventkan-muted">{row.getValue('description') || '-'}</div>
    ),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Terakhir Diperbarui" />,
    cell: ({ row }) => {
      const date = row.original;
      return <span className="text-sm text-eventkan-muted">{moment(date.updatedAt || new Date())
        .tz('Asia/Jakarta')
        .locale('id')
        .format('DD MMMM YYYY, HH:mm')}</span>;
    },
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
