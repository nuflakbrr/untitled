import { Award, Video, FileDown } from 'lucide-react';

import type { EventHistoryTableProps } from '@/interfaces/features/dashboard';

import { Button } from '@/components/ui/button';
import { formatLongDate } from '@/lib/formatLongDate';
import EmptyState from '@/components/Common/EmptyState';

import { canDownloadCertificate } from '../_libs/canDownloadCertificate.libs';
import { getDashboardStatusStyle } from '../_libs/getDashboardStatusStyle.libs';

const PanelHeader = () => (
  <div className="flex items-center gap-2 border-b border-eventkan-ink/10 px-5 py-4">
    <Award className="h-4 w-4 text-eventkan-accent" />
    <h2 className="font-display text-base font-extrabold text-eventkan-ink">Riwayat Event</h2>
  </div>
);

export default function EventHistoryTable({ history }: EventHistoryTableProps) {
  const panelClass =
    'h-full overflow-hidden rounded-[24px] border border-eventkan-ink/10 bg-eventkan-surface shadow-[0_18px_50px_rgba(17,35,63,.05)]';

  if (history.length === 0) {
    return (
      <EmptyState
        icon={Award}
        title="Belum ada riwayat event"
        description="Anda belum pernah mendaftar ke event apapun."
        action={{ href: '/events', label: 'Jelajahi event' }}
      />
    );
  }

  return (
    <div className={panelClass}>
      <PanelHeader />
      <div className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-eventkan-ink/10 text-[10px] font-extrabold uppercase tracking-[.08em] text-eventkan-muted">
                <th className="pb-3 pr-4">Event</th>
                <th className="px-4 pb-3">Tanggal</th>
                <th className="px-4 pb-3">Status</th>
                <th className="px-4 pb-3">Link Meeting</th>
                <th className="pb-3 pl-4 text-right">Sertifikat</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const canDownload = canDownloadCertificate(
                  item.status,
                  item.event?.certificateEnabled ?? false,
                  item.certificates
                );
                const statusStyle = getDashboardStatusStyle(item.status);

                return (
                  <tr key={item.id} className="border-b border-eventkan-ink/6 last:border-0">
                    <td className="py-4 pr-4">
                      <p className="line-clamp-1 font-display text-sm font-extrabold text-eventkan-ink">
                        {item.event?.title ?? 'Event tidak tersedia'}
                      </p>
                      <p className="mt-0.5 text-xs text-eventkan-muted">{item.registrationNumber}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-eventkan-muted">
                      {item.event ? formatLongDate(item.event.startDate) : '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[.06em]"
                        style={{
                          background: statusStyle.bg,
                          color: statusStyle.color,
                          border: `1px solid ${statusStyle.border}`,
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4">
                      {item.event?.eventType === 'ONLINE' && item.event.meetingLink ? (
                        <Button
                          asChild
                          variant="outline"
                          size="xs"
                          className="h-8 gap-1.5 rounded-full border-eventkan-ink/12"
                        >
                          <a
                            href={item.event.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Video className="h-3.5 w-3.5" /> Gabung
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-[#c4c6c8]">-</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 text-right">
                      {canDownload ? (
                        <Button
                          asChild
                          variant="outline"
                          size="xs"
                          className="h-8 gap-1.5 rounded-full border-eventkan-ink/12"
                        >
                          <a
                            href={item.certificates[0].downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileDown className="h-3.5 w-3.5" /> Unduh
                          </a>
                        </Button>
                      ) : (
                        <span className="text-xs text-[#c4c6c8]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
