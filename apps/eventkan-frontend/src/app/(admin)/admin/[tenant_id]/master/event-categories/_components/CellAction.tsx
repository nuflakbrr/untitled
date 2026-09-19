'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import { useRouter } from 'next/navigation';
import { Copy, Edit, Trash, RotateCcw, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { EventCategory } from '@/interfaces/features/events';

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

const CellAction: FC<CellActionProps<EventCategory>> = ({ data }) => {
  const router = useRouter();
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const {
    openDelete,
    setOpenDelete,
    onDelete,
    isDeletePending,
    onRestore,
    isRestorePending,
    onPermanentDelete,
    isPermanentDeletePending,
  } = useCellAction(data);

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
        title={data.deletedAt ? 'Hapus Kategori Permanen' : undefined}
        desc={
          data.deletedAt ? 'Kategori akan dihapus permanen dan tidak dapat dipulihkan.' : undefined
        }
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
            onClick={() => copyToClipboard(data.id)}
            className={cellActionItemClass}
          >
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>

          {!data.deletedAt && hasPermission('event.categories.update') && (
            <DropdownMenuItem
              variant="accent"
              className={cellActionItemClass}
              onClick={() =>
                router.push(`/admin/${tenantId}/master/event-categories/${data.id}` as Route)
              }
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}

          {!data.deletedAt && hasPermission('event.categories.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className={cellActionDangerClass}
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
          {data.deletedAt && hasPermission('event.categories.delete') && (
            <>
              <DropdownMenuItem
                className={cellActionSuccessClass}
                onClick={() => onRestore()}
                disabled={isRestorePending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Pulihkan Kategori
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className={cellActionDangerClass}
                onClick={() => onPermanentDelete()}
                disabled={isPermanentDeletePending}
              >
                <Trash className="mr-2 h-4 w-4" />
                Hapus Permanen
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
