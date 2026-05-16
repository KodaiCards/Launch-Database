# T01 Retroactive Audit — R-2 (Secondary-Source Corroboration / High-Recall / Adversarial)

**Scope:** T01 Fundamentals & Vocabulary (L01–L10)
**Framing:** adversarial + high-recall; hunt for broken DAG edges, missing vocabulary, citation errors
**Files read:** L01–L10 lesson JSX, ARCH.md, T01_RESEARCH_BRIEF.md, cross-topic vocabulary_assumed in T02–T05, T07, T18
**Word count:** ≤2000

---

## 1. Coverage Gap Canonical List

| # | Sev | Lesson | Issue | Fix Shape |
|---|---|---|---|---|
| R2-01 | HIGH | L01 | NEC Article 800 cited in SideBySide table for "OSP at building entry" grounding. Art. 800 governs copper communications circuits; optical fiber inside buildings is NEC Art. 770. Same error appears in L09 Standards table column "Grounding at building entry." | Change both cites to Art. 770; keep Art. 250 for GES |
| R2-02 | HIGH | L08 | OLT, ONT listed in BOTH `vocabulary_introduced` AND `vocabulary_assumed` (source T01.L01). A term cannot be simultaneously introduced and assumed. DAG schema violation. FDH, NAP have the same split (introduced in L08 `vocabulary_introduced` AND assumed in L08 `vocabulary_assumed` from T01.L07). | Remove OLT/ONT from L08 `vocabulary_introduced`; remove FDH/NAP from L08 `vocabulary_introduced` (already formally covered in L07) |
| R2-03 | HIGH | L08 | HDPE listed TWICE in `vocabulary_introduced` (duplicate array entry). | Remove one entry |
| R2-04 | HIGH | L09 | USACE flashcard body cites "33 CFR Part 323" for NWP program. Part 323 is individual dredge/fill permits (Section 404). The Nationwide Permit program is codified at 33 CFR Part 330. L09 quiz correctly uses Part 330 — internal inconsistency within the same lesson. | Harmonize flashcard to Part 330 |
| R2-05 | HIGH | T01-wide | `conduit`, `joint-use`, `clearance`, and `pole` (standalone) are used in T01 body text without ever appearing in any `vocabulary_introduced` block. T04.L01 `vocabulary_assumed` credits all four to T01.L01. No T01 lesson formally introduces them → broken prerequisite invariant. Downstream learners hit T04 without a formal definition anchor. | Add conduit + joint-use + clearance + pole to an appropriate T01 lesson's `vocabulary_introduced` (L02 is the natural home given NESC context); OR add explicit definitions to L02 body with vocabulary_introduced entries |

| # | Sev | Lesson | Issue | Fix Shape |
|---|---|---|---|---|
| R2-06 | MED | Multiple | `span`, `sag`, `attachment`, `midspan` formally introduced in T01.L02 (`vocabulary_introduced` confirmed). T03.L04, T03.L09, T05 lesson suite, and T18.L01 all credit these terms to `source_lesson_id: "T01.L01"` — wrong lesson. ARCH.md topic-level DAG groups them under T01 generically; lesson-level edges are wrong. | Update source_lesson_id to T01.L02 in all downstream vocabulary_assumed entries |
| R2-07 | MED | T18.L01 | `vocabulary_assumed` credits NESC to `source_lesson_id: "T01.L01"`. NESC is formally introduced in T01.L02 (confirmed: `vocabulary_introduced` in L02 includes NESC). | Update to T01.L02 |
| R2-08 | MED | T03.L04 | Credits ADSS to `source_lesson_id: "T01.L01"`. ADSS is formally introduced in T01.L08 (`vocabulary_introduced` confirmed). | Update to T01.L08 |
| R2-09 | MED | L04 | "fusion splice" used in lesson body 5+ times (WorkedExample, prose, quiz) without formal introduction. `vocabulary_introduced` does not include it (correctly deferred to T11). But L04 body uses it as if it's established vocabulary — a learner hitting L04 cold has no prior definition. L04 comes after L01–L03 in the teaching sequence; T11 is many lessons away. | Either add a one-sentence working definition in L04 body with a forward-reference note ("formally covered in T11"), or flag in vocabulary_introduced as "preview term, defined T11" |
| R2-10 | LOW | T01-wide | "Lashing," "figure-8 cable," "bonding," "dead-end," "guy wire" appear in T01 body text without formal `vocabulary_introduced` entries. T04 and T07 author briefs reference these as OSP day-1 vocabulary, implying T01 covers them. If downstream topics assume them from T01, the DAG edges will be broken. | Audit T04, T07 `vocabulary_assumed` for these terms; if present, either add to appropriate T01 lesson's `vocabulary_introduced` or correct source_lesson_id |
| R2-11 | LOW | L08 | OS2 defined as "ISO/IEC 11801 designation for G.652.D SMF; OS1 = older, looser-spec SMF." Imprecise: OS1 maps to G.652.A/B/C (not generically "older"); OS2 maps to G.652.D. The ITU-T subtype mapping matters for citation accuracy. | Add "OS1 maps to G.652.A/B/C; OS2 maps to G.652.D" |
| R2-12 | LOW | L01 | "conduit" used 4× in body (underground pathway description) without formal definition or `vocabulary_introduced` entry. First use in the curriculum; no prior lesson defines it. | Add to `vocabulary_introduced` in L01 or L02 with one-sentence definition |

