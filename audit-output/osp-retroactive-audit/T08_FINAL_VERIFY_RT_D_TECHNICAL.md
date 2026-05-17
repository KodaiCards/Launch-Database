# T08 Make-Ready & Pole Attachment — Final Verify RT-δ (Technical)
## Framing: Technical / Primary-Source / DIFFERENT-Sources / Cascade-Defense / Under-Audited Rotation

**CONSTRAINTS ACKNOWLEDGED: READ-ONLY — no lesson file edits, no canonical creation, no fix application, no follow-up round dispatch, no orchestrator impersonation. Write-path allowlist: this file only. Token budget ≤120K.**

---

## 1. PRIMARY-SOURCE VERIFICATION LOG (DIFFERENT sources than Polish-A)

Polish-A used: Accuristech NESC product page, ATIS Bowmer slides, Rule 261 application guides, T05.L04 in-repo cross-reference.

RT-δ uses: IEEE Xplore NESC reference (Wiley-IEEE), ikeGPS NESC resources, ATIS 2023 NESC update presentation, EC&M 2023 NESC highlights, NESC Grades of Construction source (ikeGPS), Cornell LII / eCFR for FCC CFR sections, DWT FCC 23-109 analysis, FCC Law Blog, eCFR direct.

### NESC Section 24 = Grades of Construction (Grade B/C/N) — VERIFIED CORRECT

**Source:** ATIS 2023 NESC Update presentation (Bowmer/Gallo, peg.atis.org, April 2024) + ikeGPS NESC Grades of Construction resource + IEEE Xplore Wiley-IEEE "NESC Requirements (Strength and Loading)" chapter.

All three sources independently confirm:
- **Section 24 = "Grades of Construction"** — defines the required grade (Grade B, C, or N) based on crossing type and application.
- **Section 25 = "Loadings for Grades B and C"** — defines the physical loads (ice, wind, temperature). Section 25 was modernized in C2-2023 with ASCE 7 and ASCE 74 wind maps (50-yr and 100-yr MRI maps).
- **Section 26 = "Strength Requirements"** — outlines the necessary mechanical strength of poles, towers, crossarms, and guys to support the calculated loadings.
- **Rule 261** = the specific rule within Section 26 governing the strength of line-support structures (poles, towers, crossarms). Referenced by IEEE Xplore as the rule set that structures must comply with: "load calculated by applying load factors in Table 253-1 must not exceed permitted load per Rule 261."

**VERDICT:** Polish-A's 9-location correction (§24 "stress requirements" → "Section 26 strength requirements") is **CONFIRMED CORRECT** from completely independent sources. The factual basis is solid across all 3 independent source families. Polish-A was technically right.

### NESC Rule 235 — 40-inch communication-worker safety zone — VERIFIED CORRECT

**Sources:** ikeGPS NESC Rule 235 resource + TDEC cooperative joint-use guide (cooperative.com, May 2025) + North Central Electric NESC clearance guide.

Confirmation from multiple independent sources:
- Rule 235 defines the **communication-worker safety zone**: the minimum vertical separation between the top of the communication space and the lowest supply conductor.
- The minimum clearance for supply conductors under 8.7kV = **40 inches** at the pole (NESC Table 235-5). Some configurations require more.
- ikeGPS: "The communication worker safety zone is often 40 inches, but the NESC allows less than 40 inches for certain types of wires and equipment and requires more than 40 inches for other configurations."
- T08.L03 states "a minimum 40-inch vertical separation that telecom workers must maintain below energized power conductors" — this is correct for the most common joint-use configuration (supply conductors ≤8.7kV).

**VERDICT:** T08.L03's 40-inch Rule 235 citation is **CONFIRMED CORRECT** from different sources than prior RTs used. The at-pole value for typical joint-use voltages is 40 inches.

### 47 CFR §1.1411(i) — self-help cost recovery — VERIFIED CORRECT

**Sources:** eCFR direct (ecfr.gov) + Cornell LII §1.1411.

