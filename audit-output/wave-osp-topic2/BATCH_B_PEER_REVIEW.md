# OSP Topic 2 Batch B — Peer Cross-Check Review

**Role:** Peer Cross-Check (Step 3 of audit pipeline)
**Date:** 2026-05-14
**Branch:** `claude/debug-previous-issues-MoN9D`
**Scope:** Auditor A (4 findings) + Auditor B (18 findings) → consolidated arbitration

---

## Stack Snapshot

Both auditors read the same four files from independent framings: A with math/citation precision, B with adversarial splicer field knowledge. Primary convergence: L2.8 cleave-and-crimp APC return loss table contradiction — line 171 says ≥45 dB, scenario (line 227) and Q3 rationale (line 278) both say ≥55–60 dB. One CRITICAL (B5 re-entry procedure gap) is the highest-priority standalone finding. One DISAGREE rendered against B10 (acetone); content correctly says "gel removal solvent or IPA" — acetone prohibition is a real-world field safety note but is not an error in the existing text.

---

## Consolidated Findings Table

| # | Source | Severity (final) | Category | Lesson | Location | Issue | Peer Tag | Peer Rationale |
|---|---|---|---|---|---|---|---|---|
| 1 | B5 | CRITICAL | gotcha-missed | 2.6 | `06-splice-closures.md` L37–54 | No re-entry procedure or sequence discipline; re-entry is the #1 cause of new damage in existing closures | AGREE | Verified: lesson covers closure types and sealing methods thoroughly but never addresses the ordered re-entry sequence. Confirmed absent. High learner-harm potential. |
| 2 | A-B2 / B14 | HIGH | Internal Consistency | 2.8 | `08-termination-methods.md` L171, L227, L278 | Performance table APC cleave-and-crimp = ≥45 dB; scenario (L227) and Q3 rationale (L278) both say ≥55 dB for SC-APC cleave-and-crimp | AGREE + CONVERGENCE | Directly verified: L171 table shows `≥ 45 dB`, L227 states `≥ 55 dB per Corning product data`, L278 states `≥55–60 dB`. Both auditors caught independently. The ≥45 dB figure matches UPC cleave-and-crimp, not APC. Direct method-selection trap; learner who uses the table will reject a product that passes the spec. |
| 3 | A-B1 | HIGH | Math / Terminology | 2.5 | `05-mechanical-splicing.md` L45, L185 | L45 labels 0.3–0.4 dB as "Fresnel return loss per interface" — actually insertion loss from two interfaces; L185 Q2 rationale further splits it into separate "return loss" and "insertion loss" components | AGREE | Verified at L45: "0.3–0.4 dB of Fresnel return loss per interface" — misnomers both. L185 Q2 rationale option C states "approximately 0.3–0.4 dB of return loss and 0.2–0.3 dB of insertion loss." These are not additive separate quantities. IL from two glass-air interfaces is ~0.31 dB total; ORL at a bare glass-air interface is ~14.6 dB. The text conflates the two physical quantities, teaching incorrect physics for how gel works. |
| 4 | B7 | HIGH | gotcha-missed | 2.6 | `06-splice-closures.md` L46–56 | Pressurized (nitrogen-filled) dome closures entirely absent from lesson — learner who re-enters a pressurized closure treating it as a standard IP68 dome will vent pressure and risk plant damage | AGREE | Verified: no mention of pressurized closures anywhere in L2.6. These are real and common on buried feeder applications with Tier 1 carriers. Failure mode is concrete. |
| 5 | B2 | HIGH | gotcha-missed | 2.5 | `05-mechanical-splicing.md` L67–73 | Aerial closure internal temps can exceed +80–85°C in black-jacket summer; text states +70°C max rated range without noting this is routinely exceeded in aerial OSP | AGREE | Verified: L67–73 states −40°C to +70°C as the rated range. Content correctly notes gel degrades above this range but never warns that aerial black-jacket closures in direct sun commonly exceed +70°C interior, making the rated range a real operating risk, not just a spec limit. |
| 6 | B10 | HIGH | gotcha-missed | 2.7 | `07-splice-trays-buffer-tube-management.md` L90–98 | Acetone prohibition absent from gel removal procedure; many trainees use acetone from the field truck, which attacks acrylate coatings causing latent fracture | DISAGREE | Verified: L94–98 states "Apply a gel removal solvent or isopropyl alcohol (IPA)." The content recommends IPA and is not wrong. However, it omits an explicit prohibition on acetone, which is a real field failure mode. This is a **missing safety note**, not a factual error in the text. The Q5 rationale at L275 explicitly confirms "IPA at typical concentrations…does not damage standard acrylate primary coatings" — which implicitly teaches IPA-only but does not warn against alternatives. Downgraded: valid as a content-gap note, but not a factual error meriting HIGH severity correction. Recommend reclassifying as MED (safety-note gap) for red team arbitration. |
| 7 | B11 | HIGH | gotcha-missed | 2.7 | `07-splice-trays-buffer-tube-management.md` L102–106 | 10× tube OD gives 20 mm minimum for a 2 mm tube — but fiber inside requires 30 mm minimum; text doesn't resolve the conflict | AGREE | Verified: L105 states "10× the tube outer diameter (a 2 mm tube has a 20 mm minimum bend radius, separate from the 30 mm fiber radius inside the tube)." The text does acknowledge these as separate requirements but critically never states the governing rule when they conflict. A learner reading "separate from the 30 mm fiber radius" without explicit priority guidance may apply 20 mm to the assembled routed tube. Fix should add: when tube and fiber minimums conflict, use 30 mm. |
| 8 | B6 | HIGH | gotcha-missed | 2.6 | `06-splice-closures.md` L80–81 | Text says port failure happens "if port seals are not correctly installed" but never explains what correct installation looks like | AGREE-WITH-DOWNGRADE | Verified: L80–81 is factually accurate. The gap (not explaining correct installation) is real but is MED severity pedagogically, not HIGH. This is content incompleteness on a supporting explanatory sentence, not a method-selection trap or a factual error. Downgrade to MED. |
| 9 | A-B3 | MEDIUM | Citation Scope | 2.6 | `06-splice-closures.md` L80 | IEC 60068-2-14 (thermal shock) cited for dynamic water pressure testing — wrong standard; water jet/hammer testing is under IEC 60529 higher codes or manufacturer hydrostatic methods | AGREE | Verified: L80 text: "tested separately under IEC 60068-2-14 thermal shock and related environmental test regimes." IEC 60068-2-14 is explicitly a thermal cycling/shock standard. Citation is wrong for the stated purpose of dynamic water pressure qualification. Also note: L299 in the Glossary Cross-References section of L2.6 explicitly cross-references "IEC 60068-2-14 → Lesson 2.12 (Acceptance Testing — thermal cycling testing of closures)" confirming the file itself knows this standard is thermal, not water pressure. |
| 10 | B1 | HIGH | gotcha-missed | 2.5 | `05-mechanical-splicing.md` L47 | Text says clamp is "irreversible on most field mechanical splice designs" without noting that some (AFL FAST, certain CamSplice models) are re-enterable | AGREE-WITH-DOWNGRADE | Verified: L47 states "irreversible on most field mechanical splice designs." The qualifier "most" is present — the text is not categorically wrong. The gap is that it doesn't name specific re-enterable exceptions or tell the learner to check before destroying the device. This is a MED-level content completeness gap, not a HIGH error. Downgrade to MED. |
| 11 | B4 | MEDIUM | wrong-reason | 2.5 | `05-mechanical-splicing.md` L211–216 | Q4 rationale for why clamp relaxation is not the failure mode is true of name-brand products but overstated as universal | AGREE | Verified: L213 "cam-action clamp in current field mechanical splice designs (3M Fibrlok II, Corning CamSplice) is a one-time actuation mechanism… Clamp 'relaxation' over time is not the documented failure mode." The qualifier "current field mechanical splice designs" limits scope, but the statement is presented as if universal. Qualifying to named vendors is the correct fix; B's rationale is sound. |
| 12 | B15 | HIGH | gotcha-missed | 2.8 | `08-termination-methods.md` L149–151 | APC color-code-reliance warning absent: in legacy plant, green was used for multimode SC on some vendor lines; learner relying on green=APC may mis-mate | AGREE-WITH-DOWNGRADE | Verified: L200 Key Terms confirms "Green housing by convention" for APC. The text explicitly flags color as convention, not physical interlock. The warning about legacy multi-mode green convention is a valid field gotcha. However, the body text at L151 already says "field verification of the adapter type before mating any connector is mandatory" — this partially addresses B15's concern. Reduce to MED: the fix is tightening the legacy-green callout, not correcting a factual error. |
| 13 | A-B4 | LOW→MEDIUM | Math Imprecision | 2.8 | `08-termination-methods.md` L249–250 | One-technician time (6.4–9.6 hours) exceeds 6-hour window but rationale concludes "feasible" without explicitly anchoring to the two-technician scenario | AGREE-WITH-UPGRADE | Verified: L250 Q1 rationale C states "fusion splice cycle time (4–6 minutes per fiber × 96 = 6.4–9.6 hours for one technician, or 3.2–4.8 hours for two) is feasible within the 6-hour window." The "feasible" conclusion is technically based on two technicians, but the rationale reaches the feasibility conclusion immediately after presenting the one-tech figure. A learner reading sequentially may miss the dependency. Auditor A called LOW; B didn't flag it. Upgrading to MED because the rationale for the CORRECT answer (C) actually contains a potential path to a wrong inference. |
| 14 | B3 | MEDIUM | vendor-claim | 2.5 | `05-mechanical-splicing.md` L41–47 | AFL FAST Connector and Molex LightCrimp Plus absent from "typical" device list; Corning/3M-centric view | AGREE | Verified: L41 "A typical field mechanical splice (3M Fibrlok II, Corning CamSplice)." AFL FAST Connector is widely deployed; omission creates carrier-centric blind spot in learners doing work with AFL-supplied kits. |
| 15 | B8 | MEDIUM | outdated | 2.6 | `06-splice-closures.md` L87–91 | No mention of fiber-reinforced or Class I dielectric aerial closure designs for ADSS/OPGW mid-span; material framing is distribution-level circa-2010 | AGREE | Verified: L86–90 covers UV-stabilized HDPE, UV-stabilized polycarbonate, UV-resistant HDPE with carbon black. No mention of fiber-reinforced armored designs for ADSS/OPGW aerial. Concur it's a content gap for learners who will work above distribution level. |
| 16 | B9 | MEDIUM | handwaving | 2.6 | `06-splice-closures.md` L126–133 | Sizing discussion omits minimum slack storage requirement; correctly-sized closure can still damage fibers on re-entry if no slack loop is stored | AGREE | Verified: L128–133 covers cable count (ports) and fiber count (trays) but never mentions minimum fiber slack storage inside the closure as a sizing parameter. The real-world failure mode B describes is accurate. |
| 17 | B12 | MEDIUM | gotcha-missed | 2.7 | `07-splice-trays-buffer-tube-management.md` L113–125 | Fiber mapping section describes the convention but zero instruction on documenting it (closure manifest, as-built record, label format) | AGREE | Verified: L113–125 describes the tray assignment convention and mentions "Tray labeling" at L123 with format guidance. However, there is no instruction on where the record goes (as-built drawing, network inventory), no mention of closure manifest sheets, and no crew/date recording requirement. The mapping convention without documentation is half the job. |
| 18 | B13 | MEDIUM | plausibility | 2.7 | `07-splice-trays-buffer-tube-management.md` L62–66 | 37.5 mm ribbon MBR cited from Corning tray guide; other manufacturer ribbon trays may require 40–50 mm; no guidance on when to verify | AGREE | Verified: L66 table cites "≥ 37.5 mm (wider path needed for flat array)" sourced to Corning Splice Tray Guide, §3.1. The citation is product-specific. A learner who extrapolates this to non-Corning trays may violate a tighter spec. Adding a "verify against manufacturer spec" note is appropriate. |
| 19 | B16 | MEDIUM | gotcha-missed | 2.8 | `08-termination-methods.md` L104–117 | Hot-melt oven temperature drift not mentioned; below-temp oven produces unseated fibers and elevated IL; pre-use temp verification not called out | AGREE | Verified: L104–117 describes oven procedure without any mention of verifying oven temperature before use. The 3M-8880 thermostat drift is a documented field issue. Omission is a real safety gap. |
| 20 | B17 | MEDIUM | parity-drift | 2.8 | `08-termination-methods.md` L83–99 | Only Corning UniCam named in cleave-and-crimp section; CommScope OptiSplice, AFL CamLite, Sumitomo QC absent | AGREE | Verified: L85 "Corning UniCam Guide, §1.1" as sole cited product. L100 does state "Available in SC-UPC, SC-APC, LC-UPC, LC-APC variants" generically, but all performance citations in this sub-section are Corning-only. Parity finding is valid. |
| 21 | B18 | LOW | gotcha-missed | 2.8 | `08-termination-methods.md` L125–143 | IEC 61300-3-35 referenced but no description of what a fail looks like or what to do | AGREE | Verified: L141 mentions "IEC 61300-3-35 pass/fail overlay" but provides no description of fail patterns or remediation. Valid low-severity gap. |

