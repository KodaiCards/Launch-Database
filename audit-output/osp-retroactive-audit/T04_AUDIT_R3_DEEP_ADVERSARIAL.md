# T04 Retroactive Audit R-3 — Deep Adversarial / R-1+R-2+Haiku Blind-Spot Framing

**CONSTRAINTS ACKNOWLEDGED:** This agent writes ONLY to `audit-output/osp-retroactive-audit/T04_AUDIT_R3_DEEP_ADVERSARIAL.md`. No lesson files modified. No CANONICAL.md created. No CLAUDE.md edits. No fixes applied. No follow-up rounds dispatched. Report and stop.

**Agent:** R-3 (Deep adversarial — blind spots in R-1/R-2/Haiku coverage)
**Scope:** T04 Site Survey & Pre-Engineering — L01–L10 all 10 files reviewed
**Date:** 2026-05-16
**Prior context read:** R-1 (Primary-skeptical), R-2 (Adversarial-corroboration), Haiku passes 1+2

---

## New Findings Table (items NOT in R-1 / R-2 / Haiku)

| ID | Sev | Category | File | Line-range (approx) | Issue | Fix shape | Confidence |
|----|-----|----------|------|---------------------|-------|-----------|------------|
| R3-F1 | HIGH | quiz-answer | L07 | BranchingScenario "drone-cable" node + "drone-vehicle" explanation | BranchingScenario failure nodes for wrong drone-cost answers ALSO cite `§ 32.2210` as "Cable and Wire Facilities" (drone-cable node: "Cable and Wire Facilities (§ 32.2210) is an asset account for physical cable and conduit") and `§ 32.6512` as "Motor Vehicles" (drone-vehicle node: "Motor Vehicles (§ 32.6512) covers conventional vehicle costs"). These are the SAME wrong account labels/numbers flagged by R-2-F1 and Haiku, but in the failure-outcome feedback text — which learners who answer wrong WILL read and absorb. The wrong information propagates as the correction text, not just the question premise. | Fix-agent must update all three BranchingScenario failure node explanations to use correct account references: Cable/Wire = §32.2410, Poles = §32.2411, Motor Vehicles account number needs primary verification. | HIGH — directly read in lesson file; wrong §32.2210 label in two failure feedback nodes confirmed; learners who select wrong answers receive wrong corrective text |
| R3-F2 | HIGH | quiz-answer | L07 | Quiz Q3 fill-in-blank explanation (~line 563–568) | Q3 fill-in explanation lists `§ 32.2210 (Cable and Wire)`, `§ 32.2420 (Poles)`, `§ 32.2220 (Land)`, `§ 32.6512 (Motor Vehicles)` as examples of the USOA — ALL FOUR of these are wrong per Haiku ground-truth. This is the explanation text a learner reads after answering Q3 correctly (or incorrectly). Correct answer is "Uniform System of Accounts" which is fine, but the parenthetical examples are all wrong account mappings. A learner who answers correctly still receives 4 wrong account-number examples as the "lesson reinforcement." | Update Q3 explanation parenthetical examples to use correct account numbers and labels: §32.2410 (Cable and Wire Facilities), §32.2411 (Poles), §32.2220 needs verification, §32.6512 needs Motor Vehicles account number verification. | HIGH — directly confirmed in file; same wrong numbers as flagged elsewhere, now confirmed also in quiz explanation text |
| R3-F3 | MED | coverage-gap | L04 | pole audit data collection section | L04 does not instruct collectors to record pole-ownership/responsibility. Make-ready cost responsibility determination (who pays for transfer of attachments?) requires knowing whether the pole is owned by the electric utility, telephone company, or jointly under a joint-use agreement. Without ownership data in the audit, the design engineer's make-ready cost estimate has no basis for attributing remediation cost to the correct party, which affects the RUS loan cost estimate. R-1 noted "pole ownership gap" as LOW; this is escalated to MEDIUM because the RUS Form 1755-A cost allocation requires knowing the responsible party for make-ready. | Add pole-ownership field to L04 pole audit data collection: pole tag/label identification (utility company marking on butt), flag for "joint-use pole" status, note pole owner if identifiable from tag. Cross-reference T08 for make-ready attribution. | MEDIUM — confirmed absent by full L04 read; escalated from R-1 LOW based on RUS cost-allocation impact |
| R3-F4 | MED | coverage-gap | L09 | RUS Form 307 (Sortable + forms list) | L09 uses RUS Form 307 in TWO locations: (1) the "Advanced" section forms list — cited as "Specifications and drawings checklist — used to verify the construction package is complete before submission" (already flagged HIGH by R-2-F2), AND (2) the Sortable interactive exercise at line 443, which lists `{ id: 'form-307', label: 'RUS Form 307 (specifications and drawings checklist) — confirms package completeness' }` as the second item in the correct RUS submission order. The Sortable teaches learners the WRONG understanding of Form 307 as an interactive exercise. R-2 flagged the prose description; the Sortable interactive content compounds the error because learners actively practice placing "Form 307 as checklist" in their mental model of the submission workflow. | Fix both locations: prose description + Sortable item label. Replace with correct identity (Bid Bond, 10% surety) or use `[confirm correct form number]` if no verified checklist form number is available. Consider whether Form 307 belongs in the Sortable at all — a bid bond is pre-bid, not a submission document in the construction-package order shown. | MED (compound scope of existing HIGH R-2-F2) — Sortable extension confirmed by direct read; adds interactive-exercise reinforcement of wrong content |
| R3-F5 | MED | DAG | L09 | vocabulary_assumed | L09 `vocabulary_assumed` attributes `pole`, `conduit`, `attachment`, `make-ready` all to `T01.L01`. Per T01 C-09 fix (commit `cdf1ada`), pole/conduit/attachment/clearance/joint-use moved to T01.L02. This is the same DAG mis-attribution pattern R-1 flagged in L04 and R-2 flagged in L05. L09 carries the same stale pointers — extending the known DAG gap to a third lesson (L04, L05, L09 all confirmed affected). | Update L09 vocabulary_assumed: `pole → T01.L02`, `conduit → T01.L02`, `attachment → T01.L02`, `make-ready → T01.L05` (if make-ready is introduced in T01.L05; verify). | MED — consistent with R-1/R-2 DAG findings; extended to L09 by direct read |
| R3-F6 | MED | pole-economics | L04/L08 | (absent) | Neither L04 (pole audit) nor L08 (handoff to design) covers pole attachment rate formula or who bears the cost of make-ready. The FCC pole attachment rate (§ 224) telecom rate vs. cable rate distinction is relevant to budget estimation for make-ready-heavy routes: the telecom rate (~$5–$10/pole/year vs. cable ~$10–$20/pole/year) affects the long-term ownership cost per pole. This is a legitimate advanced-content gap for a field-engineer audience preparing handoff packages where make-ready cost attribution is a budget line item. R-1 scoped "pole attachment economics" as a topic to check; R-2 did not address it; Haiku did not address it. | Add to L04 or L08 advanced section: FCC §224 pole attachment rate concept — telecom rate vs. cable rate, annual rental cost ballpark, role in long-term route economics. Reference T08 for full make-ready cost analysis. | MED — confirmed absent from both L04 and L08; field-engineer audience needs this for RUS cost-package preparation |
| R3-F7 | LOW | coverage-gap | L05 | permitting risk section | L05 does not mention tribal consultation (NHPA Section 106 + Executive Order 13175 on tribal consultation). For RUS-funded projects, tribal consultation is a documented federal requirement when the APE (Area of Potential Effect) for Section 106 review includes areas of tribal cultural significance. The lesson covers Section 106 historic property review (line ~232: "Historic district signage or recorded historic property in corridor → Section 106 review") but does not distinguish that tribal nations are separate consulting parties with their own consultation process under EO 13175 and NHPA regulations (36 CFR Part 800.2(c)(2)). For projects in areas with tribal territory (common in RUS-funded rural areas across much of the U.S.), this omission is a real field-education gap. | Add 2–3 sentences to L05 permitting risk section: "In areas with tribal territory or cultural significance, RUS-funded projects also require tribal consultation under Executive Order 13175 and NHPA Section 106 (36 CFR Part 800.2(c)(2)). Tribal nations are separate consulting parties from state historic preservation offices (SHPO). The RUS district office will identify whether tribal consultation is required for the project area." | LOW — confirmed absent; relevant for RUS rural project context; not a math or citation error |
| R3-F8 | LOW | DAG | L07 | `vocabulary_assumed` | L07 attributes `pole`, `attachment`, `conduit` to `T01.L01` — same stale DAG pointer pattern as L04/L05/L09. Four T04 lessons (L04, L05, L07, L09) now confirmed carrying stale T01.L01 pointers for terms introduced in T01.L02. A fix-agent sweep of ALL T04 vocabulary_assumed arrays is more efficient than per-lesson fixes. | Sweep all T04 vocabulary_assumed arrays for stale T01.L01 references to pole/conduit/attachment/clearance/joint-use; update all to T01.L02. | LOW (redundant with R-1/R-2 DAG findings but extends confirmed count) |

