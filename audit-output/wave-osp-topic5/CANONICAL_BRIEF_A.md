# OSP Topic 5 — Hardware & Accessories: CANONICAL BRIEF A (Consolidator A)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Consolidator:** A (independent merge — did not read Consolidator B output)
**Source framings:** BRIEF_FRAMING_A.md (standards+citations, `a90118f`) + BRIEF_FRAMING_B.md (outcomes+daily-job, `b0e4de1`)
**Pre-resolved decisions absorbed:** 5 (from orchestrator brief)

---

## §1 Twelve-Lesson Canonical Plan

Both framings converge independently on the same 12-lesson sequence and ~5.5 hr estimate. Sequence follows field workflow: aerial support structure (5.1–5.5) → underground housing (5.6–5.7) → enclosures + active equipment (5.8–5.10) → storage + labeling (5.11–5.12).

| # | Title | Duration | Citation Matrix (Primary → Supporting → RUS) | Learner Outcome | Interactive Elements | Intensity |
|---|---|---|---|---|---|---|
| 5.1 | Pole Hardware: Bands, Brackets, Dead-End Assemblies, and Vibration Dampers | 25 min | NESC Rules 261, 238 → IEEE 1222 §6; BICSI OSP-DRD Ch. 6.3 → RUS 1715E-110 §4; 1751F-630 §4 | Select pole hardware set (band size, bracket type, damper) for a given NESC loading district, span, and attachment geometry; spec the BOM for a PSC RUS aerial route segment | Drag-drop (label pole assembly: pole band, suspension bracket, dead-end bracket, damper, through-bolt hardware) + flashcards (hardware type → function) + MC quiz | STANDARD |
| 5.2 | Strand and Messenger Wire: Grades, RBS, and Selection | 25 min | NESC Rules 250–252, 261; ASTM A475 → BICSI OSP-DRD Ch. 6.3 → RUS 1715E-110 §3; 1751F-630 §3 | Specify ASTM A475 steel strand grade (SM/HS/EHS) and diameter for a given span and loading district; verify NESC 2.0× safety factor; cite aluminum strand (ASTM B498/B230) as sidebar with galvanic note; cite ADSS as 2-paragraph sidebar | Scenario (280-ft span, NESC Light district, RUS-program route: select grade from RBS table, verify 2.0× SF — see §worked-example anchor) + flashcards (grade → RBS range) + MC quiz | HIGH-INTENSITY |
| 5.3 | Lashing Wire and Lashing Machines | 20 min | ANSI/TIA-758-C §5.3 → BICSI OSP-DRD Ch. 6.3; ASTM A641 → RUS 1751F-630 §6; PLP lashing guide | Select lashing wire gauge (0.045/0.065 in.) from cable OD and span; specify dead-end overlap (6 in. past clamp); understand gap inspection criteria (≤1.5 in. as utility-practice value, NOT TIA-758-C verbatim — quiz framed around citable requirements only per pre-resolved decision §4-D4) | Flashcards (gauge → application range, dead-end overlap, gap inspection) + MC quiz | STANDARD |
| 5.4 | Cable Hangers, J-Hooks, and Spacers | 20 min | NEC §800.24 → ANSI/TIA-568.0-D §4; TIA-758-C §5.3; BICSI OSP-DRD Ch. 6.3–6.4 | Apply correct hanger type for interior riser (J-hook, 36-in. max spacing, NEC §800.24) vs. aerial segment vs. conduit bundle; spot a spacing violation on a riser drawing | Drag-drop (match J-hook / conduit hanger / aerial strand hanger to: interior riser, conduit bundle, short aerial segment) + flashcards + MC quiz | STANDARD |
| 5.5 | Aerial Drop Hardware: ADC Clamps, P-Hooks, and Service-Loop Fittings | 20 min | ANSI/TIA-758-C §5.4; NESC Rule 238 → BICSI OSP-DRD Ch. 6.3; NEC Art. 800 → RUS 1751F-630 §6 | Specify complete aerial drop assembly: ADC clamp type, P-hook at mid-span, 2-ft minimum service loop (TIA-758-C §5.4), 12-in. drip loop at building entry (NEC Art. 800), strain relief; distinguish lashed-drop from ADSS drop hardware | Scenario (110-ft aerial drop, wood-frame building: select ADC clamp, P-hook yes/no, drip loop yes/no, strain relief type — branch shows pass/fail with citation) + flashcards + MC quiz | STANDARD |
| 5.6 | Underground Hardware: Handholes, Manholes, Pull Boxes, and Cable Racks | 30 min | AASHTO H-load tiers; NEC Ch. 9; NESC Rule 354 → ANSI/TIA-758-C §6.2; BICSI OSP-DRD Ch. 6.1–6.2 → RUS 1751F-635 §3 | Select structure class (Tier 8/15/22) from site-load condition; apply NEC Ch. 9 pull-box sizing (8× straight, 6× angle pull); flag OSHA 1910.146 confined-space at manholes (code pointer only — T9 owns procedures) | Drag-drop (Tier 8/15/22 → driveway / rural highway shoulder / pedestrian path) + scenario (pull-box sizing for 4-conduit bank) + flashcards + MC quiz | HIGH-INTENSITY |
| 5.7 | Direct-Bury Marking: Warning Tape, Tracer Wire, and Marker Posts | 20 min | ANSI/TIA-758-C §6.4; APWA Uniform Color Code → BICSI OSP-DRD Ch. 6.2; CGA Best Practices v18; NECA 301 → RUS 1751F-635 §3 | Specify three-layer marking system for a RUS direct-bury route: orange APWA non-detectable warning tape at 12 in. above conduit + detectable tape or 14 AWG Cu tracer wire (RUS-required) + marker posts at route start, end, 500-ft intervals, and direction changes (TIA-758-C §6.4) | Scenario (2-mile direct-bury route, two road crossings, three direction changes: build three-layer marking BOM) + flashcards + MC quiz | HIGH-INTENSITY |
| 5.8 | Pedestals and Cabinets: Types, NEMA Ratings, and Locking | 25 min | NEMA 250; IEC 60529 → ANSI/TIA-758-C §8; BICSI OSP-DRD Ch. 6.4 → RUS 1751F-635 §5 | Select NEMA type for deployment environment; translate NEMA rating to IEC IP equivalent using T4 L4.12 table (cross-reference only, not re-derived here); distinguish indoor NEMA 1 / rain-proof 3R / watertight 4 (IP65) / corrosion-resistant 4X (IP66) | Drag-drop (NEMA 1/3R/4/4X → indoor telco room / outdoor rural / coastal salt-air / roadside cabinet) + flashcards + MC quiz | STANDARD |
| 5.9 | Fiber Distribution Hubs (FDH): Construction-Grade vs. Rack-Mount, Port Configuration | 25 min | ANSI/TIA-758-C §8 → BICSI OSP-DRD Ch. 6.4, 8 → **7 CFR Part 1755 + RUS PE-60** (NOT RUS Bulletin 1738 — see §3 pre-resolved decision D2) | Distinguish hardened pad-mount FDH (IP65+) from rack-mount hub-site FDH; size FDH port count for a given GPON service area (subscriber count × split ratio × growth factor → port count); spec SC-APC vs. LC-APC cassette architecture | Scenario (192 homes, 1:32 split, 15% growth → derive port count → select FDH tier — full worked math) + flashcards + MC quiz | HIGH-INTENSITY |
| 5.10 | Terminal Hardware: Drop Terminals, MST, and NIDs | 25 min | ANSI/TIA-758-C §8 → BICSI OSP-DRD Ch. 6.4, 8; Corning OptiTap; CommScope OptiSheath → **7 CFR Part 1755 + RUS PE-60** | Map CO → feeder → FDH → distribution → MST → drop → NID/ONT network layer diagram; specify MST port count and connector type (OptiTap or hardened SC-APC) for a given drop count; distinguish tool-free pull-to-lock MST access as the field-critical spec | Drag-drop (blank OSP layer diagram: drag FDH / MST / drop terminal / NID to correct nodes) + flashcards + MC quiz | STANDARD |
| 5.11 | Storage Hardware: Slack Racks, Snowshoes, Figure-8 Coils, Vault Storage | 20 min | ANSI/TIA-758-C §6.4 → BICSI OSP-DRD Ch. 8.1 → RUS 1751F-635 §4 | Select correct slack storage method (slack rack in vault, snowshoe in pedestal, aerial pole bracket) for scenario; cite 10× OD minimum static bend radius (SM OSP cable) and 10-m minimum slack per closure side (TIA-758-C §6.4); apply Velcro-only tie rule for vault storage | Flashcards (storage scenario → method, min bend radius, Velcro vs. metal clamp rule) + MC quiz | STANDARD |
| 5.12 | Identification and Labeling: Cable Tags, Route Markers, RFID, TIA-606-C | 25 min | ANSI/TIA-606-C; TIA-598-D → ANSI/TIA-758-C §9; BICSI OSP-DRD Ch. 10.2 → RUS 1751F-630 §9; RUS Form 515c | Build TIA-606-C OSP path identifier (campus + route + cable + tube + fiber) for a given segment; specify tag material (SS or UV-resistant polyester) and attachment (lashing wire loop — no adhesive); place marker posts at required intervals; cross-reference T3 L3.12 (as-built records), T4 L4.10 (color-code basis) — do NOT re-teach those | Scenario (multi-segment route: derive path ID, spec tag material + attachment, place marker posts on route sketch) + flashcards + MC quiz | STANDARD |

