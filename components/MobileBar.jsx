'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { company } from '@/lib/site';

/** Donja traka na mobitelu (poziv, WhatsApp, ponuda) i WhatsApp gumb na desktopu. */
export default function MobileBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`mbar${visible ? ' is-visible' : ''}`} aria-label="Brzi kontakt">
        <a href={company.phoneHref} className="mbar__btn"><Icon name="phone" size={18} />Nazovi</a>
        <a href={company.whatsapp} className="mbar__btn" target="_blank" rel="noopener"><Icon name="whatsapp" size={18} />WhatsApp</a>
        <a href="#ponuda" className="mbar__btn mbar__btn--primary">Ponuda</a>
      </nav>
      <a className="wa-fab" href={company.whatsapp} target="_blank" rel="noopener" aria-label="Pišite nam na WhatsApp">
        <Icon name="whatsapp" size={26} />
      </a>
    </>
  );
}
