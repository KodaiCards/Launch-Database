# OSP Topic 4 — Codes & Standards: Canonical Brief B (Adversarial Consolidation)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Consolidator B — adversarial framing. READ-ONLY w.r.t. lesson content.
**Word cap:** 2000 words

---

## §1 Scope Gaps Both Framings Missed

| # | Missing topic | BICSI domain location | Attach to | Risk |
|---|---|---|---|---|
| G1 | **NEMA 250 enclosure ratings** — both framings teach IEC 60529 (IP ratings) in L4.12 but never map NEMA 250 (the U.S. standard inspectors quote) to IEC equivalents. T5 L5.8 teaches NEMA selection; T4 never gives the code basis. | OSP-DRD Ch. 2.7 | L4.12 | Student specifies NEMA 3R where IP68 required; closure floods. |
| G2 | **ANSI/TIA-455 FOTP series** — both framings cite TIA-526-14-B/-7 in L4.11 without noting TIA-455 as the parent test-procedure series (FOTP-61 is the OTDR measurement method underlying TIA-526). BICSI OSP-DRD Ch. 9.1 references FOTP procedures. Authors writing L4.11 rationale blocks will conflate the test standard with the measurement method and produce citation-level errors. | OSP-DRD Ch. 9.1 | L4.11 | Wrong citation in exam rationale; contradicts T2 L2.10 sourcing. |
| G3 | **IEEE Std 1222 (ADSS span rating)** — both framings treat NESC Part 2 as the sole technical authority for aerial spans. T3 L3.4 already cites "IEEE 1222 §5" as the sag-tension method source. L4.2 written without IEEE 1222 leaves learners unable to trace NESC loading district → sag-tension table → midspan clearance. | OSP-DRD Ch. 2.2 | L4.2 | Gap between T3 L3.4 (uses IEEE 1222) and T4 L4.2 (NESC only); no bridge standard named. |
| G4 | **NHPA Section 106 / tribal consultation** — neither framing names NHPA as a code reference in L4.15. T3 L3.1 and L3.11 both include THPO/NHPA Section 106 as a permitting layer for RUS-funded projects. L4.15 as the code-reference lesson for federal permits must provide the statutory basis. | OSP-DRD Ch. 2.10 | L4.15 | L4.15 omits the permit category most likely to cause multi-month delays on RUS routes; contradicts T3 L3.11. |

---

## §2 Scope Overlaps with Other Topics

| T4 Lesson | Overlap topic | Exact conflict | Deconfliction |
|---|---|---|---|
| L4.2 NESC Part 2 | T3 L3.3, L3.4 | L3.3 works the identical midspan clearance calc; L3.4 uses the same NESC loading districts. If L4.2 repeats both, it re-teaches T3. | L4.2 = code hierarchy + applicability trigger + rule-number lookup. Defer all worked calculations to T3 cross-reference. |
| L4.3 NESC Part 3 | T3 L3.5, L3.8 | L3.5 derives NESC Rule 354 depths and TIA-758-C §6.3 conflict with a full conduit fill example. L4.3 must not re-derive depths. | L4.3 = code structure (where Rule 354 sits, why TIA-758-C §6.3 is stricter) with explicit T3 L3.5 cross-reference. |
| L4.11 TIA-526 Testing | T2 L2.10, L2.11 | T2 L2.11 teaches the Tier 1 vs. Tier 2 selection decision with a project-type scenario — the same content scoped for L4.11. | L4.11 = the standard document (structure, section references, applicability criteria). Test execution is T2 material. |
| L4.7 NEC Art. 250 | T6 L6.1, L6.2 | T6 L6.2 is explicitly titled "NEC Article 250, NESC §92–99, and IEEE 1100 — Regulatory Framework." L4.7 risks re-teaching T6's code framework. | L4.7 = IBT location (§250.94), electrode types (§250.52), and why OSP triggers NEC Art. 250. Hard stop: "Installation depth = Topic 6." |
| L4.13 OSHA 1910/1926 | T9 L9.1, L9.3 | T9 L9.1 covers the 1926 vs. 1910 applicability trigger verbatim. | L4.13 = CFR table-of-contents literacy only. Zero field safety execution content. |

