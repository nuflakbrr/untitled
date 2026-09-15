import type { FC } from 'react';

import { Check } from 'lucide-react';

import type { AboutHeaderProps } from '@/interfaces/features/about';

export const AboutHeader: FC<AboutHeaderProps> = ({ title, subtitle }) => (
  <section className="px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:pt-24">
    <div className="mx-auto grid max-w-295 items-center gap-14 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
      <div className="max-w-190">
        <h1 className="font-display mt-5 max-w-190 text-[clamp(48px,7vw,82px)] font-extrabold leading-[.97] tracking-[-.06em]">
          {title}
        </h1>
        <p className="mt-5 max-w-155 text-lg leading-relaxed text-[#6c7280]">{subtitle}</p>
      </div>

      <div className="relative min-h-125 lg:min-h-135">
        <div className="absolute inset-3 z-0 flex rotate-2 flex-col justify-between overflow-hidden rounded-[32px] border border-[#111927]/12 bg-[#fffdf8] p-4 pb-24 shadow-[0_22px_60px_rgba(17,35,63,.08)] lg:inset-8 lg:p-7 lg:pb-24">
          <span className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-[#ff7a45] opacity-95" />
          <span className="pointer-events-none absolute right-16 top-14 h-19 w-19 rounded-full bg-[#f7df86]" />
          <div className="relative z-10">
            <h2 className="font-display mt-5 max-w-[85%] text-3xl font-extrabold leading-[1.02] tracking-tighter text-[#111927] lg:max-w-90 lg:text-4xl">
              Dari daftar sampai sertifikat.
            </h2>
          </div>
          <div className="relative z-10 mt-8 grid gap-2.5 lg:mt-5">
            {[
              ['01', 'Pendaftaran', 'Peserta mendaftar event'],
              ['02', 'Tiket', 'E-ticket tersimpan di akun'],
              ['03', 'Check-in', 'QR memvalidasi kehadiran'],
              ['04', 'Sertifikat', 'Sertifikat tersedia setelah event'],
            ].map(([step, label, description]) => (
              <div
                key={step}
                className="flex items-center gap-2.5 rounded-[14px] border border-[#111927]/12 bg-[#f6f3eb] p-2.5 lg:gap-3 lg:p-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#11233f] text-[11px] font-extrabold text-white">
                  {step}
                </span>
                <span>
                  <strong className="block text-sm text-[#111927]">{label}</strong>
                  <small className="text-xs text-[#6c7280]">{description}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
        <aside className="absolute right-0 -bottom-24 z-20 w-44 -rotate-3 rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] p-3.5 text-[#111927] shadow-[0_12px_30px_rgba(17,35,63,.1)] sm:-right-5 sm:-bottom-16 sm:w-57.5 sm:-rotate-7 sm:p-4.5 sm:shadow-[0_18px_50px_rgba(17,35,63,.08)]">
          <div className="flex items-center justify-between gap-3">
            <strong className="font-display text-[15px]">E-Ticket</strong>
            <span>●</span>
          </div>
          <div className="mt-4 h-18.5 rounded-xl bg-[repeating-linear-gradient(90deg,#11233f_0_3px,transparent_3px_7px,#11233f_7px_9px,transparent_9px_12px)]" />
          <div className="mt-3 flex justify-between text-[11px] text-[#6c7280]">
            <span>SIT-260912</span>
            <span>GENERAL</span>
          </div>
        </aside>
        <aside className="absolute -bottom-10 left-1 z-20 w-40 rotate-2 rounded-[22px] border border-[#111927]/8 bg-[#bfe4c7] px-3.5 py-3 text-[#111927] shadow-[0_12px_30px_rgba(17,35,63,.1)] sm:-bottom-7 sm:-left-4.5 sm:w-47.5 sm:rotate-5 sm:px-4.5 sm:py-4 sm:shadow-[0_18px_50px_rgba(17,35,63,.08)]">
          <strong className="font-display block text-sm sm:text-[15px]">
            <Check className="mr-1 inline h-4 w-4" />
            Check-in berhasil
          </strong>
          <span className="text-[11px] text-[#46604c] sm:text-xs">Kehadiran tercatat otomatis</span>
        </aside>
      </div>
    </div>
  </section>
);
