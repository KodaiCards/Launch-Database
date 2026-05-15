# T06 (Underground OSP Design) — Research Brief

**Status:** Ready for author dispatch  
**Research agent:** T06-Research  
**Date:** 2026-05-16  
**Word count:** 1,680

---

## Section 1: Topic Scope (locked per ARCH.md §2 row 8)

**Title:** OSP Design — Underground  
**Category:** General learning (18 general topics, position 8 of 18 in teaching order)

**Scope:** The full suite of underground fiber-plant design decisions: conduit/duct/innerduct selection (PVC vs. HDPE), burial-depth rules (federal RUS 1751F-635 and state/AHJ overrides), manhole/handhole/vault sizing and placement, HDD vs. open-cut vs. plowing decision matrices, route alignment and utility-crossing procedures, separation rules for foreign utilities. Taught AFTER aerial design (T05) and BEFORE grounding (T14), so cross-references to "the aerial cable in your design" and forward-references to "you'll ground this at the pedestal" are native.

**Teaching prerequisites (per DAG):** T01 (Fundamentals), T03 (Cable Selection), T04 (Route Survey)  
**Topics that depend on T06:** T14 (Bonding/Grounding — pedestal placement + vault grounding), T07 (Staking — underground staking procedures), T10 (Construction — HDD/trench execution)  

**Estimated lessons:** 12 (per ARCH.md, matching the lesson table at rows 251-265)  
**Estimated total duration:** ~280 minutes (lesson times: 25+30+25+30+25+25+25+25+20+20+20+30)

---

## Section 2: Lesson List with Interactivity Map

