# OSP Topic 5 — Hardware & Accessories: Learner-Outcome Framing Brief (Agent B)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Discovery / Brief — READ-ONLY (lesson files untouched)
**Framing:** Learner outcomes + daily-job applicability
**Word cap:** 1500 words

---

## §1 Topic 5 Learner Outcome

By end of Topic 5, a learner should be able to:

- **Select** the correct pole hardware set (bands, brackets, dead-end assemblies) given NESC loading district, span length, and attachment geometry.
- **Specify** strand grade and lashing wire gauge for a new aerial run — justifying the choice against NESC 2.0× safety factor and RUS bulletin requirements.
- **Match** underground structure class (handhole tier, manhole type) to site load conditions and fiber count.
- **Choose** NEMA enclosure type for a pedestal or cabinet deployment based on environment — and translate NEMA rating to IEC IP equivalent for procurement datasheet comparison.
- **Size** an FDH for a GPON/XGS-PON service area: given split ratio, subscriber count, and feeder fiber count, derive required port count.
- **Map** the hardware layer diagram: CO → feeder cable → FDH → distribution → MST/drop terminal → NID/ONT — naming the physical hardware at each node.
- **Apply** direct-bury marking requirements (APWA color codes, tracer wire, warning tape depth, marker post intervals) from a route description.
- **Specify** a slack storage method for a given scenario: slack rack in vault, snowshoe in pedestal, aerial pole bracket — citing minimum coil radius and volume.
- **Build** a TIA-606-C OSP cable identifier string for a given cable segment and fiber.
- **Recognize** hardware items that appear in the Launch Fiber / PSC RUS daily workflow and connect them to the code section that governs specification or inspection.

---

## §2 Lesson Outline Proposal

DISCOVERY.md 12-lesson structure is well-calibrated. Endorsed with sequencing rationale below. Order follows field workflow: *aerial support structure → underground housing → active equipment / terminals → storage + labeling.*

| # | Title | Est. | Sequencing Rationale |
|---|---|---|---|
| 5.1 | Pole Hardware: Bands, Brackets, Dead-Ends, Dampers | 25 min | Foundation for every aerial hardware decision |
| 5.2 | Strand and Messenger Wire: Grades, RBS, Selection | 25 min | Drives 5.3; sets NESC 2.0× safety factor context |
| 5.3 | Lashing Wire and Lashing Machines | 20 min | Depends on 5.2 strand choice |
| 5.4 | Cable Hangers, J-Hooks, and Spacers | 20 min | Connects aerial (5.3) to building entry and conduit |
| 5.5 | Aerial Drop Hardware: ADC Clamps, P-Hooks, Service-Loop Fittings | 20 min | Transition from plant to service drop |
| 5.6 | Underground Hardware: Handholes, Manholes, Pull Boxes, Cable Racks | 30 min | Largest underground section; AASHTO tier + OSHA confined-space awareness |
| 5.7 | Direct-Bury Marking: Warning Tape, Tracer Wire, Marker Posts | 20 min | Follows 5.6 since same buried route context |
| 5.8 | Pedestals and Cabinets: Types, NEMA Ratings, Locking | 25 min | Houses closures + terminals; cross-refs T4 L4.12 NEMA/IEC mapping |
| 5.9 | Fiber Distribution Hubs (FDH): Construction-Grade vs. Rack-Mount, Port Config | 25 min | Active equipment sizing; highest daily-job applicability |
| 5.10 | Terminal Hardware: Drop Terminals, MST, NIDs | 25 min | Network layer diagram completion |
| 5.11 | Storage Hardware: Slack Racks, Snowshoes, Figure-8 Coils | 20 min | Maintenance-access skill; follows terminal placement |
| 5.12 | Identification and Labeling: TIA-606-C, Cable Tags, Marker Posts, RFID | 25 min | Caps the topic; synthesizes hardware placement into permanent record |

**Total: ~5.5 hrs, 12 lessons.**

---

## §3 Daily-Job Hooks Per Lesson

