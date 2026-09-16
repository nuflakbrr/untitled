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
    <div className="rounded-[22px] border border-eventkan-ink/10 bg-eventkan-surface p-6 shadow-[0_8px_24px_rgba(17,35,63,.04)] sm:p-7">
      <h2 className="font-display text-xl font-bold text-eventkan-navy">Info event terbaru</h2>
      <p className="mt-1 text-sm leading-relaxed text-eventkan-muted">
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
          className="min-w-0 flex-1 rounded-full border border-eventkan-ink/15 bg-eventkan-canvas px-4 py-3 text-sm text-eventkan-navy outline-none transition placeholder:text-eventkan-muted/70 focus:border-eventkan-navy focus:ring-3 focus:ring-eventkan-navy/15 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-eventkan-accent px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-eventkan-accent-hover disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Memproses...' : 'Langganan'}
        </button>
      </form>
    </div>
  );
};

export default FooterNewsletter;
