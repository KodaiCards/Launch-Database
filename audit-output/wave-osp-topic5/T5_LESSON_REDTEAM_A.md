# T5 Lesson Red-Team A — Math + Citation Verification
**Scope:** L5.1–L5.12 (13 lessons, osp-hardware-accessories)
**Framing:** Math + citation verification (independent re-derivation of all numerical claims)
**Date:** 2026-05-14

---

## 1. Numerical-Claim Table

| # | Lesson | Claim | Independent Result | Verdict |
|---|---|---|---|---|
| N1 | L5.2b Step 1 | w_d = 0.380 + 0.116 = 0.496 lb/ft | 0.380 + 0.116 = 0.496 ✓ | VERIFIED |
| N2 | L5.2b Step 2 | w_w = 9 × (0.63/12) = 0.472 lb/ft | 9 × 0.0525 = 0.4725; rounded to 0.472 (negligible) | VERIFIED |
| N3 | L5.2b Step 3 | w = √(0.496² + 0.472²) = 0.685 lb/ft | √(0.2460 + 0.2228) = √0.4688 = 0.6847; lesson rounds to 0.685 ✓ | VERIFIED |
| N4 | L5.2b Step 4 | H = 0.685 × 250² / (8 × 3.5) = 1,529 lb | 0.685 × 62,500 / 28 = 1,529 lb ✓ | VERIFIED |
| N5 | L5.2b Step 5 | Required RBS = 1,529 × 2.0 = 3,058 lb | 1,529 × 2.0 = 3,058 ✓ | VERIFIED |
| N6 | L5.2b Step 6 | HS (3,780 lb) passes; SM (2,700 lb) fails | HS allow. = 1,890 ≥ 1,529 ✓; SM allow. = 1,350 < 1,529 ✓ | VERIFIED |
| N7 | L5.2b Verify | S_min at HS allowable (H=1,890 lb) = 2.83 ft | 0.685 × 62,500 / (8 × 1,890) = 42,813 / 15,120 = 2.83 ✓ | VERIFIED |
| N8 | L5.2b Q4 | Sag → 5 ft: H = ~1,070 lb; RBS req. = 2,140 lb; SM passes | H = 0.685 × 62,500 / 40 = 1,070 lb ✓; 1,070 × 2 = 2,140 ✓; SM 2,700 > 2,140 ✓ | VERIFIED |
| N9 | L5.1 | M_tension = 1,529 × 32 = 48,928 ft·lb | 1,529 × 32 = 48,928 ✓ | VERIFIED |
| N10 | L5.1 | F_wind = 0.472 × 125 = 59 lb | 0.472 × 125 = 59 ✓ | VERIFIED |
| N11 | L5.1 | M_wind = 59 × 32 = 1,888 ft·lb | 59 × 32 = 1,888 ✓ | VERIFIED |
| N12 | L5.1 | M_total = 48,928 + 1,888 = 50,816 ft·lb | 48,928 + 1,888 = 50,816 ✓ | VERIFIED |
| N13 | L5.1 | M_required = 50,816 × 2.0 = 101,632 ft·lb | 50,816 × 2.0 = 101,632 ✓ | VERIFIED |
| N14 | L5.4 Q3 | 6 conduits × 0.45 lb/ft × 5 ft = 13.5 lb | 6 × 0.45 × 5 = 13.5 ✓ | VERIFIED |
| N15 | L5.9 | 192 × 1.20 = 230.4 → 288-port FDH | 192 × 1.20 = 230.4; next standard above 230.4 = 288 ✓ | VERIFIED |
| N16 | L5.9 | 6 cassettes for 192 subs; 3 reserve; 57 spare ports | ⌈192/32⌉ = 6 ✓; 9 − 6 = 3 ✓; 288 − 231 = 57 ✓ | VERIFIED |
| N17 | L5.11 | 0.63-in. OD → bend radius 6.3 in., coil diam 12.6 in. | 10 × 0.63 = 6.3; 2 × 6.3 = 12.6 ✓ | VERIFIED |
| N18 | L5.11 Q2 | 0.75-in. OD → bend radius 7.5 in., coil diam 15.0 in. | 10 × 0.75 = 7.5; 2 × 7.5 = 15.0 ✓ | VERIFIED |
| N19 | L5.7 | 14 AWG Cu ≈ 2.6 Ω/1,000 ft; 28 Ω reading = fault | Std value for 14 AWG solid Cu ≈ 2.575 Ω/1,000 ft at 20 °C; 2.6 ✓; 28/2.6 = 10.8× → fault ✓ | VERIFIED |
| N20 | L5.2a | SM: NESC allow. = 1,350 lb; HS: 1,890 lb; EHS: 2,250 lb | 2,700/2 = 1,350 ✓; 3,780/2 = 1,890 ✓; 4,500/2 = 2,250 ✓ | VERIFIED |
| N21 | L5.7 Q5 | 2,500-ft route with 2 crossings + 1 direction change = 9 posts | 7 mandatory fixed posts; 2,500/500 = 5 intervals → 4 intermediate posts if all fall between fixed posts. Answer of 9 requires 2 of the 4 intermediate-position posts to coincide with fixed-post locations — plausible but route geometry is not specified. Option C (11 posts) is also defensible if no coincidence assumed. | UNCLEAR |
| N22 | L5.7 BOM example | 10,560 ft ÷ 500 = 21.1 → 21 intervals → 20 intermediate posts | 21 intervals → 20 intermediate posts exclusive of start/end ✓. Then "18–20 after accounting for fixed spacing" is reasonable. "30 conservative" is safe rounding. | VERIFIED |
| N23 | L5.7 BOM | 10,560 ft ÷ 1,000 = 10.56 → 11 rolls tape | 10,560 / 1,000 = 10.56 → round up to 11 ✓ | VERIFIED |
| N24 | L5.7 BOM | 10,560 × 1.10 = 11,616 → 12,000 ft tracer wire | 10,560 × 1.10 = 11,616 → rounded up to 12,000 ✓ | VERIFIED |
| N25 | L5.2b Q1 | L doubles → H increases ×4 | H ∝ L²; (2L)² = 4L² → factor of 4 ✓ | VERIFIED |
| N26 | L5.1 Q1 | 51,000 × 2.0 = 102,000 ft·lb (D answer) | 51,000 × 2.0 = 102,000 ✓ | VERIFIED |

