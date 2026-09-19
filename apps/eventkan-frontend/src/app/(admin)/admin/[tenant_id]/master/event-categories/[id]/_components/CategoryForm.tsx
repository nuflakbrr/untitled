'use client';

import { type FC } from 'react';
import { Controller } from 'react-hook-form';

import type { CategoryFormProps } from '@/interfaces/features/events';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

import { useEventCategoryForm } from '../../_hooks/useEventCategoryForm';

const CategoryForm: FC<CategoryFormProps> = ({ id }) => {
  const { control, formState, isNew, isLoading, isPending, onCancel, onSubmit } =
    useEventCategoryForm(id);

  if (!isNew && isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nama Kategori</FieldLabel>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input id="name" placeholder="contoh: Seminar Teknologi" {...field} />
            )}
          />
          {formState.errors.name && <FieldError>{formState.errors.name.message}</FieldError>}
        </Field>

        <Field>
          <FieldLabel htmlFor="description">Deskripsi (opsional)</FieldLabel>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                id="description"
                placeholder="Deskripsi singkat tentang kategori ini..."
                rows={3}
                {...field}
              />
            )}
          />
          {formState.errors.description && (
            <FieldError>{formState.errors.description.message}</FieldError>
          )}
        </Field>
      </FieldGroup>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : isNew ? 'Buat Kategori' : 'Simpan Perubahan'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Batal
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
