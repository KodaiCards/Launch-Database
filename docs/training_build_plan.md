# Training Build Plan — per-topic SVG / interaction / assessment / progression (CEO-owned)

> **What this is:** the high-judgment build design that a Sonnet worker can't be trusted to invent — *which* lessons need *which* diagrams, *what* the testing should integrate, and *how* topics build on each other. Owned by the CEO (Opus). C6 **executes to this**; it does not redesign it.
> **Pairs with:** `docs/training_design_spec.md` (the component library + standards + Definition of Done), `osp-training/docs/field-vs-textbook-research.md` (voice/accuracy), the merge **gate** (research-log + independent RT per topic). Last updated 2026-06-27.
>
> **Teaching order (from `course-catalog.js`):** T01 → T18 → T02 → T03 → T04 → T09 → T05 → T06 → T19 → T14 → T07 → T08 → T10 → T11 → T12 → T13 → T15 → T16 → T17 → T20 → (T21/T22 cert prep) → C04/C05 exams. Every topic may interleave any *earlier* topic in its assessment; never a later one.
>
> **SVG legend:** [ID] = identification/anatomy (good for LabelDiagram hotspot). [FLOW] = process/decision flow. [NUM] = quantitative diagram tied to a calculator/worked example. Diagrams are **content** → they go through research + RT like any claim; use theme tokens (light/dark).

---

