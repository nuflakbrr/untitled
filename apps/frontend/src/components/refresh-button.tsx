'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/navigation';

import { Iconify } from 'src/components/iconify';

export function RefreshButton() {
  const router = useRouter();
  return (
    <Tooltip title="Muat ulang data">
      <IconButton aria-label="Muat ulang data" onClick={() => router.refresh()} size="small">
        <Iconify icon="solar:refresh-linear" />
      </IconButton>
    </Tooltip>
  );
}
