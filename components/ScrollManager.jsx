'use client';

import { useEffect } from 'react';

/**
 * Glatko pomicanje samo unutar iste stranice: sidra (#ponuda, #reference …) i poveznice na stranicu
 * na kojoj je posjetitelj već (npr. „Solarne elektrane“ na naslovnici) koje vode na vrh.
 *
 * Prelaske na druge stranice odrađuje Next.js bez animacije, pa nova stranica uvijek kreće od vrha
 * ili točno od tražene sekcije. Globalni `scroll-behavior: smooth` se zato ne koristi: uz njega se
 * Next.js-ova pomicanja pri prelasku preklapaju i stanu na pola puta.
 */
export default function ScrollManager() {
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;

      const id = decodeURIComponent(url.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return;

      // Next.js Link ne navigira kad je klik već obrađen (defaultPrevented).
      e.preventDefault();
      // Novi unos u povijest prije pomicanja: preglednik tako za „Natrag“ pamti položaj s kojeg je posjetitelj krenuo.
      if (url.hash !== location.hash) history.pushState(null, '', url.hash || url.pathname);
      const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      if (target) target.scrollIntoView({ behavior, block: 'start' });
      else window.scrollTo({ top: 0, behavior });
    };
    // Faza hvatanja: obrada prije Next.js Linka.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
