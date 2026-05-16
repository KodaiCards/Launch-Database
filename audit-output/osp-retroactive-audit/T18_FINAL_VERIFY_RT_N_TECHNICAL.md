# T18 FINAL-VERIFY-5 RT-N — Technical + Math/Physics + Primary-Source Verification

**Constraints acknowledged: I have NOT written to any lesson file, NOT created or modified any *_CANONICAL.md, NOT written to CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md. Write-path allowlist: this report file ONLY.**

**Framing:** Senior OSP engineer + field safety officer + NIOSH-certified IH + combustion chemistry / atmospheric monitoring expert. Technical/math/primary-source lens. HEAD SHA reviewed: `952d15b`.

---

## 1. Independent Technical Pass (conducted before reading RT-M report)

### Primary-Source Citation Verification

**29 CFR 1926.55 — H₂S Construction PEL (Gap-K2 item):**
L03:340 states "OSHA Construction (29 CFR 1926.55) sets an H₂S PEL of **10 ppm TWA**."
Verification: 29 CFR 1926.55 incorporates by reference the Appendix A threshold limit values from the 1970 ACGIH TLVs. H₂S under ACGIH 1970 TLV = 10 ppm. This is the correct value that 1926.55 Appendix A carries. eCFR confirms 29 CFR 1926.55(a) adopts those thresholds. **VERIFIED CORRECT.**

**29 CFR 1910.1000 Table Z-2 — H₂S General Industry limits (Gap-K2 item):**
L03:341–342 states "20 ppm ceiling with a 50 ppm 10-minute peak."
Verification: Table Z-2 lists H₂S as: 8-hr TWA = 20 ppm ceiling (C designation), 10-min maximum peak = 50 ppm. This is precisely what Table Z-2 contains — the "C" in Table Z-2 notation indicates a ceiling value, not a TWA, which is why the lesson correctly says "20 ppm ceiling" not "20 ppm TWA." **VERIFIED CORRECT. Terminology precise.**

**NIOSH IDLH = 100 ppm for H₂S:**
L03:296, 342, 353 — consistently 100 ppm. NIOSH CAS 7783-06-4 documentation (revised 1994) places H₂S IDLH at 100 ppm. **VERIFIED CORRECT across all occurrences.** The "50 ppm today" at L03:285 is a scenario concentration example, not an IDLH claim — framing is clear.

**Olfactory fatigue vs. nerve paralysis distinction (Gap-K1):**
L03:298–302 states olfactory fatigue at 100 ppm (IDLH), nerve paralysis at 150 ppm and above.
Technical verification: The distinction between olfactory fatigue (sensory adaptation, reversible at lower concentrations) and olfactory nerve paralysis (irreversible damage at higher concentrations) is supported by Poda (1966) "Hydrogen Sulfide Can Be Handled Safely" as cited in the NIOSH NPG H₂S entry. The NPG states olfactory fatigue develops rapidly even at low concentrations, with warning properties lost at concentrations above 100–150 ppm. The lesson's framing — fatigue at 100 ppm, paralysis threshold at 150 ppm+ — is directionally accurate and pedagogically useful. **VERIFIED ACCEPTABLE.** Precise citation path: NIOSH NPG CAS 7783-06-4 → Poda 1966. The lesson's source block at L03:354–356 correctly cites both NIOSH IDLH documentation and NIOSH NPG for H₂S.

**CO IDLH = 1,200 ppm:**
L03:164 — "NIOSH IDLH = 1,200 ppm." NIOSH CAS 630-08-0 CO IDLH document confirms 1,200 ppm. **VERIFIED CORRECT.**

---

## 2. Math and Physics Re-Derivation

### 2a. PFAS Arrest Force — 1,800 lbf limit

**Claim (L04:203, L04:418, L04:468):** PFAS limits peak arrest force to ≤1,800 lbf.

**Derivation check:** OSHA 29 CFR 1910.140(c)(1) specifies that personal fall arrest systems shall limit maximum arresting force on a worker to 1,800 pounds (8 kN) when used with a body harness. ANSI Z359.1 carries the same 1,800 lbf limit for full-body harness systems with energy-absorbing lanyards. This is a regulatory value, not a calculated one — no arithmetic required, but the value is confirmed against the primary regulatory standard. **VERIFIED CORRECT.**

### 2b. PFAS Anchor Point — 5,000 lbf requirement

**Claim (L04:275–276):** "anchor point must support at least 5,000 lbf per worker attached, OR be designed by a qualified person with a safety factor of at least 2:1, per 29 CFR 1910.140(c)(13)."

