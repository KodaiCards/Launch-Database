# OSP Topic 5 — Hardware & Accessories: CANONICAL BRIEF B (Adversarial Consolidator)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Consolidator B — adversarial framing (find what both framings missed)
**Inputs read:** BRIEF_FRAMING_A.md · BRIEF_FRAMING_B.md · T4_FINAL_BRIEF.md · T6_DISCOVERY.md · T7_DISCOVERY.md · T2 L2.6 · T3 L3.5 · T3_BATCH_C_BRIEF.md
**Word cap:** 2000 words

---

## 1. Scope Gaps — Hardware Categories Both Framings Missed

| # | Missing Topic | BICSI OSP-DRD Section | Could Attach To | Assessment |
|---|---|---|---|---|
| **G1** | **Galvanic compatibility of strand attachments** — steel strand (ASTM A475) + aluminum die-cast pole hardware (e.g., aluminum suspension brackets common in some RUS-approved hardware sets) creates a galvanic cell in wet environments. Neither framing mentions compatibility checks or use of zinc-plated or isolating washers. | Ch. 6.3 (hardware material notes) | L5.1 (pole hardware selection matrix) | **HIGH RISK.** PSC RUS routes use joint-use poles with mixed metals. Authoring L5.1 without this produces a selection matrix that is correct for dry conditions and wrong for the coastal-project overlay that T4 L4.2b established. |
| **G2** | **ADSS-specific aerial support hardware** — preformed wire grips (dead-ends for ADSS), AGS (Armor Grip Suspension) assemblies, and fiber-compatible sheaves are entirely absent from both framings. Both assume lashed-cable primary. T7_DISCOVERY.md L7.3 (ADSS) and L7.5 (stringing equipment) treat ADSS as a parallel aerial track — which means L5.2 and L5.3 would be teaching hardware that doesn't apply to ADSS installations and creating a curriculum gap for the other aerial plant type. | Ch. 6.3 (ADSS suspension hardware) | L5.2 (strand/messenger) or a new L5.2b split, OR addressed as a structural sidebar | This is the unresolved DISCOVERY.md open question that **neither framing resolved** before building a lesson outline around it. Framing A notes lashed-primary; Framing B flags the unresolved split but also proceeds with a lashed-primary outline. The outline silently commits to lashed. |
| **G3** | **Pole grading and ANSI O5.1 wood-pole species/class selection** — T5 assumes poles exist and covers attachment hardware only. But on RUS-funded rural builds, designers specify poles (species, class, treatment) as part of the BOM. The ANSI O5.1 grading criteria (Class 1 through 7, species-specific circumference tables) govern whether a new pole can carry the proposed attachment per NESC Rule 261 loading. Neither framing includes this or explicitly defers it (Topic 7 L7.4 covers make-ready execution but not pole specification). The gap creates an unowned topic — the BOM item appears nowhere in the curriculum. | Ch. 6.3 (pole hardware + design) | L5.1 sidebar, or a note to defer explicitly to T7 L7.4 with a clear deferral statement | **MEDIUM.** Omission won't cause exam errors but will produce a training gap where students don't know who owns pole specification. |
| **G4** | **Conduit-transition fittings and pull-through hardware** — L5.6 covers handholes and manholes as structures but neither framing covers the hardware inside the conduit entry: bell-end adapters, duct plugs, conduit seals (Tyco/Dura-Line style), and innerduct couplers. These are T5 BOM line items; T3 L3.5 and T7 L7.10 cover conduit installation but not the hardware itself. | Ch. 6.1–6.2 | L5.6 (underground hardware) — attach as a subsection | **LOW–MEDIUM.** Covered as an aside in the brief but not as a quiz-able knowledge node. If the daily-job hook is "build a BOM," this hardware will be missing from the exercise answer. |
| **G5** | **Aerial cable storage brackets (pole-mounted coil storage)** — L5.11 covers slack racks and snowshoes in vault/manhole contexts only. T7_DISCOVERY.md L7.15 mentions "aerial storage at pole (3–5 loops, 18 in. diameter on storage bracket)" during QA. Neither T5 framing includes this hardware, its minimum coil diameter spec, or the attachment hardware to the pole. | Ch. 8.1 | L5.11 (storage hardware) | **LOW.** Quick addition; prevents a gap in the storage-method decision table that both framings propose. |

