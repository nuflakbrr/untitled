'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';

import moment from 'moment';

import type { User } from '@/interfaces/features/users';

import { Badge } from '@/components/ui/badge';
import SortableTableHeader from '@/components/Common/SortableTableHeader';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import CellAction from './CellAction';

const Columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableTableHeader column={column} label="Pengguna" />,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-eventkan-ink">{user.name}</span>
            <span className="text-xs text-eventkan-muted">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.roles?.[0]?.name ?? '',
    id: 'role',
    header: ({ column }) => <SortableTableHeader column={column} label="Jabatan" />,
    cell: ({ row }) => {
      const user = row.original;
      const role = user.roles?.[0];

      const getRoleColor = (name: string) => {
        const normalizedName = name.toLowerCase();
        if (normalizedName.includes('panitia'))
          return 'bg-eventkan-green text-eventkan-green-ink border-eventkan-green/30';
        if (normalizedName === 'superadmin' || normalizedName === 'root_superadmin')
          return 'bg-eventkan-peach text-eventkan-peach-ink border-eventkan-peach/30';
        if (normalizedName.includes('admin'))
          return 'bg-eventkan-navy/8 text-eventkan-navy border-eventkan-navy/10';
        if (normalizedName === 'user')
          return 'bg-eventkan-green text-eventkan-green-ink border-eventkan-green/30';
        return 'bg-eventkan-canvas text-eventkan-muted border-eventkan-ink/10';
      };

      if (!role) return <div className="text-eventkan-muted">-</div>;

      const roleLabel =
        role.name.toLowerCase() === 'root_superadmin'
          ? 'Root Superadmin'
          : role.name.replace(/_/g, ' ');

      return (
        <Badge
          variant="outline"
          className={`font-medium capitalize px-2.5 py-0.5 ${getRoleColor(role.name)}`}
        >
          {roleLabel}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortableTableHeader column={column} label="Tanggal Terdaftar" />,
    cell: ({ row }) =>
      <span className="text-sm text-eventkan-muted">
        {moment(row.original.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMMM YYYY, HH:mm')}
      </span>,
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
