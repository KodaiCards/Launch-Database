# Batch A Report — OSP Cable Selection Lessons 2–5 + Q3 Hotfix

> Wave: wave-osp-moodle / Batch A
> Files: `content/osp-cable-selection/01-smf-vs-mmf.md` (hotfix), `02–05` (new)
> Date: 2026-05-14
> Status: COMPLETE — all commits pushed to `claude/debug-previous-issues-MoN9D`

---

## Commit Summary

| SHA | Description |
|---|---|
| `a4510dd` | Q3 hotfix: Lesson 1 MCQ answer key corrected (B, not C) |
| `d08c1d1` | Lesson 2: Cable Construction Basics — Loose-Tube vs Tight-Buffer |
| `c91b977` | Lesson 3: Ribbon Cable & Mass-Fusion Splicing |
| `b7904ee` | Lesson 4: Armored, Aerial & Direct-Bury Variants |
| `c230e5a` | Lesson 5: Microduct & Air-Blown Fiber |

---

## Q3 Hotfix (Lesson 1)

The `[CORRECT]` marker was on option C but the rationale body explained why C is false. Per LESSON_1_SAMPLE_REPORT.md Known Issue #1 and user approval:
- Option B is now marked `[CORRECT]`
- B rationale: "OM4 at 40G tops out at 150 m per ANSI/TIA-492AAAD Table 8; a 400 m span requires OS2 SMF"
- C rationale: restated as a clear incorrect claim (no [CORRECT] marker, no internal contradiction)
- Internal contradiction note removed

No other changes to Lesson 1.

---

## Lesson Inventory

### Lesson 2 — Cable Construction Basics: Loose-Tube vs Tight-Buffer (25 min)
**Word count:** ~4,456

**Sections:** YAML front-matter (9 sources) · 4 learning objectives · Reading content (~1,180 words across 6 subsections: The Cable as a System, Loose-Tube, Gel vs Dry Fill, Tube Count/Fiber Capacity, Tight-Buffer, Breakout Cable, Decision Table) · 10 key terms · Drag-and-drop interactive brief (14 label targets across 2 cable cross-sections) · 6 MCQ questions (4 options + per-option rationale + citations each) · 3 pulse questions with expected answers · Glossary cross-references

**Sample question:** Q6 — "In a 12-tube cable, what color is buffer tube 7 and what color is fiber 3 within it?" Answer: Red tube / Green fiber, per ANSI/TIA-598-D Table 2. Tests color-code identification in a field-realistic context.

**Standards cited:** ANSI/TIA-758-C §5.2–5.4, ANSI/TIA-568.3-D §6.4, IEC 60794-1-1, IEC 60794-3, ANSI/TIA-598-D, NEC Article 770.49, Corning OSP Reference Ch.3, AFL OSP Cable Design Guide §2/§3, BICSI OSP-DRD Ch.5–6, CommScope Reference Manual Ch.5

---

### Lesson 3 — Ribbon Cable & Mass-Fusion Splicing (25 min)
**Word count:** ~4,323

**Sections:** YAML front-matter (9 sources) · 4 learning objectives · Reading content (~1,060 words: The Density Problem, Ribbon Fiber Structure and Identification, Rollable Ribbon, Mass-Fusion Splicing Labor Comparison, When Ribbon Is the Right Choice, Splice Loss in Ribbon Splices) · 8 key terms · Scenario interactive (864-fiber FTTH feeder — mass-fusion vs single-fiber option comparison with quantitative time analysis) · 5 MCQ questions · 3 pulse questions with expected answers · Glossary cross-references

**Sample question:** Q4 — "A ribbon splice tray shows 5 of 12 fibers at 0.5–1.0 dB above expected loss. Arc calibration is normal. What is the most likely root cause?" Answer: C — residual ribbon matrix causing inconsistent cleave angles on affected fibers. Tests diagnostic reasoning about splice failure modes.

**Standards cited:** ANSI/TIA-758-C §5.4–5.5, IEC 60794-2-20, ANSI/TIA-598-D §5, IEEE 802.3ba, BICSI OSP-DRD Ch.5§5.5/Ch.7§7.3, Corning OSP Reference Ch.4, AFL OSP Cable Design Guide §4, CommScope Reference Manual Ch.6

---

### Lesson 4 — Armored, Aerial & Direct-Bury Variants (25 min)
**Word count:** ~5,212