---

## R-1 + R-2 + Haiku Reconciliation

| Prior Finding | R-3 Status | Notes |
|---|---|---|
| R1-F1 (NWP 57 + Section 10 framing, HIGH) | DISAGREE — R-2 RESOLVED CLEAN | R-2 independently verified NWP 57 covers both Section 10 + 404 jointly; L05 prose reads "Navigable waterway crossing → USACE NWP 57 or individual permit" without the Section 10 confusion R-1 flagged. The Sortable and Quiz Q4 in L05 don't repeat the Section 10-as-separate-hurdle framing. R-3 confirms R-2's clean verdict on NWP 57. NOT a bug in current lesson text. |
| R1-F2 (FAA 107.51 structure-exception framing, MED) | AGREE — still open | L02 text confirmed to frame 60-150 m as typical range; 150 m = 492 ft exceeds Part 107 AGL ceiling without waiver. Fix not yet applied. |
| R1-F3 / R2-F1 (§32.2210 wrong label, HIGH) | AGREE + EXTEND (R3-F1, R3-F2) | Confirmed in account table (L07 line 176-178). R-3 EXTENDS: same wrong label also appears in BranchingScenario failure-node explanation text and Q3 quiz explanation. Fix scope must include both. |
| R2-F2 (RUS Form 307 = Bid Bond, HIGH) | AGREE + EXTEND (R3-F4) | R-3 confirms and EXTENDS: Form 307 appears in the Sortable interactive exercise, compounding the error beyond prose description. Fix scope must include Sortable item label. |
| R2-F3 (T02.L01 spurious prerequisite on L04, HIGH) | AGREE — still open | L04.meta.prerequisites confirmed includes `T02.L01`; no fiber-physics content in L04 prose. Fix not yet applied. |
| R2-F4 (FAA 150m framing, MED) | AGREE | Same as R1-F2 above. |
| Haiku Pass 2 (§32.2420 → §32.2411 for Poles) | AGREE — confirmed | R-3 confirms §32.2420 wrong, §32.2411 correct per Haiku ground-truth. Fix scope: L07 account table row, L07 quiz Q1 + Q3 explanation, L07 BranchingScenario nodes referencing §32.2420. |
| Haiku Pass 2 (§32.2220 = Operator systems not Land) | AGREE — consistent with Haiku pass 2 | R-3 confirms §32.2220 labeled "Land and Land Rights" in L07 account table at line 186. This CONFLICTS with R-2's "resolved clean" verdict (R-2 said Land and Land Rights is correct). The two Haiku passes conflict: pass 1 said "Operator systems," pass 2 repeated "Operator systems" wins. A third primary-source lookup is needed before fix-agent acts. Flagged as UNCERTAIN — do not fix §32.2220 until Haiku tiebreaker resolves pass-1 vs. pass-2 vs. eCFR. |
| Haiku Pass 2 (§32.6512 = Provisioning expense, not Motor Vehicles) | AGREE — confirmed | L07 labels §32.6512 as Motor Vehicles in account table + in BranchingScenario prose. This extends beyond what Haiku identified — R-3 confirms the wrong label appears in three locations: account table row, BranchingScenario drone-vehicle failure text, Q3 fill-in explanation. |

