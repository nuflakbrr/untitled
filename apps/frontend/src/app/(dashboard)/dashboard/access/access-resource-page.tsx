import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import {
  listTenantsAction,
  listAdminRolesAction,
  listAdminUsersAction,
  listAdminPermissionsAction,
} from 'src/auth/actions';

import { AdminCrud } from './admin-crud';
import { AdminFlash } from './admin-flash';

export async function AccessResourcePage({
  title,
  description,
  permission,
  resource,
}: {
  title: string;
  description: string;
  permission: string;
  resource: 'permissions' | 'roles' | 'tenants' | 'users';
}) {
  const session = await requireSession(permission);
  const result =
    resource === 'permissions'
      ? await listAdminPermissionsAction()
      : resource === 'roles'
        ? await listAdminRolesAction()
        : resource === 'users'
          ? await listAdminUsersAction()
          : await listTenantsAction();
  return (
    <Stack spacing={3}>
      <AdminFlash />
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}
      >
        <div>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {description}
          </Typography>
        </div>
        <Button component="a" href={`/dashboard/access/${resource}/create`} variant="contained">
          Tambah data
        </Button>
      </Box>
      {result.data ? (
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflow: 'hidden' }}>
          <AdminCrud
            resource={resource === 'permissions' ? 'roles/permissions' : resource}
            rows={result.data}
            currentUserId={session.user.id}
            currentUserRoleId={
              session.user.role === 'root_superadmin' ? undefined : session.user.role_id
            }
          />
        </Paper>
      ) : (
        <Typography color="error">{result.error}</Typography>
      )}
    </Stack>
  );
}
