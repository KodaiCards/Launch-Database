# T03 Research Brief RT-B — Process + Math Re-derivation

**Verifier:** RT-B (Math Re-derivation + Paywalled Process Check framing)
**Date:** 2026-05-16
**Scope:** `audit-output/osp-rewrite-curriculum/T03_RESEARCH_BRIEF.md` (committed at `6f10b68`)
**Method:** Independent arithmetic re-derivation + WebSearch for NESC loading district confirmation + DAG cross-check against actual T01/T02 lesson `vocabulary_introduced` exports
**Word count:** ~1,850

---

## Verdict (≤80 words)

**YELLOW.** Most math re-derives correctly. Two HIGH findings: (1) the L09 brief-defined Heavy loading district values are wrong — Heavy wind = 4 lb/ft² and temp = 0°F, not 9 lb/ft²/15°F as stated (transposition of Light values onto Heavy). (2) The L09 author-note ice-load formula uses `(1/12)` where dimensional analysis requires `(1/144)` — 12× overcalculation if used as written. Both are authoring blockers. The sag worked examples in L04 and L09 are arithmetically correct. RT-A independently confirmed finding #1; this RT caught finding #2 separately.

---

## Math re-derivation (every formula in brief)

### L04 — ADSS Sag (parabolic approximation)

**Brief states:** `w = 0.15 kg/m × 9.81 m/s² = 1.47 N/m`, `T = 20% × 8,900 N = 1,780 N`, `sag = (1.47 × 90,000) / 14,240 = 132,300 / 14,240 = 9.3 m`

**RT-B independent derivation:**
- `w = 0.15 × 9.81 = 1.4715 N/m` (brief rounds to 1.47 — acceptable)
- `T = 0.20 × 8,900 = 1,780 N` ✓
- `8 × T = 14,240` ✓
- Numerator: brief uses rounded `1.47 × 90,000 = 132,300`; unrounded gives `1.4715 × 90,000 = 132,435`
- Sag (rounded): `132,300 / 14,240 = 9.291 m → 9.3 m` ✓; unrounded: `132,435 / 14,240 = 9.300 m` — same final answer
- Sag as % of span: `9.3 / 300 = 3.10%` ✓ (brief says 3.1%)

**Result: MATCH — L04 sag arithmetic correct.**

| Claim | Brief's value | RT-B independent calc | Match? |
|---|---|---|---|
| w (N/m) | 1.47 | 1.4715 (rounds to 1.47) | ✓ |
| T (N) | 1,780 | 1,780 | ✓ |
| 8 × T | 14,240 | 14,240 | ✓ |
| Numerator | 132,300 | 132,435 (unrounded); 132,300 (rounded w) | ✓ (rounding path consistent) |
| Sag (m) | 9.3 | 9.3 | ✓ |
| Sag as % span | 3.1% | 3.10% | ✓ |

---

### L09 — ADSS Ice + Wind Load (Light district worked example)

**Brief states:** cable OD = 18 mm = 0.059 ft, w = 0.15 kg/m = 0.101 lb/ft, wind load = 9 × 0.059 = 0.53 lb/ft, total = √(0.101² + 0.53²) = 0.54 lb/ft, sag = (0.54 × 200²)/(8 × 400) = 6.75 ft

**RT-B independent derivation:**
- Cable OD: `18 mm / 304.8 mm·ft⁻¹ = 0.05906 ft` → rounds to 0.059 ft ✓
- Weight: `0.15 kg/m × 2.20462 lb/kg / 3.28084 ft/m = 0.1008 lb/ft` → rounds to 0.101 lb/ft ✓
- Wind load: `9 lb/ft² × 0.05906 ft = 0.5315 lb/ft` → rounds to 0.53 lb/ft ✓
- Total transverse: `√(0.101² + 0.53²) = √(0.01020 + 0.28090) = √0.29110 = 0.5395 lb/ft` → 0.54 lb/ft ✓
  - Note: brief states `0.53² = 0.281` — actual = 0.2809; negligible rounding error, final answer unaffected
- Sag: `(0.54 × 40,000) / 3,200 = 21,600 / 3,200 = 6.75 ft` ✓
- Sag as % of span: `6.75 / 200 = 3.375%` → 3.4% ✓

**Result: MATCH — L09 Light-district sag arithmetic correct.**

