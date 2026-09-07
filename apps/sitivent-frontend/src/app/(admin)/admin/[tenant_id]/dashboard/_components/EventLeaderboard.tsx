'use client';

import type { AdminDashboardStats } from '@/interfaces/features/dashboard';

import { useState } from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

type LeaderboardEvent = AdminDashboardStats['popularEvents'][number];

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
    <Card className="border-none shadow-md ring-0">
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">Belum ada event.</p>
        ) : (
          <div className="space-y-4">
            {items.map((event, index) => {
              const rank = (page - 1) * pageSize + index;
              const registrations = event._count.registrations;
              const progress = maximum ? (registrations / maximum) * 100 : 0;
              return (
                <div key={event.id} className="space-y-1.5">
                  <div className="flex items-center gap-3 text-sm">
                    {rank < 3 ? (
                      <Trophy
                        className="h-5 w-5 shrink-0"
                        style={{ color: ['#D4AF37', '#A7A7A7', '#B87333'][rank] }}
                      />
                    ) : (
                      <span className="w-5 shrink-0 text-center font-bold text-muted-foreground">
                        {rank + 1}
                      </span>
                    )}
                    <span className="min-w-0 flex-1 truncate font-medium">{event.title}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {registrations} pendaftar
                    </span>
                  </div>
                  <div className="ml-8 flex items-center gap-2">
                    <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] uppercase text-primary">
                      {event.tenant_type === 'ROOT'
                        ? 'Event universitas'
                        : event.tenant_name || 'Tenant aktif'}
                    </span>
                  </div>
                  <div className="ml-8 h-1.5 overflow-hidden rounded-full bg-foreground/5">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {events.length > pageSize && (
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              Sebelumnya
            </Button>
            <span className="text-xs text-muted-foreground">
              Halaman {page} dari {Math.ceil(events.length / pageSize)}
            </span>
            <Button
              variant="outline"
              size="sm"
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
