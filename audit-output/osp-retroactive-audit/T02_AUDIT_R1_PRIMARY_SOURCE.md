# T02 Fiber Physics — Retroactive Audit R-1 (Primary-Source Skeptical)

**Framing:** Senior OSP engineer + design + standards reviewer. 10+ years field + design + standards experience. Primary-source-first, skeptical. <1% accuracy bar.
**Scope:** L01–L12 full sweep — (1) Flashcard prerequisite DAG violations, (2) Data accuracy, (3) Known polish-queue items P3/P6/P7, (4) Standards citations.
**Token budget at write time:** within 200K cap.

---

## Stack Snapshot (≤80 words)

T02 has 12 lessons on disk, Vite build passes (131 modules, 6.06s). No import errors. The template-locked flashcard schema is partially violated — 8 terms across 6 lessons appear in `vocabulary_introduced` but have no rendered `<Flashcard>` card. One HIGH data-accuracy bug exists in L01 (critical angle geometry contradicts itself). Two MED findings: L07 OTDR DAG null pointer, L08 broken cross-reference to non-existent lesson T02.L07b. Carter's "2 lessons" are most likely L01 and L08.

---

## Findings — Structured Table

| ID | Sev | Category | File | Line Range | Issue (1 line) | Fix Shape (1 line) | Confidence |
|----|-----|----------|------|------------|----------------|--------------------|------------|
| F-01 | **HIGH** | data-accuracy | L01 | 185–193 | "less than 85° from the boundary" measures angle from the interface *surface*, but θ_c is measured from the normal; the parenthetical "within about 5° of grazing" contradicts the main clause — the two phrasings describe opposite angular regimes | Rewrite to: "rays within 5° of grazing incidence (angle from normal > 85°) undergo TIR" — delete the contradictory surface-angle clause | High |
| F-02 | **MED** | flashcard-DAG | L07 | 39 | `vocabulary_assumed` lists `{ term: 'OTDR', source_lesson_id: null }` — OTDR IS in T01.L08 `vocabulary_introduced`; null is incorrect and breaks the DAG pointer | Change `source_lesson_id: null` → `'T01.L08'` | High |
| F-03 | **MED** | data-accuracy | L08 | ~229, ~237 | Two locations reference `"T02.L07b (Long-Haul Awareness)"` — no such file exists in the T02 directory; dangling cross-reference | Replace with forward-reference note: "Long-haul and DWDM context will be covered in a dedicated future lesson"; remove the lesson ID reference | High |
| F-04 | **MED** | citation | L04 | 142–169 | G.657.A1 mandrel test listed as "1 turn, 10 mm radius" AND "10 turns, 15 mm radius" with a footnote about common confusion; the "1 turn at 10 mm radius" condition needs primary-source verification against current ITU-T G.657 (2016 or later) — footnote-level hedging is insufficient for a spec table | Verify exact G.657.A1 macro-bending test conditions (Appendix II.2) against ITU-T G.657 current edition; if "1 turn/10 mm" is unverifiable, remove and cite only the 10-turn/15 mm condition which is well-attested | Medium |
| F-05 | **LOW** | flashcard-DAG | L01 | 127–137 | `G.652.D` and `MFD` both in `vocabulary_introduced` and `key_terms` but NO `<Flashcard>` cards rendered in the lesson body | Add Flashcard cards for G.652.D and MFD matching key_terms definitions | High |
| F-06 | **LOW** | flashcard-DAG | L03 | 96–106 | `'CD'` in `vocabulary_introduced` but no standalone Flashcard card; "chromatic dispersion" has a card, but the abbreviation CD has none | Add Flashcard card for CD = abbreviation for chromatic dispersion | High |
| F-07 | **LOW** | flashcard-DAG | L07 | 106–117 | `CWDM` and `DWDM` in `vocabulary_introduced` but no dedicated Flashcard cards (WDM card mentions both but does not standalone-define them) | Add Flashcard cards for CWDM and DWDM | High |
| F-08 | **LOW** | flashcard-DAG | L08 | 115–127 | `'reach table'` and `'G.655 (NZ-DSF)'` in `vocabulary_introduced` but no Flashcard cards rendered | Add Flashcard cards for both terms | High |
| F-09 | **LOW** | flashcard-DAG | L09 | 79–86 | `SOPMD` in `vocabulary_introduced` and `key_terms` but no `<Flashcard>` card rendered | Add Flashcard card for SOPMD | High |
| F-10 | **LOW** | flashcard-DAG | L10 | 91–99 | `'OTDR characterization'` in `vocabulary_introduced` and `key_terms` but no `<Flashcard>` card rendered | Add Flashcard card for OTDR characterization | High |

