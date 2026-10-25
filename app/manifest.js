import { asset } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest() {
  return {
    name: 'EMSO – solarne elektrane i punionice',
    short_name: 'EMSO',
    description: 'Solarne elektrane i punionice za električna vozila po sistemu ključ u ruke.',
    lang: 'hr',
    start_url: asset('/'),
    scope: asset('/'),
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0A2344',
    icons: [
      { src: asset('/img/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: asset('/img/icon-512.png'), sizes: '512x512', type: 'image/png' },
      { src: asset('/img/icon-512-maskable.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
