// Zajedničko ponašanje svih stranica: zaglavlje, izbornik, animacije, videi i obrazac za ponudu.
import { $, $$, reduceMotion, fillRange, idle, whenNear } from './lib.js';

const html = document.documentElement;

/* ---------- Zaglavlje i mobilna traka ---------- */
const hdr = $('[data-hdr]');
const mbar = $('.mbar');
const onScroll = () => {
  const y = window.scrollY;
  hdr?.classList.toggle('is-scrolled', y > 24);
  mbar?.classList.toggle('is-visible', y > 520);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- Mobilni izbornik ---------- */
const burger = $('[data-burger]');
const setNav = (open) => {
  html.classList.toggle('nav-open', open);
  burger?.setAttribute('aria-expanded', String(open));
  burger?.setAttribute('aria-label', open ? 'Zatvori izbornik' : 'Otvori izbornik');
};
burger?.addEventListener('click', () => setNav(!html.classList.contains('nav-open')));
$$('#nav a').forEach((a) => a.addEventListener('click', () => setNav(false)));
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && html.classList.contains('nav-open')) {
    setNav(false);
    burger?.focus();
  }
});
matchMedia('(min-width: 1101px)').addEventListener('change', (e) => e.matches && setNav(false));

/* ---------- Pojavljivanje elemenata pri skrolanju ---------- */
const revealEls = $$('.reveal');
revealEls.forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  const i = sibs.indexOf(el);
  if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 70}ms`);
});
/** Elemente promatraj tek kad se njihova sekcija približi ekranu. */
const observeLazily = (els, io) => {
  const bySection = new Map();
  els.forEach((el) => {
    const s = el.closest('main > section') || document.body;
    bySection.set(s, [...(bySection.get(s) || []), el]);
  });
  bySection.forEach((list, s) => whenNear(s, () => list.forEach((el) => io.observe(el)), '200px'));
};
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  observeLazily(revealEls, io);
} else {
  revealEls.forEach((el) => el.classList.add('is-in'));
}

/* ---------- Video u heroju ---------- */
// Na većim ekranima kreće nakon učitavanja stranice, a na mobitelu na prvi dodir ili skrol
// (štedi mobilne podatke i procesor). Ne pokreće se uz smanjeno kretanje ni uštedu podataka.
const heroVideo = $('[data-hero-video]');
if (heroVideo && !reduceMotion && !navigator.connection?.saveData) {
  let started = false;
  const startHero = () => {
    if (started) return;
    started = true;
    heroVideo.src = heroVideo.dataset.src;
    heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-playing'), { once: true });
    heroVideo.play().catch(() => {});
  };
  if (matchMedia('(min-width: 768px)').matches) {
    if (document.readyState === 'complete') idle(startHero);
    else addEventListener('load', () => idle(startHero), { once: true });
  } else {
    const opts = { once: true, passive: true };
    ['touchstart', 'pointerdown', 'scroll', 'keydown'].forEach((ev) => addEventListener(ev, startHero, opts));
  }
}

/* ---------- Videi referenci: učitaj kad se približe, puštaj samo dok su vidljivi ---------- */
const lazyVideos = $$('[data-lazy-video]');
if (lazyVideos.length && 'IntersectionObserver' in window) {
  const vo = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          if (!v.src) {
            v.preload = 'metadata';
            v.src = v.dataset.src + '#t=0.5';
          }
          if (!reduceMotion) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    },
    { threshold: 0.25 }
  );
  observeLazily(lazyVideos, vo);
}

/* ---------- Aktivna stavka sadržaja vodiča ---------- */
const tocLinks = $$('.guide__toc a');
if (tocLinks.length && 'IntersectionObserver' in window) {
  const map = new Map(tocLinks.map((a) => [a.hash.slice(1), a]));
  const to = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('is-active'));
          map.get(en.target.id)?.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-20% 0px -70% 0px' }
  );
  observeLazily([...map.keys()].map((id) => document.getElementById(id)).filter(Boolean), to);
}

/* ---------- Klizači: popuna staze ---------- */
$$('input[type="range"]').forEach((r) => {
  fillRange(r);
  r.addEventListener('input', () => fillRange(r));
});

/* ---------- Gumbi koji unaprijed biraju vrstu objekta u upitu ---------- */
$$('[data-preset]').forEach((a) =>
  a.addEventListener('click', () => {
    const r = $(`[data-wizard] input[name="objekt"][value="${a.dataset.preset}"]`);
    if (r) r.checked = true;
  })
);

/* ---------- Obrazac za ponudu (wizard) ---------- */
const form = $('[data-wizard]');
if (form) {
  const steps = $$('.wizard__step', form);
  const bar = $('[data-wizard-bar]', form);
  const label = $('[data-wizard-label]', form);
  const err = $('[data-wizard-error]', form);
  let cur = 0;

  const show = (i, focus = true) => {
    cur = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    form.classList.toggle('is-first', i === 0);
    form.classList.toggle('is-last', i === steps.length - 1);
    bar.style.width = `${((i + 1) / steps.length) * 100}%`;
    label.textContent = `Korak ${i + 1} od ${steps.length}`;
    err.textContent = '';
    if (focus) steps[i].querySelector('input:not([type=hidden]), textarea')?.focus({ preventScroll: true });
  };

  const validate = (i) => {
    const fields = $$('input[required], textarea[required]', steps[i]);
    let firstBad = null;
    fields.forEach((f) => {
      const ok = f.type === 'checkbox' ? f.checked : f.value.trim() !== '' && f.checkValidity();
      f.classList.toggle('is-invalid', !ok);
      f.setAttribute('aria-invalid', String(!ok));
      if (!ok && !firstBad) firstBad = f;
    });
    if (firstBad) {
      err.textContent =
        firstBad.type === 'email' && firstBad.value
          ? 'Provjerite e-mail adresu.'
          : firstBad.type === 'checkbox'
            ? 'Za slanje upita potrebna je vaša suglasnost.'
            : 'Molimo ispunite označena polja.';
      firstBad.focus();
      return false;
    }
    return true;
  };

  $('[data-wizard-next]', form).addEventListener('click', () => validate(cur) && show(cur + 1));
  $('[data-wizard-prev]', form).addEventListener('click', () => cur > 0 && show(cur - 1));
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !form.classList.contains('is-last')) {
      e.preventDefault();
      if (validate(cur)) show(cur + 1);
    }
  });
  $$('input, textarea', form).forEach((f) => f.addEventListener('input', () => f.classList.remove('is-invalid')));

  const done = (text) => {
    form.classList.add('is-done');
    const box = $('[data-wizard-done]', form);
    box.hidden = false;
    if (text) $('[data-wizard-done-text]', form).textContent = text;
    box.setAttribute('tabindex', '-1');
    box.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(cur)) return;
    const data = Object.fromEntries(new FormData(form));
    data.stranica = location.href;
    const endpoint = form.dataset.endpoint;
    const submitBtn = $('[data-wizard-submit]', form);

    if (endpoint) {
      submitBtn.disabled = true;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.status);
        done('Upit je poslan. Javit ćemo vam se u najkraćem roku s prijedlogom rješenja i ponudom.');
      } catch {
        err.textContent = `Slanje trenutno nije uspjelo. Nazovite nas ili pišite na ${form.dataset.email}.`;
      } finally {
        submitBtn.disabled = false;
      }
      return;
    }

    const lines = [
      'Poštovani,',
      '',
      'molim vas ponudu prema sljedećim podacima:',
      '',
      `Interes: ${data.interes}`,
      `Objekt: ${data.objekt}`,
      `Krov: ${data.krov}`,
      `Mjesto ugradnje: ${data.mjesto}`,
      data.racun ? `Mjesečni račun za struju: ${data.racun} €` : '',
      data.izracun ? `Izračun s web stranice: ${data.izracun}` : '',
      data.napomena ? `Napomena: ${data.napomena}` : '',
      '',
      `Ime i prezime: ${data.ime}`,
      `E-mail: ${data.email}`,
      `Telefon: ${data.telefon}`,
    ].filter((l, i, a) => l !== '' || a[i - 1] !== '');
    const subject = `Upit za ponudu – ${data.interes} (${data.mjesto})`;
    window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    done(`Otvorili smo vaš e-mail program s pripremljenim upitom – samo kliknite „Pošalji“. Ako se nije otvorio, pišite nam na ${form.dataset.email}.`);
  });

  show(0, false);
}
