// Centralna konfiguracija stranice.
// Za produkciju na emso.hr pokrenite: SITE_URL=https://emso.hr node build.mjs
export default {
  siteUrl: 'https://vidknezevic.github.io/emso-solarne-elektrane',
  siteName: 'EMSO e-mobility solutions',
  locale: 'hr_HR',
  lang: 'hr',
  themeColor: '#FFFFFF',

  // Ako se postavi (npr. Formspree / Web3Forms / vlastiti CRM endpoint), obrazac za ponudu
  // šalje JSON POST na ovu adresu. Ako je prazno, otvara se e-mail klijent s ispunjenim upitom.
  formEndpoint: '',

  // Mediji s emso.hr (EMSO-ovi vlastiti logo, video i fotografije). Za produkciju ih kopirajte
  // u src/assets/ i ovdje upišite lokalne putanje.
  media: {
    logo: 'https://emso.hr/files/2024/02/SIMBOL.webp',
    logoSquare: 'https://emso.hr/files/2024/11/EMSO-Logo_Local-SEO.png',
    heroVideo: 'https://emso.hr/files/2024/04/EMSO-Solarna-elektrana-snage-360-kWp-AluK-Tim.mp4',
    heroPoster: 'https://emso.hr/files/2024/03/413490017_261016096835363_2470602542074789762_n.jpg',
    files: 'https://emso.hr/files/2024',
  },

  company: {
    name: 'EMSO e-mobility solutions',
    legalName: 'EMSO e-mobility solutions d.o.o.',
    oib: '74162275661',
    street: 'Matice hrvatske 56',
    postalCode: '10410',
    city: 'Velika Gorica',
    country: 'HR',
    phone: '+385 1 2350 655',
    phoneHref: '+38512350655',
    mobile: '+385 98 444 670',
    mobileHref: '+38598444670',
    whatsapp: '38598444670',
    email: 'info@emso.hr',
    emailSolar: 'solar@emso.hr',
    hours: 'Pon–Pet 08:00–16:00',
    maps: 'https://maps.app.goo.gl/85bydARaxrgUpJ4q6',
    facebook: 'https://www.facebook.com/emsoemobilitysolutions',
    instagram: 'https://www.instagram.com/emso_e_mobility_solutions/',
    youtube: 'https://www.youtube.com/@emsoe-mobilitysolutions',
  },
};
