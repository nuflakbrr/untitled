import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Footer from '@/components/Mixins/Footer';
import Navbar from '@/components/Mixins/Navbar';
import ScrollToTop from '@/components/Common/ScrollToTop';
import { PermissionProvider } from '@/providers/PermissionProvider';
import { getUserPermissionsAndRoles } from '@/services/admin/security';
import { Geist, Inter, Geist_Mono, Plus_Jakarta_Sans } from 'next/font/google';

type Props = {
  children: ReactNode;
};

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const LandingPageLayout = async ({ children }: Props) => {
  // 1. Ambil session di server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Ambil permissions & roles via service layer
  const { roles, permissions } = session?.user?.id
    ? await getUserPermissionsAndRoles(session.user.id)
    : { roles: [], permissions: [] };

  return (
    <div
      className={cn(
        'min-h-screen bg-[#f6f3eb] font-sans',
        inter.variable,
        jakartaSans.variable,
        geistSans.variable,
        geistMono.variable
      )}
    >
      <PermissionProvider initialPermissions={permissions} initialRoles={roles}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ScrollToTop />
      </PermissionProvider>
    </div>
  );
};

export default LandingPageLayout;
