import Link from 'next/link';
import InquiryForm from '@/components/InquiryForm';

export const metadata = {
  title: { absolute: 'Stranica nije pronađena | EMSO' },
  description: 'Tražena stranica ne postoji. Pogledajte solarne elektrane, punionice za električna vozila ili poticaje za 2026. na stranicama EMSO-a.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <section className="nf" aria-labelledby="nf-title">
        <div className="container">
          <span className="label">Greška 404</span>
          <h1 className="h1" id="nf-title">Stranica nije pronađena</h1>
          <p className="lead">Stranica koju tražite ne postoji ili je premještena. Možete nastaviti na jednu od ovih stranica ili nam odmah poslati upit.</p>
          <div className="hero__ctas">
            <Link className="btn btn--primary btn--lg" href="/">Solarne elektrane</Link>
            <Link className="btn btn--outline btn--lg" href="/elektro-punionice/">Elektro punionice</Link>
            <Link className="btn btn--outline btn--lg" href="/poticaji-za-solarne-elektrane-2026/">Poticaji 2026.</Link>
          </div>
        </div>
      </section>
      <InquiryForm />
    </>
  );
}
