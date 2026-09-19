'use client';

import { type FC } from 'react';
import { Ban, Copy, Trash, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { Registration } from '@/interfaces/features/registrations';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import { RegistrationStatus } from '@/interfaces/enums';
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
  cellActionTriggerClass,
} from '@/components/Common/CellActionMenu';

import { useCellAction } from '../_hooks/useCellAction';

const CellAction: FC<CellActionProps<Registration>> = ({ data }) => {
  const { hasPermission } = usePermission();
  const { openCancel, setOpenCancel, openDelete, setOpenDelete, isPending, onCancel, onDelete } =
    useCellAction(data.id);

  return (
    <>
      <AlertModal
        isOpen={openCancel}
        onClose={() => setOpenCancel(false)}
        onConfirm={onCancel}
        loading={isPending}
        title="Batalkan Pendaftaran"
        desc="Apakah Anda yakin ingin membatalkan pendaftaran ini?"
      />
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isPending}
        title="Hapus Pendaftaran"
        desc="Apakah Anda yakin ingin menghapus pendaftaran ini?"
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
          <DropdownMenuItem onClick={() => copyToClipboard(data.id)} className={cellActionItemClass}>
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => copyToClipboard(data.registrationNumber)}
            className={cellActionItemClass}
          >
            <Copy className="mr-2 h-4 w-4" /> Salin No. Registrasi
          </DropdownMenuItem>

          {data.status !== RegistrationStatus.CANCELLED &&
            hasPermission('registrations.update') && (
              <DropdownMenuItem
                variant="accent"
                className={cellActionItemClass}
                onClick={() => setOpenCancel(true)}
              >
                <Ban className="mr-2 h-4 w-4" /> Batalkan
              </DropdownMenuItem>
            )}

          {hasPermission('registrations.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className={cellActionDangerClass}
              onClick={() => setOpenDelete(true)}
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
