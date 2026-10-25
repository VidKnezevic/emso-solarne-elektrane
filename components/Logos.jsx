import { media } from '@/lib/site';

const F = media.files;
export const SOLAR_PARTNERS = [
  { src: `${F}/03/EMSO-Partneri_E.ON-Hrvatska_logo-300x300.jpg`, alt: 'E.ON Hrvatska', w: 300 },
  { src: `${F}/03/EMSO-Partneri_FUJI-Solar_logo-300x300.png`, alt: 'FUJI SOLAR', w: 300 },
  { src: `${F}/03/EMSO-Partneri_Huawei_logo-300x300.jpeg`, alt: 'Huawei', w: 300 },
  { src: `${F}/03/EMSO-Partneri_JA-Solar_logo.png`, alt: 'JA Solar', w: 400 },
  { src: `${F}/03/EMSO-Partneri_Trina-Solar_logo.jpeg`, alt: 'Trina Solar', w: 400 },
  { src: `${F}/03/EMSO-Partneri_Qcells-Europe_logo.jpeg`, alt: 'Qcells', w: 400 },
  { src: `${F}/03/EMSO-Partneri_SolarEdge_logo.jpeg`, alt: 'SolarEdge', w: 400 },
  { src: `${F}/03/EMSO-Partneri_Sunways_logo.jpeg`, alt: 'Sunways', w: 400 },
];
export const EV_PARTNERS = [
  { src: `${F}/03/T-Mobile_logo_2022.svg-300x300.png`, alt: 'Hrvatski Telekom', w: 300 },
  { src: `${F}/03/Partneri_Logo_ETREL-300x300.png`, alt: 'ETREL', w: 300 },
  { src: `${F}/03/EMSO-Partneri_Logo_EFACEC.jpeg`, alt: 'Efacec', w: 400 },
  { src: `${F}/11/Electrip_logo.png`, alt: 'Electrip', w: 400 },
  { src: `${F}/03/EMSO-Partneri_E.ON-Hrvatska_logo-300x300.jpg`, alt: 'E.ON Hrvatska', w: 300 },
];

export default function Logos({ items }) {
  return (
    <ul className="logos__grid" role="list">
      {items.map((l) => (
        <li key={l.alt}>
          <img src={l.src} width={l.w} height={l.w} alt={l.alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" />
        </li>
      ))}
    </ul>
  );
}
