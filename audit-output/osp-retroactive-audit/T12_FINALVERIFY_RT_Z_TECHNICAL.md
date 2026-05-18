# T12 Final-Verify RT-ζ — Technical / Math / Cascade Framing

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T12_FINALVERIFY_RT_Z_TECHNICAL.md` written.**

Agent role: Read-only technical RT. NO lesson file edits. Pair-mate to RT-ε `ba1112b` (pedagogy framing).
Wave: Post-Polish-A `5a9e5c8`.
Token budget: 100K hard stop.

---

## 1. Registries and cascade-pattern step-1

**Citation registry:** Checked. ITU-T G.652.D, G.657, TIA-455 (FOTP series) not in registry for T12 — T12 is not in the registry's current scope (T01–T09, T18, T19). No registry hits to leverage; no cascade-pattern entries applicable (P1 §32.22xx, P2 H₂S IDLH, P3 Z359, P4 OM5 EMB — all irrelevant to testing-and-measurement topic).

**Known cascade patterns:** None of P1–P12 map to T12 content domain (fiber testing, OTDR, OLTS, PMD, CD). Cascade-defense framing instead focuses on internal formula/math consistency and primary-source numeric verification.

**Validator:** `node osp-training/scripts/validate-lesson-schema.js T12` — per RT-ε result: 15/15 PASS. Trust RT-ε verification (§8 RT-β duplicate-verification skip). Not re-running.

---

## 2. Polish-A fix verification (skip items RT-ε already covered)

Per §8 RT-β skip rule, RT-ε verified all 4 Polish-A items (NEW-1 UPC −45 to −55 dB, G-1 EIOR dedup, NEW-2 L-band boundary, NEW-3 G.657 short-term radii). Not re-verifying. Confirmed via RT-ε closeout at `ba1112b`.

---

## 3. Math independent re-derivation — CONFIRMED CLEAN

Re-derived all numeric claims in lessons NOT covered by RT-ε:

### L12 PMD budget (WorkedExample + Quiz)

| Claim | Expected | Verified |
|---|---|---|
| PMD = 0.2 × √80 = 1.79 ps | 0.2 × 8.944 = 1.789 ps | ✓ MATCH |
| 10 Gbps PMD limit (1/10 rule): 1/10 × 100 ps = 10 ps | Bit period = 100 ps → 10 ps | ✓ CORRECT |
| Max dist for G.652.D at 10G: (10/0.2)² = 2,500 km | 2,500 km | ✓ MATCH |
| G.652A on 80 km: 0.5 × √80 = 4.47 ps → fails 40G (2.5 ps limit) | 4.472 ps, limit 2.5 ps | ✓ CORRECT |
| Q2: 0.18 × √120 = 1.97 ps | 0.18 × 10.954 = 1.972 ps | ✓ MATCH |
| 40G PMD limit (1/10 rule): 1/10 × 25 ps = 2.5 ps | Bit period = 25 ps → 2.5 ps | ✓ CORRECT |

### L10 IOR distance error (WorkedExample + Quiz)

| Claim | Expected | Verified |
|---|---|---|
| WorkedExample: (0.0005/1.4677)×40,000 = 13.6 m | 13.63 m | ✓ MATCH |
| Quiz Q1: (0.0005/1.4675)×25,000 = 8.5 m | 8.52 m | ✓ MATCH (rounded) |

### L07 bidirectional splice averaging (WorkedExample)

| Claim | Expected | Verified |
|---|---|---|
| Splice 1: (0.08 + −0.04)/2 = 0.02 dB | 0.02 dB | ✓ MATCH |
| Splice 2: (0.25 + 0.31)/2 = 0.28 dB | 0.28 dB | ✓ MATCH |
| Splice 3: (0.15 + 0.13)/2 = 0.14 dB | 0.14 dB | ✓ MATCH |

### L02 bidirectional OLTS average + sanity check

| Claim | Expected | Verified |
|---|---|---|
| (3.42 + 3.68)/2 = 3.55 dB | 3.55 dB | ✓ MATCH |
| 3.55 dB ≈ 44% remaining | 10^(−3.55/10) = 44.2% | ✓ MATCH |

---

## 4. NEW FINDING — MED: L04 ghost distance formula internally inconsistent

**Verified by reading:** `osp-training/src/lessons/T12/L04-dead-zones-edz-and-adz.jsx:254-259`

```jsx
<h3>Ghost distance formula</h3>
<p>
  Ghost distance = 2 × (distance from OTDR port to primary reflector) × N, where N = 1, 2, 3...
</p>
<p>
  Example: OTDR port connector at 0 m, Connector A at 120 m.
  Ghost 1 = 2 × 120 m = 240 m. Ghost 2 = 3 × 120 m = 360 m (if high enough reflectance).
