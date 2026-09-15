import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { getParticipantDashboardData } from '@/services/admin/dashboard';

import SummaryCards from './_components/SummaryCards';
import DashboardHeader from './_components/DashboardHeader';
import UpcomingEventCard from './_components/UpcomingEventCard';
import EventHistoryTable from './_components/EventHistoryTable';
import TestimonialNoticeBanner from './_components/TestimonialNoticeBanner';

export default async function ParticipantDashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return redirect('/login');
  }

  const data = await getParticipantDashboardData();

  if (!data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-sm text-[#6c7280]">Gagal memuat data dashboard peserta.</p>
      </div>
    );
  }

  const { upcomingEvent, history, summary } = data;

  return (
    <div className="space-y-6 pb-10">
      <DashboardHeader userName={session.user.name} emailVerified={session.user.emailVerified} />

      <TestimonialNoticeBanner count={summary.pendingTestimonials} />

      <SummaryCards summary={summary} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[.9fr_1.4fr]">
        <UpcomingEventCard upcomingEvent={upcomingEvent} />
        <EventHistoryTable history={history} />
      </div>
    </div>
  );
}
