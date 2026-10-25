'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { company, media, nav } from '@/lib/site';

const norm = (p = '') => p.replace(/\/+$/, '') || '/';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('nav-open', open);
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}`}>
      <div className="hdr__in container">
        <Link className="logo" href="/" aria-label="EMSO e-mobility solutions, solarne elektrane" onClick={close}>
          <img className="logo__mark" src={media.logo} width="91" height="87" alt="" referrerPolicy="no-referrer" decoding="async" />
          <span className="logo__text">
            <span className="logo__word">EMSO</span>
            <span className="logo__sub">e-mobility solutions</span>
          </span>
        </Link>

        <nav className="nav" id="nav" aria-label="Glavna navigacija">
          <ul className="nav__list">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={norm(item.href) === norm(pathname) ? 'page' : undefined} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="nav__mobile">
            <a className="btn btn--primary btn--block" href="#ponuda" onClick={close}>Zatražite ponudu</a>
            <a className="nav__tel" href={company.phoneHref}><Icon name="phone" />{company.phone}</a>
            <p className="nav__hours">{company.hours} · {company.email}</p>
          </div>
        </nav>

        <div className="hdr__cta">
          <a className="hdr__phone" href={company.phoneHref} aria-label={`Nazovite nas: ${company.phone}`}>
            <Icon name="phone" size={18} /><span>01 2350 655</span>
          </a>
          <a className="btn btn--primary btn--sm hdr__btn" href="#ponuda">Zatražite ponudu</a>
          <button
            className="burger"
            type="button"
            aria-expanded={open}
            aria-controls="nav"
            aria-label={open ? 'Zatvori izbornik' : 'Otvori izbornik'}
            onClick={() => setOpen((o) => !o)}
          >
            <span /><span />
          </button>
        </div>
      </div>
    </header>
  );
}
