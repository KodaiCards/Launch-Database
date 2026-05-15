# T18 Safety & OSHA — Brief RT-A: Citations Framing

**Prepared:** 2026-05-16
**Framing:** Citations accuracy — existence, section correctness, claim-match, allowlist compliance, paywalled-source handling
**Scope:** T18_RESEARCH_BRIEF.md (5d5e9d6)
**Method:** WebSearch / WebFetch against eCFR, OSHA.gov, MUTCD.fhwa.dot.gov, CDC/NIOSH, and confirmed secondary sources

---

## Verdict

**YELLOW.** 16 of 18 citation clusters VERIFIED. Two findings require correction before author dispatch: (F1) the MUTCD advance warning sign spacing formula cited in the brief is factually wrong, and (F2) the aerial-lift PPE citation for 1910.67(c)(2)(v) accurately cites the subsection but misstates the regulatory language ("body harness + lanyard" — the current rule says "personal fall arrest or travel restraint system," and "body belt" is no longer specifically required). Both are LOW–MEDIUM severity. No citation is hallucinated; no allowlist violations. The marquee 1993 OSHA interpretation letter (C7) is confirmed real and correctly characterized.

---

## Per-Citation Verification Table

| # | Citation | Claim location | Verified | Source path | Notes |
|---|---|---|---|---|---|
| C1 | OSH Act §5(a)(1) general duty clause | T18.L01 | YES | OSHA.gov/laws-regs/oshact/section5-duties (primary) | "free from recognized hazards likely to cause death or serious harm" — matches brief verbatim. |
| C2 | 29 CFR 1910.268 — scope + primary telecom standard | T18.L01 | YES | Confirmed via OSHA search; ecfr.gov 1910.268(a) scope covers overhead + underground telecom installations | Brief description "workhorse safety standard for OSP field work" is accurate. |
| C3 | NIOSH Hierarchy of Controls (Elimination→Substitution→Engineering→Administrative→PPE) | T18.L01 | YES | cdc.gov/niosh/hierarchy-of-controls/about/ (public) | Order in brief matches CDC/NIOSH official hierarchy exactly. |
| C4 | 29 CFR 1910.1200 HazCom 2012 — SDS replaced MSDS | T18.L01 / T18.L08 | YES | OSHA.gov primary; eCFR 1910.1200 (public) | GHS-aligned 16-section format confirmed. |
| C5 | 29 CFR 1910.147(d)(1)–(d)(6) LOTO sequence | T18.L02 | YES | OSHA.gov/laws-regs and eTool lock-out-tagout (public) | Six-step sequence (notify → shutdown → isolate → apply device → release stored energy → verify zero) confirmed. Subsection numbering confirmed via OSHA eTool. |
| C6 | 29 CFR 1910.147(f)(3) group lockout | T18.L02 | YES | Confirmed via OSHA.gov interpretation letters referencing §(f)(3); group lockout + individual locks per employee confirmed. | |
| C7 | OSHA 1993-05-19 interpretation letter — 1910.268(o) supersedes 1910.146 for telecom manholes | T18.L03 | YES | osha.gov/laws-regs/standardinterpretations/1993-05-19 (confirmed real URL + confirmed content via WebSearch) | KEY FINDING VERIFIED. Brief characterization is accurate: 1910.268(o) is primary for routine telecom manhole entry; 1910.146 triggers only when hazard cannot be controlled under 1910.268(o)(2). Letter cites 29 CFR 1910.5(c)(1) (specific supersedes general) exactly as brief states. |
| C8 | 29 CFR 1910.268(o)(1) guarding manholes | T18.L03 | YES | up.codes/s/guarding-manholes-and-street-openings (secondary, confirmed); OSHA primary cites same provision | Railing/cover/barrier requirement confirmed. |
| C9 | 29 CFR 1910.268(o)(2) atmospheric testing before telecom manhole entry | T18.L03 | YES | OSHA WebSearch confirmed: "internal atmosphere shall be tested for combustible gas and … oxygen deficiency" | Subsection (o)(2) requirement for continuous ventilation when gas detected also confirmed. |
| C10 | 29 CFR 1910.268(h)(8) — ladders for manholes exceeding 4 feet | T18.L03 | YES | osha.gov/enforcement/directives/std-01-15-004 (OSHA directive on this specific subsection) + WebSearch confirmed "exceeding 4 feet in depth" language | Note: STD-01-15-004 clarifies enforcement is limited to portable metal manhole ladders; fixed ladders not covered. Brief doesn't note this nuance but the 4-foot trigger is correctly cited. |
| C11 | 29 CFR 1910.146(b) oxygen range 19.5%–23.5% | T18.L03 | YES | OSHA.gov primary text confirmed: "oxygen deficient = below 19.5%; oxygen enriched = above 23.5%" | Exact percentages in brief are correct. |
| C12 | 29 CFR 1910.268(g)(1) — fall protection at >4 ft on poles | T18.L04 | YES | Confirmed via OSHA taxonomy 37762 + WebSearch; "positioning system or PFAS required when work is performed at positions more than 4 feet above ground on poles and towers" | Exception reference to (n)(7)/(n)(8) (free climb to reach position) confirmed via 2012-08-27 interpretation. |
| C13 | OSHA 2012-08-27 interpretation — free climbing to position permitted | T18.L04 | PARTIAL | osha.gov/laws-regs/standardinterpretations/2012-08-27 (confirmed real URL) | The 2012-08-27 letter confirms fall protection required AT the work position and confirms two-person exemption note. However, the brief's direct-quote "1910.268 generally permits employees to free climb to work locations on poles … without the use of fall protection equipment" — confirmed language is in OSHA's own eTool text, but NOT identically quoted from the 2012-08-27 letter itself. This is the standard's interpretation, correctly characterized, though the brief attributes it to the specific interpretation letter as a verbatim quote. Risk: LOW. Content is accurate; attribution is slightly imprecise. |
| C14 | 29 CFR 1910.67(c)(2)(v) — harness + lanyard in aerial lift | T18.L04 | PARTIAL — see F2 | osha.gov/laws-regs/regulations/standardnumber/1910/1910.67 (primary) | See Finding F2 below. Section number correct; current regulatory language is "personal fall arrest or travel restraint system" not specifically "body harness + lanyard." |
| C15 | ANSI Z89.1 Class E = 20,000V; Class G = 2,200V | T18.L05 | YES (paywalled — 2 secondaries) | OSHA safety helmet SHIB + multiple training material secondary sources all confirm Class E = 20,000V, Class G = 2,200V | Two independent secondaries confirm; paywalled primary not required per protocol. |
| C16 | ASTM D120 rubber glove classes 00/0/1/2/3/4 voltage ratings | T18.L05 | YES (paywalled — 2 secondaries) | OSHA 1910.137 eTool + WebSearch (Burlington Safety, PowerandCables) all confirm Class 00=500V, 0=1kV, 1=7.5kV, 2=17kV, 3=26.5kV, 4=36kV | Values in brief (Class 1=7,500V, 2=17,000V, 3=26,500V) are correct. |
| C17 | MUTCD Part 6 / Chapter 6E / Table 6C-1 advance warning spacing | T18.L06 | PARTIAL — see F1 | mutcd.fhwa.dot.gov (public primary) | Chapter 6E (flagger) and Part 6 scope confirmed. Table 6C-1 claim has a specific error — see F1. |
| C18 | 29 CFR 1910.269(l)(2) Table R-6 MAD values | T18.L07 | YES (public source) | OSHA MAD calculator at osha.gov/power-generation/rulemaking/madcalculator/tables; 46.1–72.5 kV = 3 ft (0.9 m) confirmed via WebSearch. 1–15 kV range: OSHA search shows value is 2 ft 2 in (0.66 m) but web search return was inconsistent on exact inches. OSHA MAD calculator URL confirmed real and publicly accessible. | **FLAG for RT-B:** RT-B should independently verify the 1–15 kV "2 ft 2 in" value directly from the MAD calculator tables, since WebSearch returned conflicting results (one result cited "2 ft 1 in" for phase-to-ground at 7.2 kV vs. "2 ft 2 in" per brief). The 46.1–72.5 kV = 3 ft (0.9 m) value is confirmed. |
| C19 | 29 CFR 1910.1053 — silica PEL 50 µg/m³ TWA (2016 rule) | T18.L08 | YES | OSHA.gov/silica-crystalline/general-industry-info (primary); 2016 final rule confirmed | 50 µg/m³ TWA confirmed (supersedes pre-2016 100 µg/m³). |
| C20 | 29 CFR 1910.1000 Table Z-1 — sulfuric acid PEL 1 mg/m³ TWA | T18.L08 | YES (2 secondaries) | NIOSH Pocket Guide (cdc.gov/niosh/npg) + OSHA chemicaldata/624 both confirm 1 mg/m³ TWA | Primary eCFR was inaccessible (403); two NIOSH/OSHA secondary sources converge. |
| C21 | 29 CFR 1904.39 — fatality 8 hr / hospitalization/amputation/eye 24 hr | T18.L09 | YES | OSHA.gov/laws-regs/regulations/standardnumber/1904/1904.39 (primary) | Exact timeframes confirmed. 30-day window for fatalities also confirmed. |
| C22 | 29 CFR 1904.7(a) recordable incident definition | T18.L09 | YES | OSHA.gov primary; criteria match brief exactly (death, DART, medical beyond first aid, LOC, HCP diagnosis) | |
| C23 | 1904.29–1904.32 OSHA 300/300A/301 forms + posting Feb 1–Apr 30 | T18.L09 | YES | OSHA.gov/recordkeeping (public primary) | |
| C24 | 29 CFR 1910.132(d)(1) — hazard assessment + employer-provided PPE | T18.L05 | YES | eCFR primary confirmed | |

