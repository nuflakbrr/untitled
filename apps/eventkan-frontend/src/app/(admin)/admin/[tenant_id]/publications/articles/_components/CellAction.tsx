'use client';

import Link from 'next/link';
import { type FC } from 'react';
import { useRouter } from 'next/navigation';
import { Copy, Edit, Trash, RotateCcw, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { Article } from '@/interfaces/features/articles';

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
  cellActionSuccessClass,
  cellActionTriggerClass,
} from '@/components/Common/CellActionMenu';

import { useCellAction } from '../_hooks/useCellAction';

const CellAction: FC<CellActionProps<Article>> = ({ data }) => {
  const router = useRouter();
  const { hasPermission } = usePermission();
  const { open, setOpen, onDelete, isDeletePending, onRestore, isRestorePending } = useCellAction(
    data.id,
    Boolean(data.deletedAt)
  );

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeletePending}
      />

      <DropdownMenu>
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
          {!data.deletedAt && hasPermission('article.update') && (
            <DropdownMenuItem variant="accent" className={cellActionItemClass} asChild>
              <Link href={`/admin/publications/articles/${data.id}`}>
                <Edit className="mr-2 h-4 w-4" /> Ubah
              </Link>
            </DropdownMenuItem>
          )}
          {data.deletedAt && hasPermission('article.delete') && (
            <DropdownMenuItem
              className={cellActionSuccessClass}
              onClick={() => onRestore()}
              disabled={isRestorePending}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Pulihkan
            </DropdownMenuItem>
          )}
          {hasPermission('article.delete') && (
            <DropdownMenuItem
              variant="destructive"
              className={cellActionDangerClass}
              onClick={() => setOpen(true)}
            >
              <Trash className="mr-2 h-4 w-4" /> {data.deletedAt ? 'Hapus Permanen' : 'Hapus'}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
