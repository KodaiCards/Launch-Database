# T07 Polish-A — Fix Notes

Wave: T07 Polish-A
Agent: fix-agent
Canonical source: RT-β `c0714f6` + Haiku tiebreaker `911128d`
Commit(s): see git log

---

## H-NEW-1 — L04 18 ft → 15.5 ft communications cable road clearance

### PRIMARY-SOURCE VERIFICATION LOG (cascade-defense §8)

Tiebreaker `911128d` used: ikeGPS, Hi-Line NESC 2023 Clearance Charts, OJUA, North Central Electric, cooperative.com.

Independent verification (DIFFERENT source family — web search snippets from multiple utility compliance references):

**Source 1:** Web search aggregate across 5+ NESC compliance documents (2026-05-17):
> "the minimum vertical clearance required for communications cables and conductors over roads, streets, and other areas subject to truck traffic is **15.5 feet** (4.7 meters)"

**Source 2:** Web search snippet referencing NESC Table 232-1 application guides:
> "Communication cables and conductors may have a clearance of 15 ft where poles are back of curbs or other deterrents to vehicular traffic" — i.e., 15 ft applies only where trucks CAN'T reach; the baseline for truck-accessible roads is **15.5 ft**.

**Distinction confirmed:** Supply conductors (power) require **18 ft** over the same truck-accessible roads. Communications cables require **15.5 ft**. These are separate rows in NESC Rule 232 Table 232-1. T07.L04 was teaching 18 ft (the supply row) in an OSP/comms context — a classification error.

**Confidence: HIGH** — 5+ independent sources converge. Same conclusion as tiebreaker but from different source family (web search utility compliance guides vs tiebreaker's OJUA/ikeGPS primary docs). Cascade-defense satisfied.

---

## Fixes applied

### H-NEW-1 — 6 locations in L04 corrected (18 ft → 15.5 ft + supply/comms distinction added)

| Location | BEFORE | AFTER |
|---|---|---|
| WorkedExample `Clr_min` value | `value: 18.0` | `value: 15.5` |
| WorkedExample `Clr_min` description | "minimum height is 18 feet" | "minimum height for a communications cable … is 15.5 ft … Note: supply conductors require 18 ft" |
| Step 4 explanation | "Minimum required by NESC Rule 232 is 18.0 ft. 22.5 ft >> 18.0 ft." | "Minimum … for communications cable … is 15.5 ft … 22.5 ft >> 15.5 ft … (Supply conductors require 18 ft … but this is fiber, not power.)" |
| sanityCheck | "4 feet above the 18-foot road clearance minimum" | "7 feet above the 15.5-foot communications-cable road clearance minimum … (The 18 ft value applies to supply conductors, not fiber/comms cables.)" |
| Q3 prompt | "requires a minimum height of 18 feet" / "cable at 16.8 feet" | "requires a minimum height of 15.5 feet" / "cable at 13.2 feet" |
| Q5 scenario + answer | "NESC Rule 232 requires 18 feet minimum" / "16.0 feet would be below 18-foot Rule 232 minimum" | "requires 15.5 feet minimum for communications cables" / "14.5 feet would be below 15.5-foot Rule 232 minimum" |

Also fixed:
- Prose "Rule 232 clearance field check" section: rewrote bullet list from "18 ft above roads" to "15.5 ft above roads (truck-accessible)" with explicit supply vs. comms callout box
- Acronym table: updated NESC description to mention separate rows for supply vs. comms

### NB-1 — L04 `vocabulary_assumed` term string fix

| BEFORE | AFTER |
|---|---|
| `{ term: 'NESC Rule 232', source_lesson_id: 'T05.L01' }` | `{ term: 'Rule 232', source_lesson_id: 'T05.L01' }` |

T05.L01 introduces `'Rule 232'` (exact string). The compound `'NESC Rule 232'` is not in any lesson's `vocabulary_introduced` — broke the DAG pointer.

### M-NEW-1 — 12 broken DAG term-string mismatches corrected

| Lesson | Broken term | Fix applied |
|---|---|---|
| T07.L01 | `'attachment point'` → T01.L02 | Changed to `'attachment'` (T01.L02 actually introduces `'attachment'`) |
| T07.L02 | `'existing utilities'` → T04.L01 | Changed to `'existing utility'` (T04.L01 introduces singular) |
| T07.L02 | `'pole locations from design'` → T04.L02 | Removed — no lesson introduces this compound term; T04.L02 introduces drone/LiDAR terms, not pole location context |
| T07.L03 | `'pole numbering from survey'` → T04.L02 | Removed — no lesson introduces this term |
| T07.L03 | `'attachment height'` → T07.L01 | Removed (T07.L01 has no such term); replaced with `'measurement tolerance'` + `'stake'` from T07.L01, and `'stationing'` from T07.L02 which are the real prerequisites for photography/coding |
| T07.L03 | `'staking notes'` → T07.L01 | Changed to `'stake'` (T07.L01 introduces `'stake'`) |
| T07.L04 | `'NESC Rule 232'` → T05.L01 | Changed to `'Rule 232'` (exact string T05.L01 introduces) — counted in NB-1 |
| T07.L04 | `'attachment point'` → T01.L02 | Changed to `'attachment'` |
| T07.L05 | `'RUS program context'` → T04.L01 | Changed to `'site walk'` (T04.L01 introduces `'site walk'` — closest applicable prerequisite concept) |
| T07.L05 | `'make-ready data'` → T07.L01 | Changed to `'field verification'` (T07.L01 introduces `'field verification'` — functionally prerequisite for Form 740 completion) |
| T07.L05 | `'pole ID sequence'` → T04.L02 | Removed — no lesson introduces this term; T04.L02 covers drone/LiDAR/photogrammetry |
| T07.L07 | `'PI (point of intersection)'` → T07.L02 | Changed to `'PI'` (T07.L02 introduces `'PI'` exactly) |

---

## Validation results

- DAG broken pointers (T07-specific): **12 → 0**
- Total DAG broken pointers: 133 → 121
- Schema validator T07: **10/10 PASS**
- Vite build: **✓ built in 6.00s** (zero errors)

=== T07_POLISH_A_NOTES END ===
