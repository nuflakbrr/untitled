'use client';

import type { AuthSession } from './types';

import { useMemo, useState, useContext, createContext } from 'react';

import { hasPermission } from './types';

type SessionContextValue = {
  session: AuthSession;
  setSession: (session: AuthSession) => void;
  can: (permission: string) => boolean;
};

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: AuthSession;
}) {
  const [session, setSession] = useState(initialSession);
  const value = useMemo(
    () => ({
      session,
      setSession,
      can: (permission: string) => hasPermission(session, permission),
    }),
    [session]
  );

  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used inside SessionProvider');
  return context;
}

export function PermissionGuard({
  children,
  permission,
}: {
  children: React.ReactNode;
  permission: string;
}) {
  return useSession().can(permission) ? children : null;
}
