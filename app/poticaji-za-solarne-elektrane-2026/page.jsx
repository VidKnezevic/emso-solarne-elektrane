import Link from 'next/link';
import SubsidyCalculator from '@/components/SubsidyCalculator';
import InquiryForm from '@/components/InquiryForm';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { absUrl, SITE_URL } from '@/lib/site';
import { breadcrumb, faqPage, pageMetadata } from '@/lib/seo';

const PATH = '/poticaji-za-solarne-elektrane-2026/';
const TITLE = 'Poticaji za solarne elektrane 2026. – FZOEU do 50 % | EMSO';
const DESCRIPTION = 'FZOEU poticaji 2026: do 50 % (70 %) sufinanciranja, do 6.000 € za solarnu elektranu i 5.600 € za bateriju. Iznosi, uvjeti, 0 % PDV-a i kalkulator poticaja.';
const SOURCE = 'https://www.fzoeu.hr/hr/od-2-rujna-krecu-prijave-za-38-milijuna-eura-poticaja-za-obnovljive-izvore-energije-u-obiteljskim-kucama/10827';

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  type: 'article',
  ogImage: 'og-poticaji-2026.png',
  ogImageAlt: 'Poticaji za solarne elektrane 2026. – FZOEU do 50 % sufinanciranja',
});

const TOC = [
  ['koliko', 'Koliko iznosi poticaj?'],
  ['visa-stopa', 'Tko ima pravo na 70 %?'],
  ['kalkulator-poticaja', 'Kalkulator poticaja'],
  ['prijava', 'Kako do poticaja'],
  ['pdv', '0 % PDV-a na panele'],
  ['neto', 'Neto obračun od 2026.'],
];

const TIMELINE = [
  { title: 'Pripremite NIAS vjerodajnicu', text: 'Za prijavu je potrebna vjerodajnica Nacionalnog identifikacijskog i autentifikacijskog sustava (NIAS) značajne razine sigurnosti. Provjerite je na vrijeme.' },
  { title: 'Zatražite ponudu i dokumentaciju', text: 'EMSO priprema ponudu i projektnu dokumentaciju za vašu elektranu i bateriju, sa snagom, opremom i troškovima koji vam trebaju za prijavu.' },
  { title: 'Prijavite se na javni poziv', text: 'Prijava se podnosi elektronički, prema uputama iz javnog poziva. Jednom prijavom možete obuhvatiti elektranu, bateriju i dizalicu topline.' },
  { title: 'Ugradnja i priključenje', text: 'Montiramo elektranu, najčešće u jednom danu, i vodimo postupak s HEP ODS-om do potvrde za trajni pogon.' },
  { title: 'Dokazi i isplata', text: 'Prema uputama iz poziva dostavljate račune i dokaze o provedbi ulaganja, a Fond isplaćuje odobrena sredstva.' },
];

const FAQS = [
  { q: 'Koliko iznosi poticaj za solarnu elektranu u 2026.?', a: 'Do 50 % opravdanih troškova, najviše 600 € po kilovatu instalirane snage i ukupno najviše 6.000 €. Kućanstva u riziku od energetskog siromaštva mogu ostvariti do 70 %, odnosno do 840 € po kilovatu i najviše 8.400 €.' },
  { q: 'Može li se dobiti poticaj za baterijski spremnik?', a: 'Da, u 2026. prvi put. Baterijski sustavi sufinanciraju se do 350 € po kWh kapaciteta, najviše 5.600 € (do 490 €/kWh i 7.840 € za kućanstva u riziku od energetskog siromaštva). Bateriju je moguće prijaviti samo zajedno s fotonaponskom elektranom.' },
  { q: 'Tko ima pravo na višu stopu od 70 %?', a: 'Kućanstva čiji prosječni mjesečni ekvivalentni dohodak iz 2025. godine ne prelazi 1.341,42 € po članu kućanstva.' },
  { q: 'Kada su otvorene prijave?', a: 'Prijave na javni poziv FZOEU otvorene su 2. rujna 2026. u 9 sati. Sredstva se dodjeljuju prema uvjetima poziva, pa aktualni status uvijek provjerite na stranicama Fonda.' },
  { q: 'Mogu li dobiti poticaj ako sam elektranu već ugradio?', a: 'Prema najavi Fonda, poziv omogućuje i retroaktivno sufinanciranje, namijenjeno građanima koji nisu čekali novi ciklus poticaja, nego su projekt proveli u međuvremenu. Koji su troškovi prihvatljivi i od kojeg datuma, propisano je tekstom javnog poziva.' },
  { q: 'Mogu li jednom prijavom tražiti poticaj za elektranu, bateriju i dizalicu topline?', a: 'Da, istom prijavom moguće je obuhvatiti kombinaciju dizalice topline, fotonaponske elektrane i baterijskog sustava.' },
  { q: 'Plaća li se PDV na solarne panele?', a: 'Za kućanstva ne. Na isporuku i ugradnju solarnih panela na privatnim kućama i stambenim zgradama primjenjuje se nulta stopa PDV-a.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${absUrl(PATH)}#article`,
      headline: 'Poticaji za solarne elektrane 2026. – FZOEU do 50 %',
      description: DESCRIPTION,
      image: `${SITE_URL}/img/og-poticaji-2026.png`,
      inLanguage: 'hr-HR',
      datePublished: '2026-10-23',
      dateModified: '2026-10-25',
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      mainEntityOfPage: absUrl(PATH),
      about: ['Poticaji FZOEU 2026.', 'Solarne elektrane', 'Baterijski spremnici', 'Neto obračun'],
      citation: SOURCE,
    },
    faqPage(PATH, FAQS),
  ],
};

