import { cookies } from 'next/headers';

import api from './api';

const ACCESS_TOKEN = 'sitivent_access_token';
const REFRESH_TOKEN = 'sitivent_refresh_token';

function toSession(user: { id: string; email: string; full_name?: string; name?: string; image?: string | null; email_verified?: boolean; tenant_id?: string | null; role?: string | null }, permissions: string[] = [], roles: string[] = [], fallbackRole?: string | null) {
  const normalizedRoles = roles.length > 0 ? roles : fallbackRole ? [fallbackRole] : user.role ? [user.role] : [];
  return { user: { id: user.id, email: user.email, name: user.full_name ?? user.name ?? '', image: user.image ?? null, emailVerified: user.email_verified ?? false, role: user.role ?? fallbackRole ?? null }, tenantId: user.tenant_id ?? null, permissions, roles: normalizedRoles };
}

async function tokenHeaders() {
  const token = (await cookies()).get(ACCESS_TOKEN)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const auth = {
  api: {
    async getSession(_options?: unknown) {
      try {
        const response = await api.get('/core/v1/auth/me', { headers: await tokenHeaders() });
        const data = response.data.data;
        return data?.user ? toSession(data.user, data.permissions, data.roles, data.role) : null;
      } catch {
        return null;
      }
    },
    async signInEmail({ body }: { body: { email: string; password: string } }) {
      let response;
      try {
        response = await api.post('/core/v1/auth/signin', { email: body.email, password: body.password });
      } catch (error) {
        if (error && typeof error === 'object' && 'response' in error && (error as { response?: { status?: number } }).response?.status === 401) {
          throw new Error('INVALID_CREDENTIALS');
        }
        throw error;
      }
      const data = response.data.data;
      const jar = await cookies();
      const options = { httpOnly: true, sameSite: 'lax' as const, secure: process.env.NODE_ENV === 'production', path: '/' };
      jar.set(ACCESS_TOKEN, data.access_token, { ...options, maxAge: data.expires_in ?? 86400 });
      jar.set(REFRESH_TOKEN, data.refresh_token, options);
      return { data: toSession(data.user, data.permissions, data.roles, data.role) };
    },
    async signOut() {
      try { await api.post('/core/v1/auth/logout', {}, { headers: await tokenHeaders() }); } catch { /* expired token */ }
      const jar = await cookies();
      jar.delete(ACCESS_TOKEN);
      jar.delete(REFRESH_TOKEN);
      return { success: true };
    },
    async signUpEmail({ body }: { body: Record<string, unknown> }) {
      const response = await api.post('/core/v1/auth/signup', body);
      return { data: response.data.data };
    },
  },
};
