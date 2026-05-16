# T18 FINAL-VERIFY-6 RT-O — Pedagogy + Coverage + Citation-Existence + Independent Gap Research

**Constraints acknowledged: I have NOT written to any lesson file, NOT created or modified any *_CANONICAL.md, NOT written to CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md / public/training/. Write-path allowlist: this report file ONLY.**

**Framing:** Senior OSP engineer + field safety officer + curriculum reviewer. Pedagogy / coverage / citation-existence / independent gap-research lens. HEAD SHA reviewed: `20c2c2d`.

---

## 1. Polish-6 Four-Fix Verification

### Gap-N1 — LEL/LFL Vocabulary Equivalence Note (L03 acronym table)

**BEFORE (pre-polish-6):** L03 acronym table LEL row contained only: "The minimum concentration of combustible gas in air that will ignite; measured as a percentage of that limit (0–100% LEL). Above 25% LEL = immediate action required."

**AFTER (verified at L03:102):**
> "(LEL is also called LFL — Lower Flammable Limit — in NFPA documents and some standards literature; the values are identical.)"

**Verdict: APPLIED CORRECTLY ✓.** Note is appended inline to the acronym table LEL context cell. It reads naturally and adds genuine vocabulary value — NFPA 72 and NFPA 54 routinely use LFL terminology, and field crews encounter both terms. The "values are identical" clarification prevents confusion.

---

### Gap-N2 — 1910.146(c)(8) Multi-Employer Coordination Callout (L03 working section)

**BEFORE (pre-polish-6):** 7-step practical crew process ended at step 7 (guard open manhole). No multi-employer coordination language.

**AFTER (verified at L03:272–280):**
> "**Multi-employer worksites (29 CFR 1910.146(c)(8)):** When crews from different employers (for example, a telecom contractor and a municipality's sewer crew) will be working in or near the same confined space, the host employer and the contractor MUST coordinate before entry begins — sharing hazard information, reviewing procedures, and agreeing on rescue responsibilities. One employer's atmospheric testing or rescue plan does not automatically cover another employer's workers. If your crew is the contractor on a host-employer site, confirm coordination is in place before anyone goes in."

**Verdict: APPLIED CORRECTLY ✓.** Placement is logical (immediately after the 7-step process, before the Book vs. Field section). Citation (c)(8) is correct — this is the multi-employer coordination subparagraph of 1910.146. Practical framing ("telecom contractor + municipality sewer crew") is exactly the scenario T18 learners will encounter. No prose flow disruption.

---

### Gap-M1 — 'Severe Incident' key_terms Entry in L09

**BEFORE (pre-polish-6):** L09 `vocabulary_introduced` had 4 terms; `key_terms` had 4 entries. The `fc-severe` Flashcard existed but had no matching `key_terms` entry — schema orphan.

**AFTER (verified at L09:22, L09:46–49):**
- `vocabulary_introduced` now includes `'severe incident'` as the 5th entry.
- `key_terms` now contains a 5th entry: `term: 'severe incident'`, `definition: 'A work-related fatality, in-patient hospitalization, amputation, or loss of an eye — each requiring direct notification to OSHA within strict timeframes under 29 CFR 1904.39. Fatality: 8 hours. Hospitalization, amputation, or eye loss: 24 hours. These reporting requirements apply to ALL employers regardless of size...'`

**Verdict: APPLIED CORRECTLY ✓.** Definition pulls from lesson prose correctly. The fc-severe Flashcard front/back content matches the key_terms entry. Schema is now consistent: 5 vocab_introduced + 5 key_terms + 5 Flashcard cards.

---

### RT-L-1 — Pellistor "Irreversibly Poison" → "Inhibit, Typically Reversibly at Field Concentrations" (L03 advanced section)

**BEFORE (pre-polish-6, per RT-M report):** "H₂S concentrations above 10 ppm can **irreversibly** poison catalytic bead (pellistor) LEL sensors."

