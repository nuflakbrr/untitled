'use server';

import type { z } from 'zod';
import type { AuthResponse } from '@/interfaces/features/auth';

import api from '@/lib/api';
import { auth } from '@/lib/auth';
import { hasAdminRole } from '@/lib/roles';
import { loginSchema, registerSchema } from '@/schemas/auth';

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

export async function loginAction(values: LoginValues): Promise<AuthResponse> {
  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Data login tidak valid.' };
  try {
    const result = await auth.api.signInEmail({ body: parsed.data });
    return { success: true, data: { user: result.data.user as never, token: 'session-cookie' } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Email atau password salah.',
    };
  }
}

export async function logoutAction(): Promise<AuthResponse> {
  await auth.api.signOut();
  return { success: true };
}

export async function registerAction(values: RegisterValues): Promise<AuthResponse> {
  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) return { success: false, error: 'Data registrasi tidak valid.' };
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: parsed.data.email,
        username: parsed.data.email.split('@')[0],
        password: parsed.data.password,
        full_name: parsed.data.name,
        company_name: 'SITIVENT',
      },
    });
    return { success: true, data: { user: result.data.user as never } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Registrasi gagal.' };
  }
}

export async function sendPasswordChangeNotificationEmail(..._legacyArgs: unknown[]) {
  try {
    await api.post('/features/v1/emails/password-changed');
    return { success: true };
  } catch {
    return { success: false, error: 'Gagal mengirim notifikasi email.' };
  }
}

export async function getMeAction() {
  const session = await auth.api.getSession();
  const isAdmin = hasAdminRole(session?.roles, session?.user?.role);
  return { isAdmin, session };
}

export interface AdminTenant {
  id: string;
  name: string;
  slug?: string;
  type?: string;
}

export async function getMyTenantsAction(): Promise<AdminTenant[]> {
  try {
    const result = await api.get('/core/v1/auth/my-tenants');
    return (result.data.data ?? [])
      .filter(
        (tenant: Record<string, unknown>) =>
          typeof (tenant.id ?? tenant.tenant_id) === 'string' &&
          String(tenant.id ?? tenant.tenant_id).length > 0
      )
      .map((tenant: Record<string, unknown>) => ({
        id: String(tenant.id ?? tenant.tenant_id),
        name: String(
          tenant.name ?? tenant.tenant_name ?? tenant.code ?? tenant.tenant_code ?? 'Tenant'
        ),
        slug: tenant.slug
          ? String(tenant.slug)
          : tenant.tenant_slug
            ? String(tenant.tenant_slug)
            : undefined,
        type: tenant.type
          ? String(tenant.type)
          : tenant.tenant_type
            ? String(tenant.tenant_type)
            : undefined,
      }));
  } catch {
    return [];
  }
}
