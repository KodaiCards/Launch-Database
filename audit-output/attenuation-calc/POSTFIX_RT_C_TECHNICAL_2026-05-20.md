# RT-C — Technical / Math Post-Fix Verification: Fiber Attenuation Calculator
**Date:** 2026-05-20
**Branch reviewed:** `agent/attcalc-fix-wave-a` (commit `4b90800`)
**Framing:** Senior OSP engineer + ITU-T standards reviewer. Independent numeric verification — does NOT trust the fix-agent's "verified" claims. Re-derives every changed coefficient, re-checks every threshold, and scans for cascade bugs introduced by the fix.
**Write-path constraints acknowledged:** only `audit-output/attenuation-calc/POSTFIX_RT_C_TECHNICAL_2026-05-20.md` written.

---

## Executive Summary

Fix Wave A addressed 14 canonical findings correctly in 12 of 14 cases. Two issues found:

1. **NEW BUG (HIGH) — Test 5 CASCADE FAILURE:** LOW-B1 changed the 1550 nm green/yellow thresholds from 22/28 → 28/35 dB, but Test 5 in the spec file was NOT updated. Test 5 uses 150 km × 0.22 dB/km = 33.00 dB and asserts `.red`. With the new thresholds (yellow=35), 33 dB is now YELLOW, not RED. The test will fail in CI. This is a direct cascade from the LOW-B1 threshold change.

2. **LOW (residual) — 1490 nm GPON thresholds improved but still conceptually imprecise:** The fix changed 14/18 → 22/28 dB per RT-B's recommendation referencing "GPON Class B+ 28 dB." However, 28 dB is the TOTAL optical path loss budget for Class B+, not the span-only budget. Since the calculator explicitly computes span attenuation only (splitter IL excluded), a span reading of 22 dB (GREEN) + a 1:32 splitter IL of ~17 dB = 39 dB total, which exceeds Class B+ budget. The direction of improvement over 14/18 is correct and real; the header comment warns about the limitation; but the span-only thresholds for 1490 nm are calibrated against the wrong reference (total vs. span). This is a pre-existing conceptual design issue, partially mitigated by the added header warning. Severity: LOW (informational).

All four HIGH canonical findings (HIGH-A1, HIGH-A2, HIGH-B1, HIGH-B2) are correctly implemented. All three MED findings (MED-A1, MED-A2, MED-B1) are correctly implemented except that MED-B1's threshold change was not propagated to the test. Five of seven LOW findings are correctly implemented. Two LOW findings have minor residuals noted above.

---

## Primary Source Verification Log

