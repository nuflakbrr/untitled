'use client';

import type { z } from 'zod';
import type { FC } from 'react';
import type { Control } from 'react-hook-form';
import type { userSchema } from '@/schemas/users';

import { Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '@/components/ui/select';

type RoleSelectProps = {
  control: Control<z.infer<typeof userSchema>>;
  roles: { id: string; name: string }[];
  isCurrentUserSuperAdmin: boolean;
  disabled?: boolean;
};

const RoleSelect: FC<RoleSelectProps> = ({ control, roles, isCurrentUserSuperAdmin, disabled }) => (
  <Controller
    name="roleId"
    control={control}
    render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel>
          Jabatan <span className="text-red-600">*</span>
        </FieldLabel>
        <Select onValueChange={field.onChange} value={field.value || ''} disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jabatan" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem
                key={role.id}
                value={role.id}
                disabled={!isCurrentUserSuperAdmin && role.name.toLowerCase() === 'superadmin'}
              >
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </Field>
    )}
  />
);

export default RoleSelect;
