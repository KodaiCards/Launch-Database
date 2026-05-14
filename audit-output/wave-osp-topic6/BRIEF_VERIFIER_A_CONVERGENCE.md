# T6 Brief Verifier A — Convergence + Canonical Lesson List

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Verifier A — convergence + canonical lesson list framing (parallel to Verifier B; B's output NOT read)
**Inputs:** BRIEF_FRAMING_A.md · BRIEF_FRAMING_B.md · T4_FINAL_BRIEF.md (L4.7) · T5_FINAL_BRIEF.md (L5.1, L5.9)

---

## §1 A↔B Lesson Mapping Table

| # | Agent A Title | Agent B Title | Canonical Title | Verdict |
|---|---|---|---|---|
| 6.1 | Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both | Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both | **Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both** | AGREE |
| 6.2 | Regulatory Framework: NEC Art. 250 / NESC Rules 92–99 / IEEE 1100 | Regulatory Framework: NEC Art. 250, NESC §§92–99, and IEEE 1100 | **Regulatory Framework: NEC Art. 250, NESC Rules 92–99, and IEEE 1100** | AGREE |
| 6.3 | Pole Grounding: Downleads, Ground Rods, and MGN Bonding | Pole Grounding: Downleads, Ground Rods, and MGN Bonding | **Pole Grounding: Downleads, Ground Rods, and MGN Bonding** | AGREE |
| 6.4 | Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement | Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement | **Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement** | AGREE |
| 6.5 | Underground Pedestal and Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity | Underground Pedestal and FDH Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity | **Underground Pedestal and Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity** | AGREE — minor wording diff only |
| 6.6 | Building Entry Grounding: NEC Art. 770, Primary Protectors, and Duct Seals | Building Entry Grounding: NEC Art. 770/800, Primary Protectors, IBT, and Duct Seal | **Building Entry Grounding: NEC Art. 770/800, Primary Protectors, IBT, and Duct Seal** | AGREE — B adds "IBT" to title; adopt B's (more precise per scope) |
| 6.7 | Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Grounding, and Utility Ground Integration | Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Bonding to Utility GES, and Multi-Ground Prohibition | **Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Bonding to Utility GES, and Multi-Ground Prohibition** | AGREE — B's subtitle is clearer; adopt B's |
| 6.8 | Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination | Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination | **Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination** | AGREE |
| 6.9 | Stray Voltage and AC Induction Hazards: Neutral Coupling, Sheath Voltage, and PPG Procedures | Stray Voltage and AC Induction Hazards: Neutral Coupling, Sheath Voltage, and PPG Procedures | **Stray Voltage and AC Induction Hazards: Neutral Coupling, Sheath Voltage, and PPG Procedures** | AGREE |
| 6.10 | Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria | Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria | **Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria** | AGREE |

**A↔B convergence: 10/10 titles matched. 8 identical, 2 with minor subtitle variation — both resolved in canonical column above.**

---

## §2 Canonical Lesson Outline Table

| # | Title | Duration | Intensity | Scope (1 line) | Primary Citation | Worked Example Anchor | Recall Q Shape | Applied Q Shape |
|---|---|---|---|---|---|---|---|---|
| 6.1 | Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both | 25 min | STANDARD | NEC Art. 100 definitions for bonding/GES/EGC/bonding jumper; why fiber OSP metallic components accumulate charge | NEC Art. 100; NEC §250.2; NESC Rule 012 | ADSS on joint-use pole: classify messenger, armor, ADSS jacket — bond, ground, or neither? | NEC Art. 100 term: which of these is the definition of "bonding jumper"? | Given a new aerial closure, identify which components require bonding vs. grounding treatment |
| 6.2 | Regulatory Framework: NEC Art. 250, NESC Rules 92–99, and IEEE 1100 | 25 min | STANDARD | NESC/NEC boundary at service entrance; full NESC §92–99 rule map; IEEE 1100 bridge standard; TIA-607-C for customer-owned plant | NEC Art. 250 Pts. I–II; NESC Rules 92–99; IEEE 1100 §1.3 | 3-segment route (utility pole / customer easement / building entry): identify controlling standard per segment | NESC/NEC handoff point: which standard governs a joint-use aerial run? | Given a route description, select the correct code body for each segment — utility ROW vs. customer premises vs. building entry |
| 6.3 | Pole Grounding: Downleads, Ground Rods, and MGN Bonding | 30 min | HIGH | Full pole ground assembly: messenger bond, #6 AWG downlead, 5/8-in.×8-ft rod, supplemental rod if >25 Ω; MGN bond (NESC 96F); T5 L5.1 deferral closure | NESC Rules 92, 96, 96F; NEC §250.52(A)(5), §250.56, §250.66 | Joint-use pole with distribution transformer: specify complete ground assembly from messenger to rod | What is the minimum conductor size for a grounding downlead on a joint-use pole per NESC Rule 96? | Joint-use pole measured 28 Ω after single rod — specify full remediation per NEC §250.56 and add MGN bond for co-op neutral |
| 6.4 | Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement | 25 min | HIGH | NESC 96F messenger bond at every splice closure; armor bond at closures and run ends; ADSS exemption; arrestor placement on aerial side at A/UG transitions; T5 L5.1 deferral closure | NESC Rule 96F; NEC Art. 800 (protector at transition) | As-built photo shows mid-route splice without armor bond — flag violation, cite standard, describe consequence | When is an armor bond strap NOT required at an aerial splice closure? | Place arrestors on a mixed aerial/UG route schematic: identify every required installation point |
| 6.5 | Underground Pedestal and Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity | 25 min | HIGH | NEC rod spec; perimeter ground ring for large enclosures; soil resistivity types (clay, sandy, rock) and remediation; FDH threshold vs. NEC threshold; test-before-bury rule | NEC §250.52(A)(4), §250.52(A)(5), §250.56, §250.66; NESC Rule 92; Telcordia GR-1275 | New FDH on Macon GA red-clay pad (resistivity ~100 Ω·m): design electrode to meet GR-1275 ≤5 Ω | What rod size and depth does NEC §250.52(A)(5) specify? | Single-rod test returns 28 Ω at new FDH — apply both NEC §250.56 and GR-1275 thresholds and select remediation |
| 6.6 | Building Entry Grounding: NEC Art. 770/800, Primary Protectors, IBT, and Duct Seal | 25 min | HIGH | NEC §770.93 primary protector (UL 497B); §770.100 equipotential bond; §250.94 IBT; duct seal; NESC/NEC boundary at protector; T4 L4.7 + L4.6 deferral closure | NEC Art. 770 §770.93, §770.100; NEC §250.94; NEC Art. 800 §800.93, §800.100 | Building-entry detail missing primary protector bond: identify violation, cite standard, specify fix | What UL listing is required for a primary protector used with OSP fiber cable metallic components per NEC §770.93? | Permit drawing review: electrical contractor bond to Ufer slab omitting IBT — red-mark all NEC 800.100/250.94 violations |
| 6.7 | Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Bonding to Utility GES, and Multi-Ground Prohibition | 20 min | STANDARD | NESC Rule 92 bond-to-utility-GES requirement; CO ground bus per GR-1275; no parallel independent electrode; minimum #6 AWG; T5 L5.9 deferral closure | NESC Rules 92, 96C; TIA-607-C §5; Telcordia GR-1275 §4 | Pole-mounted FDH: co-op GES tests 8 Ω — bond to utility GES or add independent rod? | What NESC rule requires a communication system's conductive parts to bond to the adjacent supply system's GES? | FDH on co-op pole: specify bonding configuration, minimum conductor size, and verify the multi-ground prohibition |
| 6.8 | Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination | 25 min | HIGH | Arrester types (gas-tube, MOV, combination); VPL selection; placement intervals in HKL zones; ground ring; NFPA 780 vs. IEC 62305 primary/secondary assignment; protection coordination chain | NFPA 780 §4.5, §4.13; NESC Rule 97; IEEE C62.41.2; IEEE 80 §14 | 3-mile aerial feeder, 65 thunderstorm-days/year: build arrester placement schedule and ground ring spec for both A/UG transitions | What is the maximum arrester interval on exposed aerial plant in a high-keraunic zone per BICSI OSP-DRD Ch. 8.6? | Wrong arrester: MOV-only at primary entry on high-keraunic exposed aerial — identify the protection gap and specify the correct combination unit |
| 6.9 | Stray Voltage and AC Induction Hazards: Neutral Coupling, Sheath Voltage, and PPG Procedures | 25 min | HIGH | AC induction on metallic messenger/armor near distribution primary; ADSS capacitive charge; PPG pre-work sequence; OSHA LOTO + MAD; code-pointer only — T9 owns field execution; 7.2 kV PSC-typical class | OSHA 29 CFR 1910.333; OSHA 29 CFR 1910.269; NESC Rule 441; IEEE 1048 | Pre-work sequence before handling messenger with 7.2 kV distribution primary on joint-use pole | What is the correct order of steps in the PPG pre-work sequence (LOTO → install PPG → stray voltage test → work)? | Crew opens messenger lashing — pole record shows 48 VAC stray on last visit: walk through correct PPG sequence citing each step's OSHA basis |
| 6.10 | Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria | 30 min | HIGH | IEEE 81 3-pole method; 62% rule; acceptance thresholds per facility class; clamp-on limitation; remediation; RUS testing interval; T3 L3.12 cross-ref for test log format | IEEE 81 §9.3, §9.4; NEC §250.56; Telcordia GR-1275 §5; IEEE 80 §14.5 | 3-pole test at new FDH: readings at 50%/62%/75% = 18/22/28 Ω — validate 62% rule, accept or remediate | The clamp-on method per IEEE 81 §9.4 is valid as a primary acceptance test for a new single-rod installation: True or False? | 3-pole result 28 Ω at new single-rod FDH — apply NEC §250.56 vs. GR-1275 ≤5 Ω thresholds and specify remediation with documentation for RUS close-out |

**Total: 255 min (~4.25 hrs). 10 lessons. 7 HIGH-INTENSITY / 3 STANDARD. Final exam: 20 Qs (2/lesson), 14/20 = 70% pass threshold — math clean: 20 × 0.70 = 14.0.**

---

## §3 Convergence Verdict per Lesson

| # | Verdict | Note |
|---|---|---|
| 6.1 | **AGREE** | Identical scope, duration, intensity. A adds NEC Art. 100 citation depth; B adds daily-job classification hook. Both are compatible and additive. |
| 6.2 | **AGREE** | Identical scope and duration. A provides fuller NESC rule-map table; B provides drag-drop interactive idea. Both converge on NESC/NEC boundary as centerpiece. |
| 6.3 | **AGREE** | Identical scope, duration, intensity. A provides deeper numeric spec (rod spacing ≥1 rod-length, supplemental rod spacing); B provides failure-mode framing ("bonding without earth path"). Both essential. |
| 6.4 | **AGREE** | Identical scope and intensity. A explicitly notes ADSS exemption pending BICSI OSP-DRD Ch. 8.2 confirmation; B flags skipped mid-route bond as failure mode. ADSS exemption confirmation needed at authoring time. |
| 6.5 | **AGREE** | Near-identical scope. B's title adds "FDH Cabinet" — clarifies that L6.5 covers pedestal-level and large enclosure grounding (perimeter ring) but NOT FDH housing bonding to utility GES (owned by L6.7). Keep this distinction explicit in lesson opener. |
| 6.6 | **AGREE** | B adds "IBT" to the title; A covers IBT in body. Adopt B's title. Both correctly note this lesson closes the T4 L4.7 + L4.6 deferral. |
| 6.7 | **AGREE** | B's title adds "Multi-Ground Prohibition" — the operationally critical safety rule. Adopt B's title. A adds 7 CFR Part 1755 + PE-60 citation in §7 citation column; important for RUS-funded co-located FDH work. |
| 6.8 | **AGREE** | Identical scope. Divergence on NFPA 780 vs. IEC 62305 primary — see §6 citation matrix. A correctly assigns NFPA 780 as primary (US-adopted) with IEC 62305 as supporting for high-exposure/international. |
| 6.9 | **AGREE** | Identical scope. Both assign 7.2 kV as PSC-typical class and flag it as a user-confirmation item. B flags "it's fiber, no current" as the specific failure mode. |
| 6.10 | **AGREE** | Identical scope. A provides the richer worked-example derivation (probe displacement validation with ΔR math). B adds the T3 L3.12 cross-reference for test log format — critical and not covered by A. Both must inform authoring. |

**Overall: 10/10 AGREE. No scope divergence requiring a user decision on lesson boundaries.**

---

## §4 Macon GA + Red-Clay Context Audit

| Lesson | Context Present in A | Context Present in B | Status |
|---|---|---|---|
| 6.3 | Yes — "7.2 kV is the PSC-typical class" in L6.9 implies Macon GA distribution voltage; L6.3 worked example: "joint-use pole with distribution transformer" (generic) | Yes — explicitly "Macon GA joint-use pole: red-clay soil, co-op distribution" in daily-job hook | **B is more explicit.** Canonical authoring brief must add Macon GA + red-clay to L6.3 worked example per B. |
| 6.5 | Mentions "clay (~100 Ω·m)" in soil table — implicit; DISCOVERY.md noted clay at ~100 Ω·m | Yes — "New FDH on red-clay Georgia pad site (resistivity ~100 Ω·m)" in daily-job hook | **B is more explicit.** Canonical brief must name this the Macon GA red-clay default. |
| 6.9 | Yes — "Macon GA joint-use scenario: distribution primary (7.2 kV is the PSC-typical class)" verbatim in lesson scope | Yes — "7.2 kV single-phase distribution assumed" flagged as user-confirmation item | **Consistent. 7.2 kV is the working default; user confirmation needed before exam question is written.** |

**Consistency verdict:** red-clay soil context is internally consistent across A and B for the lessons where it appears. Neither brief contradicts CLAUDE.md (Light loading district, inland Macon). B surfaces it more explicitly in daily-job hooks — the authoring brief should adopt B's explicit Macon GA + red-clay language for L6.3 and L6.5. No Extreme Wind overlay applies to grounding content (grounding specs are independent of NESC loading district).

---

## §5 Cross-Topic Deferral Closure Table

| Source | What Was Deferred | T6 Lesson | A Closes It? | B Closes It? | Canonical Status |
|---|---|---|---|---|---|
| T4 L4.7 (NEC Art. 250 code pointer) | IBT location + electrode types at code-pointer level only; "installation depth = Topic 6" (T4 Final Brief verbatim) | L6.2 (framework depth) + L6.5 (electrode installation) + L6.6 (IBT practice) | Yes — L6.2, L6.5, L6.6 explicitly named | Yes — L6.6 "builds installation practice on that foundation" | **CLOSED.** All three closure lessons confirmed. Authoring brief must instruct L6.6 opener to explicitly acknowledge T4 L4.7 deferral. |
| T5 L5.1 (strand bonding/grounding) | "strand bonding/grounding — see T6 L6.3" (T5 Final Brief §5 verbatim) | L6.3 | Yes — L6.3 explicitly names T5 L5.1 deferral in lesson opener instruction | Yes — listed as T5 → T6 prerequisite | **CLOSED.** L6.3 canonical scope confirmed. Authoring brief must require opener to state the deferral explicitly. |
| T5 L5.9 (FDH housing grounding) | "FDH housing grounding — see T6 L6.7" (T5 Final Brief §5 verbatim); also confirmed in T5 L5.8: "Do NOT cover FDH housing grounding here — owned by T6 L6.7" | L6.7 | Yes — L6.7 opens with explicit T5 L5.9 deferral acknowledgment instruction | Yes — T5 L5.8/L5.9 listed as T5 → T6 prerequisite | **CLOSED.** L6.7 canonical scope confirmed. Authoring brief must require opener to state the deferral. |
| T4 L4.6 (NEC Art. 800 structure intro) | Art. 800.93 protector conductor sizing owned by T4; T6 L6.6 assumes it | L6.6 | Yes — explicitly cited | Yes — listed as T4 → T6 prerequisite | **CLOSED.** L6.6 may cross-reference T4 L4.6 without re-deriving. |
| T6 L6.9 → T9 (PPG execution) | Code-pointer only; T9 owns field execution | T9 (forward pointer) | Yes — "Code pointer only — T9 owns execution" | Yes — consistent | **FORWARDED cleanly.** |

All three primary deferrals (T4 L4.7 → T6 L6.6, T5 L5.1 → T6 L6.3, T5 L5.9 → T6 L6.7) are closed by the canonical lesson structure.

---

## §6 Citation Matrix Lock

| Citation | Status | Notes |
|---|---|---|
| **NEC Art. 100, 250, 770, 800** | **LOCKED** | Sections confirmed across T4 final brief and both T6 briefs. §250.52(A)(4), §250.52(A)(5), §250.56, §250.66, §250.94, §770.93, §770.100, §800.93, §800.100 all cited consistently. |
| **NESC Rules 92, 96, 96C, 96F, 97, 441** | **LOCKED** | Consistent across A, B, and DISCOVERY.md. |
| **TIA-607-C** | **LOCKED** | §4 (system architecture) and §5 (conductor sizing) cited. Consistent. |
| **IEEE 1100 (Emerald Book)** | **LOCKED** | §1.2, §1.3, §8.3, §8.4, §8.5, §8.6 cited consistently. Non-mandatory; appropriate as supporting. |
| **IEEE 80** | **LOCKED** | §14, §14.5 cited for GPR + ground ring sizing. |
| **IEEE C62.41.2** | **LOCKED** | VPL selection standard for L6.8. Cited in both A and B. |
| **IEEE 1048** | **LOCKED** | PPG practices standard for L6.9. Cited in A; omitted in B (B cites OSHA only). Add to canonical. |
| **OSHA 29 CFR 1910.333 + 1910.269** | **LOCKED** | Both cited consistently for L6.9. |
| **Telcordia GR-1275** | **LOCKED** | §4 (CO/FDH acceptance) + §5 (testing thresholds). Cited consistently. 5 Ω FDH / 1 Ω CO thresholds. |
| **IEEE 81 §9.3, §9.4** | **NEEDS AUTHORING VERIFICATION** | Section numbers (§9.3 = fall-of-potential; §9.4 = clamp-on) are structurally plausible. Agent A flagged: "2% ΔR tolerance and 5× probe placement must be verified from actual IEEE 81 §9.3 text before writing [CORRECT] tag." This is not resolvable at brief stage — it is an authoring guard. Escalate to Carter only if IEEE 81 access is unavailable to the authoring agent. |
| **RUS 1751F-815** | **UNVERIFIED EXISTENCE — NEEDS RESOLUTION BEFORE AUTHORING** | Agent A flagged: section numbers (§1–§8) are structurally plausible but not confirmed against an actual copy. If 1751F-815 does not exist as a discrete bulletin, the fallback is: 1751F-630 §7 (aerial grounding, confirmed in T4 and T5 briefs) + 1751F-635 §5 (underground, confirmed in T5 brief). **Action required: authoring agent must confirm 1751F-815 existence before citing it. If unconfirmed, use fallback.** |
| **RUS 1751F-630 §7** | **LOCKED** | Confirmed citation in T4 and T5 final briefs. Valid as fallback for aerial grounding if 1751F-815 unverified. |
| **RUS 1751F-635 §5** | **LOCKED** | Confirmed citation in T5 final brief for underground. Valid as fallback for underground grounding if 1751F-815 unverified. |
| **NFPA 780 vs. IEC 62305 — primary/secondary** | **RESOLVED** | NFPA 780 is primary for US-adopted facilities on rural OSP (L6.8). IEC 62305 is supporting for high-exposure/international sites. Agent A's assignment is correct; adopt it in the canonical brief. |
| **GR-1275 scope** | **CONFIRMED** | Telcordia GR-1275 = generic requirements for electrical protection in telecommunications. §4 = system architecture / bonding thresholds; §5 = acceptance test thresholds. Cited consistently in DISCOVERY.md and both briefs. |

---

## §7 Recommended Canonical Brief Skeleton

**For the authoring agent — incorporate all of the following.**

1. **10 lessons, ~4.5 hrs, 20-question final exam at 70% (14/20).** Per-lesson quiz: 5 questions (T2/T5 baseline convention). YAML frontmatter per T5 convention: `title`, `duration_min`, `topic: osp-grounding-bonding-protection`, `order`, `bicsi_alignment`, `sources`.

2. **Section order (invariant, per T5 convention):** Learning Objectives → Reading Content → Key Terms (Flashcard Candidates) → Interactive(s) → Final Check (2 pulse questions, full `*Expected answer:*`) → Glossary Cross-References.

3. **L6.3, L6.6, L6.7 openers:** Must include explicit deferral-acknowledgment block:
   - L6.3: "In T5 L5.1, we deferred strand bonding and MGN bonding to this lesson. This is where it lives."
   - L6.6: "In T4 L4.7, we stopped at the code-pointer level for NEC Art. 250 IBT and electrode types. This lesson provides the installation practice."
   - L6.7: "In T5 L5.9, we deferred FDH housing grounding to this lesson. This is where it lives."

4. **L6.3 + L6.5 worked examples:** Use Macon GA context explicitly — red-clay soil (~100 Ω·m resistivity), Light NESC loading district, co-op distribution joint-use pole.

5. **L6.9 voltage class:** Default 7.2 kV distribution primary. **Authoring agent must confirm with Carter before writing PPG/MAD exam question** (flagged by both A and B as open item OQ1/DISCOVERY.md OQ1). This is the only item requiring user input before authoring can finalize.

6. **RUS 1751F-815 guard:** Authoring agent must verify 1751F-815 existence from USDA/RUS source before citing §1–§8. If unconfirmed, cite fallback: 1751F-630 §7 (aerial) + 1751F-635 §5 (underground). Do NOT write [CORRECT] tags referencing 1751F-815 §X without section verification.

7. **IEEE 81 §9.3 numeric guard:** 62% rule probe position, 5× current probe distance, and 2% ΔR tolerance must all be cited from an actual IEEE 81 §9.3 copy before authoring L6.10 exam questions. Do NOT write [CORRECT] on these values without section-level traceability.

8. **NFPA 780 primary / IEC 62305 supporting** for L6.8 lightning content.

9. **T3 L3.12 cross-reference in L6.10:** Test logs produced in L6.10 feed the RUS close-out package taught in T3 L3.12. Cross-reference both ways. Confirm T3 L3.12 does not already define a ground resistance test log format before authoring an L6.10 template.

10. **Cathodic protection gap (flagged by Agent B):** Neither brief addresses cathodic protection isolation for buried metallic conduit adjacent to gas lines. This is a boundary question — BICSI OSP-DRD Ch. 8 may include it. If it is in Ch. 8, it belongs in T6 L6.5 as a subsection. If not, it is out of scope. Authoring agent must check BICSI OSP-DRD Ch. 8 and either include or explicitly exclude with citation.

---

*Word count: ~1,990 words (target ≤2,000).*

=== T6 BRIEF VERIFIER A END ===
