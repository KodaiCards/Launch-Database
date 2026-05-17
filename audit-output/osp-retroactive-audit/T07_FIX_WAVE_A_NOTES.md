# T07 Fix Wave A — Notes

**SHA:** 25571c9
**Wave:** T07 retroactive audit Fix Wave A
**Canonical sources:** R-1 `5baabfb` + R-2 `be3c0f6` + R-3 `04456c8`
**Date:** 2026-05-17

## Primary-Source Verification Log

### OSHA 1910.268(g)(1) — fall protection trigger (H-3)

**Claim in canonical:** "above 4 feet" is the correct OSHA telecom pole-climb fall-protection trigger.
**Prior content:** "above 10 feet" (wrong in L01:274, L01:417/Q4 prompt, L04:467/Q2 explanation).

**Primary source verified via WebSearch (search engine confirmed OSHA.gov text):**
> "A positioning system or a personal fall arrest system shall be provided and the employer shall ensure their use when work is performed at positions more than 4 feet (1.2 m) above the ground, on poles, and on towers, except as provided in paragraphs (n)(7) and (8) of this section."

**URL:** https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.268 (confirmed via OSHA.gov search result)

**Verdict:** 4 feet confirmed. 10 feet was incorrect. All 3 locations corrected.

### NESC Rule 235 vs Rule 232 for supply-to-comm on-pole clearance (H-1)

**Verified from citation-registry.md (Last Verified: 2026-05-16):**
- Rule 232 = "Minimum vertical clearances for overhead supply and communication conductors and equipment" (ground/road/waterway clearances)
- Rule 235 = "Clearances between conductors carried on different supporting structures or on the same structure" (supply-to-comm on-pole separation)

The 40-inch (3.33 ft) supply-to-comm separation for 120/240V = Rule 235, Table 235-5.
T07.L06 was incorrectly citing Rule 232 for on-pole supply-to-comm clearance. T05.L03 already uses Rule 235 correctly.

---

## BEFORE → AFTER Per Canonical Item

### H-1: L06 Rule 232 → Rule 235 (supply-to-comm 40-in clearance)

**BEFORE (L06:183):**
```
The two clearance rules you're checking (per NESC Rule 232 [confirm edition]):
```

**AFTER:**
```
The two clearance rules you're checking (NESC C2-2023):
```

**BEFORE (L06:188-191):**
```
<strong>Clearance above the new fiber:</strong> The new fiber must be at least a
certain distance below the existing power conductors on the pole. NESC Rule 232
Table 2 specifies these values by voltage class — typically 40 inches (3.3 feet)
from a 120/240V supply conductor to a communication cable. [confirm current NESC
C2 edition Rule 232 Table 2]
```

**AFTER:**
```
<strong>Clearance above the new fiber (supply-to-comm on the same pole):</strong>{' '}
The new fiber must maintain a minimum vertical separation from the power conductors
above it on the same pole. This is governed by NESC Rule 235, Table 235-5 — not
Rule 232 (which covers ground/road/waterway clearances). Table 235-5 specifies
supply-to-communication separation by voltage class: typically 40 inches (3.33 feet)
from a 120/240V supply conductor to a communication cable attachment on the same
structure. [confirm current NESC C2 edition Rule 235, Table 235-5]
```

**BEFORE (L06 Q1 prompt):**
```
NESC Rule 232 requires 40 inches (3.33 ft) clearance above the fiber to the supply conductor.
```

**AFTER:**
```
NESC Rule 235, Table 235-5 requires 40 inches (3.33 ft) supply-to-communication separation on the same pole structure.
```

**BEFORE (L06 Q1 explanation):**
```
(Source: NESC Rule 232 [confirm edition]; RUS 1751F-630 §7.)
```

**AFTER:**
```
(Note: Rule 232 covers ground/road/waterway clearances; Rule 235 covers supply-to-comm separation on the same pole. Source: NESC C2-2023 Rule 235 Table 235-5; RUS 1751F-630 §7.)
```

Also fixed acronym table (L06:128) to mention both Rule 232 and Rule 235 roles.

---

### H-2: L02 — Introduce 'contour' here (remove broken T04.L03 claimed source)

**BEFORE (L02 vocabulary_assumed):**
```js
{ term: 'contour', source_lesson_id: 'T04.L03' },
```
T04.L03 = GIS/Coordinate Systems — does NOT introduce 'contour'.

**AFTER:**
- Removed from vocabulary_assumed
- Added to vocabulary_introduced: `'contour'`
- Added key_term definition (topographic contour line for staking terrain reading)
- Added flashcard `T07-L02-fc-contour`
- Added prose context available via the profile/terrain section

---

### H-3: OSHA 4ft trigger — 3 locations

**BEFORE (L01:274):**
```
Fall protection is required for pole work above 10 feet.
```
**AFTER:**
```
Fall protection is required for pole work above 4 feet above the ground. Any climbing...
```

**BEFORE (L01:417 Q4 prompt):**
```
OSHA 1910.268(g)(1) requires fall protection for pole work above 10 feet.
```
**AFTER:**
```
OSHA 1910.268(g)(1) requires fall protection (a positioning system or personal fall arrest system) for pole work above 4 feet above the ground.
```

