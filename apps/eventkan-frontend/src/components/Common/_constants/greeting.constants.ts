import { Sun, Moon, Sunset, Sunrise, type LucideIcon } from 'lucide-react';

import type { TimeOfDay } from '../_libs/getTimeOfDay.libs';

export const TIME_OF_DAY_CONFIG: Record<
  TimeOfDay,
  { greeting: string; icon: LucideIcon; iconClass: string; panelClass: string }
> = {
  morning: {
    greeting: 'SELAMAT PAGI',
    icon: Sunrise,
    iconClass: 'text-eventkan-navy',
    panelClass: 'bg-eventkan-yellow',
  },
  afternoon: {
    greeting: 'SELAMAT SIANG',
    icon: Sun,
    iconClass: 'text-eventkan-peach-ink',
    panelClass: 'bg-eventkan-peach',
  },
  evening: {
    greeting: 'SELAMAT SORE',
    icon: Sunset,
    iconClass: 'text-eventkan-peach-ink',
    panelClass: 'bg-eventkan-peach',
  },
  night: {
    greeting: 'SELAMAT MALAM',
    icon: Moon,
    iconClass: 'text-white',
    panelClass: 'bg-eventkan-navy',
  },
};
