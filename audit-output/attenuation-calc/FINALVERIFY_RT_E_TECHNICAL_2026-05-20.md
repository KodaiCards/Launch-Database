# RT-E — Final Verification: Technical/Math + Cascade Hunt
**Date:** 2026-05-20
**HEAD reviewed:** `ff7667e` (Polish-A commit on main)
**Framing:** Senior OSP engineer + ITU-T standards reviewer. Independent numeric re-derivation. Does NOT trust Polish-A agent's "verified" claims — re-derives each item from source code + primary sources.
**Write-path constraints acknowledged:** only `audit-output/attenuation-calc/FINALVERIFY_RT_E_TECHNICAL_2026-05-20.md` written.

---

## Executive Summary

All 5 Polish-A fixes verified correct. No new cascade bugs introduced by Polish-A. One under-audited pre-existing LOW found in the connector loss claim wording. Overall verdict: **GREEN** with one LOW informational note.

---

## Polish-A 5-Item Verification

### NEW-1 (HIGH) — Test 5 span updated 150km → 160km for RED under new thresholds

**Verified by reading `tests/browser/attenuation_calc.spec.js:169-194`:**

Test title now reads: `'5. Red sanity check fires when total exceeds 35 dB (1550 nm yellow threshold)'`

Fill value: `await page.fill('#att-span', '160');`

Comment: `// 160 km × 0.22 dB/km = 35.20 dB — exceeds the 35 dB yellow threshold → RED`

**Independent re-derivation:**
```
G.652.D, 1550nm, 160km, 0 splices, 0 connectors:
  fiberLoss = 160 km × 0.22 dB/km = 35.20 dB
  Thresholds: green=28, yellow=35
  Sanity logic: total > thresh.yellow (35.20 > 35) → else branch → RED ✓
```

Boundary check: exactly 35.0 dB → `35.0 <= 35` → YELLOW (not RED). The 160km span produces 35.20 dB which strictly exceeds 35, landing correctly in RED.

Old 150km case: `150 × 0.22 = 33.0 dB`. Under new thresholds: `33.0 > 28 and 33.0 <= 35` → YELLOW. RT-C correctly identified this cascade; Polish-A correctly fixed it.

Test 3 stale comment (previously flagged by RT-C as LOW): line 133 now reads `// Sanity check should be green (3.50 dB < 28 dB green threshold for 1550 nm)` — updated from old `22 dB` reference. ✓

**Verdict: VERIFIED ✓**

---

### NEW-2 (MED) — Test 12 asserts disabled radio, not blocked-warning visibility

**Verified by reading `tests/browser/attenuation_calc.spec.js:352-374`:**

```js
// NEW-2 fix: when G.655 is selected with 1310nm active, the UI auto-switches to 1490nm.
// After the auto-switch, blocked = G.655+1490nm = false, so the warning hides.
// The stable observable state is: the 1310nm radio is disabled (aria-disabled + input.disabled).
const radio1310 = page.locator('input[name="att-wl"][value="1310"]');
await expect(radio1310).toBeDisabled({ timeout: 3_000 });
```

**Logic trace through `attachHandlers()` in `attenuation_calc.js:649-668`:**

`updateWavelengthBlocking('G.655')` runs. The 1310 radio gets `radio.disabled = true` because `isCombinationBlocked('G.655', 1310)` returns true. The auto-switch fires: since 1310 was checked and is now blocked, first non-blocked radio (1490nm) is selected. After switch, `getWavelength()` returns 1490. `isCombinationBlocked('G.655', 1490)` = false → `blockedWarn.style.display = 'none'`. The blocked-warning div is hidden.

Old Test 12 asserted `#att-blocked-warning` visible — that assertion would transiently pass then hide, making it flaky. The new assertion (`radio1310.toBeDisabled()`) is stable: once G.655 is selected, the 1310 radio stays `disabled` regardless of the auto-switch.

**Verdict: VERIFIED ✓** — stable assertion correctly targets the persistent UI state.

---

### NEW-3 (LOW) — Dispersion advisory is fiber-type-aware

**Verified by reading `attenuation_calc.js:207-224`:**

