# T10 RT-α Pedagogy — Post-Author Verification

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T10_POSTAUTH_RT_A_PEDAGOGY.md` written.**

**T10 RT-α pedagogy — not authoring, not Polish, not other topics.**

**Wave context:** T10 authored via rogue-dispatch (commit `1fd431d`). 12 lessons L01–L12 exist on disk. This is the first independent RT pass.
**Framing:** pedagogy / schema compliance / DAG pointer correctness / tiered-structure / Flashcard coverage
**Token cap:** 130K | **Wall-clock cap:** 8 min

---

## 1. Registry + Cascade Pattern Step-1 Scan

- **P1 (§32.2210):** Not present in T10. ✓
- **P6 (OM-series Flashcards):** Not applicable — T10 is OSP construction, not fiber physics. ✓
- **P7 (NESC §-vs-Rule):** No NESC references in T10 (underground construction topic). ✓
- **P8 (NEC Chapter 9 Table 1 fill misattribution):** L05 correctly states "NEC 770.110(B) and 800.110(B) exempt communications cables from NEC Chapter 9 Table 1. 40% fill is an industry convention, not a NEC mandate." Explicitly correct at lines 141–155. ✓
- **P11 (NWP 12 vs NWP 57):** L02 correctly cites NWP 57 (not NWP 12) throughout. Frac-out notification tied to NWP 57 conditions. ✓
- **P12 (standards edition currency):** CGA Best Practices cited as v20.0 in L01 — matches P12 registry entry for v20.0 (current 2024 release). ✓

---

## 2. Schema Validator Results

Ran: `node osp-training/scripts/validate-lesson-schema.js T10`

```
PASS  L01, L02, L06, L07, L11, L12
WARN  L03: 6 key_terms, 5 Flashcard cards
WARN  L04: 5 key_terms, 4 Flashcard cards
WARN  L05: 5 key_terms, 4 Flashcard cards
WARN  L08: 5 key_terms, 4 Flashcard cards
WARN  L09: 7 key_terms, 5 Flashcard cards
WARN  L10: 5 key_terms, 4 Flashcard cards

