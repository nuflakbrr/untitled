import { z } from 'zod';

export const updateNameSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  image: z.union([z.literal(''), z.string().url('URL foto profil tidak valid')]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
    newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

export type UpdateNameValues = z.infer<typeof updateNameSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;