```js
if (fiberType === 'G.655') {
  dispNote = '(G.655/NZDSF: ~3–4 ps/nm·km @ 1550 nm — low CD, optimized for C-band WDM; '
           + 'PMD ≤ 0.20 ps/√km per G.655 §5)';
} else {
  dispNote = '(G.652.D/G.657.A2: ~17 ps/nm·km @ 1550 nm; PMD ≤ 0.20 ps/√km per G.652.D §6.2)';
}
```

**Primary-source verification (independent):**

G.655 chromatic dispersion: ITU-T G.655 specifies non-zero but low CD in the C-band. Multiple sources confirm range is typically 2–6 ps/nm·km, with one source citing 4.5 ps/nm·km as typical. The code's `~3–4 ps/nm·km` is within the specified band, slightly conservative (excludes sub-3 values). Not wrong — a valid planning narrower range. Citing §5 is correct (G.655 §5 covers attenuation and dispersion specs).

G.652.D chromatic dispersion: multiple independent sources confirm `~17 ps/nm·km @ 1550nm` as the canonical G.652.D value (max ≤20 ps/nm·km per ITU-T). ✓

Before this fix, G.655 users at spans ≥40km would have seen the G.652.D figures (`~17 ps/nm·km`) — incorrect for NZDSF. Now each fiber type gets its own accurate dispersion note.

**Verdict: VERIFIED ✓** — G.655 note is in-spec, G.652.D note is confirmed correct.

---

### NEW-4 (LOW) — fallbackTrigger.focus() restored on close in non-trapFocus path

**Verified by reading `attenuation_calc.js:864-893`:**

```js
let fallbackTrigger = null; // NEW-4: stores trigger element for fallback focus-return

function open(triggerEl) {
  overlay.style.display = 'flex';
  if (typeof window.trapFocus === 'function') {
    activeTrap = window.trapFocus(panel, { escClose: true, onEsc: close });
  } else {
    // NEW-4: capture activeElement BEFORE shifting focus so close() can restore it
    fallbackTrigger = triggerEl || document.activeElement;
    const firstFocusable = panel.querySelector('select, input, button');
    if (firstFocusable) firstFocusable.focus();
  }
}

function close() {
  overlay.style.display = 'none';
  if (activeTrap) {
    activeTrap.release();
    activeTrap = null;
  } else if (fallbackTrigger) {
    // NEW-4: restore focus to trigger element in fallback path
    try { fallbackTrigger.focus(); } catch (_) {}
    fallbackTrigger = null;
  }
}
```

**Logic check:** `fallbackTrigger` is captured BEFORE `firstFocusable.focus()` shifts focus away. This is the correct order — you must save the trigger before focus moves. The `try/catch` handles edge cases where `fallbackTrigger` might be a detached or non-focusable element (e.g., body). `fallbackTrigger = null` after restore prevents double-restore on repeated close calls.

Pre-fix: fallback path moved focus into the modal but had no return mechanism. Post-fix: mirrors the `trapFocus.release()` path behaviour. ESC + close button both call `close()` → both paths restore focus.

**Verdict: VERIFIED ✓**

---

### NEW-LOW (RT-C) — 1490nm splitter IL inline note appended to sanity message

**Verified by reading `attenuation_calc.js:197-204`:**

```js
if (wavelength === 1490) {
  msg += ' Note: this is span attenuation only. For GPON, add splitter insertion loss '
       + '(1:32 splitter ≈ 17 dB, 1:8 ≈ 11 dB) to get total path loss — verify against '
       + 'OLT/ONU Rx sensitivity (Class B+ total budget = 28 dB per ITU-T G.984.2).';
}
```

Note appends to ALL 1490nm results (green, yellow, red alike). This is correct — even a "green" span attenuation reading is potentially budget-exceeding once splitter IL is added.

The values cited: 1:32 splitter ≈ 17 dB and 1:8 ≈ 11 dB are standard GPON planning values. Class B+ = 28 dB per ITU-T G.984.2 is verified by RT-C's primary-source check and confirmed by multiple industry sources.

