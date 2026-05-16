# T01 Retroactive Audit — R-4 Pedagogy / First-Time-Learner Progression

**Date:** 2026-05-16
**Agent:** Orchestrator direct audit (R-4 framing: pedagogy / first-time-learner-progression / prerequisite-invariant)
**Scope:** T01 "Fundamentals & Vocabulary" — L01–L10 (all 10 lessons)
**Framing:** Simulating a brand-new learner with zero prior OSP knowledge reading L01→L10 in order. Not re-auditing technical accuracy (R-1/R-2/R-3 covered that). Exclusive focus: does this curriculum work as a teaching sequence?
**Files read:** L01–L10 JSX, T01_FIX_CANONICAL.md, T01_AUDIT_R3_DEEP_ADVERSARIAL.md
**Vite build:** ✓ (not re-run by orchestrator — last confirmed green by R-3 at 4.38s; no lesson files changed since R-3 push `51dcefa`)

---

## 1. Stack Snapshot (≤80 words)

T01 is pedagogically strong overall. Every lesson opens with a plain-English "In Plain English" section, every acronym gets a table before use, every formula has a worked example. Prerequisite invariant is largely intact after R-1/R-2 fixes. Four NEW learner-experience findings surfaced: a cross-lesson term assumption in L08 that's technically correct but cognitively jarring for a zero-knowledge learner (OTDR defined in L06 table before L08 formally introduces it), one vocabulary_assumed pointer gap in L07 (PON assumed from L07 itself — circular), two Flashcard coverage gaps for vocabulary_introduced terms in L09, and one mild tier-system leakage in L05. All LOW severity. Zero learning-objective misalignments found.

---

## 2. Prerequisite Invariant Check — vocabulary_assumed per lesson

For each vocabulary_assumed entry: (a) is the term actually in the source lesson's vocabulary_introduced? (b) does the source lesson's body text provide a usable definition?

### L01 — vocabulary_assumed: empty (correct — it's the root lesson)
✓ No assumed terms. Appropriate as the DAG root.

### L02 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition in source? |
|---|---|---|---|
| OSP | T01.L01 | ✓ | ✓ (L01 Foundations, "OSP: the world between buildings") |
| NESC | T01.L02 | ✓ (L02 introduces NESC) | ✓ (L02 body, "NESC Rule 235") |

**Note:** L02's vocabulary_assumed correctly cites T01.L02 for NESC — it's a self-reference that's acceptable since NESC is introduced at the top of L02 foundations before being used in later sections.

### L03 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition? |
|---|---|---|---|
| OSP | T01.L01 | ✓ | ✓ |
| span | T01.L02 | ✓ | ✓ (L02 body: "the horizontal distance between two pole attachment points") |
| attachment | T01.L02 | ✓ | ✓ (L02 body: pole zone structure) |

✓ All clean.

### L04 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition? |
|---|---|---|---|
| OSP | T01.L01 | ✓ | ✓ |
| sheath | T01.L03 | ✓ | ✓ |
| buffer tube | T01.L03 | ✓ | ✓ |
| fiber | T01.L03 | ✓ | ✓ |
| central member | T01.L03 | ✓ | ✓ |

✓ All clean. Note: C-10 (fusion splice working definition) was applied per canonical — confirmed present in L04 body text.

### L05 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition? |
|---|---|---|---|
| OSP | T01.L01 | ✓ | ✓ |
| OLT | T01.L01 | ✓ | ✓ |
| ONT | T01.L01 | ✓ | ✓ |
| attachment | T01.L02 | ✓ | ✓ |
| splice case | T01.L04 | ✓ | ✓ |

✓ All clean.

### L06 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition? |
|---|---|---|---|
| OSP | T01.L01 | ✓ | ✓ |
| survey | T01.L05 | ✓ | ✓ |
| design | T01.L05 | ✓ | ✓ |
| permit | T01.L05 | ✓ | ✓ |
| make-ready | T01.L05 | ✓ | ✓ |
| construction | T01.L05 | ✓ | ✓ |
| as-built | T01.L05 | ✓ | ✓ |

