'use client';

import Link from 'next/link';
import { Search, Settings, ArrowLeft, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Heading from '@/components/Common/Heading';
import { useTenantId } from '@/hooks/useTenantId';
import { Separator } from '@/components/ui/separator';
import { usePermission } from '@/providers/PermissionProvider';
import { Card, CardTitle, CardHeader, CardContent, CardDescription } from '@/components/ui/card';

import CertificateTemplateForm from './_components/CertificateTemplateForm';
import { useCertificateTemplateEvents } from './_hooks/useCertificateTemplateEvents';

export default function TemplateConfigPage() {
  const tenantId = useTenantId();
  const { hasPermission } = usePermission();
  const canManageTemplates = hasPermission('certificates.create');
  const {
    events,
    filteredEvents,
    selectedEventId,
    selectedEvent,
    setSelectedEventId,
    searchTerm,
    setSearchTerm,
  } = useCertificateTemplateEvents();

  return (
    <section className="mx-auto w-full max-w-375">
      <Heading
        variant="soft"
        title="Konfigurasi Template Sertifikat"
        description="Kelola template sertifikat per event"
        action={
          <Button variant="outline" asChild className="w-full rounded-xl border-eventkan-ink/10 text-eventkan-navy hover:bg-eventkan-canvas sm:w-auto">
            <Link href={`/admin/${tenantId}/master/certificates`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Link>
          </Button>
        }
      />
      <Separator />
      <div className="flex flex-col lg:flex-row gap-4 items-start mt-4">
        <div className="w-full lg:w-64 shrink-0">
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="pb-3 border-b border-eventkan-ink/5 px-4 pt-4">
              <CardTitle className="text-sm font-bold">Pilih Event</CardTitle>
              <CardDescription className="text-xs">
                Event dengan sertifikat diaktifkan
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-eventkan-muted" />
                  <Input
                    type="text"
                    placeholder="Cari event..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    className="pl-8"
                  />
                </div>
              </div>
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-eventkan-muted">
                  <AlertCircle className="h-6 w-6 text-eventkan-muted/50" />
                  <p className="text-xs text-center">
                    Aktifkan fitur sertifikat pada pengaturan event.
                  </p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-eventkan-muted">
                  <AlertCircle className="h-6 w-6 text-eventkan-muted/50" />
                  <p className="text-xs text-center">
                    Tidak ada event yang sesuai dengan pencarian.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-foreground/5 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {filteredEvents.map((event) => {
                    const isSelected = selectedEventId === event.id;
                    const isConfigured = !!event.certificateTemplate;
                    return (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left transition-colors ${
                          isSelected
                            ? 'bg-eventkan-accent/5 border-l-2 border-l-primary'
                            : 'hover:bg-eventkan-canvas/40 border-l-2 border-l-transparent'
                        }`}
                      >
                        <div className="min-w-0 space-y-0.5">
                          <p
                            className={`text-xs font-semibold truncate ${isSelected ? 'text-eventkan-accent' : 'text-eventkan-ink'}`}
                          >
                            {event.title}
                          </p>
                          <div className="flex items-center gap-1">
                            {isConfigured ? (
                              <span className="text-[10px] text-emerald-500 flex items-center gap-0.5">
                                <CheckCircle2 className="h-2.5 w-2.5" /> Terkonfigurasi
                              </span>
                            ) : (
                              <span className="text-[10px] text-eventkan-muted">
                                Belum dikonfigurasi
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight
                          className={`h-3.5 w-3.5 shrink-0 transition-colors ${isSelected ? 'text-eventkan-accent' : 'text-eventkan-muted/40'}`}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          <Card className="shadow-md border-none ring-0">
            <CardHeader className="pb-3 border-b border-eventkan-ink/5">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-eventkan-accent" />
                <div>
                  <CardTitle className="text-base font-bold">Konfigurasi Template</CardTitle>
                  <CardDescription>Background, nomor sertifikat, dan e-signature</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {selectedEventId && selectedEvent && canManageTemplates ? (
                <CertificateTemplateForm
                  eventId={selectedEventId}
                  eventTitle={selectedEvent.title}
                  eventStartDate={selectedEvent.startDate}
                  eventLocation={selectedEvent.location}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-eventkan-muted">
                  <Settings className="h-10 w-10 text-eventkan-muted/30" />
                  <p className="text-sm">
                    {canManageTemplates
                      ? 'Pilih event di panel kiri untuk mulai konfigurasi.'
                      : 'Kamu tidak memiliki izin untuk mengubah template sertifikat.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
