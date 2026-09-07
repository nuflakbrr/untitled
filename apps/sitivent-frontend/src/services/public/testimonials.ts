'use server';

import type {
  Testimonial,
  TestimonialResponse,
  CreateTestimonialInput,
  TestimoniesPaginationResponse,
} from '@/interfaces/features/testimonials';

import api from '@/lib/api';
import { revalidatePath } from 'next/cache';
import { verifyPermission } from '@/services/admin/security';

export async function submitTestimonial(
  input: CreateTestimonialInput
): Promise<TestimonialResponse> {
  if (!input.rating || input.rating < 1 || input.rating > 5 || !input.comment?.trim())
    return { success: false, message: 'Rating dan ulasan wajib diisi.' };
  try {
    const result = await api.post(
      `/features/v1/testimonials/registration/${input.registrationId}`,
      { rating: input.rating, comment: input.comment.trim() }
    );
    revalidatePath('/participant/event-history');
    revalidatePath('/');
    return { success: true, message: 'Testimoni berhasil disimpan.', data: result.data.data };
  } catch {
    return { success: false, message: 'Gagal menyimpan testimoni.' };
  }
}

export async function getTestimonialByRegistrationId(
  registrationId: string
): Promise<TestimonialResponse> {
  try {
    const data = (await api.get('/features/v1/testimonials/me')).data.data ?? [];
    return {
      success: true,
      data: data.find((item: Testimonial) => item.registrationId === registrationId) ?? null,
    };
  } catch {
    return { success: false, message: 'Gagal mengambil data testimoni.' };
  }
}

export async function getTestimonies(
  page = 1,
  limit = 10,
  search = '',
  eventId?: string
): Promise<TestimoniesPaginationResponse> {
  if (!(await verifyPermission('testimonies.read')))
    return { success: false, data: [], meta: { page, limit, total: 0, lastPage: 0 } };
  // The backend currently exposes participant reviews only; admin listing will use its endpoint when available.
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

export async function getFeaturedTestimonials(limit = 10): Promise<Testimonial[]> {
  try {
    return ((await api.get('/features/v1/testimonials/me')).data.data ?? []).slice(0, limit);
  } catch {
    return [];
  }
}

export async function getEventTestimonials(eventId: string) {
  const data = await getFeaturedTestimonials(100);
  const testimonials = data.filter((item) => item.eventId === eventId);
  return {
    testimonials,
    averageRating: testimonials.length
      ? Number(
          (testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length).toFixed(
            1
          )
        )
      : 0,
    totalCount: testimonials.length,
  };
}