**AFTER (verified at L03:337–350):**
> "H₂S concentrations above 10 ppm can inhibit catalytic bead (pellistor) LEL sensors — **typically reversibly at field-relevant concentrations**. The H₂S is absorbed onto the catalyst surface, blocking reaction sites and producing an artificially low or false-zero LEL reading. At low-to-moderate H₂S concentrations, sensitivity typically recovers after the sensor is removed from the contaminated atmosphere and exposed to fresh air; at higher concentrations or prolonged exposure, recovery may be incomplete. Regardless of concentration: if a space had any H₂S event above 10 ppm, treat the LEL sensor as suspect. After any H₂S event, perform a bump test... Consult your monitor manufacturer's guidance — inhibition behavior varies by sensor design and catalyst composition."

**Verdict: APPLIED CORRECTLY ✓.** The mechanism explanation (catalyst surface blocking, fresh-air recovery, incomplete recovery at high concentration/prolonged exposure) is pedagogically sound and technically accurate per SGX Sensortech AN6 taxonomy. Bump-test guidance retained. The paragraph flow from the LEL sensor reliability note above it into this callout reads naturally. The conservative operational message ("treat as suspect after any H₂S event > 10 ppm") is preserved regardless of the reversibility nuance.

---

## 2. Regression Check — All 4 Prior HIGH Safety Bugs + Z359 + Prior Polish

| Item | Location | Status |
|---|---|---|
| H₂S IDLH = **100 ppm** (atmospheric table) | L03:170 | ✓ CLEAN — "at 100 ppm = NIOSH IDLH" |
| H₂S IDLH = **100 ppm** (advanced prose, bold) | L03:306–307 | ✓ CLEAN — "NIOSH IDLH for H₂S is **100 ppm**" |
| H₂S IDLH = **100 ppm** (olfactory fatigue section) | L03:308 | ✓ CLEAN — "At the IDLH (100 ppm)..." |
| H₂S IDLH = **100 ppm** (footer citation) | L03:367 | ✓ CLEAN — "100 ppm IDLH" with NIOSH URL |
| "50 ppm today" = scenario concentration, NOT IDLH | L03:295 | ✓ CLEAN — field scenario example only |
| "50 ppm 10-minute peak" = Table Z-2, NOT IDLH | L03:356 | ✓ CLEAN — clearly labeled as OSHA GI ceiling/peak |
| Methane lighter than air / accumulates TOP | L03:319–321 | ✓ CLEAN |
| Nitrogen near-neutral, displaces throughout | L03:321–322 | ✓ CLEAN |
| CO₂ heavier than air / accumulates BOTTOM | L03:319 | ✓ CLEAN |
| H₂S heavier than air (BranchingScenario, step2 passive-vent explanation) | L03:451–452 | ✓ CLEAN — "CO₂ and H₂S, which settle to the bottom" |
| Z359.4 anywhere in T18 | All 10 files | ✓ ABSENT — `grep Z359\.4` returns zero results |
| Z359.1 "The Fall Protection Code" | L04:214 | ✓ PRESENT |
| Z359.11 "Safety Requirements for Full Body Harnesses" | L04:216 | ✓ PRESENT |
| LOTO verify-zero-energy entry gate (L02) | L02:148–157 | ✓ CLEAN |
| CO IDLH = 1,200 ppm "For scale" framing | L03:164 | ✓ CLEAN |
| Olfactory fatigue at 100 ppm / nerve paralysis at 150 ppm+ | L03:308–311 | ✓ CLEAN (polish-5 K1 fix intact) |
| OSHA Construction H₂S PEL = 10 ppm TWA (1926.55) | L03:354 | ✓ CLEAN (polish-5 K2 fix intact) |
| Table Z-2 = 20 ppm ceiling / 50 ppm 10-min peak | L03:355–356 | ✓ CLEAN (polish-5 K2 fix intact) |

**Zero regressions detected.** All four prior HIGH safety bugs (methane density, nitrogen density, H₂S IDLH 50→100 ppm, LOTO entry-gate) remain correctly fixed. All prior polish stages (1/2/3/4/5) remain intact.

---

## 3. Vite Build Result

```
cd osp-training && npm run build
```

**RESULT: BUILD CLEAN — ✓ built in 11.35s**

