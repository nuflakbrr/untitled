import type { NextRequest} from 'next/server';

import { NextResponse } from 'next/server';

import { auth } from './lib/auth';
import { hasAdminRole } from './lib/roles';

/**
 * Next.js 16 Proxy implementation for Route Protection
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminPath = pathname.startsWith('/admin');
  const isParticipantPath = pathname.startsWith('/participant');
  const isAuthPath = pathname.startsWith('/login');
  const isRegisterPath = pathname.startsWith('/register');

  const cmsSegments = ['managements', 'master', 'transactions', 'attendance'];
  const isCMSPath = cmsSegments.some((segment) => pathname.startsWith(`/admin/${segment}`));

  // Jika bukan path yang diproteksi, langsung lewat saja (optimasi)
  if (!isAdminPath && !isParticipantPath && !isAuthPath && !isCMSPath && !isRegisterPath) {
    return NextResponse.next();
  }

  try {
    // Ambil session secara langsung dari database via Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // Cek apakah session benar-benar valid dan belum kedaluwarsa
    const isAuthenticated = !!(
      session && session.user
    );

    // Blocker 1: Jika akses /admin atau /participant tapi BELUM login -> Tendang ke /login
    if ((isAdminPath || isParticipantPath) && !isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const permissionsSet = new Set(session?.permissions ?? []);
    const hasAdminAccess = permissionsSet.has('admin.access') || hasAdminRole(session?.roles);
    const activeTenant = request.cookies.get('sitivent_active_tenant')?.value;

    // Keep legacy admin URLs working after tenant-aware routes were introduced.
    if (isAdminPath && activeTenant && /^\/admin\/(managements|master|transactions|attendance|publications|support)(\/|$)/.test(pathname)) {
      return NextResponse.redirect(new URL(`/admin/${activeTenant}${pathname.slice('/admin'.length)}`, request.url));
    }

    // Blocker 2: Jika akses /admin tapi tidak punya akses admin -> Tendang ke /participant/dashboard
    if (isAdminPath && isAuthenticated && !hasAdminAccess) {
      return NextResponse.redirect(new URL('/participant/dashboard', request.url));
    }

    // Blocker 3: Jika akses /login tapi SUDAH login -> Tendang ke dashboard yang sesuai
    if ((isAuthPath || isRegisterPath) && isAuthenticated) {
      if (hasAdminAccess) {
        return NextResponse.redirect(new URL(activeTenant ? `/admin/${activeTenant}/dashboard` : '/login', request.url));
      } else {
        return NextResponse.redirect(new URL('/participant/dashboard', request.url));
      }
    }

    /**
     * Blocker 4: Jika paksa akses segment CMS, lempar ke halaman children pertama masing-masing segment
     */
    if (isCMSPath && isAuthenticated) {
      const redirectMap: Record<string, string> = {
        '/admin/managements': activeTenant ? `/admin/${activeTenant}/managements/permissions` : '/login',
        '/admin/master': activeTenant ? `/admin/${activeTenant}/master/events` : '/login',
        '/admin/transactions': activeTenant ? `/admin/${activeTenant}/transactions/registrations` : '/login',
        '/admin/attendance': activeTenant ? `/admin/${activeTenant}/attendance/scan` : '/login',
        '/admin': activeTenant ? `/admin/${activeTenant}/dashboard` : '/login',
      };

      if (redirectMap[pathname]) {
        return NextResponse.redirect(new URL(redirectMap[pathname], request.url));
      }
    }
  } catch (error) {
    console.error('[PROXY_AUTH_ERROR]', {
      pathname,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    });
    // Fail-safe: Jika sistem auth down, proteksi halaman admin tetap berjalan
    if (isAdminPath || isParticipantPath) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/participant/:path*', '/login', '/register'],
};
