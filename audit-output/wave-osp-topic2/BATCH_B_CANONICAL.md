# OSP Topic 2 Batch B — Canonical Findings

**Role:** Red Team Verification (Step 4 of audit pipeline)
**Date:** 2026-05-14
**Branch:** `claude/debug-previous-issues-MoN9D`
**Source:** Auditor A (4 findings) + Auditor B (18 findings) → Peer Cross-Check (21 unique) → Red Team verification

---

## Stack Snapshot

Four lessons (L2.5–L2.8), ~1,400 lines. Red team opened every cited line range independently. Three focus areas resolved: B10 acetone severity upgraded back to HIGH (wording is genuinely permissive to naive trainee); A-B2/B14 APC return-loss table confirmed wrong — no other quiz distractor uses ≥45 dB as a correct APC value, table-only fix; B5 re-entry confirmed absent in all adjacent lessons checked (L2.5, L2.7, L2.9, L2.12). One peer-review downgrade (B6 MED) confirmed. One peer-review downgrade (B1 MED) confirmed. Total canonical: 1 CRITICAL, 8 HIGH, 11 MED, 1 LOW = 21 items.

---

## Canonical Findings Table

| # | Source | Severity (FINAL) | Category | Lesson | Location | Issue | Red Team Status | Red Team Note |
|---|---|---|---|---|---|---|---|---|
| 1 | B5 | CRITICAL | gotcha-missed | 2.6 | `06-splice-closures.md` L37–54 | No re-entry procedure or sequence discipline; re-entry is the #1 cause of new damage in existing closures; lesson mentions re-entrability 15+ times but zero procedural content | VERIFIED | Opened L2.6 fully + spot-checked L2.5, L2.7, L2.9, L2.12. No re-entry procedure exists anywhere in Batch B or adjacent lessons. CRITICAL confirmed. Fix agent: ADD new subsection, do not edit existing. |
| 2 | A-B2/B14 | HIGH | Internal Consistency | 2.8 | `08-termination-methods.md` L171, L227, L278 | Performance table APC column shows ≥45 dB; scenario (L227) and Q3 rationale (L278) both show ≥55 dB for SC-APC cleave-and-crimp | VERIFIED | Opened L171 table (APC column = "≥ 45 dB"), L227 ("≥ 55 dB per Corning product data"), L278 ("≥55–60 dB"). ≥45 dB is the UPC figure incorrectly placed in the APC column. Swept all APC references in L2.8 — no other quiz distractor uses ≥45 dB as a correct APC value. L248 Q1-A rationale uses "40–45 dB" in UPC context correctly. Table L171 is the sole wrong value. Fix: update L171 APC column to ≥55 dB. |
| 3 | A-B1 | HIGH | Math / Terminology | 2.5 | `05-mechanical-splicing.md` L45, L185 | L45 body text: "0.3–0.4 dB of Fresnel return loss per interface" — actually insertion loss from two interfaces. L185 Q2 rationale further presents them as additive (return loss + insertion loss as separate quantities) | VERIFIED | Opened L45: "eliminating the Fresnel reflection that would occur at a glass-to-air interface. Without index-matching gel, the cleave gap between two fiber ends would introduce 0.3–0.4 dB of Fresnel return loss per interface." Then L185: "approximately 0.3–0.4 dB of return loss and 0.2–0.3 dB of insertion loss." Body text and Q2 rationale both teach wrong physics. HIGH confirmed. |
| 4 | B10 | HIGH | Safety | 2.7 | `07-splice-trays-buffer-tube-management.md` L90–98 | Gel removal procedure says "Apply a gel removal solvent or isopropyl alcohol (IPA)" — "gel removal solvent" is a generic category that does not explicitly prohibit acetone; no warning against acrylate-coating-damaging solvents | VERIFIED-SEVERITY-UP | Opened L90–98. "gel removal solvent or isopropyl alcohol (IPA)" is genuinely permissive — "gel removal solvent" includes acetone, which is a common solvent available on field trucks. IPA is named but not exclusive. Q5 rationale confirms IPA is safe but does NOT warn that alternatives (acetone) damage acrylate coatings. A naive trainee can plausibly read "gel removal solvent" as permission to use whatever solvent is in the truck. Peer review downgraded to MED; red team restores to HIGH. Latent fiber fracture risk from acrylate coating damage is a concrete harm. |
| 5 | B7 | HIGH | gotcha-missed | 2.6 | `06-splice-closures.md` L46–56 | Pressurized (nitrogen-filled) dome closures entirely absent; learner who re-enters a pressurized closure as if it were a standard dome will vent pressure and risk plant damage | VERIFIED | Opened L46–56 dome closure section. No mention of pressurized variants anywhere in the lesson. HIGH confirmed. |
| 6 | B2 | HIGH | gotcha-missed | 2.5 | `05-mechanical-splicing.md` L67–73 | Aerial closure internal temps can exceed +80–85°C; text states +70°C max rated range without noting this is routinely exceeded in aerial black-jacket closures | VERIFIED | Opened L67–73: "−40°C to +70°C for most field devices." Lesson context confirms gel-migration risk above this range but no aerial-overtemp callout. HIGH confirmed. |
| 7 | B11 | HIGH | gotcha-missed | 2.7 | `07-splice-trays-buffer-tube-management.md` L102–106 | Text states 10× tube OD minimum for buffer tube (20 mm for 2 mm tube) "separate from the 30 mm fiber radius inside the tube" — never states which governs when they conflict | VERIFIED | Opened L105: "10× the tube outer diameter (a 2 mm tube has a 20 mm minimum bend radius, separate from the 30 mm fiber radius inside the tube)." "Separate from" acknowledges both but does not name 30 mm as governing. A learner can misapply 20 mm to the routed assembly. HIGH confirmed. |
| 8 | A-B3 | MED | Citation Scope | 2.6 | `06-splice-closures.md` L80 | IEC 60068-2-14 (thermal shock) cited for dynamic water pressure testing — wrong standard | VERIFIED | Opened L80: "tested separately under IEC 60068-2-14 thermal shock and related environmental test regimes." IEC 60068-2-14 is thermal shock; dynamic water pressure is IEC 60529 higher IP codes or manufacturer hydrostatic method. Confirmed by L298 Glossary cross-reference which itself says "IEC 60068-2-14 → Lesson 2.12 (Acceptance Testing — thermal cycling testing of closures)" — the file's own metadata confirms this is a thermal standard, not water. MED confirmed. |
| 9 | B6 | MED | gotcha-missed | 2.6 | `06-splice-closures.md` L80–81 | Text says port failure happens "if port seals are not correctly installed" but never explains what correct installation looks like | VERIFIED | Opened L80–81. Peer review downgraded to MED (supporting sentence incompleteness, not method-selection trap). Confirmed: no installation details present, but this is a content-completeness gap on a secondary explanatory clause. MED is correct. |
| 10 | B1 | MED | gotcha-missed | 2.5 | `05-mechanical-splicing.md` L47 | "irreversible on most field mechanical splice designs" — qualifier "most" present but no mention of specific re-enterable exceptions (AFL FAST, certain CamSplice models) | VERIFIED | Opened L47: "irreversible on most field mechanical splice designs." Peer review downgraded to MED. Confirmed: qualifier is present. Gap is missing named re-enterable exceptions + instruction to check before destroying. MED confirmed. |
| 11 | B4 | MED | wrong-reason | 2.5 | `05-mechanical-splicing.md` L211–216 | Q4 rationale presents cam-clamp irreversibility as universal; true for Fibrlok II/CamSplice but overstated for budget/older designs | VERIFIED | Opened L213: "cam-action clamp in current field mechanical splice designs (3M Fibrlok II, Corning CamSplice)." Scoping qualifier is present but framing reads as universal claim. MED confirmed. |
| 12 | B15 | MED | gotcha-missed | 2.8 | `08-termination-methods.md` L149–151 | APC color-code-reliance warning absent; legacy plant used green for multimode SC in some vendor lines | VERIFIED | Opened L151: "field verification of the adapter type before mating any connector is mandatory." Peer review downgraded to MED (body text already requires field verification). Confirmed: MED. Fix is tightening the legacy-green callout, not correcting a factual error. |
| 13 | A-B4 | MED | Math Imprecision | 2.8 | `08-termination-methods.md` L249–250 | Q1 rationale C feasibility conclusion immediately follows one-tech figure (6.4–9.6 hrs) that exceeds window; two-tech anchor not explicit | VERIFIED | Opened L250: rationale states one-tech figure first, then two-tech figure, then "feasible" — correct answer reader who skims may miss the dependency. MED confirmed. |
| 14 | B3 | MED | vendor-claim | 2.5 | `05-mechanical-splicing.md` L41–47 | AFL FAST Connector and Molex LightCrimp Plus absent from "typical" device list | VERIFIED | Opened L41: "A typical field mechanical splice (3M Fibrlok II, Corning CamSplice)." AFL FAST Connector has significant carrier OSP installed base. MED confirmed. |
| 15 | B8 | MED | outdated | 2.6 | `06-splice-closures.md` L87–91 | No fiber-reinforced or Class I dielectric aerial closure designs for ADSS/OPGW; material framing is distribution-level circa-2010 | VERIFIED | Opened L86–90: UV-stabilized HDPE, UV-stabilized PC, carbon-black HDPE — no fiber-reinforced mention. MED confirmed. |
| 16 | B9 | MED | handwaving | 2.6 | `06-splice-closures.md` L126–133 | Sizing section omits minimum slack storage requirement; correctly-sized closure can still damage fibers on re-entry | VERIFIED | Opened L126–133: cable count + fiber count + re-entry frequency covered; no slack storage inside closure as a sizing parameter. Note: L2.7 L106 mentions 25–50 mm tube slack coil at the management bracket as a re-entry accommodation, but not as a closure selection parameter. MED confirmed. |
| 17 | B12 | MED | gotcha-missed | 2.7 | `07-splice-trays-buffer-tube-management.md` L113–125 | Fiber mapping section describes convention but zero instruction on documenting it (closure manifest, as-built record, label format) | VERIFIED | Opened L113–125: tray assignment convention, labeling format briefly mentioned at L123, but no as-built record instruction, no closure manifest, no crew/date requirement. MED confirmed. |
| 18 | B13 | MED | plausibility | 2.7 | `07-splice-trays-buffer-tube-management.md` L62–66 | 37.5 mm ribbon MBR from Corning tray guide; other manufacturers may specify 40–50 mm; no verification guidance | VERIFIED | Opened L66 table: "≥ 37.5 mm (wider path needed for flat array)" with Corning Splice Tray Guide citation. Product-specific without generalization note. MED confirmed. |
| 19 | B16 | MED | gotcha-missed | 2.8 | `08-termination-methods.md` L104–117 | Hot-melt oven temperature drift not mentioned; pre-use temp verification not called out | VERIFIED | Opened L104–117: oven procedure described without pre-use temperature verification step. MED confirmed. |
| 20 | B17 | MED | parity-drift | 2.8 | `08-termination-methods.md` L83–99 | Only Corning UniCam named in cleave-and-crimp section; CommScope OptiSplice, AFL CamLite, Sumitomo QC absent | VERIFIED | Opened L85: "Corning UniCam Guide, §1.1" as sole cited product. L100 generic note exists but all performance citations are Corning-only. MED confirmed. |
| 21 | B18 | LOW | gotcha-missed | 2.8 | `08-termination-methods.md` L125–143 | IEC 61300-3-35 referenced but no description of what a fail looks like or remediation | VERIFIED | Opened L141: "IEC 61300-3-35 pass/fail overlay" — no fail-pattern description or remediation. LOW confirmed. |

