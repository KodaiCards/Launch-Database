# Topic 2 Batch A — Auditor B Report (Adversarial Field Expert Lens)

**Date:** 2026-05-14
**Auditor framing:** Senior OSP splicer/foreman — 20+ years Fujikura/Sumitomo/AFL field experience. BICSI OSP-DRD cert prep. Bar: could a learner reading this make a wrong call on my crew that breaks a closure, wastes a ribbon, or fails an OTDR test?
**Scope:** `content/osp-splice-termination/01–04-*.md`

---

## Stack Snapshot

Four lessons covering cleaving through mass-fusion — roughly the first half-day of a real splicing job. I hunted for plausibility traps (specs right on paper, wrong in field reality), outdated practices, vendor-feature claims presented as standards, critical field gotchas absent from the content, and "right answer / wrong reason" quiz constructs. The content is technically competent overall; the issues cluster around loss-budget framing, a significant omission on splice-vs-joint loss, and one material plausibility trap in the cleave-angle table.

---

## Findings Table

| # | Severity | Category | File | Line Range | Snippet | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|---|
| B1 | HIGH | Gotcha-missed | `02-fusion-splicing-i.md` | 82–116 | "splice loss budget accounts for the cumulative attenuation contribution of all fusion splices… separate from the cable's per-kilometer attenuation loss" | Loss budget covers only **splice insertion loss**, not **total joint loss**. A real OSP closure also has connector-to-pigtail or mechanical-splice loss at the closure's fan-out, plus mated-connector loss at FDH and OLT patch panels — all absent. The worked example gives students a false sense that cable + splice = complete link loss. On a real 10GBASE-LR link this could be a 1–2 dB miss depending on connector count. BICSI OSP-DRD explicitly accounts for connector pairs and passive component losses in link budget. A learner who takes this budget formula into a real design and omits connectors will produce a link budget that fails in the field. | Add a "What this budget omits" callout box: connector pairs (typically 2×0.5 dB = 1.0 dB for OLT + FDH), safety margin (3 dB for BICSI OSP-DRD), and bend/splice-tray macro-bend allowance. Reference BICSI OSP-DRD Ch. 7.1 link budget framework. | HIGH |
| B2 | MED | Plausibility trap | `01-cleaving-fundamentals.md` | 57–63 | "Single-fiber fusion (SMF or MMF) ≤ 0.5°" in the cleave angle table | The ≤0.5° threshold is correct for **SMF** but is NOT the same for **50/125 MMF** in the real world. Most Fujikura and Sumitomo splicer MMF programs accept ≤1.0° for MMF-to-MMF splices because MMF has a larger core (50 µm vs. 9 µm) and is far less sensitive to angular misalignment than SMF. Grouping "SMF or MMF" under the same ≤0.5° threshold will cause unnecessary re-cleaves on MMF work and may confuse learners who get auto-accept on a 0.7° MMF cleave. Real splicer programs expose this — the machine will accept what the content says to reject. | Split the table row: SMF ≤0.5°, MMF ≤1.0°, with notes that MMF acceptance varies by splicer program (Fujikura Auto MMF mode, Sumitomo Type-82C MMF program). | HIGH |
| B3 | MED | Vendor-claim-as-standard | `02-fusion-splicing-i.md` | 55 | "Fujikura's automated splice estimation uses a profile alignment system combined with a proprietary arc-power correction loop: the splicer measures electrode gap wear and adjusts arc current automatically" | This is accurate for Fujikura FSM-80S/90F/19S series but is stated as a generic Fujikura characteristic. Not all FSM models have automatic electrode wear compensation — earlier FSM-22S and FSM-11S require the same manual ARC CHECK as Sumitomo. Presenting it as a brand differentiator ("Fujikura auto vs. Sumitomo manual") is a vendor-feature claim that depends on the specific model. A learner who picks up a mid-range FSM-22S expecting auto-compensation will be confused when the manual ARC CHECK is required. | Qualify with "higher-end FSM models (FSM-80S, FSM-90F)" or simply state both brands have models with both approaches and the key habit is to run calibration at the start of each day regardless of model. | MEDIUM |
| B4 | MED | Gotcha-missed | `03-fusion-splicing-ii.md` | 107 | "Re-splice consumes fiber length — 15–25 mm per attempt" | This is the per-attempt cost, but the lesson never tells the student the **minimum remaining fiber length required to re-splice**, nor mentions the concept of a **re-strip window** — once you've stripped and cleaved back far enough, you may expose secondary buffer gel or the buffer tube end, making further prep impossible without repositioning the closure. On direct-bury OSP cable in a vault, a splicing crew has finite slack — typically 1.5–3 m per port of a closure from the slack coil. The content in L2.1 touches the field decision loop for cleave failures but L2.3 doesn't connect re-splice fiber consumption to the slack management decision. A learner who burns 3–4 re-splices without counting slack will paint themselves into a corner that requires pulling the cable. | Add: "Before attempting a re-splice, confirm minimum 50–60 mm of prepared length remains (20 mm for re-strip + 15 mm bare glass + 10 mm for cleave + sleeve margin). If approaching the buffer tube end, the closure must be repositioned before re-splicing." Cross-link to L2.1 field decision loop. | MEDIUM |
| B5 | MED | Outdated practice | `04-mass-fusion-splicing.md` | 51–57 | "UV-cure rollable ribbon (intermittent bond)… between bond points, the ribbon can be 'rolled' into a round cross-section" | The rollable/flexible ribbon construction (Corning EDGE, Sumitomo FlexRibbon, CommScope Fastiva) is currently the dominant ribbon type in new-build OSP deployments — not "a newer ribbon construction." It shipped at scale from ~2018 and is the standard for 3456F and 6912F trunk cables. Describing it as a novelty underweights it for the BICSI cert prep audience. More importantly, the lesson omits a critical field gotcha: rollable ribbon must be **thermally unbonded** (not just physically unrolled) before cleaving, and some construction variants require a brief alcohol soak to soften the intermittent bond points before they will lay flat reliably. Using a standard ribbon cleaver on a partially unrolled rollable ribbon produces hackle and lip failures that look like cleaver problems. | Elevate rollable/flexible ribbon to co-equal status with standard UV-cure ribbon; add a subsection on thermal/solvent unbonding requirement and common failure mode (inconsistent cleave on partially flat ribbon). Reference Corning EDGE and Sumitomo FlexRibbon prep guides. | MEDIUM |
| B6 | LOW | Gotcha-missed | `01-cleaving-fundamentals.md` | 76–77 | "Corrective action: Index the blade to a fresh position; re-clean the fiber with isopropyl alcohol (IPA) on lint-free wipes; verify tension setting matches fiber type." | Hackle corrective actions list "index blade" and "re-clean" but omit the field timing constraint: if the fiber has been sitting exposed for >30–60 seconds in a humid or dusty environment after cleaning, it re-contaminates from ambient moisture condensation. The correct protocol is clean → cleave immediately (within ~30 sec). Content later mentions "do not re-contact" (L2.3 line ~134) but L2.1 does not establish this timing discipline at the cleave step. A learner will clean, diagnose hackle, index blade, then forget to re-clean if they spent 2 minutes troubleshooting. | Add to hackle corrective action: "Re-clean immediately before the next cleave attempt — do not allow >30 seconds between cleaning and inserting into the cleaver, especially in humid or cold conditions where moisture condensation is a risk." | LOW |
| B7 | LOW | Wrong-reason | `02-fusion-splicing-i.md` | 261–270 | Q4 option B rationale: "3 µm offset is consistent with the core eccentricity specification for OS2 SMF (≤0.6 µm) plus the mechanical tolerance of the v-groove system" | The math here is suspicious. OS2 core eccentricity is ≤0.6 µm, and v-groove positioning tolerance is typically ≤1 µm for a well-maintained fixture. These stack to maybe 1.5–2 µm worst case, not 3 µm. A 3 µm offset in a cladding-aligned splicer is more likely explained by a worn or contaminated v-groove (groove walls worn out of tolerance) or a fiber with atypically high cladding OD variation — not the nominal specification. The quiz answer is correct (cladding alignment is the cause) but the rationale understates v-groove wear as a contributor and gives the impression that 3 µm is within the expected tolerance band of cladding alignment, which it is not for a properly maintained splicer. | Revise rationale to acknowledge 3 µm is toward the high end for cladding alignment; mention groove wear or contamination as likely contributors alongside the nominal eccentricity spec. | LOW |
| B8 | LOW | Parity-drift | `04-mass-fusion-splicing.md` | 83–91 | Arc parameter differences section cites only Fujikura FSM-60R Manual §4.2 for temperature gradient effect; Sumitomo Type-71M+ cited for other arc topics | The temperature gradient effect explanation mentions it cannot be "entirely eliminated" by the manufacturer's arc profile. Sumitomo's Type-71M+ uses a different electrode geometry than Fujikura's FSM-60R series (longer electrodes with slightly different spacing) and its gradient profile is not identical. The content treats it as a universal law cited only to Fujikura; Sumitomo's manual should be co-cited to confirm the same behavior, or the claim should be framed as applying "across all ribbon splicers, per each manufacturer's documentation." | Add Sumitomo Type-71M+ Guide, §3.3 as co-citation on the temperature gradient paragraph. | LOW |

