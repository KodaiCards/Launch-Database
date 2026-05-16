# T05 Final-Verify-2 RT-A — Pedagogy + Coverage + Citation-Existence (Second Round)
**Constraints acknowledged:** READ-ONLY. Write-path allowlist = this file ONLY. No Edit/Write to lesson files, canonicals, CLAUDE.md, ARCH.md, or any other file. No fixes applied.
**Framing:** Pedagogy / coverage completeness / citation-existence / vocabulary discipline (directive 18z)
**Scope:** T05/L01–L15 + cross-touched T07/L02, T07/L04 per polish-3 fixes
**Files read:** T05/L01–L15, T07/L02, T07/L04 (measuring-existing-attachments), T04/L01–L03, T01/L02, all prior T05 audit+RT+canonical reports
**Date:** 2026-05-16

---

## 1. Polish-3 Verification

**Claim:** T05 Polish-3 (`5d9e1e9`) fixed T07/L02 `existing utilities` pointer from `T04.L02` → `T04.L01`.

**Verification:**
- T07/L02 line 36: `{ term: 'existing utilities', source_lesson_id: 'T04.L01' }` ✓
- T04.L01 `vocabulary_introduced`: `['site walk', 'existing utility', 'hazard identification', 'photo log']` — `existing utility` formally introduced there ✓
- `git show 5d9e1e9 --stat` confirms: one file changed, `T07/L02-reading-plans-in-the-field.jsx`, 1 insertion / 1 deletion ✓

**RESULT: POLISH-3 FIX VERIFIED.**

---

## 2. Polish-2 Neighborhood Findings Investigation

The polish-3 canonical logged two neighborhood items as "out of scope / not fixed." This section investigates each.

### Item A: T07/L02 `pole locations from design → T04.L02` (line 37)

**Claim from canonical:** "Term not found in any `vocabulary_introduced` array; closest valid lesson is T04.L02 (LiDAR/planimetric survey context)."

**Verification:**
- T04.L02 `vocabulary_introduced`: `['drone', 'LiDAR', 'point cloud', 'planimetric', 'GSD', 'RTK GNSS', 'photogrammetry']`
- 'pole locations from design' is **NOT** in T04.L02's `vocabulary_introduced`
- No lesson across T01–T09 introduces 'pole locations from design' as a formal vocabulary term (exhaustive grep confirms zero hits in any `vocabulary_introduced` array)
- T04.L02 body text does discuss pole locations in the planimetric/aerial survey context (planimetric definition mentions "parcel boundaries, pole locations, and structures"), which is why the canonical called it "closest valid lesson"

**Assessment:** The pointer is a reasonable approximation but remains technically a DAG violation — the term has no formal first-introduction lesson. Options: (a) keep T04.L02 as closest valid approximation and treat this as a schema-compliance borderline LOW, or (b) add 'pole locations from design' to T04.L02's `vocabulary_introduced` + `key_terms` + Flashcard deck. This is the same class as the pre-polish unresolved items.

**Severity: LOW** — no content accuracy issue; DAG metadata precision gap only.

### Item B: T07/L02 `contour → T04.L03` (line 35)

**Claim from canonical:** "T04.L03 introduces datum, UTM, NAD83 etc. `contour` not found in T04.L03 vocabulary_introduced."

**Verification:**
- T04.L03 `vocabulary_introduced`: `['landbase', 'shapefile', 'geodatabase', 'coordinate system', 'datum', 'UTM', 'NAD83']`
- 'contour' is **NOT** in T04.L03's `vocabulary_introduced`
- No lesson across T01–T09 introduces 'contour' in any `vocabulary_introduced` array (exhaustive grep: zero hits)
- 'contour' appears in T05.L06 body prose ("NESC map contours") and T03.L09 ("wind speed contour maps") — both as general English, neither as a formally introduced vocabulary term
- T04.L03 covers coordinate systems and GIS layering; topographic contours could logically be introduced there, but are not

**Assessment:** 'contour' has NO valid source_lesson_id anywhere in the curriculum. The pointer `T04.L03` is incorrect AND no correct pointer exists — the term needs either (a) a first-introduction added to T04.L03, or (b) removal from T07.L02's `vocabulary_assumed` if 'contour' is treated as general English not requiring a formal intro.

**Severity: LOW** — same class as prior neighborhood findings; no content accuracy issue.

---

## 3. All-Prior-Fix Regression Check

### Polish-2 fixes (5 items from `ffb9631`):

