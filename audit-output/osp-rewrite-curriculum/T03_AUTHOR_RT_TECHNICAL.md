# T03 Author RT — Technical Accuracy

## Verdict (≤80 words)

T03 is technically sound. All NESC loading district values match the verified brief (RUS 1724E-150 + IAEI). The ice-load formula constant, sag formula, wind-load formula, and all quiz answer derivations are correct. G.657.A1 values are precisely aligned with T02 L04's patched table. RUS MFD spec (9.2 µm ± 0.5 µm from 7 CFR 1755.902) and ICEA tensile rating (2,670 N/600 lbf) are accurately cited. Three LOW findings: one rounding label precision issue, one confusing bend-radius terminology, and one minor redundancy in L05 MFD cross-compatibility wording. No YELLOW or RED technical issues.

## Per-lesson grade (12 rows)

| Lesson | NESC values | Formulas | Quiz answers | Citations | Cross-topic consistency | Grade |
|---|---|---|---|---|---|---|
| L01 Loose-Tube/Tight-Buffer/Ribbon | N/A | N/A | All correct (MC, drag, FIB) | ICEA S-87-640, TIA-598-D, 7 CFR 1755.902, FOA — all plausible | T02 DAG prereqs correct | GREEN |
| L02 OSP/Riser/Indoor-Outdoor | N/A | N/A | All correct (OFNP/OFNR/50ft/dual-rated) | NEC §770.48(A) 50 ft rule confirmed via multiple public commentaries; HDPE 2–3% carbon black confirmed | NEC cross-refs consistent with L07 | GREEN |
| L03 Armor & Jacket Selection | N/A | N/A | All correct | CST UL §770.179(B), ICEA S-87-640, 7 CFR 1755.902 — sourced; OCC product data consistent | Consistent with L07 deep-dive | GREEN |
| L04 Messenger/Lashed vs ADSS | N/A | Sag formula correct (parabolic) | All correct | CommScope ADSS blog (no bonding/grounding), gl-fibercable.com EDS 16–25%, incabamerica.com 700 m span — all plausible | EDS/RTS values consistent with L09 | GREEN |
| L05 G.652 vs G.657 | N/A | Bend-loss values match T02 L04 table exactly | All correct | ITU-T G.657 2024, FOA bend radius — consistent | **G.657.A1 values align with T02 L04 patched table: 1 turn/10mm ≤0.75dB @1550nm + 10 turns/15mm ≤0.25dB @1550nm — EXACT MATCH** | GREEN |
| L06 Sheath & Jacket Material | N/A | N/A | All correct (HDPE, dry-block, LSZH) | HDPE/LSZH/flooding compound sourced; remee.com 3x faster for dry-block | Consistent with L02/L03 | GREEN |
| L07 Armor Deep-Dive | N/A | N/A | All correct | NEC §770.179(B) CST listing confirmed via OCC docs; dielectric/ADSS consistent | Consistent with L03/L04 | GREEN |
| L08 Drop Cable Selection | N/A | N/A | All correct (feeder/distribution/drop counts) | FOA FTTH design guide counts plausible; CommScope 432F ADSS limit consistent | G.657 prereqs from L05 correct | GREEN |
| L09 ADSS Span/Wind/Ice Loading | **ALL 3 districts VERIFIED** (Heavy 0.50/4/0°F, Medium 0.25/4/15°F, Light 0/9/30°F) | **Ice formula π×57/144=1.244 VERIFIED. Wind formula correct. Sag parabolic correct.** | All correct — Q1 (0 lb/ft Light district), Q2 (0.752 lb/ft Heavy, rounding defensible), Q3 (60 ft Extreme Wind), Q4 (sag quadruples) | RUS 1724E-150, IAEI 2002/2007 — confirmed via brief; paywalled markers present | Consistent with L04 EDS/RTS values | GREEN |
| L10 ICEA/CFR Standards | N/A | WorkedExample compliance checker correct (MFD 8.7–9.7, tensile ≥2670N, temp –40/+70) | All correct — Q1 (9.2±0.5), Q2 (2670N/600lbf), Q3 (qualification vs acceptance), Q4 (drag-match), Q5 (235µm lower limit) | 7 CFR 1755.902 eCFR — verified directly; ICEA tensile via archive.org + secondary | MFD values consistent with T02 L01 (9.2µm) and L11 | YELLOW (non-standard export pattern — schema issue per RT-pedagogy, not technical inaccuracy) |
| L11 Datasheet Reading | N/A | Planning attenuation formula correct (spec_max + aging) | All correct — Q1 (0.25+0.04=0.29), Q2 (±0.4 within ±0.5 RUS window), Q3 (drag-match), Q4 (bend radius pairs — low wording issue), Q5 (−40°C) | FOA aging 0.02–0.05 dB/km, Corning −40°C to +70°C consistent | Consistent with L10 MFD spec; aging factor consistent with OSP planning practice | YELLOW (schema export issue per RT-pedagogy; see L11 Q4 wording note) |
| L12 Capstone | N/A | Sag formula (L^2 quadratic) correct in Q15; ice load Q referenced correctly | All 20 Q answers independently verified — all correct; Cap Q20 (9.5+0.3=9.8 > 9.7 RUS limit) derivation confirmed | All lessons' citations correctly re-used | BranchingScenario uses `states` prop (pedagogy RT finding F1) — technical content within each state node is accurate; scenario logic and decisions are correct | GREEN (technical content); YELLOW pending prop fix |