---

## Negative Findings (Checked and Clean)

**Lesson 2.1:**
- Cleave angle thresholds for SMF single-fiber fusion (≤0.5°), ribbon (≤1.0°), mechanical (≤1.5°): correct except the MMF grouping issue (B2 above); SMF values are accurate.
- Four failure modes (hackle, mist, lip, angle error) and their root causes: field-accurate and correctly differentiated.
- Blade rotation counter concept and typical range (4,000–16,000): range is plausible and consistent across models.
- Pre-closure blade math (Q3, 15,800/16,000, 24-splice closure needing 48–80 cleave cycles): conservative and correct. Replacing before the closure is absolutely the right call.
- Field decision loop for last-workable fiber length: correctly sequenced and safe advice.

**Lesson 2.2:**
- Fusion splice cycle phases (prefuse, main arc, cool-down): correct sequence and correct physics.
- Altitude arc current direction (reduce at altitude, not increase): correct — a common field confusion, and the lesson gets it right.
- PAS vs. LID vs. cladding alignment differentiation: accurate. LID use case (specialty fibers) is appropriate.
- Estimated loss systematically underestimates OTDR-measured loss: factually correct, explained well.
- Loss budget arithmetic in worked examples: all calculations verified correct.

**Lesson 2.3:**
- Re-arc eligibility criteria and contraindications: correct and complete (one re-arc max, no defects, marginally elevated loss only).
- Bubble behavior (cannot anneal out at service temperatures): correct — silica service temps are nowhere near 1900°C.
- Splice protection sleeve cooling rationale (prevents bend-set during solidification): accurate and important.
- QA decision tree logic: branches are correct and consistent.
- Dopant diffusion as the invisible contributor to estimated vs. OTDR gap: accurate.

