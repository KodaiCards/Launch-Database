# T06 FINAL VERIFY RT-δ — Technical / Cascade-Defense

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T06_FINAL_VERIFY_RT_D_TECHNICAL.md` written.**

Agent: RT-δ (technical/cascade-defense framing, different primary-source angle from RT-γ)
Date: 2026-05-17

---

## 1. Registry Consultations

- `audit-output/citation-registry.md` — checked for NESC §35/Rule 354, AASHTO H/HS-20, CGA v20.0, NWP 57 entries. Found existing T06 audit entries for NEC 770/800, NESC §32–35, NWP 12/57. Conflict flag: "CONFLICT PENDING: T06 R-3 flagged uncertainty on §34 vs §35 boundary" — marked PENDING in the registry. This RT pass resolves it: §34 vs §35 boundary is correctly stated in current L09 (structures vs open earth / NESC Fix Wave A H-1 fix).
- `audit-output/dag-registry.json` (rebuilt) — T06-specific BROKEN pointers identified (see §5 below).

---

## 2. Independent Primary-Source Verifications (Polish-A Fixes)

### 2a. NESC Rule 354 governs §35 comm-supply separation — CONFIRMED

Polish-A changed L11 from "NESC §32 Rule 354" to "NESC §35 Rule 354." Verification via a different secondary chain than prior agents: RUS 1751F-635 Table of Contents cross-references (publicly reproduced in USDA Rural Development publications) consistently places supply-communication separation for direct-buried cable under NESC §35 (Section 35: Direct-Buried Cable and Cable in Duct Not Part of a Conduit System), with Rule 354 as the specific rule governing both crossings and parallel runs. Rule 320 governs underground conduit systems (§32); Rule 353 governs separation within enclosed conduit systems (§34). §35/Rule 354 is the correct governing citation for open-earth direct-buried or bored installations. The §35 reference in L09, L11, L11 QA checklist item 4, and L12 is internally consistent. **VERIFIED.**

**NEW FINDING — LOW:** L11 QA checklist item 4 states "field practice 12-inch minimum is honored at crossings with electric supply. For parallel runs: confirm 6-inch minimum separation." The 6-inch parallel separation value is sourced as "NESC C2 §35 Rule 354 [confirm edition]." However, L09.Q6 explanation independently states "NESC §35 / Rule 354 requires at minimum 6 inches of horizontal separation for communication conduit running parallel to electric supply." This numeric value (6 inches parallel minimum per Rule 354) is within `[confirm edition]` brackets in the key_terms definition, properly hedged, but presented as a concrete value in Q6's explanation without a corresponding `[confirm edition]` hedge. Risk: if the actual NESC C2-2023 Rule 354 parallel minimum differs from 6 inches, the quiz answer is wrong. The `[confirm edition]` bracket in the definition does not propagate to the quiz explanation. **LOW — inconsistent hedging between definition and quiz explanation.**

### 2b. H-20 AASHTO HS-20 spec — PARTIALLY CONFIRMED, NAMING IMPRECISION REMAINS

Polish-A fixed L12 to state H-20 "20-ton GVW" (prior stated "10-ton rear axle" which was wrong). Independent verification via a DIFFERENT source angle than prior agents: AASHTO publication summaries from FHWA and state DOT bridge design manuals confirm:
- **H-20 (2-axle single-unit truck):** front axle 8,000 lb + rear axle 32,000 lb = GVW 40,000 lb (20 short tons). ✓
- **HS-20 (3-axle semi-truck):** front 8,000 lb + two rear axles × 32,000 lb each = GVW 72,000 lb. NOT 20 tons.

**Residual issue:** L05 defines "H-20 live loading" as "corresponding to an AASHTO HS-20 design vehicle — a truck with a 20-ton gross vehicle weight." The axle values (32,000 lb rear + 8,000 lb front = 40,000 lb = 20 short tons) describe the **H-20** vehicle model, NOT the HS-20 model. The two-axle H-20 truck is the access structure rating vehicle; the HS-20 is a 3-axle semi used for bridge design (72,000 lb GVW). L05 uses "HS-20" name with H-20 parameter values — this is a naming conflation that has persisted across multiple RT rounds. **LOW (OSP convention note):** In the access structure and manhole industry, "H-20 rated" is the standard designation; some specifications colloquially say "HS-20 rated" meaning the same 20-ton class. The lesson's "20-ton GVW, 32,000 lb rear axle" values are correct for H-20 class structures; calling the vehicle "HS-20" is technically imprecise (the AASHTO HS-20 vehicle is heavier) but follows industry shorthand convention. Recommend: add a clarifying parenthetical — "(The access structure industry uses 'H-20' and 'HS-20' interchangeably for the 20-ton class; the AASHTO bridge-design HS-20 semi-truck is a distinct vehicle at 72,000 lb GVW.)"

---

## 3. Numeric Re-Derivation (Independent)

**L04 fill calculation (12-fiber + 48-fiber in 2-inch Sch 40):**
- Cable 1: π×(0.51/2)² = 0.2043 in²
- Cable 2: π×(0.75/2)² = 0.4418 in²
- Total = 0.6461 in²; Conduit = π×(2.067/2)² = 3.356 in²
- Fill = 0.6461/3.356 × 100 = **19.25%** ✓ Matches lesson exactly.

**L04 pull tension (3-bend route, 450 ft):**
- T_straight = µ×W×L = 0.5 × 0.18 × 450 = 40.5 lbf
- θ_total = 90°+45°+90° = 225° = 3.9270 rad
- Multiplier = e^(0.5×3.9270) = e^1.9635 = 7.124
- T_total = 40.5 × 7.124 = **288.5 lbf** (lesson rounds to "289 lbf") ✓

**L12 capstone fill (3×1.25" ID in 4" Sch 40 PVC, ID=4.026"):**
- Conduit area = π×(4.026/2)² = 12.730 in²
- ID area = 3×π×(1.25/2)² = 3×1.227 = 3.682 in²
- Fill = 3.682/12.730 × 100 = **28.9%** ✓ (lesson formula confirms < 40%, PASS)

**L12 capstone pull tension (1200 ft, µ=0.35, W=0.10 lb/ft, 2×90°+1×45°):**
- θ_total = 2×(π/2)+1×(π/4) = 3.9270 rad
- W = 0.10×1200 = 120 lb
- T = 120×0.35×e^(0.35×3.9270) = 42×e^1.3744 = 42×3.953 = **166.0 lbf** ✓ (sanity: reasonable for 1,200 ft with 3 bends at lower µ = good fit)

**All numeric derivations VERIFIED correct.**

---

## 4. Cross-T06 Cascade Sweep

- **Pull-tension formula structure:** L04, L12 both use the capstan equation T = W×µ×e^(µθ). L04 uses T = T_straight × e^(µθ) (where T_straight = µ×W×L). L12 dynamic formula uses T = W×L×µ×e^(µθ). Both are equivalent forms. Internally consistent. ✓
- **40% fill rule source:** L04 key_terms correctly notes "NEC Chapter 9 Table 1 governs electrical conductors — comm cables are exempt per NEC 770.110(B)/800.110(B). The 40% figure is industry convention, not an NEC mandate for telecom." Accurate and appropriately sourced. ✓
- **NWP 57 reference in L07:** L07 Working section references NWP 57 (Telecommunications Activities) for wetland bores + NWP 12 suspension caveat. CGA v20.0 cited. ✓
- **Bentonite slurry specs:** Marsh funnel viscosity 36–48 sec/quart for typical fiber bore — correctly sourced as field practice per CGA Best Practices v20.0. No specific viscosity value is presented as a NESC or RUS-regulatory requirement (appropriately hedged). ✓
- **Conduit marking (APWA color codes):** L09 and L11 both cite APWA Utility Color Code + CGA v20.0 for orange = telecom. Consistent. ✓
- **RUS 1751F-635 §6 and §7 depth/spacing claims:** Non-traffic 24" / road 36" / pedestal spacing 330 ft — consistent across L02, L11, L12 branching scenario. ✓

---

## 5. DAG Registry — T06 BROKEN Pointers

DAG registry rebuild reveals 14 BROKEN pointer entries within T06 lessons:

| Lesson | Term | Claimed Source | Actual Source |
|---|---|---|---|
| T06.L02 | "conduit" | T04.L01 | T01.L02 |
| T06.L02 | "AHJ" | T06.L01 | T01.L08 (earliest) |
| T06.L05–L12 (×7) | "conduit" | T06.L03 | T01.L02 |
| T06.L07–L08, L12 | "HDPE" | T06.L03 | T01.L02 (if introduced there) |
| T06.L10–L12 | "conduit fill" | T06.L04 | T06.L04 ✓ (DAG correct for fill; "conduit" is the broken term) |
| T06.L12 | "APWA color codes" | T06.L06 | Introduced in T06.L06 ✓ |

**Assessment:** The BROKEN entries for "conduit" and "HDPE" reflect that T01.L02 introduces both terms ("conduit" at vocabulary_introduced line 31, "HDPE" via flashcard definition) — meaning these pointers in downstream lessons should reference T01.L02, not T06.L03. However, T06.L03 IS the lesson that provides deep conduit-type selection detail (Sch 40/80, HDPE, innerduct, microduct), so the pedagogical rationale for pointing vocabulary_assumed to T06.L03 is sound: the learner needs T06.L03's depth before working with conduit selection decisions in T06.L04+. The DAG registry is detecting a legitimate cross-topic pointer correctness issue (true first-introduction is T01.L02, not T06.L03), but the T06 internal prerequisite chain is still functionally correct.

**Classification:** LOW — DAG pointer cleanup needed (point "conduit" in T06.L05-L12 vocabulary_assumed to T01.L02 not T06.L03), but does not affect content correctness or learner experience.

---

## 6. Lesson Sample — L02, L03, L10

- **L02 burial depth hierarchy** (RUS 1751F-635 §6 non-traffic 24" / road 36" → NEC 830.47 18" → AHJ override): Correctly presented in tiered order. NEC 830.47 noted as NPBC-specific with appropriate "widely reproduced in vendor literature — VERIFIED-via-secondary-source" caveat. ✓
- **L03 conduit selection:** Sch 40/80 distinction, HDPE for HDD, innerduct/microduct definitions. No numeric claims outside of trade-size IDs (2-inch Sch 40 ID = 2.067", Sch 80 ID = 1.939") — consistent with standard NEMA TC-2 values used throughout the industry. ✓
- **L10 RUS 1751F-643:** Correctly positions as the AML qualification standard, not paywalled content. Sourced via RUS 1751F-635 cross-reference. Acceptance-testing description (tensile, crush, UV, chemical) is consistent with published RUS bulletin cross-reference. ✓

---

## 7. Vite Build + Validator + DAG Registry

- **Vite build:** `✓ built in 5.84s` — zero errors, clean.
- **Schema validator:** 12/12 PASS, 0 FAIL, 0 WARN.
- **DAG registry:** 14 BROKEN T06 pointers (vocab_assumed pointing to T06.L03 instead of T01.L02 for "conduit"/"HDPE"). Low severity — pedagogically defensible, pointer accuracy correctness issue only.

---

## 8. Saturation Verdict

**Findings this pass:**
- LOW-1: L09.Q6 explanation presents 6-inch parallel separation without `[confirm edition]` hedge present in the key_terms definition — inconsistent hedging.
- LOW-2: L05 "H-20 live loading" key term calls vehicle "AASHTO HS-20" but describes H-20 parameters — naming imprecision (industry shorthand, not factually wrong for OSP access structure application, but technically conflates two distinct AASHTO vehicles).
- LOW-3: DAG pointer cleanup — 14 "conduit" / "HDPE" pointers in T06.L02–L12 should reference T01.L02 not T06.L03.

All HIGHs and MEDs from prior waves resolved and verified. RT-γ returned zero findings; this pass returns 3 LOWs only, none previously identified. No HIGH or MED findings remain.

**SATURATION:** With RT-γ GREEN (zero findings) and RT-δ finding only 3 new LOWs of LOW severity, saturation is effectively reached per the saturation rule (no HIGH or MED finds; LOW pool continuing to be discovered at diminishing rate). Orchestrator's call whether to dispatch one additional LOW-framing pass or declare T06 CLOSED.

---

## 9. Verdict

**YELLOW** — 3 new LOWs identified. No HIGH/MED. Vite build clean. Schema 12/12 PASS. Recommend a single polish-B to address L09.Q6 hedge consistency, L05 H-20/HS-20 nomenclature clarification, and DAG pointer corrections (T06.L02–L12 conduit/HDPE pointers → T01.L02), then declare T06 CLOSED.

=== T06 FINAL VERIFY RT D TECHNICAL END ===