## Math re-derivation (sample 10 worked-example values)

| Claim | Lesson value | RT independent calc | Match? |
|---|---|---|---|
| Ice formula constant: π×ice_density(57)/144 | 1.244 | π×57/144 = 1.2435 → rounds to 1.244 (4 sig figs) | ✓ MATCH |
| L09 Q2: w_ice for Heavy district, D=0.71 in, t=0.50 in | 0.752 lb/ft | 1.244×0.50×1.21 = 0.7526 (rounds to 0.753 at 3-decimal, 0.752 at 3-decimal using exact π×57/144=1.2435 → 0.7524) | ✓ MATCH (within constant precision) |
| L09 Slider: Light wind load, D=0.71 in, 9 lb/ft² | (0.71/12)×9 = 0.533 lb/ft | 9 × (0.71/12) = 0.5325 lb/ft | ✓ MATCH |
| L09 Slider: Total transverse, w_cable=0.068, w_wind=0.533 | √(0.068²+0.533²) | √(0.00462+0.2841) = 0.537 lb/ft | ✓ MATCH |
| L09 Sag doubles-L-test: L²∝sag quadruples when L×2 | "sag quadruples" | (2L)²/(8T) = 4×L²/(8T) | ✓ MATCH |
| L04 default sag: span=300m, w=0.15 kg/m, RTS=8900N, EDS=20% | ~9.3 m | T=1780N; w=1.472 N/m; sag=(1.472×90000)/14240 = 9.30 m | ✓ MATCH |
| L10 Q5: coating lower limit 250−15 | 235 µm | 250−15 = 235 µm | ✓ MATCH |
| L11 Q1: planning attenuation 0.25+0.04 | 0.29 dB/km | 0.25+0.04 = 0.29 dB/km | ✓ MATCH |
| L11 Q2: datasheet ±0.4 within RUS ±0.5 | PASS | 8.8–9.6 µm ⊂ 8.7–9.7 µm | ✓ MATCH |
| Cap Q20: MFD max = 9.5+0.3 vs RUS 9.7 upper limit | 9.8 µm — FAILS RUS | 9.5+0.3 = 9.8 > 9.7 | ✓ MATCH (correctly identified as failing RUS spec) |

## NESC value cross-check

| Value | Lesson states | Verified (via RUS 1724E-150 + IAEI) | Match? |
|---|---|---|---|
| Heavy district: ice | 0.50 in. radial | 0.50 in. radial | ✓ |
| Heavy district: wind | 4 lb/ft² | 4 lb/ft² | ✓ |
| Heavy district: temperature | 0°F | 0°F | ✓ |
| Medium district: ice | 0.25 in. radial | 0.25 in. radial | ✓ |
| Medium district: wind | 4 lb/ft² | 4 lb/ft² | ✓ |
| Medium district: temperature | 15°F | 15°F | ✓ |
| Light district: ice | 0 in. | 0 in. | ✓ |
| Light district: wind | 9 lb/ft² | 9 lb/ft² | ✓ |
| Light district: temperature | 30°F | 30°F | ✓ |
| Extreme Wind threshold | 60 ft above ground | 60 ft — IAEI 2007 article confirmed | ✓ |

