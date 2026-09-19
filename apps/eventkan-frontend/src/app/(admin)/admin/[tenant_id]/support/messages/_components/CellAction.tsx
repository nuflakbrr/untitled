'use client';

import { toast } from 'sonner';
import { type FC } from 'react';
import { Eye, Copy, MessageCircle, MoreHorizontal } from 'lucide-react';

import type { CellActionProps } from '@/interfaces/table';
import type { SupportMessage } from '@/interfaces/features/support';

import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/lib/clipboard';
import Modal from '@/components/Common/Modals/Modal';
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

const CellAction: FC<CellActionProps<SupportMessage>> = ({ data }) => {
  const { openDetail, setOpenDetail, getWhatsAppLink } = useCellAction();

  return (
    <>
      {/* Detail Modal */}
      <Modal
        isOpen={openDetail}
        onClose={() => setOpenDetail(false)}
        title="Detail Pengaduan"
        description="Informasi lengkap mengenai laporan pengaduan bantuan pelanggan."
        className="sm:max-w-xl"
      >
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-eventkan-ink/10 bg-eventkan-canvas/55 p-4 text-xs">
            <div>
                <span className="block text-[10px] font-semibold uppercase text-eventkan-muted">
                Pengirim
              </span>
              <span className="font-medium">{data.name}</span>
            </div>
            <div>
                <span className="block text-[10px] font-semibold uppercase text-eventkan-muted">
                Kategori
              </span>
              <span className="font-medium">{data.category}</span>
            </div>
            <div>
                <span className="block text-[10px] font-semibold uppercase text-eventkan-muted">
                Email
              </span>
              <span className="font-medium">{data.email}</span>
            </div>
            <div>
                <span className="block text-[10px] font-semibold uppercase text-eventkan-muted">
                Telepon
              </span>
              <span className="font-medium">{data.phone}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase text-eventkan-muted">
              Subjek
            </span>
            <p className="text-sm font-semibold">{data.title}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase text-eventkan-muted">
              Kronologi Kejadian
            </span>
            <div className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-xl border border-eventkan-ink/10 bg-eventkan-canvas/55 p-4 text-sm leading-relaxed text-eventkan-ink">
              {data.chronology}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setOpenDetail(false)} className="cursor-pointer">
              Tutup
            </Button>
            <Button asChild className="cursor-pointer bg-eventkan-navy text-white hover:bg-eventkan-navy-hover">
              <a
                href={getWhatsAppLink(data.phone, data.name, data.title)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" /> Hubungi WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </Modal>

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
          <DropdownMenuItem onClick={() => setOpenDetail(true)} className={cellActionItemClass}>
            <Eye className="mr-2 h-4 w-4" /> Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={cellActionItemClass}>
            <a
              href={getWhatsAppLink(data.phone, data.name, data.title)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-4 w-4 text-emerald-500" /> WhatsApp
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