| Claim | Brief's value | RT-B independent calc | Match? |
|---|---|---|---|
| Cable OD (ft) | 0.059 | 0.05906 (rounds to 0.059) | ✓ |
| Cable weight (lb/ft) | 0.101 | 0.1008 | ✓ |
| Wind load (lb/ft) | 0.53 | 0.5315 | ✓ |
| 0.53² | 0.281 (brief) | 0.2809 | Minor rounding |
| Total transverse (lb/ft) | 0.54 | 0.5395 | ✓ |
| Sag (ft) | 6.75 | 6.75 | ✓ |
| Sag % span | 3.4% | 3.375% | ✓ |

---

### L05 — G.657 Bend Radius Thresholds

| Subcategory | Brief's min bend radius | ITU-T G.657 (2024) standard value | Match? |
|---|---|---|---|
| G.657.A1 | 10 mm | 10 mm | ✓ |
| G.657.A2 | 7.5 mm | 7.5 mm | ✓ |
| G.657.B3 | 5 mm (some products 2.5 mm) | 5 mm standard; OFS EZ-Bend Ultra rated 2.5 mm | ✓ |
| B2 merged into A2 in 2024 | Stated as fact with [confirm] marker | Confirmed from ITU-T 2024 publication metadata | ✓ |

---

### L02 — NEC Fire Ratings

| Claim | Brief's value | Standard | Match? |
|---|---|---|---|
| OFNP → UL 910 / NFPA 262 | UL 910 / NFPA 262 | Correct: NFPA 262 = plenum test (formerly UL 910) | ✓ |
| OFNR → UL 1666 | UL 1666 | Correct: UL 1666 = vertical flame propagation (riser) | ✓ |
| Substitution hierarchy: OFNP replaces OFNR | Higher rating substitutes lower | Correct per NEC Art. 770 hierarchy | ✓ |
| Unlisted OSP cable: 50 ft max inside | NEC §770.48(A) | Confirmed ≥3 independent NEC commentary sources | ✓ |

---

### L09 Author-Note — Ice Load Formula — **HIGH ERROR**

**Brief states (in "Author note" section):**
```
Ice load per ft = π × (D_ice² - D_cable²) / 4 × 57 lb/ft³ × (1/12)
where D_ice = cable OD + 2 × ice radial thickness (in inches), D_cable = cable OD (in inches)
```

**RT-B dimensional analysis:**

If D is in **inches**, then `π × (D_ice² - D_cable²) / 4` yields an area in **in²**.

To convert in² to ft², divide by **144** (12² = 144 in²/ft²), **not by 12**.

The brief's formula uses `(1/12)`, which would convert linear inches to feet — correct for a length dimension, **not** for an area dimension. Applying `(1/12)` to an in² result produces lb/ft values that are 12× too large.

**Independent derivation using NESC standard formula:**
```
w_ice = [π × (D_ice² - D_cable²)/4] / 144 × 57 lb/ft³   [D in inches]
     = π × 57/144 × t × (D_cable + t)    [linearized, t = radial ice thickness in inches]
     = 1.244 × t × (D + t)               [constant = π×57/144 = 1.2435 ≈ NESC's 1.244]
```

Verified with Heavy district (0.5 in ice, 18 mm OD cable):
- Correct: `1.244 × 0.5 × (0.709 + 0.5) = 0.752 lb/ft`
- Brief's formula as written: `1.899 in² / 12 × 57 = 9.02 lb/ft` — 12× overcalculation

The correct formula to give authors uses either:
1. `π × (D_ice² - D_cable²) / 4 / 144 × 57` (areas in in², conversion /144)
2. `1.244 × t × (D + t)` (NESC standard linearized shorthand, D and t in inches)

**Severity: HIGH** — the formula is in the "Author note" section, meaning it will be copy-pasted by the author wave directly into the L09 lesson. A student using it would calculate wildly incorrect ice loads (12× too high). The note directs authors to "build this as a WorkedExample calculator" — if built verbatim with `(1/12)`, every Heavy-district lesson example would show catastrophically wrong values.

---

## Process check per paywalled claim (6)

