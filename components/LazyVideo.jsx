'use client';

import { useEffect, useRef } from 'react';

/** Video koji se učitava kad se približi ekranu i vrti se samo dok je vidljiv. */
export default function LazyVideo({ src, width, height, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || !('IntersectionObserver' in window)) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!v.src) {
            v.preload = 'metadata';
            v.src = `${src}#t=0.5`;
          }
          if (!reduce) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);
  return <video ref={ref} className={className} width={width} height={height} muted loop playsInline preload="none" aria-hidden="true" />;
}
