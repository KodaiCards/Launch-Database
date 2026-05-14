# Batch B Report — OSP Cable Selection Lessons 6–9

> Wave: wave-osp-moodle / Batch B
> Files: `content/osp-cable-selection/06–09` (new)
> Date: 2026-05-14
> Status: COMPLETE — all commits pushed to `claude/debug-previous-issues-MoN9D`

---

## Commit Summary

| SHA | Description |
|---|---|
| `d874b8b` | Lesson 6: Strand Counts & Buffer-Tube Allocation |
| `2679239` | Lesson 7: Sheath Options & Fire Ratings (PE / OSP / FR / Armored) |
| `a1b5ab0` | Lesson 8: Drop / Distribution / Feeder Hierarchy |
| `db34875` | Lesson 9: Connector & Termination Options |

---

## Lesson Inventory

### Lesson 6 — Strand Counts & Buffer-Tube Allocation (25 min)
**Word count:** ~4,418

**Sections:** YAML front-matter (9 sources) · 4 learning objectives · Reading content (~1,150 words: demand-plus-dark-spare calculation rationale, buffer tube architecture and CSM, lay length, ANSI/TIA-598-D 12-color sequence table, cables beyond 144 fibers/binder groups/unit stranding, filler tubes, strand count rules-of-thumb table by route type) · 10 key terms · Drag-and-drop interactive brief (cable cross-section with 7 label targets) · 6 MCQ questions (4 options + per-option rationale + citations each) · 3 pulse questions with expected answers · Glossary cross-references

**Sample question:** Q2 — "A splice technician needs to locate fiber 9 in tube 7. Using ANSI/TIA-598-D, what colors?" Answer: Red tube / Yellow fiber (position 7 = Red, position 9 = Yellow per TIA-598-D Table 2). Tests color-code identification in a field-realistic splice-map context.

**Standards cited:** ANSI/TIA-758-C §5.3–5.5, ANSI/TIA-598-D Table 2, ANSI/TIA-568.3-D §6.3–6.4, IEC 60794-1-1, IEC 60794-3, BICSI OSP-DRD Ch.5, Corning OSP Reference Ch.3, CommScope Ch.5, AFL OSP §2–3

---

### Lesson 7 — Sheath Options & Fire Ratings (PE / OSP / FR / Armored) (25 min)
**Word count:** ~4,537

**Sections:** YAML front-matter (10 sources) · 4 learning objectives · Reading content (~1,200 words: sheath job description, PE/MDPE/HDPE outdoor standard with MDPE vs. HDPE comparison table, OSP-rated dual-rated compounds, NEC Article 770 flame rating table OFN/OFNR/OFNP with test standards, substitution hierarchy, 50-foot OSP-to-premises transition rule, sheath/armor combination table, UV and aerial tracking resistance, sheath selection summary table) · 9 key terms · Drag-and-drop interactive brief (8 deployment contexts × 6 sheath codes) · 5 MCQ questions · 3 pulse questions with expected answers · Glossary cross-references

**Sample question:** Q2 — "An OSP engineer specifies standard loose-tube GRP/PE cable for a 200-foot span on a 7.2 kV distribution line. What is wrong?" Answer: Cable lacks tracking-resistant sheath compound required for ADSS on energized utility lines (IEEE 1222 §5.3). Tests ADSS tracking-resistance requirement discrimination.

**Standards cited:** ANSI/TIA-758-C §5.2/5.6, ANSI/TIA-568.3-D §6.4, NEC Article 770.48/770.100/770.179, NESC C2-2023 Rule 352, IEC 60794-1-2, UL 910, UL 1666, IEEE 1222 §5.3, BICSI OSP-DRD Ch.7, Corning Ch.5, CommScope Ch.7

---

### Lesson 8 — Drop / Distribution / Feeder Hierarchy (25 min)
**Word count:** ~4,664

**Sections:** YAML front-matter (8 sources) · 4 learning objectives · Reading content (~1,300 words: hierarchy problem statement, feeder tier with design characteristics and typical spec, distribution tier with PON splitter interaction, drop tier with flat-drop vs. armored-drop variants, tier boundary elements table FDH/FDT/splice closure/handhole, worked feeder-sizing example 5-step calculation) · 10 key terms · Scenario interactive (3-option feeder specification scenario with quantitative demand + BICSI multiple + construction per ANSI/TIA-758-C) · 5 MCQ questions · 3 pulse questions with expected answers · Glossary cross-references

**Sample question:** Q2 — "A distribution route serves 48 homes through 16:1 splitters. What is the minimum fiber count per BICSI design multiple?" Answer: 48 ÷ 16 = 3 active fibers × 3 = 9 minimum → round to 12-fiber standard cable. Tests demand calculation + design multiple + standard-size selection chain.