**Total estimated duration: ~5.5 hrs. 12 lessons. Intensity: 3 HIGH-INTENSITY / 9 STANDARD.**

---

## §2 Final Exam Shape

Framing A proposed 25 questions (uneven per-lesson distribution: 3 Q on 5.2, 5.6, 5.10 vs. 1 Q on 5.4, 5.11). Orchestrator brief specifies **2 per lesson = 24 Q**. Canonical count is **24**.

- **Questions:** 24 (2 per lesson, consistent with the 2-per-lesson cadence specified by orchestrator)
- **Pass threshold:** 17/24 correct (70.8% → rounds to 70% threshold)
- **Format:** Identical to Topics 1–4 — A–D options, `[CORRECT]` inline, `*Rationale:*` italic block with bold per-option citation sub-bullets, lesson-number-ordered in source file, randomized at Moodle import
- **Type split:** ~50% recall/recognition, ~50% applied scenario — hardware topic warrants heavier scenario weighting than prior topics

| Lesson | Q Count | Types |
|---|---|---|
| 5.1 Pole Hardware | 2 | 1 hardware-selection recall + 1 loading-district scenario |
| 5.2 Strand + Messenger | 2 | 1 grade/RBS recall + 1 strand-selection scenario (NESC 2.0× SF) |
| 5.3 Lashing Wire | 2 | 1 gauge-selection recall + 1 dead-end overlap scenario |
| 5.4 Hangers | 2 | 1 spacing-rule recall (aerial vs. riser) + 1 code-citation scenario (NEC §800.24) |
| 5.5 Aerial Drop | 2 | 1 service-loop minimum recall + 1 drop assembly specification scenario |
| 5.6 Underground Hardware | 2 | 1 tier-selection scenario + 1 pull-box sizing calculation |
| 5.7 Direct-Bury Marking | 2 | 1 APWA color-code recall + 1 three-layer marking specification scenario |
| 5.8 Pedestals + Cabinets | 2 | 1 NEMA type recall + 1 NEMA↔IEC cross-validation scenario |
| 5.9 FDH | 2 | 1 construction-grade vs. rack-mount recall + 1 port-sizing scenario (full math) |
| 5.10 Terminals | 2 | 1 MST access-method recall + 1 network-layer-diagram scenario |
| 5.11 Storage | 2 | 1 bend-radius / slack minimum recall + 1 storage-method selection scenario |
| 5.12 Labeling | 2 | 1 marker-post interval recall + 1 TIA-606-C identifier construction scenario |
| **Total** | **24** | ~50% recall / ~50% applied scenario |

