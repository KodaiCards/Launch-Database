# OSP Topic 5 — Hardware & Accessories: T5 FINAL BRIEF (Worker A)

**Branch:** `claude/debug-previous-issues-MoN9D`  
**Date:** 2026-05-14  
**Role:** Final-Merge Worker A (independent; did not read Critique Worker B output)  
**Source inputs:** BRIEF_FRAMING_A.md (`a90118f`) · BRIEF_FRAMING_B.md (`57582ad`) · CANONICAL_BRIEF_A.md (`ce27504`) · CANONICAL_BRIEF_B.md (`ad33b0c`) · Orchestrator pre-resolved decisions × 7  
**Word cap:** 3000 words

---

## §1 Lesson Plan

13 lessons after L5.2 split (L5.2a + L5.2b, matching T4 L4.2a/b pattern). Sequence: aerial support structure (5.1–5.5) → underground housing (5.6–5.7) → enclosures + active equipment (5.8–5.10) → storage + labeling (5.11–5.12).

| # | Title | Scope | Duration | Intensity | Citation Matrix (Primary → Supporting → RUS) | Interactive Elements |
|---|---|---|---|---|---|---|
| 5.1 | Pole Hardware: Bands, Brackets, Dead-End Assemblies, and Vibration Dampers | Pole bands, suspension brackets, dead-end brackets, through-bolt hardware, vibration dampers. **ANSI O5.1 pole grading/class selection (5–7 min section): Class 1–7, species circumference tables, RUS 1751F-630 §6 cross-ref.** Galvanic compatibility callout box: steel ASTM A475 strand + aluminum die-cast hardware → galvanic isolation required (zinc-coated steel washers or stainless interface hardware); cite NACE SP0286. NESC 2.0× safety factor as hardware design constraint. Stockbridge damper placement rule; T7 owns installation procedure. | 30 min | HIGH-INTENSITY | NESC Rules 261, 238 → IEEE 1222 §6; BICSI OSP-DRD Ch. 6.3; ANSI O5.1-2015 → RUS 1751F-630 §4, §6; RUS 1715E-110 §4; NACE SP0286 | Drag-drop (label pole assembly: pole band, suspension bracket, dead-end bracket, damper, through-bolt) + flashcards (hardware type → function, pole class → load capacity) + MC quiz |
| 5.2a | Strand and Messenger Wire: Grade Selection and RBS | Steel strand grade definitions (SM / HS / EHS), ASTM A475/A475M RBS tables (cite as A475/A475M — not A475 alone; see §3 D-C1). ADSS sidebar (2 paragraphs): preformed grip dead-ends, AGS suspension assemblies — lashed primary, ADSS not re-taught here. Aluminum strand sidebar (1 paragraph): ASTM B498 / B230, galvanic note at pole hardware. Loading district from T4 L4.2b is prerequisite input — do NOT re-derive loading. | 25 min | HIGH-INTENSITY | NESC Rules 250–252, 261; ASTM A475/A475M → BICSI OSP-DRD Ch. 6.3; ASTM B498; ASTM B230 → RUS 1715E-110 §3; RUS 1751F-630 §3 | Flashcards (grade → RBS range, galvanic note) + scenario setup (span + loading district given; grade selection in L5.2b) + MC quiz |
| 5.2b | Strand and Messenger Wire: Sag-Tension and NESC Safety-Factor Derivation | Worked example: 250-ft span, Macon GA (NESC Light district), 0.63-in. OD lashed cable. Full derivation sequence: (1) cable + messenger weight/ft from OD estimate; (2) parabolic sag formula under NESC Light loading; (3) horizontal tension; (4) select ASTM A475/A475M grade whose RBS ÷ 2.0 ≥ horizontal tension. Derive tension to 2 decimal places before grade selection. Verify all three grade options produce different pass/fail results so scenario discriminates. Authoring guard: do NOT pick grade by rule of thumb — derive the tension first. | 20 min | HIGH-INTENSITY | NESC Rule 261 (2.0× SF) → ASTM A475/A475M (RBS tables) → RUS 1715E-110 §3 | Scenario (full worked derivation interactive — learner inputs intermediate results, system validates each step) + MC quiz |
| 5.3 | Lashing Wire and Lashing Machines | Gauge selection (0.045 / 0.065 in.) from cable OD and strand size. Dead-end overlap: 6 in. past clamp (TIA-758-C §5.3 — citable). Gap inspection criterion ≤1.5 in.: teach in reading content with note that this is utility-practice value, NOT a verbatim TIA-758-C table row; authoring guard: quiz questions framed around gauge selection and dead-end overlap ONLY (fully citable). Red-team must verify gap value in RUS 1751F-630 or PLP normative reference before L5.3 exam is authored. | 20 min | STANDARD | TIA-758-C §5.3 → BICSI OSP-DRD Ch. 6.3; ASTM A641 → RUS 1751F-630 §6; PLP lashing guide | Flashcards (gauge → application range, dead-end overlap, gap inspection) + MC quiz |
| 5.4 | Cable Hangers, J-Hooks, and Spacers | J-hook spacing: 36-in. max on risers (NEC §800.24 — citable). Aerial strand hanger vs. conduit strut. Interior riser vs. conduit bundle vs. short aerial segment context. Strut sizing for bundled cable weight. | 20 min | STANDARD | NEC §800.24 → TIA-568.0-D §4; TIA-758-C §5.3; BICSI OSP-DRD Ch. 6.3–6.4 | Drag-drop (J-hook / conduit hanger / aerial strand hanger → interior riser / conduit bundle / aerial segment) + flashcards + MC quiz |
| 5.5 | Aerial Drop Hardware: ADC Clamps, P-Hooks, and Service-Loop Fittings | Complete drop assembly: ADC clamp type, P-hook at mid-span, 2-ft minimum service loop (TIA-758-C §5.4 — citable), 12-in. drip loop at building entry (NEC Art. 800 — citable; distinct from service loop). Strain relief. Lashed-drop vs. ADSS drop hardware distinction (preformed grips). | 20 min | STANDARD | TIA-758-C §5.4; NESC Rule 238 → BICSI OSP-DRD Ch. 6.3; NEC Art. 800 → RUS 1751F-630 §6 | Scenario (110-ft aerial drop, wood-frame building: select ADC clamp / P-hook / drip loop / strain relief — branch shows pass/fail with citation) + flashcards + MC quiz |
| 5.6 | Underground Hardware: Handholes, Manholes, Pull Boxes, and Cable Racks | **Primary citation: ANSI/SCTE 77** for handhole/manhole load tiers (telecom-industry standard; maps AASHTO vehicle loads to enclosure tiers). AASHTO H20/H25 as cross-reference for highway-crossing context. Tier nomenclature: use "ANSI/SCTE 77 Class X" — do NOT write quiz [CORRECT] answers with "Tier 22" as if it is a verbatim AASHTO designation (AASHTO LRFD uses H-load designation, not tier numbers). NEC Ch. 9 pull-box sizing: cross-reference T3 L3.5 — do NOT re-derive the 8× / 6× formulas. OSHA 1910.146 code pointer at manholes only; T9 owns field procedures. Conduit-transition fittings and duct plugs: include as BOM subsection so FTE daily-job exercise answers are complete. | 30 min | HIGH-INTENSITY | ANSI/SCTE 77; AASHTO H-load (cross-ref) → TIA-758-C §6.2; BICSI OSP-DRD Ch. 6.1–6.2; NEC Ch. 9 (cross-ref T3 L3.5) → RUS 1751F-635 §3; OSHA 1910.146 (pointer) | Drag-drop (ANSI/SCTE 77 class → driveway / rural highway shoulder / pedestrian path) + scenario (handhole BOM for 4-conduit bank — structure class + duct plugs) + flashcards + MC quiz |
| 5.7 | Direct-Bury Marking: Warning Tape, Tracer Wire, and Marker Posts | Three-layer system (RUS 1751F-635 §3 requires tracer wire on RUS-funded routes): (1) orange APWA non-detectable warning tape at 12 in. above conduit; (2) detectable tape or 14 AWG Cu tracer wire above conduit; (3) above-grade marker posts at route start, end, every 500 ft, and all direction changes (TIA-758-C §6.4). Cross-ref T3 L3.6 for burial depth and tape placement established there — do NOT re-derive. T5 adds: tracer wire spec, marker post interval, APWA color codes, RFID pointer. | 20 min | HIGH-INTENSITY | TIA-758-C §6.4; APWA Uniform Color Code → BICSI OSP-DRD Ch. 6.2; CGA Best Practices v18; NECA 301 → RUS 1751F-635 §3 | Scenario (2-mile direct-bury route, two road crossings, three direction changes: build three-layer marking BOM) + flashcards + MC quiz |
| 5.8 | Pedestals and Cabinets: Types, NEMA Ratings, and Locking | NEMA type selection for deployment environment. Cross-reference T4 L4.12 as authoritative NEMA 250 ↔ IEC 60529 mapping table — do NOT re-derive or reproduce the table. Apply operationally: NEMA 1 (IP10, indoor) / 3R (IP14, rain-proof) / 4 (IP65, watertight) / 4X (IP66, corrosion-resistant). Cross-ref T2 L2.6 (closure internals) — closures are tenants of the pedestal; do not re-teach closure architecture. Do NOT cover FDH housing grounding here — owned by T6 L6.7. | 25 min | STANDARD | NEMA 250; IEC 60529 (cross-ref T4 L4.12) → TIA-758-C §8; BICSI OSP-DRD Ch. 6.4 → RUS 1751F-635 §5 | Drag-drop (NEMA 1/3R/4/4X → indoor telco room / outdoor rural / coastal salt-air / roadside cabinet) + flashcards + MC quiz |
| 5.9 | Fiber Distribution Hubs (FDH): Construction-Grade vs. Rack-Mount, Port Configuration | Hardened pad-mount FDH (IP65+) vs. rack-mount hub-site FDH. Port sizing worked example: **growth factor locked at 1.20** (20% over-provisioning — standard FTTH design practice; 1.15 alternative stripped). Placeholder: generic 288-port hardened SC-APC FDH pending FDH product family confirmation (see §3 escalation E1). Full derivation: subscriber count × split ratio × 1.20 → ceiling to next standard port-count increment. RUS citation: **7 CFR Part 1755 + RUS PE-60** (NOT RUS Bulletin 1738 — Bulletin 1738 governs Distance Learning/Telemedicine loan program, a separate USDA program; PSC-program work is funded under standard RUS Telecom Program). Do NOT cover FDH housing grounding — T6 L6.7. SC-APC vs. LC-APC cassette architecture: include as a compact subsection (keep total within 30 min). | 30 min | HIGH-INTENSITY | TIA-758-C §8 → BICSI OSP-DRD Ch. 6.4, 8 → **7 CFR Part 1755; RUS PE-60** | Scenario (192 homes, 1:32 split, growth factor 1.20 → derive port count → select FDH tier — full worked math with intermediate steps) + flashcards + MC quiz |
| 5.10 | Terminal Hardware: Drop Terminals, MST, and NIDs | CO → feeder → FDH → distribution → MST → drop → NID/ONT network layer diagram. MST port count and connector type (OptiTap or hardened SC-APC) for a given drop count. Tool-free pull-to-lock access as field-critical spec. Cross-ref T2 L2.9 (OptiTap / HOC connector mechanics) — do NOT re-teach connector ratings. RUS citation: **7 CFR Part 1755 + RUS PE-60**. | 25 min | STANDARD | TIA-758-C §8 → BICSI OSP-DRD Ch. 6.4, 8; Corning OptiTap; CommScope OptiSheath → **7 CFR Part 1755; RUS PE-60** | Drag-drop (blank OSP layer diagram: FDH / MST / drop terminal / NID to correct nodes) + flashcards + MC quiz |
| 5.11 | Storage Hardware: Slack Racks, Snowshoes, Figure-8 Coils, Vault Storage, Aerial Pole Brackets | Slack storage method selection by context: slack rack in vault, snowshoe in buried pedestal, figure-8 coil on aerial pole bracket (3–5 loops, 18-in. minimum coil diameter on pole-mounted storage bracket). Min static bend radius: 10× OD (SM OSP cable). Min slack per closure side: 10 m (TIA-758-C §6.4). Velcro-only tie rule for vault storage — no metal clamps. Cross-ref T2 L2.6 (closure architecture). | 20 min | STANDARD | TIA-758-C §6.4 → BICSI OSP-DRD Ch. 8.1 → RUS 1751F-635 §4 | Flashcards (storage scenario → method, min bend radius, Velcro vs. metal clamp, aerial pole bracket coil diameter) + MC quiz |
| 5.12 | Identification and Labeling: Cable Tags, Route Markers, RFID, TIA-606-C | T5 scope boundary (HARD): T5 L5.12 owns **physical hardware** (tag material, attachment method, marker post intervals, BOM placement). T3 L3.12 owns records (as-builts, RUS Forms 515c + 219). T4 L4.10 owns code basis (TIA-606-C identifier hierarchy, TIA-598-D color codes). Open lesson with explicit cross-reference blocks to both T3 L3.12 and T4 L4.10. Do NOT re-teach identifier structure or fiber color codes. Build TIA-606-C path ID from campus + route + cable + tube + fiber using T4-taught structure. Tag material: SS or UV-resistant polyester. Attachment: lashing wire loop — no adhesive (adhesive fails in buried/wet environments). Marker post intervals: route start, end, every 500 ft, direction changes. | 20 min | STANDARD | TIA-606-C (cross-ref T4 L4.10); TIA-598-D (cross-ref T4 L4.10) → TIA-758-C §9; BICSI OSP-DRD Ch. 10.2 → RUS 1751F-630 §9; RUS Form 515c (cross-ref T3 L3.12) | Scenario (multi-segment route: derive path ID, spec tag material + attachment, place marker posts on route sketch) + flashcards + MC quiz |