---

## Rejected Findings

None. All 21 peer-reviewed findings verified. No FALSE-POSITIVE or OVERSTATED dispositions.

**B10 peer-review downgrade reversed:** Peer review classified B10 as MED after DISAGREEING with B's HIGH. Red team restores to HIGH. "Gel removal solvent or isopropyl alcohol (IPA)" is genuinely permissive — "gel removal solvent" is a category that includes acetone. Q5 rationale confirms IPA safety but does not warn against alternatives. Latent fiber fracture from acrylate coating damage is a concrete, documented harm. Explicit prohibition required.

---

## Negative-Finding Spot-Checks

1. **L2.6 IP68 digit definitions (Auditor A confirmed clean):** Opened L74–76. "6 — Dust-tight; no ingress of dust particles" and "8 — Protection against the effects of continuous immersion in water, at conditions specified by the manufacturer." Correct per IEC 60529. CONFIRMED CLEAN.

2. **L2.6 gel-seal vs. heat-shrink comparison table (Auditor B confirmed clean):** Opened L115–122 table. Re-entrability, temperature ranges, gel migration threshold at +60°C. All attributes and values accurate. CONFIRMED CLEAN.

3. **L2.7 minimum bend radius 30 mm for OS2 SMF (both auditors confirmed clean):** Opened L63: "≥ 30 mm" for OS2 SMF 250 µm. Cited to ANSI/TIA-758-C §7.2 correctly. CONFIRMED CLEAN.