**Citation distribution:** RUS PE-60 + 7 CFR Part 1755 citations appear in L5.9 and L5.10 exam rationale blocks. RUS 1751F-630/635 citations appear in L5.2, L5.3, L5.6, L5.7, L5.11, L5.12. Every question rationale cites the exact standard section. Math derivations independently verified before any `[CORRECT]` tag is written.

---

## §3 Pre-Resolved Decisions

| # | Decision | Resolution | Source |
|---|---|---|---|
| D1 | Strand standard for L5.2 | **ASTM A475** (steel strand, SM/HS/EHS grades) is primary. ASTM B498 (aluminum-clad steel) and ASTM B230 (all-aluminum alloy) are covered in a one-paragraph sidebar noting galvanic-compatibility requirement at pole hardware attachments. NESC Rules 250–252 with 2.0× safety factor cited. Aluminum strand on PSC-program joint-use poles remains an open escalation item (§4-E1). | Orchestrator brief D1 |
| D2 | RUS regulatory framework for L5.9/L5.10 | **7 CFR Part 1755 + RUS PE-60** (Procedure for the Engineering of Outside Plant) is the correct citation for the RUS Telecom Program. RUS Bulletin 1738 governs a separate broadband loan program (distance learning / telemedicine) and is NOT the FDH approved-equipment anchor for PSC-program work. Framing A's Q2 identified this correctly. All L5.9 and L5.10 exam rationale blocks use PE-60 as the RUS citation. | Orchestrator brief D2; Framing A §7 Q2 |
| D3 | Aerial cable type for L5.2–L5.3 | **Lashed cable** (strand + lashing machine) is primary — RUS-program default and office standard confirmed. ADSS self-supporting cable appears as a 2-paragraph sidebar in L5.2 with preformed grip dead-end and AGS assembly mention; L5.3 lashing-machine content is not compressed. | Orchestrator brief D3 |
| D4 | TIA-758-C §5.3 lashing gap citability | The ≤1.5 in. gap figure is **utility-practice value, not a verbatim TIA-758-C table row**. L5.3 quiz questions are framed around fully citable requirements only: gauge selection (0.045/0.065 in.) and dead-end overlap (6 in. past clamp). Gap inspection is taught in reading content with the APWA/utility-practice source noted explicitly. Red team should verify whether this value appears verbatim in RUS 1751F-630 or PLP normative reference before authoring L5.3 exam. | Orchestrator brief D4 |
| D5 | T5 L5.12 boundary vs. T3 L3.12 and T4 L4.10 | T5 L5.12 owns **physical hardware** (tag material, attachment method, marker post intervals, BOM placement). T3 L3.12 owns **records** (as-builts, RUS Forms 515c+219, version control). T4 L4.10 owns **code basis** (TIA-606-C identifier hierarchy + TIA-598-D fiber color code). L5.12 opens with explicit cross-reference blocks to both T3 L3.12 and T4 L4.10; does not re-teach identifier structure or color codes. | Orchestrator brief D5 |

