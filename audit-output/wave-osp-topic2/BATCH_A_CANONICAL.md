# Topic 2 Batch A — Canonical Findings (Red Team Verification)

**Date:** 2026-05-14
**Role:** Red Team Verification (Step 4 of 6) — Read-only independent eyes
**Branch:** claude/debug-previous-issues-MoN9D
**Source:** BATCH_A_PEER_REVIEW.md (10 unique findings C1–C10); independently verified against source files

---

## Stack Snapshot

Verified all 10 peer-reviewed findings by opening cited line ranges independently. Four lessons (~1,264 lines total). Two HIGHs both confirmed at elevated severity — the MMF cleave-angle plausibility trap (C1) and the composite loss-budget math+framing gap (C2) are the most consequential items. Six lower-tier items all confirmed. Zero false positives. One severity adjustment: C7 (re-arc upper-bound ambiguity) upgraded from LOW to MEDIUM — the inconsistency between body text and decision-tree label is materially confusing in a procedural lesson, not merely a minor gap.

---

## Canonical Findings Table

| # | Source | Severity (FINAL) | Category | Lesson | Location | Issue | Red Team Status | Red Team Note |
|---|---|---|---|---|---|---|---|---|
| C1 | B2 | HIGH | Plausibility trap | 2.1 | `01-cleaving-fundamentals.md` line 61 | Table groups SMF and MMF under single ≤0.5° threshold; MMF programs on real splicers accept ≤1.0°; a learner will be instructed to re-cleave a 0.7° MMF result that the machine auto-accepts | VERIFIED | Confirmed at line 61: "Single-fiber fusion (SMF or MMF) ≤ 0.5°" — one row, no fiber-type split. Q1 (line 179) is framed on OS2 SMF only so does not compound the error, but the table + Key Terms entry (line 120) both carry the wrong grouping. Wrong field action on a common fiber type — HIGH is correct. |
| C2 | A-F1 + B1 | HIGH | Math/Framing + Omission | 2.2 | `02-fusion-splicing-i.md` lines 82–116 | (a) "67% of available margin" uses post-splice remaining margin (1.8 dB) as denominator instead of total headroom (3.0 dB) → should be 40%; (b) worked example presents cable + splice as a complete link budget, omitting connectors, passive components, and safety margin | VERIFIED | Confirmed line 116: "splice loss contribution...consumes **67% of the available margin** (1.8 dB)." Denominator is the post-splice remaining margin, not the headroom. 1.2/3.0 = 40% is the correct framing. The budget section header (line 80) calls it a "splice loss budget" — a learner is not warned it is a partial model. Both sub-issues confirmed real and additive. HIGH composite is correct. |
| C3 | B5 | MEDIUM | Outdated practice | 2.4 | `04-mass-fusion-splicing.md` lines 51–57 | Rollable ribbon described as "a newer ribbon construction" — it has been production standard since ~2018; thermal/solvent unbonding requirement before cleaving not mentioned | VERIFIED | Confirmed line 55: "A newer ribbon construction where the fibers are bonded at intervals…" — no qualification that this is now the dominant production type. No mention of thermal unbonding requirement. The omission of the unbonding gotcha is a field-consequential gap beyond just currency language. MEDIUM confirmed. |
| C4 | B3 | MEDIUM | Vendor-claim-as-standard | 2.2 | `02-fusion-splicing-i.md` line 55 | Fujikura automatic arc-power correction loop presented as a generic Fujikura characteristic; applies to higher-end FSM models only — FSM-22S (specifically named in L2.2 line 61) requires the same manual ARC CHECK as Sumitomo | VERIFIED | Confirmed line 55: "the splicer measures electrode gap wear and adjusts arc current automatically" — no model qualification. The FSM-22S is named as the example PAS splicer at line 61 in the same lesson. A learner using the FSM-22S will be confused when auto-compensation is absent. MEDIUM confirmed. |
| C5 | B4 | MEDIUM | Gotcha-missed | 2.3 | `03-fusion-splicing-ii.md` line 107 | Re-splice section states "15–25 mm per attempt" but gives no minimum remaining prep length or re-strip window; learner has no decision criterion for when to stop re-splicing | VERIFIED | Confirmed line 107: "Re-splice consumes fiber length — 15–25 mm per attempt — and the technician must confirm sufficient slack coil remains." The alternate-branch text at line 212 adds "minimum 20 mm additional from each fiber side after sleeve removal" but this only appears in the worked example, not the main procedure. The body definition of re-splice has no numeric floor. Gap is real. MEDIUM confirmed. |
| C6 | A-F2 | MEDIUM | Citation scope | 2.1 | `01-cleaving-fundamentals.md` lines 55, 120, 147–148 | IEC 61300-3-35 used as primary authority for cleave-angle loss physics (line 55) and cleave-angle acceptance criteria (line 120); the Key Terms entry (line 147) defines it as governing both fusion splice acceptance AND connector end-face inspection, conflating the two domains | VERIFIED-SEVERITY-UP | Confirmed line 55: IEC 61300-3-35 §4.1 is the primary citation for the claim that "fusion splice loss increases approximately as the square of angular misalignment." Line 147: Key Terms entry defines IEC 61300-3-35 as governing "fiber end-face geometry...as used in fusion splice acceptance and connector end-face inspection" — baking the conflation into the glossary. The standard's actual scope is connector end-face inspection; its use as primary authority for cleave-angle physics is a meaningful pedagogical error. Upgrading to MEDIUM (peer review already assigned MEDIUM; confirming that is correct — not elevating further to HIGH since it is a citation scope issue, not a wrong field action). |
| C7 | A-F3 | MEDIUM | Cross-lesson consistency | 2.2/2.3 | `02-fusion-splicing-i.md` ~49; `03-fusion-splicing-ii.md` lines 92, 105 | Re-arc eligibility range "0.10–0.20 dB" appears in body text (line 105) and decision tree box label (line 92), but the decision-tree branch trigger is simply "Loss > threshold" — no upper bound visible on the branching logic; Q1 rationale (line 236) explicitly states the range is "typical working guidance, not a hard trigger threshold," which contradicts the body text's implied ceiling | VERIFIED-SEVERITY-UP | Confirmed: decision tree at line 92 labels the re-arc branch "marginally high (0.10–0.20)" — the range IS in the tree label. However Q1 rationale at line 236 says "there is no '>0.20 dB' minimum threshold for re-arc eligibility" and the range is "typical working guidance, not a hard trigger threshold." This directly contradicts what the body text and tree imply. A learner who read the body text (0.10–0.20 is the re-arc range) and then the quiz rationale (the range is not a hard threshold) will be confused about the upper-bound rule. Upgrading to MEDIUM — this is an internal contradiction in the lesson, not just ambiguity. |
| C8 | B6 | LOW | Gotcha-missed | 2.1 | `01-cleaving-fundamentals.md` lines 76–77 | Hackle corrective action omits the clean-then-cleave timing constraint; L2.3 line 134 mentions "do not re-contact" but only after splice, not at cleave step | VERIFIED | Confirmed lines 76–77: hackle corrective actions list "Index the blade to a fresh position; re-clean the fiber with isopropyl alcohol (IPA) on lint-free wipes; verify tension setting matches fiber type." No timing discipline stated. L2.3 line 134 covers post-cleave contamination (before loading splicer), not the pre-cleave timing window. Gap is real and field-consequential in humid OSP. LOW confirmed. |
| C9 | B7 | LOW | Wrong-reason | 2.2 | `02-fusion-splicing-i.md` line 268 | Q4 option B rationale states 3 µm core offset is "consistent with core eccentricity spec (≤0.6 µm) plus mechanical tolerance of the v-groove system" — math stacks to ~1.5 µm, not 3 µm; correct answer but rationale normalizes a high-offset reading | VERIFIED | Confirmed line 268 verbatim. The correct answer (cladding alignment causes core offset) is right, but the rationale implies 3 µm is within normal expected tolerance of a cladding-aligned splicer. 0.6 µm eccentricity + ~1 µm v-groove tolerance = ~1.5 µm worst case. 3 µm implies worn/contaminated groove or extreme eccentricity. The rationale teaches learners that 3 µm is unremarkable, which is misleading for maintenance decisions. LOW confirmed. |
| C10 | A-F4 + B8 | LOW | Vendor parity / citation | 2.1, 2.4 | `01-cleaving-fundamentals.md` line 167; `04-mass-fusion-splicing.md` line 91 | (a) Flashcard Card 4 cites only Fujikura CT-30A for blade rotation mechanism (Sumitomo FC-6S missing); (b) Temperature gradient effect at L2.4 line 91 cites only Fujikura FSM-60R Manual — Sumitomo Type-71M+ should be co-cited | VERIFIED | Confirmed Card 4 (line 167): "[Fujikura CT-30A Manual, §5.1]" — only one vendor cited. Key Terms at line 132 correctly co-cites both vendors ("Fujikura CT-30A Manual, §5.1; Sumitomo FC-6S Guide, §4.3") for blade rotation counter — the flashcard is inconsistent with the key terms section on the same topic. L2.4 line 91 confirmed: Fujikura FSM-60R only cited for temperature gradient effect. Sumitomo Type-71M+ is cited elsewhere in the same section (line 85). LOW confirmed; two sub-items for fix. |