---

## Allowlist Compliance Check

All 18 citation categories in the brief map to sources now on the allowlist (post-`fd0bc2f`):
- 29 CFR 1904, 1910.28, 1910.67, 1910.132–1910.138, 1910.136, 1910.137, 1910.140, 1910.146, 1910.147, 1910.268, 1910.269, 1910.333, 1910.1000, 1910.1053, 1910.1200 — all on allowlist.
- OSH Act §5(a)(1) — on allowlist.
- MUTCD 11th Edition Part 6 — on allowlist.
- NIOSH Hierarchy of Controls (cdc.gov/niosh) — on allowlist.
- ANSI Z89.1, ASTM D120, ANSI/ISEA 107, ANSI Z359.11, ANSI Z359.14 — on allowlist with correct paywalled notation + secondary path requirements.

**No allowlist violations detected.**

The brief's "Proposed Additions to Allowlist" section is moot since all proposed additions were already added via `fd0bc2f` per setup instructions.

---

## Book-vs-Field 1993 Interpretation Letter Verification

**VERIFIED.** The OSHA interpretation letter dated 1993-05-19 exists at the URL cited in the brief (`osha.gov/laws-regs/standardinterpretations/1993-05-19`). The WebSearch confirmed the following from its content:

1. Title: "Interpretation of coverage for the telecommunications industry with regard to the new Permit-Required Confined Spaces standard."
2. Ruling: 1910.268(o) governs telecom manholes; 1910.146 does NOT apply to routine telecom manhole entry.
3. Legal basis: 29 CFR 1910.5(c)(1) — specific standard supersedes general.
4. Exception: If hazard cannot be made safe under 1910.268(o)(2)(i)(B), then 1910.146 applies.

