'use client';

import { toast } from 'sonner';
import { useTransition } from 'react';
import { X, Check, ExternalLink } from 'lucide-react';

import type { Registration } from '@/interfaces/features/registrations';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePermission } from '@/providers/PermissionProvider';
import { formatAttendanceProofStatusLabel } from '@/lib/formatAdminBadgeLabel';
import { reviewAttendanceProof, type AttendanceProofStatus } from '@/services/admin/attendance';

type Props = { data: Registration };

export default function AttendanceProofCell({ data }: Props) {
  const { hasPermission } = usePermission();
  const [isPending, startTransition] = useTransition();
  const status = data.attendanceProofStatus ?? '';

  const handleReview = (nextStatus: AttendanceProofStatus) => {
    startTransition(async () => {
      const result = await reviewAttendanceProof(data.id, nextStatus);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(result.message);
    });
  };

  if (!status) return <span className="text-sm leading-relaxed text-eventkan-muted">-</span>;

  if (status === 'PENDING' && data.attendanceProofUrl && hasPermission('attendance.scan')) {
    return (
      <div className="flex min-w-40 flex-wrap items-center gap-1.5">
        <Button asChild variant="outline" size="sm" className="h-7 cursor-pointer rounded-lg px-2 text-xs">
          <a href={data.attendanceProofUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-1 h-3 w-3" /> Lihat
          </a>
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => handleReview('APPROVED')}
          className="h-7 cursor-pointer rounded-lg bg-eventkan-green-ink px-2 text-xs text-white hover:bg-eventkan-green-ink/90"
        >
          <Check className="mr-1 h-3 w-3" /> Terima
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => handleReview('REJECTED')}
          className="h-7 cursor-pointer rounded-lg bg-eventkan-peach px-2 text-xs text-eventkan-peach-ink hover:bg-eventkan-peach/80"
        >
          <X className="mr-1 h-3 w-3" /> Tolak
        </Button>
      </div>
    );
  }

  return (
    <Badge variant="outline" className="rounded-full border-0 bg-eventkan-canvas px-2.5 py-1 text-[10px] font-medium text-eventkan-muted">
      {formatAttendanceProofStatusLabel(status)}
    </Badge>
  );
}
