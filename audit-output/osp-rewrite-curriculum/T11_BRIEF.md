# T11 (Splicing) — Research Brief

**Status:** Ready for author dispatch  
**Research agent:** T11-Research (primary-source-skeptical framing)  
**Write-path constraints acknowledged:** only `audit-output/osp-rewrite-curriculum/T11_BRIEF.md` written.  
**Date:** 2026-05-17  
**Word count:** ~3,200

---

## Section 1: Topic Scope (locked per ARCH.md §2 row 14)

**Title:** Splicing  
**Category:** General learning — teaching position 14 of 19  

**Scope:** Everything a crew member or engineer needs to know about joining fibers in the field. Fusion vs. mechanical splicing physics, preparation workflow (strip → clean → cleave → align → splice → protect), core vs. cladding alignment decision logic, ribbon/mass fusion, splice-loss budgets with real acceptance criteria, TIA-598 color-code system (the universal field language), splice case selection and closure technique, splicer maintenance, and field hygiene. Taught AFTER OSP Construction (T10) because the learner must understand the field conditions (manhole, aerial, pedestal) where splicing happens. Before Testing (T12) because OTDR use depends on understanding what creates a loss event at a splice.

**Teaching prerequisites (per ARCH.md DAG):**
- T01 — Fundamentals & Vocabulary (OSP/ISP, cable anatomy, splice case anatomy, project lifecycle)
- T02 — Fiber Physics (attenuation dB/km, MFD, macrobend/microbend, link budget, G.652.D/G.657)
- T03 — Cable Selection & Materials (loose-tube vs. ribbon, TIA-598-D color coding, buffer tube, fiber count)
- T10 — OSP Construction (field environment: manhole entry, pedestal, aerial platform, safety baseline from T18 via T10)

**Topics that depend on T11 (per ARCH.md DAG):**
- T12 — Testing: OTDR event analysis assumes the learner understands what a splice event looks like physically
- T15 — Restoration & Outage Response: emergency splicing workflow
- T16 — As-Built Documentation & GIS: splice matrix, fiber path tracking

**Estimated lessons:** 15 (per ARCH.md, matching lesson table rows 381–397)  
**Estimated total duration:** ~375 minutes  

---

## Section 2: Per-Lesson Outline with Interactivity Map