**Total duration: ~5.75 hrs (345 min).** 13 Moodle activities. Intensity: 5 HIGH-INTENSITY (5.1, 5.2a, 5.2b, 5.6, 5.7, 5.9) / 8 STANDARD.

---

## §2 Final Exam Spec

**Questions: 26** (2 per lesson × 13 lessons). **Pass threshold: 18/26 (69.2% → meets 70% intent; recommend rounding to 19/26 = 73% or accepting 18/26 per Moodle integer constraint — orchestrator to confirm).** Alternative: 70% exactly = 18.2 → set Moodle pass at 18/26 and note the 69.2% rounding.

**Format:** Identical to Topics 1–4 — A–D options, `[CORRECT]` inline on correct option, `*Rationale:*` italic block, bold per-option sub-bullets (`**A — Incorrect.**` / `**B — Correct.**`) with 1-line rationale + citation section. Lesson-number-ordered in source file; randomized at Moodle import. Math derivations independently verified before any `[CORRECT]` tag is written.

| Lesson | Q Count | Types |
|---|---|---|
| 5.1 Pole Hardware | 2 | 1 hardware-selection recall (bracket gauge for loading district) + 1 galvanic-compatibility scenario |
| 5.2a Strand Grade Selection | 2 | 1 grade/RBS recall (ASTM A475/A475M) + 1 ADSS vs. lashed hardware distinction |
| 5.2b Sag-Tension Derivation | 2 | 1 NESC 2.0× safety factor recall + 1 full derivation scenario (select correct grade given tension calc) |
| 5.3 Lashing Wire | 2 | 1 gauge-selection recall + 1 dead-end overlap scenario (no gap-spec quiz question until red-team verifies source) |
| 5.4 Hangers | 2 | 1 J-hook spacing recall (aerial vs. riser) + 1 NEC §800.24 code-citation scenario |
| 5.5 Aerial Drop | 2 | 1 service-loop minimum recall (TIA-758-C §5.4) + 1 drop assembly specification scenario |
| 5.6 Underground Hardware | 2 | 1 ANSI/SCTE 77 class selection scenario (driveway vs. highway shoulder) + 1 handhole BOM scenario |
| 5.7 Direct-Bury Marking | 2 | 1 APWA color-code recall + 1 three-layer marking specification scenario |
| 5.8 Pedestals + Cabinets | 2 | 1 NEMA type recall + 1 NEMA↔IEC cross-validation scenario |
| 5.9 FDH | 2 | 1 construction-grade vs. rack-mount recall + 1 port-sizing scenario (full math, growth factor 1.20) |
| 5.10 Terminals | 2 | 1 MST access-method recall + 1 network-layer-diagram scenario |
| 5.11 Storage | 2 | 1 bend-radius / slack minimum recall + 1 storage-method selection scenario |
| 5.12 Labeling | 2 | 1 marker-post interval recall + 1 TIA-606-C path ID construction scenario |
| **Total** | **26** | ~50% recall / ~50% applied scenario |

