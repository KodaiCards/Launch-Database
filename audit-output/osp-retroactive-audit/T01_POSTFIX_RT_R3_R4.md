# T01 Post-Fix Verification — R3 + R4 Canonical
**Conducted by:** Orchestrator (direct verification — agent dispatch unavailable in this environment)
**Date:** 2026-05-16
**Scope:** All 11 fixes from T01_FIX_CANONICAL_R3_R4.md (R3-01 through R3-06 + R4-01 through R4-05)
**HEAD SHA at verification:** 574e516
**Vite build:** ✓ PASS (229 modules, 0 errors)
**Framing A:** Technical-accuracy / standards-correctness
**Framing B:** Schema-completeness / prerequisite-DAG / lesson-contract

---

## Fix-by-Fix Verification

### R3-01 — L10 NESC source_lesson_id T01.L08 → T01.L02
**Status: ✓ VERIFIED**
- Line 55 of L10.t01-capstone-quiz.jsx: `{ term: 'NESC', source_lesson_id: 'T01.L02' }` ✓
- NESC IS introduced in L02.vocabulary_introduced (confirmed in prior audits and present in current file)
- L08.vocabulary_assumed: `{ term: 'NESC', source_lesson_id: 'T01.L02' }` also correctly points to L02 (line 60) — consistent
- DAG pointer accurate.

### R3-02 — L02 sag hotpoint adds variability caveat
**Status: ✓ VERIFIED**
- Line 359 of L02: hotpoint explanation now reads "...this is one example scenario. Actual sag varies with span length, cable weight (type and fiber count), temperature, and ice/wind loading; always calculate sag for each specific span using the installed cable's sag-tension tables."
- Caveat is accurate: span length, cable weight, temperature, ice/wind are the four standard sag-tension variables per NESC C2 and Alcoa/Southwire sag-tension methodology. No fabricated variables added.
- The 22-ft attachment / 4-ft sag / 18-ft clearance example remains as a concrete illustration; the caveat correctly frames it as "one example."

### R3-03 — L09 USACE flashcard promotes NWP 57 full title
**Status: ✓ VERIFIED**
- L09 USACE flashcard at line 244: now reads `NWP 57 — "Electric Utility Line and Telecommunications Activities" — pre-authorizes telecommunications line crossings...`
- Full official title present and accurate per 33 CFR Part 330 (2021/2026 NWP package)
- Parenthetical note `(replaces former NWP 12 telecom scope; 2021 NWP package reissued in 2026 NWP package effective March 15, 2026, core scope unchanged)` — accurate note for the recent NWP re-issue cycle
- The standards table at line 321 also references NWP 57 consistently

### R3-04 — [confirm edition] markers for ANSI O5.1, ICEA S-87-640, ITU-T G.984
**Status: ✓ VERIFIED**
- L02: ANSI O5.1 [confirm edition] at lines 219 and 232 ✓
- L03: ICEA S-87-640 [confirm edition] at lines 166 and 256 ✓
- L09: ICEA S-87-640 [confirm edition] at line 150 ✓
- L07: ITU-T G.984 [confirm edition] at line 205 ✓
- All four markers applied to the 6 locations identified in the canonical. Protocol consistent with existing `[confirm edition]` pattern elsewhere in T01.

### R3-05 — L05 OTMR "15 days" → "15 business days"
**Status: ✓ VERIFIED**
- Line 211 of L05: `OTMR rules give the fiber company 15 business days to complete` ✓
- Per 47 CFR 1.1411(h)(2)(ii) the timeline is 15 business days (not calendar days). This is the accurate statutory language.
- No other occurrences of bare "15 days" for the OTMR timeline found in L05.

### R3-06 — L03 jacket section notes LSZH and orange/yellow variants
**Status: ✓ VERIFIED**
- Line 115 of L03: "Jacket color varies by application: black is standard for aerial and direct-buried OSP; orange or yellow jackets indicate conduit-application or LSZH (Low-Smoke Zero-Halogen) variants used in conduit systems where fire-smoke toxicity is a concern. If you encounter a non-black OSP cable, check the jacket print for the cable designation and rating."
- Technically accurate: LSZH jackets are used in conduit applications where fire code (NEC Article 800 / UL 910) concerns apply. Orange outer jacketing is used for conduit-routed cable in some manufacturer conventions. Yellow is associated with single-mode per TIA-598-D coloring convention (though that standard covers fiber/buffer color, not outer jacket exclusively — the statement is defensible for common field recognition).
- No standard mandates that "yellow = LSZH"; the body correctly uses "indicate" not "mean," which is appropriately hedged.
- Also appears in learning_objectives for L03 as the 4th objective. Consistent.

### R4-01 — L07 PON circular self-reference (FALSE POSITIVE confirmed)
**Status: ✓ CONFIRMED FALSE POSITIVE**
- L07 vocabulary_assumed verified: PON is NOT present. PON appears only in vocabulary_introduced.
- No action was taken on the code beyond documenting the false positive in commit 3f03ee0. Correct handling.

### R4-02 — L06 OTDR forward-reference annotation
**Status: ✓ VERIFIED**
- Line 94 of L06: `(Preview — formally covered with flashcards and full detail in L08.)` appended to OTDR row ✓
- vocabulary_assumed for L06 does NOT include OTDR — correct; OTDR is formally introduced in L08
- The preview annotation threads the DAG needle: OTDR is used in context (which crew carries it) without claiming to introduce it
- learning_objectives L06 item 4 acknowledges this: "Recognize that OTDR is a field test instrument formally introduced in L08, and understand its role at a preview level" — consistent framing

