import { requireParticipantSession } from 'src/auth/server';
import { SessionProvider } from 'src/auth/session-provider';
import { DashboardLayout } from 'src/layouts/dashboard/layout';

export default async function ParticipantLayout({ children }: { children: React.ReactNode }) {
  const session = await requireParticipantSession();

  return (
    <SessionProvider initialSession={session}>
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  );
}
