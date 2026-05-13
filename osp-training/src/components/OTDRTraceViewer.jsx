import React, { useMemo, useRef, useState } from 'react';

/**
 * OTDR trace viewer — teaching tool, not a measurement instrument.
 *
 * Renders a synthetic trace assembled from a list of "events" along the
 * fiber:
 *   { kind: 'launch'|'splice'|'connector'|'macrobend'|'reflective'|'end',
 *     km, lossDb? }
 *
 * Between events the trace decays linearly per km × dB/km. A reflective
 * event (mechanical splice / connector) shows an upward spike just before
 * the loss step. A non-reflective event (fusion splice / macrobend) shows
 * just the step. Dead zones around reflective events are shaded so the
 * student can see why nearby events are sometimes missed.
 *
 * Click anywhere on the trace to drop a measurement cursor.
 */

const W = 720;
const H = 240;
const PAD_L = 50;
const PAD_R = 12;
const PAD_T = 12;
const PAD_B = 28;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;

export default function OTDRTraceViewer({
  totalKm = 20,
  dbPerKm = 0.22,        // 1550 nm typical
  startDb = 0,           // launch level reference (dB scale, top of trace)
  events = DEFAULT_EVENTS,
}) {
  const [cursor, setCursor] = useState(null);
  const svgRef = useRef(null);

  // Build sample points
  const samples = useMemo(() => {
    const pts = [];
    let cumulativeLoss = 0;
    let lastKm = 0;
    const sortedEvents = [...events].sort((a, b) => a.km - b.km);

    for (const ev of sortedEvents) {
      // continuous fiber span up to this event
      const spanKm = ev.km - lastKm;
      const spanLoss = spanKm * dbPerKm;
      const stepKm = Math.max(0.05, spanKm / 10);
      for (let k = lastKm; k <= ev.km; k += stepKm) {
        const dB = startDb - (cumulativeLoss + (k - lastKm) * dbPerKm);
        pts.push({ km: k, dB });
      }
      cumulativeLoss += spanLoss;

      // reflective spike (small upward bump just at the event)
      if (ev.kind === 'connector' || ev.kind === 'reflective') {
        pts.push({ km: ev.km, dB: startDb - cumulativeLoss + 1.5 });
        pts.push({ km: ev.km + 0.01, dB: startDb - cumulativeLoss + 1.5 });
      }

      // step-down (event loss)
      if (ev.lossDb) {
        cumulativeLoss += ev.lossDb;
        pts.push({ km: ev.km + 0.02, dB: startDb - cumulativeLoss });
      }
      lastKm = ev.km;

      if (ev.kind === 'end') break;
    }
    if (sortedEvents.at(-1)?.kind !== 'end') {
      // run trace out to totalKm
      const stepKm = Math.max(0.1, (totalKm - lastKm) / 10);
      for (let k = lastKm; k <= totalKm; k += stepKm) {
        const dB = startDb - (cumulativeLoss + (k - lastKm) * dbPerKm);
        pts.push({ km: k, dB });
      }
    }
    return pts;
  }, [events, dbPerKm, startDb, totalKm]);

  // dB extent
  const dBmin = Math.min(...samples.map(p => p.dB)) - 2;
  const dBmax = startDb + 2;
  const x = (km) => PAD_L + (km / totalKm) * PLOT_W;
  const y = (dB) => PAD_T + ((dBmax - dB) / (dBmax - dBmin)) * PLOT_H;

  const path = samples.map((p, i) => `${i ? 'L' : 'M'} ${x(p.km).toFixed(1)} ${y(p.dB).toFixed(1)}`).join(' ');

  function onClick(e) {
    const rect = svgRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const km = ((px - PAD_L) / PLOT_W) * totalKm;
    if (km < 0 || km > totalKm) return;
    // find sample dB at km
    const nearest = samples.reduce((a, b) =>
      Math.abs(b.km - km) < Math.abs(a.km - km) ? b : a, samples[0]);
    setCursor({ km, dB: nearest.dB });
  }

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-1">OTDR Trace Viewer</h3>
      <p className="text-xs text-slate-300/70 mb-3">
        Synthetic trace at {dbPerKm} dB/km. Click anywhere to drop a
        measurement cursor. Shaded bands are event dead zones (events too
        close to a reflective event are easy to miss).
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full bg-black/40 rounded-lg border border-white/10 cursor-crosshair"
        onClick={onClick}
      >
        {/* axes */}
        <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke="#475569" />
        <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke="#475569" />

        {/* km gridlines */}
        {Array.from({ length: Math.floor(totalKm / 5) + 1 }).map((_, i) => {
          const km = i * 5;
          return (
            <g key={i}>
              <line x1={x(km)} y1={PAD_T} x2={x(km)} y2={H - PAD_B} stroke="#1e293b" strokeDasharray="2 4" />
              <text x={x(km)} y={H - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">{km} km</text>
            </g>
          );
        })}
        {/* dB gridlines */}
        {[0, -5, -10, -15].map((d) => (
          <g key={d}>
            <line x1={PAD_L} y1={y(d)} x2={W - PAD_R} y2={y(d)} stroke="#1e293b" strokeDasharray="2 4" />
            <text x={PAD_L - 6} y={y(d) + 3} fill="#94a3b8" fontSize="10" textAnchor="end">{d} dB</text>
          </g>
        ))}

        {/* dead zones around reflective events */}
        {events.filter(e => e.kind === 'connector' || e.kind === 'reflective').map((e, i) => {
          const dzKm = 0.7; // ~700 m attenuation dead zone (synthetic)
          return (
            <rect key={i}
              x={x(e.km)} y={PAD_T}
              width={x(e.km + dzKm) - x(e.km)} height={PLOT_H}
              fill="#f59e0b" opacity="0.07"
            />
          );
        })}

        {/* trace */}
        <path d={path} fill="none" stroke="#fbbf24" strokeWidth="1.6" />

        {/* event markers */}
        {events.map((e, i) => (
          <g key={i}>
            <line x1={x(e.km)} y1={PAD_T} x2={x(e.km)} y2={H - PAD_B}
              stroke={eventColor(e.kind)} strokeOpacity="0.45" strokeDasharray="3 3" />
            <text x={x(e.km)} y={PAD_T + 10} fill={eventColor(e.kind)} fontSize="9" textAnchor="middle">
              {e.kind}
            </text>
          </g>
        ))}

        {/* cursor */}
        {cursor && (
          <g>
            <line x1={x(cursor.km)} y1={PAD_T} x2={x(cursor.km)} y2={H - PAD_B}
                  stroke="#22d3ee" strokeWidth="1" />
            <circle cx={x(cursor.km)} cy={y(cursor.dB)} r="3" fill="#22d3ee" />
            <rect x={x(cursor.km) + 6} y={y(cursor.dB) - 22}
                  width="120" height="32" rx="4"
                  fill="#0f172a" stroke="#22d3ee" />
            <text x={x(cursor.km) + 12} y={y(cursor.dB) - 9} fill="#e2e8f0" fontSize="10">
              km: {cursor.km.toFixed(2)}
            </text>
            <text x={x(cursor.km) + 12} y={y(cursor.dB) + 4} fill="#e2e8f0" fontSize="10">
              level: {cursor.dB.toFixed(2)} dB
            </text>
          </g>
        )}
      </svg>

      <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs">
        {events.map((e, i) => (
          <div key={i} className="flex items-center gap-2 text-slate-300/90">
            <span className="inline-block w-2 h-2 rounded-full" style={{background: eventColor(e.kind)}}/>
            <span className="font-mono">{e.km.toFixed(2)} km</span>
            <span>{e.kind}{e.lossDb ? ` — ${e.lossDb.toFixed(2)} dB` : ''}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function eventColor(kind) {
  switch (kind) {
    case 'launch':     return '#22d3ee';
    case 'splice':     return '#a3e635';
    case 'connector':  return '#fb923c';
    case 'reflective': return '#f43f5e';
    case 'macrobend':  return '#e879f9';
    case 'end':        return '#94a3b8';
    default:           return '#94a3b8';
  }
}

const DEFAULT_EVENTS = [
  { kind: 'launch',     km: 0,    lossDb: 0 },
  { kind: 'connector',  km: 0.30, lossDb: 0.30 },   // entry connector
  { kind: 'splice',     km: 4.20, lossDb: 0.05 },
  { kind: 'macrobend',  km: 9.10, lossDb: 0.40 },   // suspicious — re-test
  { kind: 'splice',     km: 12.60, lossDb: 0.08 },
  { kind: 'connector',  km: 19.70, lossDb: 0.30 },
  { kind: 'end',        km: 20.00, lossDb: 0 },
];