---

## 2. Cross-Topic Broken-DAG Edges (Summary Table)

| Downstream Lesson | Term Claimed | Credited Source | Actual Source | Status |
|---|---|---|---|---|
| T03.L04 | span, sag | T01.L01 | T01.L02 | BROKEN |
| T03.L09 | span, attachment | T01.L01 | T01.L02 | BROKEN |
| T04.L01 | conduit | T01.L01 | Not in any T01 vocab_introduced | BROKEN — missing |
| T04.L01 | joint-use | T01.L01 | Not in any T01 vocab_introduced | BROKEN — missing |
| T04.L01 | clearance | T01.L01 | Not in any T01 vocab_introduced | BROKEN — missing |
| T04.L01 | attachment | T01.L01 | T01.L02 | BROKEN |
| T04.L01 | make-ready | T01.L01 | T01.L05 | BROKEN (make-ready in L05 vocab_introduced) |
| T03.L04 | ADSS | T01.L01 | T01.L08 | BROKEN |
| T05 suite | span/attachment | T01.L01 | T01.L02 | BROKEN (multiple lessons) |
| T18.L01 | NESC | T01.L01 | T01.L02 | BROKEN |
| T18.L01 | span, sag | T01.L01 | T01.L02 | BROKEN |
| L08 | OLT, ONT | vocabulary_introduced AND assumed | L01 is correct source | vocab_introduced duplicate |
| L08 | FDH, NAP | vocabulary_introduced AND assumed | L07 is correct source | vocab_introduced duplicate |

---

## 3. Adversarial "Careless-Author Misses"

**Miss A — Article 770 vs 800 (two lessons):** A careless author sees "communications cabling" and defaults to Art. 800. Optical fiber inside buildings is Art. 770; Art. 800 is copper only. This error appears in both L01 (SideBySide table) and L09 (Standards table) — two separate authors or one author who copied the error. Both face learners studying for OSP Designer or RCDD who need this distinction cold.

**Miss B — Part 323 vs Part 330 (L09):** 33 CFR Part 323 is the Section 404 individual permit; Part 330 is the NWP program. These are materially different processes (individual case-by-case review vs. pre-authorized standard conditions). The flashcard would teach incorrect permitting procedure. The quiz already has the correct citation — the flashcard was not updated to match.

**Miss C — L08 vocabulary_introduced duplicates:** A careless author building the acronym reference added terms already formally introduced in L01 and L07 without checking for duplicates. The DAG system should flag terms that appear in multiple `vocabulary_introduced` lists; it apparently doesn't enforce uniqueness across lessons.

