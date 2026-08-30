import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ConfirmAction } from 'src/components/confirm-action';

import { deleteMyAccountAction } from 'src/auth/actions';
import { requireParticipantSession } from 'src/auth/server';

import { PasswordForm } from './password-form';
import { ParticipantProfileForm } from './profile-form';

export default async function ParticipantProfilePage() {
  const session = await requireParticipantSession();

  return (
    <Stack spacing={3} sx={{ maxWidth: 1220, mx: 'auto' }}>
      <Box>
        <Typography variant="h4">Profil saya</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          Perbarui informasi yang digunakan untuk pendaftaran event.
        </Typography>
      </Box>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">Informasi akun</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Email akun tidak dapat diubah dari halaman ini.
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Email: {session.user.email}
          </Typography>
          <ParticipantProfileForm name={session.user.name} image={session.user.image} />
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">Keamanan akun</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Gunakan kata sandi yang kuat dan jangan membagikannya kepada siapa pun.
            </Typography>
          </Box>
          <PasswordForm />
          <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" color="error.main">
              Hapus akun
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Semua akses akun akan dihentikan dan tindakan ini tidak dapat dibatalkan.
            </Typography>
            <ConfirmAction
              label="Hapus akun"
              title="Hapus akun permanen?"
              description="Akun dan aksesmu akan dihapus. Pastikan kamu benar-benar ingin melanjutkan."
              action={deleteMyAccountAction}
              color="error"
            />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
