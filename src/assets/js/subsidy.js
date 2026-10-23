// Kalkulator poticaja FZOEU 2026. (iznosi iz objave Fonda od 1. 9. 2026.)
import { $, n0, n1, eur, nice, tween } from './lib.js';
import { costs } from './solar-model.js';

const RULES = {
  base: { rate: 0.5, pvPerKw: 600, pvMax: 6000, battPerKwh: 350, battMax: 5600, hpMax: 6250 },
  poverty: { rate: 0.7, pvPerKw: 840, pvMax: 8400, battPerKwh: 490, battMax: 7840, hpMax: 8750 },
};

const root = $('[data-subsidy]');
if (root) {
  const form = $('form', root);
  const el = (n) => form.elements[n];
  let pvTouched = false;
  let battTouched = false;

  /** Vrati iznos poticaja i koji je limit presudio. */
  const limit = (options) => options.reduce((best, o) => (o.v < best.v ? o : best));

  const render = () => {
    const kwp = +el('kwp').value;
    const battKwh = +el('battKwh').value;
    const hasBatt = el('battery').checked;
    const hasHp = el('hp').checked;
    const R = el('poverty').checked ? RULES.poverty : RULES.base;
    const pct = `${n0(R.rate * 100)} %`;

    const est = costs({ tip: 'kuca', kwp, battery: true, battKwh, subsidy: false });
    if (!pvTouched) el('pvCost').value = nice(est.pv, 50);
    if (!battTouched) el('battCost').value = nice(est.batt, 50);
    $('[data-batt-opts]', root).hidden = !hasBatt;
    $('[data-hp-opts]', root).hidden = !hasHp;

    const pvCost = +el('pvCost').value || 0;
    const battCost = hasBatt ? +el('battCost').value || 0 : 0;
    const hpCost = hasHp ? +el('hpCost').value || 0 : 0;

    const lines = [];
    const pv = limit([
      { v: R.rate * pvCost, why: `${pct} troška` },
      { v: R.pvPerKw * kwp, why: `${R.pvPerKw} €/kW × ${n1(kwp)} kW` },
      { v: R.pvMax, why: `najviše ${eur(R.pvMax)}` },
    ]);
    lines.push({ name: 'Solarna elektrana', ...pv });
    if (hasBatt) {
      const b = limit([
        { v: R.rate * battCost, why: `${pct} troška` },
        { v: R.battPerKwh * battKwh, why: `${R.battPerKwh} €/kWh × ${n1(battKwh)} kWh` },
        { v: R.battMax, why: `najviše ${eur(R.battMax)}` },
      ]);
      lines.push({ name: 'Baterijski spremnik', ...b });
    }
    if (hasHp) {
      const h = limit([
        { v: R.rate * hpCost, why: `${pct} troška` },
        { v: R.hpMax, why: `najviše ${eur(R.hpMax)}` },
      ]);
      lines.push({ name: 'Dizalica topline', ...h });
    }

    const total = lines.reduce((s, l) => s + l.v, 0);
    const cost = pvCost + battCost + hpCost;
    tween($('[data-s="total"]', root), total, eur);
    $('[data-s="pct"]', root).textContent = cost ? `${n0((total / cost) * 100)} %` : '–';
    $('[data-s="cost"]', root).textContent = eur(cost);
    $('[data-s="net"]', root).textContent = eur(cost - total);
    $('[data-s="lines"]', root).innerHTML = lines
      .map((l) => `<div class="sub__line"><span>${l.name}<small>mjerodavno: ${l.why}</small></span><b>${eur(l.v)}</b></div>`)
      .join('');
    $('[data-o="kwp"]', root).textContent = `${n1(kwp)} kWp`;
    $('[data-o="battKwh"]', root).textContent = `${n1(battKwh)} kWh`;
  };

  form.addEventListener('input', (e) => {
    if (e.target.name === 'pvCost') pvTouched = true;
    if (e.target.name === 'battCost') battTouched = true;
    render();
  });
  form.addEventListener('change', render);
  render();
}
