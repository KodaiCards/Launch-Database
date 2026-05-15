# T18 Brief Post-Fix RT Verification

**Date:** 2026-05-16
**Scope:** T18_RESEARCH_BRIEF.md — verifying 9 claimed fixes across commits d3a2963, 33d5ffe, 7c5d3bd
**Role:** STRICT READ-ONLY. Files read: T18_RESEARCH_BRIEF.md, ARCH.md, both RT reports, git show output.

---

## Verdict (≤80 words)

**YELLOW.** 8 of 9 findings are correctly addressed. One internal inconsistency found: the Final Lesson List summary row (L10, line 106) still reads "Quiz (20Q MC + 2 scenario-based items)" while the detailed capstone section (line 373) correctly states "22 questions." The fix updated the body but missed the table row. Additionally, the vocab table definition for "hierarchy of controls" (line 33) remains truncated (omits Elimination and Substitution). Neither is a blocker but both should be patched.

---

## Per-Finding Verification Table

| # | Finding | Claimed fix | Verdict | Evidence |
|---|---|---|---|---|
| RT-B F1 | L01 quiz Elimination = correct | d3a2963: quiz now shows "A) Elimination" → **A** with one-line rationale | **VERIFIED** | Line 140: "A) Elimination B) Engineering controls C) Administrative procedures D) PPE → **A** (Elimination removes the hazard entirely...)" — Substitution removed as correct answer |
| RT-A F1 | MUTCD 2× formula removed | 33d5ffe: replaced with Table 6C-1 fixed-distance description + FHWA guidance heuristic labeled guidance not formula | **VERIFIED** | Line 273: "Table 6C-1 provides fixed spacing distances by road type — approximately 100–350 ft for urban/suburban, 500 ft for rural, 1,000+ ft for expressways/freeways. FHWA guidance range...4–8× speed limit (mph) → ft for urban, 8–12× for rural (engineering judgment applies)" — correctly attributed to guidance text, not formula |
| RT-A F2 | 1910.67(c)(2)(v) language updated | 33d5ffe: "personal fall arrest system OR travel restraint system"; note against "body harness required" | **VERIFIED** | Line 217: "requires a personal fall arrest system OR travel restraint system worn and attached to the boom or basket while in lift...do NOT state 'body harness required'" |
| RT-B F2 | ARCH.md Z89.2→Z89.1 (3 occurrences) | 33d5ffe: all 3 ARCH.md locations corrected | **VERIFIED** | grep of ARCH.md shows 3 occurrences of Z89.1, zero occurrences of Z89.2 |
| RT-B F3 | "positioning system" + "aerial lift" added to vocab table | 7c5d3bd | **VERIFIED** | Lines 47–48: both terms present in vocab table under T18.L04 with field-level definitions |
| RT-B F4 | SideBySide added to L04 summary row | 7c5d3bd | **VERIFIED** | Line 100: L04 Interactivity column now reads "Quiz (MC + drag-match); AnnotatedDiagram (pole worker anchor system); SideBySide (body belt positioning vs. full-body harness PFAS)" |
| RT-B F5 | L08/HazMat ≥2Q in capstone; 22Q total | 7c5d3bd | **PARTIAL** | Detailed capstone section (line 373) correctly shows 22Q + L08 distribution (2Q for hazmat/SDS). However, the Final Lesson List summary row (line 106) still reads "Quiz (20Q MC + 2 scenario-based items)" — the 20Q figure was not updated to 22Q. Internal inconsistency. |
| RT-B F6 | SDS pinned to single first-intro (T18.L01) | 7c5d3bd | **VERIFIED** | Line 34: "T18.L01 (DAG first-intro; brief concept only — L08 is the deep dive)" — unambiguous single anchor; L08 annotated as deep-dive, not first-intro |
| RT-B F7 | 7 missing vocab terms added | 7c5d3bd | **VERIFIED** | taper (L57), buffer (L58), work zone (L59), PEL (L63), TLV (L64), GHS (L65), DART (L69) — all 7 present in vocab definitions table with correct first-intro lesson annotation and field-level definitions |
| RT-A F3 | Static 1–15 kV MAD value removed; OSHA Calculator reference | 7c5d3bd | **VERIFIED** | Lines 303, 314, 399 (C8 row): "1–15 kV range row removed," lesson directs crew to OSHA MAD Calculator per specific voltage; WorkedExample updated to walk through calculator inputs; Citation C8 updated with "static '2 ft 2 in' claim replaced with calculator reference" |

---

## Regression Checks

**Lesson count:** 10 confirmed (lines 97–106 table + lines 118, 145, 171, 206, 233, 261, 288, 320, 346, 371 section headers). No change. ✓

**Lesson ordering:** L01→L10 unchanged across both the summary table and per-lesson sections. ✓

**No new citation errors introduced.** All OSHA section numbers, PEL values, glove class ratings, and regulatory language unchanged in non-patched sections. ✓

**Pre-existing truncation in vocab table (NOT introduced by fixes):** Line 33 defines "hierarchy of controls" as "Engineering controls → administrative controls → PPE" — omitting Elimination and Substitution from the field-level definition. This was present before the fix commits (compare to line 131 which correctly states the full 5-tier hierarchy). Not a regression, but inconsistent with the now-corrected quiz. Author agents will have conflicting signals between the vocab table and the quiz. Low priority but worth a one-line patch.

**Capstone summary row stale (introduced by RT-B F5 fix):** Line 106 still says "20Q MC + 2 scenario-based items." The body at line 373 says "22 questions." The fix updated the body but not the summary table. Author agents reading the summary table will see 20Q; those reading the detail will see 22Q. Minor consistency gap, not a structural error.

---

## Negative Findings

The following were explicitly checked and confirmed unchanged/clean:

1. NIOSH hierarchy order in claims table (line 131): "Elimination → Substitution → Engineering → Administrative → PPE" — correct, pre-existing, untouched. ✓
2. 1910.67(c)(2)(v) body harness note in L04 book-vs-field section: not affected by fix (field section discusses body belt/harness distinction for pole work, not aerial lifts; correct scope). ✓
3. All 3 ARCH.md Z89.1 occurrences confirmed correct; no stray Z89.2 remains. ✓
4. Capstone Q distribution: L08 2Q present, all other lessons at ≥2Q each, total adds to 22Q in the body. ✓
5. SDS vocab table notation: single unambiguous L01 anchor with L08 annotation. ✓
6. L04 summary row: SideBySide confirmed present; previously missing. ✓
7. MAD worked example: now references OSHA MAD Calculator, not a static table value. C8 citation row updated consistently. ✓
8. No AI references introduced in any patched section. ✓
9. No new unsourced quantitative claims. ✓
10. Word count and structure of brief preserved; no sections deleted. ✓

---

## Items Requiring Follow-Up Patch (LOW)

1. **Line 106 — L10 summary table Q count:** Update "20Q MC + 2 scenario-based items" to "22Q MC + 2 scenario-based items" to match the capstone body.
2. **Line 33 — hierarchy of controls vocab definition:** Expand to "Elimination → Substitution → Engineering controls → Administrative controls → PPE, in order from most to least effective" to match the quiz and claims table.

Neither is a blocker for author dispatch. Authors can resolve at authoring time if this is not patched first.

---

=== T18 BRIEF POST-FIX RT END ===