---

## 2. Scope Overlaps With Other Topics

| # | T5 Lesson | Overlapping Topic/Lesson | Overlap Content | Risk |
|---|---|---|---|---|
| **O1** | L5.6 (underground hardware — handholes/manholes) | T3 L3.5 (underground route design — handholes + pull-box sizing) | T3 L3.5 explicitly teaches NEC Ch. 9 pull-box sizing (8× straight, 6× angle) and handhole spacing. Framing A's L5.6 also teaches NEC Ch. 9 pull-box sizing. Same standard, same formulas, different lesson number. | **HIGH.** Risk of authoring L5.6 as a re-derivation of L3.5. The brief must say "do NOT re-derive pull-box sizing math — cross-ref T3 L3.5" exactly as T4 does for clearances. Neither framing adds this guard explicitly. |
| **O2** | L5.7 (direct-bury marking — tracer wire, marker posts) | T3 L3.6 (direct-bury route design — marker tape placement) | T3 L3.6 mentions warning tape placement. T7 L7.6/L7.7/L7.15 cover marker tape verification during installation. All three touch the same three-layer marking system. The framings claim T5 owns the "full" three-layer spec — but T3 L3.6 already established depth and tape type in the Batch C cross-read (RED-FLAG material in T3 Batch C Brief §4). | **MEDIUM.** The T5 brief should cite what T3 established and what T5 adds (tracer wire + marker post specs + RFID), not re-derive what T3 already locked in. |
| **O3** | L5.8 (pedestals/cabinets — NEMA ratings) | T4 L4.12 (IEC/NEMA cross-reference) | Both framings correctly note this cross-ref. But neither says **do NOT re-derive the NEMA 250 ↔ IEC 60529 mapping table** — the language is "cross-reference T4 L4.12" not an explicit authoring guard. Authors may rederive the table, creating two versions with possible value-level drift. | **MEDIUM.** Needs the same explicit "do NOT re-derive" guard language used in T4. |
| **O4** | L5.9–L5.10 (FDH/MST hardware) | T6 L6.7 (co-located equipment bonding — FDH housing grounding) + T6 L6.3/6.4 (messenger and aerial closure grounding) | T5 covers the FDH as a terminal hardware unit. T6 L6.7 covers bonding the FDH housing to the utility pole ground. The framing correctly defers grounding to Topic 6 but neither framing states this explicitly enough: authors may insert a "note on grounding" in L5.9 that conflicts with T6 L6.7 before T6 is authored. | **MEDIUM.** Add explicit deferral language in L5.9 brief: "Do not cover FDH housing grounding — owned by T6 L6.7." |
| **O5** | L5.1 (pole hardware — vibration dampers) | T7 L7.2 (messenger and lashing machine — dead-end wraps) + T7 L7.4 (make-ready execution) | Both T5 L5.1 and T7 L7.2/L7.4 can touch Stockbridge damper placement. T5 owns "what it is and why it's selected"; T7 owns "how it's installed." Neither brief names the boundary explicitly. | **LOW.** Unlikely to cause authoring conflict but worth a one-line deferral statement in L5.1. |

---

## 3. Lessons Sized Wrong

