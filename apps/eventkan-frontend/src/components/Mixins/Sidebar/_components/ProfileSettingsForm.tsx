import type { FormEvent } from 'react';

import { Check, Loader2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';

export function ProfileSettingsForm({
  email,
  name,
  pending,
  onNameChange,
  onSubmit,
  onCancel,
}: {
  email: string;
  name: string;
  pending: boolean;
  onNameChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FieldGroup className="space-y-4">
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input type="email" value={email} required disabled />
        </Field>
        <Field>
          <FieldLabel>Nama Lengkap</FieldLabel>
          <Input
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="Masukkan nama lengkap"
            required
            disabled={pending}
          />
        </Field>
      </FieldGroup>
      <div className="flex justify-end gap-3 border-t border-eventkan-ink/12 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
          Batal
        </Button>
        <Button type="submit" disabled={pending || name.trim() === ''}>
          {pending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>
    </form>
  );
}
