# RT-F — Final Verify: Pedagogy / UX / Accessibility (Post Polish-A)
**Date:** 2026-05-20
**Branch reviewed:** `main` (commit `ff7667e` — Polish-A)
**Framing:** Senior field engineer + accessibility reviewer. READ-ONLY. Evaluates whether Polish-A items are correctly applied and looks for residual UX friction in under-audited surfaces.
**Write-path constraints acknowledged:** only `audit-output/attenuation-calc/FINALVERIFY_RT_F_PEDAGOGY_2026-05-20.md` written.

---

## Executive Summary

Polish-A (commit `ff7667e`) correctly addresses all 5 items (1 HIGH + 1 MED + 3 LOW) from RT-C and RT-D. No regressions introduced. 

One MEDIUM structural finding discovered: the HTML portal wiring commit (`efa0c83`) is NOT on main — it's stranded on `agent/attenuation-calc-build` branch only. This means the `attenuation_calc.js` file and all its polish work exists on main, but `design.html` and `splice.html` do not load the script or mount the button. The Playwright browser tests (which navigate to `/design.html` and `/splice.html`) will ALL fail for the trivial reason that `#att-calc-btn-wrap` doesn't exist in either portal's DOM. This is the highest-priority residual finding.

Two additional LOW findings: (1) an inaccurate code comment claiming splice.html loads `focus_trap.js` (it does not), and (2) the `aria-live` sanity region announces verbosely at 1490nm with ≥40km spans, though this is a minor screen-reader UX concern only.

---

## Polish-A Item Verification (5 items)

### NEW-1 (HIGH) — Test 5 cascade from LOW-B1 threshold change

**RT-C finding:** Test 5 asserted `#att-sanity.red` for 150km × 0.22 = 33 dB. With new thresholds (green=28, yellow=35), 33 dB is YELLOW not RED → CI failure.

**Polish-A fix applied:** span changed 150km → 160km; test title and comment updated; stale `< 22 dB` comment in Test 3 corrected to `< 28 dB`.

**Verified by reading: `tests/browser/attenuation_calc.spec.js:169-193`**

```js
test('5. Red sanity check fires when total exceeds 35 dB (1550 nm yellow threshold)', async ({ page }) => {
  // NEW-1 fix: LOW-B1 raised 1550 nm thresholds to green=28, yellow=35.
  // 160 km × 0.22 dB/km = 35.20 dB which exceeds the yellow threshold (35 dB) → RED.
  ...
  await page.fill('#att-span', '160');
  ...
  await expect(page.locator('#att-sanity.red')).toBeVisible();
```

Math re-derivation: 160 × 0.22 = **35.20 dB**. 35.20 > 35 (yellow threshold) → RED. ✓

Test 3 comment fix verified: `attenuation_calc.spec.js:133` now reads `// Sanity check should be green (3.50 dB < 28 dB green threshold for 1550 nm)`. Previously `< 22 dB`. Correct per updated threshold.

**Verdict: VERIFIED.**

---

### NEW-2 (MED) — Test 12 blocked-warning assertion

**RT-D finding:** When G.655 selected, UI auto-switches from 1310nm to 1490nm; after auto-switch `blocked = false` so warning hides. Test 12 asserting `#att-blocked-warning visible` would FAIL.

**Polish-A fix applied:** Test 12 rewritten to assert the 1310nm radio is disabled (stable observable state) rather than the transient warning div.

**Verified by reading: `tests/browser/attenuation_calc.spec.js:351-373`**

```js
test('12. UI: G.655 selected disables 1310 nm radio (G.655 + 1310 nm is out-of-spec)', async ({ page }) => {
  // NEW-2 fix: when G.655 is selected with 1310nm active, the UI auto-switches to 1490nm.
  // The stable observable state is: the 1310nm radio is disabled.
  ...
  await page.selectOption('#att-fiber-type', 'G.655');
  await page.waitForTimeout(300);
  const radio1310 = page.locator('input[name="att-wl"][value="1310"]');
  await expect(radio1310).toBeDisabled({ timeout: 3_000 });
```

Confirmed in `attenuation_calc.js:657`: `radio.disabled = blocked;` — when G.655 is active, 1310nm radio `disabled = true` permanently. The assertion is stable and directly tests the implementation.

**Verdict: VERIFIED.**

---

### NEW-3 (LOW) — G.655 fiber-type-aware dispersion advisory

**RT-D finding:** Dispersion advisory hard-coded G.652.D figures (17 ps/nm·km) for all fiber types. G.655 users would see wrong figures (G.655 is NZDSF with ~3–4 ps/nm·km — 4–5× different).

