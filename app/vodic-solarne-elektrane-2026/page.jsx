import Link from 'next/link';
import EnergyFlow from '@/components/EnergyFlow';
import InquiryForm from '@/components/InquiryForm';
import Faq from '@/components/Faq';
import JsonLd from '@/components/JsonLd';
import { absUrl, SITE_URL } from '@/lib/site';
import { breadcrumb, faqPage, pageMetadata } from '@/lib/seo';

const PATH = '/vodic-solarne-elektrane-2026/';
const TITLE = 'Vodič: solarna elektrana u 2026. i neto obračun | EMSO';
const DESCRIPTION = 'Kako radi solarna elektrana, što određuje cijenu, kako funkcionira neto obračun od 2026., isplati li se baterija i koliko prostora na krovu treba.';

export const metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  type: 'article',
  ogImageAlt: 'Vodič kroz solarne elektrane u 2026. – EMSO',
});

const TOC = [
  ['kako-radi-elektrana', 'Kako radi solarna elektrana?'],
  ['cijena', 'Što određuje cijenu?'],
  ['neto-obracun', 'Neto obračun od 2026.'],
  ['baterija', 'Trebam li bateriju?'],
  ['krov', 'Koliko panela i prostora treba?'],
  ['dokumentacija', 'Dokumentacija i HEP'],
];

const FAQS = [
  { q: 'Proizvodi li elektrana zimi i kad je oblačno?', a: 'Da, ali manje. U prosincu i siječnju elektrana proizvede i do četiri puta manje nego u srpnju, a po oblačnom vremenu proizvodnja pada, ali ne prestaje. Zato se elektrana dimenzionira prema godišnjoj, a ne dnevnoj potrošnji.' },
  { q: 'Radi li solarna elektrana kad nestane struje?', a: 'Standardna mrežna elektrana se iz sigurnosnih razloga isključuje kad nestane struje u mreži. Ako želite napajanje i tada, potreban je hibridni inverter s baterijom i funkcijom rezervnog napajanja. Rado ćemo vam predložiti rješenje.' },
  { q: 'Plaća li se PDV na solarne panele?', a: 'Za kućanstva ne. Na isporuku i ugradnju solarnih panela na privatnim kućama i stambenim zgradama primjenjuje se nulta stopa PDV-a.' },
  { q: 'Za koliko se godina isplati solarna elektrana?', a: 'Ovisi o potrošnji, cijeni struje, udjelu energije koju potrošite sami i poticaju. U ponudi za vaš objekt prikazujemo procjenu proizvodnje, uštede i razdoblja povrata, a paneli imaju jamstvo do 25 godina na proizvodni kapacitet.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      '@id': `${absUrl(PATH)}#article`,
      headline: 'Solarna elektrana u 2026.: što trebate znati',
      description: DESCRIPTION,
      image: `${SITE_URL}/img/og-solarne-elektrane.png`,
      inLanguage: 'hr-HR',
      datePublished: '2026-10-23',
      dateModified: '2026-10-25',
      author: { '@id': `${SITE_URL}/#organization` },
      publisher: { '@id': `${SITE_URL}/#organization` },
      mainEntityOfPage: absUrl(PATH),
      about: ['Solarne elektrane', 'Neto obračun', 'Baterijski spremnici', 'Fotonaponski sustavi'],
    },
    faqPage(PATH, FAQS),
  ],
};