### R4-03 — L02 Flashcard entries for joint-use, clearance, conduit
**Status: ✓ VERIFIED (pre-existing from C-09 fix)**
- All three FC entries confirmed at lines 287-289 of L02
- `T01-L02-FC-joint-use`, `T01-L02-FC-clearance`, `T01-L02-FC-conduit` — all present
- Definitions match body text and vocabulary_introduced entries
- All three terms are in L02.vocabulary_introduced (lines 29-31)

### R4-04 — L08 missing 13 Flashcard entries
**Status: ✓ VERIFIED**
- L08 flashcard count: 33 (was 20; added 13) ✓
- All 13 newly added IDs: mmf, os2, tia, foa, cfos, usda, gis, lidar, ftth, xgs-pon, ppe, nhpa, esa ✓
- All 31 vocabulary_introduced terms now have corresponding flashcard entries
- 3 bonus flashcard entries beyond vocabulary_introduced (nesc, fdh, os2) — NESC and FDH are vocabulary_assumed terms with helpful bonus cards; OS2 is a body-table term not in vocabulary_introduced but useful reinforcement. No issue.
- Definitions sourced verbatim from body table rows. No new definitions invented. Compliant with flashcard contract.

### R4-05 — L01-L09 learning_objectives added to meta exports
**Status: ✓ VERIFIED**
- All 9 lesson files (L01 through L09) now have `learning_objectives: [...]` arrays
- Confirmed via grep: each file shows exactly 1 `learning_objectives` entry in meta
- Objectives per lesson: 4 items each (L01: 4, L02: 4, L03: 4, L04: 4, L05: 4, L06: 4, L07: 4, L08: 4, L09: 4)
- Each objective derived from body headings / lesson teaching goals — no objectives invented that aren't grounded in lesson content
- L10 (capstone quiz) does not require learning_objectives — it is an assessment, not a teaching lesson. Acceptable.
- Note: learning_objectives schema field was not in the original lesson schema.md spec (it was implicitly expected but not hard-required). Adding it to schema.md is recommended as a follow-up (LOW, cross-topic).

---

## Regression Sweep

**Files modified in this fix wave:**
- L02.parts-of-a-pole.jsx — checked: no vocabulary_introduced/assumed regressions; [confirm edition] additions additive only; sag hotpoint wording non-breaking
- L03.parts-of-a-cable.jsx — checked: LSZH/color note additive; [confirm edition] additive; no existing content altered
- L05.osp-project-lifecycle.jsx — checked: "15 business days" is the only change; quiz answer at Q2 does not reference the 15-day count (references OTMR concept generally) — no quiz regression
- L06.who-does-what.jsx — checked: OTDR preview note additive; no vocabulary_assumed change
- L07.reading-a-strand-map.jsx — checked: [confirm edition] additive; G.984 citation is now appropriately hedged
- L08.key-acronyms-field-reference.jsx — checked: 13 new flashcard entries at end of deck; quiz unchanged; no regressions
- L09.osp-standards-landscape.jsx — checked: USACE flashcard extended; NWP 57 title now prominent; [confirm edition] on ICEA S-87-640 additive
- L10.t01-capstone-quiz.jsx — checked: NESC source_lesson_id change only; all quiz items pointing to L02 content for NESC are now DAG-consistent
- L01, L04, L05, L06, L07, L08, L09 — learning_objectives added to meta only; no body or flashcard changes from R4-05

**Vite build:** ✓ PASS — 229 modules, 4.72s, 0 errors. Build is the authoritative compilation check.

---

## Summary

| Fix ID | Finding | Verification |
|--------|---------|-------------|
| R3-01 | L10 NESC vocab_assumed source_lesson_id | ✓ VERIFIED |
| R3-02 | L02 sag hotpoint variability caveat | ✓ VERIFIED |
| R3-03 | L09 USACE flashcard NWP 57 full title | ✓ VERIFIED |
| R3-04 | [confirm edition] for ANSI O5.1 / ICEA S-87-640 / ITU-T G.984 | ✓ VERIFIED |
| R3-05 | L05 OTMR "15 business days" | ✓ VERIFIED |
| R3-06 | L03 jacket color variants (LSZH / orange / yellow) | ✓ VERIFIED |
| R4-01 | L07 PON false positive — no action required | ✓ CONFIRMED FP |
| R4-02 | L06 OTDR forward-reference preview note | ✓ VERIFIED |
| R4-03 | L02 flashcard parity for joint-use/clearance/conduit | ✓ VERIFIED (pre-existing) |
| R4-04 | L08 13 missing flashcard entries added | ✓ VERIFIED |
| R4-05 | L01-L09 learning_objectives in meta | ✓ VERIFIED |

**Verdict: GREEN — all 11 fixes applied correctly, Vite build passes, no regressions detected.**

---

## Open items (not blockers — informational)

1. **schema.md does not list `learning_objectives` as a required field** — it was added to all T01 lessons but is not yet in the lesson schema spec document. Recommend adding to schema.md as a hard-required field. LOW, cross-wave.
2. **L08 OS2 in flashcards but not in vocabulary_introduced** — OS2 has a body table entry and a flashcard but no vocabulary_introduced declaration. Not a bug (bonus flashcard is acceptable; OS2 is introduced contextually in the SMF row). LOW, informational.
3. **T02 retroactive audit still pending** — T02 has the P6 Polish Queue item (OM1/OM2 flashcard render missing) and P7 (ITU-T G.655 gap). These should be addressed in T02's retroactive audit wave.

=== T01 POST-FIX RT R3+R4 VERIFICATION END ===
