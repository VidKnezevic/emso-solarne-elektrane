'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { n0, n1, pct } from '@/lib/format';
import { simulateDay, explain } from '@/lib/flow-model';

const MOMENTS = [
  { label: 'Jutro', time: '07:00', i: 84 },
  { label: 'Dan', time: '10:00', i: 120 },
  { label: 'Večer', time: '21:00', i: 252 },
  { label: 'Noć', time: '02:00', i: 24 },
];
const kw = (v) => `${n1(Math.abs(v) < 0.05 ? 0 : Math.abs(v))} kW`;
const line = (power, reverse) => ({
  opacity: power > 0.05 ? 1 : 0,
  strokeWidth: 2.5 + Math.min(power, 6) * 0.8,
  '--dur': `${Math.min(3, Math.max(0.4, 2.4 / (0.4 + power))).toFixed(2)}s`,
  '--dir': reverse ? 'reverse' : 'normal',
});

function Node({ x, y, icon, iconClass = '', label, short, value, children }) {
  return (
    <g className="fnode" transform={`translate(${x} ${y})`}>
      <rect width="170" height="74" rx="6" />
      <use href={`#i-${icon}`} x="14" y="23" width="28" height="28" className={`fnode__ico ${iconClass}`} />
      <text x="54" y="31" className="fnode__l">{short ?? label}</text>
      <text x="54" y="55" className="fnode__v">{value}</text>
      {children}
    </g>
  );
}

/** Kamo ide struja iz elektrane u četiri trenutka sunčanog ljetnog dana, s baterijom ili bez nje. */
export default function EnergyFlow() {
  const days = useMemo(() => ({ true: simulateDay(true), false: simulateDay(false) }), []);
  const [moment, setMoment] = useState(0);
  const [battery, setBattery] = useState(true);
  const [compact, setCompact] = useState(false);
  const [live, setLive] = useState(false);
  const rootRef = useRef(null);
  const tabsRef = useRef([]);
  const autoRef = useRef(true);

  useEffect(() => {
    const mq = matchMedia('(max-width: 560px)');
    const on = () => setCompact(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Dok je prikaz vidljiv, trenuci se sami izmjenjuju dok korisnik ne klikne.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        setLive(entry.isIntersecting);
        clearInterval(timer);
        if (entry.isIntersecting && autoRef.current && !reduce) {
          timer = setInterval(() => autoRef.current && setMoment((m) => (m + 1) % MOMENTS.length), 4500);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, []);

  const stopAuto = () => (autoRef.current = false);
  const day = days[battery];
  const m = MOMENTS[moment];
  const s = day.pts[m.i];

  const onKey = (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    stopAuto();
    const nextIdx = (moment + (e.key === 'ArrowRight' ? 1 : MOMENTS.length - 1)) % MOMENTS.length;
    setMoment(nextIdx);
    tabsRef.current[nextIdx]?.focus();
  };

  const battLabel = !battery ? 'Bez baterije' : compact ? 'Baterija' : s.batt > 0.05 ? 'Baterija se puni' : s.batt < -0.05 ? 'Baterija se prazni' : 'Baterija';
  const gridLabel = compact ? 'Mreža' : s.grid < -0.05 ? 'Predaja u mrežu' : s.grid > 0.05 ? 'Iz mreže' : 'Mreža';

  return (
    <div className={`flow__app${battery ? ' has-batt' : ''}${live ? ' is-live' : ''}`} ref={rootRef} onPointerDown={stopAuto}>
      <div className="flow__controls">
        <div className="moments" role="tablist" aria-label="Doba dana" onKeyDown={onKey}>
          {MOMENTS.map((mm, i) => (
            <button
              key={mm.label}
              ref={(el) => (tabsRef.current[i] = el)}
              type="button"
              className="moment"
              role="tab"
              aria-selected={i === moment}
              aria-controls="flow-panel"
              tabIndex={i === moment ? 0 : -1}
              onClick={() => {
                stopAuto();
                setMoment(i);
              }}
            >
              <b>{mm.label}</b>
              <small>{mm.time}</small>
            </button>
          ))}
        </div>
        <label className="toggle">
          <input type="checkbox" checked={battery} onChange={(e) => { stopAuto(); setBattery(e.target.checked); }} />
          <span className="toggle__ui" aria-hidden="true" />
          S baterijom
        </label>
      </div>

      <div className="flow__stage" id="flow-panel" role="tabpanel">
        <svg className="flow__svg" viewBox="0 0 640 400" role="img" aria-labelledby="flow-svg-title flow-svg-desc">
          <title id="flow-svg-title">Tokovi energije u kućanstvu sa solarnom elektranom</title>
          <desc id="flow-svg-desc">Dijagram prikazuje kako energija teče od solarnih panela preko invertera prema kući, bateriji i elektroenergetskoj mreži.</desc>
          <g>
            <path className="ln-track" d="M320 200 L110 75" />
            <path className="ln-track" d="M320 200 L530 75" />
            <path className="ln-track" d="M320 200 L110 325" />
            <path className="ln-track" d="M320 200 L530 325" />
            <path className="ln-flow ln-flow--sun" d="M320 200 L110 75" style={line(s.P, true)} />
            <path className="ln-flow ln-flow--home" d="M320 200 L530 75" style={line(s.H, false)} />
            <path className="ln-flow ln-flow--batt" d="M320 200 L110 325" style={line(Math.abs(s.batt), s.batt < 0)} />
            <path className="ln-flow ln-flow--grid" d="M320 200 L530 325" style={line(Math.abs(s.grid), s.grid > 0)} />
          </g>
          <Node x={25} y={38} icon="panel" iconClass="fnode__ico--sun" label="Solarni paneli" short={compact ? 'Paneli' : undefined} value={kw(s.P)} />
          <Node x={445} y={38} icon="home" label="Kuća" value={kw(s.H)} />
          <g className="fnode-batt">
            <Node x={25} y={288} icon="battery" iconClass="fnode__ico--green" label={battLabel} value={battery ? `${n0(s.soc * 100)} %` : '–'}>
              <rect x="54" y="62" width="100" height="4" rx="2" className="fnode__bar" />
              <rect x="54" y="62" width={battery ? 100 * s.soc : 0} height="4" rx="2" className="fnode__barfill" />
            </Node>
          </g>
          <Node x={445} y={288} icon="grid" label={gridLabel} value={kw(s.grid)} />
          <g className="fhub" transform="translate(320 200)">
            <circle r="46" />
            <use href="#i-chip" x="-14" y="-24" width="28" height="28" className="fnode__ico" />
            <text y="20" textAnchor="middle" className="fnode__l">Inverter</text>
          </g>
        </svg>

        <div className="flow__side">
          <p className="flow__moment">{m.label}, {m.time}</p>
          <p className="flow__insight" aria-live="polite">{explain(s, battery)}</p>
          <div className="flow__day">
            <p><span>Dio dana pokriven vlastitom strujom</span><b>{pct(day.autarky * 100)}</b></p>
            <div className="flow__daybar"><i style={{ width: `${day.autarky * 100}%` }} /></div>
            <p className="small">Uključite i isključite bateriju pa usporedite.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
