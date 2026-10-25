import Link from 'next/link';
import EvCalculator from '@/components/EvCalculator';
import InquiryForm from '@/components/InquiryForm';
import PrefillLink from '@/components/PrefillLink';
import Logos, { EV_PARTNERS } from '@/components/Logos';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { Icon } from '@/components/Icons';
import { absUrl, SITE_URL } from '@/lib/site';
import { breadcrumb, faqPage, pageMetadata } from '@/lib/seo';

const PATH = '/elektro-punionice/';
const TITLE = 'Punionice za električne automobile – ugradnja | EMSO';
const DESCRIPTION = 'Kućne, poslovne i javne punionice za električna vozila ključ u ruke: savjetovanje, projekt, montaža i servis. Partner HT-a, ovlašteni ETREL distributer.';
const CHARGER = 'Punionica za električno vozilo';

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  ogImage: 'og-elektro-punionice.png',
  ogImageAlt: 'EMSO punionice za električna vozila ključ u ruke',
});

const SERVICES = [
  { icon: 'home', title: 'Kućne punionice', text: 'Zidna punionica u garaži ili dvorištu, prilagođena vašem priključku. Automobil je svako jutro napunjen.' },
  { icon: 'building', title: 'Punionice za tvrtke', text: 'Punjenje službenih vozila, flote i automobila zaposlenika, uz upravljanje pristupom i praćenje potrošnje po korisniku.' },
  { icon: 'plug', title: 'Javne punionice', text: 'Interaktivne AC i DC punionice za trgovačke centre, hotele, restorane, gradove i općine.' },
  { icon: 'doc', title: 'Projektiranje i nadzor', text: 'Izrada glavnog elektro projekta i stručni nadzor nad izgradnjom punionica, uključujući komunikaciju s HEP ODS-om.' },
  { icon: 'wrench', title: 'Građevinski i elektromontažni radovi', text: 'Radovi na linijskoj infrastrukturi, kabelski kanali, temelji i razvod, vlastitom ekipom i mehanizacijom.' },
  { icon: 'shield', title: 'Servis i održavanje', text: 'Usluge servisiranja i kompletnog održavanja elektro punionica nakon puštanja u rad.' },
];

const POWERS = [
  { kw: '3,7', ph: 'Jednofazno, 16 A', text: 'Za plug-in hibride i vozače koji dnevno prijeđu manje kilometara.', km: 20 },
  { kw: '7,4', ph: 'Jednofazno, 32 A', text: 'Najviše što daje jednofazni priključak, dovoljno za punjenje preko noći.', km: 40 },
  { kw: '11', ph: 'Trofazno, 16 A, najčešći izbor', text: 'Optimalno za većinu električnih automobila i kućanstava s trofaznim priključkom.', km: 58, hot: true },
  { kw: '22', ph: 'Trofazno, 32 A', text: 'Za tvrtke, flote i javna mjesta te vozila koja podržavaju AC punjenje od 22 kW.', km: 116 },
];

const STEPS = [
  { title: 'Savjetovanje', free: true, text: 'Provjeravamo vozilo, priključnu snagu objekta, mjesto ugradnje i navike punjenja.' },
  { title: 'Ponuda', free: true, text: 'Predlažemo punionicu odgovarajuće snage i navodimo sve potrebne radove.' },
  { title: 'Projektiranje', text: 'Izrađujemo glavni elektro projekt i po potrebi vodimo komunikaciju s HEP ODS-om.' },
  { title: 'Opremanje', text: 'Isporučujemo punionicu ETREL ili drugog proizvođača prema vašim potrebama.' },
  { title: 'Montaža i servis', text: 'Montiramo i puštamo punionicu u rad, a po želji preuzimamo servis i održavanje.' },
];