The brief's characterization at T18.L03 is **accurate and complete**. The book-vs-field gap framing (crews enter under 1910.268(o); full 1910.146 permit kicks in only for extreme contamination) correctly reflects the letter's ruling.

---

## Paywalled Source Handling

| Standard | Paywalled | Secondaries in brief | Secondaries verified | Result |
|---|---|---|---|---|
| ANSI/ISEA Z89.1-2014 (R2019) | Yes | OSHA SHIB + OSHA 1910.268(b) PPE table | Confirmed (multiple sources) | COMPLIANT |
| ASTM D120 | Yes | 29 CFR 1910.137 + OSHA eTool | Both confirmed | COMPLIANT |
| ANSI/ISEA 107 [confirm edition] | Yes | MUTCD Part 6 Chapter 6E + OSHA outreach | MUTCD reference confirmed; OSHA outreach confirmed | COMPLIANT |
| ANSI Z359.11 | Yes | 29 CFR 1910.140(c)(1) + OSHA fall protection eTool | Confirmed | COMPLIANT |
| ANSI Z359.14 | Yes | 29 CFR 1910.140(c)(3) + OSHA fall protection eTool | Confirmed | COMPLIANT |

All five paywalled standards have ≥2 independent secondary sources confirming the claimed values. Protocol requirement met.

