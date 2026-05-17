# Infrastructure Build Notes — 2026-05-17

Built by: fix-agent (write-path allowlist per prompt)
Commit wave: infrastructure tooling (scripts + registries)

## Summary

Three scripts built + two registry files seeded:

| Deliverable | Path | Purpose |
|---|---|---|
| Schema validator | `osp-training/scripts/validate-lesson-schema.js` | Schema + Flashcard compliance checks for all lessons |
| DAG registry builder | `osp-training/scripts/build-dag-registry.js` | Builds/validates prerequisite DAG across all lessons |
| Scripts README | `osp-training/scripts/README.md` | Usage docs + known issues |
| Citation registry | `audit-output/citation-registry.md` | Seeded with 30+ verified citations from recent audits |
| Build notes | `audit-output/INFRASTRUCTURE_BUILD_NOTES.md` | This file |
| agent-protocol.md | Section 14 appended | Registry usage instructions for future agents |

DAG registry output: `audit-output/dag-registry.json` (generated, committed)

---

## Validator output — full run (2026-05-17)

```
Lessons checked : 125
Passing         : 78
Failing         : 47
Warnings        : 10
```

### FAIL breakdown

**38 lessons missing `learning_objectives` in meta:**
- T02: L01–L11 (11 lessons) — `learning_objectives` field omitted from meta during the T02 retroactive-audit polish waves
- T03: L01–L11 (11 lessons) — same pattern, authored without learning_objectives
- T04: L01–L09 (9 lessons) — same pattern
- T18: L01, L03–L06, L08–L09 (7 lessons) — most T18 lessons missing; L02 and L07 have it (authored in separate waves)
- T19: L01–L09 (9 lessons) — T19 authored without learning_objectives throughout

**Note:** `learning_objectives` is in the `schema.md` spec. These lessons were authored without it.
Fix: each topic's next polish wave adds learning_objectives to meta for all affected lessons.
This is a LOW severity schema-compliance issue (content is correct, metadata field is missing).

### WARN breakdown

**10 lessons where Flashcard card count < key_terms count:**
- T02/L08.smf-vs-mmf-choosing.jsx: key_terms=9, Flashcard=8 — 1 missing card
- T03/L04.messenger-lashed-vs-adss.jsx: key_terms=6, Flashcard=4 — 2 missing cards
- T03/L09.adss-span-wind-ice-loading.jsx: key_terms=5, Flashcard=4 — 1 missing card
- T07/L08.katapult-and-gis-staking-tools.jsx: key_terms=6, Flashcard=5 — 1 missing card
- T09/L02.nepa-ce-ea-eis.jsx: key_terms=8, Flashcard=7 — 1 missing card
- T09/L04.esa-bats-ipac.jsx: key_terms=8, Flashcard=6 — 2 missing cards
- T09/L05.usace-wetlands-nwp57.jsx: key_terms=8, Flashcard=6 — 2 missing cards
- T09/L06.state-dot-encroachment-permits.jsx: key_terms=7, Flashcard=6 — 1 missing card
- T19/L03.minus-48vdc-power-plant.jsx: key_terms=8, Flashcard=7 — 1 missing card
- T19/L07.rack-side-hardware-patch-panels-liu.jsx: key_terms=8, Flashcard=7 — 1 missing card

**Note:** WARNs are because the validator detects deck card count from explicit `{ id: '...' }` entries.
Some lessons use `key_terms.map(kt => ...)` which would resolve to the correct count at runtime.
Manual verification recommended before treating these as real gaps.

---

## DAG Registry output — initial run (2026-05-17)

```
Lessons processed     : 125
Unique terms introduced: 700
Duplicate introductions: 41
Assumed pointers total : 1196
Verified pointers      : 1042  (87.1%)
Broken pointers        : 155   (12.9%)
Missing source lessons : 1
Without source_lesson_id: 0
```

### Notable broken pointers (systemic patterns)

**Pattern 1 — "pole" not in any lesson's vocabulary_introduced (19 broken pointers)**
T04, T05, T07, T18 all claim `{ term: 'pole', source_lesson_id: 'T01.L02' }`.
T01.L02 teaches what a pole IS but lists it as `vocabulary_introduced: ['NESC', 'attachment', 'span', ...]`
— "pole" itself is not in that array (it's assumed as pre-existing field knowledge).
Resolution: Either add 'pole' to T01.L02 `vocabulary_introduced`, or remove from vocabulary_assumed in downstream lessons (since it's basic field terminology, not a technical term with a first-introduction).

**Pattern 2 — Rule 232 claimed as introduced by T05.L02, actually by T05.L01 (5 broken pointers)**
T05.L03, L04, L07, L08, L10 all claim `{ term: 'Rule 232', source_lesson_id: 'T05.L02' }`.
T05.L01 `vocabulary_introduced` lists both 'Rule 232' and 'Rule 235', 'Rule 250', 'Rule 261' as overview terms.
T05.L02 teaches Rule 232 in depth.
Resolution: Claims should point to T05.L01 (first introduction), not T05.L02.

**Pattern 3 — EDS/RTS not introduced in any lesson (12 broken pointers)**
EDS (Every Day Stress) and RTS (Rated Tensile Strength) appear in vocabulary_assumed across T03/T05
but neither is in any lesson's vocabulary_introduced array.
Resolution: Add both to T03.L04 (messenger-lashed-vs-adss) vocabulary_introduced, or to T05.L07 (sag-tension).

**Pattern 4 — T19 lessons claiming T01.L08 as source for OLT/ONT/FDH/feeder (7 broken pointers)**
T01.L08 (key-acronyms-field-reference) doesn't have vocabulary_introduced entries for these — they're introduced
in T01.L01 (OLT, ONT) and T01.L07 (FDH, feeder).
Resolution: T19 vocabulary_assumed pointers need correction to T01.L01 and T01.L07.

**Missing source lesson:**
- T19.L08 → "fusion splice" claims `T11.L01` as source. T11 does not exist yet (not authored). 
  Resolution: Either author T11 first, or change source to a topic that introduces fusion splice (T01.L04 discusses splice cases; actual fusion splice intro likely belongs in a splicing topic).

**Duplicate introductions (41 total):**
Many terms are introduced in both T01 (as overview) AND in their dedicated topic lesson. Examples:
- 'NESC' in T01.L02 AND T05.L01 — both are reasonable but creates DAG ambiguity
- 'OTMR' in T01.L05, T05.L09, AND T08.L01 — three introductions
- 'AHJ' in T01.L08, T05.L01, AND T09.L01
The strict DAG invariant says a term has ONE first-introduction lesson. T01.L08 (acronyms reference) 
introduces many terms that are re-introduced in depth later — this may be intentional (overview vs. 
depth introduction). Policy decision needed: does T01.L08's introduction "count" for DAG purposes?

---

## Vite build

```bash
cd osp-training && npm run build
```
Build was clean (zero errors) — scripts directory added does not affect Vite build since
scripts are not imported by the SPA source. Zero lesson files were modified.

---

## Token usage estimate

Infrastructure build: ~85K tokens (regex-based parsing approach, no parser library)
No lesson JSX files touched. Only new files written.