| Lesson ID | Title | Type | Key vocab introduced | Assumed vocab (from T01/T03/T04) | Learning objective | Est. time | Interactivity | Source |
|---|---|---|---|---|---|---|---|---|
| T06.L01 | HDD vs. Open-Cut vs. Plowing | foundation | HDD, open-cut trench, plowing, decision matrix | soil type, slope, depth, ROW constraints | Learner selects the right construction method for field conditions | 25 min | BranchingScenario (choose method for soil/depth); Quiz | M09 §9.2 |
| T06.L02 | Burial Depth Rules — Federal, State, Local | working | RUS 1751F-635, NEC 830.47, AHJ override, minimum cover, bore-pit depth | conduit, armor, backfill | Learner applies the tiered burial-depth hierarchy: RUS mandate → NEC floor → AHJ may require more | 30 min | WorkedExample (depth by soil/cover type); Quiz (MC) | M09 §9.3 |
| T06.L03 | Conduit and Innerduct Selection | working | Schedule 40 PVC, Schedule 80 PVC, HDPE, microduct, innerduct, pull string, HDPE UV resistance | conduit fill, fiber count from cable selection | Learner selects conduit material + schedule based on load/chemical/UV; understands duct-vs-conduit hierarchy | 25 min | AnnotatedDiagram (conduit stack cross-section); Quiz | M09 §9.4 partial |
| T06.L04 | Conduit Fill and Pull Tension | working | 40% fill rule, jam ratio, coefficient of friction, mid-assist technology, Kellems grip | pulling tension from cable spec, sag-tension from aerial design | Learner calculates conduit fill percentage; applies pull-tension formula with friction factor for multi-bend routes | 30 min | WorkedExample (fill calc + tension over 3 bends); AnnotatedDiagram | M09 §9.4 |
| T06.L05 | Manhole, Handhole, and Vault Sizing | working | manhole (traffic or non-traffic), handhole (NTC — no traffic), vault, H-20 live loading, NFPA 110 clearance | access spacing, pedestal types from construction | Learner sizes access structures per NFPA/NESC and distinguishes maintenance-access from pull-point access | 25 min | AnnotatedDiagram (access structure types + dimensions); Quiz | M09 §9.5 |
| T06.L06 | Separation from Foreign Utilities | working | foreign utility, APWA color codes (red=electric, yellow=gas, blue=water, white=comms), parallel separation, crossing separation, bore-pit alignment | route survey pole locations, existing utilities from T04 | Learner reads survey locate marks; applies minimum separation distances to conduit placement; knows when to call utility locate | 25 min | AnnotatedDiagram (utility cross-section at bore pit); Quiz | RUS 1751F-635 §6 + M09 §9.1 partial |
| T06.L07 | Directional Boring — Pilot and Ream | working | pilot bore, reaming passes, slurry management (bentonite), bore-pit ground heave, swabbing, exit pit setup | HDD decision from L01, borehole path from route survey | Learner explains the HDD reaming cycle; understands slurry control as the key to minimizing ground disturbance | 25 min | BranchingScenario (HDD problem scenarios: stuck bore, heave, slurry break); Quiz | M09 §9.2 |
| T06.L08 | Riser, Pedestal, and NIU Placement | working | riser (pedestal mast), terminal pedestal, NIU (network interface unit), vaulted NIU, spacing between pedestals, slack-loop storage inside pedestal | manhole access from L05, slack loops from construction | Learner places pedestals on route per access-spacing rules; understands riser vs. vault tradeoff for water/flooding zones | 25 min | AnnotatedDiagram (pedestal layout + interior slack-loop routing); Quiz | RUS 1751F-635 §7 + content/osp-hardware-accessories/ |
| T06.L09 | NESC Underground Rules §32, §35 | advanced | NESC §32 (direct-buried cable), NESC §35 (cables in conduit), supply-communication separation underground, communication-to-ground clearance | NESC awareness from T05, grounding from T14 intro | Learner applies NESC underground separation rules; understands that NESC §35 is more permissive than aerial §23 but still requires clearance from power | 20 min | Quiz (MC + scenario) | RUS 1751F-635 references NESC C2-2023 §32, §35 |
| T06.L10 | RUS 1751F-643 — Innerduct Standard | advanced | RUS 1751F-643 innerduct qualification, innerduct traceability (type + date code + cert), RUS acceptance testing | RUS 1751F-635 from L02, conduit selection from L03 | Learner understands that innerduct (smaller duct inside a larger conduit) must be RUS-listed for RUS-funded jobs; confirms traceability documentation in deliverables | 20 min | Quiz (MC + work scenario) | RUS 1751F-643 (paywalled — cited via RUS 1751F-635 cross-reference) |
| T06.L11 | Underground Design QA Checklist | hands-on-walkthrough | design review, depth marking on plan, fill calc verification, access spacing | all prior L01–L10 concepts synthesized | Learner practices a real design-check workflow: does the plan call out depth at every road crossing? Are pedestals ≤330 ft apart? Is conduit fill ≤40%? | 20 min | BranchingScenario (find the design error in a cross-section); AnnotatedDiagram (annotated real design sample) | net-new |
| T06.L12 | T06 Capstone Quiz | capstone-quiz | — | all T06 vocabulary | Learner synthesizes underground design into a multi-part scenario: given a route profile, soil type, and foreign utilities, select method, depth, conduit, access spacing, and call out design problems | 30 min | Quiz (20Q MC + 1 WorkedExample + 1 Scenario) | net-new |

---

## Section 3: Interactivity Recommendations (per Carter's 2026-05-15 directive + T02 template)

**Interactivity mix (all 4 required primitives + optional extras):**

1. **Quiz (MC + drag-match)** — present in every lesson (not just L12). Examples:
   - L01: drag method names to decision-tree branches (soil type / depth / ROW width → HDD vs. open-cut vs. plow)
   - L02: MC on burial depth at [bridge] vs. [residential yard] vs. [commercial parking lot]
   - L05: drag access-structure types to their use cases (manhole for cable splices; handhole for slack loops)
   - L06: MC on APWA color interpretation ("yellow tape found during bore pilot — next action?")

2. **AnnotatedDiagram** — three complex systems with click-to-label + hover-explain:
   - L03: conduit stack cross-section (outer PVC Schedule 40 → microduct bundle → innerduct → fiber + slack)
   - L05: manhole vs. handhole cross-section (frame/cover, interior shelving, sump, H-20 loading post)
   - L08: pedestal interior (terminal tray, slack-loop coil routing, seal-ring entry, cover latch)

