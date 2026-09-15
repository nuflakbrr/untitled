import type { FC, ReactNode } from 'react';

import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
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
          <div className="flex min-h-screen flex-col bg-[#f6f3eb]">
            <ParticipantNavbar user={session.user} />
            <main className="mx-auto w-full max-w-295 flex-1 px-4 py-8 sm:px-0 sm:py-10 lg:py-12">
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
