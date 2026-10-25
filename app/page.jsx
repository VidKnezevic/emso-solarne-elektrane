import Link from 'next/link';
import HeroVideo from '@/components/HeroVideo';
import QuickStart from '@/components/QuickStart';
import InquiryForm from '@/components/InquiryForm';
import ReferralShare from '@/components/ReferralShare';
import LazyVideo from '@/components/LazyVideo';
import Logos, { SOLAR_PARTNERS } from '@/components/Logos';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { Icon } from '@/components/Icons';
import { absUrl, company, media, SITE_URL } from '@/lib/site';
import { faqPage, pageMetadata } from '@/lib/seo';

const TITLE = 'Solarne elektrane ključ u ruke – besplatna ponuda | EMSO';
const DESCRIPTION = 'Solarne elektrane za kuće i tvrtke po sistemu ključ u ruke. Besplatno savjetovanje i ponuda, montaža u 1 dan, jamstvo do 25 godina. Zatražite izračun online.';

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: '/', ogImageAlt: 'EMSO solarne elektrane ključ u ruke' });

const FAQS = [
  { q: 'Koliko košta solarna elektrana?', a: 'Cijena ovisi o potrošnji, krovu, odabranoj opremi i tome želite li bateriju. Točnu cijenu za vaš objekt izračunat ćemo besplatno: pošaljite upit ili nas nazovite. Za kućanstva vrijedi 0 % PDV-a, a dio troška može pokriti poticaj FZOEU.' },
  { q: 'Koliko traje montaža solarne elektrane?', a: 'Većinu kućnih elektrana montiramo i puštamo u rad u jednom danu. Prije toga treba izraditi projekt i ishoditi suglasnost HEP ODS-a. Tu administraciju vodimo mi i o svakom koraku vas obavještavamo.' },
  { q: 'Koja mi snaga elektrane treba?', a: 'Polazište je godišnja potrošnja s računa za struju. U kontinentalnoj Hrvatskoj svaki kWp godišnje proizvede oko 1.150 do 1.250 kWh, pa kućanstvu koje troši 5.000 kWh obično treba elektrana od 4 do 5 kWp. Točnu snagu određujemo u besplatnom izračunu, uz buduće potrošače poput dizalice topline ili električnog automobila.' },
  { q: 'Isplati li se baterijski spremnik u 2026.?', a: 'Uz neto obračun sve češće da. Višak predan u mrežu vrijedi znatno manje od struje koju kupujete, a baterija ga sprema za večer. FZOEU u 2026. prvi put sufinancira i baterije, do 350 € po kWh i najviše 5.600 €.' },
  { q: 'Koji poticaji postoje za solarne elektrane?', a: 'Fond za zaštitu okoliša i energetsku učinkovitost u 2026. sufinancira do 50 % opravdanih troškova, odnosno do 70 % za kućanstva u riziku od energetskog siromaštva: do 6.000 € za fotonaponsku elektranu, do 5.600 € za baterijski sustav i do 6.250 € za dizalicu topline.' },
  { q: 'Što uključuje sistem „ključ u ruke“?', a: 'Besplatno savjetovanje i ponudu, izradu idejnog i glavnog projekta, vođenje kroz ishođenje elektroenergetske suglasnosti HEP ODS-a, opremu, montažu, puštanje u rad i priključenje na mrežu te podršku pri sklapanju ugovora o otkupu i ishođenju potvrde za trajni pogon.' },
  { q: 'Kakvo jamstvo i osiguranje dobivam?', a: 'Solarni paneli imaju jamstvo do 25 godina na proizvodni kapacitet, a jamstva na pojedine dijelove elektrane iznose do 25 godina. Uz to nudimo mogućnost desetogodišnjeg osiguranja elektrane od nevremena, tuče, potresa i kvara.' },
  { q: 'Kako funkcionira program preporuke?', a: 'Postojeći EMSO kupci mogu preporučiti solarnu elektranu prijateljima, susjedima i obitelji. Preporučena osoba u upitu navede ime i prezime osobe koja ju je preporučila, a nakon potpisa ugovora i puštanja elektrane u rad oboje ostvarujete pravo na nagradu do 500 €.' },
  { q: 'Montirate li solarne elektrane i za tvrtke?', a: 'Da. Projektiramo i gradimo elektrane za poduzeća, obrte i poljoprivredna gospodarstva, na krovovima hala, upravnih zgrada i gospodarskih objekata, i po želji ih kombiniramo s punionicama za električna vozila.' },
];

