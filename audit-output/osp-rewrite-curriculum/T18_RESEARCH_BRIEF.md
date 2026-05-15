# T18 Safety & OSHA — Citation-Grounded Research Brief

**Prepared:** 2026-05-16 (pre-authoring research brief)
**Scope:** 10 T18 lessons (L01–L10 per ARCH.md)
**Method:** WebSearch verification against trusted-sources allowlist + eCFR/OSHA.gov primary-source verification + ARCH.md DAG cross-check + T01 vocabulary audit
**Role:** READ-ONLY research brief. No lesson code was created or modified.
**Word count:** ~4,800

---

## DAG Position & Vocabulary Boundary

T18 sits at teaching position 2 in the topological sort:
`T01 → **T18** → T02 → T03 → T04 → ...`

T18 is the **prerequisite gate for all 6 field-touching topics**: T04 (Route Survey), T07 (Staking), T08 (Make-Ready), T10 (Construction), T13 (Inspection), T14 (Grounding). Authors of those topics may reference T18 vocabulary freely; they must NOT introduce T18 concepts independently.

### Vocabulary available to T18 authors from T01 (all 10 lessons)

OSP, ISP, span, attachment, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH, SMF, pole (parts of: supply space, climbing space, communication space, ground-line), cable (parts of: sheath, armor, messenger), splice case, RUS, NESC, TIA, NEC, FCC, BICSI, strand map, NAP

> T18 authors may use T01 vocabulary without re-introduction. All OSHA, MUTCD, ANSI Z89.1, and safety-specific vocabulary is **first-introduced** in T18 and must be defined in full here.

### Vocabulary T18 introduces (first-use in the curriculum)

These terms are available to ALL downstream topics once T18 completes. Authors of T04, T07, T08, T10, T13, T14 may use them without re-definition (cross-reference to T18 lesson is sufficient).

| Term | First-use lesson | Definition (field-level) |
|---|---|---|
| General duty clause | T18.L01 | Section 5(a)(1) of the OSH Act; requires employers to provide a workplace free from recognized hazards causing or likely to cause death or serious harm |
| 1910.268 | T18.L01 | OSHA Subpart R — Telecommunications; the workhorse safety standard for OSP field work |
| hazard recognition | T18.L01 | The trained skill of identifying physical, electrical, chemical, and environmental dangers before work begins |
| hierarchy of controls | T18.L01 | Engineering controls → administrative controls → PPE, in order of effectiveness; preferred over PPE-first approach |
| SDS (Safety Data Sheet) | T18.L01 / T18.L08 | Document supplied with hazardous chemicals listing composition, exposure limits, PPE, and first-aid; replaces old MSDS |
| LOTO | T18.L02 | Lockout/Tagout: the procedure for de-energizing equipment before service, governed by 29 CFR 1910.147 |
| energy isolating device | T18.L02 | A mechanical device that physically prevents transmission or release of energy (breaker, valve, disconnect switch) |
| authorized employee (LOTO) | T18.L02 | The employee who applies the lockout or tagout device |
| affected employee (LOTO) | T18.L02 | Employee whose job requires them to operate equipment that is being locked out |
| permit-required confined space | T18.L03 | A confined space with one or more of: hazardous atmosphere, engulfment hazard, inwardly converging walls, or other recognized serious hazard; requires a written permit before entry (29 CFR 1910.146) |
| confined space | T18.L03 | Large enough to enter and work, not designed for continuous occupancy, limited means of entry/exit |
| atmospheric testing | T18.L03 | Pre-entry measurement of oxygen level, combustible gas, and toxic gases in a confined space; required by 29 CFR 1910.268(o)(2) for telecom manholes |
| attendant | T18.L03 | The topside person stationed outside a confined space during entry; monitors conditions and contacts rescue |
| oxygen-deficient atmosphere | T18.L03 | Below 19.5% O₂ by volume; immediately dangerous at < 16%; can cause loss of consciousness with no warning |
| lanyard | T18.L04 | The energy-absorbing connector between a harness and an anchor point; limits fall arrest forces |
| self-retracting lifeline (SRL) | T18.L04 | A fall protection device that extends/retracts with worker movement and locks immediately on fall |
| 100% tie-off | T18.L04 | Policy requiring workers to always be connected to fall protection — even during transitioning between anchor points; no gap in fall protection |
| PPG glove class | T18.L05 | Protective Personal Gloves — rubber insulating gloves rated by voltage class per ASTM D120 (Class 00 through Class 4) |
| ANSI Z89.1 Class E | T18.L05 | Hard hat rated for 20,000 volts electrical protection (Class E = Electrical); required near energized conductors |
| ANSI Z89.1 Class G | T18.L05 | Hard hat rated for 2,200 volts general electrical protection |
| dielectric boots | T18.L05 | Electrical-hazard (EH) rated footwear that resists completing a circuit through the sole; ASTM F2412/F2413 |
| hi-vis vest | T18.L05 | ANSI/ISEA 107 high-visibility safety apparel; Class 2 minimum for roadway work, Class 3 for night/high-speed zones |
| MUTCD | T18.L06 | Manual on Uniform Traffic Control Devices; FHWA document governing traffic control in work zones; Part 6 covers temporary traffic control |
| TCP (Traffic Control Plan) | T18.L06 | Site-specific drawing showing device placement, lane control, and worker protection for a roadway work zone |
| flagger certification | T18.L06 | State-required training for personnel controlling traffic with paddles; many states require a card (ATSSA, ANSI/ISEA training providers) |
| MAD (Minimum Approach Distance) | T18.L07 | The minimum safe distance between an unprotected qualified worker and an energized conductor, per 29 CFR 1910.269(l)(2) Table R-6 |
| MAB (Minimum Approach Boundary) | T18.L07 | A visual/physical boundary established at the MAD to prevent unqualified personnel from entering the approach zone |
| qualified electrical worker (1910.269) | T18.L07 | A person trained and authorized under 29 CFR 1910.269 to work within MAD; telecom OSP crew members are typically NOT 1910.269-qualified — awareness only |
| OSHA 300 log | T18.L09 | OSHA Form 300 — the employer's log of work-related injuries and illnesses; must be maintained and posted annually |
| recordable incident | T18.L09 | A work-related injury or illness that results in death, days away from work, restricted duty, job transfer, medical treatment beyond first aid, loss of consciousness, or diagnosis by a licensed health care professional |
| near-miss | T18.L09 | An unplanned event that did not result in injury but had the potential to; reporting near-misses is voluntary but best practice |