| Claim | Brief source 1 | Brief source 2 | RT-B convergence | Verdict |
|---|---|---|---|---|
| ICEA S-87-640 §4 buffer tube count | 7 CFR 1755.902 (eCFR public) | archive.org 2006 edition | eCFR confirms 12-color scheme consistent with §4 structure; archive.org 2006 publicly accessible at law.resource.org | CONVERGED |
| ICEA S-87-640 §7 armor thickness | OCC product docs | archive.org 2006 | OCC cites §770.179(b) compliance; secondary armor specs consistent across vendor + archive sources | CONVERGED |
| NEC §770.48(A) 50 ft rule | 3 public NEC commentaries | — (paywalled NEC) | Additional confirmations via ppc-online.com, cablinginstall.com, mikeholt.com — independently cite "50 ft" without leading to each other | CONVERGED ≥3 sources |
| ITU-T G.657 bend-loss test conditions (turns, dB limit) | OFS datasheets | T02 brief `[confirm edition]` markers | T02 was patched (`e41b088`) for G.657.A1 test conditions. T03 brief does NOT reproduce test-condition turn counts — only minimum design bend radii, which are confirmed. Brief correctly inherits `[confirm edition]` markers | PROTECTED BY MARKER — process sound |
| NESC C2-2023 Table 250-1 loading district values | RUS 1724E-150 | IAEI Magazine 2002 | RT-B WebSearch confirms: Heavy = 4 lb/ft² wind at 0°F; Light = 9 lb/ft² at 30°F via ≥2 independent engineering sources. **Brief's claim table has Heavy = 9 lb/ft²/15°F — these are WRONG.** Source chain is sound but brief's author mis-transcribed Heavy values into the claim table. See HIGH finding below. | PARTIAL — source chain correct; brief's table has transcription error |
| ICEA S-87-640 §6 HDPE carbon black properties | bwnfiber.com | shobeirshimi.com | Multiple additional independent sources confirm "2–3% carbon black in HDPE for UV stabilization" — convergence clear | CONVERGED |

**Process verdict:** For 5 of 6 paywalled claims, the research chain is sound — the researcher found real secondary sources that actually say what they claim. The NESC loading district claim has sound sources, but the researcher's transcription of the Heavy district values into the brief's claim table swapped Light values for Heavy values. This is a "researcher read the sources correctly but mis-transcribed into the table" error, not a hallucination of fabricated values.

---

## DAG prerequisite invariant check

Cross-checked T03 brief's `vocabulary_assumed` block against actual `vocabulary_introduced` arrays in the shipped T01 and T02 lesson `.jsx` files.

| Term (claimed from T01/T02) | In actual vocabulary_introduced? | Assessment |
|---|---|---|
| OSP, ISP | T01.L01 ✓ | OK |
| span, attachment, sag, midspan | T01.L02 ✓ | OK |
| sheath, buffer tube, armor, messenger | T01.L03 ✓ | OK |
| splice case, splice tray, gel seal, fan-out | T01.L04 ✓ | OK |
| FDH, NAP, drop, feeder | T01.L07 ✓ | OK |
| SMF, MMF, HDPE, ADSS, NEC, NESC, TIA, FCC | T01.L08 ✓ | OK |
| ITU-T, ICEA | T01.L09 ✓ | OK |
| **RUS** (standalone) | T01.L05 has `RUS Form 219` but NOT bare `RUS` | **DAG gap — MEDIUM** |
| **BICSI** | Not in T01.L08 or any T01 lesson `vocabulary_introduced` | **DAG gap — MEDIUM** |
| **ribbon** | Not in T01 `vocabulary_introduced` (T01.L03 has sheath/buffer tube/armor but not ribbon) | LOW — T03 itself introduces ribbon formally in L01; brief's `vocabulary_assumed` listing is inaccurate but T03 L01 covers it |
| wavelength, macrobend, microbend, dispersion, PMD | T02 L03/L04 ✓ | OK |
| dB, dBm | T02.L05 ✓ (`dBm` formally introduced) | OK |
| link budget | T02.L06 ✓ | OK |
| OM3, OM4, OM5, OS2 | T02.L08 ✓ | OK |
| total internal reflection, NA, critical angle | T02.L01 ✓ | OK |
| G.657 (generic) | T02.L04 ✓ (`G.657` and `bend-insensitive fiber`) | OK |
| **G.652.D** (full designation) | Used extensively in T02 lesson content but NOT in any T02 `vocabulary_introduced` list | **DAG gap — HIGH** |
| **G.657.A1** (subcategory) | T02.L04 introduces `G.657` generic but NOT `G.657.A1` specifically | **DAG gap — MEDIUM** |
| **MFD** | Used in T02.L04/L10/L11 content but NOT in any T02 `vocabulary_introduced` list | **DAG gap — HIGH** |
| **OSNR** | NOT found anywhere in T02 lesson content or `vocabulary_introduced` | **DAG gap — HIGH** |
| `dB/dBm` (slash notation) | T02.L05 has `dBm` separately; `dB` is in `dBm`'s lesson but slash-combined notation not in vocab | LOW — pedagogically covered |

