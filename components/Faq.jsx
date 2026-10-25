import { company } from '@/lib/site';

/** Česta pitanja kao <details> elementi; isti tekst ide i u FAQPage strukturirane podatke. */
export default function Faq({ id = 'cesta-pitanja', title, faqs, tone = 'bg' }) {
  return (
    <section className={`section section--${tone} faq`} id={id} aria-labelledby={`${id}-title`}>
      <div className="container faq__grid">
        <div className="faq__intro">
          <span className="label">Česta pitanja</span>
          <h2 className="h2" id={`${id}-title`}>{title}</h2>
          <p className="lead">
            Niste pronašli odgovor? Nazovite nas na <a href={company.phoneHref}>{company.phone}</a> ili pišite na{' '}
            <a href={`mailto:${company.email}`}>{company.email}</a>.
          </p>
        </div>
        <div className="faq__list">
          {faqs.map((f, i) => (
            <details className="qa" key={f.q} open={i === 0}>
              <summary>{f.q}</summary>
              <div className="qa__a"><p>{f.a}</p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
