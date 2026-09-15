interface EventHistoryStatusConfig {
  label: string;
  className: string;
}

const statusConfig: Record<string, EventHistoryStatusConfig> = {
  WAITING_PAYMENT: {
    label: 'Menunggu Pembayaran',
    className: 'border-[#ff7a45]/20 bg-[#ffe5d8] text-[#b84a2a]',
  },
  REGISTERED: {
    label: 'Terdaftar',
    className: 'border-[#36784b]/20 bg-[#e5f2e8] text-[#36784b]',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    className: 'border-[#111927]/10 bg-[#f6f3eb] text-[#6c7280]',
  },
  CHECKED_IN: {
    label: 'Hadir',
    className: 'border-[#36784b]/20 bg-[#e5f2e8] text-[#36784b]',
  },
};

export const getEventHistoryStatusConfig = (status: string): EventHistoryStatusConfig =>
  statusConfig[status] ?? {
    label: status,
    className: 'border-[#111927]/10 bg-[#f6f3eb] text-[#6c7280]',
  };
