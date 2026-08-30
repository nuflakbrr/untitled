import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  tenant_id: z.string().optional(),
  email_verified: z.boolean(),
  image: z.string().nullable().optional(),
  role: z.string(),
  role_id: z.string(),
});

export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  code: z.string(),
  type: z.string(),
  logo_url: z.string().nullable().optional(),
});

export const sessionSchema = z.object({
  user: userSchema,
  tenant: tenantSchema.nullable().optional(),
  role: z.string(),
  permissions: z.array(z.string()),
  is_super_admin: z.boolean(),
});

export const tenantOptionSchema = tenantSchema.extend({
  parent_id: z.string().nullable().optional(),
});

// One tenant the signed-in user is allowed to switch into, as returned by
// GET /core/v1/auth/my-tenants (backed by core.user_has_tenants).
export const myTenantSchema = z.object({
  tenant_id: z.string(),
  tenant_name: z.string(),
  tenant_slug: z.string(),
  tenant_code: z.string(),
  tenant_type: z.string(),
  role_id: z.string().nullable().optional(),
  role_name: z.string().nullable().optional(),
});

export type AuthSession = z.infer<typeof sessionSchema>;
export type TenantOption = z.infer<typeof tenantOptionSchema>;
export type MyTenant = z.infer<typeof myTenantSchema>;

export type ApiEnvelope<T> = {
  data: T;
  message: string;
  errors?: Record<string, string[]> | null;
};

export function hasPermission(session: AuthSession, permission: string) {
  return session.is_super_admin || session.permissions.includes(permission);
}

export function isAdminSession(session: AuthSession) {
  return hasPermission(session, 'admin.access');
}

export function safeReturnTo(value: string | null) {
  if (!value?.startsWith('/')) return '/dashboard';

  try {
    const base = 'http://local';
    const url = new URL(value, base);
    return url.origin === base ? `${url.pathname}${url.search}${url.hash}` : '/dashboard';
  } catch {
    return '/dashboard';
  }
}