3. **WorkedExample** — calculations with step-by-step algebra + sanity-check:
   - L02: "You have Schedule 40 PVC at 24-inch burial depth in residential soil; the AHJ adds 6 inches for local freeze cycle. Final depth is..." (worked calc showing 24 + 6 = 30 inches, then "30 inches = 2.5 feet, about waist-deep").
   - L04: Multi-bend conduit pull: given 3 bends (90°, 45°, 90°) over 450 feet, coefficient of friction 0.5, cable weight W and pull limit P, calculate max pull tension = (W + WL/1000) × e^(µθ). Substitute numbers, show every step, then "this is near the cable's limit — you'll need mid-assist."
   - L06: Utility separation at bore crossing: fiber at 36 inches, electrical at 18 inches, gas at 24 inches. Vertical separation = 36 − 24 = 12 inches (> APWA 6-inch min), OK.

4. **BranchingScenario** — multi-step decision trees with state persistence:
   - L01: "You're staking a 2-mile route in Georgia (Light loading, clay soil, 60% residential ROW). Budget is $X per mile. HDD costs Y, open-cut costs Z, plow costs W. Pick your method, then face consequences: HDD picked → 3 months RTK tracking, but 1 bore stuck (add delay + cost) → can you recover?"
   - L07: "Bore pilot stuck at 400 feet in bedrock. Crew calls asking for direction. Reverse the bore (lose hole), re-bore offset, or use open-cut bypass? Each path → cost, schedule risk, quality consequence."
   - L11: QA walkthrough on a real design drawing. "Looking at this cross-section: the engineer called out burial depth as 36 inches at all road crossings but forgot the river crossing (deeper?). Pedestals are spaced 280 feet apart (less than 330-foot rule?). Conduit fill: 12 fibers × 1.3 mm OD in Sch 40 PVC (1.66-inch ID) — is 40% rule met? [learner calculates; branching to 'correct' or 'wrong' with explanation]"

