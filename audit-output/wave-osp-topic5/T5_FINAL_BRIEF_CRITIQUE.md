# OSP Topic 5 — T5 Final Brief: Critique Worker B

**Role:** Adversarial critique of Worker A's unilateral merge decisions  
**Inputs:** CANONICAL_BRIEF_A.md (accbfcf) · CANONICAL_BRIEF_B.md (b1018a3)  
**Date:** 2026-05-14  
**Word cap:** 1500  

---

## 1. Seven Pre-Resolved Decisions — Verdict Table

| # | Decision | Verdict | Strongest Counter-Argument | Alternative Proposal | Decision Criterion |
|---|---|---|---|---|---|
| **1** | G1 Galvanic → L5.1 callout with NACE SP0286 | **DISAGREE** | Worker A's brief never cites NACE SP0286 anywhere in the lesson plan, citation matrix, or escalation queue. L5.1's citation matrix reads "NESC Rules 261, 238 → IEEE 1222 §6; BICSI OSP-DRD Ch. 6.3 → RUS 1715E-110 §4." NACE is absent. A's D1 sidebar mentions a "galvanic-compatibility note at pole hardware attachments" but gives no standard to anchor it. A quiz answer citing galvanic compatibility without a normative source fails the red-team citation-plausibility check. | Add NACE SP0286 explicitly to L5.1's citation matrix as a supporting standard. The callout exists in intent only; authoring guard must name the standard. | Does NACE SP0286 appear verbatim in the L5.1 citation matrix before authoring is dispatched? If yes: agree. If no: the galvanic callout is teaching content without a citable anchor — reject. |
| **2** | G2 ADSS → lashed-primary + ADSS sidebar in L5.2 | **UNSURE** | A's resolution (D3) collapses all ADSS hardware into "2 paragraphs" in L5.2. CANONICAL_BRIEF_B (G2) demonstrates this is structurally insufficient: preformed wire grips, AGS assemblies, and fiber-compatible sheaves are a distinct hardware family. T7 L7.3 and L7.5 treat ADSS as a parallel track. A 2-paragraph sidebar in L5.2 teaches "ADSS exists" without teaching hardware selection — a direct-job-value miss. | Adopt a named sidebar subsection in L5.2 (not just "2 paragraphs"): 3–4 paragraphs covering preformed grips, AGS assembly, and sheave type, with one dedicated flashcard row. No split lesson needed if the sidebar is substantive. | If office ADSS installation frequency is >0 on live projects, the sidebar must be substantive enough to support a hardware BOM decision. If ADSS is never installed (lashed-only shop), 2 paragraphs is fine. Escalate to user per CANONICAL_BRIEF_A escalation queue E1. |
| **3** | G3 ANSI O5.1 pole grading → 5–7 min section in L5.1 | **DISAGREE** | Worker A made the opposite decision by omission: L5.1 covers only attachment hardware (bands, brackets, dampers). ANSI O5.1 pole class/species specification does not appear in A's lesson plan at any depth. A's §6 cross-topic map does not reference O5.1. This leaves an unowned BOM line item (RUS rural builds require pole specification) that sits in no topic. CANONICAL_BRIEF_B (G3) correctly flags this as a curriculum gap. | Include a named 4–5 min subsection in L5.1: "Pole Class and Species Selection (ANSI O5.1 Overview)" — define Class 1–7 circumference requirements, flag species-specific tables, state that full make-ready loading analysis is T7 scope. Adds ~5 min but closes the orphaned topic. Alternative: add an explicit deferral statement to T7 L7.4 with a forward reference. | If T7 L7.4 explicitly owns pole class specification in its already-authored brief, deferral is correct. If T7 L7.4 covers only make-ready execution (as CANONICAL_BRIEF_B states), deferral orphans the topic and a brief L5.1 subsection is required. |
| **4** | L5.6 handhole citation → ANSI/SCTE 77 primary; AASHTO H20/H25 cross-ref | **DISAGREE** | Worker A's L5.6 citation matrix lists "AASHTO H-load tiers" as the primary citation and never mentions ANSI/SCTE 77. CANONICAL_BRIEF_B (C2, OQ1) demonstrates this is a material error: "Tier 8/15/22" is vendor shorthand (Quazite/Oldcastle catalog language), not a verbatim AASHTO designation. A learner who opens AASHTO LRFD will not find "Tier 22." A quiz question asking which AASHTO tier applies to H-20 loading has no verifiable AASHTO answer in that format. ANSI/SCTE 77 is the telecom-industry standard that formalizes the tier system — it is the correct primary. | Flip the citation hierarchy: ANSI/SCTE 77 primary (tier system for telecom enclosures), AASHTO H-load class as the underlying load spec it references (H-20 → Tier 22 mapping). This makes the quiz question verifiable by learners without bridge-engineering access. | If ANSI/SCTE 77 edition is confirmed current (2017 or later) and the tier-to-AASHTO mapping table appears verbatim in that document, Worker A's framework is fixable by swapping primary citation. If SCTE 77 is unavailable in the office's standard library, AASHTO primary with explicit note that "Tier 22" is a vendor catalog term is acceptable as fallback. |
| **5** | L5.9 FDH growth factor → 1.20 locked | **DISAGREE** | Worker A's brief implicitly uses 1.15, not 1.20. L5.9 interactive element reads: "192 homes, 1:32 split, **15% growth** → derive port count." 192 × 1.15 = 220.8 → ceil = 221 ports. CANONICAL_BRIEF_B (OQ2) flags that Framing A and Framing B use different growth factors (1.15 vs. 1.20), producing different port counts (221 vs. 231). At 288-port FDH, both round to the same tier in this specific example — but with a different subscriber base they will diverge and produce different [CORRECT] answers. The orchestrator's intended resolution is 1.20 locked; A's brief does not reflect that. | Set growth factor = 1.20 explicitly in the L5.9 lesson brief. Restate worked example: 192 × 1.20 = 230.4 → ceil = 231 ports → 288-port FDH tier. This is the decision criterion for every future exercise and exam. Authoring guard: "Growth factor = 1.20 per CANONICAL brief. Do not use 1.15." | Single factual fix. Orchestrator confirms 1.20; Worker A updates L5.9 interactive element before authoring dispatch. |
| **6** | Moodle topic slug → `osp-hardware-accessories` | **UNSURE** | Worker A's brief contains no Moodle slug, no YAML frontmatter specification, and no `topic` field definition anywhere. This is a complete omission, not a decision. CANONICAL_BRIEF_B (V5, OQ3) correctly flags that an unknown slug will produce Moodle category import mismatches and SSO bridge failures in `launch-database`. `osp-hardware-accessories` is a reasonable slug but must be confirmed against the registered Moodle category name. | Adopt `osp-hardware-accessories` as proposed and add it to the canonical brief explicitly: (a) in a "Moodle + YAML Config" section, (b) as a mandatory authoring instruction listing all required YAML keys: `title`, `duration_min`, `topic: osp-hardware-accessories`, `order`, `bicsi_alignment`, `sources`. This closes V5. | Confirm the slug matches the exact string registered in the Moodle category table. If the category was created with a different string (e.g., `osp-hardware` or `topic-5-hardware`), the slug must match that string, not a logical synonym. |
| **7** | L5.2 split → L5.2a + L5.2b, total 13 lessons | **DISAGREE** | Worker A explicitly rejects this split: A's plan is 12 lessons with L5.2 "Strand and Messenger Wire" at 25 min. CANONICAL_BRIEF_B (sizing analysis) independently calculates the real L5.2 scope at 40–45 min: three steel grade definitions with RBS table, NESC 2.0× safety factor parabolic sag derivation, ADSS contrast, and galvanizing class. T4's analogous lesson (L4.2 clearances + loading districts) hit the same depth-vs-time problem and required a documented split. A's 25 min estimate will force the author to cut the RBS worked example — exactly the highest-value content in the lesson. | Split L5.2: **L5.2a** "Strand Grades, ASTM A475/A475M, and RBS Tables" (20 min) + **L5.2b** "Strand Selection: NESC Loading, Sag-Tension, and Safety Factor" (25 min). Total adds 20 min to topic duration (now ~5 hr 45 min, 13 lessons). This preserves the worked scenario without compression. | If the sag-tension derivation can be reduced to a table-lookup (pre-computed values for NESC Light district at standard spans) rather than a live parabolic calculation, L5.2 may fit 30 min unsplit. Red team should time a rehearsal read of the draft L5.2 content before authoring is finalized. |

