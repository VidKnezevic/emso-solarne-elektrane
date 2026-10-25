// Statički export za GitHub Pages ili bilo koji statički hosting.
//   npm run build                              → pregled na GitHub Pages
//   SITE_URL=https://emso.hr npm run build     → produkcija
//   SITE_URL=http://localhost:4173 npm run build → lokalni pregled
// FORM_ENDPOINT=https://… postavlja adresu na koju obrazac šalje upite.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE_URL = (process.env.SITE_URL || 'https://vidknezevic.github.io/emso-solarne-elektrane').replace(/\/+$/, '');
const basePath = new URL(SITE_URL).pathname.replace(/\/+$/, '');

/** @type {import('next').NextConfig} */
export default {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: { root: dirname(fileURLToPath(import.meta.url)) },
  env: {
    NEXT_PUBLIC_SITE_URL: SITE_URL,
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_FORM_ENDPOINT: process.env.FORM_ENDPOINT || '',
  },
};