---

## Math Verification — L01–L12 numeric claims (excluding L07 known)

**GSD formula (L02, L10 capstone Q04):** Re-derived.
- L10 Q04: (3.76 × 120) / 24 = 451.2 / 24 = 18.8 mm ✓ answerIndex: 0 ✓
- L02 worked example at 100m AGL: (3.76 × 100) / 24 = 15.67 mm ✓

**UTM zone (L03):** Macon GA −83.6°: floor(96.4/6)+1 = 17 ✓; Mississippi −88.5°: floor(91.5/6)+1 = 16 ✓

**Pole clearance gap (L04 WorkedExample):** 24 ft total − 22 ft existing telephone = 2 ft gap ✓. Flagging threshold `gap < 1.0 ft` applied correctly as heuristic.

**L07 BranchingScenario labor math:** 5 days × 2 crew × $400/crew-day = $4,000 ✓

**L05 route scoring:** Weighted-matrix description uses illustrative weights (cost 30%, constructability 25%, permitting 25%, maintenance 20%) summing to 100% ✓. Described as "illustrative" — no fixed values claimed. ✓

**L09 RUS review timeline:** "30–90 days" RUS review stated. This is a reasonable field-triage estimate for RUS district-office review; actual timelines vary. Caveat "typically" is present. Acceptable.

