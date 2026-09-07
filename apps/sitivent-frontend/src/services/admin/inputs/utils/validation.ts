import type { z } from 'zod';
import type { ServiceResponse } from '@/types/serviceResponse';

export const safeParse = <T>(schema: z.ZodSchema<T>, input: unknown): ServiceResponse<T> => {
  const result = schema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.message };
};