| Lesson | Claimed Duration | Actual Effort Estimate | Basis |
|---|---|---|---|
| **L5.2 Strand and Messenger** | 25 min | **40–45 min** | Contains: (a) three steel grade definitions with RBS table lookup, (b) NESC 2.0× safety factor derivation for a worked scenario (parabolic sag + horizontal tension + grade → RBS check), (c) ADSS vs. lashed contrast (both framings include this), (d) galvanizing class A/B/C. This is the same scope problem T4 L4.2 had — clearances + loading districts couldn't fit 25 min and required a split. The strand lesson has the same depth-vs-time issue. T4's patch verification Worker B explicitly clocked a comparable multi-subtopic lesson at 40–45 min minimum. At 25 min, the RBS worked example will be cut, exactly removing the highest-value content in the lesson. |
| **L5.6 Underground Hardware** | 30 min | **30–35 min (acceptable, but tight)** | Already the longest lesson at 30 min. Contains: handhole tier selection (AASHTO matrix), pull-box sizing math (NEC Ch. 9), manhole types, cable rack spacing, and OSHA 1910.146 awareness pointer. If O1 overlap guard is properly applied (no re-derivation of T3 L3.5 content), 30 min is achievable. Without the guard, authors will add re-derived pull-box math and push this to 50+ min. |
| **L5.9 FDH Port Sizing** | 25 min | **30–35 min** | The FDH sizing scenario worked example (service area → split ratio → growth factor → port count → cassette architecture → SC-APC vs. LC-APC migration decision) is ~15 min of content on its own. Adding construction-grade vs. rack-mount differentiation and passive splitter cassette architecture brings actual depth to ~35 min. Comparable to T4's high-intensity lessons (L4.8 conduit fill: 25 min, also tight). Recommend tagging L5.9 HIGH-INTENSITY and either trimming the cassette architecture detail or extending to 30 min. |
| **L5.12 Labeling** | 25 min | **20 min** | Framing A's worked example (TIA-606-C string construction) is a ~5-step deterministic procedure — very compact. RFID mention is a one-paragraph aside. Marker post intervals and tag material specs are quick recall items. This lesson is closer to 18–20 min of substantive content. If held at 25 min, padding risk is high (authors will add re-taught TIA-598-D color codes that T4 already owns). Trim to 20 min and add the authoring guard: do NOT re-teach TIA-598-D color positions. |

---

## 4. Citation-Edition / Standard-Currency Risks

