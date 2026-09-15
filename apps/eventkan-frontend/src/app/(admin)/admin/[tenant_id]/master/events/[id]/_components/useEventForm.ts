'use client';

import type { z } from 'zod';
import type { Resolver } from 'react-hook-form';
import type { eventSchema } from '@/schemas/events';
import type { EventValues } from '@/services/admin/events';
import type { Event, EventSpeaker, EventBenefit } from '@/interfaces/features/events';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { refinedEventSchema } from '@/schemas/events';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent, deleteEvent, updateEvent } from '@/services/admin/events';

export const useEventForm = (initialData: Event | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const speakers = initialData?.speakers || [];
  const benefits = initialData?.benefits || [];

  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(refinedEventSchema) as Resolver<z.infer<typeof eventSchema>>,
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      banner: initialData?.banner || '',
      startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
      endDate: initialData?.endDate ? new Date(initialData.endDate) : new Date(),
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || '',
      location: initialData?.location || '',
      meetingLink: initialData?.meetingLink || '',
      eventType: initialData?.eventType || ('OFFLINE' as EventValues['eventType']),
      registrationDeadline: initialData?.registrationDeadline
        ? new Date(initialData.registrationDeadline)
        : new Date(),
      quota: initialData?.quota ?? 0,
      price: initialData?.price ?? 0,
      status: initialData?.status || ('DRAFT' as EventValues['status']),
      certificateEnabled: initialData?.certificateEnabled || false,
      categoryId: initialData?.categoryId || '',
      createdById: initialData?.createdById || '',
      // Add onlineAttendance mapping
      onlineAttendance: initialData?.onlineAttendance ?? false,
      speakers: speakers.length > 0 ? speakers : [{ ...defaultSpeaker, order: 0 }],
      benefits: benefits.length > 0 ? benefits : [{ ...defaultBenefit, order: 0 }],
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: EventValues) =>
      initialData ? await updateEvent(initialData.id, data) : await createEvent(data),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        router.refresh();
        router.push('/admin/master/events');
      } else {
        toast.error(result.error);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: async (result) => {
      if (result.success) {
        toast.success(result.message);
        await queryClient.invalidateQueries({ queryKey: ['events'] });
        router.refresh();
        router.push('/admin/master/events');
      } else {
        toast.error(result.error);
      }
    },
  });

  const onSubmit = (data: EventValues) => submitMutation.mutate(data);
  const onDelete = () => initialData && deleteMutation.mutate(initialData.id);

  return {
    form,
    onSubmit,
    onDelete,
    isAlertOpen,
    setIsAlertOpen,
    submitMutation,
    deleteMutation,
  };
};

const defaultSpeaker: EventSpeaker = {
  name: '',
  title: '',
  company: '',
  companyUrl: '',
  github: '',
  instagram: '',
  linkedIn: '',
  avatar: '',
  order: 0,
};

const defaultBenefit: EventBenefit = {
  title: '',
  description: '',
  icon: '',
  order: 0,
};
