import { MessageSquare } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

const EmptyEventTestimonials = () => (
  <Card className="rounded-2xl border border-[#E3DACC] bg-white py-6 text-center shadow-xs">
    <CardContent className="flex flex-col items-center space-y-2 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E3DACC] bg-[#FAF9F5]">
        <MessageSquare className="h-5 w-5 text-[#87867F]" />
      </div>
      <p className="text-sm font-semibold text-[#141413]">Belum Ada Ulasan</p>
      <p className="max-w-sm text-xs text-[#87867F]">
        Event ini belum memiliki ulasan dari peserta. Ulasan dapat diberikan oleh peserta yang hadir
        setelah event selesai.
      </p>
    </CardContent>
  </Card>
);

export default EmptyEventTestimonials;
