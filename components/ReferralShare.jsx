'use client';

import { useState } from 'react';
import { Icon } from './Icons';
import { SITE_URL } from '@/lib/site';

const MESSAGE = 'Mi smo solarnu elektranu ugradili s EMSO-om. Zatraži besplatnu ponudu i u upitu upiši moje ime, pa oboje ostvarujemo nagradu iz programa preporuke:';

/** Gumbi za dijeljenje preporuke (sustavno dijeljenje na mobitelu, WhatsApp i kopiranje poveznice). */
export default function ReferralShare() {
  const [copied, setCopied] = useState(false);
  const url = `${SITE_URL}/#ponuda`;

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'EMSO solarne elektrane', text: MESSAGE, url });
        return;
      } catch {
        // Korisnik je odustao ili dijeljenje nije podržano; nastavlja se na WhatsApp.
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${MESSAGE} ${url}`)}`, '_blank', 'noopener');
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${MESSAGE} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="referral__share">
      <button type="button" className="btn btn--primary" onClick={share}><Icon name="share" size={18} />Podijelite preporuku</button>
      <button type="button" className="btn btn--outline" onClick={copy}><Icon name="copy" size={18} />{copied ? 'Poveznica je kopirana' : 'Kopirajte poveznicu'}</button>
    </div>
  );
}
