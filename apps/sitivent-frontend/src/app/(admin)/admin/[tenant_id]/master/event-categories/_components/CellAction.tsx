'use client';

import type { FC } from 'react';
import type { Route } from 'next';
import type { EventCategory } from '@/interfaces/features/event-categories';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { useRouter, usePathname } from 'next/navigation';
import { usePermission } from '@/providers/PermissionProvider';
import AlertModal from '@/components/Common/Modals/AlertModal';
import { Copy, Edit, Trash, RotateCcw, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useCellAction } from './useCellAction';

interface CellActionProps {
  data: EventCategory;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const tenantId = usePathname().split('/')[2];
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

          {!data.deletedAt && hasPermission('event.categories.update') && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
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
              className="cursor-pointer"
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
          {data.deletedAt && hasPermission('event.categories.delete') && (
            <>
              <DropdownMenuItem
                className="cursor-pointer text-emerald-600 focus:text-emerald-700"
                onClick={() => onRestore()}
                disabled={isRestorePending}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Pulihkan Kategori
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
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
