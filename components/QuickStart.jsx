'use client';

const BILLS = ['do 50 €', '50–100 €', '100–150 €', '150–250 €', 'više od 250 €'];

/** Kartica u heroju: prvi korak upita. Odabir prenosi račun u obrazac i pomiče stranicu do njega. */
export default function QuickStart() {
  const pick = (racun) => {
    dispatchEvent(new CustomEvent('emso:prefill', { detail: { racun } }));
    document.getElementById('ponuda')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  return (
    <aside className="qstart" aria-labelledby="qstart-title">
      <p className="qstart__title" id="qstart-title">Besplatna ponuda za vaš krov</p>
      <p className="qstart__q">Koliki je vaš prosječni mjesečni račun za struju?</p>
      <div className="qstart__opts">
        {BILLS.map((b) => (
          <button key={b} type="button" className="qstart__opt" onClick={() => pick(b)}>{b}</button>
        ))}
      </div>
      <p className="qstart__note">Nakon još dva kratka koraka naš stručnjak izrađuje izračun i javlja vam se s ponudom.</p>
    </aside>
  );
}
