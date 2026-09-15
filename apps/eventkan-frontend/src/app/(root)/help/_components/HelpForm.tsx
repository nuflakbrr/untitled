'use client';

import type { FC } from 'react';

import { Send, Loader2 } from 'lucide-react';

import type { HelpFormProps } from '@/interfaces/features/support';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { fieldInputClass } from '../_libs/formStyles.libs';
import { helpCategories } from '../_constants/categories.constants';

const HelpForm: FC<HelpFormProps> = ({
  form,
  isAuthenticated,
  isPending,
  onSubmit,
}) => {
  const { errors } = form.formState;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <FieldGroup className="gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="help-name" className="text-sm font-bold text-[#11233f]">
              Nama lengkap
            </FieldLabel>
            <Input
              id="help-name"
              type="text"
              placeholder="Nama lengkap kamu"
              disabled={isPending || isAuthenticated}
              aria-invalid={!!errors.name}
              className={fieldInputClass}
              {...form.register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="help-email" className="text-sm font-bold text-[#11233f]">
              Email
            </FieldLabel>
            <Input
              id="help-email"
              type="email"
              placeholder="nama@email.com"
              disabled={isPending || isAuthenticated}
              aria-invalid={!!errors.email}
              className={fieldInputClass}
              {...form.register('email')}
            />
            {errors.email && <FieldError errors={[errors.email]} />}
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="help-phone" className="text-sm font-bold text-[#11233f]">
              Nomor WhatsApp
            </FieldLabel>
            <Input
              id="help-phone"
              type="text"
              placeholder="Contoh: 082212345678"
              disabled={isPending}
              aria-invalid={!!errors.phone}
              className={fieldInputClass}
              {...form.register('phone')}
            />
            {errors.phone && <FieldError errors={[errors.phone]} />}
          </Field>

          <Field data-invalid={!!errors.category}>
            <FieldLabel htmlFor="help-category" className="text-sm font-bold text-[#11233f]">
              Kategori masalah
            </FieldLabel>
            <select
              id="help-category"
              disabled={isPending}
              aria-invalid={!!errors.category}
              className={`${fieldInputClass} h-11 w-full outline-none disabled:cursor-not-allowed disabled:opacity-60`}
              {...form.register('category')}
            >
              <option value="">Pilih kategori</option>
              {helpCategories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <FieldError errors={[errors.category]} />}
          </Field>
        </div>

        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="help-title" className="text-sm font-bold text-[#11233f]">
            Judul masalah
          </FieldLabel>
          <Input
            id="help-title"
            type="text"
            placeholder="Contoh: Gagal mengunduh sertifikat event"
            disabled={isPending}
            aria-invalid={!!errors.title}
            className={fieldInputClass}
            {...form.register('title')}
          />
          {errors.title && <FieldError errors={[errors.title]} />}
        </Field>

        <Field data-invalid={!!errors.chronology}>
          <FieldLabel htmlFor="help-chronology" className="text-sm font-bold text-[#11233f]">
            Ceritakan kendalanya
          </FieldLabel>
          <Textarea
            id="help-chronology"
            rows={6}
            placeholder="Ceritakan langkah yang sudah kamu coba dan pesan error yang muncul."
            disabled={isPending}
            aria-invalid={!!errors.chronology}
            className={`${fieldInputClass} min-h-36 resize-none`}
            {...form.register('chronology')}
          />
          {errors.chronology && <FieldError errors={[errors.chronology]} />}
        </Field>
      </FieldGroup>

      <button
        type="submit"
        disabled={isPending}
        className="group inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#11233f] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(17,35,63,.14)] transition hover:-translate-y-0.5 hover:bg-[#1b3458] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? (
          <>
            Mengirim laporan...
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Kirim laporan
            <Send className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
};

export default HelpForm;