---

## 2. Implicit Decisions Worker A Is Making

| # | Implicit Decision | Verdict | Risk |
|---|---|---|---|
| **I1** | Lesson ordering: aerial (5.1–5.5) → underground (5.6–5.7) → enclosures (5.8–5.10) → storage/labeling (5.11–5.12). | **AGREE** — Field-workflow order. Prerequisites satisfied: NESC loading (T4 L4.2b) before strand selection (L5.2); underground burial (T3 L3.5) before structure selection (L5.6); NEMA ratings (need T4 L4.12 lookup, correctly cross-referenced before L5.8). | Low. Sequence is sound. |
| **I2** | Per-lesson quiz density = unstated (implied 5 Qs/lesson from T2/T3 convention). | **UNSURE** — A's brief never states per-lesson quiz count. If authors default to "as many as seem right," density will vary. | Medium. V3 in CANONICAL_BRIEF_B identifies this gap. Add explicit authoring instruction: "5 quiz questions per lesson, matching T2/T3 baseline." |
| **I3** | HIGH-INTENSITY tagging: L5.2, L5.6, L5.7 tagged HIGH; L5.9 tagged HIGH-INTENSITY. | **DISAGREE on L5.7.** L5.7 (direct-bury marking) is a three-component recall task — tape color, tracer wire spec, marker post interval. The "scenario" is a BOM assembly, not a math derivation. Compared to L5.2 (sag-tension math) and L5.9 (port-sizing math), L5.7 is STANDARD intensity. Mislabeling affects learner pacing and production scheduling. | Low-medium. |
| **I4** | Pull-box sizing math is re-derived in L5.6 (NEC Ch. 9 8× / 6× formulas). | **DISAGREE** — CANONICAL_BRIEF_B (O1) identifies this as a HIGH-risk re-derivation of T3 L3.5 content. A's interactive element for L5.6 explicitly includes "scenario (pull-box sizing for 4-conduit bank)" — this is the same exercise T3 L3.5 owns. The authoring guard "do NOT re-derive pull-box sizing — cross-ref T3 L3.5" is absent from A's brief. | High. Without the guard, L5.6 will duplicate T3 L3.5 math, creating two versions that may drift numerically. |
| **I5** | FDH grounding is silently deferred (T6 scope assumed). | **UNSURE** — A's brief has no explicit deferral statement for FDH housing grounding in L5.9. Authors may add a "grounding note" that conflicts with T6 L6.7 before T6 is authored. | Medium. Add one-line deferral: "FDH housing bonding and grounding — owned by T6 L6.7. Do not cover in L5.9." |
| **I6** | Authoring split: L5.1–5.6 to Author A, L5.7–5.12 to Author B. | **AGREE** — Coherent seam. NESC/ASTM-heavy aerial block vs. enclosure/terminal/identification block. No single-lesson cross-cut required. | Low. |
| **I7** | Citation density: RUS bulletins cited in L5.2, 5.3, 5.6, 5.7, 5.11, 5.12; 7 CFR / PE-60 in L5.9–5.10. | **AGREE** — Distribution matches lesson scope. RUS 1715E-110 §3 in strand, 1751F-630 in lashing/aerial, 1751F-635 in underground/marking/storage. Consistent with RUS-primary authoring convention. Minor flag: L5.12 citation matrix lists TIA-606-C before RUS Form 515c (V4 in CANONICAL_BRIEF_B). Swap order to maintain RUS-primary rule. | Low. One-line fix. |

