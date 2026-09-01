import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { requireSession } from 'src/auth/server';
import { listAdminGalleriesAction } from 'src/auth/actions';
import { GalleryTable } from './gallery-table';
export const metadata: Metadata = { title: 'Galeri' };
export default async function GalleriesPage() { await requireSession('galleries.read'); const result = await listAdminGalleriesAction(); return <Stack spacing={3}><Box sx={{display:'flex',justifyContent:'space-between',gap:2,alignItems:'flex-start',flexDirection:{xs:'column',sm:'row'}}}><Box><Typography variant="h4">Galeri</Typography><Typography color="text.secondary" sx={{mt:.75}}>Kelola gambar dan dokumentasi event.</Typography></Box><Button component="a" href="/dashboard/galleries/create" variant="contained">Tambah galeri</Button></Box><Paper variant="outlined" sx={{p:{xs:2,md:3},borderRadius:2,overflow:'hidden'}}>{result.data ? <GalleryTable rows={result.data}/> : <Typography color="error">{result.error}</Typography>}</Paper></Stack>; }
