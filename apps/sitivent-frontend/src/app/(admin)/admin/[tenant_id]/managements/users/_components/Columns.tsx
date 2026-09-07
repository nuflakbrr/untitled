'use client';

import 'moment-timezone';
import 'moment/locale/id';

import type { ColumnDef } from '@tanstack/react-table';
import type { User } from '@/interfaces/features/users';

import moment from 'moment';
import { ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import CellAction from './CellAction';

const Columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Pengguna
        <ChevronsUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image || ''} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'role',
    header: 'Jabatan',
    cell: ({ row }) => {
      const user = row.original;
      const role = user.roles?.[0];

      const getRoleColor = (name: string) => {
        const normalizedName = name.toLowerCase();
        if (normalizedName.includes('panitia'))
          return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
        if (normalizedName === 'superadmin' || normalizedName === 'root_superadmin')
          return 'bg-rose-500/10 text-rose-600 border-rose-200 dark:border-rose-500/30';
        if (normalizedName.includes('admin'))
          return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30';
        if (normalizedName === 'user')
          return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30';
        return 'bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-500/30';
      };

      if (!role) return <div className="text-muted-foreground">-</div>;

      const roleLabel =
        role.name.toLowerCase() === 'root_superadmin'
          ? 'Root Superadmin'
          : role.name.replace(/_/g, ' ');

      return (
        <Badge
          variant="outline"
          className={`font-semibold capitalize px-2.5 py-0.5 ${getRoleColor(role.name)}`}
        >
          {roleLabel}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Tanggal Terdaftar',
    cell: ({ row }) =>
      moment(row.original.createdAt).tz('Asia/Jakarta').locale('id').format('DD MMMM YYYY, HH:mm'),
  },
  {
    id: 'action',
    header: 'Aksi',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export default Columns;
