import React, { useMemo, useState } from 'react';

/**
 * WorkedExample — generalized step-by-step formula calculator.
 *
 * Renders labeled numeric inputs for each variable, computes the result
 * via the caller-supplied formula function, then displays each algebra step
 * and a plain-English sanity-check sentence. Designed as a teaching tool,
 * not an engineering sign-off calculator.
 *
 * @param {string}   title          - Calculator title shown in the header.
 * @param {string}   [description]  - Short plain-English explanation of what
 *                                    this formula calculates and why it matters.
 * @param {Array}    variables      - Array of variable descriptor objects:
 *   {
 *     key:      string,   // JavaScript identifier used in the formula
 *     label:    string,   // Human-readable label shown in the UI
 *     units:    string,   // Units string appended to the input
 *     default:  number,   // Starting value
 *     min?:     number,   // Input min attribute
 *     max?:     number,   // Input max attribute
 *     step?:    number,   // Input step attribute (default 0.01)
 *   }
 * @param {Function} formula        - (values: {key: number, ...}) => number
 *                                    Computes the final result from the variable map.
 * @param {Function} steps          - (values: {key: number, ...}, result: number) => Array
 *                                    Returns array of step objects:
 *                                    [{ expression: string, value?: number, unit?: string }]
 *                                    Each step is one line in the derivation display.
 * @param {Function} sanityCheck    - (result: number, values: object) => string
 *                                    Returns a plain-English sentence confirming
 *                                    what the numeric result means in real terms.
 * @param {string}   [resultLabel]  - Label for the final result row (default 'Result').
 * @param {string}   [resultUnit]   - Units for the final result.
 * @param {number}   [resultDecimals] - Decimal places for result display (default 2).
 */
export default function WorkedExample(props) {
  // ── Defensive prop normalization ─────────────────────────────────────────
  // Accept BOTH flat props (new API) AND a single wrapped `example` prop (old API):
  //   New: <WorkedExample title="..." variables={[...]} formula={fn} ... />
  //   Old: <WorkedExample example={{ title, variables, formula, ... }} />
  const data = props.example ?? props;
  const {
    title,
    description,
    formula,
    steps,
    sanityCheck,
    resultLabel  = 'Result',
    resultUnit   = '',
    resultDecimals = 2,
  } = data;

  // Normalize variables array: accept both new ({key, label, default, units})
  // and old ({symbol, name, value, unit}) key names.
  const rawVariables = data.variables ?? [];
  const variables = rawVariables.map(vr => ({
    key:   vr.key   ?? vr.symbol ?? vr.name   ?? String(vr),
    label: vr.label ?? vr.name   ?? vr.key    ?? '',
    default: Number(vr.default ?? vr.value ?? 0),
    units: vr.units ?? vr.unit ?? '',
    min:   vr.min,
    max:   vr.max,
    step:  vr.step,
  }));

  // Graceful fallback if variables or formula are still missing
  if (!variables.length || typeof formula !== 'function') {
    return (
      <div className="panel">
        <h3 className="text-lg font-semibold mb-1">{title ?? 'Worked Example'}</h3>
        <p className="text-sm text-slate-300/60">(Worked example data not available for this lesson.)</p>
      </div>
    );
  }

  const initialValues = Object.fromEntries(variables.map(v => [v.key, v.default]));
  const [values, setValues] = useState(initialValues);
  const [showSteps, setShowSteps] = useState(false);

  const result = useMemo(() => {
    try { return formula(values); }
    catch { return null; }
  }, [values, formula]);

  const derivationSteps = useMemo(() => {
    if (result === null) return [];
    try { return steps(values, result); }
    catch { return []; }
  }, [values, result, steps]);

  const sanity = useMemo(() => {
    if (result === null) return '';
    try { return sanityCheck(result, values); }
    catch { return ''; }
  }, [result, values, sanityCheck]);

  function update(key, raw) {
    const num = Number(raw);
    if (Number.isFinite(num)) setValues(prev => ({ ...prev, [key]: num }));
  }

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-300/80 mb-4 leading-relaxed">{description}</p>
      )}

      {/* Variable inputs */}
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm mb-4">
        {variables.map(v => (
          <label
            key={v.key}
            className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5"
          >
            <span className="text-slate-300/90">
              {v.label}
              {v.units && (
                <span className="text-slate-300/50 ml-1">({v.units})</span>
              )}
            </span>
            <input
              type="number"
              step={v.step ?? 0.01}
              min={v.min}
              max={v.max}
              value={values[v.key]}
              onChange={e => update(v.key, e.target.value)}
              className="w-28 bg-black/40 border border-white/15 rounded px-2 py-1 font-mono text-right text-sm"
            />
          </label>
        ))}
      </div>

      {/* Result row */}
      {result !== null && (
        <div className="rounded-lg bg-black/30 border border-white/10 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-300/80 font-medium">{resultLabel}</span>
          <span className="font-mono font-bold text-amber-300 text-lg">
            {result.toFixed(resultDecimals)}
            {resultUnit && <span className="text-sm font-normal ml-1 text-slate-300/70">{resultUnit}</span>}
          </span>
        </div>
      )}

      {/* Sanity check */}
      {sanity && (
        <p className="mt-3 text-sm text-slate-300/80 leading-relaxed border-l-2 border-ospamber/50 pl-3">
          {sanity}
        </p>
      )}

      {/* Step-by-step toggle */}
      {derivationSteps.length > 0 && (
        <div className="mt-4">
          <button
            className="btn-ghost text-sm"
            onClick={() => setShowSteps(s => !s)}
          >
            {showSteps ? 'Hide steps ▲' : 'Show step-by-step derivation ▼'}
          </button>

          {showSteps && (
            <div className="mt-3 rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm text-slate-200 space-y-1.5">
              {(derivationSteps ?? []).map((step, i) => (
                <div key={i} className="flex items-baseline gap-3">
                  <span className="text-slate-300/40 text-xs select-none w-5 text-right shrink-0">
                    {i + 1}.
                  </span>
                  <span className="text-slate-200 flex-1">{step.expression}</span>
                  {step.value !== undefined && (
                    <span className="text-amber-200 tabular-nums">
                      = {step.value.toFixed(resultDecimals)}
                      {step.unit ? ` ${step.unit}` : (resultUnit ? ` ${resultUnit}` : '')}
                    </span>
                  )}
                </div>
              ))}
              <div className="border-t border-white/10 pt-2 mt-2 flex items-baseline gap-3">
                <span className="text-slate-300/40 text-xs select-none w-5 text-right shrink-0">→</span>
                <span className="text-slate-200 font-semibold">{resultLabel}</span>
                <span className="text-amber-300 font-bold tabular-nums">
                  = {result.toFixed(resultDecimals)} {resultUnit}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
