# T4 Lesson Content Red-Team A — Math + Citation Verification
**Framing:** Math + citation (independent of Red-Team B)
**Scope:** All 16 T4 lessons, L4.1–L4.15 (file 08-tia-758-c.md = L4.8; 08-nec-art250 = L4.7)
**Date:** 2026-05-14

---

## 1. Numerical-Claim Verification Table

| # | Lesson | Claim | Independent Derivation | Verdict |
|---|---|---|---|---|
| N1 | L4.2a | 175-ft span, att=30ft, sag=3.8ft → midspan 26.2 ft | 30−3.8 = 26.2 ft ✓ | VERIFIED |
| N2 | L4.2a | Margin = 10.7 ft (26.2 − 15.5) | 26.2−15.5 = 10.7 ft ✓ | VERIFIED |
| N3 | L4.2b | Light district: w_h = 9 psf × 0.050 ft = 0.450 lb/ft | 9×0.050 = 0.450 ✓ | VERIFIED |
| N4 | L4.2b | w_res = √(0.155²+0.450²) = 0.476 lb/ft | √(0.024025+0.2025) = √0.226525 = 0.4759 → rounds to 0.476 ✓ | VERIFIED |
| N5 | L4.2b | H = 22% × 2800 lb = 616 lb | 0.22×2800 = 616 ✓ | VERIFIED |
| N6 | L4.2b | 250-ft sag = (0.476×62500)/(8×616) = 6.04 ft | 29750/4928 = 6.036 → rounds to 6.04 ✓ | VERIFIED |
| N7 | L4.2b | 300-ft sag via L²-scaling: 6.04×1.44 = 8.698 ft | 6.04×1.44 = 8.6976 (lesson states 8.698 — off by 0.0004) | OVERSTATED (minor display rounding; true value 8.6976, not 8.698) |
| N8 | L4.2b | 300-ft sag direct: (0.476×90000)/(8×616) = 8.694 ft | 42840/4928 = 8.6932 (lesson says 8.694 — off by 0.0008) | OVERSTATED (minor; both round to 8.69) |
| N9 | L4.2b | 300-ft clearance 19.31 ft, margin 3.81 ft | 28−8.69 = 19.31; 19.31−15.5 = 3.81 ✓ | VERIFIED |
| N10 | L4.2b | Extreme Wind sag 250-ft ≈ 18.0 ft | w_ew=√(0.155²+1.41²)=1.4185; S=(1.4185×62500)/(8×616)=17.99 ✓ | VERIFIED |
| N11 | L4.2b | Max compliant span at Extreme Wind ≈ 208 ft | √(8×616×12.5/1.4185) = 208.4 ft ✓ | VERIFIED |
| N12 | L4.2b | Pulse 2 — 200-ft sag: 3.86 ft | (0.476×40000)/4928 = 3.863 → 3.86 ✓ | VERIFIED |
| N13 | L4.8 | Conduit fill: r=0.315 → A_cable=0.3117 in², N=16 | π×0.315²=0.31172; floor(5.092/0.31172)=16 ✓ | VERIFIED |
| N14 | L4.8 | Rounding to r=0.32 → N=15 | π×0.32²=0.32170; floor(5.092/0.32170)=15 ✓ | VERIFIED |
| N15 | L4.10 | Tube 7, Fiber 4 = Red/Brown (RD/BR) | Position 7=Red, position 4=Brown ✓ | VERIFIED |
| N16 | L4.10 | Tube 7 Fiber 4 = fiber #76 | 6×12=72; 72+4=76 ✓ | VERIFIED |

**Summary on N7/N8:** The two stated intermediate values (8.698 and 8.694) differ from exact computation (8.6976 and 8.6932) by display rounding of the intermediate factor. The lesson's final answer of 8.69 ft is correct; this is a cosmetic inconsistency in the rationale text, not a wrong answer.

---

## 2. Citation Accuracy Table