| Lesson | Concrete Daily-Job Scenario |
|---|---|
| 5.1 | Designer is specifying hardware list for a 300-ft aerial span on a PSC RUS route in NESC Light district. Which pole band size and dead-end bracket type goes on the BOM? |
| 5.2 | Span length on a rural RUS route exceeds 250 ft at a creek crossing. Selecting SM vs. EHS strand against RUS 1715E-110 §3 requirements and NESC 2.0× safety factor. |
| 5.3 | Crew lead asks: "Do we use 0.045 or 0.065 lashing wire here?" Designer specifies gauge based on cable OD and span, and calls out the dead-end overlap requirement (6 in. past clamp). |
| 5.4 | Designer marks J-hook spacing on riser drawings at 36-in. intervals per BICSI; reviews conduit strut spacing in BOM for building entry. |
| 5.5 | Aerial drop to a rural customer: specify ADC clamp type, P-hook at mid-span, 12-in. drip loop at building entry, strain relief. Direct callout on the service-installation drawing. |
| 5.6 | Underground route spec: select Tier 15 polymer handhole for a shared driveway crossing, Tier 22 for a rural highway shoulder. Confirm 18×30 in. minimum sizing for 4-conduit bank. |
| 5.7 | RUS route direct-bury segment: spec orange APWA warning tape at 12 in. above cable, 14 AWG Cu tracer wire, marker posts at 500-ft intervals and all direction changes. |
| 5.8 | Splicer pedestal at a rural pad site exposed to coastal project zone: NEMA 4X (IP66 stainless) vs. NEMA 3R — cite T4 L4.12 IP equivalence table to justify. |
| 5.9 | Service area has 192 subscribers at 1:32 split ratio, 2 feeder fibers. Designer sizes FDH port count: 192 × 1 port × growth factor 1.2 = 231 → select 288-port hardened FDH with SC-APC cassettes. |
| 5.10 | MST selection for a buried pedestal serving 8 drops: specify 8-port OptiTap-compatible drop terminal, confirm tool-free pull-to-lock access for contractor crew. Map location on the network layer diagram. |
| 5.11 | Manhole vault install: spec 10-m slack loop on each side of dome closure, stored on cable rack with Velcro ties (no metal clamps). Identify the minimum static bend radius (10× OD for SM OSP). |
| 5.12 | Splice technician fills in cable tag at new closure: derive TIA-606-C path ID from campus + route + cable sequence + fiber position. Attach SS tag via lashing wire loop — no adhesive. |

---

## §4 Common Failure Modes Addressed Per Lesson

| Lesson | Failure Mode Addressed |
|---|---|
| 5.1 | Wrong bracket gauge for NESC loading district → failed field inspection; vibration damper omitted on long spans → strand fatigue breaks |
| 5.2 | Specifying HS strand on spans requiring EHS → strand sag failure under ice load; skipping RBS check → NESC 2.0× violation |
| 5.3 | Wrong lashing wire gauge for cable OD → poor contact causing chafing; insufficient overlap past clamp → lashing slips in high wind |
| 5.4 | J-hook spacing beyond 36 in. on risers → NEC §800.24 violation flagged at inspection; incorrect strut size → conduit sag under bundled cable weight |
| 5.5 | Drip loop omitted at building entry → water ingress into conduit; service loop too short → cable pulled tight at mid-span, attenuation increase on warm days |
| 5.6 | Tier 8 handhole installed in traffic lane → cover failure under H-load; handhole undersized for conduit count → conduit bend radius violation inside box |
| 5.7 | Orange warning tape omitted → contractor dig-in during future trench; tracer wire break not detected before backfill → locate-signal lost on buried segment |
| 5.8 | NEMA 3R used in coastal/salt-air environment → corrosion failure within 2 years; padlock-only locking on cabinet → security non-compliance on RUS sites |
| 5.9 | FDH sized without growth factor → port exhaustion within 18 months; rack-mount FDH specified for outdoor pad site → housing failure in first frost |
| 5.10 | MST connector type mismatched to contractor drop-cable assembly (OptiTap vs. SC-APC) → field crew cannot mate at activation |
| 5.11 | Metal cable clamps used in manhole slack storage → point-pressure attenuation loss; figure-8 coil stored with twist → cable rotation breaks fiber over time |
| 5.12 | Adhesive cable tag buried underground → tag delamination within 1 year, unidentifiable plant segment; TIA-606-C ID built from wrong sequence → splice plan mismatch on first maintenance call |

---

## §5 Cross-Topic Dependencies

| Thread | Prior Topic | What T5 Adds |
|---|---|---|
| Splice closure housing | T2 L2.6 (closure internals: dome vs. in-line, gel-seal, IP68) | T5 L5.8 provides the pedestal / cabinet that *houses* the closure; NEMA selection for the enclosure. Cross-reference link required. |
| Hardened connectors at MST/drop terminal | T2 L2.9 (OptiTap, HOC, IP67/68) | T5 L5.10 places the MST/terminal in the network layer; L2.9 covers the mating connector mechanics. Do NOT re-teach connector ratings. |
| NESC loading district + strand grade | T3 L3.4 (aerial span design, sag-tension tables) | T5 L5.2 extends to strand material specification and RUS 1715E-110 §3 selection criteria — do not re-derive sag-tension. Cross-ref T3 L3.4. |
| Underground burial depth + conduit fill | T3 L3.5 (burial depth, NEC Ch. 9 fill) | T5 L5.6 focuses on structure class (handhole/manhole tier) and hardware inside the box — burial depth rules live in T3. Cross-ref, do not re-teach. |
| Direct-bury route marking | T3 L3.6 (plowing, trenching, marker tape placement) | T5 L5.7 provides the full three-layer marking spec (tape + tracer wire + marker posts) and APWA color codes — T3 mentions marker tape in passing. Depth lives here. |
| NEMA/IEC IP cross-reference | T4 L4.12 (IEC 60529 + NEMA 250 mapping table) | T5 L5.8 uses that table operationally — cite T4 L4.12 as the authoritative mapping. Do not re-derive. |
| TIA-598-D color codes | T4 L4.10 (color position from fiber sequence) | T5 L5.12 references color-coding for cable tag data fields — not re-taught; learner assumed to own this from T4. |
| Acceptance testing / as-built doc | T2 L2.12 (as-built test records) | T5 L5.12 closes the hardware-placement loop with the labeling and identification records that feed as-builts. The two lessons are companion, not duplicates. |
| RUS Form 219 + BOM reconciliation | T3 L3.12 (RUS close-out package) | T5 L5.12 tags labeling data required for RUS Form 515c plant record. Cross-reference only. |

