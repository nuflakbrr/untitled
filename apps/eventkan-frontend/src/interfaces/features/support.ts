import type { UseFormReturn } from 'react-hook-form';

import type { PaginationMeta } from './common';

export interface SupportMessage {
  id: string;
  email: string;
  phone: string;
  name: string;
  title: string;
  category: string;
  chronology: string;
  status: string; // "PENDING" | "RESOLVED"
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportMessageInput {
  email: string;
  phone: string;
  name: string;
  title: string;
  category: string;
  chronology: string;
}

export interface HelpFormProps {
  form: UseFormReturn<CreateSupportMessageInput>;
  isAuthenticated: boolean;
  isPending: boolean;
  onSubmit: (values: CreateSupportMessageInput) => void;
}

export interface HelpSuccessStateProps {
  onReset: () => void;
}

export interface SupportMessagesResponse {
  success: boolean;
  data?: SupportMessage[];
  meta?: PaginationMeta;
  error?: string;
}

export interface SupportMessageMutationResponse {
  success: boolean;
  data?: SupportMessage;
  error?: string;
}