**DAG gap summary:**

- **HIGH:** `G.652.D` — T03 relies on T02's full physics treatment but T02's `vocabulary_introduced` only implicitly covers it through lesson content, never via a formal `vocabulary_introduced` entry. Same for `MFD` — used 4+ times in T03 in splice-compatibility and spec-reading contexts. `OSNR` is listed as assumed from T02 but does not appear anywhere in T02's content or vocabulary.
- **MEDIUM:** `G.657.A1` subcategory; `BICSI` (standards body); `RUS` standalone (only `RUS Form 219` is formally introduced).
- **LOW:** `ribbon` (T03 L01 fully introduces it); `dB/dBm` slash notation (component terms covered).

The `OSNR` gap is the most concerning: T03 brief lists it as T02-introduced vocabulary, but OSNR appears zero times in any T02 lesson file — it was never taught. If T03 authors write lesson content referencing OSNR without defining it, this is a strict prerequisite invariant violation. However, reviewing the T03 brief's lesson content plans, OSNR does not appear to be substantively used in any T03 lesson body — so the practical impact may be limited. The `vocabulary_available` section in the brief may simply have included OSNR speculatively.

---

## RT-A cross-check (end-only compare-and-contrast)

RT-A's report (committed `17a9e2e`) independently identified:
- **M1:** Heavy district wind pressure transposition (9 lb/ft² listed, should be 4 lb/ft²) — **AGREE, RT-B confirms independently**
- **M2:** Heavy district temperature (15°F listed, should be 0°F) — **AGREE, RT-B confirms independently**
- **L1:** Medium district temperature (15°F) lacks publicly confirmed secondary source — **AGREE**
- **L2:** 700 m ADSS span citation inaccessible — **AGREE, low risk**

RT-B found two additional issues RT-A did not flag:
- **HIGH — Ice load formula `(1/12)` dimensional error** — not in RT-A's report
- **HIGH/MEDIUM — DAG gaps (MFD, G.652.D, OSNR, G.657.A1)** — not in RT-A's scope

Both RTs converge on the NESC loading district values as the primary citation error. RT-B's math derivation confirms all four sag/load arithmetic steps are numerically correct (for Light district).

---

## Findings (severity-ranked)

### HIGH — H1: L09 ice-load formula unit conversion error (`1/12` should be `1/144`)

**Location:** T03_RESEARCH_BRIEF.md, L09 "Author note" section  
**Issue:** Formula `π × (D_ice² - D_cable²) / 4 × 57 lb/ft³ × (1/12)` is dimensionally wrong when D is in inches. Converting in² to ft² requires dividing by 144, not 12. As written, the formula overcalculates ice load by 12×. The correct formula is either `[π(D²_ice − D²_cable)/4] / 144 × 57 lb/ft³` or the equivalent NESC shorthand `w_ice = 1.244 × t × (D + t)` where D and t are in inches.  
**Risk:** Authored L09 lesson includes this as a WorkedExample calculator. Students and engineers computing Heavy-district ice loads from this lesson would get values 12× too high, causing massive over-specification of cable and hardware.  
**Fix:** Replace the author-note formula with the NESC standard: `w_ice = 1.244 × t × (D + t) lb/ft` where D = cable OD (in.) and t = radial ice thickness (in.). Note this is the NESC linearized approximation (full circle annulus formula: `[π(D_ice² − D_cable²)/4] / 144 × 57`).

### HIGH — H2: G.652.D and MFD not in T02 `vocabulary_introduced` (DAG violation)

