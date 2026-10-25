'use client';

/** Poveznica na obrazac koja ujedno odabire što korisnika zanima (npr. „Solarna elektrana i punionica“). */
export default function PrefillLink({ detail, className, children }) {
  return (
    <a className={className} href="#ponuda" onClick={() => dispatchEvent(new CustomEvent('emso:prefill', { detail }))}>
      {children}
    </a>
  );
}
