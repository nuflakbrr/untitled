'use client';

import { useEffect } from 'react';
import { Compass } from 'lucide-react';
import { useTour } from '@reactour/tour';

export const PARTICIPANT_TOUR_STORAGE_KEY = 'eventkan_participant_tour_completed';

export function TourController() {
  const { setIsOpen, setCurrentStep } = useTour();

  useEffect(() => {
    if (localStorage.getItem(PARTICIPANT_TOUR_STORAGE_KEY)) return;
    const timer = setTimeout(() => setIsOpen(true), 700);
    return () => clearTimeout(timer);
  }, [setIsOpen]);

  return (
    <button type="button" onClick={() => { setCurrentStep(0); setIsOpen(true); }} className="group fixed bottom-6 right-6 z-40 flex cursor-pointer items-center gap-2.5 rounded-full bg-[#ff7a45] p-3.5 text-xs font-medium text-white shadow-[0_12px_30px_rgba(255,122,69,.22)] transition-all duration-300 hover:scale-105 hover:bg-[#f2693a] sm:text-sm" title="Panduan Portal Peserta" aria-label="Panduan Portal Peserta">
      <Compass className="h-5 w-5 transition-transform duration-300 group-hover:rotate-45" />
      <span className="hidden pr-1 font-semibold sm:inline">Panduan Portal</span>
    </button>
  );
}
