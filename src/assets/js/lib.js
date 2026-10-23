// Zajednički pomoćnici: formatiranje brojeva (hr-HR) i rad s klizačima.
const nf0 = new Intl.NumberFormat('hr-HR', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('hr-HR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat('hr-HR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const n0 = (v) => nf0.format(Math.round(v));
export const n1 = (v) => nf1.format(v);
export const n2 = (v) => nf2.format(v);
export const eur = (v) => `${n0(v)} €`;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Zaokruži na "lijep" broj za prikaz iznosa (npr. 6.237 → 6.250). */
export function nice(v, step = 50) {
  return Math.round(v / step) * step;
}

/** Popuni stazu klizača do trenutne vrijednosti (CSS varijabla --p). */
export function fillRange(input) {
  const min = +input.min || 0;
  const max = +input.max || 100;
  const p = ((+input.value - min) / (max - min)) * 100;
  input.style.setProperty('--p', `${clamp(p, 0, 100)}%`);
}

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pokreni fn tek kad se element približi ekranu (štedi rad pri učitavanju). */
export function whenNear(el, fn, margin = '600px') {
  if (!('IntersectionObserver' in window)) return fn();
  // Promatra se sekcija, ne element u njoj: sadržaj sekcija s content-visibility se tako ne mora računati unaprijed.
  el = el.closest('main > section') || el;
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    },
    { rootMargin: margin }
  );
  io.observe(el);
}

/** Odgodi nekritičan posao do trenutka kad je preglednik slobodan. */
export const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));

/** Glatko "odbrojavanje" teksta prema novoj brojčanoj vrijednosti. */
export function tween(el, to, format, ms = 500) {
  const from = +el.dataset.v || 0;
  el.dataset.v = to;
  if (reduceMotion || !isFinite(from) || from === to) {
    el.textContent = format(to);
    return;
  }
  const t0 = performance.now();
  cancelAnimationFrame(+el.dataset.raf || 0);
  const step = (t) => {
    const k = Math.min(1, (t - t0) / ms);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = format(from + (to - from) * e);
    if (k < 1) el.dataset.raf = requestAnimationFrame(step);
  };
  el.dataset.raf = requestAnimationFrame(step);
  // Ako preglednik priguši requestAnimationFrame (npr. skrivena kartica), ipak prikaži konačnu vrijednost.
  clearTimeout(+el.dataset.to || 0);
  el.dataset.to = setTimeout(() => {
    if (+el.dataset.v === to) el.textContent = format(to);
  }, ms + 80);
}