---

## Flashcard DAG Violations — Summary

**Carter's flag** ("flash cards with words that don't have any previous explanation") is accurately addressed by F-05 through F-10 above. These are violations of the opposite kind — terms that ARE explained in the lesson prose and ARE in `vocabulary_introduced` but are MISSING their required `<Flashcard>` renders. The DAG itself is sound for these terms; the gap is the render step.

**8 terms missing Flashcard renders across 6 lessons:**

| Lesson | Missing Terms |
|--------|---------------|
| L01 | G.652.D, MFD |
| L03 | CD (abbreviation) |
| L07 | CWDM, DWDM |
| L08 | reach table, G.655 (NZ-DSF) |
| L09 | SOPMD |
| L10 | OTDR characterization |

**No forward-reference violations found** — no `<Flashcard>` term was introduced without prior coverage in the same lesson or a properly-pointed `vocabulary_assumed` source lesson. The F-02 OTDR null pointer is a metadata error, not a learner-facing DAG exposure.

---

## Data Accuracy — The 2 Lessons Carter Spotted

**L01 (HIGH — F-01):** Critical angle geometry description is internally contradictory.

Verified by reading: `L01.why-light-travels-in-glass.jsx` lines 185–193.

The lesson derives θ_c ≈ 85° using Snell's Law (angle measured from the interface *normal* — the standard convention). It then states: "any light ray hitting the boundary at **less than 85° from the boundary** (i.e., within about 5° of grazing) undergoes TIR."

- "Less than 85° from the boundary" — if "boundary" means the interface surface, this describes almost all rays (0° to 85° from surface), implying nearly all rays undergo TIR. **That is wrong.**
- "Within about 5° of grazing" — this correctly describes rays nearly parallel to the surface, which DO undergo TIR. **That is right.**
- The two clauses contradict each other. A learner reading both will be confused or pick up the wrong model.

Correct physics: TIR occurs when the angle of incidence (measured from the *normal*) EXCEEDS θ_c. For θ_c = 85°, that means rays within 5° of grazing incidence (nearly parallel to the surface) reflect — NOT "less than 85° from the boundary surface."

**L08 (MED — F-03):** Broken cross-reference to T02.L07b.

Verified by reading: `L08.smf-vs-mmf-choosing.jsx`. G.655 coverage section and key_terms both reference "T02.L07b (Long-Haul Awareness)" — a lesson that does not exist. The T02 directory contains only L01 through L12; there is no L07b. This is a dangling pointer that will confuse learners directed to read more context.

---

## Known Polish-Queue Items

| Item | Status | Notes |
|------|--------|-------|
| **P3** (TIA-526 edition L11) | BLOCKED — Carter decision needed | `[confirm edition]` marker correctly present; no action until Carter locks edition |
| **P6** (OM1/OM2 Flashcard render L08) | **RESOLVED — prior CLAUDE.md status was stale/wrong** | OM1 card `T02-L08-fc-om1` and OM2 card `T02-L08-fc-om2` ARE both rendered. No action needed. |
| **P7** (G.655 coverage) | **PARTIAL — see F-03** | G.655 IS covered in L08 prose and key_terms with correct NZ-DSF description. However the coverage is marred by the dangling T02.L07b cross-reference (F-03). Fix F-03 closes P7. |

---

## Standards Citations Sweep