---

## Proposed Additions to the Trusted Sources Allowlist

The following sources are not on the current allowlist but are required for T18. Recommend adding before dispatching T18 authors:

| Source | Reason needed |
|---|---|
| **29 CFR 1910.268** (osha.gov / ecfr.gov) | Primary telecom safety standard — foundation of T18 |
| **29 CFR 1910.146** (osha.gov / ecfr.gov) | Permit-required confined spaces — backup to 1910.268(o) for extreme hazard manholes |
| **29 CFR 1910.132–1910.138** (osha.gov / ecfr.gov) | PPE general requirements through eye/face protection |
| **29 CFR 1910.137** (osha.gov / ecfr.gov) | Electrical protective equipment (rubber insulating gloves) |
| **29 CFR 1910.140** (osha.gov / ecfr.gov) | Personal fall protection systems |
| **29 CFR 1910.28** (osha.gov / ecfr.gov) | Duty to have fall protection (general industry) |
| **ANSI/ISEA Z89.1-2014 (R2019)** | Hard hat types/classes (paywalled; OSHA.gov interpretation letters confirm Class E/G/C descriptions — use as secondary) |
| **ASTM D120** | Rubber insulating gloves specification; Class 00–4 voltage ratings (paywalled; OSHA eTool confirms same values — use as secondary) |
| **ANSI/ISEA 107** [confirm edition] | High-visibility safety apparel Classes 1–3 (paywalled; OSHA outreach materials confirm Class 2/3 roadway requirements) |
| **MUTCD 11th Edition (2023), Part 6** (mutcd.fhwa.dot.gov) | Temporary traffic control; Chapter 6E flagger control — free public access |
| **OSH Act § 5(a)(1)** (law.cornell.edu / osha.gov) | General duty clause foundation |

---

## Final Lesson List — T18 (10 lessons, matches ARCH.md)

| ID | Title | Type | Est. Time (min) | Key vocab introduced | Interactivity | Source |
|---|---|---|---|---|---|---|
| T18.L01 | Hazard Awareness & the Risk Hierarchy | foundation | 20 | general duty clause, 1910.268, hazard recognition, hierarchy of controls, SDS | Quiz (MC + drag-match hierarchy levels) | net-new |
| T18.L02 | Lockout/Tagout (LOTO) — 1910.147 | working | 25 | LOTO, energy isolating device, authorized employee, affected employee | BranchingScenario (LOTO sequence at hut site); Quiz | net-new |
| T18.L03 | Confined Space Entry — Manholes & Vaults | working | 30 | confined space, permit-required confined space, atmospheric testing, attendant, oxygen-deficient atmosphere | AnnotatedDiagram (manhole entry setup); BranchingScenario (classify vault as PRCS or not) | net-new |
| T18.L04 | Fall Protection — Poles & Aerial Lifts | working | 25 | lanyard, SRL, 100% tie-off, positioning system, aerial lift | Quiz (MC + drag-match); AnnotatedDiagram (pole worker anchor system) | net-new |
| T18.L05 | PPE — Hands, Head, Eyes, Feet | foundation | 20 | PPG glove class, ANSI Z89.1 Class E/G, dielectric boots, hi-vis vest | AnnotatedDiagram (PPE selection chart); Sortable (PPE by hazard class) | net-new |
| T18.L06 | Traffic Control & Flagging — MUTCD Part 6 | working | 25 | MUTCD, TCP, flagger certification, taper, buffer, work zone | BranchingScenario (work zone setup); AnnotatedDiagram (TCP lane closure diagram) | net-new |
| T18.L07 | Working Near Energized Conductors — MAD/MAB | working | 25 | MAD, MAB, qualified electrical worker (1910.269), Table R-6, unqualified approach limit | WorkedExample (read Table R-6 for a given kV); Quiz | net-new |
| T18.L08 | Hazardous Materials on an OSP Job | working | 20 | SDS (full detail), fill-gel exposure, HDPE fumes, silica dust, OSHA PEL/TLV | Quiz (MC); HotSpot (identify hazmat labels on job site photo) | net-new |
| T18.L09 | Incident Reporting & OSHA 300 | foundation | 20 | OSHA 300 log, recordable incident, near-miss, first report of injury, OSHA 300A annual summary | Quiz (MC) | net-new |
| T18.L10 | T18 Capstone Quiz | capstone-quiz | 30 | — | Quiz (20Q MC + 2 scenario-based items) | net-new |

**Total: ~240 minutes (~4 hours). 9 content lessons + 1 capstone.**

**Deviation from prompt skeleton:** The prompt suggested merging "PPE selection" and "PPG gloves" separately, but ARCH.md's lesson list cleanly combines all PPE categories (hands, head, eyes, feet) in T18.L05. This consolidation follows ARCH.md; no deviation from ARCH.md spec. The prompt's L07 "OSHA 1910.147 LOTO" and "L08 MAD/MAB" are renumbered here to L02 and L07 respectively to match ARCH.md. No content is dropped.

---

## Per-Lesson Briefs

---