---

## §3 Lessons Sized Wrong

| Lesson | Claimed | Adversarial estimate | Why |
|---|---|---|---|
| L4.2 NESC Part 2 | 25 min | 40–45 min | Framing A adds Rules 230–231 + a worked midspan calc on top of clearance tables + loading districts. T3 L3.3 (NESC clearances only, no loading) already uses its full 25 min. Adding loading districts (Rules 250–252) plus a fresh code-structure framing on top requires ~40 min or one of the subtopics gets dropped to flashcard-only. |
| L4.12 IEC Standards | 25 min | 35–40 min | Four distinct IEC standards + NEMA 250 mapping (gap G1 above) + IEC 61753 P/O/G vs. TIA-568.3-D cross-framework problem (Framing A Q2). The IP derivation worked example alone is 10 min; the 61753 class-mapping problem is another 10 min. One standard will be under-taught. |
| L4.14 RUS/USDA Bulletins | 25 min | 30–35 min | Framing B's own open question Q2 flags this as undersized. CLAUDE.md §2 confirms RUS-program work is primary. Four bulletins + Form 219 + the deliverable-matrix scenario Framing B proposes already exceeds 25 min. Explicit user decision in §4 (RUS-primary) should override the Discovery estimate here. |
| L4.4 NESC Part 4 Work Rules | 20 min | 15 min (over-sized) | Code-citation-only = 3–4 flashcards + 2 quiz questions. Both framings state explicitly that field safety practice is T9. Padding to 20 min risks authors filling time with T9 content. |

---

## §4 Citation-Edition Risks

| Standard | Edition cited | Risk | Action |
|---|---|---|---|
| NESC | C2-2023 | State adoption lag: most AHJs enforce C2-2017 or C2-2012. Rule numbers and clearance table values differ. | L4.1 must state: "C2-2023 is current; confirm your AHJ's adopted edition before citing rule numbers in submittals." |
| TIA-526-14 | "-14-B" throughout both framings | Framing A Q3 flags that TIA-526-14-C may be current (late 2023). T2 L2.11 cites "-14" without suffix — internal inconsistency if T4 locks "-14-B." | Do not pin the suffix. Write "ANSI/TIA-526-14 [confirm edition before publication]" in L4.11 and cross-check against T2 L2.11. |
| NEC | NFPA 70-2023 | Same state-adoption lag as NESC. Art. 800.100 bonding requirements changed between 2017 and 2020 editions. | Note edition currency and AHJ lag in L4.5, L4.6, L4.7. |
| IEC 61753 | Not edition-pinned in either framing | P/O/G-class IL thresholds vary by edition. An un-pinned citation allows authors to use different edition values. | Pin the edition in the brief. If unconfirmed: flag [UNCONFIRMED EDITION] for red-team verification before ship. |

---

## §5 Most-At-Risk Lessons for Authoring Errors

**L4.2 — NESC Part 2 Clearances:** Highest error-probability lesson. Framing A's worked example (28-ft attachment, 4.2-ft sag, 23.8-ft midspan, 15.5-ft minimum) does not specify road class. NESC C2-2023 Table 232-1 gives 15.5 ft for roads open to commercial traffic and 14 ft for private driveways — a 1.5-ft difference that flips the CORRECT tag depending on which row the author reads. Additionally, this exact worked scenario already appears in T3 L3.3; an authoring agent who treats Framing A's example as verified is anchoring on a potentially unverified number.

*Instruct the authoring agent:* Before writing any Q4.2 clearance scenario, independently derive the answer using these 6 steps: (1) attachment height, (2) loading district, (3) sag at maximum loading, (4) midspan height above grade, (5) applicable Table 232-1 row with road-class specified, (6) margin. Use scenario values different from Framing A to prevent anchoring. Do not reuse Framing A's exact numbers.

**L4.8 — TIA-758-C Conduit Fill:** Framing A's example has a hidden rounding trap. Cable OD = 0.63 in. → radius = 0.315 in. → area = π × (0.315)² = 0.312 in². An agent who rounds the radius to 0.32 instead of 0.315 gets 0.322 in², yielding floor(5.09 / 0.322) = 15 cables instead of 16 — a wrong CORRECT tag. NEC Chapter 9 also has the 53% single-cable / 31% two-cable / 40% three-or-more split that authors frequently collapse to "40% always."

