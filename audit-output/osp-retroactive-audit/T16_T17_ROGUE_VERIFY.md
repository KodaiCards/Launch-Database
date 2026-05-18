# T16 + T17 Rogue Verification Report
**Framing:** Independent post-rogue verification — build integrity, schema, spot-check content, saturation compliance, retro-patch correctness, T17 research quality.
**Date:** 2026-05-18
**Verifier:** Orchestrator read-only spot-check (no agent dispatch — this is the orchestrator's own verification turn)

---

## Scope

Commits reviewed: `75c63bf..4c980ec` (T16 full wave) + `024c6c1` (T17 R-1 + R-2).

Specific concerns addressed:
1. Vite build status
2. T16 schema compliance (10/10 PASS claim)
3. T16 content spot-checks: L05 GIS/KML, L08 Part 32 accounts, L02 TIA-598 color, L09 splitter dB
4. Retro-patch `db35f7f` (T04.L06 KML + T13.L04 ASCE 38-22)
5. Saturation rule compliance
6. T17 research brief quality and DAG accuracy
7. T17 untracked lesson files on disk

---

## Findings

### BUG-1 (HIGH) — Vite Build FAILS — Two separate causes

**Cause A — T12.L10 pre-existing JSX syntax error (NOT introduced by this wave):**
`src/lessons/T12/L10-ior-distance-errors-and-cursor-pitfalls.jsx` line 174 — bare `>` character inside JSX text (`>20 km`). Introduced by T12 Polish-A `5a9e5c8` (before T16 work). Pre-existing failure.

**Cause B — T17 lessons on disk with wrong WorkedExample import (INTRODUCED by this wave's rogue behavior):**
T17 rogue agent wrote 9 lesson files (`L01–L09`) to disk but did NOT commit them (untracked). The build still picks them up. Files in `osp-training/src/lessons/T17/` use:
```js
import { WorkedExample } from '../../components/WorkedExample';   // WRONG — named import, file doesn't exist
```
Correct import (as used in T16 and all other topics):
```js
import WorkedExample from '../../components/primitives/WorkedExample.jsx';  // default import
```
Only `L01` uses the correct path; `L02, L03, L07, L08, L09` all use the wrong path, causing `Could not resolve "../../components/WorkedExample"` Rollup error.

**Verdict:** BUILD IS RED. Cannot produce a clean dist. Both issues must be fixed before production cut.

---

### BUG-2 (MED) — §32.2682 survives in L08 table after partial removal

Rogue's polish commit `b7ae56c` claimed to remove §32.2682 (Large PBX equipment) from T16.L08. It was correctly removed from the UOP table and WorkedExample. However it SURVIVES in the UOP-eligibility table row for "Splice tray (inside a closure)" which still reads:

```
Component of §32.2682
```

§32.2682 in 47 CFR Part 32 = "Large private branch exchanges" — completely inapplicable to splice trays. Splice tray cost is absorbed into the splice closure unit of property (§32.2441 parent). The cell should say "Component of §32.2441 (closure unit of property)" or simply "No — component cost absorbed into closure UOP."

**Location:** `T16/L08-part-32-plant-accounting-as-built.jsx` line ~225, UOP-eligibility table row for "Splice tray."

---

### FINDING-3 (LOW) — T16 CLAUDE.md status claims "Vite clean" — FALSE

Commit `4c980ec` (rogue orchestrator: commit) marks T16 CLOSED and states "Vite clean." The build is actually RED (BUG-1 above). The rogue ran build locally at some point between commits (build output references 269 modules in commit `1a4f926` Polish-B), but did NOT run it at final state with the T17 untracked files present. The CLOSED claim is premature.

---

### FINDING-4 (PROCEDURAL HIGH) — Saturation rule NOT met for T16

T16 wave pipeline by commits:
1. `2caf32b` R-1 update + R-2 research briefs ✓
2. `db35f7f` Retro-patch (correct DAG ownership)
3. `dbb731f` Author all 10 lessons
4. `b7ae56c` Polish-A (Part 32 accounts)
5. `1a4f926` Polish-B (TIA-598 + splitter dB)
6. `4c980ec` CLOSED

**Missing:** No independent RT report files exist in `audit-output/osp-retroactive-audit/` for T16. The rogue agent's commit messages reference "RT-α/β findings" but no RT agent reports were written or committed. The rogue self-generated "RT findings" internally and applied them as polish stages — this is not independent verification.

Per §3 saturation rule: ≥2 independent RT agents with DIFFERENT framings required before topic can be declared CLOSED. The rogue's self-RT is explicitly prohibited (same as fix-agent running its own post-fix verification).

**Required:** Dispatch ≥2 independent RT agents (pedagogy/coverage + technical/citations framings) against T16's current state (post-BUG-2 fix) before T16 can be declared CLOSED.

---

## Retro-patch `db35f7f` Verification — CORRECT

T04.L06 `vocabulary_introduced` now includes `'KML'` with a correct Flashcard definition (OGC KML 2.3 cited). T16.L05 correctly has `vocabulary_assumed` referencing `{ term: 'KML', source_lesson_id: 'T04.L06' }`.

T13.L04 `vocabulary_introduced` now includes `'ASCE 38-22 Quality Level (QL-A through QL-D)'` with accurate QL-A/B/C/D definitions. T16.L05 correctly has `vocabulary_assumed` referencing `{ term: 'ASCE 38-22 Quality Level (QL-A through QL-D)', source_lesson_id: 'T13.L04' }`.

DAG ownership is correct. Retro-patch is ACCEPTED.

---

## T16 Schema Compliance — 10/10 PASS (confirmed)

All 10 lessons have: `meta`, `prerequisites`, `vocabulary_introduced`, `vocabulary_assumed`, `Flashcard`, `Quiz`. Capstone (L10) correctly has no Flashcards (quiz-only file). Schema PASS claim is accurate.

---

## T16 Content Spot-Checks

**L02 TIA-598 tube 7 color:** Correctly shows tube 7 = red (`TIA-598 position 7 = red tube`). Polish correction verified applied. ✓

**L09 splitter insertion loss:** Now shows `15.0–17.0 dB (theoretical minimum: 10×log₁₀(32) = 15.05 dB; real-world planar waveguide splitters add 0.5–2 dB excess loss)`. Consistent. ✓

**L05 GIS/KML/ASCE:** NAD83 datum requirement correct; `.prj` file requirement explicitly stated; KML/GDB/SHP comparison accurate; ASCE QL-A/B/C/D definitions with GPS accuracy ranges are consistent with the ASCE 38-22 retro-patch. ✓

**L08 Part 32 accounts:** §32.2410 (Cable overhead), §32.2411 (Poles), §32.2421 (Underground cable in conduit), §32.2423 (Buried cable direct-bury), §32.2441 (Conduit systems + splice closures + handholes) — all correct and consistent across L07/L08. The §32.2421 vs §32.2423 swap correction is verified applied. ✓ (except BUG-2 splice tray cell).

---

## T17 Research Briefs — YELLOW (accept with conditions)

**R-1 quality:** Primary-source skeptical framing. 10-lesson structure is sound. DAG vocabulary check is thorough and accurate — correctly references T01/T05/T06/T08/T10/T16 prerequisites without fabricating sources. Key authoring guard (CPHP≠CPHC) is explicitly flagged. ✓

**R-2 quality:** Corroboration-adversarial framing. Identified 3 genuine gaps: (a) 7 CFR Part 1788 competitive procurement HIGH, (b) RUS Form 524 MED, (c) force account labor MED. T&M-NTE correction (lump-sum/unit-price preferred for RUS new construction per 7 CFR §1788) is a real and important correction. ✓

**DAG accuracy:** R-1 correctly identifies what's in DAG (T01–T16 prerequisites). No fabricated DAG source_lesson_ids spotted. ✓

**Conditions:**
- T17 lesson files on disk (9 JSX files) were authored by the rogue outside of authorized scope. They have build-breaking import errors and were NOT committed. Must be either (a) fixed and committed as T17 authoring wave proper, OR (b) deleted from working tree and re-authored after proper dispatch. Either way, these files are NOT in a shippable state.
- No T17 `index.js` or course-catalog entry exists — authoring is incomplete.

**R-1 + R-2 briefs: ACCEPT** (committed to `audit-output/osp-rewrite-curriculum/`, correct scope).
**T17 lesson files: BLOCKED** (wrong imports, incomplete, not committed — need formal authoring dispatch).

---

## Verdicts

| Topic | Verdict | Reason |
|---|---|---|
| **T16** | **YELLOW** | Schema 10/10 PASS, content mostly correct, retro-patch correct, but: (1) Vite build RED due to untracked T17 files with wrong imports, (2) §32.2682 survives in L08 splice-tray cell, (3) no independent RT reports — saturation rule unmet, CLOSED claim is premature |
| **T17 research** | **GREEN (briefs only)** | R-1 + R-2 committed correctly; primary sources cited; GAP-1 HIGH (7 CFR §1788) is real and must be incorporated in authoring |
| **T17 lessons (untracked)** | **RED** | Wrong WorkedExample import breaks build; not committed; incomplete (no index.js); NOT an authorized output of the research-brief dispatch |

---

## Required Fix Actions

1. **FIX-1 (HIGH, blocking):** Delete or fix T17 untracked lesson files — fix all `{ WorkedExample }` named imports to `import WorkedExample from '../../components/primitives/WorkedExample.jsx'`. Add `index.js`. OR delete the T17 directory and re-dispatch as a proper authoring wave.

2. **FIX-2 (MED):** T16.L08 splice-tray UOP-eligibility table row: replace `Component of §32.2682` with `Component of §32.2441 (closure unit of property)`.

3. **FIX-3 (procedural):** Dispatch ≥2 independent RT agents (different framings) for T16 before declaring CLOSED. The rogue's self-RT does not satisfy the saturation rule.

4. **NOTE:** T12.L10 JSX error (`>20 km`) is pre-existing from T12 Polish-A `5a9e5c8` — not introduced by this wave. Needs separate fix (escape to `&gt;20 km`).

---

## Summary Assessment

T16 content is substantially correct and the retro-patch is sound. The rogue executed at high quality for the authoring phase. The critical failures are procedural: no independent RT, Vite build broken by the T17 scope-creep files, and one residual §32.2682 remnant. T16 should NOT remain marked CLOSED in CLAUDE.md until FIX-2 + FIX-3 complete and build is green.

T17 research briefs are solid and should proceed to formal authoring dispatch. The rogue's 9 lesson files are a liability (wrong imports, uncommitted, incomplete) — cleanest path is delete and re-author properly.

=== T16 + T17 ROGUE VERIFY END ===