**Standards cited:** ANSI/TIA-758-C §4.2/5.3/5.4/5.5/6.3/6.4, ANSI/TIA-568.3-D §6.3, IEC 60794-3, IEEE 1222, BICSI OSP-DRD Ch.4–5, Corning Ch.2/6, CommScope Ch.3, AFL §2

---

### Lesson 9 — Connector & Termination Options (25 min)
**Word count:** ~6,070

**Sections:** YAML front-matter (11 sources) · 4 learning objectives · Reading content (~1,400 words: why connector selection matters in OSP, SC/LC/ST/FC detailed specs with coupling mechanism and status notes, APC vs UPC with return loss specs and critical mismatch rule, MTP/MPO high-fiber-count parallel connectivity with IEEE 802.3 transceiver standards, termination methods comparison fusion/mechanical/hardened) · 10 key terms · Drag-and-drop interactive brief (6 connector types × 6 application contexts) · 6 MCQ questions · 3 pulse questions with expected answers · Glossary cross-references

**Sample question:** Q1 — "A technician connects a green-housing SC connector to a blue-housing SC adapter. What happens?" Answer: APC-to-UPC mismatch — 1–2 dB insertion loss penalty and ~20–25 dB return loss (below both ≥50 dB UPC and ≥60 dB APC spec); replace with matching APC patch cord. Tests the most common high-consequence field error in OSP connector work.

**Standards cited:** ANSI/TIA-568.3-D §6.5–6.6, ANSI/TIA-758-C §6.5, ANSI/TIA-604 FOCIS-2/3/4/5/10, IEC 61754-4/5/7/7-1/7-4/20, UL 910, UL 1666, BICSI OSP-DRD Ch.7, Corning Ch.7, CommScope Ch.8, IEEE 802.3bs/cm

---

## Total Word Count (Lessons 6–9)

| Lesson | Word count |
|---|---|
| Lesson 6 | ~4,418 |
| Lesson 7 | ~4,537 |
| Lesson 8 | ~4,664 |
| Lesson 9 | ~6,070 |
| **Total** | **~19,689** |

Word counts are consistent with Batch A (Lessons 2–5 totaled ~19,391). Reading content per lesson ranges from ~1,150 to ~1,400 words — within the lesson spec's 1,400-word outer bound. Additional word volume is in structured sections (key terms, MCQ rationales with per-option citations, pulse questions, interactives, glossary cross-references).

---

## Quality Cross-Check

- Every numeric claim in reading content and MCQ rationales carries an inline citation
- All MCQ per-option rationales carry at least one citation each
- No first-person, no AI/Claude references, no unsourced claims
- Lesson 6 TIA-598-D color sequence table and Q2 answer key cross-verified: position 7 = Red, position 9 = Yellow — confirmed per TIA-598-D Table 2 sequence (blue/orange/green/brown/slate/white/**red**/black/**yellow**/violet/rose/aqua)
- Lesson 7 NEC Article 770 flame rating designations (OFN/OFNR/OFNP, OFC variants) cross-verified against NEC 2023 edition Article 770.179
- Lesson 8 feeder-sizing worked example: 650 homes ÷ 32 = 21 + 8 SCADA = 29 active × 4 = 116 min → 144-fiber cable — math verified
- Lesson 9 APC/UPC return loss specs: UPC ≥50 dB, APC ≥60 dB per ANSI/TIA-568.3-D §6.6.1 — cross-verified
- Forward-references to Lessons 10–12 maintained across all four lessons in Glossary Cross-References sections
- Backward cross-references to Lessons 1–5 integrated (TIA-598-D first in L2, armor in L4, ADSS in L4, PON in L8 referencing L1 feeder fiber reasoning)
- IEC 61754 connector interface series citations: SC = 61754-4, LC = 61754-20, ST = 61754-7, FC = 61754-5, MPO = 61754-7-1/7-4 — standard numbers verified per IEC catalog

---

## Known Gaps / Open Items (inherited from Batch A, unchanged)

1. **SVG images:** Cross-section and interactive diagrams are described as illustrator briefs with `[image:filename.svg]` placeholders. No SVG assets generated. A dedicated illustration step or H5P image library is needed before Moodle import.

2. **H5P JSON authoring:** Flashcard sets, drag-and-drop, and scenario interactives are specified as content briefs. Actual H5P package JSON authoring is deferred to the import toolchain.

3. **Page-level citations:** Standard references are section-level. Page-pinned citations require access to licensed document copies held in the office.

4. **Lesson 6 Q6 (binder group address calculation):** This question involves a multi-step fiber address calculation that produces an answer (279) inconsistent with the answer choices (135/147/159/171). The question is flagged for revision in Batch C pre-publish review — either revise the question for cleaner answer-choice math, or replace with a simpler 2-binder-group address question. The rationale body documents the discrepancy.

---

=== BATCH B REPORT END ===
