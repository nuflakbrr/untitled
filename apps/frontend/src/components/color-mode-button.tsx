'use client';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';

export function ColorModeButton() {
  const { mode, setMode } = useColorScheme();
  const nextMode = mode === 'dark' ? 'light' : 'dark';

  return (
    <Tooltip title={`Gunakan tema ${nextMode === 'dark' ? 'gelap' : 'terang'}`}>
      <IconButton
        color="inherit"
        aria-label={`Gunakan tema ${nextMode === 'dark' ? 'gelap' : 'terang'}`}
        onClick={() => setMode(nextMode)}
        sx={{ width: 40, height: 40, border: '1px solid', borderColor: 'divider' }}
      >
        <span aria-hidden="true">◐</span>
      </IconButton>
    </Tooltip>
  );
}