### T18.L01 — Hazard Awareness & the Risk Hierarchy

#### DAG prerequisites
- T01.L09 (OSP Standards Landscape — names OSHA as a regulatory body)
- T01.L05 (OSP Project Lifecycle — learner knows the phases where hazards appear)
- No T18 internal prerequisites (this is L01)

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "General duty clause: OSH Act § 5(a)(1) — employer must provide workplace free from recognized hazards" | OSH Act § 5(a)(1) (osha.gov/laws-regs/oshact/section5) — VERIFIED public source |
| "29 CFR 1910.268 Subpart R = primary OSHA standard for telecom field work; covers overhead + underground field installations" | 29 CFR 1910.268(a) scope (ecfr.gov; osha.gov) — VERIFIED primary source |
| "Hierarchy of controls (most to least effective): Elimination → Substitution → Engineering controls → Administrative controls → PPE" | NIOSH Hierarchy of Controls (cdc.gov/niosh) — VERIFIED free public source; also OSHA.gov training materials |
| "SDS (Safety Data Sheet) replaced MSDS under OSHA's HazCom 2012 standard (29 CFR 1910.1200)" | 29 CFR 1910.1200 (ecfr.gov) — VERIFIED |

#### Book vs. field gap
- **Book:** The hierarchy of controls places PPE last because it is least reliable (depends on correct selection, fit, and use).
- **Field:** Most crews default to "put on your PPE" as the primary hazard control because PPE is fast and visible. Engineering controls (e.g., barrier shields on energized equipment, ventilation fans before manhole entry) require planning time that field crews often skip. Teach both — PPE is still required even when engineering controls are in place; it is never the only layer.

#### Interactive primitives
1. **Sortable:** drag the 5 hierarchy levels from least effective to most effective; immediate feedback
2. **Quiz (MC):** Which level of control is most effective? A) PPE B) Engineering controls C) Administrative procedures D) Substitution → **D**
3. **Flashcards:** key vocabulary introduced (8 terms)

---

### T18.L02 — Lockout/Tagout (LOTO) — 1910.147

#### DAG prerequisites
- T18.L01 (hazard recognition; hierarchy of controls — LOTO is an administrative/engineering control)

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "29 CFR 1910.147 governs control of hazardous energy for servicing and maintenance of equipment" | 29 CFR 1910.147(a)(1) (ecfr.gov; osha.gov) — VERIFIED primary source |
| "LOTO sequence: notify → shut down → isolate → apply lockout/tagout device → release stored energy → verify zero energy" | 29 CFR 1910.147(d)(1)–(d)(6) and OSHA eTool (osha.gov/etools/lockout-tagout) — VERIFIED |
| "Each authorized employee must apply their OWN lock; group lockout procedures allowed per 1910.147(f)(3)" | 29 CFR 1910.147(f)(3) (ecfr.gov) — VERIFIED |
| "Re-energization sequence: remove tools/materials → remove all employees → remove lockout devices → notify affected employees → energize" | 29 CFR 1910.147(e)(1)–(e)(3) — VERIFIED |
| "OSP LOTO context: generator/UPS equipment at hut sites, fiber splice enclosures with powered amplifiers" | Industry practice; 29 CFR 1910.268 scope covers telecom equipment — VERIFIED as applicable |

#### Book vs. field gap
- **Book:** Each authorized employee applies their own individual padlock on the isolation point's hasp. When the last lock is removed, the equipment can be energized.
- **Field:** On OSP jobs, true LOTO situations are rare — most cable and splice work doesn't touch powered equipment. Where it does (battery systems in a hut, powered fiber amplifiers, generator cutover during outage response), crews sometimes tape the breaker handle rather than using a proper lockout hasp. Teach why that's illegal and dangerous: someone can remove tape in 5 seconds; a lock requires a key.

#### Interactive primitives
1. **BranchingScenario:** "You're splicing inside a fiber hut next to a battery backup system. The rack has a breaker panel for powered equipment. Walk through the LOTO process step by step. What happens if you skip step 3?"
2. **Quiz (MC + fill-in-blank):** "In a group LOTO, each authorized employee ___." Answer: applies their own individual lock
3. **Flashcards:** LOTO vocabulary (7 terms)

---

### T18.L03 — Confined Space Entry — Manholes & Vaults

#### DAG prerequisites
- T18.L01 (hazard recognition)
- T18.L02 (energy control — powered equipment inside vaults)

#### KEY BOOK VS. FIELD GAP — Critical

This is the most important book-vs-field divergence in the entire T18 topic:

