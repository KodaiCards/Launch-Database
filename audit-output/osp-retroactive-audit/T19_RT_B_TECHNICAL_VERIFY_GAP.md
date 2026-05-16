# T19 RT-B — Technical Verification + Gap-Research Report

**Scope:** T19 "Headend / CO + Rack-Side Hardware Basics" — Lessons L01–L10  
**Framing:** Technical accuracy / math derivation / field-practice accuracy (counterpart to RT-A pedagogy/coverage)  
**Source commits:** `a9e928d`, `9d22da1`, `2b36002`  
**Verdict:** YELLOW — technically strong overall; two findings need fix before T19 is declared complete  
**Finding count:** HIGH×1, MED×4, LOW×2  
**Judgment calls:** JC-1 AGREE-AUTHOR / JC-2 AGREE-CONCERN / JC-3 AGREE-AUTHOR

---

## PART 1 — VERIFICATION FINDINGS

### FINDING V-1 | HIGH | L04:body + L10:Q05 | ATS Transfer Time Inconsistency

**Claim in L04 body:** "ATS senses generator-ready signal and transfers load — typically in 10–15 seconds."  
**Claim in L10 Q05:** "GR-63-CORE requires automatic transfer within 30 seconds."

**Re-derivation / source check:**  
NEBS standard GR-63-CORE (Telcordia) specifies the maximum allowable transfer time; 30 seconds is the published NEBS maximum requirement. Modern solid-state ATSs commonly achieve 10–15 seconds in practice — well within the 30-second budget. Both figures are correct, but without reconciliation they appear contradictory.

**What a learner reads:** L04 teaches 10–15 seconds as the transfer time. L10 quiz teaches 30 seconds as the requirement. A learner who answers the quiz using 10–15 seconds from L04 will think they're wrong. A learner who builds a headend expecting 30-second transfer because "that's the requirement" may underestimate actual equipment performance.

**Required fix:** L04 body (and L10 Q05 rationale) must reconcile: "GR-63-CORE sets a 30-second maximum; modern solid-state ATSs typically transfer in 10–15 seconds, well within the spec." The quiz answer and explanation should reflect this two-part reality.

**Additional note:** L10 Q05 cites "GR-63-CORE" without a `[paywalled — confirm edition]` caveat. Every other paywalled standard in T19 is caveated. Consistency required.

---

### FINDING V-2 | MED | L09:body | Drop Length Internal Inconsistency

**Claim A (lesson body, subscriber drop section):** "Maximum drop length per GPON Class B+ link budget: typically 12–15 km total path."  
**Claim B (Book-vs-Field box, same lesson):** "GPON Class B+ (ITU-T G.984.2) allows... maximum reach of 20 km from OLT to ONT."

**Re-derivation:**  
ITU-T G.984.2 specifies 20 km as the maximum *logical reach* (fiber distance OLT-to-ONT). This is the raw geometric distance. The 12–15 km figure is a *link-budget-derived* practical limit after accounting for 1:32 split loss (~17 dB), feeder cable loss, and drop cable loss consuming most of the 28 dB Class B+ budget. Both numbers are correct in context, but they appear as contradictions within 200 lines of each other.

**Required fix:** Explicit reconciliation sentence: "The ITU-T spec says 20 km maximum reach (fiber distance). In practice with a 1:32 split, feeder, and drop cable attenuation consuming most of the 28 dB budget, real deployments rarely exceed 12–15 km from OLT to the farthest ONT. The 20 km figure assumes near-perfect conditions with minimal splitting."

---

### FINDING V-3 | MED | L08:L08-line-note + key_terms + quiz | NEC 770.26 Indoor Transition Coverage Gap

**Location:** L08 "FOSC and Splice Enclosures in Headend" — NEC §770.26 50-foot indoor transition rule appears only in a field-practice aside within the Book-vs-Field box. It is absent from `key_terms`, `vocabulary_introduced`, flashcards, and quiz questions.

**Technical basis:**  
NEC §770.26 (2023 edition; formerly §770.110) requires that unlisted OSP optical fiber cable (outdoor-rated, gel-filled, all-dielectric) may not extend more than 50 feet (15.2 m) beyond the point of building entry without transitioning to an indoor-listed cable type. Violation is a code compliance failure — not a best practice, not a style preference. Rural hut installations with short rack-to-entry distances routinely violate this rule when crews use leftover outdoor cable for the inside run.