---

## Severity Adjustments from Peer Review

| Item | Peer Severity | Final Severity | Reason |
|---|---|---|---|
| C7 | LOW | MEDIUM | Internal contradiction between body text (0.10–0.20 dB is the re-arc range) and Q1 rationale (range is not a hard threshold) — this is an active conflict that will confuse learners, not just ambiguity |

---

## Rejected Findings

None. All 10 peer-reviewed findings confirmed as real. Zero false positives.

---

## Negative-Finding Spot-Checks

**Spot-check 1 — L2.1 Q1 SMF-specific framing (Auditor A confirmed clean)**
Verified: Q1 (line 179) presents a 0.7° angle on "OS2 SMF fiber" specifically — the question does not create an MMF cleave angle teaching moment and does not compound C1. The quiz is clean for this check. The problem is isolated to the table (line 61) and Key Terms (line 120).

**Spot-check 2 — L2.2 loss budget arithmetic (both auditors confirmed clean)**
Verified independently: 24 km × 0.4 dB/km = 9.6 dB; 12 × 0.10 dB = 1.2 dB; total 10.8 dB; margin vs. 12.6 dB = 1.8 dB. All correct. The C2 issue is the *framing* of 1.8 dB as the denominator for the percentage, not an arithmetic error. Confirmed clean.

