# T10 — OSP Construction: Authoring Brief

**Write-path constraints acknowledged: only `audit-output/osp-rewrite-curriculum/T10_BRIEF.md` written.**

**Prepared:** 2026-05-17  
**Source:** ARCH.md + Module09_OSPConstruction.jsx (M09) + cascade-patterns + citation-registry + agent-protocol §8  
**Framing:** primary-source-skeptical (registry-first; only verified values from primary sources or registry entries <90 days old)

---

## 1. Topic Identity

| Field | Value |
|---|---|
| **Topic ID** | T10 |
| **Title** | OSP Construction |
| **Teaching position** | 13 of 22 (sequenced after T08 Make-Ready + T09 Permitting) |
| **Section type** | General |
| **Lesson count** | 12 (11 content lessons + 1 capstone) |
| **Estimated total time** | ~280 min (~4.7 hr) |
| **DAG prerequisites** | T01, T03, T06, T07, T08, T18 |
| **Downstream dependents** | T11 (Splicing), T13 (Inspection/QA), T15 (Restoration), T16 (As-Built/GIS) |

---

## 2. Scope Statement

T10 is the field-execution course — it picks up where design (T06), staking (T07), make-ready (T08), and permitting (T09) end and teaches how a licensed crew actually puts conduit and cable into or on the ground. Core domains: locate-before-dig obligations; installation method selection and execution (HDD, open-cut, plow); burial depth compliance; conduit fill and pull tension; slack loops; manhole/handhole installation; pavement/sod restoration; traffic control; daily field reporting; and construction QA. All field-execution topics that T13 (Inspection) will inspect later originate here.

**Book-vs-field emphasis:** OSP construction is the topic with the highest density of textbook-vs-field divergence in the curriculum. Minimum depth citations, conduit fill rules, and slack-loop specifications all have book values and field-reality values that differ in known and important ways. T10 must present BOTH layers per curriculum policy — the exam answer AND the job answer.

---

## 3. DAG Entry-Points (Vocabulary T10 Assumes)

T10's `vocabulary_assumed` must reference the correct source lessons for every term it uses without re-introducing. Cross-check against `dag-registry.json` after authoring.

| Term | Source topic + lesson | Notes |
|---|---|---|
| OSP, span, sheath, buffer tube, headend | T01.L01 | Universal vocabulary root |
| HDD, open-cut, plowing | T06.L01 | T06 introduces these as design concepts; T10 teaches execution |
| innerduct, microduct | T06.L02 | T06.L02 introduces conduit types |
| manhole, handhole, vault | T06.L05 | T06.L05 covers underground access structures from design POV |
| conduit fill (40% rule) | T06.L04 | T06.L04 introduces the concept; T10.L05 deepens pull-tension math |
| pull tension | T06.L04 | Same: T06 introduces the limit; T10.L05 teaches the calculation |
| LOTO, confined space, atmospheric testing, MUTCD | T18 (various) | Safety primitives — assume T18 complete |
| PPG glove class, MAD/MAB | T18.L04 | T10.L09 references proximity to energized supply — T18 assumed |
| APWA color code | Listed here as T10.L01 introduction — NOT in T06 (T06 does not teach locate colors) | T10 introduces this |
| loose-tube, bend radius, armor | T03 (various) | T10.L05/L06 references cable handling; T03 is the source |
| as-designed, route alignment | T04.L02 | T10.L08/L10 reference the design baseline |
| stake, station, plan-and-profile | T07.L01 | T10.L04 references station math for depth verification |
| OTMR, attachment, make-ready | T08.L01 | T10 references the completed make-ready from T08 as the aerial baseline |
| NWP 57, ROW, encroachment permit, AHJ | T09 (various) | T10.L01 references the valid permit from T09 as work prerequisite |

**DAG cascade risk:** vocab_assumed pointers for T10 are high-risk (P6 cascade pattern). Authors MUST cite the exact source lesson ID, not just "T06 vocab" generically. Run `node osp-training/scripts/build-dag-registry.js` after authoring and verify zero broken pointers.

---

## 4. New Vocabulary T10 Introduces

Per ARCH.md §vocabulary-sets:

| Term | Introduced in lesson | Definition anchor |
|---|---|---|
| Call-811 | T10.L01 | National one-call number; CGA |
| locate ticket | T10.L01 | Record of 811 notification; state one-call system |
| daylight (hand-expose / pothole) | T10.L01 | Hand-dig to visually confirm utility location before mechanized excavation |
| APWA color code | T10.L01 | Uniform paint/flag color scheme for marked utilities |
| ticket validity window | T10.L01 | State-specified period locate marks remain valid |
| CGA (Common Ground Alliance) | T10.L01 | Administrator of 811 system; publishes Best Practices + DIRT Report |
| pilot bore | T10.L02 | Initial small-diameter bore path drilled by HDD rig before reaming |
| reaming | T10.L02 | Enlarging the pilot bore to final diameter using a back-reamer |
| slurry management | T10.L02 | Drilling-fluid containment, recycling, and disposal; bentonite |
| product pull | T10.L02 | Final HDD step: pulling conduit/cable through the reamed bore |
| shoring | T10.L03 | Trench wall support to prevent collapse (OSHA 1926 Subpart P) |
| depth probe | T10.L04 | Mechanical rod used to verify burial depth of installed conduit |
| cover card | T10.L04 | Documentation certifying depth meets permit requirements |
| capstan | T10.L05 | Mechanical pulling device applying measured tension to pull cable through conduit |
| mid-assist | T10.L05 | Intermediate capstan at a vault/handhole mid-route to split tension over long pull |
| fish tape | T10.L05 | Steel/fiberglass tape threaded through conduit to pull in pull string or cable |
| slack loop | T10.L06 | Extra cable coiled and stored at access point for future splice or re-termination |
| storage coil | T10.L06 | Physical form of the slack loop inside the handhole |
| MSA (Minimum Slack Allowance) | T10.L06 | Contract-specified minimum extra cable at each structure; varies by contract |
| NIU slack | T10.L06 | Slack stored at a Network Interface Unit for subscriber drop connection |
| expansion loop | T10.L06 | Slack loop specifically sized to absorb thermal expansion/contraction in aerial-to-buried transitions |
| cast-in-place | T10.L07 | Handhole/manhole formed by pouring concrete around the opening in situ |
| pre-cast | T10.L07 | Factory-manufactured handhole/manhole delivered to site as finished unit |
| frame-and-cover | T10.L07 | Lid assembly placed over the vault opening; rated for H-20 or H-25 traffic loading |
| traffic loading (H-20/H-25) | T10.L07 | AASHTO load classifications for buried structures under vehicle traffic |
| trench backfill | T10.L08 | Material placed in trench after conduit installation; bedding sand vs. native fill |
| compaction | T10.L08 | Mechanical densification of backfill to prevent settlement |
| TCP (Traffic Control Plan) | T10.L09 | Site-specific document specifying work-zone signage, channelization, and flagger placement |
| flagger station | T10.L09 | Position and procedure for traffic control personnel |
| lane closure | T10.L09 | Partial or full blocking of a roadway lane for construction access |
| DFR (Daily Field Report) | T10.L10 | Contractor's daily record of quantities installed, crew size, equipment on site, and deviations |
| quantity tracking | T10.L10 | Recording installed footage, structures, and materials daily for billing and as-built |
| deviation log | T10.L10 | Record of field changes from the plan — the source document for as-built redlines |
| punch list | T10.L11 | List of construction deficiencies requiring correction before final acceptance |
| kick-back authority | T10.L11 | Inspector's right to reject non-conforming work and require correction before payment |
| sleeve | T10.L01 | Protective conduit section placed around cable at road crossings or other risk zones |

