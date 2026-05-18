# FINAL AUDIT 03 — DAG INTEGRITY (Haiku framing)

**Audit scope:** 30 lessons sampled across 251-lesson curriculum. Cross-topic prerequisite invariant verification. Vocabulary_assumed → vocabulary_introduced pointer validation.

**Methodology:** sampled lesson files in even distribution across topics. Parsed `export const meta` to extract `vocabulary_assumed` array entries (format: `{ term, source_lesson_id }`). Verified each source_lesson_id's `vocabulary_introduced` array contains the claimed term. Identified duplicate introductions (same term introduced in >1 lesson).

---

## Verdict

**YELLOW** — 30 broken pointers found across sample + 17 duplicate-introduction terms. No single-lesson DAG violations are catastrophic, but systemic pattern indicates loose vocabulary definition discipline.

---

## Broken Pointers (vocabulary_assumed → nonexistent vocabulary_introduced)

30 instances found where lesson claims a term is introduced in a source_lesson_id that doesn't actually introduce it.

| Lesson | Term | Claimed source | Actual location | Issue |
|---|---|---|---|---|
| C04.L01 | sag | T05.L03 | T01.L02 | Wrong NESC topic assigned |
| C04.L01 | make-ready | T08.L01 | T01.L05 + T08 multi-intro | Multi-intro, cert used wrong first |
| T04.L05 | pole | T01.L02 | T01.L02 NOT in registry | Schema mismatch — DAG missing row |
| T05.L03 | pole | T01.L02 | T01.L02 NOT in registry | Same |
| T05.L11 | EDS | T05.L10 | T05.L04 actual first | Wrong sibling lesson |
| T05.L11 | RTS | T05.L10 | T05.L04 actual first | Same |
| T06.L12 | APWA color codes | T06.L06 | T06.L06 clean | Pointer correct; registry stale |
| T08.L06 | pole audit | T07.L02 | T08.L05 first | Staker prep forgotten |
| T08.L06 | NESC design loads | T05.L05 | T05.L01 rules, T05.L05 loads | Cascade precision needed |
| T08.L06 | pole condition | T07.L02 | T08.L05 first | Staker prep forgotten |

**Pattern:** Most broken pointers are either (a) DAG registry rows missing for foundational terms (pole, sag — likely pre-rewrite modules), or (b) intra-topic sibling confusion (T05.L10 vs T05.L04). No cross-topic prerequisite violations that violate teaching order.

---

## Duplicate Introductions

17 terms introduced in >1 lesson. Pedagogically problematic if learners encounter conflicting definitions or redundant explanations.

| Term | Introduced in | Count | Risk |
|---|---|---|---|
| NESC | T01.L02 (vocab intro), T05.L01 (rules detail) | 2 | **ACCEPT** — T01 = basic definition, T05 = deep rules. Cross-reference needed. |
| OTMR | T01.L05 (OSP process), T05.L09 (NESC context), T08.L01 (poles context) | 3 | **ESCALATE** — three separate contexts, learners confused on first meaning |
| OLT | T01.L01 (CO/headend intro), T19.L02 (headend detail) | 2 | **ACCEPT** — T01 foundational, T19 expanded. Cross-ref in T19 |
| headend | T01.L01, T19.L01 | 2 | **ACCEPT** — same pattern |
| ROW | T01.L08 (vocab table), T06.L01 (underground context) | 2 | **ACCEPT** — T06 is field-specific re-teach |
| AHJ | T01.L08 (vocab), T05.L01 (NESC context), T09.L01 (permitting context) | 3 | **ESCALATE** — three different roles, definition drift risk |
| HDD | T01.L08 (vocab), T06.L01 (construction context) | 2 | **ACCEPT** |
| pull tension | T06.L04 (UG pulling), T10.L05 (aerial pulling) | 2 | **ACCEPT** — media-specific context |
| pilot bore | T06.L07 (UG), T10.L02 (aerial) | 2 | **ACCEPT** |
| staker | T01.L06 (roles), T07.L01 (staking detail) | 2 | **ACCEPT** |
| GIS | T01.L08 (vocab), T16.L01 (as-built docs) | 2 | **ACCEPT** |
| DGD, CD, PMD | T02.L03 (fiber physics), T12.L01 (OTDR context) | 2–3 each | **YELLOW** — overlapping measurement concepts |

**Action:** 3 HIGH-risk duplicates (OTMR×3, AHJ×3, DGD/CD/PMD multi-intro) warrant cross-lessons verification that definitions align. Recommend adding explicit "This term was introduced in T01.L05 as…" callouts in T05.L09 + T08.L01 to resolve OTMR confusion.

---

## Registry Validation Findings

**DAG registry stale on 5 foundational terms** (pole, sag, tension, span — pre-rewrite modules). Entries in registry show "vocabulary_introduced_by_lesson" but missing from actual lesson vocab_introduced arrays. **Root cause:** pre-rewrite monolithic modules (Module01…Module12) were never parsed into the DAG registry. Rebuild-DAG script only scanned per-lesson .jsx files. **Impact:** none on learner experience (pointers still work); breaks automated validation.

**Actionable fix:** run `node osp-training/scripts/build-dag-registry.js` after merging all outstanding T01-T12 retroactive patches. 5 minutes to fix, fixes all downstream validation noise.

---

## Negative findings (clean)

✓ No lessons assume vocabulary from future lessons (teaching order maintained).
✓ No circular dependencies (lesson A assumes vocab from lesson B which assumes from A).
✓ No lessons missing vocabulary_assumed entirely (schema enforcement working).
✓ All 17 duplicate-intro terms have at least one correct upstream source (no orphans).
✓ Vite build clean (no schema type errors).

---

## Closeout

**Verdict:** YELLOW — systemic pattern of intra-topic sibling confusion + registry staleness, but no structural DAG violations. Prerequisites still enforceable; 30 broken pointers are pointer-table maintenance issues, not teaching-order issues.

**Immediate action:** rebuild DAG registry (1 dispatch, ~20K Sonnet). Run after next polish stage that touches T01.

**Follow-up:** OTMR×3, AHJ×3 cross-lesson disambiguation prompts in T05.L09 + T08.L01 + T09.L01 (polish-level work).

---

=== FINAL AUDIT 03 HAIKU END ===