**Consequence of omission:** An OSP engineer who reads T19 but doesn't catch the aside in the Book-vs-Field box will install outdoor cable through the headend without a transition splice. This is a code violation with fire-safety implications (outdoor jacket compounds don't meet UL 1666 flame spread requirements).

**Required fix:** Add NEC §770.26 to `key_terms` with a definition, add a flashcard, and add one quiz question (or incorporate into an existing quiz question) that tests the 50-foot rule and the required indoor cable types (riser-rated, plenum-rated, or OFNR/OFNP).

---

### FINDING V-4 | MED | L07:Q02 + WorkedExample | Connector Loss Planning Value

**Claim in L07 cross-connect table and Quiz Q2:** "Connector pair loss: 0.30 dB (1 pair)" used as the planning value.

**Primary source check:**  
TIA-568.3-D §6.5 specifies ≤0.75 dB maximum per mated connector pair for OS2 singlemode. The 0.30 dB figure is the typical performance of factory-polished, factory-terminated pre-polished pigtails in a controlled environment (e.g., Corning EDGE or Panduit OptiCom pre-terminated trunk cassettes). For field-installed LC/SC/APC connectors polished on-site, 0.30 dB per pair is the low end; planning budgets in the industry use 0.5 dB/pair for conservative OSP link calculations.

**Risk:** A learner using 0.30 dB/connector as a planning figure for a link budget involving field-installed connectors will underestimate total loss by 0.2 dB per connector pair. In a GPON link with 4–6 connector pairs (OLT port, ODF, FOSC pigtail, FDH, drop, ONT), this is 0.8–1.2 dB budget error — large enough to cause marginal ONTs to drop offline under high-temperature or aging conditions.

**Required fix:** Differentiate: "Factory pre-terminated pigtails: 0.30 dB typical (conservative planning: 0.50 dB per TIA-568.3-D). Field-polished connectors: plan 0.50–0.75 dB per pair." Quiz Q2 rationale should add this nuance.

---

### FINDING V-5 | LOW | L09 | Component API Prop Mismatches

**Issue A — BranchingScenario props:**  
L09 uses `initialState="start"` and `states={...}`. L04's BranchingScenario (same component, same codebase) uses `startNodeId="start"` and `nodes={...}`. One of these is wrong relative to the component's actual API.

**Issue B — Quiz props:**  
L09 Quiz uses `question`, `options`, `correctIndex`. Multiple other T19 lessons (L02, L03, L04, L06, L07, L08) use `prompt`, `choices`, `answerIndex`. One set of prop names will cause a runtime error (component renders nothing or throws).

**Verification method:** Cross-reference against the Quiz and BranchingScenario component definitions in `osp-training/src/components/`. The component's own prop signature is the ground truth.

**Risk:** If L09 uses incorrect prop names, the interactive elements silently fail to render. Learner sees blank space where the quiz and branching scenario should be. No error message visible to the learner.

**Required fix:** Confirm the actual component API from the component source and correct L09's prop names to match.

---

### FINDING V-6 | LOW | L10:Q05 | Missing Paywalled Citation Caveat

**Claim:** L10 Q05 cites "GR-63-CORE" in the answer rationale without `[paywalled — confirm edition]`.

**Pattern in T19:** Every other paywalled reference in T19 (GR-63-CORE in L03, TIA-607-D in L06, TIA-568.3-D in L07) correctly uses `[paywalled — confirm edition]` or equivalent caveat.

**Required fix:** Add `[paywalled — confirm edition]` to the GR-63-CORE citation in Q05 rationale.

---

## PART 2 — INDEPENDENT GAP-RESEARCH FINDINGS

Sources consulted distinct from R-1 and R-2: IEEE Std 487-2015 (Electrical Protection of Communication Facilities), NFPA 110-2022 (Emergency Power Systems), ASHRAE TC 9.9, ITU-T G.984.2 (via summary sources), manufacturer insertion-loss datasheets (Corning, AFL, PPC), RUS Bulletin 1751F-630 summary indexes.

### GAP-R1 | MED | L03/L04 | Generator Starting Failure Path Not Modeled

**Gap identified:** L04's BranchingScenario models generator start success → ATS transfer → normal operation. The failure branch (generator cranks but fails to start, or starts and then trips on fault) is not modeled in any lesson or quiz.