**Lesson 2.4:**
- ANSI/TIA-598-D 12-color fiber sequence: Blue through Aqua (positions 1–12) is correct.
- Ribbon preparation sequence (strip matrix → strip coatings → clean → cleave → load → splice): correct and mandatory order well-explained.
- Mass-fusion loss range (0.05–0.15 dB per fiber): realistic, consistent with field experience.
- Cycle time table and math (288F, 432F, 576F scenarios): all arithmetic correct.
- Thermal-cure matrix chemical removal (methylene chloride or aqueous flux): correct, safety note (gloves, ventilation) present.

---

## Coverage Gaps

1. **Connector and passive component loss** — not in scope for these four lessons but the loss budget in L2.2 teaches an incomplete framework without flagging what it omits. Flagged as B1.
2. **OTDR directional averaging for splice loss verification** — not covered until Lessons 2.10/2.12 (Batch B scope). Appropriate deferral, but no forward cross-reference from L2.2 loss budget section to the OTDR lesson.
3. **Specific rollable ribbon products and volumes** — covered at a product category level; specific prep variations for Corning EDGE vs. Sumitomo FlexRibbon vs. CommScope Fastiva not distinguished. Flagged as B5.
4. **Mechanical splice interaction** — out of scope for these lessons (L2.5 covers it); the ≤1.5° mechanical threshold in L2.1 is the only touchpoint here.
5. **Bend radius at splice zone** — the sleeve cooling section in L2.3 mentions bend risk but the content doesn't quantify minimum bend radius for a sleeved splice. Lesson 2.7 (Splice Trays) is the right location for that; appropriate deferral.

