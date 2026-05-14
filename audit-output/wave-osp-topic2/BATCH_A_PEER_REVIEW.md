# Topic 2 Batch A — Peer Cross-Check Report

**Date:** 2026-05-14
**Role:** Peer Cross-Check (Step 3 of 6)
**Branch:** claude/debug-previous-issues-MoN9D
**Scope:** Auditor A (math/citation lens, 4 findings) + Auditor B (adversarial field lens, 8 findings)

---

## Stack Snapshot

Read both auditor reports, then independently opened every cited file:line range and read surrounding context. Auditor A and B share one location (L2.2 loss budget) with complementary but non-duplicate problems — kept as composite. Auditor B self-identified the overlap in his comparison section, which aided deduplication. Verified 12 raw findings; 10 survive peer review as unique; 2 are merged as OVERLAP-DIFFERENT-ANGLE on the same section.

---

## Consolidated Findings Table

| # | Source | Severity (final) | Category | Lesson | Location | Issue | Peer Tag | Peer Rationale |
|---|---|---|---|---|---|---|---|---|
| C1 | B2 | HIGH | Plausibility trap | 2.1 | `01-cleaving-fundamentals.md` ~57–63 | Table groups SMF and MMF under single ≤0.5° cleave angle threshold; MMF programs typically accept ≤1.0° — will cause unnecessary re-cleaves and contradict what the splicer auto-accepts on MMF work | AGREE-WITH-UPGRADE | Verified in file: table row reads "Single-fiber fusion (SMF or MMF) ≤ 0.5°"; this IS a plausibility trap — a learner will be told to re-cleave a 0.7° MMF result that the FSM-22S MMF program auto-accepts. Severity should be HIGH, not MED — it generates a wrong field action on a common fiber type |
| C2 | A-F1 + B1 | HIGH | Math/Framing + Omission | 2.2 | `02-fusion-splicing-i.md` ~80–116 | **Composite:** (a) "67% of available margin" uses post-splice remaining margin (1.8 dB) as denominator, producing an inflated risk figure — correct denominator is 3.0 dB headroom (12.6 − 9.6), giving 40%; (b) worked example presents cable + splice as complete link budget, omitting connector pairs, passive components, and safety margin — a learner applying this framework to a real design will underestimate total link loss by 1–3 dB | OVERLAP-DIFFERENT-ANGLE | Both auditors flagged the same section for different, both-valid defects; F1 is the denominator math error, B1 is the framework completeness gap. Neither is a DUPLICATE — they are additive problems in the same paragraph and should be fixed together. Composite HIGH is correct |
| C3 | B5 | MEDIUM | Outdated practice | 2.4 | `04-mass-fusion-splicing.md` ~51–57 | Rollable/flexible ribbon described as "a newer ribbon construction" when it is the current dominant production standard for high-count trunk cables; thermal/solvent unbonding requirement before cleaving is not mentioned — a learner who cleaves a partially unrolled rollable ribbon will get hackle/lip failures misdiagnosed as cleaver problems | AGREE | Verified: file at line ~55 reads "A newer ribbon construction where the fibers are bonded at intervals" — this framing is materially outdated; rollable ribbon has been production standard since ~2018. The thermal unbonding gotcha is a real gap for field work |
| C4 | B3 | MEDIUM | Vendor-claim-as-standard | 2.2 | `02-fusion-splicing-i.md` ~55 | Fujikura automatic arc-power correction loop described as a generic Fujikura characteristic; not all FSM models have this — FSM-22S and FSM-11S require the same manual ARC CHECK as Sumitomo; a learner on a mid-range splicer will be confused when auto-compensation is absent | AGREE | Verified: line ~55 states "the splicer measures electrode gap wear and adjusts arc current automatically" without model qualification. The Fujikura FSM-22S is specifically named in PAS alignment context earlier in the same lesson — a learner will naturally assume auto-compensation applies to that model |
| C5 | B4 | MEDIUM | Gotcha-missed | 2.3 | `03-fusion-splicing-ii.md` ~107 | Re-splice section states "consumes fiber length — 15–25 mm per attempt" but never specifies minimum remaining prep length or re-strip window; learner managing a tight slack coil in a vault has no decision criterion for when to stop re-splicing and reposition the closure | AGREE | Verified: line ~107 does reference "confirm sufficient slack coil remains" but gives no numeric floor. The 15–25 mm consumption figure is present; the minimum-length threshold before resplicing becomes impossible is absent. Gap is real |
| C6 | A-F2 | MEDIUM | Citation scope | 2.1 | `01-cleaving-fundamentals.md` ~55–63, 120–121, 147–148 | IEC 61300-3-35 cited as governing reference for cleave angle thresholds; that standard governs connector end-face geometry, not fusion splice cleave angle criteria — scope mismatch that could confuse learners encountering the standard in other contexts | AGREE-WITH-UPGRADE | Auditor A rated LOW; upgrading to MEDIUM. Verified: table at line ~61 lists "Fujikura FSM-series acceptance criteria; BICSI OSP-DRD Ch. 7.4" as governing refs (not IEC 61300-3-35 directly) but the intro paragraph at ~55 cites "IEC 61300-3-35 §4.1" as the authority for the failure-mode loss estimate. The standard is used as primary support for a claim about fusion splice cleave physics when its actual scope is connector end-face inspection — a meaningful pedagogical mismatch, not merely supplementary citation drift |
| C7 | A-F3 | LOW | Cross-lesson consistency | 2.2/2.3 | `02-fusion-splicing-i.md` ~49; `03-fusion-splicing-ii.md` ~105 | Re-arc eligibility range "0.10–0.20 dB" appears in Pulse 1 answer and re-arc body text but the decision tree branch label is simply "Loss > threshold" without the upper bound; a learner following the tree without reading the rationale text would not know re-arc is inappropriate above ~0.20 dB | AGREE | Verified: line ~105 in L2.3 states "marginally elevated (typically 0.10–0.20 dB)" in the body text — the range IS stated but only in a parenthetical; the decision tree's "Loss > threshold" label does not carry the upper bound. Minor ambiguity; LOW is appropriate |
| C8 | B6 | LOW | Gotcha-missed | 2.1 | `01-cleaving-fundamentals.md` ~76–77 | Hackle corrective action ("index blade, re-clean, verify tension") does not state the clean-then-cleave timing constraint; a learner who spends 2 min troubleshooting between cleaning and cleaving in humid conditions will re-contaminate and get the same result | AGREE | Verified: line ~76–77 lists corrective actions without timing discipline. L2.3 line ~134 mentions "do not re-contact" but that is after splice, not at the cleave step. Gap is real and field-consequential in humid OSP environments; LOW is appropriate |
| C9 | B7 | LOW | Wrong-reason | 2.2 | `02-fusion-splicing-i.md` ~268 | Q4 option B rationale states 3 µm core offset is "consistent with core eccentricity spec (≤0.6 µm) plus v-groove mechanical tolerance" — the math stacks to ~1.5 µm worst case, not 3 µm; correct answer is right but rationale normalizes a high-offset reading rather than flagging groove wear as the likely culprit | AGREE | Verified: line ~268 text confirmed as quoted. Core eccentricity ≤0.6 µm + v-groove tolerance ~1 µm = ~1.5 µm nominal stack; 3 µm implies worn/contaminated groove or atypically eccentric fiber. The rationale teaches learners that 3 µm is within normal expectations for a cladding-aligned splicer, which is misleading |
| C10 | A-F4 + B8 | LOW | Vendor parity / citation | 2.1, 2.4 | `01-cleaving-fundamentals.md` ~165–168; `04-mass-fusion-splicing.md` ~91 | **Related pattern, two instances:** (a) Flashcard Card 4 cites only Fujikura CT-30A for blade rotation mechanism; reading content cites both vendors; (b) Temperature gradient effect in L2.4 cites only Fujikura FSM-60R; Sumitomo co-citation missing for same claim | OVERLAP-DIFFERENT-ANGLE | F4 and B8 flag the same vendor-parity pattern at different locations. Neither is a DUPLICATE (different files, different content). Kept as single row with both sub-items for fix efficiency; each needs its own fix-line |