---

## §4 Escalation Queue

Items requiring user or red-team input before specific lessons are authored:

1. **FDH product family standardization (USER — highest priority for L5.9 daily-job value):** Does the office standardize on a specific FDH product family? Corning (Pretium), CommScope (FIST), or Clearfield (FieldSmart) are the three options raised by both framings. L5.9 port-sizing scenario works generically but gains direct job-site reusability if the worked example uses the exact port-count increment and cassette architecture the office installs. Generic 288-port hardened SC-APC FDH is used as placeholder until confirmed.

2. **Aluminum strand on PSC-program joint-use poles (RED TEAM — confirms before L5.2 authored):** Pre-resolved decision D1 places aluminum strand (ASTM B498/B230) as a sidebar. Red team should confirm whether PSC specs or RUS 1715E-110 §3 permit aluminum strand on joint-use poles in the office's service territory. If prohibited, the sidebar is a warning; if permitted, galvanic-compatibility note at pole hardware attachments (ASTM A153 galvanizing requirement) must be explicit.

3. **Lashing gap verbatim citation (RED TEAM — confirms before L5.3 exam authored):** The ≤1.5 in. gap inspection value must appear verbatim in a citable source (RUS 1751F-630, PLP normative reference, or BICSI OSP-DRD) before it can be a `[CORRECT]` answer. If not found, the exam question remains framed around gauge selection and dead-end overlap only. Pre-resolved decision D4 holds pending red-team document verification.

---

## §5 Inherited Authoring Conventions (Topics 1–4)

Every lesson opens with a YAML frontmatter block (`title`, `duration_min`, `topic`, `order`, `bicsi_alignment` list, `sources` list). Section order is invariant: Learning Objectives → Reading Content → Key Terms (Flashcard Candidates) → Interactive(s) → Final Check (2 pulse questions with expected answers) → Glossary Cross-References. Inline bracketed citations appear at sentence end or table note — never in a separate footnote block. Quiz Q-structure is exactly: stem → A/B/C/D options → `[CORRECT]` inline on the correct option → `*Rationale:*` italic label → bold per-option sub-bullets `**A — Incorrect.**` or `**B — Correct.**` followed by one-line rationale + citation → `---` between questions. Pulse questions are `**Pulse N.**` bold label → question → blank line → `*Expected answer:*` italic label with full worked answer. RUS bulletin cited alongside ANSI/TIA wherever both apply; RUS value explicitly called out when stricter. Vendor-agnostic in quiz questions: no specific manufacturer products. Math derivation independently verified before writing any `[CORRECT]` tag. No content re-taught that is already owned by a prior topic's lesson — establish once, cross-reference thereafter.

---

