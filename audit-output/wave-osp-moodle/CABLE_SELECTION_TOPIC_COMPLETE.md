# OSP Cable Selection — Topic Complete

> Status: COMPLETE — all 12 lessons + topic final exam authored and pushed.
> Completion date: 2026-05-14
> Branch: claude/debug-previous-issues-MoN9D

---

## Topic Summary

**Topic:** OSP Cable Selection
**BICSI alignment:** OSP-DRD domain 5 (Optical & Copper Cable Selection) + domain 6 (Installation Methods) + domain 7 (Documentation)
**Estimated learner time:** ~5 hours (12 lessons × ~25 min average + 45 min final exam)
**Pass threshold:** 18/25 (70%) on the topic final exam

---

## All 12 Lessons + Final Exam

| File | Title | Estimated Duration | Words | Batch |
|---|---|---|---|---|
| `01-smf-vs-mmf.md` | Single-Mode vs. Multi-Mode Fiber | 25 min | ~5,800 | A |
| `02-cable-construction-basics.md` | SMF Grades: OS1 vs. OS2 | 20 min | ~4,200 | A |
| `03-ribbon-cable-mass-fusion.md` | MMF Grades: OM1–OM5 Application Matrix | 20 min | ~4,100 | A |
| `04-armored-aerial-direct-bury.md` | Armored, Aerial & Direct-Bury Variants | 25 min | ~5,700 | A |
| `05-microduct-air-blown-fiber.md` | Tight-Buffer and Breakout Cable | 20 min | ~3,900 | A |
| `06-strand-counts-buffer-tube.md` | Ribbon Cable and Mass-Fusion Splicing | 20 min | ~3,900 | A |
| `07-sheath-fire-ratings.md` | Sheath Options: PE, OSP, FR, Armored | 25 min | ~4,800 | B |
| `08-drop-distribution-feeder.md` | Drop / Distribution / Feeder Hierarchy | 25 min | ~5,700 | B |
| `09-connector-termination.md` | Connector and Field-Termination Options | 20 min | ~4,200 | B |
| `10-cable-selection-by-environment.md` | Environment-Driven Cable Selection | 30 min | 6,131 | C |
| `11-compliance-nesc-nec-tia-bicsi.md` | Compliance — NESC, NEC, ANSI/TIA-758-C, BICSI | 25 min | 6,377 | C |
| `12-case-studies.md` | Hands-On Case Studies | 30 min | 6,891 | C |
| `99-final-exam.md` | Topic Final Exam (25 questions) | 45 min | 6,403 | C |

**Batch C word count:** 25,802
**Estimated total topic word count (all batches):** ~71,400

---

## Commit History — Batch C

| SHA | File | Message |
|---|---|---|
| `833fbc8` | L10 | Add Lesson 10: Environment-Driven Cable Selection |
| `fcb744d` | L11 | Add Lesson 11: Compliance — NESC, NEC, ANSI/TIA-758-C, BICSI |
| `b47fa03` | L12 | Add Lesson 12: Hands-On Case Studies |
| `732b314` | 99 | Add Cable Selection topic final exam (25 questions, 70% pass threshold) |

---

## Standards Coverage Across the Topic

| Standard | Lessons that cite it |
|---|---|
| ANSI/TIA-758-C | All 12 lessons + exam |
| BICSI OSP-DRD Manual | All 12 lessons + exam |
| ANSI/TIA-568.3-D | L1, L2, L3, L11, exam |
| ITU-T G.652.D / G.657 | L1, L2, exam |
| ANSI/TIA-492AAAC/D/E (OM3/OM4/OM5) | L3, exam |
| IEC 60793-2-10 | L1 |
| IEC 60794-1-2 / IEC 60794-3 | L4, L10 |
| IEEE 1222 (ADSS) | L4, L10, L11, L12, exam |
| NESC C2-2023 (Rules 230/232/250-251/352/354) | L4, L10, L11, L12, exam |
| NEC Article 770 | L7, L10, L11, L12, exam |
| ANSI/TIA-526-7 (OTDR testing) | L11, L12, exam |
| ANSI/TIA-568.3-D §11 (OLTS) | L11, L12 |
| IEEE 802.3ae | L1, exam |
| USDA RUS Bulletin 1753F-601 | L12, exam |

---

## Known Issues to Resolve at Moodle Import

1. **L6 Q6 math issue** — drag-drop image labels; verify at import.
2. **L3 Q3 fix** — already shipped in Batch B per previous report; confirm applied.
3. **L10 Q6 cable length rounding** — rationale block contains the authoritative explanation if correct-answer dispute arises.
4. **Final exam answer randomization** — rationale is tied to the [CORRECT] marker; verify Moodle maps rationale to the correct answer after randomization.

---

## Next Steps (post Moodle import)

1. Import all 12 lesson Markdown files to Moodle as lesson/page content via REST API or manual WYSIWYG paste.
2. Convert quiz MCQ blocks to H5P Question Set JSON packages; import to Moodle.
3. Convert flashcard / Key Terms blocks to H5P Dialog Cards packages; import to Moodle.
4. Convert drag-and-drop activities to H5P Drag the Words or Image Hotspot packages; import.
5. Import 25-question final exam as a Moodle Quiz activity (H5P Question Set or Moodle native quiz), set pass threshold to 70%, enable answer randomization and question randomization.
6. Configure BICSI OSP-DRD course completion: learner must complete all 12 lessons and pass the final exam at ≥ 70% to receive topic completion credit.

=== CABLE SELECTION TOPIC COMPLETE ===