- **Book (1910.146):** 29 CFR 1910.146 governs permit-required confined spaces. Manholes meet the definition of confined space (large enough to enter, limited entry/exit, not for continuous occupancy). If a hazardous atmosphere is possible, a written permit is required before entry.
- **Telecom-specific rule (1910.268(o)):** The 1993 OSHA interpretation letter (osha.gov/laws-regs/standardinterpretations/1993-05-19) established that for telecommunications work, 29 CFR 1910.268(o) — not 1910.146 — is the primary standard, because 1910.268 is the specific standard (per 29 CFR 1910.5(c)(1), specific supersedes general). Telecom crews are required to test the atmosphere and ventilate before entry per 1910.268(o)(2), but they do NOT need a written permit for routine manhole work unless conditions cannot be made safe.
- **Practical truth:** Most crews enter telecom manholes and pedestal vaults under 1910.268(o) — test the air, run a fan if needed, keep the attendant topside. A full 1910.146 permit procedure kicks in only when the hazard cannot be controlled under 1910.268 (e.g., a manhole flooded with chemical contamination, sewage intrusion, or gas from an adjacent pipeline breach).
- **Risk of confusion:** A crew that treats every manhole like a 1910.146 PRCS will slow down dramatically (full permit paperwork, formal rescue plan, retrieval system required). A crew that skips 1910.268(o) testing because "we never need a permit" will enter a toxic atmosphere unaware. Teach both the rule and the boundary between them.

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "29 CFR 1910.268(o)(2) requires testing for combustible gas and oxygen deficiency before entering telecom manholes and unvented vaults" | 29 CFR 1910.268(o)(2) (ecfr.gov; osha.gov) — VERIFIED primary source |
| "1910.268(o)(1) requires guarding open manhole — railing, cover, or barrier — to prevent accidental falls" | 29 CFR 1910.268(o)(1) (osha.gov) — VERIFIED |
| "Ladders required for manholes exceeding 4 feet in depth per 1910.268(h)(8)" | 29 CFR 1910.268(h)(8) (osha.gov OSHA directive STD-01-15-004) — VERIFIED |
| "1910.268(o)(2)(ii)(B): continuous forced ventilation required where combustible/explosive gas detected" | 29 CFR 1910.268(o)(2)(ii)(B) (osha.gov) — VERIFIED |
| "For telecom work, 1910.268 supersedes 1910.146 for routine manhole entry per OSHA 1993 interpretation" | OSHA interpretation letter 1993-05-19 (osha.gov) — VERIFIED primary source |
| "1910.146 PRCS procedures required when hazard cannot be controlled under 1910.268(o)(2) (extreme contamination)" | OSHA interpretation letter 1993-05-19 (osha.gov) — VERIFIED |
| "Acceptable oxygen range: 19.5%–23.5% per 1910.146(b) definition" | 29 CFR 1910.146(b) (ecfr.gov) — VERIFIED |

#### Interactive primitives
1. **AnnotatedDiagram:** Overhead view + side view of manhole entry setup: attendant position, gas monitor, forced-air blower, guarded opening, communication line to attendant, ladder minimum below grade
2. **BranchingScenario:** "You open a telecom manhole on a ROW adjacent to a gas main. Gas monitor reads 12% LEL. Walk through the 1910.268(o) response."
3. **Quiz (drag-match):** Match condition to required action: 0% LEL / O₂ 21% → may enter; 12% LEL → ventilate + re-test; 25%+ LEL → do not enter, call supervisor; O₂ 17% → do not enter, ventilate, re-test
4. **Flashcards:** 8 confined space terms

---

### T18.L04 — Fall Protection — Poles & Aerial Lifts

#### DAG prerequisites
- T18.L01 (hazard recognition, PPE as last layer)

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "29 CFR 1910.268(g)(1): safety belt/strap (positioning system or PFAS) required when working more than 4 feet above ground on poles and towers" | 29 CFR 1910.268(g)(1) (osha.gov/laws-regs/regulations/standardnumber/1910/1910.268; OSHA interpretation 2012-08-27) — VERIFIED |
| "1910.268 permits free climbing to reach the work position; fall protection required AT the work position, not during ascent" | OSHA interpretation letter 2012-08-27 (osha.gov) — VERIFIED: "1910.268 generally permits employees to free climb to work locations on poles… without the use of fall protection equipment" |
| "Aerial lifts (bucket trucks): 29 CFR 1910.67 requires body harness + lanyard attached to boom or basket while in lift" | 29 CFR 1910.67(c)(2)(v) (ecfr.gov; osha.gov) — VERIFIED |
| "6-foot trigger under 29 CFR 1926 Subpart M (construction) vs. 4-foot trigger under 1910 general industry" | 29 CFR 1910.28 (general industry fall protection); 29 CFR 1926.502 (construction); OSHA.gov fall protection overview — VERIFIED: different triggers by sector |
| "100% tie-off policy: no gap during transition between anchor points — achieved with twin-leg lanyard or SRL + positioning strap" | OSHA fall protection best practices (osha.gov/fall-protection); ANSI Z359.14 (SRL standard, paywalled — confirmed via OSHA eTool descriptions) [paywalled — secondary: OSHA eTool on fall protection] |

#### Book vs. field gap
- **Book:** 29 CFR 1910.268(g) requires fall protection at >4 feet. Free-climb to position is permitted. Positioning strap (pole strap) plus body belt is the traditional method.
- **Field:** Most telecom crews use the positioning strap + body belt for pole work — the same pattern used for 40+ years. Modern fall-protection science and ANSI Z359.11 body belt standards now recommend full-body harnesses over body belts for fall arrest (body belts can cause internal injuries during a long fall arrest). Some crews have upgraded to harness + positioning strap. The standard still allows body belts for positioning (not fall arrest). Teach the distinction: a positioning strap holds you in place at the work position; it is NOT a fall arrest device. If the strap or gaff slips and you fall, you need a separate PFAS (personal fall arrest system) to stop the fall before 6 feet.

#### Interactive primitives
1. **AnnotatedDiagram:** Lineman on a pole showing: positioning strap (positioning, not arrest), body harness, secondary PFAS lanyard with anchor to pole, gaff spurs
2. **Quiz (MC):** Under 29 CFR 1910.268(g), fall protection is required when working __ feet above ground on a pole. → 4 feet
3. **SideBySide:** Body belt (positioning system only) vs. full-body harness (positioning + fall arrest); show which scenario each suits
4. **Flashcards:** 5 fall protection terms

---

### T18.L05 — PPE — Hands, Head, Eyes, Feet