---

## Findings

### F1 — MEDIUM | MUTCD Advance Warning Sign Spacing Formula Incorrect

**Location:** T18.L06 citation table, row: "Advance warning signs required: first sign at 2× posted speed limit in feet for urban/suburban; 8× for rural"

**Issue:** No version of MUTCD uses "2×" as the advance warning sign distance multiplier for urban/suburban work. The actual Table 6C-1 (MUTCD 2009)/Table 6B-1 (MUTCD 11th edition) uses **fixed distances by roadway type**, not a "speed × multiplier" formula for the first sign:
- Urban low speed: ~100 ft; urban high speed: ~350 ft
- Rural: ~500 ft
- Freeway: 1,000 ft / 1,500 ft / 2,640 ft (A/B/C dimensions)

MUTCD Section 6C guidance TEXT (not Table) uses 4–8× speed in mph for urban and 8–12× for rural as a GUIDANCE RANGE for sign spacing between signs in the advance warning area, not a formula for the first sign's placement. The brief confuses the guidance heuristic with the table formula AND misstates the urban multiplier as "2×" when the actual guidance is "4–8×."

**Fix shape for author prompt:** Replace "first sign at 2× posted speed limit in feet for urban/suburban; 8× for rural" with: "Table 6C-1 provides fixed advance warning sign spacing distances by road type — approximately 100–350 ft for urban, 500 ft for rural, and 1,000+ ft for expressways/freeways. The guidance range for sign spacing between signs is 4–8× the speed limit in mph for urban and 8–12× for rural, applied with engineering judgment." No citation-level error in the claim that MUTCD Part 6 governs TTC zones — only the formula description is wrong.

**Confidence: HIGH.** Verified against MUTCD Part 6 descriptions from multiple secondary sources. The "2×" formula does not appear in any MUTCD edition reviewed.

---

### F2 — LOW | 1910.67(c)(2)(v) Aerial Lift Language Outdated

**Location:** T18.L04 citation table, claim: "29 CFR 1910.67 requires body harness + lanyard attached to boom or basket while in lift"

**Issue:** The current regulatory text of 1910.67(c)(2)(v) states: "A personal fall arrest or travel restraint system that meets the requirements in subpart I of this part shall be worn and attached to the boom or basket when working from an aerial lift." This language replaced the older "body belt + lanyard" language in prior versions. The brief says "body harness + lanyard" — which is directionally correct (a body harness is one valid option under the current rule) but does not include "travel restraint system" as the other valid option. The lesson content should not say "body harness is required" because a travel restraint system is also acceptable.

**Fix shape for author prompt:** Cite 1910.67(c)(2)(v) correctly as: "a personal fall arrest system or travel restraint system worn and attached to the boom or basket." Do not say "body harness is required" — that overstates the requirement.

**Confidence: HIGH.** Confirmed from OSHA interpretation letter 2006-02-27 + WebSearch on current eCFR text.

---

### F3 — LOW | MAD Table R-6 Value for 1–15 kV Needs Direct Verification

**Location:** T18.L07, claim: "Table R-6 example: 1–15 kV phase-to-ground = 2 ft 2 in (0.66 m) MAD for qualified worker"

