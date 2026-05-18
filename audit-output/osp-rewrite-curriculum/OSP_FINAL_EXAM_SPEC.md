# OSP Course Final Exam Specification

**Status:** Architecture spec for implementation. No questions authored yet.  
**Prepared by:** Worker agent  
**Date:** 2026-05-18

---

## 1. Exam Overview

- **Title:** OSP Course Mastery Exam
- **Question count:** 60 total
- **Pass threshold:** 80% (48/60 correct)
- **Format:** Fixed-answer only (MC, drag-match, fill-in-blank)
- **Time limit:** 90 minutes
- **Attempts:** 1 per session; retake allowed after 7-day cooldown
- **Look-back:** Disabled — no lesson access during exam

---

## 2. Domain Breakdown (19 Topics)

| Topic | Weight | Q count | Focus |
|---|---|---|---|
| T01 Fundamentals | 5% | 3 | OSP vs. ISP, vocabulary |
| T02 Fiber Physics | 8% | 5 | attenuation, link budget, wavelengths |
| T03 Cable Selection | 6% | 4 | fiber types, armor, bend-radius |
| T04 Route Survey | 4% | 2 | site walk, LiDAR, handoff |
| T05 Aerial Design | 12% | 7 | NESC clearances, sag-tension, pole loading |
| T06 Underground | 8% | 5 | burial depth, conduit fill, HDD |
| T09 Permitting | 7% | 4 | NEPA, §106, permit layers |
| T07 Staking | 3% | 2 | stake placement, P.I., RUS Form 740 |
| T08 Make-Ready | 4% | 2 | OTMR, simple vs. complex, 15-day clock |
| T10 Construction | 6% | 4 | call-811, slack loops, restoration |
| T11 Splicing | 10% | 6 | fusion, splice loss, color codes |
| T12 Testing | 8% | 5 | OTDR, OLTS, event analysis |
| T13 Inspection/QA | 4% | 2 | punch list, RUS Form 219 |
| T15 Restoration | 3% | 2 | fault locate, temporary repair |
| T16 As-Built/GIS | 4% | 2 | splice matrix, TIA-606, reconciliation |
| T17 Estimation | 3% | 2 | CPHP/CPHC, cost modeling |
| T18 Safety/OSHA | 7% | 4 | LOTO, confined space, PPE, MAD |
| T19 Headend/CO | 5% | 3 | OLT, –48VDC, grounding boundary |
| T14 Bonding/Grounding | 5% | 3 | MGN, IBT, GES, NEC 250.52 |

**Total:** 60 questions across 19 topics.

---

## 3. Question Format Distribution

- **MC (single-answer):** 40 questions — 67%
- **Drag-match (pair terms ↔ definitions / scenarios ↔ responses):** 12 questions — 20%
- **Fill-in-blank (single word / number with tolerance):** 8 questions — 13%

**No true/false, no multi-select, no ordering/ranking.** Fixed-answer ensures objective scoring without ambiguity.

---

## 4. Question Coverage Rules

1. **NO look-ahead to future topics in DAG.** E.g., T05 (Aerial) questions never assume T14 (Bonding) vocabulary. Prerequisite chains enforced.
2. **Tier weighting:** foundations get ~70% of domain questions; working+advanced get ~30%. T05 (largest, 15 lessons) gets 7 Q's; T01 (smallest real topic, 10 lessons) gets 3 Q's.
3. **Pass-critical domains (T05, T11, T02, T12):** score algorithms flag domain <70% as "retake focused on X."
4. **Math-heavy topics:** ≥1 calc verification (sag, load, fill %, link budget). Answer can be short-answer (e.g., "2.4" for 2.4 ft) with ±5% tolerance.

---

## 5. Persistence & Scoring

**Table:** `training_cert_attempts` (existing, Postgres schema locked).  
- New column `cert_track` must include `'OSP-General-Final'` option (vs. existing `'OSP-Designer'`, `'CFOS-O'`, `'CFOS-T'`).  
- Stores: `user_id`, `cert_track='OSP-General-Final'`, `attempt_date`, `score` (0–100), `passed` (boolean, score ≥80), `time_taken_seconds`, `domain_scores` (jsonb: `{T01: 67, T02: 100, ...T14: 75}`).

**Retake cooldown:** 7 days enforced in API layer (`GET /api/training/can-retake-exam` returns `{allowed: false, next_eligible_date: ISO8601}`).

---

## 6. UI Flow

1. **Splash entry:** "Final Exam" tile (shows "You scored 82% on 2026-05-18. Retake available 2026-05-25.") OR ("Not attempted" / "Start exam").
2. **Pre-exam modal:** "90-minute timer starts on first question. No pausing. No lesson look-back. Continue?" → Confirm.
3. **Exam view:** questions 1/60 → 60/60 progress bar. MC/drag/blank rendered per question `format_type`. Submit each answer (no validation until submit-all).
4. **Post-exam:** score reveal, domain breakdown bar chart, "Retake available [date]" or "Congratulations, you passed!" CTA.
5. **Admin view:** `/admin/training/exam-results` lists all users' attempt history + domain breakdowns for cohort analysis.

---

## 7. Scoring Algorithm

```
score = (correct_answers / 60) × 100
passed = score >= 80
domain_score[X] = (correct_in_domain_X / question_count_X) × 100
```

No weighted scoring — all 60 questions equally weighted (1 point each).

---

## 8. Autogeneration & Maintenance

- Question pool lives at `osp-training/src/data/exam-questions/` (per-domain .json files).
- 6-question bank per domain (60 total → 60 Qs used, 0 reserve). Shuffle on each exam session.
- Difficulty tracking: tag questions `{difficulty: 'foundation' | 'working' | 'advanced'}`. Maintain 70/30 ratio per domain when pool rotates.

---

## 9. What's NOT Spec'd (Future Refinement)

- Specific question text (authoring phase).
- Proctoring / academic integrity (trust model: in-office exam or honor pledge).
- Adaptive difficulty (fixed for v1).
- Post-exam coaching recommendations (v2).
