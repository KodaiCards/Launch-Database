# T01 Retroactive Audit — Fix Canonical (R-3 + R-4 Findings)

**Date:** 2026-05-16
**Orchestrator-authored:** Post R-4 saturation assessment
**Inputs:** R-3 (`51dcefa`, 6 new findings) + R-4 (`6020cdd`, 5 new findings)
**Scope:** T01 lessons L01–L10 only
**Prior canonical:** `T01_FIX_CANONICAL.md` (R-1/R-2 findings, all APPLIED per git log `3595cea`→`100835d`)
**Status of R-1/R-2 fixes:** COMPLETE — confirmed by R-3 + R-4 reviews

---

## Open Items from R-3 (all confirmed CONCUR in R-4)

| ID | Sev | Lesson | Issue | Fix |
|---|---|---|---|---|
| R3-01 | LOW-MED | L10 line 55 | vocabulary_assumed NESC credits `source_lesson_id: 'T01.L08'` — NESC is introduced in L02 (vocabulary_introduced), not L08. L08 does have a NESC flashcard/table row but it's NOT in L08 vocabulary_introduced. Correct source is T01.L02. | Change `source_lesson_id` for NESC in L10 vocabulary_assumed from `'T01.L08'` to `'T01.L02'` |
| R3-02 | LOW | L02 AnnotatedDiagram | Sag hotpoint uses scenario-specific "22 ft attachment, 4 ft sag = 18 ft clearance" without noting variability — learners may anchor on 4 ft as a representative sag value when actual sag varies with span length, cable weight, and temperature. | Add 1-sentence variability note to the sag hotpoint text: "Sag varies with span length, cable weight, and temperature; this example shows one scenario." |
| R3-03 | LOW | L09 Flashcard T01-L09-FC-usace | USACE flashcard back text mentions NWP 57 but does not include the full title "Electric Utility Line and Telecommunications Activities." Learners may not be able to identify NWP 57 by title on a permit form or exam question. | Add full title to flashcard back text, e.g.: "…NWP 57 ('Electric Utility Line and Telecommunications Activities')…" |
| R3-04 | LOW | L02 body (ANSI O5.1), L03 body (ICEA S-87-640), L09 body (ICEA S-87-640), L07 body (ITU-T G.984) | Three citations missing `[confirm edition]` marker per curriculum-wide citation protocol. | Add `[confirm edition]` after: ANSI O5.1 in L02; ICEA S-87-640 in L03 and L09; ITU-T G.984 in L07. |
| R3-05 | LOW | L05 Working section, line ~205 | "OTMR rules give the fiber company 15 days to complete simple attachments" — should be "15 business days" per 47 CFR 1.1411(h)(2)(ii). | Change "15 days" to "15 business days" in L05 Working section OTMR description. |
| R3-06 | LOW | L03 Foundations | Jacket color description covers only "Black HDPE for direct-buried and aerial." Omits yellow LSZH (common for low-smoke OSP in conduit) and orange loose-tube OSP variants. Field crews may not recognize these variants as OSP cable. | Add brief note to L03 jacket section: "Jacket color varies by application: black HDPE is standard for aerial and direct-buried; orange or yellow jackets indicate conduit-application or LSZH variants." |

---

## Open Items from R-4