export default function GuidePage() {
  return (
    <>
      <section className="subhero" aria-labelledby="guide-title">
        <div className="container">
          <ol className="crumbs" aria-label="Putanja">
            <li><Link href="/">Solarne elektrane</Link></li>
            <li aria-current="page">Vodič 2026.</li>
          </ol>
          <h1 className="h1" id="guide-title">Solarna elektrana u 2026.: što trebate znati</h1>
          <p className="small" style={{ marginTop: 8 }}>EMSO stručni tim, ažurirano u listopadu 2026.</p>
          <p className="lead subhero__lead">
            Kratak vodič za vlasnike kuća i tvrtke: kako elektrana radi, što određuje cijenu, kako se od 2026. obračunava višak energije i kada se isplati baterija.
          </p>
        </div>
      </section>

      <section className="section" aria-label="Vodič">
        <div className="container guide__grid">
          <aside className="guide__toc">
            <span className="label">Sadržaj vodiča</span>
            <nav aria-label="Sadržaj vodiča">
              <ol>
                {TOC.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
              </ol>
            </nav>
          </aside>
          <article className="prose">
            <h2 id="kako-radi-elektrana">Kako radi solarna elektrana?</h2>
            <p>Solarni paneli na krovu pretvaraju sunčevo zračenje u istosmjernu struju, a inverter je pretvara u izmjeničnu struju koju odmah troše vaši uređaji. Energija koju u tom trenutku ne potrošite puni baterijski spremnik, ako ga imate, ili odlazi u elektrodistribucijsku mrežu. Kad elektrana ne proizvodi dovoljno, primjerice navečer, noću ili u oblačnim zimskim danima, struju preuzimate iz mreže. Dvosmjerno brojilo HEP ODS-a bilježi i predanu i preuzetu energiju.</p>

            <h2 id="cijena">Što određuje cijenu solarne elektrane?</h2>
            <p>Cijena ovisi o snazi elektrane, vrsti i nagibu krova, odabranim panelima i inverteru te tome želite li baterijski spremnik ili punionicu. Snagu određujemo prema vašoj godišnjoj potrošnji i planovima, primjerice ugradnji dizalice topline ili kupnji električnog automobila, jer prevelika elektrana uz neto obračun donosi manje nego što košta.</p>
            <p>Za kućanstva se na isporuku i ugradnju solarnih panela primjenjuje <strong>nulta stopa PDV-a</strong>, a dio troška mogu pokriti <Link href="/poticaji-za-solarne-elektrane-2026/">poticaji FZOEU</Link>. Točnu cijenu za vaš objekt izračunavamo besplatno: <a href="#ponuda">pošaljite upit</a> i javit ćemo vam se s ponudom.</p>

            <h2 id="neto-obracun">Neto obračun od 2026.: zašto je važna vlastita potrošnja</h2>
            <p>Od 1. siječnja 2026. kupci s vlastitom proizvodnjom obračunavaju se po modelu neto obračuna, s obračunskim razdobljem od jednog mjeseca. Energija koju proizvedete i odmah potrošite vrijedi punu cijenu kilovatsata s računa, uključujući energiju, mrežarinu, naknade i PDV. Višak predan u mrežu vrednuje se znatno niže: prema cijeni same energije, bez mrežarine i naknada, i to najviše do količine koju u istom mjesecu preuzmete iz mreže.</p>
            <p>Zato elektranu treba dimenzionirati prema stvarnoj potrošnji i što veći dio proizvedene energije potrošiti sam. Rad bojlera, perilica, klime i punjenje automobila može se prebaciti na sunčane sate, a višak se može spremiti u baterijski spremnik.</p>

            <h2 id="baterija">Trebam li baterijski spremnik?</h2>
            <p>Bez baterije prosječno kućanstvo izravno potroši otprilike trećinu proizvedene energije, a ostatak odlazi u mrežu. Baterija sprema dnevni višak za večer i noć pa udio vlastite potrošnje može narasti na 60 do 80 %. Najviše se isplati ako veći dio struje trošite navečer, imate dizalicu topline ili električni automobil, ili želite rezervno napajanje pri nestanku struje. U 2026. FZOEU prvi put sufinancira i baterijske sustave, do 350 € po kWh kapaciteta.</p>
            <p>Kako elektrana radi s baterijom i bez nje, pogledajte u <a href="#kako-radi">prikazu tokova energije</a> ispod vodiča.</p>

            <h2 id="krov">Koliko panela i prostora na krovu treba?</h2>
            <p>Moderni panel snage oko 450 W zauzima približno 2 m² krova. Za 1 kWp treba oko 4,5 do 5 m², pa elektrana od 6 kWp traži 27 do 30 m² slobodne površine. U kontinentalnoj Hrvatskoj 1 kWp godišnje proizvede oko 1.150 do 1.250 kWh, a u Dalmaciji i do 1.450 kWh. Najbolja je južna orijentacija, no i krovovi okrenuti istoku i zapadu daju dobar rezultat, uz proizvodnju ravnomjernije raspoređenu kroz dan.</p>

            <h2 id="dokumentacija">Dokumentacija i HEP: što rješavamo umjesto vas</h2>
            <p>Za priključenje elektrane potrebni su glavni projekt, elektroenergetska suglasnost HEP ODS-a, ugovor o otkupu električne energije i potvrda za trajni pogon. Naš tim izrađuje projekt, priprema elaborate i mjerenja, vodi vas kroz postupak s HEP-om i nadzire montažu sve do puštanja elektrane u trajni pogon.</p>
          </article>
        </div>
      </section>

      <section className="section section--bg flow" id="kako-radi" aria-labelledby="flow-title">
        <div className="container">
          <div className="sec-head sec-head--split">
            <div>
              <span className="label">Tokovi energije</span>
              <h2 className="h2" id="flow-title">Kamo ide struja iz elektrane?</h2>
            </div>
            <p className="lead">Odaberite doba dana i pogledajte kako elektrana od 6,3 kWp na obiteljskoj kući radi tijekom sunčanog ljetnog dana, s baterijom i bez nje.</p>
          </div>
          <EnergyFlow />
        </div>
      </section>

      <InquiryForm />

      <Faq title="Još pitanja o solarnim elektranama" faqs={FAQS} />

      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb([{ name: 'Vodič 2026.', path: PATH }])} />
    </>
  );
}