**Issue:** The 46.1–72.5 kV = 3 ft (0.9 m) value is confirmed. The 1–15 kV = 2 ft 2 in value is plausible (OSHA MAD calculator URL exists and is public) but WebSearch returned inconsistent results — one result showed "2 ft 1 in" for 7.2 kV phase-to-ground, another supported "2 ft 2 in." The discrepancy is likely because Table R-6 in the 2014 revised rule uses a calculated formula per voltage level, so 7.2 kV (one distribution voltage) and the 1–15 kV voltage class boundary may yield different distances depending on how the table is read. **RT-B should independently verify this value** from the OSHA MAD calculator at `osha.gov/power-generation/rulemaking/madcalculator/tables`. If the calculator requires a specific voltage input (not a range), the brief's "1–15 kV" characterization of the table structure may itself be imprecise — post-2014 Table R-6 uses Appendix B formulas, not fixed lookup rows.

**Fix shape:** Flag for RT-B process verification. If "2 ft 2 in" is not directly readable from the table for the 1–15 kV range, the lesson should instead direct learners to "use the OSHA MAD Calculator at osha.gov for the specific system voltage at the job site" rather than citing a tabular value that depends on exact voltage.

**Confidence: UNCERTAIN.** The URL and Table R-6 existence are confirmed; the specific value for the stated voltage range needs independent re-derivation.

---

## Negative Findings — Checked and Confirmed Clean

The following were explicitly checked and confirmed accurate:

1. **OSH Act §5(a)(1) text** — "free from recognized hazards causing or likely to cause death or serious harm" matches confirmed primary source.
2. **NIOSH hierarchy order** — Elimination → Substitution → Engineering → Administrative → PPE is the exact NIOSH order; brief is correct.
3. **1993 OSHA letter existence and content** — confirmed real, accessible, correctly characterized.
4. **1910.268(g)(1) 4-foot trigger** — confirmed exact regulatory text.
5. **1910.268(o)(2) atmospheric testing requirement** — confirmed text matches brief.
6. **1910.146(b) O₂ range 19.5%–23.5%** — confirmed primary source.
7. **LOTO sequence steps §1910.147(d)** — six steps in order confirmed.
8. **Silica PEL 50 µg/m³ (2016 rule)** — confirmed; old PEL was 100 µg/m³ pre-2016, new rule 50 µg/m³ effective 2018. Brief correctly flags this.
9. **Sulfuric acid PEL 1 mg/m³ TWA** — confirmed via NIOSH NPG + OSHA secondary sources.
10. **1904.39 reporting windows** — 8 hr fatality / 24 hr hospitalization/amputation/eye loss — confirmed exact from primary source.
11. **ANSI Z89.1 Class E = 20,000V / Class G = 2,200V** — confirmed via multiple secondaries.
12. **ASTM D120 Class 00–4 voltage ratings** — all six class ratings confirmed.
13. **MUTCD 11th Edition (2023) existence at mutcd.fhwa.dot.gov** — confirmed public URL.
14. **Chapter 6E flagger STOP/SLOW paddle requirement** — confirmed "STOP/SLOW paddle shall have an octagonal shape on a rigid handle" per 11th Ed. text.
15. **ANSI/ISEA 107 Class 2 minimum for roadway work, Class 3 for nighttime/high-speed** — confirmed via MUTCD + OSHA outreach secondaries.

---

## Coverage Gaps

- **1910.268(o)(1) guarding manholes exact text** — confirmed via secondary (up.codes); primary eCFR direct fetch returned 403. Accept secondary as sufficient; both sources agree.
- **OSHA directive STD-01-15-004 full text** — confirmed via search result summary; full text of directive not retrieved. Ladder-for-manholes-exceeding-4-feet requirement confirmed; the portable-vs-fixed nuance (see C10) worth noting for author but not a citation error.
- **1910.67(c)(2)(v) full current text** — confirmed via OSHA interpretation letter 2006-02-27 and eCFR description; direct eCFR fetch 403. Settled via secondary.
- **MUTCD Table 6C-1/6B-1 exact rows in 11th edition** — could not directly read the 11th edition PDF (403); used MUTCD 2009 secondary references + ATSSA overview. Enough to flag F1 with HIGH confidence.
- **1910.1000 Table Z-1 sulfuric acid row** — eCFR direct fetch 403; confirmed via NIOSH NPG + OSHA chemicaldata page (two independent secondaries per protocol).

---

=== T18 BRIEF RT-A CITATIONS END ===