**Miss D — "fusion splice" in L04:** The lesson teaches what a splice case IS without formally defining a fusion splice. A learner curious about the WorkedExample ("why does a fusion splice do this?") has no prior anchor. The miss is subtle: L04 `vocabulary_introduced` correctly omits fusion splice (T11's domain), but the body relies on it as understood vocabulary 8 lessons before it's formally taught.

---

## 4. Definition Gaps — Field-Practice Lens

**conduit** — First used in L01 to explain underground pathways. Field crews deal with EMT, HDPE, PVC, innerduct daily. No formal definition in any T01 lesson; T04 assumes it from T01.L01 (broken edge). A new hire from a non-construction background has no definition anchor before entering T04's make-ready content.

**joint-use** — Central OSP concept (pole shared by electric utility + telecom). Used in T01 body without formal definition. T04 assumes it from T01.L01 (broken). The distinction between make-ready for a joint-use pole vs. a single-owner pole is fundamental to staking.

**clearance** — NESC-governed dimensional requirement between supply and communication attachments. Used in T01 context but not formally defined until downstream topics. T04 assumes it from T01 without a formal T01 introduction.

**dead-end / guy wire** — Field-essential terms for pole loading, tension transfer, anchor construction. Not in any T01 `vocabulary_introduced`. T07 (Staking) will reference them; if T07 assumes T01 introduced them and T01 didn't, the DAG edge is broken. Needs explicit verification in T07 vocabulary_assumed.

---

## 5. Secondary-Source Corroboration on Citations

**NEC Art. 770 vs 800:** Corroborated via NEC 2023 Table of Contents (publicly available): Article 770 = "Optical Fiber Cables and Raceways"; Article 800 = "Communications Circuits." L01 and L09 citing Art. 800 for optical fiber is verifiably wrong.

**33 CFR Part 330 vs Part 323:** Corroborated via eCFR (ecfr.gov, publicly accessible): Part 330 title = "Nationwide Permit Program"; Part 323 title = "Permits for Discharges of Dredged or Fill Material Into Waters of the United States." L09 flashcard citing Part 323 for NWP is verifiably wrong.

**NESC section citations (L02):** §§23, 235 for zones; §238 for climbing space cited. NESC C2-2023 is paywalled. Secondary: IEEE SA catalog confirms C2-2023 is the current edition. Section-level corroboration not possible without access. Hedge language in L02 is appropriate; citations are directionally consistent with prior RUS/BICSI secondary sources that reference the same NESC chapter structure. Mark as **[confirm edition + section]** at publication.

**FCC Part 32 accounts (L01):** R-1 research brief verified these as correct (2421, 2422, 2423, 2411, 2441). Corroborated from R2 perspective: FCC Form 481 and the FCC's own Accounting Rules documentation reference these same account codes. Confirmed.

**RUS Form 219 (L05):** Form title "Certification for Contracts" — consistent with USDA RUS program documentation. No ambiguity identified.

---

## 6. Suspicious-but-Uncertain Register

| Item | What's suspicious | Why uncertain | Resolution path |
|---|---|---|---|
| NESC §238 for climbing space | Section number may have shifted in C2-2023 vs C2-2017 | Paywalled; indirect references don't confirm §238 specifically | IEEE/NESC-subscribing SME confirm |
| T01.L02 "15.5 ft" clearance value | Specific clearance values are loading-district dependent; paywalled | Research brief flagged appropriate hedge; value is plausible but not independently verified | Confirm at publication with C2-2023 Table 235-5 or equivalent |
| IEC 60794 series for cable construction (L03) | Edition referenced not stated; standards get revised | Directionally correct; no edition number in L03 | Add [confirm edition] per standard protocol |
| T04.L01 `make-ready` sourced to T01.L01 | Make-ready IS in T01.L05 vocabulary_introduced — but is T01.L01 the right source_lesson_id? | T01.L05 introduces it; T01.L01 doesn't | This may be a T04 error, not T01; needs T04-side correction |

---

## Negative Findings (Confirmed Clean)

- L01 through L07 do NOT have circular DAG references
- L10 capstone quiz vocabulary_assumed list is complete and sources correctly trace to T01 lessons
- FCC Part 32 account codes verified correct (two independent paths)
- Teaching order (T01 → T18 → T02 → ...) is not violated by any T01 lesson's prerequisite structure
- L05 project lifecycle sequence (survey → design → permit → make-ready → construct → test → as-built → close-out) is internally consistent and matches RUS 1751F-630 §3 workflow
- L06 role definitions are internally consistent and consistent with L05 lifecycle stages

---

## Coverage Gaps

- T01.L09 covers standards bodies (NESC, NEC, RUS, BICSI, TIA, ANSI, FCC, USACE, CFR) at an intro level. Adequate for vocabulary introduction. No deep citation verification beyond Art. 770/800 and CFR Part 323/330.
- Did not audit T02–T05 `vocabulary_assumed` lists exhaustively — sampled representative lessons per topic. T06, T11–T17 not sampled; edge-break risk exists there for span/sag/attachment/NESC if those topics also credit T01.L01 instead of T01.L02.
- Did not verify whether "lashing," "figure-8," "dead-end," "guy wire" actually appear in T04, T07 `vocabulary_assumed` — identified body-text occurrences in T01 only; downstream verification is the fix-agent's job.

---

=== T01 AUDIT R2 CORROB-ADVERSARIAL END ===
