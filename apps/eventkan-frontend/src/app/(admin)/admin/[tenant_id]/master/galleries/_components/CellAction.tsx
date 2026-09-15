'use client';

import type { FC } from 'react';
import type { Route } from 'next';
import type { Gallery } from '@/interfaces/features/galleries';

import { toast } from 'sonner';
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
  data: Gallery;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const tenantId = usePathname().split('/')[2];
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Buka menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              copyToClipboard(data.id);
              toast.success('ID disalin ke clipboard.');
            }}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>

          {!data.deletedAt && canManageGallery && hasPermission('galleries.update') && (
            <DropdownMenuItem
              variant="warning"
              className="cursor-pointer"
              onClick={() => router.push(`/admin/${tenantId}/master/galleries/${data.id}` as Route)}
            >
              <Edit className="mr-2 h-4 w-4" /> Ubah
            </DropdownMenuItem>
          )}

          {data.deletedAt && canManageGallery && hasPermission('galleries.delete') && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => onRestore()}>
              <RotateCcw className="mr-2 h-4 w-4" /> Pulihkan
            </DropdownMenuItem>
          )}
          {!data.deletedAt && canManageGallery && hasPermission('galleries.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => setOpenDelete(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          )}
          {data.deletedAt && canManageGallery && hasPermission('galleries.delete') && (
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