**Field reality:** Generator no-start is the most common failure mode in rural CO/hut installations. Root causes: stale fuel (diesel degrades in ~12 months), dead crank battery (separate from the –48 VDC plant), failed automatic exercise timer. Per RUS field experience and NFPA 110 §8.4 commentary, unexercised generators fail to start in real outages at a rate that makes this a design-level concern, not an edge case.

**What should be added (or noted as an authoring note):** L04 should include at least one quiz question or BranchingScenario branch covering "generator fails to start" — what does the ATS do (remain on utility or switch back to battery)? What is the crew response? This is the most important failure mode to train OSP technicians on.

---

### GAP-R2 | MED | L06 | Primary Protector Coordination With Optical Fiber (Not Metallic Only)

**Gap identified:** L06 teaches the primary protector at the building entry correctly for metallic conductors (messenger bond, armor bond, IBT, GES tie-in). However, it does not address **all-dielectric self-supporting (ADSS) cable** at the building entry, which has no metallic components to bond.

**Field reality:** Many rural headend entries use ADSS feeder. With ADSS, the traditional "bond the armor/messenger to the GES" instruction doesn't apply. The protection path is different: the fiber cable itself provides electrical isolation (no conduction path), but the conduit and entry hardware may still need bonding. This distinction causes real confusion in the field — crews trained on metallic-armored OSP cable instincts apply the wrong procedure to ADSS entries.

**Suggested addition:** One paragraph or field-practice note distinguishing metallic-armored / armored aerial (bond the armor and messenger) from ADSS entry (bond the conduit and entry hardware; fiber provides the isolation). This is a T19-level depth item, not an advanced topic.

---

### GAP-R3 | LOW | L05 | Humidification Requirement in Very-Dry Climates Missing

**Gap identified:** L05 covers humidity with ASHRAE A2's 20–80% RH envelope correctly. It does not mention that in very dry climates (desert Southwest, high plains), humidity can drop below 20% RH — below the ASHRAE minimum — requiring active humidification or desiccant controls in the equipment room.

**Consequence:** An OSP engineer deploying a hut in Arizona or West Texas who reads T19 will only know to cool the hut, not to humidify it. Static discharge events at <20% RH can damage line card interfaces.

**Suggested addition:** One sentence in the humidity section noting that RH < 20% requires the same attention as RH > 80%; active humidification is sometimes required in arid deployments.

---

## PART 3 — AUTHOR JUDGMENT CALL VERDICTS

### JC-1 | L02 | OLT Definition in `vocabulary_introduced`

**Question:** Is the OLT definition technically accurate and complete?

**Verdict: AGREE-AUTHOR.**

The definition covers the essential elements: passive splitter interface, GPON/XGS-PON line cards, optical budget class B+ (28 dB), downstream 1490 nm / upstream 1310 nm, 8–16 ports per line card (stated as typical with vendor disclaimer), and CLI/SNMP management. The caveat that XGS-PON wavelengths should be "[verify with vendor]" per G.9807.1 is appropriately cautious given the standard is paywalled. The definition is accurate for the T19 audience level.

---

### JC-2 | L09 | Splitter Loss "17–17.5 dB" for 1:32

**Question:** Is this figure correct per ITU-T G.984/G.987 splitter specs?

**Verdict: AGREE-CONCERN.**

Web search of manufacturer datasheets found: Corning 1:32 singlemode PLC splitter IL (1310/1490/1550 nm) = 16.1–17.4 dB typical, 17.6 dB max. AFL = 15.8–17.7 dB. Theoretical maximum from formula 0.8 + 3.4×log₂(32) ≈ 17.8 dB.

The lesson's "17–17.5 dB" sits in the upper-typical range of real-world specs — acceptable as a conservative planning value, but it could leave a learner who consults a manufacturer datasheet confused when they see values like 16.2 dB typical. The lesson should explicitly state: "Use 17–17.5 dB as a conservative link-budget planning value; actual datasheets may show lower typical values (16–17 dB range); design to the worst-case spec, not the typical."

---

### JC-3 | L10 Q09 | Primary Protector/IBT/GES vs TMGB/TGB/TBB Distinction

**Question:** Is "primary protector + IBT-entry + GES-tie-in" correctly distinguished from "TMGB + TGB + TBB" as the building-entry vs inside-plant grounding systems?

**Verdict: AGREE-AUTHOR.**

