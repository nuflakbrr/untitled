'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Copy, Edit, Trash, RotateCcw, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { Gallery } from '@/interfaces/features/galleries';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { useTenantId } from '@/hooks/useTenantId';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
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
  cellActionSuccessClass,
  cellActionTriggerClass,
} from '@/components/Common/CellActionMenu';

import { useCellAction } from '../_hooks/useCellAction';

const CellAction: FC<CellActionProps<Gallery>> = ({ data }) => {
  const router = useRouter();
  const tenantId = useTenantId();
  const isOwnedByActiveTenant = !data.tenantId || data.tenantId === tenantId;
  const { hasPermission, hasRole } = usePermission();
  const isSuperAdmin = hasRole('superadmin') || hasRole('root_superadmin');
  const canManageGallery = isSuperAdmin || isOwnedByActiveTenant;
  const {
    openDelete,
    setOpenDelete,
    onDelete,
    isDeletePending,
    onRestore,
    onPermanentDelete,
    isPermanentDeletePending,
  } = useCellAction(data);

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={data.deletedAt ? onPermanentDelete : onDelete}
        loading={data.deletedAt ? isPermanentDeletePending : isDeletePending}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className={cellActionTriggerClass}>
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className={cellActionContentClass}>
          <DropdownMenuLabel className={cellActionLabelClass}>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              copyToClipboard(data.id);
              toast.success('ID disalin ke clipboard.');
            }}
            className={cellActionItemClass}
          >
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>

          {!data.deletedAt && canManageGallery && hasPermission('galleries.update') && (
            <DropdownMenuItem
              variant="accent"
              className={cellActionItemClass}
              onClick={() => router.push(`/admin/${tenantId}/master/galleries/${data.id}` as Route)}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}

          {data.deletedAt && canManageGallery && hasPermission('galleries.delete') && (
            <DropdownMenuItem className={cellActionSuccessClass} onClick={() => onRestore()}>
              <RotateCcw className="mr-2 h-4 w-4" /> Pulihkan
            </DropdownMenuItem>
          )}
          {!data.deletedAt && canManageGallery && hasPermission('galleries.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className={cellActionDangerClass}
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
          {data.deletedAt && canManageGallery && hasPermission('galleries.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className={cellActionDangerClass}
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus Permanen
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