---

## 3. Three Highest-Confidence Challenges

**Challenge 1 — AASHTO vs. ANSI/SCTE 77 (Decision 4, L5.6)**  
This is the highest-stakes citation error in the brief. "Tier 8/15/22" is Quazite/Oldcastle vendor catalog language. No AASHTO document uses those tier numbers. A learner who tries to verify a quiz answer against AASHTO LRFD will find H-10/H-15/H-20/H-25 load classes — not tiers. Any exam question that reads "which AASHTO tier..." is un-verifiable from primary sources. ANSI/SCTE 77 formalizes the tier system for telecom enclosures and maps to AASHTO load classes. It is the correct primary citation. Worker A must fix this before L5.6 is authored — otherwise the exam question is structurally broken.

**Challenge 2 — Growth factor mismatch (Decision 5, L5.9)**  
Worker A's brief says "15% growth" (factor 1.15). The orchestrator-intended resolution is 1.20. The delta is small on a 192-home example (221 vs. 231 → both fit a 288-port FDH) but the mismatch will cause divergent [CORRECT] answers on any alternate exam question with a different subscriber count. This is a math-consistency failure by the T2 red-team standard. Lock 1.20 explicitly; restate the worked arithmetic.

**Challenge 3 — L5.2 duration underestimate causing RBS worked example to get cut (Decision 7)**  
A's 25-min estimate for L5.2 cannot hold the full scope: three grade definitions + RBS table lookup + NESC 2.0× safety factor parabolic sag derivation + ADSS contrast + ASTM A475/A475M edition note. That's 40–45 min of content. The pressure point is the worked scenario — the parabolic sag calculation is the highest-value pedagogical content in the lesson and the first thing an author will cut under a 25-min constraint. Losing that scenario converts L5.2 from "can specify strand on a RUS route" to "can recall grade names" — a significant regression in learner outcome. Splitting (2a/2b) or extending to 30–35 min is required.