---

## 5. Per-Lesson Outline

### T10.L01 — Call-811 Before You Dig

**Type:** foundation  
**Estimated time:** 25 min  
**Source migration:** M09 §9.1 (strong — most content directly migratable)

**Learning objectives:**
1. Explain the legal requirement to notify 811 before any ground disturbance
2. Identify the APWA Uniform Color Code for each utility type (all 8 colors)
3. Distinguish what 811 DOES locate (member utilities) vs. what it does NOT (private laterals, irrigation, propane service lines)
4. Describe what a locate ticket is, who issues it, and what a validity window means
5. Apply the hand-expose / daylight requirement before mechanized excavation at unmarked crossings

**Key vocabulary introduced:** Call-811, locate ticket, APWA color codes (8 colors), ticket validity, CGA, daylight/pothole, sleeve  
**Vocabulary assumed:** OSP (T01.L01), AHJ (T09.L01), ROW (T09.L01), encroachment permit (T09.L02), MUTCD (T18.L08)

**Primary citations:**
- CGA Best Practices Guide v19 — locate workflow, positive response, tolerance zone
  URL: https://bestpractices.commongroundalliance.com/ [registry hit, verified 2026-05-17]
- CGA 2024 DIRT Report — 196,977 damages; 24.5% failure-to-notify root cause; 49% telecom facilities damaged
  URL: https://dirt.commongroundalliance.com/ [registry hit, verified 2026-05-17]
- CGA Marking Standards Manual v10 — APWA color code table
  URL: https://missouri-811.org/wp-content/uploads/2023/03/CGA-Marking-Standards-Manual-10.pdf [registry hit]
- GPRS private utility locating — private laterals not covered by 811
  URL: https://www.gp-radar.com/article/what-to-know-about-811-one-call-services-private-locating [M09 citation, public]

**Book-vs-field:**
- **Book:** 811 ticket + utility marks = clear to excavate
- **Field:** 811 only locates registered member utilities. Private laterals, irrigation feeds, propane service lines, private electric drops = NOT in any one-call system = NOT marked. Hand-expose every crossing before mechanized excavation. CGA Best Practices requires this; multiple state statutes now mandate it.
- **Risk of confusing them:** A crew relying solely on the 811 ticket for a residential installation routinely strikes private irrigation or propane lines, triggering property damage, shutdown, and liability. CGA DIRT data shows this is the #1 root cause category.

**Interactive primitives:**
1. `<AnnotatedDiagram>` — APWA color map: 8 color bands labeled with facility type and hover-explains; click each color to see definition + field example
2. `<Quiz>` — MC: "Your 811 ticket is valid and all utilities are marked. You notice an unmarked irrigation line crossing your route. What do you do?" (pothole first — never skip)

**Cascade-pattern checks:**
- P11 (NWP 57 vs NWP 12): L01 doesn't cite NWP directly, but references bore crossings of wetlands — if any HDD language refers to "NWP 12," correct to NWP 57 per P11
- P12 (standards edition): CGA Best Practices — current is v19; v20.0 released 2024. Author must use v20.0 if available, or mark `[confirm edition]`

---

### T10.L02 — HDD Execution — From Bore Pit to Pull

**Type:** working  
**Estimated time:** 30 min  
**Source migration:** M09 §9.2 (partial — method-selection decision matrix migratable; execution detail needs expansion)

**Learning objectives:**
1. Name the three phases of HDD (pilot bore → reaming → product pull) and what happens in each
2. Explain what slurry is, why it's used, and what happens when it fails (frac-out)
3. Describe the breakaway swivel safety principle: set to the lowest-rated component in the bundle
4. Identify the main failure modes for HDD (bore deviation, frac-out, equipment seizure)
5. Explain why bore depth on the locator log may not match the actual bore path (as-built gap)

**Key vocabulary introduced:** pilot bore, reaming, slurry management, product pull, frac-out (new — not in ARCH.md vocab list but field-critical), breakaway swivel (introduced here, referenced in T10.L05)  
**Vocabulary assumed:** HDD (T06.L01), conduit (T06.L01), pull tension (T06.L04), AHJ (T09.L01), NWP 57 (T09.L05)

**Primary citations:**
- Corning SRP-005-011 — duct installation, pull tension during HDD pullback, breakaway swivel
  URL: https://www.corning.com/catalog/coc/documents/standard-recommended-procedures/005-011.pdf [registry hit]
- OCC 206-2 — general installation guidelines, pull tension 600 lbf
  URL: https://www.occfiber.com/wp-content/uploads/2017/06/1384377594_OCC-206-2_Installation-General_Guidelines_Rev_B-1.pdf [M09 citation, public]
- PPI MAB HDD Tensile Loads — HDD pullback engineering calculation method
  URL: https://plasticpipe.org/common/Uploaded%20files/1-PPI/MAB%20Publications/HDD%20tensile%20loads_%20082522.pdf [M09 citation, public]