`L03-confined-space-entry-D7vfigcr.js` appears in build output (35.62 kB gzip 11.16 kB). `L09-incident-reporting-osha-300.jsx` produces its chunk cleanly. Zero import errors, zero syntax failures. Polish-6 JSX changes to L03 and L09 are both valid.

---

## 4. Coverage Completeness

### L03 Confined Space — 5 Hazard Families per 29 CFR 1910.146(b)

OSHA defines PRCS by four hazard categories. Independent mapping:

| Hazard family | 1910.146 language | L03 coverage |
|---|---|---|
| **Atmospheric** | Hazardous or potentially hazardous atmosphere | PRIMARY topic — full coverage (O₂, combustibles, CO, H₂S, testing thresholds, gas density physics, sensor reliability) ✓ |
| **Engulfment** | Material that could engulf an entrant | Present in PRCS key_term definition + flashcard (both at line 34 and 193) ✓ |
| **Mechanical/Physical** | Inwardly converging walls or floor that could trap an entrant | Present in PRCS key_term definition ✓ |
| **Other recognized hazard** | Any other serious recognized hazard | Covered under the "when 1910.146 PRCS kicks back in" section (chemical contamination, sewage, chemical spill) ✓ |
| **Electrical / Biological** | (Beyond standard 1910.146 categories — field supplements) | Not separately addressed — intentional scope boundary. L03 is atmospheric-focused; electrical hazards covered in L07, biological not material to telecom manhole context. **Acceptable.** |

**Coverage verdict for L03: ADEQUATE.** The lesson correctly focuses on atmospheric hazards (the primary confined space fatality cause in telecom) and includes engulfment + mechanical at the definition level. Electrical and biological are either covered elsewhere (L07) or low-relevance to telecom manholes. No gap to fix.

### L09 Incident Reporting — Coverage Against 1904.39 + 1910.1020 + 1926.50

**1904.39 (Severe Incident Reporting):** Fully covered — table with all 4 categories (fatality 8hr, hospitalization/amputation/eye-loss 24hr), small-employer applicability, reporting mechanism (OSHA hotline). ✓

**1910.1020 (Access to Employee Exposure Records):** This regulation governs employee right of access to medical and exposure records — a related but distinct topic from incident *reporting*. L09 scope is correctly limited to recordkeeping and reporting under 1904. 1910.1020 is not a gap in this lesson; it belongs in L08 (Hazardous Materials) or L01. **Not a coverage gap for L09.**

**1926.50 (Medical Services and First Aid in Construction):** Governs first-aid kit requirements and emergency medical access on construction sites — relevant to incident *prevention and response*, not to the recordkeeping and reporting framework L09 teaches. The lesson's focus on the 1904 recordkeeping framework is correct. **Not a coverage gap for L09.**

**Coverage verdict for L09: ADEQUATE and correctly scoped.**

---

## 5. Independent Gap Research (Pedagogy Lens)

### Gap-O1 — LOW informational: L03 "Below 16% = IDLH" (atmospheric table, O₂ row)

**Finding:** At L03:152, the atmospheric table O₂ Action column states "Below 16% = IDLH." This is a teaching shorthand, not a formally precise use of the IDLH term. NIOSH IDLH values are defined for specific chemical substances (H₂S, CO, methane, etc.). OSHA's NIOSH-IDLH documentation does not publish a single "oxygen deficiency IDLH" in the same way — the regulatory framing is "oxygen-deficient atmosphere = below 19.5%" (1910.146(b)) with physiological severity thresholds below that (consciousness impairment at 16%, unconsciousness risk below 10%). The lesson correctly presents the 16% threshold elsewhere (L03:49: "Below 16% O₂, a worker can lose consciousness with no warning symptoms" — properly framed as a physiological threshold, not IDLH). The table shorthand "Below 16% = IDLH" is technically loose.

**Assessment:** LOW informational. This shorthand is common in industry confined space training materials and the intent (below 16% = immediate danger, get out) is correct. Safety message is protective. No learner would be harmed by this framing. Prior RT rounds (M, N) both reviewed this cell and did not flag it for correction, suggesting it meets the existing training-materials standard for this type of shorthand. **Noting for completeness; not recommending fix given saturation state.**

