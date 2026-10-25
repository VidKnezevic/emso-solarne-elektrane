// Brzi izračun u heroju i kalkulator solarne elektrane.
import { $, n0, n1, eur, pct, nice, fillRange, tween, whenNear } from './lib.js';
import { simulate, recommendKwp, DEFAULT_PRICE, DEFAULT_EXPORT } from './solar-model.js';

const EV_KM = 15000;
const BATT_KWH = 10;

/** Procjena za kućanstvo: krov prema jugu, poticaj FZOEU uključen. */
function estimate({ bill, region = 'zagreb', battery = false, ev = false }) {
  const baseKwh = (bill * 12) / DEFAULT_PRICE.kuca;
  const p = {
    tip: 'kuca', baseKwh, region, orient: 'jug', profile: 'mix',
    battery, battKwh: BATT_KWH, ev, evKm: EV_KM, hp: false, hpKwh: 0,
    subsidy: true, price: DEFAULT_PRICE.kuca, exportPrice: DEFAULT_EXPORT, escalation: 0.03,
  };
  p.kwp = recommendKwp({ totalKwh: baseKwh + (ev ? EV_KM * 0.18 : 0), region, orient: 'jug', tip: 'kuca' });
  return { p, r: simulate(p), baseKwh };
}

const yrs = (v) => (v === null ? 'više od 25 god.' : `~${n1(v)} god.`);

/* =========================================================
   Brzi izračun (hero)
   ========================================================= */
const q = $('[data-qcalc]');
if (q) {
  const bill = $('[data-q-bill]', q);
  const out = $('[data-q-out]', q);
  const update = () => {
    out.textContent = `${bill.value} €`;
    const { r } = estimate({ bill: +bill.value });
    $('[data-q="kwp"]', q).textContent = `${n1(r.kwp)} kWp`;
    $('[data-q="saving"]', q).textContent = `~${eur(nice(r.saving, 10))}`;
    $('[data-q="payback"]', q).textContent = yrs(r.payback);
  };
  bill.addEventListener('input', update);
  update();
  // Prenesi račun iz heroja u glavni kalkulator.
  $('[data-q-detail]', q).addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('emso:bill', { detail: +bill.value }));
  });
}

/* =========================================================
   Kalkulator: tri pitanja, jedan jasan rezultat
   ========================================================= */
const root = $('[data-calc]');
// Kalkulator se inicijalizira tek kad se približi ekranu; račun iz heroja pamti se do tada.
let pendingBill = null;
const rememberBill = (e) => (pendingBill = e.detail);
document.addEventListener('emso:bill', rememberBill);
if (root) whenNear(root, initCalc);

function initCalc() {
  document.removeEventListener('emso:bill', rememberBill);
  const form = $('[data-calc-form]', root);
  const el = (name) => form.elements[name];
  const bill = el('bill');
  const set = (k, v) => ($(`[data-r="${k}"]`, root).textContent = v);
  let last = null;

  function render() {
    const input = { bill: +bill.value, region: el('region').value, battery: el('battery').checked, ev: el('ev').checked };
    const { p, r, baseKwh } = estimate(input);
    last = { input, p, r };

    $('[data-out="bill"]', root).textContent = `${input.bill} €`;
    $('[data-out="kwh"]', root).textContent = `Oko ${n0(nice(baseKwh, 50))} kWh potrošnje godišnje`;
    fillRange(bill);

    tween($('[data-r="saveYear"]', root), r.saving, (v) => eur(v));
    set('saveMonth', eur(r.saving / 12));
    set('kwp', `${n1(r.kwp)} kWp`);
    set('panels', `${r.panels} panela, ${r.area} m² krova`);
    set('net', `~${eur(nice(r.cost.net, 100))}`);
    set('costFull', `bez poticaja ~${eur(nice(r.cost.total, 100))}`);
    set('payback', yrs(r.payback));
    set('billBefore', `${eur(r.billBefore / 12)}/mj`);
    set('billAfter', `${eur(r.billAfter / 12)}/mj`);
    $('[data-bar="before"]', root).style.setProperty('--w', '100%');
    $('[data-bar="after"]', root).style.setProperty('--w', `${Math.max(2, (r.billAfter / r.billBefore) * 100)}%`);

    set('prod', `${n0(nice(r.prodYear, 10))} kWh`);
    set('selfRate', pct(r.selfRate * 100));
    set('cost', `${eur(nice(r.cost.low, 100))} – ${eur(nice(r.cost.high, 100))}`);
    set('subsidy', `− ${eur(nice(r.cost.sub, 50))}`);
    set('save25', eur(nice(Math.max(0, r.profit25), 100)));
  }

  form.addEventListener('input', render);
  form.addEventListener('change', render);

  const applyBill = (value) => {
    bill.value = value;
    render();
  };
  document.addEventListener('emso:bill', (e) => applyBill(e.detail));

  // Prijenos izračuna u obrazac za ponudu.
  $('[data-calc-quote]', root).addEventListener('click', () => {
    if (!last) return;
    const { input, p, r } = last;
    const parts = [
      `račun ${input.bill} €/mj`,
      `${n1(p.kwp)} kWp`,
      p.battery ? `baterija ${p.battKwh} kWh` : null,
      p.ev ? 'punjenje električnog auta' : null,
      form.querySelector('input[name="region"]:checked').nextElementSibling.textContent,
      `procijenjena ušteda ${eur(r.saving)}/god.`,
    ].filter(Boolean);
    const summary = $('[data-calc-summary]');
    if (summary) summary.value = parts.join(', ');
    const interest = p.ev ? 'Solarna elektrana + punionica' : p.battery ? 'Solarna elektrana + baterija' : 'Solarna elektrana';
    const ir = $(`[data-wizard] input[name="interes"][value="${interest}"]`);
    if (ir) ir.checked = true;
    const billField = $('[data-wizard] input[name="racun"]');
    if (billField) billField.value = input.bill;
  });

  render();
  if (pendingBill !== null) applyBill(pendingBill);
}
