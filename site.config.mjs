// Centralna konfiguracija stranice.
// Za produkciju na emso.hr pokrenite: SITE_URL=https://emso.hr node build.mjs
export default {
  siteUrl: 'https://vidknezevic.github.io/emso-solarne-elektrane',
  siteName: 'EMSO e-mobility solutions',
  locale: 'hr_HR',
  lang: 'hr',
  themeColor: '#020A18',

  // Ako se postavi (npr. Formspree / Web3Forms / vlastiti CRM endpoint), obrazac za ponudu
  // šalje JSON POST na ovu adresu. Ako je prazno, otvara se e-mail klijent s ispunjenim upitom.
  formEndpoint: '',

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