4. **L2.8 pigtail + splice insertion loss math (Auditor A confirmed clean):** Opened L51–58: factory-polished pigtail table + L182 Key Term. 0.10–0.20 dB (connector) + 0.02–0.05 dB (splice) = 0.12–0.25 dB. Arithmetic verified. CONFIRMED CLEAN.

5. **L2.8 UPC/APC incompatibility (both auditors confirmed clean):** Opened L149–151 and L200. "Not compatible with UPC adapters. Mating UPC to APC produces >2 dB insertion loss." Correctly stated. CONFIRMED CLEAN.

6. **L2.5 go/no-go framework (Auditor B confirmed clean):** Opened L67–99. Three-condition gate consistently applied in scenario and quiz items. No logical contradictions. CONFIRMED CLEAN.

7. **L2.8 Performance table UPC column (verification of table context):** Opened L168–173. UPC cleave-and-crimp = "≥ 40–45 dB" in the UPC column — this is the correct UPC figure. The problem is the APC column shows the same "≥ 45 dB" range, which is incorrect for APC. UPC column is correct; APC column is wrong. Fix scope is APC column only. CONFIRMED — UPC column clean, APC column wrong.

---

## Fix-Agent Dispatch Readiness

### CRITICAL-tier — Commit 1 (ship first, standalone)

