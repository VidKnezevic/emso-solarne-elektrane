import { SITE_URL, absUrl, asset, company, media } from './site';

const NOINDEX = process.env.NOINDEX === '1';

/**
 * Metapodaci za stranicu: title, description, canonical, hreflang, Open Graph i Twitter kartica.
 * @param {{ title: string, description: string, path: string, ogImage?: string, ogImageAlt?: string, type?: string, robots?: object }} p
 */
export function pageMetadata({ title, description, path, ogImage = 'og-solarne-elektrane.png', ogImageAlt, type = 'website', robots }) {
  const url = absUrl(path);
  const image = { url: `${SITE_URL}/img/${ogImage}`, width: 1200, height: 630, alt: ogImageAlt || title, type: 'image/png' };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: { 'hr-HR': url, 'x-default': url } },
    robots: robots || (NOINDEX ? { index: false, follow: false } : { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }),
    openGraph: { type, siteName: company.name, locale: 'hr_HR', url, title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}

/** Podaci o tvrtki i web stranici (schema.org), na svakoj stranici. */
export const organizationGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HomeAndConstructionBusiness',
      '@id': `${SITE_URL}/#organization`,
      name: company.name,
      legalName: company.legalName,
      alternateName: 'EMSO',
      url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', url: media.logoSquare, width: 130, height: 130 },
      image: `${SITE_URL}/img/og-solarne-elektrane.png`,
      description: 'Projektiranje, opremanje i montaža solarnih elektrana i punionica za električna vozila po sistemu ključ u ruke za kućanstva i tvrtke u cijeloj Hrvatskoj.',
      telephone: company.phone,
      email: company.email,
      taxID: company.oib,
      numberOfEmployees: { '@type': 'QuantitativeValue', value: 17 },
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.street,
        postalCode: company.postalCode,
        addressLocality: company.city,
        addressRegion: 'Zagrebačka županija',
        addressCountry: 'HR',
      },
      hasMap: company.maps,
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '16:00' },
      ],
      areaServed: { '@type': 'Country', name: 'Hrvatska' },
      priceRange: '€€',
      award: 'Nagrada Zeleni Leptir 2023. – kategorija održiva energija i mobilnost',
      contactPoint: [
        { '@type': 'ContactPoint', telephone: company.phone, contactType: 'customer service', areaServed: 'HR', availableLanguage: ['hr', 'en'] },
        { '@type': 'ContactPoint', telephone: company.mobile, contactType: 'sales', areaServed: 'HR', availableLanguage: ['hr'] },
      ],
      sameAs: [company.facebook, company.instagram, company.youtube, 'https://emso.hr/'],
      knowsAbout: ['Solarne elektrane', 'Fotonaponski sustavi', 'Baterijski spremnici energije', 'Punionice za električna vozila', 'E-mobilnost', 'Neto obračun električne energije'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'EMSO – solarne elektrane i punionice',
      inLanguage: 'hr-HR',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

export function breadcrumb(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Solarne elektrane', path: '/' }, ...items].map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: absUrl(b.path),
    })),
  };
}

export function faqPage(path, faqs) {
  return {
    '@type': 'FAQPage',
    '@id': `${absUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.text || f.a } })),
  };
}

export { asset };
