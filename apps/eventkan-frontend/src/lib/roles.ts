type SessionRole = string | { name?: string | null; role?: string | null; role_name?: string | null; code?: string | null; slug?: string | null };
export function getRoleNames(roles: SessionRole[] | undefined, fallback?: string | null): string[] {
  return [...(roles ?? []).map((role) => typeof role === 'string' ? role : role.name ?? role.role ?? role.role_name ?? role.code ?? role.slug ?? ''), fallback ?? ''].map((role) => role.trim().toLowerCase()).filter(Boolean);
}
export function hasAdminRole(roles: SessionRole[] | undefined, fallback?: string | null): boolean {
  return getRoleNames(roles, fallback).some((role) => ['admin', 'superadmin', 'panitia'].includes(role) || role.includes('admin'));
}
