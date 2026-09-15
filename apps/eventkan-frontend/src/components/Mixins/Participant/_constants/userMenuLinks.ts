import {
  Award,
  CreditCard,
  UserCircle,
  LayoutDashboard,
  type LucideIcon,
} from 'lucide-react';

export type ParticipantUserMenuLink = {
  label: string;
  href: string;
  icon: LucideIcon;
  mobileOnly?: boolean;
  tourTarget?: string;
};

export const participantUserMenuLinks: ParticipantUserMenuLink[] = [
  {
    label: 'Dashboard',
    href: '/participant/dashboard',
    icon: LayoutDashboard,
    mobileOnly: true,
    tourTarget: 'dashboard',
  },
  {
    label: 'Sertifikat',
    href: '/participant/certificates',
    icon: Award,
    mobileOnly: true,
    tourTarget: 'certificates',
  },
  {
    label: 'Riwayat Event',
    href: '/participant/event-history',
    icon: Award,
    mobileOnly: true,
    tourTarget: 'history',
  },
  {
    label: 'Riwayat Pembayaran',
    href: '/participant/payment-history',
    icon: CreditCard,
    mobileOnly: true,
    tourTarget: 'payments',
  },
  {
    label: 'Profil Saya',
    href: '/participant/profile',
    icon: UserCircle,
    tourTarget: 'profile',
  },
];
