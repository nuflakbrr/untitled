'use client';

import { toast } from 'sonner';
import { type FC, useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Edit3, Loader2, MessageSquarePlus } from 'lucide-react';

import type { TestimonialModalProps } from '@/interfaces/features/testimonials';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { submitTestimonial } from '@/services/public/testimonials';
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog';

import TestimonialRating from './TestimonialRating';
import { validateTestimonial } from '../_libs/validateTestimonial.libs';
import { DEFAULT_TESTIMONIAL_RATING } from '../_constants/testimonial.constants';

const TestimonialModal: FC<TestimonialModalProps> = ({
  isOpen,
  onClose,
  registrationId,
  eventTitle,
  existingTestimonial,
}) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(
    existingTestimonial?.rating || DEFAULT_TESTIMONIAL_RATING
  );
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>(existingTestimonial?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (existingTestimonial) {
      setRating(existingTestimonial.rating || DEFAULT_TESTIMONIAL_RATING);
      setComment(existingTestimonial.comment || '');
    } else {
      setRating(DEFAULT_TESTIMONIAL_RATING);
      setComment('');
    }
  }, [existingTestimonial, isOpen]);

  const handleSubmit = async () => {
    const validationError = validateTestimonial(rating, comment);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitTestimonial({
        registrationId,
        rating,
        comment: comment.trim(),
      });

      if (res.success) {
        toast.success(res.message);
        queryClient.invalidateQueries({ queryKey: ['participant-registrations'] });
        onClose();
      } else {
        toast.error(res.message || 'Gagal menyimpan testimoni.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat menyimpan testimoni.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {existingTestimonial ? (
              <>
                <Edit3 className="h-5 w-5 text-indigo-600" />
                Edit Testimoni
              </>
            ) : (
              <>
                <MessageSquarePlus className="h-5 w-5 text-amber-500" />
                Beri Testimoni
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Bagikan pengalaman Anda mengikuti event{' '}
            <span className="font-semibold text-foreground">{eventTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Rating Bintang */}
          <div className="space-y-2">
            <Label>Rating Event</Label>
            <TestimonialRating
              rating={rating}
              hoverRating={hoverRating}
              onRatingChange={setRating}
              onHoverChange={setHoverRating}
            />
          </div>

          {/* Textarea Ulasan */}
          <div className="space-y-2">
            <Label htmlFor="testimonial-comment">Ulasan / Kesan & Pesan</Label>
            <Textarea
              id="testimonial-comment"
              placeholder="Tuliskan ulasan atau kesan dan pesan Anda mengenai event ini..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Kirim Testimoni'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialModal;
