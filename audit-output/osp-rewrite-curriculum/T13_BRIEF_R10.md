# T13 (Inspection & Quality Assurance) — Research Brief R-10

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF_R10.md` written. No CLAUDE.md edits. No lesson file edits. No dispatching. No canonical files.

**Agent:** T13 Research R-10 — operations & maintenance handoff framing  
**Date:** 2026-05-18  
**Framing:** Senior OSP maintenance superintendent reviewing T13 from the perspective of the people who will LIVE WITH the inspection decisions for the next 10–20 years. The inspector's job ends at Form 219 acceptance. The maintenance crew's job begins the next day and never ends. Hunting specifically for what T13 fails to teach inspectors that creates systematic rework, emergency response failures, warranty forfeiture, and locate violations for the operations team that inherits the plant.

**Sources used independently of R-1..R-9:**
- 7 CFR §1755.404 (primary, eCFR direct) — fiber optic plant acceptance measurements, OTDR witness requirements, data record format (Format V per §1755.407)
- 7 CFR §1755.400 (primary, eCFR direct) — RUS standard for acceptance tests
- ASCE 38-22 (Subsurface Utility Engineering — Quality Level definitions for buried utility records)
- TIA-606-D (Administration standard for telecommunications infrastructure — cable identification, labeling)
- FOA Reference Guide (Outside Plant Testing chapter — OTDR baseline trace retention rationale)
- FTTH maintenance operations literature (BWNFIBER, Light Brigade emergency restoration best practices)
- City of Port St. Lucie Fiber Optic Network Minimum Design Standards 2023 (as-built GPS requirements — public specification)
- Common OSP operations practices (GIS update at acceptance, OTDR baseline archive protocol, locate-response obligations)

**NOT duplicating R-1..R-8 findings.** Specifically:
- R-4 M-1 briefly mentions SOR file retention from a litigation/spoliation angle. R-10 treats OTDR baseline records as an O&M operational necessity (a different finding: the CONTENT and ARCHIVE FORMAT the inspector must verify, not just how long to keep the files).
- R-7 M-2 addresses 811 ticket safety at inspection time. R-10 addresses the inspector's role in establishing the GIS/locate baseline that the 811 system will rely on for the life of the plant (distinct finding: not safety at inspection time, but baseline data quality at acceptance).
- R-8 H-1 covers pre-construction acceptance criteria communication. R-10 covers post-acceptance maintenance-handoff documentation package (distinct: different deliverable, different timing, different recipients).

---

## §1: OTDR Baseline Archive — Inspector's Verification Role Missing

### FINDING R10-H1 (HIGH) — T13.L07 Does Not Require the Inspector to Verify OTDR Baseline Record Format and Archive Destination Before Signing Form 219

**Primary sources:**
- 7 CFR §1755.404(b): "The measurement data shall be recorded. A suggested format similar to Format V, Outside Plant Acceptance Test — Fiber Optic Telecommunications Plant, in §1755.407, or a format specified in the applicable construction contract may be used."
- 7 CFR §1755.400: Inspector (borrower's resident project representative) must WITNESS the tests.
- FOA Reference Guide (OSP Testing chapter): "Every FTTH segment should have a reference trace recorded at acceptance, creating baseline traces for future comparison. By storing and referencing these initial traces, you can compare them to later results to detect changes in fiber performance."

**What R-1 through R-9 covered:**
R-1 includes "test reports — OLTS/OTDR per RUS 1753F-401" as a Form 219 component. R-4 M-1 flags SOR file retention from a spoliation angle. R-6 briefly mentions LO/RUS loan draw bridge. **Zero rounds address the inspector's responsibility to verify the CONTENT and ARCHIVAL DESTINATION of the OTDR baseline records before closing Form 219.**

**The O&M handoff gap:**

OTDR SOR files serve two entirely different purposes:
1. **Acceptance evidence** — proves the fiber plant met threshold on the day of test (R-4 M-1's spoliation angle).
2. **Maintenance baseline** — every future fault-location event requires comparing the current OTDR trace against the acceptance trace to determine whether the degradation is new or pre-existing, and to measure event distance accurately.

The second purpose is the maintenance crew's daily reality. When fiber is cut or degraded 3 years post-acceptance, the maintenance technician loads the original OTDR SOR file, overlays it against the current trace, and measures the distance to the fault from the stored baseline. If the baseline SOR file:
- Was never archived (contractor formatted the laptop after project close)
- Was archived in a proprietary format that a different OTDR manufacturer's software cannot open
- Was saved with incorrect distance markers (launch cable length not subtracted, no fiber index of refraction confirmed)
- Is a single-end trace rather than a bidirectional average (missing the reverse-direction perspective for accurate event distance)

...then the maintenance crew is flying blind for the life of the plant.

**7 CFR §1755.404 requires the inspector to WITNESS acceptance tests.** This witness role includes verifying that the data FORMAT is per Format V (or contract specification) and that records are captured. But "witnessing" is currently taught in T13 as presence during testing (see T13.L07 R-1 LO coverage) — not as VERIFICATION of the archival output the maintenance team will use.

**What T13.L07 must add:**

Add to the Form 219 close-out lesson: "Test Record Archive Quality Check." Before the inspector signs Form 219, the following must be verified for all OTDR records:

1. **Bidirectional traces:** OTDR measurements taken from BOTH ends for all fibers per 7 CFR §1755.404(a)(1). Single-end traces are insufficient for maintenance baseline use — they can miss events near the far end and give inaccurate event-distance measurements due to launch-cable effects.

2. **Archive format:** SOR files (standard instrument file — `.sor` extension, Telcordia GR-196-CORE format) delivered in ADDITION to any PDF summary report. The PDF report says "passed"; the SOR file IS the trace. Without the SOR file, the maintenance team cannot open the baseline trace in their own OTDR software.

3. **Launch cable subtraction confirmed:** The OTDR test tech notes the launch cable length in the Format V record. Failure to subtract the launch cable means the event distances in the SOR file are systematically offset by the launch cable length — every fault-location event produces a wrong "feet from splice case" number.

4. **Archive destination confirmed:** The borrower (owner, not the contractor) holds the master SOR archive. The contractor's test tech leaves the job after Form 219. If the SOR files are only on the contractor's laptop, the borrower has no maintenance baseline. The inspector's Form 219 sign-off must include confirmation that SOR files were delivered to the owner's designated IT storage or GIS system, not just listed on a CD submitted to the engineer's file.

**vocabulary_introduced (new for T13.L07):** `OTDR baseline archive`, `SOR file (archive copy)`, `bidirectional trace requirement`, `launch cable offset`

**vocabulary_assumed:** `OTDR, SOR file → T12` (authored — T12 covers OTDR testing in detail)

**Cross-reference:** T12 teaches OTDR test procedure; T13.L07 teaches the inspector's verification that the archival output meets O&M handoff requirements. These are distinct teaching points — T12 teaches HOW to run the OTDR, T13.L07 teaches WHAT the inspector verifies about the output before acceptance.

---

## §2: GIS/811 Locate Baseline — Inspector's As-Built Accuracy Verification Is Absent

### FINDING R10-H2 (HIGH) — T13 Has No Lesson Teaching the Inspector's Role in Verifying As-Built GPS Accuracy as the 811 Locate Baseline

**Primary sources:**
- ASCE 38-22: QL-A (highest accuracy) requires horizontal accuracy ≤0.2 ft (60 mm) and vertical accuracy ≤0.1 ft (30 mm) for buried utilities. QL-B (geophysical detection) is the field-survey baseline used for most telecom as-builts; QL-D (records research only) is the weakest.
- City of Port St. Lucie Fiber Optic Network Minimum Design Standards 2023 §4.2: "All GPS points shall have sub-meter accuracy. All fiber optic as-builts shall be turned in to the Information Technologies Department for update to the Master Fiber Optic Network records."
- FOA OSPDR / general industry practice: "Records should be kept current and available with GPS coordinates to provide quick access... to be utilized in restoration efforts."
- R-7 M-2 (different finding): addresses Call-811 ticket safety at INSPECTION TIME. This finding is about the QUALITY of the GIS record that the 811 one-call system will use for the LIFE OF THE PLANT.

**What R-1 through R-9 covered on as-builts:**
R-1 includes "as-built drawings" as a Form 219 component. R-1 T13.L07 defines `as-built drawings` as "contractor-revised drawings showing the cable route as actually installed." R-2 C-10 corrects the "contractor stamped" language. R-3 confirms. **Zero rounds address the GPS accuracy quality level the inspector must verify in the as-built drawings before accepting them as a Form 219 component.**

**The O&M handoff gap:**

The 811 one-call center's response — when someone calls to locate buried fiber before digging — is based on whatever GIS record the borrower submitted at project acceptance. If the as-built drawings the inspector accepted contain GPS coordinates with ±10 ft accuracy (typical of hand-plotted "as-built from redlines" without field GPS), the 811 locate tech marks the pavement 10 ft from where the fiber actually is. The excavator digs where they're told — and cuts the fiber.

This is not a hypothetical. The ASCE 38-22 framework exists precisely because QL-D (records-only) buried utility data is routinely wrong by meters, and that wrongness causes utility strikes.

**The inspector's role at Form 219:**

The inspector reviewing as-built drawings before Form 219 sign-off is the LAST HUMAN CHECK on the locate-record quality before that record becomes the operational GIS baseline for the life of the plant (20-30 years). T13.L07 does not teach inspectors:

1. **What "as-built accuracy" means in ASCE 38-22 terms.** An as-built "staking sheet" submitted with interpolated distances from pole-to-pole is QL-C or QL-D quality (visible features, no field GPS). For buried conduit at a road crossing, QL-A or QL-B quality (GPS or geophysical survey with confirmed coordinates) is required for a reliable locate record.

2. **What GPS accuracy the owner will use to respond to 811 tickets.** Sub-meter GPS (RTK or high-accuracy handheld) vs. consumer-grade GPS (±10 ft) produces profoundly different locate outcomes. The inspector must verify whether the field GPS method used matches the project specification.

3. **Who gets the as-built.** The Form 219 as-built drawing goes to the engineer's file and RUS loan record. But the GIS-navigable version must go to the borrower's operations center AND be registered with the 811 one-call system for the appropriate locate jurisdiction. If the inspector only verifies that a PDF drawing was submitted to the engineer, the operations team may not receive the GIS-navigable version that powers 811 locate responses.

4. **Critical-crossing depth documentation is a locate record, not just a compliance record.** When an underground inspection records "36 inches at Station 22+40, State Road 234 crossing," that measurement IS the locate record for that crossing's vertical position. The as-built drawing that includes this measurement is what the 811 locate tech and excavators use to determine "safe dig depth" at that crossing for the life of the cable.

**What T13 must add:**

Add to T13.L07 (or T13.L04 for crossing-specific depth records):

**As-Built GPS Quality Verification Checklist:**
- Verify method used for GPS data capture (RTK = sub-meter, consumer handheld = ±3–10 m, interpolated from design = unknown)
- Verify horizontal accuracy meets project specification (typical minimum: sub-meter)
- Confirm as-built includes vertical depth at all critical crossings (roads, railroads, waterways) from the inspector's own depth-probe records
- Confirm the as-built is delivered in GIS-navigable format (not just PDF) to the borrower's operations center
- Confirm borrower has registered or will register the route with the applicable 811 one-call center

**vocabulary_introduced (new for T13.L07):** `as-built GPS accuracy`, `ASCE 38-22 Quality Level (D/C/B/A)`, `811 locate registration`

**vocabulary_assumed:** `Call-811, locate ticket → T10.L01`, `as-built drawings → T10.L11`

**Cross-reference:** This finding builds on T10.L01 (Call-811 introduction) and T13.L04 (depth-probe records at crossings). The inspector's role at Form 219 sign-off is to close the loop: the measurements from T13.L04's depth probe become the GIS locate record baseline via the as-built accuracy verification in T13.L07.

---

## §3: Slack Location Record — Inspector Documentation That Maintenance Needs

### FINDING R10-M1 (MEDIUM) — T13.L05 Does Not Teach the Inspector to Create or Verify a Slack Location Register That Maintenance Crews Can Use for Emergency Restoration

**Primary sources:**
- Light Brigade Emergency FTTx Restoration Best Practices: "Quick access to slack locations is critical for emergency restoration — without a slack register, field crews spend 30–90 minutes locating and retrieving slack before the first emergency splice can be made."
- FOA OSP basics: "Records should be kept current and available with GPS coordinates... for restoration efforts."
- General OSP industry practice: slack registers are maintained separately from as-built drawings in most carrier OSP operations systems.

**What R-1 through R-9 covered on slack:**
R-1 covers slack inspection (quantity, coil geometry, storage locations). R-2 C-8 identifies the T13.L05 vs T10.L06 MSA numeric contradiction. R-3 confirms. R-5 M-3 identifies the missing sample inspection log entry format. **Zero rounds address whether the inspector's slack records produce a MAINTENANCE-USABLE slack location register.**

**The O&M handoff gap:**

When a fiber cable is cut (storm damage, dig-in, vehicle strike), the emergency restoration crew needs to know where the nearest accessible slack is IMMEDIATELY — not after a 90-minute drive-to-the-splice-case and a search of the vault. The slack register is the O&M document that enables rapid emergency response.

T13.L05 teaches the inspector to verify slack quantity and coil geometry. It does NOT teach the inspector that the RECORD produced by this verification is a primary maintenance document, or what that record must contain to be operationally useful.

A slack inspection record that says "Closure A: 30 ft, compliant" gives the Form 219 what it needs. It does NOT give the maintenance crew:
- GPS coordinates of Closure A's vault or pedestal location (where exactly on the route is this closure?)
- Type of structure (aerial closure? underground vault? pedestal? direct-buried splice bag?)
- Access method (does this vault require a key? a specific tool? is it locked?)
- Nearest street address or landmark (when dispatching an emergency crew at 2 AM, "Station 42+40" is useless without a street reference)

**What T13.L05 must add:**

Add to L05 scope: "Slack Location Register — What the Inspector's Records Must Contain for O&M Usability."

The inspector's slack verification record must include (in addition to the quantity check):
- GPS coordinates of the closure location (lat/long to sub-meter accuracy)
- Physical structure type (aerial, handhole, vault, pedestal — each has different access time and crew requirements)
- Lock/key requirements (if locked: what key, where is it kept?)
- Nearest street address or intersection
- Cable designation at this point (matches the GIS record and as-built drawing)

Without these fields, the slack verification "passes" the Form 219 check but fails the maintenance crew who arrives at 2 AM to restore service to 500 customers.

**vocabulary_assumed (add to L05):** `GPS coordinates (sub-meter) → T13.L07 (new O&M section)`, `cable designation → T13.L05 existing label verification`

---

## §4: Hardware Lot Traceability — Inspector's Warranty-Anchor Role

### FINDING R10-M2 (MEDIUM) — T13.L07 Does Not Teach the Inspector's Role in Creating Hardware Traceability Records That Enable Warranty Claims

**Primary sources:**
- UFGS 33 82 00 Telecommunications OSP §01 78 00 (DoD closeout submittals): "Cable Manufacturer's Certification of Quality and Performance is required." Hardware batch/lot numbers are part of the closeout submission for warranty traceability.
- FAR Part 46.705: "Warranty clauses shall not limit the Government's rights under an inspection clause in relation to latent defects."
- General industry practice: hardware manufacturer warranties (splice closure, conduit, messenger strand, hardware) are tied to installation batch records for claim processing.

**What R-1 through R-9 covered on hardware:**
R-1 lists "material certification" as a Form 219 component. R-2 G-9 identifies that `RUS-listed material` and `MAST approved product list` are not defined or explained in the lesson. **Zero rounds address inspector's role in hardware LOT/BATCH traceability for warranty claim purposes.**

**The O&M handoff gap:**

Hardware failures on OSP plant — splice closures failing 18 months after installation, messenger strand creep causing sag violations, conduit elbows cracking at UV exposure — are warranty issues if the hardware is within the manufacturer's warranty period and was installed per specifications. Warranty claims require proof of:
1. What hardware was installed (make, model, catalog number)
2. What BATCH or LOT number (because warranties apply to specific production batches, not product lines generally)
3. That installation followed the manufacturer's instructions (the inspector's log of hardware installation is the evidence)

If the inspector's Form 219 material certification only says "splice closures: RUS-listed, 100 units, ABC Corporation" without the lot numbers, and a closure fails 18 months later, the manufacturer's warranty claim process asks "what lot was this?" — and the answer is "we don't know because the inspector didn't record it."

The inspector's material certification verification at Form 219 is the point at which lot/batch traceability can be confirmed or not. The inspector is present at material installation; the contractor's QC records include batch numbers; the inspector's sign-off on material certification should confirm batch-level traceability is documented.

**What T13.L07 must add:**

Add to the material certification section of L07: "Hardware Traceability for Warranty Claims."

The Form 219 material certification is not just about RUS-listed status — it creates the chain of custody for warranty claims over the plant's life. The inspector must verify:
1. Manufacturer's certification letters include batch/lot numbers (not just model numbers)
2. Installation records confirm batch numbers match delivered materials (reel/lot tags were not discarded before installation)
3. Installation method records confirm manufacturer installation requirements were followed (some warranty claims are voided by non-compliant installation)

**vocabulary_assumed:** `RUS-listed material, MAST approved product list → T13.L07 (per R-2 G-9 gap fill)` and `manufacturer installation instructions → T13.L03 (hardware torque compliance context from R-2 C-4)`

---

## §5: Test Record Format Compliance — 7 CFR §1755.404 Primary-Source Finding

### FINDING R10-M3 (MEDIUM) — T13.L07 References "RUS 1753F-401" for Test Reports But the Controlling Citation for Acceptance Test FORMAT Is 7 CFR §1755.404 + Format V (§1755.407)

**Primary source (direct eCFR read):**
- **7 CFR §1755.404(b):** "The measurement data shall be recorded. A suggested format similar to Format V, Outside Plant Acceptance Test — Fiber Optic Telecommunications Plant, in §1755.407, or a format specified in the applicable construction contract may be used."
- **7 CFR §1755.404(a)(1):** "Optical time domain reflectometer (OTDR) measurements shall be made from both ends of each fiber at both 1310 and 1550 nanometer wavelengths." (Bidirectional requirement — primary-source confirmation of R10-H1.)
- **7 CFR §1755.400(b):** "The tests and inspections shall be witnessed by the borrower's resident project representative." (Inspector witnessing is not optional — it is a CFR requirement, not just industry practice.)

**What R-1 through R-8 covered:**
R-1 cites "RUS 1753F-401" as the test-standard authority for the Form 219 test report component. R-2 C-11 correctly notes that 7 CFR 1755 §1755.903 is the loan-draw authority. R-2 C-11 also notes that 1753F-401 (actually RUS Bulletin 1753F-401 = splicing standard, not the test standard) should be secondary to RUS 1753F-401. But the citation chain for ACCEPTANCE TEST FORMAT specifically (Format V) is not in any prior round.

**Forensic clarification:**

There are two different RUS documents in play:
- **7 CFR §1755.404** (codified regulation) = the ACCEPTANCE TEST FORMAT authority. This is the CONTROLLING document that specifies Format V and the bidirectional OTDR requirement. It is a regulation, not a bulletin.
- **RUS Bulletin 1753F-401** (= the splicing standard, not the acceptance test standard) — R-1's citation is AMBIGUOUS. The actual "acceptance test" bulletin referenced in industry is **7 CFR §1755.400-407** (the codified standard itself). "1753F-401" in R-1's brief may be a citation error — 1753F-401 is the splicing bulletin, not the acceptance test standard.

**What T13.L07 must correct:**

1. The Form 219 test report component must cite **7 CFR §1755.404 + Format V per §1755.407** as the controlling format authority (not just "RUS 1753F-401" which is the splicing standard).
2. T13.L07's "witnessing" teaching point must explicitly cite 7 CFR §1755.400(b) as the inspector-witness requirement — this is a regulatory obligation, not best practice.
3. The bidirectional OTDR requirement (both ends, both wavelengths) is in 7 CFR §1755.404(a)(1) — this is a regulatory minimum that the inspector's Form 219 sign-off must confirm was satisfied. If only single-end traces are in the file, Form 219 cannot be closed per §1755.404.

**vocabulary_introduced (new for T13.L07):** `Format V (7 CFR §1755.407)`, `inspector witness (regulatory — 7 CFR §1755.400(b))`

---

## §6: Warranty Period Establishment — Inspector's Missing Role as Warranty Clock Starter

### FINDING R10-L1 (LOW) — T13.L07 Does Not Teach That Form 219 Acceptance Date Is the Warranty Start Date for Plant Components and Subcontractor Work

**Primary source:** FAR Part 46.705(b): "Warranties establish a stated period of time or use... after acceptance by the Government to assert a contractual right for the correction of defects."

**The O&M handoff gap:**

The date the inspector signs Form 219 is generally the date construction acceptance occurs, which is the WARRANTY START DATE for:
- Hardware manufacturer warranties (splice closures, conduit, strand — typically 12-24 months from acceptance)
- Subcontractor workmanship warranties (splicing contractor's warranty on fusion splice quality — typically 1 year from acceptance)
- Contractor's warranty on all plant as-built per contract (typically 1 year from substantial completion)

T13.L07 teaches the inspector to assemble and certify the Form 219 package. It does not teach that the inspector's signature on that date starts warranty clocks that the O&M team will need to track.

**What T13.L07 must add (small addition):**
Add a one-paragraph note: "The Form 219 acceptance date is typically the warranty start date for all plant components and contractor workmanship warranties. Ensure the borrower's operations team receives formal notification of this date and maintains a warranty tracking schedule — knowing WHEN each hardware component's warranty expires determines whether a failure is a warranty claim (contractor/manufacturer remediation at no cost) or an O&M repair event (borrower bears cost)."

---

## §7: Saturation Assessment

**Coverage of the O&M handoff framing by prior rounds (R-1..R-9):**

| O&M Handoff Topic | Prior coverage | R-10 status |
|---|---|---|
| OTDR SOR archive format and destination (bidirectional, SON file, owner archive) | R-4 M-1 covers spoliation/retention only — NOT archive quality or O&M use | NEW HIGH — R10-H1 |
| GIS/811 locate baseline GPS accuracy | R-7 M-2 covers 811 SAFETY at inspection time only | NEW HIGH — R10-H2 |
| Slack location register for emergency restoration | R-5 M-3 covers log FORMAT only; R-2 C-8 covers numeric conflict only | NEW MED — R10-M1 |
| Hardware lot/batch traceability for warranty claims | R-2 G-9 covers RUS-listed definition gap only | NEW MED — R10-M2 |
| 7 CFR §1755.404 Format V as controlling acceptance test format | Not addressed by any prior round | NEW MED — R10-M3 |
| Form 219 acceptance date as warranty clock start | Not addressed by any prior round | NEW LOW — R10-L1 |

**Saturation verdict: PARTIAL.** O&M handoff framing produced 2 new HIGHs, 3 new MEDs, 1 new LOW — all distinct from R-1..R-9. The HIGH findings are structural gaps in T13.L07 that affect the utility of the plant for its entire operational life. These findings are NOT primarily legal or safety — they are operational quality gaps.

**Remaining unresolved area:** T13 has no lesson explicitly covering the formal "plant acceptance to operations handoff" meeting or package (separate from Form 219 — the engineer delivers a plant-operations-ready handoff package to the borrower's NOC/operations center). This may belong in T13.L09 or as a new T13.L09a, but is close enough to R-8 H-1/H-2 scope that further saturation with a new framing (O&M handoff meeting protocol) may be more efficiently folded into the author prompt rather than requiring another research round.

**Orchestrator saturation recommendation:** The HIGH findings from O&M handoff framing (R10-H1: OTDR baseline archive verification; R10-H2: GIS/811 locate baseline GPS accuracy) are new and distinct. The MED/LOW findings are incremental. If the canonical already has 17+ HIGHs and 30+ MEDs from R-1..R-9, the author prompt has sufficient scope to deliver a complete T13. One final R-11 framing (infrastructure-owner/NOC perspective — how the plant-operations handoff meeting is conducted) may be dispatched at orchestrator discretion, or the author wave can proceed with instruction to independently research the handoff-meeting protocol for T13.L01 expansion.

---

## §8: Cross-Lesson Convergence With Prior Findings

### R10-H1 extends and diverges from R-4 M-1:
- R-4 M-1: SOR files are evidentiary records; retain per statute of repose period; inspector must address retention obligation in T13.L07.
- R-10 H-1: SOR files must be bidirectional, in SOR format (not just PDF), with launch-cable offset confirmed, and delivered to the OWNER (not contractor) as the maintenance baseline. The inspector's Form 219 sign-off must verify these archival quality elements per 7 CFR §1755.404(b) and §1755.407 Format V.
- **These are different teaching points.** Author must include BOTH: retention obligation (R-4 M-1) AND archive quality/format/destination verification (R-10 H-1).

### R10-H2 extends and diverges from R-7 M-2:
- R-7 M-2: Inspector must confirm 811 ticket is active before depth-probing at inspection visit (safety, one-time event).
- R-10 H-2: Inspector must verify as-built GPS accuracy quality level and confirm GIS/811 registration handoff as Form 219 close-out step (operational quality for plant's entire life).
- **Different scope, different lesson target, different timing.** R-7 M-2 applies at every inspection visit (T13.L04). R-10 H-2 applies at Form 219 close-out (T13.L07).

### R10-M3 resolves the R-2 C-11 / R-1 citation ambiguity on test standards:
- R-2 C-11 correctly flagged that "NECA/FOA 301" should be secondary to "RUS 1753F-401" for the test report component of Form 219.
- R-10 M-3 adds: the CONTROLLING FORMAT authority is 7 CFR §1755.404 + Format V (§1755.407), which is a regulation — not "RUS 1753F-401" (the splicing bulletin). Author must cite the regulation directly rather than the bulletin.
- **Author resolution:** T13.L07 test-report teaching must cite 7 CFR §1755.404 as primary, with RUS bulletins as secondary.

---

*=== T13 CONTENT RESEARCH R-10 END ===*
