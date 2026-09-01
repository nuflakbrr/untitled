'use client';

import { useState, useActionState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

import { RouterLink } from 'src/routes/components';

import { ConfirmSubmitButton } from 'src/components/confirm-submit-button';

import { eventCrudAction } from 'src/auth/actions';

type EventValue = {
  id: string;
  title: string;
  description: string;
  banner?: string | null;
  category_id?: string | null;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: string;
  event_type: string;
  registration_deadline: string;
  quota: number;
  price: number;
  certificate_enabled?: boolean;
};
type Category = { id: string; name: string };
export function EventForm({ event, categories }: { event?: EventValue; categories: Category[] }) {
  const [state, action, pending] = useActionState(eventCrudAction, { error: '', success: '' });
  const [banner, setBanner] = useState(event?.banner || '');
  const [speakers, setSpeakers] = useState([
    {
      name: '',
      title: '',
      company: '',
      company_url: '',
      github: '',
      instagram: '',
      linked_in: '',
      avatar: '',
    },
  ]);
  const [benefits, setBenefits] = useState([{ title: '', description: '', icon: '' }]);
  const date = (value?: string) => value?.slice(0, 10);
  return (
    <Box component="form" action={action} sx={{ display: 'grid', gap: 3, width: '100%' }}>
      {event ? <input type="hidden" name="id" value={event.id} /> : null}
      {state.error ? <Alert severity="error">{state.error}</Alert> : null}
      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          display: 'grid',
          gap: 2.5,
          bgcolor: 'background.paper',
        }}
      >
        <Box>
          <Typography variant="h5">Informasi event</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Atur detail utama event, jadwal, dan publikasinya.
          </Typography>
        </Box>
        <Box
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr 1fr' }, gap: 2 }}
        >
          <TextField name="title" label="Nama event" defaultValue={event?.title} required />
          <TextField
            name="start_date"
            label="Tanggal mulai"
            type="date"
            defaultValue={date(event?.start_date)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            name="start_time"
            label="Waktu mulai"
            type="time"
            defaultValue={event?.start_time}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            name="category_id"
            label="Kategori event"
            select
            defaultValue={event?.category_id || ''}
          >
            <MenuItem value="">Tanpa kategori</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="end_date"
            label="Tanggal selesai"
            type="date"
            defaultValue={date(event?.end_date)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            name="end_time"
            label="Waktu selesai"
            type="time"
            defaultValue={event?.end_time}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            name="event_type"
            label="Tipe event"
            select
            defaultValue={event?.event_type || 'OFFLINE'}
          >
            <MenuItem value="OFFLINE">Offline</MenuItem>
            <MenuItem value="ONLINE">Online</MenuItem>
          </TextField>
          <TextField name="status" label="Status" select defaultValue="DRAFT">
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="PUBLISHED">Dipublikasikan</MenuItem>
          </TextField>
          <TextField
            name="location"
            label="Lokasi atau link Zoom"
            defaultValue={event?.location}
            required
          />
          <TextField
            name="registration_deadline"
            label="Batas akhir pendaftaran"
            type="date"
            defaultValue={date(event?.registration_deadline)}
            slotProps={{ inputLabel: { shrink: true } }}
            required
          />
          <TextField
            name="quota"
            label="Kuota peserta"
            type="number"
            defaultValue={event?.quota}
            required
          />
          <TextField
            name="price"
            label="Biaya (IDR)"
            type="number"
            defaultValue={event?.price || 0}
          />
        </Box>
        <TextField
          name="banner"
          label="URL cover / gambar thumbnail"
          value={banner}
          onChange={(input) => setBanner(input.target.value)}
          placeholder="https://..."
        />
        <Box
          sx={{
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 2,
            minHeight: 180,
            display: 'grid',
            placeItems: 'center',
            overflow: 'hidden',
            bgcolor: 'action.hover',
          }}
        >
          {banner ? (
            <Box
              component="img"
              src={banner}
              alt="Preview thumbnail event"
              sx={{ width: '100%', height: 220, objectFit: 'cover' }}
            />
          ) : (
            <Typography color="text.secondary">Preview thumbnail akan tampil di sini</Typography>
          )}
        </Box>
      </Paper>
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: 'background.paper' }}
      >
        <Typography variant="h5">Deskripsi detail event</Typography>
        <TextField
          name="description"
          label="Deskripsi"
          defaultValue={event?.description}
          multiline
          minRows={8}
          required
          fullWidth
          sx={{ mt: 2 }}
        />
      </Paper>
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: 'background.paper' }}
      >
        <Typography variant="h5">Pemateri / narasumber</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5, mb: 2 }}>
          Tambahkan minimal satu pemateri untuk melengkapi informasi event.
        </Typography>
        <input
          type="hidden"
          name="speakers"
          value={JSON.stringify(speakers.filter((speaker) => speaker.name.trim()))}
        />
        {speakers.map((speaker, index) => (
          <Box
            key={index}
            sx={{
              display: 'grid',
              gap: 2,
              mb: 2,
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
            }}
          >
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}
            >
              {Object.entries(speaker).map(([key, value]) => (
                <TextField
                  key={key}
                  label={key.replace('_', ' ')}
                  value={value}
                  required
                  onChange={(input) =>
                    setSpeakers((items) =>
                      items.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, [key]: input.target.value } : item
                      )
                    )
                  }
                />
              ))}
            </Box>
            {speakers.length > 1 ? (
              <Button
                color="error"
                onClick={() =>
                  setSpeakers((items) => items.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                Hapus pemateri
              </Button>
            ) : null}
          </Box>
        ))}
        <Button
          onClick={() =>
            setSpeakers((items) => [
              ...items,
              {
                name: '',
                title: '',
                company: '',
                company_url: '',
                github: '',
                instagram: '',
                linked_in: '',
                avatar: '',
              },
            ])
          }
        >
          Tambah pemateri
        </Button>
      </Paper>
      <Paper
        variant="outlined"
        sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, bgcolor: 'background.paper' }}
      >
        <Typography variant="h5">Benefit event</Typography>
        <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5, mb: 2 }}>
          Tambahkan minimal satu benefit yang didapat peserta.
        </Typography>
        <input
          type="hidden"
          name="benefits"
          value={JSON.stringify(benefits.filter((benefit) => benefit.title.trim()))}
        />
        {benefits.map((benefit, index) => (
          <Box
            key={index}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              mb: 2,
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1.5,
            }}
          >
            <TextField
              label="Judul benefit"
              value={benefit.title}
              required
              onChange={(input) =>
                setBenefits((items) =>
                  items.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, title: input.target.value } : item
                  )
                )
              }
            />
            <TextField
              label="Nama icon"
              value={benefit.icon}
              onChange={(input) =>
                setBenefits((items) =>
                  items.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, icon: input.target.value } : item
                  )
                )
              }
            />
            <TextField
              label="Deskripsi benefit"
              value={benefit.description}
              onChange={(input) =>
                setBenefits((items) =>
                  items.map((item, itemIndex) =>
                    itemIndex === index ? { ...item, description: input.target.value } : item
                  )
                )
              }
              fullWidth
            />
            {benefits.length > 1 ? (
              <Button
                color="error"
                onClick={() =>
                  setBenefits((items) => items.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                Hapus benefit
              </Button>
            ) : null}
          </Box>
        ))}
        <Button
          onClick={() =>
            setBenefits((items) => [...items, { title: '', description: '', icon: '' }])
          }
        >
          Tambah benefit
        </Button>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
        <FormControlLabel
          control={
            <Checkbox name="certificate_enabled" defaultChecked={event?.certificate_enabled} />
          }
          label="Aktifkan sertifikat elektronik"
        />
        <Typography variant="body2" color="text.secondary">
          Berikan sertifikat otomatis setelah event diselesaikan.
        </Typography>
      </Paper>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {event ? (
          <ConfirmSubmitButton
            title="Simpan perubahan?"
            description="Perubahan event akan diterapkan pada event ini."
            disabled={pending}
          >
            Simpan
          </ConfirmSubmitButton>
        ) : (
          <Button type="submit" variant="contained" disabled={pending}>
            Simpan
          </Button>
        )}
        <Button component={RouterLink} href="/dashboard/events">
          Batal
        </Button>
      </Box>
    </Box>
  );
}