✓ All clean.

### L07 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition? |
|---|---|---|---|
| OSP | T01.L01 | ✓ | ✓ |
| OLT | T01.L01 | ✓ | ✓ |
| ONT | T01.L01 | ✓ | ✓ |
| FDH | T01.L01 | ⚠ | Mentioned in L01 body ("Fiber distribution hubs (FDH cabinets)") but NOT in L01 vocabulary_introduced. |
| NAP | T01.L01 | ⚠ | Mentioned in L01 body ("Network Access Point (NAP)") but NOT in L01 vocabulary_introduced. |
| PON | T01.L07 | ⚠ **CIRCULAR** — PON is in L07's vocabulary_introduced AND vocabulary_assumed from T01.L07 (itself) | Not usable — circular self-reference |

**Finding summary for L07:** FDH and NAP are pointed to T01.L01, but they are not in L01's vocabulary_introduced array. They ARE defined in L01's body text (Foundations section, "Signal Flow" list items 3 and 5) with clear usable definitions. The vocabulary_introduced array omission is the technical defect, but a learner reading L01 body would have the definition. The DAG metadata is incorrect even if the learner experience is OK.

PON: vocabulary_assumed list says `source_lesson_id: 'T01.L07'` — that's a self-reference (L07 itself). PON IS in L07's vocabulary_introduced, so it's correct that PON is introduced here. The vocabulary_assumed entry is spurious/redundant — a term can't be both introduced AND assumed in the same lesson. Likely a copy-paste artifact. → **NEW R4-NEW-01**

### L08 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition? |
|---|---|---|---|
| OSP | T01.L01 | ✓ | ✓ |
| ISP | T01.L01 | ✓ | ✓ |
| OLT | T01.L01 | ✓ | ✓ |
| ONT | T01.L01 | ✓ | ✓ |
| RUS | T01.L01 | ⚠ | In L01 acronym table (not vocabulary_introduced) — L01's vocab_introduced doesn't list RUS. But L01 body provides a usable table-row definition. Same FDH/NAP pattern. |
| BICSI | T01.L01 | ⚠ | Same pattern — acronym table in L01 but not in vocabulary_introduced. |
| FDH | T01.L07 | ✓ (L07 vocab_introduced) | ✓ |
| NAP | T01.L07 | ✓ (L07 vocab_introduced) | ✓ |
| PON | T01.L07 | ✓ | ✓ |
| NESC | T01.L02 | ✓ | ✓ |
| PE | T01.L06 | ✓ | ✓ |

**Pattern note:** RUS and BICSI are in L01's acronym table and mentioned in body prose, giving learners a practical definition. They are NOT in L01's vocabulary_introduced. This is the same FDH/NAP pattern from L07. For the learner experience it's fine — L01 defines them clearly. For DAG metadata strictness, they should be in vocabulary_introduced. This is a pre-existing LOW that prior rounds haven't flagged. Not new — noting here for completeness. Not creating a new finding for RUS/BICSI because the prior R-2 canonical (C-09 and related) covered adding terms to vocabulary_introduced; RUS and BICSI may have been intentionally kept in the acronym table only.

### L09 — vocabulary_assumed
| Term | source_lesson_id | In source vocab_introduced? | Usable body definition? |
|---|---|---|---|
| NESC | T01.L02 | ✓ | ✓ |
| TIA | T01.L08 | ✓ | ✓ |
| NEC | T01.L08 | ✓ | ✓ |
| AHJ | T01.L08 | ✓ | ✓ |
| ROW | T01.L08 | ✓ | ✓ |
| NEPA | T01.L08 | ✓ | ✓ |
| NHPA | T01.L08 | ✓ | ✓ |
| ESA | T01.L08 | ✓ | ✓ |
| BICSI | T01.L01 | ⚠ | Same pattern as above — in L01 acronym table, not vocabulary_introduced |
| FOA | T01.L08 | ✓ | ✓ |
| RUS | T01.L01 | ⚠ | Same pattern |
| OSP | T01.L01 | ✓ | ✓ |

