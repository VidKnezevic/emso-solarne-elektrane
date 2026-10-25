'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Pozadinski video u heroju. Na većim ekranima kreće nakon učitavanja stranice, a na mobitelu
 * na prvi dodir ili skrol. Ne pokreće se uz smanjeno kretanje ni uštedu podataka.
 */
export default function HeroVideo({ src, poster, posterWidth, posterHeight }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      video.src = src;
      video.play().catch(() => {});
    };
    const idle = (fn) => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
    const events = ['touchstart', 'pointerdown', 'scroll', 'keydown'];
    if (matchMedia('(min-width: 768px)').matches) {
      if (document.readyState === 'complete') idle(start);
      else addEventListener('load', () => idle(start), { once: true });
    } else {
      events.forEach((ev) => addEventListener(ev, start, { once: true, passive: true }));
    }
    return () => events.forEach((ev) => removeEventListener(ev, start));
  }, [src]);

  return (
    <div className="hero__media" aria-hidden="true">
      <img src={poster} width={posterWidth} height={posterHeight} alt="" referrerPolicy="no-referrer" fetchPriority="high" decoding="async" />
      <video ref={ref} className={playing ? 'is-playing' : undefined} muted loop playsInline preload="none" onPlaying={() => setPlaying(true)} />
    </div>
  );
}
