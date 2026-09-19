import type { FC } from 'react';

type Props = {
  code?: string;
};

export const FailureResultCard: FC<Props> = ({ code }) => (
  <div className="space-y-3 rounded-2xl border border-eventkan-ink/10 bg-eventkan-surface/70 p-5 text-left text-xs leading-relaxed text-eventkan-muted">
    <p className="font-bold text-eventkan-ink">Panduan Kegagalan:</p>
    <ul className="list-disc pl-4 space-y-1">
      <li>
        {code === 'QR_ALREADY_USED'
          ? 'QR Code ini sudah pernah dipindai sebelumnya dan tidak dapat digunakan kembali.'
          : code === 'NOT_REGISTERED'
            ? 'Peserta belum terdaftar secara sah atau pembayarannya belum lunas.'
            : 'Pastikan QR Code berasal dari tiket event EVENTKAN yang sah dan berstatus aktif.'}
      </li>
      <li>Hubungi administrator atau loket pendaftaran jika terjadi kendala teknis.</li>
    </ul>
  </div>
);