**Polish-A fix applied:** Advisory now branches on `fiberType`:
- G.655: `(G.655/NZDSF: ~3–4 ps/nm·km @ 1550 nm — low CD, optimized for C-band WDM; PMD ≤ 0.20 ps/√km per G.655 §5)`
- G.652.D/G.657.A2: `(G.652.D/G.657.A2: ~17 ps/nm·km @ 1550 nm; PMD ≤ 0.20 ps/√km per G.652.D §6.2)`

**Verified by reading: `public/js/attenuation_calc.js:211-219`**

```js
if (fiberType === 'G.655') {
  // G.655 (NZDSF): low non-zero dispersion, ~3–4 ps/nm·km @ 1550 nm per ITU-T G.655 §5
  dispNote = '(G.655/NZDSF: ~3–4 ps/nm·km @ 1550 nm — low CD, optimized for C-band WDM; '
           + 'PMD ≤ 0.20 ps/√km per G.655 §5)';
} else {
  // G.652.D and G.657.A2: both are standard SMF geometry with the same dispersion class
  dispNote = '(G.652.D/G.657.A2: ~17 ps/nm·km @ 1550 nm; PMD ≤ 0.20 ps/√km per G.652.D §6.2)';
}
```

The G.657.A2 grouping with G.652.D is technically correct — G.657.A2 has the same dispersion class per ITU-T G.657 §6.1 (bend tolerance comes from refractive-index profile, not from changing chromatic dispersion). The `~3–4 ps/nm·km` figure for G.655 is consistent with NZDSF C-band operation per ITU-T G.655 §5. Both citations are defensible planning values.

**Verdict: VERIFIED.**

---

### NEW-4 (LOW) — Fallback focus-return path

**RT-D finding:** When `window.trapFocus` is not loaded (as is the case in `splice.html`), the fallback path moved focus INTO the modal on `open()` but did NOT return focus to the trigger on `close()`. The `triggerEl` parameter was received but unused in fallback.

**Polish-A fix applied:** Added `fallbackTrigger` variable. `open(triggerEl)` stores `triggerEl || document.activeElement` in `fallbackTrigger` BEFORE moving focus into modal. `close()` calls `fallbackTrigger.focus()` in the `else if` branch.

**Verified by reading: `public/js/attenuation_calc.js:864-891`**

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

Capture order is correct: `fallbackTrigger = triggerEl` is set BEFORE `firstFocusable.focus()` shifts focus away. When the trigger button is clicked, `modal.open(btn)` passes `btn` as `triggerEl`, so `fallbackTrigger = btn`. On `close()`, `btn.focus()` restores focus. Correct for both click (triggerEl = btn) and edge cases (fallback to activeElement). The `try/catch` prevents errors if the trigger element is no longer in the DOM.

**Verdict: VERIFIED.**

---

### NEW-LOW (RT-C) — GPON splitter IL inline note in 1490nm sanity message

**RT-C finding:** 1490nm sanity message didn't warn that the calculator shows span-only attenuation. A GREEN span reading for GPON could mislead a field tech who then adds a 17 dB splitter and exceeds Class B+ budget.

**Polish-A fix applied:** For 1490nm, appends: `"Note: this is span attenuation only. For GPON, add splitter insertion loss (1:32 splitter ≈ 17 dB, 1:8 ≈ 11 dB) to get total path loss — verify against OLT/ONU Rx sensitivity (Class B+ total budget = 28 dB per ITU-T G.984.2)."`

**Verified by reading: `public/js/attenuation_calc.js:197-204`**

The note is appended after the primary sanity result and before the dispersion advisory (correct order). The text reads naturally after the primary message's period: `"...before final design. Note: this is span attenuation only..."`.

**Splitter IL values spot-checked:**
- 1:32 theoretical: 10·log₁₀(32) = 15.05 dB + excess loss (~1.5–2.0 dB) → ~17 dB planning value ✓
- 1:8 theoretical: 10·log₁₀(8) = 9.03 dB + excess loss (~1.5 dB) → ~10.5–11 dB planning value ✓
- Both values are standard GPON planning estimates; the "≈" prefix correctly signals approximation.

The note is field-appropriate. Terms used (OLT/ONU, Class B+, G.984.2) are familiar to anyone using the 1490nm window for GPON. No new vocabulary introduced without context.

**Verdict: VERIFIED.**

---

## Residual Findings