---

=== TOPIC 2 BATCH A AUDITOR B END ===

---

## Comparison with Auditor A (Content Verification Agent)

Auditor A used a math/citation/consistency framing — primarily verifying internal arithmetic, cross-lesson number coherence, and citation scope. My framing was adversarial field reality — hunting for plausibility failures, field gotchas, and vendor-claim-as-standard issues.

**Overlap:**
- **F1 (Auditor A) / B1 (me) — Loss budget framing:** Auditor A flagged the "67% of margin" calculation as logically inverted (denominator issue). I flagged the budget as fundamentally incomplete (missing connectors, safety margin). These are different problems on the same section and both are real. Together they constitute a HIGH severity composite — the loss budget section teaches incomplete loss analysis AND uses a confusing margin framing.
- **F2 (Auditor A) — IEC 61300-3-35 citation scope:** Auditor A flagged IEC 61300-3-35 as a connector standard misapplied to cleave angle criteria. I noted the same standard but did not escalate it independently — I agree with Auditor A's finding, and the severity (LOW) is appropriate.

**Non-overlapping findings (mine only):**
- **B2 (HIGH):** MMF cleave angle grouped with SMF at ≤0.5° — a plausibility trap that will produce wrong field decisions. Auditor A did not flag this.
- **B3 (MED):** Fujikura auto arc-compensation presented as a brand characteristic, when it is model-specific. Auditor A did not flag this.
- **B4 (MED):** Re-splice fiber consumption not connected to slack management / minimum prep length. Auditor A did not flag this.
- **B5 (MED):** Rollable/flexible ribbon described as "newer" when it's the current production standard; prep gotcha (thermal unbonding) omitted. Auditor A did not flag this.
- **B6 (LOW):** Clean-before-cleave timing discipline not stated in L2.1. Auditor A did not flag this.
- **B7 (LOW):** Q4 option B rationale underestimates groove wear contribution to 3 µm offset. Auditor A did not flag this.
- **B8 (LOW):** Temperature gradient effect cited only to Fujikura; Sumitomo co-citation missing. Auditor A flagged a different vendor-parity issue (F4: flashcard Card 4 missing Sumitomo citation) which is a subset of the same pattern but on a different finding.

**Auditor A findings not raised by me (F3, F4):**
- F3 (re-arc upper bound ambiguity in L2.3 body): I noticed the same ambiguity but treated it as minor given the Pulse 1 answer clarifies it. Auditor A's LOW severity is appropriate.
- F4 (flashcard Card 4 Sumitomo citation missing): correct catch; I found the same pattern manifesting differently (B8).

**Summary:** Auditor A found 4 items (1 MED, 3 LOW). I found 8 items (2 HIGH, 3 MED, 3 LOW). The two HIGH items I found (B1 — incomplete loss budget, B2 — MMF cleave angle misclassification) are not in Auditor A's report and are, in my judgment, the most consequential issues in the batch. The loss budget omission (B1) reinforces Auditor A's F1 — together they make a strong case that the entire L2.2 loss budget section needs a rewrite.