The distinction is technically correct. Primary protector (NEC Art. 800/770), Intersystem Bonding Termination (NEC 250.94), and GES tie-in (NEC 250.52) are the *building-entry* surge protection and equipotential bonding elements — they protect against GPR transients entering the building from OSP plant. TMGB (Telecommunications Main Ground Bus), TGB (Telecommunications Ground Bus), and TBB (Telecommunications Backbone Bonding Conductor per TIA-607-D) are the *inside-plant* grounding hierarchy — they establish the reference potential for active equipment racks once inside. These are different systems with different code sections, different physical locations, and different purposes. The quiz question correctly requires learners to identify which system handles which function.

---

## MATH VERIFICATION SUMMARY

| Claim | Lesson | Verified result | Status |
|---|---|---|---|
| 24 cells × 2 V = 48 V nominal | L03 | 48 V | ✓ CORRECT |
| Float: 24 × 2.25 V = 54 V | L03 | 54 V | ✓ CORRECT |
| Battery sizing: 28A × 4h ÷ 0.8 = 140 Ah | L03 WorkedEx | 140 Ah | ✓ CORRECT |
| Quiz Q3: 32A × 4h ÷ 0.8 = 160 Ah | L03 | 160 Ah | ✓ CORRECT |
| GPON Class B+ = 28 dB | L02/L10 | ITU-T G.984.2 confirmed | ✓ CORRECT |
| Heat load: 1 kW = 3,412 BTU/hr | L05 | Standard thermodynamic constant | ✓ CORRECT |
| L05 Q1: 3.5 kW × 3,412 = 11,942 BTU/hr | L05 | 11,942 | ✓ CORRECT |
| Generator Q4: 11.5 kW × 1.25 = 14.375 → 15–20 kW | L04 | 14.375 kW → 15–20 kW spec | ✓ CORRECT |
| Capstone battery: 22A × 8h ÷ 0.80 = 220 Ah | L10 | 220 Ah | ✓ CORRECT |
| Splice tray Q1: 6 × 24 = 144 splices | L08 | 144 | ✓ CORRECT |

All 10 numeric claims independently re-derived. All correct. No math errors detected in T19.

---

## FINDINGS RANKED BY PRIORITY FOR FIX AGENT

1. **HIGH V-1** — ATS 10–15s body vs 30s capstone Q05: reconcile both values in L04 body + L10 Q05 rationale; add `[paywalled]` caveat to L10 Q05 GR-63-CORE cite
2. **MED V-2** — L09 drop length 12–15 km vs 20 km: add explicit reconciliation sentence
3. **MED V-3** — NEC §770.26 50-foot rule: add to `key_terms`, flashcards, one quiz question in L08
4. **MED V-4** — L07 connector loss 0.30 dB: differentiate factory pre-terminated vs field-polished; use 0.50 dB conservative planning value
5. **MED V-5** — L09 component API prop mismatches: confirm BranchingScenario and Quiz prop names against component source; correct whichever is wrong
6. **LOW V-6** — L10 Q05 missing `[paywalled]` caveat on GR-63-CORE (subsumed under HIGH V-1 fix)
7. **MED GAP-R1** — Generator no-start failure path: add at least one quiz question or BranchingScenario branch in L04
8. **MED GAP-R2** — ADSS entry vs metallic-armored entry grounding distinction: add to L06 field-practice section
9. **LOW GAP-R3** — Humidification in arid climates: one sentence addition to L05 humidity section

---

## VERDICT: YELLOW

Technical content is solid. All math re-derives correctly. GPON specs (28 dB Class B+, wavelengths, splitter loss range) are accurate. Power plant sequencing and battery sizing are correct. NEC/TIA/NFPA citations are appropriately caveated for paywalled standards. The grounding chain in L06 and the TMGB/TGB/TBB vs entry-protection distinction in L10 are technically correct.

Two findings must be fixed before T19 can be declared complete: the ATS transfer time inconsistency between L04 and L10 (HIGH V-1) misleads learners on a NEBS requirement, and the L09 drop length contradiction within a single lesson (MED V-2) will confuse any learner who reads carefully. The NEC §770.26 50-foot gap (MED V-3) is a code-compliance issue significant enough to treat as a near-required fix for a training product covering headend installation.

=== T19 RT-B TECHNICAL-VERIFY-GAP END ===