### FINDING-1 (MED) — Portal wiring commit NOT on main: `design.html` and `splice.html` do not load the calculator

**Severity: MED — Playwright tests will fail; calculator is functionally absent from live portals**

The attenuation_calc.js file (`public/js/attenuation_calc.js`) is on main and fully polished. However, the commit that wires the script into the portals — `efa0c83` ("feat: wire attenuation calculator into design portal and splice matrix headers") — is on branch `agent/attenuation-calc-build` only. It has NOT been merged to main.

**Evidence:**

`git branch --all --contains efa0c83` returns: `agent/attenuation-calc-build` (only).

Current `main:public/design.html` at line 2224-2226: ends with `</body></html>` — no `attenuation_calc.js` script tag, no `#att-calc-btn-wrap` div.

Current `main:public/splice.html`: likewise no attenuation calc wiring.

**Impact:** All 15 Playwright tests in `tests/browser/attenuation_calc.spec.js` navigate to `/design.html` or `/splice.html` and look for `#att-calc-btn-wrap button` — which doesn't exist on main. Tests 1-12 and S1-S2 will fail at the first `await expect(btn).toBeVisible()` call.

The live `/design` and `/splice` portals do not show an "Attenuation Calc" button.

**Resolution:** Merge `agent/attenuation-calc-build` into main (or cherry-pick `efa0c83` with a rebase onto the Polish-A state). Before merging, verify the wiring commit applies cleanly over Polish-A's changes (both only touch `attenuation_calc.js` and the test spec; `efa0c83` touches `design.html` and `splice.html` — no merge conflict expected).

---

### FINDING-2 (LOW) — Inaccurate code comment: splice.html does NOT load `focus_trap.js`

**Severity: LOW — documentation error, no runtime impact**

**Verified by reading: `public/js/attenuation_calc.js:861`**

```js
// Uses window.trapFocus from public/js/focus_trap.js (loaded in design.html + splice.html).
```

This comment is inaccurate. Current `splice.html` (both on main and on `agent/attenuation-calc-build`) does NOT include `<script src="/js/focus_trap.js">`. Only `design.html` loads it.

**Runtime consequence:** In `splice.html`, `window.trapFocus` is always `undefined`, so the modal always uses the fallback focus path (NEW-4). This is functionally correct since NEW-4 correctly handles focus return in the fallback path. The only problem is the comment misrepresents the actual loading state, which could mislead a future maintainer who assumes `trapFocus` is available in splice.html.

Correct comment would be: `"(loaded in design.html — splice.html uses the fallback path)"` or: add `<script src="/js/focus_trap.js" defer></script>` to `splice.html` before the attenuation_calc script.

---

### FINDING-3 (LOW) — Sanity `role="status"` may produce verbose AT output at 1490nm + ≥40km

**Severity: LOW — minor screen-reader UX concern only, no functional issue**

The `#att-sanity` div uses `role="status"` (aria-live polite equivalent). The `update()` function fires on every `input` and `change` event on all form controls — so every digit typed into the span length field triggers a fresh announcement.

At 1490nm with span ≥ 40km, the sanity message contains three concatenated segments:
1. Primary result: ~20 words
2. GPON splitter IL note: ~47 words
3. Dispersion advisory: ~35 words

