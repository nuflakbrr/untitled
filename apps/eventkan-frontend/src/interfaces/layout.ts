import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface PublicLayoutProps {
  children: ReactNode;
}

export interface EmptyStateAction {
  href: string;
  label: string;
  icon?: LucideIcon;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action?: EmptyStateAction;
}
