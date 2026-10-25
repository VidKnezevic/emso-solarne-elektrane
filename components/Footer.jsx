import Link from 'next/link';
import { Icon } from './Icons';
import { company, media } from '@/lib/site';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="ftr" id="kontakt">
      <div className="container">
        <div className="ftr__top">
          <div className="ftr__brand">
            <Link className="logo" href="/" aria-label="EMSO, naslovna">
              <img className="logo__mark" src={media.logo} width="91" height="87" alt="" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
              <span className="logo__text">
                <span className="logo__word">EMSO</span>
                <span className="logo__sub">e-mobility solutions</span>
              </span>
            </Link>
            <address className="ftr__address">
              <strong>{company.legalName}</strong>
              <br />
              {company.street}, {company.postalCode} {company.city}
              <br />
              OIB: {company.oib}
              <br />
              Radno vrijeme: {company.hours}
            </address>
            <ul className="ftr__contacts">
              <li><a href={company.phoneHref}><Icon name="phone" size={16} />{company.phone}</a></li>
              <li><a href={company.mobileHref}><Icon name="phone" size={16} />{company.mobile}</a></li>
              <li><a href={`mailto:${company.email}`}><Icon name="mail" size={16} />{company.email}</a></li>
              <li><a href={company.maps} target="_blank" rel="noopener"><Icon name="pin" size={16} />Karta i upute</a></li>
            </ul>
            <ul className="ftr__social" aria-label="Društvene mreže">
              <li><a href={company.facebook} target="_blank" rel="noopener" aria-label="EMSO na Facebooku"><Icon name="fb" size={18} /></a></li>
              <li><a href={company.instagram} target="_blank" rel="noopener" aria-label="EMSO na Instagramu"><Icon name="ig" size={18} /></a></li>
              <li><a href={company.youtube} target="_blank" rel="noopener" aria-label="EMSO na YouTubeu"><Icon name="yt" size={18} /></a></li>
            </ul>
          </div>
          <nav className="ftr__col" aria-label="Usluge">
            <p className="ftr__h">Usluge</p>
            <ul>
              <li><Link href="/">Solarne elektrane</Link></li>
              <li><Link href="/#tvrtke">Solarne elektrane za tvrtke</Link></li>
              <li><Link href="/elektro-punionice/">Elektro punionice</Link></li>
              <li><Link href="/poticaji-za-solarne-elektrane-2026/">Poticaji FZOEU 2026.</Link></li>
              <li><Link href="/vodic-solarne-elektrane-2026/">Vodič kroz solarne elektrane</Link></li>
              <li><Link href="/#preporuka">Program preporuke</Link></li>
            </ul>
          </nav>
          <nav className="ftr__col" aria-label="EMSO">
            <p className="ftr__h">EMSO</p>
            <ul>
              <li><a href="https://emso.hr/o-nama">O nama</a></li>
              <li><a href="https://emso.hr/reference">Reference</a></li>
              <li><a href="https://emso.hr/karijera">Karijera</a></li>
              <li><a href="https://magazin.emso.hr/">EMSO Magazin</a></li>
              <li><a href="https://emso.hr/kontakt">Kontakt</a></li>
            </ul>
          </nav>
          <nav className="ftr__col" aria-label="EMSO Plus">
            <p className="ftr__h">EMSO Plus+</p>
            <ul>
              <li><a href="https://shop.emso.hr/trgovina/">e-Trgovina, Solar Shop</a></li>
              <li><a href="https://shop.emso.hr/kategorija/solarni-paneli/">Solarni paneli</a></li>
              <li><a href="https://shop.emso.hr/kategorija/solarno-grijanje/">Solarno grijanje</a></li>
              <li><a href="https://osiguranje.emso.hr/">Osiguranje solarnih elektrana</a></li>
            </ul>
          </nav>
        </div>
        <div className="ftr__bottom">
          <p>© {year} {company.legalName} Sva prava pridržana.</p>
          <ul>
            <li><a href="https://emso.hr/pravila-privatnosti">Pravila privatnosti</a></li>
            <li><a href="https://emso.hr/izjava-o-kolacicima">Izjava o kolačićima</a></li>
            <li><a href="https://emso.hr/uvjeti-koristenja">Uvjeti korištenja</a></li>
            <li><a href="https://emso.hr/izjava-o-pristupacnosti">Izjava o pristupačnosti</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
