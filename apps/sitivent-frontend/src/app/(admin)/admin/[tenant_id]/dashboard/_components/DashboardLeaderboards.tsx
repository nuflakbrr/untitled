import type { AdminDashboardStats } from '@/interfaces/features/dashboard';

import EventLeaderboard from './EventLeaderboard';

export default function DashboardLeaderboards({
  globalPopularEvents,
  popularEvents,
  tenantName,
}: Pick<AdminDashboardStats, 'globalPopularEvents' | 'popularEvents' | 'tenantName'>) {
  const label = tenantName || 'tenant aktif';
  return (
    <div className="space-y-4 md:space-y-6">
      <EventLeaderboard
        title="Top 10 Event Terpopuler"
        subtitle="Event dengan jumlah pendaftar terbanyak."
        events={globalPopularEvents}
      />
      <EventLeaderboard
        title={`Top 10 Event ${label}`}
        subtitle={`Event dengan pendaftar terbanyak di ${label}.`}
        events={popularEvents}
      />
    </div>
  );
}