const FAQS = [
  { q: 'Koju snagu kućne punionice odabrati?', a: 'Za većinu kućanstava s trofaznim priključkom najbolji je izbor punionica od 11 kW, jer je to najveća snaga kojom se većina električnih automobila puni na izmjeničnoj struji. Uz jednofazni priključak najviše je 7,4 kW. Prije ugradnje provjeravamo priključnu snagu objekta.' },
  { q: 'Koliko traje punjenje kod kuće?', a: 'Za bateriju od 60 kWh punjenje s 10 na 80 % (oko 42 kWh) traje približno 4 sata na punionici od 11 kW, oko 6 sati na 7,4 kW i 12 do 13 sati na punionici od 3,7 kW.' },
  { q: 'Treba li mi trofazni priključak?', a: 'Za punionice od 11 i 22 kW da. Jednofazni priključak omogućuje punjenje do 7,4 kW. Ako je potrebno povećanje priključne snage, savjetujemo vas o postupku s HEP ODS-om.' },
  { q: 'Mogu li auto puniti iz solarne elektrane?', a: 'Da. Pametna punionica može pratiti proizvodnju elektrane i puniti auto viškom sunčeve energije. Uz neto obračun koji vrijedi od 2026. to je jedan od najisplativijih načina korištenja viška proizvodnje.' },
  { q: 'Koliko košta punjenje kod kuće u odnosu na benzin?', a: 'Uz cijenu struje od oko 0,16 €/kWh i potrošnju od 17 kWh na 100 km, 100 km kod kuće stoji oko 3 €. Automobil koji troši 6,5 litara benzina na 100 km uz cijenu od 1,75 €/l potroši oko 11 € na istoj udaljenosti.' },
  { q: 'Postavljate li punionice za tvrtke i javna mjesta?', a: 'Da. Nudimo interaktivne punionice za javno i privatno punjenje, AC i DC, te izvodimo sve potrebne građevinske i elektromontažne radove. EMSO je ugovoreni partner Hrvatskog telekoma za projektiranje, montiranje i servisiranje e-punionica.' },
  { q: 'Nudite li servis i održavanje punionica?', a: 'Da, pružamo usluge servisiranja i kompletnog održavanja kućnih, poslovnih i javnih elektro punionica.' },
  { q: 'Koliko košta kućna punionica s ugradnjom?', a: 'Cijena ovisi o snazi i modelu punionice, udaljenosti od razvodnog ormara i potrebnim radovima. Pošaljite upit s osnovnim podacima i javit ćemo vam se s besplatnom ponudom.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${absUrl(PATH)}#webpage`,
      url: absUrl(PATH),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'hr-HR',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${absUrl(PATH)}#service` },
      primaryImageOfPage: `${SITE_URL}/img/og-elektro-punionice.png`,
    },
    {
      '@type': 'Service',
      '@id': `${absUrl(PATH)}#service`,
      name: 'Punionice za električna vozila ključ u ruke',
      serviceType: 'Projektiranje, montaža i servis punionica za električna vozila',
      description: 'Kućne, poslovne i javne AC i DC punionice: savjetovanje, glavni elektro projekt, građevinski i elektromontažni radovi, montaža, nadzor, servis i održavanje.',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: 'Hrvatska' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Usluge e-mobilnosti',
        itemListElement: ['Kućne punionice za električne automobile', 'Punionice za tvrtke i flote', 'Javne AC i DC punionice', 'Servis i održavanje punionica'].map((name) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name },
        })),
      },
    },
    faqPage(PATH, FAQS),
  ],
};

