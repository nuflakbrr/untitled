import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';

import { listMyRegistrationsAction } from 'src/auth/actions';

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPrice(price: number) {
  return price === 0 ? 'Gratis' : `Rp ${price.toLocaleString('id-ID')}`;
}

function statusLabel(status: string) {
  return (
    {
      WAITING_PAYMENT: 'Menunggu pembayaran',
      REGISTERED: 'Terdaftar',
      CHECKED_IN: 'Hadir',
      CANCELLED: 'Dibatalkan',
    }[status] ?? status
  );
}

function statusColor(status: string): ChipProps['color'] {
  if (status === 'WAITING_PAYMENT') return 'warning';
  if (status === 'CANCELLED') return 'error';
  if (status === 'REGISTERED' || status === 'CHECKED_IN') return 'success';
  return 'default';
}

export default async function ParticipantTransactionsPage() {
  const result = await listMyRegistrationsAction();
  const registrations = result.data ?? [];

  return (
    <Stack spacing={3} sx={{ maxWidth: 1220, mx: 'auto' }}>
      <Box>
        <Typography variant="h4">Riwayat transaksi</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Lihat seluruh pendaftaran event dan status pembayarannya.
        </Typography>
      </Box>

      {result.error ? <Typography color="error.main">{result.error}</Typography> : null}
      {!result.error && !registrations.length ? (
        <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h5">Belum ada transaksi</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Pendaftaran event yang kamu lakukan akan muncul di sini.
          </Typography>
          <Typography
            component="a"
            href={paths.event.root}
            color="primary.main"
            sx={{ display: 'inline-block', mt: 2, fontWeight: 700 }}
          >
            Jelajahi event
          </Typography>
        </Paper>
      ) : null}
      {registrations.length ? (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
          <Table sx={{ minWidth: 760 }}>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Lokasi</TableCell>
                <TableCell>Metode</TableCell>
                <TableCell>Jumlah</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2">{registration.event_title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {registration.registration_number}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(registration.created_at)}</TableCell>
                  <TableCell>{registration.event_location || 'Belum ditentukan'}</TableCell>
                  <TableCell>{registration.event_type}</TableCell>
                  <TableCell>{formatPrice(registration.price)}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={statusLabel(registration.status)}
                      color={statusColor(registration.status)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : null}
    </Stack>
  );
}
import type { ChipProps } from '@mui/material/Chip';