**Citation distribution:** 7 CFR Part 1755 + PE-60 in L5.9 and L5.10 rationale blocks. ASTM A475/A475M in L5.2a and L5.2b. ANSI/SCTE 77 in L5.6 (NOT "Tier 22" as primary designation). RUS 1751F-630/635 in L5.2–L5.5, L5.6, L5.7, L5.11, L5.12. Every question rationale cites exact standard section.

---

## §3 Defaulted Decisions

| # | Decision | Resolution | Rationale | Status |
|---|---|---|---|---|
| D-G1 | Galvanic compatibility (steel A475 strand + aluminum die-cast hardware) | ADD to L5.1 as a callout box. Galvanic isolation required: zinc-coated steel washers or stainless interface hardware. Cite NACE SP0286. | PSC RUS routes use joint-use poles with mixed metals in wet environments; omitting this produces a selection matrix correct for dry conditions only. Canonical B gap G1 confirmed HIGH RISK. | RESOLVED |
| D-G2 | ADSS scope | KEEP lashed as primary + ADSS as 2-paragraph sidebar in L5.2a. Add explicit callout: "If your office migrates to ADSS, the lashed-only worked examples in L5.2b don't apply." No dedicated ADSS lesson in T5 — defer to future erratum if adoption changes. | Office standard is lashed + ASTM A475. Orchestrator pre-resolved. | RESOLVED |
| D-G3 | ANSI O5.1 pole grading | ADD 5–7 min section to L5.1 covering pole grading/class selection. Cite ANSI O5.1-2015 (Wood Poles). RUS 1751F-630 §6 cross-reference for distribution applications. L5.1 is elevated to HIGH-INTENSITY and 30 min accordingly. | Pole specification is an unowned BOM item without this — Canonical B gap G3. T7 L7.4 owns make-ready execution; T5 L5.1 owns spec. | RESOLVED |
| D-L56 | Handhole citation (ANSI/SCTE 77 vs. AASHTO) | ANSI/SCTE 77 is PRIMARY citation for telecom handhole/manhole load tiers. AASHTO H20/H25 as cross-reference for highway-crossing applications. "Tier 22" vendor shorthand does NOT appear in quiz [CORRECT] answers — rephrase as "ANSI/SCTE 77 Class X" with actual load classification. | Canonical B gap C2 + C6: AASHTO LRFD uses H-load designation, not tier numbers — a learner checking AASHTO will not find "Tier 22". SCTE 77 is the telecom-industry standard that formalizes the tier system accessibly. | RESOLVED |
| D-L59a | FDH growth factor | Locked at **1.20** (20% over-provisioning). 1.15 alternative stripped from brief. | Canonical B gap OQ2: two framings used different values (1.15 vs. 1.20) producing different port counts on non-288-multiple bases. Orchestrator directive: lock one number. 1.20 is standard FTTH design practice. | RESOLVED |
| D-L59b | RUS citation for L5.9 + L5.10 | **7 CFR Part 1755 + RUS PE-60** (NOT RUS Bulletin 1738). Bulletin 1738 governs Distance Learning/Telemedicine grant program — a distinct USDA program from the standard RUS Telecom Program funding PSC-program work. | Framing A §7 Q2 identified the risk; Canonical B gap C3 rated CRITICAL. Orchestrator directive: 7 CFR 1755 + PE-60. | RESOLVED |
| D-L52 | L5.2 duration / split | SPLIT into L5.2a (Strand Grade Selection — 25 min) + L5.2b (Sag-Tension RBS Derivation — 20 min). Same split pattern as T4 L4.2a/b. Makes T5 total 13 lessons. | Canonical B gap: L5.2 at 25 min forces RBS worked example to be cut — exactly the highest-value content. Three grade definitions + parabolic sag derivation + ADSS sidebar cannot fit 25 min. | RESOLVED |
| D-Moodle | Moodle topic slug | `osp-hardware-accessories` | Canonical B gap OQ3: neither framing specified a slug. Slug feeds Moodle category assignment and SSO bridge in launch-database. | RESOLVED |
| D-C1 | ASTM A475 citation format | Cite as **ASTM A475/A475M** throughout (not A475 alone). | Canonical B gap C4: A475M is the metric companion; some RUS bulletins reference A475M. Using A475-only may be rejected by procurement engineers. RBS values derived from current A475/A475M table. | RESOLVED |
| D-V3 | Per-lesson quiz density | **5 questions per lesson quiz** (T2 baseline convention). Final exam is separate 26Q. | Canonical B gap V3: neither framing stated per-lesson quiz count; authors left to default could diverge from T2/T3 convention. | RESOLVED |
| D-V5 | YAML frontmatter slug | YAML `topic` field = `osp-hardware-accessories`; `bicsi_alignment` = `["BICSI OSP-DRD Ch. 6.3", "BICSI OSP-DRD Ch. 6.4", "BICSI OSP-DRD Ch. 8.1", "BICSI OSP-DRD Ch. 10.2"]` (lesson-specific subsets). | Canonical B gap V5: Moodle import inconsistencies if slug is invented by author. | RESOLVED |
| D-E1 | FDH product family | Generic 288-port hardened SC-APC FDH placeholder used in L5.9 worked example. | PENDING-USER: Corning (Pretium) / CommScope (FIST) / Clearfield (FieldSmart)? Does not affect math or [CORRECT] answer; affects daily-job reusability of the worked example. | PENDING-USER |
| D-G5 | Aerial pole-mounted cable storage | ADD aerial pole bracket coil storage to L5.11: 3–5 loops, 18-in. minimum coil diameter, pole-mounted bracket hardware. | Canonical B gap G5: L5.11 covered only vault/manhole storage; daily-job exercise answer incomplete without pole bracket option. | RESOLVED |

