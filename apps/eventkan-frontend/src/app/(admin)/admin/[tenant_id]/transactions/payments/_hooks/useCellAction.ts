'use client';

import { copyToClipboard } from '@/lib/clipboard';

export const useCellAction = (data: { id: string; registration: { registrationNumber: string } }) => ({
  onCopyId: () => copyToClipboard(data.id),
  onCopyRegistrationNumber: () => copyToClipboard(data.registration.registrationNumber),
});
