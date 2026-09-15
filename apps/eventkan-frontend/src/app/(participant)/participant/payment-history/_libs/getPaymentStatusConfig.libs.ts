interface PaymentStatusConfig {
  label: string;
  className: string;
}

const statusConfig: Record<string, PaymentStatusConfig> = {
  WAITING: {
    label: 'Menunggu Pembayaran',
    className: 'border-[#ff7a45]/20 bg-[#ffe5d8] text-[#b84a2a]',
  },
  PAID: {
    label: 'Lunas',
    className: 'border-[#36784b]/20 bg-[#e5f2e8] text-[#36784b]',
  },
  FAILED: {
    label: 'Ditolak',
    className: 'border-[#b84a2a]/20 bg-[#ffe5d8] text-[#b84a2a]',
  },
  REFUNDED: {
    label: 'Dikembalikan',
    className: 'border-[#11233f]/15 bg-[#e8edf5] text-[#11233f]',
  },
};

export const getPaymentStatusConfig = (status: string): PaymentStatusConfig =>
  statusConfig[status] ?? {
    label: status,
    className: 'border-[#111927]/10 bg-[#f6f3eb] text-[#6c7280]',
  };
