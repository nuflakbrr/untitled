'use client';

import { useState } from 'react';
import { Trophy } from 'lucide-react';

import type { AdminDashboardStats } from '@/interfaces/features/dashboard';

import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

type LeaderboardEvent = AdminDashboardStats['popularEvents'][number];

const rankTones = [
  'bg-[#fff4c4] text-[#b18a17]',
  'bg-[#eef0f2] text-[#7d858d]',
  'bg-[#f2dfd2] text-[#a8673f]',
] as const;

export default function EventLeaderboard({
  title,
  subtitle,
  events,
}: {
  title: string;
  subtitle: string;
  events: LeaderboardEvent[];
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const items = events.slice((page - 1) * pageSize, page * pageSize);
  const maximum = events[0]?._count.registrations ?? 0;

  return (
    <Card className="overflow-hidden border rounded-[22px] bg-eventkan-surface py-0 shadow-[0_18px_50px_rgba(17,35,63,.06)] ring-0">
      <CardHeader className="px-5 pt-5 pb-0">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-extrabold leading-tight text-eventkan-ink">
          <Trophy className="h-5 w-5 shrink-0 text-eventkan-accent" />
          {title}
        </CardTitle>
        <CardDescription className="mt-1 text-[11px] text-eventkan-muted">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-eventkan-muted">Belum ada event.</p>
        ) : (
          <div className="space-y-1 px-2 pb-2 sm:px-3">
            {items.map((event, index) => {
              const rank = (page - 1) * pageSize + index;
              const registrations = event._count.registrations;
              const progress = maximum ? (registrations / maximum) * 100 : 0;
              const rankTone =
                rank < 3 ? rankTones[rank] : 'bg-eventkan-canvas text-eventkan-accent';
              return (
                <div
                  key={event.id}
                  className="rounded-[16px] px-3 py-3.5 transition-colors hover:bg-eventkan-canvas/55 sm:px-3.5"
                >
                  <div className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-3">
                    <span className={`grid h-8 w-8 place-items-center rounded-[11px] ${rankTone}`}>
                      {rank < 3 ? (
                        <Trophy className="h-4 w-4" aria-label={`Peringkat ${rank + 1}`} />
                      ) : (
                        <span className="font-display text-sm font-extrabold">{rank + 1}.</span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <strong className="block truncate text-xs font-extrabold text-eventkan-ink">
                        {event.title}
                      </strong>
                      <span className="mt-1 block truncate text-[10px] font-semibold uppercase tracking-[.04em] text-eventkan-muted">
                        {event.tenant_type === 'ROOT'
                          ? 'Event universitas'
                          : event.tenant_name || 'Tenant aktif'}
                      </span>
                    </div>
                    <span className="text-right">
                      <strong className="font-display block text-sm font-extrabold leading-none text-eventkan-ink">
                        {registrations}
                      </strong>
                      <small className="mt-1 block text-[10px] text-eventkan-muted">
                        pendaftar
                      </small>
                    </span>
                  </div>
                  <div className="ml-11 mt-2.5 h-1.5 overflow-hidden rounded-full bg-eventkan-ink/8">
                    <div
                      className="h-full rounded-full bg-eventkan-accent transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {events.length > pageSize && (
          <div className="flex items-center justify-between px-5 py-4">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-eventkan-navy hover:bg-eventkan-canvas hover:text-eventkan-navy"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Sebelumnya
            </Button>
            <span className="text-[11px] text-eventkan-muted">
              Halaman {page} dari {Math.ceil(events.length / pageSize)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer text-eventkan-navy hover:bg-eventkan-canvas hover:text-eventkan-navy"
              disabled={page === Math.ceil(events.length / pageSize)}
              onClick={() => setPage((value) => value + 1)}
            >
              Berikutnya
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