- Melfred Borzall HDD guide for rookies — bore deviation, steering-tool interpolation
  URL: https://www.melfredborzall.com/blog/hdd-tips/hdd-guide-for-rookies.html [M09 citation, public]
- Vermeer Pro Tips — HDD fiber installation, bore profile vs. as-built
  URL: https://www.vermeer.com/ [secondary; M09 research log cites Vermeer guidance]
- RUS 1751F-635 — buried plant placing guidance [registry hit, 2026-05-17]

**Book-vs-field:**
- **Book:** Breakaway swivel set to the maximum pull tension rating of the cable or duct; locator log gives actual bore depth
- **Field:** (a) Breakaway must be set to the LOWEST-rated component in the bundle (weakest link governs). If you pull three sub-ducts rated 600/500/700 lbf, the swivel goes at 500 lbf. (b) Bore depth on the locator log is interpolated from steering-tool readings, not a continuous survey. The drill rod deviates in hard/uneven soil. As-built bore depths are estimates, not measurements — the most common source of cable-strike-despite-valid-811 incidents.
- **Frac-out note:** When drilling mud pressure exceeds soil confinement pressure, bentonite slurry erupts at the surface (frac-out). This contaminates wetlands and stream crossings, violating Section 404 permits if not controlled. Mitigation: reduce pump pressure, use polymer additives, pre-install pilot casing at sensitive crossings. **This risk is highest exactly where NWP 57 applies (wetlands/streams).**

**Interactive primitives:**
1. `<BranchingScenario>` — "You're pulling a 3-sub-duct bundle (600/500/700 lbf ratings) through a 450-ft HDD bore under a state highway. At 200 ft, the rig gauge shows 520 lbf. Step A: Is this OK? Step B: Slurry starts appearing in a roadside ditch. What do you do? Step C: Bore guide shows 3 ft of deviation at the 300-ft mark. Do you continue or daylight to confirm?"
2. `<Quiz>` — MC: APWA bore-profile deviation scenario

---

### T10.L03 — Open-Cut Trench and Plow Execution

**Type:** working  
**Estimated time:** 25 min  
**Source migration:** M09 §9.2 (decision matrix migratable; plow execution + shoring detail net-new)

**Learning objectives:**
1. Compare open-cut trenching vs. vibratory plowing — best-fit soil conditions for each
2. Identify OSHA trench-shoring requirements for excavations >5 ft deep (Type A/B/C soil classification)
3. Describe the conduit-bedding sand layer requirement and why it matters for long-term performance
4. Explain how plowing fails in rock and what happens when a plow blade encounters an obstacle
5. Identify the warning tape requirement (location, color, text) for direct-buried telecom

**Key vocabulary introduced:** shoring, open-cut restoration, vibratory plow blade, bedding sand, warning tape placement  
**Vocabulary assumed:** HDD (T06.L01), plowing (T06.L01), conduit (T06.L01), LOTO (T18.L02), AHJ (T09.L01)

**Primary citations:**
- 29 CFR §1926 Subpart P — Excavations (shoring, soil classification, sloping) — OSHA [new to registry — not yet added; primary source: https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926SubpartP]
- OCC 206-3 — conduit guidelines, bedding sand, installation
  URL: https://www.occfiber.com/wp-content/uploads/2017/06/1384377824_OCC-206-3_Installation-Conduit_Guidelines_Rev_A-1.pdf [M09 citation, public]
- OCC 206-4 — direct burial guidelines, warning tape placement
  URL: https://www.occfiber.com/wp-content/uploads/2017/06/1384377921_OCC-206-4_Installation-Direct_Burial_Guidelines_Rev_A-1.pdf [M09 citation, public]
- RUS 1751F-635 — buried plant placing, bedding/backfill requirements [registry hit]
- FBA/Cartesian 2025 cost report — rural plowing ~$11.88/ft vs. trenching ~$19.00/ft
  URL: https://fiberbroadband.org/wp-content/uploads/2026/01/FBA_Cartesian_Fiber-Deployment-Cost-Annual-Report_2025.pdf [M09 citation, verified public]

**Book-vs-field:**
- **Book:** Warning tape must be placed 12 inches above the conduit in direct-burial trenches (OCC 206-4 guidance)
- **Field:** Many state DOT permits require the warning tape to be placed at a SPECIFIC depth in the trench fill profile (e.g., 18 inches from surface regardless of conduit depth). Field crews sometimes skip the tape when they're rushing backfill — this creates the future-dig hazard that tape was designed to prevent. Confirm warning tape depth requirement with the AHJ permit before starting backfill.
- **Shoring reality:** OSHA 1926 Subpart P requires shoring or adequate sloping for excavations >5 ft. In practice, short-duration shallow telecom trenches (18-36 in deep) in cooperative soil often aren't shored. This is a field reality that creates OSHA exposure when an excavation collapses. The lesson should teach the standard AND acknowledge why field practice often diverges, and what the injury/citation risk is.

**Interactive primitives:**
1. `<Quiz>` — MC: soil type + method selection decision matrix; "Your route crosses 8 miles of rural Georgia red clay, then 2 miles of granite outcrop. What's your method for each segment?"
2. `<SliderExploration>` — conduit fill slider: as wire/duct fill ratio changes, safe pull-tension changes; visual output — keep this lightweight since pull tension has its own lesson in L05

---

### T10.L04 — Burial Depth Verification

**Type:** working  
**Estimated time:** 25 min  
**Source migration:** M09 §9.3 (depth table directly migratable; verification procedure is net-new expansion)

**Learning objectives:**
1. State the four-level depth hierarchy: NEC floor → RUS standard → state DOT → AHJ permit governs
2. Explain how to use a depth probe (mechanical rod) and when to use GPR instead
3. Describe the cover card documentation requirement and who signs it
4. Calculate the required depth at a road crossing given a permit specifying "36 in from finished grade to top of conduit" vs. "36 in from natural grade to centerline of conduit" (these produce different numbers)
5. Identify when a post-installation GPR survey is warranted (HDD bores, crossings in critical ROW)

**Key vocabulary introduced:** depth probe, hand-dig (verification context), inspector sign-off, cover card, GPR (ground-penetrating radar) — awareness only  
**Vocabulary assumed:** HDD (T06.L01), open-cut (T06.L01), AHJ (T09.L01), ROW (T09.L01), stake/station (T07.L01)

