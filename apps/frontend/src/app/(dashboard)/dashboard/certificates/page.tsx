import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import { listAdminEventsAction } from 'src/auth/actions';

import { CertificateTable } from './certificate-table';

export const metadata: Metadata = { title: 'Editor sertifikat' };

export default async function CertificatesPage() {
  await requireSession('certificates.read');
  const result = await listAdminEventsAction();

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Editor sertifikat</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Atur desain dan terbitkan sertifikat untuk setiap event.
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflow: 'hidden' }}>
        {result.data ? (
          <CertificateTable rows={result.data.filter((event) => !event.deleted_at)} />
        ) : (
          <Typography color="error">{result.error}</Typography>
        )}
      </Paper>
    </Stack>
  );
}