---

## §4 Authoring Conventions (inherited from Topics 1–4)

Every lesson opens with YAML frontmatter: `title`, `duration_min`, `topic: osp-hardware-accessories`, `order`, `bicsi_alignment` (list), `sources` (list). Section order is invariant: **Learning Objectives → Reading Content → Key Terms (Flashcard Candidates) → Interactive(s) → Final Check (exactly 2 pulse questions, each with full worked `*Expected answer:*`) → Glossary Cross-References.** Inline bracketed citations at sentence end or table note — never in footnotes. Quiz Q-structure exactly: stem → A/B/C/D options → `[CORRECT]` inline → `*Rationale:*` italic → bold per-option sub-bullets → `---` between questions. Per-lesson quiz: **5 questions** (T2 baseline). Final exam: 26 questions (2 per lesson). RUS bulletin cited alongside ANSI/TIA wherever co-applicable; RUS value called out when stricter. Vendor-agnostic in quiz questions — no manufacturer product names as answer choices. Math derivation independently verified before writing any `[CORRECT]` tag. No content re-taught that is owned by a prior topic — establish once, cross-reference thereafter. T6-owned content (grounding, bonding) must not appear in T5 lesson bodies; insert a deferral note instead.

---

## §5 Cross-Topic References

| Thread | Prior Lesson | T5 Application | Treatment |
|---|---|---|---|
| NESC loading districts (Light / Extreme Wind) | T4 L4.2b | L5.2b uses loading district as the design-input constant for sag-tension worked example | Cross-reference only; do NOT re-derive loading district |
| NESC Rule 261 + 2.0× safety factor | T4 L4.2a | L5.1 cites 2.0× SF as NESC hardware constraint; L5.2b applies in strand-grade derivation | Cross-reference in L5.1 opener; apply in L5.2b scenario |
| NEMA 250 ↔ IEC 60529 mapping table | T4 L4.12 | L5.8 uses the table operationally for pedestal/cabinet selection | Cross-reference T4 L4.12 as authoritative; do NOT re-derive or reproduce table |
| TIA-598-D color codes + TIA-606-C identifier hierarchy | T4 L4.10 | L5.12 references tube/fiber color for tag data fields; builds path ID from T4-taught structure | Open L5.12 with explicit cross-ref block; do NOT re-teach color codes or hierarchy |
| Splice closure architecture (dome vs. in-line, IP68) | T2 L2.6 | L5.8 (pedestal housing) and L5.11 (slack storage) treat closures as tenants of the hardware | Cross-reference T2 L2.6 in L5.8 and L5.11; no closure internals re-taught |
| Hardened connector types (OptiTap, HOC, IP67/68) | T2 L2.9 | L5.10 places MST/drop terminal in network layer | Cross-reference T2 L2.9 in L5.10; do NOT re-teach connector ratings |
| Underground burial depth + conduit fill | T3 L3.5 | L5.6 focuses on structure class and interior hardware; pull-box sizing math lives in T3 L3.5 | Cross-reference T3 L3.5 in L5.6 opener: do NOT re-derive 8× / 6× pull-box formulas |
| Direct-bury marker tape placement / burial depth | T3 L3.6 | L5.7 adds tracer wire spec + marker post intervals + APWA codes; depth and tape type are T3-established | Cross-reference T3 L3.6; T5 adds what T3 does not own |
| As-built records, RUS Forms 515c + 219 | T3 L3.12 | L5.12 labeling data feeds as-built record; forms are T3 scope | Cross-reference T3 L3.12 in L5.12 opener |
| OSHA 1910.146 confined-space procedures | T4 L4.13 | L5.6 cites 1910.146 as code pointer at manholes | Code pointer only in L5.6; explicit "full procedures in Topic 9" note |
| FDH housing grounding + bonding | T6 L6.7 | L5.9 teaches FDH as terminal hardware unit only | Explicit deferral in L5.9 body: "FDH housing grounding — see T6 L6.7" |
| Messenger + aerial closure grounding | T6 L6.3/L6.4 | L5.1–L5.2b teach strand selection, not bonding | Explicit deferral in L5.1: "strand bonding/grounding — see T6 L6.3" |
| Stockbridge damper installation procedure | T7 L7.2 | L5.1 teaches damper selection and placement rule | One-line deferral in L5.1: "installation method — see T7 L7.2" |

