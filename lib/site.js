// Središnja konfiguracija stranice.
// Adresa se zadaje pri buildu: SITE_URL=https://emso.hr npm run build (vidi next.config.mjs).

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vidknezevic.github.io/emso-solarne-elektrane';
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

// Ako je postavljen (npr. Formspree, Web3Forms ili vlastiti CRM), upit se šalje kao JSON POST.
// Ako je prazan, otvara se e-mail program s ispunjenim upitom prema info@emso.hr.
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || '';

/** Apsolutna adresa stranice (za canonical, Open Graph i strukturirane podatke). */
export const absUrl = (path = '/') => `${SITE_URL}${path === '/' ? '/' : path}`;

/** Putanja do datoteke iz public/ uz basePath (Next ga ne dodaje običnim <img> elementima). */
export const asset = (path) => `${BASE_PATH}${path}`;

export const company = {
  name: 'EMSO e-mobility solutions',
  legalName: 'EMSO e-mobility solutions d.o.o.',
  oib: '74162275661',
  street: 'Matice hrvatske 56',
  postalCode: '10410',
  city: 'Velika Gorica',
  phone: '+385 1 2350 655',
  phoneHref: 'tel:+38512350655',
  mobile: '+385 98 444 670',
  mobileHref: 'tel:+38598444670',
  whatsapp: 'https://wa.me/38598444670',
  email: 'info@emso.hr',
  hours: 'Pon–Pet 08:00–16:00',
  maps: 'https://maps.app.goo.gl/85bydARaxrgUpJ4q6',
  facebook: 'https://www.facebook.com/emsoemobilitysolutions',
  instagram: 'https://www.instagram.com/emso_e_mobility_solutions/',
  youtube: 'https://www.youtube.com/@emsoe-mobilitysolutions',
};

// EMSO-ovi vlastiti mediji s emso.hr. Za produkciju ih kopirajte u public/ i promijenite adrese.
const FILES = 'https://emso.hr/files/2024';
export const media = {
  logo: `${FILES}/02/SIMBOL.webp`,
  logoSquare: `${FILES}/11/EMSO-Logo_Local-SEO.png`,
  heroVideo: `${FILES}/04/EMSO-Solarna-elektrana-snage-360-kWp-AluK-Tim.mp4`,
  heroPoster: `${FILES}/04/EMSO-Solarna-Elektrana-20-kWp-Zadar_1.webp`,
  montageVideo: `${FILES}/04/EMSO-Solarna-elektrana-snage-644-kWp-na-krovu-tvrtke-IVERPAN-d.o.o.mp4`,
  jakusevecVideo: `${FILES}/04/EMSO-Zagreb-Jakusevec-Solarna-elektrana-snage-736-kWp-za-samoopskrbu.mp4`,
  vrsi: `${FILES}/04/EMSO-Solarna-Elektrana-445-kWp-Vrsi_2.webp`,
  zadar: `${FILES}/04/EMSO-Solarna-Elektrana-20-kWp-Zadar_1.webp`,
  house: `${FILES}/03/413490017_261016096835363_2470602542074789762_n.jpg`,
  team: `${FILES}/04/EMSO-Team_2.webp`,
  files: FILES,
};

export const nav = [
  { href: '/', label: 'Solarne elektrane' },
  { href: '/elektro-punionice/', label: 'Elektro punionice' },
  { href: '/poticaji-za-solarne-elektrane-2026/', label: 'Poticaji 2026.' },
  { href: '/vodic-solarne-elektrane-2026/', label: 'Vodič' },
  { href: '/#reference', label: 'Reference' },
  { href: '#kontakt', label: 'Kontakt' },
];
