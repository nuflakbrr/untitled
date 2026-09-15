'use server';

import type {
  Testimonial,
  TestimoniesPaginationResponse,
} from '@/interfaces/features/testimonials';

import api from '@/lib/api';
import { verifyPermission } from '@/services/admin/security';

export async function getTestimonies(
  page = 1,
  limit = 10,
  search = '',
  eventId?: string
): Promise<TestimoniesPaginationResponse> {
  if (!(await verifyPermission('testimonies.read')))
    return { success: false, data: [], meta: { page, limit, total: 0, lastPage: 0 } };

  try {
    const data = (await api.get('/features/v1/testimonials/me')).data.data ?? [];
    const filtered = data
      .filter((item: Testimonial) => !eventId || item.eventId === eventId)
      .filter(
        (item: Testimonial) => !search || item.comment.toLowerCase().includes(search.toLowerCase())
      );

    return {
      success: true,
      data: filtered.slice((page - 1) * limit, page * limit),
      meta: {
        page,
        limit,
        total: filtered.length,
        lastPage: Math.ceil(filtered.length / limit) || 1,
      },
    };
  } catch {
    return { success: false, data: [], meta: { page, limit, total: 0, lastPage: 0 } };
  }
}

export async function deleteTestimonial(
  _id?: string
): Promise<{ success: boolean; message: string }> {
  return { success: false, message: 'Endpoint penghapusan testimoni belum tersedia di backend.' };
}
