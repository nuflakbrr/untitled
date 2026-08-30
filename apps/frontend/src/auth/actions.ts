'use server';

import type { AuthSession, ApiEnvelope, TenantOption } from './types';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { fetchBackend, SESSION_COOKIE, sessionFromToken } from './server';
import { safeReturnTo, isAdminSession, tenantOptionSchema } from './types';

export type AuthActionState = { error: string };
export type AuthActionResult<T> = { data: T; error: null } | { data: null; error: string };
export type EventSearchResult = { id: string; title: string; slug: string; banner?: string | null };
export type ParticipantRegistration = {
  id: string;
  event_id: string;
  qr_token: string;
  registration_number: string;
  event_title: string;
  event_slug: string;
  event_banner?: string | null;
  event_start_date: string;
  event_location: string;
  event_type: string;
  attendance_status: string;
  certificate_status: string;
  status: string;
  created_at: string;
};

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
const registrationSchema = z.object({
  event_id: z.uuid(),
  online_attendance: z.boolean(),
  return_to: z.string().startsWith('/event/').optional(),
});
const eventSearchSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  banner: z.string().nullish(),
});
const participantRegistrationSchema = z.object({
  id: z.string(),
  event_id: z.string(),
  qr_token: z.string(),
  registration_number: z.string(),
  event_title: z.string(),
  event_slug: z.string(),
  event_banner: z.string().nullish(),
  event_start_date: z.string(),
  event_location: z.string(),
  event_type: z.string(),
  attendance_status: z.string(),
  certificate_status: z.string(),
  status: z.string(),
  created_at: z.string(),
});

async function setRegistrationError(error: string) {
  (await cookies()).set('registration_error', error, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 10,
  });
}

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

  const defaultPath = isAdminSession(session) ? '/dashboard' : '/participant/dashboard';
  const requestedPath = safeReturnTo(input.data.returnTo);
  const isAdminPath = requestedPath === '/dashboard' || requestedPath.startsWith('/dashboard/');
  const isParticipantPath =
    requestedPath === '/participant/dashboard' ||
    requestedPath.startsWith('/participant/dashboard/');

  if ((isAdminPath && !isAdminSession(session)) || (isParticipantPath && isAdminSession(session))) {
    return redirect(defaultPath);
  }

  return redirect(requestedPath === '/dashboard' ? defaultPath : requestedPath);
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

export async function listMyRegistrationsAction(): Promise<
  AuthActionResult<ParticipantRegistration[]>
> {
  const auth = await authenticatedSession();
  if (!auth) return { data: null, error: 'Sesi tidak ditemukan' };

  const backend = await fetchBackend('features/v1/registrations/me?page=1&limit=20', auth.token);
  const payload = await responseJson<unknown[]>(backend);
  const registrations = z.array(participantRegistrationSchema).safeParse(payload.data);
  if (!backend.ok || !registrations.success)
    return { data: null, error: payload.message || 'Registrasi gagal dimuat' };
  return { data: registrations.data, error: null };
}

export async function registerAndCheckoutAction(formData: FormData) {
  const input = registrationSchema.safeParse({
    event_id: formData.get('event_id'),
    online_attendance: formData.get('online_attendance') === 'true',
    return_to: formData.get('return_to'),
  });
  if (!input.success) {
    await setRegistrationError('registration_invalid');
    redirect(paths.registration.failed);
  }
  const auth = await authenticatedSession();
  if (!auth) redirect('/auth/sign-in');

  const registrationResponse = await fetchBackend('features/v1/registrations', auth.token, {
    method: 'POST',
    body: JSON.stringify(input.data),
  });
  const registration = await responseJson<{ id?: string; status?: string; price?: number }>(
    registrationResponse
  );
  if (!registrationResponse.ok || !registration.data?.id) {
    const errorCode = registration.message.toLowerCase().includes('closed')
      ? 'registration_closed'
      : registration.message.toLowerCase().includes('quota')
        ? 'quota_full'
        : registration.message.toLowerCase().includes('already registered')
          ? 'already_registered'
          : 'registration';
    await setRegistrationError(errorCode);
    redirect(paths.registration.failed);
  }

  if (registration.data.status === 'REGISTERED' || registration.data.price === 0) {
    redirect(paths.registration.success(registration.data.id));
  }

  const checkoutResponse = await fetchBackend('features/v1/payments/checkout', auth.token, {
    method: 'POST',
    body: JSON.stringify({ registration_id: registration.data.id }),
  });
  const checkout = await responseJson<{ payment_url?: string }>(checkoutResponse);
  if (!checkoutResponse.ok) {
    await setRegistrationError('checkout');
    redirect(paths.registration.failed);
  }
  if (checkout.data?.payment_url) redirect(checkout.data.payment_url);
  await setRegistrationError('checkout');
  redirect(paths.registration.failed);
}

export async function checkoutRegistrationAction(formData: FormData) {
  const registrationID = z.uuid().safeParse(formData.get('registration_id'));
  const returnToValue = formData.get('return_to');
  const returnTo = safeReturnTo(typeof returnToValue === 'string' ? returnToValue : null);
  if (!registrationID.success) {
    await setRegistrationError('checkout');
    redirect(paths.registration.failed);
  }

  const auth = await authenticatedSession();
  if (!auth) redirect(`/auth/sign-in?returnTo=${encodeURIComponent(returnTo)}`);

  const response = await fetchBackend('features/v1/payments/checkout', auth.token, {
    method: 'POST',
    body: JSON.stringify({ registration_id: registrationID.data }),
  });
  const checkout = await responseJson<{ payment_url?: string }>(response);
  if (!response.ok || !checkout.data?.payment_url) {
    await setRegistrationError('checkout');
    redirect(paths.registration.failed);
  }
  redirect(checkout.data.payment_url);
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