**BEFORE (L04:467 Q2 explanation):**
```
OSHA 1910.268(g)(1) requires fall protection above 10 feet
```
**AFTER:**
```
OSHA 1910.268(g)(1) requires a positioning system or personal fall arrest system for any pole work above 4 feet; laser measurement from the ground sidesteps that trigger completely.
```

---

### M-1: L07 HDD T06.L04 → T06.L01

**BEFORE:**
```js
{ term: 'HDD', source_lesson_id: 'T06.L04' },
```
**AFTER:**
```js
{ term: 'HDD', source_lesson_id: 'T06.L01' },
```
T06.L04 = conduit pull tension (does not introduce HDD). T06.L01 introduces HDD.

---

### M-2: L07 open-cut T06.L03 → T06.L01 (term updated to open-cut trench)

**BEFORE:**
```js
{ term: 'open-cut', source_lesson_id: 'T06.L03' },
```
**AFTER:**
```js
{ term: 'open-cut trench', source_lesson_id: 'T06.L01' },
```
T06.L01 introduces 'open-cut trench' (exact term from vocab_introduced). T06.L03 does not introduce it.

---

### M-3: L04 + L06 make-ready T05.L08 → T01.L05

**BEFORE (both):**
```js
{ term: 'make-ready', source_lesson_id: 'T05.L08' },
```
**AFTER (both):**
```js
{ term: 'make-ready', source_lesson_id: 'T01.L05' },
```
T01.L05 introduces 'make-ready'. T05.L08 introduces 'make-ready cost estimate' (different term).

---

### M-4: L06 pole audit T04.L01 → T04.L04

**BEFORE:**
```js
{ term: 'pole audit', source_lesson_id: 'T04.L01' },
```
**AFTER:**
```js
{ term: 'pole audit', source_lesson_id: 'T04.L04' },
```
T04.L04 introduces 'pole audit'. T04.L01 introduces 'site walk'.

---

### M-5: L08 GIS T04.L01 → T01.L08

**BEFORE:**
```js
{ term: 'GIS', source_lesson_id: 'T04.L01' },
```
**AFTER:**
```js
{ term: 'GIS', source_lesson_id: 'T01.L08' },
```
T01.L08 introduces 'GIS'. T04.L01 does not.

---

### M-6: L07 + L09 vocabulary_assumed moved inside meta

Both L07 and L09 had `vocabulary_assumed` as a separate export outside the meta block (validator WARN pattern). Moved inside meta for both, then re-exported as `meta.vocabulary_assumed`.

---

### L-1: L05 RUS Form 740 title [confirm title] added

Added `[confirm official form title — commonly referenced as "Contractor's Statement and Acknowledgment" but verify against current USDA RD form catalog]` to key_term definition.

---

### L-2: L04 driveway clearance road-classification note

Added truck-accessible vs. light-vehicle-only distinction note in the 18-ft driveway bullet point with jurisdiction-check guidance.

---

### L-3: L08 FieldCom flashcard added

Added `T07-L08-fc-fieldcom` card — FieldCom was in key_terms (6 terms) but Flashcard had only 5 cards. Now 6/6.

---

### L-4: L01 Q4 stem updated

Removed "10 ft" premise from Q4 prompt. Now references the correct 4-foot trigger so learners don't internalize the wrong threshold from the question stem.

---

### L-5: L01 body belt ban paragraph added

Added callout box explaining OSHA's 1998 body belt fall-arrest ban: body belts = positioning only; full body harness (ANSI Z359.11) required for fall arrest. Located after the existing Book vs Field section.

---

### L-6: L01 ANSI Z133 / double-lanyard mention added

Added in the same callout box as L-5: ANSI Z133 100%-tie-off concept and double-lanyard technique for climbing when a PFAS is in use.

---

## Validator Output (after fixes)

```
PASS  T07/L01 through T07/L10 — 10/10 PASS, 0 warnings
(was: 10/10 PASS, 1 warning on L08 FieldCom flashcard)
```

## DAG Broken Pointer Count

- **Before:** 19 T07 broken pointers, 139 total broken
- **After:** 12 T07 broken pointers, 132 total broken
- **Reduction:** 7 T07 broken pointers fixed (matches 6 canonical M-items + 1 contour removal)

Remaining T07 broken pointers are pre-existing systemic issues (terms not introduced anywhere in curriculum — "attachment point", "NESC Rule 232" as a term, "existing utilities", etc.). These are outside this wave's scope.

## Vite Build

```
✓ built in 6.10s — 0 errors
```

## Neighborhood Scan Findings (±20 lines, same-pattern check)

- L04 `vocabulary_assumed` still has `NESC Rule 232` as assumed from T05.L01 — but "NESC Rule 232" as a vocabulary_assumed TERM (rather than the rule citation in prose) is a pre-existing systemic issue across multiple topics; not introduced by any lesson's `vocabulary_introduced`. Not in this wave's scope.
- L07 body prose references "open-cut" (not "open-cut trench") in two places — minor prose/term mismatch. Does not affect functionality. Worth a LOW flag for RT.
- L06 body prose around line 195 still references "NESC Rule 235" correctly (was already right in that bullet before fix; the error was only in the companion bullet and quiz).

=== T07 FIX WAVE A NOTES END ===