| ID | Fix | Current State | Result |
|----|-----|---------------|--------|
| NEW-A | T05.L10: add `suspension clamp` Flashcard card | L10 line 168: `id: 'T05-L10-fc-suspension-clamp'` present; front/back match key_terms definition | **VERIFIED** |
| NEW-B-1 | T07.L04: `clearance → T01.L02` | L04 (measuring-existing-attachments) line 33: `{ term: 'clearance', source_lesson_id: 'T01.L02' }` | **VERIFIED** |
| NEW-B-2 | T07.L04: `attachment point → T01.L02` | L04 line 36: `{ term: 'attachment point', source_lesson_id: 'T01.L02' }` | **VERIFIED** |
| NEW-B-3 | T07.L02: `pole locations from design → T04.L02` | L02 line 37: `{ term: 'pole locations from design', source_lesson_id: 'T04.L02' }` | **VERIFIED** (see §2-A above for residual DAG precision issue) |
| GAP-A | T05.L02 + L15: "slightly" → "conservatively" | L02 line 368: "conservatively larger"; L15 sanityCheck: "conservatively smaller" | **VERIFIED** |

### All-prior-fix regression summary (cumulative from CANONICAL):
- 13 original canonical items: all VERIFIED per prior RT-A/B reports; spot-checked L15 Q12 (`+5.05 ft`, answerIndex 0) ✓; L10 suspension clamp card now present ✓; T07.L04 both pointers at T01.L02 ✓
- 4 post-fix RT items (F-RT-1 through F-RT-3): spot-checked L15 sanityCheck (`H=640, sag≈2.19 ft, margin≈+3.95 ft`) ✓
- 5 patch-wave-2 items: spot-checked L07 EDS/RTS → T03.L04 ✓
- Polish-1 items (P8, P4/F11, NB-2): all verified per prior RT-A (no regressions introduced by polish-2 or polish-3)

**No regressions detected in any prior fix.**

---

## 4. Independent Gap Research (Pedagogy Framing — Fresh Eyes)

### GAP-NEW-A (MEDIUM): T05.L03 — Three terms simultaneously in `vocabulary_introduced` AND `vocabulary_assumed`

**Location:** `osp-training/src/lessons/T05/L03-comm-to-supply-separation-rule-235.jsx`

**Finding:** Lines 30–32 list `'supply space'`, `'communication space'`, `'climbing space'` in `vocabulary_introduced`. Lines 41–43 list the same three terms in `vocabulary_assumed` pointing to `T01.L02`. This is a schema contradiction: a term cannot be both "introduced here for the first time" AND "assumed from a prior lesson."

**Primary-source verification:**
- T01.L02 `vocabulary_introduced`: includes `'communication space'` and `'supply space'` explicitly (lines 25–26 of T01.L02)
- T01.L02 has rendered Flashcard cards for `climbing space` (`T01-L02-FC-climbing-space`) and `supply space` (`T01-L02-FC-supply-space`)
- T05.L03 `key_terms` contains separate definitions for all three at lines 71–83 — duplicating definitions already established in T01.L02

**DAG implication:** Per the strict prerequisite invariant, a term has ONE first-introduction lesson. Supply space, communication space, and climbing space were introduced in T01.L02. T05.L03 should list them ONLY in `vocabulary_assumed → T01.L02` and NOT in `vocabulary_introduced`. The current state means any learner who reads T05.L03 receives conflicting signals about when these terms are "first introduced."

**Fix:** Remove `'supply space'`, `'communication space'`, `'climbing space'` from T05.L03's `vocabulary_introduced` array; remove the duplicate `key_terms` entries for these three terms from T05.L03 (the definitions already exist in T01.L02). The `vocabulary_assumed` entries are correct and should remain.

**Severity: MEDIUM** — active DAG schema violation with a lesson that has all three flagged terms in both arrays simultaneously.

### GAP-NEW-B (LOW): T05.L01 — Four `vocabulary_introduced` terms without rendered Flashcard cards

**Location:** `osp-training/src/lessons/T05/L01-what-nesc-is-and-how-to-read-it.jsx`

**Finding:** `vocabulary_introduced` (line 23) lists 10 terms: `['NESC', 'IEEE C2', 'Rule', 'Section', 'Part', 'AHJ', 'Rule 232', 'Rule 235', 'Rule 250', 'Rule 261']`. `key_terms` contains definitions for all 10. The rendered Flashcard block (6 cards) covers: `nesc`, `ahj`, `rule232`, `rule235`, `rule250`, `rule261`. 

**Missing Flashcard cards:** `IEEE C2`, `Rule`, `Section`, `Part` — 4 vocabulary terms with key_term definitions but no rendered Flashcard card. Directive 18z violation.

**Note:** These are document-structure terms (IEEE C2 = the NESC document number; Rule/Section/Part = organizational hierarchy). A prior RT might have considered them low-priority, but directive 18z has no exceptions by term category. All vocabulary_introduced terms require rendered cards.

**Severity: LOW** — directive 18z violation; definitions exist in key_terms; only the Flashcard render is missing.

### GAP-NEW-C (LOW): T07.L02 `route survey → T04.L01` — term not formally introduced there

**Location:** T07/L02 line 34: `{ term: 'route survey', source_lesson_id: 'T04.L01' }`