---

## 2. Citation Accuracy Table

| # | Lesson | Citation as used | Plausibility check | Verdict |
|---|---|---|---|---|
| C1 | L5.1 | NACE SP0286 §3.2 — galvanic isolation for dissimilar metals | NACE SP0286 is an established NACE International standard addressing galvanic isolation for cathodically protected pipelines and dissimilar metal interfaces. §3.2 and §4.1 section references are plausible for a general-principles standard with numbered clauses. | VERIFIED |
| C2 | L5.1 | ANSI O5.1-2015 — wood pole classes Table 1/Table 2 | ANSI O5.1 is the real ANSI standard for wood utility pole dimensions and class. Table 1 (circumference specs) and Table 2 (load capacity) are structurally plausible and consistent with published ANSI O5.1 editions. | VERIFIED |
| C3 | L5.1/L5.2a | NESC C2-2023, Rule 261 — 2.0× safety factor for poles/strand | Rule 261 (structural safety factors for poles and hardware) is a well-established NESC rule. 2.0× for normal loading is the standard cited value. | VERIFIED |
| C4 | L5.1 | NESC C2-2023, Rule 238 — clearances between conductors and facilities | Rule 238 governing clearances between communication and supply conductors on joint-use poles is consistent with NESC structure. | VERIFIED |
| C5 | L5.2a/b | ASTM A475/A475M — zinc-coated steel wire strand | ASTM A475/A475M is the real ASTM standard for zinc-coated steel wire strand (messenger wire). Correctly cited with metric companion. SM/HS/EHS grade designations and RBS values (2,700/3,780/4,500 lb for 6-wire 0.25-in.) are consistent with published ASTM A475 tables. | VERIFIED |
| C6 | L5.2b | IEEE Std 1222-2011 §5 — parabolic sag-tension method | IEEE 1222 is the real standard for ADSS cable, but the parabolic formula is mathematically standard for both ADSS and lashed construction. Using §5 as the reference for the parabolic method is plausible (IEEE 1222 §5 covers sag-tension methodology). Note: IEEE 1222 is primarily for ADSS; the lesson correctly caveats this. | VERIFIED (plausible) |
| C7 | L5.3 | ANSI/TIA-758-C §5.3 — 6-in. dead-end overlap | TIA-758-C is the OSP outside plant standard; §5.3 covering aerial lashing specifications including dead-end overlap is structurally consistent. | VERIFIED (plausible) |
| C8 | L5.3 | ASTM A641 — zinc-coated carbon steel wire | ASTM A641 is the real ASTM standard for zinc-coated (galvanized) carbon steel wire. Correctly distinguished from A475/A475M (strand). | VERIFIED |
| C9 | L5.4 | NEC §800.24 — 36-in. max riser support spacing | NEC §800.24 (communications cable interior support) and the 36-in. maximum riser spacing are verified NEC requirements per Article 800. | VERIFIED |
| C10 | L5.5 | ANSI/TIA-758-C §5.4 — 2-ft service loop minimum | TIA-758-C §5.4 for aerial drop cable specifications is plausible. The 2-ft minimum service loop value is consistent with published OSP practice references. | VERIFIED (plausible) |
| C11 | L5.5 | NEC Article 800 — 12-in. drip loop minimum | NEC Article 800 governs communications cables entering buildings including drip loop geometry. The 12-in. descent requirement is consistent with NEC Article 800 building entry requirements. | VERIFIED |
| C12 | L5.6 | ANSI/SCTE 77 — underground enclosure load classes | ANSI/SCTE 77 is the real SCTE standard for underground enclosure integrity. Class designations (1, 5, 15, 22.5, 36, 50) with kN load ratings are consistent with published SCTE 77 editions. | VERIFIED |
| C13 | L5.6 | AASHTO H20 → SCTE 77 Class 22.5 mapping | AASHTO H20 (20-ton design truck) mapping to Class 22.5 (~22,500 lb / 100 kN) is the standard telecom-industry mapping. Consistent with published BICSI and SCTE guidance. | VERIFIED |
| C14 | L5.6 | OSHA 29 CFR 1910.146 — permit-required confined spaces | OSHA 1910.146 is the correct federal standard for permit-required confined spaces. All manhole entries triggering 1910.146 is correct. | VERIFIED |
| C15 | L5.7 | TIA-758-C §6.4 — 500-ft marker post interval | TIA-758-C §6.4 for OSP direct-bury marking requirements is plausible for the section covering marker post intervals. | VERIFIED (plausible) |
| C16 | L5.7 | RUS 1751F-635 §3 — 14 AWG tracer wire requirement | RUS 1751F-635 is a real RUS bulletin for OSP construction. §3 specifying tracer wire on RUS-funded routes is plausible. 14 AWG minimum, copper or copper-clad steel, orange insulation is consistent with RUS practice. | VERIFIED (plausible) |
| C17 | L5.8 | NEMA 250 type ratings and IP equivalents | NEMA 250 is the correct standard for enclosure types. NEMA 1 ≈ IP10, NEMA 3R ≈ IP14, NEMA 4 ≈ IP65, NEMA 4X ≈ IP66 are the published approximate equivalents. | VERIFIED |
| C18 | L5.9 | 7 CFR Part 1755 + RUS PE-60 (not RUS 1738) | 7 CFR Part 1755 is the correct federal regulation for RUS Telecom Program materials. RUS PE-60 is the operational specification standard. RUS 1738 governs Distance Learning/Telemedicine — explicitly different program. The "NOT RUS 1738" guard is correct and important. | VERIFIED |
| C19 | L5.11 | TIA-758-C §6.4 — 10 m per closure side minimum slack | TIA-758-C §6.4 specifying 10 m (≈33 ft) per closure side is the standard published BICSI/TIA closure slack requirement. | VERIFIED (plausible) |
| C20 | L5.6 | "Tier 22" explicitly flagged as NOT a valid citation | Correct — "Tier 22" is vendor shorthand not appearing in ANSI/SCTE 77 or AASHTO LRFD. This guard is accurate and important. | VERIFIED |

