interface PaymentStatusConfig {
  label: string;
  className: string;
}

const statusConfig: Record<string, PaymentStatusConfig> = {
  WAITING: {
    label: 'Menunggu Pembayaran',
    className: 'border-eventkan-accent/20 bg-eventkan-peach text-eventkan-peach-ink',
  },
  PAID: {
    label: 'Lunas',
    className: 'border-eventkan-green-ink/20 bg-eventkan-green-soft text-eventkan-green-ink',
  },
  FAILED: {
    label: 'Ditolak',
    className: 'border-eventkan-peach-ink/20 bg-eventkan-peach text-eventkan-peach-ink',
  },
  REFUNDED: {
    label: 'Dikembalikan',
    className: 'border-eventkan-navy/15 bg-[#e8edf5] text-eventkan-navy',
  },
};

export const getPaymentStatusConfig = (status: string): PaymentStatusConfig =>
  statusConfig[status] ?? {
    label: status,
    className: 'border-eventkan-ink/10 bg-eventkan-canvas text-eventkan-muted',
  };