**Finding:** T04.L01 `vocabulary_introduced`: `['site walk', 'existing utility', 'hazard identification', 'photo log']`. 'route survey' is NOT listed. The lesson title is "The Site Walk" and body uses 'route survey' as a synonym, but the term is never formally introduced in any `vocabulary_introduced` array.

**Assessment:** This is borderline — 'site walk' and 'route survey' are effectively synonymous in T04.L01, and `T04.L01` is the most logical home for 'route survey' even if the formal introduction uses 'site walk' as the canonical term. Options: (a) add 'route survey' to T04.L01's `vocabulary_introduced` as a synonym entry, or (b) treat T04.L01 as the closest valid pointer and document the synonym relationship in the lesson.

**Severity: LOW** — no content accuracy issue; DAG metadata precision gap only.

---

## 5. Cross-Lesson Consistency Table

| Check | L02 | L06 | L07 | L15 | Result |
|-------|-----|-----|-----|-----|--------|
| Light district: 0 in ice, 9 psf wind | ✓ (Step 4) | ✓ (key_terms line 59) | ✓ (worked example) | ✓ (Q16, WorkedExample sanityCheck) | CONSISTENT |
| Macon = Light district | ✓ | ✓ (line 133) | — | ✓ (Q16) | CONSISTENT |
| NESC 15.5 ft clearance over motor vehicle traffic | ✓ (p238 callout) | — | — | ✓ (Q01) | CONSISTENT |
| w_combined = √(w²+w_wind²) | ✓ (Step 4) | ✓ | ✓ | ✓ (Q18, WorkedExample) | CONSISTENT |
| Conservative-approximation label | ✓ ("conservatively larger") | — | — | ✓ ("conservatively smaller" for vertical component) | CONSISTENT — labels are mirror-correct |
| Sag formula s = wL²/8H | ✓ | — | ✓ | ✓ (Q09) | CONSISTENT |
| GPON 1:32 splitter = 17–17.5 dB | — | — | — | ✓ (Q24); L12 ✓ | CONSISTENT |
| Glynn County 250C Extreme Wind overlay, 60 ft threshold | ✓ (14 ft / Rule 250C callout box) | ✓ (coastal GA section) | — | ✓ (Q08, Q17) | CONSISTENT |

**Cross-lesson consistency: CLEAN on all checked items.**

---

## 6. Summary Table

| Category | Count | Notes |
|----------|-------|-------|
| Polish-3 fix VERIFIED | 1/1 | existing utilities T04.L01 ✓ |
| Polish-2 neighborhood items investigated | 2/2 | Both confirmed as unresolved LOW DAG gaps |
| All-prior-fix regression check | 0 regressions | All 22+ fixes from canonical still in place |
| Cross-lesson consistency | CLEAN | 8 consistency checks pass |
| NEW MEDIUM | 1 | GAP-NEW-A: T05.L03 triple-listed terms (supply/communication/climbing space in both vocab_introduced AND vocab_assumed) |
| NEW LOW | 2 | GAP-NEW-B: T05.L01 missing 4 Flashcard cards; GAP-NEW-C: T07.L02 route survey pointer ambiguous |

---

## 7. Final Verdict: YELLOW

**Rationale:** Polish-3 fix verified clean. All prior fixes remain in place — no regressions. Cross-lesson consistency is clean. Content is factually sound and pedagogically appropriate throughout.

**Issues preventing GREEN:**

1. **GAP-NEW-A (MEDIUM):** T05.L03 has `supply space`, `communication space`, `climbing space` simultaneously listed in BOTH `vocabulary_introduced` (claiming first introduction) AND `vocabulary_assumed` pointing to T01.L02 (acknowledging T01.L02 introduced them). Active DAG schema contradiction. Also produces duplicate `key_terms` definitions. Fix: remove all three from T05.L03 `vocabulary_introduced` and `key_terms`; `vocabulary_assumed` entries are correct.

2. **GAP-NEW-B (LOW):** T05.L01 `vocabulary_introduced` lists 10 terms; only 6 have rendered Flashcard cards. Missing: `IEEE C2`, `Rule`, `Section`, `Part`. Directive 18z violation.

3. **GAP-NEW-C (LOW):** T07.L02 `route survey` pointer to T04.L01 is technically incorrect — `route survey` is not in T04.L01's `vocabulary_introduced`. Borderline LOW; `site walk` (which IS introduced) is the T04.L01 canonical term for the same concept.

**Saturation recommendation:** The MEDIUM finding (GAP-NEW-A) is a real schema violation that no prior RT caught. It should be fixed before declaring T05 GREEN. After the fix-agent addresses GAP-NEW-A, a lightweight final-verify spot-check of L03's two vocab arrays is sufficient (full RT pair not required unless the fix-agent touches other files). GAP-NEW-B and GAP-NEW-C are LOW — fix during same polish pass.

=== T05 FINAL-VERIFY-2 RT A PEDAGOGY END ===
