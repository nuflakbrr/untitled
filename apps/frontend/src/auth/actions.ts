'use server';

import type { AuthSession, ApiEnvelope, TenantOption } from './types';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { safeReturnTo, tenantOptionSchema } from './types';
import { fetchBackend, SESSION_COOKIE, sessionFromToken } from './server';

export type AuthActionState = { error: string };
export type AuthActionResult<T> = { data: T; error: null } | { data: null; error: string };
export type EventSearchResult = { id: string; title: string; slug: string; banner?: string | null };

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  returnTo: z.string(),
});
const signUpSchema = z
  .object({
    name: z.string().trim().min(2).max(255),
    email: z.email(),
    password: z.string().min(8),
    confirmation: z.string(),
  })
  .refine((value) => value.password === value.confirmation, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirmation'],
  });
const switchSchema = z.uuid();
const eventSearchSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  banner: z.string().nullish(),
});

async function responseJson<T>(response: Response) {
  return (await response.json().catch(() => ({
    data: null,
    message: 'Backend tidak merespons',
  }))) as ApiEnvelope<T>;
}

async function setSessionCookie(token: string, maxAge: number) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  });
}

async function authenticatedSession(): Promise<{
  session: AuthSession;
  token: string;
} | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await sessionFromToken(token);
  if (session) return { session, token };

  const refresh = await fetchBackend('core/v1/auth/refresh', token, { method: 'POST' });
  const payload = await responseJson<{ access_token?: string; expires_in?: number }>(refresh);
  const refreshedToken = payload.data?.access_token;
  if (!refresh.ok || !refreshedToken) return null;

  const refreshedSession = await sessionFromToken(refreshedToken);
  if (!refreshedSession) return null;
  await setSessionCookie(refreshedToken, payload.data?.expires_in ?? 86400);
  return { session: refreshedSession, token: refreshedToken };
}

export async function signInAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const input = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    returnTo: formData.get('returnTo'),
  });
  if (!input.success) return { error: 'Email atau kata sandi tidak valid' };

  const backend = await fetchBackend('core/v1/auth/signin', undefined, {
    method: 'POST',
    body: JSON.stringify({ email: input.data.email, password: input.data.password }),
  });
  const payload = await responseJson<{ access_token?: string; expires_in?: number }>(backend);
  const token = payload.data?.access_token;
  if (!backend.ok || !token) return { error: payload.message };

  const session = await sessionFromToken(token);
  if (!session) return { error: 'Sesi gagal dibuat' };
  await setSessionCookie(token, payload.data?.expires_in ?? 86400);
  return redirect(safeReturnTo(input.data.returnTo));
}

export async function signUpAction(
  _state: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const input = signUpSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmation: formData.get('confirmation'),
  });
  if (!input.success)
    return { error: input.error.issues[0]?.message ?? 'Data registrasi tidak valid' };
  const backend = await fetchBackend('core/v1/auth/signup', undefined, {
    method: 'POST',
    body: JSON.stringify({
      name: input.data.name,
      email: input.data.email,
      password: input.data.password,
    }),
  });
  const payload = await responseJson<unknown>(backend);
  if (!backend.ok) return { error: payload.message };
  return redirect('/auth/sign-in?registered=1');
}

export async function signOutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/auth/sign-in');
}

export async function searchEventsAction(
  query: string
): Promise<AuthActionResult<EventSearchResult[]>> {
  const value = query.trim();
  const search = value ? `&search=${encodeURIComponent(value)}` : '';
  const backend = await fetchBackend(`features/v1/events?status=PUBLISHED${search}&page=1&limit=5`);
  const payload = await responseJson<unknown[]>(backend);
  const results = z.array(eventSearchSchema).safeParse(payload.data);
  if (!backend.ok || !results.success)
    return { data: null, error: payload.message || 'Pencarian event gagal' };
  return { data: results.data, error: null };
}

export async function listTenantsAction(): Promise<AuthActionResult<TenantOption[]>> {
  const auth = await authenticatedSession();
  if (!auth?.session.is_super_admin) return { data: null, error: 'Akses ditolak' };

  const backend = await fetchBackend('core/v1/tenants?page=1&limit=100', auth.token);
  const payload = await responseJson<unknown[]>(backend);
  if (!backend.ok || !Array.isArray(payload.data)) return { data: null, error: payload.message };

  const tenants = z.array(tenantOptionSchema).safeParse(payload.data);
  return tenants.success
    ? { data: tenants.data, error: null }
    : { data: null, error: 'Data tenant tidak valid' };
}

export async function switchTenantAction(tenantId: string): Promise<AuthActionResult<AuthSession>> {
  const parsedTenantId = switchSchema.safeParse(tenantId);
  if (!parsedTenantId.success) return { data: null, error: 'Tenant tidak valid' };

  const auth = await authenticatedSession();
  if (!auth?.session.is_super_admin) return { data: null, error: 'Akses ditolak' };

  const backend = await fetchBackend('core/v1/auth/switch-tenant', auth.token, {
    method: 'POST',
    body: JSON.stringify({ tenant_id: parsedTenantId.data }),
  });
  const payload = await responseJson<{ access_token?: string; expires_in?: number }>(backend);
  const token = payload.data?.access_token;
  if (!backend.ok || !token) return { data: null, error: payload.message };

  const session = await sessionFromToken(token);
  if (!session) return { data: null, error: 'Konteks tenant gagal dimuat' };
  await setSessionCookie(token, payload.data?.expires_in ?? 86400);
  return { data: session, error: null };
}
