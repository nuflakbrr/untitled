import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

export function Meta({
  icon,
  value,
  sx,
}: {
  icon: 'solar:calendar-date-linear' | 'solar:clock-circle-outline';
  value: string;
  sx?: object;
}) {
  return (
    <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center', ...sx }}>
      <Iconify icon={icon} width={18} />
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
export function formatDate(value: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}
