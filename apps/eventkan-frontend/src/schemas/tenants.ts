import { z } from 'zod';

export const tenantSchema = z.object({
  name: z.string().min(1, 'Nama tenant wajib diisi.'),
  slug: z.string().min(1, 'Slug tenant wajib diisi.'),
  code: z.string().min(1, 'Kode tenant wajib diisi.'),
  type: z.enum(['ROOT', 'FACULTY', 'DEPARTMENT', 'UNIT']),
});

export const tenantPaymentGatewaySchema = z.object({
  provider: z.literal('IPAYMU'),
  is_active: z.boolean(),
  api_key: z.string().optional(),
  virtual_account: z.string().optional(),
  env: z.enum(['sandbox', 'production']),
  has_api_key: z.boolean().optional(),
});

export type TenantValues = z.infer<typeof tenantSchema>;
export type TenantPaymentGatewayValues = z.infer<typeof tenantPaymentGatewaySchema>;