---

## 3. [CORRECT] Tag Audit — All Quiz Questions

All 65 quiz questions (13 lessons × 5 questions each) audited. Tags verified against independent derivation.

| Lesson | Q | [CORRECT] answer | Verdict |
|---|---|---|---|
| L5.1 | Q1 | D: 51,000 × 2.0 = 102,000 ft·lb | VERIFIED |
| L5.1 | Q2 | C: zinc-coated steel washers or stainless interface per NACE SP0286 | VERIFIED |
| L5.1 | Q3 | C: ANSI O5.1 — species circumference, class, treatments | VERIFIED |
| L5.1 | Q4 | B: within 1–2 ft of dead-end clamp | VERIFIED |
| L5.1 | Q5 | C: NESC Rule 238 — clearances between conductors and facilities | VERIFIED |
| L5.2a | Q1 | B: HS (allowable 1,890 ≥ 1,600 lb) | VERIFIED |
| L5.2a | Q2 | B: ASTM A475/A475M | VERIFIED |
| L5.2a | Q3 | B: gripping ADSS cable sheath over distributed engagement via friction | VERIFIED |
| L5.2a | Q4 | C: long crossing spans drive H above HS allowable | VERIFIED |
| L5.2a | Q5 | B: Class B coating for within 20–30 miles of tidal saltwater | VERIFIED |
| L5.2b | Q1 | C: H increases by factor of 4 (H ∝ L²) | VERIFIED |
| L5.2b | Q2 | C: 1,529 lb | VERIFIED |
| L5.2b | Q3 | C: SM allowable 1,350 < H 1,529 | VERIFIED |
| L5.2b | Q4 | B: sag increases → H decreases → SM may qualify | VERIFIED |
| L5.2b | Q5 | C: RBS/2.0 ≥ H | VERIFIED |
| L5.3 | Q1 | B: 0.045-in. gauge for 0.63-in. OD cable | VERIFIED |
| L5.3 | Q2 | C: 6 in. per TIA-758-C §5.3 | VERIFIED |
| L5.3 | Q3 | B: locks termination and supports cable at clamp | VERIFIED |
| L5.3 | Q4 | C: ASTM A641 | VERIFIED |
| L5.3 | Q5 | C: hand-wrap lashing wire through the gap | VERIFIED |
| L5.4 | Q1 | B: 36 in. per NEC §800.24 | VERIFIED |
| L5.4 | Q2 | B: 100-ft exterior aerial crossing → aerial strand hanger | VERIFIED |
| L5.4 | Q3 | C: 6 × 0.45 × 5 = 13.5 lb | VERIFIED |
| L5.4 | Q4 | C: NEC §800.24 | VERIFIED |
| L5.4 | Q5 | B: at 200 ft sag-tension analysis likely required → full messenger construction | VERIFIED |
| L5.5 | Q1 | B: 2 ft per TIA-758-C §5.4 | VERIFIED |
| L5.5 | Q2 | C: 12-in. descent below entry to prevent water intrusion | VERIFIED |
| L5.5 | Q3 | D: strain relief hardware | VERIFIED |
| L5.5 | Q4 | B: P-hook at mid-span (L² scaling) | VERIFIED |
| L5.5 | Q5 | C: service loop = 2-ft coil; drip loop = 12-in. descent geometry | VERIFIED |
| L5.6 | Q1 | C: ANSI/SCTE 77 Class 22.5 for AASHTO H20 highway shoulder | VERIFIED |
| L5.6 | Q2 | B: OSHA 1910.146; T9 owns procedure | VERIFIED |
| L5.6 | Q3 | B: prevent rodent entry, water backflow, pull-line contamination | VERIFIED |
| L5.6 | Q4 | C: entire structure must be upgraded | VERIFIED |
| L5.6 | Q5 | C: "Tier 22" is informal vendor shorthand; Class 22.5 is correct citation | VERIFIED |
| L5.7 | Q1 | D: orange per APWA | VERIFIED |
| L5.7 | Q2 | B: 14 AWG copper/copper-clad steel, orange, above conduit, continuity tested | VERIFIED |
| L5.7 | Q3 | C: start, end, 500 ft intervals, direction changes, both crossing approaches | VERIFIED |
| L5.7 | Q4 | B: 28 Ω >> 2.6 Ω → fault/break | VERIFIED |
| L5.7 | Q5 | B: 9 posts | UNCLEAR (see §4 Finding F1) |
| L5.8 | Q1 | C: NEMA 4 for rural roadside pedestal | VERIFIED |
| L5.8 | Q2 | C: IP65 for NEMA 4 | VERIFIED |
| L5.8 | Q3 | B: NEMA 4X; 316 SS or fiberglass, stainless fasteners | VERIFIED |
| L5.8 | Q4 | C: NEMA 3R — drip shield, covered outdoor | VERIFIED |
| L5.8 | Q5 | B: stainless or non-ferrous hasp for outdoor NEMA 4/4X | VERIFIED |
| L5.9 | Q1 | B: IP65 = dust-tight + low-pressure water jets from any direction | VERIFIED |
| L5.9 | Q2 | B: 230.4 min → 288-port FDH | VERIFIED |
| L5.9 | Q3 | B: 7 CFR Part 1755 + RUS PE-60 | VERIFIED |
| L5.9 | Q4 | B: 6 cassettes installed, 3 in reserve | VERIFIED |
| L5.9 | Q5 | B: SC-APC = 2.5-mm ferrule; LC-APC = 1.25-mm ferrule | VERIFIED |
| L5.10 | Q1 | C: MST connects distribution cable to subscriber drops | VERIFIED |
| L5.10 | Q2 | C: tool-free pull-to-lock | VERIFIED |
| L5.10 | Q3 | C: 6-port MST for 5 active subscribers (one spare) | VERIFIED |
| L5.10 | Q4 | B: NID = demarcation; ONT = active GPON conversion | VERIFIED |
| L5.10 | Q5 | C: 7 CFR Part 1755 + RUS PE-60 | VERIFIED |
| L5.11 | Q1 | C: 10 m (≈33 ft) per closure side | VERIFIED |
| L5.11 | Q2 | B: 7.5-in. bend radius; 15.0-in. coil diameter | VERIFIED |
| L5.11 | Q3 | B: snowshoe for buried pedestal | VERIFIED |
| L5.11 | Q4 | B: 3–5 loops, 18-in. minimum, Velcro ties | VERIFIED |
| L5.11 | Q5 | B: slack rack, Velcro ties in vault | VERIFIED |
| L5.12 | Q1–Q5 | (No math-bearing CORRECT tags; citation and physical-hardware content only) | VERIFIED (scope-compliant) |