**C-1: B5 — Closure Re-Entry Procedure (L2.6)**
- File: `06-splice-closures.md`
- Action: ADD a new "Re-Entry Procedure" subsection under the Dome Closures section (after L54), not edit existing text.
- Content scope: 6–8 ordered bullet steps — release pressure (with pressurized-closure callout), cut re-entry ring on pre-sealed variants, remove barrel in controlled sequence, avoid cable tension, inspect tray stack before disturbing, re-torque port seals in reverse-installation order, re-verify IP sealing before close. Note B7 (pressurized closure callout) can be incorporated here as a pre-step warning.

### HIGH-tier — Commit 2

**H-1: A-B2/B14 — APC return loss table (L2.8 L171)**
- Fix: Update table row `Cleave-and-crimp` APC column from `≥ 45 dB` to `≥ 55 dB`.
- Note: This is the ONLY wrong value. Scenario (L227), Q3 rationale (L278), and Pulse 3 answer (L329) all correctly state ≥55 dB. No quiz distractor relies on ≥45 dB as a correct APC value. Table-line-only fix.

**H-2: A-B1 — Fresnel terminology (L2.5 L45, L185)**
- Fix: L45: replace "0.3–0.4 dB of Fresnel return loss per interface" with "~0.3 dB of insertion loss at the two-interface gap." L185 Q2 rationale: consolidate to ~0.3 dB insertion loss from two air-glass interfaces; separate sentence for ORL (~14.6 dB at bare glass-air interface).

**H-3: B10 — Acetone prohibition (L2.7 L94)**
- Fix: Add explicit WARNING after the gel removal procedure step 2: "Never use acetone or other ketone-based solvents for gel removal. Acetone attacks standard acrylate primary coatings and weakens the fiber at the stripped transition zone, causing latent fracture that may not appear for days or weeks after installation. Use IPA only."

**H-4: B7 — Pressurized dome closures (L2.6 L46–56)**
- Fix: Add a callout box or paragraph in the Dome Closures section: "Some buried feeder dome closures in Tier 1 carrier plant are nitrogen-pressurized for continuous leak monitoring. This lesson covers non-pressurized closures only. Pressurized closures require pressure release before re-entry per the manufacturer's protocol — do not open a pressurized closure as if it were a standard dome."
- Note: If re-entry procedure subsection (C-1) is written first, the pressurized-closure callout can be integrated there as a pre-step item.

