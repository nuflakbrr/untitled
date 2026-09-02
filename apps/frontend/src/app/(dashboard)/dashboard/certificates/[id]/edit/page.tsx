import { notFound } from 'next/navigation';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { requireSession } from 'src/auth/server';
import { listAdminEventsAction, getCertificateTemplateAction } from 'src/auth/actions';

import { CertificateEditor } from '../../certificate-editor';

export default async function CertificateEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession('certificates.create');
  const { id } = await params;
  const [events, template] = await Promise.all([
    listAdminEventsAction(),
    getCertificateTemplateAction(id),
  ]);
  const event = events.data?.find((item) => item.id === id && !item.deleted_at);
  if (!event) notFound();

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Editor sertifikat</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          {event.title}
        </Typography>
      </div>
      {template.error ? (
        <Typography color="error">{template.error}</Typography>
      ) : (
        <CertificateEditor event={event} initialTemplate={template.data} />
      )}
    </Stack>
  );
}
