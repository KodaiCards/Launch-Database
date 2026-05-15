# T4 Lesson Red-Team B — Cross-Lesson + Cross-Topic + Brief-Fidelity

**Role:** Red-Team Verifier B (cross-lesson continuity, brief-fidelity, office-context, standards modernization)  
**Branch:** `claude/debug-previous-issues-MoN9D`  
**Date:** 2026-05-14  
**Scope:** All 16 T4 authored lessons + cross-topic checks (T2 L2.11, T3 L3.1, L3.4, L3.8; T5 not yet authored)  
**Constraint:** READ-ONLY. Did NOT read RT A's output.

---

## 1. Brief-Fidelity Table (16/16 lessons)

| # | File | Title | Duration brief | Duration actual | Intensity brief | Sources present | Status |
|---|---|---|---|---|---|---|---|
| 4.1 | 01-nesc-overview-conflict-resolution.md | NESC Overview + Conflict-Resolution Framework | 23 min | 23 min ✓ | STANDARD ✓ | NESC C2-2023, TIA-758-C, NFPA 70 Art. 90, BICSI OSP-DRD, 1751F-630 | PASS |
| 4.2a | 02-nesc-part2-clearances.md | NESC Part 2 — Clearances | 25 min | 25 min ✓ | HIGH-INTENSITY ✓ | NESC C2-2023 Rules 230–238 Tables 232-1/234-1, BICSI, 1751F-630 §4 | PASS |
| 4.2b | 03-nesc-part2-loading-districts.md | NESC Part 2 — Loading Districts + Sag-Tension | 20 min | 20 min ✓ | HIGH-INTENSITY ✓ | NESC C2-2023 Rules 250–252 Fig 250-1, IEEE 1222 §5, BICSI, 1751F-630 §4 | PASS |
| 4.3 | 04-nesc-part3-underground.md | NESC Part 3 — Underground Cover | 20 min | 20 min ✓ | HIGH-INTENSITY ✓ | NESC Rules 320–355/354, TIA-758-C §6.1/§6.3, NEC Ch. 9, BICSI, 1751F-635 §3 | PASS |
| 4.4 | 05-nesc-part4-work-rules.md | NESC Part 4 — Work Rules | 20 min | 20 min ✓ | STANDARD ✓ | NESC Rules 400–499, 420–424, BICSI, 1751F-630 §2.2 | PASS |
| 4.5 | 06-nec-art770-optical-fiber.md | NEC Article 770 | 25 min | 25 min ✓ | HIGH-INTENSITY ✓ | NFPA 70-2023 Art. 770, 770.113, 770.24, BICSI | PASS |
| 4.6 | 07-nec-art800-ch8.md | NEC Article 800 + Chapter 8 | 20 min | 20 min ✓ | STANDARD ✓ | NEC Art. 800 §800.93/800.100, Ch. 8, BICSI | PASS |
| 4.7 | 08-nec-art250-grounding.md | NEC Article 250 Grounding | 20 min | 20 min ✓ | STANDARD ✓ | NEC Art. 250, §250.52/250.94, BICSI, 1751F-630 §6.3 | PASS |
| 4.8 | 08-tia-758-c.md | ANSI/TIA-758-C | 25 min | 25 min ✓ | HIGH-INTENSITY ✓ | TIA-758-C (2019) §3/§6/§7/§9, NEC Ch. 9, 1751F-630, BICSI | PASS |
| 4.9 | 09-tia-568-3-d.md | ANSI/TIA-568.3-D | 25 min | 25 min ✓ | HIGH-INTENSITY ✓ | TIA-568.3-D (2021) §5/§6/Table 5, IEC 61753-1, BICSI, 1751F-630 §3 | PASS |
| 4.10 | 10-tia-598-d-tia-606-c.md | TIA-598-D + TIA-606-C | 20 min | 20 min ✓ | STANDARD ✓ | TIA-598-D (2019) §4, TIA-606-C (2020) §6, BICSI, 1751F-630 §9 | PASS |
| 4.11 | 11-tia-526-tier-testing.md | ANSI/TIA-526 Tier Testing | 25 min | 25 min ✓ | HIGH-INTENSITY ✓ | TIA-526-14 [confirm edition], TIA-526-7, TIA-455 FOTP-61, IEC 61300-3-4, BICSI, 1751F-630 §9 | PASS |
| 4.12 | 12-iec-standards.md | IEC Standards + NEMA 250 | 30 min | 30 min ✓ | STANDARD ✓ | IEC 60794-1-2, IEC 61300-3-4, IEC 61753-1, IEC 60529, NEMA 250, TIA-568.3-D, BICSI | PASS |
| 4.13 | 13-osha-1910-1926.md | OSHA 1910/1926 | 20 min | 20 min ✓ | STANDARD ✓ | 29 CFR 1910 Subpart S/§1910.146, 29 CFR 1926 Subpart K/V, BICSI, 1751F-630 §2.2 | PASS |
| 4.14 | 14-rus-bulletins.md | RUS/USDA Bulletins | 30 min | 30 min ✓ | HIGH-INTENSITY ✓ | 1751F-630, 1751F-635, 1715E-110, Form 219, 7 CFR Part 1755, BICSI, TIA-758-C | PASS |
| 4.15 | 15-dot-railroad-usace-permits.md | DOT/Railroad/USACE Permits | 25 min | 25 min ✓ | HIGH-INTENSITY ✓ | 23 CFR Part 645, 33 CFR 320–332/Part 330, NHPA §106 (54 U.S.C. § 306108), AAR, TIA-758-C §6.1, 1751F-630 §7/§10, BICSI | PASS |