## §6 Cross-Topic Reference Map

| Thread | Prior Lesson | T5 Application | Treatment |
|---|---|---|---|
| NESC loading districts (Light / Extreme Wind) | T4 L4.2b | L5.2 uses loading district as design input for strand grade selection | Cross-reference only; do NOT re-derive loading district |
| NESC Rule 261 + 2.0× safety factor | T4 L4.2a | L5.1 cites 2.0× SF as the NESC constraint on hardware selection; L5.2 applies in strand-grade scenario | Cross-reference in L5.1 opener; apply in L5.2 scenario |
| NEMA 250 ↔ IEC 60529 cross-reference | T4 L4.12 | L5.8 uses the mapping table to select pedestal/cabinet type for deployment environment | Cross-reference T4 L4.12 as authoritative; do NOT re-derive |
| TIA-598-D color codes + TIA-606-C identifier hierarchy | T4 L4.10 | L5.12 references tube/fiber color for tag data fields and uses TIA-606-C structure to build path ID | L5.12 explicitly cross-references T4 L4.10 at lesson open; does NOT re-teach color codes or identifier structure |
| Splice closure architecture (dome vs. in-line, IP68) | T2 L2.6 | L5.8 (pedestal housing) and L5.11 (slack storage) treat closures as tenants of the hardware — no closure internals re-taught | Cross-reference T2 L2.6 in L5.8 and L5.11 |
| Hardened connector types (OptiTap, HOC, IP67/68) | T2 L2.9 | L5.10 places MST/drop terminal in network layer; connector mechanics live in T2 | Cross-reference T2 L2.9 in L5.10; do NOT re-teach connector ratings |
| Underground burial depth + conduit fill | T3 L3.5 | L5.6 focuses on structure class (handhole/manhole tier) and interior hardware; burial depth rules live in T3 | Cross-reference T3 L3.5 in L5.6 opener |
| As-built records, RUS Forms 515c + 219 | T3 L3.12 | L5.12 labeling data feeds as-built record; the forms themselves are T3 scope | Cross-reference T3 L3.12 in L5.12 |
| OSHA 1910.146 confined-space procedures | T4 L4.13 | L5.6 cites 1910.146 as a code pointer at manholes only — T9 owns field procedures | Code pointer in L5.6; explicit "full procedures in Topic 9" note |
| IEC 60529 IP ratings (T4 L4.12) ↔ NEMA (T5 L5.8) | T4 L4.12 | L5.8 deploys the NEMA↔IEC equivalence table operationally in pedestal/cabinet selection | Cross-reference in L5.8 daily-job hook |
| NESC Light loading district (T4 L4.2b) ↔ pole hardware (T5 L5.1) + strand (T5 L5.2) | T4 L4.2b | L5.1 and L5.2 worked examples use Macon, GA (NESC Light district + NESC Extreme Wind overlay for coastal-facing projects) as the scenario geography | Consistent with office location in CLAUDE.md |

---

## §7 Authoring Split Proposal

**Split A: L5.1–L5.6 — Aerial + Underground Hardware (Author A)**
Pole hardware, strand, lashing, hangers, aerial drop hardware, underground structures. This block is structurally cohesive (support structure → cable routing → underground housing) and produces the heaviest BOM work (RUS bulletins 1715E-110 + 1751F-630 + 1751F-635 all active). Contains the two highest-complexity scenarios (strand grade selection, pull-box sizing). Author A should be comfortable with NESC loading, ASTM A475 RBS tables, and AASHTO tier ratings.

**Split B: L5.7–L5.12 — Marking, Enclosures, Electronics, Storage, and Identification (Author B)**
Direct-bury marking, pedestals/cabinets, FDH, terminal hardware, slack storage, labeling. Contains the FDH port-sizing scenario (highest daily-job reuse) and the TIA-606-C identifier construction scenario. Author B must be comfortable with 7 CFR Part 1755 + PE-60 citation, NEMA 250 ↔ IEC 60529 cross-reference (from T4 L4.12), and TIA-606-C §6 identifier hierarchy (from T4 L4.10). Author B writes L5.12 with explicit cross-reference blocks to T3 L3.12 and T4 L4.10 at lesson open.

Both authors: read §3 (pre-resolved decisions) and §6 (cross-topic map) before starting. Do not re-derive NESC loading districts, NEMA↔IEC table, TIA-606-C hierarchy, or closure architecture — cross-reference only.

---

=== T5 CANONICAL BRIEF A END ===