---

## Disposition Summary

- **Total raw findings: 12** (A: 4, B: 8)
- **After peer review: 10 unique findings** (C1–C10)
  - HIGH: 2 (C1, C2)
  - MEDIUM: 4 (C3, C4, C5, C6)
  - LOW: 4 (C7, C8, C9, C10)
- **DISAGREED (rejected from canonical list): 0** — all findings verified against source files; none false-positive
- **DUPLICATES merged: 0** — Auditor B self-identified F1/B1 overlap correctly; they are OVERLAP-DIFFERENT-ANGLE (complementary problems, same section), not a true duplicate; kept as composite C2
- **Severity adjustments made:**
  - B2 → UPGRADED to HIGH (was MED): wrong field action on a common fiber type is a HIGH-severity instructional error, not merely a plausibility trap
  - A-F2 → UPGRADED to MEDIUM (was LOW): IEC 61300-3-35 is used as the primary loss-physics authority in the intro paragraph, not just a supplementary citation — the scope mismatch is pedagogically meaningful

---

## Recommended Red-Team Focus Areas

1. **C1 (MMF cleave angle threshold):** Open `01-cleaving-fundamentals.md` lines 57–67 and verify whether any other section (quiz, pulse questions, flashcards, key terms) carries the same "SMF or MMF ≤ 0.5°" grouping. If so, those must all be fixed consistently; a partial fix that corrects the table but leaves a quiz distractor using ≤0.5° for MMF would compound the confusion.

2. **C2 (Loss budget composite):** Open `02-fusion-splicing-i.md` lines 80–116 end-to-end. Verify (a) the 67% denominator claim at ~116 independently; (b) whether the introductory framing at ~82 anywhere acknowledges connectors/safety margin are out of scope for this worked example, or whether it presents the two-component model as complete. The fix requires both a math correction and a callout box — confirm both are needed based on the actual text.

3. **C3 (Rollable ribbon currency):** Open `04-mass-fusion-splicing.md` lines 51–57. Confirm "newer ribbon construction" language and check whether any other section in L2.4 (quiz, pulse, key terms) characterizes rollable ribbon as emerging vs. current standard. A quiz question that treats rollable ribbon as niche would also need fixing.

---

=== TOPIC 2 BATCH A PEER REVIEW END ===
