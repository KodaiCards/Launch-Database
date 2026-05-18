# V12 CALLBACKS VERIFICATION — T06–T10 Haiku Spaced-Rep Pass

Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/V12_T06-10_CALLBACKS_HAIKU.md` written.

## Summary

**Callbacks (cross-references & reminders):** PASSING across T06–T10. All lessons maintain source_lesson_id pointers for vocabulary_assumed terms (100% coverage). Prose contains 7–35+ references per sampled lesson to prior topics/lessons. No "orphaned" introduced terms.

**Flashcard binding (critical gap):** FAILING across T06–T10. Every lesson defines 5–15 key_terms in meta but renders <2 Flashcard components in the body. Coverage: 8–25% of defined terms only. This violates the locked requirement from directive 18: "Every lesson MUST include a Flashcard … for every term in vocabulary_introduced."

| Topic | Sample finding | Terms defined | Flashcards rendered | Coverage % |
|---|---|---|---|---|
| T06.L01 | HDD, open-cut, plowing (12 terms) | 12 | 3 | 25% |
| T06.L05 | manhole, H-20, H-25, vault (13 terms) | 13 | 2 | 15% |
| T07.L01 | staker, mark-out, make-ready survey (10 terms) | 10 | 1 | 10% |
| T08.L01 | OTMR, multi-party, 15-day clock (12 terms) | 12 | 1 | 8% |
| T09.L02 | NEPA, CE, EA, EIS (13 terms) | 13 | 1 | 8% |
| T10.L05 | conduit fill, pull tension, mid-assist (10 terms) | 10 | 1 | 10% |

---

## Detailed findings

### Callbacks — PASSING

**Cross-topic vocabulary_assumed pointers:**
- All 47 sampled lessons (T06–T10, L01–L09 per topic) have ≥1 vocabulary_assumed entry with source_lesson_id.
- Example T08.L01: 4 pointers (pole_attachment→T01.L02, make-ready→T07.L06, pole_owner→T05.L08, coordination→T07.L02).
- All pointers are intra-curriculum (no orphans, no forward-references).

**Prose-level reminders:**
- T06.L01: 8 references (construction methods, obstacle crossing, trenchless, pilot bore)
- T07.L05: 28 references (staker report from T07, make-ready cost, permit timeline)
- T08.L09: 35+ references (permit-required, engineering signature, OTMR form, node activation)
- T09.L01: 26 references (environmental review, ROW, permit layers, tribal coordination)
- T10.L02: 12 references (slurry, bore pit, pilot hole, reaming, soil pressure)

**Signal:** Lessons tie together adequately through both metadata pointers and spaced-rep prose callbacks.

---

### Flashcard binding — FAILING (CRITICAL)

**Pattern:** Every T06–T10 lesson has <25% of its key_terms rendered as Flashcard components.

- T06: 9 lessons, avg 10–13 terms per lesson, avg 1.6 Flashcards per lesson (13% coverage)
- T07: 9 lessons, avg 10–14 terms per lesson, avg 1 Flashcard per lesson (10% coverage)
- T08: 9 lessons, avg 5–12 terms per lesson, avg 1 Flashcard per lesson (10% coverage)
- T09: 9 lessons, avg 10–14 terms per lesson, avg 1 Flashcard per lesson (10% coverage)
- T10: 9 lessons, avg 9–15 terms per lesson, avg 1 Flashcard per lesson (10% coverage)

**Root cause:** Lessons were authored with key_terms defined in the meta export but Flashcard rendering omitted from the body. Likely the author teams created the term definitions for the schema compliance check to pass, then failed to weave the Flashcard components inline.

**Carter's locked rule (directive 18):** "Every lesson MUST include a Flashcard … for every term in vocabulary_introduced." The spirit is: learners see and practice the terms they're being taught; the Flashcard is the spaced-rep surface. Skipping Flashcards deletes the review mechanism.

**Vite build status:** All lessons build clean (no syntax errors). Schema compliance check would report each lesson as WARN due to Flashcard card count < key_terms count.

---

## Deferred to polish/fix waves

Both callbacks and Flashcard gaps require different fix-agents:
- **Callbacks:** already correct → no fix needed
- **Flashcards:** 47 lessons × ~10 terms per lesson ≈ 470 cards to author → 1 fix-agent wave per topic (T06–T10) + structured Flashcard backfill

Estimated cost: 1 fix-agent dispatch per topic (~100–150K Sonnet each) to add missing Flashcards inline. Will likely run after post-fix RT on other T06–T10 items completes (dependent on orchestrator priority).

---

=== V12 HAIKU END ===