## Cross-topic consistency check

**L05 G.657 vs T02 L04: ALIGNED**

T03 L05 states for G.657.A1:
- "1 turn at 10 mm radius: ≤ 0.75 dB at 1550 nm, ≤ 1.5 dB at 1625 nm"
- "10 turns at 15 mm radius: ≤ 0.25 dB at 1550 nm, ≤ 1.0 dB at 1625 nm"

T02 L04 table (patched values):
- G.657.A1, 1 turn/10mm: ≤0.75 dB @ 1550nm, ≤1.5 dB @ 1625nm
- G.657.A1, 10 turns/15mm: ≤0.25 dB @ 1550nm, ≤1.0 dB @ 1625nm

**EXACT MATCH.** Values are fully consistent across topics.

Minor note: T03 L05 `key_terms.trench-assisted profile` says "G.657.B2/B3 fibers" but the 2024 ITU-T G.657 edition absorbed B2 into A2. The lesson itself correctly flags this in the Working section and flashcards with "[verify 2024 edition consolidation]". The `key_terms` definition wording should ideally say "G.657.B3" rather than "B2/B3" to avoid confusion with the deprecated subcategory, but this is a minor wording issue, not a factual error in context of the lesson's explicit disclaimer.

**L11 datasheet values: CONSISTENT**

L11 WorkedExample Step 4 states: "datasheet shows 9.2 µm ± 0.4 µm at 1310 nm → within 7 CFR 1755.902's 9.2 µm ± 0.5 µm window → PASS." This is mathematically confirmed (8.8–9.6 µm ⊂ 8.7–9.7 µm). The Corning SMF-28 Ultra datasheet MFD spec of 9.2 µm ± 0.4 µm is consistent with publicly available Corning product data (Corning specifies 9.2 µm ± 0.4 µm for SMF-28 Ultra at 1310 nm). **PASS.**

**L10 ICEA / 7 CFR 1755.902: CORRECT SECTION REFERENCES**

7 CFR 1755.902 is correctly described as "Minimum Performance Specification for Fiber Optic Cables" — matches the eCFR title. RUS 1753F-201 is correctly cited as covering acceptance tests and measurements — matches USDA bulletin index. ICEA S-87-640 tensile rating 2,670 N (600 lbf) standard tier is confirmed via archive.org 2006 edition and secondary sources.

**L10 coating OD check:** Lesson states "250 ± 15 µm" as the 7 CFR 1755.902 requirement. Q5 answer: lower limit = 235 µm. Confirmed: 250 − 15 = 235 µm. **CORRECT.**

## Findings (severity-ranked)

### FINDING 1 — LOW
**L09 Q2: Answer label says "0.752 lb/ft" — technically rounds to 0.753 when using shorthand constant 1.244**

L09 Q2 choice C text: `1.244 × 0.50 × 1.21 = 0.752 lb/ft`. Step-by-step: 1.244 × 0.50 = 0.622; 0.622 × 1.21 = 0.75262 → at 3 decimal places this rounds to 0.753, not 0.752. However, using the exact derivation (π×57/144 = 1.24355), the result is 0.75235, which rounds to 0.752 at 3 decimal places. Both 0.752 and 0.753 are within standard engineering precision for this calculation. The choice text and explanation lead to the correct answer; no learner confusion likely.

**Suggested fix (optional):** Change choice C label from "0.752 lb/ft" to "≈ 0.752 lb/ft" or "0.75 lb/ft" to signal that the answer is a rounded approximation.

### FINDING 2 — LOW
**L11 Q4 explanation uses "more generous" to describe the LARGER installation bend radius — non-standard terminology**

The correct answer explains: "The installation bend radius is more generous (larger) because it is a short-duration stress; the long-term (loaded) radius is the tighter limit." In standard engineering usage, a "more generous specification" allows more latitude — meaning a smaller minimum radius is acceptable. A larger minimum radius is actually MORE RESTRICTIVE (you cannot bend as tightly). The explanation inverts this, calling the larger-number requirement "more generous."

The practical conclusion reached is correct: installation requires a larger minimum radius number (e.g., 20× OD) and long-term allows a smaller radius (e.g., 10× OD). But framing the larger-radius requirement as "more generous" may confuse learners when they later encounter standard engineering language.

