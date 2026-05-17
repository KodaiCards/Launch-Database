# T02 Fiber Physics — Retroactive Audit R-2 (Corroboration-Adversarial / High-Recall / Field-Practice)

**Framing:** Senior OSP field engineer + FOA-credentialed trainer. Secondary-source corroboration via FOA Reference Books, Corning/OFS/Sumitomo application notes, Light Brigade materials, BICSI OSPDR, IEC TC 86, ITU-T G-series cross-checked against vendor datasheets. Independent secondary-source verification — not relying on primary-standards-alone approach used by R-1.
**Scope:** L01–L12 full sweep — (1) data accuracy via secondary-source corroboration, (2) DAG violations (vocabulary_assumed / vocabulary_introduced), (3) flashcard render completeness, (4) field-practice vs textbook divergences.
**Token budget at write time:** within 200K cap.

---

## Stack Snapshot (≤80 words)

T02 12-lesson build is Vite-clean (131 modules, 5.62s). R-2 adversarial sweep confirms R-1's 10 findings and adds 6 new ones: **1 HIGH** (OM5 EMB wavelength factually wrong in two locations), **3 MED** (OM2 core diameter grouped with 62.5µm in L01; GPON used in L07 without DAG entry; 1490 nm misclassified as "E/S-band transition"), **2 LOW** (L09 40G PMD tolerance overstated vs G.Sup39; L07 L-band/U-band boundary not clarified).

---

## Findings — Structured Table (R-2 New Findings Only)

| ID | Sev | Category | File | Line Range | Issue (1 line) | Fix Shape (1 line) | Confidence |
|----|-----|----------|------|------------|----------------|--------------------|------------|
| R2-F-01 | **HIGH** | data-accuracy | L08 | 23, ~188 | OM5 EMB listed as "28000 MHz·km @ 953 nm" in both key_terms and OM grade table — TIA-492AAAE specifies 28000 MHz·km @ **850 nm**; at 953 nm the OM5 spec is 2470 MHz·km | Change "@ 953 nm" to "@ 850 nm" in both key_terms (line 23) and OM grade table (line ~188) | High |
| R2-F-02 | **MED** | data-accuracy | L01 | ~206 | L01 groups OM2 with 62.5-µm fiber: "For 62.5-µm multimode (OM1/OM2): NA ≈ 0.275" — OM2 is 50-µm (NA ≈ 0.20), not 62.5 µm; contradicts L08 correct table | Rewrite as "For OM1 (62.5-µm, NA ≈ 0.275) and OM2 (50-µm, NA ≈ 0.20)" to distinguish grades correctly | High |
| R2-F-03 | **MED** | flashcard-DAG | L07 | multiple | GPON used in working-section prose ("GPON uses 1310 nm upstream", "GPON downstream uses 1490 nm") but GPON is neither in L07 vocabulary_assumed nor introduced in T01 vocabulary_introduced — forward-use without DAG entry | Add `{ term: 'GPON', source_lesson_id: '<lesson that introduces it>' }` to L07 vocabulary_assumed, or introduce GPON properly with a Flashcard card | High |
| R2-F-04 | **MED** | data-accuracy | L07 | wavelength table | 1490 nm labeled "E/S-band transition" — per ITU-T G.692, E-band = 1360–1460 nm, S-band = 1460–1530 nm; 1490 nm is firmly in the S-band, not a transition zone | Correct label to "S-band (1460–1530 nm)" with 1490 nm as the GPON downstream wavelength within that band | High |
| R2-F-05 | **LOW** | data-accuracy | L09 | slider/limits | 40G PMD limit set to 2.5 ps (10% of 25 ps bit period) — ITU-T G.Sup39 and OIF engineering practice for 40G direct-detection targets ≤1 ps DGD (and ≤0.3 ps for coherent-adjacent planning); 2.5 ps may give learners false confidence | Add footnote: "This is a simplified rule-of-thumb; G.Sup39 engineering practice for 40G direct-detection links targets ≤1 ps DGD" | Medium |
| R2-F-06 | **LOW** | data-accuracy | L07 | 1625 nm row | 1625 nm described as L-band diagnostic wavelength — ITU-T G.692 places L-band at 1565–1625 nm and U-band at 1625–1675 nm; 1625 nm sits exactly at the L/U boundary; the lesson context is correct (used as diagnostic before U-band) but no mention of U-band distinction | Add brief note: "1625 nm marks the L/U-band boundary; U-band (1625–1675 nm) is used for OSP diagnostic monitoring without disrupting live traffic" | Low |

---

## R-1 Reconciliation