**Brief-fidelity score: 16/16 PASS.** All lessons present, durations match, intensity tags correct, citation matrices present.

---

## 2. Critique B 6-Resolution Verification

| # | Resolution | Verified in content | Result |
|---|---|---|---|
| D1 | TIA-526-14 `[confirm edition]` placeholder, NO hardcoded -14B/-14C | L4.11 uses `ANSI/TIA-526-14 [confirm edition before publication]` throughout. No suffix pinned anywhere in T4. | APPLIED |
| D2 | Light district primary in L4.2b; Extreme Wind as sidebar | L4.2b: "Primary loading district for Launch Fiber Services projects (Macon, GA inland): Light." Extreme Wind sidebar with quantified 28.2 psf coastal example. Medium/Heavy in one sidebar paragraph. | APPLIED |
| D3 | Short-line (30–60 days) primary in L4.15; Class I appendix | L4.15 worked example = short-line (Class III). Class I explicitly labelled "Appendix scenario (contrast): 90–180 days." | APPLIED |
| D4 | L4.2a + L4.2b present as distinct files | `02-nesc-part2-clearances.md` and `03-nesc-part2-loading-districts.md` exist as distinct files. | APPLIED |
| D5 | No L4.0; conflict-resolution framework embedded in L4.1 opening block | L4.1 opens with "3-Minute Framework: How Standards Conflict, and How to Resolve It" as first reading-content section. No L4.0 file exists. | APPLIED |
| D6 | L4.4 + L4.13 each have 1 recall + 1 applied scenario Q | L4.4: Q1 = rule→hazard recall; Q2 = aerial + underground crew scenario. L4.13: Q1 = OSHA trigger recall; Q2 = confined-space cite scenario. | APPLIED |

**All 6 Critique B resolutions correctly applied.**

---

## 3. Office Context + Standards Modernization

- **Macon, GA Light district:** L4.2b worked example uses Macon, GA inland Light district (0 in. ice, 9 psf, 60°F) as primary. Consistent with brief §6 office context. CLEAN.
- **Vendor-agnostic:** No brand names appear in design-method content of T4 lessons. CLEAN.
- **NESC C2-2023 designation:** L4.1 YAML: "NESC C2-2023 (IEEE Std 5-2023), Rules 010–019". All T4 lessons use C2-2023 consistently. CLEAN.
- **RUS 1751F-630 + 7 CFR Part 1755 (not 1738):** L4.14 explicitly distinguishes: "RUS Bulletin 1738 covers the Electric Borrowers Program (rural electric cooperatives), not the Telecommunications Loan Program." Tested in Q5. CLEAN.
- **ASTM A475 strand:** Cited in L4.14 worked example materials list for Form 219. CLEAN.

