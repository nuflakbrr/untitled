'use client';

import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { Link2, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';

import type { ConfirmOnlineButtonProps } from '@/interfaces/features/dashboard';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { submitAttendanceProof } from '@/services/admin/attendance';
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

export default function ConfirmOnlineButton({
  registrationId,
  disabled,
  proofStatus = '',
}: ConfirmOnlineButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const isPendingReview = proofStatus === 'PENDING';
  const isApproved = proofStatus === 'APPROVED' || disabled;

  const handleSubmit = () => {
    if (!proofUrl.trim()) {
      toast.error('Masukkan URL bukti kehadiran terlebih dahulu.');
      return;
    }

    startTransition(async () => {
      const result = await submitAttendanceProof(registrationId, proofUrl.trim());
      if (!result.success) {
        toast.error(result.error ?? 'Gagal mengirim bukti kehadiran.');
        return;
      }
      toast.success(result.message);
      setProofUrl('');
      setIsOpen(false);
    });
  };

  return (
    <>
      <Button
        type="button"
        disabled={isApproved || isPendingReview}
        onClick={() => setIsOpen(true)}
        className="w-full cursor-pointer bg-eventkan-green-ink text-white hover:bg-eventkan-green-ink/90 disabled:cursor-not-allowed disabled:bg-eventkan-canvas disabled:text-eventkan-muted"
      >
        {isApproved ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Hadir Terkonfirmasi
          </>
        ) : isPendingReview ? (
          'Bukti sedang ditinjau'
        ) : (
          <>
            <Link2 className="mr-2 h-4 w-4" /> Kirim Bukti Kehadiran
          </>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Kirim bukti kehadiran online</DialogTitle>
            <DialogDescription>
              Tempel URL screenshot atau bukti kehadiran yang bisa dibuka oleh panitia.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Input
              type="url"
              value={proofUrl}
              onChange={(event) => setProofUrl(event.target.value)}
              placeholder="https://..."
              disabled={isPending}
            />
            <p className="text-xs leading-relaxed text-eventkan-muted">
              Pastikan tautan dapat diakses publik atau oleh panitia.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isPending} className="cursor-pointer">
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="mr-2 h-4 w-4" />
              )}
              {isPending ? 'Mengirim...' : 'Kirim Bukti'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
