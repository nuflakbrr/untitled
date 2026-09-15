'use server';

import { revalidatePath } from 'next/cache';

import type {
  Testimonial,
  TestimonialResponse,
  CreateTestimonialInput,
} from '@/interfaces/features/testimonials';

import api from '@/lib/api';

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