This note fires for any 1490nm result, verified by logic trace: `if (wavelength === 1490)` is evaluated inside `sanityCheck()` after `level` and `msg` are set, so every call to `sanityCheck(..., 1490, ...)` appends the note regardless of GREEN/YELLOW/RED.

**Verdict: VERIFIED ✓**

---

## Under-Audited Spot-Check — Independent Verification of Least-Touched Claims

### UA-1: G.652.D 0.36 dB/km @ 1310nm

**Source (`attenuation_calc.js:10-11`, header comment):**
```
G.652.D (Standard SMF)
  0.36 dB/km @ 1310 nm  — ITU-T G.652.D §6.1 max-spec 0.40, typical planning 0.35–0.36
```

**Primary-source verification (independent):**
- ny.dot.gov fiber spec: "Maximum attenuation at 1310 nm: 0.36 dB/km" for cabled G.652.D ✓
- splice.me blog cites ITU-T G.652: 0.4 dB/km max, "current standard is 0.36 dB/km" for planning
- Prysmian G.652.D datasheet: corroborates the 0.36 dB/km cabled planning value
- Web consensus: max-spec 0.40 dB/km (ITU-T G.652.D §6.1 Table) / typical cabled 0.35–0.36 dB/km

The code distinguishes max-spec (0.40) from planning value (0.36). This is correct OSP practice — engineers use 0.36 for link budget planning, reserving 0.04 dB/km of headroom vs the ITU-T maximum.

**Re-derivation with planning value:**
```
G.652.D, 1310nm, 25km, 8 splices @0.10, 4 connectors @0.50:
  fiberLoss       = 25 × 0.36 = 9.00 dB
  spliceLossTotal = 8 × 0.10  = 0.80 dB
  connLossTotal   = 4 × 0.50  = 2.00 dB
  TOTAL           = 11.80 dB
  Sanity @ 1310nm (green=14, yellow=18): 11.80 ≤ 14 → GREEN ✓
```

**Verdict: VERIFIED ✓** — 0.36 dB/km is the correct conservative planning value; max-spec distinction correctly noted.

---

### UA-2: 1310nm sanity thresholds (green=14, yellow=18)

**Source (`attenuation_calc.js:107`):**
```js
1310: { green: 14, yellow: 18 },  // 1310 nm: typical BIDI/point-to-point budget
```

These thresholds have not been modified by Fix Wave A or Polish-A (RT-C confirmed in negative findings: "1310nm GPON threshold unchanged: 14/18 ✓"). This is intentional — no prior audit round has contested these values.

**Assessment:** 14 dB green / 18 dB yellow for 1310nm point-to-point is a reasonable conservative planning threshold for standard BIDI transceivers (typical 100BASE-BX and 1000BASE-BX budgets are 10–14 dB; 1310nm P2P CWDM typically 20–26 dB). The comment says "BIDI/point-to-point" — this is somewhat imprecise (BIDI budgets are lower; long-haul P2P at 1310nm can be up to 28 dB). However the tool is intended as a planning estimate, and the advanced override allows custom thresholds.

**Finding: LOW** — 1310nm thresholds are conservative for some use cases (e.g., G.657.A2 at 1310nm for 10GbE P2P could have a larger budget than 18 dB). Informational only; no field-safety or design-error risk.

---

### UA-3: Connector loss default 0.50 dB UPC — TIA-568.3-D claim accuracy

**Source (`attenuation_calc.js:35` and `:579`):**
```
Line 35: Connector loss: 0.50 dB/mated UPC pair (TIA-568.3-D Table 6; BICSI OSPDRM).
Line 579: 0.50 dB per TIA-568.3-D (UPC mated pair, maximum). Measured APC connectors: often 0.20–0.35 dB.
          Use 0.75 dB for worst-case or aged connectors.
```

**Primary-source verification (independent — Fluke Networks citing TIA-568.3-D directly):**

TIA-568.3-D defines a three-tier loss structure for singlemode connectors:
- Reference-grade ↔ reference-grade mated pair: ≤ 0.20 dB
- Reference-grade ↔ standard-grade mated pair: ≤ 0.50 dB
- Standard-grade worst-case (field acceptance): ≤ 0.75 dB