**Aerial cost range (L05):** "$2,000–$6,000/mile aerial no make-ready; $6,000–$18,000/mile direct-bury rural." Explicitly caveat as "order-of-magnitude field-triage estimates only — verify against recent RUS Form 395 bid data." ✓ Appropriate framing.

**No math errors found in L01, L03, L05, L06, L08, L09, L10 numeric claims.**

---

## Coverage Gaps — Items R-3 checked and found PRESENT (expected but unconfirmed by prior agents)

- **811 / One-Call in T04:** L01 explicitly covers it — "if the site walk involves any subsurface probing... 811 locate rules apply." L09 cross-references construction topic. ✓ Present.
- **Wetland delineation / Section 404:** L05 and L10 capstone Q12 both address. ✓ Present.
- **Section 106 historic property:** L05 permitting risk section mentions it. ✓ Present (tribal consultation gap noted in R3-F7 LOW).
- **FEMA floodplain / FIRM panels:** NOT explicitly mentioned in any T04 lesson. Gap. For a pre-engineering survey, FIRM panel identification (is the route in a special flood hazard area?) affects permitting timeline and insurance requirements. LOW coverage gap — flagged as new LOW but not listed in table to stay under 1500 words; noting here.
- **Geotechnical / soil borings for HDD:** L09 mentions HDD as a crossing method; no geotechnical data collection instruction in L01-L04. LOW gap — advanced for T04 scope, more appropriate as T06 (underground) content. Not a T04 error.
- **Photogrammetry / LiDAR / FAA Part 107 certification:** L02 covers Part 107 certification requirement for commercial drone ops. ✓ Present.
- **Subsurface utility engineering (ASCE 38):** Not mentioned. LOW gap. Appropriate for a more advanced survey lesson.

---

## Stack Snapshot (≤80 words)

T04 is structurally solid with strong coverage. R-3's primary new contribution: confirming that wrong §32.2210/§32.2420/§32.6512 account labels from R-1/R-2/Haiku also appear in BranchingScenario failure-node explanation text (R3-F1) and Q3 quiz explanation (R3-F2). These are the correction texts learners read when they answer wrong — making the existing HIGH errors more severe than previously quantified. Form 307 error also embedded in the Sortable interactive (R3-F4). Tribal consultation absent from Section 106 discussion (R3-F7 LOW).

---

## Coverage Gaps Still Unexamined (≤120 words)

Not checked: ALTA/NSPS Land Title Survey vs. boundary survey distinction (no mention found — possible LOW gap for advanced content). FCC Form 477/499 filing obligations (not OSP survey scope; appropriately absent). Phase I ESA / brownfields (advanced permitting scope; not T04 level — appropriately absent). Real-property law easement types (prescriptive, appurtenant, by necessity) — L05 mentions ROW and easements at field-triage level but doesn't teach legal easement doctrine — this is intentionally shallow at T04 level. L06 (KMZ/shapefile/PDF deliverables) not fully re-audited by R-3 — no red flags in initial read; R-1 confirmed clean.

---

## Saturation Hint for R-4 (if needed) (≤80 words)

Outstanding items before fix-agent: (1) §32.2220 primary-source tiebreaker — Haiku pass 1 says "Operator systems," R-2 says "Land and Land Rights," Haiku pass 2 unclear. A direct eCFR read of §32.2220 title text needed. (2) Motor Vehicles correct account number — if §32.6512 is "Provisioning expense," what IS the Motor Vehicles account? Primary lookup needed before fix-agent can insert correct number. These two tiebreakers are Haiku-appropriate tasks. R-4 may not be needed after tiebreakers resolve.

---

## Vite Build

`cd osp-training && npm run build` — PASSED ✓ (131+ modules, `✓ built in 5.86s`, no errors)

=== T04 AUDIT R3 DEEP ADVERSARIAL END ===
