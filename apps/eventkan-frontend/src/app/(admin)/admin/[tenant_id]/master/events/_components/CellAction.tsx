'use client';

import type { FC } from 'react';

import { useRouter } from 'next/navigation';
import { Copy, Edit, Trash, Globe, RotateCcw, MoreHorizontal } from 'lucide-react';

import type { Event } from '@/interfaces/features/events';
import type { CellActionProps } from '@/interfaces/table';

import { Button } from '@/components/ui/button';
import { EventStatus } from '@/interfaces/enums';
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

const CellAction: FC<CellActionProps<Event>> = ({ data }) => {
  const router = useRouter();
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const {
    openDelete,
    setOpenDelete,
    openPublish,
    setOpenPublish,
    onDelete,
    isDeletePending,
    onPublish,
    isPublishPending,
    onRestore,
    isRestorePending,
  } = useCellAction(data.id, Boolean(data.deletedAt));

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
        title={data.deletedAt ? 'Hapus Event Permanen' : undefined}
        desc={
          data.deletedAt
            ? 'Event yang sudah dihapus akan dihapus permanen dan tidak dapat dipulihkan.'
            : undefined
        }
      />
      <AlertModal
        isOpen={openPublish}
        onClose={() => setOpenPublish(false)}
        onConfirm={onPublish}
        loading={isPublishPending}
        title="Publikasikan Event"
        desc="Apakah Anda yakin ingin mempublikasikan event ini? Event yang dipublikasikan akan tampil ke publik."
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
          <DropdownMenuItem
            onClick={() => copyToClipboard(data.slug)}
            className={cellActionItemClass}
          >
            <Copy className="mr-2 h-4 w-4" /> Salin Slug
          </DropdownMenuItem>

          {!data.deletedAt &&
            data.status === EventStatus.DRAFT &&
            hasPermission('events.publish') && (
              <DropdownMenuItem
                className={cellActionItemClass}
                onClick={() => setOpenPublish(true)}
              >
                <Globe className="mr-2 h-4 w-4" /> Publikasikan
              </DropdownMenuItem>
            )}

          {!data.deletedAt && hasPermission('events.update') && (
            <DropdownMenuItem
              variant="accent"
              className={cellActionItemClass}
              onClick={() => router.push(`/admin/${tenantId}/master/events/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}

          {data.deletedAt && hasPermission('events.delete') && (
            <DropdownMenuItem
              className={cellActionSuccessClass}
              onClick={() => onRestore()}
              disabled={isRestorePending}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Pulihkan Event
            </DropdownMenuItem>
          )}

          {!data.deletedAt && hasPermission('events.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className={cellActionDangerClass}
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus Event
            </DropdownMenuItem>
          )}
          {data.deletedAt && hasPermission('events.delete') && (
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
