import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { hasPermission } from 'src/auth/types';
import { requireSession } from 'src/auth/server';
import {
  listTenantsAction,
  listAdminRolesAction,
  listAdminUsersAction,
  listAdminPermissionsAction,
} from 'src/auth/actions';

import { AdminCrud } from './admin-crud';

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
  const session = await requireSession('admin.access');
  const allowed = hasPermission(session, permission);
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
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}
      >
        <div>
          <Typography variant="h4">{title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            {description}
          </Typography>
        </div>
        <Chip
          label={allowed ? 'Akses aktif' : 'Akses terbatas'}
          color={allowed ? 'success' : 'default'}
        />
      </Box>
      <Paper variant="outlined" sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6">Workspace {session.tenant?.name ?? 'Universitas'}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Data yang ditampilkan mengikuti hak akses akun dan organisasi yang sedang dipilih.
        </Typography>
      </Paper>
      {allowed && result.data ? (
        <AdminCrud
          resource={resource === 'permissions' ? 'roles/permissions' : resource}
          rows={result.data}
        />
      ) : null}
    </Stack>
  );
}
