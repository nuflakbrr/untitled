import api from '@/lib/api';
import { auth } from '@/lib/auth';

export async function verifyPermission(permissionName: string) {
  const session = await auth.api.getSession();
  return Boolean(session?.permissions.includes(permissionName) || session?.roles.some((role: string) => role.toLowerCase().includes('admin')));
}

export async function verifySession() { return auth.api.getSession(); }

export async function createAuditLog(params: { userId?: string; action: string; table: string; recordId: string; oldValues?: string; newValues?: string }) {
  try { return (await api.post('/core/v1/audit-logs', { reff_type: params.table, reff_id: params.recordId, action: params.action, old_values: params.oldValues, new_values: params.newValues })).data; }
  catch { return undefined; }
}

export async function getUserPermissionsAndRoles(userId: string) {
  const session = await auth.api.getSession();
  if (!session || session.user.id !== userId) return { roles: [], permissions: [] };
  return { roles: session.roles, permissions: session.permissions };
}
