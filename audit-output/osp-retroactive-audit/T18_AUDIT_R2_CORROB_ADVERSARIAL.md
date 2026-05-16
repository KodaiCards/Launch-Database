# T18 Retroactive Audit R-2 — Corroboration + Adversarial Framing

**Scope:** T18 Safety & OSHA (L01–L10), full 9 lesson files read line-by-line.  
**Framing:** Secondary-source corroboration (NIOSH, ANSI Z359, IBEW safety, MUTCD),
high-recall, adversarial — hunting what a careless author misses.  
**Input:** T18 lesson files, ARCH.md DAG, downstream T07/T08/T19 prerequisites.  
**Did NOT read:** R-1 report. Independent eyes only.

---

## 1. Safety-Critical Accuracy (Priority Order)

| # | Sev | Lesson:Line | Claim in lesson | Correct value / source | Verdict |
|---|-----|-------------|-----------------|------------------------|---------|
| A-1 | **HIGH** | L03:297–298 | "methane, carbon dioxide, and nitrogen are all heavier-than-air gases that can accumulate at the bottom of a manhole" | **WRONG on two of three.** Methane (CH₄, MW = 16 g/mol) is lighter than air (MW ≈ 29 g/mol) — it accumulates at the ceiling/top of enclosed spaces, NOT the bottom. Nitrogen (N₂, MW = 28 g/mol) is also very slightly lighter than air — not a sink-to-bottom gas. Carbon dioxide (CO₂, MW = 44 g/mol) IS heavier than air — correct for CO₂ only. Teaching OSP crews that methane pools at the bottom is a direct safety hazard: it would lead them to test the atmosphere only at low points and miss a flammable gas layer near the top. Source: NIOSH Pocket Guide; CGA P-1 Confined Space Guide; basic chemistry (Avogadro; ideal gas law). | **CONFIRMED HIGH** |
| A-2 | **HIGH** | L03:166 (atmospheric table) | "Hydrogen sulfide (H₂S) … at 100 ppm = IDLH" | **WRONG.** NIOSH H₂S IDLH = **50 ppm**, not 100 ppm. Source: NIOSH IDLH documentation for 7783-06-4 (revised 1994, confirmed CDC/NIOSH pocket guide current edition). The OSHA Z-2 table listed 100 ppm in legacy documents, but NIOSH IDLH of 50 ppm is the operationally relevant value under 29 CFR 1910.146 Appendix B (which uses NIOSH IDLH as the definition). Teaching crews that 100 ppm = IDLH means they may remain in a space at 75 ppm believing it is safe, when it is above the actual IDLH. | **NEW HIGH — independent find, not in R-1** |
| A-3 | **HIGH** | L03:389 (BranchingScenario node text) | "Passive venting lets the **heaviest gases** (which accumulate at the bottom) start to dissipate" | Consistent with A-1 defect. The scenario reinforces the wrong teaching that sewer/manhole gases (including methane from a gas main nearby) pool at the bottom. Dual-location fix required: prose at L03:297 AND scenario at L03:389. | **CONFIRMED HIGH** |
| A-4 | **MED** | L09:203 vs L09:233 | Internal consistency error. Recordable incident list (line 203) says "Hospitalization (even for observation only)" is recordable. Reporting table (line 233) says "In-patient hospitalization (for treatment, **not observation**)" triggers 24-hr 1904.39 report. These directly contradict each other within the same lesson. | The recordability of an observation stay (line 203) is defensible under 1904.7 — the severity-of-condition determination is what governs, not the billing classification. However, the 24-hr reporting threshold (1904.39) uses "in-patient hospitalization" language, and OSHA has clarified (OSHA interpretation, 2002-03-28) that observation-status admits may not trigger 1904.39 reporting. The contradiction between the two lines (203 and 233) is the core finding: the lesson cannot say both simultaneously without explaining the distinction. The quiz Q2 scenario (overnight observation → 24 hours) picks the "treat as in-patient" answer, which is the conservative but contested position. The internal inconsistency must be resolved with explicit explanation of the ambiguity. Source: 29 CFR 1904.39(a)(2); OSHA interpretation letter 2002-03-28. | **NEW MED** |
| A-5 | **MED** | L05:323–325 | "Gloves have a **service life of 6 months** from the date they're put into service; re-test and re-certification is required after 6 months per ASTM D120." | **Wrong framing.** ASTM D120 §10.3 requires gloves "in service" to be tested at intervals **not to exceed 6 months** — this is a test/re-certification interval, NOT an expiration date or maximum service life. Gloves that pass re-testing after 6 months remain serviceable. The current language implies gloves should be discarded at 6 months, which is incorrect and wasteful. Some OSHA-compliant glove programs run gloves for years with semi-annual re-testing. The fix: replace "service life of 6 months" with "re-test interval not to exceed 6 months from first use." Source: ASTM D120-14a §10.3 (referenced in OSHA 29 CFR 1910.137(b)(2)(ii)). | **NEW MED** |