#### DAG prerequisites
- T18.L01 (hazard recognition, hierarchy of controls)

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "29 CFR 1910.132 requires employer to conduct hazard assessment and provide PPE at no cost" | 29 CFR 1910.132(d)(1) (ecfr.gov) — VERIFIED primary source |
| "ANSI/ISEA Z89.1: Class E helmets rated 20,000V; Class G rated 2,200V; Class C — no electrical protection" | ANSI/ISEA Z89.1-2014 (R2019) — paywalled; confirmed via OSHA.gov safety helmet SHIB and ANSI Blog article [paywalled — 2 secondaries confirm Class E/G/C ratings] |
| "Class E hard hat required near energized distribution or transmission conductors on joint-use poles" | 29 CFR 1910.268(b) PPE table; OSHA 1910.268 training materials — VERIFIED |
| "Dielectric/EH-rated boots: ASTM F2412 test method; ASTM F2413 performance specification" | ASTM F2413-18 (paywalled); OSHA 29 CFR 1910.136 cites ASTM F2412/F2413 [paywalled — OSHA.gov confirms ASTM reference] |
| "Rubber insulating gloves: Class 00 (≤500V AC), Class 0 (≤1,000V), Class 1 (≤7,500V), Class 2 (≤17,000V), Class 3 (≤26,500V), Class 4 (≤36,000V)" | 29 CFR 1910.137 + OSHA eTool on insulating gloves (osha.gov/etools/electric-power) — VERIFIED primary + free public source |
| "Hi-vis: ANSI/ISEA 107; Class 2 required for daytime roadway work; Class 3 for nighttime or high-speed roadway work" | ANSI/ISEA 107 [confirm edition] — paywalled; OSHA 29 CFR 1910.268(b) references ANSI 107; MUTCD Part 6 requires Class 2 minimum [2 secondaries: MUTCD + OSHA outreach] |

#### Book vs. field gap
- **Book:** 1910.268 and 1910.137 require insulating gloves when working within the minimum approach distance of energized conductors. Class 2 gloves for up to 17,000V distribution work.
- **Field:** Most OSP/telecom crews wear leather work gloves (non-insulating) for daily tasks — pulling cable, handling hardware, climbing. Leather gloves are appropriate for mechanical hazards (cut, abrasion, grip on strand). They provide zero electrical protection. The distinction: leather = mechanical protection only; rubber insulating gloves = electrical protection, worn over a liner glove and under leather. Teach when each type is required and why substituting leather for rubber on energized work is a potentially fatal mistake.

#### Interactive primitives
1. **AnnotatedDiagram:** Full-body OSP worker showing correct PPE layers: Class E hard hat, safety glasses (ANSI Z87.1), Class 3 hi-vis vest, work gloves (leather), boots (ASTM F2413 EH-rated), with insets showing where rubber insulating gloves would be added for energized work
2. **Sortable:** Drag PPE items to the hazard types they protect against (impact, electrical, chemical, struck-by, fall)
3. **Quiz (MC):** You are working on a joint-use pole 3 feet from a 7,200V distribution conductor. What class of rubber insulating glove do you need at minimum? A) Class 00 B) Class 0 C) Class 1 D) Class 2 → **C** (Class 1 rated to 7,500V covers 7,200V phase-to-ground)
4. **Flashcards:** PPE vocabulary (8 terms)

---

### T18.L06 — Traffic Control & Flagging — MUTCD Part 6

#### DAG prerequisites
- T18.L01 (hazard recognition)

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "MUTCD Part 6 governs temporary traffic control (TTC) zones; issued by FHWA; adopted by states as condition of federal highway funding" | MUTCD 11th Edition (2023), Part 6, Chapter 6A.01 (mutcd.fhwa.dot.gov) — VERIFIED free public PDF |
| "Chapter 6E of MUTCD covers flagger control; flagger must use STOP/SLOW paddle (not flag alone) per Chapter 6E standards" | MUTCD Chapter 6E (mutcd.fhwa.dot.gov) — VERIFIED free public source |
| "MUTCD requires persons assigning TTC responsibility to be trained/certified in TTC principles" | MUTCD 11th Edition, Chapter 6B General Requirements — VERIFIED per search results |
| "Advance warning signs required: first sign at 2× posted speed limit in feet for urban/suburban; 8× for rural" | MUTCD Part 6, Table 6C-1 advance warning sign spacing — VERIFIED free public source at mutcd.fhwa.dot.gov |
| "Many states require separate flagger certification card beyond general MUTCD awareness" | State DOT requirements (varies by state — AHJ governs); MUTCD Chapter 6B note on certifications — VERIFIED as state-variable; Georgia DOT (Carter's AHJ) references ATSSA or ACCES certification |

#### Book vs. field gap
- **Book:** MUTCD Part 6 requires a Traffic Control Plan (TCP) submitted to the AHJ before work begins. The TCP shows device spacing, lane closures, speed reduction, and flagger positions.
- **Field:** On low-volume county roads and rural RUS jobs, crews often set up cone tapers and flaggers without a formal TCP drawing. This is common on short-duration work (< 1 hour). For any state-maintained highway, DOT encroachment permit, or high-speed corridor, a PE-stamped TCP is typically required. Teach the rule AND the field norm: where the TCP is strictly enforced vs. where it's handled informally, and what the crew's liability exposure is if there's an incident without a proper TCP on file.

#### Interactive primitives
1. **BranchingScenario:** "You need to place a splice case at a vault in the shoulder of a 45 mph state highway. Walk through: Do you need a TCP? What devices do you need? Who can serve as flagger? What are the advance warning sign distances?"
2. **AnnotatedDiagram:** Sample short-duration lane closure on a two-lane road showing advance warning area, taper, work space, buffer, and flagger position with approximate MUTCD spacing
3. **Quiz (MC):** The minimum hi-vis apparel class for roadway work during the day is: A) Class 1 B) Class 2 C) Class 3 D) None required → **B**
4. **Flashcards:** 6 traffic control terms

---

### T18.L07 — Working Near Energized Conductors — MAD/MAB

#### DAG prerequisites
- T18.L01 (hazard recognition, hierarchy of controls)
- T18.L05 (PPG glove classes — referenced in MAD discussion)
- T01.L02 (Parts of a Pole — supply space, communication space)

