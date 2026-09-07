import type { Route } from 'next';

import { redirect } from 'next/navigation';
import { verifySession, verifyPermission } from '@/services/admin/security';

export const ParticipantRouteGuard = async ({ children }: { children: React.ReactNode }) => {
  const session = await verifySession();
  if (!session?.user) {
    redirect('/login' as Route);
  }

  const allowed = await verifyPermission('participant.dashboard');
  if (!allowed) {
    // Allow fallback check for logged-in user if participant.dashboard permission is not assigned
    const hasUserSession = Boolean(session?.user);
    if (!hasUserSession) {
      redirect('/login' as Route);
    }
  }

  return <>{children}</>;
};