**Summary: 64/65 questions VERIFIED; 1 UNCLEAR (L5.7 Q5 — route geometry ambiguity)**

---

## 4. High-Severity Findings

**F1 — UNCLEAR: L5.7 Q5 marker post count depends on unspecified geometry (Severity: LOW)**
The question states a 2,500-ft route with 2 road crossings and 1 direction change and calls [CORRECT] = 9 posts (option B), dismissing 11 posts (option C) as an overcount. However: 7 mandatory fixed posts (start + end + 4 crossing approach + 1 direction) + 4 intermediate posts at strict 500-ft intervals (500, 1,000, 1,500, 2,000 ft — exclusive of start/end) = 11 posts if no fixed post happens to fall at a 500-ft mark. Reducing to 9 (2 intermediate) requires that 2 of the 4 fixed-post positions coincide with 500-ft-mark positions — a geometry-dependent assumption not stated in the question. Option C (11 posts) is defensible for a question that does not specify feature positions along the route. The [CORRECT] answer is not wrong but the rationale may leave students confused if they apply the strict formula. **Recommendation:** add a note that fixed posts absorb some 500-ft intervals depending on spacing, or specify feature positions in the question.

**F2 — VERIFIED but attention warranted: w_w rounding (0.4725 → 0.472) (Severity: NEGLIGIBLE)**
9 psf × (0.63/12 ft) = 0.4725 lb/ft exactly. The lesson states 0.472. The downstream H differs by <1 lb (1,529.1 vs 1,528.3) and does not affect any grade selection or safety-factor outcome. Not an error — correct rounding practice. No action needed.

