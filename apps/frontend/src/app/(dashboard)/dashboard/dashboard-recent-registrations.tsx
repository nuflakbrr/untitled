'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

type Registration = {
  id: string;
  participant: string;
  email: string;
  event: string;
  created_at: string;
};

export function DashboardRecentRegistrations({ registrations }: { registrations: Registration[] }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const items = registrations.slice((page - 1) * pageSize, page * pageSize);
  if (!registrations.length)
    return <Typography color="text.secondary">Belum ada registrasi.</Typography>;
  return (
    <Stack spacing={0} sx={{ minHeight: 0, height: '100%', overflow: 'auto' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1.2fr 0.8fr', md: '1fr 1.2fr 1.4fr 0.8fr' },
          gap: 2,
          px: 1.5,
          py: 1,
          bgcolor: 'background.neutral',
          borderRadius: 1,
        }}
      >
        {['Peserta', 'Email', 'Event', 'Tanggal'].map((label) => (
          <Typography key={label} variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
            {label}
          </Typography>
        ))}
      </Box>
      {items.map((registration) => (
        <Box
          key={registration.id}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1.2fr 0.8fr', md: '1fr 1.2fr 1.4fr 0.8fr' },
            gap: 2,
            alignItems: 'center',
            px: 1.5,
            py: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography noWrap sx={{ fontWeight: 600 }}>
            {registration.participant}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {registration.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {registration.event}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {new Date(registration.created_at).toLocaleDateString('id-ID')}
          </Typography>
        </Box>
      ))}
      {registrations.length > pageSize ? (
        <Pagination
          page={page}
          count={Math.ceil(registrations.length / pageSize)}
          onChange={(_, value) => setPage(value)}
          sx={{ pt: 1 }}
        />
      ) : null}
    </Stack>
  );
}
