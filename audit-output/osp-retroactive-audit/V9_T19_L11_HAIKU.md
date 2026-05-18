# V9 — T19.L11 (OSP-to-ISP Handoff Walkthrough) Integrity Verification

**Verified by reading:** `/home/user/Launch-Database/osp-training/src/lessons/T19/L11.osp-to-isp-handoff-walkthrough.jsx` (lines 1–356)

**Lesson scope:** T19.L11 "OSP-to-ISP Handoff: Physical Demarcation + Responsibility Boundaries"
- Prerequisites: T19.L01–L09 (all properly declared)
- Vocabulary introduced: 9 terms
- Vocabulary assumed: 8 pointers (T01.L01, T19.L02, T19.L07×2, T19.L08, T19.L09)
- Estimated duration: 40 minutes

## Per-Section Verification

### Foundations (lines 49–75)
- ✓ Plain-English framing: "where does your job end and the ISP tech's job begin?" — clear audience pitch
- ✓ 4 Flashcard exports inline: demarcation point, demarc responsibility, provisioning request, signal acceptance testing
- Issue: 5 key_terms exported but only 4 Flashcards rendered here. 5 terms remain (ISP provisioning scope, OSP fiber termination, rack-side handoff, patch-panel boundary, fiber alignment) — **no Flashcards**

### Working (lines 81–162)
- ✓ OSP workflow: 5-step handoff sequence (design → build → verify → document → handoff) — clear ownership
- ✓ 3 demarc scenarios present: FDH (small CO), LIU (medium CO), Patch Panel (centralized)
- ✓ Responsibility split articulated clearly (OSP bullet list lines 124–131, ISP bullet list lines 134–142)
- ✓ Gray-area scenarios: 2 working examples (fiber works in OLTS but fails ISP acceptance, loss degradation over time)
- ✓ No AI references, no guesses — all framing grounded in physical handoff boundaries

### Advanced (lines 168–246)
- ✓ BranchingScenario component present: `T19_L11_handoff_tree` with 6 decision nodes
- ✓ Start state branches on diagnostic question (RX power vs OLTS re-test vs patch cable loss)
- ✓ 5 terminal outcome states: OSP fiber degradation, ISP patch cable, ISP hardware, mutual connector contamination, OSP documentation error
- ✓ Decision tree logic: each outcome includes actionable remediation steps + responsibility clarity
- **Logic spot-check (line 189–195):** RX power diagnostic correctly identifies that –35 dBm is out of spec; correctly branches to 3 hypotheses (fiber loss increase, patch cable loss, OLT receiver failure)
- **Outcome consistency:** all outcomes match prerequisites + support learning_objectives (once added)

### Quiz (lines 252–328)
**Q1 (MC, line 259):** "Where does OSP responsibility STOP?"
- Correct answer: A (demarcation point)
- Verified: matches lesson definitions (demarc = connector on patch panel / FDH / LIU where OSP fiber terminates)
- Rationale at line 268 matches Working section responsibility boundaries

**Q2 (MC, line 271):** "4.8→6.1 dB shift — who fixes?"
- Correct answer: B (OSP — fiber degraded)
- Verified: 1.3 dB shift is >0.2 dB repeatability; Working section line 154–159 confirms OSP investigates loss increases
- Rationale accurate: connector contamination + bend + splice failure are OSP-side causes

**Q3 (MC, line 285):** "RX –35 dBm (out of spec) — first diagnostic?"
- Correct answer: A (re-test fiber with OLTS at demarc)
- Verified: matches Working section troubleshooting priority (isolate fiber vs patch cable vs receiver)
- Rationale accurate: if demarc OLTS = 4.8 dB (matched baseline) → ISP problem downstream; if 6+ dB → OSP problem

**Q4 (fill-in-blank, line 298):** Demarcation point definition
- Correct answer: "demarcation" + acceptable variants ["demarc", "demarcation point", "demarc point"]
- Verified: matches Foundations Flashcard definition (line 69)

**Q5 (drag-match, line 306):** OSP vs ISP responsibility pairs
- 6 pairs, all correctly assigned:
  - OSP: design fiber path, test with OLTS, inspect fiber route
  - ISP: patch to OLT, configure port settings, monitor RX power
- Verified: matches Working section responsibility lists (lines 124–142)
- Rationale (line 324): "OSP scope ends at demarc; ISP scope begins at demarc" — accurate

### Schema Validation
**Result:** FAIL — missing required field `learning_objectives` in meta export (line 11–43)
- Schema validator output: `meta missing field: learning_objectives`
- Issue: lesson meta must include array of 3–5 learning objectives (e.g., `learning_objectives: ['Identify OSP/ISP demarcation points', 'Diagnose fiber handoff issues', ...]`)
- Impact: lesson fails schema compliance until learning_objectives added

### Flashcard Coverage
**Inventory:**
- key_terms exported (line 345–355): 9 terms
  - demarcation point ✓ (Flashcard line 69)
  - demarc responsibility ✓ (Flashcard line 70)
  - ISP provisioning scope ✗ (no Flashcard)
  - OSP fiber termination ✗ (no Flashcard)
  - rack-side handoff ✗ (no Flashcard)
  - patch-panel boundary ✗ (no Flashcard)
  - provisioning request ✓ (Flashcard line 71)
  - signal acceptance testing ✓ (Flashcard line 72)
  - fiber alignment ✗ (no Flashcard)

**Gap:** 5 of 9 key_terms missing inline Flashcard components. Requirement per directive = every lesson MUST have Flashcard for EVERY key_term in vocabulary_introduced. This is a RED blocker.

### Vite Build
- `cd osp-training && npm run build` executed cleanly
- Zero errors/warnings in T19 asset chain
- Build successful: 11.92s

## Summary

| Aspect | Status | Evidence |
|---|---|---|
| Schema compliance | 🔴 RED | Missing `learning_objectives` in meta |
| Flashcard coverage | 🔴 RED | 5 of 9 key_terms lack Flashcards |
| BranchingScenario | ✅ GREEN | 6 nodes + 5 outcomes, logic sound |
| Quiz integrity | ✅ GREEN | All 5 answers verified correct vs content |
| 3 demarc scenarios | ✅ GREEN | FDH, LIU, Patch Panel (lines 99–107) |
| AI references | ✅ GREEN | None detected |
| Vite build | ✅ GREEN | Clean, 0 errors |

## Verdict: YELLOW — Blocks publication

**Blockers (must fix before final-verify RT pair):**
1. Add `learning_objectives` array to meta export (4–5 objectives tied to BranchingScenario outcomes + quiz scope)
2. Add Flashcard components for 5 missing key_terms: ISP provisioning scope, OSP fiber termination, rack-side handoff, patch-panel boundary, fiber alignment

**Recommended fix approach:** 1-commit polish agent (scope: add learning_objectives to meta, add 5 Flashcard <li> entries in Foundations section). Expected wall-clock: ~5–8 min.

---

=== V9 HAIKU END ===