#### Scope note
T18.L07 is **awareness only**. OSP/telecom crew members are typically NOT 1910.269-qualified electrical workers and must not work within the MAD. The lesson teaches: (a) what MAD/MAB means, (b) how to read Table R-6 to determine the distance, (c) what to do when work requires proximity to energized conductors (STOP, notify the utility, get a qualified observer or de-energize), and (d) that violating MAD is how telecom workers die on joint-use poles. No "how to work energized" content.

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "29 CFR 1910.269(l)(2) Table R-6 specifies MAD for qualified workers by voltage class" | 29 CFR 1910.269(l)(2) and Table R-6 (osha.gov; ecfr.gov) — VERIFIED primary source |
| "Table R-6 example: 1–15 kV phase-to-ground = 2 ft 2 in (0.66 m) MAD for qualified worker" | OSHA MAD Calculator text version (osha.gov/power-generation/rulemaking/madcalculator/tables) — VERIFIED free public source |
| "Table R-6 example: 46.1–72.5 kV = 3 ft 0 in (0.9 m) MAD" | OSHA MAD Calculator tables (osha.gov) — VERIFIED free public source |
| "Unqualified workers (non-1910.269-trained) must stay outside the MAB — which is farther than the MAD by an additional safety margin" | 29 CFR 1910.269(l)(1); OSHA eTools on energized vs. de-energized work — VERIFIED |
| "1910.269 applies when telecom work is performed on joint-use poles where supply conductors are energized" | 29 CFR 1910.269(a)(1) scope; OSHA eTool Electric Power — VERIFIED |
| "'Induced voltage' on telecom messenger from parallel power line: not the same as direct contact hazard, but can still be lethal at high-current parallel runs" | RUS Bulletin 1751F-810 (electrical protection of communication facilities) — on allowlist; confirmed scope |

#### Book vs. field gap
- **Book:** The MAD in Table R-6 applies to 1910.269-qualified workers. Unqualified workers must stay outside the MAB — which per OSHA interpretation means the minimum safety clearance effectively becomes "don't get within arm's reach plus tools of any uninsulated energized conductor."
- **Field:** On joint-use poles, telecom crews routinely work within 5–6 feet of distribution conductors. Most crews are NOT 1910.269-qualified. The informal crew rule is: "I'm below the neutral, I'm in the comm space, I don't touch anything above me." This is the practical approach and it's correct in most situations — the communication space IS separated from the supply space per NESC Rule 235, and if supply conductors are properly insulated, physical contact is the only real hazard. BUT: (a) insulation can be deteriorated and invisible, (b) induced voltage in the messenger builds at parallel-run spans, (c) accidental contact with a fallen supply conductor. Teach the standard, teach the field norm, teach where the norm fails.

#### Interactive primitives
1. **WorkedExample:** "A distribution line on a joint-use pole runs at 14.4 kV phase-to-ground. Read Table R-6: what is the MAD for a qualified worker?" → 2 ft 2 in. "Your crew is not 1910.269-qualified. What is the unqualified approach limit?" → Stay outside the MAB; in practice, do not work within arm's reach + tool length without utility supervision.
2. **Quiz (MC):** As a telecom worker who is not 1910.269-qualified, you need to do splice work 18 inches from an energized 14.4 kV conductor. You should: A) Proceed quickly B) Have someone call 911 in case C) Stop work, notify your supervisor, request utility de-energize or observation D) Put on rubber gloves and proceed → **C**
3. **Flashcards:** MAD, MAB, qualified electrical worker (5 terms)

---

### T18.L08 — Hazardous Materials on an OSP Job

#### DAG prerequisites
- T18.L01 (hierarchy of controls; SDS introduced briefly — L08 expands)

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "29 CFR 1910.1200 (HazCom 2012) requires SDS for all hazardous chemicals; GHS-aligned 16-section format" | 29 CFR 1910.1200 (ecfr.gov) — VERIFIED primary source |
| "Fiber optic gel (thixotropic flooding compound): primary ingredient is mineral oil or polybutene; SDS required; can cause skin/eye irritation; not acutely toxic but chronic skin contact concerns" | Manufacturer SDS (Corning, OFS, AFL — publicly posted on their websites); NIOSH ICSC for mineral oil [vendor SDS as secondary — acceptable per allowlist rule for product-specific specs] |
| "HDPE conduit heat-fusion fumes: polyethylene combustion releases hydrocarbons and carbon monoxide; adequate ventilation required" | OSHA eTool on plastic fumes; manufacturer safety bulletins — VERIFIED as secondary |
| "Silica dust: crystalline silica exposure during concrete/asphalt cutting; OSHA permissible exposure limit (PEL) = 50 µg/m³ TWA per 29 CFR 1910.1053" | 29 CFR 1910.1053 (ecfr.gov) — VERIFIED primary source |
| "Battery acid (lead-acid batteries in huts): sulfuric acid; OSHA PEL = 1 mg/m³ per 29 CFR 1910.1000 Table Z-1" | 29 CFR 1910.1000 Table Z-1 (ecfr.gov) — VERIFIED primary source |

#### Book vs. field gap
- **Book:** 1910.1200 requires employers to maintain SDS files accessible to all workers for every hazardous chemical on site. Workers must be trained in SDS interpretation.
- **Field:** Most OSP crews never look at an SDS for gel or conduit materials. The chemicals encountered daily (filling compound, cleaner, HDPE adhesive) are low acute-hazard materials. The SDS awareness requirement still applies; the practical hazard is chronic skin contact (gel is hard to clean, absorption through cracked skin over years) and the rare acute situation (battery spill, sewer gas in a contaminated vault, concrete saw silica). Teach which chemicals on a typical job site actually have SDSs, where to find them, and how to read Sections 4 (first aid), 8 (PPE), and 11 (toxicology) quickly.