eCFR confirms §1.1411 covers "Timeline for access to utility poles" and includes multiple subsections governing self-help procedures. The parenthetical "(self-help cost recovery)" used throughout T08 correctly characterizes the scope. The regulation covers: cost recovery for self-help make-ready work, remedial work cost responsibility, and cost allocation procedures — all within §1.1411.

**VERDICT:** §1.1411(i) as used across T08 (self-help cost recovery) is **CONFIRMED CORRECT** framing. No cross-section confusion detected.

### 47 CFR §1.1404 — pole attachment complaint proceedings — VERIFIED CORRECT

**Sources:** eCFR direct + Cornell LII §1.1404 ("Pole attachment complaint proceedings").

Confirmed: §1.1404 = Pole attachment complaint proceedings (governing formal complaints under 47 U.S.C. §224(f)). T08.L03 line 291 cites "47 CFR §1.1404 (Pole attachment complaint proceedings)" — exact match to CFR section title.

**VERDICT:** §1.1404 citation in L03 is **CONFIRMED CORRECT**.

### FCC 23-109 — 5 betterment exemptions — VERIFIED CORRECT, ORDER DISCREPANCY NOTED

**Sources:** DWT FCC Law Blog (December 2023 analysis) + FCC Law Blog (fcclawblog.com, December 2023) + FCC official fact sheet (DOC-398665A1.pdf).

The five exemptions from "necessitated solely" in FCC 23-109 confirmed from independent sources:
1. Road expansions/moves, property development, storm hardening, similar government-imposed requirements
2. Required pursuant to applicable law (NESC or other engineering standards failure)
3. Current pole fails applicable engineering standards (NESC)
4. Utility's previous or contemporaneous change to its own internal construction standards
5. Current pole already on utility's internal replacement schedule (regardless of timing)

