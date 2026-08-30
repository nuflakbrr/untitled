import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/global-config';

type Certificate = {
  certificate_number: string;
  participant_name: string;
  event_title: string;
  issuer_faculty: string;
  event_date: string;
  issued_at: string;
  download_url?: string;
};

async function verifyCertificate(identifier: string) {
  const baseUrl = (CONFIG.serverApiUrl ?? CONFIG.apiUrl).replace(/\/+$/, '');
  const response = await fetch(
    `${baseUrl}/features/v1/certificates/verify/${identifier
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`,
    { cache: 'no-store' }
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Certificate API returned ${response.status}`);
  const payload = (await response.json()) as { data?: Certificate };
  return payload.data ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string[] }>;
}): Promise<Metadata> {
  return { title: `Verifikasi Sertifikat ${(await params).id.join('/')}` };
}

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ id: string[] }>;
}) {
  const certificate = await verifyCertificate((await params).id.join('/'));
  if (!certificate) notFound();

  return (
    <Box
      sx={{
        maxWidth: 760,
        mx: 'auto',
        px: { xs: 2, md: 4 },
        pt: { xs: 10, md: 14 },
        pb: { xs: 5, md: 10 },
      }}
    >
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 6 }, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Chip label="Sertifikat terverifikasi" color="success" />
            <Typography variant="h2" sx={{ mt: 2 }}>
              Sertifikat valid
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Dokumen ini terdaftar secara resmi di platform SITIVENT.
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
            <Typography>
              <strong>Nomor sertifikat</strong>
              <br />
              {certificate.certificate_number}
            </Typography>
            <Typography>
              <strong>Nama peserta</strong>
              <br />
              {certificate.participant_name}
            </Typography>
            <Typography>
              <strong>Event</strong>
              <br />
              {certificate.event_title}
            </Typography>
            <Typography>
              <strong>Penerbit</strong>
              <br />
              {certificate.issuer_faculty}
            </Typography>
            <Typography>
              <strong>Tanggal event</strong>
              <br />
              {certificate.event_date}
            </Typography>
            <Typography>
              <strong>Diterbitkan</strong>
              <br />
              {certificate.issued_at}
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