| # | Standard | Edition/Version Issue | Risk |
|---|---|---|---|
| **C1** | **ASTM A475** (steel strand, SM/HS/EHS grades) | Last revision was 2003 (reapproved 2014). ASTM A475 was **withdrawn and replaced by ASTM A475/A475M-03** — verify current status; some RUS bulletins now reference ASTM A475M. If the lesson cites "ASTM A475" without the M suffix, procurement engineers on RUS projects may reject the citation as a superseded standard designation. | **HIGH.** Quiz answers using RBS values from A475 vs. A475M may diverge if the metric version carries different table formatting. Authoring guard required: cite as "ASTM A475/A475M" and derive RBS values from the current table. |
| **C2** | **AASHTO H-load tier system** | AASHTO H-load tiers (H-10, H-15, H-20, H-25) are from the Standard Specifications for Highway Bridges. The current reference for underground vault load classes is **AASHTO LRFD Bridge Design Specifications** (9th ed., 2020). The tier numbering (Tier 8/15/22) used in the framing maps to AASHTO H-loads but is NOT the verbatim AASHTO designation — it is a vendor-popularized shorthand (Quazite/Oldcastle catalog language). The exam question "select Tier 22 for H-20 loading" conflates the vendor tier label with the AASHTO design load. A learner who looks up AASHTO will not find "Tier 22." | **HIGH.** Either (a) cite the AASHTO load class (H-20) as the primary spec and the vendor tier as the derived selection criterion, or (b) cite ANSI/SCTE 77 (Specification for Telecommunications Enclosures) which does formalize a tier system (Tier 1–4 by load class) that is more directly citable than the Quazite shorthand. Both framings use the informal tier label as if it were a primary standard. |
| **C3** | **RUS Bulletin 1738** (cited in L5.9, L5.10 as FDH approval anchor) | Bulletin 1738 governs the Distance Learning and Telemedicine (DLT) grant program — a distinct USDA program from the standard RUS telecom loan program that governs PSC-program work. FDH approval criteria for standard RUS telecom loans are in **7 CFR Part 1755 Subpart D** (List of Materials) and the applicable PE-60 approved equipment form. Framing A's §7 open question Q2 identified this; neither framing resolved it before building the lesson outline on RUS 1738 citations. | **CRITICAL.** If PSC contracts are funded under the standard 7 CFR 1755 loan program (not 1738), the FDH lesson will teach the wrong approval pathway. This is a RUS-primary framing violation — the wrong bulletin is cited first. Must resolve before authoring L5.9/L5.10. |
| **C4** | **TIA-758-C §5.3 lashing gap "≤1.5 in."** | Framing A open question Q3 correctly identifies that the 1.5 in. gap figure may not appear verbatim in TIA-758-C §5.3. T7 L7.2 (authored in DISCOVERY) also uses "≤1.5 in." as an acceptance criterion without pinning the source. If this value is sourced from PLP installer practice notes (a non-normative vendor document), a quiz question with [CORRECT] on "≤1.5 in." citing TIA-758-C would fail the red-team math-consistency check. | **HIGH.** Neither framing resolved this before including lashing gap as a flashcard data point. Must verify source before authoring L5.3. |
| **C5** | **ANSI O5.1 for pole grading** | Neither framing cites it. Gap G3 above. If pole specification enters L5.1 (recommended), the edition should be confirmed: ANSI O5.1-2015 is current as of 2026. | **LOW** (only if G3 is incorporated). |
| **C6** | **ANSI/SCTE 77** (Specification for Telecommunications Enclosures) | Neither framing cites it at all. SCTE 77 is the actual standards body that formalizes handhole/manhole tier classifications for telecommunications use — it maps to load classes that correspond to AASHTO vehicle loads. It is more directly applicable than raw AASHTO highway bridge specs for a telecom training context. | **MEDIUM.** Not a citation error per se (AASHTO is correct), but SCTE 77 is the telecom-industry-standard wrapper that makes the AASHTO load class accessible to a designer without a bridge engineering background. |

---

## 5. Most-At-Risk Lessons for Authoring Errors

### L5.2 — Strand Grade Selection

**Risk:** Author writes the RBS-vs-NESC-safety-factor scenario by picking grade first, then checking if it fits — the "feel" approach. The correct derivation is: (1) calculate cable + messenger weight/ft from cable OD, (2) apply parabolic sag formula at NESC Light loading, (3) compute horizontal tension, (4) pick the ASTM A475/A475M grade whose RBS ÷ 2.0 exceeds horizontal tension. If the author works backwards, the [CORRECT] option is right by coincidence for the example numbers but fails on any span variant. **Instruction to author:** derive tension to 2 decimal places before selecting grade; verify that all three grade options (SM, HS, EHS) produce different numeric pass/fail results so the scenario discriminates correctly.

### L5.9 — FDH Port Sizing

**Risk 1:** The growth-factor math is trivially wrong at authoring time in ~30% of scenario cases (see T2 Q20/Q13 experience in TOPIC_2_COMPLETE.md known gaps). Framing B uses 1.2 growth factor; Framing A uses 1.15; they produce different port counts (231 vs. 221) for the same 192-subscriber base. The [CORRECT] option depends on which growth factor is locked in the brief — and neither framing locks one. **Instruction:** lock the growth factor in the canonical brief (recommend 1.2 per Framing B) and derive port count to integer with explicit ceiling step shown.

**Risk 2:** RUS 1738 vs. 7 CFR 1755 citation (C3 above) — if unresolved at authoring time, author will cite whichever they encounter first in their research. **Instruction:** resolve the citation before dispatch; give the author one citable source.

### L5.6 — Underground Hardware / Handhole Tier Selection