| ID | Sev | Lesson | Issue | Fix |
|---|---|---|---|---|
| R4-01 | LOW | L07 meta vocabulary_assumed | PON is both in vocabulary_introduced AND vocabulary_assumed with source_lesson_id: 'T01.L07' — circular self-reference. DAG tooling would report PON as required before and introduced by the same lesson simultaneously. | Remove PON from L07's vocabulary_assumed array. |
| R4-02 | LOW | L06 Foundations acronym table | OTDR defined in L06 acronym table (Foundations) before it's formally introduced in L08. Creates a forward-reference: learner sees a brief OTDR definition in L06, then encounters a more complete treatment in L08, potentially causing confusion about whether L06 "introduced" it. L06 vocabulary_assumed doesn't list OTDR (correct), creating a DAG inconsistency with the body text. | Option A (preferred): Remove OTDR from L06 local acronym table; replace with parenthetical in the splicer role description: "…an OTDR (covered in L08)…". Option B: Accept forward-reference intentionally and add annotation "(preview — formally covered in L08)" to the table row. |
| R4-03 | LOW | L02 Flashcard deck | C-09 commit (`cdf1ada`) claims flashcards were added for joint-use, clearance, conduit. Post-fix RT must verify all three entries exist in L02 JSX Flashcard component. If any are missing, add from body text definitions. | Verify L02 Flashcard deck contains entries for `joint-use`, `clearance`, and `conduit`. Add if missing. |
| R4-04 | LOW | L08 Flashcard deck | 31 terms in vocabulary_introduced; only 20 Flashcard entries. Missing cards for: MMF, OS2, TIA, FOA, CFOS/O, USDA, GIS, LiDAR, FTTH, XGS-PON, PPE, NHPA, ESA (13 terms). | Add 13 Flashcard entries to L08 Flashcard component. Definitions drawn verbatim from body table rows — no new definitions invented. |
| R4-05 | LOW | All L01–L09 meta exports | No `learning_objectives` field in any T01 lesson meta. Schema.md specifies this field. | Add `learning_objectives: [...]` array to L01–L09 meta exports. 2-4 objectives per lesson, drawn from lesson body headings and stated teaching goals. L10 (capstone-quiz type) may have simplified objectives or reference the prerequisite lessons' objectives. |

---

## Cross-topic DAG edges (outside T01, for a separate cross-topic fix agent)

These were documented in the original `T01_FIX_CANONICAL.md` as X-01 through X-04. Status: commit `100835d` "Retroactive fix: correct cross-topic vocabulary_assumed source_lesson_id refs per T01 audit X-01 through X-04" — APPLIED. Verify at post-fix RT time.

---

## Fix Agent Instructions

Fix agent scope: T01 lessons L01–L10 ONLY. Do NOT touch other topic files.

Apply in this commit sequence:
1. **Commit A:** R3-01 — L10 NESC source_lesson_id `'T01.L08'` → `'T01.L02'`
2. **Commit B:** R3-04 — Add `[confirm edition]` to ANSI O5.1 (L02), ICEA S-87-640 (L03 + L09), ITU-T G.984 (L07)
3. **Commit C:** R3-05 — L05 "15 days" → "15 business days"
4. **Commit D:** R3-02, R3-03 — L02 sag hotpoint variability caveat + L09 USACE flashcard NWP 57 title
5. **Commit E:** R3-06 — L03 jacket color note
6. **Commit F:** R4-01, R4-02 — L07 PON circular removal + L06 OTDR forward-ref resolution
7. **Commit G:** R4-03 — L02 flashcard verify (joint-use, clearance, conduit) — fix if missing
8. **Commit H:** R4-04 — L08 13 missing Flashcard entries
9. **Commit I:** R4-05 — learning_objectives in all L01–L09 meta exports

**Before each push:** run `cd osp-training && npm run build` — must succeed.

**Closeout requirement:** Re-derive any changes to numeric values. Paste verbatim from body text for all new flashcard definitions — do not invent definitions.

---

## Deferred (do not fix in this wave)

| ID | Reason |
|---|---|
| RUS / BICSI not in L01 vocabulary_introduced | These are in L01 acronym table body text — learner gets definitions. Adding to vocabulary_introduced requires verifying all downstream vocabulary_assumed references for RUS and BICSI point to T01.L01 (currently some point there, some don't). Scope complexity exceeds benefit of a retroactive fix. Track for T01 comprehensive re-audit if a future wave touches L01 for other reasons. |
| FDH / NAP not in L01 vocabulary_introduced (but defined in L01 body, assigned to T01.L07) | Similar to above. L07 correctly carries them in vocabulary_introduced. L01 body gives learners the definitions earlier as a preview. Acceptable. |

---

=== T01 FIX CANONICAL R3 R4 END ===
