export const validateTestimonial = (rating: number, comment: string): string | null => {
  if (rating < 1 || rating > 5) return 'Silakan berikan rating 1 hingga 5 bintang.';
  if (!comment.trim()) return 'Ulasan tidak boleh kosong.';
  return null;
};