**Verification:** 29 CFR 1910.140(c)(13) states anchor connectors must be "capable of supporting at least 5,000 pounds (22.2 kN) per employee attached, or shall be designed, installed, and used under the supervision of a qualified person as part of a complete personal fall protection system that maintains a safety factor of at least two." Lesson text matches the regulatory language essentially verbatim. **VERIFIED CORRECT.**

### 2c. Gas Physics — First Principles Check

**Methane (CH₄), sp. gr. ≈ 0.554 relative to air:** Lighter than air → accumulates at TOP. L03:310–311 ✓
**H₂S, sp. gr. ≈ 1.19 relative to air:** Heavier than air → accumulates at BOTTOM. Consistent with lesson framing ✓
**CO₂, sp. gr. ≈ 1.52 relative to air:** Heavier than air → accumulates at BOTTOM. L03:309 ✓
**N₂, sp. gr. ≈ 0.967 relative to air:** Near-neutral → displaces throughout. L03:311–312 ✓
**Multi-height testing instruction (L03:312–313):** "test low for CO₂ and H₂S, and test near the top of the entry for methane" — physically correct. **ALL GAS PHYSICS VERIFIED CORRECT.**

### 2d. ASTM D120 Glove Re-Test Interval

**Claim (L05:334–336):** 6-month re-test interval "from the date of the LAST TEST" per ASTM D120 §10.3.

**Verification:** ASTM D120-14a §10.3 specifies that rubber insulating gloves shall be given a full electrical retest no more than 6 months after the date of the last test (or date of issue if never tested after purchase). The section reference §10.3 is correct. The lesson's emphasis on "from the date of the LAST TEST, not date first put into service" is the critical distinction ASTM D120 makes and is pedagogically accurate. **VERIFIED CORRECT.**

### 2e. LEL Table Action Levels (Technical Review)

**Table at L03:155–173:** Safe entry range = < 10% LEL. Exit threshold (inside) = > 10% LEL. Pre-entry action at 10–25% LEL = ventilate, re-test.

**Technical analysis:** The exit threshold (> 10% LEL, exit immediately if inside) is correctly drawn from NIOSH/OSHA guidance for workers already in a confined space. The pre-entry tiered action (10–25% ventilate-and-re-test, > 25% do not enter) aligns with 1910.268(o)(2) which requires continuous forced ventilation whenever combustible gas is detected. These thresholds are internally consistent when read in context: the "10% LEL exit" applies to workers already inside; the "10–25% ventilate pre-entry" applies to the entry decision. The table structure distinguishes these clearly via column headers ("acceptable entry range" vs. "exit threshold"). **VERIFIED CORRECT — not an internal contradiction, a proper distinction between pre-entry and in-space thresholds.**

---

## 3. Z359 Citation Regression Check (polish-3 target)

Full grep of T18 lesson files for `Z359.4` and `Z359.2`:

- `grep -rn "Z359\.4" T18/` → **zero results**
- `grep -rn "Z359\.2" T18/` → **zero results**

L04:214–219, L04:423, L04:469 all cite **Z359.1** ("The Fall Protection Code") and **Z359.11** (Full Body Harnesses). These are the correct standards. Z359.4 (Assisted-Rescue) is absent. Z359.2 (Use/Inspection/Maintenance) was the correct target per polish-3, and its absence is intentional — the lesson cites Z359.1 (overarching system requirements) and Z359.11 (harness performance) which together cover the lesson's claims. **VERIFIED: NO Z359 REGRESSION. Polish-3 fix confirmed clean.**

---

## 4. RT-L-1 Status (pellistor "irreversibly poison")

**L03:328–329:** "H₂S concentrations above 10 ppm can **irreversibly** poison catalytic bead (pellistor) LEL sensors."

**Technical assessment (independent):** H₂S causes *reversible* inhibition of catalytic bead sensors — the sensor bead is deactivated but can sometimes recover after extended exposure to clean air, though practically it often requires replacement. True irreversible poisoning of pellistor sensors is caused by silicone compounds, phosphate-based vapors, tetraethyl lead, or halogenated solvents which coat the catalyst permanently. H₂S is more accurately described as a "temporary poisoning agent" or "sensor inhibitor" — the recommended action (bump test before re-reliance on the sensor) is exactly right regardless of mechanism.

**Concur with orchestrator-adjudicated defer:** The field safety message is protective and not directionally wrong — it correctly tells crews not to trust the sensor after an H₂S event and to bump-test before re-entry. The mechanism word "irreversibly" is technically imprecise but not a safety hazard. **No severity escalation this round.**

---

## 5. Vite Build

`cd osp-training && npm run build`

**RESULT: BUILD CLEAN — ✓ built in 4.53s**

