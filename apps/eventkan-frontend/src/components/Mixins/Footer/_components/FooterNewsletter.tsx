'use client';

import type { FormEvent } from 'react';

import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { subscribeNewsletter } from '@/app/actions/newsletter';

const FooterNewsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Silakan masukkan alamat email yang valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await subscribeNewsletter(email);
      if (response.success) {
        toast.success(response.message);
        setEmail('');
      } else {
        toast.error(response.message || 'Gagal mendaftar newsletter.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Terjadi kesalahan saat mendaftar newsletter.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[22px] border border-[#111927]/10 bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(17,35,63,.04)] sm:p-7">
      <h2 className="font-display text-xl font-bold text-[#11233f]">Info event terbaru</h2>
      <p className="mt-1 text-sm leading-relaxed text-[#6c7280]">
        Dapatkan notifikasi event baru dan kabar menarik langsung ke email kamu.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="footer-email" className="sr-only">
          Email untuk informasi event terbaru
        </label>
        <input
          id="footer-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nama@email.com"
          required
          disabled={isSubmitting}
          className="min-w-0 flex-1 rounded-full border border-[#111927]/15 bg-[#f6f3eb] px-4 py-3 text-sm text-[#11233f] outline-none transition placeholder:text-[#6c7280]/70 focus:border-[#11233f] focus:ring-3 focus:ring-[#11233f]/15 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#ff7a45] px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#f2693a] disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Memproses...' : 'Langganan'}
        </button>
      </form>
    </div>
  );
};

export default FooterNewsletter;
