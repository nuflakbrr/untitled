'use client';

import Link from 'next/link';
import { type FC } from 'react';
import { Star, ArrowRight, MessageSquarePlus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Props {
  count: number;
}

const TestimonialNoticeBanner: FC<Props> = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-[22px] border border-[#ff7a45]/25 bg-[#ffe5d8] p-4 shadow-[0_12px_30px_rgba(17,35,63,.04)] sm:flex-row sm:items-center sm:p-5">
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 shrink-0 rounded-[15px] bg-[#fffdf8]/70 p-2.5 text-[#ff7a45] sm:mt-0">
          <Star className="h-5 w-5 fill-[#ff7a45]" />
        </div>
        <div>
          <h4 className="flex items-center gap-2 text-sm font-extrabold text-[#11233f] sm:text-base">
            <span>Ulasan Event Tersedia</span>
            <span className="rounded-full bg-[#ff7a45] px-2 py-0.5 text-xs font-bold text-white">
              {count} Event
            </span>
          </h4>
          <p className="mt-0.5 text-xs text-[#8d492e] sm:text-sm">
            Anda memiliki {count} event selesai yang telah Anda ikuti. Yuk berikan pengalaman &
            ulasan Anda!
          </p>
        </div>
      </div>
      <Link href="/participant/event-history" className="w-full sm:w-auto shrink-0">
        <Button
          size="sm"
          className="w-full bg-[#11233f] font-bold text-white hover:bg-[#1b3458] sm:w-auto"
        >
          <MessageSquarePlus className="w-4 h-4 mr-1.5" />
          <span>Isi Testimoni Sekarang</span>
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
};

export default TestimonialNoticeBanner;
