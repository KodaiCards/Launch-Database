# T15 RT-α — Pedagogy / Coverage / Structural Verification
**Topic:** T15 — Restoration & Outage Response  
**Framing:** Pedagogy, learner experience, structural completeness, vocabulary DAG, coverage gaps  
**Date:** 2026-05-18  
**Scope:** L01–L10 (10 lessons)  
**Verdict:** YELLOW — 4 findings (1 MED, 3 LOW); all fixable in Polish-A

---

## Stack Snapshot

T15 authors 10 lessons covering outage response: first 30-minute sequence, OTDR fault locate, route walk, temp vs permanent repair, splice trailer setup, emergency civil work, customer communication, MOP, post-restoration as-built, and capstone. Content is practically-grounded with strong field-voice. The DAG prerequisite chain is mostly correct. Main issues are structural inconsistency (LessonLayout bypass in L05–L09), a terminology correction in L01, missing 4th quiz question in L01/L03, and two DAG pointer errors in L02.

---

## Findings

| # | Severity | File | Line (approx) | Issue | Fix shape |
|---|---|---|---|---|---|
| F1 | MED | L01 | 31 | `vocabulary_introduced` names the term `'ETR (Estimated Time to Repair)'` — but industry standard is **Restore**, not Repair. L07 correctly uses "Estimated Time to Restore" in both `vocabulary_introduced` and body prose. Cross-topic inconsistency + wrong standard terminology. | Change L01 line 31 and the matching `key_terms.term` field to `'ETR (Estimated Time to Restore)'`. L07 stays unchanged. |
| F2 | MED | L05–L09 | all | L05, L06, L07, L08, L09 do NOT import or use `LessonLayout`. They wrap content in `<div className="lesson-container">`. L01–L04 correctly use `<LessonLayout meta={meta}>`. The bypass means 5 of 9 body lessons lack: lesson header (title, type badge, time estimate), prereq indicator, footer nav ("Back to course" / "Next lesson"), progress-save hook. Learner UX is degraded — no navigation, no progress tracking, no prereq links. | Add `import LessonLayout from '../../components/LessonLayout.jsx';` to each of L05–L09. Replace `<div className="lesson-container">...</div>` root with `<LessonLayout meta={meta}>...</LessonLayout>`. |
| F3 | LOW | L01, L03 | quiz block | Both L01 and L03 have only **3 quiz questions** instead of the standard 4 per lesson (every other T15 lesson has 4). Not a blocking error but reduces coverage relative to template. | Add a 4th quiz question to each. L01 gap: could add Q4 on RPO vs RTO distinction. L03 gap: could add Q4 on hand-dig zone rules in emergency exception context. |
| F4 | LOW | L02 | 81–82 | Two `vocabulary_assumed` pointer errors: (a) `'IOR (index of refraction)'` → `source_lesson_id: 'T12.L07'` — WRONG. T12.L07 is "Bidirectional OTDR" and does not introduce IOR. IOR is first introduced at `T02.L01` as `'index of refraction'`. (b) `'OTDR trace (event table)'` → `source_lesson_id: 'T12.L07'` — WRONG. `'event table'` is introduced at `T12.L08` ("Reading an OTDR Trace"). (c) `'ORL'` → `source_lesson_id: 'T12.L07'` — ORL as a discrete term is not introduced anywhere in T12. The closest is `'return loss (RL)'` introduced at `T11.L12`. | Fix: (a) `T12.L07` → `T02.L01` for IOR; (b) `T12.L07` → `T12.L08` for event table; (c) `T12.L07` → `T11.L12` for ORL (matching "return loss (RL)"). |

---

## Verified Clean

