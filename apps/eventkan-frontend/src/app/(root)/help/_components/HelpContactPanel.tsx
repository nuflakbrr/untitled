import type { FC } from 'react';

import { Mail, Clock, Phone } from 'lucide-react';

import { siteMetadata } from '@/data/siteMetadata';

const HelpContactPanel: FC = () => (
  <div className="relative overflow-hidden rounded-[28px] bg-[#11233f] p-6 text-white sm:p-8 lg:sticky lg:top-28">
    {/* <div className="pointer-events-none absolute -right-18 -top-18 h-52 w-52 rounded-full border-28 border-white/10" />
    <div className="pointer-events-none absolute -bottom-20 -left-14 h-48 w-48 rounded-full bg-[#ff7a45]/25 blur-2xl" /> */}

    <div className="relative z-10">
      <h2 className="font-display max-w-100 text-[clamp(28px,4vw,42px)] font-extrabold leading-[.98] tracking-tighter">
        Kami siap mendengarkan.
      </h2>
      <p className="mt-4 max-w-95 text-sm leading-relaxed text-white/65">
        Pilih kanal yang paling nyaman atau kirim laporan melalui formulir. Semakin lengkap
        informasinya, semakin cepat kami bisa membantu.
      </p>

      <div className="mt-8 grid gap-3">
        <a
          href={`mailto:${siteMetadata.email}`}
          className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/8 p-4 transition hover:bg-white/12"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#ff7a45] text-white">
            <Mail className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-xs font-bold text-white/55">Email resmi</span>
            <span className="mt-1 block break-all text-sm font-semibold text-white">
              {siteMetadata.email}
            </span>
          </span>
        </a>

        <a
          href={`https://wa.me/${siteMetadata.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/8 p-4 transition hover:bg-white/12"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#bfe4c7] text-[#11233f]">
            <Phone className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-xs font-bold text-white/55">WhatsApp</span>
            <span className="mt-1 block text-sm font-semibold text-white">
              +{siteMetadata.phone}
            </span>
          </span>
        </a>

        <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-white/8 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#f7df86] text-[#11233f]">
            <Clock className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-xs font-bold text-white/55">Jam layanan</span>
            <span className="mt-1 block text-sm font-semibold text-white">
              Senin - Jumat · 09:00 - 17:00
            </span>
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-[18px] bg-white/8 p-4 text-xs leading-relaxed text-white/60">
        Pastikan nomor WhatsApp yang kamu masukkan aktif agar tim kami dapat menghubungimu jika
        laporan membutuhkan detail tambahan.
      </div>
    </div>
  </div>
);

export default HelpContactPanel;