The code labels 0.50 dB as "maximum" — this is technically correct for the reference-to-standard mating pair tier, but is AMBIGUOUS when read as the standard's general maximum. The standard's field maximum for standard-to-standard-grade connectors is 0.75 dB. The Fluke Networks source (citing TIA-568.3-D) confirms the 0.75 dB is the standard-grade test limit.

**Mitigation in existing code:** Line 579 already says "Use 0.75 dB for worst-case or aged connectors" — providing the correct 0.75 dB reference for worst-case. Engineers reading the full note get the right picture. The 0.50 dB default is a reasonable practical planning value for a well-maintained installation; 0.75 is the IEC/TIA field acceptance ceiling.

**Finding: LOW** — the label "maximum" in line 35 and line 579 imprecisely conflates the reference-to-standard mating tier with the general field maximum. In context the note provides both values (0.50 and 0.75), which is adequate for field engineers. Not misleading for OSP planning purposes. No code change required as informational risk is low; however, a future polish could reword line 579 to `0.50 dB per TIA-568.3-D (reference-to-standard-grade mated pair planning value)` for precision.

---

### UA-4: Foot-to-km conversion round-trip stability (FEET_PER_KM = 3280.84)

**Source (`attenuation_calc.js:230`):**
```js
const FEET_PER_KM = 3280.84;
```

**Primary-source verification:** 1 km = 1000 m; 1 international foot = 0.3048 m exactly (by definition, international yard and pound agreement 1959). Therefore 1 km = 1000/0.3048 = 3280.8398… ft. The code uses 3280.84 (rounded to 6 significant figures).

**Round-trip stability test:**
```
3280.84 ft ÷ 3280.84 = 1.000000000 km
1.000000000 km × 0.22 dB/km = 0.2200 dB
Error vs exact: (1000/0.3048 - 3280.84) / 3280.84 ≈ 3.8e-7 km error for a 3280.84 ft input
At 0.22 dB/km: ≈ 8e-8 dB error — completely negligible for OSP planning
```

Test 4 uses 3280.84 ft and allows ±0.01 dB tolerance. The actual error is ~0.00000008 dB — fully within tolerance.

**Verdict: VERIFIED ✓** — rounding error is negligible for planning purposes.

---

## Independent Worked Examples (3)

### WE-1: G.652.D, 1310nm, 40km, 12 splices @0.10, 4 connectors @0.50 (dispersion advisory boundary)
```
Inputs: fiberType=G.652.D, wavelength=1310nm, span=40km, splices=12, connectors=4
Compute:
  fiberLoss       = 40 km × 0.36 dB/km = 14.40 dB
  spliceLossTotal = 12 × 0.10 dB        =  1.20 dB
  connLossTotal   = 4 × 0.50 dB         =  2.00 dB
  TOTAL           = 14.40 + 1.20 + 2.00 = 17.60 dB

Sanity @ 1310nm (green=14, yellow=18):
  17.60 > 14 and 17.60 ≤ 18 → YELLOW ✓

Dispersion advisory: span=40 ≥ 40km threshold → fires ✓
  Advisory text cites: G.652.D/G.657.A2: ~17 ps/nm·km @ 1550nm (PMD ≤ 0.20 ps/√km) ✓
  Note: advisory is span-based not wavelength-based — fires even at 1310nm where CD isn't the limiting factor for most P2P systems. Informational only.
```

### WE-2: G.655, 1550nm, 80km, 20 splices @0.10, 2 connectors @0.50
```
Inputs: fiberType=G.655, wavelength=1550nm, span=80km, splices=20, connectors=2
Compute:
  fiberLoss       = 80 km × 0.20 dB/km = 16.00 dB  (G.655 @ 1550nm coeff)
  spliceLossTotal = 20 × 0.10 dB        =  2.00 dB
  connLossTotal   = 2 × 0.50 dB         =  1.00 dB
  TOTAL           = 16.00 + 2.00 + 1.00 = 19.00 dB

Sanity @ 1550nm (green=28, yellow=35):
  19.00 ≤ 28 → GREEN ✓

Dispersion advisory: span=80 ≥ 40km → fires ✓
  G.655 path: '~3–4 ps/nm·km @ 1550nm — low CD, optimized for C-band WDM; PMD ≤ 0.20 ps/√km per G.655 §5' ✓
  (Correct — G.655 gets its own NZDSF-specific note, not the G.652.D 17 ps/nm·km note)

1490nm splitter note: NOT fired (wavelength=1550, not 1490) ✓
```