**Location:** T03 brief `DAG Position & Vocabulary Boundary` section; T02 lesson meta exports  
**Issue:** T03 lists `G.652.D (full physics)` and `MFD` as vocabulary available from T02. Cross-check against actual T02 lesson `.jsx` files confirms neither term appears in any T02 lesson's `vocabulary_introduced` array. Both are used extensively in T02 lesson prose/content, but the DAG contract requires formal `vocabulary_introduced` entries. T03 authors will write lessons assuming students have seen formal `G.652.D` and `MFD` definitions — if T02 doesn't formally introduce them, the prerequisite is missing.  
**Fix:** T02 lessons should add `G.652.D` to `vocabulary_introduced` (likely T02.L02 or L01) and `MFD` (likely T02.L04). Alternatively, T03.L05 must formally introduce `G.652.D` and `MFD` before using them in lesson content.

### HIGH — H3 (confirmed with RT-A): Heavy loading district values transposed in L09 claim table

**Location:** T03_RESEARCH_BRIEF.md, L09 vocabulary definition block and claims table  
**Issue:** Heavy district wind = 9 lb/ft² and Heavy district temp = 15°F — both wrong. Heavy = **4 lb/ft² wind + 0°F**. The 9 lb/ft² and 30°F are Light district values; 15°F is Medium temperature. Multiple independent sources confirm (RT-A M1/M2, RT-B WebSearch).  
**Fix:** Same as RT-A M1+M2: correct both the vocabulary definition block and the claims table to `Heavy: 0.50 in. ice + 4 lb/ft² wind + 0°F`.

### MEDIUM — M1: OSNR listed as T02-assumed vocabulary but absent from all T02 content

**Location:** T03 brief `DAG Position & Vocabulary Boundary` — From T02 assumed list  
**Issue:** `OSNR` listed as available from T02 but does not appear in any T02 lesson file (zero occurrences). T03 lesson content does not appear to substantively use OSNR, so the practical impact is limited. However, the DAG boundary document is inaccurate.  
**Fix:** Remove OSNR from T03's `vocabulary_assumed` From-T02 list. If T03 authors need OSNR, define it in the relevant T03 lesson.

### MEDIUM — M2: BICSI and standalone RUS not formally introduced in T01

**Location:** T03 brief DAG section; T01 lesson vocabulary_introduced arrays  
**Issue:** T01.L08 introduces `TIA`, `FOA`, `NEC`, `NESC` but NOT `BICSI`. T01.L05 introduces `RUS Form 219` but NOT bare `RUS`. T03 uses both in standards-reference contexts.  
**Fix:** T01.L08 should add `BICSI` to its `vocabulary_introduced`. T01.L01 or L05 should add `RUS` as a standalone term. If T01 edits are out of scope for T03 authoring wave, T03 authors must introduce BICSI and RUS formally in whichever T03 lesson first uses them.

### LOW — L1: G.657.A1 subcategory not in T02 `vocabulary_introduced` (only generic G.657)

**Location:** T02.L04 `vocabulary_introduced`  
**Issue:** T02.L04 introduces `G.657` and `bend-insensitive fiber` but not `G.657.A1` specifically. T03 L05 builds heavily on A1/A2/B3 subcategories. This is partially mitigated by T02.L04 lesson content which does discuss A1 in prose — but the formal vocabulary_introduced entry is missing.  
**Fix:** T02.L04 should add `G.657.A1`, `G.657.A2`, `G.657.B3` to `vocabulary_introduced`. Alternatively, T03.L05 formally introduces these subcategories as "extensions of G.657 introduced in T02" — which is pedagogically defensible.

---

## Verdict: YELLOW

Three HIGH findings: ice-load formula dimensional error (unique to RT-B), NESC loading district value transposition (confirmed with RT-A), and MFD/G.652.D DAG gaps. All three are authoring blockers. The sag arithmetic in L04 and L09 is numerically correct for the Light district worked example. Fix H1 + H3 before dispatching any author agents for L09. Fix H2 before T03 authoring uses MFD or G.652.D.

**GREEN upgrade conditions:**
1. Fix H1: Correct L09 author-note ice formula to use `1.244 × t × (D + t)` or `/144` not `/12`.
2. Fix H3: Correct Heavy district values in both vocabulary block and claims table (4 lb/ft² wind, 0°F).
3. Fix H2: Either add `G.652.D` and `MFD` to T02 vocabulary_introduced, or have T03 L05 formally introduce them.

=== T03 RT-B PROCESS + MATH END ===