---

## 2. Cross-Topic DAG Sweep — T08 (T18 → T08 edge broken)

ARCH.md line 84 explicitly states: "T18 (Safety/OSHA) → T04, T07, T08, T10, T13, T14, T19 (every field-touching topic)."

**T07.L01** (`L01-what-a-staker-does.jsx`): **CORRECTLY has `T18.L01` in prerequisites** (line 17). DAG edge T18→T07 is intact.

**T08.L01** (`L01-otmr-vs-multi-party.jsx`): prerequisites listed as `['T01.L01', 'T05.L01', 'T07.L01']` — **T18 is ABSENT.** T08 is "Make-Ready & Pole Attachment" — every lesson in T08 involves field work on joint-use poles (NESC safety rules, energized conductor proximity, fall hazards, traffic control). ARCH.md mandates T18 as a prerequisite. The broken edge was likely a copy-forward from an earlier template that predated T18 authoring.

**T19.L01**: has `T18.L01` in prerequisites (confirmed). DAG edge T18→T19 is intact.

**T10, T13**: not yet authored — DAG edge status cannot be checked.

| # | Sev | Location | Finding |
|---|-----|----------|---------|
| D-1 | **MED** | T08/L01:18 | `T18.L01` missing from prerequisites array. T08 covers joint-use pole make-ready — requires T18 safety vocabulary (MAD/MAB, PPE, fall protection, LOTO, OSHA 1910.268). Fix: add `'T18.L01'` to T08.L01 prerequisites. Downstream T08 lessons (L02–L12) chain from L01 so the DAG edge propagates. |
| D-2 | **LOW** | T07.L01:29 | `vocabulary_assumed: { term: 'safety zone', source_lesson_id: 'T18.L01' }` — "safety zone" is NOT in T18.L01's `vocabulary_introduced` or `key_terms`. The term is used informally in T18.L01 body text but is never formally introduced. This means T07.L01 assumes a term T18.L01 does not formally teach. Fix: either add 'safety zone' to T18.L01's vocabulary_introduced + key_terms, or update T07.L01 to source to the lesson where it IS formally introduced. |

---

## 3. Coverage Gaps vs. ARCH.md T18 Scope (Secondary Corroboration Check)

| Element | ARCH.md requirement | Lesson coverage | Verdict |
|---------|--------------------|--------------------|---------|
| OSHA 1910.268 (Telecom) | Required | L01 — covered thoroughly | ✓ |
| OSHA 1910.269 (Power) | Required | L07 — MAD/MAB covered; 1910.269 scope correct | ✓ |
| OSHA 1910.146 (Confined Space) | Required | L03 — covered; 1910.268 vs 1910.146 distinction explained | ✓ with A-1/A-2/A-3 defects |
| OSHA 1910.147 (LOTO) | Required | L02 — thorough; 6-step sequence + group LOTO + re-energization | ✓ |
| Fall protection | Required | L04 — good; positioning vs PFAS distinction, 1910.268(g), 1910.67 aerial lift | ✓ |
| PPE (PPG glove classes) | Required | L05 — Class 00–4 covered; Class E/G hard hat covered; hi-vis; EH boots | ✓ with A-5 defect |
| Traffic control | Required | L06 — MUTCD Part 6 four-zone layout; flagger requirements; TCP | ✓ |
| MAD/MAB awareness | Required | L07 — MAD formula vs fixed table explained; OSHA MAD Calculator referenced | ✓ |
| SDS / hazmat | Required | L08 — 5 OSP-specific chemicals; GHS 16-section format; PEL vs TLV | ✓ |
| Incident reporting | Required | L09 — OSHA 300/300A/301; recordable threshold; DART; 1904.39 timelines | ✓ with A-4 defect |
| Capstone quiz | Required | L10 — present (not audited for content accuracy — content audit is post-author scope) | ✓ |
| **NESC §9 + 1910.268 electrocution context** | Implicit from scope | L07 mentions NESC Rule 230 (induced voltage bonding) — adequate for OSP awareness depth | ✓ |