const BENEFITS = [
  { icon: 'trend', title: 'Zaštita od rasta cijena', text: 'S vlastitom elektranom manje ovisite o opskrbljivačima i budućim poskupljenjima električne energije.' },
  { icon: 'down', title: 'Do 75 % manji računi', text: 'Struju koju proizvedete i potrošite ne kupujete iz mreže po punoj cijeni s mrežarinom i naknadama.' },
  { icon: 'shield', title: 'Jamstvo i osiguranje', text: '25 godina jamstva na proizvodni kapacitet panela i mogućnost desetogodišnjeg osiguranja elektrane.' },
  { icon: 'home', title: 'Veća vrijednost nekretnine', text: 'Kuća s vlastitom elektranom ima niže troškove i privlačnija je budućim kupcima.' },
];

const SOLUTIONS = [
  { icon: 'panel', title: 'Solarna elektrana za kuću', text: 'Snaga prema vašoj potrošnji, uz 0 % PDV-a za kućanstva.', href: '#ponuda', cta: 'Zatražite ponudu' },
  { icon: 'battery', title: 'Baterijski spremnik', text: 'Struju iz elektrane koristite i navečer. U 2026. prvi put uz poticaj FZOEU.', href: '/vodic-solarne-elektrane-2026/#baterija', cta: 'Saznajte više' },
  { icon: 'plug', title: 'Punionica za električni auto', text: 'Kućne i poslovne punionice te punjenje vlastitom solarnom energijom.', href: '/elektro-punionice/', cta: 'Elektro punionice' },
  { icon: 'building', title: 'Elektrane za tvrtke', text: 'Krovovi hala, upravnih zgrada i gospodarskih objekata.', href: '#tvrtke', cta: 'Za tvrtke' },
];

