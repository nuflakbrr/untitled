import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { SESSION_COOKIE } from 'src/auth/constants';

// ----------------------------------------------------------------------

/**
 * Gate galeri referensi /components (living docs untuk programmer & AI).
 *
 * Selalu tampil saat `bun run dev`; di build production hanya tampil bila
 * NEXT_PUBLIC_SHOW_COMPONENTS=true. Deploy client tidak men-set flag →
 * seluruh /components/* di-rewrite ke route yang tidak ada → 404.
 *
 * Penegakan HARUS di middleware: halaman galeri di-prerender statis, jadi
 * notFound() di layout segmen tidak menggate HTML yang sudah jadi.
 * `matcher` di bawah membuat middleware ini tidak berjalan untuk route lain.
 */
const SHOW_COMPONENTS =
  process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_COMPONENTS === 'true';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/components') && !SHOW_COMPONENTS) {
    return NextResponse.rewrite(new URL('/__components-disabled', request.url));
  }

  if (request.nextUrl.pathname.startsWith('/dashboard') && !request.cookies.has(SESSION_COOKIE)) {
    const signIn = new URL('/auth/sign-in', request.url);
    signIn.searchParams.set('returnTo', `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/components/:path*', '/dashboard/:path*'] };
