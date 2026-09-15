'use client';

import { type FC } from 'react';
import { Copy, MoreHorizontal } from 'lucide-react';

import type { Payment } from '@/interfaces/features/payments';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CellActionProps {
  data: Payment;
}

const CellAction: FC<CellActionProps> = ({ data }) => (
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
          <DropdownMenuItem
            onClick={() => copyToClipboard(data.registration.registrationNumber)}
            className="cursor-pointer"
          >
            <Copy className="mr-2 h-4 w-4" /> Salin No. Registrasi
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  );

export default CellAction;
