import { z } from 'zod';

export const userSearchSchema = z.object({
  search: z.string().max(100).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const eventSearchSchema = z.object({
  search: z.string().max(100).optional(),
  categoryId: z.string().optional(),
  eventType: z.enum(['ONLINE', 'OFFLINE']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const categorySearchSchema = z.object({
  search: z.string().max(100).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const registrationSearchSchema = z.object({
  search: z.string().max(100).optional(),
  eventId: z.string().optional(),
  status: z.enum(['PENDING', 'REGISTERED', 'CANCELLED', 'WAITLIST']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const permissionSearchSchema = z.object({
  search: z.string().max(100).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const roleSearchSchema = z.object({
  search: z.string().max(100).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const genericSearchSchema = z.object({
  search: z.string().max(100).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export type UserSearchParams = z.infer<typeof userSearchSchema>;
export type EventSearchParams = z.infer<typeof eventSearchSchema>;
export type CategorySearchParams = z.infer<typeof categorySearchSchema>;
export type RegistrationSearchParams = z.infer<typeof registrationSearchSchema>;
export type PermissionSearchParams = z.infer<typeof permissionSearchSchema>;
export type RoleSearchParams = z.infer<typeof roleSearchSchema>;
export type GenericSearchParams = z.infer<typeof genericSearchSchema>;