**Spot-check 3 — L2.4 cycle time math (Auditor A confirmed clean)**
Verified: Q4 (line 260): 432 ÷ 12 = 36 cycles × 10 min = 360 min — correct. Pulse 3 (line 302): 576 ÷ 12 = 48 cycles × 9 min = 432 min — correct. Comparison table (line 136–137): 24 ribbons × 10 min = 240 min; 288 fibers × 4.5 min = 1,296 min — confirmed correct. Clean.

**Spot-check 4 — L2.3 re-arc contraindications (Auditor B confirmed clean)**
Verified: body text at line 105 lists four contraindications — visible core offset, bubble, defective end-face, already received one re-arc. Key Terms at line 150 consistent. Quiz Q3 (line 256) tests the bubble contraindication correctly. The contraindications themselves are clean; the C7 issue is only the upper-bound threshold for the eligible range, not the contraindications list.

**Spot-check 5 — L2.2 PAS description (Auditor B confirmed clean)**
Verified line 61: PAS description is accurate — CCD camera, dual-axis, motorized v-groove stages, works on SMF/MMF/ribbon. Loss performance claim (0.02–0.05 dB for SMF OS2) is consistent with industry data. Clean.

---

## Fix-Agent Dispatch Readiness

### HIGH tier — 1 commit
- **C1:** Split cleave angle table row 61 into SMF (≤0.5°) and MMF (≤1.0°). Update Key Terms "Cleave angle" entry at line 120. Verify no quiz question uses a scenario where the MMF/SMF grouping matters.
- **C2:** (a) Replace "67% of the available margin (1.8 dB)" with "40% of the available headroom (3.0 dB)" at line 116. (b) Add a "What this budget omits" callout box after the worked example (connectors, safety margin, passive components; reference BICSI OSP-DRD Ch. 7.1).

### MED tier — 1 commit
- **C3:** Revise line 55 rollable ribbon description — remove "newer" framing, elevate to current production standard; add thermal/solvent unbonding requirement before cleaving.
- **C4:** Qualify line 55 auto arc-correction to "higher-end FSM models (FSM-80S, FSM-90F)" and note FSM-22S requires manual ARC CHECK like Sumitomo.
- **C5:** Add minimum fiber-length threshold to the re-splice body definition at line 107 (minimum ~50–60 mm prepared length; see alternate-branch text at line 212 which already has the 20 mm figure — consolidate).
- **C6:** Demote IEC 61300-3-35 at line 55 from primary citation to supplementary; add parenthetical "(connector end-face geometry; applied by convention to cleave angle criteria)." Update Key Terms entry at line 147 to clarify connector end-face is the standard's primary scope.
- **C7:** Resolve the internal contradiction: either (a) add the upper-bound qualifier to the body text's re-arc definition explicitly and update Q1 rationale to match, OR (b) remove the 0.10–0.20 dB range from the body text and rely on "marginally elevated" only. The worked example at line 193 already uses the range as a checklist criterion — that instance must be consistent with whatever the fix chooses.

### LOW tier — 1 commit or deferral
- **C8:** Add timing constraint to hackle corrective action at lines 76–77: "Re-clean immediately before the next cleave attempt — do not allow >30 seconds between cleaning and inserting the fiber in the cleaver."
- **C9:** Revise Q4 option B rationale at line 268: acknowledge 3 µm is toward the high end for cladding alignment; flag groove wear or contamination as the likely explanation alongside the nominal eccentricity spec.
- **C10:** (a) Add "Sumitomo FC-6S Guide, §4.3" to Flashcard Card 4 citation at line 167. (b) Add "Sumitomo Type-71M+ Guide, §3.3" as co-citation for temperature gradient at line 91 of L2.4.

---

=== TOPIC 2 BATCH A CANONICAL END ===
