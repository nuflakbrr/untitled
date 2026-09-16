'use client';

import type { FC } from 'react';

import HelpForm from './HelpForm';
import HelpHero from './HelpHero';
import useHelpForm from '../_hooks/useHelpForm';
import HelpContactPanel from './HelpContactPanel';
import HelpSuccessState from './HelpSuccessState';

const HelpPageClient: FC = () => {
  const { form, handleSubmitMessage, isAuthenticated, isPending, isSuccess, session } =
    useHelpForm();

  return (
    <div className="min-h-screen bg-eventkan-canvas text-eventkan-ink antialiased">
      <HelpHero />

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-295 items-start gap-7 lg:grid-cols-[minmax(260px,.75fr)_minmax(0,1.25fr)]">
          <HelpContactPanel />

          <div>
            {isSuccess ? (
              <HelpSuccessState onReset={() => window.location.reload()} />
            ) : (
              <div className="rounded-[28px] border border-eventkan-ink/10 bg-eventkan-surface p-6 shadow-[0_18px_50px_rgba(17,35,63,.06)] sm:p-8 lg:p-10">
                <div className="mb-7">
                  <h2 className="font-display text-2xl font-extrabold tracking-[-.04em] text-eventkan-navy sm:text-[28px]">
                    Kirim laporan kendala
                  </h2>
                  {isAuthenticated ? (
                    <p className="mt-2 text-sm text-eventkan-muted">
                      Formulir sudah terhubung dengan akun{' '}
                      <span className="font-bold text-eventkan-navy">{session?.user.name}</span>.
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-eventkan-muted">
                      Belum masuk? Isi data kontak secara manual agar kami dapat menghubungimu.
                    </p>
                  )}
                </div>

                <HelpForm
                  form={form}
                  isAuthenticated={isAuthenticated}
                  isPending={isPending}
                  onSubmit={handleSubmitMessage}
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpPageClient;
