# T16 Coverage Gap Analysis

## Real-World As-Built Workflow vs. T16 Scope

### Phase 1: Pre-Construction (T04 Route Survey Handoff)
- T16 assumes as-designed drawings exist (T04 prerequisite)
- T16.L06 covers reconciliation of as-designed → as-built
- **GAP 1:** No lesson covers the HANDOFF POINT between T04 (survey deliverables) and T16 (as-built planning). T04.L10 (final deliverables) should explicitly reference "these drawings become the as-designed baseline for T16 reconciliation" — currently no cross-lesson linkage.

### Phase 2: Construction (T10 Daily Field Report Loop)
- T16.L01 references DFR from T10.L10
- T16.L06 discusses redlines from field
- **GAP 2:** No lesson covers WHO OWNS the redline process during construction. Is it the field crew, the construction PM, the design engineer? T16 should clarify: redlines are the field crew's responsibility, construction PM consolidates + engineer reviews. Current lessons treat redlines as a passive collection artifact, not an active management process.
- **GAP 3:** No coverage of COMMON AS-BUILT DEFECTS found in field execution:
  - Splice locations wrong (planned 50 ft from pole, actually 45 ft) 
  - Fiber count mismatches (design says 288, crew found 144)
  - Missing slack documentation (how much slack at each pedestal?)
  - Depth/cover discrepancies (buried 30" vs 36" design)
  - Pole attachment height variances (design 8'6", field 8'2" due to existing plant conflict)

### Phase 3: Splicing (T11 Handoff to T16)
- T16.L02 (Splice Matrix) covers schema
- T16.L09 (Fiber Topology Canvas) covers path visualization
- **GAP 4:** No lesson on SPLICE MATRIX INTEROPERABILITY — does the splice matrix feed into a GIS database? A CMMS? How does the splice matrix tie into Form 219 closeout? L02 mentions "industry practice" but doesn't address: "Your splice matrix uses Excel columns ABC; your CMMS expects columns XYZ; how do you reconcile?" Current audience is field-crew-level, not integration-level.
- **GAP 5:** No coverage of SPLICE MATRIX DEFECTS:
  - Duplicate entries (same fiber-pair spliced twice — data entry error vs. real rework?)
  - Missing express fiber entries (fibers that pass through closure without splicing)
  - Incomplete OTDR trace documentation (measured loss but no trace file reference)
  - Technician credential chain (who signed off on the splicer cert for each tech?)

### Phase 4: Acceptance & Inspection (T13 Handoff to T16)
- T16.L01 references Form 219 from T13.L07
- T16.L07 (Form 219 closeout) owned by T16
- **GAP 6:** No lesson on INSPECTION SIGN-OFF CHAIN for as-builts. T13 QA inspector certifies the plant; T16 assumes the as-built is "complete." But who reconciles inspector findings vs. as-built records? If inspector flags "slack loop at pedestal X missing" during QA, that's a remediation + as-built update requirement. No T16 lesson covers the feedback loop between T13 inspection and T16 as-built completion.

### Phase 5: GIS Delivery & Records Management
- T16.L05 covers GIS formats (SHP/GDB/KML)
- T16.L04 covers TIA-606 administration classes
- **GAP 7:** No coverage of GIS-AS-BUILT ROUND-TRIP INTEGRITY:
  - Design team creates route in CAD/GIS → T04 exports SHP for RUS submission
  - Field crew executes plant with deviations, creates redlines
  - T16 reconciles and produces new SHP for as-built delivery
  - Question: does the new SHP match the CAD projection? datum? feature attribution? T16 assumes GIS is "output" only; doesn't cover how to VALIDATE the as-built SHP against the design SHP to catch projection/datum drift or missing layers.
- **GAP 8:** No coverage of LONG-TERM RECORDS MANAGEMENT:
  - "Maintain as-built records for the life of the plant" (7 CFR §1755.400) is stated in L01
  - But HOW? What happens when the plant is modified 5 years later? Do you version-control the as-built GIS? Append a new layer? Create a new Form 219? Current lessons treat as-built as a static document submitted at closeout; they don't address the LIVING-DOCUMENT problem.

### Phase 6: RUS Form 219 & Plant Accounting
- T16.L07 covers Form 219 closeout package checklist
- T16.L08 covers 47 CFR Part 32 account classifications
- **GAP 9:** No lesson on RECONCILING PHYSICAL PLANT TO ACCOUNTING PLANT:
  - Your crew installed 12.3 miles of cable. Form 219 says 12.1 miles. Where's the 0.2-mile discrepancy? T16 assumes as-built records are correct and Form 219 follows from them; doesn't cover the workflow when Form 219 (from invoices/receiving) doesn't match the as-built (from field measurement).
  - L08 mentions "unit of property" but doesn't clarify which as-built entities become UOPs: is a single splice tray a UOP, or is the entire splice closure a UOP? Current treatment is theoretical.

### Phase 7: Future Modifications & Emergency Restoration
- T16.L09 (Fiber Topology Canvas) covers "reading and updating"
- T15 (Restoration) is prerequisite to T16
- **GAP 10:** No lesson on AS-BUILT UPDATES FOR PLANT MODIFICATIONS:
  - Route gets extended 2 years after closeout → new fiber spliced into existing closure → do you create a new Form 219? Update the old one? Create an amendment? Current treatment assumes T16 is "after closeout" only; no coverage of as-built maintenance over the asset lifecycle.
- **GAP 11:** No coverage of EMERGENCY RESTORATION AS-BUILT WORKFLOW:
  - Cable cut in construction accident. Crew does emergency repair (new splice, maybe reroute conduit). Form 219 requires "as-built record for final plant." Does the emergency repair trigger a new as-built submission or an amendment? T15 (Restoration) should hand off to T16 with this question; currently they're isolated.

### Phase 8: Workflow Ownership & Roles
- **GAP 12:** No lesson clarifies ROLE/RESPONSIBILITY matrix:
  - Who creates redlines? Field crew or foreman?
  - Who consolidates redlines? Construction PM, field engineer, or design engineer?
  - Who approves the final as-built? Design engineer, RUS reviewer, or borrower/owner?
  - Who maintains the as-built after closeout? Owner's ops team or the design firm?
  - Current lessons treat as-built as a technical artifact without addressing organizational ownership.

## Coverage Assessment vs. ARCH Spec

**ARCH spec for T16:**
```
What an as-built is, splice matrix schemas, GIS export formats (SHP/GDB/KML), 
TIA-606-D administration classes, reconciling as-built to as-designed, fiber topology canvas, 
RUS Form 219 documentation package.
```

**T16 lessons delivered:**
1. L01: What is an as-built ✓
2. L02: Splice matrix schema ✓
3. L03: TIA-606 administration classes ✓
4. L04: Administration records (links, pathways, locations) — ADDITION beyond ARCH spec, extends L03 with practical detail
5. L05: GIS formats (SHP/GDB/KML) ✓
6. L06: Reconciling as-built to as-designed ✓
7. L07: Form 219 documentation package ✓
8. L08: 47 CFR Part 32 plant accounting — ADDITION beyond ARCH spec, critical for RUS context
9. L09: Fiber topology canvas ✓
10. L10: Capstone quiz ✓

**Verdict: T16 FULLY COVERS ARCH specification.** Two lessons (L04, L08) exceed the spec but both are in-scope additions (TIA-606 administration is complementary to classes; Part 32 accounting is mandatory RUS context for Form 219). No lessons are off-topic.

## High-Priority Gaps (Real-World Workflow Not Captured)

| # | Gap | Severity | Authority | Suggested location |
|---|---|---|---|---|
| 1 | Handoff linkage from T04 final deliverables to T16 as-built planning | MED | RUS 1751F-630 §8 | New T04.L10 addendum or T16.L01 "Foundations" section explicit backref |
| 2 | Redline ownership / process — who creates, consolidates, reviews | HIGH | RUS 1751F-630 §12.6 (field documentation) | T16.L06 "Working" section: add organizational-role narrative |
| 3 | Common as-built field defects and remediation triggers | MED | RUS audit practice | T16.L06 "Working" section: case studies of real as-built discrepancies |
| 4 | Splice matrix ↔ CMMS ↔ GIS integration (data pipeline) | MED | RUS 1751F-630 §10 (splice documentation) + TIA-606-C §6 | T16.L02 "Advanced" tier (new): GIS integration architectures |
| 5 | Splice matrix defects: duplicates, missing express entries, incomplete traces | LOW | RUS audit finding patterns | T16.L02 "Advanced" tier: quality-control checklist |
| 6 | Inspection sign-off chain ↔ as-built remediation loop | HIGH | 7 CFR §1755.400(c)(4) explicit closure | T16.L06 or new T16.L06b: QA-driven as-built updates |
| 7 | GIS round-trip integrity: design SHP ↔ as-built SHP validation | MED | ASCE 38-22 (quality levels for survey data) | T16.L05 "Advanced" tier: datum/projection/attribution validation workflow |
| 8 | Long-term as-built records management for plant modifications | HIGH | 7 CFR §1755.400 (plant lifecycle) | T16.L01 or T16.L06: as-built versioning, amendments, living-document narrative |
| 9 | Physical plant ↔ accounting plant reconciliation (12.3 miles field vs 12.1 miles Form 219) | MED | 47 CFR §32.2001 (unit of property verification) | T16.L08 "Advanced" tier: reconciliation workflow with Form 1755-A |
| 10 | As-built updates for plant extensions / post-closeout modifications | MED | 7 CFR §1755.400 lifecycle + RUS practice | T16.L01 or new T16.L06c: amendment triggers and process |
| 11 | Emergency restoration as-built workflow — amendment vs. new submission | LOW | RUS form instructions (T15 → T16 handoff) | T16.L07 "Advanced" tier or cross-ref from T15.L10 |
| 12 | Organizational role/responsibility matrix for as-built creation and maintenance | HIGH | Industry practice + RUS expectations | T16.L01 "Foundations" or T16.L06 "Working": explicit ownership narrative |

## Cascade Risk Assessment

**Known cascade patterns in T16 context:**
- G-1 PAST: T04 §32.2421/§32.2423 citation mislabeling (§32.2421=underground main, §32.2423=distribution) — T16.L04 and L08 both reference Part 32 but don't inherit the corrected citations. Check: are L04 + L08 using correct account definitions?

## Recommendation

**Verdict: YELLOW.** T16 fully covers ARCH specification and 10 core lessons are schema-compliant. Two major real-world workflow gaps (Gap 2: redline ownership; Gap 12: role/responsibility) should be surfaced to RT for pedagogy assessment. Recommend:
1. RT-α (technical/citation framing) verifies Part 32 citations in L04+L08 don't propagate the §32.2421/2423 confusion
2. RT-β (pedagogy framing) assesses whether the 12 workflow gaps represent genuine curriculum underserving or are appropriately deferred to future ISP-course design (e.g., "as-built lifecycle management" is post-OSP scope)

