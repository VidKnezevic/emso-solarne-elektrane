'use client';

import { useState } from 'react';
import { Icon } from './Icons';
import { BILLS, CUSTOMERS, NOT_SURE } from '@/lib/inquiry';

/** Kartica u heroju: prvi korak upita. Odabir prenosi podatke u obrazac i pomiče stranicu do njega. */
export default function QuickStart() {
  const [kupac, setKupac] = useState(CUSTOMERS[0].value);
  const [racun, setRacun] = useState('');

  const pick = (value) => {
    setRacun(value);
    dispatchEvent(new CustomEvent('emso:prefill', { detail: { kupac, racun: value } }));
    document.getElementById('ponuda')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  return (
    <aside className="qcard" aria-labelledby="qcard-q">
      <div className="qcard__body">
        <div className="qcard__head">
          <p className="qcard__label">Besplatna ponuda</p>
          <p className="qcard__step">Korak 1 od 3</p>
        </div>
        <div className="qcard__bar" aria-hidden="true"><i /><i /><i /></div>

        <p className="qcard__q" id="qcard-q">Koliki je vaš prosječni mjesečni račun za struju?</p>

        <fieldset className="qcard__seg">
          <legend className="visually-hidden">Ponuda je za</legend>
          {CUSTOMERS.map((c) => (
            <label key={c.value}>
              <input
                type="radio"
                name="qcard-kupac"
                value={c.value}
                checked={kupac === c.value}
                onChange={() => {
                  setKupac(c.value);
                  setRacun('');
                }}
              />
              <span><Icon name={c.icon} size={18} />{c.value}</span>
            </label>
          ))}
        </fieldset>

        <div className="qcard__opts">
          {BILLS[kupac].map((b) => (
            <button
              key={b}
              type="button"
              className={b === NOT_SURE ? 'qcard__opt qcard__opt--soft' : 'qcard__opt'}
              aria-pressed={racun === b}
              onClick={() => pick(b)}
            >
              {b}
              <Icon name="arrow" size={18} />
            </button>
          ))}
        </div>

        <ul className="qcard__trust" role="list">
          <li><Icon name="check" size={16} />Besplatno i bez obveze</li>
          <li><Icon name="clock" size={16} />Traje oko 2 minute</li>
        </ul>
      </div>

      <a className="qcard__ref" href="#preporuka">
        <Icon name="gift" size={22} />
        <span><b>Do 500&nbsp;€ nagrade</b> uz preporuku EMSO kupca</span>
        <Icon name="arrow" size={18} />
      </a>
    </aside>
  );
}