**Primary citations:**
- RUS 1751F-635 — buried plant depth standards: 36 in direct-buried [registry hit]
- OCC 206-4 — 36 in direct-buried, warning tape placement [registry hit]
- FDOT Standard Plan 18202 — FDOT ROW depth requirements
  URL: https://www.fdot.gov/docs/default-source/roadway/DS/13/IDx/18202.pdf [M09 citation, public]
- VDOT IIM-LD-230 — depth, bedding, warning tape in VDOT ROW
  URL: https://www.vdot.virginia.gov/media/vdotvirginiagov/doing-business/technical-guidance-and-support/technical-guidance-documents/location-and-design/migrated/iim/IIM230_acc04052023_PM.pdf [M09 citation, public]
- CalTrans TR-0448 — ~42 in from surface in CalTrans highway ROW [M09 citation, public]
- NESC C2-2023 underground depth tables — PAYWALLED; teach via secondary sources only; mark `[confirm edition]`

**Book-vs-field:**
- **Book:** 36 in is the standard RUS/OCC depth for direct-buried fiber
- **Field:** The depth you build to is whatever the AHJ permit specifies, which varies: state highway ROW often requires 42-48 in; some municipal permits require a concrete cap at 24 in; frost-line states require frost + 6 in regardless of other specs. The design drawing shows the permit-required depth; the inspector verifies it with a depth probe at regular intervals (commonly 100-ft intervals or at every structure). Cover cards document the verification. Inspectors who don't probe and just visually estimate create liability exposure for the contractor and the system owner.

**Worked example:**
- **Setup:** Permit says "minimum 36 in, measured from finished grade to top of conduit." Finished grade is 4 in above natural grade (pavement overlay). Natural grade = 0.0 ft reference.
- **Required top-of-conduit depth:** 36 in below finished grade = 36 + 4 = 40 in below natural grade
- **Depth probe reading:** 38 in below natural grade → **38 - 4 = 34 in from finished grade → FAILS permit requirement**
- **Sanity check:** "We measure from what you walk on, not from where dirt starts. A 4-inch overlay pushed the effective depth requirement 4 inches deeper."

**Interactive primitives:**
1. `<WorkedExample>` — depth verification calculation: given permit language + grade elevation, compute required probe reading and accept/fail verdict
2. `<Quiz>` — MC: depth hierarchy scenario (NEC vs RUS vs FDOT — which governs?)

---

### T10.L05 — Conduit Pulling — Load Calculation

**Type:** working  
**Estimated time:** 30 min  
**Source migration:** M09 §9.4 (conduit fill + pull tension content migratable; bend-factor calculation is net-new depth)

**Learning objectives:**
1. State the 600 lbf representative maximum pull tension for OSP loose-tube cable and where it comes from
2. Calculate pull tension over a pull route with multiple bends using the capstan formula (T = T₀ × e^(μθ))
3. Explain the 40% conduit fill rule — what it is, what standard it comes from, and when it doesn't apply (microduct jetting)
4. Describe why the drill-rig gauge reads a DIFFERENT tension than the cable jacket experiences in HDD pullback
5. Apply the weakest-link rule for multi-sub-duct pull operations

**Key vocabulary introduced:** pull tension (application-level deepening of T06 concept), capstan (mechanical device), mid-assist, fish tape, breakaway swivel (reinforcement from L02)  
**Vocabulary assumed:** conduit fill (T06.L04), pull tension (T06.L04), HDD (T06.L01), innerduct (T06.L02)

**Primary citations:**
- Corning SRP-005-011 — 600 lbf maximum pull tension for OSP loose-tube cable
  URL: https://www.corning.com/catalog/coc/documents/standard-recommended-procedures/005-011.pdf [registry hit]
- OCC 206-2 — pull tension guidelines [M09 citation, public]
- ICC fiber pull tension reference — URL: https://icc.com/help-article/minimum-bend-radius-maximum-pulling-tension-fiber-optic-cables/ [M09 citation, public]
- PPI MAB HDD Tensile Loads — HDD pullback engineering [M09 citation, public]
- NEC Chapter 9 Table 1 — 40% fill rule (PAYWALLED; widely reproduced in secondary sources; teach as convention, not mandate per cascade pattern P8)
- BICSI/TIA convention — 25% initial / 40% maximum for telecom sub-ducts (PAYWALLED; BICSI ITSIMM via secondary sources)

**CASCADE PATTERN P8 ALERT:** "40% fill — NEC Chapter 9 Table 1" is an industry convention for fiber conduit, NOT a NEC mandate (NEC 770.110(B) and 800.110(B) exempt communications cables from Chapter 9 Table 1 fill tables). Author must present this clearly: 40% = industry convention for traditional pull installation; not a code requirement for telecom cable specifically.