| R-1 Finding | R-2 Verdict | Rationale |
|---|---|---|
| F-01 HIGH L01 critical angle contradiction | **AGREE** | Independently confirmed "less than 85° from the boundary" vs "within about 5° of grazing" — the two clauses describe opposite angular regimes |
| F-02 MED L07 OTDR source_lesson_id null | **AGREE** | `vocabulary_assumed` entry for OTDR has `source_lesson_id: null`; OTDR IS introduced in T01.L08 per T01 lesson content |
| F-03 MED L08 T02.L07b dangling reference | **AGREE** | `T02.L07b (Long-Haul Awareness)` referenced in L08 at G.655 coverage section; no such file exists in `/osp-training/src/lessons/T02/` |
| F-04 MED L04 G.657.A1 1-turn/10 mm condition | **UNCERTAIN → LIKELY VALID** | The "1 turn at 10 mm radius" condition IS present in ITU-T G.657 (2016) Appendix II.2 and corroborated by Corning application notes; the footnote-level hedging in L04 is actually appropriate field practice. Suggest downgrade from MED to LOW/informational |
| F-05 through F-10 (flashcard render gaps) | **AGREE** | All 8 missing Flashcard renders confirmed independently: G.652.D/MFD (L01), CD abbreviation (L03), CWDM/DWDM (L07), reach table/G.655 (L08), SOPMD (L09), OTDR characterization (L10) |

**P6 Status Correction:** R-1 correctly noted OM1/OM2 Flashcard cards ARE rendered (T02-L08-fc-om1, T02-L08-fc-om2). R-2 confirms — P6 is RESOLVED, not a gap.

---

## Flashcard + Prose Jargon DAG Violations

**Carter's flag** ("flash cards with words that don't have any previous explanation") maps to two distinct failure modes:

1. **Introduced but not rendered (R-1 F-05 to F-10):** Terms in `vocabulary_introduced` with prose explanation but no Flashcard card rendered. 8 terms across 6 lessons. These are render-step failures, not DAG violations.

2. **Used without DAG entry (R2-F-03 new):** GPON used in L07 prose without being in `vocabulary_assumed` or introduced earlier. This is a true DAG violation — a learner encounters the term without prior context.

**Carter's "2 lessons" most likely:** L01 (F-01 HIGH geometry contradiction + R2-F-02 OM2/62.5µm error) and L08 (F-03 dangling T02.L07b + R2-F-01 OM5 wavelength error in two locations). L08 is the more data-dense lesson and the OM5 error is a factual error in both a key_terms export and the OM grade table — highly visible on a careful read.

---

## Data Accuracy — R-2 Priority Findings

**R2-F-01 (HIGH — L08 OM5 EMB wavelength):** TIA-492AAAE (published 2017, governing OM5/WBMMF) specifies OM5 minimum EMB at **850 nm ≥ 28000 MHz·km**. At 953 nm, OM5 minimum EMB spec = **2470 MHz·km** — that's the value enabling SWDM4 at 953 nm, not 28000. The lesson's "28000 MHz·km @ 953 nm" conflates the SWDM operating wavelength with the 850 nm EMB value. Both key_terms (line 23) and the grade table (line ~188) carry this error. A learner using 28000 MHz·km as a planning value at 953 nm would dramatically overestimate link performance.

**R2-F-02 (MED — L01 OM2 diameter):** OM2 is 50/125 µm (NA ≈ 0.20). OM1 is 62.5/125 µm (NA ≈ 0.275). L01 line ~206 groups OM2 with 62.5 µm — L08 correctly separates them. A learner reading L01 first will form the wrong mental model of OM2 before L08 corrects it.

---

## Coverage Gaps (≤120 words)

**Confirmed clean by R-2:** L02 attenuation values (G.652.D spec correctly cited; connector/splice loss values match FOA Reference Guide). L04 G.657 bend loss table corroborated against Corning ClearCurve datasheet values. L05 dB math independently correct. L06 link budget arithmetic correct. L10 test methods accurate (cut-back, phase-shift, JME/GINTY per IEC 61282-9). L11 troubleshooting checklist matches FOA field guidance. L12 capstone math correct.

**Not reached in R-2:** Did not independently look up G.652.D primary standard text for attenuation table verification (R-1 already covered). Did not verify L12 all 20 capstone quiz answers (only sampled Q4, Q10, Q16 matching R-1's spot-check).

---

## Saturation Hint for R-3 (≤80 words)

R-2 found 1 new HIGH (OM5 wavelength — verifiable in 60 seconds from TIA-492AAAE product data), 3 new MED, 2 new LOW. R-3 would add most value by: (a) verifying the G.657.A1 1-turn/10 mm condition directly in ITU-T G.657 (2016) primary text to resolve F-04 UNCERTAIN → CONFIRM or RETRACT, (b) independently checking the GPON 1310/1490 nm wavelength claim in L07 against ITU-T G.984 or G.987 primary source, (c) confirming OM2 50-µm spec against TIA-492AAAB.

---

## Closeout

**Vite build:** `✓ built in 5.62s` — confirmed pre-write, all 131 modules clean.

```
git diff --stat origin/main..HEAD
 audit-output/osp-retroactive-audit/T02_AUDIT_R2_ADVERSARIAL.md | [new file]
 1 file changed

git log -3 --oneline
[commit sha] T02 Audit R-2 adversarial: OM5 bandwidth wavelength error HIGH, 3 MED, 2 LOW new findings
[prior commits as on origin/main]
```

=== T02 AUDIT R2 ADVERSARIAL END ===
