import type { ReactNode } from 'react';

export interface Heading {
  title: string;
  description: string;
  titleSuffix?: ReactNode;
  action?: ReactNode;
  variant?: 'default' | 'soft';
}