### WE-3: G.657.A2, 1490nm, 8km, 3 splices @0.10, 2 connectors @0.50 (GPON splitter note check)
```
Inputs: fiberType=G.657.A2, wavelength=1490nm, span=8km, splices=3, connectors=2
Compute:
  fiberLoss       = 8 km × 0.23 dB/km  = 1.84 dB  (G.657.A2 @ 1490nm coeff)
  spliceLossTotal = 3 × 0.10 dB         = 0.30 dB
  connLossTotal   = 2 × 0.50 dB         = 1.00 dB
  TOTAL           = 1.84 + 0.30 + 1.00  = 3.14 dB

Sanity @ 1490nm (green=22, yellow=28):
  3.14 ≤ 22 → GREEN ✓

1490nm splitter IL note fires: YES (wavelength===1490) ✓
  Note text includes: '1:32 splitter ≈ 17 dB, 1:8 ≈ 11 dB' and 'Class B+ total budget = 28 dB'
  Reality check: 3.14 dB span + 17 dB splitter = 20.14 dB total — within Class B+ 28 dB ✓
  (A correctly operating GPON PON design: short span + high splitter IL = realistic scenario)

Dispersion advisory: span=8 < 40km → does NOT fire ✓
```

---

## Cascade Scan — Did Polish-A Introduce Any Regressions?

| Check | Result |
|---|---|
| G.652.D coeffs (1310/1490/1550): 0.36/0.25/0.22 | UNCHANGED ✓ |
| G.655 coeffs (1490/1550): 0.22/0.20 | UNCHANGED ✓ |
| G.657.A2 coeffs (1310/1490/1550): 0.35/0.23/0.21 | UNCHANGED ✓ (Fix Wave A) |
| BLOCKED_COMBINATIONS G.655+1310 | UNCHANGED ✓ (Fix Wave A) |
| BUDGET_THRESHOLDS 1310: green=14/yellow=18 | UNCHANGED ✓ |
| BUDGET_THRESHOLDS 1490: green=22/yellow=28 | UNCHANGED ✓ (Fix Wave A) |
| BUDGET_THRESHOLDS 1550: green=28/yellow=35 | UNCHANGED ✓ (Fix Wave A) |
| calculate() formula unchanged | ✓ |
| HIGH-A1 Math.max clamping | UNCHANGED ✓ |
| HIGH-A2 trapFocus integration | UNCHANGED ✓ |
| Tests 1–4, 6–11, S1–S2 | NO CHANGES — confirmed by diff scope |
| Test 5 span 150→160 + title + comment update | CORRECTLY UPDATED ✓ |
| Test 3 comment 22dB→28dB threshold reference | CORRECTLY UPDATED ✓ |
| Test 12 assertion changed to radioDisabled | CORRECTLY UPDATED ✓ |
| New dispNote branch for G.655 | ADDITIVE ONLY — does not touch else branch for G.652.D/G.657.A2 ✓ |
| fallbackTrigger addition | ADDITIVE to existing open()/close() — no removal of activeTrap path ✓ |
| 1490nm splitter note | ADDITIVE after existing msg construction — no modification of existing msg ✓ |

**No cascades found. All Polish-A changes are additive or targeted replacements with no unintended side effects.**

---

## Negative Findings (Confirmed Clean)

