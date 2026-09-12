import type { UseFormRegister } from 'react-hook-form';

import type { ResetPasswordValues } from '@/schemas/auth';

export interface PasswordFieldProps {
  error?: string;
  id: string;
  label: string;
  onToggle: () => void;
  register: UseFormRegister<ResetPasswordValues>;
  showPassword: boolean;
  valueName: 'password' | 'confirmPassword';
}

export interface ForgotPasswordSuccessProps {
  email: string;
  onRetry: () => void;
}
