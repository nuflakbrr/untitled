import { DashboardLayout } from 'src/layouts/dashboard/layout';

import { requireSession } from 'src/auth/server';
import { SessionProvider } from 'src/auth/session-provider';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession('admin.access');

  return (
    <SessionProvider initialSession={session}>
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  );
}
