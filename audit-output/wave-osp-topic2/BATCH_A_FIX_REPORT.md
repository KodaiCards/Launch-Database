# Topic 2 Batch A — Fix Agent Report

**Date:** 2026-05-14
**Role:** Fix Agent (Step 5 of 6)
**Branch:** claude/debug-previous-issues-MoN9D
**Canonical list:** `audit-output/wave-osp-topic2/BATCH_A_CANONICAL.md` (10 findings C1–C10)

---

## Commit Summary

| Commit SHA | Tier | Items | Files |
|---|---|---|---|
| `b0a281d` | HIGH | C1, C2 | `01-cleaving-fundamentals.md`, `02-fusion-splicing-i.md` |
| `ec86e52` | MED | C3–C7 | `01-cleaving-fundamentals.md`, `02-fusion-splicing-i.md`, `03-fusion-splicing-ii.md`, `04-mass-fusion-splicing.md` |
| `b3ecaae` | LOW | C8–C10 | `01-cleaving-fundamentals.md`, `02-fusion-splicing-i.md`, `04-mass-fusion-splicing.md` |

---

## Per-Canonical-Item Status

### C1 — ADDRESSED
**HIGH / Plausibility trap / 2.1 / `01-cleaving-fundamentals.md` line 61**

- Cleave angle table row at line 61 split into two rows:
  - `Single-fiber fusion (SMF — OS1/OS2) | ≤ 0.5°`
  - `Single-fiber fusion (MMF — OM1–OM4) | ≤ 1.0°`
- Key Terms "Cleave angle" entry at line 120 updated: threshold language split to "≤0.5° for single-fiber SMF fusion, ≤1.0° for single-fiber MMF fusion and mass-fusion ribbon"; added rationale note explaining why they differ (prevents re-cleaving an auto-accepted 0.7° MMF result).
- Red-team adjacent note honored: both the table AND the Key Terms entry fixed.

### C2 — ADDRESSED
**HIGH / Math/Framing + Omission / 2.2 / `02-fusion-splicing-i.md` lines 82–116**

- (a) Math fixed at line 116: "67% of the available margin (1.8 dB)" → "40% of the available headroom (3.0 dB = 12.6 dB budget − 9.6 dB cable loss)". Added clarifying sentence: "1.2 dB (40%) is used by splices at the BICSI default quality level, leaving 1.8 dB remaining."
- (b) Added `> What this budget omits` callout block after the worked example: connectors, passive components, system margin reserve, with BICSI OSP-DRD Ch. 7.1 and TIA-568.3-D §6.3 references.

### C3 — ADDRESSED
**MEDIUM / Outdated practice / 2.4 / `04-mass-fusion-splicing.md` lines 51–57**

- "A newer ribbon construction" → "The current dominant ribbon construction in high-fiber-count OSP cable — now standard in most 144F+ trunk cable produced since approximately 2018."
- Added field-consequential gotcha: partially unrolled ribbon fed into a stripper causes hackle/lip failures misdiagnosed as cleaver problems.
- Added bold note: manufacturer-specified thermal or solvent technique required before cleaving; do not force still-bonded rollable ribbon through mechanical stripper.

### C4 — ADDRESSED
**MEDIUM / Vendor-claim-as-standard / 2.2 / `02-fusion-splicing-i.md` line 55**

- Manufacturer comparison paragraph revised: auto arc-power correction loop now qualified to "higher-end models (FSM-80S, FSM-90F) only".
- FSM-22S explicitly named as requiring the same manual ARC CHECK as Sumitomo.
- Added: "For any FSM model not confirmed to include automatic compensation, treat arc calibration as a manual, operator-initiated step."

### C5 — ADDRESSED
**MEDIUM / Gotcha-missed / 2.3 / `03-fusion-splicing-ii.md` line 107**

- Re-splice paragraph extended with bold **Minimum re-splice threshold** sentence: "After sleeve removal, each fiber end must have at least 50–60 mm of prepared length remaining (approximately 20 mm additional bare fiber beyond what the sleeve occupied on each side, plus re-strip and re-cleave margin)."
- Now consistent with the alternate-branch text at line 212 which already had the 20 mm figure. Decision criterion is now in the main procedure, not only in the worked example.

### C6 — ADDRESSED
**MEDIUM / Citation scope / 2.1 / `01-cleaving-fundamentals.md` lines 55, 120, 147–148**

- Body text at line 55: BICSI OSP-DRD Ch. 7.4 elevated to primary; IEC 61300-3-35 §4.1 demoted to parenthetical with scope note: "(connector end-face geometry standard, applied by convention to cleave angle loss physics)".
- Key Terms "IEC 61300-3-35" entry at line 147 revised: primary scope = connector end-face inspection clearly stated; role as supplementary reference for cleave angle criteria explicit; "BICSI OSP-DRD Manual, Ch. 7.4 is the governing reference" for fusion splice acceptance.

