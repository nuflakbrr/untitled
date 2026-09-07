import type { FC, ReactNode } from 'react';

import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { CMSHeader } from '@/components/Mixins/Sidebar/CMSHeader';
import { AppSidebar } from '@/components/Mixins/Sidebar/AppSidebar';
import { PermissionProvider } from '@/providers/PermissionProvider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

type Props = {
  children: ReactNode;
};

const CMSLayout: FC<Props> = async ({ children }) => {
  // 1. Ambil session di server
  const session = await auth.api.getSession();

  // Jika tidak ada session, tendang ke login
  if (!session || !session.user) {
    return redirect('/login');
  }

  const permissions = session.permissions;
  const roles = session.roles;

  return (
    <TooltipProvider>
      <SidebarProvider>
        <PermissionProvider initialPermissions={permissions} initialRoles={roles}>
          <AppSidebar session={session} permissions={permissions} />
          <SidebarInset>
            <CMSHeader />
            <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
          </SidebarInset>
        </PermissionProvider>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default CMSLayout;