const STEPS = [
  { title: 'Upit i savjetovanje', free: true, text: 'Pošaljete upit ili nas nazovete. Analiziramo potrošnju, krov i vaše planove, poput dizalice topline ili električnog auta.' },
  { title: 'Izračun i ponuda', free: true, text: 'Izrađujemo ponudu sa snagom elektrane, opremom FUJI SOLAR i Huawei, cijenom i procjenom uštede.' },
  { title: 'Projekt i dokumentacija', text: 'Izrađujemo glavni projekt i vodimo postupak s HEP ODS-om. Papirologiju prepustite nama.' },
  { title: 'Montaža', text: 'Vlastiti instalateri i nadzor montiraju elektranu, većinu u jednom danu.' },
  { title: 'Puštanje u pogon', text: 'Priključenje na mrežu, ugovor o otkupu viška i potvrda za trajni pogon.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${absUrl('/')}#webpage`,
      url: absUrl('/'),
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'hr-HR',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${absUrl('/')}#service` },
      primaryImageOfPage: `${SITE_URL}/img/og-solarne-elektrane.png`,
    },
    {
      '@type': 'Service',
      '@id': `${absUrl('/')}#service`,
      name: 'Solarne elektrane ključ u ruke',
      serviceType: 'Projektiranje, opremanje i montaža solarnih elektrana',
      description: 'Besplatno savjetovanje i izrada ponude, glavni projekt, vođenje kroz ishođenje elektroenergetske suglasnosti HEP ODS-a, oprema FUJI SOLAR i Huawei te montaža i puštanje u rad, najčešće u jednom danu.',
      provider: { '@id': `${SITE_URL}/#organization` },
      areaServed: { '@type': 'Country', name: 'Hrvatska' },
      audience: { '@type': 'Audience', audienceType: 'Kućanstva, tvrtke, obrti i poljoprivredna gospodarstva' },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Usluge solarnih elektrana',
        itemListElement: [
          { '@type': 'Offer', price: '0', priceCurrency: 'EUR', itemOffered: { '@type': 'Service', name: 'Savjetovanje o solarnoj elektrani' } },
          { '@type': 'Offer', price: '0', priceCurrency: 'EUR', itemOffered: { '@type': 'Service', name: 'Izračun i ponuda za solarnu elektranu' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Projektiranje solarne elektrane i HEP dokumentacija' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Montaža i puštanje u rad solarne elektrane' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Baterijski spremnici energije' } },
        ],
      },
    },
    faqPage('/', FAQS),
  ],
};

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <HeroVideo src={media.heroVideo} poster={media.heroPoster} posterWidth={1024} posterHeight={768} />
        <div className="container hero__grid">
          <div>
            <h1 className="h1" id="hero-title">Solarne elektrane po sistemu „ključ u ruke“</h1>
            <p className="hero__lead">
              Zaštitite se od rasta cijena električne energije. Projektiramo, opremamo i montiramo solarne elektrane za kućanstva i tvrtke u cijeloj Hrvatskoj, a većinu ih puštamo u rad u jednom danu.
            </p>
            <div className="hero__ctas">
              <a className="btn btn--white btn--lg" href="#ponuda">Zatražite besplatnu ponudu</a>
              <a className="btn btn--ghost btn--lg" href={company.phoneHref}><Icon name="phone" size={18} />01 2350 655</a>
            </div>
            <ul className="hero__steps" aria-label="EMSO sistem ključ u ruke">
              <li><Icon name="check" size={16} />Savjetovanje <small>besplatno</small></li>
              <li><Icon name="check" size={16} />Ponuda <small>besplatno</small></li>
              <li><Icon name="check" size={16} />Projektiranje</li>
              <li><Icon name="check" size={16} />Opremanje</li>
              <li><Icon name="check" size={16} />Montaža</li>
            </ul>
          </div>
          <QuickStart />
        </div>
        <p className="hero__credit">Na snimci: solarna elektrana AluK Tim, izvođač EMSO</p>
      </section>

      <section className="trust" aria-label="EMSO u brojkama i partneri">
        <div className="facts">
          <div className="container">
            <ul className="facts__grid facts__grid--4">
              <li><span className="facts__num">2.074</span><span className="facts__txt">isporučenih solarnih elektrana</span></li>
              <li><span className="facts__num">1&nbsp;dan</span><span className="facts__txt">montaža i puštanje u rad većine elektrana</span></li>
              <li><span className="facts__num">25&nbsp;god.</span><span className="facts__txt">jamstva na proizvodni kapacitet panela</span></li>
              <li><span className="facts__num">10&nbsp;god.</span><span className="facts__txt">osiguranja od nevremena, tuče i potresa</span></li>
            </ul>
          </div>
        </div>
        <div className="trust__logos">
          <div className="container">
            <div className="logos__head">
              <h2 className="label">Partneri i ovlaštenja</h2>
              <p>Ugovoreni partner tvrtke E.ON za montažu solarnih elektrana i ovlašteni instalater za FUJI SOLAR i Huawei.</p>
            </div>
            <Logos items={SOLAR_PARTNERS} />
          </div>
        </div>
      </section>

      <section className="section" id="prednosti" aria-labelledby="benefits-title">
        <div className="container">
          <div className="sec-head">
            <span className="label">Zašto solarna elektrana</span>
            <h2 className="h2" id="benefits-title">Vlastita struja s vašeg krova</h2>
          </div>
          <ul className="cards4" role="list">
            {BENEFITS.map((b) => (
              <li className="bcard" key={b.title}>
                <Icon name={b.icon} size={28} />
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </li>
            ))}
          </ul>
          <ul className="solutions" role="list" aria-label="Rješenja">
            {SOLUTIONS.map((s) => (
              <li key={s.title}>
                <Link className="solution" href={s.href}>
                  <Icon name={s.icon} size={24} />
                  <b>{s.title}</b>
                  <span>{s.text}</span>
                  <em>{s.cta} →</em>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--bg" id="preporuka" aria-labelledby="referral-title">
        <div className="container referral">
          <div className="referral__copy">
            <span className="label">Program preporuke</span>
            <h2 className="h2" id="referral-title">Nagrađujemo vašu preporuku</h2>
            <p className="lead">
              Zadovoljni ste svojom EMSO solarnom elektranom? Preporučite nas prijateljima, susjedima ili obitelji. Kad preporučena osoba ugradi solarnu elektranu, oboje ostvarujete pravo na nagradu do 500&nbsp;€.
            </p>
            <ol className="numlist" role="list">
              <li><span>1</span><div><b>Preporučite EMSO</b><p>Podijelite ovu stranicu s nekim tko razmišlja o solarnoj elektrani.</p></div></li>
              <li><span>2</span><div><b>Prijatelj zatraži ponudu</b><p>U upitu navede vaše ime i prezime.</p></div></li>
              <li><span>3</span><div><b>Oboje ostvarujete nagradu</b><p>Nakon potpisa ugovora i puštanja elektrane u rad.</p></div></li>
            </ol>
            <ReferralShare />
            <details className="referral__terms">
              <summary>Uvjeti programa preporuke</summary>
              <ul>
                <li>Program je namijenjen postojećim kupcima EMSO solarnih elektrana.</li>
                <li>Preporučena osoba pri slanju upita navodi ime i prezime osobe koja ju je preporučila.</li>
                <li>Pravo na nagradu ostvaruje se nakon što preporučena osoba potpiše ugovor s EMSO-om i elektrana bude puštena u rad.</li>
                <li>Iznos nagrade, način isplate i ostale uvjete potvrđujemo pri sklapanju ugovora.</li>
              </ul>
            </details>
          </div>
          <div className="reward">
            <Icon name="gift" size={40} />
            <p className="reward__label">Nagrada za preporuku</p>
            <p className="reward__amount"><small>do</small>500&nbsp;€</p>
            <p>Pravo na nagradu ostvarujete i vi i osoba koju preporučite.</p>
            <a className="btn btn--white" href="#ponuda">Pošaljite upit s preporukom</a>
          </div>
        </div>
      </section>

      <section className="section" id="kako-radimo" aria-labelledby="process-title">
        <div className="container process">
          <div>
            <div className="sec-head">
              <span className="label">EMSO sistem „ključ u ruke“</span>
              <h2 className="h2" id="process-title">Kako do vaše solarne elektrane</h2>
              <p className="lead">Od prvog poziva do puštanja u pogon brinemo o svemu, uključujući HEP dokumentaciju.</p>
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
          <figure className="process__media">
            <LazyVideo src={media.montageVideo} width={848} height={480} />
            <figcaption>EMSO montažeri na krovu tvrtke IVERPAN d.o.o.</figcaption>
            <ul className="ticks">
              <li><Icon name="check" size={18} />Vlastiti instalateri, oprema i mehanizacija</li>
              <li><Icon name="check" size={18} />Ovlašteni instalateri za FUJI SOLAR i Huawei</li>
              <li><Icon name="check" size={18} /><span>Mogućnost osiguranja kroz <a href="https://osiguranje.emso.hr/">EMSO Osiguranje</a></span></li>
            </ul>
          </figure>
        </div>
      </section>

      <InquiryForm />

      <section className="section" id="reference" aria-labelledby="refs-title">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div>
              <span className="label">Reference</span>
              <h2 className="h2" id="refs-title">Neke od naših solarnih elektrana</h2>
            </div>
            <p className="lead">Do danas smo po sistemu „ključ u ruke“ isporučili 2.074 solarne elektrane, od obiteljskih kuća do krovova industrijskih hala.</p>
          </div>
          <div className="refs__grid">
            <figure className="ref">
              <div className="ref__media"><img src={media.vrsi} width="1024" height="768" loading="lazy" decoding="async" referrerPolicy="no-referrer" alt="Solarna elektrana snage 4,45 kWp na krovu obiteljske kuće u Vrsima" /></div>
              <figcaption><b>Obiteljska kuća, Vrsi</b>Solarna elektrana 4,45 kWp</figcaption>
            </figure>
            <figure className="ref">
              <div className="ref__media"><LazyVideo src={media.jakusevecVideo} /></div>
              <figcaption><b>Zagreb, Jakuševec</b>Solarna elektrana za samoopskrbu</figcaption>
            </figure>
            <figure className="ref">
              <div className="ref__media"><img src={media.house} width="934" height="425" loading="lazy" decoding="async" referrerPolicy="no-referrer" alt="Solarna elektrana na krovu obiteljske kuće snimljena dronom" /></div>
              <figcaption><b>Obiteljska kuća</b>Krovna elektrana na crijepu</figcaption>
            </figure>
          </div>
          <div className="refs__more">
            <a className="btn btn--outline" href="https://emso.hr/reference/solarne-elektrane">Sve reference</a>
            <a className="btn btn--outline" href="https://magazin.emso.hr/tema/solarne-elektrane">EMSO Magazin</a>
          </div>
        </div>
      </section>

      <section className="section section--bg section--tight" aria-labelledby="subt-title">
        <div className="container">
          <div className="notice">
            <div>
              <span className="label">Poticaji 2026.</span>
              <h2 className="h2" id="subt-title">FZOEU sufinancira do 50&nbsp;% ulaganja</h2>
              <p>Fond za zaštitu okoliša i energetsku učinkovitost 2. rujna 2026. otvorio je javni poziv vrijedan 38 milijuna eura. Prvi put se sufinanciraju i baterijski spremnici. U ponudi vam pokazujemo iznos s poticajem.</p>
              <Link className="btn btn--primary" href="/poticaji-za-solarne-elektrane-2026/">Iznosi i uvjeti poticaja</Link>
            </div>
            <ul className="notice__facts" role="list">
              <li><b>do 6.000&nbsp;€</b><span>za fotonaponsku elektranu (600 €/kW)</span></li>
              <li><b>do 5.600&nbsp;€</b><span>za baterijski spremnik (350 €/kWh)</span></li>
              <li><b>do 70&nbsp;%</b><span>za kućanstva u riziku od energetskog siromaštva</span></li>
              <li><b>0&nbsp;% PDV</b><span>na isporuku i ugradnju panela za kućanstva</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--sky" id="tvrtke" aria-labelledby="biz-title">
        <div className="container split split--rev">
          <figure className="split__media">
            <img src={media.zadar} width="1024" height="768" loading="lazy" decoding="async" referrerPolicy="no-referrer" alt="Krovna solarna elektrana snage 20 kWp koju je EMSO montirao u Zadru" />
            <figcaption>Solarna elektrana 20 kWp, Zadar</figcaption>
          </figure>
          <div className="split__copy">
            <span className="label">Za poduzeća, obrte i poljoprivredu</span>
            <h2 className="h2" id="biz-title">Solarne elektrane za tvrtke</h2>
            <p>Prema podacima HERA-e, burzovne cijene električne energije u rujnu 2026. bile su više od 80&nbsp;% više nego godinu ranije. Vlastita elektrana na krovu hale, upravne zgrade ili gospodarskog objekta pretvara dio tog troška u predvidivu investiciju.</p>
            <ul className="ticks">
              <li><Icon name="check" size={18} />Izračun isplativosti prema stvarnom profilu potrošnje tvrtke</li>
              <li><Icon name="check" size={18} />Projekt, HEP dokumentacija, montaža i nadzor iz jedne ruke</li>
              <li><Icon name="check" size={18} />Punionice za službena vozila, zaposlenike i kupce</li>
            </ul>
            <div className="split__ctas">
              <a className="btn btn--primary" href="#ponuda">Zatražite ponudu za tvrtku</a>
            </div>
          </div>
        </div>
      </section>

      <Faq title="Pitanja o solarnim elektranama" faqs={FAQS} />

      <section className="cta-band" aria-labelledby="cta-title">
        <div className="container cta-band__in">
          <div>
            <h2 className="h2" id="cta-title">Spremni za vlastitu struju?</h2>
            <p>Savjetovanje i izrada ponude su besplatni. Pošaljite upit ili nas nazovite radnim danom od 8 do 16 sati.</p>
          </div>
          <div className="cta-band__btns">
            <a className="btn btn--white btn--lg" href="#ponuda">Zatražite ponudu</a>
            <a className="btn btn--ghost btn--lg" href={company.phoneHref}><Icon name="phone" size={18} />{company.phone}</a>
          </div>
        </div>
      </section>

      <JsonLd data={jsonLd} />
    </>
  );
}
