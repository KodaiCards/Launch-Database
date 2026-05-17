# T10 Polish-A Closeout
**Commit:** `e01f8aa`
**Canonical sources:** RT-α `3924599` + RT-β `4ff77fc`
**Validator:** T10 12/12 PASS | Vite build clean (6.53s) | DAG broken T10: 15 → 0

---

## BEFORE → AFTER per fix

### MED — DAG pointer corrections (9 terms, 13 lessons touched)

| Term | BEFORE | AFTER | Lessons |
|---|---|---|---|
| `ROW` | `T01.L01` | `T01.L08` | L01, L04, L08, L09, L10, L11 |
| `MUTCD` | `T18.L08` | `T18.L06` | L01, L09 |
| `conduit` | `T06.L01` | `T01.L02` | L02, L03, L04, L05, L06, L07 |
| `innerduct` | `T06.L02` | `T06.L03` | L02, L05 |
| `bend radius` | `T03.L02` | `T02.L04` | L06, L07 |
| `confined space` | `T18.L05` | `T18.L03` | L07 |
| `plan-and-profile` | `T07.L01` | `T07.L02` | L04, L10 |
| `open-cut` → renamed | `open-cut` / `T06.L01` (never introduced there) | `open-cut trench` / `T06.L01` (matches actual vocab_introduced) | L08 |
| `conduit fill (40% rule)` | key mismatch; T10.L05 also in vocab_introduced (DUPE) | `conduit fill` / `T06.L04` in vocab_assumed; removed from L05 vocab_introduced | L05, L12 |
| `as-designed` | `T04.L02` (never introduced there) | `T04.L08` (added there as upstream fix) | L10, L11 |
| `station` | `T07.L01` (never introduced there) | `T07.L02` (added there as upstream fix) | L04 |

**Upstream fixes required (terms not introduced anywhere):**
- **T07/L02:** `station` added to vocab_introduced + key_terms + Flashcard `T07-L02-fc-station`. Rationale: L02 introduces `stationing` and defines `station` extensively in prose; adding it as a discrete term was the correct single source of truth.
- **T04/L08:** `as-designed` added to vocab_introduced + key_terms. Rationale: L08 is the "handoff-to-design" lesson that already introduces `as-surveyed`; `as-designed` is the counterpart term and belongs there.

### MED — RUS Form 219 dupe

| Location | BEFORE | AFTER |
|---|---|---|
| L11 vocab_introduced | contained `RUS Form 219` | removed — owned by T01.L05 |
| L11 vocab_assumed | absent | added `{ term: 'RUS Form 219', source_lesson_id: 'T01.L05' }` |
| L12 vocab_assumed | `source_lesson_id: 'T10.L11'` | `source_lesson_id: 'T01.L05'` |
| L11 Flashcard (fc5) | present in lesson body | kept — contextual reinforcement of assumed term is valid |

### LOW — Flashcard gaps (9 cards added)

| Term | Lesson | Card ID |
|---|---|---|
| `open-cut restoration` | L03 | `T10-L03-fc-open-cut-restoration` |
| `natural grade` | L04 | `T10-L04-fc-natural-grade` |
| `fish tape` | L05 | `T10-L05-fc-fish-tape` |
| `sod restoration` | L08 | `T10-L08-fc-sod-restoration` |
| `flagger station` | L09 | `T10-L09-fc-flagger-station` |
| `lane closure` | L09 | `T10-L09-fc-lane-closure` |
| `channelization device` | L09 | `T10-L09-fc-channelization-device` |
| `pay application` | L10 | `T10-L10-fc-pay-application` |

Note: RT-β listed `TCP` as a gap — L09 already had a TCP Flashcard card at the time of RT dispatch; confirmed present. 8 cards added (not 9 net-new).

### LOW — BranchingScenario T10-B1 corrective node

| Location | BEFORE | AFTER |
|---|---|---|
| L02 swivel-wrong node | wrong choice `600 lbf` routed directly to `end` (no feedback) | wrong choice routes to new `swivel-correction` node explaining the error, then `end` |

---

## Notes
- L06 and L07 prerequisites arrays updated alongside vocab_assumed to match corrected source lessons (T02.L04 + T18.L03)
- Schema validator WARNs: 0 T10 WARNs (down from 6 before Flashcard additions)
- DUPEs reported by DAG registry (pull tension, mid-assist, breakaway swivel, slack loop, pilot bore appearing in both T06 and T10) are pre-existing cross-topic duplication issues outside T10 Polish-A scope — not introduced by this wave

=== T10 POLISH-A NOTES END ===
