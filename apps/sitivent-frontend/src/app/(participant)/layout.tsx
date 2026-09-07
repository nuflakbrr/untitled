import type { FC, ReactNode } from 'react';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { hasAdminRole } from '@/lib/roles';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ParticipantRouteGuard } from '@/components/Auth/ParticipantRouteGuard';
import { ParticipantNavbar } from '@/components/Mixins/Participant/ParticipantNavbar';
import { ParticipantFooter } from '@/components/Mixins/Participant/ParticipantFooter';
import { ParticipantTourGuide } from '@/components/Mixins/Participant/ParticipantTourGuide';

type Props = {
  children: ReactNode;
};

const ParticipantLayout: FC<Props> = async ({ children }) => {
  const session = await auth.api.getSession();

  if (!session || !session.user) {
    return redirect('/login');
  }

  const isParticipant = !hasAdminRole(session.roles);
  if (!isParticipant) {
    return redirect('/login');
  }

  return (
    <TooltipProvider>
      <ParticipantTourGuide>
        <ParticipantRouteGuard>
          <div className="min-h-screen bg-background flex flex-col">
            <ParticipantNavbar user={session.user} />
            <main className="flex-1 container py-6 px-4 md:py-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
            <ParticipantFooter />
          </div>
        </ParticipantRouteGuard>
      </ParticipantTourGuide>
    </TooltipProvider>
  );
};

export default ParticipantLayout;
