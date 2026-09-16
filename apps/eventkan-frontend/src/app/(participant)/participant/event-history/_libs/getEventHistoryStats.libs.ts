import { Award, BadgeCheck, CalendarCheck } from 'lucide-react';

import type { ParticipantRegistration } from '@/interfaces/features/registrations';

export const eventHistoryStatStyles = {
  orange: 'bg-eventkan-peach text-eventkan-accent',
  green: 'bg-eventkan-green-soft text-eventkan-green-ink',
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
