'use client';

import { type FC } from 'react';
import { Copy, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { Payment } from '@/interfaces/features/payments';

import { Button } from '@/components/ui/button';
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
  cellActionContentClass,
  cellActionTriggerClass,
} from '@/components/Common/CellActionMenu';

import { useCellAction } from '../_hooks/useCellAction';

const CellAction: FC<CellActionProps<Payment>> = ({ data }) => {
  const { onCopyId, onCopyRegistrationNumber } = useCellAction(data);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cellActionTriggerClass}>
          <span className="sr-only">Buka menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cellActionContentClass}>
        <DropdownMenuLabel className={cellActionLabelClass}>Aksi</DropdownMenuLabel>
        <DropdownMenuItem onClick={onCopyId} className={cellActionItemClass}>
          <Copy className="mr-2 h-4 w-4" /> Salin ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCopyRegistrationNumber} className={cellActionItemClass}>
          <Copy className="mr-2 h-4 w-4" /> Salin No. Registrasi
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;