---

## §6 Authoring Split Proposal

Total HIGH-INTENSITY lessons: 5 (L5.1, L5.2a, L5.2b, L5.6, L5.7, L5.9 — note L5.9 elevated to HIGH-INTENSITY due to port-sizing math + RUS citation criticality). With 6 HIGH-INTENSITY nodes distributed across both halves, a **3-author split** is recommended.

**Author A — L5.1 through L5.3 (Aerial Foundation + Strand):** Pole hardware (ANSI O5.1, NACE SP0286, galvanic callout, NESC 2.0×), strand grade selection and sag-tension derivation (ASTM A475/A475M, two-lesson split), and lashing wire. This is the most technically demanding block: ANSI O5.1 pole grading, parabolic sag math to 2 decimal places, and galvanic compatibility. Author A must be comfortable with NESC loading, ASTM A475/A475M RBS tables, and the derivation-first (not rule-of-thumb) instruction for L5.2b.

**Author B — L5.4 through L5.8 (Drop Hardware + Underground + Enclosures):** Cable hangers, aerial drop assembly, underground structures (ANSI/SCTE 77, pull-box sizing cross-ref), direct-bury marking (three-layer system), pedestals/cabinets (NEMA 250 ↔ IEC 60529 cross-ref). Author B must cross-reference T3 L3.5 and T3 L3.6 correctly at lesson open — do not re-derive pull-box math or burial depth.

