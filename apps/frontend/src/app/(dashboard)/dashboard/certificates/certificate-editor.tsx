'use client';

import type { CertificateTemplate, CertificateEditorState } from 'src/auth/actions';

import { useMemo, useState, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

import { generateCertificatesAction, saveCertificateTemplateAction } from 'src/auth/actions';

type CertificateEvent = {
  id: string;
  title: string;
  location: string;
  start_date: string;
  status: string;
};

type Signature = CertificateTemplate['signatures'][number];

const initialActionState: CertificateEditorState = { error: '', success: '' };

function defaultTemplate(eventID: string): CertificateTemplate {
  return {
    event_id: eventID,
    background_url: '',
    number_template: 'CERT/{TENANT}/{SLUG}/{REG_NO}',
    number_mode: 'AUTO',
    show_issued_date: true,
    show_event_date: true,
    show_event_location: false,
    show_header: true,
    header_text: 'UNIVERSITAS MANDIRI NUSANTARA',
    header_subtitle: 'Sertifikat Partisipasi Resmi',
    header_font: 'Arial',
    header_color: '#232C40',
    title_font: 'Arial',
    title_color: '#111827',
    content_font: 'Arial',
    content_color: '#374151',
    primary_color: '#0F766E',
    footer_margin_bottom: 0,
    signatures: [],
  };
}

export function CertificateEditor({
  event,
  initialTemplate,
}: {
  event: CertificateEvent;
  initialTemplate: CertificateTemplate | null;
}) {
  const defaults = defaultTemplate(event.id);
  const [template, setTemplate] = useState<CertificateTemplate>(() => ({
    ...defaults,
    ...initialTemplate,
    header_font: initialTemplate?.header_font || defaults.header_font,
    header_color: initialTemplate?.header_color || defaults.header_color,
    title_font: initialTemplate?.title_font || defaults.title_font,
    title_color: initialTemplate?.title_color || defaults.title_color,
    content_font: initialTemplate?.content_font || defaults.content_font,
    content_color: initialTemplate?.content_color || defaults.content_color,
    primary_color: initialTemplate?.primary_color || defaults.primary_color,
  }));
  const [saveState, saveAction, saving] = useActionState(
    saveCertificateTemplateAction,
    initialActionState
  );
  const [generateState, generateAction, generating] = useActionState(
    generateCertificatesAction,
    initialActionState
  );
  const signaturesJSON = useMemo(
    () => JSON.stringify(template.signatures.map((signature, order) => ({ ...signature, order }))),
    [template.signatures]
  );
  const setField = <K extends keyof CertificateTemplate>(field: K, value: CertificateTemplate[K]) =>
    setTemplate((current) => ({ ...current, [field]: value }));
  const setSignature = (index: number, field: keyof Signature, value: string | number) =>
    setTemplate((current) => ({
      ...current,
      signatures: current.signatures.map((signature, position) =>
        position === index ? { ...signature, [field]: value } : signature
      ),
    }));

  return (
    <Box sx={{ display: 'grid', gap: 3 }}>
      {saveState.error || generateState.error ? (
        <Alert severity="error">{saveState.error || generateState.error}</Alert>
      ) : null}
      {saveState.success || generateState.success ? (
        <Alert severity="success">{generateState.success || saveState.success}</Alert>
      ) : null}

      <Box
        component="form"
        id="certificate-template-form"
        action={saveAction}
        sx={{
          display: 'grid',
          gap: 3,
          alignItems: 'start',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(420px, 0.8fr) minmax(620px, 1.2fr)' },
        }}
      >
        <input type="hidden" name="event_id" value={event.id} />
        <input type="hidden" name="signatures" value={signaturesJSON} />

        <Stack spacing={2.5}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6">Identitas sertifikat</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
              Atur latar, nomor sertifikat, dan identitas penyelenggara.
            </Typography>
            <Stack spacing={2}>
              <TextField
                name="background_url"
                label="URL gambar latar"
                type="url"
                value={template.background_url}
                onChange={(input) => setField('background_url', input.target.value)}
                helperText="Gunakan gambar landscape rasio A4 (842 × 595)."
                fullWidth
              />
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { sm: '1fr 160px' } }}>
                <TextField
                  name="number_template"
                  label="Format nomor sertifikat"
                  value={template.number_template}
                  onChange={(input) => setField('number_template', input.target.value)}
                  helperText="Variabel: {TENANT}, {SLUG}, {REG_NO}"
                  required
                  fullWidth
                />
                <FormControl>
                  <InputLabel id="certificate-number-mode-label">Penomoran</InputLabel>
                  <Select
                    labelId="certificate-number-mode-label"
                    name="number_mode"
                    label="Penomoran"
                    value={template.number_mode}
                    onChange={(input) =>
                      setField('number_mode', input.target.value as 'AUTO' | 'MANUAL')
                    }
                  >
                    <MenuItem value="AUTO">Otomatis</MenuItem>
                    <MenuItem value="MANUAL">Manual</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    name="show_header"
                    checked={template.show_header}
                    onChange={(_, checked) => setField('show_header', checked)}
                  />
                }
                label="Tampilkan identitas penyelenggara"
              />
              {template.show_header ? (
                <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { sm: '1fr 1fr' } }}>
                  <TextField
                    name="header_text"
                    label="Nama penyelenggara"
                    value={template.header_text}
                    onChange={(input) => setField('header_text', input.target.value)}
                    fullWidth
                  />
                  <TextField
                    name="header_subtitle"
                    label="Subjudul"
                    value={template.header_subtitle}
                    onChange={(input) => setField('header_subtitle', input.target.value)}
                    fullWidth
                  />
                </Box>
              ) : null}
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6">Tampilan teks</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2.5 }}>
              Sesuaikan warna dan tipografi dengan identitas organisasi.
            </Typography>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { sm: '1fr 112px' } }}>
              <TextField
                name="header_font"
                label="Font header"
                value={template.header_font}
                onChange={(input) => setField('header_font', input.target.value)}
              />
              <TextField
                name="header_color"
                label="Warna header"
                type="color"
                value={template.header_color}
                onChange={(input) => setField('header_color', input.target.value)}
              />
              <TextField
                name="title_font"
                label="Font judul"
                value={template.title_font}
                onChange={(input) => setField('title_font', input.target.value)}
              />
              <TextField
                name="title_color"
                label="Warna judul"
                type="color"
                value={template.title_color}
                onChange={(input) => setField('title_color', input.target.value)}
              />
              <TextField
                name="content_font"
                label="Font isi"
                value={template.content_font}
                onChange={(input) => setField('content_font', input.target.value)}
              />
              <TextField
                name="content_color"
                label="Warna isi"
                type="color"
                value={template.content_color}
                onChange={(input) => setField('content_color', input.target.value)}
              />
              <TextField label="Warna aksen" value="Warna nama peserta" disabled />
              <TextField
                name="primary_color"
                label="Warna aksen"
                type="color"
                value={template.primary_color}
                onChange={(input) => setField('primary_color', input.target.value)}
              />
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6">Informasi tambahan</Typography>
            <Stack sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="show_event_date"
                    checked={template.show_event_date}
                    onChange={(_, checked) => setField('show_event_date', checked)}
                  />
                }
                label="Tampilkan tanggal event"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="show_event_location"
                    checked={template.show_event_location}
                    onChange={(_, checked) => setField('show_event_location', checked)}
                  />
                }
                label="Tampilkan lokasi event"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="show_issued_date"
                    checked={template.show_issued_date}
                    onChange={(_, checked) => setField('show_issued_date', checked)}
                  />
                }
                label="Tampilkan tanggal terbit"
              />
              <TextField
                name="footer_margin_bottom"
                label="Jarak footer dari bawah"
                type="number"
                value={template.footer_margin_bottom}
                onChange={(input) => setField('footer_margin_bottom', Number(input.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 200 } }}
                sx={{ mt: 2 }}
              />
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">Penandatangan</Typography>
                <Typography variant="body2" color="text.secondary">
                  Maksimal empat tanda tangan.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                disabled={template.signatures.length >= 4}
                onClick={() =>
                  setField('signatures', [
                    ...template.signatures,
                    { name: '', title: '', signature_url: '', order: template.signatures.length },
                  ])
                }
              >
                Tambah
              </Button>
            </Box>
            <Stack spacing={2} sx={{ mt: 2.5 }} divider={<Divider flexItem />}>
              {template.signatures.length ? (
                template.signatures.map((signature, index) => (
                  <Box key={`${signature.id ?? 'new'}-${index}`} sx={{ display: 'grid', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>Penandatangan {index + 1}</Typography>
                      <IconButton
                        aria-label={`Hapus penandatangan ${index + 1}`}
                        color="error"
                        onClick={() =>
                          setField(
                            'signatures',
                            template.signatures.filter((_, position) => position !== index)
                          )
                        }
                      >
                        <Iconify icon="solar:trash-bin-trash-linear" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { sm: '1fr 1fr' } }}>
                      <TextField
                        label="Nama lengkap"
                        value={signature.name}
                        onChange={(input) => setSignature(index, 'name', input.target.value)}
                        required
                      />
                      <TextField
                        label="Jabatan"
                        value={signature.title}
                        onChange={(input) => setSignature(index, 'title', input.target.value)}
                      />
                    </Box>
                    <TextField
                      label="URL gambar tanda tangan"
                      type="url"
                      value={signature.signature_url}
                      onChange={(input) => setSignature(index, 'signature_url', input.target.value)}
                      required
                      fullWidth
                    />
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">Belum ada penandatangan.</Typography>
              )}
            </Stack>
          </Paper>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            position: { xl: 'sticky' },
            top: { xl: 104 },
          }}
        >
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <div>
              <Typography variant="h6">Preview sertifikat</Typography>
              <Typography variant="body2" color="text.secondary">
                Preview menggunakan data contoh peserta.
              </Typography>
            </div>
            <Typography variant="caption" color="text.secondary">
              A4 landscape
            </Typography>
          </Box>
          <CertificatePreview event={event} template={template} />
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
            Hasil PDF dapat sedikit berbeda mengikuti font yang tersedia di generator.
          </Typography>
        </Paper>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          display: 'flex',
          gap: 1.5,
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <Button component="a" href={paths.dashboard.certificates} color="inherit">
          Batal
        </Button>
        <Button
          type="submit"
          form="certificate-template-form"
          variant="contained"
          disabled={saving}
        >
          {saving ? 'Menyimpan...' : 'Simpan template'}
        </Button>
        <Box component="form" action={generateAction}>
          <input type="hidden" name="event_id" value={event.id} />
          <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
            <Button
              type="submit"
              variant="outlined"
              disabled={
                generating ||
                (!initialTemplate && !saveState.success) ||
                event.status !== 'COMPLETED'
              }
            >
              {generating ? 'Memproses...' : 'Terbitkan sertifikat'}
            </Button>
            {event.status !== 'COMPLETED' ? (
              <Typography variant="caption" color="text.secondary">
                Sertifikat baru dapat diterbitkan setelah event selesai.
              </Typography>
            ) : null}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

