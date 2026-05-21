import React, { useMemo, useState } from 'react';

/**
 * Interactive optical link budget calculator.
 *
 * Defaults follow the platform's editorial decision:
 *   - 0.30 dB/connector (FOA field rule of thumb).
 *   - 0.10 dB/fusion splice (textbook planning value).
 *   - 0.25 dB/km @ 1550 nm planning value for G.652.D SMF.
 *   - 3 dB safety / aging margin.
 *
 * The calculator is for teaching, not for engineering sign-off. It does not
 * replace a real datasheet-fed budget tool.
 */

const KM_PER_MILE = 1.609344;

export default function LinkBudgetCalculator() {
  const [tx, setTx] = useState(3);          // dBm
  const [rx, setRx] = useState(-24);        // dBm receiver sensitivity
  const [km, setKm] = useState(17.7);       // fiber length in km (≈ 11 mi)
  const [lengthUnit, setLengthUnit] = useState('mi'); // 'km' or 'mi'
  const [dbPerKm, setDbPerKm] = useState(0.25);
  const [splices, setSplices] = useState(6);
  const [splLoss, setSplLoss] = useState(0.10);
  const [conns, setConns] = useState(4);
  const [connLoss, setConnLoss] = useState(0.30);  // FOA field default
  const [margin, setMargin] = useState(3);

  const result = useMemo(() => {
    const fiberLoss = km * dbPerKm;
    const splLossTotal  = splices * splLoss;
    const connLossTotal = conns * connLoss;
    const total = fiberLoss + splLossTotal + connLossTotal + margin;
    const budget = tx - rx;
    const headroom = budget - total;
    return { fiberLoss, splLossTotal, connLossTotal, total, budget, headroom };
  }, [tx, rx, km, dbPerKm, splices, splLoss, conns, connLoss, margin]);

  const ok = result.headroom >= 0;

  return (
    <div className="panel">
      <h3 className="text-lg font-semibold mb-1">Link Budget Calculator</h3>
      <p className="text-xs text-slate-300/70 mb-4">
        Defaults follow FOA field practice (0.30 dB/connector, 0.10 dB/splice).
        Adjust to your project's actual values — these are <em>planning</em>{' '}
        numbers, not contract acceptance numbers.
      </p>

      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <Field label="Tx power (dBm)"            value={tx}        onChange={setTx} />
        <Field label="Rx sensitivity (dBm)"      value={rx}        onChange={setRx} />
        <LengthField
          label="Fiber length"
          kmValue={km}
          unit={lengthUnit}
          onKmChange={setKm}
          onUnitChange={setLengthUnit}
        />
        <Field label="dB / km"                   value={dbPerKm}   onChange={setDbPerKm}   step={0.01} />
        <Field label="# fusion splices"          value={splices}   onChange={setSplices}   min={0} step={1}/>
        <Field label="dB / splice"               value={splLoss}   onChange={setSplLoss}   step={0.01} />
        <Field label="# connectors (mated pairs)" value={conns}     onChange={setConns}     min={0} step={1}/>
        <Field label="dB / connector pair"       value={connLoss}  onChange={setConnLoss}  step={0.01} />
        <Field label="Safety / aging margin (dB)" value={margin}    onChange={setMargin}    step={0.5}/>
      </div>

      <div className="mt-5 rounded-lg bg-black/30 border border-white/10 p-4 font-mono text-sm leading-7 text-slate-200">
        <Row label="Fiber loss"               value={result.fiberLoss} unit="dB"/>
        <Row label="Splices"                  value={result.splLossTotal} unit="dB"/>
        <Row label="Connectors"               value={result.connLossTotal} unit="dB"/>
        <Row label="Margin"                   value={margin} unit="dB"/>
        <Row label="Total expected loss"      value={result.total} unit="dB" bold/>
        <Row label="Available budget (Tx-Rx)" value={result.budget} unit="dB"/>
        <Row label="Headroom" value={result.headroom} unit="dB" bold
             color={ok ? 'text-ospgreen' : 'text-rose-400'} />
      </div>

      <p className={`mt-3 text-sm ${ok ? 'text-ospgreen' : 'text-rose-300'}`}>
        {ok
          ? '✓ Link closes with headroom to spare. Sanity-check by comparing against an OTDR baseline once installed.'
          : '✗ Link does not close. Reduce loss (shorter fiber, fewer connectors, lower per-component loss) or improve optics (higher Tx or more sensitive Rx).'}
      </p>
    </div>
  );
}

function Field({ label, value, onChange, step = 0.1, min }) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
      <span className="text-slate-300/90">{label}</span>
      <input
        type="number"
        step={step}
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 bg-black/40 border border-white/15 rounded px-2 py-1 font-mono text-right"
      />
    </label>
  );
}

function Row({ label, value, unit, bold, color }) {
  return (
    <div className={`flex justify-between ${bold ? 'font-semibold' : ''} ${color || ''}`}>
      <span>{label}</span>
      <span>{value.toFixed(2)} {unit}</span>
    </div>
  );
}

function LengthField({ label, kmValue, unit, onKmChange, onUnitChange }) {
  // Convert km to display value based on current unit
  const displayValue = unit === 'mi' ? (kmValue / KM_PER_MILE).toFixed(2) : kmValue.toFixed(2);

  // Handle input changes: convert back to km before storing
  const handleInputChange = (e) => {
    const inputValue = Number(e.target.value);
    if (unit === 'mi') {
      onKmChange(inputValue * KM_PER_MILE);
    } else {
      onKmChange(inputValue);
    }
  };

  const handleUnitChange = (e) => {
    onUnitChange(e.target.value);
  };

  return (
    <label className="flex items-center justify-between gap-3 py-1.5 border-b border-white/5">
      <span className="text-slate-300/90">
        {label} <span className="text-slate-500 text-xs">({unit})</span>
      </span>
      <div className="flex items-center gap-2">
        <input
          type="number"
          step={0.1}
          min={0}
          value={displayValue}
          onChange={handleInputChange}
          className="w-16 bg-black/40 border border-white/15 rounded px-2 py-1 font-mono text-right"
        />
        <select
          value={unit}
          onChange={handleUnitChange}
          className="bg-black/40 border border-white/15 rounded px-2 py-1 text-sm font-mono text-slate-200 cursor-pointer"
          aria-label="Distance unit selector"
        >
          <option value="km">km</option>
          <option value="mi">mi</option>
        </select>
      </div>
    </label>
  );
}