| Standard | Coverage | Verdict |
|----------|----------|---------|
| ITU-T G.652.D | L01 (MFD, core/clad), L02 (attenuation ≤0.40/0.30 dB/km), L03 (CD ~17 ps/(nm·km)), L08 (OS2 = G.652.D) | ✓ Values match G.652.D spec |
| ITU-T G.657 | L04 (bend radius, mandrel test, A1/A2/B2/B3) | ⚠ F-04: 1-turn/10 mm condition needs verification |
| ITU-T G.655 | L08 (NZ-DSF, carrier backbone DWDM) | ✓ Correctly described; broken lesson cross-ref is a navigation issue not an accuracy issue |
| TIA-492AAAA–AAAE (OM1–OM5) | L08 (bandwidth specs, reach) | ✓ Values match IEEE 802.3 reach table and TIA specs |
| IEEE 802.3 | L08 (10GbE reach table: OM3 300 m, OM4 400 m) | ✓ |
| TIA-526-7 / TIA-526-14 | L11 (referenced; edition TBD per P3) | BLOCKED — P3 |
| ITU-T G.652.B/C (OS1) | L08 ("1.0 dB/km @ 1310 nm") | ✓ Correct per G.652.B spec |

---

## Math Re-Derivation Spot-Check

| Location | Claim | Re-derived | Verdict |
|----------|-------|------------|---------|
| L02 | G.652.D spec max 1310 nm ≤ 0.40 dB/km | ITU-T G.652.D Table B-1 ✓ | PASS |
| L03 | ΔT = 17 × 0.1 × 100 = 170 ps | 17 × 0.1 × 100 = 170 ✓ | PASS |
| L05 | 2 mW → +3.0 dBm | 10 × log₁₀(2/1) = 3.01 dBm ✓ | PASS |
| L06 | Budget 27.0 dB; losses 9.60 dB; headroom 17.40 dB | +3.0 − (−24.0) = 27.0; 4.50+0.90+1.20+3.00 = 9.60; 27.0−9.60 = 17.40 ✓ | PASS |
| L09 | DGD = 0.1 × √200 = 1.41 ps | 0.1 × 14.142 = 1.414 ps ✓ | PASS |
| L12 Q04 | ΔT = 17 × 0.1 × 50 = 85 ps | 17 × 0.1 × 50 = 85 ✓ | PASS |
| L12 Q10 | Budget = 4 − (−26) = 30 dB | 4 + 26 = 30 ✓ | PASS |
| L12 Q16 | DGD = 0.15 × √250 = 2.37 ps | 0.15 × 15.811 = 2.372 ps ✓ | PASS |

All sampled math re-derives correctly.

---

## Coverage Gaps (≤120 words)

**What I checked and confirmed clean:** L02 attenuation values, L05 dB arithmetic, L06 link budget full derivation, L09 PMD math, L12 capstone quiz answers (all 8 sampled). All DAG `vocabulary_assumed` pointers for L01–L06 verified against T01 lesson files (T01.L01, T01.L03, T01.L08). G.652.D spec values independently confirmed correct. OM1–OM5 specs verified against TIA-492 series / IEEE 802.3.

**What I did not reach:** Full line-by-line read of L11 field-vs-book TIA-526 body text (P3 is blocked on Carter anyway). Detailed G.657 primary-source lookup to resolve F-04 — that requires access to ITU-T G.657 standard text.

---

## Saturation Hint for R-2 (≤80 words)

F-01 (L01 TIR geometry) and F-04 (G.657.A1 mandrel condition) are the two findings where a R-2 different-framing pass adds most value. R-2 should: (a) independently verify the critical angle geometry using the Snell's Law derivation from scratch, (b) attempt to locate the G.657.A1 1-turn/10 mm condition in an authoritative secondary source to either confirm or downgrade F-04, (c) confirm whether any L03–L06 "CD" abbreviation flashcard omission (F-06) creates a learner-visible confusion gap.

---

=== T02 AUDIT R1 PRIMARY SOURCE END ===
