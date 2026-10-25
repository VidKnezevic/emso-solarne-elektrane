import { preload } from 'react-dom';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileBar from '@/components/MobileBar';
import ScrollManager from '@/components/ScrollManager';
import JsonLd from '@/components/JsonLd';
import { IconSprite } from '@/components/Icons';
import { SITE_URL, asset, company } from '@/lib/site';
import { organizationGraph } from '@/lib/seo';

export const metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  applicationName: 'EMSO',
  authors: [{ name: company.legalName }],
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: asset('/img/favicon.svg'), type: 'image/svg+xml' },
      { url: asset('/img/favicon-32.png'), sizes: '32x32', type: 'image/png' },
    ],
    apple: asset('/img/apple-touch-icon.png'),
  },
  other: { 'geo.region': 'HR-01', 'geo.placename': company.city },
};

// Montserrat (OFL), varijabilni font; latin-ext pokriva č, ć, š, ž i đ pa se preloadaju oba dijela.
const FONTS = [
  {
    file: '/fonts/montserrat-latin-wght-normal.woff2',
    range: 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
  },
  {
    file: '/fonts/montserrat-latin-ext-wght-normal.woff2',
    range: 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF',
  },
];
const fontFaces = FONTS.map(
  (f) => `@font-face{font-family:"Montserrat";font-style:normal;font-weight:100 900;font-display:swap;src:url(${asset(f.file)}) format("woff2");unicode-range:${f.range}}`
).join('');

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }) {
  FONTS.forEach((f) => preload(asset(f.file), { as: 'font', type: 'font/woff2', crossOrigin: '' }));
  return (
    <html lang="hr">
      <head>
        <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
        <link rel="preconnect" href="https://emso.hr" />
      </head>
      <body>
        <IconSprite />
        <a className="skip" href="#main">Preskoči na sadržaj</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <MobileBar />
        <ScrollManager />
        <JsonLd data={organizationGraph} />
      </body>
    </html>
  );
}
