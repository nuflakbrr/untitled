import type { EventHistoryStatsProps } from '@/interfaces/features/event-history';

import { getEventHistoryStats, eventHistoryStatStyles } from '../_libs/getEventHistoryStats.libs';

export default function EventHistoryStats({ registrations }: EventHistoryStatsProps) {
  const stats = getEventHistoryStats(registrations);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="flex items-center justify-between gap-4 rounded-[22px] border border-eventkan-ink/10 bg-eventkan-surface p-5 shadow-[0_18px_50px_rgba(17,35,63,.05)]"
        >
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted">
              {label}
            </span>
            <strong className="font-display mt-2 block text-3xl font-extrabold leading-none text-eventkan-ink">
              {value}
            </strong>
          </div>
          <span
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-[15px] ${eventHistoryStatStyles[tone]}`}
          >
            <Icon className="h-5 w-5" />
          </span>
        </div>
      ))}
    </div>
  );
}
