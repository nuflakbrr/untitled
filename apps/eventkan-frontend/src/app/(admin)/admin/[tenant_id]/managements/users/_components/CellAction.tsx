'use client';

import { type FC } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Ban, Copy, Edit, Trash, UserCheck, MoreHorizontal } from 'lucide-react';

import type { User } from '@/interfaces/features/users';
import type { CellActionProps } from '@/interfaces/table';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { useTenantId } from '@/hooks/useTenantId';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import UserSettingsModal from '@/components/Mixins/Sidebar/UserSettingsModal';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  cellActionItemClass,
  cellActionLabelClass,
  cellActionDangerClass,
  cellActionContentClass,
  cellActionTriggerClass,
} from '@/components/Common/CellActionMenu';

import { useCellAction } from '../_hooks/useCellAction';

const CellAction: FC<CellActionProps<User>> = ({ data }) => {
  const router = useRouter();
  const tenantId = useTenantId();
  const pathname = usePathname();
  const { hasPermission } = usePermission();
  const {
    isSelf,
    canDelete,
    canEdit,
    open,
    setOpen,
    openBan,
    setOpenBan,
    isSettingsOpen,
    setIsSettingsOpen,
    onDelete,
    isDeletePending,
    onBan,
    isBanPending,
  } = useCellAction(data);

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
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
          <Button variant="ghost" className={cellActionTriggerClass}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={cellActionContentClass}>
          <DropdownMenuLabel className={cellActionLabelClass}>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className={cellActionItemClass}>
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          {hasPermission('user.update') && canEdit && (
            <DropdownMenuItem
              variant="accent"
              className={cellActionItemClass}
              onClick={() => {
                if (isSelf) {
                  setIsSettingsOpen(true);
                } else {
                  router.push(`/admin/${tenantId}/managements/${pathname.includes('/managements/participants') ? 'participants' : 'users'}/${data.id}`);
                }
              }}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}
          {hasPermission('user.update') && canDelete && (
            <DropdownMenuItem className={cellActionItemClass} onClick={() => setOpenBan(true)}>
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
              className={cellActionDangerClass}
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
