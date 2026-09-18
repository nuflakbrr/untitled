export const registrationStatus: Record<string, string> = {
  CHECKED_IN: 'Hadir',
  REGISTERED: 'Terdaftar',
  WAITING_PAYMENT: 'Menunggu Pembayaran',
  CANCELLED: 'Dibatalkan',
};

export const paymentStatus: Record<string, string> = {
  WAITING: 'Menunggu Pembayaran',
  PAID: 'Lunas',
  FAILED: 'Ditolak',
  REFUNDED: 'Dikembalikan',
};

export const registrationStatusClass: Record<string, string> = {
  CHECKED_IN: 'bg-eventkan-navy/8 text-eventkan-navy',
  REGISTERED: 'bg-eventkan-green text-eventkan-green-ink',
  WAITING_PAYMENT: 'bg-eventkan-peach text-eventkan-peach-ink',
  CANCELLED: 'bg-eventkan-canvas text-eventkan-muted',
};
