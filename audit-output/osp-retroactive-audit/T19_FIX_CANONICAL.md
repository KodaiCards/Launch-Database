# T19 Fix Canonical List

**Topic:** T19 — Headend / CO + Rack-Side Hardware Basics
**RT-A source:** `067c5d9` — `T19_RT_A_PEDAGOGY_VERIFY_GAP.md`
**RT-B source:** `55cf5ad` — `T19_RT_B_TECHNICAL_VERIFY_GAP.md`
**Fix agent:** post-RT (read RT-A + RT-B + queued NEC 770.26 ARCH note)

---

## VERIFIED — Both RTs converged

| # | Severity | Lesson | Finding | Status |
|---|---|---|---|---|
| V-BOTH-1 | HIGH | L09 | Splitter insertion loss "17–17.5 dB" only — ITU-T G.671 18.1 dB max ceiling not taught. Teach BOTH: 17–17.5 dB typical PLC field value AND 18.1 dB G.671 standards ceiling for conservative link budget. RT-A: A-5 HIGH. RT-B: JC-2 AGREE-CONCERN. | FIXED `1131f2c` — L09 body + Book-vs-Field |
| V-BOTH-2 | HIGH | L04 + L10 | ATS transfer time inconsistency: L04 body = 10–15s, L10 Q05 = 30s. Both are correct — GR-63-CORE maximum is 30s; modern ATSs achieve 10–15s. Reconcile as complementary in L04 key_terms + body + L10 Q05 explanation. RT-A: A-2 (GR-63-CORE paywalled caveat). RT-B: V-1 HIGH. | FIXED `30ad3dd` (L04) + `f674821` (L10 Q05) — key_terms + L10 explanation; [paywalled] caveat added |

---

## RT-B ONLY — Confirmed real, fixed

| # | Severity | Lesson | Finding | Status |
|---|---|---|---|---|
| V-B-1 | MED | L09 | Drop length 12–15 km vs 20 km apparent contradiction within same lesson. Add explicit reconciliation: "20 km = ITU-T G.984.2 fiber geometric reach; 12–15 km = link-budget-derived practical limit with 1×32 split." | FIXED `1131f2c` — L09 drop length section reconciliation sentence |
| V-B-2 | MED | L08 | NEC §770.26 50-ft rule appears only in Book-vs-Field aside. QUEUED NEC 770.26 ARCH update also calls for L08 to list it as primary citation. Added to key_terms, Flashcard deck, and one new quiz question. | FIXED `e4dbd0a` — L08 key_terms + flashcard + Q5 added |
| V-B-3 | MED | L07 | Connector loss 0.30 dB: teaching only typical factory-pigtail value. Differentiated: factory pre-terminated = 0.30 dB typical; field-polished = 0.50–0.75 dB per TIA-568.3-D maximum; use 0.50 dB for conservative link-budget planning. Updated SideBySide table and Q2 explanation. | FIXED `7c1a87a` — L07 SideBySide + Q2 explanation |
| V-B-4 | MED/LOW | L09 | BranchingScenario prop names wrong: uses `initialState` and `states` (not `startNodeId` and `nodes` per component API). Quiz props: uses `question`, `options`, `correctIndex` instead of `prompt`, `choices`, `answerIndex`. | FIXED `1131f2c` (L09) + `f674821` (L10 capstone) — BranchingScenario + Quiz props corrected across both files |

---

## RT-A ONLY — Confirmed real, fixed

| # | Severity | Lesson | Finding | Status |
|---|---|---|---|---|
| V-A-1 | MED | L03 | Float voltage 2.25–2.27 V/cell stated without `[confirm IEEE 1188]` tag. Added tag + manufacturer-verification caveat. | FIXED `0b7383c` — L03 key_terms float_voltage definition + flashcard |
| V-A-2 | LOW | L01 | `equipment room` in vocabulary_introduced (8th term) but only 7 Flashcard cards — missing card for `equipment room`. | FIXED `6ea6359` — L01 flashcard deck; added 8th card |
| V-A-3 | MED | L06 | vocabulary_assumed cites MGN/IBT/GES from T01.L08, but ARCH.md T01 vocabulary list does not include those terms. Changed to vocabulary_introduced entries with note they are re-introduced in T19.L06 at a field-awareness level. | FIXED `3dbf6dc` — L06 vocabulary_assumed → vocabulary_introduced for MGN/IBT/GES |

---

## NEC 770.26 ARCH integration (queued before this wave)

| # | Lesson | Action | Status |
|---|---|---|---|
| NEC-1 | L01 | Add NEC 770.26 forward reference in the "Where the conduit lands" working section (50-ft transition rule, cross-ref to L08 for the detail). | FIXED `6ea6359` — L01 working section |
| NEC-2 | L08 | NEC §770.26 already in Book-vs-Field aside. Promoted to key_terms + Flashcard + Quiz (combined with V-B-2). | FIXED `e4dbd0a` |

---

## DEFERRED — documented reason

| # | Finding | Reason deferred |
|---|---|---|
| D-1 | A-4: TMGB in T19.L06 vs ARCH.md T14 scope | T14 authors need to know T19.L06 introduced TMGB first; no T19 file change needed. Flagged in cross-topic section below. |
| D-2 | GAP-1: VRLA equalization charging not covered | FIXED `f674821` — brief equalization note added to L03 advanced section (not full coverage — that is T14 scope). |
| D-3 | GAP-4: OLT port density 8×16=128 as vendor-specific | FIXED `f674821` — vendor-specific disclaimer added to L02 Q4 quiz explanation. |
| D-4 | GAP-R1: Generator no-start failure path | FIXED `f674821` — one sentence "Generator no-start is the most common cause of extended rural CO outages" added to L04 Book-vs-Field field section. |
| D-5 | GAP-R3: Humidification in arid climates | FIXED `f674821` — arid climate humidification paragraph added to L05 Book-vs-Field field section. |

---

## NOT-FIXED — CONFLICTING or FALSE-POSITIVE

| # | Finding | Disposition |
|---|---|---|
| N-1 | GAP-R2: ADSS building entry grounding | L06 step 3 AND Q4 already address ADSS dielectric entry correctly. RT-A did not flag as missing; RT-B flagged as gap but L06 content addresses it. Verdict: ADDRESSED in existing content, no change needed. |
| N-2 | A-3: vocabulary_introduced "ASHRAE thermal envelope" label | L10 capstone vocabulary_assumed uses the same label. This is minor internal naming — label is defensible as the common phrase. Leave as-is. |

---

## CROSS-TOPIC PROPAGATION FLAGS (for orchestrator — do not fix in T19 wave)

| Topic | Item | Flag |
|---|---|---|
| T05 | G.671 18.1 dB splitter ceiling | T05 also teaches "17–17.5 dB" for 1×32 (P2 polish item). The G.671 18.1 dB ceiling fix should be applied to T05 when that topic is next audited. DO NOT touch T05 in this dispatch. |
| T14 | TMGB vocabulary DAG | T14 authors must cite T19.L06 as source_lesson_id for TMGB in their vocabulary_assumed blocks, not T01. T14 wave authors notified via this flag. |
| T01 | MGN/IBT/GES source | These terms are NOT in T01's ARCH.md vocabulary list despite T19 vocabulary_assumed citing T01.L08. T01 wave should verify whether T01.L08 introduces MGN/IBT/GES. If not, T01's vocabulary_introduced needs those terms added. |

=== T19 FIX CANONICAL END ===
