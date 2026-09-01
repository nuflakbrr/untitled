import type { Metadata } from 'next';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import { listAdminEventsAction } from 'src/auth/actions';

import { AttendanceScanner } from './attendance-scanner';

export const metadata: Metadata = { title: 'Scan QR' };

export default async function AttendancePage() {
  await requireSession('attendance.read');
  const result = await listAdminEventsAction();
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Scan QR</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Verifikasi tiket peserta saat check-in event.
        </Typography>
      </div>
      {result.data ? (
        <AttendanceScanner events={result.data} />
      ) : (
        <Typography color="error">{result.error}</Typography>
      )}
    </Stack>
  );
}
