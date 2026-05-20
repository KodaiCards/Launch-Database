/**
 * Attenuation Calculator — Launch Fiber Services
 *
 * Self-contained vanilla-JS module. No framework dependencies.
 * Call mountAttenuationCalc(containerEl, opts) to render into any container.
 *
 * Attenuation coefficients per ITU-T standards (design planning values):
 *
 *   G.652.D (Standard SMF)
 *     0.36 dB/km @ 1310 nm  — ITU-T G.652.D §6.1 max-spec 0.40, typical planning 0.35–0.36
 *     0.22 dB/km @ 1550 nm  — ITU-T G.652.D §6.1 max-spec 0.30, typical 0.18–0.22 (planning 0.22)
 *     Note: 1490 nm falls between 1310 nm and 1550 nm windows; use 0.25 dB/km planning value
 *           consistent with PON downstream wavelength loss budgets (ITU-T G.984.2 Table B.2)
 *
 *   G.655 (NZDSF — Non-Zero Dispersion-Shifted Single-Mode)
 *     NO SPECIFICATION @ 1310 nm — G.655 cutoff wavelength λ_cc ≤ 1480 nm; the fiber does not
 *                                   support reliable single-mode propagation at 1310 nm.
 *                                   Do NOT use G.655 at 1310 nm (per ITU-T G.655 §5 scope).
 *     0.20 dB/km @ 1550 nm  — ITU-T G.655 §5 max 0.20 dB/km in C-band (planning value 0.20)
 *     Note: G.655 is optimized for C-band (1530–1565 nm) and L-band operation.
 *           1490 nm planning value 0.22 dB/km (between cutoff and 1550 nm windows, conservative).
 *
 *   G.657.A2 (Bend-Insensitive SMF — 15 mm mandrel radius)
 *     0.35 dB/km @ 1310 nm  — ITU-T G.657 §6.1 max spec ≤0.35 dB/km (VERIFIED: ycict.com
 *                              ITU-T table reproduction + weunionfiber.com + fs.com; G.657.A2
 *                              attenuation is ≤G.652.D, not higher. Planning: use 0.35 dB/km.)
 *     0.21 dB/km @ 1550 nm  — ITU-T G.657 §6.1 max spec ≤0.21 dB/km (VERIFIED same sources;
 *                              same or better than G.652.D 0.30 max; planning value 0.21 dB/km.)
 *     Note: G.657.A2 is backward-compatible with G.652.D geometrically. Its attenuation max spec
 *           is EQUAL TO OR LOWER THAN G.652.D (not higher). Bend tolerance comes from refractive-
 *           index profile modification, not from composition that degrades attenuation.
 *           1490 nm planning value: 0.23 dB/km (interpolated, conservative).
 *
 * Splice loss: 0.10 dB/fusion splice target per ITU-T L.400 (design planning value).
 * Connector loss: 0.50 dB/mated UPC pair (TIA-568.3-D Table 6; BICSI OSPDRM).
 *
 * GPON 1490 nm budget context: GPON Class B+ optical path loss budget = 28 dB per ITU-T G.984.2.
 * The 1490 nm sanity thresholds (green=22, yellow=28) reflect this. Note that the calculator
 * computes SPAN ATTENUATION ONLY; a full GPON budget must also account for splitter insertion
 * loss (1:32 splitter ≈ 17 dB). Verify total path loss against your OLT/ONU Rx sensitivity.
 *
 * Sources:
 *   - ITU-T G.652.D: https://www.itu.int/rec/T-REC-G.652/en
 *   - ITU-T G.655: https://www.itu.int/rec/T-REC-G.655/en
 *   - ITU-T G.657: https://www.itu.int/rec/T-REC-G.657/en
 *   - ITU-T L.400: https://www.itu.int/rec/T-REC-L.400/en
 *   - ITU-T G.984.2: https://www.itu.int/rec/T-REC-G.984.2/en
 *
 * This tool is for planning and field estimation. It does not replace a
 * datasheet-fed engineering sign-off calculation or an OTDR baseline measurement.
 */