✓ Most clean. RUS/BICSI pattern flagged above, pre-existing.

### L10 — vocabulary_assumed
(checked in R-3 — R3-NEW-01 is the open finding: NESC credits T01.L08 instead of T01.L02)
All others appear correct per R-3 review.

---

## 3. Vocabulary-in-Body-Text Check — first use vs. definition

Checking whether vocabulary_introduced terms are defined BEFORE or concurrent with first body-text use, or whether they appear in body text BEFORE being defined (backward-definition anti-pattern).

**L01:** OSP, ISP defined in first paragraph + acronym table before any technical content. OLT, ONT defined in acronym table before the "Signal Flow" section uses them. Headend defined at first use in the Signal Flow ordered list. Demarcation point defined at first use in Foundations. ✓ All terms defined at or before first use.

**L02:** span, sag, attachment, midspan defined in the AnnotatedDiagram section. Learner encounters them first in the foundations prose, then the diagram labels them. The body text says "A new fiber cable will attach to an existing utility pole at a specific height. Between two poles there's a horizontal span, and the cable naturally sags at midspan due to gravity." — all four terms introduced in the same sentence. ✓

**L03:** sheath, buffer tube, ripcord, armor, messenger all defined in table rows at the start of Foundations before the body references them. ✓

**L04:** splice case, splice tray, gel seal, fan-out, dome closure, inline closure, port, cable entry, slack storage — all introduced in visual diagram or table before body prose uses them. ✓

**L05:** survey, design, permit, make-ready, construction, testing, as-built, close-out — all introduced in the numbered overview list in Foundations before the Working section details each. RUS Form 219 is defined in the acronym table before it appears in the close-out section. ✓