All T18 lesson files compile without error. No import failures, no syntax issues. All 10 T18 chunks appear in build output including `L10-t18-capstone-quiz-B_fV4-mr.js`.

---

## 6. Directive 18z Spot-Check (Technical Spot-Verification)

| Lesson | vocab_introduced count | Flashcard cards | Status |
|---|---|---|---|
| L05 PPE | 6 (PPG glove class, ANSI Z87.1, ANSI Z89.1, Class 3 hi-vis, metatarsal guard, EH rating) | Verified ≥6 | ✓ PASS |
| L08 HazMat | 3 (PEL, TLV, GHS) | 4 (PEL, TLV, GHS + sds-sec8 supplemental) | ✓ PASS — over is acceptable |
| L09 Incident Reporting | 4 (OSHA 300 log, recordable incident, near-miss, DART) | 5 (300-log, recordable, dart, nearmiss, fc-severe) | ✓ PASS — over is acceptable |

**Verified match between vocabulary_introduced arrays and Flashcard card IDs in L05, L08, L09. No lesson has fewer cards than vocabulary_introduced count. DIRECTIVE 18z CONFIRMED SATISFIED.**

---

## 7. Independent Gap Research (Technical Lens)

### Gap-N1 (LOW — INFORMATIONAL): LFL vs. LEL terminology not distinguished in L03

L03 uses "LEL" (Lower Explosive Limit) throughout. The equivalent term "LFL" (Lower Flammable Limit) is used interchangeably in field documentation (e.g., NFPA 72 uses LFL; most gas monitor manufacturers use LEL). The lesson does not note that LEL and LFL are the same quantity expressed by different nomenclature communities. A crew member who sees "LFL" on a monitor spec sheet may not realize it equals "LEL" on their monitor display. **Severity: LOW informational.** Field safety impact: minor. The lesson's core content is correct. The missing note is a vocabulary-completeness gap, not an accuracy issue.

### Gas detection sequence methodology — PASS
L03 correctly orders: O₂ first, then LEL, then toxic gases. This ordering is per NIOSH recommendation because LEL sensors require adequate O₂ to function — the lesson explicitly teaches this dependency at L03:321–325. **Correct and complete.**

### Multi-employer worksite 29 CFR 1910.146(c)(8) — ABSENT (LOW–INFORMATIONAL)
L03 covers the 1910.268(o) vs. 1910.146 distinction. It does not discuss 29 CFR 1910.146(c)(8), which governs host employer/contractor employer coordination for PRCS entry — the host must inform contractors of PRCS hazards and entry conditions, and the contractor must coordinate entry operations with the host. For OSP crews working in manholes on utility rights-of-way owned by municipalities, gas utilities, or telecom incumbents, this provision can be relevant (the OSP contractor is the "contractor employer" entering a space on the host's property). The lesson teaches the practical crew protocol correctly; the host-employer coordination protocol is not mentioned. **Severity: LOW informational.** Not a safety defect — the practical entry procedure is correct. A future expansion lesson on contractor permit coordination could cover 1910.146(c)(8).

### LOTO group lockout (29 CFR 1910.147(f)(3)) — VERIFIED PRESENT
L02:218 explicitly references 1910.147(f)(3) in the group lockout context. The lockbox protocol (each worker applies their own lock to a group lockbox) is taught at L02:228. **PASS.**

### ASTM D120-14a vs. current edition — NOTE
The lesson cites "ASTM D120 §10.3" at L05:336 and "ASTM D120-14a §10.3" at L05:515. ASTM D120 was last revised in 2014 (ASTM D120-14a); this is the current standard as of knowledge cutoff. The citation is consistent. **PASS — no edition risk detected.**

---

## 8. RT-M Gap-M1 Reconciliation

**Gap-M1 (from RT-M):** L09 fc-severe Flashcard has no matching `key_terms` entry for 'severe incident' / 'severe injury reporting'. The `vocabulary_introduced` array = 4 terms; `key_terms` = 4 entries; Flashcard cards = 5 (fc-300, fc-recordable, fc-dart, fc-nearmiss, fc-severe).

**Technical verification:** Confirmed. `key_terms` at L09:23–44 has exactly 4 entries: 'OSHA 300 log', 'recordable incident', 'near-miss', 'DART'. No 'severe incident' or '1904.39 timelines' entry in `key_terms`. The fc-severe card covers content (29 CFR 1904.39 timelines) that IS extensively taught in L09 (lines 211–321). The supplemental card is technically well-sourced and pedagogically appropriate.

**Assessment:** **CONCUR with RT-M's Gap-M1 finding.** The card renders correctly; the content is accurate; the schema tidiness gap (key_terms doesn't have a matching entry for a taught concept that has a Flashcard) is a schema-consistency note. **Not a safety or accuracy issue. LOW schema-tidiness.** Addressing it would mean either (a) adding a 5th `key_terms` entry for 'severe incident reporting' (1904.39 timelines) or (b) converting fc-severe from a supplemental bonus card to an explicit `vocabulary_introduced` term. Either option is clean. Recommend approach (a) — add key_terms entry — as the lower-disruption fix.

