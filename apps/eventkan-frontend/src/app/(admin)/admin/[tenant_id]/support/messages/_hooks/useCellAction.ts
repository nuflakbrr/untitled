'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateSupportMessageStatusAction } from '@/services/participant/support';

type SupportMessageStatus = 'PENDING' | 'PROCESS' | 'RESOLVED';

export const useCellAction = (messageId?: string) => {
  const queryClient = useQueryClient();
  const [openDetail, setOpenDetail] = useState(false);
  const { mutate: updateStatus, isPending: isStatusUpdating } = useMutation({
    mutationFn: (status: SupportMessageStatus) => updateSupportMessageStatusAction(messageId ?? '', status),
    onSuccess: (result) => {
      if (!result.success) {
        toast.error(result.error ?? 'Gagal memperbarui status.');
        return;
      }
      toast.success('Status pengaduan berhasil diperbarui.');
      queryClient.invalidateQueries({ queryKey: ['support-messages'] });
    },
    onError: () => toast.error('Gagal memperbarui status.'),
  });
  const getWhatsAppLink = (phone: string, name: string, title: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0/, '62');
    const text = encodeURIComponent(`Halo ${name},\n\nKami dari tim Support EVENTKAN ingin menindaklanjuti laporan Anda mengenai "${title}".\n\nBagaimana kami bisa membantu Anda?`);
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };
  return { openDetail, setOpenDetail, getWhatsAppLink, updateStatus, isStatusUpdating };
};