**Worked example (capstan formula):**
- **Context:** 500-ft pull through 4-inch PVC conduit. Two 90° bends (θ = π/2 each). Coefficient of friction μ = 0.25 (dry PVC; Corning installation guide). Starting tension T₀ = 0 lbf (duct lays flat at start).
- **Per-bend multiplier:** e^(μ × π/2) = e^(0.25 × 1.571) = e^(0.393) ≈ 1.48
- **After first 90° bend:** T₁ = T₀ × 1.48 = 0 × 1.48 (friction on straight section adds; let's assume straight section adds 50 lbf before each bend): T_straight = friction × distance = 0.25 × cable weight × 500 ft ≈ 0.25 × 0.04 lb/ft × 500 = 5 lbf dead weight; rig must apply more. 
  
  **Simplified instruction model for learners:** Use T_final = T_initial × e^(μ × Σθ) where Σθ is total bend angle in radians. For 2 × 90° bends: Σθ = π. T_final = T_start × e^(0.25 × π) = T_start × e^(0.785) ≈ T_start × 2.19. If the rig applies 200 lbf at the start: cable-exit tension ≈ 200 × 2.19 = 438 lbf — still under 600 lbf limit.
- **Sanity check:** "Two 90° bends more than doubles the tension at the far end vs. the near end. A straight 2,000-ft pull and a 500-ft pull with two 90° bends can have the same exit tension."
- **Practical implication:** Every additional 90° bend approximately doubles the downstream tension (at μ=0.25). This is why mid-assist capstans at vaults are essential on long, curved conduit runs.

**Book-vs-field:**
- **Book:** Pull tension for OSP loose-tube cable = 600 lbf (Corning/OCC); calculate using capstan formula; 40% fill maximum
- **Field:** The 600 lbf figure is a representative value; always check the specific cable datasheet. In microduct jetting, 40% fill is irrelevant — air pressure drives the micro-cable, not mechanical pull tension; fill ratios of 50-70%+ are normal. The distinction matters: failing to recognize that a job is a jetting job and applying a 40% fill limit could under-specify the conduit bundle.

**Interactive primitives:**
1. `<WorkedExample>` — capstan formula: enter number of 90° bends + starting tension, see step-by-step calculation + accept/fail vs. 600 lbf limit
2. `<Quiz>` — MC: breakaway swivel scenario (three sub-ducts, lowest rating governs)

---

### T10.L06 — Slack Loops — Why and Where

**Type:** working  
**Estimated time:** 25 min  
**Source migration:** M09 §9.6 (directly migratable; slack loop table is good; expand with why/consequence)

**Learning objectives:**
1. Explain why slack loops exist (splice-trailer reach, future re-termination, thermal expansion)
2. State common contract bands for intermediate handholes (50 ft), splice-point handholes (100 ft), building entrance (100-150 ft), and aerial-to-buried transitions (25-50 ft)
3. Describe how to store a slack loop inside a handhole (coil direction, minimum coil diameter relative to cable bend radius)
4. Distinguish slack loop from expansion loop — different function, different size
5. Explain the consequence of under-specified slack (future splice mobilization cost, potential road closure)

**Key vocabulary introduced:** slack loop, storage coil, MSA, NIU slack, expansion loop  
**Vocabulary assumed:** handhole (T06.L05), vault (T06.L05), bend radius (T03.L02), splicing (T01 — conceptual awareness; detail in T11)

**Primary citations:**
- OFS IP-009 — placing fiber optic cable in underground plant; slack loop guidance
  URL: https://www.ofsoptics.com/wp-content/uploads/IP009-UG-Cable-Placing-Feb-2020.pdf [M09 citation, public]
- OFS IP-079 — sizing handholes (context for slack + structure relationship)
  URL: https://www.ofsoptics.com/wp-content/uploads/IP079-Sizing-Handholes-for-Fiber-Optic-Cables.pdf [M09 citation, public]
- Cabling Installation & Maintenance — service loops guidance
  URL: https://www.cablinginstall.com/home/article/16469021/service-loops-in-horizontal-cable-runs [M09 citation, public]

**NOTE:** Slack loop contract lengths (50/100/150 ft) are common industry bands, NOT a single normative national standard. BICSI OSPDRM and carrier MSAs specify their own values. Author must mark these as "common contract bands; the contract for your job specifies the number" — per M09 editorial posture.

**Book-vs-field:**
- **Book:** 50 ft at intermediate handholes; 100 ft at splice points (OFS IP-009, carrier MSA convention)
- **Field:** Skimping on slack to save cable budget routinely costs more in future-splice mobilization cost and road closure fees than the saved cable was worth. A 50-ft loop costs ~$15-25 in cable; a future splice mobilization to a handhole with insufficient reach can cost $3,000-$10,000 in traffic control alone. The slack loop is cheap insurance.

**Interactive primitives:**
1. `<AnnotatedDiagram>` — slack loop at pedestal: coil inside handhole, labeled with: coil diameter, cable bend radius relationship, splice-trailer reach vector, NIU slack segment
2. `<Quiz>` — drag-to-place scenario: assign slack lengths to structure types (intermediate HH, splice-point HH, building entrance, aerial-to-buried transition)

---

### T10.L07 — Manhole and Handhole Installation

**Type:** working  
**Estimated time:** 25 min  
**Source migration:** M09 §9.5 (placement spacing + vault sizing table migratable; installation procedure is net-new)

**Learning objectives:**
1. Distinguish a handhole from a manhole from a vault — size, access type, typical use
2. State the 500-1,000 ft planning interval for handholes and explain why the actual placed location often differs (splice-trailer access, AHJ road-cut policy, bend geometry)
3. Apply the traffic loading ratings: H-20 for driveways/private access, H-25 for public roadways
4. Explain the cast-in-place vs. pre-cast choice and the trade-offs
5. Describe the vault sizing checklist (bend radius of largest cable, splice-tray count, lid removal clearance, traffic rating)

**Key vocabulary introduced:** cast-in-place, pre-cast, frame-and-cover, traffic loading H-20/H-25  
**Vocabulary assumed:** manhole (T06.L05), handhole (T06.L05), vault (T06.L05), conduit (T06.L01), bend radius (T03.L02), splice tray (T01 — conceptual; detail in T11)

**Primary citations:**
- OFS IP-079 — sizing handholes for fiber optic cables (vendor guidance, not normative standard)
  URL: https://www.ofsoptics.com/wp-content/uploads/IP079-Sizing-Handholes-for-Fiber-Optic-Cables.pdf [M09 citation, public]
- RUS 1751F-643 — Underground Cable Vault types and cable racks for central-office vault design; applicable to RUS-financed projects [M09 citation; paywalled — mark `[confirm edition]`]
- AASHTO H-20/H-25 loading classifications — vehicle load rating for buried structures [PAYWALLED — cite via secondary; widely reproduced in DOT permit conditions and vendor spec sheets]
- FOA OSP Civil Works Guide — vault placement, underground access
  URL: https://www.thefoa.org/tech/ref/1pstandards/OSP%20Civil%20Works%20Guide-FOA.pdf [M09 citation, public]

**Book-vs-field:**
- **Book:** Vault spacing at 500-1,000 ft; pre-cast preferred for field speed; H-20 covers driveways, H-25 covers roads
- **Field:** The 500-1,000 ft interval is a planning guide. The vault actually goes where the splice trailer can park (shoulder pull-off, side street, business driveway). Vaults in highway medians or at traffic-signal intersections are unusable. Design the interval; move each vault to the nearest safe access point. For pre-cast vs. cast-in-place: pre-cast dominates on new builds (faster, factory quality, predictable dimensions); cast-in-place is used when ROW is too tight for a delivery truck to stage the pre-cast unit.

**Interactive primitives:**
1. `<AnnotatedDiagram>` — manhole assembly cross-section: conduit entries labeled, cable rack labeled, frame-and-cover labeled, traffic load path illustrated
2. `<Quiz>` — MC: vault sizing scenario (cable count + bend radius → minimum vault size)

---

### T10.L08 — Pavement and Sod Restoration

**Type:** working  
**Estimated time:** 20 min  
**Source migration:** net-new (no direct M09 section; M09 §9.2 mentions restoration cost in method matrix)

**Learning objectives:**
1. Describe the trench backfill sequence: bedding sand → native fill → compaction lifts → sub-base → base → surface course
2. Explain why compaction must occur in lifts (typically 6-8 inch maximum) rather than in one deep fill
3. State common AHJ requirements for pavement match: same surface type (asphalt-to-asphalt, concrete-to-concrete), minimum patch width
4. Describe the sod restoration process and the common 30-day survivability inspection requirement
5. Explain how inadequate compaction leads to trench settlement and the resulting liability for the contractor

**Key vocabulary introduced:** trench backfill, compaction (as a controlled process), pavement match, sod restoration  
**Vocabulary assumed:** open-cut (T06.L01), AHJ (T09.L01), ROW (T09.L01)

**Primary citations:**
- FDOT Standard Plan 18202 — pavement restoration requirements in FDOT ROW [M09 citation, public]
- VDOT IIM-LD-230 — restoration requirements in VDOT ROW [M09 citation, public]
- RUS 1751F-635 — buried plant restoration guidance [registry hit]

**Book-vs-field:**
- **Book:** Compact in 6-8 inch lifts; restore to original surface type; 95% Proctor density requirement
- **Field:** Many contractors rush the backfill — they dump and compact once because it's faster. Trench settlement 6-12 months later creates a "ghost trench" visible at the road surface, generating maintenance callbacks, property-owner complaints, and sometimes permit violations. The "95% Proctor" specification is a technical requirement most field crews can't measure in real time; compaction testing is done by a geotechnical inspector who often isn't on site for every foot of trench. As a field crew member, your job is to follow the lift thickness rule even when no inspector is watching — because the settlement happens when you're gone.

**Interactive primitives:**
1. `<BranchingScenario>` — "The property owner is standing at the trench asking why you're backfilling in 6 layers instead of one. Step A: How do you explain it? Step B: The foreman says 'just fill it, we're behind schedule.' Do you fill it or insist on lifts? Step C: Six months later the trench settles. Who is liable?" — decision tree with consequence discussion

---

### T10.L09 — Traffic Control in Construction Zones

**Type:** working  
**Estimated time:** 25 min  
**Source migration:** net-new (T18.L08 introduced MUTCD concepts from a safety/worker POV; T10.L09 extends to contractor TCP implementation)

**Learning objectives:**
1. Explain the MUTCD Part 6 framework for temporary traffic control (TTC)
2. Describe the components of a Traffic Control Plan (TCP): signs, channelization devices, flagger stations, advance warning area
3. State flagger certification requirements (state-specific; ATSSA or IMSA training typical)
4. Apply the basic lane-closure layout: advance warning signs → transition taper → activity area → termination taper
5. Identify the difference between a fully engineered TCP (required by most state DOTs for lane closures on primary roads) vs. a standard work-zone setup from MUTCD diagrams

**Key vocabulary introduced:** TCP (Traffic Control Plan), flagger station, lane closure, MUTCD Part 6, channelization device (cones/drums/barriers)  
**Vocabulary assumed:** MUTCD (T18.L08), OSHA work-zone safety (T18), AHJ (T09.L01), permit conditions (T09.L06)

**Primary citations:**
- FHWA MUTCD (Manual on Uniform Traffic Control Devices), Part 6 — Temporary Traffic Control
  URL: https://mutcd.fhwa.dot.gov/ [public, free — NEW TO REGISTRY: add entry]
  Section 6E.01 — flagger procedures; 6C — TTC plan components; 6H — typical TTC diagrams
- ATSSA — American Traffic Safety Services Association, flagger certification
  URL: https://www.atssa.com/ [public — awareness level]

**Book-vs-field:**
- **Book:** MUTCD Part 6 provides standard TTC diagrams; follow the applicable diagram for the road type and lane configuration
- **Field:** Most state DOT encroachment permits require a site-specific TCP signed by a licensed PE or traffic engineer for any lane closure on a primary or secondary road. The MUTCD diagrams are examples, not ready-to-use plans. A contractor who shows up with a photocopied MUTCD Diagram 6H-1 and no PE-stamped TCP will be shut down by the inspector. Get the PE-stamped TCP in hand before the crew mobilizes.

**Interactive primitives:**
1. `<AnnotatedDiagram>` — work-zone layout: advance warning area, transition taper, buffer space, activity area, termination taper; labels with distances and device types
2. `<Quiz>` — MC: scenario where flagger is positioned incorrectly; "Where is the error?"

---

### T10.L10 — Daily Field Reporting

**Type:** working  
**Estimated time:** 20 min  
**Source migration:** net-new

**Learning objectives:**
1. Explain what a Daily Field Report (DFR) contains: crew size, equipment, quantities installed, weather, deviations from plan
2. Describe why daily quantity tracking is the foundation of both progress billing and the as-built
3. Apply the deviation log — how to record a route change, a depth deviation, or a material substitution so it becomes an as-built input rather than a lost field change
4. Explain how DFR data becomes the basis for quantity-based pay applications (progress billing)
5. Identify who has DFR authority (typically foreman, superintendent, or inspector co-signs)

**Key vocabulary introduced:** DFR (Daily Field Report), quantity tracking, deviation log  
**Vocabulary assumed:** as-designed (T04.L02), route alignment (T04.L02), AHJ (T09.L01), pay application (T01 — awareness)

**Primary citations:**
- RUS Bulletin 1751F-635 — field reporting requirements for RUS-financed construction [registry hit]
- RUS Form 219 (awareness; detailed treatment in T13 and T16) — as-built documentation package
- 3-GIS blog — fiber network construction, as-built workflow
  URL: https://blog.3-gis.com/blog/topic/fiber-network-construction [M09 citation, public]

**Book-vs-field:**
- **Book:** The DFR is filled out daily, includes all deviations, and is countersigned by the inspector
- **Field:** The most common failure mode is the foreman completing DFRs in a batch at the end of the week from memory. Detail is lost; deviations are omitted ("I'll remember where that route change was"). The resulting as-built is missing field changes. The OTDR fault 18 months later is traced to a GIS record that shows a straight bore but the actual conduit went around an underground obstacle the crew forgot to log. Daily completion discipline is the only preventive measure.

**Interactive primitives:**
1. `<BranchingScenario>` — "You're the foreman. At 4:45 PM you're told to skip DFR today because the crew needs to demobilize early. Step A: Do you comply? Step B: A deviation from plan occurred at Station 42+50 — bore went 15 ft north to avoid a rock. Is this logged anywhere? Step C: Three weeks later the billing dispute happens. Who has the documentation?"

---

### T10.L11 — Construction QA — Inspector's Role

**Type:** working  
**Estimated time:** 20 min  
**Source migration:** net-new (T13 covers inspection in detail; T10.L11 introduces the inspector concept from the construction crew's POV)

**Learning objectives:**
1. Explain the inspector's role on a construction spread: independent verification of contractor compliance, not supervision
2. Define punch list and kick-back authority — what the inspector can require and what happens to payment
3. Describe the depth verification, slack verification, and as-built redline checks an inspector performs during construction
4. Explain the difference between a punch list item (correctable before acceptance) and a kick-back (work must stop or be corrected before proceeding)
5. Identify what documentation the inspector signs on final acceptance (Form 219 context)

**Key vocabulary introduced:** punch list, kick-back authority, field inspector role  
**Vocabulary assumed:** DFR (T10.L10), depth probe (T10.L04), slack loop (T10.L06), as-designed (T04.L02), AHJ (T09.L01), RUS Form 219 (awareness — detail in T13)

**Primary citations:**
- RUS Bulletin 1751F-635 — inspection requirements for RUS-financed buried plant [registry hit]
- RUS Form 219 — close-out documentation package; detailed in T13
- BICSI OSPDR — inspection standards for OSP construction

**Book-vs-field:**
- **Book:** The inspector verifies every aspect of construction against the approved design and specifications; inspector sign-off is required before acceptance payment is made
- **Field:** In practice on large multi-subcontractor spreads, the inspector is often behind the construction crew — verifying what was done yesterday, not what's happening today. This means depth violations and deviation-log omissions are often discovered after backfill. A thorough inspector creates a parallel documentation trail (photos + depth logs + material tickets) that survives if the contractor's DFR is incomplete. The contractor crew that gets along best with inspectors is the one that flags deviations proactively — the crew that tries to hide problems gets more stringent inspection scrutiny on future jobs.

**Interactive primitives:**
1. `<BranchingScenario>` — "Inspector finds conduit at 30 in on a route permitted for 36 in. Step A: Inspector issues a punch list or kick-back? Step B: Contractor says 'the soil was rocky, we couldn't go deeper.' What documentation should the inspector have? Step C: Is the contractor's pay application approvable?"

---

### T10.L12 — T10 Capstone Quiz

**Type:** capstone-quiz  
**Estimated time:** 30 min  
**Source migration:** net-new

**Scope:** 20-question mixed quiz drawing from all T10 lessons. Distribution:
- L01 Call-811: 3 Q (including APWA color drag-match + private lateral scenario)
- L02 HDD: 2 Q (breakaway swivel + bore-deviation as-built gap)
- L03 Open-cut/plow: 2 Q (soil type + shoring)
- L04 Depth verification: 2 Q (depth hierarchy + worked calculation)
- L05 Pull tension: 3 Q (capstan formula + weakest-link + fill convention vs. mandate)
- L06 Slack loops: 2 Q (loop length assignment + consequence of under-specification)
- L07 Manholes: 2 Q (traffic loading + sizing)
- L08-L11 combined: 4 Q (restoration compaction, TCP, DFR, inspector kick-back)

**Pass threshold:** 70% (14/20)

**Interactive primitives:**
1. `<Quiz>` (20Q MC primary)
2. `<BranchingScenario>` — one integrated scenario: "You are the foreman on an HDD bore under a state highway with a multi-sub-duct bundle. Walk through: 811 notification → TCP setup → pilot bore → pullback tension at three bends → slurry management → backfill sequence → inspector punch list." Decision tree with consequence scoring.

---

## 6. Primary Citations Summary (T10 specific — not in registry, require first-lookup)

The following citations appear in T10 but are NOT yet in the citation registry. Authors must verify these from primary sources and add registry entries:

| Citation | URL | Verification need | Registry action |
|---|---|---|---|
| FHWA MUTCD Part 6 | https://mutcd.fhwa.dot.gov/ | Public, free — verify current edition | Add: `FHWA MUTCD Part 6 (current edition) — Temporary Traffic Control` |
| 29 CFR §1926 Subpart P | https://www.osha.gov/laws-regs/regulations/standardnumber/1926/1926SubpartP | Public OSHA — verify Part P current text | Add: `29 CFR §1926 Subpart P — Excavations` |
| ATSSA flagger certification | https://www.atssa.com/ | Public — awareness level | Add: `ATSSA flagger cert program — awareness citation only` |
| CGA Best Practices v20.0 (2024) | https://bestpractices.commongroundalliance.com/ | Check if v20 supersedes v19 in registry | UPDATE registry: confirm v19 still current or replace with v20 |

All M09-cited sources (Corning SRP-005-011, OCC 206-2/3/4, RUS 1751F-635, FDOT 18202, PPI MAB, OFS IP-009, OFS IP-079, FOA OSP Civil Works Guide, FBA/Cartesian 2025, Melfred Borzall) are already in the M09 reference list and should be added to the citation registry when T10 lessons are authored if not already present.

---

## 7. Cascade-Pattern Risk Summary for T10

| Pattern | Applicable lesson(s) | Specific risk |
|---|---|---|
| P6 — DAG broken vocab_assumed pointers | ALL lessons | T10 has 6 upstream topics; incorrect source-lesson IDs likely. Run dag-registry.json validator after authoring. |
| P7 — NESC §-vs-Rule notation | L04 (depth), L07 (vault load) | NESC underground tables cited; standardize as "NESC Section XX" not "§XX" |
| P8 — NEC fill misattribution | L05 (conduit fill) | 40% fill is NOT a NEC mandate for telecom (NEC 770.110(B)/800.110(B) exemption). Teach as convention. |
| P11 — NWP 12 vs NWP 57 | L02 (HDD bores near wetlands) | Any HDD wetland crossing must cite NWP 57 (telecom), NOT NWP 12 (pipeline) |
| P12 — Standards edition | L01 (CGA v19 vs v20), L09 (MUTCD current edition) | Verify CGA v19 vs v20 before authoring L01. MUTCD is periodically revised — use current edition, mark `[confirm edition]` |

No P1 (Part 32) or P2 (H₂S IDLH) or P3 (Z359 fall protection) or P4/P5 (fabricated numeric / FR page) risks specific to T10 — T10 is construction-execution, not telecom accounting or safety-chemical topics.

---

## 8. Forensic Scenario Coverage (Field Failure Modes T10 Should Prevent)

These are real failure patterns. Each mapped to the lesson that prevents it:

| # | Field failure mode | T10 lesson that prevents it |
|---|---|---|
| F1 | Cable struck during adjacent construction because bore was shallower than the locator log recorded | L02 (bore deviation awareness) + L04 (GPR verification for critical crossings) |
| F2 | Private irrigation line struck despite valid 811 ticket; contractor liability, property damage, shutdown | L01 (private laterals not covered by 811; daylight every crossing) |
| F3 | Pull tension exceeded on HDD pullback (rig gauge showed acceptable; actual cable-exit tension exceeded rating at second bend) | L05 (capstan formula; rig gauge ≠ cable tension) |
| F4 | Trench settlement 8 months later causes road surface failure; contractor called back for costly repair under warranty | L08 (compaction lifts; rush fill leads to settlement) |
| F5 | 811 ticket expired (state 10-business-day window elapsed before excavation began); crew digs without valid marks, strikes gas main | L01 (ticket validity window; re-notify before excavation if window expires) |
| F6 | Inspector rejects 800-ft conduit pull because 40% fill limit was violated — contractor undersized the conduit | L05 (40% fill convention; size conduit before pull, not after) |
| F7 | As-built delivered without deviation log; splice fault 2 years later causes 6-hour outage because GIS shows wrong conduit path | L10 (deviation log discipline; daily DFR completion) |
| F8 | Lane closure shut down by DOT inspector because contractor had no PE-stamped TCP for state highway work | L09 (TCP requirement; MUTCD diagrams ≠ site-specific TCP for state roads) |
| F9 | Contractor billed for slack loops not installed; owner discovers insufficient reach when first splice is needed, requiring road closure | L06 (MSA specification; cost of under-slack is greater than cable cost saved) |
| F10 | Pre-cast vault installed in median with no splice-trailer access; future splicing requires full lane closure on 4-lane road | L07 (plan spacing as interval; move vault to nearest accessible point) |

---

## 9. Lesson Count Recommendation

**12 lessons as specified in ARCH.md** is appropriate and well-justified:

- 11 content lessons cover the full field-execution lifecycle: locate-before-dig → installation methods (3 lessons — HDD/open-cut separate because execution profiles differ significantly) → depth verification → pull tension math → slack loops → structures → restoration → traffic control → daily reporting → QA/inspector
- 1 capstone integrates all 11 lessons with a 20-Q quiz + integrated BranchingScenario

**No expansion recommended.** The 3-method installation split (L02/L03 for HDD vs. open-cut/plow) is correct — HDD and open-cut/plow have sufficiently different execution, failure modes, and math to warrant separate lessons. Combining would force either over-simplification or lesson bloat.

**No reduction recommended.** L08 (restoration), L09 (TCP), and L10 (DFR) might appear as "soft" topics, but they map directly to T13 inspection criteria and T16 as-built requirements downstream. They are load-bearing prerequisite lessons for downstream topics, not optional depth-adds.

---

## 10. Authoring Notes for Fix-Agent

1. **Source files:** M09 §9.1 maps to L01; §9.2 maps to L02/L03; §9.3 maps to L04; §9.4 maps to L05; §9.6 maps to L06; §9.5 maps to L07; §9.7 maps to T16 (as-built — NOT T10; don't migrate §9.7 into T10). L08/L09/L10/L11 are net-new.
2. **M09 §9.7 (as-built reconciliation):** This content belongs in T16, not T10. T10 mentions the as-built as a DFR output but does not teach GIS reconciliation — that's T16's domain.
3. **Safety cross-references:** T18 is a hard prerequisite. T10 lessons that touch confined space (L07 manhole entry), LOTO (L09 energized-adjacent work), fall protection (L07 lid removal), and atmospheric hazards (L07 manhole entry) must include vocab_assumed pointers to the specific T18 lessons — do not re-teach safety content.
4. **Vite build:** run `cd osp-training && npm run build` before push. T10 uses BranchingScenario (4 lessons), WorkedExample (2 lessons), AnnotatedDiagram (4 lessons) — all primitives exist in OSP-RW.1. Import paths: `import { BranchingScenario } from '../../components/BranchingScenario.jsx'` etc.
5. **Flashcard requirement (HARD):** Every lesson must include `export const key_terms = [...]` named export AND render `<Flashcard>` components inline for every term in `vocabulary_introduced`. Lessons missing flashcards = build failure.
6. **Lesson schema:** follow `osp-training/src/lessons/schema.md` exactly. `meta` named export with `{ id, course_id, title, order, prerequisites, learning_objectives, estimated_minutes }` is mandatory.
7. **Capstan formula in L05:** present as foundational → working → advanced tiered content. Foundations tier: "tension increases with every bend"; Working tier: the multiplier e^(μθ) with μ and θ defined; Advanced tier: the full sum-of-bends calculation for a multi-bend route.

---

## Closeout

**git log -3 --oneline:** (brief is written directly — no repo push required for research brief)  
**git diff --stat:** Only `audit-output/osp-rewrite-curriculum/T10_BRIEF.md` created.  
**Vite build:** Not applicable (no lesson files modified).  
**Registry citations used from registry (<90 days):** CGA v19 (2026-05-17), RUS 1751F-635 (2026-05-17), OCC 206-2/3/4 (M09 citations, treated as public verified), Corning SRP-005-011 (M09), PPI MAB (M09), OFS IP-009/079 (M09), FDOT 18202 (M09), VDOT IIM-LD-230 (M09), FBA/Cartesian 2025 (M09).  
**Net-new citations requiring registry addition:** FHWA MUTCD Part 6, 29 CFR §1926 Subpart P, ATSSA; CGA v19→v20 version check.  
**Cascade patterns checked:** P6, P7, P8, P11, P12 — all applicable patterns noted in per-lesson analysis and §7.

=== T10 RESEARCH BRIEF END ===
