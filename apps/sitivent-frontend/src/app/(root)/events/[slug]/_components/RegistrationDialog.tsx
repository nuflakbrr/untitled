import type { FC } from 'react';

import type { RegisterDialogProps } from '@/interfaces/features/events';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

const RegistrationDialog: FC<RegisterDialogProps> = ({
  isOpen,
  isPending,
  onConfirm,
  onOpenChange,
  price,
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm rounded-[26px] border border-[#111927]/10 bg-[#fffdf8] sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-display text-xl font-extrabold text-[#11233f]">
          Konfirmasi Pendaftaran
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-[#6c7280]">
          Apakah kamu yakin ingin mendaftar pada event ini?
          {price > 0 ? (
            <span className="mt-3 block rounded-[14px] bg-[#ffe5d8] px-3 py-2 text-xs text-[#8d492e]">
              Event ini berbayar sebesar{' '}
              <strong className="font-bold text-[#b84a2a]">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(price)}
              </strong>
              . Setelah mendaftar, lanjutkan pembayaran melalui payment gateway SITIVENT.
            </span>
          ) : (
            <span className="mt-3 block rounded-[14px] bg-[#e5f2e8] px-3 py-2 text-xs text-[#36784b]">
              Event ini gratis. Pendaftaranmu akan langsung dikonfirmasi.
            </span>
          )}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="mt-4 flex-row justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isPending}
          className="cursor-pointer rounded-full border-[#111927]/15 px-5 text-sm font-bold text-[#6c7280] hover:bg-[#f6f3eb] hover:text-[#11233f]"
        >
          Batal
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="cursor-pointer rounded-full bg-[#11233f] px-5 text-sm font-bold text-white hover:bg-[#1b3458]"
        >
          {isPending ? 'Mendaftar...' : 'Ya, Daftar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default RegistrationDialog;
