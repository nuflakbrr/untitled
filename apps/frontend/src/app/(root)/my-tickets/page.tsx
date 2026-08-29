'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

export default function PaymentReturnPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (searchParams.toString()) router.replace('/my-tickets');
  }, [router, searchParams]);

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: 2, py: { xs: 12, md: 18 } }}>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', borderRadius: 3 }}>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Typography variant="overline" color="primary.main">
            Konfirmasi pendaftaran
          </Typography>
          <Typography variant="h3">
            {status === 'berhasil' ? 'Pembayaran berhasil' : 'Pembayaran sedang diproses'}
          </Typography>
          <Typography color="text.secondary">
            {status === 'berhasil'
              ? 'Terima kasih! Pendaftaranmu sudah tercatat. Tiket akan aktif setelah sistem menyelesaikan verifikasi pembayaran.'
              : 'Pembayaranmu sudah diterima dan sedang kami periksa. Silakan cek kembali status tiketmu beberapa saat lagi.'}
          </Typography>
          <Button href={paths.participant.dashboard} variant="contained" size="large">
            Buka dashboard saya
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