### G.657.A2 attenuation coefficients — independently verified
**Sources consulted (independent, not trusting fix-agent's claimed verification):**
- ycict.com ITU-T G.657 table reproduction: G.657.A2 max attenuation ≤0.35 dB/km @ 1310 nm, ≤0.21 dB/km @ 1550 nm
- weunionfiber.com: Same values confirmed
- fs.com blog "Understanding ITU-T Standards for Various Optical Fibers": Same values confirmed
- Web search confirms multi-source convergence on ≤0.35/≤0.21

**Fix applied:** 0.40/0.25 → 0.35/0.21 at 1310/1550 nm.
**Verdict: VERIFIED CORRECT.** Fix matches primary-source consensus. G.657.A2 attenuation is equal to or better than G.652.D, not worse.

### G.655 @ 1310 nm — independently verified
**Sources consulted:**
- fiberoptics4sale.com Fosco Connect: G.655 cable cutoff wavelength λ_cc held below 1450-1480 nm; no SM propagation at 1310 nm
- Web search confirms G.655 defined only for C-band/L-band (1530-1625 nm); 1310 nm is not in scope
- Multiple sources confirm 1310 nm operation for G.655 is not specified or reliable

**Fix applied:** removed G.655 1310 coefficient; added BLOCKED_COMBINATIONS; UI shows warning.
**Verdict: VERIFIED CORRECT.** 1310 nm is correctly blocked for G.655.

### GPON Class B+ budget — independently verified
**Sources consulted:**
- mefibermodule.com: "GPON Class B+ = 28 dB optical budget" confirmed
- Web search: ITU-T G.984.2 Class B+ = 28 dB confirmed by multiple sources

**Fix applied:** 1490 nm thresholds changed 14/18 → 22/28.
**Verdict: VALUES CORRECT, CONCEPTUAL FRAMING IMPRECISE** (see LOW finding below).

---

## Per-Finding Verdicts

### HIGH-A1 — Negative input clamping
**Fix-agent claim:** `Math.max(0, ...)` added for span, splices, connectors in `update()`.

**Verified by reading diff lines 732-735:**
```js
const spanRaw    = Math.max(0, parseFloat(spanInput.value) || 0);
const spanKm     = Math.max(0, toKm(spanRaw, currentUnit));
const splices    = Math.max(0, parseInt(splicesIn.value, 10) || 0);
const connectors = Math.max(0, parseInt(connsIn.value, 10) || 0);
```

Also verified: `sanityCheck()` has a defensive guard `if (total < 0)` returning RED with "Invalid input" message, covering the case where `calculate()` is called directly with negative values.

**Verdict: VERIFIED.** Both the input layer (Math.max in update()) and the output layer (sanityCheck guard) are correctly implemented. No regression found.

---

### HIGH-A2 — Focus trap + focus return on modal close
**Fix-agent claim:** integrates `window.trapFocus` from `public/js/focus_trap.js`; fallback for absent trapFocus; passes trigger button for focus return.

**Verified by reading diff lines 906-941 + `/public/js/focus_trap.js`:**

The `focus_trap.js` implementation saves `document.activeElement` at trap-time as `prevFocus` and calls `prevFocus.focus()` on `release()`. Since `btn.addEventListener('click', () => modal.open(btn))` fires on button click, `document.activeElement` at trap-time IS the button → focus return is correctly achieved via `trapFocus.release()`.

The `open(triggerEl)` parameter is accepted but not explicitly used in the function body (focus return is handled by `trapFocus`'s saved `prevFocus`). This is not a bug — the parameter is accepted for API consistency but the actual mechanism is correct.

The fallback branch (when `trapFocus` unavailable) moves focus to first focusable but does NOT guarantee focus return. This is an accepted degraded-experience fallback, not a regression from the original (which also had no focus return).

ESC handling: when `trapFocus` is available, ESC is handled by its `_escHandler` → calls `onEsc: close` → releases trap + restores focus. When not available, the fallback `keydown` listener (`!activeTrap`) handles ESC. Both paths covered.

**Verdict: VERIFIED.** Focus trap and focus return correctly implemented via trapFocus integration.

---

### HIGH-B1 — G.657.A2 coefficients corrected
**Fix-agent claim:** 0.40/0.25 → 0.35/0.21 @ 1310/1550 nm; 1490 nm interpolated to 0.23.

**Verified by reading diff lines 148-153:**
```js
coeffs: { 1310: 0.35, 1490: 0.23, 1550: 0.21 },
```

**Independent re-derivation (cascade check):**

*Example A: G.657.A2, 1550 nm, 10 km, 2 splices @ 0.10 dB, 2 connectors @ 0.50 dB*
```
fiberLoss       = 10 km × 0.21 dB/km = 2.10 dB  (corrected from 2.50 dB — Δ = −0.40 dB)
spliceLossTotal = 2 × 0.10 dB         = 0.20 dB
connLossTotal   = 2 × 0.50 dB         = 1.00 dB
TOTAL           = 2.10 + 0.20 + 1.00  = 3.30 dB  ← matches Test 9 assertion
```
Sanity @ 1550 nm (green=28): 3.30 ≤ 28 → GREEN ✓

*Example B: G.657.A2, 1310 nm, 5 km, 0 splices, 0 connectors*
```
fiberLoss = 5 km × 0.35 dB/km = 1.75 dB  (corrected from 2.00 dB — Δ = −0.25 dB)
TOTAL     = 1.75 dB  ← matches Test 10 assertion
```

Code comment updated: "G.657.A2 attenuation is equal to or better than G.652.D, not higher" — factually correct.

**Test cascade check:** Tests 9 and 10 use the corrected 0.21 and 0.35 coefficients respectively. Both assertions correctly match the re-derived values. No stale old-value assertions found in the G.657.A2 tests.

**Verdict: VERIFIED.** Coefficients correct, test assertions updated correctly, re-derivations match.

---

### HIGH-B2 — G.655 @ 1310 nm blocked
**Fix-agent claim:** 1310 removed from G.655 coeffs; BLOCKED_COMBINATIONS added; UI shows warning when G.655 + 1310 selected.

**Verified by reading diff:**

G.655 coeffs: `{ 1490: 0.22, 1550: 0.20 }` — 1310 absent ✓

```js
const BLOCKED_COMBINATIONS = { 'G.655': [1310] };
function isCombinationBlocked(fiberType, wavelength) {
  return (BLOCKED_COMBINATIONS[fiberType] || []).includes(wavelength);
}
```

`calculate()` now throws: `'No ITU-T specification for G.655 @ 1310 nm ...'` with cutoff wavelength explanation ✓

UI: wavelength radio label gets `.blocked` class (opacity: 0.45, line-through, `cursor:not-allowed`) + `#att-blocked-warning` div shown + `aria-disabled="true"` + results section grayed ✓

**Test 11** (calculate throws on G.655 @ 1310): asserts `e.message.includes('1310') || e.message.includes('cutoff')`. The error message contains both. ✓

**Test 12** (UI warning visible): asserts `#att-blocked-warning` visible when G.655 selected. ✓

**Verdict: VERIFIED.** G.655+1310 correctly blocked at all three layers (calc API, UI state, test coverage).

---

### MED-A1 — New tests for G.657.A2 math + G.655 block + splice.html mount
**Fix-agent claim:** Tests 9, 10, 11, 12, S1, S2 added.

**Verified by reading spec file:**
- Test 9: G.657.A2 @ 1550nm → 3.30 dB. Math shown above, assertion correct ✓
- Test 10: G.657.A2 @ 1310nm coefficient = 0.35. Assertion `result.coeff ≈ 0.35` and `result.fiberLoss ≈ 1.75` ✓
- Test 11: G.655 @ 1310nm throws. Assertion checks message contains '1310' or 'cutoff' ✓
- Test 12: G.655 + 1310nm shows `#att-blocked-warning` visible ✓
- Test S1: splice portal button visible ✓
- Test S2: G.657.A2 `coeffs[1550]` in splice portal = 0.21 (not old 0.25) ✓

**Verdict: VERIFIED.** New tests are correctly written and will catch coefficient regressions.

---

### MED-A2 — Button class btn-secondary → btn-primary
**Fix-agent claim:** trigger button now uses `btn-primary` so it stands out in splice.html.

**Verified by reading diff line 987:**
```js
btn.className = 'btn btn-primary btn-sm ' + (opts.buttonClass || '');
```

**Verdict: VERIFIED.**

---

### MED-B1 — 1490 nm thresholds 14/18 → 22/28
**Fix-agent claim:** corrected per ITU-T G.984.2 Class B+.

**Verified by reading diff lines 172-178:**
```js
1490: { green: 22, yellow: 28 },  // corrected from 14/18 — ITU-T G.984.2 Class B+ ref
```

Independent re-derivation: a 20 km G.652.D GPON span @ 1490 nm (0.25 dB/km) + 5 splices + 2 connectors = 5.00 + 0.50 + 1.00 = 6.50 dB. OLD threshold: 6.50 > 18 → RED (wrong). NEW threshold: 6.50 < 22 → GREEN (correct for span component). Improvement confirmed.

**Residual concern (LOW — see finding NEW-BUG-2 below):** 22/28 are calibrated against the TOTAL GPON path budget (28 dB), but the calculator is span-only. A span of 22 dB + 17 dB splitter = 39 dB total >> Class B+. Header warning partially mitigates; correct span-only thresholds for GPON would be ~6-11 dB (total budget minus splitter IL). This is a residual design clarity issue.

**Verdict: VERIFIED-WITH-RESIDUAL.** Direction correct, specific values conceptually imprecise but improved. Residual logged as LOW below.

---

### LOW-A1 — Label text changed to "Customize splice & connector loss values"
**Verified by reading diff lines 605, 819:** both the static HTML template and the dynamic toggle text are updated. ✓

**Verdict: VERIFIED.**

---

### LOW-A2 — Close button 28px → 36px
**Verified by reading diff lines 885-886:** `'width:36px', 'height:36px'` ✓

**Verdict: VERIFIED.**

---

### LOW-A3 — Focus-visible ring added
**Verified by reading diff lines 502-505:**
```css
.att-calc-panel :focus-visible {
  outline: 2px solid var(--primary, #1B5FA0);
  outline-offset: 2px;
}
```
✓

**Verdict: VERIFIED.**

---

### LOW-A4 — Connector label updated to "plug+socket pairs"
**Verified by reading diff line 591:** `<label for="att-connectors">Connectors (plug+socket pairs)</label>` ✓

**Verdict: VERIFIED.**

---

### LOW-B1 — 1550 nm thresholds 22/28 → 28/35
**Fix-agent claim:** relaxed to reflect deployed transceiver budgets (GPON C+ 32 dB, P2P ZR 23+ dB).

**Verified by reading diff line 176:**
```js
1550: { green: 28, yellow: 35 }
```

**CRITICAL CASCADE BUG FOUND (see NEW-BUG-1 below):** Test 5 was NOT updated to match.

**Verdict: CODE CHANGE VERIFIED, BUT CASCADE BUG IN TEST SUITE.**

---

### LOW-B2 — Dispersion/PMD advisory for spans ≥ 40 km
**Verified by reading diff line 265:** `if (spanKm >= 40)` adds advisory text to sanityCheck message ✓

Sanity check receives `spanKm` parameter (diff line 787): `sanityCheck(res.total, currentWavelength, fiberType, spanKm)` ✓

**Verdict: VERIFIED.**

---

### LOW-B3 — calculate() throws descriptive error on invalid fiberType
**Verified by reading diff lines 103-115:**
```js
const fiber = FIBER_COEFFICIENTS[fiberType];
if (!fiber) {
  throw new Error('Unknown fiber type: ' + fiberType + '. Valid values: G.652.D, G.655, G.657.A2');
}
const coeff = fiber.coeffs[wavelength];
if (coeff === undefined) {
  throw new Error('No ITU-T specification for ' + fiberType + ' @ ' + wavelength + ' nm ...');
}
```
✓

**Verdict: VERIFIED.**

---

## New Bugs Found

### NEW-BUG-1 (HIGH) — Test 5 fails due to un-propagated LOW-B1 threshold change

**Verified by reading test file diff, lines 236-256:**
```js
test('5. Red sanity check fires when total exceeds 28 dB (1550 nm threshold)', async ({ page }) => {
  ...
  await page.fill('#att-span', '150');  // 150 km
  ...
  // Sanity should show red
  await expect(page.locator('#att-sanity.red')).toBeVisible();
```

**Re-derivation:**
```
G.652.D, 1550 nm, 150 km, 0 splices, 0 connectors:
  fiberLoss = 150 km × 0.22 dB/km = 33.00 dB
  total     = 33.00 dB
```

OLD thresholds (before fix): green=22, yellow=28. 33.00 > 28 → RED ✓ (test passed)
NEW thresholds (LOW-B1 fix): green=28, yellow=35. **33.00 ≤ 35 → YELLOW, NOT RED** ✗

**The test asserts `.red` but will see `.yellow` — CI FAILURE.**

Required fix: update Test 5 to use a span that exceeds the new yellow threshold (35 dB).
Minimum span for RED at 1550 nm with G.652.D: 35 / 0.22 = 159.09 km → use ≥ 160 km.
Or update the test to assert `.yellow` instead and rename/adjust test accordingly.

**File:** `tests/browser/attenuation_calc.spec.js` line 236 (`test('5. Red sanity check fires when total exceeds 28 dB ...')`), the fill value at line 246 (`'150'`), and the assertion at line 253 (`#att-sanity.red`).

**Secondary note:** Test 3 has a stale comment at line 200: "Sanity check should be green (3.50 dB < 22 dB threshold for 1550 nm)." The new threshold is 28 dB, not 22. The ASSERTION itself (`#att-sanity.green`) is correct (3.50 ≤ 28 → GREEN), but the comment is wrong. LOW severity — comment only.

**Severity: HIGH** — this test will fail in CI, blocking the CI smoke job on this branch.

---

### NEW-BUG-2 (LOW, residual) — 1490 nm span-only thresholds conceptually misaligned with GPON reality

**Finding:** The 22/28 dB thresholds for 1490 nm are calibrated against the TOTAL Class B+ GPON optical path loss budget (28 dB per G.984.2). However, the calculator explicitly computes SPAN ATTENUATION ONLY and warns that splitter IL (~17 dB for 1:32) is excluded.

A span of 22 dB (flagged GREEN by the tool) + 17 dB splitter insertion loss = 39 dB total optical path loss, which exceeds Class B+ budget by 11 dB and Class C+ budget by 7 dB. The GREEN signal would be misleading for a GPON engineer who then adds a splitter.

The span-attenuation budget available for a GPON designer is: `Total_budget - splitter_IL - connector_budget`. For Class B+ at 1:32: `28 - 17 - ~1 = ~10 dB`. Correct span-only thresholds for GPON would be approximately green=6, yellow=10.

**Mitigation factors:**
- Header comment explicitly warns: "Verify total path loss against your OLT/ONU Rx sensitivity"
- This is a design clarity issue, not a math error
- The direction of change (14/18 → 22/28) is an improvement over the original
- RT-B's MED-1 finding that prompted this fix was itself slightly imprecise in its recommendation

**Severity: LOW** — directional improvement confirmed; specific thresholds remain imprecise for GPON use; header warning partially mitigates.

---

## Independent Worked Examples (All Three Required)

### Worked Example 1: G.657.A2, 1550 nm, 10 km, 2 splices, 2 connectors (tests new coefficient)
```
Inputs:  fiberType=G.657.A2, wavelength=1550nm, span=10km, splices=2, spliceLoss=0.10, connectors=2, connLoss=0.50
Compute:
  fiberLoss       = 10 km × 0.21 dB/km  = 2.10 dB  ← corrected from 2.50 dB
  spliceLossTotal = 2 × 0.10 dB          = 0.20 dB
  connLossTotal   = 2 × 0.50 dB          = 1.00 dB
  TOTAL           = 2.10 + 0.20 + 1.00   = 3.30 dB

Sanity @ 1550 nm (green=28, yellow=35):
  3.30 ≤ 28 → GREEN ✓
  Test 9 asserts 3.30 dB → MATCH ✓
```

### Worked Example 2: G.652.D, 1310 nm, 25 km, 8 splices, 4 connectors (boundary check)
```
Inputs:  fiberType=G.652.D, wavelength=1310nm, span=25km, splices=8, spliceLoss=0.10, connectors=4, connLoss=0.50
Compute:
  fiberLoss       = 25 km × 0.36 dB/km  = 9.00 dB
  spliceLossTotal = 8 × 0.10 dB          = 0.80 dB
  connLossTotal   = 4 × 0.50 dB          = 2.00 dB
  TOTAL           = 9.00 + 0.80 + 2.00   = 11.80 dB

Sanity @ 1310 nm (green=14, yellow=18):
  11.80 ≤ 14 → GREEN ✓  (unchanged threshold, no regression here)
Sanity check: dispersion advisory NOT triggered (span 25 < 40 km). ✓
```

### Worked Example 3: G.652.D, 1550 nm, 150 km, 0 splices, 0 connectors (cascade bug verification)
```
Inputs:  fiberType=G.652.D, wavelength=1550nm, span=150km, splices=0, connectors=0
Compute:
  fiberLoss = 150 km × 0.22 dB/km = 33.00 dB
  TOTAL     = 33.00 dB

Sanity @ 1550 nm (NEW thresholds: green=28, yellow=35):
  33.00 > 28 and 33.00 ≤ 35 → YELLOW

Sanity @ 1550 nm (OLD thresholds for reference: green=22, yellow=28):
  33.00 > 28 → RED

Test 5 ASSERTS .red but gets .yellow with new thresholds → FAIL ← CASCADE BUG CONFIRMED

Dispersion advisory: span=150 ≥ 40 km → dispersion advisory fires. ✓ (LOW-B2 works)
```

---

## Negative Findings (Confirmed Clean)

| Item | Verified | Notes |
|---|---|---|
| G.657.A2 @ 1310nm coefficient: 0.35 | ✓ CLEAN | Independent primary-source verification + Test 10 correctly asserts |
| G.657.A2 @ 1490nm coefficient: 0.23 | ✓ CLEAN | Interpolated between 0.35/0.21, conservative, not tested but defensible |
| G.657.A2 @ 1550nm coefficient: 0.21 | ✓ CLEAN | Independent primary-source verification + Test 9 correctly asserts |
| G.655 1310nm block mechanism | ✓ CLEAN | Three-layer: calc API throw + UI disabled + warning div |
| G.655 1490nm coefficient: 0.22 | ✓ CLEAN | Pre-existing, not changed, no regression |
| G.655 1550nm coefficient: 0.20 | ✓ CLEAN | Pre-existing, not changed, no regression |
| G.652.D 1310nm coefficient: 0.36 | ✓ CLEAN | Pre-existing, not changed, no regression |
| G.652.D 1550nm coefficient: 0.22 | ✓ CLEAN | Pre-existing, not changed, no regression |
| Math formula in calculate() | ✓ CLEAN | fiberLoss + spliceLoss + connLoss unchanged, correct |
| Math.max clamping for span, splices, connectors | ✓ CLEAN | All three inputs clamped at update() layer |
| sanityCheck negative-total guard | ✓ CLEAN | Defensive guard returns RED with invalid-input message |
| Focus trap uses trapFocus from focus_trap.js | ✓ CLEAN | focus_trap.js saves prevFocus = activeElement at trap time → release() restores |
| Focus return on close | ✓ CLEAN | Via trapFocus.release() restoring saved prevFocus |
| ESC handling (both paths) | ✓ CLEAN | trapFocus onEsc path + fallback direct listener for environments without trapFocus |
| btn-primary class in splice portal | ✓ CLEAN | btn.className set to 'btn btn-primary btn-sm ...' |
| Close button 36×36px | ✓ CLEAN | width:36px + height:36px confirmed in diff |
| focus-visible outline added | ✓ CLEAN | CSS block has :focus-visible rule |
| Label "Customize splice & connector loss values" | ✓ CLEAN | Both static HTML and dynamic toggle updated |
| Connector label "plug+socket pairs" | ✓ CLEAN | label element updated |
| LOW-B2 dispersion advisory ≥ 40 km | ✓ CLEAN | `if (spanKm >= 40)` fires advisory |
| LOW-B3 descriptive error on invalid fiberType | ✓ CLEAN | Guard throws with named-type error message |
| Tests 9, 10, 11, 12 logic | ✓ CLEAN | All assertions match re-derived values |
| Test S1 (splice portal button visible) | ✓ CLEAN | Correct selector used |
| Test S2 (splice portal G.657.A2 coeff check) | ✓ CLEAN | Asserts 0.21 not old 0.25 |
| 1310nm GPON threshold unchanged: 14/18 | ✓ CLEAN | 1310nm thresholds unchanged; no regression |

---

## Coverage Gaps

- Did not run Playwright tests live — static analysis only. The cascade bug (Test 5 YELLOW vs RED) is derived from arithmetic and code reading, not observed browser failure.
- Did not verify the `focus_trap.js` version in the browser environment of splice.html vs design.html — both are documented to load the same file per the build.
- Did not verify the CSS variable `--primary` is defined in both design.html and splice.html stylesheets (assumed from existing portal-wide usage of `var(--primary)`).

---

## Closeout

**Write-path constraints acknowledged:** only `audit-output/attenuation-calc/POSTFIX_RT_C_TECHNICAL_2026-05-20.md` written.

1. `git log --oneline main..agent/attcalc-postfix-rt-c` (shown after commit)
2. `git diff --stat main..agent/attcalc-postfix-rt-c` (1 file only)

**Per-finding verdict table:**

| Finding | Verdict |
|---|---|
| HIGH-A1 (negative input clamping) | VERIFIED |
| HIGH-A2 (focus trap + focus return) | VERIFIED |
| HIGH-B1 (G.657.A2 coefficients 0.35/0.21) | VERIFIED |
| HIGH-B2 (G.655+1310 blocked) | VERIFIED |
| MED-A1 (new tests 9-12, S1-S2) | VERIFIED |
| MED-A2 (btn-primary in splice.html) | VERIFIED |
| MED-B1 (1490nm thresholds 22/28) | VERIFIED (residual LOW noted) |
| LOW-A1 (label text updated) | VERIFIED |
| LOW-A2 (close button 36px) | VERIFIED |
| LOW-A3 (focus-visible CSS) | VERIFIED |
| LOW-A4 (connector label updated) | VERIFIED |
| LOW-B1 (1550nm thresholds 28/35) | REGRESSION_RISK — Test 5 cascade failure |
| LOW-B2 (dispersion advisory ≥40km) | VERIFIED |
| LOW-B3 (descriptive error on invalid type) | VERIFIED |
| NEW-BUG-1 — Test 5 fails (33dB → YELLOW not RED) | NEW HIGH — CI FAILURE |
| NEW-BUG-2 — 1490nm span-only thresholds conceptually imprecise | NEW LOW — informational |

---

## Overall Verdict: YELLOW

**12 of 14 findings VERIFIED.** One new HIGH bug: Test 5 will fail CI because 150 km × 0.22 dB/km = 33 dB falls between the new thresholds (green=28, yellow=35), producing YELLOW, but the test asserts `.red`. The fix needs either (a) change Test 5's span input to ≥ 160 km, or (b) update the assertion to `.yellow` and rename the test. The calc code itself is correct; the test was not updated to match LOW-B1.

All HIGH and MED canonical findings in the code are correctly applied. All test additions are correct except Test 5.

=== RT-C TECHNICAL POSTFIX REPORT END ===
