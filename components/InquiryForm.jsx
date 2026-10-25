'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';
import { FORM_ENDPOINT, company } from '@/lib/site';
import { BILLS, CUSTOMERS, objectFor } from '@/lib/inquiry';

const INTERESTS = [
  { value: 'Solarna elektrana', icon: 'panel' },
  { value: 'Solarna elektrana s baterijom', icon: 'battery' },
  { value: 'Solarna elektrana i punionica', icon: 'car' },
  { value: 'Punionica za električno vozilo', icon: 'plug' },
];
const PLANS = ['Dizalica topline', 'Klima uređaji', 'Električni automobil', 'Bazen'];
const OBJECTS = ['Obiteljska kuća', 'Vikendica', 'Stambena zgrada', 'Tvrtka', 'Poljoprivredni objekt'];
const ROOFS = ['Crijep', 'Lim ili sendvič panel', 'Ravni krov', 'Tlo ili nadstrešnica', 'Ne znam'];
const ORIENTATIONS = ['Jug', 'Istok ili zapad', 'Sjever', 'Ne znam'];
const CONNECTIONS = ['Trofazni', 'Jednofazni', 'Ne znam'];
const STEPS = ['Potrošnja', 'Objekt', 'Kontakt'];

const EMPTY = {
  interes: INTERESTS[0].value,
  kupac: CUSTOMERS[0].value,
  racun: '',
  planovi: [],
  objekt: OBJECTS[0],
  krov: ROOFS[0],
  orijentacija: ORIENTATIONS[3],
  prikljucak: CONNECTIONS[2],
  mjesto: '',
  ime: '',
  telefon: '',
  email: '',
  preporuka: '',
  napomena: '',
  privatnost: false,
};

