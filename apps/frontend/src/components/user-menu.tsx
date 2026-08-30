'use client';

import type { AuthSession } from 'src/auth/types';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

import { isAdminSession } from 'src/auth/types';
import { signOutAction } from 'src/auth/actions';

export function UserMenu({ session }: { session: AuthSession }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const close = () => setAnchorEl(null);
  return (
    <>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label="Buka menu pengguna"
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
      >
        <Avatar src={session.user.image ?? undefined} alt={session.user.name}>
          {session.user.name.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          component={RouterLink}
          href={isAdminSession(session) ? paths.dashboard.root : paths.participant.dashboard}
          onClick={close}
        >
          <Iconify icon="solar:home-2-outline" width={20} sx={{ mr: 1.5 }} />
          Dashboard
        </MenuItem>
        <MenuItem component={RouterLink} href={paths.profile} onClick={close}>
          <Iconify icon="solar:user-rounded-outline" width={20} sx={{ mr: 1.5 }} />
          Profil
        </MenuItem>
        <Divider />
        <Box component="form" action={signOutAction}>
          <MenuItem
            component="button"
            type="submit"
            onClick={close}
            sx={{ width: '100%', textAlign: 'left' }}
          >
            <Iconify icon="carbon:logout" width={20} sx={{ mr: 1.5 }} />
            Logout
          </MenuItem>
        </Box>
      </Menu>
    </>
  );
}