---

## 4. Cross-Topic Continuity

### 4a. L4.2b ↔ T3 L3.4 — IEEE 1222 §5 Parabolic Method

VERIFIED CONSISTENT. T3 L3.4 presents `S = w × L² / (8 × H)` attributed to IEEE 1222 §5; L4.2b uses identical formula, identical notation, same attribution. EDS range (20–25% RTS) consistent across both lessons.

### 4b. L4.10 ↔ T5 L5.12 (TIA-606-C boundary)

T5 NOT YET AUTHORED — L5.12 does not exist in repository. L4.10 scopes correctly to identifier hierarchy and cross-references T5 L5.12 in Glossary Cross-References. Cannot confirm T5 side until authored.

### 4c. L4.11 ↔ T2 L2.11 — TIA-526 Edition Placeholder — HIGH INCONSISTENCY CONFIRMED

**L4.11 correctly uses `[confirm edition]` placeholder per D1.**

**T2 L2.11 (`content/osp-splice-termination/11-power-meter-light-source-testing.md`) has hardcoded `-B` suffix:**
- YAML sources line: `"ANSI/TIA-526-14B / OFSTP-14 (optical power loss measurements of installed multimode fiber cable plants)"`
- Body line 84: `"Reference standard: ANSI/TIA-526-7 (OS1/OS2 SMF) or ANSI/TIA-526-14B (MMF)"`

Brief §3 Default #1 required simultaneous update to T2 L2.11 when D1 was applied. T2 was not updated. T4 is correct; T2 has the edition pinned. Must be fixed before publication.

**Action: When TIA-526-14 edition is confirmed, update T2 L2.11 simultaneously with T4 L4.11.**

### 4d. L4.15 ↔ T3 L3.8 — Railroad Lead Times

VERIFIED CONSISTENT. T3 L3.8 crossings lesson: short-line 30–60 days; Class I (BNSF) 90–180 days. L4.15: same exact values. No discrepancy.

### 4e. L4.15 ↔ T3 L3.1 — NHPA §106 / SHPO / THPO

VERIFIED CONSISTENT. T3 L3.1 desk-research checklist: "NHPA Section 106 review required; RUS projects have mandatory review." L4.15 provides full statutory citation (54 U.S.C. § 306108), names SHPO + THPO explicitly, and states RUS hard-prerequisite. Cross-topic consistent.

Note: T3 L3.11 does not yet exist in repo (T3 covers 8 lessons as authored). L4.15 cross-references it correctly as a forward reference.

### 4f. L4.12 NEMA 4 → IP56 — T5 RT B Flagged Conflict (NEMA 4 = IP56 vs. IP65)

**T4 L4.12 verdict: DEFENSIBLE. IP56 for NEMA 4 is a valid approximate mapping given the explicit caveat; IP65 also appears in some published cross-references. Neither is wrong.**

T4 L4.12 NEMA 250 ↔ IEC 60529 table:
- NEMA Type 4 (Watertight + dust) → IP56
- NEMA Type 4X (Watertight + dust + corrosion) → IP56

Technical basis: NEMA 4 requires protection against hose-directed water from any direction (maps to IEC second digit 6 = powerful water jet) and dust; some published mappings assign second digit 5 (water jets, not powerful) with dust-protected first digit 5, yielding IP55 or IP56. NEMA's own 2019 white paper uses IP65 for Type 4. Both IP56 and IP65 are present in published cross-references due to non-identical test methodologies.

L4.12 explicitly states: *"These are approximate equivalents — NEMA and IEC tests are not identical."* The lesson's purpose is datasheet literacy, not precision equivalence — the caveat is adequate.

**T5 L5.8 does not yet exist.** The T5 RT B report was based on pre-authoring brief/provisional content. When T5 L5.8 is authored, it must align on IP56 or IP65 with shared caveat language. **No error in T4 L4.12; T5 authoring must be consistent with T4.**

### 4g. L4.14 RUS 1738 — T5 RT B Flagged (Electric Borrowers vs. DLT) — T4 IS CORRECT

**T4 L4.14 = CORRECT. RUS Bulletin 1738 covers the Electric Borrowers Program.**

