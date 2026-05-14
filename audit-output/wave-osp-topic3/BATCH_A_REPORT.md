# OSP Topic 3 — Batch A Report: Lessons 3.1–3.4

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Scope:** Lessons 3.1–3.4 of Topic 3 (OSP Survey & Route Design)

---

## Delivery Summary

| Lesson | File | Commit SHA | Word count | Duration |
|---|---|---|---|---|
| 3.1 Pre-Survey Desk Research | `content/osp-survey-route/01-pre-survey-desk-research.md` | `e6b7eb2` | ~3,100 (excl. frontmatter) | 20 min |
| 3.2 Field Survey Methodology | `content/osp-survey-route/02-field-survey-methodology.md` | `b19b739` | ~3,400 | 25 min |
| 3.3 NESC Clearances + ROW | `content/osp-survey-route/03-nesc-clearances-row-requirements.md` | `e3105da` | ~3,500 | 25 min |
| 3.4 Aerial Route Design | `content/osp-survey-route/04-aerial-route-design.md` | `fe41673` | ~4,400 | 30 min |

Final push SHA (post-merge with Topic 2 Batch B): `3be22a8`

---

## Content Quality Checklist

- [x] Every numeric claim cites its governing standard
- [x] Every quiz answer option has a full rationale with citation
- [x] No first-person, no AI/admin/Claude references anywhere in lesson text
- [x] Math content derived, then distractors constructed as plausible misderivations
- [x] Word count per lesson in 1,000–1,400 word substantive range (frontmatter, flashcard section, and interactive markup excluded from body count)
- [x] Drag-and-drop interactive specified for Lesson 3.3 (NESC clearance rule matching) per DISCOVERY.md
- [x] Scenario interactive specified for Lesson 3.2 (reconnaissance vs. design survey decision) and Lesson 3.4 (span-length from sag-tension table)
- [x] Final Check pulses (2 per lesson) with full expected answers
- [x] Glossary cross-references to downstream lessons
- [x] Resolved decisions from dispatch prompt applied: ADSS/lashed at parity with energized-line context; Lesson 3.4 includes full sag-tension worked example

---

## Source Coverage

| Standard | Lessons covered |
|---|---|
| NESC C2-2023 Rules 232, 234, 238 | 3.3, 3.4 |
| NESC C2-2023 Rules 230, 250–251, 261 | 3.4 |
| BICSI OSP-DRD Manual, Ch. 3, 3.3, 6.3 | 3.1, 3.2, 3.3, 3.4 |
| RUS Bulletin 1751F-630 §2, §3, §4 | 3.1, 3.2, 3.3 |
| RUS Bulletin 1715E-110 | 3.4 |
| IEEE 1222 §5 | 3.4 |
| USGS / NRCS / FEMA (public domain) | 3.1 |
| AASHTO Utility Accommodation Policy | 3.2, 3.3, 3.4 |
| FHWA Utility Accommodation Policy | 3.1, 3.2 |

---

## Push Notes

Lesson 3.4 commit rebased into signing error when Topic 2 Batch B agent pushed 5 commits to the branch concurrently. Rebase aborted; resolved with `git merge --no-edit origin/claude/...` (merge commit `3be22a8`). All four lesson files confirmed present in working tree and remote. No content was lost or altered during resolution.

---

## One Sample Question Per Lesson

**3.1:** "The NRCS Web Soil Survey shows 'highly corrosive to uncoated steel' for a 0.4-mile direct-bury segment. How should this affect the cable specification?" — Correct: specify dielectric (non-metallic) armor or fully non-metallic construction for the corrosive segment. [ANSI/TIA-758-C §5.6.2]

**3.2:** "A surveyor records a utility marking at station 31+20, 5 feet right of baseline. The proposed cable centerline is at the baseline, burial depth 36 inches; atlas shows utility depth 30 inches. Is this a conflict?" — Correct: potential conflict requiring depth investigation — trench at 36 in. near utility at 30 in. could undermine it; vacuum excavation or pot-hole to confirm before finalizing design.

**3.3:** "A cable is attached at 30 ft on each end pole of a 300-ft span over a state highway. Sag under heavy ice load is 12.8 ft. Does this satisfy NESC Rule 232?" — Correct: midspan clearance = 30 − 12.8 = 17.2 ft > 15.5 ft minimum. Yes, compliant. [NESC C2-2023, Rule 232]

**3.4:** "What is the maximum span length for a cable with w = 0.25 lb/ft, H = 500 lb, attachment height 30 ft, and 15.5 ft required clearance over a road?" — Correct: S_max = 14.5 ft; L_max = √(8 × 500 × 14.5 / 0.25) = √232,000 ≈ 481 ft; practical design span ≤ 450 ft. [NESC C2-2023, Rules 230, 232; IEEE 1222 §5]

=== BATCH A REPORT END ===
