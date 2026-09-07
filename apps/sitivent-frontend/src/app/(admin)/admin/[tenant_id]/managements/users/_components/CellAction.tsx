'use client';

import type { User } from '@/interfaces/features/users';

import { toast } from 'sonner';
import { type FC, useState } from 'react';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { getMeAction } from '@/services/public/auth';
import { useRouter, usePathname } from 'next/navigation';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { banUser, unbanUser, deleteUser } from '@/services/admin/users';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserSettingsModal from '@/components/Mixins/Sidebar/UserSettingsModal';
import { Ban, Copy, Edit, Trash, UserCheck, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CellActionProps {
  data: User;
}

interface ExtendedUser {
  id: string;
  roleId?: string | null;
  role?: string | null;
  roles?: { id: string; name: string }[];
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const tenantId = usePathname().split('/')[2];
  const queryClient = useQueryClient();
  const { hasPermission, hasRole } = usePermission();
  const { data: meData } = useQuery({
    queryKey: ['auth-me-server-action'],
    queryFn: () => getMeAction(),
  });
  const session = meData?.session;
  const [open, setOpen] = useState(false);
  const [openBan, setOpenBan] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentUser = session?.user as ExtendedUser | undefined;
  const isSelf = currentUser?.id === data.id;
  const isTargetSuperAdmin = data.roles?.some((role) => role.name.toLowerCase() === 'superadmin');
  const isCurrentUserSuperAdmin = hasRole('superadmin');

  const canDelete = !isSelf && (isCurrentUserSuperAdmin || !isTargetSuperAdmin);
  const canEdit = isSelf || isCurrentUserSuperAdmin || !isTargetSuperAdmin;

  const { mutate: onDelete, isPending } = useMutation({
    mutationFn: () => deleteUser(data.id),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    },
    onError: () => {
      toast.error('Gagal menghapus pengguna.');
    },
  });
  const { mutate: onBan, isPending: isBanPending } = useMutation({
    mutationFn: () => (data.banned ? unbanUser(data.id) : banUser(data.id)),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ['users'] });
        setOpenBan(false);
      } else toast.error(result.error);
    },
    onError: () => toast.error(data.banned ? 'Gagal melakukan unban user.' : 'Gagal memban user.'),
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <AlertModal
        isOpen={openBan}
        onClose={() => setOpenBan(false)}
        onConfirm={onBan}
        loading={isBanPending}
      />
      <UserSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={{
          name: data.name || '',
          email: data.email,
          avatar: data.image || '',
        }}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          {hasPermission('user.update') && canEdit && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
              onClick={() => {
                if (isSelf) {
                  setIsSettingsOpen(true);
                } else {
                  router.push(`/admin/${tenantId}/managements/users/${data.id}`);
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}
          {hasPermission('user.update') && canDelete && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => setOpenBan(true)}>
              {data.banned ? (
                <UserCheck className="mr-2 h-4 w-4" />
              ) : (
                <Ban className="mr-2 h-4 w-4" />
              )}
              {data.banned ? 'Unban' : 'Ban'}
            </DropdownMenuItem>
          )}
          {hasPermission('user.delete') && canDelete && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