**Author C — L5.9 through L5.12 (Active Equipment, Storage, Labeling):** FDH port sizing (7 CFR 1755 + PE-60, growth factor 1.20, 288-port placeholder), terminal hardware (network layer diagram, OptiTap cross-ref T2 L2.9), slack storage (all three storage contexts including aerial pole bracket), labeling (T5-owned physical hardware only, with cross-ref blocks to T3 L3.12 and T4 L4.10 at L5.12 open). Author C must use 7 CFR Part 1755 + PE-60 — NOT RUS 1738 — and must not cover FDH housing grounding (deferred to T6 L6.7).

All authors: read §3 (defaulted decisions) and §5 (cross-topic map) before starting. Pulse questions: exactly 2 per lesson with full worked expected answers. Per-lesson quiz: exactly 5 questions. YAML `topic` slug: `osp-hardware-accessories`.

---

## §7 Office Context (locked)

| Field | Value |
|---|---|
| Office | Launch Fiber Services |
| Lead | Carter Trantham |
| Location | Macon, GA |
| NESC district | Light + Extreme Wind overlay (coastal-facing projects) |
| Primary client | PSC (RUS Telecom Program — 7 CFR Part 1755 + PE-60 framework; NOT RUS 1738) |
| Aerial standard | Lashed strand-and-cable |
| Strand standard | ASTM A475/A475M steel (SM / HS / EHS grades) |
| Delivery platform | Moodle |
| Moodle topic slug | `osp-hardware-accessories` |
| FDH product family | PENDING-USER confirmation (Corning Pretium / CommScope FIST / Clearfield FieldSmart) |

---

=== T5 FINAL BRIEF WORKER A END ===