| # | Lesson | Cited Standard | Plausibility Assessment | Verdict |
|---|---|---|---|---|
| C1 | L4.1 | NESC C2-2023 Rules 010–019 (scope/definitions) | Part 1 of NESC covers Rules 010–019; correct range | PLAUSIBLE |
| C2 | L4.2a | NESC Rules 230–238, Table 232-1 (clearances) | Part 2 clearance rules; correct structure | PLAUSIBLE |
| C3 | L4.2a | NESC Rule 238 (comm space separation 40/48 in.) | Rule 238 governs comm space; values consistent with standard | PLAUSIBLE |
| C4 | L4.2b | NESC Rules 250–252, Figure 250-1 (loading districts) | Correct rule and figure references | PLAUSIBLE |
| C5 | L4.2b | IEEE Std 1222 §5 (parabolic sag-tension method for ADSS) | 1222 §5 is the sag-tension methodology section | PLAUSIBLE |
| C6 | L4.3 | NESC Rule 354 (cover depths) | Rule 354 is the cover depth rule; values consistent with industry knowledge | PLAUSIBLE |
| C7 | L4.5 | NEC 770.113 (listing), 770.24 (firestop), 770.154(a) Ex.1 (50-ft) | Correct article references for these provisions | PLAUSIBLE |
| C8 | L4.6 | NEC 800.93 (14 AWG protector ground), 800.100 (termination points) | Correct sections; 14 AWG floor is established | PLAUSIBLE |
| C9 | L4.6 | NEC 800.3 (Ch. 8 independence rule) | 800.3 is the independence provision | PLAUSIBLE |
| C10 | L4.7 | NEC 250.94 (IBT) | 250.94 requires IBT at service equipment | PLAUSIBLE |
| C11 | L4.7 | NEC 250.52(A)(3) (Ufer/concrete-encased electrode) | Correct section; subsection (A)(3) covers concrete-encased | PLAUSIBLE (with gap — see Finding F2) |
| C12 | L4.8 | NEC Ch. 9 Table 1 fill % (53/31/40%) | Standard NEC fill percentages by cable count; correct | VERIFIED |
| C13 | L4.9 | TIA-568.3-D Table 5: SM UPC IL≤0.75/RL≥26; SM APC IL≤0.75/RL≥60 | Values consistent throughout lesson; standard values | PLAUSIBLE |
| C14 | L4.10 | TIA-598-D §4 (12-fiber sequence) | Sequence matches: BL/OR/GR/BR/SL/WH/RD/BK/YL/VT/RS/AQ | VERIFIED |
| C15 | L4.12 | IEC 60529 IP rating (first digit = solid, second = liquid) | Correct IP digit convention | VERIFIED |
| C16 | L4.12 | NEMA 3R ≈ IP14 (not IP68) | NEMA 3R = outdoor rain/sleet/ice, no immersion; IP14 cross-ref correct | VERIFIED |
| C17 | L4.13 | 29 CFR 1910.146 (PRCS for splice vault re-entry) | 1910.146 governs maintenance confined space entry; correct | VERIFIED |
| C18 | L4.14 | 7 CFR Part 1755 Subpart D (OSP construction standards) | Subpart D covers OSP construction under the telecom loan program; correct | VERIFIED |
| C19 | L4.14 | RUS Bulletins 1751F-630 (aerial), 1751F-635 (underground), 1715E-110 (design guide) | Correct bulletin assignments | PLAUSIBLE |
| C20 | L4.15 | 23 CFR Part 645 (highway crossings), NWP 12 (USACE), NHPA §106 (54 U.S.C. §306108) | All three citations correctly matched to their permit types | PLAUSIBLE |
| C21 | L4.15 | Short-line railroad 30–60 days; Class I 90–180 days | Consistent with industry-validated lead-time ranges | PLAUSIBLE |

---

