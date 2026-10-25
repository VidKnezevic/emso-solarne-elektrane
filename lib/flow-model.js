// Model jednog sunčanog ljetnog dana za obiteljsku kuću s elektranom od 6,3 kWp (5-minutni koraci).
export const STEPS = 288;
const DT = 24 / STEPS;
const KWP = 6.3;
const BATT = { cap: 10, maxP: 5, eff: 0.95, minSoc: 0.1 };
const DAY = { rise: 5.3, set: 20.6, peak: 0.78, base: 0.3, eve: 1.35, ac: 0.75 };

const g = (t, mu, s) => Math.exp(-(((t - mu) / s) ** 2));

const production = (t) => {
  if (t <= DAY.rise || t >= DAY.set) return 0;
  const x = (t - DAY.rise) / (DAY.set - DAY.rise);
  return KWP * DAY.peak * Math.pow(Math.sin(Math.PI * x), 1.8);
};

const houseLoad = (t) =>
  DAY.base + 1.0 * g(t, 7.2, 0.8) + 0.75 * g(t, 12.8, 0.9) + DAY.eve * g(t, 19.8, 1.6) + DAY.ac * g(t, 15.5, 2.2) + 0.25 * g(t, 23.6, 1);

/** Simulira dan; vraća stanje u svakom koraku i dnevne zbrojeve. */
export function simulateDay(hasBatt) {
  const run = (soc0) => {
    let soc = soc0;
    const pts = [];
    const tot = { prod: 0, cons: 0, imp: 0, exp: 0 };
    for (let i = 0; i < STEPS; i++) {
      const t = i * DT;
      const P = production(t);
      const H = houseLoad(t);
      const avail = P - H;
      let batt = 0; // + punjenje, − pražnjenje
      if (hasBatt) {
        if (avail > 0) {
          batt = Math.min(avail, BATT.maxP, ((1 - soc) * BATT.cap) / DT / BATT.eff);
          soc += (batt * BATT.eff * DT) / BATT.cap;
        } else {
          const d = Math.min(-avail, BATT.maxP, (Math.max(0, soc - BATT.minSoc) * BATT.cap) / DT);
          batt = -d;
          soc -= (d * DT) / BATT.cap;
        }
      }
      const grid = -(avail - batt); // + preuzimanje, − predaja
      tot.prod += P * DT;
      tot.cons += H * DT;
      tot.imp += Math.max(0, grid) * DT;
      tot.exp += Math.max(0, -grid) * DT;
      pts.push({ t, P, H, batt, soc, grid });
    }
    return { pts, tot, soc };
  };
  // Drugi prolaz kreće s napunjenošću baterije s kraja prvog dana (stabilno stanje).
  const first = run(0.3);
  const day = run(hasBatt ? first.soc : 0);
  day.autarky = Math.max(0, 1 - day.tot.imp / day.tot.cons);
  return day;
}

/** Jedna rečenica koja objašnjava što se u tom trenutku događa. */
export function explain(s, hasBatt) {
  const on = (v) => v > 0.05;
  if (on(s.P) && on(s.batt)) return 'Elektrana proizvodi više nego što kuća troši. Višak puni bateriju za večer.';
  if (on(s.P) && on(-s.grid)) return hasBatt ? 'Baterija je puna, pa višak odlazi u mrežu.' : 'Elektrana proizvodi više nego što kuća troši, pa višak odlazi u mrežu.';
  if (on(s.P) && on(-s.batt)) return 'Sunce je još nisko. Ono što elektrana ne pokrije, daje baterija.';
  if (on(s.P) && on(s.grid)) return 'Sunce je još nisko. Ono što elektrana ne pokrije, dolazi iz mreže.';
  if (on(s.P)) return 'Elektrana pokriva svu potrošnju kuće.';
  const night = s.t < 5;
  if (on(-s.batt)) return night ? 'Noću kuću i dalje napaja baterija napunjena tijekom dana.' : 'Sunce je zašlo, a kuću napaja baterija napunjena tijekom dana.';
  if (hasBatt) return 'Baterija je prazna, pa struja dolazi iz mreže.';
  return night ? 'Noću elektrana ne radi, pa struja dolazi iz mreže.' : 'Sunce je zašlo, pa struja dolazi iz mreže. S baterijom biste koristili dnevni višak.';
}