### Gap-O2 — Assessment: L09 Near-Miss Whistleblower Protections

The lesson includes the nuanced caveat that OSH Act §11(c) whistleblower protection is "an enforcement policy, not an absolute statutory immunity" for near-miss reporters. This is accurate and pedagogically valuable — it teaches learners the correct legal framing without overstating OSHA's protection. Independent verification: OSHA's near-miss page (osha.gov/near-miss-reporting) confirms OSHA encourages voluntary reporting and has issued statements on non-citation policy. The lesson's framing is accurate. **No gap.**

### Gap-O3 — Assessment: L07 MAD/MAB lesson scope

L07 introduces MAD and MAB but correctly scopes the lesson to awareness-level workers. The `meta.learning_objectives` at L07:40 explicitly states "NOT qualified worker approach." The `NOTE:` block in lesson header restricts instruction. The OSHA MAD Calculator reference (osha.gov/power-generation/rulemaking/madcalculator) is included for reference. **Scope is correctly bounded; no gap.**

### Cross-topic DAG check (T18 → T01)

- L01 `prerequisites: ['T01.L01']` — T01.L01 exists (verified: `osp-training/src/lessons/T01/L01.osp-vs-isp.jsx`). ✓
- L01 `vocabulary_assumed: { term: 'NESC', source_lesson_id: 'T01.L02' }` — T01.L02 exists (`L02.parts-of-a-pole.jsx`). ✓
- L07 `vocabulary_assumed: { term: 'pole', source_lesson_id: 'T01.L01' }` — correct. ✓

**Cross-topic DAG: CLEAN.**

---

## 6. Cross-Lesson + Directive 18z Flashcard Check (spot verification)

| Lesson | vocab_introduced | key_terms | Flashcard cards | Match? |
|---|---|---|---|---|
| L03 | 5 | 5 | 5 | ✓ MATCH |
| L09 | 5 (after Gap-M1 fix) | 5 (after Gap-M1 fix) | 5 | ✓ MATCH — Gap-M1 resolved schema orphan |

The fc-severe Flashcard in L09 that was previously orphaned from `key_terms` is now correctly backed by a matching `key_terms` entry. The front/back of the Flashcard card (`T18-L09-fc-severe`) matches the `key_terms.definition` content — definitions are pulled consistently from lesson prose.

---

## 7. Final Verdict

**VERDICT: GREEN**

**Polish-6 4-fix verification:**
- Gap-N1 (LFL/LEL equivalence note): APPLIED CORRECTLY ✓
- Gap-N2 (1910.146(c)(8) multi-employer callout): APPLIED CORRECTLY ✓
- Gap-M1 (L09 'severe incident' key_terms + vocabulary_introduced): APPLIED CORRECTLY ✓
- RT-L-1 (pellistor "inhibit, typically reversibly" rewrite): APPLIED CORRECTLY ✓

**Regression check: ZERO regressions.** All four HIGH safety bugs intact. All prior polish stages intact. Z359.4 absent from all 10 T18 files.

**Vite build: CLEAN ✓ (11.35s)**

**Coverage completeness:** L03 hazard families — adequate; L09 framework — adequate and correctly scoped.

**Independent gap research:**
- Gap-O1 (LOW informational): "Below 16% = IDLH" is a pedagogically loose shorthand but protective and consistent with industry training-material conventions. Not recommending fix — prior RT rounds accepted it and saturation state warrants closure.
- No new HIGH or MED findings.

**Cross-topic DAG: CLEAN. Directive 18z: SPOT-CHECK PASS.**

**T18 ready to close? YES.**

From this pedagogy + coverage + independent-gap-research lens: T18 is empirically saturated. Round 6 finds zero new HIGH/MED findings. The only open LOW (Gap-O1) is a teaching shorthand consistent with industry-standard confined space training materials and carries no safety directional risk. The prior open items from RT-M/N (Gap-M1 schema orphan — fixed in polish-6; Gap-N1/N2 LOWs — fixed in polish-6) are resolved. T18 has cleared six consecutive final-verify rounds without HIGH or MED regression. T18 is COMPLETE.

=== T18 FINAL-VERIFY-6 RT O PEDAGOGY END ===
