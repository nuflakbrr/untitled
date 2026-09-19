'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { User, ExtendedUser } from '@/interfaces/features/users';

import { getMeAction } from '@/services/public/auth';
import { usePermission } from '@/providers/PermissionProvider';
import { banUser, unbanUser, deleteUser, permanentlyDeleteUser } from '@/services/admin/users';

export const useCellAction = (data: User) => {
  const queryClient = useQueryClient();
  const { hasRole } = usePermission();
  const { data: meData } = useQuery({ queryKey: ['auth-me-server-action'], queryFn: getMeAction });
  const [open, setOpen] = useState(false);
  const [openBan, setOpenBan] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const currentUser = meData?.session?.user as ExtendedUser | undefined;
  const isSelf = currentUser?.id === data.id;
  const isTargetSuperAdmin = data.roles?.some((role) => role.name.toLowerCase() === 'superadmin');
  const isCurrentUserSuperAdmin = hasRole('superadmin') || hasRole('root_superadmin');
  const canDelete = !isSelf && (isCurrentUserSuperAdmin || !isTargetSuperAdmin);
  const canEdit = isSelf || isCurrentUserSuperAdmin || !isTargetSuperAdmin;
  const deleteMutation = useMutation({
    mutationFn: () => (data.deletedAt ? permanentlyDeleteUser(data.id) : deleteUser(data.id)),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpen(false);
    },
    onError: () => toast.error('Gagal menghapus pengguna.'),
  });
  const banMutation = useMutation({
    mutationFn: () => (data.banned ? unbanUser(data.id) : banUser(data.id)),
    onSuccess: (result) => {
      if (!result.success) return toast.error(result.error);
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenBan(false);
    },
    onError: () => toast.error(data.banned ? 'Gagal melakukan unban user.' : 'Gagal memban user.'),
  });
  return {
    currentUser, isSelf, canDelete, canEdit, open, setOpen, openBan, setOpenBan,
    isSettingsOpen, setIsSettingsOpen, onDelete: deleteMutation.mutate, isDeletePending: deleteMutation.isPending,
    onBan: banMutation.mutate, isBanPending: banMutation.isPending,
  };
};
