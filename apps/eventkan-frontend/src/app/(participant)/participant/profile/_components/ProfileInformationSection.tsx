'use client';

import type { ParticipantProfileFormProps } from '@/interfaces/features/users';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel, FieldContent } from '@/components/ui/field';

import { useProfileInformation } from '../_hooks/useProfileInformation';
import { profileInputClass, profileLabelClass } from '../_constants/profile.constants';

export default function ProfileInformationSection({ user }: ParticipantProfileFormProps) {
  const { form, saveProfile, isSaving } = useProfileInformation({ user });

  return (
    <section id="info" className="rounded-[24px] border border-eventkan-ink/10 bg-eventkan-surface p-6.5 shadow-[0_18px_50px_rgba(17,35,63,.08)]">
      <h2 className="font-display text-[22px] font-extrabold tracking-[-.03em] text-eventkan-ink">Informasi Profil</h2>
      <p className="mt-1 text-[13px] text-eventkan-muted">Perbarui informasi akun kamu.</p>
      <form className="mt-3.5" onSubmit={form.handleSubmit((values) => saveProfile(values))}>
        <FieldGroup className="gap-3.5">
          <Field>
            <FieldLabel className={profileLabelClass}>Email</FieldLabel>
            <Input value={user.email} disabled className={profileInputClass} />
            <FieldContent><p className="text-[11px] text-eventkan-muted">Email tidak dapat diubah melalui halaman ini.</p></FieldContent>
          </Field>
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel className={profileLabelClass}>Nama Lengkap</FieldLabel>
            <Input placeholder="Masukkan nama lengkap" className={profileInputClass} {...form.register('name')} />
            {form.formState.errors.name && <FieldError errors={[{ message: form.formState.errors.name.message }]} />}
          </Field>
          <Field data-invalid={!!form.formState.errors.image}>
            <FieldLabel className={profileLabelClass}>Foto Profil</FieldLabel>
            <Input type="url" placeholder="https://..." className={profileInputClass} {...form.register('image')} />
            <FieldContent><p className="text-[11px] text-eventkan-muted">Opsional. Gunakan URL gambar yang bisa diakses publik.</p></FieldContent>
            {form.formState.errors.image && <FieldError errors={[{ message: form.formState.errors.image.message }]} />}
          </Field>
          <div className="flex justify-end pt-1">
            <Button type="submit" disabled={isSaving} className="rounded-full bg-eventkan-accent px-4.5 font-bold text-white hover:bg-[#e86636]">{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
          </div>
        </FieldGroup>
      </form>
    </section>
  );
}
