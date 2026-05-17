# T14 Post-Author RT-β — Technical / Cascade-Defense Framing

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T14_POSTAUTH_RT_B_TECHNICAL.md` written.**

**Wave:** T14 Author Wave (12 lessons, a9b6c9e)
**Role:** RT-β (technical / numeric / cascade-defense framing)
**Pair-mate:** RT-α `e82f3c3` YELLOW (9 LOW findings — F-1 through F-9)
**Date:** 2026-05-17
**Token use:** within 130K cap

---

## 1. Registry + Cascade-Pattern Step-1

**Citation registry check (per §8 RT-β duplicate-verification skip rule):**

Skipped per RT-α: NEC §250.x family, OSHA §1910.147, RUS 1751F-630 §7 — all registry-verified <90 days.

**Net-new citations not in registry — primary-source verification performed this pass:**
- IEEE 81 (§9.3 fall-of-potential, §9.4 clamp-on): section numbers confirmed via IEEE tutorial handout (ewh.ieee.org) and AGI USA overview. 62% rule = 61.8% in primary standard — matches lesson's "62%" usage which is the conventionally rounded value. Current edition: IEEE 81-2012. The 5× rod-length minimum for current probe is confirmed industry-standard for this method.
- IEEE Std 1100-2005 (Emerald Book): confirmed paywalled. Published 2005. Cited as §1.2–1.3, §8.3, §8.5, §8.6. CANNOT confirm specific section content from public sources. Lessons must carry `[confirm edition]` guards on section references. **Critical finding: IEEE 1100 §8.3's "18–24 inches" claim for ring electrode depth — see Finding R-1 below.**
- Telcordia GR-1275: confirmed as standard for CO/Network Equipment installation with ≤5 Ω ground resistance threshold for equipment rooms. Current edition listed as GR-1275 Issue 2010 from Intertek/CenturyLink references. Lesson's `[confirm edition]` guards are correct.
- NACE SP0169: confirmed as the cathodic protection standard for underground metallic piping; rebranded to AMPP SP0169 (most recent 2024). L09 carry `(now AMPP SP0169 [confirm current edition])` — correct.
- NEC §250.52(A)(4) ring electrode: confirmed from multiple eCFR/UpCodes sources — minimum conductor size is **2 AWG** (not #2 AWG per NEC but same size), minimum depth **30 inches** (762 mm). See Findings R-1 and R-2 below.

**Cascade-pattern step-1 — P1 through P12 against T14:**

| Pattern | Status |
|---|---|
| P1 (47 CFR §32.2210) | Not applicable — no Part 32 citations in T14 |
| P2 (H₂S IDLH cascade) | Not applicable — no atmospheric-hazard values in T14 |
| P3 (ANSI Z359 mis-cite) | Not applicable — no fall-arrest citations |
| P4 (OM5 EMB fabricated) | Not applicable — no fiber EMB specs in T14 |
| P5 (FR page number cascade) | Not applicable — no FR citations in T14 |
| P6 (broken DAG pointers) | **SEE Finding R-3** — T14.L02 introduces `MGN`, T14.L05 introduces `IBT`+`GES`; T01.L08 introduces all three (concept-level). Same pattern as RT-α F-1 (`primary protector`). Three additional duplicate-introduction DAG entries beyond F-1 and F-2. |
| P7 (NESC §-vs-Rule notation) | Checked L01/L02/L03/L07/L11: uses "NESC Section 09" (correct), "NESC Rule 96F" (correct), "NESC Rule 97" (correct), "NESC C2-2023 Rule 97" (correct). Clean. |
| P8 (NEC Ch9 fill misattribution) | Not applicable — no conduit fill citations |
| P9 (47 CFR §1.141x cluster) | Not applicable — no pole-attachment complaint citations |
| P10 (FCC 23-109 betterment) | Not applicable |
| P11 (NWP 12 vs NWP 57) | Not applicable |
| P12 (edition currency) | L06 and L07 cite IEEE 81 and IEEE Std 1100 without edition year — see RT-α F-3 and F-4. Those are LOW edition guards already flagged. No additional P12 instances. |

---

## 2. Math Re-Derivation

All numeric claims in T14 independently re-derived:

**L06 — Fall-of-potential probe placement:**
- Current probe minimum for 8-ft rod: 5 × 8 ft = **40 ft** ✓ (IEEE 81 §9.3 minimum = 5× rod length)
- Potential probe at 62% position: 0.62 × 40 ft = **24.8 ft** ✓
- ±10% validation movement: 0.10 × 40 ft = **±4 ft** ✓
- Quiz Q1: current probe = 40 ft → correct: 2 (option C) ✓
- Quiz Q2: potential probe = 24.8 ft → correct: 1 (option B) ✓
- Quiz Q3 variation check: deviation = (18.2 - 18.0) / 18.0 × 100% = 1.11% → well within ±2% threshold → correct: 1 (option B) ✓
- Quiz Q4: clamp-on not valid for new single rod → correct: 1 (option B) ✓

**L11 — Grounds per mile calculation:**
- Quiz Q3: 5 miles × 5,280 ft/mile = 26,400 ft ÷ 1,320 ft = exactly **20** → correct: 2 (option C "20") ✓
- WorkedExample formula: `Math.ceil(routeFt / controllingInterval)` with 5 mi × 5280 = 26,400, ÷ 1320 = 20.0, `Math.ceil(20.0) = 20` ✓

**L12 Capstone — route grounding calculation:**
- Q16: 3 miles × 5,280 ft = 15,840 ft ÷ 1,320 ft = exactly **12** → correct: 2 (option C "12") ✓
- Q19: FDH 4 Ω ≤ 5 Ω GR-1275 = PASS; aerial pole 22 Ω ≤ 25 Ω NEC §250.56 = PASS → correct: 0 (option A) ✓

**L04 — Parallel rod resistance formula (prose, body):**
- (40 × 38) / (40 + 38) = 1,520 / 78 = 19.487... ≈ **19.5 Ω** ✓

**All math re-derivations PASS.**

---

## 3. Structured New Findings

| # | Sev | Category | File | Line area | Issue | Fix shape |
|---|---|---|---|---|---|---|
| R-1 | **MED** | Technical accuracy / NEC compliance | L04 | line 173, body prose | Body prose attributes "18–24 inches depth" to IEEE Std 1100 §8.3 for the ground ring. **NEC §250.52(A)(4) mandates a minimum depth of 30 inches (762 mm).** 18–24 inches violates the NEC code minimum. Lesson teaches a spec that could lead a learner to install a non-code-compliant ring electrode. If IEEE 1100 §8.3 does recommend 18–24 inches (paywalled — cannot confirm), that recommendation cannot override the NEC minimum; the lesson must state clearly that NEC §250.52(A)(4)'s 30-inch floor governs. | Change body prose to: "NEC §250.52(A)(4) requires a minimum burial depth of 30 inches (2.5 feet). IEEE Std 1100 §8.3 may recommend deeper burial for specific facility types [confirm edition] — but the 30-inch NEC minimum is the non-negotiable floor." Remove the "18–24 inches" value. |
| R-2 | **MED** | Omission / completeness | L04 | `ring electrode` key_terms definition (line 44) | The `ring electrode` flashcard definition lists "at least 2.5 feet" depth and "at least 20 feet" length, but **omits the minimum conductor size**. NEC §250.52(A)(4) explicitly requires "bare copper conductor not smaller than 2 AWG." A learner using this flashcard as a reference will not know the wire gauge requirement. The lesson body only mentions "#2 AWG minimum for large enclosures" (attributed to IEEE 1100) — which is correct on the size but incorrectly sources it. | Add conductor size to the `ring electrode` flashcard definition: "…bare copper conductor (minimum 2 AWG), at least 20 feet total length, buried at least 2.5 feet (30 inches) deep. Per NEC §250.52(A)(4)." This makes the flashcard self-contained and code-grounded. |
| R-3 | **LOW** | DAG/Schema | L02, L05 | `vocabulary_introduced` arrays | Same duplicate-introduction pattern as RT-α F-1 and F-2: **T14.L02 introduces `MGN`** and **T14.L05 introduces `IBT` and `GES`** — but T01.L08 already lists all three in its `vocabulary_introduced`. The architecturally correct split (T01.L08 = concept-level acronym awareness; T14.L02/L05 = deep technical treatment) is pedagogically defensible, but the DAG validator flags three additional duplicate-introduction entries. Consistent fix pattern: for each term, remove from T14 `vocabulary_introduced`, add to `vocabulary_assumed` with `source_lesson_id: 'T01.L08'`, and keep the full technical flashcard definition in lesson prose. | Same approach as F-1 (`primary protector`): demote `MGN` from T14.L02 `vocabulary_introduced` → `vocabulary_assumed` (source T01.L08); demote `IBT` and `GES` from T14.L05 `vocabulary_introduced` → `vocabulary_assumed` (source T01.L08). Retain key_terms flashcards with the deeper definitions — they deepen T01.L08's awareness-level cards. |
| R-4 | **LOW** | Internal inconsistency | L04 | key_terms definition (line 44) vs. body prose (line 173) | The `ring electrode` flashcard correctly says "at least 2.5 feet" depth (= 30 inches, matching NEC). The lesson body says "18–24 inches depth" (IEEE 1100 §8.3). A learner who reads both encounters contradictory depth specs within the same lesson. The key_terms card is correct; the body is wrong (or at best misleading without a NEC-overrides caveat). This is a direct consequence of R-1 — fixing R-1 (correcting the body prose to 30 inches minimum) also resolves R-4. | Resolved by R-1 fix. Flag here for completeness so the fix-agent corrects both locations together. |

---

## 4. Confirmed-Clean Items (RT-β scope)

Items verified against primary sources or independent derivation:

- All quiz math in L06, L11, L12 independently re-derived — 100% correct
- L04 parallel-resistance formula: (40 × 38)/(40 + 38) ≈ 19.5 Ω ✓
- L06 clamp-on restriction (IEEE 81 §9.4: invalid for new single-rod acceptance testing) — technically correct, confirmed against AGI USA IEEE 81 overview
- L06 fall-of-potential procedure sequence (5× spacing, 62% positioning, ±10% validation) — confirmed against IEEE 81-2012 tutorial and Metrel application note
- L07 protection coordination chain (gas-tube first stage → MOV second stage → equipment immunity) — technically sound per industry-standard protection design practice
- L07 NESC Rule 97 citation for arrester placement — section number notation format correct per T14 P7 check
- L09 NACE SP0169 / AMPP SP0169 rebrand acknowledgment — correct; 2024 edition is AMPP SP0169 (verified)
- L09 sacrificial anode materials (zinc, magnesium, aluminum) — correct standard list for impressed-current CP
- L10 RUS bonding schedule minimum fields — consistent with RUS close-out documentation requirements per 1751F-630 §7 framework
- L11 "controlling interval = more frequent (smaller)" logic — correctly implemented in WorkedExample formula `Math.min()`
- L12 capstone Q19 FDH 4 Ω vs GR-1275 5 Ω / aerial pole 22 Ω vs NEC 25 Ω — both threshold applications correct
- L12 capstone Q20 NEC governs from protector inward / NESC governs utility side — regulatory boundary correct per NEC Art. 770 / Art. 800 framework
- P1–P12 cascade pattern sweep: zero matches found in T14 content
- Schema validator: 12/12 PASS
- Vite build: clean (✓ built in 6.09s, zero errors)

---

## 5. Coverage Gaps

- **IEEE 1100 §8.3 specific section content**: paywalled — cannot confirm whether IEEE 1100 §8.3 actually recommends 18–24 inches or whether that value is from a different section/version. The body prose should not cite a specific depth from a paywalled source without a `[confirm edition and section]` guard AND the NEC override caveat.
- **NESC Section 09 specific interval value (1,320 ft)**: paywalled, correctly guarded in L11 with `[confirm NESC C2-2023 Section 09 interval — paywalled; verify via RUS 1751F-630 §7]`. This is the correct authoring approach; not a gap, noted for completeness.
- **L08 stray voltage detection**: not sampled in technical framing (RT-α covered L08 pedagogy fully including LOTO sequence, PPG sequencing, BranchingScenario danger path). No additional technical sampling needed for this pass.

---

## 6. Saturation Verdict

**YELLOW** — 2 NEW MED + 2 NEW LOW beyond RT-α's 9 LOW findings.

**Combined RT-α + RT-β finding set:**
- 2 MED (R-1, R-2 — ring electrode NEC depth and conductor size defects)
- 11 LOW (F-1 through F-9 from RT-α; R-3 schema duplicate, R-4 internal inconsistency resolved-by-R-1)

**Not GREEN because:** R-1 and R-2 are real correctness issues. A learner following "18–24 inches depth" from the lesson body would install a non-code-compliant ring electrode. Missing the 2 AWG minimum from the flashcard leaves an incomplete reference.

**Not RED because:** no fabricated values, no safety-life-hazard level errors (ring depth is a compliance issue, not an immediate life-safety hazard at the same severity as T18 gas-entry errors). Math is fully clean. All cascade patterns clean.

**Polish-A scope:**
1. R-1 + R-4: correct L04 body prose ring electrode depth spec — replace "18–24 inches" with "30 inches (NEC §250.52(A)(4) minimum)" + add NEC-overrides caveat
2. R-2: add minimum conductor size (2 AWG) to `ring electrode` key_terms definition
3. R-3: demote `MGN` / `IBT` / `GES` from T14.L02 + T14.L05 `vocabulary_introduced` → `vocabulary_assumed` with T01.L08 source pointer (absorb into same fix-agent pass as RT-α F-1 and F-2)

Fix-agent for Polish-A can apply R-1 through R-4 together with RT-α F-1 through F-9 in a single pass.

**Primary sources verified in this RT-β pass:**
- IEEE 81-2012 62% rule + 5× current-probe spacing: [AGI USA IEEE 81 overview](https://www.agiusa.com/overview-of-ieee-standard-81-fall-of-potential-grounding-test); [Metrel Application Note 62% rule](https://www.metrel.si/assets/Metrel/PDF_dokumentacija/Application_notes/Single_application_notes/Application_notes_Earth_resistance_measurement_and_62_percent_rule.pdf)
- NEC §250.52(A)(4) ring electrode requirements (30-inch depth, 2 AWG, 20 ft): [UpCodes §250.52](https://up.codes/s/grounding-electrode-system); [electricallicenserenewal.com §250.52](https://www.electricallicenserenewal.com/Electrical-Continuing-Education-Courses/NEC-Content.php?sectionID=991)
- NACE SP0169 / AMPP SP0169: [ANSI webstore](https://webstore.ansi.org/standards/nace/nacestandardsp01692007); [Accuris AMPP SP0169-2024](https://store.accuristech.com/products/preview/2909082)
- Telcordia GR-1275 5 Ω threshold: [GR-1275 TOC](https://telecom-info.telcordia.com/ido/AUX/GR_1275_TOC.i07.pdf)

=== T14 POST-AUTHOR RT-B TECHNICAL REPORT END ===
