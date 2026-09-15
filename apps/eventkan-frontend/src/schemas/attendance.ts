import { z } from 'zod';

export const qrTokenSchema = z.object({
  token: z.string().min(1, 'Token QR Code wajib diisi.'),
});

export type QrTokenValues = z.infer<typeof qrTokenSchema>;