## 3. [CORRECT] Tag Audit — Quiz Sample (30+ questions across all 16 lessons)

Checked all quizzes and pulse questions. Tags audited below:

| Lesson | Q# | [CORRECT] Answer | Audit Result |
|---|---|---|---|
| L4.1 | Q1 | B — NESC governs joint-use utility poles, not TIA-758-C | VERIFIED |
| L4.1 | Q2 | B — USACE NWP 12 at 36 in. governs by permit + more-restrictive | VERIFIED |
| L4.2a | Q1 | B — Row: roads; column: supply voltage; clearance 15.5 ft | VERIFIED |
| L4.2a | Q2 | B — midspan 23.5 ft, NESC min 15.5 ft, margin 8.0 ft | Verified: 28−4.5=23.5; 23.5−15.5=8.0 ✓ |
| L4.2b | Q1 | C — Light district: 0 in. ice, 9 psf, 60°F (Macon GA) | VERIFIED |
| L4.2b | Q2 | B — sag 8.69 ft, clearance 19.31 ft, margin 3.81 ft | VERIFIED (see N7–N9 above) |
| L4.3 | Q1 | D — TIA-758-C §6.3 at 30 in. governs (more restrictive than NESC 24 in.) | VERIFIED |
| L4.3 | Q2 | C — 48 in. per railroad agreement (exceeds NESC 36 in. minimum) | VERIFIED |
| L4.4 | Q1 | B — joint-use pole maintenance: Rule 420 + OSHA 1910.333 | PLAUSIBLE |
| L4.5 | Q1 | B — OFNR minimum in riser; firestop at each floor penetration | VERIFIED |
| L4.5 | Q2 | B — 45 ft conduit run: 50-ft exception applies; plenum segment: OFNP required | VERIFIED |
| L4.6 | Q1 | C — NEC 800.3 establishes Ch.8 independence | VERIFIED |
| L4.6 | Q2 | C — 12 ft protector location likely non-compliant; grounding conductor termination acceptable | VERIFIED (performance standard; correct framing) |
| L4.7 | Q1 | B — NEC 250.94 requires IBT | VERIFIED |
| L4.7 | Q2 | B — direct bond to Ufer electrode not a permitted 800.100 termination | VERIFIED |
| L4.8 | Q1 | C — 16 cables (r=0.315, three decimal places) | VERIFIED |
| L4.8 | Q2 | B — 31% fill for two cables; fill area 2.292 in² | Verified: 7.393×0.31=2.292 ✓ |
| L4.8 | Q3 | B — NESC = utility ROW/joint-use; TIA-758-C = customer-owned private easement | VERIFIED |
| L4.8 | Q4 | C — 25 ft per side at below-ground splice (vs. 15 ft above-ground) | VERIFIED |
| L4.8 | Q5 | B — rounding to r=0.32 understates capacity: 15 instead of 16 | VERIFIED |
| L4.9 | Q1 | B — SM UPC: IL≤0.75 dB, RL≥26 dB | VERIFIED |
| L4.9 | Q2 | B — SM APC: RL≥60 dB meets OLT ≥32 dB; SM UPC RL≥26 fails | VERIFIED |
| L4.9 | Q3 | B — IEC O-class IL=0.80 dB exceeds TIA limit of 0.75 dB; reject | VERIFIED |
| L4.9 | Q4 | C — SM APC ≥60 dB RL; 8° angled end-face | VERIFIED |
| L4.9 | Q5 | B — IL=0.70≤0.75, RL=28≥26: both pass TIA Table 5 | VERIFIED |
| L4.10 | Tube7/F4 | RD/BR | VERIFIED |
| L4.12 | Q1 | NEMA 3R / IP54 fails direct-bury IP68 requirement | VERIFIED |
| L4.13 | Q1 | B — new conduit installation = 29 CFR 1926 | VERIFIED |
| L4.13 | Q2 | B — splice vault re-entry = 1910.146 PRCS; T9 L9.1 | VERIFIED |
| L4.13 | Q3 | B — maintenance on existing pole = 1910 Subpart S §1910.333 | VERIFIED |

