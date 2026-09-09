const seededRootTenantId = 'c9711506-d356-4704-a32e-0543dfe3e104';
const seededFacultyTenantId = '20492a21-59c3-4edf-bb64-1eaa6cf11deb';

export const e2eConfig = {
  rootTenantId: process.env.E2E_ROOT_TENANT_ID ?? seededRootTenantId,
  facultyTenantId: process.env.E2E_FACULTY_TENANT_ID ?? seededFacultyTenantId,
  rootAdminEmail: process.env.E2E_ROOT_ADMIN_EMAIL ?? 'superadmin.univ@gmail.com',
  facultyAdminEmail: process.env.E2E_FACULTY_ADMIN_EMAIL ?? 'superadmin.fasilkom@gmail.com',
  participantEmail: process.env.E2E_PARTICIPANT_EMAIL ?? 'peserta@gmail.com',
  password: process.env.E2E_PASSWORD ?? 'password',
} as const;

export function adminRoute(tenantId: string, path: string): string {
  return `/admin/${tenantId}${path.startsWith('/') ? path : `/${path}`}`;
}
