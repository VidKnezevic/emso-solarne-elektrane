// Brzi izračun u heroju i glavni kalkulator solarne elektrane.
import { $, $$, n0, n1, eur, nice, fillRange, tween, whenNear } from './lib.js';
import { simulate, recommendKwp, DEFAULT_PRICE, DEFAULT_EXPORT, REGIONS, MONTHS, PANEL_KWP } from './solar-model.js';

const yrs = (v) => (v === null ? '> 25 god.' : `${n1(v)} god.`);

/* =========================================================
   Brzi izračun (hero)
   ========================================================= */
const q = $('[data-qcalc]');
if (q) {
  const bill = $('[data-q-bill]', q);
  const out = $('[data-q-out]', q);
  const update = () => {
    const b = +bill.value;
    out.textContent = `${b} €`;
    const baseKwh = (b * 12) / DEFAULT_PRICE.kuca;
    const p = {
      tip: 'kuca', baseKwh, region: 'zagreb', orient: 'jug', profile: 'mix',
      battery: false, battKwh: 0, ev: false, evKm: 0, hp: false, hpKwh: 0,
      subsidy: true, price: DEFAULT_PRICE.kuca, exportPrice: DEFAULT_EXPORT, escalation: 0.03,
    };
    p.kwp = recommendKwp({ totalKwh: baseKwh, region: 'zagreb', orient: 'jug', tip: 'kuca' });
    const r = simulate(p);
    $('[data-q="kwp"]', q).textContent = `${n1(r.kwp)} kWp`;
    $('[data-q="saving"]', q).textContent = `~${eur(nice(r.saving, 10))}`;
    $('[data-q="payback"]', q).textContent = r.payback === null ? '> 25 god.' : `~${n1(r.payback)} god.`;
  };
  bill.addEventListener('input', update);
  update();
  // Prenesi račun iz heroja u glavni kalkulator.
  $('[data-q-detail]', q).addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('emso:bill', { detail: +bill.value }));
  });
}