| Lesson ID | Title | Type | Key vocab introduced | Assumed vocab (from T01/T02/T03/T10) | Draft learning objectives | Est. time | Interactivity | Source migration |
|---|---|---|---|---|---|---|---|---|
| T11.L01 | Why We Color-Code Fibers | foundation | TIA-598 color sequence, 12-color system, mnemonic (BRO-OGrBW/SrPiAQ or field variant), color-blind crew accommodation, tube-within-tube system | buffer tube (T01, T03), fiber (T01), cable (T01) | Learner recites the 12-color sequence in order, explains the mnemonic used on real crews, and describes how a color-blind crew member safely identifies fibers without relying on hue alone (position counting + tube-sequencing) | 20 min | AnnotatedDiagram (color tube/fiber map — click a fiber position to reveal its color + TIA-598 position ID); Quiz (drag-match: fiber number → color name) | M07 §7.4 (moved here per DAG fix; ARCH.md §3 Resolution 3) |
| T11.L02 | TIA-598 Color Sequence — Every Fiber | working | all 12 colors (Blue/Orange/Green/Brown/Slate/White/Red/Black/Yellow/Violet/Rose/Aqua), tube color within cable, fiber-within-tube counting, APC (Angle Physical Contact — green connector convention), UPC (blue connector convention), APC/UPC mating prohibition | TIA-598-D from T03.L10, buffer tube order from T03 | Learner correctly maps any fiber position (e.g., "fiber 73 in a 144F cable" = tube 7, fiber 1 in that tube) using the TIA-598 system, and explains why UPC-to-APC mating is prohibited (back-reflection mismatch) | 25 min | Quiz (MC + drag-match colors in sequence); WorkedExample (given 144F cable: which tube + fiber-within-tube is fiber position 73? Step-by-step mod/div arithmetic shown) | M07 §7.4; TIA-598-D [PAYWALLED — confirm edition] |
| T11.L03 | Splice Loss — Four Numbers | working | FOA design target (0.10 dB typical), field acceptance ≤0.10 dB (ITU-T L.400 target), contract threshold (varies — often ≤0.30 dB max per splice), industry concern threshold (~0.50 dB = investigate), per-splice budget allocation | attenuation dB/km (T02.L02), link budget (T02.L06), dB/dBm (T02.L05) | Learner correctly accepts or rejects a measured splice loss reading against each of the four reference points, and explains why the contract threshold (0.30 dB) differs from the ITU-T design target (0.10 dB) | 30 min | WorkedExample (given OTDR reading of 0.08 dB: accept/reject against FOA target, ITU-T target, typical contract, concern threshold — step-by-step verdict with rationale); Quiz (MC: four scenarios, accept or reject each?) | M04 §4.1; ITU-T L.400 [public summary]; FOA CFOS-S KSAs |
| T11.L04 | Fusion Splicing — Step by Step | foundation | fusion splice, arc discharge, strip, clean, cleave, align, fuse, proof-test, splice protector (heat-shrink sleeve), splicer display (loss estimation), fiber holder (V-groove assembly) | G.652.D (T02, T03), G.657 (T02, T03), buffer tube stripping from T03 | Learner performs (or describes in sequence) every step of a fusion splice from opening the buffer tube to closing the splice protector, with correct tool usage and quality checkpoints at each step | 30 min | AnnotatedDiagram (fusion splicer anatomy — label each component: V-grooves, wind cover, arc electrodes, fiber clamps, monitor); Quiz (MC: sequence scramble — put 8 steps in the right order) | M04 §4.2; ITU-T L.400 |
| T11.L05 | Core-Align vs. Cladding-Align | working | LID (Local Injection and Detection), core-align splicer, cladding-align (profile alignment system PAS), MFD mismatch loss, low-loss mode = core-align, field-speed mode = cladding-align | MFD (T02.L03), G.652.D (T02), G.657 (T02) | Learner selects the correct alignment mode for three splice scenarios (G.652.D to G.652.D, G.652.D to G.657.A2 bend-insensitive, field emergency with wet fibers) and predicts the approximate extra loss from MFD mismatch in the cross-type case | 25 min | WorkedExample (MFD mismatch loss prediction: MFD1 = 9.2 µm, MFD2 = 8.4 µm → loss ≈ 0.035 dB using Gaussian beam formula approximation, step-by-step); Quiz (MC: 3 scenarios, which alignment mode?) | M04 §4.3; ITU-T G.652.D (MFD spec); Fujikura/Sumitomo field manuals (secondary) |
| T11.L06 | Cleave Angle and Arc Quality | working | cleave angle (target ≤0.5°, max ≤1.0° for most splicers), cleaver blade replacement interval, arc calibration (daily + when fiber type changes + when electrode life counter triggers), arc power, pre-fuse (cleaning arc), main fuse, tail-end weld | cleave from T11.L04 | Learner identifies when a splicer's estimated loss is unreliable due to poor cleave (recognizes the "cleave error" message), explains the blade replacement interval, and describes the daily arc calibration workflow | 25 min | Quiz (MC + drag: cleave defect photos → defect name → consequence → action); AnnotatedDiagram (cleave angle illustration — acceptable vs. reject) | M04 §4.2 partial; splicer operator manuals (secondary) |
| T11.L07 | Ribbon / Mass Fusion Splicing | working | ribbon fiber (12F/24F standard), mass fusion splicer, ribbon splice protector, cleave quality requirements for ribbon (all 12 angles ≤0.5° simultaneously), productivity comparison (12F ribbon = 12 single-fiber splices in ~40 sec vs. ~3 min each for singles), rollable ribbon (T03 assumed), stripping ribbon buffer | rollable-ribbon (T03.L01), ribbon cable (T03) | Learner calculates the productivity advantage of ribbon splicing for a 144F count cable (number of setups, total splice time estimate), explains the ADDITIONAL cleave quality discipline ribbon demands (one bad fiber fails the set), and describes the rollable-ribbon handling difference from flat ribbon | 25 min | WorkedExample (productivity calc: 144F cable, single-fiber @ 3 min/splice vs. 12F ribbon @ 40 sec/set → total time single = 7.2 hr, ribbon = 40 min; sanity-check sentence); Quiz (MC: when is ribbon NOT appropriate? e.g., emergency field splice of loose-tube single fibers) | M04 §4.4; ITU-T L.400 (ribbon splice specs) |
| T11.L08 | Mechanical Splicing | working | mechanical splice, index-matching gel, ceramic-sleeve mechanical splice, crimp-and-cleave splice, field use case (emergency / no power / single-fiber), mechanical splice loss spec (≤0.5 dB typical, ≤1.0 dB max), temporary vs. permanent use, re-entry limitation | splice loss from T11.L03, cleave angle from T11.L06 | Learner correctly identifies the two field scenarios where mechanical splicing is acceptable (emergency restoration without power, single-fiber T1 service restoration) vs. unacceptable (permanent OSP build, RUS contract work), and explains why index-matching gel degrades over time | 20 min | Quiz (MC: four scenarios — fusion or mechanical? with rationale per scenario); AnnotatedDiagram (mechanical splice cross-section — gel port, fiber alignment groove, crimp collar labeled) | M04 §4.5 |
| T11.L09 | Splice Case Types | working | dome closure, butt-splice (inline/horizontal) closure, wall-mount/pedestal closure, heat-shrink vs. cold-seal entry port, case reentry (re-enterable vs. permanent), splice case mounting (aerial lashing, vault cable hook, pedestal bracket, buried direct-buried case), case capacity (tray count) | splice case (T01.L04), buffer tube (T01, T03), aerial vs. underground environment (T10) | Learner selects the correct splice case type for three environments (aerial mid-span, buried handhole, CO rack-mount) and explains why dome cases are preferred for buried applications (self-seating gel seal under ground pressure) | 25 min | AnnotatedDiagram (four case types side-by-side: dome, inline, wall-mount, rack-mount — label each + point out differentiating features); BranchingScenario (case selection: environment + fiber count + reentry needed → dome? inline? pedestal? rack?) | M04 §4.6 |
| T11.L10 | Gel-Seal vs. Heat-Shrink vs. Re-enterable | working | flooding compound (FP-1/FP-2 per BICSI classification), heat-shrink port seal, re-enterable cold-seal, oversheath heat-shrink tube, gel displacement during reentry, sealing compound compatibility with cable jacket | cable jacket types from T03 (gel-filled vs. dry-block), aerial vs. underground from T10 | Learner matches each sealing system to its correct application environment and explains the single biggest field mistake: re-entering a heat-shrink sealed case without cutting back the oversheath far enough (creates moisture ingress point) | 20 min | BranchingScenario (field scenario: splice case needs to be opened 18 months after installation — gel-seal vs. re-enterable vs. heat-shrink: which requires what procedure? what can go wrong?); Quiz (MC) | net-new (R-A gap per ARCH.md); BICSI OSP Design Reference Manual (secondary) |
| T11.L11 | Splice Tray Loading and Fiber Management | working | splice tray (12F capacity typical), buffer tube routing, express loop (express fiber route that bypasses the tray splice area), slack storage coil (inside case), fiber management organizer, label placement on tray | buffer tube (T01, T03), splice case (T11.L09) | Learner demonstrates correct tray loading for a 12F tube split: 6 express fibers + 6 splice fibers, including the correct minimum bend radius on the express loop and the label convention for both tray face and buffer tube stub | 25 min | AnnotatedDiagram (labeled tray loading diagram: splice tray interior, express loop path, buffer tube entry, slack coil, splice organizer); Quiz (MC: given fiber management photo, identify 2 violations) | M04 §4.6 |
| T11.L12 | Connector Loss — Three Numbers | working | UPC (Ultra Physical Contact), APC (Angle Physical Contact, 8° polish), insertion loss (IL), return loss (RL), reference-grade connector (IL ≤0.1 dB, RL ≥65 dB for APC), typical field connector (IL ≤0.3 dB, RL ≥55 dB UPC / ≥60 dB APC), contamination as loss mechanism | attenuation/loss from T02 | Learner correctly applies the three-tier connector spec to pass/fail a connector measurement, explains the physical difference between UPC and APC polish and why APC return loss is superior (8° angle causes back-reflection to deviate out of core), and names the #1 field cause of high insertion loss (contamination — IEC 61300-3-35 pre-clean is the fix) | 25 min | WorkedExample (given three connector IL readings: 0.08 dB, 0.35 dB, 0.52 dB — classify each as reference-grade / field-acceptable / reject, with rationale); Quiz (MC + drag-match: connector type → return loss spec → application) | M04 §4.7; IEC 61300-3-35 [paywalled — confirm edition]; TIA-568.3-D §6 |
| T11.L13 | Splicer Maintenance Schedule | working | electrode life counter (typical: 2,000–3,000 arc cycles between replacement), daily arc calibration, cleaver blade replacement interval (typical: 1,000–3,000 cleaves depending on model), cleaning arc, electrode oxidation signs, splicer storage (silica gel in transport case) | fusion splice (T11.L04), arc calibration (T11.L06) | Learner builds a splicer maintenance checklist covering (1) before-each-day checks, (2) per-spool/roll checks, (3) weekly checks, (4) electrode replacement triggers, and (5) storage requirements for extended inactivity | 20 min | Quiz (MC: four maintenance scenario questions — which action required and when?); WorkedExample (electrode life: 2,500-arc-cycle spec, crew does 150 arcs/day on a large splice job → replacement interval in working days; sanity-check sentence) | net-new (R-A gap per ARCH.md); Fujikura 62S/70S operator manuals (secondary); Sumitomo T-400S operator manual (secondary) |
| T11.L14 | Field Hygiene — Before the First Cleave | working | contamination (dust, oil, moisture, buffer gel residue), IPA wipe (99% isopropyl alcohol), lint-free wipe (reel-type cleaner vs. cassette), dry cleave first (blow-off before IPA), controlled splice environment (tent/enclosure for wind/rain), gel cleanup (dry wipe first, then IPA — gel + IPA smears), PPE for IPA (nitrile gloves + ventilation), IEC 61300-3-35 inspection before connector install | IPA from T18 (SDS/hazmat awareness), dust cap (T11.L04 connector practice) | Learner performs (or correctly sequences) the field fiber-end preparation routine from tool inventory through gel removal through end-face inspection, and identifies the two most common field contamination errors: (1) IPA-first on gel-flooded fiber (smears), (2) wiping instead of rolling the lint-free reel (re-deposits) | 20 min | Quiz (MC: four hygiene-decision questions — correct or error? explain what's wrong); AnnotatedDiagram (contamination types at fiber end-face using IEC 61300-3-35 zone map overlay, annotated) | M07 §7.6 partial; IEC 61300-3-35 [paywalled — confirm edition] |
| T11.L15 | T11 Capstone Quiz | capstone-quiz | — | all T11 vocabulary | Learner integrates T11 content: given a splice job scenario (48F aerial case, mixed G.652.D and G.657.A2 fiber, ribbon + single fiber sections, OTDR showing 0.42 dB event at fiber position 23), learner selects case type, alignment mode, loss acceptance/rejection verdict, probable cause, and corrective action | 30 min | Quiz (25Q MC + 1 WorkedExample: tube/fiber position calculation for fiber 23 of 48F + case + alignment choice + verdict + fix); drag-match: color sequence portion | net-new |

---

## Section 3: Interactivity Recommendations

**T11 is heavily procedural + visual + tactile.** The 9 available primitives should lean toward AnnotatedDiagram (showing physical components), WorkedExample (loss arithmetic + fiber position math + productivity math), and Quiz (sequencing steps in order, identifying violations from photos).

1. **AnnotatedDiagram** — every lesson that teaches a physical component gets one: fusion splicer anatomy (L04), cleave angle illustration (L06), splice case types side-by-side (L09), splice tray interior (L11), contamination zone map at end-face (L14). Authors must label every component with hover-explain text.

2. **WorkedExample** — loss arithmetic present in multiple lessons: splice acceptance verdict (L03), MFD mismatch prediction (L05), ribbon productivity (L07), electrode replacement interval (L13), fiber position arithmetic tube/mod (L02). Every calculation shows every arithmetic step. Field-guy sanity-check sentence required: "0.10 dB is roughly the attenuation of 100 meters of G.652.D fiber — so a well-made splice wastes less glass than a typical 100-meter drop."

3. **BranchingScenario** — best for case selection decisions (L09, L10) and emergency mechanical splice go/no-go (L08). Case selection scenario must include re-entry requirement as a forcing variable.

4. **Quiz (MC + drag)** — step sequencing (L04 fusion steps scramble), color sequence drag (L01 fiber map, L02 full sequence), hygiene error identification (L14). Emphasis on application/identification, not memorization.

5. **HotSpot** (use in L11 and L14) — "click the violation in this tray loading photo" and "click the contaminated end-face zone in this inspection image" are ideal HotSpot use cases.

---

## Section 4: DAG Entry-Points and Cross-Topic Vocab Hand-offs

### Vocabulary T11 introduces (→ consumed downstream)

| Term | Introduced | Consumed by |
|---|---|---|
| fusion splice | T11.L04 | T12 (OTDR event analysis), T15 (emergency restoration), T16 (splice matrix) |
| mechanical splice | T11.L08 | T15 (emergency), T12 (OTDR event) |
| TIA-598 color sequence | T11.L01 | T12 (fiber identification during testing), T16 (splice matrix CSV color fields) |
| splice case | T11.L09 | T12 (testing access), T13 (inspection), T15 (restoration) |
| core-align / cladding-align | T11.L05 | T12 (interpreting OTDR splice event — alignment mode affects loss signature) |
| splice tray | T11.L11 | T16 (splice matrix, tray map documentation) |
| cleave angle | T11.L06 | T12 (OTDR: bad cleave looks like reflection event + loss event simultaneously) |
| MFD mismatch | T11.L05 | T12 (direction-dependent loss in OTDR bidirectional test — mismatch causes apparent gain) |
| splice loss acceptance threshold | T11.L03 | T12 (acceptance testing), T13 (QA pass/fail) |
| gel seal / heat-shrink | T11.L10 | T13 (inspection of case seal integrity), T15 (restoration — case re-entry decision) |

### Vocabulary T11 assumes (← must be introduced upstream)

| Term | Assumed source | Risk if missing |
|---|---|---|
| attenuation dB/km | T02.L02 | L03 splice loss acceptance calc cannot be taught without understanding decibels first |
| MFD | T02.L03 | L05 core-align vs. cladding-align is meaningless without MFD mismatch concept |
| link budget | T02.L06 | L03 splice loss in context of total budget requires this foundation |
| G.652.D / G.657.A1/A2 | T02.L05/T03.L05 | L05 alignment mode selection explicitly references fiber type |
| buffer tube | T01.L03, T03.L01 | L04, L11 reference buffer tube stripping and routing throughout |
| ribbon fiber | T03.L01 | L07 ribbon splicing assumes learner knows what rollable ribbon is |
| TIA-598-D color coding | T03.L10 | T11.L01 expands this; must be introduced at standard level in T03 first |
| splice case anatomy | T01.L04 | L09 case type comparison assumes learner knows what a splice tray and gel seal are |
| conduit/manhole/pedestal environment | T10.L01–L07 | L09–L14 constantly reference the physical environment where splicing occurs |
| LOTO / confined space entry | T18.L02–L03 (via T10) | Manhole splice work requires LOTO and atmospheric testing vocab |

---

## Section 5: Primary Citations

**Registry-first check performed:** All citations below cross-checked against `audit-output/citation-registry.md` (build date 2026-05-17). Registry-fresh entries (verified within 90 days) cited by Verified-By reference; net-new citations primary-source verified.

### Registry-fresh citations (skip re-verify)

| Citation | Description | Verified By | T11 lesson(s) |
|---|---|---|---|
| **TIA-598-D** | Optical Fiber Cable Color Coding | Haiku ground-truth 2026-05-17 | L01, L02 — color sequence, connector color conventions |
| **ITU-T G.652.D** | Single-mode fiber specs (MFD, attenuation) | Haiku ground-truth 2026-05-17 | L05, L12 — alignment mode, MFD values |
| **ITU-T G.657** | Bend-insensitive SMF (G.657.A1, G.657.A2) | Haiku ground-truth 2026-05-17 | L05 — core-align vs. cladding-align by fiber type |
| **7 CFR 1755.902** | RUS fiber spec (attenuation, MFD) | Haiku ground-truth 2026-05-17 | L03 — splice loss budget in RUS contract context |

### Net-new citations (primary-source verified for this brief)

| Citation | Description | Primary Source | Verification Notes | T11 lesson(s) |
|---|---|---|---|---|
| **ITU-T L.400** | Optical fibre joint — mechanical and optical performance specifications | https://www.itu.int/rec/T-REC-L.400/en | Public summary available; full text paywalled via ITU bookshop. L.400 Series (L-series = protection of cable and other elements of outside plant). Confirms: L.400 covers fusion and mechanical splice performance, specifies IL ≤0.10 dB design target for single-mode fusion splices. | L03, L04, L07 |
| **TIA-455** | Fiber Optic Test Procedures (FOTP) series | https://tia.org/ | PAYWALLED — confirm edition. TIA-455 is a family of test procedures (455-34 for cleave, 455-61B for proof testing, etc.). Author agent must use `[confirm edition]` and cite specific FOTP number when relevant. | L06 (cleave angle measurement FOTP-34) |
| **IEC 61300-3-35** | Fiber optic interconnecting devices — basic test and measurement procedures — end-face geometry measurement (visual inspection zone map) | https://www.iec.ch/dyn/www/f?p=103:38:0::::FSP_ORG_ID,FSP_APEX_PAGE,FSP_PROJECT_ID:1928,23,22499 | PAYWALLED — confirm edition. IEC 61300-3-35 defines the A/B/C/D zone map for fiber end-face inspection and acceptance criteria by connector class. Widely cited as primary reference for end-face inspection standards. | L12, L14 |
| **RUS 1753F-401** | RUS Bulletin 1753F-401: Specifications for Fiber Optic Splicing | https://www.rd.usda.gov/sites/default/files/UTP19.pdf | PUBLICLY ACCESSIBLE. RUS 1753F-401 covers splice requirements for RUS-financed builds: fusion splice IL requirement ≤0.30 dB per splice (contract maximum), bidirectional OTDR verification required, visual inspection before closure. Key book-vs-field note: RUS contract max ≤0.30 dB is NOT the quality target — it's the rejection threshold. Field crews should target ≤0.10 dB. | L03 — "contract 0.30 dB" threshold source |
| **FOA CFOS-S KSAs** | FOA Certified Fiber Optic Splicer knowledge/skills/abilities | https://www.thefoa.org/tech/certifications/CFOS-S.htm | PUBLICLY ACCESSIBLE. FOA CFOS-S blueprint defines acceptance criteria and core competencies for fusion and mechanical splicing. Confirms FOA design target = 0.10 dB typical. | L03, L04, L08 |
| **Telcordia GR-763-CORE** | Generic Requirements for Fiber Optic Splice Closures | https://telecom-info.telcordia.com/ | PAYWALLED — confirm edition. GR-763-CORE specifies environmental performance requirements for splice closures (temperature cycling, water immersion, crush resistance). Supports L09 (splice case selection). Author: use `[confirm edition]`. | L09 |

### Citations marked `[confirm edition]`

Per project policy (no fabricated edition numbers):
- TIA-455 FOTP series — author agent must confirm current FOTP-34 edition before citing
- IEC 61300-3-35 — confirm current edition (3rd ed. expected; verify)
- Telcordia GR-763-CORE — confirm current issue date
- TIA-598-D — already in registry as current edition designation per Haiku 2026-05-17

---

## Section 6: Book-vs-Field-Practice Notes (Required per §2 Content Rules)

Per project voice rules locked in §2: every lesson where textbook standard diverges from common field practice MUST present both sides.

| Lesson | Book standard | Field practice | Risk of confusing them |
|---|---|---|---|
| L03 (splice loss) | ITU-T L.400 design target: ≤0.10 dB per fusion splice. Contract max per RUS 1753F-401: ≤0.30 dB. | Crews doing large jobs under time pressure often accept anything ≤0.30 dB "because it passes the contract." | Compounded over 500 splices in a 48F build, 0.28 dB average per splice adds 140 dB of splice loss vs. 50 dB at 0.10 dB target — potential link budget overrun on longer spans. Build it right the first time. |
| L05 (alignment mode) | Book says: always core-align for permanent installations (lower loss, more repeatable). | Field reality: many crews leave splicer in "auto" mode, which selects cladding-align when fibers are wet or dirty (contamination prevents core detection). Cladding-align can add 0.01–0.05 dB extra loss for G.652-to-G.652, more for cross-fiber-type splices. | Cross-type splices (G.652 to G.657.A2) in cladding-align mode can produce 0.08–0.12 dB extra loss that passes contract but accumulates across a multi-splice span. |
| L06 (cleave quality) | Book (manufacturer spec): replace cleaver blade every 1,000–3,000 cleaves per manufacturer counter. | Field reality: crews often "run to failure" — replace blade only when they see visible chipping on splicer display. By then they've made hundreds of marginal-quality splices. | High cleave angle (>1°) produces bubble voids at the splice point that are not always caught by the splicer's estimated loss (the estimate is optical, not mechanical). Hidden void = early failure under thermal cycling. |
| L08 (mechanical splice) | Book: mechanical splicing is for emergency restoration only; not suitable for permanent OSP builds under RUS 1753F-401 or TIA-568. | Field reality: some crews use mechanical splices on privately-funded small builds to save setup time. Index-matching gel degrades over years in thermal cycling, leading to increasing IL over time. | Using mechanical splices on a fiber-to-the-home build that gets sold or leased to a carrier later will fail carrier acceptance testing. The fiber plant looks fine the day it's built and fails 3 years later. |
| L09 (splice case for buried) | Book (GR-763-CORE): dome closures rated for direct-buried applications; butt-splice rated for aerial or vault access. Specific entry-port sealing torque specs must be met. | Field reality: crews sometimes use aerial butt-splice cases for buried applications because "they had them on the truck." Butt-splice port seals rely on O-rings and torque; ground pressure and soil movement defeat them. | Water ingress into aerial case used buried = splice tray corrosion = increasing loss and eventual breaks within 18–36 months. |
| L10 (re-entry sealing) | Book: heat-shrink oversheath closure is permanent; re-entry requires cutting the heat-shrink tube back to factory-clean jacket and installing a new oversheath. | Field reality: crews often attempt to re-enter a heat-shrink case by slitting the tube longitudinally and "reusing" the heat-shrink length. The re-compressed tube does not seal reliably. | Moisture ingress at the re-opened heat-shrink joint often migrates along the cable into the splice tray over the following wet season. |
| L13 (splicer maintenance) | Book: arc calibration at start of every work day AND whenever switching fiber types (G.652 to G.657 requires recalibration because the thermal expansion profiles differ). | Field reality: crews calibrate at job start and never again. A fiber type switch mid-job with stale calibration produces estimated losses 0.02–0.04 dB lower than actual because the arc profile is optimized for the wrong thermal model. | Job passes contract QC based on splicer estimated loss; OTDR confirms later and shows multiple 0.25–0.30 dB events that were estimated as 0.08 dB. Root cause: never recalibrated when fiber type changed at a splice point. |
| L14 (field hygiene) | Book: clean with IPA (isopropyl alcohol ≥99%) + lint-free wipe, then inspect per IEC 61300-3-35 before mating. Dry cleave first (blow off loose particles), then IPA wet wipe from center outward. | Field reality: crews often skip the dry cleave step and go straight to IPA on gel-contaminated fibers. IPA + buffer gel = gel smear across the end-face. Re-wiping compounds the problem. Correct sequence: dry wipe first, then IPA wipe. | Gel-smeared connector face looks "clean" to the naked eye but fails IEC 61300-3-35 zone B (the ferrule area outside the core but inside the cladding). Results in reflections that degrade GPON power budget by 1–3 dB. |

---

## Section 7: Forensic Failure Mode Coverage

Per §3 pipeline requirement (5-10 field failure modes per forensic framing):

| # | Failure mode | Root cause | Lesson anchor | Physical signature |
|---|---|---|---|---|
| F1 | Increasing insertion loss over 12–18 months in buried dome case | Crew over-torqued entry port during installation, cracked the gel port O-ring seat; seasonal thermal cycling pumped moisture in over time | L09 (case types), L10 (sealing) | OTDR trace: gradual high-loss reflective event at known splice point; loss increases with cold weather (moisture freezes, expands) |
| F2 | Random fiber failures 2–3 years post-build in aerial case | Crew used aerial butt-splice case for buried installation (wrong case type for environment) | L09 | OTDR: loss event moving along splice case location; multiple fibers failing sequentially in same case |
| F3 | Connector insertion loss doubles after field crew "cleaned" connectors | Crew used IPA on gel-contaminated ferrules without dry-wipe first; gel smear across end-face | L14 | End-face inspection (IEC 61300-3-35): zone B contamination; OTDR shows reflection event at connector location |
| F4 | Splice acceptance test passes; carrier acceptance fails 6 months later | Crew used cladding-align mode for G.652-to-G.657.A2 cross splice; splicer estimated 0.09 dB, actual OTDR bidirectional average was 0.22 dB | L05 | Bidirectional OTDR: event reads differently in each direction (hallmark of MFD mismatch); average exceeds contract threshold |
| F5 | 12-fiber ribbon set shows 3 of 12 fibers at 0.40–0.60 dB after mass fusion | One of 12 cleaves in the ribbon set had a 1.8° angle (beyond the splicer's reject threshold was temporarily disabled to "speed things up") | L06, L07 | OTDR: isolated high-loss events within the same ribbon splice set; loss distribution highly non-uniform (red flag: fusion splice events should be within 0.05 dB of each other in a properly cleaned/cleaved ribbon) |
| F6 | Mechanical splices on a non-RUS private build degrade to 1.2–2.0 dB after 5 years | Index-matching gel dried out and crystallized under thermal cycling (−20°C to +50°C in an aerial pedestal) | L08 | OTDR: increasing reflection events at splice points; loss accelerates in summer peak temperatures |
| F7 | Electrode arcing becomes inconsistent; splicer loss estimates erratic | Electrode oxidation from 3,000+ arc cycles without replacement; crew "ran to failure" per field norm | L13 | Splicer display: inconsistent "estimated loss" variance on same fiber type; occasional "arc error" message on otherwise clean cleaves |
| F8 | Multiple fibers in same tray show simultaneous high-loss events after case closure | Express fibers coiled below minimum bend radius in tray (15 mm radius for G.657.A1, 30 mm for G.652.D standard ITU spec) because crew forced extra fiber length into tray | L11 (tray loading), T02 macrobend (assumed) | OTDR: macrobend signature (1550 nm loss significantly higher than 1310 nm loss at same location — dual-wavelength test catches this per T12.L09) |
| F9 | Water intrusion into splice case that was re-entered and "repaired" with field tape | Crew slit heat-shrink oversheath longitudinally to re-enter, wrapped with self-amalgamating tape, applied heat to "re-melt." Tape seal failed within one rain season | L10 | Visual inspection: water staining at case entry port; OTDR: increasing loss across all fibers in case over several months |
| F10 | All 12 splices in a fusion session show estimated 0.08 dB but OTDR confirms 0.18–0.22 dB | Splicer not recalibrated when crew switched from G.652.D to G.657.A2 mid-job; arc profile optimized for wrong thermal expansion coefficient | L06, L13 | OTDR: systematic over-estimation by splicer; all events in this session elevated; events in prior session (same-fiber G.652.D) are correct. Pattern: failure at the fiber type change point in the job log |

---

## Section 8: Cascade-Pattern Risk Assessment

Per agent-protocol §14e, every brief MUST check `known-cascade-patterns.md` before authoring. T11 pattern-match:

| Pattern ID | Pattern | T11 risk | Mitigation in author brief |
|---|---|---|---|
| P1 | 47 CFR §32.2210 mis-citation | LOW — T11 has no plant accounting citations | No action needed |
| P2 | H₂S IDLH safety value cascade | LOW — T11 references T18 safety but no atmospheric values | Author must cross-ref T18 for confined-space entry at manholes; do NOT state any atmospheric threshold values — cross-ref T18.L03 only |
| P3 | ANSI Z359 fall protection mis-citation | LOW — T11 may reference T18 for aerial bucket-truck splice work | Author: cross-ref T18.L04 only; do NOT re-state Z359 series in T11 |
| P4 | Fabricated numeric cascade (OM5 EMB) | **MEDIUM** — T11.L05 includes MFD mismatch loss calculation. MFD values for G.652.D (8.8–9.6 µm) and G.657.A2 (6.3–9.5 µm) are in the registry (via ITU-T G.652.D Haiku verify). Author must cite registry values verbatim; do NOT invent new MFD values. | Author: pull MFD spec from citation-registry.md ITU-T G.652.D entry. For G.657.A2 MFD, verify from ITU-T G.657 entry in registry (both Haiku-verified 2026-05-17). |
| P5 | Federal Register page-number cascade | LOW — no FR citations in T11 | No action needed |
| P6 | Broken DAG vocab_assumed pointers | **HIGH** — T11 has 10 assumed vocabulary items from T01/T02/T03/T10. Each vocab_assumed pointer must cite the exact lesson that INTRODUCES the term. | Author: use the vocabulary_assumed source lesson IDs specified in Section 4 of this brief. Run `node osp-training/scripts/build-dag-registry.js` after authoring and verify zero unverified pointers for T11 lessons. |
| P7 | NESC §-vs-Rule notation | LOW — T11 has no direct NESC citations | No action needed |
| P8 | NEC Chapter 9 Table 1 fill misattribution | LOW — T11 does not teach conduit fill | No action needed |
| P9 | CFR §1.141x pole-attachment citation cluster | LOW — T11 has no pole-attachment citations | No action needed |
| P10 | FCC 23-109 betterment exemptions | LOW — T11 has no FCC pole citations | No action needed |
| P11 | NWP 12 vs NWP 57 telecom HDD | LOW — T11 has no HDD citations | No action needed |
| P12 | Standards-edition currency | **MEDIUM** — TIA-455, IEC 61300-3-35, GR-763-CORE all cited; editions in flux | Author: mark `[confirm edition]` for TIA-455 FOTP series, IEC 61300-3-35, and GR-763-CORE. Do NOT hardcode edition numbers. TIA-598-D is registry-confirmed current. |

**Net new cascade risk unique to T11 to monitor:**

- **Splice-loss value confusion:** the four splice-loss reference numbers (FOA design target / ITU-T L.400 design / RUS contract max / concern threshold) are easy to conflate. Author must present all four in the same table in L03 with clear labels. RT must verify: does the WorkedExample accept/reject narrative match the labeled tier?
- **Electrode life counter values:** splicer electrode replacement intervals vary by manufacturer (Fujikura: 2,500 arcs; Sumitomo: 3,000 arcs; AFL: 2,000 arcs; FITEL: 1,500 arcs). Author must NOT state a single universal number — present as a range (1,500–3,000 arcs) and instruct learner to check their specific splicer's manual. RT must flag any single universal number claim.
- **MFD mismatch Gaussian loss formula:** commonly cited as `IL ≈ -20·log₁₀(2·w₁·w₂/(w₁²+w₂²))` where w₁, w₂ are mode field radii. This is an approximation for dissimilar MFD single-mode fibers. Author must present it as approximation, show the arithmetic steps, and include a sanity check. RT must independently re-derive the arithmetic.

---

## Section 9: Lesson Count Recommendation

**Recommendation: 15 lessons as specified in ARCH.md — confirmed appropriate.**

**Rationale:**
- Splicing is the most hand-skill-intensive activity in OSP. The teaching arc from "why colors" (L01) through "field hygiene" (L14) must build prerequisite knowledge step-by-step — no lesson can be safely merged.
- L01+L02 (color coding) appear redundant but serve distinct purposes: L01 teaches the system concept + field crew accommodation (new vocab); L02 teaches the arithmetic of fiber-within-tube position counting (working skill). These cannot merge without violating the prerequisite invariant (L02's WorkedExample requires the learner to know color-code position IDs taught in L01).
- L04+L06 (fusion step-by-step / cleave quality) appear overlapping but address different failure modes: L04 teaches the procedure a new splicer follows; L06 teaches the quality checkpoints an experienced splicer monitors. Merging would create a 55-minute lesson violating the 35-minute target ceiling.
- L09+L10 (case types / sealing systems) must remain separate: selecting the right case (L09) is a design decision; sealing the case correctly (L10) is an installation procedure. The book-vs-field divergence for each is different and significant.
- The 15-lesson count matches ARCH.md's estimate for a high-hands-on topic. No expansion needed; no compression appropriate.

---

## Section 10: Source Migration Manifest

| Lesson | Source | Migration type |
|---|---|---|
| T11.L01 | M07 §7.4 | Prose surgery — migrate pitch-quality base, inject TIA-598 depth |
| T11.L02 | M07 §7.4 | Prose surgery + WorkedExample expansion |
| T11.L03 | M04 §4.1 | Verbatim/minor reformat — good source; add four-number framework table |
| T11.L04 | M04 §4.2 | Verbatim/minor reformat — good source; add AnnotatedDiagram annotations |
| T11.L05 | M04 §4.3 | Prose surgery — WorkedExample expansion with Gaussian formula derivation |
| T11.L06 | M04 §4.2 partial | Re-author from brief — original was embedded in §4.2; needs its own lesson |
| T11.L07 | M04 §4.4 | Verbatim/minor reformat — add productivity WorkedExample |
| T11.L08 | M04 §4.5 | Verbatim/minor reformat — add book-vs-field table |
| T11.L09 | M04 §4.6 | Verbatim/minor reformat — add AnnotatedDiagram + case selection BranchingScenario |
| T11.L10 | net-new (R-A gap per ARCH.md) | Re-author from brief |
| T11.L11 | M04 §4.6 | Prose surgery — extract tray loading content from splice case discussion |
| T11.L12 | M04 §4.7 | Prose surgery — add three-number framework table + WorkedExample |
| T11.L13 | net-new (R-A gap per ARCH.md) | Re-author from brief |
| T11.L14 | M07 §7.6 partial | Re-author from brief — original was partial; full hygiene lesson needed |
| T11.L15 | net-new | Capstone — net-new |

---

`=== T11 RESEARCH BRIEF END ===`
