# T01 Retroactive Audit — Fix Agent Canonical List

**Fix Agent:** T01-FIX-CANONICAL
**Date:** 2026-05-16
**Inputs:** R-1 (c10d677) + R-2 (0948c1d)
**Scope:** T01 lessons L01–L10 only; downstream cross-topic edges (T03/T04/T05/T18) flagged for orchestrator

---

## Cross-Verification Synthesis

### VERIFIED (both R-1 + R-2 flagged — fix with high confidence)

| ID | Sev | Lesson | Issue | Fix |
|---|---|---|---|---|
| C-01 | HIGH | L08 | OLT, ONT in vocab_introduced (introduced in L01); FDH, NAP in vocab_introduced (introduced in L07); PE in vocab_introduced (introduced in L06). DAG structural integrity violated for 5 terms. | Remove from vocabulary_introduced; add to vocabulary_assumed with correct source_lesson_id |
| C-02 | LOW | L08 | HDPE listed twice in vocabulary_introduced | Remove duplicate |
| C-03 | HIGH | L09 | USACE flashcard cites "33 CFR Part 323" for NWP program. Part 323 = individual Section 404 dredge/fill permits. Nationwide Permit program = 33 CFR Part 330. Quiz Q1 correctly uses Part 330 — internal inconsistency within same lesson. | Update USACE flashcard to Part 330; add note about Part 323 distinction |
| C-04 | LOW | L05 | 7 CFR Part 1726.405 cited as RUS authority for telecom close-out. Part 1726 = Electric Borrowers (engineering/design). Telecom = 7 CFR Part 1753. | Update citation to 7 CFR Part 1753 with [confirm section] marker |

### R-1 ONLY findings (precision-skeptical framing — applying as real)

| ID | Sev | Lesson | Issue | Fix |
|---|---|---|---|---|
| C-05 | LOW-MED | L07 | Flashcard says "approximately 15.5–16.5 dB" but body correctly says "approximately 15–17 dB; worst-case 17 dB." Flashcard understates worst-case — learners recalling flashcard use 16.5 when body teaches 17 dB for planning. | Update flashcard to match body: "approximately 15–17 dB; use 17 dB for worst-case planning" |
| C-06 | LOW-MED | L06 | Flashcard block renders before Working section. All other lessons (L01–L05, L07–L09) place Flashcard after Working or Advanced section. | Move Flashcard block to after Working section (before Quiz) |
| C-07 | LOW-MED | L08 | PVC in vocabulary_introduced but no flashcard or table row in L08. L08's HDPE table row mentions PVC inline ("Schedule 40 PVC or HDPE") but PVC has no dedicated entry. vocab_introduced contract requires a formal definition surface. | Add PVC row to the conduit/construction table in L08 with a flashcard entry |

### R-2 ONLY findings (adversarial/high-recall framing — applying real ones, flagging cross-topic)

| ID | Sev | Lesson | Issue | Fix |
|---|---|---|---|---|
| C-08 | HIGH | L01 SideBySide + L09 table | NEC Art. 800 cited for optical fiber at building entry (two locations). Art. 800 = copper communications circuits. Optical fiber inside buildings = NEC Art. 770. Independently verifiable: NEC 2023 ToC publicly available. | L01 SideBySide "Primary code" row: change Art. 800 → Art. 770. L09 table row "Grounding at building entry": change Art. 800 → Art. 770. Keep Art. 250 for GES. |
| C-09 | HIGH | L01+L02 | `conduit`, `joint-use`, and `clearance` used in T01 body but not in any vocabulary_introduced. T04.L01 assumes all three from T01.L01. DAG broken. Per R-2: L02 is the natural home (NESC context). | Add conduit + joint-use + clearance to L02 vocabulary_introduced with inline definitions woven into L02 body; add flashcards. |
| C-10 | MED | L04 | "fusion splice" used 5+ times in L04 body without formal definition. vocab_introduced correctly omits it (T11's domain). But L04 learners have no prior anchor. | Add one-sentence working definition in L04 body on first use with forward-reference note: "(formally covered in T11)" |
| C-11 | LOW | L08 | OS2 definition says "OS1 = older, looser-spec SMF" without ITU-T subtype precision. OS1 maps to G.652.A/B/C; OS2 maps to G.652.D. | Update OS2 table row to add subtype mapping |

### Cross-topic DAG edges — FLAGGED FOR ORCHESTRATOR (outside T01 write-path)

These are in downstream lesson files (T03, T04, T05, T18) — outside this fix agent's write-path allowlist. Orchestrator must dispatch a separate fix agent targeting those files.

| ID | Sev | Affected Files | Issue |
|---|---|---|---|
| X-01 | MED | T03.L04, T03.L09, T05 suite, T18.L01 | `span`, `sag`, `attachment`, `NESC` credited to `source_lesson_id: "T01.L01"` — actual source is T01.L02. Must update downstream vocabulary_assumed entries. |
| X-02 | MED | T18.L01 | `NESC` credited to T01.L01 — source is T01.L02. |
| X-03 | MED | T03.L04 | `ADSS` credited to T01.L01 — source is T01.L08. |
| X-04 | MED | T04.L01 | `make-ready` credited to T01.L01 — source is T01.L05. (Note: conduit/joint-use/clearance being added to T01.L02 per C-09 — T04.L01's assumed sources for those will be correct once C-09 lands.) |

### DEFERRED items (not fixing in this wave)

| ID | Sev | Lesson | Reason |
|---|---|---|---|
| D-01 | LOW | L09 | No interactive primitive beyond quiz. Adding AnnotatedDiagram would require creating a new SVG asset. Deferred to polish queue. |
| D-02 | LOW | L10 | No Flashcard on capstone quiz. Architectural decision pending. Deferred. |
| D-03 | LOW | L05 | BranchingScenario in Foundations section. Audits rate it LOW-MED; current placement still teaches the lesson; reordering would require restructuring the section body. Deferred to polish queue. |
| D-04 | LOW | L05 | No dedicated acronym mini-glossary block. L05 has an acronym table (OTMR, Tier 1/Tier 2, RUS Form 219) but it doesn't use the standard column headers. Deferred to polish queue — not a correctness issue. |
| D-05 | LOW | L02 | NESC 40-inch climbing space and 15.5 ft clearance figures — paywalled source, cannot confirm specific Rule/Table numbers. Hedge language already present ("in most configurations," "[verify with current adopted edition]"). No fix required per R-1 disposition. |

---

## Fix Commit Plan

1. **Commit A:** C-08 — NEC Art. 800 → Art. 770 in L01 + L09
2. **Commit B:** C-01, C-02, C-07, C-11 — L08 vocab_introduced cleanup + PVC table/flashcard addition + OS2 precision
3. **Commit C:** C-03 — L09 USACE flashcard 33 CFR Part 323 → Part 330
4. **Commit D:** C-04 — L05 7 CFR 1726 → 7 CFR 1753
5. **Commit E:** C-05 — L07 flashcard splitter loss range harmonization
6. **Commit F:** C-09 — L02 add conduit/joint-use/clearance to vocabulary_introduced + body + flashcards
7. **Commit G:** C-10 — L04 fusion splice working definition
8. **Commit H:** C-06 — L06 flashcard placement moved after Working section

---

=== T01 FIX CANONICAL END ===
