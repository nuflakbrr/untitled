import { Clock, Calendar, CheckCircle2 } from 'lucide-react';

interface SummaryCardsProps {
  summary: {
    totalRegistered: number;
    totalCheckedIn: number;
    totalPendingPayment: number;
  };
}

const cards = [
  {
    key: 'totalRegistered',
    label: 'Total Terdaftar',
    icon: Calendar,
    iconColor: 'var(--eventkan-accent)',
    bg: 'var(--eventkan-peach)',
    border: 'rgba(255,122,69,.25)',
  },
  {
    key: 'totalCheckedIn',
    label: 'Hadir (Check-In)',
    icon: CheckCircle2,
    iconColor: 'var(--eventkan-green-ink)',
    bg: 'var(--eventkan-green-soft)',
    border: 'rgba(54,120,75,.25)',
  },
  {
    key: 'totalPendingPayment',
    label: 'Menunggu Pembayaran',
    icon: Clock,
    iconColor: '#b84a2a',
    bg: 'var(--eventkan-peach)',
    border: 'rgba(184,74,42,.25)',
  },
] as const;

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = summary[card.key as keyof SummaryCardsProps['summary']];

        return (
          <div
            key={card.key}
            className="flex items-center justify-between rounded-[22px] border border-eventkan-ink/10 bg-eventkan-surface p-5 shadow-[0_18px_50px_rgba(17,35,63,.05)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="space-y-1">
              <p
                className="text-[11px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted"
              >
                {card.label}
              </p>
              <h3
                className="font-display mt-1 text-4xl font-extrabold tracking-[-.04em] text-eventkan-ink"
              >
                {value}
              </h3>
            </div>
            <div
              className="rounded-[15px] p-3.5"
              style={{ background: card.bg, border: `1px solid ${card.border}` }}
            >
              <Icon className="h-6 w-6" style={{ color: card.iconColor }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
