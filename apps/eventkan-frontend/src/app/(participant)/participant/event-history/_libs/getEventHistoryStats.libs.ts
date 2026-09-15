import { Award, BadgeCheck, CalendarCheck } from 'lucide-react';

import type { ParticipantRegistration } from '@/interfaces/features/registrations';

export const eventHistoryStatStyles = {
  orange: 'bg-[#ffe5d8] text-[#ff7a45]',
  green: 'bg-[#e5f2e8] text-[#36784b]',
  yellow: 'bg-[#fbf1c8] text-[#856b16]',
} as const;

export const getEventHistoryStats = (registrations: ParticipantRegistration[]) => [
  { label: 'Total Event', value: registrations.length, icon: CalendarCheck, tone: 'orange' },
  {
    label: 'Sudah Hadir',
    value: registrations.filter((registration) => registration.status === 'CHECKED_IN').length,
    icon: BadgeCheck,
    tone: 'green',
  },
  {
    label: 'Sertifikat',
    value: registrations.filter((registration) => registration.certificates?.length).length,
    icon: Award,
    tone: 'yellow',
  },
] as const;