### C7 — ADDRESSED
**MEDIUM / Cross-lesson consistency / 2.2/2.3 / `03-fusion-splicing-ii.md` line 105, 193, 236**

- Body text re-arc definition revised: "Re-arc is effective when the splice zone looks geometrically good but estimated loss is above threshold — the typical working guidance for where re-arc tends to be beneficial is 0.10–0.20 dB, **but this is not a hard ceiling.**"
- Added: "A geometrically clean splice above 0.20 dB may still be re-arced at the technician's discretion; however, if loss is substantially elevated (e.g., >0.30 dB) without any identifiable geometric defect, dopant diffusion or sub-surface contamination is the more likely root cause and re-splice is the better first action."
- Q1 rationale at line 236 (option C) was already correct: "the 0.10–0.20 dB range is a typical working guidance for when re-arc is useful, not a hard trigger threshold" — confirmed consistent, no change needed.
- Worked example checklist at line 193: "0.10–0.20 dB range (marginally elevated, not catastrophically failed)" — consistent with body text after fix; no change needed.
- **Rule chosen:** Option (a) from canonical guidance — body text now explicitly states no hard upper ceiling, Q1 rationale and worked example already consistent.

### C8 — ADDRESSED
**LOW / Gotcha-missed / 2.1 / `01-cleaving-fundamentals.md` lines 76–77**

- Hackle corrective action extended with bold **Timing discipline** note: "Re-cleave immediately after cleaning — do not allow more than 30 seconds between cleaning and inserting the fiber in the cleaver."
- Rationale provided: in humid OSP conditions, cleaned bare glass re-contaminates from ambient moisture and airborne particles within seconds.

### C9 — ADDRESSED
**LOW / Wrong-reason / 2.2 / `02-fusion-splicing-i.md` line 268**

- Q4 option B rationale revised: correct answer (cladding alignment) unchanged.
- 3 µm now characterized as "toward the high end for cladding alignment."
- Nominal tolerance stack stated: ≤0.6 µm eccentricity + ~0.8–1.0 µm v-groove = ~1.5 µm worst case.
- Added: "A 3 µm reading exceeds this nominal stack — it suggests worn or contaminated v-groove channels, severely eccentric fiber, or debris in the holder."
- Added: "A 0.28 dB estimated loss at 3 µm offset should prompt v-groove inspection before continuing the closure."

### C10 — ADDRESSED (both sub-items)
**LOW / Vendor parity / citation / 2.1, 2.4**

- (a) Flashcard Card 4 (`01-cleaving-fundamentals.md` line 167): Added "Sumitomo FC-6S Guide, §4.3" as co-citation for blade rotation mechanism. Now consistent with Key Terms "Blade rotation counter" entry at line 132 which already co-cites both vendors.
- (b) Temperature gradient effect (`04-mass-fusion-splicing.md` line 91): Added "Sumitomo Type-71M+ Guide, §3.3" as co-citation alongside Fujikura FSM-60R Manual §4.2. Sumitomo is already cited at line 85 (same section) for arc energy parameters.

---

## Adjacent Observations (not committed — surface only)

1. **L2.1 Glossary Cross-References (line 300):** "IEC 61300-3-35 → Lesson 2.12 (Acceptance Testing)" entry describes IEC 61300-3-35 as governing connector end-face inspection in Lesson 2.12 — this is accurate and consistent with C6 fix; no change needed.
2. **L2.1 Q1 (line 179–188):** The question uses "OS2 SMF fiber" specifically, so the 0.7° scenario does not create an MMF teaching moment — confirmed clean (per canonical spot-check 1).
3. **L2.3 Key Terms "Re-arc" (line 150):** "Effective only for marginally elevated loss on geometrically good splices" — slightly at odds with the C7 fix's "no hard ceiling" language, but the Key Terms are the brief definition, not the full procedure. A Post-Fix Verification agent may flag this for a follow-on update if desired.
4. **L2.3 Pulse 1 (line 305–307):** "Re-arc is appropriate when: (1) estimated loss is marginally elevated (e.g., 0.10–0.20 dB) without visible geometric defects" — the "(e.g., ...)" framing already implies it is an example range, not a hard rule. Consistent with C7 fix.

---

## Scope Compliance

- All 10 canonical items (C1–C10) addressed.
- No edits made outside lessons 2.1–2.4.
- No auditor, peer-review, or canonical files modified.
- No adjacent changes committed.

=== BATCH A FIX AGENT REPORT END ===