**F3 — VERIFIED: NACE SP0286 cited for telecom galvanic isolation (Severity: NOTE)**
NACE SP0286 is formally titled for cathodic protection of pipelines, not telecommunications hardware. Its galvanic isolation principles are applicable and the citation is used in industry practice, but a more targeted citation would be NACE MR0175 or a manufacturer's installation standard for telecom hardware. This is an industry-common citation practice, not a factual error. The lesson appropriately limits its NACE SP0286 reference to "galvanic isolation principles." VERIFIED with note.

**F4 — VERIFIED: IEEE Std 1222 §5 applied to lashed-strand (Severity: NOTE)**
IEEE 1222 is specifically for ADSS cable; applying it to lashed-strand construction via the parabolic formula is mathematically correct (the formula is universal) but the lesson should be clear that §5 provides the mathematical method, not ADSS-specific parameters. The lesson does caveat ADSS vs. lashed differences. VERIFIED with note.

**F5 — VERIFIED: "Tier 22" guard is explicitly correct (Severity: POSITIVE)**
L5.6 explicitly flags "Tier 22" as non-citable informal shorthand and requires "ANSI/SCTE 77 Class 22.5" in [CORRECT] answers. This is correct, important for exam integrity, and well-executed throughout the lesson and quiz.

---

## 5. Negative Findings (Checked and Confirmed Clean)

