'use client';

import type { Breakpoint } from '@mui/material/styles';
import type { FooterProps } from './footer';
import type { NavMainProps } from './nav/types';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Iconify } from 'src/components/iconify';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
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
}: MainLayoutProps) {
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const renderHeader = () => {
    const headerSlots: HeaderSectionProps['slots'] = {
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={(theme) => ({
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
            })}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />

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
          <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 1, width: 255, height: 40, px: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 99, color: 'text.secondary' }}>
            <Iconify icon="carbon:search" width={20} />
            <Typography variant="body2" sx={{ flex: 1 }}>Cari</Typography>
            <Typography variant="caption" color="text.secondary">⌘ + K</Typography>
          </Box>
          <ColorModeButton />
          <Button
            component={RouterLink}
            href={paths.auth.signIn}
            variant="contained"
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, ml: 0.5 }}
          >
            Masuk
          </Button>
          <Button component={RouterLink} href={paths.auth.signUp} variant="contained" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Daftar
          </Button>
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
