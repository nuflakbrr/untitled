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
