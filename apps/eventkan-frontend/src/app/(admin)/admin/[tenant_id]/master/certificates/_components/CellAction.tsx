'use client';

import type { FC } from 'react';

import { Copy, Trash, ExternalLink, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { CertificateResponse } from '@/interfaces/features/certificates';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
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

const CellAction: FC<CellActionProps<CertificateResponse>> = ({ data }) => {
  const { hasPermission } = usePermission();
  const { openDelete, setOpenDelete, onDelete, isDeletePending } = useCellAction(data.id);

  return (
    <>
      <AlertModal
        isOpen={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
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
          <DropdownMenuItem asChild className={cellActionItemClass}>
            <a href={`/certificates/${data.id}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" /> Buka di tab baru
            </a>
          </DropdownMenuItem>
          {hasPermission('certificates.delete') && (
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