---

## 9. Regression Check

| Item | Location | Verified |
|---|---|---|
| H₂S IDLH = 100 ppm (all occurrences) | L03:170, L03:296, L03:342, L03:353 | ✓ CLEAN |
| 50 ppm "today" = scenario concentration, not IDLH | L03:285 | ✓ CLEAN — clearly framed as field scenario |
| CH₄ lighter than air, accumulates TOP | L03:310 | ✓ CLEAN |
| N₂ near-neutral | L03:311 | ✓ CLEAN |
| Z359.1 "Fall Protection Code" + Z359.11 | L04:214, L04:423, L04:469 | ✓ CLEAN |
| Z359.4 absent | T18 entire | ✓ CLEAN — zero grep results |
| 1,800 lbf max arrest force | L04:203, L04:418, L04:468 | ✓ CLEAN |
| 5,000 lbf anchor per 1910.140(c)(13) | L04:271–276 | ✓ CLEAN |
| LOTO entry-gate emphasis | L02:157–158 | ✓ CLEAN — "ENTRY GATE" language preserved |
| 29 CFR 1910.147(d)(6) verify-zero-energy | L02:150–152 | ✓ CLEAN |
| ASTM D120 §10.3 glove re-test 6-month | L05:334–336 | ✓ CLEAN |
| CO IDLH 1,200 ppm | L03:164 | ✓ CLEAN |
| Construction PEL 1926.55 = 10 ppm TWA | L03:340 | ✓ CLEAN |
| Table Z-2 = 20 ppm ceiling / 50 ppm peak | L03:341–342 | ✓ CLEAN |

**Zero regressions detected.**

---

## 10. Final Verdict

**VERDICT: GREEN**

**Technical verification confirmed:**
- Gap-K1 (olfactory fatigue/paralysis distinction): VERIFIED CORRECT per Poda 1966 / NIOSH NPG ✓
- Gap-K2 (1926.55 + 1910.1000 Table Z-2 citations): VERIFIED CORRECT against primary eCFR sources ✓
- Fall arrest math (1,800 lbf + 5,000 lbf anchor): VERIFIED per 1910.140(c)(13) ✓
- Gas physics (all 4 gases): VERIFIED per first principles ✓
- ASTM D120 §10.3 glove re-test: VERIFIED per standard section ✓
- LEL threshold table: VERIFIED — entry vs. exit thresholds correctly distinguished ✓
- Z359 regression: CONFIRMED ABSENT ✓

**Vite build: CLEAN ✓ 4.53s**

**Directive 18z: SPOT-CHECK PASS (L05, L08, L09 verified)**

**RT-M Gap-M1: CONCUR** — LOW schema-tidiness, no safety/accuracy issue. Recommended fix: add 5th `key_terms` entry for 'severe incident reporting (1904.39 timelines)' in L09.

**RT-L-1 (pellistor): No escalation** — deferred per orchestrator adjudication, field safety message protective.

**New findings this round:**
- **Gap-N1 (LOW — new):** LFL/LEL equivalence not noted in L03 — minor vocabulary-completeness gap, not an accuracy defect.
- **Gap-N2 (LOW — informational):** 29 CFR 1910.146(c)(8) host-employer/contractor coordination not covered in L03. Practical crew protocol is correct; coordination protocol is a future-expansion opportunity.

**Both new findings are LOW informational. Neither is a safety defect or an accuracy error.**

**SATURATION ASSESSMENT:** RT-N found 2 new findings (both LOW informational) vs. RT-M which found 1 new finding (LOW schema-tidiness). Both rounds have cleared HIGH/MED bands entirely. The remaining LOW findings are of the "future expansion could add this" class, not "this is wrong" class. T18 is empirically saturated on accuracy-class issues. **Recommend CLOSING T18 if orchestrator adjudicates the two new LOWs as acceptable (Gap-N1 + Gap-N2) and addresses Gap-M1 schema tidiness.** If orchestrator requires a clean sweep on LOWs, a single surgical polish agent can address Gap-M1 (add `key_terms` entry) + optionally Gap-N1 (add LFL=LEL equivalence note) in < 50K tokens.

=== T18 FINAL-VERIFY-5 RT N TECHNICAL END ===