export default function SubsidyPage() {
  return (
    <>
      <section className="subhero" aria-labelledby="sub-title">
        <div className="container subhero__grid">
          <div>
            <ol className="crumbs" aria-label="Putanja">
              <li><Link href="/">Solarne elektrane</Link></li>
              <li aria-current="page">Poticaji 2026.</li>
            </ol>
            <h1 className="h1" id="sub-title">Poticaji za solarne elektrane 2026.</h1>
            <p className="small" style={{ marginTop: 8 }}>Ažurirano u listopadu 2026.</p>
            <p className="lead subhero__lead">
              Fond za zaštitu okoliša i energetsku učinkovitost (FZOEU) 2. rujna 2026. otvorio je javni poziv vrijedan 38 milijuna eura za obiteljske kuće. Sufinanciraju se fotonaponske elektrane, dizalice topline i, prvi put, baterijski spremnici energije.
            </p>
            <div className="subhero__ctas">
              <a className="btn btn--primary btn--lg" href="#ponuda">Zatražite ponudu s poticajem</a>
              <a className="btn btn--outline btn--lg" href="#kalkulator-poticaja">Kalkulator poticaja</a>
            </div>
          </div>
          <div className="keyfacts">
            <div><b>do 50&nbsp;%</b><span>opravdanih troškova ulaganja</span></div>
            <div><b>do 70&nbsp;%</b><span>za kućanstva u riziku od energetskog siromaštva</span></div>
            <div><b>38 mil.&nbsp;€</b><span>ukupno osigurano u javnom pozivu</span></div>
            <div><b>0&nbsp;% PDV</b><span>na isporuku i ugradnju solarnih panela za kućanstva</span></div>
          </div>
        </div>
      </section>

      <section className="section section--bg" id="iznosi" aria-labelledby="iznosi-title">
        <div className="container guide__grid">
          <aside className="guide__toc">
            <span className="label">Sadržaj</span>
            <nav aria-label="Sadržaj stranice">
              <ol>
                {TOC.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>
          </aside>
          <article className="prose">
            <h2 className="h2" id="iznosi-title">FZOEU javni poziv 2026.</h2>
            <p className="prose__meta">EMSO stručni tim. Izvor: <a href={SOURCE} rel="noopener">objava FZOEU od 1. 9. 2026.</a></p>

            <h3 id="koliko">Koliko iznosi poticaj?</h3>
            <p>Fond sufinancira do 50 % opravdanih troškova ulaganja, a kućanstvima u riziku od energetskog siromaštva do 70 %. Iznos je za svaku mjeru ograničen po kilovatu (odnosno kilovatsatu) i ukupnim najvišim iznosom:</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th scope="col">Mjera</th><th scope="col">Standardno (do 50 %)</th><th scope="col">Rizik od energetskog siromaštva (do 70 %)</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Fotonaponska elektrana</th><td>do 600 €/kW, najviše <b>6.000 €</b></td><td>do 840 €/kW, najviše <b>8.400 €</b></td></tr>
                  <tr><th scope="row">Baterijski spremnik</th><td>do 350 €/kWh, najviše <b>5.600 €</b></td><td>do 490 €/kWh, najviše <b>7.840 €</b></td></tr>
                  <tr><th scope="row">Dizalica topline</th><td>najviše <b>6.250 €</b></td><td>najviše <b>8.750 €</b></td></tr>
                </tbody>
              </table>
            </div>
            <p>Baterijski sustav može se prijaviti isključivo zajedno s fotonaponskom elektranom. Istom prijavom moguće je obuhvatiti i kombinaciju dizalice topline, fotonaponske elektrane i baterijskog sustava.</p>

            <h3 id="visa-stopa">Tko ima pravo na 70 %?</h3>
            <p>Višu stopu sufinanciranja mogu ostvariti kućanstva u riziku od energetskog siromaštva, odnosno ona čiji prosječni mjesečni ekvivalentni dohodak iz 2025. godine ne prelazi <strong>1.341,42 € po članu kućanstva</strong>.</p>
            <div className="callout">
              <strong>Prije prijave:</strong> točne uvjete, rokove, prihvatljive troškove i popis dokumentacije uvijek provjerite u tekstu javnog poziva na <a href="https://www.fzoeu.hr/" rel="noopener">fzoeu.hr</a>. Uvjeti se mogu razlikovati od poziva do poziva, a sredstva se dodjeljuju do iskorištenja.
            </div>
          </article>
        </div>
      </section>

      <section className="section" id="kalkulator-poticaja" aria-labelledby="subcalc-title">
        <div className="container">
          <div className="sec-head">
            <span className="label">Kalkulator poticaja</span>
            <h2 className="h2" id="subcalc-title">Koliki poticaj možete dobiti?</h2>
            <p className="lead">Odaberite snagu elektrane i opremu. Kalkulator prikazuje najviši mogući iznos poticaja prema pravilima javnog poziva, a točan iznos za vaš objekt navodimo u ponudi.</p>
          </div>
          <SubsidyCalculator />
        </div>
      </section>

      <section className="section section--bg" id="prijava" aria-labelledby="prijava-title">
        <div className="container guide__grid">
          <div>
            <span className="label">Postupak</span>
            <h2 className="h2" id="prijava-title">Kako do poticaja</h2>
          </div>
          <ol className="timeline">
            {TIMELINE.map((t) => (
              <li key={t.title}><div><h3>{t.title}</h3><p>{t.text}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" aria-labelledby="pdvneto-title">
        <div className="container guide__grid">
          <div>
            <span className="label">Porezi i obračun</span>
            <h2 className="h2" id="pdvneto-title">PDV i neto obračun</h2>
          </div>
          <article className="prose">
            <h3 id="pdv">0 % PDV-a na solarne panele za kućanstva</h3>
            <p>Na isporuku i ugradnju solarnih panela na privatnim kućama i stambenim zgradama primjenjuje se nulta stopa PDV-a. To znači da je cijena iz ponude za kućanstvo konačna, bez dodatnih 25 %. Poticaj FZOEU dodatno umanjuje vaše ulaganje.</p>

            <h3 id="neto">Neto obračun od 1. siječnja 2026.</h3>
            <p>Kupci s vlastitom proizvodnjom od 2026. obračunavaju se po modelu neto obračuna, s obračunskim razdobljem od jednog kalendarskog mjeseca. Energija koju proizvedete i odmah potrošite vrijedi punu cijenu s računa. Višak predan u mrežu vrednuje se prema cijeni same energije (bez mrežarine i naknada), i to najviše do količine koju u istom mjesecu preuzmete iz mreže.</p>
            <p>Zato je elektranu važno pravilno dimenzionirati i povećati vlastitu potrošnju, a baterijski spremnici, koje FZOEU sada prvi put sufinancira, u tome najviše pomažu. Više o tome pročitajte u <Link href="/vodic-solarne-elektrane-2026/#neto-obracun">vodiču kroz solarne elektrane</Link>.</p>
          </article>
        </div>
      </section>

      <InquiryForm
        heading="Zatražite ponudu s izračunom poticaja"
        intro="Pošaljite nekoliko podataka o potrošnji i objektu. U ponudi navodimo cijenu, iznos poticaja za vaš objekt i dokumentaciju potrebnu za prijavu."
      />

      <Faq title="Pitanja o poticajima" faqs={FAQS} />

      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb([{ name: 'Poticaji za solarne elektrane 2026.', path: PATH }])} />
    </>
  );
}