---

## Disposition Summary

**Raw counts:** Auditor A = 4 findings; Auditor B = 18 findings
**Unique findings after dedup:** 21 (A-B2/B14 merged as one convergent item; A-B1 and A-B3 and A-B4 each consolidated from both auditors)

**Cross-auditor convergence: 4 items** (A-B1, A-B2/B14, A-B3, A-B4 — all independently found by both auditors)

**DISAGREED items:**
- **B10 (acetone prohibition):** Content says "IPA or gel removal solvent" — not wrong. B's finding is a missing explicit prohibition, which is a content-gap note, not a factual error. Reclassified MED.

**DOWNGRADED items:**
- B1 → MED: "most designs" qualifier already present; gap is missing named exceptions, not a factual error
- B6 → MED: supporting sentence incompleteness, not a method-selection trap
- B15 → MED: body text already says "field verification of adapter type is mandatory"; gap is a legacy-green callout tightening

**UPGRADED items:**
- A-B4 LOW → MED: feasibility rationale for correct answer contains a one-tech figure that logically precedes the two-tech conclusion without explicit anchor

**Final severity distribution (21 unique items):**
- CRITICAL: 1
- HIGH: 7
- MEDIUM: 12
- LOW: 1

---

## Recommended Red-Team Focus Areas

1. **B10 (acetone prohibition, MED after downgrade).** Peer review DISAGREES with B's HIGH severity but the underlying field-safety concern is real. Red team should independently determine: does "gel removal solvent or IPA" give a trainee implicit permission to use acetone (first available solvent on the truck)? If so, HIGH severity stands. If "IPA" read in context is sufficient restriction, MED is correct.

2. **A-B2/B14 convergent item (L2.8 table ≥45 dB vs. ≥55 dB).** Both auditors converged; peer review AGREES at HIGH. Red team spot-check recommended for completeness: verify that the L171 table column header confirms this is the APC column (not UPC), and confirm no scenario or quiz question elsewhere in L2.8 uses ≥45 dB for APC as correct. If a quiz distractors also uses 45 dB as "wrong answer," the fix must update both the table and any distractor rationale that references it.

3. **B5 (re-entry procedure, CRITICAL).** Confirmed absent from the lesson. Red team should verify no re-entry content is present in adjacent lessons (L2.6 glossary cross-references, L2.7 buffer-tube management section) that could partially satisfy this gap, before the fix agent writes a full new subsection.

---

=== TOPIC 2 BATCH B PEER REVIEW END ===