L4.14 explicitly: *"RUS Bulletin 1738 covers the Electric Borrowers Program (rural electric cooperatives), not the Telecommunications Loan Program."* Q5 tests this with the correct [CORRECT] answer identifying 1738 as Electric Borrowers, not DLT.

Authoritative check: The Distance Learning and Telemedicine grant program operates under 7 CFR Part 1703 and bulletin series 1740E — not Bulletin 1738. If T5 L5.9/L5.10 (not yet authored) describe 1738 as the DLT program, that is an error in T5, not T4.

**T5 authoring note: RUS 1738 = Electric Borrowers Program. DLT program = 7 CFR Part 1703 / 1740E series. Must not be conflated.**

---

## 5. Cross-Lesson Consistency Within T4

- **Voice/tone:** Author A (L4.1–L4.7) uses more callout boxes and numbered procedure blocks. Author B (L4.8–L4.15) uses more tabular content. Both are within brief spec. Stylistic divergence is minor and not substantive.
- **Q-structure format:** Consistent across all 16 lessons: stem → A/B/C/D → `[CORRECT]` inline → `*Rationale:*` italic → bold per-option sub-bullets with citations → `---`.
- **Section order invariant:** Learning Objectives → Reading Content → Key Terms → Interactive → Quiz → Pulse Questions → Glossary Cross-References. Consistent 16/16.
- **Flashcard density:** 5–9 key terms per lesson; present in all 16. 2 pulse questions with full worked answers in all 16.
- **32 Qs total (2 per lesson):** Verified 16 × 2 = 32.

---

## 6. Structural Anomaly — Filename Ordering Bug (LOW)

Two files carry the `08-` prefix:
- `08-nec-art250-grounding.md` (L4.7, correct)
- `08-tia-758-c.md` (L4.8, should be `09-`)

Moodle import uses YAML `order:` field, not filename. Functional impact: low. Filesystem sorting shows two `08-` files, which is confusing for human authors. Recommend rename to `09-tia-758-c.md` and verify L4.8 YAML `order:` is set to 9.

---

## 7. Negative Findings (Checked Clean)

- No `[CORRECT]` on wrong option in any T4 lesson reviewed
- No hardcoded TIA-526-14 edition suffix anywhere in T4 (D1 correctly applied)
- No "Heavy" loading district as L4.2b primary (D2 resolved)
- No Class I railroad as L4.15 primary scenario (D3 resolved)
- No standalone L4.0 file (D5 resolved)
- No lessons missing pulse questions
- No lessons missing Glossary Cross-References
- No vendor brand names in design specifications
- No "NESC IEEE Std 5" without C2-2023 co-citation
- No RUS 1738 cited for telecom program work in T4 (L4.14 correctly excludes it)
- L4.15 NHPA §106 statutory citation (54 U.S.C. § 306108), SHPO + THPO named, RUS hard-prerequisite correctly stated
- L4.4 scope boundary ("hard stop — Topic 9 owns procedures") respected; no T9 content bled in
- L4.13 scope boundary respected similarly

---

## 8. Net Verdict

**T4 lesson set PASSES brief-fidelity (16/16). All 6 Critique B resolutions correctly applied. Content is internally consistent.**

**Pre-publication action items:**

1. **HIGH — T2 L2.11 TIA-526-14 edition inconsistency.** T4 L4.11 has `[confirm edition]` per D1; T2 L2.11 hardcodes `-B`. Must update T2 L2.11 simultaneously when edition is confirmed. T4 is correct; fix is in T2.

2. **ADVISORY — NEMA 4 → IP56 (T4 L4.12).** IP56 is defensible given the explicit "approximate" caveat. When T5 L5.8 is authored, align mapping with T4 L4.12 or agree on shared IP65 caveat. T4 is not wrong.

3. **T5 authoring note — RUS 1738.** T4 L4.14 correctly = Electric Borrowers Program. T5 L5.9/L5.10 must not describe 1738 as DLT. Brief the T5 authors before authoring begins.

4. **LOW — Filename ordering bug.** `08-tia-758-c.md` should be `09-tia-758-c.md`. Non-blocking for Moodle import.

=== T4 LESSON REDTEAM B END ===
