import React, { useMemo, useState } from 'react';

/**
 * SliderExploration — multi-variable sandbox with real-time result feedback.
 *
 * Renders one slider per variable. As the user moves sliders, the dependent
 * result re-calculates instantly. Designed for "what happens if I change X?"
 * exploration — the link budget, sag, conduit fill, and span design use cases.
 *
 * @param {string}   title          - Section title.
 * @param {string}   [description]  - Short intro explaining what the user is exploring.
 * @param {Array}    variables      - Array of slider variable descriptors:
 *   {
 *     key:      string,   // identifier used as object key in the values map
 *     label:    string,   // human-readable label
 *     units:    string,   // units shown beside the live value
 *     min:      number,   // slider minimum
 *     max:      number,   // slider maximum
 *     step:     number,   // slider step
 *     default:  number,   // initial value
 *     format?:  Function  // optional: (value) => string for custom display
 *   }
 * @param {Function} compute        - (values: {key: number}) => {result: number, label: string, unit: string, status?: 'ok'|'warn'|'error', statusMessage?: string, decimals?: number}
 *                                    Called on every slider change. Return object shape:
 *                                    { result, label, unit, status?, statusMessage?, decimals? }
 *                                    decimals?: number — optional, defaults to 2. Controls decimal
 *                                    places shown on the live result display.
 * @param {Array}    [annotations]  - Optional reference lines on the result display:
 *   [{ value: number, label: string, color?: string }]
 *   Shown as reference markers alongside the live result for comparison.
 */
export default function SliderExploration({
  title,
  description,
  variables,
  compute,
  annotations = [],
}) {
  const initial = Object.fromEntries(variables.map(v => [v.key, v.default]));
  const [values, setValues] = useState(initial);

  const computed = useMemo(() => {
    try { return compute(values); }
    catch { return { result: 0, label: 'Result', unit: '', status: 'error', statusMessage: 'Calculation error.' }; }
  }, [values, compute]);

  const statusColor = {
    ok:    'text-ospgreen',
    warn:  'text-amber-300',
    error: 'text-rose-400',
  }[computed.status ?? 'ok'];

  const statusBorder = {
    ok:    'border-ospgreen/30',
    warn:  'border-amber-300/30',
    error: 'border-rose-400/30',
  }[computed.status ?? 'ok'];

  function update(key, val) {
    setValues(prev => ({ ...prev, [key]: Number(val) }));
  }

  function reset() {
    setValues(initial);
  }

  return (
    <div className="panel">
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          className="text-xs text-slate-300/50 hover:text-slate-300/80 transition mt-1 shrink-0"
          onClick={reset}
        >
          Reset defaults
        </button>
      </div>

      {description && (
        <p className="text-sm text-slate-300/80 mb-4 leading-relaxed">{description}</p>
      )}

      {/* Sliders */}
      <div className="space-y-5 mb-6">
        {variables.map(v => {
          const val   = values[v.key];
          const pct   = ((val - v.min) / (v.max - v.min)) * 100;
          const display = v.format ? v.format(val) : val.toFixed(
            String(v.step).includes('.') ? String(v.step).split('.')[1].length : 0
          );

          return (
            <div key={v.key}>
              <div className="flex items-center justify-between mb-1.5 text-sm">
                <span className="text-slate-300/90">{v.label}</span>
                <span className="font-mono text-amber-200 tabular-nums">
                  {display} <span className="text-slate-300/50 text-xs">{v.units}</span>
                </span>
              </div>
              <input
                type="range"
                min={v.min}
                max={v.max}
                step={v.step}
                value={val}
                onChange={e => update(v.key, e.target.value)}
                className="w-full accent-ospamber cursor-pointer"
                aria-label={`${v.label}: ${display} ${v.units}`}
              />
              <div className="flex justify-between text-[10px] text-slate-300/40 mt-0.5">
                <span>{v.format ? v.format(v.min) : v.min} {v.units}</span>
                <span>{v.format ? v.format(v.max) : v.max} {v.units}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live result */}
      <div className={`rounded-lg border bg-black/30 p-4 ${statusBorder}`}>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-slate-300/80">{computed.label}</span>
          <span className={`font-mono font-bold text-2xl tabular-nums ${statusColor}`}>
            {typeof computed.result === 'number' ? computed.result.toFixed(
              computed.decimals ?? 2
            ) : computed.result}
            <span className="text-sm font-normal text-slate-300/60 ml-1">{computed.unit}</span>
          </span>
        </div>

        {computed.statusMessage && (
          <p className={`mt-2 text-sm ${statusColor} leading-relaxed`}>
            {computed.statusMessage}
          </p>
        )}

        {/* Reference annotations */}
        {annotations.length > 0 && (
          <div className="mt-3 border-t border-white/10 pt-3 flex flex-wrap gap-3">
            {annotations.map((ann, i) => (
              <span key={i} className="text-xs text-slate-300/70">
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1 align-middle"
                  style={{ background: ann.color ?? '#94a3b8' }}
                />
                {ann.label}: <span className="font-mono text-slate-200">{ann.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
