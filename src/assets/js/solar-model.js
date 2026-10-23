// Model isplativosti solarne elektrane za Hrvatsku (2026.).
// Mjesečna simulacija: izravna samopotrošnja, baterija i neto obračun
// (višak se vrednuje po otkupnoj cijeni, najviše do količine preuzete iz mreže u istom mjesecu).

/** Godišnja proizvodnja po kWp za optimalno nagnut krov prema jugu (procjena prema PVGIS-u). */
export const REGIONS = {
  sjever: { label: 'Sjeverna Hrvatska', yield: 1150 },
  zagreb: { label: 'Zagreb i središnja Hrvatska', yield: 1180 },
  slavonija: { label: 'Slavonija i Baranja', yield: 1220 },
  lika: { label: 'Lika i Gorski kotar', yield: 1200 },
  istra: { label: 'Istra, Rijeka i Kvarner', yield: 1320 },
  sdalm: { label: 'Sjeverna Dalmacija', yield: 1420 },
  jdalm: { label: 'Srednja i južna Dalmacija', yield: 1460 },
};
export const ORIENT = { jug: 1, jijz: 0.95, iz: 0.85, ravni: 0.92 };
/** Udio potrošnje koji se poklapa sa sunčanim satima. */
export const DAY_SHARE = { dan: 0.55, mix: 0.42, vecer: 0.3 };
export const PANEL_KWP = 0.45;
export const PANEL_M2 = 2.0;
export const DEFAULT_PRICE = { kuca: 0.16, tvrtka: 0.2 };
export const DEFAULT_EXPORT = 0.07;
export const CO2_KG_PER_KWH = 0.2;
export const CO2_KG_PER_TREE = 22;
export const MONTHS = ['Sij', 'Velj', 'Ožu', 'Tra', 'Svi', 'Lip', 'Srp', 'Kol', 'Ruj', 'Lis', 'Stu', 'Pro'];

const norm = (a) => {
  const s = a.reduce((x, y) => x + y, 0);
  return a.map((v) => v / s);
};
const PROD = norm([0.033, 0.05, 0.083, 0.104, 0.12, 0.125, 0.133, 0.122, 0.093, 0.067, 0.04, 0.03]);
const CONS = norm([0.096, 0.088, 0.087, 0.079, 0.076, 0.077, 0.084, 0.083, 0.076, 0.08, 0.084, 0.09]);
const HEAT_PUMP = norm([0.18, 0.15, 0.11, 0.06, 0.03, 0.04, 0.06, 0.05, 0.03, 0.06, 0.11, 0.12]);
const DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const BATT_EFF = 0.92;
const DEGRADATION = 0.005;
const EV_KWH_PER_KM = 0.18;

export const effectiveYield = (region, orient) => (REGIONS[region]?.yield ?? 1180) * (ORIENT[orient] ?? 1);

/** Preporučena snaga: proizvodnja ≈ godišnja potrošnja, zaokruženo na cijeli broj panela. */
export function recommendKwp({ totalKwh, region, orient, tip }) {
  const raw = totalKwh / effectiveYield(region, orient);
  const max = tip === 'tvrtka' ? 200 : 30;
  const kwp = Math.min(max, Math.max(2, raw));
  return Math.ceil(kwp / PANEL_KWP - 1e-9) * PANEL_KWP;
}

export function costs({ tip, kwp, battery, battKwh, subsidy }) {
  const pv = tip === 'tvrtka' ? 1800 + 640 * kwp : 1400 + 760 * kwp;
  const batt = battery ? 900 + 430 * battKwh : 0;
  const total = pv + batt;
  let sub = 0;
  if (tip === 'kuca' && subsidy) {
    sub += Math.min(0.5 * pv, 600 * kwp, 6000);
    if (battery) sub += Math.min(0.5 * batt, 350 * battKwh, 5600);
  }
  return { pv, batt, total, sub, net: total - sub, low: total * 0.92, high: total * 1.08 };
}

/**
 * @param {object} p
 *  tip: 'kuca'|'tvrtka', baseKwh, region, orient, profile, kwp,
 *  battery, battKwh, ev, evKm, hp, hpKwh, subsidy, price, exportPrice, escalation (0.03)
 */
export function simulate(p) {
  const yieldKwp = effectiveYield(p.region, p.orient);
  const prodYear = p.kwp * yieldKwp;
  const evKwh = p.ev ? p.evKm * EV_KWH_PER_KM : 0;
  const hpKwh = p.hp ? p.hpKwh : 0;
  const dayShare = Math.min(0.85, (DAY_SHARE[p.profile] ?? 0.42) + (p.tip === 'tvrtka' ? 0.2 : 0));
  const evDay = p.profile === 'dan' ? 0.5 : 0.3;

  let selfUsed = 0;
  let imported = 0;
  let exported = 0;
  let exportValue = 0;
  const months = [];

  for (let m = 0; m < 12; m++) {
    const prod = prodYear * PROD[m];
    const house = p.baseKwh * CONS[m];
    const hp = hpKwh * HEAT_PUMP[m];
    const ev = evKwh / 12;
    const cons = house + hp + ev;
    // Izravna potrošnja ograničena je potrošnjom tijekom sunčanih sati; 0,9 pokriva satni nesklad.
    const direct = Math.min(prod, house * dayShare + hp * 0.35 + ev * evDay) * 0.9;
    let excess = prod - direct;
    let deficit = cons - direct;
    let fromBatt = 0;
    if (p.battery) {
      const cycleCap = p.battKwh * 0.9 * DAYS[m];
      fromBatt = Math.max(0, Math.min(excess * BATT_EFF, deficit, cycleCap));
      excess -= fromBatt / BATT_EFF;
      deficit -= fromBatt;
    }
    selfUsed += direct + fromBatt;
    imported += deficit;
    exported += excess;
    exportValue += Math.min(excess, deficit) * p.exportPrice;
    months.push({ prod, cons, self: direct + fromBatt });
  }

  const consYear = p.baseKwh + hpKwh + evKwh;
  const billBefore = consYear * p.price;
  const saving = selfUsed * p.price + exportValue;
  const billAfter = Math.max(0, billBefore - saving);
  const c = costs(p);

  // 25 godina: rast cijene struje, degradacija panela i zamjena invertera u 13. godini.
  const inverterSwap = 800 + 80 * p.kwp;
  const years = [-c.net];
  let cum = -c.net;
  let payback = null;
  for (let y = 1; y <= 25; y++) {
    let s = saving * Math.pow(1 + p.escalation, y - 1) * Math.pow(1 - DEGRADATION, y - 1);
    if (y === 13) s -= inverterSwap;
    const prev = cum;
    cum += s;
    if (payback === null && cum >= 0) payback = y - 1 + -prev / s;
    years.push(cum);
  }

  return {
    kwp: p.kwp,
    panels: Math.round(p.kwp / PANEL_KWP),
    area: Math.round((p.kwp / PANEL_KWP) * PANEL_M2 * 1.1),
    yieldKwp,
    prodYear,
    consYear,
    selfUsed,
    selfRate: prodYear ? selfUsed / prodYear : 0,
    autarky: consYear ? selfUsed / consYear : 0,
    imported,
    exported,
    saving,
    billBefore,
    billAfter,
    cost: c,
    payback,
    profit25: cum,
    roi: c.net > 0 ? cum / c.net : 0,
    co2: (prodYear * CO2_KG_PER_KWH) / 1000,
    trees: (prodYear * CO2_KG_PER_KWH) / CO2_KG_PER_TREE,
    months,
    years,
  };
}