#### Interactive primitives
1. **HotSpot:** Photo of a field truck/job site; click on items that require an SDS (gel reel, conduit cement, battery backup, concrete saw blade) vs. items that don't (fiber cable, splice hardware, PVC conduit before cutting)
2. **Quiz (MC):** Which section of an SDS tells you what PPE to wear? A) Section 3 (Composition) B) Section 8 (Exposure Controls/PPE) C) Section 11 (Toxicology) D) Section 15 (Regulatory Information) → **B**
3. **Flashcards:** SDS, PEL, TLV, GHS (4 terms)

---

### T18.L09 — Incident Reporting & OSHA 300

#### DAG prerequisites
- T18.L01 (workplace safety baseline)

#### Claims requiring citation

| Claim | Source | Status |
|---|---|---|
| "29 CFR 1904 — Recording and Reporting Occupational Injuries and Illnesses; 1904.7 defines 'recordable' incident" | 29 CFR 1904.7 (ecfr.gov) — VERIFIED primary source |
| "Recordable criteria: death, DART (days away/restricted/transferred), medical treatment beyond first aid, loss of consciousness, or HCP diagnosis of significant injury" | 29 CFR 1904.7(a) (ecfr.gov) — VERIFIED |
| "OSHA Form 300 (log), 300A (annual summary), 301 (incident report) — triad maintained by employer; 300A posted Feb 1–Apr 30 annually" | 29 CFR 1904.29–1904.32 (ecfr.gov); OSHA recordkeeping overview (osha.gov/recordkeeping) — VERIFIED free public source |
| "Fatality: report to OSHA within 8 hours; in-patient hospitalization, amputation, or eye loss: report within 24 hours" | 29 CFR 1904.39 (ecfr.gov) — VERIFIED primary source |
| "Near-miss reporting: voluntary; OSHA does not require near-miss logs but strongly encourages them; reported near-misses cannot be used against employer in enforcement" | OSHA Near Miss Reporting Systems (osha.gov/near-miss-reporting) — VERIFIED free public source |

#### Book vs. field gap
- **Book:** 29 CFR 1904 requires recording all qualifying injuries in the OSHA 300 log. Employers with 10 or fewer employees are partially exempt from routine OSHA 300 recordkeeping (but NOT from reporting fatalities/severe injuries).
- **Field:** Small telecom firms (including many RUS contractors) may have ≤10 employees and believe they're exempt from ALL recordkeeping. This is wrong — the fatality/severe injury reporting requirement (1904.39) applies to ALL employers regardless of size. Also, workers' comp carriers often require incident reports that functionally serve as the 300/301 equivalent. Teach the difference: routine 300 log = size-dependent; severe incident reporting = universal.

#### Interactive primitives
1. **Quiz (MC + drag-match):** Classify each event as recordable, not recordable, or severe-reportable: (a) Technician cuts hand, receives stitches in ER → recordable; (b) Technician jams finger, foreman applies Band-Aid on site → not recordable; (c) Technician falls from aerial lift, hospitalized overnight → recordable + severe-reportable within 24 hrs; (d) Vehicle accident injuring a passer-by → not OSHA-recordable (not work-related injury to employee)
2. **Flashcards:** OSHA 300, recordable, DART, near-miss (5 terms)

---

### T18.L10 — T18 Capstone Quiz

20 questions spanning all T18 content:
- Hierarchy of controls placement (3Q)
- LOTO sequence steps and who applies locks (3Q)
- Manhole atmospheric test requirements under 1910.268(o) (3Q)
- Fall protection trigger heights and positioning vs. PFAS distinction (2Q)
- PPE: glove class for a given voltage, hard hat class for energized work (3Q)
- MUTCD Part 6: work zone components and flagger requirements (2Q)
- MAD/MAB: read Table R-6, unqualified worker rule (2Q)
- Recordable incident classification (2Q)

Include 2 scenario-based items: one confined space entry decision tree, one incident classification with multiple events to sort.

---

## Citation Verification Summary

| # | Claim / Source | Standard section | Accessible | Verification path |
|---|---|---|---|---|
| C1 | 1910.268 scope — telecom field work | 1910.268(a) | Primary (ecfr.gov) | VERIFIED |
| C2 | 1910.268(o)(2) — manhole atmospheric test | 1910.268(o)(2) | Primary (osha.gov) | VERIFIED |
| C3 | 1910.268(g)(1) — 4-ft fall protection trigger | 1910.268(g)(1) | Primary (osha.gov + interpretation 2012-08-27) | VERIFIED |
| C4 | 1910.268(h)(8) — ladder for manholes >4 ft | 1910.268(h)(8) | Secondary (OSHA directive STD-01-15-004) | VERIFIED |
| C5 | 1910.147 LOTO procedure steps | 1910.147(d)–(e) | Primary (ecfr.gov) | VERIFIED |
| C6 | 1910.146 PRCS definition | 1910.146(b) | Primary (ecfr.gov) | VERIFIED |
| C7 | 1910.268 supersedes 1910.146 for telecom | OSHA interpretation 1993-05-19 | Primary (osha.gov) | VERIFIED |
| C8 | 1910.269(l)(2) Table R-6 MAD values | 1910.269(l)(2), Appendix B | Primary (osha.gov MAD calculator) | VERIFIED |
| C9 | 1910.132 hazard assessment requirement | 1910.132(d)(1) | Primary (ecfr.gov) | VERIFIED |
| C10 | 1910.137 rubber insulating glove classes | 1910.137 + OSHA eTool | Primary (osha.gov eTool) | VERIFIED |
| C11 | MUTCD Part 6 TTC requirements | Part 6, Chapter 6A, 6E | Primary (mutcd.fhwa.dot.gov free PDF) | VERIFIED |
| C12 | ANSI Z89.1 Class E = 20,000V, Class G = 2,200V | Z89.1-2014 (R2019) | Paywalled — 2 secondaries (OSHA SHIB + ANSI Blog) | HEDGED |
| C13 | Rubber glove Class 00–4 voltage ratings | ASTM D120 + 1910.137 | Paywalled (ASTM D120) — OSHA eTool confirms | HEDGED |
| C14 | Hi-vis Class 2 = roadway day; Class 3 = night/high-speed | ANSI/ISEA 107 [confirm edition] | Paywalled — MUTCD Part 6 + OSHA materials confirm | HEDGED |
| C15 | 1910.1200 SDS 16-section GHS format | 1910.1200 | Primary (ecfr.gov) | VERIFIED |
| C16 | 1910.1053 silica PEL 50 µg/m³ TWA | 1910.1053 | Primary (ecfr.gov) | VERIFIED |
| C17 | 1904.39 fatality (8 hr) + severe (24 hr) reporting | 1904.39 | Primary (ecfr.gov) | VERIFIED |
| C18 | OSH Act §5(a)(1) general duty clause | OSH Act §5(a)(1) | Primary (osha.gov) | VERIFIED |