function Choices({ name, options, value, onChange, multi = false, cards = false }) {
  return (
    <div className={cards ? 'choices choices--cards' : 'choices'}>
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const checked = multi ? value.includes(v) : value === v;
        return (
          <label key={v} className={cards ? 'choice' : 'choice choice--pill'}>
            <input
              type={multi ? 'checkbox' : 'radio'}
              name={name}
              value={v}
              checked={checked}
              onChange={() => onChange(multi ? (checked ? value.filter((x) => x !== v) : [...value, v]) : v)}
            />
            <span>
              {o.icon && <Icon name={o.icon} />}
              {v}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function InquiryForm({ defaultInterest, heading = 'Zatražite izračun i ponudu', intro }) {
  const [data, setData] = useState(() => ({ ...EMPTY, interes: defaultInterest || EMPTY.interes }));
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done-post | done-mail
  const formRef = useRef(null);
  const stepRef = useRef(null);
  const firstRender = useRef(true);
  const chargerOnly = data.interes === 'Punionica za električno vozilo';
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  const field = (k) => ({ value: data[k], onChange: (e) => set(k)(e.target.value) });
  // Kućanstvo ili tvrtka mijenja raspone računa i zadani objekt.
  const setKupac = (kupac) =>
    setData((d) => ({ ...d, kupac, objekt: objectFor(kupac), racun: BILLS[kupac].includes(d.racun) ? d.racun : '' }));

  // Odabir iz kartice u heroju ili s gumba koji unaprijed bira interes.
  useEffect(() => {
    const onPrefill = (e) => {
      const { kupac, ...rest } = e.detail;
      setData((d) => ({ ...d, ...rest, ...(kupac && { kupac, objekt: objectFor(kupac) }) }));
      setStep(0);
    };
    addEventListener('emso:prefill', onPrefill);
    return () => removeEventListener('emso:prefill', onPrefill);
  }, []);

  // Pri promjeni koraka fokus ide na naslov koraka, a obrazac ostaje u vidnom polju.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepRef.current?.focus({ preventScroll: true });
    const hdr = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hdr')) || 72;
    const top = formRef.current?.getBoundingClientRect().top ?? hdr;
    if (top < hdr) formRef.current.scrollIntoView({ block: 'start' });
  }, [step]);

  function validate() {
    if (step === 0 && !chargerOnly && !data.racun) return 'Odaberite približan iznos mjesečnog računa.';
    if (step === 1 && !data.mjesto.trim()) return 'Upišite mjesto ugradnje.';
    if (step === 2) {
      if (!data.ime.trim() || !data.telefon.trim() || !data.email.trim()) return 'Upišite ime, telefon i e-mail.';
      if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) return 'Provjerite e-mail adresu.';
      if (!data.privatnost) return 'Za slanje upita potrebna je vaša suglasnost.';
    }
    return '';
  }

  function next() {
    const msg = validate();
    setError(msg);
    if (!msg) setStep((s) => s + 1);
  }

  async function submit(e) {
    e.preventDefault();
    // Enter u polju prije zadnjeg koraka samo prelazi na sljedeći korak.
    if (step < STEPS.length - 1) return next();
    const msg = validate();
    setError(msg);
    if (msg) return;

    const payload = {
      kupac: data.kupac,
      interes: data.interes,
      racun: chargerOnly ? '' : data.racun,
      planovi: data.planovi.join(', '),
      objekt: data.objekt,
      krov: chargerOnly ? '' : data.krov,
      orijentacija: chargerOnly ? '' : data.orijentacija,
      prikljucak: chargerOnly ? data.prikljucak : '',
      mjesto: data.mjesto,
      ime: data.ime,
      telefon: data.telefon,
      email: data.email,
      preporuka: data.preporuka,
      napomena: data.napomena,
      stranica: location.href,
    };

    if (FORM_ENDPOINT) {
      setStatus('sending');
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('done-post');
      } catch {
        setStatus('idle');
        setError(`Slanje trenutno nije uspjelo. Nazovite nas na ${company.phone} ili pišite na ${company.email}.`);
      }
      return;
    }

    const lines = [
      'Poštovani,',
      '',
      'molim vas izračun i ponudu prema sljedećim podacima:',
      '',
      `Ponuda je za: ${payload.kupac}`,
      `Zanima me: ${payload.interes}`,
      payload.racun && `Mjesečni račun za struju: ${payload.racun}`,
      payload.planovi && `Planiram: ${payload.planovi}`,
      `Objekt: ${payload.objekt}`,
      payload.krov && `Krov: ${payload.krov}`,
      payload.orijentacija && `Orijentacija krova: ${payload.orijentacija}`,
      payload.prikljucak && `Priključak: ${payload.prikljucak}`,
      `Mjesto ugradnje: ${payload.mjesto}`,
      payload.preporuka && `Preporučio/la me: ${payload.preporuka}`,
      payload.napomena && `Napomena: ${payload.napomena}`,
      '',
      `Ime i prezime: ${payload.ime}`,
      `Telefon: ${payload.telefon}`,
      `E-mail: ${payload.email}`,
    ].filter((l) => l !== false && l !== undefined && l !== null);
    const subject = `Upit za ponudu: ${payload.interes} (${payload.mjesto})`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setStatus('done-mail');
  }

  const done = status === 'done-post' || status === 'done-mail';

  return (
    <section className="section section--sky inquiry" id="ponuda" aria-labelledby="ponuda-title">
      <div className="container inquiry__grid">
        <div className="inquiry__intro">
          <span className="label">Besplatno i bez obveze</span>
          <h2 className="h2" id="ponuda-title">{heading}</h2>
          <p className="lead">
            {intro || 'Odgovorite na nekoliko pitanja o potrošnji i objektu. Naš stručnjak izradit će izračun i ponudu za vaš krov te vam se javiti s cijenom.'}
          </p>
          <ol className="inquiry__how" role="list">
            <li><span>1</span>Pošaljete upit, traje oko dvije minute</li>
            <li><span>2</span>Izrađujemo izračun i ponudu za vaš objekt</li>
            <li><span>3</span>Javljamo vam se s cijenom i odgovorima na pitanja</li>
          </ol>
          <div className="inquiry__direct">
            <span>Radije biste razgovarali?</span>
            <a href={company.phoneHref}>{company.phone}</a>
            <span>{company.hours}</span>
          </div>
        </div>

        <form className="wizard card" ref={formRef} onSubmit={submit} noValidate>
          {done ? (
            <div className="wizard__done" role="status">
              <div className="wizard__done-ico"><Icon name="check" size={30} /></div>
              <p className="wizard__q">Hvala na upitu</p>
              <p>
                {status === 'done-post'
                  ? 'Upit je zaprimljen. Naš stručnjak izradit će izračun i ponudu te vam se javiti u najkraćem roku.'
                  : `Otvorili smo vaš e-mail program s pripremljenim upitom, samo kliknite „Pošalji“. Ako se nije otvorio, pišite nam na ${company.email}.`}
              </p>
            </div>
          ) : (
            <>
              <ol className="wizard__steps" role="list" aria-label="Koraci upita">
                {STEPS.map((s, i) => (
                  <li key={s} className={i === step ? 'is-current' : i < step ? 'is-done' : ''} aria-current={i === step ? 'step' : undefined}>
                    <span>{i < step ? <Icon name="check" size={14} /> : i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>

              {step === 0 && (
                <div className="wizard__step">
                  <fieldset>
                    <legend className="wizard__q" tabIndex={-1} ref={stepRef}>Što vas zanima?</legend>
                    <Choices name="interes" options={INTERESTS} value={data.interes} onChange={set('interes')} cards />
                  </fieldset>
                  <fieldset>
                    <legend className="wizard__sub">Ponuda je za</legend>
                    <Choices name="kupac" options={CUSTOMERS} value={data.kupac} onChange={setKupac} />
                  </fieldset>
                  {!chargerOnly && (
                    <fieldset>
                      <legend className="wizard__sub">Koliki je vaš prosječni mjesečni račun za struju?</legend>
                      <Choices name="racun" options={BILLS[data.kupac]} value={data.racun} onChange={set('racun')} />
                    </fieldset>
                  )}
                  <fieldset>
                    <legend className="wizard__sub">Planirate li uskoro nešto od ovoga? <small>(nije obavezno)</small></legend>
                    <Choices name="planovi" options={PLANS} value={data.planovi} onChange={set('planovi')} multi />
                  </fieldset>
                </div>
              )}

              {step === 1 && (
                <div className="wizard__step">
                  <fieldset>
                    <legend className="wizard__q" tabIndex={-1} ref={stepRef}>O objektu</legend>
                    <Choices name="objekt" options={OBJECTS} value={data.objekt} onChange={set('objekt')} />
                  </fieldset>
                  {chargerOnly ? (
                    <fieldset>
                      <legend className="wizard__sub">Kakav je električni priključak objekta?</legend>
                      <Choices name="prikljucak" options={CONNECTIONS} value={data.prikljucak} onChange={set('prikljucak')} />
                    </fieldset>
                  ) : (
                    <>
                      <fieldset>
                        <legend className="wizard__sub">Vrsta krova</legend>
                        <Choices name="krov" options={ROOFS} value={data.krov} onChange={set('krov')} />
                      </fieldset>
                      <fieldset>
                        <legend className="wizard__sub">Na koju stranu je okrenut krov?</legend>
                        <Choices name="orijentacija" options={ORIENTATIONS} value={data.orijentacija} onChange={set('orijentacija')} />
                      </fieldset>
                    </>
                  )}
                  <label className="field">
                    <span>Mjesto ugradnje *</span>
                    <input type="text" autoComplete="address-level2" placeholder="npr. Velika Gorica" {...field('mjesto')} />
                  </label>
                </div>
              )}

              {step === 2 && (
                <div className="wizard__step">
                  <p className="wizard__q" tabIndex={-1} ref={stepRef}>Kome šaljemo izračun i ponudu?</p>
                  <label className="field">
                    <span>Ime i prezime *</span>
                    <input type="text" autoComplete="name" {...field('ime')} />
                  </label>
                  <div className="field-row">
                    <label className="field">
                      <span>Telefon *</span>
                      <input type="tel" autoComplete="tel" {...field('telefon')} />
                    </label>
                    <label className="field">
                      <span>E-mail *</span>
                      <input type="email" autoComplete="email" {...field('email')} />
                    </label>
                  </div>
                  <label className="field">
                    <span>Preporučio vas je postojeći kupac? <small>Upišite ime i prezime za program preporuke</small></span>
                    <input type="text" {...field('preporuka')} />
                  </label>
                  <label className="field">
                    <span>Napomena</span>
                    <textarea rows={3} placeholder="npr. imamo i garažu za punionicu, krov je star 5 godina" {...field('napomena')} />
                  </label>
                  <label className="check">
                    <input type="checkbox" checked={data.privatnost} onChange={(e) => set('privatnost')(e.target.checked)} />
                    <span>
                      Upoznat/a sam s <a href="https://emso.hr/pravila-privatnosti" target="_blank" rel="noopener">pravilima privatnosti</a> i pristajem da me EMSO kontaktira u vezi s ovim upitom. *
                    </span>
                  </label>
                </div>
              )}

              <p className="wizard__error" role="alert">{error}</p>

              <div className="wizard__nav">
                {step > 0 && (
                  <button type="button" className="btn btn--outline" onClick={() => { setError(''); setStep((s) => s - 1); }}>
                    Natrag
                  </button>
                )}
                {/* Različiti ključevi: React inače isti gumb pretvori u type="submit" usred klika pa se obrazac odmah pošalje. */}
                {step < STEPS.length - 1 ? (
                  <button key="next" type="button" className="btn btn--primary" onClick={next}>Dalje</button>
                ) : (
                  <button key="submit" type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Šaljem…' : 'Pošalji upit'}
                  </button>
                )}
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