*Instruct the authoring agent:* Calculate cable area using exact OD/2; do not round intermediate values. Show all 5 steps. Specify conduit by nominal trade size AND inner diameter — Schedule 40 PVC inner diameter differs from Schedule 80 by wall thickness, which changes the fill calculation.

**L4.15 — DOT/Railroad/USACE Permits (NWP 12):** T3 required three correction passes to get NWP 12 right (L3.1 fix B6, L3.8 body, L3.11 RED-FLAG 2 in BATCH_C_BRIEF). L4.15 is the fourth lesson to address NWP 12. An author without that history will write NWP 12 without the regional suspension caveat, contradicting three corrected T3 lessons.

*Instruct the authoring agent:* L4.15 NWP 12 content must include (a) the 0.1-acre permanent fill limit per crossing, and (b) the explicit caveat that regional USACE conditions may restrict or suspend NWP 12 — confirm with the applicable district. Cross-reference T3 L3.8 and L3.11 explicitly in the Glossary Cross-References block.

---

## §6 Inherited Authoring Convention Violations

| Convention (T3 BATCH_C_BRIEF §3) | How T4 framings break it |
|---|---|
| **2 pulse questions per lesson, with full worked expected answers** | Neither framing specifies pulse questions for any of the 15 lessons. DISCOVERY.md omits pulses from lessons without a scenario (L4.1, L4.4, L4.6, L4.7, L4.9, L4.12, L4.13). Authoring agents writing to these framings will omit pulses, violating a locked convention. |
| **Glossary Cross-References section mandatory at lesson close** | Neither framing includes a cross-reference section. Critical missing links: L4.2 → L4.7 (grounding at aerial transition), L4.5 → L4.6 (NEC Article 770 to 800), L4.7 → T6 (installation depth), L4.11 → T2 L2.10/L2.11. |
| **Q-structure: [CORRECT] inline, *Rationale:* italic, per-option bold-labeled sub-bullets** | Neither framing includes a specimen Q with full structure. Agents not reading T3 lessons will produce incompatible formats, breaking Moodle import. The brief must include a locked Q-structure template block. |
| **RUS bulletin cited first when both RUS and TIA apply** | Framing A's citation matrix puts TIA/NESC as "Primary Standard" and RUS as a secondary column — visually inverting the RUS-primary framing locked in CLAUDE.md §2. L4.3, L4.8, L4.14 are most affected. |

---

## §7 Open Questions Neither Framing Raised

**OQ1 — Lesson count vs. content volume:** Both framings accept 15 lessons without challenging the lesson count given the sizing problems in §3. L4.2 and L4.12 are each realistically 40+ min. The topic either runs to ~5.5 hrs (30% over the 4.75-hr target) or drops content. The brief must explicitly decide: split L4.2 into two lessons (clearances / loading), or cap L4.2 to clearances and treat loading districts as flashcard-only. This is a authoring-scoping decision that neither framing resolves.

**OQ2 — Standard conflict resolution framework:** When NESC, NEC, and TIA contradict each other, which governs? The T3-level answer (TIA-758-C §6.3 stricter than NESC Rule 354 → TIA controls) is demonstrated in L3.5 but never codified as a framework. T4 is the standards backbone — it should include a "controlling standard" decision rule (more restrictive requirement controls; AHJ-adopted edition governs for code compliance; TIA-758-C governs customer-owned OSP; NESC governs utility-affiliated infrastructure). Neither framing includes this framework as a lesson objective.

**OQ3 — Exam discrimination for recall-only lessons:** L4.1, L4.4, L4.7, L4.13 each have 1 final exam question and no per-lesson scenario. These 4 lessons will produce 4 of 25 final exam questions from flashcard + recall-only material. At the "million-dollar program" quality bar, a 70% pass exam with 16% pure-recall questions may be too easy at the bottom of the difficulty curve. Neither framing raises whether these lessons should include at least one applied question at lesson level before the final exam.

---

=== T4 CANONICAL BRIEF B END ===