| Item | Status |
|---|---|
| G.657.A2 coefficients (0.35/0.23/0.21) | ✓ CLEAN — Fix Wave A, not touched by Polish-A |
| G.655 @ 1310nm blocked combination | ✓ CLEAN — Fix Wave A, not touched by Polish-A |
| calculate() math formula | ✓ CLEAN — unchanged across all waves |
| sanityCheck negative-total guard | ✓ CLEAN — unchanged |
| Focus trap (trapFocus path) | ✓ CLEAN — Polish-A added fallback, did not change trapFocus path |
| btn-primary class | ✓ CLEAN — unchanged |
| Close button 36×36px | ✓ CLEAN — unchanged |
| focus-visible CSS | ✓ CLEAN — unchanged |
| Label "Customize splice & connector loss values" | ✓ CLEAN — unchanged |
| Connector label "plug+socket pairs" | ✓ CLEAN — unchanged |
| LOW-B3 descriptive error on invalid fiberType | ✓ CLEAN — unchanged |
| All test assertions outside tests 3/5/12 | ✓ CLEAN — Polish-A only modified 3 tests |
| 1490nm splitter note appends correctly | ✓ VERIFIED — fires for all 1490nm sanity results |
| G.655 dispersion note (3-4 ps/nm·km) | ✓ IN-SPEC — within ITU-T G.655 2-6 ps/nm·km C-band range |
| G.652.D dispersion note (17 ps/nm·km) | ✓ VERIFIED — confirmed by multiple independent sources |

---

## Findings Summary

| ID | Severity | Description | Status |
|---|---|---|---|
| Polish-A NEW-1 | HIGH | Test 5 span 160km → RED (35.20 dB > 35) | VERIFIED APPLIED ✓ |
| Polish-A NEW-2 | MED | Test 12 asserts disabled radio (stable) | VERIFIED APPLIED ✓ |
| Polish-A NEW-3 | LOW | G.655 dispersion note fiber-type-aware | VERIFIED APPLIED ✓ |
| Polish-A NEW-4 | LOW | fallbackTrigger.focus() on close | VERIFIED APPLIED ✓ |
| Polish-A NEW-LOW | LOW | 1490nm splitter IL note in sanity msg | VERIFIED APPLIED ✓ |
| UA-1 | — | G.652.D 0.36 dB/km @ 1310nm | CLEAN ✓ |
| UA-2 | LOW (info) | 1310nm thresholds conservative for high-budget P2P | INFORMATIONAL |
| UA-3 | LOW | Connector 0.50 dB labeled "maximum" — imprecise vs 0.75 TIA field max | PRE-EXISTING, LOW |
| UA-4 | — | Feet-to-km conversion round-trip | CLEAN ✓ |

**No new bugs introduced by Polish-A. Two pre-existing LOW informational items noted.**

---

## Closeout

**Write-path constraints acknowledged:** only `audit-output/attenuation-calc/FINALVERIFY_RT_E_TECHNICAL_2026-05-20.md` written.

1. `git log --oneline main..agent/attcalc-finalverify-rt-e`
2. `git diff --stat main..agent/attcalc-finalverify-rt-e`

(Shown after commit)

**Polish-A 5 items:**

| Item | Verdict |
|---|---|
| NEW-1 — Test 5 span 160km → RED | VERIFIED CORRECT |
| NEW-2 — Test 12 disabled radio assertion | VERIFIED CORRECT |
| NEW-3 — G.655 dispersion note | VERIFIED CORRECT |
| NEW-4 — fallbackTrigger.focus() | VERIFIED CORRECT |
| NEW-LOW — 1490nm splitter IL note | VERIFIED CORRECT |

**Under-audited spot-checks:**

| Check | Finding |
|---|---|
| G.652.D 0.36 dB/km @ 1310nm | VERIFIED ✓ |
| 1310nm sanity thresholds | LOW informational (conservative for some P2P scenarios) |
| Connector 0.50 dB UPC claim | LOW — label "maximum" imprecise vs TIA-568.3-D 0.75 field ceiling; UI notes 0.75 as worst-case |
| Feet-to-km conversion | VERIFIED ✓ |

**Independent worked examples:** 3 complete with all components shown — all produce expected sanityCheck levels and advisory triggers.

**Overall verdict: GREEN**

No regressions from Polish-A. All 5 Polish-A items applied correctly. The calculator's technical claims are sound. Two pre-existing LOW informational items (1310nm threshold conservatism; connector loss label precision) noted for future polish consideration but neither creates field-engineering risk.

=== RT-E FINAL VERIFY TECHNICAL REPORT END ===
