# OSP Topic 4 — Codes & Standards: T4 FINAL BRIEF (Worker A)

**Branch:** `claude/debug-previous-issues-MoN9D`  **Date:** 2026-05-14
**Role:** Final-Merge Worker A — canonical authoring brief for Topic 4
**Sources:** BRIEF_FRAMING_A.md · BRIEF_FRAMING_B.md · CANONICAL_BRIEF_A.md · CANONICAL_BRIEF_B.md

---

## §1 Lesson Plan — 16 Lessons

**Split rationale (Default #4):** CANONICAL_BRIEF_B clocked L4.2 at 40–45 min minimum — clearances (Rules 230–238) + loading districts (Rules 250–252) + IEEE 1222 sag-tension cannot fit 25 min at quality bar. Split into L4.2a (clearances) and L4.2b (loading + IEEE 1222) preserves depth and deconflicts from T3 L3.3 re-teaching risk. **L4.0 reverted per orchestrator instruction (Default #5 rescinded):** Critique B's argument is correct — a standalone L4.0 risks framework disconnection from the regulatory content; threaded callouts risk author drift. The conflict-resolution framework is instead embedded in the first 3 min of L4.1 (L4.1 extended to 23 min), keeping the framework immediately adjacent to its NESC anchor (the first major standard the framework mediates against TIA-758-C). Total: 16 lessons, ~6.2 hrs.

| # | Title | Scope (telegraphic) | Est. | Intensity | Citation Matrix (Primary / Supporting / RUS) | Interactive Elements | Worked-Example Anchor |
|---|---|---|---|---|---|---|---|
| 4.1 | NESC Overview + Conflict-Resolution Framework | **First 3 min — Standards Hierarchy:** more-restrictive governs; AHJ edition governs code compliance; NESC = utility ROW/joint-use; TIA-758-C = customer-owned private easement; federal permits layer over both. Callout-box template introduced here and cross-referenced in every subsequent lesson. **Remainder:** IEEE Std 5-2023 designation; edition history; state-adoption lag caveat; Parts 1–4 structure; applicability trigger (utility ROW / joint-use = NESC; private easement = TIA-758-C) | 23 min | STANDARD | BICSI OSP-DRD Ch. 2.1; NESC C2-2023 Rules 010–019 / TIA-758-C §1; NFPA 70 Art. 90; BICSI OSP-DRD Ch. 2.1 / 1751F-630 §2.1 | Drag-drop: route segments into controlling-standard tier (campus / utility pole / federal crossing) + flashcards + scenario (does NESC apply?) | Decision tree: project type → NESC binding or not; single route triggering NESC, TIA-758-C, NEC 770, and NWP 12 simultaneously — identify controlling standard per segment |
| 4.2a | NESC Part 2 — Clearances | Rules 230–238; Table 232-1 row lookup with road-class specified; 50-ft exception; Rules 230–231 applicability scope; 6-step midspan calc. Cross-ref T3 L3.3 — do NOT re-derive. **Authoring guard:** derive answer independently in all 6 steps; use values ≠ Framing A example | 25 min | HIGH-INTENSITY | NESC C2-2023 Rules 230–238, Tables 232-1, 234-1 / BICSI OSP-DRD Ch. 2.2, 6.3 / 1751F-630 §4 | Drag-drop (clearance arrows on aerial cross-section) + flashcards + quiz | 175-ft span, 30-ft attachment, 3.8-ft sag, road open to commercial traffic — derive midspan height, cite Table 232-1 row (include voltage class), compute margin |
| 4.2b | NESC Part 2 — Loading Districts + Sag-Tension | Rules 250–252 (Light/Medium/Heavy/Extreme Wind); IEEE Std 1222 §5 sag-tension method. Primary district = **Light** (RESOLVED — §3 #2): Macon, GA inland — NESC IEEE Std 5 designates Light loading for Zone south of ~35°N where ice load is rare. Extreme Wind overlay applies on projects within ~60mi of Atlantic/Gulf coast. Sidebar: Light worked example (primary) + Extreme Wind worked example (coastal-project overlay). Medium/Heavy referenced as one-paragraph sidebar for cross-territory awareness. **Duration trim note:** cross-territory loading coverage condensed to one sidebar paragraph (not full derivations) to keep 20-min slot viable; marquee sag-tension worked example uses Light district parameters. | 20 min | HIGH-INTENSITY | NESC C2-2023 Rules 250–252 / IEEE Std 1222 §5; BICSI OSP-DRD Ch. 2.2 / 1751F-630 §4 | Flashcards (district → ice/wind loads) + scenario (district choice shifts sag outcome) | Same span as L4.2a — show sag-tension result under Light (primary) and Extreme Wind (coastal overlay); identify how clearance margin shifts between districts |
| 4.3 | NESC Part 3 — Underground Cover | Rules 320–355, Rule 354; TIA-758-C §6.3 as stricter controlling requirement; HDD/direct-bury/conduit cover-depth matrix. Code structure only — defer depth derivation to T3 L3.5 cross-ref | 20 min | HIGH-INTENSITY | 1751F-635 §3 / NESC Rules 320–355, Rule 354; ANSI/TIA-758-C §6.1, §6.3; NEC Ch. 9 | Flashcards + scenario (mixed-method route — select cover per segment) | Route crosses public road (conduit) and open field (direct-bury) — cite controlling standard and value for each |
| 4.4 | NESC Part 4 — Work Rules | Rules 400–499; approach distances (Rules 420–424); hazard class → rule number mapping. Code-citation only — zero field safety execution (Topic 9). Do not pad with T9 content | 20 min | STANDARD | NESC Rules 400–499, 420–424 / BICSI OSP-DRD Ch. 2.4 / 1751F-630 §2.2 | Flashcards (rule → hazard category) + quiz | Given aerial crew on utility pole + underground crew entering manhole — cite applicable NESC rule for each; refer T9 for procedure |
| 4.5 | NEC Article 770 — Optical Fiber In-Building | OFN/OFNR/OFNP/OFC/OFCR/OFCP hierarchy; 770.113 listing; 770.24 firestop; 50-ft unlisted PE exception; AHJ edition lag caveat | 25 min | HIGH-INTENSITY | NEC Art. 770 (NFPA 70-2023); 770.113, 770.24 / BICSI OSP-DRD Ch. 2.5 / — | Drag-drop (assign 770 cable type: OSP → riser → horizontal) + flashcards + quiz | RUS aerial ADSS → building entry → vertical riser → horizontal office run — specify cable type at each transition with code citation |
| 4.6 | NEC Article 800 + Chapter 8 | Art. 800.93 protector grounding; 800.100 bonding; Chapter 8 independence from Chs. 1–7 (Art. 800.3); drawing-review focus | 20 min | STANDARD | NEC Art. 800; 800.93, 800.100; NEC Ch. 8 / BICSI OSP-DRD Ch. 2.5 / — | Flashcards + scenario (building-entry drawing: identify protector grounding omission) | Building-entry detail missing protector grounding — identify violation, cite 800.93, specify fix |
| 4.7 | NEC Article 250 — Grounding Code Basis | 250.94 IBT location; 250.52 electrode types; why OSP triggers NEC Art. 250. Hard stop at code-pointer level — installation depth = Topic 6 | 20 min | STANDARD | NEC Art. 250; 250.94, 250.52 / BICSI OSP-DRD Ch. 3.1 / 1751F-630 §6.3 | Flashcards + scenario (IBT omission in riser detail) | Riser detail without IBT — identify violation, cite 250.94, refer to T6 |
| 4.8 | ANSI/TIA-758-C — Customer-Owned OSP Standard | §3 definitions; §6 pathway / conduit fill; §7 splice / slack; §9 acceptance. NEC Ch. 9 fill rules (53%/31%/40% splits — do not collapse to "40% always"). **Authoring guard:** derive OD/2 to 3 decimals before squaring; show all 5 steps; specify conduit by nominal size AND inner diameter | 25 min | HIGH-INTENSITY | 1751F-630 (cites throughout) / ANSI/TIA-758-C (2019) §3, §6, §7, §9; NEC Ch. 9 / BICSI OSP-DRD Ch. 2.6 | Flashcards + scenario (85% conduit fill violation — identify and fix) | 4-in. Sch. 40 PVC (ID = 4.026 in., area = 12.73 in²); cable OD = 0.63 in. → r = 0.315 in. → area = π × 0.315² = 0.312 in²; 40% fill = 5.09 in²; count = 16 cables. Do not round r to 0.32 (yields wrong answer of 15 cables). |
| 4.9 | ANSI/TIA-568.3-D — Fiber Components | §5 cable; §6 connectors; Table 5 IL/RL (SM UPC ≤ 0.75 dB / ≥ 26 dB; SM APC ≤ 0.75 dB / ≥ 60 dB). IEC 61753 P/O/G-class ≠ TIA-568.3-D: not interchangeable — cross-validation example required | 25 min | HIGH-INTENSITY | ANSI/TIA-568.3-D (2021) §5, §6, Table 5 / BICSI OSP-DRD Ch. 2.6; IEC 61753-1 / 1751F-630 §3 | Drag-drop (UPC vs. APC → application RL spec) + flashcards + quiz | (1) GPON OLT needs RL ≥ 32 dB — specify APC. (2) IEC O-class connector IL = 0.80 dB — does it meet TIA-568.3-D UPC IL ≤ 0.75 dB? No — cross-validate, never assume equivalence. |
| 4.10 | TIA-598-D Color Codes + TIA-606-C Labeling | §4 12-fiber sequence (blue-orange-green-brown-slate-white-red-black-yellow-violet-rose-aqua); 24-fiber binder groups; TIA-606-C §6 OSP identifier hierarchy | 20 min | STANDARD | ANSI/TIA-598-D (2019) §4; TIA-606-C (2020) §6 / BICSI OSP-DRD Ch. 10.2 / 1751F-630 §9 | Drag-drop (144F / 12-tube: color labels to position) + flashcards + quiz | Given tube 7 fiber 4 — derive TIA-598-D color; build TIA-606-C identifier string |
| 4.11 | ANSI/TIA-526 — Tier 1 vs. Tier 2 Testing | TIA-526-14 [**CONFIRM EDITION — Default #1**] SM OLTS; TIA-526-7 MM OLTS + OTDR; TIA-455 FOTP as parent procedure series (FOTP-61 = OTDR method — cite to prevent conflation). Standard structure + tier selection only — test execution is T2 material | 25 min | HIGH-INTENSITY | ANSI/TIA-526-14 [confirm edition]; TIA-526-7; ANSI/TIA-455 FOTP / BICSI OSP-DRD Ch. 9.1; IEC 61300-3-4 / 1751F-630 §9 | Flashcards + scenario (3 project types: campus OM3 / rural RUS SM 22 km / MDU riser — tier selection each) | Rural RUS SM, 14 splices, 22 km → Tier 2 (BICSI OSP-DRD Ch. 9.1 OSP backbone; splice count warrants OTDR) |
| 4.12 | IEC Standards + NEMA 250 Cross-Reference | IEC 60794-1-2 (cable); IEC 61300-3-4 (attenuation); IEC 61753-1 P/O/G-class [**pin edition — UNCONFIRMED EDITION**]; IEC 60529 IP derivation; NEMA 250 ↔ IEC 60529 mapping (NEMA 3R ≠ IP68). TIA-568.3-D is the spec instrument; IEC = datasheet literacy. Gap G1 absorbed. Duration: 30 min | 30 min | STANDARD | IEC 60794-1-2; IEC 61300-3-4; IEC 61753-1; IEC 60529 / ANSI/TIA-568.3-D; NEMA 250; BICSI OSP-DRD Ch. 2.7 / — | Drag-drop (IP rating to environment) + flashcards + quiz | Closure datasheet: NEMA 3R + IP54 — direct-bury requires IP68. Show NEMA 250 ↔ IEC 60529 mapping table; confirm closure fails |
| 4.13 | OSHA 1910 / 1926 — Code-Reference Overview | 29 CFR 1910 vs. 1926 applicability trigger; Subpart S, §1910.146 confined space; 1926 Subpart K, Subpart V. Zero field safety execution — Topic 9 owns procedures | 20 min | STANDARD | 29 CFR 1910 Subpart S, §1910.146; 29 CFR 1926 Subpart K, Subpart V / BICSI OSP-DRD Ch. 2.8 / 1751F-630 §2.2 | Flashcards (CFR part → trigger) + quiz | Crew leader: confined-space manhole entry + pole approach distances — cite applicable CFR part/section for each; refer T9 |
| 4.14 | RUS/USDA Bulletins | 1751F-630 (aerial, §1); 1751F-635 (underground, §1); 1715E-110 (design guide); Form 219 approval chain. Deliverable matrix scenario. Duration: 30 min (up from 25 per B §3 + CLAUDE.md RUS-primary framing) | 30 min | HIGH-INTENSITY | 1751F-630 (aerial); 1751F-635 (underground); 1715E-110; Form 219 / BICSI OSP-DRD Ch. 2.9; ANSI/TIA-758-C / All listed | Flashcards + scenario (RUS aerial + conduit project: map bulletin, form, close-out sequence) | 48-count SM aerial + conduit route, RUS funds — bulletin selection, Form 219 triggers, drawing deadline, close-out package |
| 4.15 | DOT, Railroad, and USACE Permits | 23 CFR Part 645; USACE 33 CFR 320–332; NWP 12 (0.1-acre fill limit; regional suspension caveat — confirm with applicable USACE district); AAR clearances; **NHPA §106 / THPO coordination:** Federal action triggers Section 106 of NHPA (54 U.S.C. § 306108); coordinate with State Historic Preservation Office (SHPO) and Tribal Historic Preservation Office (THPO) for ROW affecting properties listed/eligible for the National Register. For RUS-funded projects (PSC-typical), this is a hard prerequisite to construction start. Cross-ref Topic 3 L3.1 + L3.11. Railroad: short-line (Class III) primary (30–60 day); Class I appendix (90–180 day). Cross-ref T3 L3.8 lead-time table. **Authoring guards:** NWP 12 must include (a) 0.1-acre limit and (b) regional suspension caveat. NHPA §106 must name SHPO + THPO coordination explicitly and call out RUS-funded = hard prerequisite. | 25 min | HIGH-INTENSITY | 23 CFR Part 645; USACE 33 CFR 320–332; AAR Engineering Standards; NHPA §106 (54 U.S.C. § 306108) / BICSI OSP-DRD Ch. 2.10; ANSI/TIA-758-C §6.1 / 1751F-630 §7, §10 | Flashcards + scenario (state highway + short-line RR + navigable creek: permit matrix + timeline + NHPA consultation trigger) | Route: state highway (23 CFR 645 ROW permit) + short-line RR (AAR clearance + railroad agreement, 30–60 days) + creek 0.05-acre fill (NWP 12 + PCN + 401 WQC) + RUS funding (NHPA §106 SHPO/THPO consultation — hard prerequisite before construction start). Class I appendix: 90–180 day contrast. |

**Duration: ~6.2 hrs. 16 lessons. Intensity: 9 HIGH-INTENSITY / 7 STANDARD.**

---

## §2 Final Exam Specification

- **Questions:** 32 (up from 25 — 16 lessons × 2 per Default #6, controlling-standard framework embedded in L4.1)
- **Pass threshold:** 21/30 (70%)
- **Format:** Identical to Topics 1–3 — A–D options, `[CORRECT]` inline, `*Rationale:*` italic block with bold per-option citation sub-bullets, lesson-ordered in source, randomized at Moodle import

| Lesson | Qs | Types |
|---|---|---|
| 4.1 NESC Overview + Conflict Framework | 2 | 1 NESC applicability trigger scenario + 1 cross-standard controlling-standard scenario (3-segment route: NESC / TIA-758-C / federal — identify controlling standard per segment) |
| 4.2a Clearances | 2 | 1 Table 232-1 row recall + 1 calc scenario |
| 4.2b Loading Districts | 2 | 1 district definition recall + 1 district-choice → sag scenario |
| 4.3 Underground Cover | 2 | 1 standard-selection scenario + 1 controlling-standard scenario |
| 4.4 Work Rules | 2 | 1 rule-to-hazard recall + 1 cite-in-field scenario |
| 4.5 NEC Art. 770 | 2 | 1 cable-type recall + 1 route-classification scenario |
| 4.6 NEC Art. 800 | 2 | 1 Ch. 8 independence + 1 protector grounding scenario |
| 4.7 NEC Art. 250 | 2 | 1 IBT location recall + 1 IBT-omission scenario |
| 4.8 TIA-758-C | 2 | 1 conduit fill calc + 1 slack/labeling scenario |
| 4.9 TIA-568.3-D | 2 | 1 IL/RL selection + 1 IEC cross-validation scenario |
| 4.10 TIA-598-D + TIA-606-C | 2 | 1 color position + 1 identifier string construction |
| 4.11 TIA-526 Testing | 2 | 1 tier selection + 1 FOTP citation scenario |
| 4.12 IEC + NEMA 250 | 2 | 1 IP derivation + 1 NEMA↔IEC cross-validation |
| 4.13 OSHA 1910/1926 | 2 | 1 applicability trigger recall + 1 cite-CFR-for-condition scenario |
| 4.14 RUS Bulletins | 2 | 1 bulletin selection + 1 Form 219 deliverable scenario |
| 4.15 DOT/RR/USACE | 2 | 1 NWP 12 recall (0.1-acre + regional caveat) + 1 multi-crossing timeline (includes NHPA §106 THPO consultation trigger) |
| **Total** | **32** | ~50% recall / ~50% applied scenario |

**Q distribution verified:** L4.1 = 2; L4.2a–L4.15 = 15 lessons × 2 = 30. Total: 32. Cross-standard controlling-standard scenario absorbed into L4.1 Q2 (framework now embedded in L4.1, not a standalone lesson). All 16 lessons carry 2 Qs (recall + scenario) per Default #6.

---

## §3 Defaulted Decisions

| # | Decision | Default | Rationale | Flag |
|---|---|---|---|---|
| 1 | TIA-526-14 edition suffix | Write `ANSI/TIA-526-14 [confirm edition before publication]` — do NOT pin -14-B or -14-C | Both framings cited -14-B; CANONICAL_BRIEF_B flags -14-C may be current (late 2023). T2 L2.11 uses "-14" without suffix. Pinning an unconfirmed suffix creates cross-topic citation drift. Orchestrator confirms; single global search-replace before ship. | DEFAULTED, awaiting user confirmation — confirm TIA-526-14 current edition; update T2 L2.11 simultaneously |
| 2 | NESC loading district for L4.2b primary example | **Light** (Macon, GA) | RESOLVED by orchestrator. Macon, GA inland — NESC IEEE Std 5 designates Light loading for Zone south of ~35°N where ice load is rare. Extreme Wind overlay applies on projects within ~60mi of Atlantic/Gulf coast (lower SE coastal Georgia / Florida panhandle). Worker A's prior "Heavy" default is superseded. Sidebar shows Light + Extreme Wind worked examples; Medium/Heavy referenced for cross-territory awareness only. | **RESOLVED** — Light (Macon GA inland). Extreme Wind overlay for coastal-zone projects. |
| 3 | Railroad scenario class for L4.15 | **Short-line (Class III)** primary (30–60 day lead); Class I appendix (90–180 day) | RUS rural routes encounter short-line carriers more frequently than Class I. Both are taught for contrast. Cross-ref T3 L3.8 lead-time table. | DEFAULTED, awaiting user confirmation — confirm whether office has active Class I crossing work warranting elevation to primary |
| 4 | L4.2 split into two lessons | **YES — L4.2a + L4.2b** | Cannot teach clearances + loading districts + IEEE 1222 at quality bar in 25 min (CANONICAL_BRIEF_B: 40–45 min actual). Split eliminates re-teaching overlap with T3 L3.3 by giving each lesson a distinct code-structure scope. | DEFAULTED — pedagogically unambiguous |
| 5 | Controlling-standard framework placement | **Extend L4.1 by 3 min** (not standalone L4.0 lesson) | RESOLVED by orchestrator. Critique B's argument accepted: a standalone L4.0 risks framework disconnection from the regulatory content it mediates; threaded callouts risk author drift. Framework embedded in the first 3 min of L4.1 (extended to 23 min) keeps it immediately adjacent to its NESC anchor — the first major standard the framework needs to mediate against TIA-758-C. Lesson count is **16** (L4.2 split into L4.2a + L4.2b). | **RESOLVED** — extend L4.1 to 23 min; no L4.0 lesson. L4.2 split into L4.2a + L4.2b brings total to 16 lessons. |
| 6 | Exam discrimination for recall-only lessons | **Upgrade to 2 Qs per lesson (1 recall + 1 scenario)** + 1 cross-lesson controlling-standard question | Single recall Q on L4.1, L4.4, L4.7, L4.13 produces an exam with a soft bottom — too easy at the million-dollar quality bar. Scenario questions separate understanding from memorization. Total: 32 Qs / 70% threshold. | DEFAULTED — orchestrator to confirm 32-Q exam consistent with Topics 1–3 progression |

---

## §4 Authoring Conventions

YAML frontmatter per lesson (`title`, `duration_min`, `topic`, `order`, `bicsi_alignment`, `sources`). Section order invariant: Learning Objectives → Reading Content → Key Terms → Interactive(s) → Final Check (2 pulse questions with full worked expected answers — mandatory, no exceptions) → Glossary Cross-References. Citations inline at sentence end. Q-structure locked: stem → A/B/C/D → `[CORRECT]` inline → `*Rationale:*` italic → bold per-option sub-bullets → one-line rationale + citation → `---`. Pulse format: `**Pulse N.**` → question → `*Expected answer:*` → full worked answer. RUS bulletin cited first when co-applicable with ANSI/TIA. Vendor-agnostic. Math verified before any `[CORRECT]` tag. NESC/TIA-758-C applicability trigger stated once (L4.1); cross-referenced thereafter. Railroad lead times always split — never a flat value.

---

## §5 Cross-Topic References

| Thread | Lessons | Notes |
|---|---|---|
| IEEE Std 1222 sag-tension | T3 L3.4 ↔ L4.2b | T3 uses as design tool; L4.2b provides code-standard basis |
| NESC clearance calc | T3 L3.3 ↔ L4.2a | T3 derives; L4.2a provides Rule 230–231 applicability context — do not re-derive |
| NESC Rule 354 cover depth | T3 L3.5 ↔ L4.3 | T3 derives depths; L4.3 provides code structure — do not re-derive |
| TIA-526 tier selection | T2 L2.10/L2.11 ↔ L4.11 | T2 = execution; L4.11 = standard structure + tier criteria. Edition suffix must match T2 L2.11. |
| NHPA §106 / THPO | T3 L3.1, L3.11 ↔ L4.15 | T3 uses as permitting step; L4.15 provides statutory basis |
| Railroad permit lead times | T3 L3.8 ↔ L4.15 | Values must match (30–60 short-line / 90–180 Class I) |
| NEMA 250 enclosure selection | T5 L5.8 ↔ L4.12 | T5 teaches selection; L4.12 provides IEC 60529 / NEMA 250 cross-validation framework |
| NEC Art. 250 grounding depth | T6 L6.1/L6.2 ↔ L4.7 | L4.7 = code pointer; T6 owns installation practice |
| OSHA field safety execution | T9 L9.1/L9.3 ↔ L4.4/L4.13 | L4.4/L4.13 locate the code rules; T9 owns the procedures |
| NEC 770 cable taxonomy | T1 L1.7 ↔ L4.5 | T1 introduces; L4.5 extends with fire-rating classification |
| TIA-526-14 edition currency | T2 L2.11 ↔ L4.11 | Must be updated simultaneously when edition is confirmed |

---

## §6 Authoring Split Proposal

Topic 4 has **9 HIGH-INTENSITY lessons** (L4.2a, L4.2b, L4.3, L4.5, L4.8, L4.9, L4.11, L4.14, L4.15). Threshold of 4 exceeded → 3-author split required.

| Author | Lessons | Rationale |
|---|---|---|
| 1 — Standards backbone | L4.1, L4.2a, L4.2b, L4.3, L4.4 | NESC family + conflict-resolution framework (embedded in L4.1 opening block). Needs NESC C2-2023 + IEEE 1222 access. HIGH: L4.2a, L4.2b, L4.3. |
| 2 — NEC / TIA / IEC | L4.5, L4.6, L4.7, L4.8, L4.9, L4.10, L4.11, L4.12 | NEC + TIA + IEC family. Needs TIA-758-C, TIA-568.3-D, TIA-526, IEC 60529, NEMA 250 access. HIGH: L4.5, L4.8, L4.9, L4.11. |
| 3 — Regulatory + Exam | L4.13, L4.14, L4.15 + Full 32-Q Exam | OSHA + RUS bulletins + federal permits. Needs 29 CFR, RUS bulletin set, NHPA §106, AAR standards. HIGH: L4.14, L4.15. Writes exam because they see all three regulatory families and all cross-topic threads. |

Guard: Authors 1 and 2 deliver Glossary Cross-References blocks before Author 3 writes the exam, so cross-lesson questions have accurate anchors.

---

## Office context (locked)

| Field | Value |
|---|---|
| Office name | Launch Fiber Services |
| Owner | Carter Trantham |
| Location | Macon, GA |
| NESC loading district | **Light** (inland Macon; Extreme Wind overlay for projects within ~60mi of Atlantic/Gulf coast) |
| Primary client | PSC (RUS-program engineering contracts) |
| Training delivery | Moodle (Railway-hosted), OAuth2 SSO bridge via launch-database |
| Repo scope | `kodaicards/launch-database` (main app) + `kodaicards/osp-design-training` (OSP SPA, served as `/training/` behind requireAuth) |

This section makes the brief self-contained for future authoring agents. Do not modify without orchestrator instruction.

---

=== T4 FINAL BRIEF WORKER A END ===
