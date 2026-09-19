export interface ProfilePasswordToggleProps {
  label: string;
  visible: boolean;
  onToggle: () => void;
}

import type { UseFormReturn } from 'react-hook-form';

import type { User } from './users';
import type { ChangePasswordValues } from '@/schemas/profile';

export interface PasswordFieldProps {
  label: string;
  name: keyof ChangePasswordValues;
  visible: boolean;
  onToggle: () => void;
  form: UseFormReturn<ChangePasswordValues>;
  placeholder: string;
}

export interface ParticipantProfileFormProps {
  user: Pick<User, 'name' | 'email' | 'image'>;
}