**Sections:** YAML front-matter (10 sources) · 4 learning objectives · Reading content (~1,320 words: Three Environments, Direct-Bury Threats and Armor Types, Burial Depth Table, Aerial Lashed vs ADSS, ADSS Parameters, Conduit RTL/RSL, Selection Decision Table) · 10 key terms · Drag-and-drop interactive brief (6 cable variants × 6 deployment environments) · 6 MCQ questions · 3 pulse questions · Glossary cross-references

**Sample question:** Q2 — "An OSP engineer is designing a 750-foot aerial span on a rural electric cooperative distribution line carrying 13.2 kV. Which cable type is required?" Answer: C — ADSS, span-rated, fully dielectric. Tests ADSS vs lashed aerial discrimination in an energized-line scenario.

**Standards cited:** ANSI/TIA-758-C §5.3/5.6/6.2/6.3, ANSI/TIA-472AAAB, IEEE 1222, NESC C2-2023 Rules 230/235/250/354, IEC 60794-1-2, IEC 60794-3 §5, BICSI OSP-DRD Ch.6§6.1–6.4, Corning OSP Reference Ch.5, AFL OSP Cable Design Guide §5, CommScope Reference Manual Ch.7

---

### Lesson 5 — Microduct & Air-Blown Fiber (20 min)
**Word count:** ~5,400

**Sections:** YAML front-matter (9 sources) · 4 learning objectives · Reading content (~1,250 words: Why Microduct, Microduct Physical Characteristics with sizing table, Multi-Microduct Bundles, ABF Installation Method with operating parameter table, ABF vs Pull-In Advantages, Microduct-Compatible Cable Construction, Fill Ratio, When Microduct Is the Right Choice) · 8 key terms · H5P Flashcard set (8 cards with front/back) · 5 MCQ questions · 3 pulse questions · Glossary cross-references

**Sample question:** Q4 — "A blow stalls at 600 m of a 1,200 m duct run; air pressure normal at machine. Most likely cause?" Answer: B — obstruction or tight bend creating a high-friction zone. Tests ABF diagnostic reasoning.

**Standards cited:** ANSI/TIA-758-C §5.7/6.5, IEC 60794-5, IEC 61282-13, ETSI EN 187003, BICSI OSP-DRD Ch.5§5.7/Ch.6§6.5, Corning OSP Reference Ch.6, AFL OSP Cable Design Guide §6, CommScope Reference Manual Ch.8, Plumettaz Blown Fiber Guide §2–3

---

## Total Word Count (Lessons 2–5)

| Lesson | Word count |
|---|---|
| Lesson 2 | ~4,456 |
| Lesson 3 | ~4,323 |
| Lesson 4 | ~5,212 |
| Lesson 5 | ~5,400 |
| **Total** | **~19,391** |

Word counts are above the 800–1200 word spec for Reading Content alone, consistent with Lesson 1 (which ran ~1,395 words of reading content). All additional content is in structured sections (key terms, MCQ rationales, pulse questions, interactives) — not padding in the reading content. Reading content per lesson is in the 1,060–1,320 word range.

---

## Quality Cross-Check

- Every numeric claim in every lesson carries an inline citation
- All MCQ per-option rationales carry at least one citation each
- No first-person, no AI/Claude references, no unsourced claims
- Forward and backward cross-references maintained across all 5 lessons (Lessons 2–5 reference each other and forward to Lessons 6–10)
- ANSI/TIA-598-D color sequence used consistently across Lessons 2 and 3
- NEC Article 770 indoor flame rating transition introduced in Lesson 2, forward-referenced in Lesson 4 for ADSS bonding, and flagged for Lesson 10 compliance checklist
- NESC Rule citations (230, 235, 250, 354) are self-consistent across Lesson 4

---

## Known Gaps / Open Items

1. **SVG images:** Cross-section and interactive diagrams are described as illustrator briefs with `[image:filename.svg]` placeholders. No SVG assets generated (same as Lesson 1). A dedicated illustration step or H5P image library is needed before Moodle import.

2. **H5P JSON authoring:** Flashcard sets and drag-and-drop interactives are specified as content briefs. Actual H5P package JSON authoring is deferred to the import toolchain (Node.js/Python pipeline per DISCOVERY.md Area D).

3. **Page-level citations:** Standard references are section-level (e.g., "ANSI/TIA-758-C §5.6"). Page-pinned citations require access to licensed document copies held in the office.

4. **Lesson 3 ABF labor figures:** The "0.75 min/fiber" mass-fusion rate and "3.5 min/fiber" single-fiber rate are industry-standard estimates from BICSI OSP-DRD Manual Ch.7 and AFL references. Actual crew rates vary by experience, cable organization, and tray complexity. These are benchmarks, not guarantees.

---

=== BATCH A REPORT END ===
