# EMSO – solarne elektrane i punionice

Nova web stranica za **EMSO e-mobility solutions d.o.o.**: solarne elektrane po sistemu „ključ u ruke“, punionice za električna vozila, poticaji za 2026. i vodič. Cilj stranice je upit za ponudu: posjetitelj ispuni kratki upit, a EMSO mu se javlja s izračunom i cijenom.

**Pregled:** https://vidknezevic.github.io/emso-solarne-elektrane/

## Tehnologija

React 19 i Next.js 16 (App Router) sa statičkim exportom (`output: 'export'`). Svaka stranica se pri buildu generira u gotov HTML, pa tražilice dobivaju cijeli sadržaj bez izvođenja JavaScripta. Interaktivni dijelovi (upit, kalkulatori, prikaz toka energije) su klijentske komponente.

## Stranice

| URL | Sadržaj |
| --- | --- |
| `/` | Hero s videom EMSO elektrane i prvim korakom upita (mjesečni račun), brojke i partneri, prednosti i rješenja, **program preporuke (nagrada do 500 €)**, proces „ključ u ruke“, upit za ponudu, reference, poticaji, tvrtke, FAQ |
| `/vodic-solarne-elektrane-2026/` | Vodič: kako radi elektrana, što određuje cijenu, neto obračun 2026., baterija, krov, HEP dokumentacija, prikaz toka energije s baterijom i bez nje |
| `/elektro-punionice/` | Punionice: usluge, izbor snage (3,7–22 kW), kalkulator troškova punjenja, vrijeme punjenja, upit za punionicu |
| `/poticaji-za-solarne-elektrane-2026/` | FZOEU javni poziv 2026., tablica iznosa, kalkulator najvišeg mogućeg poticaja, postupak, 0 % PDV, neto obračun |

Na svakoj stranici su upit za ponudu, mobilna traka (poziv / WhatsApp / ponuda) i kontakt u podnožju.

## Pokretanje

Potreban je Node 20.9+.

```bash
npm install
npm run dev                                   # razvoj na http://localhost:3000/emso-solarne-elektrane/
npm run build                                 # build za GitHub Pages → out/
SITE_URL=http://localhost:4173 npm run build  # build za lokalni pregled
npm run serve                                 # lokalni server za out/ na portu 4173
```

Svaki `push` na `main` automatski objavljuje stranicu (`.github/workflows/deploy.yml`), a nakon objave se pokreće Lighthouse provjera svih stranica na mobitelu i desktopu (`.github/workflows/lighthouse.yml`).

## Upit za ponudu

Upit ima tri koraka: potrošnja (što korisnika zanima, mjesečni račun, planovi), objekt (vrsta, krov, orijentacija ili priključak za punionicu, mjesto) i kontakt (uz polje za ime osobe koja ga je preporučila). Cijena se ne prikazuje na stranici, nego je EMSO šalje u ponudi.

Kamo upit ide određuje varijabla `FORM_ENDPOINT` pri buildu (u GitHubu: Settings → Secrets and variables → Actions → Variables):

- **postavljena** (npr. Formspree, Web3Forms ili vlastiti CRM): obrazac šalje JSON `POST` s poljima `interes`, `racun`, `planovi`, `objekt`, `krov`, `orijentacija`, `prikljucak`, `mjesto`, `ime`, `telefon`, `email`, `preporuka`, `napomena` i `stranica`;
- **prazna**: obrazac otvara e-mail program posjetitelja s pripremljenim upitom prema `info@emso.hr`.

## Program preporuke

Sekcija `#preporuka` na naslovnici: postojeći kupac podijeli stranicu (Web Share API ili WhatsApp, uz kopiranje poveznice), a preporučena osoba u upitu upiše njegovo ime. U poveznici se ne prenose osobni podaci. **Uvjeti programa su nacrt i EMSO ih treba potvrditi** (`app/page.jsx`, sekcija „Uvjeti programa preporuke“, i odgovor u FAQ-u).

## Prelazak na emso.hr

1. Build s produkcijskom adresom: `npm run build:prod` (ili u GitHubu postavite varijablu `SITE_URL=https://emso.hr`). Canonical, Open Graph, sitemap, robots.txt, llms.txt i strukturirani podaci automatski prelaze na novu domenu, a `basePath` postaje prazan.
2. Za postojeće URL-ove napravite 301 preusmjerenja: `/solarne-elektrane` → `/`, a `/elektro-punionice` već odgovara novoj adresi.
3. U Google Search Console prijavite `https://emso.hr/sitemap.xml`.
4. EMSO-ovi mediji trenutno se učitavaju izravno s `emso.hr/files/…` (logo, videi, fotografije referenci, logotipovi partnera). Za produkciju ih kopirajte u `public/` i promijenite adrese u `lib/site.js` (`media`) i `components/Logos.jsx`.

## SEO

- Jedinstveni `title` i `description` po stranici, canonical, `hreflang`, Open Graph i Twitter kartice s vlastitim slikama 1200×630 (`lib/seo.js`).
- Strukturirani podaci (JSON-LD): `HomeAndConstructionBusiness` (NAP, radno vrijeme, OIB, nagrada), `WebSite`, `WebPage`, `Service` s katalogom usluga, `FAQPage`, `Article` i `BreadcrumbList`.
- Semantički HTML, jedan `h1` po stranici, logična hijerarhija naslova, opisni `alt` tekstovi, interni linkovi između stranica.
- `sitemap.xml`, `robots.txt`, `llms.txt` i web manifest generiraju se iz `app/` (`sitemap.js`, `robots.js`, `llms.txt/route.js`, `manifest.js`).
- Brzina: font Montserrat je self-hosted i preloadan (bez Google Fonts poziva), uz rezervni font s istim metrikama protiv pomicanja teksta; slike imaju dimenzije i `loading="lazy"`; hero video kreće tek nakon učitavanja stranice (na mobitelu nakon prve interakcije), a ostali videi samo dok su vidljivi.
- Bez kolačića i praćenja, pa nije potreban cookie banner. Ako dodate Google Analytics, dodajte i upravljanje privolama.

## Kalkulatori

- **Punionice** (`components/EvCalculator.jsx`): usporedba godišnjeg troška benzina, javnog punjenja, kućnog punjenja i punjenja uz solarnu elektranu; sve cijene korisnik može promijeniti.
- **Poticaji** (`components/SubsidyCalculator.jsx`): najviši mogući poticaj prema pravilima FZOEU 2026. (50 % / 600 €/kW / najviše 6.000 € za elektranu, 350 €/kWh / najviše 5.600 € za bateriju, 6.250 € za dizalicu topline; 70 % za kućanstva u riziku od energetskog siromaštva). Iznosi iz ponude mogu se upisati po želji.
- **Tok energije** (`components/EnergyFlow.jsx`, `lib/flow-model.js`): sunčani ljetni dan, elektrana 6,3 kWp, baterija 10 kWh.

## Dizajn

Bijela podloga i EMSO plave boje kao na emso.hr, font Montserrat, ravne površine bez gradijenata. Boje su varijable na vrhu `app/globals.css`.

## Struktura

```
app/                   stranice (page.jsx), layout, 404, sitemap, robots, manifest, llms.txt, globals.css
components/            zaglavlje, podnožje, upit, program preporuke, kalkulatori, ikone …
lib/site.js            domena, podaci tvrtke, mediji, navigacija, endpoint obrasca
lib/seo.js             metapodaci i strukturirani podaci
lib/flow-model.js      model toka energije
public/                fontovi, OG slike i ikone
tools/make-images.py   generator OG slika i ikona (pip install pillow fonttools brotli)
```