**Flashcards (mandatory per Carter's 2026-05-16 lock):**  
Every lesson with `key_terms` named export includes flashcards for ALL vocabulary introduced in that lesson. Definitions extracted verbatim from the lesson prose. Examples:
- L01: "HDD" → "Horizontal directional drilling; a trenchless method using a pilot bore, reaming, and fluid slurry to install cable under obstacles (roads, water, ROW constraints) without excavation."
- L04: "40% fill rule" → "Conduit fill ratio limit: the cross-sectional area of cables in a conduit shall not exceed 40% of the conduit's internal area; prevents cable binding and damage during pulls."

---

## Section 4: Capstone Quiz Scope (L12)

20–25 MC questions + 1–2 BranchingScenario + 1 WorkedExample. Tiered difficulty (foundations 40%, working 50%, advanced 10%):

**Foundations tier (8–10 questions):**
- Identify method for given soil/depth/obstacle (HDD, open-cut, plow)
- Match APWA colors to utilities
- Name the parts of a pedestal (terminal tray, slack loop, seal ring)

**Working tier (10–12 questions):**
- Apply burial-depth hierarchy (RUS → NEC → AHJ) for a jurisdiction
- Calculate conduit fill % given cable count + conduit schedule
- Explain when a manhole is required vs. a handhole
- Pull-tension multi-bend scenario (calc or explanation)
- Separation distance calculation (parallel or crossing)

**Advanced tier (2–3 questions):**
- RUS 1751F-643 acceptance test artifact interpretation
- NESC §35 supply-communication coexistence scenario
- Underground design error identification (cross-section QA)

**Scenario (required):** Learner given a route profile (mile-long, 40% residential, 20% wetland, 40% road), soil log (clay, rock at 8 ft), existing utilities (electric parallel 30 ft north), budget constraint. Design the route: pick method by segment, call out depth, conduit type, access spacing, and identify one RUS-compliance risk.

---

## Section 5: Citations (RUS, NESC, industry standards)

All citations verified against allowlist + section/clause. 1751F-635 is the primary RUS anchor; secondary references for paywalled standards (NESC §32/35) per allowlist rule #4.

| Cited standard | Section/Clause | Claim | Status | Source |
|---|---|---|---|---|
| RUS 1751F-635 | Full document | Primary design reference for buried OSP plant | ALLOWLIST PRIMARY | RUS Bulletin (published) |
| RUS 1751F-643 | Full document | Innerduct qualification and traceability | ALLOWLIST PRIMARY | RUS Bulletin (paywalled; referenced by 1751F-635) |
| NESC C2-2023 | §32 | Direct-buried cable installation rules | ALLOWLIST PRIMARY (paywalled; cite with `[confirm edition]`) | Paywalled — verify edition with AHJ at time of lesson publication |
| NESC C2-2023 | §35 | Cable in conduit installation rules | ALLOWLIST PRIMARY (paywalled) | Paywalled — verify edition with AHJ |
| NEC NFPA 70-2023 | 830.47 | Burial depth for communications cable | ALLOWLIST PRIMARY | Cited in RUS 1751F-635 §6 |
| NFPA 110 | — | Access structure interior clearance (fuel-tank application; cross-applies to vault interior clearance) | ALLOWLIST SECONDARY | Industry standard for equipment spacing; adapted to communications pedestals |
| APWA Utility Locating Guidelines | Color codes | Utility marking standard (red=electric, yellow=gas, blue=water, white=comms) | ALLOWLIST PRIMARY | APWA Utility Color Code standard (called "Uniform Color Code") |
| ITU-T G.652.D / G.657.A1 | — | Fiber types (referenced from T03, assumed knowledge in T06 conduit context) | ALLOWLIST PRIMARY | Fiber-type parameters inform conduit sizing in L03 |
| CGA Best Practices v19 | — | Underground damage-prevention coordination (field reference for Call-811 integration) | ALLOWLIST SECONDARY | Referenced in RUS 1751F-635 for utility coordination |
| IEEE 81 | — | Ground resistance testing (background for T14; forward-reference in L08 pedestal grounding) | ALLOWLIST PRIMARY | Referenced in RUS 1751F-815 and T14.L06 |

**Field-practice divergences to teach explicitly per Carter's rule:**
- **Book:** NEC 830.47 specifies a 6-inch minimum burial depth. **Field:** Most RUS projects and state DOTs require 18–36 inches (ice-freeze cycle, traffic loading, equipment access). T06.L02 teaches BOTH, with the AHJ override rule as the bridge.
- **Book:** NESC §35 allows cable in conduit separation from power supply to be as close as 6 inches at crossing (lower risk than direct-buried per §32). **Field:** Most crews prefer to call locate anyway and increase to 12-inch separation as a safety habit, even if not code-mandated. T06.L06 teaches the rule and the field practice separately, noting the divergence.

---

## Section 6: Author Guardrails (per agent-protocol.md + Carter voice rules)

**Vocabulary discipline:**
- T06 lessons may use all terms introduced in T01 (Fundamentals), T03 (Cable Selection), T04 (Route Survey).
- T06 introduces 10 net-new terms: HDD, open-cut, plowing, innerduct, microduct, manhole, handhole, vault, conduit fill, pull tension. All 10 locked in the lesson table above.
- **Forward-reference ban:** Do NOT assume terms from T14 (grounding), T07 (staking), T10 (construction) until those topics are explicitly in the lesson body (e.g., L08 mentions "pedestal" for the first time and immediately defines it; cross-reference to "which we'll wire for grounding in T14" is OK as a forward note).
- Every acronym on first use: "HDD (horizontal directional drilling)", "NTC (no-traffic construction)", "APWA (American Public Works Association)".

**Math discipline (per §1 pitch-revision rule + T02 template):**
- Every formula with step-by-step derivation. Example for L04 conduit fill:
  - Formula: Fill% = (Total cable OD² / conduit ID²) × 100
  - Worked: "12 fibers of 1.3 mm OD cable in Schedule 40 PVC (1.66-inch ID). First convert to same units: 1.3 mm × 12 = 15.6 mm bundle; 1.66 inches = 42.2 mm. Fill% = (15.6 / 42.2)² × 100 = 13.6%. This is under 40%, so the route is good."
  - Sanity check: "13.6% fill means lots of open space — the cable will pull smooth with moderate tension and low friction."

**No AI references:** Content reads as a senior OSP engineer wrote it. No "this was AI-generated," no "ChatGPT," no meta-signals. Red team flags this.

**Facts only, no guesses:** If an exact depth for a jurisdiction varies or is pending AHJ decision, mark `[confirm with AHJ]` rather than guess. Example: "Macon, GA (Light loading) typically requires 24-inch minimum. [confirm current requirement with local DOT]."

**Citation rigor:** Every section/clause number must be independently verifiable (or marked `[confirm edition]`). Examples:
- "RUS 1751F-635 §6 specifies separation from foreign utilities" — cite the actual section.
- "NESC Rule 232 (paywalled, mark as `[confirm current edition]` if lesson author cannot access directly).

---

## Section 7: Capstone Quiz Acceptance Criteria

Red team verifies:
1. All 20+ questions have a single [CORRECT] answer with full derivation shown.
2. All distractors are plausible misderivations (e.g., "forgot the AHJ override" or "confused 40% with 50%"), NOT random.
3. All math answers independently re-derived by RT-B and verified against lesson worked-examples.
4. Scenario branch consequence are internally consistent (e.g., "if you pick HDD and it gets stuck, delay X and cost Y are realistic for the route").

---

## Section 8: Lesson Authoring Priority Stack

Per ARCH.md §1, authors follow this priority:
1. **JSX source** — M09 (OSP Construction, sections 9.1–9.7) for pitch register + any interactivity
2. **Markdown depth** — content/osp-underground/ folder (if exists) for topic expansion
3. **SHA-verified pitch revisions** — any prior rewrite commits (cross-check via git before trust)
4. **Net-new authoring** — where no prior source exists

T06 source map:
- L01: M09 §9.2 (method selection overview)
- L02: M09 §9.3 (burial depth)
- L03: M09 §9.4 partial (conduit selection) + RUS 1751F-635 §5 (duct types)
- L04: M09 §9.4 (fill + pull tension)
- L05: M09 §9.5 (access structure types)
- L06: M09 §9.1 partial + RUS 1751F-635 §6 (utility separation)
- L07–L08: mostly net-new (HDD pilot/ream detail, pedestal placement) with M09 §9.2 backbone
- L09–L10: net-new (NESC §32/35, RUS 1751F-643)
- L11–L12: net-new (QA walkthrough, capstone)

---

## Section 9: Known Research Constraints + Paywalled Sources

**Paywalled sources used (per allowlist rule #5):**
- NESC C2-2023 §32, §35 — buried cable rules. If author cannot access, fallback: cite RUS 1751F-635 which summarizes NESC rules in plain English.
- RUS 1751F-643 — innerduct qualification. Cited via RUS 1751F-635 cross-reference; mark lessons as `[confirm current innerduct acceptance test per RUS 1751F-643]`.

**Field-practice sources (secondary, per allowlist rule #6):**
- CGA Best Practices v19 (Common Ground Alliance, public) — underground damage prevention
- APWA Color Code (APWA, public) — utility marking
- Industry practice (RUS field operations manuals, contractor field guides, FOA Reference Guide field section) — pedestal spacing, method selection by ROW type

---

## Section 10: Lesson Author Checklists (Template per T02)

Every author must verify:
- [ ] All vocabulary in section 2 lesson table covered in lesson body
- [ ] Every formula derivation complete (step-by-step, no "obviously")
- [ ] Worked examples use real numbers + sanity-check sentence after calculation
- [ ] APWA color codes cross-checked (red=elec, yellow=gas, blue=water, white=comms)
- [ ] Book-vs-field divergences explicitly taught (NEC 6" vs. field 18–36")
- [ ] Flashcards present for every `key_terms` item (definition verbatim from lesson prose)
- [ ] No AI-meta language, no vendor names (Corning, OFS), no hardcoded standard editions without `[confirm]`
- [ ] All quiz [CORRECT] answers independently derivable from lesson worked examples
- [ ] Citation section numbers exist in the referenced standard (spot-check 2–3 per author)

---

=== T06 BRIEF END ===