export default function ChargersPage() {
  return (
    <>
      <section className="subhero" aria-labelledby="ev-title">
        <div className="container subhero__grid">
          <div>
            <ol className="crumbs" aria-label="Putanja">
              <li><Link href="/">Solarne elektrane</Link></li>
              <li aria-current="page">Elektro punionice</li>
            </ol>
            <h1 className="h1" id="ev-title">Punionice za električna vozila po sistemu „ključ u ruke“</h1>
            <p className="lead subhero__lead">
              Više kontrole i više snage u manje vremena. Isporučujemo i montiramo interaktivne punionice za javno i privatno punjenje, uz savjetovanje, glavni elektro projekt, građevinske i elektromontažne radove te servis.
            </p>
            <div className="subhero__ctas">
              <PrefillLink className="btn btn--primary btn--lg" detail={{ interes: CHARGER }}>Zatražite ponudu</PrefillLink>
              <a className="btn btn--outline btn--lg" href="#ev-kalkulator">Izračunajte trošak punjenja</a>
            </div>
          </div>
          <div className="keyfacts">
            <div><b>HT</b><span>ugovoreni partner za projektiranje, montiranje i servisiranje e-punionica</span></div>
            <div><b>ETREL</b><span>ovlašteni distributer elektro punionica</span></div>
            <div><b>AC i DC</b><span>kućne, poslovne i javne punionice</span></div>
            <div><b>Servis</b><span>održavanje punionica nakon ugradnje</span></div>
          </div>
        </div>
      </section>

      <section className="logos" aria-labelledby="ev-partneri-title">
        <div className="container">
          <div className="logos__head">
            <h2 className="label" id="ev-partneri-title">Partneri za e-mobilnost</h2>
            <p>EMSO je ugovoreni partner Hrvatskog telekoma za projektiranje, montiranje i servisiranje e-punionica i ovlašteni distributer punionica ETREL.</p>
          </div>
          <Logos items={EV_PARTNERS} />
        </div>
      </section>

      <section className="section" id="usluge" aria-labelledby="usluge-title">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div>
              <span className="label">Usluge</span>
              <h2 className="h2" id="usluge-title">Od kućne garaže do javnog parkirališta</h2>
            </div>
            <p className="lead">Pripremne radove i montažu punionica izvodimo na području cijele Hrvatske. Izrađujemo i projekte, vodimo nadzor nad izgradnjom te servisiramo i održavamo punionice.</p>
          </div>
          <ul className="cards3" role="list">
            {SERVICES.map((s) => (
              <li className="benefit" key={s.title}>
                <Icon name={s.icon} size={28} />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--bg" id="snaga" aria-labelledby="snaga-title">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div>
              <span className="label">Snaga punionice</span>
              <h2 className="h2" id="snaga-title">Koja snaga punionice vam treba?</h2>
            </div>
            <p className="lead">Većina električnih automobila na izmjeničnoj struji (AC) puni se snagom do 11 kW. Za kuću je zato najčešći izbor trofazna punionica od 11 kW, uz provjeru priključne snage objekta.</p>
          </div>
          <div className="power">
            {POWERS.map((p) => (
              <article className={`power__c${p.hot ? ' is-hot' : ''}`} key={p.kw}>
                <p className="power__kw">{p.kw}<small>kW</small></p>
                <p className="power__ph">{p.ph}</p>
                <p>{p.text}</p>
                <p className="power__km">Oko <b>{p.km} km</b> dometa po satu punjenja</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="ev-kalkulator" aria-labelledby="evc-title">
        <div className="container">
          <div className="sec-head">
            <span className="label">Kalkulator troškova punjenja</span>
            <h2 className="h2" id="evc-title">Koliko košta vožnja na struju?</h2>
            <p className="lead">Usporedite godišnji trošak goriva s punjenjem na javnim punionicama, kod kuće iz mreže i kod kuće iz vlastite solarne elektrane.</p>
          </div>
          <EvCalculator />
        </div>
      </section>

      <section className="section section--bg section--tight" aria-labelledby="solarev-title">
        <div className="container">
          <div className="notice">
            <div>
              <span className="label">Solarna elektrana i punionica</span>
              <h2 className="h2" id="solarev-title">Punite automobil vlastitom solarnom energijom</h2>
              <p>Od 2026. višak struje predan u mrežu vrijedi znatno manje od struje koju kupujete. Pametna punionica koja prati proizvodnju elektrane može taj višak usmjeriti u bateriju automobila. Elektranu, bateriju i punionicu projektiramo i montiramo iz jedne ruke.</p>
              <PrefillLink className="btn btn--primary" detail={{ interes: 'Solarna elektrana i punionica' }}>Ponuda za elektranu i punionicu</PrefillLink>
            </div>
            <ul className="notice__facts" role="list">
              <li><b>~11&nbsp;€</b><span>za 100 km na benzin (6,5 l/100 km uz 1,75 €/l)</span></li>
              <li><b>~9&nbsp;€</b><span>za 100 km na javnom brzom punjenju (0,55 €/kWh)</span></li>
              <li><b>~3&nbsp;€</b><span>za 100 km kod kuće iz mreže (17 kWh uz 0,16 €/kWh)</span></li>
              <li><b>~1,3&nbsp;€</b><span>za 100 km viškom iz vlastite elektrane</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="evp-title">
        <div className="container turnkey">
          <div className="turnkey__copy">
            <span className="label">EMSO sistem „ključ u ruke“</span>
            <h2 className="h2" id="evp-title">Kako izgleda ugradnja punionice</h2>
            <p>Savjetovanje i izrada ponude su besplatni. Nakon toga preuzimamo projekt, opremu, radove i montažu, a po želji i servis punionice.</p>
          </div>
          <ol className="steps" role="list">
            {STEPS.map((s, i) => (
              <li className="step" key={s.title}>
                <span className="step__n">{i + 1}</span>
                <h3 className="step__t">{s.title} {s.free && <span className="tag">besplatno</span>}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <InquiryForm
        defaultInterest={CHARGER}
        heading="Zatražite ponudu za punionicu"
        intro="Odgovorite na nekoliko pitanja o objektu i priključku. Predložit ćemo punionicu odgovarajuće snage i javiti vam se s cijenom."
      />

      <Faq title="Pitanja o punionicama" faqs={FAQS} />

      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb([{ name: 'Elektro punionice', path: PATH }])} />
    </>
  );
}
