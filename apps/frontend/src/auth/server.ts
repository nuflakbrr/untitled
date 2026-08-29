import type { AuthSession, ApiEnvelope } from './types';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { CONFIG } from 'src/global-config';

import { SESSION_COOKIE } from './constants';
import { sessionSchema, hasPermission, isAdminSession } from './types';

export { SESSION_COOKIE };

export function backendUrl(path: string) {
  const base = CONFIG.serverApiUrl || CONFIG.apiUrl;
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export async function fetchBackend(path: string, token?: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set('Accept', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (init?.body) headers.set('Content-Type', 'application/json');

  return fetch(backendUrl(path), { ...init, headers, cache: 'no-store' });
}

export async function sessionFromToken(token: string): Promise<AuthSession | null> {
  const response = await fetchBackend('core/v1/auth/me', token);
  if (!response.ok) return null;

  const payload = (await response.json()) as ApiEnvelope<unknown>;
  const parsed = sessionSchema.safeParse(payload.data);
  return parsed.success ? parsed.data : null;
}

export async function getServerSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? sessionFromToken(token) : null;
}

export async function requireSession(permission?: string) {
  const session = await getServerSession();
  if (!session) redirect('/auth/sign-in');
  if (permission && !hasPermission(session, permission)) redirect('/error/403');
  return session;
}

export async function requireParticipantSession() {
  const session = await requireSession();
  if (isAdminSession(session)) redirect('/dashboard');
  return session;
}
