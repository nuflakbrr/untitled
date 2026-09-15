import type { FormEvent } from 'react';

import { Check, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';

export function SecuritySettingsForm({
  currentPassword,
  newPassword,
  confirmPassword,
  pending,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onCancel,
}: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  pending: boolean;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldGroup className="space-y-4">
        <Field>
          <FieldLabel>Kata Sandi Saat Ini</FieldLabel>
          <Input type="password" value={currentPassword} onChange={(event) => onCurrentPasswordChange(event.target.value)} placeholder="Masukkan kata sandi saat ini" required disabled={pending} />
        </Field>
        <Field>
          <FieldLabel>Kata Sandi Baru</FieldLabel>
          <Input type="password" value={newPassword} onChange={(event) => onNewPasswordChange(event.target.value)} placeholder="Minimal 8 karakter" required disabled={pending} />
        </Field>
        <Field>
          <FieldLabel>Konfirmasi Kata Sandi Baru</FieldLabel>
          <Input type="password" value={confirmPassword} onChange={(event) => onConfirmPasswordChange(event.target.value)} placeholder="Ulangi kata sandi baru" required disabled={pending} />
        </Field>
      </FieldGroup>
      <div className="flex justify-end gap-3 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>Batal</Button>
        <Button type="submit" disabled={pending || !currentPassword || newPassword.length < 8 || newPassword !== confirmPassword}>
          {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
          {pending ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
        </Button>
      </div>
    </form>
  );
}
