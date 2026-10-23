// Interaktivna simulacija tokova energije kroz jedan dan (5-minutni koraci).
import { $, $$, n0, n1, reduceMotion, whenNear } from './lib.js';

const root = $('[data-flow]');
if (root) whenNear(root, initFlow);

function initFlow() {
  const section = root.closest('.flow');
  const STEPS = 288;
  const DT = 24 / STEPS;
  const KWP = 6.3;
  const BATT = { cap: 10, maxP: 5, eff: 0.95, minSoc: 0.1 };
  const SEASONS = {
    ljeto: { rise: 5.3, set: 20.6, peak: 0.78, base: 0.3, eve: 1.35, ac: 0.75 },
    proljece: { rise: 6.5, set: 19.1, peak: 0.68, base: 0.32, eve: 1.5, ac: 0 },
    zima: { rise: 7.4, set: 16.3, peak: 0.45, base: 0.4, eve: 1.85, ac: 0 },
  };
  const g = (t, mu, s) => Math.exp(-(((t - mu) / s) ** 2));

  const production = (t, S) => {
    if (t <= S.rise || t >= S.set) return 0;
    const x = (t - S.rise) / (S.set - S.rise);
    const wobble = 1 - 0.07 * Math.max(0, Math.sin(t * 2.3) * Math.sin(t * 5.1));
    return KWP * S.peak * Math.pow(Math.sin(Math.PI * x), 1.8) * wobble;
  };
  const houseLoad = (t, S) =>
    S.base + 1.0 * g(t, 7.2, 0.8) + 0.75 * g(t, 12.8, 0.9) + S.eve * g(t, 19.8, 1.6) + S.ac * g(t, 15.5, 2.2) + 0.25 * g(t, 23.6, 1) + 0.06 * Math.sin(t * 3.7) ** 2;

  function simulateDay(season, hasBatt, hasEv) {
    const S = SEASONS[season];
    const run = (soc0) => {
      let soc = soc0;
      let evNeed = hasEv ? 9 : 0;
      const pts = [];
      const tot = { prod: 0, cons: 0, imp: 0, exp: 0 };
      for (let i = 0; i < STEPS; i++) {
        const t = i * DT;
        const P = production(t, S);
        const H = houseLoad(t, S);
        let evSolar = 0;
        let evGrid = 0;
        let avail = P - H;
        if (evNeed > 0) {
          if (t >= 10 && t < 16 && avail > 1.4) evSolar = Math.min(avail, 7.4, evNeed / DT);
          else if (t >= 21) evGrid = Math.min(3.7, evNeed / DT);
          evNeed -= (evSolar + evGrid) * DT;
        }
        avail -= evSolar;
        let batt = 0;
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
        const grid = -(avail - batt) + evGrid; // + preuzimanje, − predaja
        const ev = evSolar + evGrid;
        tot.prod += P * DT;
        tot.cons += (H + ev) * DT;
        tot.imp += Math.max(0, grid) * DT;
        tot.exp += Math.max(0, -grid) * DT;
        pts.push({ t, P, H, ev, evSolar, batt, soc, grid });
      }
      return { pts, tot, soc };
    };
    // Dva prolaza: drugi kreće s napunjenošću baterije s kraja prvog dana (stabilno stanje).
    const first = run(0.3);
    return run(hasBatt ? first.soc : 0);
  }

  const svg = $('.flow__svg', root);
  const lines = Object.fromEntries($$('[data-line]', svg).map((p) => [p.dataset.line, p]));
  const val = (k) => $(`[data-v="${k}"]`, svg);
  const socBar = $('[data-soc-bar]', svg);
  const sun = $('[data-sun]', svg);
  const timeInput = $('[data-time]', root);
  const playBtn = $('[data-play]', root);
  const chart = $('[data-daychart]', root);
  const clock = $('[data-clock]', root);
  const clockLabel = $('[data-clock-label]', root);
  const insight = $('[data-insight]', root);
  const stat = (k) => $(`[data-d="${k}"]`, root);

  let day = null;
  let idx = +timeInput.value;
  let playing = false;
  let raf = 0;
  let lastT = 0;

  const compact = matchMedia('(max-width: 560px)');
  const applyShort = () =>
    $$('[data-short]', svg).forEach((t) => {
      t.dataset.long ??= t.textContent;
      t.textContent = compact.matches ? t.dataset.short : t.dataset.long;
    });
  applyShort();
  compact.addEventListener('change', applyShort);
  const kw = (v) => `${n1(Math.abs(v) < 0.05 ? 0 : Math.abs(v))} kW`;

  function setLine(name, power, reverse) {
    const p = lines[name];
    const on = power > 0.05;
    p.style.opacity = on ? '1' : '0';
    p.style.strokeWidth = String(2.5 + Math.min(power, 7) * 0.8);
    p.style.setProperty('--dur', `${Math.min(3, Math.max(0.35, 2.4 / (0.4 + power))).toFixed(2)}s`);
    p.style.setProperty('--dir', reverse ? 'reverse' : 'normal');
  }

  function label(t) {
    if (t < 5) return 'Noć';
    if (t < 10) return 'Jutro';
    if (t < 14) return 'Podne';
    if (t < 18) return 'Poslijepodne';
    if (t < 22) return 'Večer';
    return 'Noć';
  }

  function insightText(s, hasBatt) {
    if (s.evSolar > 0.05) return 'Auto se puni viškom sunčeve energije – praktički besplatno.';
    if (s.P > 0.05 && s.batt > 0.05) return 'Elektrana proizvodi više nego što kuća troši – višak puni bateriju za večer.';
    if (s.P > 0.05 && s.grid < -0.05) return hasBatt ? 'Baterija je puna, pa višak odlazi u mrežu po otkupnoj cijeni.' : 'Višak odlazi u mrežu. S baterijom biste ga sačuvali za večer.';
    if (s.P > 0.05 && s.batt < -0.05) return 'Sunce je još nisko – razliku do potrošnje kuće pokriva baterija.';
    if (s.P > 0.05 && s.grid > 0.05) return 'Proizvodnja još ne pokriva svu potrošnju – razliku dopunjuje mreža.';
    if (s.P > 0.05) return 'Elektrana trenutno pokriva cijelu potrošnju kuće.';
    if (s.batt < -0.05) return 'Sunce je zašlo – kuću napaja baterija napunjena tijekom dana.';
    if (s.ev > 0.05 && s.grid > 0.05) return 'Auto se dopunjuje iz mreže po noćnoj tarifi.';
    if (hasBatt && s.grid > 0.05) return 'Baterija je ispražnjena – ostatak potrošnje dolazi iz mreže.';
    return 'Noću struju preuzimate iz mreže. Baterija bi pokrila večernju potrošnju.';
  }

  function drawChart() {
    const maxKw = Math.max(...day.pts.map((p) => Math.max(p.P, p.H + p.ev))) * 1.1;
    const X = (i) => (i / (STEPS - 1)) * 600;
    const Y = (v) => 116 - (v / maxKw) * 108;
    const area = `M0 116 ${day.pts.map((p, i) => `L${X(i).toFixed(1)} ${Y(p.P).toFixed(1)}`).join(' ')} L600 116 Z`;
    const load = day.pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p.H + p.ev).toFixed(1)}`).join(' ');
    const hasBatt = section.classList.contains('has-batt');
    const soc = day.pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${(116 - p.soc * 108).toFixed(1)}`).join(' ');
    chart.innerHTML = `
      <defs><linearGradient id="dcSun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB020" stop-opacity=".9"/><stop offset="1" stop-color="#FF7A1A" stop-opacity=".15"/></linearGradient></defs>
      <path d="${area}" fill="url(#dcSun)"/>
      <path d="${load}" fill="none" stroke="#5CCBFF" stroke-width="2" vector-effect="non-scaling-stroke"/>
      ${hasBatt ? `<path d="${soc}" fill="none" stroke="#3DDC97" stroke-width="1.6" stroke-dasharray="4 4" vector-effect="non-scaling-stroke"/>` : ''}
      <line data-cursor x1="0" x2="0" y1="0" y2="116" stroke="#fff" stroke-width="1.5" vector-effect="non-scaling-stroke" opacity=".8"/>`;
    const t = day.tot;
    stat('prod').textContent = `${n1(t.prod)} kWh`;
    stat('autarky').textContent = `${n0(Math.max(0, (1 - t.imp / t.cons) * 100))} %`;
    stat('export').textContent = `${n1(t.exp)} kWh`;
    stat('import').textContent = `${n1(t.imp)} kWh`;
  }

  function show(i) {
    idx = i;
    const s = day.pts[i];
    const hasBatt = section.classList.contains('has-batt');
    setLine('pv', s.P, true);
    setLine('home', s.H, false);
    setLine('ev', s.ev, false);
    setLine('batt', Math.abs(s.batt), s.batt < 0);
    setLine('grid', Math.abs(s.grid), s.grid > 0);
    val('pv').textContent = kw(s.P);
    val('home').textContent = kw(s.H);
    val('ev').textContent = kw(s.ev);
    val('batt').textContent = hasBatt ? `${n0(s.soc * 100)} %` : '–';
    val('battLabel').textContent = !hasBatt ? 'Bez baterije' : compact.matches ? 'Baterija' : s.batt > 0.05 ? 'Baterija · puni se' : s.batt < -0.05 ? 'Baterija · prazni se' : 'Baterija';
    socBar.setAttribute('width', hasBatt ? String(100 * s.soc) : '0');
    val('grid').textContent = kw(s.grid);
    val('gridLabel').textContent = compact.matches ? 'Mreža' : s.grid < -0.05 ? 'Mreža · predaja' : s.grid > 0.05 ? 'Mreža · preuzimanje' : 'Mreža';
    const peak = KWP * SEASONS[currentSeason()].peak;
    sun.style.opacity = String(0.15 + 0.85 * Math.min(1, s.P / peak));
    const h = Math.floor(s.t);
    const m = Math.round((s.t - h) * 60);
    clock.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    clockLabel.textContent = label(s.t);
    insight.textContent = insightText(s, hasBatt);
    const cursor = $('[data-cursor]', chart);
    const x = (i / (STEPS - 1)) * 600;
    cursor?.setAttribute('x1', x);
    cursor?.setAttribute('x2', x);
    timeInput.value = i;
    timeInput.style.setProperty('--p', `${(i / (STEPS - 1)) * 100}%`);
  }

  const currentSeason = () => $('input[name="flow-season"]:checked', root).value;

  function recompute() {
    const hasBatt = $('input[name="flow-battery"]', root).checked;
    const hasEv = $('input[name="flow-ev"]', root).checked;
    section.classList.toggle('has-batt', hasBatt);
    section.classList.toggle('has-ev', hasEv);
    day = simulateDay(currentSeason(), hasBatt, hasEv);
    drawChart();
    show(idx);
  }

  function setPlaying(on) {
    playing = on;
    playBtn.innerHTML = `<svg width="20" height="20" aria-hidden="true"><use href="#i-${on ? 'pause' : 'play'}"/></svg>`;
    playBtn.setAttribute('aria-label', on ? 'Zaustavi simulaciju' : 'Pokreni simulaciju dana');
    cancelAnimationFrame(raf);
    if (on) {
      lastT = performance.now();
      const tick = (now) => {
        if (now - lastT > 50) {
          lastT = now;
          show((idx + 1) % STEPS);
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
  }

  root.addEventListener('change', (e) => {
    if (e.target.name?.startsWith('flow-')) recompute();
  });
  timeInput.addEventListener('input', () => {
    setPlaying(false);
    show(+timeInput.value);
  });
  playBtn.addEventListener('click', () => setPlaying(!playing));

  recompute();

  // Animacije tokova rade samo dok je simulacija na ekranu.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => section.classList.toggle('is-live', entries[0].isIntersecting)).observe(root);
  } else {
    section.classList.add('is-live');
  }

  // Automatski pokreni kad je sekcija vidljiva (osim uz smanjeno kretanje).
  if (!reduceMotion && 'IntersectionObserver' in window) {
    let started = false;
    new IntersectionObserver(
      (entries) => {
        const vis = entries[0].isIntersecting;
        if (vis && !started) {
          started = true;
          show(84);
          setPlaying(true);
        } else if (!vis && playing) {
          setPlaying(false);
          started = false;
        }
      },
      { threshold: 0.35 }
    ).observe(root);
  }
}