/* =========================================================
   Glavni kalkulator
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
  const usage = $('[data-usage]', root);
  const usageNum = $('[data-usage-num]', root);
  const usageUnit = $('[data-usage-unit]', root);
  const kwpRange = $('[data-kwp]', root);
  const resetKwp = $('[data-reset-kwp]', root);
  const kwpBadge = $('[data-kwp-badge]', root);
  const subsidyWrap = $('[data-subsidy-wrap]', root);
  const chartBox = $('[data-chart]', root);
  const legend = $('[data-legend]', root);
  const chartTitle = $('[data-chart-title]', root);

  const RANGES = {
    kuca: { bill: [20, 600, 5, 90], kwh: [1000, 40000, 100, 6500] },
    tvrtka: { bill: [100, 20000, 50, 1500], kwh: [5000, 400000, 1000, 90000] },
  };
  let manualKwp = false;
  let priceTouched = false;
  let last = null;

  const getTip = () => el('tip').value;
  const getMode = () => el('mode').value;

  function applyUsageRange(value) {
    const [min, max, step, def] = RANGES[getTip()][getMode()];
    usage.min = min;
    usage.max = max;
    usage.step = step;
    const v = value ?? def;
    usage.value = Math.min(max, Math.max(min, v));
    usageNum.value = Math.round(v);
    usageNum.min = min;
    usageUnit.textContent = getMode() === 'bill' ? '€ / mj' : 'kWh / god.';
    fillRange(usage);
  }

  function baseKwh() {
    const price = +el('price').value || DEFAULT_PRICE[getTip()];
    const v = +usageNum.value || +usage.value;
    return getMode() === 'bill' ? (v * 12) / price : v;
  }

  function params() {
    const tip = getTip();
    return {
      tip,
      baseKwh: baseKwh(),
      region: el('region').value,
      orient: el('orient').value,
      profile: el('profile').value,
      battery: el('battery').checked,
      battKwh: +el('battKwh').value,
      ev: el('ev').checked,
      evKm: +el('evKm').value,
      hp: el('hp').checked,
      hpKwh: +el('hpKwh').value,
      subsidy: tip === 'kuca' && el('subsidy').checked,
      price: +el('price').value || DEFAULT_PRICE[tip],
      exportPrice: Math.max(0, +el('exportPrice').value || 0),
      escalation: (+el('escalation').value || 0) / 100,
    };
  }

  function syncKwp(p) {
    const total = p.baseKwh + (p.ev ? p.evKm * 0.18 : 0) + (p.hp ? p.hpKwh : 0);
    const rec = recommendKwp({ totalKwh: total, region: p.region, orient: p.orient, tip: p.tip });
    const max = p.tip === 'tvrtka' ? 200 : 30;
    kwpRange.max = max;
    kwpRange.min = 2;
    kwpRange.step = PANEL_KWP;
    if (!manualKwp) kwpRange.value = rec;
    const kwp = Math.round(+kwpRange.value / PANEL_KWP) * PANEL_KWP;
    fillRange(kwpRange);
    const isRec = Math.abs(kwp - rec) < 0.01;
    kwpBadge.textContent = isRec ? 'Preporučeno' : `Preporuka: ${n1(rec)} kWp`;
    resetKwp.hidden = isRec;
    return kwp;
  }

  function render() {
    const p = params();
    p.kwp = syncKwp(p);
    const r = simulate(p);
    last = { p, r };

    $$('[data-show]', root).forEach((box) => box.classList.toggle('is-on', el(box.dataset.show).checked));
    $('[data-out="kwp"]', root).textContent = `${n1(p.kwp)} kWp`;
    $('[data-out="battKwh"]', root).textContent = `${p.battKwh} kWh`;
    $('[data-out="evKm"]', root).textContent = `${n0(p.evKm)} km`;
    $('[data-out="hpKwh"]', root).textContent = `${n0(p.hpKwh)} kWh/god.`;

    const set = (k, v) => ($(`[data-r="${k}"]`, root).textContent = v);
    tween($('[data-r="saveYear"]', root), r.saving, (v) => eur(v));
    set('saveMonth', eur(r.saving / 12));
    set('save25', eur(nice(Math.max(0, r.profit25), 100)));
    set('kwp', `${n1(r.kwp)} kWp`);
    set('panels', `${r.panels} panela · ~${r.area} m²`);
    set('prod', `${n0(nice(r.prodYear, 10))} kWh`);
    set('yield', `${n0(r.yieldKwp)} kWh po kWp`);
    set('selfRate', `${n0(r.selfRate * 100)} %`);
    set('autarky', `pokriva ${n0(Math.min(1, r.autarky) * 100)} % potrošnje`);
    set('payback', yrs(r.payback));
    set('roi', r.roi > 0 ? `povrat ulaganja ${n0(r.roi * 100)} %` : '–');
    set('billBefore', `${eur(r.billBefore / 12)}/mj`);
    set('billAfter', `${eur(r.billAfter / 12)}/mj`);
    $('[data-bar="before"]', root).style.setProperty('--w', '100%');
    $('[data-bar="after"]', root).style.setProperty('--w', `${Math.max(2, (r.billAfter / r.billBefore) * 100)}%`);
    set('cost', `${eur(nice(r.cost.low, 100))} – ${eur(nice(r.cost.high, 100))}`);
    set('subsidy', r.cost.sub > 0 ? `− ${eur(nice(r.cost.sub, 50))}` : '–');
    set('net', `~ ${eur(nice(r.cost.net, 100))}`);
    $('[data-sub-row]', root).hidden = !(r.cost.sub > 0);
    set('co2', `${n1(r.co2)} t`);
    set('trees', n0(r.trees));
    $('.invest span', root).textContent = p.tip === 'tvrtka' ? 'Okvirna investicija (bez PDV-a)' : 'Okvirna investicija (0 % PDV)';
    drawChart();
  }

  /* ---------- Grafovi (SVG) ---------- */
  const W = 600;
  const H = 230;
  const PAD = { l: 46, r: 8, t: 14, b: 26 };
  const niceMax = (v) => {
    const p = Math.pow(10, Math.floor(Math.log10(v || 1)));
    return Math.ceil(v / p / 2) * 2 * p;
  };

  function drawMonths(r) {
    const max = niceMax(Math.max(...r.months.map((m) => Math.max(m.prod, m.cons))));
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const bw = iw / 12;
    const y = (v) => PAD.t + ih - (v / max) * ih;
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
    for (let i = 0; i <= 4; i++) {
      const v = (max / 4) * i;
      s += `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${y(v)}" y2="${y(v)}" stroke="#E7ECF2"/><text x="${PAD.l - 8}" y="${y(v) + 4}" text-anchor="end">${n0(v)}</text>`;
    }
    r.months.forEach((m, i) => {
      const x = PAD.l + i * bw;
      const w = bw * 0.34;
      s += `<rect x="${x + bw * 0.14}" y="${y(m.cons)}" width="${w}" height="${y(0) - y(m.cons)}" rx="3" fill="#CBD5E1"><title>${MONTHS[i]}: potrošnja ${n0(m.cons)} kWh</title></rect>`;
      s += `<rect x="${x + bw * 0.52}" y="${y(m.prod)}" width="${w}" height="${y(0) - y(m.prod)}" rx="3" fill="#00A0E3"><title>${MONTHS[i]}: proizvodnja ${n0(m.prod)} kWh</title></rect>`;
      s += `<rect x="${x + bw * 0.52}" y="${y(m.self)}" width="${w}" height="${y(0) - y(m.self)}" rx="3" fill="#0068B5"/>`;
      s += `<text x="${x + bw / 2}" y="${H - 8}" text-anchor="middle">${MONTHS[i]}</text>`;
    });
    s += `<text x="${PAD.l - 8}" y="${PAD.t - 2}" text-anchor="end">kWh</text></svg>`;
    chartBox.innerHTML = s;
    chartBox.setAttribute('aria-label', `Mjesečna proizvodnja i potrošnja. Godišnje: proizvodnja ${n0(r.prodYear)} kWh, potrošnja ${n0(r.consYear)} kWh.`);
    legend.innerHTML =
      '<li><i style="background:#CBD5E1"></i>Potrošnja</li><li><i style="background:#00A0E3"></i>Proizvodnja</li><li><i style="background:#0068B5"></i>Od toga potrošeno u kući</li>';
    chartTitle.textContent = 'Proizvodnja i potrošnja po mjesecima';
  }

  function drawYears(r) {
    const vals = r.years;
    const maxV = niceMax(Math.max(...vals, 1));
    const minV = -niceMax(Math.max(1, -Math.min(...vals)));
    const iw = W - PAD.l - PAD.r;
    const ih = H - PAD.t - PAD.b;
    const bw = iw / vals.length;
    const y = (v) => PAD.t + ((maxV - v) / (maxV - minV)) * ih;
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
    [maxV, maxV / 2, 0, minV].forEach((v) => {
      s += `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${y(v)}" y2="${y(v)}" stroke="${v === 0 ? '#56667D' : '#E7ECF2'}"/><text x="${PAD.l - 8}" y="${y(v) + 4}" text-anchor="end">${v === 0 ? '0' : `${n0(v / 1000)}k`}</text>`;
    });
    vals.forEach((v, i) => {
      const x = PAD.l + i * bw + bw * 0.18;
      const top = Math.min(y(v), y(0));
      const h = Math.max(1, Math.abs(y(v) - y(0)));
      s += `<rect x="${x}" y="${top}" width="${bw * 0.64}" height="${h}" rx="2" fill="${v < 0 ? '#CBD5E1' : '#0068B5'}"><title>${i}. godina: ${eur(v)}</title></rect>`;
      if (i % 5 === 0) s += `<text x="${x + bw * 0.32}" y="${H - 8}" text-anchor="middle">${i}.</text>`;
    });
    if (r.payback !== null) {
      const px = PAD.l + (r.payback + 0.5) * bw;
      s += `<line x1="${px}" x2="${px}" y1="${PAD.t}" y2="${y(minV)}" stroke="#0A2344" stroke-dasharray="4 4"/>`;
      const anchor = px > W * 0.75 ? 'end' : 'start';
      s += `<text x="${px + (anchor === 'start' ? 8 : -8)}" y="${PAD.t + 12}" text-anchor="${anchor}" style="fill:#0A2344;font-weight:700">Povrat za ${n1(r.payback)} god.</text>`;
    }
    s += `<text x="${W - PAD.r}" y="${H - 8}" text-anchor="end">god.</text></svg>`;
    chartBox.innerHTML = s;
    chartBox.setAttribute('aria-label', `Kumulativna ušteda kroz 25 godina. Povrat investicije: ${yrs(r.payback)}. Neto ušteda nakon 25 godina: ${eur(r.profit25)}.`);
    legend.innerHTML = '<li><i style="background:#CBD5E1"></i>Investicija se otplaćuje</li><li><i style="background:#0068B5"></i>Neto ušteda</li>';
    chartTitle.textContent = 'Kumulativna ušteda kroz 25 godina (€)';
  }

  function drawChart() {
    if (!last) return;
    const mode = $('input[name="chart"]:checked', root).value;
    mode === 'years' ? drawYears(last.r) : drawMonths(last.r);
  }

  /* ---------- Događaji ---------- */
  form.addEventListener('input', (e) => {
    const t = e.target;
    // Radio, checkbox i select obrađuje 'change' događaj.
    if (t.type === 'radio' || t.type === 'checkbox' || t.tagName === 'SELECT') return;
    if (t === usage) usageNum.value = t.value;
    if (t === usageNum) {
      usage.value = t.value;
      fillRange(usage);
    }
    if (t === kwpRange) manualKwp = true;
    if (t.name === 'price') priceTouched = true;
    render();
  });
  form.addEventListener('change', (e) => {
    const t = e.target;
    if (t.name === 'tip') {
      if (!priceTouched) el('price').value = DEFAULT_PRICE[t.value];
      subsidyWrap.hidden = t.value === 'tvrtka';
      manualKwp = false;
      applyUsageRange();
    }
    if (t.name === 'mode') {
      // Pretvori trenutnu vrijednost u novu jedinicu.
      const price = +el('price').value || DEFAULT_PRICE[getTip()];
      const v = +usageNum.value || +usage.value;
      applyUsageRange(t.value === 'kwh' ? Math.round((v * 12) / price / 100) * 100 : Math.round((v * price) / 12 / 5) * 5);
    }
    if (['region', 'orient', 'battery', 'ev', 'hp'].includes(t.name)) manualKwp = false;
    render();
  });
  $$('input[name="chart"]', root).forEach((r) => r.addEventListener('change', drawChart));
  resetKwp.addEventListener('click', () => {
    manualKwp = false;
    render();
  });

  const applyBill = (value) => {
    form.querySelector('input[name="mode"][value="bill"]').checked = true;
    form.querySelector('input[name="tip"][value="kuca"]').checked = true;
    subsidyWrap.hidden = false;
    manualKwp = false;
    applyUsageRange(value);
    render();
  };
  document.addEventListener('emso:bill', (e) => applyBill(e.detail));
  $$('[data-calc-preset]').forEach((a) =>
    a.addEventListener('click', () => {
      const r = form.querySelector(`input[name="tip"][value="${a.dataset.calcPreset}"]`);
      if (r && !r.checked) {
        r.checked = true;
        r.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })
  );

  // Prijenos izračuna u obrazac za ponudu.
  $('[data-calc-quote]', root).addEventListener('click', () => {
    if (!last) return;
    const { p, r } = last;
    const parts = [
      `${n1(p.kwp)} kWp`,
      p.battery ? `baterija ${p.battKwh} kWh` : null,
      p.ev ? `električni auto ${n0(p.evKm)} km/god.` : null,
      p.hp ? 'dizalica topline' : null,
      `potrošnja ${n0(r.consYear)} kWh/god.`,
      REGIONS[p.region].label,
      `procijenjena ušteda ${eur(r.saving)}/god.`,
    ].filter(Boolean);
    const summary = $('[data-calc-summary]');
    if (summary) summary.value = parts.join(', ');
    const interest = p.ev ? 'Solarna elektrana + punionica' : p.battery ? 'Solarna elektrana + baterija' : 'Solarna elektrana';
    const ir = $(`[data-wizard] input[name="interes"][value="${interest}"]`);
    if (ir) ir.checked = true;
    if (p.tip === 'tvrtka') {
      const o = $('[data-wizard] input[name="objekt"][value="Tvrtka / poslovni objekt"]');
      if (o) o.checked = true;
    }
    const bill = $('[data-wizard] input[name="racun"]');
    if (bill) bill.value = Math.round(r.billBefore / 12);
  });

  el('price').value = DEFAULT_PRICE.kuca;
  el('exportPrice').value = DEFAULT_EXPORT;
  applyUsageRange();
  render();
  if (pendingBill !== null) applyBill(pendingBill);
}