## T01 — Fundamentals & Vocabulary (root; everything depends on it)
- **SVGs:** labeled **pole anatomy** [ID]; **cable cross-section** (loose-tube vs ribbon) [ID]; **exploded splice case** [ID]; **OSP↔ISP boundary** map [ID]; sample **strand map** [ID].
- **Interactions:** LabelDiagram (pole / cable / splice case), Flashcards (acronyms), MatchPairs (acronym ↔ meaning).
- **Assessment:** identification-heavy, ≥4 mixed. No interleave (it's first). This is the vocabulary every later quiz draws from.
- **Progression:** defines the terms; later topics assume them.

## T18 — Safety & OSHA (taught 2nd, before any field topic)
- **SVGs:** **approach boundaries / MAD** [ID]; **fall-protection zones** [ID]; **PPE** by body area [ID]; **confined-space entry** [FLOW].
- **Interactions:** BranchingScenario (hazard response), MatchPairs (OSHA standard ↔ situation).
- **Assessment:** scenario-based; interleave T01 vocab. (Safety facts are high-stakes — RT hard.)

## T02 — Fiber Physics
- **SVGs:** total-internal-reflection [ID]; **attenuation vs wavelength** curve [NUM]; macrobend/microbend [ID]; **link-budget** diagram [NUM].
- **Interactions:** SliderExploration (wavelength↔loss), **LinkBudgetCalculator**, WorkedExample (dB math), Quiz.
- **Assessment:** numeric (dB, budget); interleave T01.

## T03 — Cable Selection & Materials
- **SVGs:** **construction types side-by-side** (loose-tube/tight-buffer/ribbon) [ID]; armor/jacket layers [ID]; G.652 vs G.657 bend behavior [ID].
- **Interactions:** SideBySide (cable types), MatchPairs (type ↔ use), LabelDiagram (cable layers).
- **Assessment:** selection scenarios; interleave T02 (fiber types/bend).

## T04 — Route Survey & Pre-Engineering
- **SVGs:** site-walk hazard map [ID]; **GIS landbase layers** [ID]; pole-audit measurement [ID/NUM].
- **Interactions:** BranchingScenario (route alternatives), Sortable (survey workflow), TimelineSequence (survey→design handoff).
- **Assessment:** interleave T01, T18.

## T09 — Permitting & Environmental
- **SVGs:** **permitting "layer cake"** (federal/state/county/municipal) [ID]; **NEPA CE/EA/EIS** decision [FLOW]; Section 106 [FLOW].
- **Interactions:** BranchingScenario (which permit / which review), Sortable (permit sequence), TimelineSequence (ROW timelines).
- **Assessment:** interleave T04.

## T05 — OSP Design, Aerial
- **SVGs:** **NESC clearances** (vertical/horizontal) [NUM]; **pole-loading force** diagram [NUM]; **sag/tension** [NUM]; **joint-use pole-space allocation** [ID]; grades of construction [ID].
- **Interactions:** **SagTensionCalculator**, **PoleLoadingCalculator** (net-new), LabelDiagram (pole space), SliderExploration (span↔sag).
- **Assessment:** numeric + clearance lookups; interleave T01/T02/T03/T04.

## T06 — OSP Design, Underground
- **SVGs:** **duct-bank cross-section** [ID]; **burial-depth profile** [NUM]; manhole/handhole sizing [NUM]; HDD bore profile [ID]; **separation from foreign utilities** [NUM].
- **Interactions:** **ConduitFillCalculator** (net-new), SideBySide (HDD/trench/plow), LabelDiagram (duct bank).
- **Assessment:** numeric (fill %, depth, separation); interleave T03/T04.

## T19 — Headend / CO + Rack-Side Hardware
- **SVGs:** CO/headend layout [ID]; **−48VDC power plant one-line** [ID]; rack elevation [ID]; **FDH internals** [ID]; **OSP↔ISP handoff boundary** [ID].
- **Interactions:** LabelDiagram (rack / FDH / power plant), SideBySide (interconnect vs cross-connect).
- **Assessment:** interleave T01/T05/T06.

## T14 — Bonding, Grounding & Electrical Protection (safety-critical)
- **SVGs:** **MGN bonding** [ID]; **grounding electrode system / GES** [ID]; **TBB/TMGB(PBB) chain** [ID]; messenger bonding [ID]; surge path [FLOW].
- **Interactions:** LabelDiagram (grounding system), BranchingScenario (stray-voltage response).
- **Assessment:** interleave T02/T05/T06/T19. **Watch:** the live IEEE 81 §7/§9.4 swap is in this area — fix via the gate first.

## T07 — Staking
- **SVGs:** stake placement along a route [ID]; pole-tag photo coding [ID]; attachment measurement [NUM].
- **Interactions:** LabelDiagram, Sortable (staking workflow).
- **Assessment:** interleave T04/T05/T06.

## T08 — Make-Ready & Pole Attachment
- **SVGs:** pole **before/after make-ready** [ID]; **15-day FCC clock** [FLOW]; transfer/reframe/replace [ID].
- **Interactions:** TimelineSequence (15-day clock), BranchingScenario (simple vs complex), SideBySide.
- **Assessment:** interleave T05/T07.

## T10 — OSP Construction
- **SVGs:** **811 utility-marking color code** [ID]; HDD/trench/plow profiles [ID]; slack loop [ID]; handhole install [ID]; traffic-control zone [ID].
- **Interactions:** MatchPairs (811 colors ↔ utility), Sortable (construction sequence), LabelDiagram.
- **Assessment:** interleave T06/T07/T08/T18.

## T11 — Splicing
- **SVGs:** **fusion-splice steps** [FLOW]; core vs cladding alignment [ID]; **TIA-598 color chart** [ID]; splice-tray loading [ID]; splice-case types [ID].
- **Interactions:** **MatchPairs (TIA-598 color ↔ position — signature)**, Sortable (splice steps), **SpliceLossBudget** calc, LabelDiagram (tray).
- **Assessment:** numeric (loss) + color code; interleave T02/T03/T10.

## T12 — Testing (OLTS, OTDR, Inspection)
- **SVGs:** **OTDR trace anatomy** (events, dead zones, reflections) [ID/NUM]; OLTS reference setup [ID]; **end-face inspection zones (IEC 61300-3-35)** [ID]; bidirectional averaging [FLOW].
- **Interactions:** **OTDRTraceViewer (signature)**, SliderExploration (pulse width ↔ dead zone), LabelDiagram (trace features).
- **Assessment:** trace reading + acceptance criteria; interleave T02/T11.

## T13 — Inspection & QA  ⚠️ (live-error hotspot — fix Priority-0 first)
- **SVGs:** inspection decision (**punch-list vs kickback**) [FLOW]; **RUS Form 219 close-out** [FLOW]; clearance verification [NUM].
- **Interactions:** **BranchingScenario (inspection calls — signature)**, Sortable (close-out sequence).
- **Assessment:** judgment scenarios; interleave T05/T10/T12/T18.
- **NOTE:** the confirmed live citation errors live here (AIA §3.3.1, "Format V", NESC §01C/Section 26/Map 1, FCC Part 32 hierarchy, IEEE 81 swap) — verify + fix through the gate before enhancement.

## T15 — Restoration & Outage Response
- **SVGs:** OTDR **fault-locate** [NUM]; **outage-response timeline** [FLOW]; splice-trailer setup [ID]; temporary vs permanent repair [ID].
- **Interactions:** BranchingScenario (first 30 minutes), TimelineSequence.
- **Assessment:** interleave T11/T12/T13.

## T16 — As-Built Documentation & GIS
- **SVGs:** **as-built vs as-designed** reconciliation [FLOW]; **splice-matrix schema** [ID]; GIS export formats [ID]; fiber topology [ID].
- **Interactions:** **TopologyCanvas (signature)**, MatchPairs (GIS format ↔ use), SideBySide.
- **Assessment:** interleave T10/T11/T13/T15.

## T17 — Project Estimation & Revenue
- **SVGs:** cost breakdown **aerial vs underground** [NUM]; productivity curve [NUM]; contract-type comparison [ID]; BOM structure [ID].
- **Interactions:** SideBySide (contract types), estimating calculator, WorkedExample.
- **Assessment:** numeric; interleave T05/T06/T08/T10/T16.

## T20 — RUS Compliance & Federal Programs
- **SVGs:** RUS program structure [ID]; **Form 290 flow** [FLOW]; RUS vs commercial lifecycle [FLOW]; **federal-compliance call-order** flowchart [FLOW].
- **Interactions:** BranchingScenario (compliance path), Sortable (RUS lifecycle), MatchPairs (form ↔ purpose).
- **Assessment:** interleave T05/T06/T09/T19.

## T21 / T22 — Cert Prep (CFOS-O / CFOT) & C04/C05 — Exams
- **SVGs:** mostly **reuse** diagrams from source topics; few net-new.
- **Interactions:** Quiz banks + mock exams (CertificationSim). These are **comprehensive interleaving by design** — that's the point of cert review.
- **Assessment:** broad cross-topic; pull items from all prerequisite topics.

---

## Net-new components the CEO must build before the interactivity phase
(Per `training_design_spec.md`.) MatchPairs, LabelDiagram (hotspot), FillBlank, and calculators: PoleLoading, ConduitFill, SagTension, SpliceLossBudget. Until these exist, C6 does accuracy + content + **static SVG authoring** (SVGs are content) + assessment using EXISTING components (Quiz/Flashcard/WorkedExample/BranchingScenario/Sortable/SideBySide/SliderExploration/LinkBudget/OTDRViewer/Topology).

## Priority order for C6 (small pieces, gated, pause between each)
1. **Coverage matrix** (Step 0 — analysis only).
2. **T13 live-citation fixes** (Priority-0), verified through the gate.
3. Then **teaching-order topics**, one small unit at a time, each: accuracy RT → content/verbiage → assessment (cumulative+interleaved) → author the topic's SVGs → wire existing interactions. CEO builds net-new components/exemplar before the interaction-heavy topics.
