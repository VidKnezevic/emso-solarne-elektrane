'use client';

import { useState } from 'react';
import { eur, n0, n1 } from '@/lib/format';

// Iznosi iz objave FZOEU za javni poziv 2026. (1. 9. 2026.)
const RULES = {
  base: { rate: 0.5, pvPerKw: 600, pvMax: 6000, battPerKwh: 350, battMax: 5600, hpMax: 6250 },
  poverty: { rate: 0.7, pvPerKw: 840, pvMax: 8400, battPerKwh: 490, battMax: 7840, hpMax: 8750 },
};

/** Najmanji od mogućih limita određuje iznos poticaja. */
const limit = (options) => options.filter((o) => o.v !== null).reduce((best, o) => (o.v < best.v ? o : best));

function Toggle({ checked, onChange, children }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__ui" aria-hidden="true" />
      <span>{children}</span>
    </label>
  );
}

function Money({ label, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" min="0" step="50" inputMode="numeric" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

/**
 * Najviši mogući poticaj FZOEU prema snazi elektrane i kapacitetu baterije.
 * Cijenu iz ponude korisnik može upisati, pa se primjenjuje i ograničenje od 50 % (70 %) troška.
 */
export default function SubsidyCalculator() {
  const [kwp, setKwp] = useState(6.3);
  const [battery, setBattery] = useState(false);
  const [battKwh, setBattKwh] = useState(10);
  const [hp, setHp] = useState(false);
  const [poverty, setPoverty] = useState(false);
  const [pvCost, setPvCost] = useState('');
  const [battCost, setBattCost] = useState('');
  const [hpCost, setHpCost] = useState('');

  const R = poverty ? RULES.poverty : RULES.base;
  const pctLabel = `${n0(R.rate * 100)} % troška`;
  const fromCost = (c) => (c === '' ? null : R.rate * +c);

  const lines = [
    { name: 'Solarna elektrana', ...limit([{ v: fromCost(pvCost), why: pctLabel }, { v: R.pvPerKw * kwp, why: `${R.pvPerKw} €/kW × ${n1(kwp)} kW` }, { v: R.pvMax, why: `najviše ${eur(R.pvMax)}` }]) },
  ];
  if (battery) lines.push({ name: 'Baterijski spremnik', ...limit([{ v: fromCost(battCost), why: pctLabel }, { v: R.battPerKwh * battKwh, why: `${R.battPerKwh} €/kWh × ${n1(battKwh)} kWh` }, { v: R.battMax, why: `najviše ${eur(R.battMax)}` }]) });
  if (hp) lines.push({ name: 'Dizalica topline', ...limit([{ v: fromCost(hpCost), why: pctLabel }, { v: R.hpMax, why: `najviše ${eur(R.hpMax)}` }]) });
  const total = lines.reduce((s, l) => s + l.v, 0);
  const anyCost = pvCost !== '' || battCost !== '' || hpCost !== '';

  return (
    <div className="sub__wrap">
      <form className="sub__form card" onSubmit={(e) => e.preventDefault()}>
        <label className="ev__row">
          <span className="ev__row-h">Snaga solarne elektrane <output>{n1(kwp)} kWp</output></span>
          <input className="range" type="range" min="1" max="20" step="0.45" value={kwp} style={{ '--p': `${((kwp - 1) / 19) * 100}%` }} onChange={(e) => setKwp(+e.target.value)} />
        </label>
        <Toggle checked={battery} onChange={setBattery}>Baterijski spremnik</Toggle>
        {battery && (
          <label className="ev__row">
            <span className="ev__row-h">Kapacitet baterije <output>{n1(battKwh)} kWh</output></span>
            <input className="range" type="range" min="5" max="25" step="0.5" value={battKwh} style={{ '--p': `${((battKwh - 5) / 20) * 100}%` }} onChange={(e) => setBattKwh(+e.target.value)} />
          </label>
        )}
        <Toggle checked={hp} onChange={setHp}>Dizalica topline</Toggle>
        <Toggle checked={poverty} onChange={setPoverty}>Kućanstvo u riziku od energetskog siromaštva <small>viša stopa, do 70 %</small></Toggle>
        <details className="adv">
          <summary>Imate ponudu? Upišite iznose</summary>
          <div className="adv__grid">
            <Money label="Cijena elektrane s montažom (€)" value={pvCost} onChange={setPvCost} placeholder="iz ponude" />
            {battery && <Money label="Cijena baterije s ugradnjom (€)" value={battCost} onChange={setBattCost} placeholder="iz ponude" />}
            {hp && <Money label="Cijena dizalice topline s ugradnjom (€)" value={hpCost} onChange={setHpCost} placeholder="iz ponude" />}
          </div>
        </details>
      </form>

      <div className="sub__res card" aria-live="polite">
        <p className="res__k">{anyCost ? 'Procijenjeni poticaj FZOEU' : 'Najviši mogući poticaj FZOEU'}</p>
        <p className="res__big">{eur(total)}</p>
        <p className="res__sub">{anyCost ? 'prema upisanim iznosima iz ponude' : `uz uvjet da poticaj ne prelazi ${pctLabel}`}</p>
        <div className="sub__lines">
          {lines.map((l) => (
            <div className="sub__line" key={l.name}>
              <span>{l.name}<small>mjerodavno: {l.why}</small></span>
              <b>{eur(l.v)}</b>
            </div>
          ))}
        </div>
        <a className="btn btn--primary btn--block" href="#ponuda">Zatražite ponudu</a>
        <p className="fine" style={{ marginTop: 14 }}>Informativni izračun prema iznosima iz objave FZOEU za javni poziv 2026. Konačan iznos utvrđuje Fond prema prihvatljivim troškovima i uvjetima poziva.</p>
      </div>
    </div>
  );
}