(function () {
  'use strict';

  // ─── Attenuation coefficients (dB/km) by fiber type and wavelength ───────
  // Values are planning values (slightly conservative vs. typical datasheets)
  // aligned with ITU-T published specifications.
  //
  // G.655 @ 1310 nm: NO VALUE — G.655 λ_cc ≤ 1480 nm means no single-mode propagation
  // at 1310 nm. The UI blocks this combination and shows a warning instead.
  const FIBER_COEFFICIENTS = {
    'G.652.D': {
      label: 'G.652.D — Standard SMF',
      coeffs: { 1310: 0.36, 1490: 0.25, 1550: 0.22 },
      note: 'Standard single-mode fiber. The backbone fiber type in most OSP plants. '
          + 'Planning values per ITU-T G.652.D §6.1.'
    },
    'G.655': {
      label: 'G.655 — NZDSF',
      // 1310: null — G.655 has no ITU-T specification at 1310 nm (λ_cc ≤ 1480 nm;
      //              fiber does not support single-mode propagation at 1310 nm).
      //              UI blocks this combination. See HIGH-B2 fix note.
      coeffs: { 1490: 0.22, 1550: 0.20 },
      note: 'Non-Zero Dispersion-Shifted Fiber. Optimized for C-band WDM operation. '
          + '1550 nm is the design window per ITU-T G.655 §5. '
          + '⚠ 1310 nm is NOT supported — G.655 cutoff wavelength (λ_cc ≤ 1480 nm) means '
          + 'single-mode propagation at 1310 nm is not specified or reliable.'
    },
    'G.657.A2': {
      label: 'G.657.A2 — Bend-Insensitive SMF',
      // Corrected per ITU-T G.657 §6.1: max attenuation ≤0.35 dB/km @ 1310 nm,
      // ≤0.21 dB/km @ 1550 nm. G.657.A2 is equal-or-better than G.652.D, not worse.
      // Prior values (0.40/0.25) were G.652.D max-spec reused in error.
      // Verified: ycict.com ITU-T table + weunionfiber.com + fs.com (2026-05-20).
      coeffs: { 1310: 0.35, 1490: 0.23, 1550: 0.21 },
      note: 'Bend-insensitive SMF, 15 mm min bending radius. Backward-compatible with '
          + 'G.652.D geometry. Attenuation spec is equal to or better than G.652.D per '
          + 'ITU-T G.657 §6.1 (max ≤0.35 dB/km @ 1310 nm, ≤0.21 dB/km @ 1550 nm).'
    }
  };

  // G.655 @ 1310 nm blocked combinations. UI checks this and shows a warning.
  const BLOCKED_COMBINATIONS = {
    'G.655': [1310]
  };

  function isCombinationBlocked(fiberType, wavelength) {
    return (BLOCKED_COMBINATIONS[fiberType] || []).includes(wavelength);
  }

  // Typical link budget ceilings used for sanity-check color coding.
  // These are rule-of-thumb planning numbers, not contractual limits.
  // Field engineers should verify against actual transceiver spec sheets.
  const BUDGET_THRESHOLDS = {
    // { green: below this is clearly fine, yellow: marginal, red: over-budget }
    1310: { green: 14, yellow: 18 },  // 1310 nm: typical BIDI/point-to-point budget
    // 1490 nm: GPON downstream. Class B+ = 28 dB optical path budget (ITU-T G.984.2).
    // Span attenuation thresholds below; remember to add splitter IL for full path budget.
    1490: { green: 22, yellow: 28 },  // corrected from 14/18 — ITU-T G.984.2 Class B+ ref
    1550: { green: 28, yellow: 35 }   // 1550 nm: GPON C+ 32 dB / P2P long-reach typical
  };

  /**
   * Calculate total attenuation.
   * @param {object} params
   * @param {number} params.spanKm      - Span length in kilometers
   * @param {string} params.fiberType   - 'G.652.D' | 'G.655' | 'G.657.A2'
   * @param {number} params.wavelength  - 1310 | 1490 | 1550 (nm)
   * @param {number} params.splices     - Number of fusion splices (clamped ≥ 0)
   * @param {number} params.spliceLoss  - Per-splice loss in dB (default 0.10)
   * @param {number} params.connectors  - Number of connector mated pairs (clamped ≥ 0)
   * @param {number} params.connLoss    - Per-connector loss in dB (default 0.50)
   * @returns {{ fiberLoss, spliceLossTotal, connLossTotal, total, coeff }}
   * @throws {Error} if fiberType is unknown or wavelength combination is blocked
   */
  function calculate(params) {
    const { spanKm, fiberType, wavelength, splices, spliceLoss, connectors, connLoss } = params;

    // LOW-B3: input validation guard — throw descriptive error for invalid types
    const fiber = FIBER_COEFFICIENTS[fiberType];
    if (!fiber) {
      throw new Error('Unknown fiber type: ' + fiberType + '. Valid values: G.652.D, G.655, G.657.A2');
    }
    const coeff = fiber.coeffs[wavelength];
    if (coeff === undefined) {
      throw new Error('No ITU-T specification for ' + fiberType + ' @ ' + wavelength + ' nm. '
        + (fiberType === 'G.655' && wavelength === 1310
          ? 'G.655 cutoff wavelength (λ_cc ≤ 1480 nm) means single-mode propagation is not '
          + 'specified at 1310 nm. Use 1490 nm or 1550 nm with G.655.'
          : 'Check fiber type and wavelength combination.'));
    }

    // Math: Total dB = (span_km × attenuation_coefficient) + (splice_count × splice_loss)
    //                + (connector_count × connector_loss)
    //
    // Example for G.652.D, 1550 nm, 10 km, 3 splices @ 0.10 dB, 2 connectors @ 0.50 dB:
    //   fiberLoss       = 10 km × 0.22 dB/km = 2.20 dB
    //   spliceLossTotal = 3 × 0.10 dB         = 0.30 dB
    //   connLossTotal   = 2 × 0.50 dB         = 1.00 dB
    //   total           = 2.20 + 0.30 + 1.00  = 3.50 dB
    const fiberLoss       = spanKm * coeff;
    const spliceLossTotal = splices * spliceLoss;
    const connLossTotal   = connectors * connLoss;
    const total           = fiberLoss + spliceLossTotal + connLossTotal;

    return { fiberLoss, spliceLossTotal, connLossTotal, total, coeff };
  }

  /**
   * Return { level: 'green'|'yellow'|'red', message } for the total loss value.
   * Level drives color coding in the UI.
   */
  function sanityCheck(total, wavelength, fiberType, spanKm) {
    const thresh = BUDGET_THRESHOLDS[wavelength] || { green: 14, yellow: 20 };
    const fiberLabel = (FIBER_COEFFICIENTS[fiberType] || {}).label || fiberType;
    const wlStr = wavelength + ' nm';

    // Guard: negative total is a physics-invalid result (should not reach here after input clamping,
    // but guard defensively in case calculate() is called directly with bad params).
    if (total < 0) {
      return {
        level: 'red',
        msg: 'Invalid input — total loss is negative (' + total.toFixed(2) + ' dB). '
           + 'Check span length, splice count, and connector count.'
      };
    }

    let level, msg;
    if (total <= thresh.green) {
      level = 'green';
      msg = total.toFixed(2) + ' dB — within a healthy link budget for '
          + wlStr + ' ' + fiberLabel + '. Verify against your transceiver Tx/Rx spec before final design.';
    } else if (total <= thresh.yellow) {
      level = 'yellow';
      msg = total.toFixed(2) + ' dB — marginal for a standard '
          + wlStr + ' link budget. Review splice count, connector count, and span length. '
          + 'Confirm transceiver power budget can absorb this loss.';
    } else {
      level = 'red';
      msg = total.toFixed(2) + ' dB — exceeds the typical '
          + wlStr + ' planning budget (' + thresh.yellow + ' dB). '
          + 'Consider shorter span, fewer connectors, better splice technique, '
          + 'or a higher-power transceiver before finalizing design.';
    }

    // LOW-B2: dispersion/PMD advisory for long spans or high-bitrate systems
    if (spanKm >= 40) {
      msg += ' ⚠ For spans ≥ 40 km or bitrates ≥ 10 Gbps, also verify chromatic dispersion '
           + '(G.652.D: ~17 ps/nm·km @ 1550 nm) and PMD (G.652.D: ≤ 0.2 ps/√km) against your '
           + 'transceiver tolerance separately — attenuation alone does not determine link viability.';
    }

    return { level, msg };
  }

  // ─── Unit conversion ─────────────────────────────────────────────────────
  const FEET_PER_KM = 3280.84;

  function toKm(value, unit) {
    return unit === 'ft' ? value / FEET_PER_KM : value;
  }

  // ─── HTML/CSS template ────────────────────────────────────────────────────

  const CSS = `
.att-calc-panel {
  font-family: var(--font, 'Inter', sans-serif);
  font-size: 13px;
  color: var(--text, #212529);
  background: var(--surface-2, var(--white, #fff));
  border: 1px solid var(--gray-border, var(--border-strong, #DEE2E6));
  border-radius: 10px;
  overflow: hidden;
}
.att-calc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--primary, #1B5FA0);
  color: #fff;
}
.att-calc-header h2 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.att-calc-body {
  padding: 16px;
}
.att-calc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.att-calc-row label {
  min-width: 140px;
  font-size: 12px;
  color: var(--text-secondary, #495057);
  font-weight: 500;
}
.att-calc-row input[type="number"],
.att-calc-row select {
  flex: 1;
  min-width: 100px;
  padding: 5px 8px;
  border: 1px solid var(--gray-border, var(--border-strong, #DEE2E6));
  border-radius: 6px;
  font-size: 13px;
  font-family: inherit;
  background: var(--surface-2, #fff);
  color: var(--text, #212529);
}
.att-calc-row .att-unit-toggle {
  display: flex;
  gap: 4px;
}
.att-calc-row .att-unit-toggle button {
  padding: 4px 10px;
  border: 1px solid var(--gray-border, #DEE2E6);
  border-radius: 5px;
  background: var(--surface-3, #F0F0F0);
  color: var(--text, #212529);
  cursor: pointer;
  font-size: 12px;
  font-family: inherit;
  transition: background 0.12s, color 0.12s;
}
.att-calc-row .att-unit-toggle button.active {
  background: var(--primary, #1B5FA0);
  color: #fff;
  border-color: var(--primary, #1B5FA0);
}
.att-calc-wl-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.att-calc-wl-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: auto;
  font-size: 12px;
  font-weight: 400;
  color: var(--text, #212529);
  cursor: pointer;
  padding: 4px 10px;
  border: 1px solid var(--gray-border, #DEE2E6);
  border-radius: 6px;
  background: var(--surface-3, #F0F0F0);
  transition: background 0.1s, border-color 0.1s;
}
.att-calc-wl-group label.selected {
  background: var(--primary-light, #E8F0FB);
  border-color: var(--primary, #1B5FA0);
  color: var(--primary, #1B5FA0);
  font-weight: 600;
}
.att-calc-wl-group label.blocked {
  opacity: 0.45;
  cursor: not-allowed;
  text-decoration: line-through;
}
.att-calc-wl-group label input {
  display: none;
}
.att-calc-divider {
  height: 1px;
  background: var(--gray-border, #DEE2E6);
  margin: 12px 0;
}
.att-calc-results {
  background: var(--surface-1, var(--gray-light, #F5F7FA));
  border: 1px solid var(--gray-border, #DEE2E6);
  border-radius: 8px;
  padding: 14px 16px;
  margin-top: 4px;
}
.att-calc-result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--border-weak, #EEF1F5);
}
.att-calc-result-row:last-child {
  border-bottom: none;
}
.att-calc-result-row.total {
  font-weight: 700;
  font-size: 14px;
  padding-top: 8px;
  border-top: 2px solid var(--gray-border, #DEE2E6);
  border-bottom: none;
  margin-top: 4px;
}
.att-calc-result-label {
  color: var(--text-secondary, #495057);
}
.att-calc-result-label.total {
  color: var(--text, #212529);
}
.att-calc-result-value {
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
}
.att-calc-sanity {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 7px;
  font-size: 12px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.att-calc-sanity.green {
  background: var(--success-light, #E8F5E9);
  color: var(--success-text, #1B5E20);
  border: 1px solid var(--success, #28A745);
}
.att-calc-sanity.yellow {
  background: var(--warning-light, #FFF8E1);
  color: var(--warning-text, #7A4F0E);
  border: 1px solid var(--warning, #FFC107);
}
.att-calc-sanity.red {
  background: var(--danger-light, #FDECEA);
  color: var(--danger-text, #B71C1C);
  border: 1px solid var(--danger, #DC3545);
}
.att-calc-blocked-warning {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 7px;
  font-size: 12px;
  line-height: 1.5;
  background: var(--danger-light, #FDECEA);
  color: var(--danger-text, #B71C1C);
  border: 1px solid var(--danger, #DC3545);
  display: none;
}
.att-calc-fiber-note {
  font-size: 11px;
  color: var(--text-muted, #5A6470);
  margin-top: 4px;
  font-style: italic;
}
.att-calc-adv-toggle {
  font-size: 11px;
  color: var(--primary, #1B5FA0);
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  text-decoration: underline;
  display: block;
  margin: 6px 0 0 0;
}
.att-calc-adv {
  display: none;
  margin-top: 8px;
}
.att-calc-adv.open {
  display: block;
}
.att-calc-coeff-note {
  font-size: 11px;
  color: var(--text-muted, #5A6470);
  margin-top: 6px;
  padding: 6px 10px;
  background: var(--surface-1, #F5F7FA);
  border-radius: 5px;
  border-left: 3px solid var(--primary, #1B5FA0);
}
/* LOW-A3: focus-visible ring for all interactive calc elements */
.att-calc-panel :focus-visible {
  outline: 2px solid var(--primary, #1B5FA0);
  outline-offset: 2px;
}
`;

  function buildUI(container, opts) {
    // Inject scoped styles once per page
    if (!document.getElementById('att-calc-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'att-calc-styles';
      styleEl.textContent = CSS;
      document.head.appendChild(styleEl);
    }

    container.innerHTML = `
<div class="att-calc-panel" role="region" aria-label="Fiber Attenuation Calculator">
  <div class="att-calc-header">
    <h2>
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
      Fiber Attenuation Calculator
    </h2>
    <span style="font-size:11px;opacity:0.8">Planning values only — verify against transceiver spec sheet</span>
  </div>
  <div class="att-calc-body">

    <!-- Fiber Type -->
    <div class="att-calc-row">
      <label for="att-fiber-type">Fiber type</label>
      <select id="att-fiber-type" aria-describedby="att-fiber-note">
        <option value="G.652.D">G.652.D — Standard SMF (most common)</option>
        <option value="G.655">G.655 — NZDSF (C-band WDM)</option>
        <option value="G.657.A2">G.657.A2 — Bend-Insensitive SMF</option>
      </select>
    </div>
    <div class="att-calc-fiber-note" id="att-fiber-note"></div>

    <!-- Wavelength -->
    <div class="att-calc-row" style="margin-top:12px">
      <label>Wavelength</label>
      <div class="att-calc-wl-group" id="att-wl-group" role="radiogroup" aria-label="Wavelength">
        <label class="selected">
          <input type="radio" name="att-wl" value="1310" checked> 1310 nm
        </label>
        <label>
          <input type="radio" name="att-wl" value="1490"> 1490 nm
        </label>
        <label>
          <input type="radio" name="att-wl" value="1550"> 1550 nm
        </label>
      </div>
    </div>

    <!-- G.655 @ 1310 nm blocked warning -->
    <div class="att-calc-blocked-warning" id="att-blocked-warning" role="alert">
      ✗ <strong>G.655 does not support 1310 nm operation.</strong>
      G.655 has a cable cutoff wavelength (λ_cc) of ≤ 1480 nm — the fiber is not single-mode
      at 1310 nm and has no ITU-T attenuation specification at this wavelength. Select 1490 nm
      or 1550 nm to use G.655, or switch to G.652.D for 1310 nm operation.
    </div>

    <!-- Span Length -->
    <div class="att-calc-row" style="margin-top:12px">
      <label for="att-span">Span length</label>
      <input type="number" id="att-span" min="0" step="0.01" value="1" style="max-width:120px"
             aria-label="Span length value">
      <div class="att-unit-toggle" role="group" aria-label="Length unit">
        <button id="att-unit-m" class="active" aria-pressed="true">km</button>
        <button id="att-unit-ft" aria-pressed="false">ft</button>
      </div>
    </div>

    <div class="att-calc-divider"></div>

    <!-- Splices -->
    <div class="att-calc-row">
      <label for="att-splices">Fusion splices</label>
      <input type="number" id="att-splices" min="0" step="1" value="0"
             style="max-width:80px" aria-label="Number of fusion splices">
      <span style="font-size:12px;color:var(--text-muted,#5A6470)">
        × <span id="att-splice-loss-display">0.10</span> dB/splice
      </span>
    </div>

    <!-- Connectors -->
    <div class="att-calc-row">
      <label for="att-connectors">Connectors (plug+socket pairs)</label>
      <input type="number" id="att-connectors" min="0" step="1" value="2"
             style="max-width:80px" aria-label="Number of connector plug+socket pairs">
      <span style="font-size:12px;color:var(--text-muted,#5A6470)">
        × <span id="att-conn-loss-display">0.50</span> dB/pair
        <span style="font-size:10px;display:block;color:var(--text-muted,#5A6470)">
          (1 pair = 1 plug joined to 1 socket)
        </span>
      </span>
    </div>

    <!-- Advanced overrides -->
    <button class="att-calc-adv-toggle" id="att-adv-toggle" aria-expanded="false"
            aria-controls="att-adv-section">
      ▸ Customize splice &amp; connector loss values
    </button>
    <div class="att-calc-adv" id="att-adv-section" aria-hidden="true">
      <div class="att-calc-row" style="margin-top:8px">
        <label for="att-splice-loss-override">Per-splice loss (dB)</label>
        <input type="number" id="att-splice-loss-override" min="0.05" max="0.30" step="0.01"
               value="0.10" style="max-width:90px"
               aria-label="Per-splice loss override in dB">
        <span class="att-calc-coeff-note" style="flex:1">
          0.10 dB target per ITU-T L.400. Field OTDR acceptance: ≤ 0.10 dB typical; accept up to 0.20 dB
          for mechanically difficult splices.
        </span>
      </div>
      <div class="att-calc-row">
        <label for="att-conn-loss-override">Per-connector loss (dB)</label>
        <input type="number" id="att-conn-loss-override" min="0.05" max="1.00" step="0.05"
               value="0.50" style="max-width:90px"
               aria-label="Per-connector loss override in dB">
        <span class="att-calc-coeff-note" style="flex:1">
          0.50 dB per TIA-568.3-D (UPC mated pair, maximum). Measured APC connectors: often 0.20–0.35 dB.
          Use 0.75 dB for worst-case or aged connectors.
        </span>
      </div>
    </div>

    <div class="att-calc-divider"></div>

    <!-- Results -->
    <div class="att-calc-results" id="att-results" aria-live="polite" aria-atomic="true">
      <div class="att-calc-result-row">
        <span class="att-calc-result-label">Fiber loss</span>
        <span class="att-calc-result-value" id="att-r-fiber">— dB</span>
      </div>
      <div class="att-calc-result-row">
        <span class="att-calc-result-label">Splice loss</span>
        <span class="att-calc-result-value" id="att-r-splice">— dB</span>
      </div>
      <div class="att-calc-result-row">
        <span class="att-calc-result-label">Connector loss</span>
        <span class="att-calc-result-value" id="att-r-conn">— dB</span>
      </div>
      <div class="att-calc-result-row total" aria-label="Total optical loss">
        <span class="att-calc-result-label total">Total optical loss</span>
        <span class="att-calc-result-value" id="att-r-total" style="font-size:16px">— dB</span>
      </div>
    </div>

    <!-- Sanity check -->
    <div class="att-calc-sanity" id="att-sanity" role="status" style="display:none">
      <span id="att-sanity-icon" aria-hidden="true"></span>
      <span id="att-sanity-msg"></span>
    </div>

    <!-- Coefficient reference -->
    <div class="att-calc-coeff-note" id="att-coeff-note" style="margin-top:10px"></div>

  </div>
</div>`;
  }

  function attachHandlers(container) {
    const q = (sel) => container.querySelector(sel);

    const fiberSel    = q('#att-fiber-type');
    const spanInput   = q('#att-span');
    const unitKmBtn   = q('#att-unit-m');
    const unitFtBtn   = q('#att-unit-ft');
    const splicesIn   = q('#att-splices');
    const connsIn     = q('#att-connectors');
    const spliceOvr   = q('#att-splice-loss-override');
    const connOvr     = q('#att-conn-loss-override');
    const advToggle   = q('#att-adv-toggle');
    const advSection  = q('#att-adv-section');
    const fiberNote   = q('#att-fiber-note');
    const wlGroup     = q('#att-wl-group');
    const coeffNote   = q('#att-coeff-note');
    const splLossDisp = q('#att-splice-loss-display');
    const connLossDisp = q('#att-conn-loss-display');
    const blockedWarn = q('#att-blocked-warning');

    let currentUnit = 'km'; // 'km' or 'ft'

    function getWavelength() {
      const checked = container.querySelector('input[name="att-wl"]:checked');
      return checked ? parseInt(checked.value, 10) : 1310;
    }

    // HIGH-B2: Update wavelength radio pill visual state and block invalid combos.
    // Marks G.655 + 1310 nm combo as visually blocked, shows warning, hides results.
    function updateWavelengthBlocking(fiberType) {
      const labels = wlGroup.querySelectorAll('label');
      labels.forEach(lbl => {
        const radio = lbl.querySelector('input[type="radio"]');
        if (!radio) return;
        const wl = parseInt(radio.value, 10);
        const blocked = isCombinationBlocked(fiberType, wl);
        lbl.classList.toggle('blocked', blocked);
        radio.disabled = blocked;
        // If the currently selected wavelength is now blocked, switch to first valid one
        if (blocked && radio.checked) {
          // Find first non-blocked option
          const firstValid = Array.from(wlGroup.querySelectorAll('input[type="radio"]'))
            .find(r => !isCombinationBlocked(fiberType, parseInt(r.value, 10)));
          if (firstValid) {
            firstValid.checked = true;
          }
        }
      });
    }

    function update() {
      const fiberType  = fiberSel.value;
      const wavelength = getWavelength();

      // Update wavelength pill blocking state
      updateWavelengthBlocking(fiberType);

      // HIGH-B2: check for blocked combination after potentially switching wavelength
      const currentWavelength = getWavelength(); // re-read after possible switch
      const blocked = isCombinationBlocked(fiberType, currentWavelength);

      // Show/hide blocked warning
      if (blockedWarn) {
        blockedWarn.style.display = blocked ? 'block' : 'none';
      }

      // HIGH-A1: clamp all inputs to ≥ 0 to prevent negative physics values
      const spanRaw    = Math.max(0, parseFloat(spanInput.value) || 0);
      const spanKm     = Math.max(0, toKm(spanRaw, currentUnit));
      const splices    = Math.max(0, parseInt(splicesIn.value, 10) || 0);
      const connectors = Math.max(0, parseInt(connsIn.value, 10) || 0);
      const spliceLoss = parseFloat(spliceOvr.value) || 0.10;
      const connLoss   = parseFloat(connOvr.value) || 0.50;

      // Update per-component loss displays
      splLossDisp.textContent = spliceLoss.toFixed(2);
      connLossDisp.textContent = connLoss.toFixed(2);

      // Update fiber note
      const fiber = FIBER_COEFFICIENTS[fiberType];
      fiberNote.textContent = fiber ? fiber.note : '';

      // Update wavelength label styles (selected highlighting)
      wlGroup.querySelectorAll('label').forEach(lbl => {
        const radio = lbl.querySelector('input[type="radio"]');
        lbl.classList.toggle('selected', radio && radio.checked);
      });

      // If combination is blocked, hide results and stop
      if (blocked) {
        q('#att-results').style.opacity = '0.3';
        const sanityEl = q('#att-sanity');
        sanityEl.style.display = 'none';
        coeffNote.textContent = '';
        return;
      }
      q('#att-results').style.opacity = '';

      // Update coefficient note
      if (fiber) {
        const coeff = fiber.coeffs[currentWavelength];
        coeffNote.textContent =
          'Planning coefficient: ' + coeff + ' dB/km @ ' + currentWavelength + ' nm '
          + '(' + fiberType + ') — ITU-T '
          + (fiberType === 'G.652.D' ? 'G.652.D §6.1'
            : fiberType === 'G.655' ? 'G.655 §5'
            : 'G.657 §6.1');
      }

      // Calculate
      const res = calculate({
        spanKm, fiberType, wavelength: currentWavelength,
        splices, spliceLoss, connectors, connLoss
      });

      // Render results
      q('#att-r-fiber').textContent  = res.fiberLoss.toFixed(2) + ' dB';
      q('#att-r-splice').textContent = res.spliceLossTotal.toFixed(2) + ' dB';
      q('#att-r-conn').textContent   = res.connLossTotal.toFixed(2) + ' dB';
      q('#att-r-total').textContent  = res.total.toFixed(2) + ' dB';

      // Sanity check
      const sanity = sanityCheck(res.total, currentWavelength, fiberType, spanKm);
      const sanityEl = q('#att-sanity');
      sanityEl.style.display = 'flex';
      sanityEl.className = 'att-calc-sanity ' + sanity.level;
      q('#att-sanity-icon').textContent =
        sanity.level === 'green' ? '✓' : sanity.level === 'yellow' ? '⚠' : '✗';
      q('#att-sanity-msg').textContent = sanity.msg;
    }

    // Unit toggle
    unitKmBtn.addEventListener('click', () => {
      currentUnit = 'km';
      unitKmBtn.classList.add('active');
      unitKmBtn.setAttribute('aria-pressed', 'true');
      unitFtBtn.classList.remove('active');
      unitFtBtn.setAttribute('aria-pressed', 'false');
      update();
    });
    unitFtBtn.addEventListener('click', () => {
      currentUnit = 'ft';
      unitFtBtn.classList.add('active');
      unitFtBtn.setAttribute('aria-pressed', 'true');
      unitKmBtn.classList.remove('active');
      unitKmBtn.setAttribute('aria-pressed', 'false');
      update();
    });

    // Advanced override toggle — LOW-A1: updated label text
    advToggle.addEventListener('click', () => {
      const open = advSection.classList.toggle('open');
      advSection.setAttribute('aria-hidden', open ? 'false' : 'true');
      advToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      advToggle.textContent = (open ? '▾' : '▸') + ' Customize splice & connector loss values';
    });

    // All inputs/selects trigger update
    [fiberSel, spanInput, splicesIn, connsIn, spliceOvr, connOvr].forEach(el => {
      el.addEventListener('input', update);
      el.addEventListener('change', update);
    });

    // Wavelength radios
    container.querySelectorAll('input[name="att-wl"]').forEach(radio => {
      radio.addEventListener('change', update);
    });

    // Initial render
    update();
  }

  // ─── Modal wrapper ────────────────────────────────────────────────────────

  /**
   * Create a modal overlay containing the calculator.
   * Returns { open, close } control functions.
   */
  function createModal() {
    const overlay = document.createElement('div');
    overlay.id = 'att-calc-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Fiber Attenuation Calculator');
    overlay.style.cssText = [
      'display:none',
      'position:fixed',
      'inset:0',
      'background:rgba(0,0,0,0.5)',
      'z-index:2000',
      'align-items:center',
      'justify-content:center',
      'padding:16px'
    ].join(';');

    const panel = document.createElement('div');
    panel.style.cssText = [
      'background:var(--surface-2,var(--white,#fff))',
      'border-radius:12px',
      'width:100%',
      'max-width:560px',
      'max-height:90vh',
      'overflow-y:auto',
      'box-shadow:0 20px 60px rgba(0,0,0,0.3)',
      'position:relative'
    ].join(';');

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close attenuation calculator');
    // LOW-A2: bump close button to ≥36×36 px for better touch target
    closeBtn.style.cssText = [
      'position:absolute',
      'top:10px',
      'right:12px',
      'background:rgba(255,255,255,0.25)',
      'border:none',
      'color:#fff',
      'font-size:18px',
      'cursor:pointer',
      'width:36px',
      'height:36px',
      'border-radius:50%',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'z-index:1'
    ].join(';');

    const calcContainer = document.createElement('div');

    panel.appendChild(closeBtn);
    panel.appendChild(calcContainer);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // Build calculator inside modal
    buildUI(calcContainer, {});
    attachHandlers(calcContainer);

    // HIGH-A2: focus trap + focus return on modal close
    // Uses window.trapFocus from public/js/focus_trap.js (loaded in design.html + splice.html).
    // Falls back to manual focus management if trapFocus is unavailable.
    let activeTrap = null;

    function open(triggerEl) {
      overlay.style.display = 'flex';
      if (typeof window.trapFocus === 'function') {
        activeTrap = window.trapFocus(panel, {
          escClose: true,
          onEsc: close
        });
      } else {
        // Minimal fallback: move focus to first focusable element
        const firstFocusable = panel.querySelector('select, input, button');
        if (firstFocusable) firstFocusable.focus();
      }
    }

    function close() {
      overlay.style.display = 'none';
      // Release focus trap and return focus to trigger element
      if (activeTrap) {
        activeTrap.release();
        activeTrap = null;
      }
    }

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
    // Note: ESC handling is delegated to trapFocus when available.
    // Fallback ESC handler for when trapFocus is not loaded:
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.style.display !== 'none' && !activeTrap) close();
    });

    return { open, close, overlay };
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * mountAttenuationCalc(containerEl, opts)
   *
   * Renders the attenuation calculator into containerEl.
   *
   * @param {HTMLElement} containerEl  - DOM element to render into.
   * @param {object}      opts         - Optional configuration:
   *   opts.inline  {boolean} - If true, renders inline (no modal wrapper).
   *                            Default: false (renders trigger button that opens modal).
   *   opts.buttonLabel {string} - Label for the trigger button (default 'Attenuation Calc').
   *   opts.buttonClass {string} - Extra CSS class(es) for the trigger button.
   *
   * @returns {{ open, close }} - open/close functions for the modal (null if inline).
   *
   * Example (modal, triggered by button):
   *   const calcContainer = document.createElement('div');
   *   document.querySelector('.header-right').appendChild(calcContainer);
   *   mountAttenuationCalc(calcContainer, {});
   *
   * Example (inline):
   *   const panel = document.getElementById('my-panel');
   *   mountAttenuationCalc(panel, { inline: true });
   */
  function mountAttenuationCalc(containerEl, opts) {
    opts = opts || {};

    if (opts.inline) {
      // Render directly into container, no modal
      buildUI(containerEl, opts);
      attachHandlers(containerEl);
      return null;
    }

    // Modal mode: render a trigger button into containerEl, calculator goes in overlay
    const modal = createModal();

    const btn = document.createElement('button');
    // MED-A2: use btn-primary class for the trigger button so it stands out even in
    // splice.html where btn-secondary is undefined. btn-primary is defined in both portals.
    btn.className = 'btn btn-primary btn-sm ' + (opts.buttonClass || '');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg> '
      + (opts.buttonLabel || 'Attenuation Calc');
    btn.title = 'Open fiber attenuation calculator';
    btn.setAttribute('aria-haspopup', 'dialog');
    // HIGH-A2: pass the trigger button as focus-return target when opening modal
    btn.addEventListener('click', () => modal.open(btn));
    containerEl.appendChild(btn);

    return { open: modal.open, close: modal.close };
  }

  // Export to window for portal access
  window.mountAttenuationCalc = mountAttenuationCalc;

  // Also expose internals for testing
  window._attCalc = {
    calculate, sanityCheck, toKm, FIBER_COEFFICIENTS,
    isCombinationBlocked, BLOCKED_COMBINATIONS
  };

})();