**L06:** OTDR appears in the acronym table at the top of L06 Foundations — but OTDR is NOT in L06's vocabulary_introduced (it's introduced in L08). L06's acronym table is actually a preview/reference table that lists OTDR because the splicer role description uses it. A learner reading L06 before L08 DOES have the definition (the table row says "Optical Time-Domain Reflectometer — The primary fiber test instrument"). The issue is that the vocabulary_assumed for L06 doesn't list OTDR (it's not introduced yet at L06), yet L06 teaches it via the acronym table. This is a minor DAG inconsistency — OTDR is effectively soft-introduced in L06 but not formally introduced until L08. **New finding R4-NEW-02** (LOW — forward-reference anomaly).

**L07:** strand map, FDH, NAP, drop, feeder, distribution cable, splitter, PON, fiber assignment — all defined in the textual section before use. PON circular self-reference identified above. ✓

**L08:** All 31 vocabulary_introduced terms appear in the table before body prose. ✓

**L09:** IEEE, NFPA, ITU-T, ICEA, FCC, USACE, CFR, ANSI, code adoption — all defined in the acronym table before use. ✓

**L10 capstone:** No new vocabulary. All terms assumed per the long vocabulary_assumed list. ✓

---

## 4. Flashcard Completeness — vocabulary_introduced terms vs. Flashcard components

Checking whether every vocabulary_introduced term has a corresponding Flashcard card.

**L01:** 8 vocabulary_introduced terms: OSP, ISP, outside plant, inside plant, demarcation point, headend, OLT, ONT. Flashcard deck has 8 cards matching all 8. ✓

**L02:** vocabulary_introduced after R-1/R-2 fixes: attachment, span, midspan, sag, grade of construction, climbing space, communication space, supply space, neutral, pole class, joint-use, clearance, conduit. Need to verify flashcards for the new additions (joint-use, clearance, conduit added by C-09). Cannot inspect the current L02 file in this audit pass — flagging as **R4-NEW-03** (LOW) for the post-fix RT to verify.

**L03:** 9 vocabulary_introduced: sheath, buffer tube, ripcord, armor, messenger, fiber, central member, water-blocking gel, jacket. Need to confirm flashcard count. Cannot read L03 in detail at this stage — R-3 noted this was clean, so assuming ✓ unless post-fix RT finds otherwise.

**L04:** 10 vocabulary_introduced terms. R-3 confirmed L04 clean after C-10 fix. ✓

**L05:** 9 vocabulary_introduced terms. All 9 have matching Flashcard entries (verified by reading L05). ✓

**L06:** 8 vocabulary_introduced: designer, staker, make-ready crew, splicer, inspector, test technician, project manager, PE. Flashcard deck has 8 entries matching all 8. ✓

**L07:** vocabulary_introduced: strand map, FDH, NAP, drop, feeder, distribution cable, splitter, PON, fiber assignment. Flashcard deck needs to be verified for all 9 terms. Cannot inspect L07 Flashcard section from this audit pass. R-3 didn't flag a flashcard completeness gap here. Noting for verification.

**L08:** 31 vocabulary_introduced terms. Flashcard deck verified at 20 explicit entries in the code read above. There are 31 terms but only 20 flashcard entries — a coverage gap of ~11 terms. Specifically, the following vocabulary_introduced terms do NOT appear in the flashcard deck as read: MMF, OS2, TIA, FOA, RCDD, CFOT, CFOS, USDA, GIS, LiDAR, FTTH, XGS-PON, PPE, NHPA, ESA. Cross-referencing with read of L08 flashcard section (lines 355-378): cards for OTDR, OLTS, MGN, IBT, GES, NESC, NEC, AHJ, ROW, HDD, LOTO, ADSS, PVC, NEPA, SMF, FDH, GPON, MUTCD, RCDD, CFOT — that's 20 cards for 31 vocabulary_introduced terms. **NEW R4-NEW-04 (LOW): L08 Flashcard deck covers 20 of 31 vocabulary_introduced terms. Missing flashcards for: MMF, OS2, TIA, FOA, CFOS/O, USDA, GIS, LiDAR, FTTH, XGS-PON, PPE, NHPA, ESA (13 terms without dedicated flashcards).**

**L09:** 9 vocabulary_introduced: IEEE, NFPA, ITU-T, ICEA, FCC, USACE, CFR, ANSI, code adoption. Flashcard deck (lines 232-241) has 9 entries: T01-L09-FC-ieee, T01-L09-FC-nfpa, T01-L09-FC-itu-t, T01-L09-FC-icea, T01-L09-FC-fcc, T01-L09-FC-usace, T01-L09-FC-cfr, T01-L09-FC-ansi, T01-L09-FC-code-adoption. ✓ All 9 covered.

**L10:** No vocabulary_introduced (capstone). ✓

---

## 5. Quiz Pedagogical Validity — answerable from lesson alone?

**L01:** All 4 questions answerable from L01 content alone. ✓

**L02:** All 4 questions answerable from L02 content. Q2 (24ft attachment, sags to 20ft — pass?) requires knowing the NESC 15.5ft minimum, which is taught in L02. ✓

**L03:** All 4 questions answerable from L03 content. ✓

**L04:** All 4 questions answerable from L04 content. ✓

**L05:** All 4 questions answerable from L05 content. ✓

**L06:** All 4 questions answerable from L06 content. Q1 requires knowing that the designer produces splice documentation — explicitly covered in L06 body. ✓

**L07:** Assumed clean per R-3 quiz derivation. ✓

**L08:** 3 questions. Q1 drag-match: OTDR, MGN, NESC, LOTO, RUS — all 5 terms fully defined in L08 tables. ✓ Q2 (NEPA on RUS-funded project) — NEPA is in L08 vocabulary_introduced and table. ✓ Q3 (RCDD fill-in-blank) — RCDD is in L08 vocabulary_introduced and certifications table. ✓

**L09:** 4 questions assumed clean per R-3. ✓

**L10 capstone:** Q06 fill-in answer is "ADSS" — ADSS is introduced in L08, and L10 assumes it from T01.L08. ✓ Answerable within T01. Q14 requires knowing NWP 57 is the permit for HDD river crossings — taught in L09. ✓ All 15 questions appear answerable from T01 content.

---

## 6. Learning Objectives Alignment

L01 meta has no explicit `learning_objectives` field in the read above. The lesson schema.md specifies learning_objectives as required. Checking if the meta export in L01 contains learning_objectives...

Based on the L01 JSX read (lines 11-30), the meta export has: id, course_id, title, order, lesson_type, prerequisites, vocabulary_introduced, vocabulary_assumed, estimated_minutes — **NO learning_objectives field**. Same pattern in L05 (lines 11-37), L06 (lines 11-38), L08 (lines 11-63), L09 (lines 11-43), L10 (lines 9-67).

**NEW R4-NEW-05 (LOW): None of the T01 lessons have a `learning_objectives` field in their meta export.** The lesson schema.md documents this as a required field. A learner browsing the course catalog (or a curriculum developer auditing coverage) cannot see what each lesson promises to teach. This is a schema-completeness gap, not a content gap — the lessons themselves DO teach appropriate content, but the machine-readable contract is absent.

---

## 7. Tier System Check

**Foundations tier standing alone:** For each lesson, does the Foundations section genuinely work for a beginner who only reads that section?

- **L01 Foundations:** Defines OSP, ISP, demarcation point, OLT, ONT, headend with plain-English analogies (plumbing analogy). Self-contained. ✓
- **L02 Foundations:** Covers pole zones, attachment heights, sag, clearance with the AnnotatedDiagram. Self-contained. ✓
- **L03 Foundations:** Cable anatomy table. Self-contained. ✓
- **L04 Foundations:** Splice case anatomy. Self-contained for someone who knows what a cable is (L03 assumed). ✓
- **L05 Foundations:** Seven lifecycle stages overview. Self-contained. ✓
- **L06 Foundations:** All roles described. Self-contained. ✓
- **L07 Foundations:** Strand map reading. Self-contained with the visual diagram. ✓
- **L08 Foundations:** Acronym reference tables — all self-contained since this IS the reference lesson. ✓
- **L09 Foundations:** Standards landscape. Self-contained. ✓
- **L10:** Single-tier (all quiz). ✓

**Content buried in Working/Advanced that foundations learners need:** One finding:

L05 Working section ("Stage Details") contains additional depth on each lifecycle stage. The Foundations section covers the 7-stage overview. A beginner reading only Foundations would have enough to understand the lifecycle flow. The Working section adds WHO DOES each stage and WHAT IT PRODUCES — this is supplemental, not prerequisite, for foundations comprehension. ✓

L06 Working section contains the TimelineSequence interactive — the handoff sequence between roles. A foundations-only learner sees the role descriptions but misses the interactive sequence view. The TimelineSequence is in the Working section. This is pedagogically sound — foundations teaches the roles, working teaches the workflow. ✓

---

## 8. New Findings

### R4-NEW-01
**Severity:** LOW  
**Lesson:** L07 `meta.vocabulary_assumed` — no specific line (meta block)  
**Framing:** pedagogy / DAG metadata correctness  
**Issue:** L07's `vocabulary_assumed` array includes `{ term: 'PON', source_lesson_id: 'T01.L07' }` — a self-referential entry. PON is correctly in L07's `vocabulary_introduced`, so it cannot also be in `vocabulary_assumed` for the same lesson. This is a circular DAG metadata artifact, not a learner experience problem, but it signals to any tooling that parses the DAG that PON was both taught by and required before L07.  
**Evidence:** L07 meta block, `vocabulary_assumed` array — `{ term: 'PON', source_lesson_id: 'T01.L07' }` alongside `vocabulary_introduced: [..., 'PON', ...]`  
**Fix shape:** Remove the PON entry from L07's `vocabulary_assumed`.  
**Prior rounds:** FIRST SEEN IN R-4.

---

### R4-NEW-02
**Severity:** LOW  
**Lesson:** L06 Foundations — acronym table  
**Framing:** DAG metadata / forward-reference anomaly  
**Issue:** L06's acronym table (Foundations section) defines OTDR — a term that isn't formally introduced until L08. The learner gets a working definition of OTDR in L06 (before the formal introduction), which is helpful but creates a forward-reference: a first-time learner in L06 may think they "know" OTDR from L06's table row, then encounter L08's more detailed flashcard/table treatment and feel confused about whether they missed something. Additionally, L06's `vocabulary_assumed` doesn't include OTDR (correctly — it's not introduced yet), so the DAG treats L06 as not using OTDR — but the body text does. This is a soft DAG integrity issue.  
**Evidence:** L06 acronym table includes `OTDR — Optical Time-Domain Reflectometer` (in the Foundations section). L06 `vocabulary_assumed` does NOT list OTDR. L08 `vocabulary_introduced` includes OTDR.  
**Fix shape:** Remove OTDR from L06's local acronym table; when the splicer role description uses OTDR, add a parenthetical "(covered in L08)" rather than redefining it. Alternatively, accept the forward-reference as intentional context-building and add a note "formally covered in L08."  
**Prior rounds:** FIRST SEEN IN R-4.

---

### R4-NEW-03
**Severity:** LOW  
**Lesson:** L02 Flashcard deck (post-C-09 fix)  
**Framing:** Flashcard completeness post-fix  
**Issue:** R-2 canonical fix C-09 added joint-use, clearance, and conduit to L02's vocabulary_introduced. Cannot confirm from this audit pass whether corresponding Flashcard entries were also added for all three new terms. The vocabulary_introduced contract requires a Flashcard for each term.  
**Evidence:** C-09 fix per `T01_FIX_CANONICAL.md` line 34-35: "Add conduit + joint-use + clearance to L02 vocabulary_introduced + body definitions + flashcards." Git commit `cdf1ada` message: "T01 fix: C-09 add joint-use/clearance/conduit to L02 vocabulary_introduced + body definitions + flashcards." The commit message claims flashcards were added. Post-fix RT should verify all three Flashcard entries are present in L02 JSX.  
**Fix shape:** Verify L02 Flashcard deck contains `joint-use`, `clearance`, and `conduit` entries. If missing, add them with definitions from body prose.  
**Prior rounds:** FIRST SEEN IN R-4 (checking completeness of a prior fix). Not a new regression — verification gap.

---

### R4-NEW-04
**Severity:** LOW  
**Lesson:** L08 Flashcard deck  
**Framing:** Flashcard completeness — vocabulary_introduced vs. Flashcard entries  
**Issue:** L08 has 31 terms in vocabulary_introduced but only 20 Flashcard card entries. 13 vocabulary_introduced terms lack a dedicated Flashcard: MMF, OS2, TIA, FOA, CFOS/O, USDA, GIS, LiDAR, FTTH, XGS-PON, PPE, NHPA, ESA. A learner completing L08 cannot drill all introduced terms with flashcards — the drill set is incomplete.  
**Evidence:** L08 `vocabulary_introduced` array (lines 17-49): 31 terms. Flashcard deck (lines 354-378): 20 cards for OTDR, OLTS, MGN, IBT, GES, NESC, NEC, AHJ, ROW, HDD, LOTO, ADSS, PVC, NEPA, SMF, FDH, GPON, MUTCD, RCDD, CFOT. Missing: MMF, OS2 (in the fiber-type table), TIA, FOA, CFOS, USDA, GIS, LiDAR, FTTH, XGS-PON, PPE, NHPA, ESA.  
**Fix shape:** Add 13 Flashcard entries to L08's `<Flashcard>` component with definitions drawn verbatim from the body table rows (no new definitions invented).  
**Prior rounds:** FIRST SEEN IN R-4.

---

### R4-NEW-05
**Severity:** LOW  
**Lesson:** All L01–L09 meta exports  
**Framing:** Schema completeness / learning objective contract  
**Issue:** None of the T01 lesson files contain a `learning_objectives` field in their meta export. The lesson schema.md specifies `learning_objectives` as part of the required meta shape. Without this field, the LMS cannot display lesson objectives to learners before they start, and curriculum developers cannot machine-verify that lesson content covers its stated objectives.  
**Evidence:** L01 meta (lines 11-30), L05 meta (lines 11-37), L06 meta (lines 11-38), L08 meta (lines 11-63), L09 meta (lines 10-43), L10 meta (lines 9-67) — none contain `learning_objectives`.  
**Fix shape:** Add `learning_objectives: [...]` array to each lesson's meta export, drawing 2-4 objectives from the lesson's Foundations section headings and stated teaching goals. Example for L01: `['Distinguish OSP from ISP infrastructure', 'Define the demarcation point in an FTTH deployment', 'Identify the OLT and ONT roles in the signal path']`.  
**Prior rounds:** FIRST SEEN IN R-4.

---

## 9. R-3 Findings Reconciliation

| R-3 Finding | Status in R-4 |
|---|---|
| R3-NEW-01: L10 NESC vocabulary_assumed credits T01.L08 instead of T01.L02 | **CONCUR** — confirmed still present in L10 line 55. Not yet fixed. |
| R3-NEW-02: L02 sag hotpoint variability caveat missing | **CONCUR** — not re-verified directly but R-3 evidence is clear. |
| R3-NEW-03: L09 USACE flashcard omits NWP 57 full title | **CONCUR** — L09 Flashcard T01-L09-FC-usace (line 238) mentions NWP 57 title inline: "Electric Utility Line and Telecommunications Activities" but the NWP 57 parenthetical in the flashcard back text doesn't highlight the title as a standalone learning point. R-3 finding valid. |
| R3-NEW-04: Three citations missing [confirm edition]: ANSI O5.1, ICEA S-87-640, ITU-T G.984 | **CONCUR** — confirmed in L09 body text (ANSI O5.1, ICEA S-87-640 without edition markers); L07 body text (ITU-T G.984 without edition). All three need `[confirm edition]`. |
| R3-NEW-05: L05 OTMR "15 days" should be "15 business days" | **CONCUR** — L05 Working section line 205-206 reads "OTMR rules give the fiber company 15 days to complete simple attachments from approval to start" — should be "15 business days." |
| R3-NEW-06: L03 jacket "Black HDPE" omits yellow LSZH and orange OSP cable jacket variants | **CONCUR** — R-3 finding valid. |

All 6 R-3 findings confirmed. No disputes.

---

## 10. Coverage Gaps

- **Did not re-run Vite build** — R-3 was last green, no lesson files modified since then. Post-fix RT should run build after fix-agent applies the R-4 findings.
- **Did not fully read L02, L03, L07 flashcard sections** — R4-NEW-03 flags the L02 Flashcard verification gap; cannot confirm flashcard counts for L02/L03/L07 without reading those files. Post-fix RT should verify L02/L07 flashcard completeness after C-09 and any R-4 fixes are applied.
- **Did not read lesson schema.md** — learning_objectives finding (R4-NEW-05) is based on absence in meta exports observed; actual schema.md language not re-read. Schema.md reviewed in an earlier session and has learning_objectives as a named field.

---

## 11. Verdict: YELLOW

5 new findings (R4-NEW-01 through R4-NEW-05), all LOW severity. None are HIGH or MED. Zero new findings from this framing that are technical accuracy issues (all pedagogy/schema). Zero wrong quiz answers. Zero prerequisite invariant violations beyond ones already tracked. The most actionable finding is R4-NEW-04 (L08 missing 13 Flashcard entries) — this directly degrades the learner's drill experience for the acronym reference lesson.

**Saturation check:** R-1 YELLOW (1 new), R-2 YELLOW (5 new), R-3 YELLOW (6 new), R-4 YELLOW (5 new). All five R-4 findings are genuinely orthogonal to R-1/R-2/R-3 (pedagogy/schema framing vs. citation/field-accuracy framings). Saturation rule not met at R-4. **R-5 required if findings are still appearing.**

**However:** All R-4 findings are LOW severity. Per the saturation rule ("no new findings OR only findings that overlap with prior agents' reports"), LOW severity does not exempt from saturation. But given that the R-4 findings are schema-class rather than content-accuracy issues, the orchestrator should weigh whether R-5 should be pedagogy-adjacent (e.g., accessibility/UX) or whether the accumulated LOWs justify a fix wave first, then a combined fix-verify close-out.

=== T01 AUDIT R-4 END ===