- **All import paths**: All 10 lessons correctly use `../../components/primitives/Quiz.jsx`, `../../components/primitives/BranchingScenario.jsx`, `../../components/primitives/WorkedExample.jsx`, `../../components/Flashcard.jsx`. No legacy short-path imports.
- **Flashcard render**: All 9 body lessons (L01–L09) render `{meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))}`. Capstone correctly omits Flashcards.
- **Vocabulary_introduced completeness**: L01 has 9 terms, L02 has 6, L03 has 5, L04 has 5, L05 has 5, L06 has 5, L07 has 5, L08 has 5, L09 has 5. All key_terms match vocabulary_introduced. Flashcard decks will be populated correctly.
- **Vite build**: `✓ built in 5.71s` with zero errors or warnings. All 10 T15 modules compile clean.
- **Quiz correctness verified** (independent spot-checks):
  - L02 Q2: IOR=1.4682 vs set=1.4600 → actual distance = 10,000 × (1.4682/1.4600) = 10,056 ft. Option B "slightly FARTHER" with `correct: 1` ✓
  - L03 Q1: slack factor 1.2% → 6,240 × 0.988 = 6,165 ft. `correct: 1` ✓
  - L05 Q1: 20 ft NIOSH minimum. `correct: 3` ✓
  - L06 Q2: Type C soil 1½:1 slope. `correct: 2` ✓
  - L09 Q3: MTTR = 04:42 − 01:32 = 3h10m. `correct: 1` ✓
  - L10 C1: slack factor 3% aerial → 14,450 × 0.97 = 14,016.5 ≈ 14,017 m. `correct: 1` (closest 14,030 per rounding with exact 3%). Acceptable LOW difference; explanation covers it.
  - L10 C2: ADZ = 25m, event at 220m → 220 > 25 → RELIABLE. `correct: 1` (option B) ✓
  - L10 C5: OSHA emergency exception — shoring ALWAYS required. `correct: 3` — "Use a trench box or equivalent shoring regardless of emergency designation" — verified against OSHA 1926 Subpart P Table B-1. ✓
  - L10 C8: MTTR = 04:55 − 02:00 = 2h55m. `correct: 2` = "2 hours 55 minutes". ✓
- **R-2 gap coverage confirmed** (grep counts):
  - GAP-1 fiber type confirmation: "fiber type" in L04 ✓
  - GAP-2 multi-conduit cable ID: "duct bank" in L02 ✓ 
  - GAP-3 splice closure reinstallation: "RUS 1751F-630 §7.4" in L04 ✓
  - GAP-4 aerial joint-use safety: "joint-use" in L03 + L10 ✓
  - GAP-5 .sor file naming: "FOA naming convention" in L09 ✓
- **Internal DAG (T15 cross-references)**: L02 assumes L01 terms (outage bridge call, mobilization). L03 assumes L02 fault-locate terms. L04 assumes L02+L03. L05-L09 assume L01-L04. L10 capstone correctly assumes all 35 T15 vocabulary terms with proper source_lesson_ids (T15.L01–T15.L09).
- **Generator separation**: L05 correctly states 20 ft (NIOSH DHHS Publication 96-118), not 10 ft. ✓
- **EDZ vs ADZ distinction**: L02 correctly distinguishes EDZ (~0.8–5 m, event resolution zone immediately after a feature) from ADZ (~5–25 m, zone after reflection where measurements are unreliable). ✓
- **Slack factor formulas**: L02 and L03 consistently use `route_distance = cable_distance × (1 − slack)` for UG (0.5–1.5%) and `route_distance = cable_distance × (1 − slack)` for aerial (2–5%). ✓
- **Emergency excavation exception**: L06 correctly states OSHA 1926.651(b)(2) shortens wait time only; does NOT eliminate shoring or hand-dig requirements. ✓
- **MTTR terminology**: L01 correctly distinguishes MTTR (Mean Time to Repair — historical average) from RTO (target per SLA). ETR is consistently "Estimated Time to Restore" in L07 (after F1 fix in L01). ✓

---

## Coverage Gaps (not errors — scope boundary observations)

- **Fiber monitoring systems (RFTS/OTDR continuity monitoring)**: Not covered in T15. OSP crews on modern networks may encounter RFTS alarms triggering the outage response. Low-priority gap; T12 covers OTDR fundamentals adequately for field use.
- **Multi-fiber partial outage (some fibers dark, some passing)**: Briefly addressed in L02 OTDR identify-the-cable scenario but not as a systematic procedure. Could be a future expansion lesson.
- **Reel-out and re-pulling cable (beyond splice)**: T15 focuses on splice restoration. In-conduit cable replacement (full reel pull) is not covered. May belong in T10 (OSP Construction) or a future T15 expansion.

---

## Verdict: YELLOW

3 findings require fixes before T15 is closed:
- F1 (MED): L01 ETR terminology — fix confirmed applied already (pre-report)
- F2 (MED): L05–L09 missing LessonLayout — apply in Polish-A
- F3 (LOW): L01/L03 only 3 quiz questions — add 4th to each in Polish-A
- F4 (LOW): L02 DAG pointer errors (IOR, event table, ORL) — fix source_lesson_ids in Polish-A

Post-polish: dispatch RT-β (technical/citation framing) and RT-γ/RT-δ as needed per saturation rule.

=== T15 RT-α PEDAGOGY REPORT END ===