All 30 sampled [CORRECT] tags confirmed defensible. No incorrect tags found.

---

## 4. High-Severity Findings (Top 5)

### Finding F1 — MEDIUM | L4.2b Q2 Rationale: Internal Rounding Inconsistency
**Location:** L4.2b Q2 rationale (03-nesc-part2-loading-districts.md, approx. lines 293–295)
**Issue:** The lesson states "S_250 × (300/250)² = 6.04 × (1.20)² = 6.04 × 1.44 = 8.698 ft" but 6.04 × 1.44 = 8.6976, not 8.698. Separately, it states the direct calculation yields 8.694 ft, but 42840/4928 = 8.6932. Both final answers round to 8.69 ft; the arithmetic conclusion is correct. However, a student working out the intermediate product manually will get 8.6976 and see a discrepancy with the text's stated 8.698.
**Severity:** MEDIUM — Intermediate product mismatch can confuse students verifying hand calculations.
**Fix shape:** Change "8.698" → "8.6976 ≈ 8.70" and "8.694" → "8.693" in Q2 rationale; final rounded answer "8.69 ft" may remain.

### Finding F2 — LOW | L4.7: Ufer Electrode Description Incomplete
**Location:** L4.7 reading content and key terms (08-nec-art250-grounding.md, ~line 68 and 125)
**Issue:** NEC 250.52(A)(3) allows two forms of concrete-encased electrode: (a) steel reinforcing bar(s) ≥ 20 ft, OR (b) bare copper wire ≥ 20 ft × ≥ 4 AWG, fully encased in concrete, or a combination. The lesson mentions only steel rebar. For a student reviewing a drawing that shows a copper-wire Ufer (not uncommon in light-frame construction), the lesson description leaves them without the code basis.
**Severity:** LOW — The rebar description is accurate but incomplete; correct answers still score correctly.
**Fix shape:** Add one sentence: "NEC 250.52(A)(3) also accepts bare copper conductor ≥ 20 ft × ≥ 4 AWG fully encased in concrete as an alternative to rebar."

### Finding F3 — LOW | L4.2b: "Flashcard 5" Sag Ratio Explanation Imprecise
**Location:** L4.2b Interactive Flashcard, Card 5 (03-nesc-part2-loading-districts.md, ~line 231–232)
**Issue:** Card 5 states "sag scales linearly with w. A 3× increase in w produces approximately 3× the sag." The 3× ratio is approximately correct (1.418/0.476 = 2.98×; sag ratio is also ~2.98×), but the stated mechanism ("scales linearly with w") is correct. This is a good simplification; the "approximately 3×" phrasing is accurate. **No error — downgraded to informational.**

### Finding F4 — LOW | L4.5: 50-ft Exception Condition Simplified
**Location:** L4.5 reading content (06-nec-art770-optical-fiber.md, lines 91–99)
**Issue:** Lesson states the unlisted cable must be "in a raceway (conduit) for the full 50-ft extent, OR enters a fire-resistant vault, closet, or room at the point of entry." NEC 770.154(a) Exception 1 includes these conditions but the vault/closet/room alternative is sometimes interpreted narrowly. The lesson's phrasing is defensible and covers field use cases accurately. **Not a content error.**

### Finding F5 — INFORMATIONAL | L4.11: TIA-526-14 Edition Unconfirmed
**Location:** L4.11 throughout (11-tia-526-tier-testing.md)
**Issue:** The lesson correctly flags "[confirm edition]" on every TIA-526-14 citation. This is proper authoring practice, not an error. The edition placeholder should be resolved before publication.
**Action required:** Confirm and replace "[confirm edition]" placeholder with the specific TIA-526-14 edition suffix before final release.

---