---

## 4. Open Questions Worker A Left Unflagged

1. **ASTM A475 vs. A475M currency** — CANONICAL_BRIEF_B C1 flags that ASTM A475 was reissued with an M suffix for metric designation. RUS bulletins may now reference A475M. If the lesson cites only "ASTM A475," procurement engineers on RUS projects may flag the citation as superseded. Quiz answer RBS values must be derived from the current table. Worker A's brief uses "ASTM A475" throughout without addressing edition currency.

2. **Pull-box sizing ownership (T3 L3.5 vs. L5.6)** — No authoring guard against re-derivation. Risk is HIGH (see I4 above). One explicit sentence needed: "Do not re-derive NEC Ch. 9 pull-box sizing formulas — cross-reference T3 L3.5 as the establishing lesson."

3. **Moodle YAML slug and frontmatter spec** — Completely absent from Worker A's brief. Authors dispatched without a confirmed slug will invent one, breaking Moodle category mapping and the `launch-database` SSO bridge. This is an operational failure mode, not a content quality issue.

4. **FDH grounding deferral to T6 L6.7** — No explicit deferral statement in L5.9. Authors may insert a grounding note that conflicts with T6 before T6 is authored. One line prevents this.

5. **Conduit-transition fittings (G4 from CANONICAL_BRIEF_B)** — Bell-end adapters, duct plugs, conduit seals, innerduct couplers. These are T5 BOM line items missing from the L5.6 scope. If the daily-job hook is "build a complete BOM," the exercise answer will be incomplete. Worker A did not address G4 at all — not adopted, not explicitly rejected.

---

## 5. Net Recommendation

**Adopt with modifications — do not adopt as-is; do not re-merge.**

Worker A's 12-lesson sequence, cross-topic reference map, authoring split, and pre-resolved decisions D1–D5 are structurally sound and well-documented. The framework is adoptable. But five specific items must be resolved before authoring dispatch:

1. **Fix Decision 4** — swap ANSI/SCTE 77 to primary citation in L5.6; demote AASHTO to load-class reference. Non-negotiable; the current framing produces un-verifiable exam questions.
2. **Fix Decision 5** — change growth factor from 1.15 to 1.20 and restate worked arithmetic in L5.9.
3. **Fix Decision 7** — split L5.2 into 2a + 2b, or explicitly extend to 30–35 min and acknowledge the sag-tension math is being table-lookup simplified (not derived live). State the choice explicitly.
4. **Add pull-box sizing guard** — one sentence in L5.6 brief: "Do not re-derive NEC Ch. 9 formulas — cross-reference T3 L3.5."
5. **Add Moodle slug + YAML spec** — confirm `osp-hardware-accessories` against the registered Moodle category string; add YAML key list to §5 authoring conventions.

Secondary (lower urgency, but needed before red-team authoring check): add NACE SP0286 to L5.1 citation matrix; add FDH grounding deferral in L5.9; downgrade L5.7 from HIGH to STANDARD intensity; address G4 conduit fittings disposition; confirm ASTM A475/A475M edition.

---

=== T5 FINAL BRIEF CRITIQUE B END ===