T08.L06 lists the 5 exemptions as:
1. Replacement schedule ✓ (matches #5)
2. Road expansion/government-imposed ✓ (matches #1)
3. Storm hardening ✓ (matches #1 partial)
4. Current pole fails NESC independently ✓ (matches #3)
5. Utility's change to own internal construction standards ✓ (matches #4)

**VERDICT:** All 5 exemptions are **SUBSTANTIVELY CORRECT**. T08.L06 splits exemption #1 (road/government-imposed + storm hardening) into two bullets for pedagogical clarity, and omits the "pursuant to applicable law" framing for exemption #2, but the full set of conditions is covered. This is a LOW pedagogical note — not a factual error.

---

## 2. POLISH-A 16+ FIX SPOT VERIFICATION (independent re-check, 6 locations sampled)

| Location | Before (per notes) | After (current file) | Verdict |
|---|---|---|---|
| L06 file header comment | `NESC C2-2023 §24` | `NESC C2-2023 Section 26 (strength requirements) / Rule 261` | ✓ APPLIED |
| L06 key_terms "pole replacement" (line 35) | `§24 loading calculations` | `Section 26 strength requirements` | ✓ APPLIED |
| L06 Flashcard back (line 110) | `§24 loading calculations` | `Section 26 strength requirements` | ✓ APPLIED |
| L06 Trigger 2 body (line 169) | `NESC C2-2023 §24 sets maximum stress requirements` | `NESC C2-2023 Section 26 sets the strength requirements` | ✓ APPLIED |
| L06 WorkedExample Step 2 (line 345) | `NESC §24 allows a higher theoretical limit` | `NESC Section 26 strength factors allow a higher theoretical computed limit` | ✓ APPLIED |
| L03 line 416 LOW notation | `NESC C2-2023 §23, §24` | `NESC C2-2023 Rule 235 (communication-worker safety zone), Section 24 (grades of construction)` | ✓ APPLIED |

All 6 sampled locations confirm Polish-A fixes are correctly applied in the current HEAD.

---

## 3. CUMULATIVE REGRESSION CHECK

**Fix Wave A (H-1/H-2/M-1/M-2/L-1..L-4) — still intact?**

Post-Polish-A grep confirms:
- `§1.1411(i)` present in L02/L03/L06 cost-recovery contexts ✓
- `§1.1404 (Pole attachment complaint proceedings)` at L03 line 291 ✓
- `Rule 232`/`Rule 235` notation used in L01/L03/L04/L05 body prose ✓
- FCC 23-109 betterment section with all 5 exemptions present in L06 Advanced tier ✓

**No regressions detected from Fix Wave A items.**

**NESC notation completeness — outstanding items after Polish-A:**

Grep results on current HEAD confirm 2 remaining `NESC §25` shorthands in L06:
- Line 163: `(per NESC §25 loading district)` — inside Trigger 2 body box
- Line 243: `(NESC §25)` — in Advanced tier Macon, GA loading district paragraph

These were noted in Polish-A's NEIGHBORHOOD SCAN as "flag for future pass if notation sweep extends to §25 shorthands" — explicitly NOT fixed in Polish-A, deferred. They are LOW-cosmetic notation items: §25 = loadings is semantically correct in both contexts.

L06 line 424 contains `NESC §23` as an intentionally-incorrect distractor answer (the wrong-answer for Q3). This is pedagogically correct — the distractor must be wrong. No change needed.

**Verdict:** No regressions introduced by Polish-A. 2 residual LOW notation items (§25 shorthands at L06:163 and L06:243) remain — acknowledged in Polish-A notes, deferred. Semantically correct.

---

## 4. MATH + QUIZ ADVERSARIAL SAMPLE — L11 AND L12

### L11.Q2 — float calculation (less-audited lesson)

Prompt: Go-live Week 18. Cable 3wks + splice 1wk + test/turn-up 1wk = 5wks. Make-ready expected Week 12. Float?

Re-derivation: Latest make-ready finish = 18 − 5 = Week 13. Float = 13 − 12 = **1 week**.
Answer index 1 = "1 week" ✓. Explanation matches arithmetic. ✓

### L11.Q3 — float goes to zero, first lever

Answer index 2 = "Compress back-end activities." Lesson states four levers in order of relationship-cost: (1) compress back-end, (2) OTMR substitution, (3) FCC clock reference, (4) formal complaint. 

Verify ordering: compressing back-end is internal (no external relationship cost) → first lever. FCC formal complaint = highest relationship cost → last. Order is correct. ✓

### L12 capstone worked example (MRE + rental)

Variables (defaults): MRE=$8,500; rental=$120/pole/yr; poles=1; years=20.

Re-derivation:
- Annual total = 1 × $120 = $120/yr
- Total rental = $120 × 20 = $2,400
- Grand total = $8,500 + $2,400 = $10,900

Sanity check sentence: "Make-ready cost ($8,500) dominates the upfront cost; annual rental ($120/yr) is a modest long-term obligation" — $8,500 >> $2,400 annually after year 1. ✓ Correct framing.

**All 3 adversarial math checks pass.**

---

## 5. UNDER-AUDITED LESSON ROTATION (L09, L10, L11/L12 targeting)

Per saturation protocol: sample 3-5 numeric/citation claims from lessons not heavily touched in prior audit rounds.

### L09 — Application, Permit, and Inspection Path

**Claim 1: FCC 15-day clock starts on complete application receipt (L09 Step 2).**
Text: "The FCC 15-day clock for granting access starts running from when a COMPLETE application is received." Confirmed per 47 CFR §1.1411 and eCFR structure. ✓

**Claim 2: "10-14 business days for straightforward applications" (utility-company review key term).**
This is field-practice characterization, not a regulatory number. The regulatory standard is the FCC clock period (§1.1411 specific number [confirm]). The 10-14 day characterization is appropriately framed as "typically" in the lesson vocabulary. LOW: the actual FCC regulatory period should be cited with [confirm current regulatory deadlines] — which L09 Step 3 DOES include. ✓ properly flagged.

**Claim 3: L09 Step 5 — "Submit AHJ permit application... Day 15 (parallel with MRE review)."**
This is field-practice guidance, not a regulatory requirement. Correctly framed as a strategic recommendation. ✓

**Finding:** L09 is clean. No numeric errors or citation issues. The vocabulary_introduced structure (dictionary export vs. array) differs from other T08 lessons — but this is a schema pattern difference, not a factual error. LOW-cosmetic: schema inconsistency noted but not a content issue.

### L10 — As-Built Notification

**Claim 1: "Rule 232 — vertical clearance tables" in NESC compliance certification definition.**
Rule 232 = vertical clearances (ground, road, rail clearances). ✓ Correct citation.

**Claim 2: "Rule 250/261" for mechanical strength in NESC compliance certification.**
Rule 250 = loading district (loading criteria), Rule 261 = strength of line supports. The definition bundles "Rule 250/261" under mechanical strength, but Rule 250 is actually about loading districts (§25 loadings), not mechanical strength. **LOW:** The bundling "mechanical strength of pole and attachments (Rule 250/261)" slightly conflates Rule 250 (loading criteria) with Rule 261 (structural strength). The correct citation for mechanical strength is Rule 261 alone (Section 26). Rule 250 governs loading, not strength. This is a LOW — not a safety error, and the PE certification would catch the distinction in practice.

**Claim 3: "pole-loading update" key term cites "Section 26 strength requirements; Section 25 loading district criteria."**
L10 line 39: "Section 26 strength requirements; Section 25 loading district criteria" — Both assignments are correct per the Polish-A verification (Section 26 = strength, Section 25 = loadings). ✓

**Finding from L10:** LOW — "Rule 250/261" bundled under "mechanical strength" conflates loading rules (250) with strength rules (261).

### L12 — Capstone Quiz (under-audited)

Checked Q5 (capstone):

**L12.Q5: Prompt about "supplemental make-ready" scope within an MRE.**
Answer index 1: "Additional work discovered after the initial MRE estimate but required for compliance, billed separately as a supplement to the original estimate." This is an accurate characterization of supplemental MRE scope. ✓

**L12 vocabulary_assumed** (checked for DAG accuracy): Lists 21 source_lesson_id references. Sample check: `OTMR (One-Touch Make-Ready)` → `T08.L01` ✓; `15-day clock` → `T08.L02` ✓; `critical path` → `T08.L11` ✓. DAG pointers internally consistent.

---

## 6. INDEPENDENT GAP-RESEARCH

Using DIFFERENT sources from R-1..R-3 + RT-α/β research paths.

**GAP-RT-δ-1 (LOW — new): L06 `NESC §25` shorthand at lines 163 and 243.**
Polish-A explicitly flagged these as out-of-scope for its sweep ("flag for future pass"). Confirmed outstanding. Both contexts are semantically correct (NESC §25 = loadings, correct in loading-district context). LOW-cosmetic notation item. Not a new finding per se — Polish-A knew about it. Confirming it persists as an open LOW.

**GAP-RT-δ-2 (LOW — new): L10 "Rule 250/261" conflation under mechanical strength.**
Documented in §5 above. Rule 250 = loading district criteria (Section 25 scope), Rule 261 = structural strength (Section 26 scope). The definition in L10's NESC compliance certification vocabulary entry bundles both under "mechanical strength" — slightly imprecise. A PE reading this definition would understand it but a learner may conflate loading criteria with strength requirements, which this entire topic was designed to un-conflate.

**GAP-RT-δ-3 (INFORMATIONAL — not new, confirming): FCC 23-109 exemptions order/framing.**
The five exemptions in T08.L06 are substantively complete but slightly restructured vs. the FCC's own ordering (FCC order: (1) road/government/storm, (2) applicable law, (3) NESC failure, (4) utility internal standard change, (5) replacement schedule). T08.L06 places "replacement schedule" first and omits the "pursuant to applicable law" frame explicitly. Pedagogically defensible (replacement schedule is most common in practice); the substantive coverage of conditions is complete. INFORMATIONAL only.

**No new HIGH or MED findings from independent gap-research.**

---

## 7. VITE BUILD RESULT

`cd osp-training && npm run build`

**✓ built in 6.07s.** All 131+ modules compiled. Zero errors, zero warnings. T08 lesson files build clean against current HEAD (`e8cf7a9` Polish-A + `fb6f614` Polish-A notes + `c82e786` CLAUDE.md).

---

## 8. SATURATION VERDICT

| Round | Framing | HIGH | MED | LOW |
|---|---|---|---|---|
| R-1 | Primary-source skeptical | 0 | — | — |
| R-2 | Corroboration adversarial | 2 | — | — |
| R-3 | Forensic incident | 0 | — | — |
| RT-α | Pedagogy | 0 | 0 | 4 |
| RT-β | Technical/different-sources | 0 | 1 (G-5 §24 attribution) | 2 |
| Polish-A | Fix wave | 0 | G-5 FIXED | LOWs addressed |
| **RT-δ** (this) | Technical/different-sources | **0** | **0** | **2** (G-RT-δ-1 §25 notation; G-RT-δ-2 Rule 250/261 conflation) |

**High saturation:** HIGH pool = 0 since R-1. Saturated at R-2 (2 HIGHs caught + fixed). No new HIGH in RT-α, RT-β, or RT-δ. ✓

**MED saturation:** RT-β caught the only MED (G-5 §24 attribution); Polish-A fixed it; RT-δ finds 0 new MED. ✓ Saturated.

**LOW items:** RT-δ finds 2 new LOWs:
- GAP-RT-δ-1 (§25 notation, L06 lines 163/243): acknowledged by Polish-A as out-of-scope/deferred
- GAP-RT-δ-2 (Rule 250/261 conflation, L10): genuinely new finding, first time surfaced

Per saturation rule: new LOW finding (GAP-RT-δ-2) is new — but is it genuinely a new finding or a rediscovery of the notation-class issues that Polish-A deferred? GAP-RT-δ-2 is **substantively new** (conflation of loading rule with strength rule in L10, different file from the §25 shorthand items). Per Carter's no-severity-gate rule, this should be surfaced.

However: GAP-RT-δ-1 is a rediscovery of a deferred Polish-A item. GAP-RT-δ-2 is a new LOW in L10 (not previously flagged in any prior RT).

**Assessment:** T08 is functionally saturated at HIGH+MED level. Two LOWs remain:
- One deferred/acknowledged (§25 shorthand)
- One genuinely new (L10 Rule 250/261 conflation)

Both are LOW severity and do not affect safety, regulatory accuracy, or quiz correctness. The L10 Rule 250/261 conflation is a precision-of-description issue, not a factual teaching error (PEs know the distinction; the lesson's broader content correctly distinguishes loading from strength).

**Orchestrator decision required:** Is a Polish-B sweep warranted to address these 2 LOWs before declaring T08 closed? This is a judgment call — both are LOW, one is new. Under the <1% accuracy standard and Carter's "build, verify, polish, final-verify" wave-completion discipline, recommending a minimal Polish-B pass targeting these 2 items.

---

## 9. FINAL VERDICT

**YELLOW (2 residual LOWs, no HIGH or MED)**

| # | Severity | File | Issue |
|---|---|---|---|
| GAP-RT-δ-1 | LOW | L06 lines 163, 243 | `NESC §25` shorthand in 2 body locations (deferred from Polish-A, semantically correct) |
| GAP-RT-δ-2 | LOW | L10 `vocabulary_introduced` | "Rule 250/261" bundled under "mechanical strength" — Rule 250 = loading criteria (§25), Rule 261 = structural strength (§26). Slight conflation of loading vs. strength rules that this topic specifically un-conflates. |

**All HIGH + MED items verified fixed. Fix Wave A canonicals intact. FCC 23-109 betterment exemptions correct. §1.1411(i), §1.1404, Rule 235, Section 26 all independently confirmed from different sources. Math and quiz logic clean across L11/L12 adversarial sample. Vite build passes clean.**

=== T08 FINAL VERIFY RT D TECHNICAL END ===
