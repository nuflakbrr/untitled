export interface NavbarUser {
  name: string;
  email: string;
  image?: string | null;
}

export interface NavbarMobileMenuProps {
  isAuthenticated: boolean;
  dashboardHref: string;
}

export type ParticipantNavbarProps = {
  user: NavbarUser;
};

export interface UserMenuProps {
  user: NavbarUser;
  isAdmin: boolean;
  tenantId?: string | null;
}

export interface NavbarEventSearchProps {
  scrolled: boolean;
}
