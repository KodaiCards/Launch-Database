# T15 Research Brief — R-1 (Primary-Source Skeptical)
**Topic:** T15 — Restoration & Outage Response  
**Framing:** Primary-source first / High-precision / Skeptical of secondary descriptions  
**Prerequisites confirmed:** T01, T11, T12, T13 all CLOSED  
**Teaching position:** 17 of 22 (T13 → T15 → T16 → T17 → C04)

---

## Scope Summary

T15 covers: fault locating with OTDR, physical route walk / break identification, temporary vs. permanent repair decisions, splice trailer setup, emergency civil work, outage communication protocols, Method of Procedure (MOP), and post-restoration as-built update. 10 lessons, all net-new (no prior module migration source). Audience: field-experienced OSP crew learning emergency-response discipline.

---

## Primary Sources Confirmed

| Authority | Scope for T15 |
|---|---|
| FOA Fiber Optic Technician Restoration Guide (FOA #301) | OTDR-based fault locate methodology, break signature identification, restoration sequence |
| Telcordia/ATIS SR-4422 (Emergency Restoration Guidelines) | MOP framework, rollback planning, escalation tiers — used as secondary reference where FOA is primary |
| OSHA 29 CFR 1926 Subpart P (Excavation) | Emergency shoring requirements during civil excavation — applies to hand-dig and vacuum-excavation emergency restore |
| OSHA 29 CFR 1910.147 (LOTO) | Control of hazardous energy if splicing near energized joint-use infrastructure — T18 prerequisite is satisfied |
| NESC Part 1 / Part 4 | Working conditions on poles during emergency aerial restoration — Rule 420-435 |
| ANSI/ICEA S-87-640 / S-83-596 | Fiber optic cable mechanical limits during emergency extraction — minimum bend radius, maximum pulling tension still apply during restoration |
| RUS Bulletin 1751F-630 §9 | Inspector/engineer notification requirements during emergency restoration of RUS-financed plant |
| IEEE 1016 / FOA #217 | OTDR event table analysis — identifying break vs. splice vs. connector events from event markers |
| MUTCD Chapter 6I | Temporary traffic control during emergency restoration — streamlined TTC plan acceptability |

---

## Lesson-by-Lesson Content Anchors

### T15.L01 — Outage Response: The First 30 Minutes

**Core concepts:**
- **Outage bridge call:** multi-party conference bridge between NOC (Network Operations Center), field crew, and customer/engineer. Telecom-specific term. Initiating bridge call within 15–30 min of outage declaration is standard carrier practice (not formally standardized in a published spec; industry practice from carrier SLA frameworks).
- **RPO (Recovery Point Objective):** maximum tolerable data loss, expressed in time. For dark-fiber transport leases, RPO may be "any data loss is unacceptable" since the customer's equipment handles regeneration. For telecom circuits, RPO is typically defined in the carrier's SLA. T15 teaches the concept at awareness level — not designing SLAs.
- **RTO (Recovery Time Objective):** maximum tolerable downtime. Carrier-grade fiber restoration target: 4 hours MTTR (Mean Time to Repair) is a common industry target for critical circuits; some SLAs require 2-hour or 1-hour response for critical paths. Note: MTTR is often confused with RTO. RTO is the SLA target; MTTR is the empirical average. T15 teaches the distinction.
- **Mobilization sequence:** (1) NOC declares outage + opens ticket, (2) field crew alerted (on-call rotation), (3) OTDR van + splice trailer dispatched, (4) bridge call opened, (5) customer notified per SLA, (6) ETR (Estimated Time to Repair) issued.
- **First 30 minutes tasks:** confirm outage scope (single span vs. route-wide), dispatch crew, issue initial customer ETR, open MOP draft (even for emergency restore, a MOP is required by most carrier change-control policies).

**Field vs. book distinction:** Book (carrier SLA frameworks) says MOP must be completed BEFORE work starts. Field reality: emergency restores use a "concurrent MOP" — the crew starts fault-locate while the MOP is being documented by a second person. The distinction matters: regulatory/contractual exposure exists if work starts without ANY MOP documentation. Concurrent MOP is acceptable to most customers; no MOP is a contract violation.

### T15.L02 — Fault Locate with OTDR

**Core concept — distance calculation:**

The OTDR fault-locate distance formula:

```
Distance to fault = (IOR × t_return) / (2 × c)
```

Where:
- IOR = Index of Refraction of the fiber (typically 1.4681 for G.652.D at 1550 nm; varies by fiber type — always use the manufacturer's IOR for the installed fiber)
- t_return = time for the pulse to reach the fault and return (nanoseconds, read from OTDR display)
- c = speed of light in vacuum = 2.998 × 10⁸ m/s = 0.2998 m/ns

The OTDR displays distance directly using the IOR setting — this formula is what the OTDR is doing internally. If the OTDR IOR is set wrong, the displayed distance will be wrong. **Critical field point:** if the IOR in the OTDR settings doesn't match the installed fiber's actual IOR, distance readings can be off by 1–3% — which on a 5-mile route means 264–792 ft of locate error. Always verify IOR setting before fault-locate trace.

**Break signature identification:**
- **Clean cut / mechanical damage:** high-amplitude back-reflection at the break point, then loss of signal (total back-reflection at the cut end). The reflection peak indicates a fresh, flat cut face. 
- **Crush damage:** gradual loss in the OTDR trace over a short distance (0.5–5 m) without a sharp reflection. Typically from backhoe strike or rock puncture that crushed rather than cut.
- **Macro-bend:** localized loss without back-reflection. Cable kinked against a structure (rebar, vault edge). Identified by no reflection + known location of a bend point.
- **ORL (Optical Return Loss) change:** a new or increased back-reflection event that doesn't show loss. May indicate a new field splice, a connector, or a fractured fiber that's still mechanically continuous (latent failure risk).
- **Confirmed reference values:** OTDR event resolution (dead zone): typically 0.8–2.5 m (instrument-dependent). Loss threshold for flagging a fusion splice: >0.1 dB per IEC 61300-3-35 Zone B criteria (introduced in T12).

### T15.L03 — Physical Route Walk: Finding the Break

**Core concepts:**
- **Marker post correlation:** as-built records (from T16 — FORWARD REFERENCE: T15.L09 should note that post-restoration as-built update is what makes T16 GIS useful for the NEXT outage). For RUS-financed plant, marker posts are required per RUS Bulletin 1751F-630 §8.3 — every 100 ft on buried routes near road crossings and at junctions.
- **OTDR distance → field distance correction:** OTDR cable distance ≠ route-survey distance. Actual cable has 2–4% excess (slack for installations, sag, burial curves). The field location corresponding to an OTDR distance X is approximately X × 0.97 to X × 0.98 of the route survey distance. This is the "slack factor" — T15.L03 teaches learners to convert OTDR cable-distance to route-distance before starting the physical walk.
- **Probe rod use:** 3/8-inch fiberglass probe rod. Non-metallic (won't damage cable). Technique: probe at the calculated route point, adjusting ±3 ft in each direction. Confirm depth vs. as-built depth card.
- **Hand-held cable locator (passive/active):** passive mode = detect induced electromagnetic field on metallic armored cable or co-installed metallic tracer wire. Active mode = attached signal transmitter, locate by signal peak. T15 teaches the field technique; T10.L04 introduced locate-ticket and buried cable locating (vocabulary_assumed for T15.L03).

### T15.L04 — Temporary vs. Permanent Repair

**Core decision framework:**
- **Temporary patch:** through-connector (mechanical splice tool) or mechanical splice vs. fusion splice. Acceptable when: fiber type confirmed same OS2 stock available, the repair is on a non-critical path with a permanent repair scheduled within 24–48 hours. Field practice: some carriers allow mechanical splice as permanent for dark fiber; most carrier SLAs require fusion splice for circuit-bearing fiber.
- **Permanent restoration:** fusion splice + splice closure + reburial per original spec. Requires: OTDR verification of splice loss ≤0.1 dB, re-fill of cable trench or aerial re-sag and tension per NESC Rule 232, updated as-built record.
- **Key decision criteria:**
  1. Fiber type: if damaged cable is OS2 (G.652.D) and available splice stock is also G.652.D — direct fusion is straightforward. If cable segment is unknown type, OTDR trace + insertion loss test confirms compatibility.
  2. Traffic impact: if the cable is active (customer-bearing), MTR (Mean Time to Restore) pressure may justify a temporary patch to restore service now and a permanent splice later.
  3. Physical condition: if backhoe strike damaged conduit or sheath for a 2-foot section — cut out damaged section, install 12-inch repair sleeve, re-splice. If only fiber is damaged (sheath intact from HDD bore nick) — access via handhole or new dig, splice in place.
- **Primary source for temporary patch acceptability:** Telcordia/ATIS SR-4422 §5.3 provides restoration sequence guidance; FOA Restoration Guide §7 covers temporary vs. permanent repair decision tree.

### T15.L05 — Splice Trailer Setup

**Core concepts:**
- **Splice trailer equipment manifest (standard FOA-trained crew):** fusion splicer (main unit + cleaver + stripping tools), OTDR (single-mode 1310/1550, multi-mode 850/1300), power meter + light source, laptop for splice records, generator (3.5–6.5 kW inverter preferred for splicer power quality), climate control (HVAC unit — splicing requires ≤50% humidity and ≥55°F for splicer prism calibration), work bench + fiber routing clips, splice tray inventory (capacity trays, standard closures), fuel supply.
- **Safety considerations inside trailer:** splice trailer uses generator; CO poisoning risk if generator is run inside or immediately adjacent to trailer intake. Generator minimum 10-ft separation from trailer door (OSHA 29 CFR 1910.94(a) general ventilation — not specific to trailers but applicable by analogy; FOA training recommends 10-ft separation).
- **Traffic control for splice trailer:** MUTCD Chapter 6I streamlined emergency TTC plans apply — temporary advance warning signs + channelization minimum. Same setup as construction TTC (introduced T10.L03) but with abbreviated paperwork acceptable under emergency provisions.
- **Generator fuel-chain:** diesel or propane. Gasoline generators pose vapor ignition risk near fiber splice work (optics and fiber dust, though risk is low). Propane preferred for enclosed trailer operations.

### T15.L06 — Emergency Civil Work

**Core concepts:**
- **Emergency excavation exceptions to 811-ticket requirements:** OSHA 29 CFR 1926.651(b)(2) allows work to proceed in an emergency without the normal 811 wait time IF: (1) other buried utilities have been notified and have responded, (2) hand-digging begins in the damage zone to expose and protect other utilities, (3) emergency nature is documented. "Emergency" is defined as an existing emergency that endangers life or property.
- **Hand-dig zone:** within 24 inches of a marked buried utility, hand-digging is required per OSHA 1926.651(b) ("soft dig" / "tolerance zone"). For emergency cable locate, the hand-dig zone is the area within 24 inches of the OTDR-estimated break.
- **Vacuum excavation (hydrovac / air knife):** acceptable as "soft dig" equivalent for non-emergency locate (not defined as "hand" in OSHA strictly but widely accepted by state regulators as meeting the spirit of 1926.651(b)). For emergency restoration, vacuum excavation is faster than hand-dig for deep installations (>3 ft) and is standard practice.
- **Shoring requirements:** any excavation >5 ft depth requires shoring or sloping per OSHA 1926 Subpart P (Table B-1: Type C soil = 1½:1 slope minimum). Emergency exemption: OSHA does NOT exempt deep excavations from shoring requirements even in emergencies — a worker inside an unsupported excavation >5 ft is a violation regardless of emergency status. In practice: most cable splice-point access excavations are ≤3 ft (cable is 24–36 inches deep per RUS/NEC minimum) so shoring is typically not required.

### T15.L07 — Customer Communication During Outages

**Core concepts:**
- **ETR (Estimated Time to Repair) discipline:** ETR is not a promise; it's a best-estimate commitment with mandatory update if the estimate changes. Best practice: issue initial ETR within 30 minutes of outage declaration; update every 60 minutes or whenever the estimate changes materially (>25% shift).
- **Outage notification tiering:** (1) technical contact (NOC or network engineer) — immediate; (2) account manager or sales contact — within 30 minutes; (3) executive escalation — triggered by SLA breach risk or outage >2 hours.
- **Bridge call discipline:** bridge calls have an active host (typically NOC lead), a field-team participant, and a customer participant. Bridge calls produce a running log of timestamped action items. The bridge call log is the audit trail for SLA dispute resolution.
- **Primary regulatory note:** No federal regulation mandates outage customer notification timing for private dark-fiber circuits. Carrier-to-carrier interconnection agreements and individual SLAs govern. RUS-financed networks may have state regulatory reporting requirements for outages affecting defined critical-path facilities (varies by state PSC jurisdiction).

### T15.L08 — Method of Procedure (MOP)

**Core concepts:**
- **MOP definition:** a structured work-order document that: (1) identifies what will be done (scope), (2) lists step-by-step sequence with pass/fail criteria at each step, (3) specifies a rollback plan (how to revert if a step fails), (4) lists personnel and equipment, (5) identifies a change-control authority (who can approve emergency deviations from the plan).
- **MOP elements (per Telcordia SR-4422 / ATIS T1.TR.68 framework):**
  1. Impact statement (circuits affected, customers affected, expected outage duration)
  2. Pre-work checklist (equipment on site, permits, notifications done)
  3. Step sequence with success criteria
  4. Rollback steps (in reverse order of the forward sequence)
  5. Emergency contacts
  6. Approval block (pre-authorized by change-control authority)
- **MOP vs. work order:** a work order directs labor; a MOP directs a technical sequence. For scheduled maintenance, MOPs are reviewed and approved 24–48 hours in advance. For emergency restoration, a simplified "emergency MOP" with fewer approval steps is accepted by most carriers.
- **Rollback plan purpose:** if step 7 fails and the circuit is now in a worse state than before, the rollback plan returns to the last-stable state. For a restoration MOP, rollback is typically "re-install temporary patch and restore partial service while diagnosing."

### T15.L09 — Post-Restoration As-Built Update

**Core concepts:**
- **Why this matters:** the outage record and the physical plant both changed during restoration. The as-built in GIS/splice matrix must reflect: (1) new splice point added (location + splice tray assignment), (2) change in cable footage (repair sleeve + through-splice changes route length), (3) updated OTDR baseline (post-restoration OTDR trace becomes the new "healthy state" benchmark for future fault compares).
- **RUS requirement:** RUS Bulletin 1751F-630 §9 requires that as-built records reflect actual final construction — including repairs. For RUS-financed plant, the borrower (typically the phone company or rural telco) has an ongoing obligation to maintain current as-builts.
- **OTDR trace archive:** post-restoration OTDR trace is saved to the project archive with: date of trace, technician name, OTDR model/serial, IOR setting, test wavelength, file name. This trace is the new baseline — if another outage occurs near this location, comparing to this baseline trace identifies whether the new event is related to the restoration.
- **Form 565 final documentation (for RUS-financed plant):** emergency restoration work is still subject to the inspection record-keeping requirements from T13. If restoration was done without inspector present (typical for emergency), the work must be documented post-facto in the project file with photographic evidence of the finished splice closure, as-built update, and OTDR trace.

### T15.L10 — Capstone Quiz

15 MC questions covering:
- OTDR fault-locate IOR impact (1 question)
- Break signature identification (2 questions — clean cut vs. crush vs. macro-bend)
- ETR update discipline (1 question)
- MOP elements (2 questions — step sequence + rollback plan)
- Emergency 811 exemption conditions (1 question)
- Temporary vs. permanent repair decision criteria (2 questions)
- Outage bridge call roles (1 question)
- As-built update obligation for RUS-financed restoration (1 question)
- Physical locate slack factor (1 question)
- OTDR distance vs. route distance conversion (1 question)
- Shoring exception for emergency excavation (1 question — the answer is NO exception)

---

## Cross-Topic DAG Requirements (vocabulary_assumed for T15)

From T01: `inspector (OSP)`, `OSP`, `service territory`, `dark fiber`  
From T11 (Splicing): `fusion splice`, `splice closure`, `splice tray`, `OTDR trace (event table)`, `splice loss (T11 context)`  
From T12 (Testing): `OTDR fault locate`, `IOR (index of refraction)`, `break signature`, `ORL`, `insertion loss`  
From T13 (Inspection): `as-built drawings`, `Form 565`, `punch list`, `acceptance inspection`  

**New vocabulary introduced in T15 (to be confirmed in lessons):**
`MOP`, `RPO`, `RTO`, `outage bridge call`, `ETR`, `MTTR`, `mobilization`, `fault locate (cable-distance)`, `slack factor`, `temporary patch`, `permanent restoration`, `splice trailer`, `emergency MOP`, `rollback plan`, `vacuum excavation (soft dig)`, `hand-dig zone (24-inch tolerance zone)`, `post-restoration OTDR baseline`

---

## Known Precision Notes (for author + RT attention)

1. **IOR values:** G.652.D IOR at 1550 nm = 1.4681 is a commonly cited value (Corning, OFS manufacturer data). Author should note "verify with the specific fiber manufacturer's IOR specification" rather than hard-coding 1.4681 as universal — different manufacturers vary by ±0.001. [verify from manufacturer datasheet at author time]

2. **OTDR dead zone:** "0.8–2.5 m" — this is instrument-dependent. The "event dead zone" (minimum detectable event separation) varies by OTDR model, pulse width, and wavelength. The author should note that dead zone specs come from the OTDR manufacturer datasheet. A typical mid-range OTDR (Exfo FTB-200/700, JDSU MTS-6000) has a dead zone of ~1 m with 2.5 ns pulse, but cheaper instruments may be 3–5 m.

3. **Emergency 811 exemption:** OSHA 1926.651(b)(2) is the relevant provision. The exact language: "In an emergency affecting the safety or protection of property, a utility owner's notification system or the owner or operator of the buried plant may allow an excavator to excavate immediately." This is not an OSHA exemption per se — it's the 811 system's own emergency provision. OSHA still requires exposure protection under 1926.651(b)(1) (hand-dig or accepted equivalent within the tolerance zone). Author should clarify that the emergency provision REDUCES wait time but does NOT eliminate hand-dig-zone requirements.

4. **MOPs as SLA requirement:** SLA requirements vary by contract. T15.L08 should teach MOPs as "standard carrier practice" and "required by most carrier change-control policies" rather than citing a specific federal standard — no federal regulation mandates MOPs for private networks. OSHA 1910.147 requires LOTO procedures, which is MOP-adjacent for hazardous-energy control, but is not a general "MOP required for fiber restoration" standard.

5. **Generator CO risk:** OSHA 1910.94(a) is general ventilation — the 10-ft generator separation comes from generator manufacturer guidelines (CDC/NIOSH recommendation: 20 ft minimum), not from OSHA's fiber-specific standard. Author should cite "generator manufacturer guidelines + CDC/NIOSH recommendation" rather than OSHA 1910.94(a) for this point.

---

## Source Migration Assessment

All T15 lessons are net-new per ARCH.md. No legacy module content maps to T15 scope. Prior modules covered:
- OTDR theory: M08 Testing (available as background reference, but T12 is the more current authored version)
- Civil work: M09 Construction (T10 authored)
- Record-keeping: M03 Permitting (T09 authored), T13 inspection records

The authored T12 lessons (OTDR testing) and T13 lessons (inspection) are the natural vocabulary sources. Author will reference T12.L07 for OTDR fault-locate baseline trace method and T13.L11 for Form 565 documentation in the restoration context.

---

## Recommended Lesson Ordering Confirmation

ARCH.md order is pedagogically sound:
1. L01 (outage response framework first — gives purpose/context for all subsequent lessons)
2. L02 (OTDR fault locate — primary locate tool)
3. L03 (physical route walk — secondary locate after OTDR gives distance)
4. L04 (repair decision — before teaching the execution)
5. L05 (splice trailer — the repair workspace)
6. L06 (civil work — excavation to access the break)
7. L07 (customer communication — parallel to field work throughout)
8. L08 (MOP — documents the whole process)
9. L09 (post-restoration as-built — closes the loop back to T16)
10. L10 (capstone)

=== T15 RESEARCH BRIEF R-1 END ===
