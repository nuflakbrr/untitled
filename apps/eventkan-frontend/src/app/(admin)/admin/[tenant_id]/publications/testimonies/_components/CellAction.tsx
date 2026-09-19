'use client';

import { toast } from 'sonner';
import { type FC } from 'react';
import { Copy, Trash, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { Testimonial } from '@/interfaces/features/testimonials';

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

const CellAction: FC<CellActionProps<Testimonial>> = ({ data }) => {
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
            onClick={() => {
              copyToClipboard(data.id);
              toast.success('ID disalin ke clipboard.');
            }}
            className={cellActionItemClass}
          >
            <Copy className="mr-2 h-4 w-4" /> Salin ID
          </DropdownMenuItem>

          {hasPermission('testimonies.delete') && (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => setOpenDelete(true)}
              className={cellActionDangerClass}
            >
              <Trash className="mr-2 h-4 w-4" /> Hapus Testimoni
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