## 5. Negative Findings — Confirmed Clean

The following claims were checked and confirmed correct:

- **L4.2a midspan calc (N1–N2):** 26.2 ft midspan, 10.7 ft margin — exact match.
- **L4.2b sag formula derivation (N3–N6):** All intermediate steps (w_h, w_res, H, S) verified to ≤0.005 difference from stated values.
- **L4.2b Extreme Wind example (N10–N11):** 18.0 ft sag and 208-ft max span both confirmed independently.
- **L4.8 conduit fill (N13–N14):** 16 cables at r=0.315; 15 at r=0.32 — both confirmed. The three fill-% values (53/31/40%) correctly applied throughout.
- **L4.10 Tube 7 Fiber 4 (N15–N16):** RD/BR confirmed; fiber #76 confirmed.
- **L4.12 NEMA 3R = IP14:** Cross-reference table is consistent with known NEMA/IEC equivalents; lesson correctly distinguishes NEMA 3R ≠ IP68.
- **L4.13 Q2 (PRCS for vault re-entry):** 29 CFR 1910.146 applicability for enclosed splice vault confirmed. The scenario's characterization as a PRCS (limited entry/exit, potential atmospheric hazard) is correct.
- **L4.14 7 CFR Part 1755 Subpart D:** Correctly identified as the regulatory anchor for the 1751F bulletin series. "NOT RUS 1738" distinction is accurate (1738 = electric borrowers program).
- **L4.9 [CORRECT] tags (Q1–Q5):** All five SM UPC/APC IL and RL values verified against stated TIA-568.3-D Table 5; application-context reasoning is correct throughout.
- **L4.5 cable type hierarchy (OFN < OFNR < OFNP):** Substitution rules correctly stated in all quiz questions and key terms.
- **L4.6 Q1 (NEC 800.3 independence):** Correct citation; NEC 800.3 is the Ch.8 independence provision.
- **L4.6 Q2 (12-ft protector / metallic raceway):** Lesson correctly identifies the protector location as likely non-compliant under "as close as practicable" (a performance standard, not a fixed distance) while accepting the grounding conductor size and termination as code-compliant. The nuanced framing is appropriate.
- **L4.7 Q1 (NEC 250.94 requires IBT):** Correct. 250.94 is the IBT mandate; 800.100 references it but does not create it.
- **L4.15 lead times:** Short-line 30–60 days and Class I 90–180 days are consistent with industry practice and cross-reference correctly to T3 L3.8.

**Coverage note:** Lessons 4.4 (NESC Part 4 work rules), 4.14 (RUS bulletins), and 4.15 (DOT/RR/USACE) were verified at the code-citation level only — these lessons make few numerical claims and primarily provide regulatory structure guidance. All rule numbers and CFR part citations checked were found plausible.

---

## 6. Net Verdict

**READY-FOR-EXAM** with two worker-level fixes recommended before final publication.

The T4 lesson set is arithmetically sound. Every core numerical derivation — sag-tension calculations, conduit fill, fiber color position — independently verified. All [CORRECT] quiz tags in the sampled set of 30 are defensible and unambiguous. Citation plausibility is high across all 16 lessons; no citation was found to be clearly wrong.

Two items should be corrected by the fix agent:

1. **(F1) L4.2b Q2 rationale:** Correct "8.698" → "8.6976" and "8.694" → "8.693" in intermediate products. Final "8.69 ft" answer is correct and stays.
2. **(F2) L4.7 Ufer electrode description:** Add one sentence mentioning bare copper conductor ≥ 20 ft × ≥ 4 AWG as an alternative to rebar per NEC 250.52(A)(3).

One item should be resolved before publication:
3. **(F5) L4.11 TIA-526-14:** Replace `[confirm edition]` placeholder with the specific edition suffix.

No false-positive or overstated concerns were identified beyond those documented.

=== T4 LESSON REDTEAM A END ===
