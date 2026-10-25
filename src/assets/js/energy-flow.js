// Prikaz toka energije za četiri trenutka u danu, s baterijom ili bez nje.
import { $, $$, n0, n1, pct, reduceMotion, whenNear } from './lib.js';
import { simulateDay, explain } from './flow-model.js';

const root = $('[data-flow]');
if (root) whenNear(root, initFlow);

function initFlow() {
  const section = root.closest('.flow');
  const svg = $('.flow__svg', root);
  const lines = Object.fromEntries($$('[data-line]', svg).map((p) => [p.dataset.line, p]));
  const val = (k) => $(`[data-v="${k}"]`, svg);
  const socBar = $('[data-soc-bar]', svg);
  const tabs = $$('[data-moment]', root);
  const battInput = $('input[name="flow-battery"]', root);
  const title = $('[data-moment-title]', root);
  const insight = $('[data-insight]', root);
  const autarky = $('[data-autarky]', root);
  const autarkyBar = $('[data-autarky-bar]', root);
  const days = { true: simulateDay(true), false: simulateDay(false) };
  const compact = matchMedia('(max-width: 560px)');
  let current = tabs.find((t) => t.getAttribute('aria-selected') === 'true') || tabs[0];
  let timer = 0;

  const kw = (v) => `${n1(Math.abs(v) < 0.05 ? 0 : Math.abs(v))} kW`;

  function setLine(name, power, reverse) {
    const p = lines[name];
    p.style.opacity = power > 0.05 ? '1' : '0';
    p.style.strokeWidth = String(2.5 + Math.min(power, 6) * 0.8);
    p.style.setProperty('--dur', `${Math.min(3, Math.max(0.4, 2.4 / (0.4 + power))).toFixed(2)}s`);
    p.style.setProperty('--dir', reverse ? 'reverse' : 'normal');
  }

  function render() {
    const hasBatt = battInput.checked;
    const day = days[hasBatt];
    const s = day.pts[+current.dataset.moment];
    section.classList.toggle('has-batt', hasBatt);

    setLine('pv', s.P, true);
    setLine('home', s.H, false);
    setLine('batt', Math.abs(s.batt), s.batt < 0);
    setLine('grid', Math.abs(s.grid), s.grid > 0);
    val('pv').textContent = kw(s.P);
    val('home').textContent = kw(s.H);
    val('batt').textContent = hasBatt ? `${n0(s.soc * 100)} %` : '–';
    val('battLabel').textContent = !hasBatt ? 'Bez baterije' : compact.matches ? 'Baterija' : s.batt > 0.05 ? 'Baterija se puni' : s.batt < -0.05 ? 'Baterija se prazni' : 'Baterija';
    socBar.setAttribute('width', hasBatt ? String(100 * s.soc) : '0');
    val('grid').textContent = kw(s.grid);
    val('gridLabel').textContent = compact.matches ? 'Mreža' : s.grid < -0.05 ? 'Predaja u mrežu' : s.grid > 0.05 ? 'Iz mreže' : 'Mreža';

    title.textContent = `${current.querySelector('b').textContent}, ${current.querySelector('small').textContent}`;
    insight.textContent = explain(s, hasBatt);
    autarky.textContent = pct(day.autarky * 100);
    autarkyBar.style.width = `${day.autarky * 100}%`;
  }

  function select(tab, focus = false) {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    current = tab;
    if (focus) tab.focus();
    render();
  }

  // Kratki nazivi u dijagramu na uskim ekranima.
  const applyShort = () =>
    $$('[data-short]', svg).forEach((t) => {
      t.dataset.long ??= t.textContent;
      t.textContent = compact.matches ? t.dataset.short : t.dataset.long;
    });
  applyShort();
  compact.addEventListener('change', () => {
    applyShort();
    render();
  });

  const stopAuto = () => clearInterval(timer);
  tabs.forEach((t) =>
    t.addEventListener('click', () => {
      stopAuto();
      select(t);
    })
  );
  // Strelice lijevo/desno između kartica (obrazac za tablist).
  root.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0 || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    stopAuto();
    select(tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length], true);
  });
  battInput.addEventListener('change', () => {
    stopAuto();
    render();
  });

  select(current);

  // Dok je simulacija vidljiva, trenuci se sami izmjenjuju dok korisnik ne klikne.
  if ('IntersectionObserver' in window) {
    let interacted = false;
    root.addEventListener('pointerdown', () => (interacted = true), { once: true });
    new IntersectionObserver((entries) => {
      const vis = entries[0].isIntersecting;
      section.classList.toggle('is-live', vis);
      stopAuto();
      if (vis && !interacted && !reduceMotion) {
        timer = setInterval(() => select(tabs[(tabs.indexOf(current) + 1) % tabs.length]), 4500);
      }
    }, { threshold: 0.4 }).observe(root);
  } else {
    section.classList.add('is-live');
  }
}
