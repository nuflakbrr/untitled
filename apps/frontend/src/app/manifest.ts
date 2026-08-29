import type { MetadataRoute } from 'next';

import { primary } from 'src/theme';
import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------
// Web app manifest (file convention → /manifest.webmanifest).
// Catatan per-client: untuk PWA penuh tambahkan ikon 192x192 & 512x512.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: CONFIG.appName,
    short_name: CONFIG.appName,
    description: 'Satu pintu untuk menemukan dan mengelola event universitas.',
    start_url: '/',
    display: 'browser',
    background_color: '#F7F8FC',
    theme_color: primary.main,
    icons: [{ src: '/sitivent-mark.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
