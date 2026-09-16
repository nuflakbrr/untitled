interface EventHistoryStatusConfig {
  label: string;
  className: string;
}

const statusConfig: Record<string, EventHistoryStatusConfig> = {
  WAITING_PAYMENT: {
    label: 'Menunggu Pembayaran',
    className: 'border-eventkan-accent/20 bg-eventkan-peach text-eventkan-peach-ink',
  },
  REGISTERED: {
    label: 'Terdaftar',
    className: 'border-eventkan-green-ink/20 bg-eventkan-green-soft text-eventkan-green-ink',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    className: 'border-eventkan-ink/10 bg-eventkan-canvas text-eventkan-muted',
  },
  CHECKED_IN: {
    label: 'Hadir',
    className: 'border-eventkan-green-ink/20 bg-eventkan-green-soft text-eventkan-green-ink',
  },
};

export const getEventHistoryStatusConfig = (status: string): EventHistoryStatusConfig =>
  statusConfig[status] ?? {
    label: status,
    className: 'border-eventkan-ink/10 bg-eventkan-canvas text-eventkan-muted',
  };
