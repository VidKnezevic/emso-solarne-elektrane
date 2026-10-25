import { SITE_URL, company } from '@/lib/site';

export const dynamic = 'force-static';

// Sažetak stranice za jezične modele (llmstxt.org).
export function GET() {
  const body = `# EMSO e-mobility solutions

> EMSO e-mobility solutions d.o.o. (Velika Gorica, Hrvatska) projektira, oprema i montira solarne elektrane i punionice za električna vozila po sistemu „ključ u ruke“ za kućanstva i tvrtke u cijeloj Hrvatskoj. Isporučeno je 2.074 solarnih elektrana; većina se montira i pušta u rad u jednom danu.

Ključne činjenice:
- Usluga „ključ u ruke“: besplatno savjetovanje i ponuda, projektiranje (glavni projekt, elektroenergetska suglasnost HEP ODS-a), opremanje i montaža.
- Cijenu daje EMSO u besplatnoj ponudi nakon upita s podacima o potrošnji i objektu.
- Program preporuke: postojeći kupac i osoba koju preporuči ostvaruju pravo na nagradu do 500 € nakon ugovora i puštanja elektrane u rad.
- Ugovoreni partner E.ON-a za montažu solarnih elektrana; ovlašteni instalater FUJI SOLAR i Huawei.
- Ugovoreni partner Hrvatskog telekoma za projektiranje, montiranje i servisiranje e-punionica; ovlašteni distributer ETREL punionica.
- Jamstvo do 25 godina na proizvodni kapacitet panela; mogućnost desetogodišnjeg osiguranja elektrane.
- Nagrada Zeleni Leptir 2023., kategorija održiva energija i mobilnost.
- Kontakt: ${company.phone}, ${company.email}, ${company.street}, ${company.postalCode} ${company.city}. Radno vrijeme: ${company.hours}.

## Stranice

- [Solarne elektrane ključ u ruke](${SITE_URL}/): usluga, proces, program preporuke, upit za ponudu i česta pitanja.
- [Vodič: solarna elektrana u 2026.](${SITE_URL}/vodic-solarne-elektrane-2026/): kako radi elektrana, cijena, neto obračun, baterija, krov, HEP dokumentacija.
- [Punionice za električna vozila](${SITE_URL}/elektro-punionice/): kućne, poslovne i javne punionice, kalkulator troškova punjenja.
- [Poticaji za solarne elektrane 2026.](${SITE_URL}/poticaji-za-solarne-elektrane-2026/): FZOEU javni poziv, iznosi sufinanciranja, 0 % PDV-a, neto obračun.
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
