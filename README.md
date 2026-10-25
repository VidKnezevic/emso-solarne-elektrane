# EMSO – solarne elektrane i punionice

Nova web stranica za **EMSO e-mobility solutions d.o.o.**: solarne elektrane po sistemu „ključ u ruke“, punionice za električna vozila i vodič kroz poticaje za 2026.

**Pregled:** https://vidknezevic.github.io/emso-solarne-elektrane/

## Stranice

| URL | Sadržaj |
| --- | --- |
| `/` | Solarne elektrane: hero s videom EMSO elektrane i brzim izračunom, brojke, partneri, proces „ključ u ruke“, montaža, kalkulator uštede (tri pitanja), prikaz toka energije za četiri doba dana s baterijom i bez nje, prednosti, tvrtke, reference (fotografije i videi), vodič 2026., FAQ |
| `/elektro-punionice/` | Punionice: usluge, izbor snage (3,7–22 kW), kalkulator troškova punjenja (benzin / javno / kućno / solar), vrijeme punjenja, FAQ |
| `/poticaji-za-solarne-elektrane-2026/` | FZOEU javni poziv 2026., tablica iznosa, kalkulator poticaja, postupak, 0 % PDV, neto obračun, FAQ |

Na svakoj stranici je obrazac za ponudu u 4 koraka, mobilna traka (poziv / WhatsApp / ponuda) i kontakt u podnožju.

## Pokretanje

Nema ovisnosti – potreban je samo Node 18+.

```bash
node build.mjs                                   # build za GitHub Pages pregled → dist/
SITE_URL=http://localhost:4173 node build.mjs    # build za lokalni pregled
python3 -m http.server 4173 --directory dist     # lokalni server
```

Svaki `push` na `main` automatski objavljuje stranicu (`.github/workflows/deploy.yml`), a nakon objave se pokreće Lighthouse provjera svih stranica na mobitelu i desktopu (`.github/workflows/lighthouse.yml`) – rezultati su u sažetku runa pod **Actions**, a HTML izvještaji kao artefakti.

## Prelazak na emso.hr

1. Build s produkcijskom adresom: `SITE_URL=https://emso.hr node build.mjs` (ili u GitHubu postavite repozitorijsku varijablu `SITE_URL`). Canonical, Open Graph, sitemap, robots.txt i strukturirani podaci automatski prelaze na novu domenu.
2. Za postojeće URL-ove napravite 301 preusmjerenja: `/solarne-elektrane` → `/`, a `/elektro-punionice` već odgovara novoj adresi.
3. U Google Search Console prijavite `https://emso.hr/sitemap.xml`.
4. EMSO-ovi mediji trenutno se učitavaju izravno s `emso.hr/files/…`: logo (`SIMBOL.webp`), video u heroju (AluK Tim), videi referenci (IVERPAN, Jakuševec), fotografije referenci i logotipovi partnera. Za produkciju ih kopirajte u `src/assets/`, adrese promijenite u `site.config.mjs` (`media`) i na stranicama, a hero video po mogućnosti skratite i komprimirajte (npr. 720p, bez zvuka, 3–5 MB).

## Obrazac za ponudu

U `site.config.mjs` postavite `formEndpoint` (npr. Formspree, Web3Forms ili vlastiti CRM). Obrazac tada šalje JSON `POST`. Dok je prazno, obrazac otvara e-mail klijent s ispunjenim upitom prema `info@emso.hr`.

## SEO

- Jedinstveni `title` i `description` po stranici (build upozorava ako su predugi), canonical, `hreflang`, Open Graph i Twitter kartice s vlastitim slikama 1200×630.
- Strukturirani podaci (JSON-LD): `HomeAndConstructionBusiness` (NAP, radno vrijeme, OIB, nagrada), `WebSite`, `WebPage`, `Service` s katalogom usluga, `FAQPage`, `Article` i `BreadcrumbList`.
- Semantički HTML, jedan `h1` po stranici, logična hijerarhija naslova, opisni `alt` tekstovi, interni linkovi između stranica.
- `sitemap.xml`, `robots.txt`, `llms.txt` (za AI pretraživače), web manifest i ikone.
- Brzina: bez frameworka, font Montserrat je self-hosted (bez Google Fonts poziva, što je i GDPR prednost), JS se učitava kao `module`, slike imaju dimenzije i `loading="lazy"`, hero video kreće tek nakon učitavanja stranice, a videi referenci samo dok su vidljivi.

## Dizajn

Bijela podloga i EMSO plave boje (#0A2344, #1E73BE, #00A0E3) kao na emso.hr, font Montserrat, ravne površine bez gradijenata i dekoracija. Boje su definirane kao varijable na vrhu `src/assets/css/main.css`.
- Bez kolačića i praćenja – nije potreban cookie banner. Ako dodate Google Analytics, dodajte i upravljanje privolama.

## Kalkulatori – pretpostavke

`src/assets/js/solar-model.js` sadrži sve pretpostavke na jednom mjestu. Kalkulator na naslovnici pita samo mjesečni račun, regiju te želi li korisnik bateriju (10 kWh) i punjenje auta (15.000 km godišnje); krov se pretpostavlja prema jugu, a poticaj FZOEU je uključen. Prikaz toka energije koristi `src/assets/js/flow-model.js` (sunčani ljetni dan, elektrana 6,3 kWp, baterija 10 kWh).

- Proizvodnja po regiji (PVGIS procjena, kWh/kWp): sjever 1.150, Zagreb 1.180, Lika 1.200, Slavonija 1.220, Istra i Kvarner 1.320, sjeverna Dalmacija 1.420, srednja i južna Dalmacija 1.460.
- Cijena struje 0,16 €/kWh za kućanstva (sve uključeno) i 0,20 €/kWh za tvrtke; vrijednost viška u mreži 0,07 €/kWh, priznaje se najviše do količine preuzete u istom mjesecu (neto obračun 2026.).
- Okvirne cijene: elektrana 1.400 € + 760 €/kWp (kućanstva, 0 % PDV), 1.800 € + 640 €/kWp (tvrtke, bez PDV-a); baterija 900 € + 430 €/kWh.
- Poticaj FZOEU 2026.: 50 % / 600 €/kW / najviše 6.000 € za elektranu; 50 % / 350 €/kWh / najviše 5.600 € za bateriju.
- 25 godina: rast cijene struje 3 % godišnje, degradacija panela 0,5 % godišnje, zamjena invertera u 13. godini.

Ove brojke prilagodite stvarnom EMSO cjeniku prije produkcije.

## Slike

`python3 tools/make-images.py` ponovno generira OG slike i ikone (potrebno: `pip install pillow fonttools brotli`).

## Struktura

```
build.mjs              statički build (partiali, SEO meta, sitemap, robots)
site.config.mjs        domena, podaci tvrtke, endpoint obrasca
src/pages/             stranice (JSON front-matter + HTML)
src/partials/          layout, zaglavlje, podnožje, obrazac, ikone
src/assets/css/        dizajn
src/assets/js/         kalkulatori, simulacija, obrazac
src/static/            manifest, llms.txt
tools/make-images.py   generator OG slika i ikona
```
