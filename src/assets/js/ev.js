// Kalkulator troškova punjenja električnog automobila i vremena punjenja.
import { $, $$, n0, n1, eur, tween } from './lib.js';

const root = $('[data-ev]');
if (root) {
  const form = $('form', root);
  const el = (n) => form.elements[n];
  const CHARGE_LOSS = 1.1;

  const render = () => {
    const km = +el('km').value;
    const kwh100 = +el('kwh100').value;
    const l100 = +el('l100').value;
    const solarShare = +el('solar').value / 100;
    const fuel = +el('fuel').value || 0;
    const home = +el('home').value || 0;
    const pub = +el('public').value || 0;
    const solarPrice = +el('solarPrice').value || 0;

    const kwh = (km / 100) * kwh100;
    const cost = {
      petrol: (km / 100) * l100 * fuel,
      public: kwh * pub,
      home: kwh * CHARGE_LOSS * home,
      solar: kwh * CHARGE_LOSS * (solarShare * solarPrice + (1 - solarShare) * home),
    };
    const max = Math.max(...Object.values(cost), 1);
    for (const [k, v] of Object.entries(cost)) {
      tween($(`[data-c="${k}"]`, root), v, (x) => `${eur(x)} / god.`);
      $(`[data-w="${k}"]`, root).style.setProperty('--w', `${Math.max(1.5, (v / max) * 100)}%`);
    }
    const save = cost.petrol - cost.solar;
    tween($('[data-c="saveYear"]', root), save, eur);
    $('[data-c="save8"]', root).textContent = eur(save * 8);

    $('[data-o="km"]', root).textContent = `${n0(km)} km`;
    $('[data-o="kwh100"]', root).textContent = `${n1(kwh100)} kWh/100 km`;
    $('[data-o="l100"]', root).textContent = `${n1(l100)} l/100 km`;
    $('[data-o="solar"]', root).textContent = `${n0(solarShare * 100)} %`;
  };
  form.addEventListener('input', render);
  render();
}

const ct = $('[data-ctime]');
if (ct) {
  const grid = $('[data-ctime-grid]', ct);
  const sel = $('select', ct);
  const CAR_MAX_AC = 11;
  const POWERS = [3.7, 7.4, 11, 22];
  const fmt = (h) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return mm === 60 ? `${hh + 1} h` : `${hh} h${mm ? ` ${mm} min` : ''}`;
  };
  const render = () => {
    const energy = +sel.value * 0.7;
    grid.innerHTML = POWERS.map((p) => {
      const eff = Math.min(p, CAR_MAX_AC) * 0.9;
      const best = p === 11;
      return `<div class="ctime__c${best ? ' is-best' : ''}"><small>${String(p).replace('.', ',')} kW${p > CAR_MAX_AC ? '*' : ''}</small><b>${fmt(energy / eff)}</b></div>`;
    }).join('');
  };
  sel.addEventListener('change', render);
  render();
}

// Na ovoj stranici upit po defaultu glasi na punionicu.
const evInterest = $('[data-wizard] input[name="interes"][value="Punionica za električni automobil"]');
if (evInterest) evInterest.checked = true;

// Gumbi koji unaprijed biraju vrstu upita u obrascu.
$$('[data-preset-interest]').forEach((a) =>
  a.addEventListener('click', () => {
    const r = $(`[data-wizard] input[name="interes"][value="${a.dataset.presetInterest}"]`);
    if (r) r.checked = true;
  })
);
