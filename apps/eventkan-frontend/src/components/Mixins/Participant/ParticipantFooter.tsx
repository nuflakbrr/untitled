import type { FC } from 'react';

export const ParticipantFooter: FC = () => (
  <footer className="mx-auto flex w-full max-w-295 flex-col items-center justify-between gap-2 border-t border-eventkan-ink/10 px-4 py-5 text-xs text-eventkan-muted sm:flex-row sm:px-6">
    <p>© {new Date().getFullYear()} EVENTKAN. Seluruh hak cipta dilindungi undang-undang.</p>
    <p>
      Made with <span className="text-eventkan-accent">&#x2665;</span> for better campus events.
    </p>
  </footer>
);
