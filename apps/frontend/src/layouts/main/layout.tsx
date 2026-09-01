'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { FooterProps } from './footer';
import type { NavMainProps } from './nav/types';
import type { AuthSession } from 'src/auth/types';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { UserMenu } from 'src/components/user-menu';
import { EventSearch } from 'src/components/event-search';
import { ColorModeButton } from 'src/components/color-mode-button';

import { Footer } from './footer';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { navData } from '../nav-config-main';
import { MainSection } from '../core/main-section';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type MainLayoutProps = LayoutBaseProps & {
  session?: AuthSession | null;
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    nav?: {
      data?: NavMainProps['data'];
    };
    main?: MainSectionProps;
    footer?: FooterProps;
  };
};

export function MainLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'md',
  session = null,
}: MainLayoutProps) {
  const isAuthenticated = Boolean(session);
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  const renderHeader = () => {
    const headerSlots: HeaderSectionProps['slots'] = {
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            aria-expanded={open}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              position: 'relative',
              zIndex: theme.zIndex.appBar + 2,
              pointerEvents: 'auto',
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile
            data={navData}
            open={open}
            onClose={onClose}
            slots={{
              bottomArea: !session ? (
                <Box sx={{ display: 'grid', gap: 1, p: 2 }}>
                  <Button
                    component={RouterLink}
                    href={paths.auth.signIn}
                    variant="outlined"
                    onClick={onClose}
                  >
                    Masuk
                  </Button>
                  <Button
                    component={RouterLink}
                    href={paths.auth.signUp}
                    variant="contained"
                    onClick={onClose}
                  >
                    Daftar
                  </Button>
                </Box>
              ) : undefined,
            }}
          />

          {/** @slot Logo */}
          <Logo />
        </>
      ),
      rightArea: (
        <Box sx={{ gap: 1, display: 'flex', alignItems: 'center' }}>
          {/** @slot Nav desktop */}
          <NavDesktop
            data={navData}
            sx={(theme) => ({
              display: 'none',
              [theme.breakpoints.up(layoutQuery)]: { display: 'flex' },
            })}
          />
          <EventSearch />
          <ColorModeButton />
          {session ? (
            <UserMenu session={session} />
          ) : (
            <>
              <Button
                component={RouterLink}
                href={isAuthenticated ? paths.dashboard.root : paths.auth.signIn}
                variant="text"
                sx={{ display: { xs: 'none', sm: 'inline-flex' }, ml: 0.5 }}
              >
                {isAuthenticated ? 'Dashboard' : 'Masuk'}
              </Button>
              <Button
                component={RouterLink}
                href={paths.auth.signUp}
                variant="contained"
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Daftar
              </Button>
            </>
          )}
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={slotProps?.header?.slotProps}
        sx={[
          {
            '--layout-header-mobile-height': '72px',
            '--layout-header-desktop-height': '84px',
            borderBottom: '1px solid transparent',
            bgcolor: 'background.paper',
          },
          ...(Array.isArray(slotProps?.header?.sx) ? slotProps.header.sx : [slotProps?.header?.sx]),
        ]}
      />
    );
  };

  const renderFooter = () => <Footer {...slotProps?.footer} />;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={cssVars}
      sx={sx}
    >
      {renderMain()}
    </LayoutSection>
  );
}