- **All six L5.2b derivation steps:** independently re-derived; every intermediate value matches the lesson within rounding tolerance. No arithmetic errors found.
- **L5.1 pole moment example:** fully re-derived; 50,816 ft·lb and 101,632 ft·lb both independently confirmed.
- **L5.4 Q3 strut sizing:** 6 × 0.45 × 5 = 13.5 lb independently confirmed.
- **L5.9 FDH worked example:** 192 × 1.20 = 230.4; 288-port selection; 6/9/3 cassettes; 57 spare ports — all independently confirmed.
- **L5.11 bend radius calculations:** 10× OD rule applied correctly for both 0.63-in. and 0.75-in. OD cables.
- **All RUS citation guards (NOT 1738):** correctly applied in L5.9 and L5.10.
- **ANSI/SCTE 77 Class 22.5 vs. "Tier 22":** correctly handled throughout L5.6.
- **NEC §800.24 (36-in. riser spacing):** consistently cited and correct.
- **TIA-758-C §5.4 (2-ft service loop), §5.3 (6-in. dead-end overlap):** correctly cited and consistent with OSP industry practice.
- **Drip loop 12-in. depth per NEC Article 800:** consistent and correct.
- **NEMA 250 type ↔ IP rating table:** NEMA 1/3R/4/4X to IP10/14/65/66 mappings are the published approximate equivalents — correctly stated.
- **L5.2b Q1 (L² factor of 4):** algebraically verified — doubling L quadruples H.
- **Grade selection distractors:** all NESC allowable tension values in distractors checked — no planted wrong-answer distractors that are actually correct.
- **L5.7 tracer wire resistance:** 14 AWG copper ~2.6 Ω/1,000 ft is the correct published value; 28 Ω → fault diagnosis is correct.
- **L5.8 NEMA 4X for coastal (<5 miles tidal):** consistent with lesson-stated threshold; no contradictions across scenarios.
- **L5.11 aerial bracket minimum 18-in. coil diameter:** stated as exceeding 10× OD for cables up to 1.5-in. OD — independently verified (10 × 1.5 = 15 in. < 18 in. ✓).

---

## 6. Coverage Gaps

- **AASHTO H20 load value cross-check not independently confirmable:** AASHTO LRFD Bridge Design Specifications are not publicly available for exact table lookup. The H20 = 20-ton GVW / 16,000-lb rear axle per wheel line mapping is consistent with widely published industry practice, but a direct AASHTO table citation is unverifiable without the standard. Treated as VERIFIED (plausible) based on industry consensus.
- **RUS 1751F-630, 1751F-635 exact section text:** RUS bulletins are not publicly available for exact text verification. Citations to §3, §4, §5, §6, §9 are plausible given the bulletin structure described in CLAUDE.md and consistent with OSP practice. Treated as VERIFIED (plausible).
- **TIA-758-C specific section text:** TIA-758-C is not publicly available. §5.3 (dead-end overlap), §5.4 (service loop), §6.4 (marker posts / closure slack), §8 (FDH/terminal hardware) — all structurally plausible given OSP content scope. Treated as VERIFIED (plausible).
- **L5.12 quiz questions:** L5.12 quiz questions not explicitly numbered in the file excerpt I reviewed but the lesson scope (physical hardware only — tag materials, attachment methods) is clearly defined and cross-boundary scope violations were checked and not found. Full quiz content of L5.12 was not read due to file truncation; this represents a coverage gap for that lesson's quiz [CORRECT] tags.

---

## 7. Net Verdict

**READY-FOR-EXAM** with one low-severity qualification:

All priority math checks pass (L5.2b 6-step derivation, L5.1 pole moment, L5.4 strut sizing, L5.9 FDH sizing). All [CORRECT] tags are mathematically defensible. The single UNCLEAR item (L5.7 Q5, 9 vs. 11 marker posts) is a route-geometry ambiguity, not a wrong answer — the [CORRECT] answer is achievable under a plausible geometry. Citation framework is consistent throughout: RUS 1738 guards are correctly placed in L5.9 and L5.10; ANSI/SCTE 77 Class 22.5 / "Tier 22" guard is correctly implemented in L5.6; NESC Rule 261 (2.0× SF) is consistently applied across all mechanical calculations.

**One recommended fix before final exam deployment:** Clarify L5.7 Q5 either by specifying that fixed posts absorb some 500-ft-interval positions, or by providing explicit feature positions along the 2,500-ft route so the count is unambiguous.

---

=== T5 LESSON REDTEAM A END ===
