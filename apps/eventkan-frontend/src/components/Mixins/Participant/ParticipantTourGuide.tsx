'use client';

import { TourProvider } from '@reactour/tour';
import { type FC, useState, useEffect } from 'react';

import type { ParticipantTourGuideProps } from '@/interfaces/layout';

import { useIsMobile } from '@/hooks/useMobile';

import { participantTourStyles } from './_constants/tourStyles.constants';
import { getParticipantTourSteps } from './_constants/tourSteps.constants';
import { TourController, PARTICIPANT_TOUR_STORAGE_KEY } from './_components/TourController';

export const ParticipantTourGuide: FC<ParticipantTourGuideProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => setMounted(true), []);

  if (!mounted) return <>{children}</>;

  return (
    <TourProvider
      key={isMobile ? 'mobile' : 'desktop'}
      steps={getParticipantTourSteps(isMobile)}
      styles={participantTourStyles}
      padding={{ popover: [16, 20], mask: [6, 6] }}
      onClickMask={({ setIsOpen }) => setIsOpen(false)}
      beforeClose={() => localStorage.setItem(PARTICIPANT_TOUR_STORAGE_KEY, 'true')}
      nextButton={({ currentStep, stepsLength, setIsOpen, setCurrentStep }) =>
        currentStep === stepsLength - 1 ? (
          <button
            type="button"
            onClick={() => {
              localStorage.setItem(PARTICIPANT_TOUR_STORAGE_KEY, 'true');
              setIsOpen(false);
            }}
            className="shrink-0 cursor-pointer rounded-lg bg-[#ff7a45] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#e96635]"
          >
            Ya, Saya mengerti!
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCurrentStep((step) => step + 1)}
            className="shrink-0 cursor-pointer rounded-lg bg-[#ff7a45] px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#e96635]"
          >
            Lanjut
          </button>
        )
      }
      prevButton={({ currentStep, setCurrentStep }) =>
        currentStep === 0 ? (
          <span className="inline-block w-14 shrink-0" />
        ) : (
          <button
            type="button"
            onClick={() => setCurrentStep((step) => step - 1)}
            className="w-14 shrink-0 cursor-pointer px-2.5 py-1.5 text-left text-xs font-medium text-[#6c7280] transition-colors hover:text-[#11233f]"
          >
            Kembali
          </button>
        )
      }
    >
      {children}
      <TourController />
    </TourProvider>
  );
};
