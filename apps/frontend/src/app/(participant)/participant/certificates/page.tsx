import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { listMyCertificatesAction } from 'src/auth/actions';

function verifyPath(identifier: string) {
  return `${paths.certificates.verify}/${identifier.split('/').map(encodeURIComponent).join('/')}`;
}

export default async function ParticipantCertificatesPage() {
  const result = await listMyCertificatesAction();
  const certificates = result.data ?? [];

  return (
    <Stack spacing={3} sx={{ maxWidth: 1120, mx: 'auto' }}>
      <Box>
        <Typography variant="h4">Sertifikat saya</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Akses sertifikat event yang sudah diterbitkan untukmu.
        </Typography>
      </Box>

      {result.error ? <Typography color="error.main">{result.error}</Typography> : null}
      {!result.error && !certificates.length ? (
        <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', borderRadius: 2 }}>
          <Iconify icon="solar:diploma-verified-bold-duotone" width={42} color="text.disabled" />
          <Typography variant="h5" sx={{ mt: 2 }}>
            Belum ada sertifikat
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Sertifikat akan muncul setelah event selesai dan penyelenggara menerbitkannya.
          </Typography>
        </Paper>
      ) : null}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2,
        }}
      >
        {certificates.map((certificate) => (
          <Paper key={certificate.id} variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Iconify
                  icon="solar:diploma-verified-bold-duotone"
                  width={28}
                  color="primary.main"
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6">{certificate.event_title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {certificate.certificate_number}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Diterbitkan {new Date(certificate.issued_at).toLocaleDateString('id-ID')}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  fullWidth
                  component="a"
                  href={verifyPath(certificate.certificate_number)}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  startIcon={<Iconify icon="solar:eye-outline" />}
                >
                  Lihat sertifikat
                </Button>
                {certificate.download_url ? (
                  <Button
                    fullWidth
                    component="a"
                    href={certificate.download_url}
                    target="_blank"
                    rel="noreferrer"
                    variant="contained"
                    startIcon={<Iconify icon="solar:file-download-outline" />}
                  >
                    Unduh PDF
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Stack>
  );
}
