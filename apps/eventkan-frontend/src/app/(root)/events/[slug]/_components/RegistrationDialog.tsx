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
    <DialogContent className="max-w-sm rounded-[26px] border border-eventkan-ink/10 bg-eventkan-surface sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="font-display text-xl font-extrabold text-eventkan-navy">
          Konfirmasi Pendaftaran
        </DialogTitle>
        <DialogDescription className="text-sm leading-relaxed text-eventkan-muted">
          Apakah kamu yakin ingin mendaftar pada event ini?
          {price > 0 ? (
            <span className="mt-3 block rounded-[14px] bg-eventkan-peach px-3 py-2 text-xs text-[#8d492e]">
              Event ini berbayar sebesar{' '}
              <strong className="font-bold text-eventkan-peach-ink">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(price)}
              </strong>
              . Setelah mendaftar, lanjutkan pembayaran melalui payment gateway EVENTKAN.
            </span>
          ) : (
            <span className="mt-3 block rounded-[14px] bg-eventkan-green-soft px-3 py-2 text-xs text-eventkan-green-ink">
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
          className="cursor-pointer rounded-full border-eventkan-ink/15 px-5 text-sm font-bold text-eventkan-muted hover:bg-eventkan-canvas hover:text-eventkan-navy"
        >
          Batal
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className="cursor-pointer rounded-full bg-eventkan-navy px-5 text-sm font-bold text-white hover:bg-eventkan-navy-hover"
        >
          {isPending ? 'Mendaftar...' : 'Ya, Daftar'}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default RegistrationDialog;