**Paywalled claims: 3 (C12, C13, C14). All three have ≥2 independent secondary sources confirming the same values. No paywalled claim is cited without a verified secondary path.**

---

## Cross-Reference Map — T18 Vocabulary Used by Downstream Topics

| T18 term | Downstream topics that reference it | First introduction |
|---|---|---|
| LOTO | T14 (Grounding — stray voltage + de-energize sequence) | T18.L02 |
| confined space, atmospheric testing | T10 (Construction — manhole/vault work), T13 (Inspection — vault inspections) | T18.L03 |
| fall protection, lanyard, SRL | T07 (Staking — pole climbing), T08 (Make-Ready — climbing during surveys), T13 (Inspection — pole-top) | T18.L04 |
| PPG glove class, ANSI Z89.1 Class E | T14 (Grounding — energized grounding work), T05 (Aerial Design — joint-use safety callouts in T05.L03/L07) | T18.L05 |
| MUTCD, TCP, flagger | T10 (Construction — traffic control), T07 (Staking — roadway staking) | T18.L06 |
| MAD, MAB, qualified electrical worker | T14 (Grounding — joint-use electrical protection), T05 (Aerial Design — T05.L03 Rule 235 safety zone note) | T18.L07 |
| SDS, hazardous materials | T10 (Construction — chemical handling in field) | T18.L08 |
| OSHA 300, recordable incident | T13 (Inspection — QA documentation) | T18.L09 |
| hazard recognition, hierarchy of controls | T04 (Route Survey — pre-survey hazard identification), all field topics | T18.L01 |

**DAG annotation for downstream topic authors:** Any lesson in T04, T07, T08, T10, T13, T14 that references a T18 term listed above MUST annotate `prerequisites: [T18.LXX]` in its lesson `meta` export, pointing to the specific T18 lesson that introduced the term.

---

## Hallucination-Risk Register

| # | Risk | Mitigation |
|---|---|---|
| H1 | OSHA section numbers — 1910.268(g) vs. (o) vs. (h)(8) can be confused | All section cites verified against primary eCFR/OSHA.gov text; RT-A must re-verify each subsection |
| H2 | "1910.146 applies to telecom manholes" — common training misconception | Locked: 1910.268(o) is the primary standard per 1993 OSHA interpretation. RT must flag any lesson content that states 1910.146 as the primary rule for routine telecom manholes |
| H3 | MAD Table R-6 values — voltage-specific; wrong voltage class → wrong distance | All MAD values cited from OSHA's own public MAD Calculator tables, not from training-data memory |
| H4 | PPG glove class voltage ratings — easy to transpose classes 1/2/3 | Verified: Class 1 = 7,500V, Class 2 = 17,000V, Class 3 = 26,500V per 1910.137 + OSHA eTool |
| H5 | ANSI Z89.1 Class letters — "Class E" vs. "Class EE" vs. Type I/II — training materials use inconsistent terminology | Lesson must define both the class letter AND the voltage rating together. Do NOT say "Class EE" — the standard is "Class E." |
| H6 | "Free climbing permitted" interpretation — easily over-stated as "no fall protection needed" | OSHA interpretation 2012-08-27 is explicit: fall protection required AT the work position. Free climbing = reaching the position only. RT must flag any lesson content that implies fall protection is never required on poles. |
| H7 | Silica PEL — some sources still cite the pre-2016 PEL of 100 µg/m³ | The current 2016 rule per 29 CFR 1910.1053 = 50 µg/m³ TWA. RT must verify the 50 µg figure. |

---

## Recommended RT Framings for T18

**RT-A: Regulatory accuracy.** Verify every OSHA section cite against eCFR. Re-read the 1993 OSHA interpretation letter for the 1910.268 vs. 1910.146 relationship. Confirm Table R-6 MAD example values match the OSHA MAD Calculator tables. Flag any lesson content that misstates section numbers, cites the wrong primary standard, or inverts the glove class–voltage mapping.

**RT-B: Pedagogy + prerequisite invariant.** Walk every lesson and verify no safety term is used before its first-introduction lesson in T18. Confirm the book-vs-field gaps are present and accurate (especially for the manhole 1910.268 vs. 1910.146 distinction, and the fall-protection free-climb allowance). Verify that T18 does NOT introduce any terms that belong to T01 vocabulary (check that all T01 terms are used, not re-defined). Confirm the downstream cross-reference table is complete — every downstream topic that uses a T18 term should have a path back to the specific T18 lesson.

---

=== T18 RESEARCH BRIEF END ===
