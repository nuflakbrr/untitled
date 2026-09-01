import type { Metadata } from 'next';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import { listAdminPaymentsAction } from 'src/auth/actions';

import { PaymentTable } from './payment-table';

export const metadata: Metadata = { title: 'Pembayaran' };

export default async function PaymentsPage() {
  await requireSession('payments.read');
  const result = await listAdminPaymentsAction();
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Pembayaran</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Pantau status pembayaran peserta pada event tenant aktif.
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, overflow: 'hidden' }}>
        {result.data ? (
          <PaymentTable rows={result.data} />
        ) : (
          <Typography color="error">{result.error}</Typography>
        )}
      </Paper>
    </Stack>
  );
}