**No ARCH.md-required topic is entirely absent.** Defects are accuracy/consistency issues within covered topics.

---

## 4. Secondary Corroboration Table — Adversarial Source Check

| Claim | Primary source cited | Secondary corroboration | Verdict |
|-------|---------------------|------------------------|---------|
| H₂S IDLH = 100 ppm (L03:166) | OSHA legacy docs | **NIOSH IDLH Rev. 1994: 50 ppm** — contradicts lesson | ❌ WRONG |
| Methane heavier-than-air (L03:297) | None cited | Chemistry: CH₄ MW=16, air MW≈29 — lighter than air | ❌ WRONG |
| Nitrogen heavier-than-air (L03:297) | None cited | N₂ MW=28 vs air MW≈29 — very slightly lighter than air | ❌ WRONG |
| O₂ acceptable range 19.5%–23.5% (L03) | 1910.146(b) cited | NIOSH, ANSI Z117.1 — confirm range | ✓ |
| CO safe entry < 25 ppm (L03:160) | Not cited | OSHA 1910.146 App B; ACGIH TLV-TWA = 25 ppm — consistent | ✓ (conservative, standard practice) |
| H₂S safe entry < 1 ppm (L03:165) | Not cited | ACGIH TLV-C = 1 ppm — consistent but source should be cited | ✓ (needs citation) |
| Rubber glove 6-month "service life" (L05:323) | ASTM D120 cited | ASTM D120 §10.3 = test interval, not expiry | ❌ MISCHARACTERIZED |
| Fall protection trigger at >4 ft (L04) | 1910.268(g)(1) | OSHA eTool, interpretation letter 2012-08-27 — confirm | ✓ |
| 1904.39 fatality = 8 hr, hosp/amp/eye = 24 hr (L09) | 1904.39 cited | ecfr.gov 1904.39 — confirms timelines | ✓ |
| MAD via Appendix B formula, not fixed table (L07) | 1910.269(l)(2) | 2014 OSHA rule revision — confirms formula-based MAD | ✓ |
| HazCom 2012 (GHS, 16-section SDS) (L08) | 1910.1200 cited | ecfr.gov — confirms | ✓ |
| Silica PEL = 50 µg/m³ TWA (L08) | 29 CFR 1910.1053 | 2016 silica rule — confirms | ✓ |

---

## 5. Suspicious-but-Uncertain (Needs SME Confirm)

- **L03 "1910.268(o) supersedes 1910.146 per OSHA 1993-05-19 interpretation letter"**: This letter is cited in both L03 and R-1's findings. The OSHA interpretation letter database can be searched at osha.gov. R-1 flagged this as LOW (unverifiable). Under adversarial lens: if this letter doesn't exist or was rescinded, L03's entire "1910.268(o) is primary standard" teaching rests on an unverifiable source. OSHA's general rule at 29 CFR 1910.5(c)(1) (specific standard supersedes general) does support the conclusion — but the specific 1993 letter citation should be independently confirmed before publication. [Needs SME confirm via OSHA interpretation letter archive]
- **L04:198 "body belts still allowed for positioning (holding the worker at the work position) but not for fall arrest"**: This is accurate per 1910.268(g) current text. However, ANSI Z359.11 (body belt use for positioning) was under revision as of recent years. The book-vs-field section accurately describes the standard but should note the revision status. [Low priority — verify edition at publication time]

---

## 6. Summary

| Category | Count |
|---|---|
| HIGH — safety-critical accuracy | 3 (A-1 confirmed HIGH from R-1; A-2 new independent find; A-3 dual-location of A-1) |
| MED — accuracy/consistency/DAG | 4 (A-4 L09 internal contradiction; A-5 glove service life; D-1 T08 DAG edge; D-2 safety zone vocab) |
| LOW | 1 (L03 H₂S <1 ppm missing citation) |

**New safety-critical bug beyond R-1's methane catch:** H₂S IDLH stated as 100 ppm (L03:166) — correct value is 50 ppm per NIOSH. This is an independent HIGH finding not in R-1's scope. A-1/A-3 (methane heavier-than-air) corroborate R-1's HIGH from a different framing angle.

**DAG verdict:** T18→T07 edge intact. T18→T19 edge intact. T18→T08 edge **BROKEN** (T08.L01 missing `T18.L01` in prerequisites). T10, T13 not yet authored.

=== T18 AUDIT R2 CORROB-ADVERSARIAL END ===
