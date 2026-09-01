import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import { listAdminRegistrationsAction } from 'src/auth/actions';

import { RegistrationTable } from './registration-table';

export const metadata: Metadata = { title: 'Pendaftaran' };
export default async function RegistrationsPage() {
  await requireSession('registrations.read');
  const result = await listAdminRegistrationsAction();
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          alignItems: 'flex-start',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box>
          <Typography variant="h4">Pendaftaran</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Pantau peserta yang terdaftar pada event tenant aktif.
          </Typography>
        </Box>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflow: 'hidden' }}>
        {result.data ? (
          <RegistrationTable rows={result.data} />
        ) : (
          <Typography color="error">{result.error}</Typography>
        )}
      </Paper>
    </Stack>
  );
}
