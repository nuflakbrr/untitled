'use client';

import type { FC } from 'react';
import type { Event } from '@/interfaces/features/events';

import { Button } from '@/components/ui/button';
import { EventStatus } from '@/interfaces/enums';
import { copyToClipboard } from '@/lib/clipboard';
import { useRouter, usePathname } from 'next/navigation';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { Copy, Edit, Trash, Globe, RotateCcw, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCellAction } from './useCellAction';

interface CellActionProps {
  data: Event;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const tenantId = usePathname().split('/')[2];
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => copyToClipboard(data.slug)} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Salin Slug
          </DropdownMenuItem>

          {!data.deletedAt &&
            data.status === EventStatus.DRAFT &&
            hasPermission('events.publish') && (
              <DropdownMenuItem
                className="cursor-pointer text-indigo-600 focus:text-indigo-600 focus:bg-indigo-50 dark:focus:bg-indigo-950/20"
                onClick={() => setOpenPublish(true)}
              >
                <Globe className="mr-2 h-4 w-4" /> Publikasikan
              </DropdownMenuItem>
            )}

          {!data.deletedAt && hasPermission('events.update') && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
              onClick={() => router.push(`/admin/${tenantId}/master/events/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}

          {data.deletedAt && hasPermission('events.delete') && (
            <DropdownMenuItem
              className="cursor-pointer text-emerald-600 focus:text-emerald-700"
              onClick={() => onRestore()}
              disabled={isRestorePending}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Pulihkan Event
            </DropdownMenuItem>
          )}

          {!data.deletedAt && hasPermission('events.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus Event
            </DropdownMenuItem>
          )}
          {data.deletedAt && hasPermission('events.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
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