**Suggested fix:** Revise explanation to: "The installation bend radius requires a larger minimum radius (typically 20× cable OD) because dynamic stress during pulling is more damaging to fiber than static routing. The long-term (loaded) radius allows a tighter (smaller) radius value permanently — typically 10× cable OD — because sustained gentle bending is less problematic than dynamic stress. Exceeding the long-term radius in a splice enclosure causes microbend loss over years."

### FINDING 3 — LOW
**L05 `key_terms` definition for `trench-assisted profile` references "G.657.B2/B3" — B2 absorbed into A2 in 2024**

`meta.key_terms` for `trench-assisted profile` states: "A refractive index design in G.657.B2/B3 fibers..." The lesson's Working section and the B2→A2 merger note both correctly flag this with `[verify 2024 edition consolidation]`. However, the `key_terms` definition does not include the merger caveat — a learner reading only the flashcard definition would see "B2/B3" as current, without the 2024 update disclaimer that the lesson body includes.

**Suggested fix:** Update the `trench-assisted profile` key_terms definition to: "...in G.657.B3 fibers (and formerly G.657.B2, which was merged into A2 in the 2024 ITU-T G.657 edition)..." to make the definition consistent with the lesson body.

## Clean items confirmed

- All 10 NESC district values (3 districts × ice/wind/temperature + Extreme Wind 60-ft trigger) independently verified
- Ice formula constant π×57/144 = 1.244 derivation confirmed and clearly explained in lesson
- Wind load formula (wind_pressure × D_iced / 12) is dimensionally correct (lb/ft² × ft = lb/ft)
- Sag parabolic formula (w×L²)/(8T) is correct engineering formula
- L09 WorkedExample JavaScript implementation (`windPressure * (D_iced / 12)`) matches lesson formula — no code/prose mismatch
- L04 sag WorkedExample formula and JavaScript (uses g=9.81 m/s² to convert kg/m to N/m): CORRECT
- G.657.A1 bend-loss values in T03 L05 exactly match T02 L04 patched table — no cross-topic drift
- 7 CFR 1755.902 MFD spec (9.2 µm ± 0.5 µm), coating OD (250 ± 15 µm), and 12-color coding claims all match eCFR public text (as cited in research brief)
- ICEA S-87-640 tensile rating 2,670 N (600 lbf): confirmed via archive.org + secondary; lower-tier 1,330 N properly marked [confirm current edition]
- Capstone Q20 MFD boundary check: 9.5 + 0.3 = 9.8 µm exceeds RUS 9.7 µm ceiling — correctly identified as failing RUS spec
- Operating temperature range −40°C to +70°C matches ICEA S-87-640 and Corning SMF-28 Ultra datasheet (as cited in research brief)
- EDS design target 16–25% of RTS: consistent across L04, L09, and capstone
- No AI meta-references in any lesson content
- No SHAs were claimed; no fabricated citations detected

## RT-pedagogy cross-check (end-only)

**Technical findings are fully independent of RT-pedagogy findings. No conflicts.**

Agreements:
- L10 and L11 schema export pattern issue (non-standard `export const key_terms` at module level vs `meta.key_terms`) — confirmed. This is a schema conformance issue, not a technical inaccuracy in the content itself. The definitions in both L10 and L11 are technically correct.
- L12 `BranchingScenario` using `states` prop instead of `nodes` prop — confirmed via source review. The technical content within each state node is accurate and the decision logic is correct; this is a component API issue only.
- L09 missing Book-vs-Field block — concur this is a missing pedagogical element, not a technical inaccuracy. The NESC paywalled markers present in the lesson body are appropriate.

Disagreements: None.

## Verdict: GREEN

All NESC loading district values are correct. All formulas (ice load, wind load, sag parabolic) are mathematically verified. All quiz answers independently re-derived and confirmed correct. G.657.A1 values precisely match T02 L04 patched table. 7 CFR 1755.902 and ICEA S-87-640 citations are accurate. No fabricated SHAs or citation mismatches detected. Three LOW findings — all wording/presentation issues, none factual errors. T03 is ready for the patch wave that addresses the schema/prop issues flagged by RT-pedagogy.

=== T03 AUTHOR RT-TECHNICAL END ===