function CertificatePreview({
  event,
  template,
}: {
  event: CertificateEvent;
  template: CertificateTemplate;
}) {
  const details = [
    template.show_event_date
      ? new Date(event.start_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '',
    template.show_event_location ? event.location : '',
  ].filter(Boolean);

  return (
    <Box
      role="img"
      aria-label="Preview template sertifikat"
      sx={{
        width: '100%',
        aspectRatio: '842 / 595',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'common.white',
        color: template.content_color,
        fontFamily: template.content_font || 'Arial, sans-serif',
        backgroundImage: template.background_url ? `url(${template.background_url})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, p: '5.5%', textAlign: 'center' }}>
        {template.show_header ? (
          <Box sx={{ color: template.header_color, fontFamily: template.header_font }}>
            <Typography sx={{ fontSize: 'clamp(10px, 1.7vw, 24px)', fontWeight: 700 }}>
              {template.header_text}
            </Typography>
            <Typography sx={{ fontSize: 'clamp(7px, 1vw, 14px)', mt: 0.5 }}>
              {template.header_subtitle}
            </Typography>
          </Box>
        ) : null}
        <Typography
          sx={{
            mt: '6%',
            color: template.title_color,
            fontFamily: template.title_font,
            fontSize: 'clamp(18px, 3vw, 42px)',
            fontWeight: 800,
            letterSpacing: '0.08em',
          }}
        >
          SERTIFIKAT
        </Typography>
        <Typography sx={{ fontSize: 'clamp(7px, 1.15vw, 16px)', mt: '2%' }}>
          Diberikan kepada
        </Typography>
        <Typography
          sx={{
            color: template.primary_color,
            fontSize: 'clamp(14px, 2.5vw, 34px)',
            fontWeight: 800,
            mt: '1%',
          }}
        >
          Nama Peserta
        </Typography>
        <Typography sx={{ fontSize: 'clamp(7px, 1.15vw, 16px)', mt: '2%' }}>
          atas partisipasinya dalam
        </Typography>
        <Typography sx={{ fontSize: 'clamp(10px, 1.7vw, 23px)', fontWeight: 700, mt: '1%' }}>
          {event.title}
        </Typography>
        {details.length ? (
          <Typography sx={{ fontSize: 'clamp(6px, 0.9vw, 13px)', mt: '1%' }}>
            {details.join(' · ')}
          </Typography>
        ) : null}
        <Box
          sx={{
            position: 'absolute',
            left: '6%',
            right: '6%',
            bottom: `${7 + template.footer_margin_bottom / 12}%`,
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: 'left' }}>
            <Box
              sx={{ width: 42, height: 42, border: '1px dashed', borderColor: 'text.disabled' }}
            />
            <Typography sx={{ fontSize: 'clamp(5px, 0.7vw, 10px)', fontWeight: 700, mt: 0.5 }}>
              CERT/FTI/EVENT/REG-001
            </Typography>
            {template.show_issued_date ? (
              <Typography sx={{ fontSize: 'clamp(5px, 0.65vw, 9px)' }}>
                Diterbitkan hari ini
              </Typography>
            ) : null}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '4%', flex: 1 }}>
            {template.signatures.map((signature, index) => (
              <Box
                key={`${signature.name}-${index}`}
                sx={{ width: `${80 / Math.max(template.signatures.length, 1)}%`, maxWidth: 150 }}
              >
                {signature.signature_url ? (
                  <Box
                    component="img"
                    src={signature.signature_url}
                    alt=""
                    sx={{
                      height: 'clamp(24px, 4vw, 56px)',
                      maxWidth: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Box sx={{ height: 'clamp(24px, 4vw, 56px)' }} />
                )}
                <Typography sx={{ fontSize: 'clamp(5px, 0.75vw, 10px)', fontWeight: 700 }} noWrap>
                  {signature.name || 'Nama penandatangan'}
                </Typography>
                <Typography sx={{ fontSize: 'clamp(5px, 0.65vw, 9px)' }} noWrap>
                  {signature.title || 'Jabatan'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
