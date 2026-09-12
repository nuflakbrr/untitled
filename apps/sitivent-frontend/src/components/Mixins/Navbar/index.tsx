'use client';

import type { FC } from 'react';
import type { Route } from 'next';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { X, Menu, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { getMeAction } from '@/services/public/auth';

import UserMenu from './_components/UserMenu';
import { navlinks } from './_constants/navLinks';

const Navbar: FC = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useQuery({
    queryKey: ['auth-me-server-action'],
    queryFn: () => getMeAction(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const session = data?.session;
  const isAdmin = data?.isAdmin ?? false;
  const tenantId = session?.tenantId;
  const dashboardHref = isAdmin
    ? tenantId
      ? `/admin/${tenantId}/dashboard`
      : '/admin'
    : '/participant/dashboard';
  const active = (path: string) => (path === '/' ? pathname === '/' : pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50 px-4 pt-5 sm:px-6">
      <div className="relative mx-auto max-w-295 rounded-[18px] border border-white/70 bg-[#fffdf8]/65 p-[14px_18px] shadow-[0_10px_28px_rgba(17,35,63,.08),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-2xl backdrop-saturate-150">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="Sitivent"
            className="flex shrink-0 items-center gap-2 text-xl font-extrabold tracking-[-.03em] text-[#111927]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="grid h-9.5 w-9.5 -rotate-3 place-items-center rounded-xl bg-[#11233f] text-[15px] text-white">
              S
            </span>
            <span>Sitivent</span>
          </Link>
          <nav className="hidden items-center gap-7.5 text-sm font-semibold text-[#4b5565] lg:flex">
            {navlinks.map((link) => (
              <Link
                key={link.path}
                href={link.path as Route}
                className={cn(
                  'transition hover:text-[#111927]',
                  active(link.path) && 'text-[#111927]'
                )}
              >
                {link.title === 'Tentang Kami' ? 'Tentang' : link.title}
              </Link>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {session?.user ? (
              <UserMenu user={session.user} isAdmin={isAdmin} tenantId={tenantId} />
            ) : (
              <>
                <Link
                  href={'/login' as Route}
                  className="rounded-full px-4.5 py-3 font-bold text-[#11233f] transition hover:-translate-y-0.5"
                >
                  Masuk
                </Link>
                <Link
                  href={'/events' as Route}
                  className="inline-flex items-center group gap-2 rounded-full bg-[#11233f] px-4.5 py-3 font-bold text-white shadow-[0_10px_22px_rgba(17,35,63,.16)] transition hover:-translate-y-0.5"
                >
                  Cari Event{' '}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:-rotate-45" />
                </Link>
              </>
            )}
          </div>
          <button
            type="button"
            aria-label="Buka menu"
            onClick={() => setOpen((value) => !value)}
            className="grid h-10.5 w-10.5 place-items-center rounded-xl bg-[#11233f] text-white lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="absolute inset-x-0 top-full z-10 mt-3 rounded-[18px] border border-white/70 bg-[#fffdf8]/95 p-3 shadow-[0_18px_40px_rgba(17,35,63,.12),inset_0_1px_0_rgba(255,255,255,.85)] backdrop-blur-2xl backdrop-saturate-150 lg:hidden">
            <nav className="grid gap-1">
              {navlinks
                .filter((link) => link.path !== '/')
                .map((link) => (
                  <Link
                    key={link.path}
                    href={link.path as Route}
                    className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#4b5565] hover:bg-[#f6f3eb]"
                  >
                    {link.title}
                  </Link>
                ))}
            </nav>
            <div className="mt-3 grid gap-2 border-t border-[#111927]/10 pt-3">
              {session?.user ? (
                <Link
                  href={dashboardHref as Route}
                  className="rounded-full bg-[#11233f] px-4 py-3 text-center text-sm font-bold text-white"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={'/login' as Route}
                    className="rounded-full bg-[#f6f3eb] px-4 py-3 text-center text-sm font-bold text-[#11233f]"
                  >
                    Masuk
                  </Link>
                  <Link
                    href={'/events' as Route}
                    className="rounded-full bg-[#11233f] px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Cari Event
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