---

## §6 Interactive Element Ideas

Density target: at minimum flashcard set + multiple-choice quiz every lesson (matching T2/T3 baseline). Scenario or drag-drop placed where field decision-making is highest value.

| Interactive Type | Lesson(s) | Description |
|---|---|---|
| Drag-drop: label pole assembly | 5.1 | Unlabeled pole cross-section; learner drags: pole band, suspension bracket, dead-end bracket, vibration damper, through-bolt hardware to correct positions |
| Scenario: strand grade selection | 5.2 | Given: 280-ft span, NESC Light district, RUS-program route. Learner selects strand grade + RBS from a simplified table; system shows whether NESC 2.0× factor is met |
| Flashcards: lashing specs | 5.3 | Gauge → application range; dead-end overlap requirement; gap inspection limit (≤1.5 in.) |
| Drag-drop: hanger to environment | 5.4 | Match J-hook / conduit hanger / aerial strand hanger to: interior riser, conduit bundle, short aerial segment |
| Scenario: aerial drop spec | 5.5 | Aerial drop, 110-ft span, lashed drop cable, wood-frame customer building. Learner selects: ADC clamp type, P-hook at mid-span (yes/no), drip loop present (yes/no), strain relief type. Branch shows pass/fail with code citation |
| Drag-drop: handhole tier to site | 5.6 | Three site conditions (driveway, rural highway shoulder, pedestrian path). Learner drags Tier 8 / Tier 15 / Tier 22 to each |
| Scenario: marking system spec | 5.7 | 2-mile direct-bury route with two road crossings and three direction changes. Learner builds the three-layer marking call-out for the BOM |
| Drag-drop: NEMA type to scenario | 5.8 | Four deployment environments (indoor telco room, outdoor rural, coastal salt-air, roadside cabinet). Learner drags NEMA 1 / 3R / 4 / 4X to each |
| Scenario: FDH sizing | 5.9 | Inputs: 144 subscriber homes, 1:32 passive split, 4 feeder fibers, 20% growth factor. Learner derives minimum port count and selects from three FDH options. Full worked answer with growth-factor math |
| Drag-drop: network layer diagram | 5.10 | Blank OSP layer diagram (CO → feeder → ??? → distribution → ??? → drop → NID). Learner drags FDH, MST, drop terminal to correct nodes |
| Flashcards: storage methods | 5.11 | Storage scenario → method: vault manhole / buried pedestal / aerial pole bracket. Minimum static bend radius (10× OD). Velcro vs. metal clamp rule |
| Scenario: labeling plan | 5.12 | Multi-segment route. Learner builds TIA-606-C path identifier for a given fiber, specifies cable tag material + attachment method, and places marker posts on a route sketch at required intervals |

---

## §7 Open Questions for Red Team / Orchestrator

1. **Lashed vs. ADSS aerial split (inherited from DISCOVERY.md, unresolved):** If ADSS self-supporting cable dominates the office's aerial plant, Lessons 5.2–5.3 should shift emphasis toward preformed grip dead-ends and AGS suspension assemblies and substantially reduce lashing-machine content. The current brief assumes lashed-cable primary. Needs user confirmation before authoring starts.

2. **FDH product family in active use:** The FDH sizing scenario in L5.9 is the most directly reusable lesson on the job site. If the office standardizes on a specific FDH product (Corning 576-port hardened SC-APC, CommScope FIST, Clearfield FieldSmart), the exercise should match that product's port-count increments and cassette architecture. Generic treatment works but loses the "directly reusable tomorrow" value.

3. **Scope boundary for 5.12 vs. T3 L3.12 / T4 L4.10:** T5 L5.12 covers TIA-606-C identifier construction, cable tag spec, and marker post placement — all of which overlap in part with T3 L3.12 (as-built records) and T4 L4.10 (color-code-based identifier components). Red team should verify the proposed boundary holds: T5 L5.12 owns the *physical hardware* (tag material, attachment method, marker post intervals), while T3 and T4 own the *records and code-standard basis*. If the boundary is blurry, a cross-reference block at lesson open is required rather than re-teaching content that has already shipped.

---

=== T5 BRIEF FRAMING B END ===