</p>
```

**Issue:** The formula `2 × D × N` (N=1,2,3...) is inconsistent with the example:
- N=1: 2 × 120 × 1 = 240 m ✓ (formula and example agree)
- N=2: 2 × 120 × 2 = **480 m** — but the example shows **360 m**

The example (360 m = 3 × 120 m) is physically correct. Ghost physics: each additional ghost adds one more round-trip leg from OTDR port to Connector A. Ghost 1 = 2D (one extra round trip), Ghost 2 = 3D (two extra legs), Ghost 3 = 4D. L05 (line 73-75) correctly confirms "2×, 3×, etc." as the distance sequence.

Correct formula: **Ghost_n = (n+1) × D** (n=1,2,3...), or equivalently: ghosts appear at 2D, 3D, 4D, ...

Quiz Q3 (connector at 250 m → ghost at 500 m) uses the N=1 case only and is correct.

**Severity: MED.** The formula as stated (`2 × D × N`) will produce a wrong answer (480 m vs. 360 m) if a learner mechanically applies it for the second ghost. The example gives the right answer, creating a contradiction a careful learner will notice. A learner applying the formula to find the second ghost while locating faults will dig in the wrong place.

**Fix shape:** Replace formula line with: `Ghost distance_n = (n + 1) × D, where n = 1, 2, 3...` (Ghost 1 = 2D, Ghost 2 = 3D, Ghost 3 = 4D). Update example verbiage to match.

---

## 5. Under-touched lesson cascade sweep (different from RT-ε)

RT-ε covered L12, L13, L14, L01. This RT covers L03, L06, L08 per protocol.

### L03 — OTDR pulse / range / averaging (Rayleigh backscatter coefficient)

Read key numeric claims. Rayleigh backscatter coefficient α_s cited in context of OTDR dynamic range. No independently-verifiable absolute numbers cited; all relative comparisons (narrow pulse vs. wide pulse tradeoffs). No cascade risk identified.

### L06 — Launch and receive cables, MFD matching

MFD mismatch gainer artifacts: lesson states "OTDR reads the splice as a gainer (negative dB loss)" when light transitions from small-MFD to large-MFD fiber. This is physically correct — more backscatter from the wider-mode fiber causes the OTDR to see apparent gain. No numerics to independently verify.

`vocabulary_assumed`: MFD → T02.L03. MFD is introduced in T02.L03. **DAG pointer: ✓ CORRECT.**

### L08 — Reading an OTDR trace

LSA (Least-Squares Algorithm) slope-fit description: "OTDR fits a straight line to the backscatter data in the cursor window." Correct description of the 2-point and 5-point LSA methods. No specific numeric claims requiring derivation.

---

## 6. Confirmed-clean list

- All PMD/CD math in L12: verified by independent derivation — 0 errors
- All IOR distance error math in L10: verified — 0 errors
- All bidirectional averaging math in L07 and L02: verified — 0 errors
- Ghost reflections in L04: **example is correct; formula has internal inconsistency (MED finding)**
- Quiz Q3 (ghost at 500 m): correct (first-ghost case only)
- L05 ghost sequence "2×, 3×, etc." cross-reference: correct and consistent with L04's example
- L06 DAG pointer MFD → T02.L03: verified correct
- Build: clean (per Polish-A closeout; not re-run — read-only RT)
- 4 Polish-A fixes: trusted per RT-ε verification (§8 skip)

---

## 7. Structured new findings

| # | Severity | Lesson | Location | Issue | Fix shape |
|---|---|---|---|---|---|
| Z-1 | MED | L04 | Lines 254-259 | Ghost distance formula `2×D×N` gives 480 m at N=2 but example correctly shows 360 m (=3×D). Inconsistency. | Replace: `Ghost_n = (n+1) × D, n=1,2,3...` — matches example and L05 confirmation |

---

## 8. Saturation verdict

**RT-ε (pedagogy):** found 2 LOW items — G.652.D cable/fiber spec ambiguity in L09 (noted by Polish-A as neighborhood flag) and GR-196 registry gap.

**This RT-ζ (technical):** found 1 MED item (L04 ghost formula inconsistency). All math verified clean.

**VERDICT: YELLOW** — 1 MED finding (formula inconsistency). Not a fabricated value or cascade bug; example is physically correct and quiz is unaffected. Requires a one-line formula fix + example update.

**SATURATION:** The two RT framings together found 1 MED + 2 LOW. No HIGH items. The MED is a presentation/formula error (not a fact error — the example is correct). After the L04 ghost formula fix is applied, I expect a single final-verify RT would return GREEN (the remaining LOW items are informational). Saturation appears close but the MED requires a fix wave before declaring done.

=== T12 FINALVERIFY RT-Z TECHNICAL REPORT END ===