**Risk:** AASHTO tier vs. SCTE 77 vs. vendor tier conflation (C2 above). Author writes a [CORRECT] option referencing "Tier 22" as if it's a primary AASHTO designation; a learner who checks AASHTO LRFD will not find it. The quiz becomes un-verifiable. **Instruction to author:** (a) anchor the primary citation to ANSI/SCTE 77 or AASHTO load class (H-20); (b) present vendor tier (Tier 22) as the derived catalog selection from that load class; (c) do NOT write a quiz stem that asks "what AASHTO tier is required for H-20 loading" — that question has no valid AASHTO answer in the format the framing proposes.

---

## 6. Inherited Authoring Convention Violations the Framings Would Create

| # | Convention (from T2–T4) | How T5 Framings Would Break It |
|---|---|---|
| **V1** | **Pulse question count: exactly 2 per lesson, mandatory, with full worked expected answers.** T3 Batch C Brief §4 makes this explicit; T4 §4 repeats it. | Neither T5 framing specifies pulse question count, content, or worked-answer format. An author reading only the T5 brief could omit pulse questions or write them without expected answers. |
| **V2** | **Section structure is invariant:** Learning Objectives → Reading Content → Key Terms → Interactive(s) → Final Check → Glossary Cross-References. T3 Batch C locked this. | T5 framings describe interactive types and quiz density but do not restate the mandatory section structure. A new author dispatched with only the T5 brief won't know the order. |
| **V3** | **Quiz density locked at T2 baseline: 5 questions per lesson quiz.** T2 delivered 5 Qs/lesson consistently across all 12 lessons. T5 Framing A's final exam has 1 Q for L5.4 and L5.11 — but the **per-lesson quiz** density is separate from the final exam. Neither framing states the per-lesson quiz count. | If author defaults to "however many seems right," quiz density will be inconsistent with T2/T3 convention. |
| **V4** | **RUS bulletin cited first when co-applicable.** T3 Batch C §3 rule 3: "RUS Bulletin is always cited alongside ANSI/TIA-758-C where both apply. RUS value is called out when it differs." | T5 Framing A reverses this in L5.12 citation matrix (TIA-606-C listed before any RUS form). Minor but inconsistent with the RUS-primary rule. |
| **V5** | **YAML frontmatter is mandatory.** T3 lesson files all open with YAML: `title`, `duration_min`, `topic`, `order`, `bicsi_alignment`, `sources`. Neither T5 framing names the YAML keys or the `topic` slug for T5 (`osp-hardware-accessories`?). | Authors will invent a slug, producing Moodle import inconsistencies when the topic slug doesn't match the registered Moodle category. |

---

## 7. Open Questions Neither Framing Raised

**OQ1 — ANSI/SCTE 77 vs. AASHTO as primary handhole citation.** Both framings assume AASHTO as the authority for handhole tier loads. ANSI/SCTE 77 is the telecommunications-industry standard specifically designed to make AASHTO vehicle loads accessible to OSP designers. Which citation is the orchestrator's preferred primary for L5.6 quiz questions? This is authoring-consequence-material: a quiz question that says "per AASHTO" and one that says "per ANSI/SCTE 77" could both be correct but confuse a learner.

**OQ2 — Growth factor to use in FDH sizing scenario.** Framing A uses 1.15; Framing B uses 1.20. These produce different port counts (221 vs. 231 → both round up to 288-port, so the final answer happens to agree, but on a different subscriber base they diverge). A canonical brief must lock the growth factor so all exercises and exam questions produce the same correct answer. The orchestrator should pick one and record it here.

**OQ3 — Topic slug for Moodle frontmatter.** Topics 1–3 use `osp-cable-selection`, `osp-splice-termination`, `osp-survey-route` (confirmed from content file frontmatter). Topic 5 needs a slug. Neither framing specifies one. The slug feeds Moodle category assignment and the SSO bridge in `launch-database`. If the slug doesn't match the Moodle category name, all T5 lessons will import to the wrong category. Propose: `osp-hardware-accessories`. Orchestrator should confirm.

---

=== T5 CANONICAL BRIEF B END ===
