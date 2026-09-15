import type { PasswordFieldProps } from '@/interfaces/features/profile';

import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

import PasswordToggle from './PasswordToggle';
import { profileInputClass, profileLabelClass } from '../_constants/profile.constants';

export default function PasswordField({
  label,
  name,
  visible,
  onToggle,
  form,
  placeholder,
}: PasswordFieldProps) {
  const error = form.formState.errors[name];

  return (
    <Field data-invalid={!!error}>
      <FieldLabel className={profileLabelClass}>{label}</FieldLabel>
      <div className="relative">
        <Input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          className={`${profileInputClass} pr-10`}
          {...form.register(name)}
        />
        <PasswordToggle label={label.toLowerCase()} visible={visible} onToggle={onToggle} />
      </div>
      {error && <FieldError errors={[{ message: error.message }]} />}
    </Field>
  );
}