Total: ~102 words announced on each keystroke. For a sighted user this is fine (text doesn't change while typing — only updates when `input` event fires on each keypress). For a screen reader user, this could produce aggressive/verbose announcement interruptions while typing a long span value.

**Mitigation already in place:** `aria-atomic="true"` is on `#att-results` (not on `#att-sanity`). Role "status" on `#att-sanity` has polite live behavior — AT waits for idle time, so partial typing isn't announced mid-keystroke in most AT implementations.

**Residual risk:** On some AT + browser combinations, even "polite" regions announce every update if the user stops typing for a moment. The verbose message is a UX quality concern, not a WCAG failure. No code change required for compliance; an optional UX improvement would be debouncing the sanity message update (e.g., 300ms debounce) to reduce AT interruption frequency.

---

## Negative Findings (Confirmed Clean)

| Surface | Verdict | Notes |
|---|---|---|
| Test 5 math (160km × 0.22 = 35.20 dB > 35) | ✓ CLEAN | Independent re-derivation confirms RED threshold |
| Test 3 comment updated (< 28 dB) | ✓ CLEAN | Was `< 22 dB`, now correctly `< 28 dB` |
| Test 12 new assertion (1310nm radio disabled) | ✓ CLEAN | `radio.disabled = blocked` at line 657; assertion is stable |
| G.655 dispersion figures (~3-4 ps/nm·km) | ✓ CLEAN | Consistent with ITU-T G.655 §5 NZDSF specification |
| G.657.A2 grouped with G.652.D for dispersion | ✓ CLEAN | Same dispersion class per ITU-T G.657 §6.1 |
| fallbackTrigger captured BEFORE focus move | ✓ CLEAN | Assignment at line 876 precedes firstFocusable.focus() at line 878 |
| ESC key in fallback path (no trapFocus) | ✓ CLEAN | Document keydown listener fires when `!activeTrap` — correct |
| GPON note position (after primary, before dispersion) | ✓ CLEAN | Lines 200-209: wavelength===1490 block before spanKm>=40 block |
| 1:32 splitter ≈ 17 dB planning value | ✓ CLEAN | 15.05 dB theoretical + ~2 dB excess = ~17 dB — standard GPON planning |
| 1:8 splitter ≈ 11 dB planning value | ✓ CLEAN | 9.03 dB theoretical + ~1.5 dB excess ≈ 10.5–11 dB — defensible |
| Blocked radio label (opacity 0.45) | ✓ CLEAN | WCAG 1.4.3 disabled-component exception applies — no violation |
| `#att-blocked-warning` role="alert" | ✓ CLEAN | Fires when blocked=true, but auto-switch makes it transient |
| Modal scroll: max-height 90vh + overflow-y:auto | ✓ CLEAN | Handles tablet viewport (600px+) correctly |
| Script defer order design.html | ✓ CLEAN | focus_trap.js (line 313) before attenuation_calc.js (line 2229) in document order |
| DOMContentLoaded mount timing | ✓ CLEAN | Inline addEventListener registered before defer scripts execute; called after |
| node --check attenuation_calc.js | ✓ CLEAN | Syntax valid |
| node --check attenuation_calc.spec.js | ✓ CLEAN | Syntax valid |
| All 5 Polish-A canonical items | ✓ CLEAN | No regressions found in Polish-A changes |

---

## Coverage Gaps

- Did not run Playwright tests live (no DB/browser environment) — static analysis only. The FINDING-1 structural issue (missing HTML wiring on main) was identified from git branch analysis, not a live test run.
- Did not verify CSS variable `--primary-light` and `--primary` are defined in both portal stylesheets (assumed from existing portal usage; no new CSS variables introduced).
- Did not test AT (screen reader) behavior live — FINDING-3 is derived from code reading and ARIA specification, not observed AT behavior.

---

## Closeout

**Write-path constraints acknowledged:** only `audit-output/attenuation-calc/FINALVERIFY_RT_F_PEDAGOGY_2026-05-20.md` written. No lesson files, no CLAUDE.md, no canonical files modified.

**1. `git log --oneline main..agent/attcalc-finalverify-rt-f`:**
(shown after commit below)

**2. `git diff --stat main..agent/attcalc-finalverify-rt-f`:**
(shown after commit below)

**3. Polish-A 5 items — per-item verdict:**

| Item | Verdict |
|---|---|
| NEW-1 (HIGH): Test 5 160km → RED | VERIFIED |
| NEW-2 (MED): Test 12 radio disabled assertion | VERIFIED |
| NEW-3 (LOW): G.655 fiber-type-aware dispersion advisory | VERIFIED |
| NEW-4 (LOW): Fallback focus-return via fallbackTrigger | VERIFIED |
| NEW-LOW (RT-C): GPON splitter IL inline note | VERIFIED |

**4. Residual findings:**

| # | Sev | Finding |
|---|---|---|
| FINDING-1 | MED | Portal wiring commit `efa0c83` not on main — design.html + splice.html don't load or mount the calc |
| FINDING-2 | LOW | Code comment line 861 falsely claims splice.html loads focus_trap.js |
| FINDING-3 | LOW | Sanity role="status" at 1490nm+≥40km may produce verbose AT output on keystroke |

**5. Overall verdict: YELLOW**

All 5 Polish-A items are correctly applied. The calculator code itself (`attenuation_calc.js` + test spec) is correct, math-sound, and field-appropriate. The YELLOW is driven by FINDING-1: the HTML portal wiring commit is stranded on a non-main branch, meaning the feature is unreachable in both live portals and the Playwright CI tests will fail. This is a merge/branch management issue, not a code correctness issue. Merging `agent/attenuation-calc-build` (or cherry-picking `efa0c83`) resolves it. The two LOW findings are documentation/quality items only.

=== RT-F FINAL VERIFY PEDAGOGY REPORT END ===