**H-5: B2 — Aerial overtemp warning (L2.5 L67–73)**
- Fix: Add explicit field note after the temperature range statement: "Note: Black-jacketed aerial closures in direct summer sun can reach +80–85°C interior. This exceeds the +70°C gel-rated range. Mechanical splices in direct-sun aerial applications are operating outside the gel's rated temperature envelope during peak summer conditions."

**H-6: B11 — Buffer tube vs. fiber bend radius conflict (L2.7 L105)**
- Fix: Add governing-rule clause to the existing bullet: "When tube and fiber minimum bend radii conflict, the fiber's 30 mm minimum governs. Route the tube assembly to 30 mm — the tube spec of 10× OD does not protect the fiber inside it."

### MED-tier — Commit 3

Items 8–20 (canonical numbers 8–20): A-B3, B6, B1, B4, B15, A-B4, B3, B8, B9, B12, B13, B16, B17.

**A-B3 (citation):** Replace IEC 60068-2-14 with IEC 60529 §14.2.9 (water jet) or note as manufacturer-specific hydrostatic method. Remove "thermal shock" from the water-pressure context.

**B6 (port seals):** Expand L80–81 with 2–3 sentences on correct port seal installation: full gel compression confirmed, cable jacket not kinked at port entry, blank plugs torqued.

**B1 (re-enterable splices):** Add note at L47: "Some models support re-entry (AFL FAST Connector, select CamSplice variants) — verify manufacturer specification before destroying the device."

**B4 (Q4 rationale universality):** Add qualifier: "…for current-generation designs from major vendors (Fibrlok II, CamSplice)…" Remove universal framing.

**B15 (APC legacy green):** Add legacy-green caveat at L151: "In legacy plant, green was also used on multimode SC connectors by some vendors. Verify adapter angle slot or ferrule end-face directly — color coding is a convention, not a physical interlock."

**A-B4 (Q1 rationale feasibility anchor):** Add explicit two-tech anchor: "With two technicians (3.2–4.8 hours), the splice cycle time is feasible within the 6-hour window; one technician alone (6.4–9.6 hours) would exceed the window."

**B3 (vendor parity, L2.5):** Add AFL FAST Connector and one alternative to L41 "typical" list.

**B8 (aerial material framing):** Add note that aerial closures for ADSS/OPGW mid-span may use fiber-reinforced or armored designs; material discussion is distribution-level framing.

**B9 (slack storage in sizing):** Add slack storage as a closure sizing parameter: minimum 1.0–1.5 m fiber coil per cable at ≥30 mm radius inside the closure.

**B12 (fiber mapping documentation):** Add documentation sub-section: closure manifest sheet, cable/tube/fiber ID, splice date, crew, where the record lives.

**B13 (ribbon MBR):** Add note that 37.5 mm is Corning-specific; verify tray manufacturer spec for non-Corning products (40–50 mm for some).

**B16 (hot-melt oven):** Add pre-use temperature verification step to hot-melt procedure.

**B17 (cleave-and-crimp parity):** Add CommScope OptiSplice and AFL CamLite to L85 product list.

### LOW-tier — Commit 4

**B18 (IEC 61300-3-35 fail description):** Add 2-sentence note: what a failing end-face looks like (scratches/pits/chips in Zone A ≤25 µm) and that failing connectors must be re-polished or replaced (not cleaned).

---

## Adjacent Observations (Outside Canonical — Not For Fix Agent)

1. **L2.6 Glossary Cross-Reference L298 is self-inconsistent with the finding:** The file lists "IEC 60068-2-14 → Lesson 2.12 (thermal cycling testing of closures)" — this cross-reference is actually correct per the standard's true scope. It contradicts the body text at L80 which misapplies it to water pressure. The fix to A-B3 (body text L80) will resolve this; the glossary cross-reference itself needs no change.

2. **L2.6 no closure ground bonding sequence for metallic-element aerial closures (Auditor B coverage gap):** Real gap noted by B. Not in peer-reviewed canonical list. Worth adding to a future content batch.

=== TOPIC 2 BATCH B CANONICAL END ===
