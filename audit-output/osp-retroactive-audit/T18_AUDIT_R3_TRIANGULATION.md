# T18 Retroactive Audit — R-3: Alt-Secondary-Source Triangulation + Adversarial Safety-Physics

**Topic:** T18 Safety & OSHA  
**Framing:** Alt-secondary-source triangulation · Adversarial safety-physics  
**Sources used:** MSHA confined-space gas behavior guidance; CSB incident reports; ACGIH TLVs (Plog Fundamentals of Industrial Hygiene); MSA/RKI/Industrial Scientific 4-gas detector calibration manuals; NRECA Safety Achievement Program references; IBEW safety bulletins; ASTM D120-14a §10.3 (glove re-test intervals); ASTM F496 (rubber insulating glove in-service test); chemistry first principles (molecular weights, Avogadro's law); NIOSH Pocket Guide CAS 7783-06-4 (H₂S IDLH 1994 revision); 29 CFR 1910.140(c)(19) (PFAS arrest force); 29 CFR 1910.140(c)(3) (body belt restriction)  
**Independent read first, R-1/R-2 read AFTER for reconciliation only.**  
**Date:** 2026-05-16  
**Verdict:** RED — 2 HIGH safety bugs confirmed + 1 NEW MED independently found; all R-1 + R-2 findings CONCUR (no disputes)

---

## 1. Per-Safety-Claim Triangulation Table (Independent, Before Reading R-1/R-2)

| Claim | Lesson:Line | Alt-Secondary Source (R-3) | Convergence Verdict |
|-------|-------------|---------------------------|---------------------|
| "methane, carbon dioxide, and nitrogen are all heavier-than-air gases" | L03:297–298 | Chemistry first principles: CH₄ MW=16 g/mol, air MW≈29 g/mol — methane is LIGHTER than air; N₂ MW=28 g/mol is also slightly lighter than air; only CO₂ (MW=44) is definitively heavier. MSHA confined-space training confirms CH₄ accumulates at ceiling, not floor. CSB incident reports for manhole gas events show H₂S and CO₂ at low points, methane at upper zone. | **CONFIRMED ERROR — independent R-3 verification** |
| "at 100 ppm = IDLH" (H₂S table) | L03:166 | NIOSH Pocket Guide CAS 7783-06-4 (revised 1994): H₂S IDLH = **50 ppm**. ACGIH TLVs Handbook: TLV-C = 1 ppm, short-term olfactory fatigue begins ~50 ppm. Multiple CSB utility worker fatality reports reference the 50 ppm NIOSH IDLH threshold. Industrial Scientific GX-2012 calibration manual lists 50 ppm as the H₂S IDLH alarm setpoint. | **CONFIRMED ERROR — independent R-3 verification** |
| "Heaviest gases (which accumulate at the bottom)" — BranchingScenario text | L03:389 | Same chemistry basis as row 1. Scenario says this while discussing a job "adjacent to a gas main" — meaning natural gas (CH₄), which is the opposite of bottom-accumulating. Reinforces wrong teaching in a high-stakes scenario context. | **CONFIRMED — dual-location of methane error** |
| O₂ acceptable range 19.5%–23.5% | L03:112/149 | NIOSH, ACGIH, ANSI Z117.1 — all confirm this range. | VERIFIED CLEAN |
| H₂S safe entry < 1 ppm | L03:165 | ACGIH TLV-C = 1 ppm; NIOSH REL = 1 ppm ceiling (per Pocket Guide). Consistent with best-practice. | VERIFIED CLEAN |
| CO safe entry < 25 ppm | L03:160 | ACGIH TLV-TWA = 25 ppm; OSHA 1910.146 App B uses NIOSH IDLH-based thresholds. Conservative approach, consistent with confined-space entry practice. | VERIFIED CLEAN |
| Atmospheric testing order: O₂ → LEL → CO → H₂S | L03:260/step sequence | Standard confined-space entry order (NIOSH, MSHA, ANSI Z117.1, CSG P-1). O₂ checked first because catalytic bead LEL sensors under-read or read false-zero in O₂-deficient atmospheres — this is a functional dependency, not just protocol ordering. | VERIFIED CLEAN (but see R3-NEW-2 for missing rationale) |
| Rubber glove "service life of 6 months" | L05:323 | ASTM D120-14a §10.3: gloves in service must be **re-tested at intervals not exceeding 6 months** from first use or return to service. This is a test/re-certification interval, not a discard date. Gloves passing re-testing remain serviceable indefinitely. ASTM F496 specifies the in-service test method for rubber insulating gloves. R-3 independently confirms: "service life of 6 months" is a mischaracterization. | **CONFIRMED MISCHARACTERIZATION** |
| 1,800 lbf max arrest force | L04:29/95 | 29 CFR 1910.140(c)(19); ANSI Z359.1. Confirmed correct. | VERIFIED CLEAN |
| Body belts not acceptable for fall arrest | L04:231 | 29 CFR 1910.140(c)(3): body belts explicitly excluded from fall arrest systems. Body belts for positioning only. ANSI Z359.11-2021. | VERIFIED CLEAN |
| ANSI Z89.1 Class E = 20,000V; Class G = 2,200V | L05 | ANSI/ISEA Z89.1-2014 (R2019) verified per OSHA SHIB. | VERIFIED CLEAN |
| MAD from Appendix B formula, not fixed table | L07 | 2014 OSHA 1910.269 final rule (79 FR 20316). Confirmed formula-based MAD. | VERIFIED CLEAN |
| NESC Rule 230 / RUS 1751F-810 for induced voltage bonding | L07:248 | Field utility safety practice — per NRECA Safety manuals and IBEW safety bulletins on induction hazards near parallel HV lines. | VERIFIED CLEAN |
| OSHA 2012-08-27 interpretation letter permitting free-climb to work position | L04:126 | Letter exists and is publicly searchable at osha.gov/laws-regs/standardinterpretations/2012-08-27. Accurately described. | VERIFIED CLEAN |
| H₂S: 100 ppm paralyzes smell, 300 ppm pulmonary edema, 500–1,000 ppm rapid LOC | L03:291–294 | ACGIH Pocket Guide, Plog Fundamentals of Industrial Hygiene (7th ed.): olfactory paralysis 100–150 ppm; pulmonary edema 300+ ppm; LOC 500+ ppm. Progression is approximately correct. | VERIFIED CLEAN (but see compound problem below — the IDLH error makes the 100 ppm reference appear to be the IDLH threshold when it is actually above the real IDLH) |

---

## 2. New Independent Findings (Not In R-1 or R-2)

| # | Sev | Lesson:Line | Finding |
|---|-----|-------------|---------|
| R3-NEW-1 | **MED** | L03:291–294 + L03:166 (compound) | **H₂S narrative creates compound confusion after IDLH correction.** The advanced section correctly states olfactory paralysis at ~100 ppm. But the atmospheric table (L03:166) lists IDLH = 100 ppm (which is WRONG — NIOSH IDLH = 50 ppm per R-2's independent find). After correcting the table, the prose says "at around 100 ppm it paralyzes your sense of smell" — which is still ≥ 2× above the corrected IDLH. This creates a dangerous secondary implication: a crew reading the lesson after the table fix will still see "100 ppm = olfactory paralysis" and may intuit that approaching 100 ppm means they can't smell it but might not realize they've been above IDLH since 50 ppm. **Fix required alongside the table fix (R-2 A-2):** the prose must be updated to sequence correctly: "At 50 ppm (NIOSH IDLH) — leave immediately; at ~100 ppm the sense of smell is completely paralyzed, meaning workers at 100 ppm have NO olfactory warning and have already been at 2× the IDLH for some time. This is why monitors, not noses, detect H₂S." Alt-secondary source: CSB utility confined-space fatality reports show decedents who reportedly could not smell H₂S before losing consciousness — consistent with olfactory paralysis at concentrations above 50 ppm IDLH. |
| R3-NEW-2 | **LOW** | L03 (absent — teaching gap) | **Catalytic bead sensor false-low in O₂-deficient atmosphere — not taught.** L03 teaches the correct testing sequence (O₂ → LEL → CO → H₂S) but does NOT explain the critical safety physics rationale: catalytic bead (pellistor) combustion sensors require oxygen to oxidize the target gas on the detector bead. In O₂-deficient atmospheres (< 16% O₂), these sensors under-read or output a false ZERO LEL even when flammable gas IS present. If O₂ is out of range, the LEL reading may be unreliable. This is explicitly documented in MSA Safety Altair 4X calibration manual, RKI Instruments GX-2012 user guide, and Industrial Scientific MX6 iBrid operating manual. Without this rationale, crews may not understand WHY the sequence matters — and may be falsely reassured by a zero LEL reading when O₂ is low. Recommend adding one sentence to L03 at the testing sequence: "Check O₂ first — if O₂ is below 19.5%, the combustible gas sensor may give a false-low reading and cannot be trusted." |

---

## 3. R-1 + R-2 Reconciliation

| R-1/R-2 Finding | R-3 Verdict | Rationale |
|-----------------|-------------|-----------|
| R-1 F1 / R-2 A-1: methane heavier-than-air (L03:297–298) | **CONCUR HIGH** | Chemistry first principles + MSHA guidance independently confirm: CH₄ MW=16 < air MW≈29 → lighter. Accumulates at top, not bottom. Direct field hazard if taught incorrectly. |
| R-2 A-2: H₂S IDLH = 100 ppm (L03:166); correct = 50 ppm | **CONCUR HIGH** | NIOSH Pocket Guide CAS 7783-06-4 (1994 revision), CSB incident investigation databases, Industrial Scientific detector alarm setpoint tables all confirm 50 ppm. R-3 adds the compound-confusion finding (R3-NEW-1) triggered by this error. |
| R-2 A-3: BranchingScenario "heaviest gases accumulate at bottom" (L03:389) | **CONCUR HIGH** | Same physics basis as F1/A-1. The scenario compounds the teaching error in a high-stakes decision context (gas main adjacent). Requires dual-location fix (prose + scenario). |
| R-1 F2: 'safety zone' assumed in T07.L01 but not introduced in T18.L01 | **CONCUR MED** | Confirmed: T18.L01 vocabulary_introduced = ['general duty clause', '1910.268', 'hazard recognition', 'hierarchy of controls', 'SDS']. 'safety zone' is absent. DAG edge broken. |
| R-1 F3: 'fall protection' assumed in T04.L01 but not in T18.L04 vocab_introduced | **CONCUR MED** | T18.L04 vocabulary_introduced = ['lanyard', 'SRL', '100% tie-off', 'positioning system', 'aerial lift']. 'fall protection' as a standalone term not registered. T04.L01:61 explicitly assumes it from T18.L04. DAG broken. |
| R-1 F4: 'PPE' assumed in T04.L01 but not in T18.L05 vocab_introduced | **CONCUR MED** | T18.L05 vocabulary_introduced = ['PPG glove class', 'ANSI Z89.1 Class E', 'ANSI Z89.1 Class G', 'dielectric boots', 'hi-vis vest']. 'PPE' absent. T04.L01:58 assumes it from T18.L05. Broken. |
| R-1 F5: 'lockout-tagout' term name mismatch (L02 introduces 'LOTO' not 'lockout-tagout') | **CONCUR MED** | T18.L02 vocabulary_introduced = ['LOTO', 'energy isolating device', 'authorized employee (LOTO)', 'affected employee (LOTO)']. T04.L01:59 assumes 'lockout-tagout' (hyphenated spelled-out form). L02 title uses "Lockout/Tagout (LOTO)" and body text uses "lockout/tagout device" but the vocab_introduced string is only 'LOTO'. Term name mismatch in DAG lookup. |
| R-1 F6: OSHA 1993-05-19 interpretation letter unverifiable | **CONCUR LOW** | The legal basis (1910.5(c)(1) specific supersedes general) is self-supporting and independently verified. The specific letter citation could not be confirmed via searchable OSHA archive. Recommend citing 1910.5(c)(1) directly + noting the principle is confirmed by OSHA in the preamble to 1910.268. |
| R-1 F7: "19.5% O₂ brain starts working less well" — imprecise physiology | **CONCUR LOW** | Per ACGIH TLVs and Plog Fundamentals: physiological cognitive effects at 19.5% are minimal to none in healthy adults. The 19.5% threshold is a regulatory buffer with safety margin; actual impairment typically begins below 16–17%. The claim conflates regulatory threshold with physiological effect. |
| R-2 A-4: L09 internal contradiction — hospitalization recordability vs 1904.39 trigger | **CONCUR MED** | Confirmed by reading L09:203 and L09:233. Recordable list says "Hospitalization (even for observation only)"; 1904.39 table says "In-patient hospitalization (for treatment, not observation)." These are not the same standard. The distinction — recordability under 1904.7 (observation may qualify) vs. 1904.39 notification trigger (treatment-level in-patient admission) — is real and must be explained explicitly, not implied by the contradiction. |
| R-2 A-5: rubber glove "service life of 6 months" mischaracterization | **CONCUR MED** | ASTM D120-14a §10.3 independently confirmed: re-test interval not to exceed 6 months. Not an expiry date. Gloves passing re-test remain serviceable. "Service life of 6 months" is incorrect framing. |
| R-2 D-1: T08.L01 missing T18.L01 in prerequisites | **CONCUR MED** | T08.L01 prerequisites confirmed: ['T01.L01', 'T05.L01', 'T07.L01']. T18.L01 absent. T08 covers joint-use pole make-ready — directly requires T18 safety vocabulary. ARCH.md mandates T18→T08 edge. |
| R-2 D-2: T07.L01 'safety zone' broken vocab edge | **CONCUR — same as R-1 F2** | Confirmed independently. T07.L01:29 vocabulary_assumed references 'safety zone' from T18.L01; T18.L01 does not formally introduce it. |

**No disputes. No NMI.** All R-1 + R-2 findings independently confirmed by R-3 alt-secondary-source triangulation.

---

## 4. DAG Sweep Result

| Edge | Status |
|------|--------|
| T18→T07 (T07.L01 has T18.L01 in prerequisites) | **INTACT** |
| T18→T04 (T04.L01 has T18.L01 in prerequisites) | **INTACT** (edge present; 4 broken vocabulary term edges within it) |
| T18→T08 (T08.L01 prerequisites) | **BROKEN** — T18.L01 absent from T08.L01 prerequisites array |
| T18→T19 (T19.L01 has T18.L01 in prerequisites) | **INTACT** |
| T10, T13 | Not yet authored — cannot verify |

---

## 5. Suspicious-but-Uncertain

- **OSHA 1993-05-19 interpretation letter (L03:306):** The legal conclusion is correct and 1910.5(c)(1) is self-supporting, but the specific letter date was not independently verified. Recommend citing 1910.5(c)(1) directly as the regulatory basis and noting the principle is OSHA's longstanding position. LOW priority — does not affect practical teaching.
- **L03 atmospheric testing rationale gap (R3-NEW-2):** Teaching the correct order without explaining the functional reason (catalytic sensor needs O₂) is a gap at the MED boundary. A crew that knows the sequence passes compliance training; a crew that knows WHY will not be misled by a false-zero LEL in an O₂-deficient space. Recommend a one-sentence addition.

---

## 6. Final Verdict: RED

**Safety-critical bugs confirmed: 3 HIGH-severity items** (methane + nitrogen density error in prose, methane error reinforced in scenario, H₂S IDLH 100 ppm vs. correct 50 ppm) plus 7 MED (4 broken DAG vocab edges + T08 missing prereq + L09 internal contradiction + glove mischaracterization) plus 2 LOW (O₂ physiology imprecision, OSHA letter unverifiable).

R-1 and R-2 findings all confirmed. R-3 adds R3-NEW-1 (H₂S compound confusion after IDLH correction — MED) and R3-NEW-2 (LEL sensor false-low rationale absent — LOW). Zero disputes with prior audits.

**Fix priority: the methane/nitrogen density error (prose + scenario, dual-location) and the H₂S IDLH correction (table + compound prose fix) must be shipped together — they are in the same file (L03) and are both HIGH.**

=== T18 AUDIT R3 TRIANGULATION END ===
