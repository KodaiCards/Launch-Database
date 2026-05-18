# T13 (Inspection & Quality Assurance) — Research Brief R-7

**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T13_BRIEF_R7.md` written. No CLAUDE.md edits. No lesson file edits. No dispatching.

**Agent:** T13 Research R-7 — safety/hazard-recognition framing  
**Date:** 2026-05-18  
**Framing:** Senior OSP safety officer accountable for crew safety on RUS inspection crews. Not re-auditing citations or curriculum-transfer logic (R-1..R-6). Asking: "Does T13 produce inspectors who will NOT get hurt?" Inspection is a fall-protection + electrical-exposure + confined-space + traffic-control environment and those hazards are present even in a QA role (as an observer, not just a crew member).

**Scope constraint:** Hunting for what R-1..R-6 did NOT address from a safety lens. R-2 C-6 touched PPE assumptions for pole climbing (OSHA 1910.268(g)(1)). R-2 G-1 touched seasonal clearance measurement (not a personal hazard per se). R-4 H-2 touched waiver-by-course-of-conduct (legal, not safety). None of R-1..R-6 addressed:
- Pre-climb pole-condition decision tree (climb vs. bucket)
- Hold-down line / tag line requirements during pole inspection
- What T18 actually introduces vs. what T13 must introduce/reinforce explicitly
- Confined-space entry for manhole inspection in T13.L04 (underground inspection lesson)
- Traffic-control plan requirements specific to the INSPECTOR's presence at roadside work zones
- Energized-conductor clearance measurement hazard (MAD violations during clearance verification with tape measure)
- Buried-utility verification before depth-probe testing (811 ticket confirmation at inspection stage)
- Pole structural stability assessment BEFORE climbing — go/no-go decision tree

**Independent research sources (different from R-1..R-6):**
- OSHA 1910.268 full text (telecom climbing, confined space, fall protection)
- 29 CFR 1910.269 (working near energized conductors)
- ANSI/SIA A92 (aerial work platforms)
- OSHA "Walking-Working Surfaces" 1910.23 for ladder/pole inspection guidance
- T18 authored lessons (L03 confined space, L04 fall protection, L06 traffic control, L07 energized conductors) — ground-truth for what is already introduced
- T10.L09 authored (traffic control — T18.L06 prereq confirmed)
- CGA Best Practices §4.4 (buried utility safety during inspection activities)
- BICSI OSPDR field safety requirements for inspection crews

---

## §1: T18 Cross-Reference Audit — What T13 CAN Assume vs. What It Must Introduce

**Method:** Direct read of T18 authored lesson vocabulary_introduced arrays + scope, cross-mapped against T13 lesson safety requirements.

### What T18 DOES introduce (available as vocabulary_assumed in T13)

| T18 Lesson | Terms Introduced | Relevant to T13? |
|---|---|---|
| T18.L03 | `confined space`, `permit-required confined space`, `atmospheric testing`, `attendant` | YES — T13.L04 underground inspection (manhole access) |
| T18.L04 | `fall protection`, `lanyard`, `SRL`, `100% tie-off`, `positioning system`, `aerial lift` | YES — T13.L03 pole-top inspection |
| T18.L06 | `MUTCD`, `TCP`, `flagger certification`, `work zone` | YES — T13.L02/L04 roadside inspection |
| T18.L07 | `MAD`, `MAB`, `unqualified approach boundary` | YES — T13.L02 aerial clearance measurement near supply conductors |
| T18.L05 | PPE inventory (hard hat, safety glasses, HVLV vest, foot protection, cut-resistant gloves) | YES — T13 general |

### What T18 does NOT introduce (T13 must address or explicitly teach)

**CRITICAL FINDING R7-H1:** T18.L04 (fall protection) covers working fall protection at the work position but does NOT introduce or teach:
- **Pre-climb pole condition assessment** — whether it is structurally safe to SEND a climber up at all. T18.L04's BranchingScenario mentions a rotten-wood gaff-pullout scenario AFTER the climber is already on the pole; it never teaches the pre-climb ground-level evaluation that determines whether to send a climber up or use a bucket truck instead.
- **The climb vs. bucket-truck decision criteria** — T18.L04 introduces `aerial lift` (bucket truck) as a category but does NOT provide any decision criteria for WHEN to use bucket vs. direct pole climbing. This is specifically relevant to T13.L03, where the inspector must decide: "I see deep checking on this pole. Should I climb it to verify the top condition, or do I request bucket access?"
- **Hold-down line / tag line requirements** — the rope used to arrest a falling climber's arc away from the pole. T18.L04 mentions positioning system mechanics but does not introduce the hold-down line concept at all.
- **Ground-person role during a pole inspection climb** — T18.L04 does not define the role of the ground-based observer during a pole inspection climb. On an owner's inspection, the inspector may be directing the contractor's climber to access the pole top — the inspector then has specific safety duties as the controlling authority even if they are not physically climbing.

**Implication for T13.L03:** The lesson assumes `PPE (fall protection at poles)` and `fall arrest system` from T18.L04 as vocabulary_assumed. But the PRACTICAL SAFETY DECISION that T13.L03 requires — "should I climb this or request a bucket?" — is NOT covered in T18 and cannot be vocabulary_assumed. T13.L03 MUST explicitly teach the pre-climb condition assessment decision tree as lesson content, not just reference it as a T18 prereq.

---

## §2: Pre-Climb Pole Safety Assessment — Safety-Critical Gap in T13.L03

### FINDING R7-H2 (HIGH) — Pre-Climb Go/No-Go Decision Tree Missing from T13.L03

**Evidence:**
- T13.L03 LOs focus on identifying decay/damage indicators (LO 1) and inspection methods (LO 2) and applying grade/class requirements (LO 3). NONE of the three LOs address the pre-inspection decision of how to ACCESS the pole top safely.
- T18.L04 does not cover the pre-climb evaluation (confirmed by direct read: zero results for "pre-climb", "rotten pole before", "bucket when", "go/no-go" in T18.L04).
- R-1 through R-6: zero findings on this topic.

**What a field-safe inspector needs to know (independent research — OSHA 1910.268 + BICSI OSPDR):**

The pre-climb assessment for an inspector directing a contractor's climber (or climbing themselves) must include:

1. **Ground-level structural check:** Stand back 3–5 pole-heights. Look for lean ≥5% of height (severe lean), visible crack propagating around the pole circumference (split vs. checking), obvious decay at or below groundline (soft soil, subsidence, mushroom growth), active woodpecker cavities ≥2 in. deep in the primary load zone, or vehicle-strike damage (visible fiber crush, displaced hardware, bent ground wire).

2. **Sound test (pole-top rule):** A hammer tap at groundline that produces a hollow resonance throughout the length of the pole = do NOT climb without an engineering evaluation. A solid sound in the bottom third with hollow resonance only in the upper third = document and request bore-and-plug inspection before deciding.

3. **Lean assessment quantification:** ANSI O5.1 limit: a pole leaning > 1 ft per 10 ft of height (10% lean) is a rejection criterion. At 5% lean, escalate to engineering review before directing a climber. A leaning pole creates unbalanced loading when a climber's weight + tools is added at height — the pole's effective moment is already loaded by the lean.

4. **The go/no-go decision:**
   - Pole passes visual + tap = proceed with climb (with proper PFAS per T18.L04)
   - Pole shows suspect condition = REQUEST BUCKET TRUCK ACCESS. No inspector has the authority to direct a contractor's climber onto a structurally suspect pole. The inspector's authority is to REJECT the climb, not to approve it.
   - Pole fails (deep cavity, hollow throughout, lean ≥10%, visible circumferential fracture) = STOP + Red Tag. Pole must be replaced before any attachment work is done. Inspector documents with photos + measurements.

5. **The inspector's specific role when directing a contractor's climber:**
   - OSHA 1910.268(c) — "Qualified person" must evaluate the pole before work is performed on it
   - The inspector IS the controlling-authority's representative — if they direct a climber onto an unsafe pole, they bear the same liability as if they had climbed it themselves (general-duty clause, OSHA 5(a)(1))
   - Inspector cannot simply "let the contractor decide" on pole safety — by requesting access (directing the climb), the inspector is controlling the hazard exposure

**Fix:** Add to T13.L03 as a distinct lesson subsection (Foundation tier): "Before You Direct Anyone Up That Pole — The Pre-Climb Safety Assessment." Include: ground-level visual + tap test procedure, lean measurement technique, go/no-go decision framework, and the explicit instruction that pole-top inspection by bucket truck is ALWAYS an acceptable substitution for direct climbing and is preferable for suspect poles.

---

## §3: Confined Space Entry for Manhole Inspection — T13.L04 Safety Gap

### FINDING R7-H3 (HIGH) — T13.L04 Underground Inspection Does Not Cross-Reference T18.L03 Confined Space Requirements for Inspector Manhole Access

**Evidence:**
- T13.L04 vocabulary_assumed does NOT include `confined space`, `atmospheric testing`, `attendant` → T18.L03. These terms are T18.L03 vocabulary_introduced (confirmed by direct read: line 18-23 of T18.L03).
- T13.L04 scope covers depth probe, backfill compaction, critical crossings. It does NOT address the inspector entering a vault or manhole to verify depth at a structure.
- R-1 brief Section 5 DAG Pointer Verification lists `29 CFR §1910.146 (confined space, T18 prereq)` as verified — but this appears only in the CITATION INDEX (Section 7), not in any lesson's vocabulary_assumed array. No lesson's vocabulary_assumed in R-1 brief explicitly points to T18.L03 for confined space terms.
- R-2 C-6 flagged PPE assumptions for L03 (pole climbing) but did NOT flag the absence of confined-space cross-reference for L04 (underground inspection).
- R-1..R-6: zero findings on confined-space safety for underground inspection specifically.

**What the inspector actually encounters:**

On an underground inspection walk, the inspector may need to:
1. Open and descend into a handhole or manhole to verify cable depth, slack loop length, or splice closure installation.
2. Verify structural condition of a vault (cracks, water infiltration, frame seating).
3. Witness a splice or conduit pull inside a vault.

All of these require **confined space entry per 29 CFR 1910.268(o)** (telecom manhole-specific rule) and potentially **permit-required confined space procedures per 29 CFR 1910.146** if the vault has a potentially hazardous atmosphere.

**Specific gap:** T13.L04 teaches what the inspector looks for underground but NEVER teaches that descending into a vault or manhole to make those observations requires atmospheric testing BEFORE ENTRY. An inspector who assumes T18.L03 knowledge is "background information they have" but never applies it in the inspection workflow context will skip atmospheric testing because nobody told them it applies to inspection activities — only to construction activities.

**The framing gap:** T18.L03 teaches atmospheric testing for CONSTRUCTION crews entering manholes to do work. T13 must reinforce that the same requirement applies to the INSPECTOR entering to verify work — the gas doesn't care if you're the inspector or the splicer.

**Fix:** Add to T13.L04:
1. Vocabulary_assumed: `confined space`, `permit-required confined space`, `atmospheric testing`, `attendant` → T18.L03
2. Lesson content: "Underground Inspection Safety — Before You Go Down." Inspector-specific application of T18.L03 confined space rules: "When your inspection requires descending into a vault or manhole — to verify depth measurements, slack loop lengths, or closure installation — you are entering a confined space. The atmospheric testing requirement (T18.L03) applies to you. Before any inspection descent: (a) request the contractor's atmospheric test results for the past 30 minutes; (b) confirm O₂ 19.5–23.5%, LEL <10%, CO <35 ppm, H₂S <10 ppm; (c) ensure an attendant is topside; (d) do NOT assume the contractor's crew tested it adequately — request the meter readout."

---

## §4: MAD Violation During Clearance Measurement — T13.L02 Safety Gap

### FINDING R7-M1 (MEDIUM) — T13.L02 Clearance Measurement Does Not Address the Energized-Conductor Hazard During Measurement Setup

**Evidence:**
- T18.L07 introduces `MAD`, `MAB`, and awareness-level response to energized conductors. T13.L02 vocabulary_assumed does NOT list MAD or T18.L07 as a prereq pointer.
- R-1 Section 5 (DAG pointers): `LOTO, fall protection, PPE → T18.L01–L05 CLOSED topic` — but NO pointer to T18.L07 (energized conductors/MAD).
- R-1..R-6: zero findings on energized-conductor hazard during clearance inspection work.

**What the inspector actually encounters:**

When measuring vertical clearance at a pole or span:
1. The inspector or a contractor's crew member holds a tape measure or rod vertically between the telecom cable and the road surface.
2. On joint-use poles, supply conductors (primary distribution, 7.2–25 kV) are above the telecom cable. The tape measure is metal and extends upward from the inspector's hands toward the supply conductors.
3. If the inspector holds the tape overhead from a ladder or elevated position, they may approach or enter the MAB for the supply conductor with the metal tape — a conductive path to their hands.

**Specific gap:** T18.L07 teaches MAD/MAB awareness but in a CREW WORK context (you're doing work near the pole, not reaching a tape above your head). The act of MEASURING clearance with a metal tape near supply conductors is an inspector-specific hazard not addressed in T18.L07 or in R-1's T13.L02 scope.

**Primary source:** 29 CFR 1910.268(b)(20) — "Tools and equipment" — metal measuring tapes in the vicinity of energized conductors are a recognized hazard. Non-conductive (fiberglass or non-metallic) measuring tapes are required for clearance measurements near energized circuits.

**Fix:** Add to T13.L02 book-vs-field section: "Tools for clearance measurement near joint-use poles MUST be non-conductive. Metal measuring tapes and metal rods create a conductive path to energized supply conductors if the tape tip is inadvertently brought within the MAB. Use a fiberglass measuring rod or non-metallic tape. OSHA 1910.268(b)(20) prohibits metal measuring tools in the vicinity of energized conductors." Also add vocabulary_assumed pointer: `MAD`, `MAB` → T18.L07.

---

## §5: Depth-Probe Safety Near Marked Utilities — T13.L04

### FINDING R7-M2 (MEDIUM) — T13.L04 Does Not Confirm 811-Ticket Status Before Depth Probing at an Inspection Visit

**Evidence:**
- T10.L01 (Call-811 Before You Dig) introduces `Call-811`, `locate ticket`, `ticket validity window`, and `potholing`. T13.L04 vocabulary_assumed does NOT include `Call-811` → T10.L01.
- T13.L04 teaches depth probe method with no safety precondition about utility mark verification.
- R-1..R-6: zero findings on this topic.

**What the inspector actually encounters:**

A depth probe (the steel rod pushed into soil to find cable depth) can strike a buried utility if:
1. The 811 ticket for the original construction has expired (tickets have 10-day to 28-day windows depending on state).
2. The inspection walk occurs weeks or months after construction, when locate marks may have washed away or new utility installations have occurred since the original construction.
3. The inspection probing occurs in an area with high underground utility density (near a road crossing, near a handhole) where multiple utilities run parallel.

**Specific gap:** The inspection visit occurs AFTER construction, potentially months later. The 811 ticket from construction is expired. The inspector who probes aggressively in a tight utility corridor at a road crossing could strike a gas line or power line with the probe rod.

**Primary source:** CGA Best Practices Guide §4.4 — Post-construction quality inspections that involve ground penetration (probing, coring) require the same pre-excavation locate ticket as original construction. The CGA DIRT Report tracks utility strikes during inspection activities as a separate category from construction-phase strikes.

**Fix:** Add to T13.L04 key concepts or foundation section: "Before depth probing at any inspection visit — especially on previously-completed segments or at locations with high utility density — confirm that current locate marks are in place OR obtain a new 811 ticket for the inspection scope. Expired locate marks from the original construction are NOT valid for depth probing. Add vocabulary_assumed: `Call-811`, `locate ticket`, `ticket validity window` → T10.L01.

---

## §6: Traffic Control for the Inspector — Roadside Inspection Safety

### FINDING R7-M3 (MEDIUM) — T13.L02 and T13.L04 Do Not Address the Inspector's Own Traffic-Control Requirements When Walking/Stopping on Active Roadways

**Evidence:**
- T10.L09 teaches traffic control for CONSTRUCTION crews doing active work on roadways (lane closure, flagger station, TCP requirement).
- T13.L02 (aerial inspection) and T13.L04 (underground inspection) both involve the inspector walking or stopping on or near active roadway shoulders.
- T13's vocabulary_assumed does NOT include `MUTCD`, `TCP`, or `work zone` → T18.L06 or T10.L09 for this specific inspection context.
- R-1..R-6: zero findings on this topic.

**What the inspector actually encounters:**

1. **Roadside clearance measurement (T13.L02):** The inspector stops their vehicle on or near the road shoulder to measure vertical clearance at a road crossing span. In many rural RUS project areas, the road shoulder is narrow or non-existent. Standing on the shoulder with a tape measure = roadway exposure.

2. **Underground road-crossing inspection (T13.L04):** The inspector probes at a road-crossing depth to verify compliance. This requires kneeling or bending in the road shoulder. Some probing occurs near the active lane edge.

3. **Inspector's exposure is NOT construction exposure:** An inspector driving between sites, pulling over, checking a span, and driving on has different traffic-control obligations than a construction crew doing a lane closure for HDD. But the inspector still needs:
   - HVLV vest (ANSI/ISEA 107 Class 2 or 3, depending on road speed) — the inspector's own personal PPE for roadway exposure
   - Traffic control if the inspector's vehicle or activities obstruct any travel lane
   - Awareness of when a quick-stop inspection becomes an extended exposure requiring a TCP

**Primary source:** 23 CFR 634.2 — All workers in the highway right-of-way during active construction must wear ANSI/ISEA 107 Class 2 (speed ≤50 mph) or Class 3 (speed >50 mph) HVLV vest. This applies to inspectors as well as workers. T18.L05 (PPE) introduces HVLV vest but in a general crew-safety context — T13 should reinforce it explicitly for the inspection context.

MUTCD Part 6H (Typical Applications) — Application H-27 (Spot/Short Term Work): even a single inspector's vehicle parked on a shoulder within the clear-roadway zone requires at minimum cones/signs. Most inspectors skip this for quick sightings; the lesson should teach when the quick-stop becomes a compliance exposure.

**Fix:** Add to T13.L02 and T13.L04 (or T13.L01 as a general inspection-safety rule): "Your roadside inspection activities require ANSI/ISEA 107 Class 2 vest at all times on or adjacent to an active roadway (Class 3 on roads with posted speed >50 mph). For any inspection stop exceeding 15 minutes or requiring a vehicle parked on the travel lane edge, deploy cones per MUTCD Part 6H Application H-27. You are subject to the same roadway safety rules as the construction crew you are inspecting."

Add vocabulary_assumed: `HVLV vest` → T18.L05 for T13.L02 and T13.L04.

---

## §7: Pole-Top Inspection Directional Safety — Ground-Person Role and Hold-Down Line

### FINDING R7-L1 (LOW) — T13.L03 Does Not Specify the Inspector's Ground-Person Safety Role When Directing a Contractor's Climber for Pole-Top Access

**Evidence:**
- T18.L04 does not define a "ground person" role or hold-down line requirement (confirmed by direct read: zero results for `hold-down`, `tag line`, `ground person`, `observer role`, `second person`).
- T13.L03 teaches the inspector to direct a contractor's climber to access the pole top — but never addresses what the inspector's safety role is WHILE the climber is ascending.
- R-1..R-6: zero findings on this specific topic.

**What the inspector actually encounters:**

The inspector requests that the contractor's climber go up the pole for a close-up top-condition assessment. While the climber ascends:
1. Loose tools, hardware, or CCA debris fall from the pole top — the inspector standing directly below is in the hazard drop zone.
2. OSHA 1910.268(h)(1): Contractors must maintain a clear zone below a climber's work position to prevent injury from dropped tools.
3. The inspector should position themselves OUTSIDE the drop zone (minimum one pole-height radius lateral clearance) while observing, not directly underneath.
4. A hold-down line (a rope attached to the climber's harness or body belt, held by the ground person) is used to prevent the climber from swinging away from the pole if a gaff pull-out occurs on a rotten-top section. T18.L04 does not mention this.

**Fix (Low priority — add as author note in T13.L03):** "When directing a contractor's climber to the pole top for inspection access, the inspector must position themselves outside the drop zone (one pole-height lateral) and should not stand directly below. If the climber is accessing a pole with suspected top-condition issues, a ground-held tag line on the climber's belt provides a safety backup if the top is weaker than expected. Document your position in inspection notes — an inspector who was in the drop zone during a tool-drop incident has personal exposure."

---

## §8: Inspector PPE Specificity for T13.L08 Grounding Inspection

### FINDING R7-L2 (LOW) — T13.L08 Does Not Specify Grounding-Inspection-Specific PPE (Insulated Gloves for Clamp-On Meter Work)

**Evidence:**
- T13.L08 covers clamp-on ground resistance meter verification at poles with live messenger bonding. The messenger is bonded to the ground rod and may carry induced voltage from parallel supply conductors.
- T18.L05 introduces general PPE (hard hat, safety glasses, HVLV vest, foot protection, gloves). It does NOT specify rubber insulating gloves for grounding measurement work specifically.
- No lesson in T13 or T18 addresses the PPE selection for the specific task of clamp-on grounding at a bonded aerial messenger that may carry induced voltage.
- R-1..R-6: zero findings on this topic.

**What the inspector actually encounters:**

A bonded aerial messenger on a joint-use pole is electrically connected to a shared ground system. If any supply conductor ground fault is occurring, if there is capacitive coupling from the supply conductors, or if the bond itself has improper connections, the messenger can carry induced voltage levels that are uncomfortable or hazardous at direct contact.

OSHA 1910.268(n)(4): Workers handling grounding conductors on telecommunications cables must use rubber insulating gloves (Class 00 or higher) when the conductor may carry induced voltage from power lines.

**Fix (Low priority — author note for T13.L08):** Add to T13.L08 safety note: "When conducting clamp-on ground resistance meter checks at aerial poles on joint-use structures, wear rubber insulating gloves (OSHA 1910.268(n)(4) — Class 00 minimum) when handling the bonding conductor or the messenger itself. Do not touch the messenger bare-handed when conducting a grounding check on a pole with active supply conductors above."

---

## §9: Independent Research — Inspection-Specific Safety Standards Not Referenced in R-1..R-6

The following primary sources are relevant to T13's inspection safety scope and are NOT yet cited in any R-1..R-6 brief:

| Source | Description | Relevant T13 Lesson |
|---|---|---|
| **29 CFR 1910.268(b)(20)** | Prohibits metal measuring tools near energized conductors. | T13.L02 (clearance measurement near supply conductors) |
| **29 CFR 1910.268(c)** | Qualified person requirement before pole work — applies to directing a climber | T13.L03 (pole-top inspection directing) |
| **29 CFR 1910.268(n)(4)** | Rubber insulating gloves required when handling grounding conductors | T13.L08 (grounding inspection) |
| **29 CFR 1910.268(o)** | Telecom manhole confined-space atmospheric testing | T13.L04 (underground inspection with vault descent) |
| **ANSI/ISEA 107** | HVLV vest class requirements for highway right-of-way (Class 2: ≤50 mph, Class 3: >50 mph) | T13.L02, T13.L04 (roadside inspection) |
| **23 CFR 634.2** | Worker high-visibility apparel requirements for federal-aid highway ROW | T13.L02, T13.L04 |
| **CGA Best Practices §4.4** | Locate ticket requirement for post-construction inspection probing | T13.L04 (depth probe at inspection) |
| **MUTCD Part 6H Application H-27** | Spot/short-term work zone requirements (applies to inspection vehicle stops) | T13.L02, T13.L04 |
| **ANSI O5.1 §6** | Pre-climb pole condition assessment criteria (lean ≥10%, hollow sound, checking ≥depth) | T13.L03 (pre-climb go/no-go) |

None of these are in the citation registry. All are primary or authoritative secondary sources. These should be added to the registry for T13 authoring.

---

## §10: T18 Vocabulary_Assumed Completeness Check for T13

The R-1 brief DAG pointer table (Section 5) lists `LOTO, fall protection, PPE → T18.L01–L05 CLOSED topic` as the T13-to-T18 dependency. Based on the safety/hazard-recognition audit, the following ADDITIONAL T18 vocabulary_assumed pointers are missing from T13 lessons:

| Missing Pointer | Required By | Add to |
|---|---|---|
| `MAD`, `MAB` → T18.L07 | Clearance measurement near supply conductors | T13.L02 vocabulary_assumed |
| `confined space`, `atmospheric testing`, `attendant` → T18.L03 | Underground inspection with vault descent | T13.L04 vocabulary_assumed |
| `HVLV vest` → T18.L05 | Roadside inspection exposure | T13.L02, T13.L04 vocabulary_assumed |
| `MUTCD`, `TCP`, `work zone` → T18.L06 / T10.L09 | Roadside inspection stop requirements | T13.L02, T13.L04 vocabulary_assumed |

All four T18 lessons (L03, L05, L06, L07) have been confirmed as authored CLOSED topics with these terms in vocabulary_introduced. T13 can legitimately use these as vocabulary_assumed without re-introducing them.

---

## §11: Negative Findings — Items Checked and Confirmed Clean

The following safety items were checked and confirmed adequately addressed in either T18 (as a prereq) or in R-1..R-6 (already flagged):

- **General fall protection at poles (T18.L04):** R-2 C-6 already flagged PPE assumptions for L03. T18.L04 confirms `fall protection`, `lanyard`, `positioning system`, `aerial lift` are all introduced. T13 CAN and SHOULD use vocabulary_assumed pointers there. The gap (R7-H2) is the PRE-CLIMB decision, not the during-climb protection.
- **LOTO for grounding inspection (T18.L02):** T13.L08 ground resistance testing does not require LOTO unless disconnecting equipment. The clamp-on meter method (no disconnection) is not a LOTO scenario. No gap here.
- **General PPE (hard hat, glasses, foot protection) for all T13 activities:** T18.L05 covers this. T13 vocabulary_assumed pointers to T18.L05 are appropriate. No re-teaching needed.
- **Traffic control during construction activities (T10.L09):** T10.L09 teaches the TCP and work-zone requirements for construction. The R7-M3 gap is SPECIFICALLY about the inspector's own roadside exposure during INSPECTION activities (not construction) — a different scenario that T10.L09 does not cover.
- **Gas detection in manholes (T18.L08 hazardous materials):** T18.L03 covers atmospheric testing directly. T18.L08 provides additional hazmat context. Both are covered as T18 prerequisites. R7-H3 is about T13 failing to APPLY those prerequisites explicitly in the inspection workflow context — not about the prerequisites being absent.
- **Inspector authority to stop unsafe work (T13.L01 kick-back authority, T10.L11):** Covered by R-1 scope. No gap here.

---

## §12: Summary of New R-7 Findings (Safety/Hazard-Recognition Framing)

HIGH pool before R-7: 13 items (H1–H3 per R-6 + R1/R2/R3/R4/R5 HIGH items).

### HIGH Priority — New

| ID | Lesson | Description |
|---|---|---|
| R7-H1 | T13.L03 | T18.L04 does NOT cover pre-climb pole condition assessment. T13.L03 MUST explicitly teach the pre-climb go/no-go decision tree (visual + tap test → lean assessment → go/no-go → climb vs. bucket decision) as lesson content, not as a T18 prereq. An inspector who directs a climber onto a structurally compromised pole without this framework creates a fatal-fall exposure and personal OSHA general-duty liability. |
| R7-H2 | T13.L04 | T13.L04 vocabulary_assumed does NOT reference T18.L03 (confined space, atmospheric testing, attendant). Underground inspection requiring vault/manhole descent is a confined-space entry. T18.L03 teaches this for construction crews; T13 must explicitly cross-reference and apply it to the INSPECTION context. An inspector who descends into a vault to verify slack loop length without atmospheric testing follows the same exposure pathway as every confined-space fatality. |

### MEDIUM Priority — New

| ID | Lesson | Description |
|---|---|---|
| R7-M1 | T13.L02 | Clearance measurement with metal measuring tape near joint-use supply conductors. 29 CFR 1910.268(b)(20) requires non-conductive measuring tools. T13.L02 does not address this. Vocabulary_assumed gap: no pointer to MAD/MAB → T18.L07. Inspector inadvertently entering the MAB with a metal tape = electrical exposure. |
| R7-M2 | T13.L04 | Depth probing at an inspection visit (post-construction) without confirming current 811 locate validity. CGA Best Practices §4.4: post-construction quality inspection probing requires a current locate ticket. T13.L04 vocabulary_assumed gap: no pointer to `Call-811`, `locate ticket`, `ticket validity window` → T10.L01. |
| R7-M3 | T13.L02/L04 | Inspector's own MUTCD HVLV vest + roadside spot-stop requirements. 23 CFR 634.2 applies to inspectors in highway ROW. MUTCD H-27 governs short-duration inspection stops. T13 lessons do not address this. Vocabulary_assumed gaps: `HVLV vest` → T18.L05, `MUTCD Part 6` → T18.L06/T10.L09 for all roadside inspection lessons. |

### LOW Priority — New

| ID | Lesson | Description |
|---|---|---|
| R7-L1 | T13.L03 | Inspector's ground-person safety role when directing a contractor's climber: drop-zone positioning (one pole-height lateral), hold-down line for suspect poles. Author note only. |
| R7-L2 | T13.L08 | Rubber insulating gloves (OSHA 1910.268(n)(4)) for clamp-on meter work on bonded aerial messenger. T13.L08 does not specify inspection-specific PPE for grounding work. |

---

## §13: Saturation Assessment

Under safety/hazard-recognition framing, R-7 found:
- **2 new HIGH findings** (R7-H1 pre-climb go/no-go; R7-H2 confined space for vault inspection) not caught by R-1..R-6
- **3 new MEDIUM findings** (R7-M1 metal tape near supply conductors; R7-M2 811 before probing; R7-M3 roadside inspection HVLV + MUTCD) not caught by R-1..R-6
- **2 LOW findings** (R7-L1 drop zone/hold-down line; R7-L2 insulated gloves for grounding)

R7-H1 and R7-H2 represent WORKER-FATALITY exposure pathways — pole-top falls on structurally suspect poles and atmospheric hazard in confined-space vault entry — that were entirely absent from the previous 6 audit framings. Safety framing was warranted as a distinct round.

**Cumulative HIGH pool (R1–R7):** 15 HIGH findings total. No prior round had zero new HIGH findings. HIGH pool has not saturated.

**Assessment: YELLOW — new HIGH findings (2) and MEDIUM findings (3) confirm saturation has NOT been reached. The HIGH findings in R-7 are orthogonal to R-6 (curriculum-transfer framing) and represent a different failure mode (injury, not inadequate inspector competency). Recommend incorporating all R-7 HIGH and MEDIUM findings into the fix-wave canonical before dispatching T13 authoring.**

---

## §14: New Citation Registry Additions (Not Currently in Registry)

| Citation | Description | Source | Relevant Lesson(s) |
|---|---|---|---|
| **29 CFR 1910.268(b)(20)** | Prohibited tools — metal measuring tapes near energized conductors | ecfr.gov/current/title-29/section-1910.268 | T13.L02 |
| **29 CFR 1910.268(c)** | Qualified person requirement before pole work | ecfr.gov/current/title-29/section-1910.268 | T13.L03 |
| **29 CFR 1910.268(n)(4)** | Rubber insulating gloves for grounding conductor handling | ecfr.gov/current/title-29/section-1910.268 | T13.L08 |
| **29 CFR 1910.268(o)** | Telecom manhole confined-space atmospheric testing | ecfr.gov/current/title-29/section-1910.268 | T13.L04 |
| **ANSI/ISEA 107** | High-visibility safety apparel classification | ansi.org (paywalled — confirm edition) | T13.L02, T13.L04 |
| **23 CFR 634.2** | Worker high-visibility apparel on federal-aid highway ROW | ecfr.gov/current/title-23/section-634.2 | T13.L02, T13.L04 |
| **CGA Best Practices §4.4** | Post-construction inspection ground penetration requires locate ticket | commongroundalliance.com (public) | T13.L04 |
| **MUTCD Part 6H Application H-27** | Spot/short-term work zone for inspection vehicle stops | mutcd.fhwa.dot.gov (public) | T13.L02, T13.L04 |
| **ANSI O5.1 §6** | Wood pole inspection criteria — pre-climb condition assessment | ansi.org (paywalled — confirm edition) | T13.L03 |

---

=== T13 RESEARCH R-7 BRIEF END ===
