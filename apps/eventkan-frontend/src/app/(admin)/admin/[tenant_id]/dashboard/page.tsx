import GreetingCard from '@/components/Common/GreetingCard';
import { getAdminDashboardData } from '@/services/admin/dashboard';

import DashboardStats from './_components/DashboardStats';
import RecentRegistrations from './_components/RecentRegistrations';
import DashboardLeaderboards from './_components/DashboardLeaderboards';

export const dynamic = 'force-dynamic';

const DashboardCMS = async ({ params }: { params: Promise<{ tenant_id: string }> }) => {
  const { tenant_id: tenantId } = await params;
  const data = await getAdminDashboardData(tenantId);
  if (!data)
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground">Gagal memuat data dashboard.</p>
      </div>
    );
  return (
    <div className="space-y-6 pb-10">
      <GreetingCard />
      <DashboardStats counts={data.counts} />
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2 md:space-y-6">
          <RecentRegistrations registrations={data.recentRegistrations} />
        </div>
        <DashboardLeaderboards
          globalPopularEvents={data.globalPopularEvents}
          popularEvents={data.popularEvents}
          tenantName={data.tenantName}
        />
      </div>
    </div>
  );
};

export default DashboardCMS;