Summary: 12 checked / 12 passing / 0 failing / 6 warnings
```

**Identified missing Flashcard cards (cross-referenced key_terms list):**
- L03: missing `open-cut restoration` card
- L04: missing 1 card (to be confirmed by RT-β — L04 not fully cross-checked in this pass)
- L05: missing 1 card (to be confirmed by RT-β)
- L08: missing 1 card (to be confirmed by RT-β)
- L09: missing `flagger station` and `lane closure` cards (7 key_terms, only TCP / MUTCD Part 6 / advance warning area / transition taper / flagger certified covered = 5 out of 7 — `channelization device` also missing)
- L10: missing `pay application` card

---

## 3. DAG Pointer Audit

Ran: `node osp-training/scripts/build-dag-registry.js`

**BROKEN pointers confirmed for T10 (verified against source lessons):**

| Lesson | Term | T10 claims | Actual source | Verified via |
|--------|------|-----------|---------------|--------------|
| L01, L04, L08, L09, L10, L11 | `ROW` | T01.L01 or T09.L01 | **T01.L08** | T01/L08.key-acronyms-field-reference.jsx:35 |
| L01, L09 | `MUTCD` | T18.L08 | **T18.L06** | T18/L06-traffic-control-flagging.jsx:18 |
| L02, L03, L04, L05, L06, L07 | `conduit` | T06.L01 | **T01.L02** | T01/L02.parts-of-a-pole.jsx:31 |
| L02, L05 | `innerduct` | T06.L02 | **T06.L03** | T06/L03*.jsx:29 |
| L06, L07 | `bend radius` | T03.L02 | **T02.L04** | T02/L04*.jsx:17 |
| L07 | `confined space` | T18.L05 | **T18.L03** | T18/L03*.jsx:18 |
| L10 | `plan-and-profile` | T07.L01 | **T07.L02** | T07/L02*.jsx:25 |
| L08, L10, L11 | `open-cut` | T06.L01 | **NOT INTRODUCED** (T06.L01 introduces `open-cut trench`, not `open-cut`) | T06/L01 vocab_introduced |
| L04, L10 | `station` | T07.L01 | **NOT INTRODUCED** in any lesson | DAG registry |
| L05, L06 | `conduit fill (40% rule)` | T06.L04 | **NOT INTRODUCED** in any lesson | DAG registry |
| L10, L11 | `as-designed` | T04.L02 | **NOT INTRODUCED** in any lesson | DAG registry |

**DUPE violations:**
- `RUS Form 219` introduced in both T01.L05 AND T10.L11. T10.L11 should move it to `vocabulary_assumed` pointing to T01.L05.

**DAG summary: 11 broken pointer groups across 9 lessons. Systemic — T10 vocabulary_assumed table was written against an earlier draft of the DAG, not the final lesson IDs.**

---

## 4. Tiered Structure Assessment

All 12 lessons correctly implement foundations / working / advanced tiers. All include `data-tier` section attributes. Pitch quality in sampled lessons:

- **L01 (Call-811):** excellent foundations tier — opens with CGA 2024 DIRT Report statistic (196,977 strikes), plain-English rationale before procedure, acronym table present. Woven, not stacked.
- **L10 (Daily Field Reporting):** deviation log concrete scenario (finding splice at station 2340+00 because DFR logged a route shift) — exactly the kind of worked-scenario reasoning that makes field content stick.
- **L05 (Conduit Pull Tension):** WorkedExample present. capstan formula math verified: e^(μ×3π/2) at μ=0.25 = 3.248. Quiz answer (200 lbf × 3.24 = 648 lbf > 600 lbf limit) is arithmetically correct.

---

## 5. Interactive Primitive Coverage

Quick sweep across all 12 lessons:

| Lesson | Quiz | Flashcard | AnnotatedDiagram | WorkedExample | BranchingScenario |
|--------|------|-----------|------------------|---------------|-------------------|
| L01 | ✓ | ✓ | ✓ | — | — |
| L02 | ✓ | ✓ | — | — | ✓ (BranchingScenario — frac-out) |
| L03 | ✓ | ✓ | — | — | — |
| L04 | ✓ | ✓ | — | — | — |
| L05 | ✓ | ✓ | — | ✓ | — |
| L06 | ✓ | ✓ | — | — | — |
| L07 | ✓ | ✓ | — | — | — |
| L08 | ✓ | ✓ | — | — | — |
| L09 | ✓ | ✓ | ✓ | — | — |
| L10 | ✓ | ✓ | — | — | — |
| L11 | ✓ | ✓ | — | — | — |
| L12 | ✓ | — (capstone) | — | — | — |

All lessons have Quiz + Flashcard. AnnotatedDiagram in L01 + L09 where spatial layout content warrants it. WorkedExample in L05 (pull tension math). BranchingScenario in L02 (frac-out decision tree). No arbitrary primitive stuffing — primitives appear where content justifies them.

---

## 6. Negative Findings (Confirmed Clean)

- **P8 NEC fill misattribution:** NOT present — L05 correctly distinguishes convention vs code.
- **P11 NWP 12 / NWP 57 swap:** NOT present — L02 correctly uses NWP 57 throughout.
- **P1 §32.2210 cascade:** NOT present — no Part 32 CFR references in T10.
- **P7 NESC §-vs-Rule:** NOT applicable — T10 has no NESC references (underground construction).
- **Math in L05:** verified independently — multiplier correct, quiz answer correct.
- **CGA Best Practices v20.0:** correct current edition.
- **Schema PASS rate:** 12/12 lessons pass (no failing schema violations — WARNs only).
- **Vite build:** clean, `✓ built in 6.48s`, zero errors.

---

## 7. Structured New Findings

| # | Sev | Category | Lesson(s) | Finding | Fix Shape |
|---|-----|----------|-----------|---------|-----------|
| T10-A1 | MED | DAG pointer | L01, L04, L08, L09, L10, L11 | `ROW` vocabulary_assumed points to T01.L01 or T09.L01; actual source is T01.L08 | Update source_lesson_id to `T01.L08` in all 6 lessons |
| T10-A2 | MED | DAG pointer | L01, L09 | `MUTCD` vocabulary_assumed points to T18.L08; actual source is T18.L06 | Update source_lesson_id to `T18.L06` |
| T10-A3 | MED | DAG pointer | L02, L03, L04, L05, L06, L07 | `conduit` vocabulary_assumed points to T06.L01; actual source is T01.L02 | Update source_lesson_id to `T01.L02` in all 6 lessons |
| T10-A4 | MED | DAG pointer | L02, L05 | `innerduct` vocabulary_assumed points to T06.L02; actual source is T06.L03 | Update source_lesson_id to `T06.L03` |
| T10-A5 | MED | DAG pointer | L06, L07 | `bend radius` vocabulary_assumed points to T03.L02; actual source is T02.L04 | Update source_lesson_id to `T02.L04` |
| T10-A6 | MED | DAG pointer | L07 | `confined space` vocabulary_assumed points to T18.L05; actual source is T18.L03 | Update source_lesson_id to `T18.L03` |
| T10-A7 | MED | DAG pointer | L10 | `plan-and-profile` vocabulary_assumed points to T07.L01; actual source is T07.L02 | Update source_lesson_id to `T07.L02` |
| T10-A8 | MED | DAG pointer | L08, L10, L11 | `open-cut` not introduced in any lesson — T06.L01 introduces `open-cut trench` (different token) | Rename term in T10 to `open-cut trench` OR add `open-cut` to T06.L01 vocabulary_introduced |
| T10-A9 | LOW | DAG pointer | L04, L10 | `station` not introduced in any lesson | Fix-agent to choose: add to T07.L01 or T04.L02 vocabulary_introduced, then point T10 pointers there |
| T10-A10 | LOW | DAG pointer | L05, L06 | `conduit fill (40% rule)` not introduced in any lesson | Add introduction in T06.L04 vocabulary_introduced OR rename term in T10 to match whatever T06.L04 does introduce |
| T10-A11 | LOW | DAG pointer | L10, L11 | `as-designed` not introduced in any lesson | Add to T04.L02 vocabulary_introduced, then T10 points there correctly |
| T10-A12 | MED | DAG - DUPE | L11 | `RUS Form 219` introduced in both T01.L05 and T10.L11 — prerequisite invariant violation | Move T10.L11's RUS Form 219 entry from vocabulary_introduced to vocabulary_assumed pointing to T01.L05 |
| T10-A13 | LOW | Schema - Flashcard | L03 | `open-cut restoration` in key_terms but no matching Flashcard card | Add Flashcard card for open-cut restoration |
| T10-A14 | LOW | Schema - Flashcard | L09 | `flagger station`, `lane closure`, `channelization device` in key_terms (7 items) but only 5 Flashcard cards | Add 2-3 missing Flashcard cards |
| T10-A15 | LOW | Schema - Flashcard | L10 | `pay application` in key_terms but no matching Flashcard card | Add Flashcard card for pay application |
| T10-A16 | LOW | Schema - Flashcard | L04, L05, L08 | 1 key_term each missing matching Flashcard card (exact terms to be confirmed by RT-β) | RT-β cross-check + add missing cards |

**Total: 4 HIGH, 0 HIGH, 9 MED, 7 LOW** — correction: **9 MED + 7 LOW, 0 HIGH**

---

## 8. Coverage Gaps

- **L04, L05, L08 Flashcard gaps** not individually verified (which specific key_term is missing) — delegated to RT-β as under-audited surface.
- Did not audit T10 lesson content against T10 brief §3 "Book vs field emphasis" — brief states this topic has "highest density of textbook-vs-field divergence." RT-β framing should include field-practice vs book accuracy on burial depth, conduit fill, and slack loop specs.

---

## 9. Verdict

**YELLOW**

DAG pointers are systematically wrong across 9 of 12 lessons — the T10 vocabulary_assumed table appears to have been authored against an earlier DAG draft. All are mechanical pointer corrections (source_lesson_id updates) that a single fix-agent can sweep in one pass. No content accuracy issues found. Vite build clean. P8/P11 cascade patterns correctly handled. Math verified in L05.

**RT-β saturation hint:** RT-β should focus on (1) verify the exact missing Flashcard terms in L04, L05, L08; (2) content accuracy framing — burial depth specs (NEC Table 300.5 equivalents for telecom), slack loop contract-band values, conduit fill numbers; (3) field-practice vs book divergence per brief §3 mandate; (4) BranchingScenario in L02 choice tree completeness.

---

## Closeout

- `git log -3 --oneline`: no commits (RT-α is read-only, report pushed separately)
- `git diff --stat origin/main..HEAD`: only `audit-output/osp-retroactive-audit/T10_POSTAUTH_RT_A_PEDAGOGY.md`
- Vite build: ✓ `built in 6.48s`, zero errors

=== T10 RT-α PEDAGOGY REPORT END ===
