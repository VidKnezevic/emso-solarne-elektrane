'use client';

import { useState } from 'react';
import { eur, n0, n1, pct } from '@/lib/format';

const CHARGE_LOSS = 1.1;
const POWERS = [3.7, 7.4, 11, 22];
const CAR_MAX_AC = 11;

function Slider({ label, value, min, max, step, onChange, format }) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <label className="ev__row">
      <span className="ev__row-h">{label} <output>{format(value)}</output></span>
      <input className="range" type="range" min={min} max={max} step={step} value={value} style={{ '--p': `${p}%` }} onChange={(e) => onChange(+e.target.value)} />
    </label>
  );
}

function Price({ label, value, onChange, step = 0.01 }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" step={step} min="0" value={value} onChange={(e) => onChange(e.target.value === '' ? '' : +e.target.value)} />
    </label>
  );
}

/** Usporedba godišnjeg troška: benzin, javno brzo punjenje, kućna punionica i kućna punionica uz solar. */
export default function EvCalculator() {
  const [km, setKm] = useState(15000);
  const [kwh100, setKwh100] = useState(17);
  const [l100, setL100] = useState(6.5);
  const [solar, setSolar] = useState(60);
  const [fuel, setFuel] = useState(1.75);
  const [home, setHome] = useState(0.16);
  const [pub, setPub] = useState(0.55);
  const [solarPrice, setSolarPrice] = useState(0.07);
  const [batt, setBatt] = useState(60);

  const kwh = (km / 100) * kwh100;
  const share = solar / 100;
  const cost = {
    petrol: (km / 100) * l100 * (+fuel || 0),
    public: kwh * (+pub || 0),
    home: kwh * CHARGE_LOSS * (+home || 0),
    solar: kwh * CHARGE_LOSS * (share * (+solarPrice || 0) + (1 - share) * (+home || 0)),
  };
  const max = Math.max(...Object.values(cost), 1);
  const save = cost.petrol - cost.solar;
  const bar = (k) => ({ '--w': `${Math.max(1.5, (cost[k] / max) * 100)}%` });
  const hours = (p) => {
    const h = (batt * 0.7) / (Math.min(p, CAR_MAX_AC) * 0.9);
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return mm === 60 ? `${hh + 1} h` : `${hh} h${mm ? ` ${mm} min` : ''}`;
  };

  return (
    <div className="ev__wrap">
      <form className="ev__form card" onSubmit={(e) => e.preventDefault()}>
        <Slider label="Prijeđeni kilometri godišnje" value={km} min={3000} max={60000} step={1000} onChange={setKm} format={(v) => `${n0(v)} km`} />
        <Slider label="Potrošnja električnog auta" value={kwh100} min={12} max={28} step={0.5} onChange={setKwh100} format={(v) => `${n1(v)} kWh/100 km`} />
        <Slider label="Potrošnja usporednog auta na benzin" value={l100} min={4} max={12} step={0.1} onChange={setL100} format={(v) => `${n1(v)} l/100 km`} />
        <Slider label="Udio punjenja iz solarne elektrane" value={solar} min={0} max={100} step={5} onChange={setSolar} format={pct} />
        <details className="adv">
          <summary>Cijene</summary>
          <div className="adv__grid">
            <Price label="Cijena benzina (€/l)" value={fuel} onChange={setFuel} />
            <Price label="Struja kod kuće (€/kWh, sve uključeno)" value={home} onChange={setHome} />
            <Price label="Javno brzo punjenje (€/kWh)" value={pub} onChange={setPub} />
            <Price label="Vrijednost solarnog kWh (otkupna cijena, €/kWh)" value={solarPrice} onChange={setSolarPrice} />
          </div>
        </details>
      </form>

      <div>
        <div className="ev__res card" aria-live="polite">
          <p className="res__k">Godišnji trošak goriva ili energije</p>
          <div className="ev__bars">
            <div className="ev__bar"><div className="ev__bar-h"><span>Benzin</span><b>{eur(cost.petrol)} / god.</b></div><div className="ev__track"><i style={bar('petrol')} /></div></div>
            <div className="ev__bar"><div className="ev__bar-h"><span>Javne brze punionice</span><b>{eur(cost.public)} / god.</b></div><div className="ev__track ev__track--public"><i style={bar('public')} /></div></div>
            <div className="ev__bar"><div className="ev__bar-h"><span>Kućna punionica, struja iz mreže</span><b>{eur(cost.home)} / god.</b></div><div className="ev__track ev__track--grid"><i style={bar('home')} /></div></div>
            <div className="ev__bar"><div className="ev__bar-h"><span>Kućna punionica i solarna elektrana</span><b>{eur(cost.solar)} / god.</b></div><div className="ev__track ev__track--sun"><i style={bar('solar')} /></div></div>
          </div>
          <div className="ev__save">
            <div><small>Ušteda godišnje u odnosu na benzin</small><b>{eur(save)}</b></div>
            <div><small>Ušteda kroz 8 godina</small><b>{eur(save * 8)}</b></div>
          </div>
          <p className="fine" style={{ marginTop: 12 }}>Uključeni su gubici punjenja od 10 %. Cijena goriva odgovara prosjeku u Hrvatskoj u listopadu 2026. Sve cijene možete promijeniti.</p>
        </div>

        <div className="ctime card">
          <div className="cf__row">
            <p className="cf__label">Vrijeme punjenja od 10 do 80 %</p>
            <label className="field" style={{ minWidth: 170 }}>
              <span className="visually-hidden">Kapacitet baterije</span>
              <select value={batt} onChange={(e) => setBatt(+e.target.value)}>
                {[40, 60, 77, 100].map((b) => <option key={b} value={b}>Baterija {b} kWh</option>)}
              </select>
            </label>
          </div>
          <div className="ctime__grid">
            {POWERS.map((p) => (
              <div key={p} className={`ctime__c${p === 11 ? ' is-best' : ''}`}>
                <small>{String(p).replace('.', ',')} kW{p > CAR_MAX_AC ? '*' : ''}</small>
                <b>{hours(p)}</b>
              </div>
            ))}
          </div>
          <p className="ctime__note">Pretpostavka: automobil podržava AC punjenje do 11 kW, kao većina modela. * Takav automobil i na punionici od 22 kW puni se snagom od 11 kW, pa za 22 kW provjerite specifikaciju vozila.</p>
        </div>
      </div>
    </div>
  );
}
