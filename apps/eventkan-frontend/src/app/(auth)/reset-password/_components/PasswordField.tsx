import type { FC } from 'react';

import { Eye, Lock, EyeOff } from 'lucide-react';

import type { PasswordFieldProps } from '@/interfaces/features/auth';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';

import { getResetPasswordInputClass } from '../_libs/getResetPasswordInputClass.libs';

const PasswordField: FC<PasswordFieldProps> = ({
  error,
  id,
  label,
  onToggle,
  register,
  showPassword,
  valueName,
}) => (
  <Field className="gap-2" data-invalid={!!error}>
    <FieldLabel htmlFor={id} className="text-[13px] font-bold text-[#11233f]">
      {label}
    </FieldLabel>
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6c7280]" />
      <input
        id={id}
        type={showPassword ? 'text' : 'password'}
        placeholder={valueName === 'password' ? 'Minimal 8 karakter' : 'Ulangi password baru'}
        autoComplete="new-password"
        {...register(valueName)}
        className={`${getResetPasswordInputClass(Boolean(error))} pl-11 pr-11`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#6c7280] transition hover:text-[#11233f]"
        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
    {error && <FieldError className="text-xs font-medium text-[#b8473d]">{error}</FieldError>}
  </Field>
);

export default PasswordField;
