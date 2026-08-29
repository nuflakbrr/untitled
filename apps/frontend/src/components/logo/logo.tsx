'use client';

import type { LinkProps } from '@mui/material/Link';

import { mergeClasses } from 'minimal-shared/utils';

import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { logoClasses } from './classes';

// ----------------------------------------------------------------------

export type LogoProps = LinkProps & {
  isSingle?: boolean;
  disabled?: boolean;
};

export function Logo({
  sx,
  disabled,
  className,
  href = '/',
  isSingle = false,
  ...other
}: LogoProps) {
  return (
    <LogoRoot
      component={RouterLink}
      href={href}
      aria-label="SITIVENT"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        {
          gap: 1.25,
          width: 'auto',
          height: 40,
          ...(disabled && { pointerEvents: 'none' }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Typography
        component="span"
        aria-hidden="true"
        sx={{
          width: 36,
          height: 36,
          display: 'grid',
          color: 'common.white',
          placeItems: 'center',
          bgcolor: 'primary.main',
          borderRadius: 1.2,
          fontFamily: 'var(--font-barlow)',
          fontWeight: 800,
          fontSize: 22,
          lineHeight: 1,
        }}
      >
        S
      </Typography>
      {!isSingle && (
        <Typography
          component="span"
          sx={{ color: 'text.primary', fontWeight: 800, fontSize: 17, letterSpacing: 0.8 }}
        >
          SITIVENT
        </Typography>
      )}
    </LogoRoot>
  );
}

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  color: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  verticalAlign: 'middle',
}));
