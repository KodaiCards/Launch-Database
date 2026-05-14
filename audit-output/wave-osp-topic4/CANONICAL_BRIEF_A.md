# OSP Topic 4 — Codes & Standards: CANONICAL BRIEF A (Consolidator A)

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Consolidator:** A (independent merge — did not read Consolidator B output)
**Source framings:** BRIEF_FRAMING_A.md (standards+citations, `60236cd`) + BRIEF_FRAMING_B.md (outcomes+daily-use, `d3c3adc`)

---

## §1 Fifteen-Lesson Canonical Plan

15 lessons endorsed. Both framings and DISCOVERY.md agree independently on count and sequence. The structure maps cleanly: NESC structural rules (4.1–4.4) → in-building/component rules (4.5–4.7) → OSP/component performance standards (4.8–4.12) → program-specific regulatory framework (4.13–4.15). No lesson warrants splitting or merging.

| # | Title | Duration | Citation Matrix (Primary → Supporting → RUS) | Learner Outcome | Interactive Elements | Intensity |
|---|---|---|---|---|---|---|
| 4.1 | NESC Overview: Purpose, Editions, Structure, Applicability | 20 min | NESC C2-2023 (IEEE Std 5-2023) Rules 010–019 → BICSI OSP-DRD Ch. 2.1 → 1751F-630 §2.1 | Identify applicability trigger: NESC mandatory on utility ROW / joint-use poles; TIA-758-C governs customer-owned private easements | Flashcards (edition history, triggers) + MC quiz + scenario (does NESC apply to this project?) | STANDARD |
| 4.2 | NESC Part 2 — Overhead Clearances and Loading | 25 min | NESC Rules 230–238, Tables 232-1, 234-1; Rules 250–252 → BICSI OSP-DRD Ch. 2.2, 6.3 → 1751F-630 §4 | Apply NESC clearance and loading district rules to verify aerial span designs before stamping | Drag-drop (clearance measurement arrows on cross-section) + flashcards + MC quiz | HIGH-INTENSITY |
| 4.3 | NESC Part 3 — Underground Cover and Conduit Rules | 20 min | NESC Rules 320–355, Rule 354 → ANSI/TIA-758-C §6.1, §6.3; NEC Ch. 9 → 1751F-635 §3 | Select controlling cover-depth standard (NESC vs. TIA-758-C) for each installation method and annotate plan sheets | Flashcards + MC quiz + scenario (HDD / direct-bury / conduit route — select minimum cover per segment) | HIGH-INTENSITY |
| 4.4 | NESC Part 4 — Work Rules: Code-Citation Level | 20 min | NESC Rules 400–499; Rules 420–424 (approach distances) → BICSI OSP-DRD Ch. 2.4 → 1751F-630 §2.2 | Cite the rule number governing a given hazard class; know when to escalate to Topic 9 safety practice | Flashcards (rule → hazard category) + MC quiz | STANDARD |
| 4.5 | NEC Article 770 — Optical Fiber In-Building Classification | 25 min | NEC Art. 770 (NFPA 70-2023); 770.113 (listing); 770.24 (firestop) → BICSI OSP-DRD Ch. 2.5 → — | Select correct NEC 770 fire-rating class for OSP-to-building transitions; identify firestop requirements | Drag-drop (cable pathway OSP → riser → horizontal: assign 770 type) + flashcards + MC quiz | HIGH-INTENSITY |
| 4.6 | NEC Article 800 + Chapter 8 — Communications Wiring | 20 min | NEC Art. 800; 800.93 (protector grounding); 800.100 (bonding); NEC Ch. 8 → BICSI OSP-DRD Ch. 2.5 → — | Verify protector grounding is on design drawings; explain Ch. 8 independence from Chs. 1–7 | Flashcards + MC quiz + scenario (building-entry drawing review: identify protector grounding omission) | STANDARD |
| 4.7 | NEC Article 250 — Grounding and Bonding Code Basis | 20 min | NEC Art. 250; 250.94 (IBT); 250.52 → BICSI OSP-DRD Ch. 3.1 → 1751F-630 §6.3 | Locate 250.94 IBT requirement in design details; know when to route to Topic 6 for installation depth | Flashcards + MC quiz | STANDARD |
| 4.8 | ANSI/TIA-758-C — Customer-Owned OSP Cabling Standard | 25 min | ANSI/TIA-758-C (2019) §3, §6, §7, §9 → BICSI OSP-DRD Ch. 2.6; NEC Ch. 9 (fill) → 1751F-630 (cites throughout) | Verify slack, conduit fill, and labeling intervals on any OSP deliverable against TIA-758-C minimums | Flashcards + MC quiz + scenario (subcontractor conduit plan at 85% fill: identify violation, select fix) | HIGH-INTENSITY |
| 4.9 | ANSI/TIA-568.3-D — Fiber Components and Performance | 25 min | ANSI/TIA-568.3-D (2021) §5, §6, Table 5 (IL/RL) → BICSI OSP-DRD Ch. 2.6 → 1751F-630 §3 | Specify correct connector polish (UPC vs. APC) and verify IL/RL acceptance limits for project power budget | Drag-drop (connector type to application) + flashcards + MC quiz | HIGH-INTENSITY |
| 4.10 | TIA-598-D Color Codes + TIA-606-C Labeling | 20 min | ANSI/TIA-598-D (2019) §4; TIA-606-C (2020) §6 → BICSI OSP-DRD Ch. 10.2 → 1751F-630 §9 | Look up correct tube and fiber position in a 144-fiber splice plan without error | Drag-drop (144F / 12-tube: drag color labels to tube and fiber position) + flashcards + MC quiz | STANDARD |
| 4.11 | ANSI/TIA-526 — Tier 1 vs. Tier 2 Acceptance Testing | 25 min | ANSI/TIA-526-14-B (SM OLTS); TIA-526-7 (MM OLTS + OTDR appendix) → BICSI OSP-DRD Ch. 9.1; IEC 61300-3-4 → 1751F-630 §9 | Specify the correct test tier (Tier 1 vs. Tier 2) for a given project type and write the acceptance test section of a spec | Flashcards + MC quiz + scenario (three project types: campus OM3 / rural RUS SM 8-splice / MDU riser — select tier each) | HIGH-INTENSITY |
| 4.12 | IEC Standards: 60794, 61300, 61753, 60529 | 25 min | IEC 60794-1-2 (cable); IEC 61300-3-4 (attenuation); IEC 61753-1 (P/O/G class); IEC 60529 (IP) → ANSI/TIA-568.3-D; BICSI OSP-DRD Ch. 2.7 → — | Read an IEC datasheet to confirm IP rating and performance class for a given installation environment | Drag-drop (IP rating to environment) + flashcards + MC quiz | STANDARD |
| 4.13 | OSHA 1910 / 1926 — Code-Reference Overview | 20 min | 29 CFR 1910 (General Industry): Subpart S, §1910.146; 29 CFR 1926 (Construction): Subpart K, Subpart V → BICSI OSP-DRD Ch. 2.8 → 1751F-630 §2.2 | State which CFR part controls for a given work context; know when to flag for Topic 9 safety procedure depth | Flashcards (part → applicability trigger) + MC quiz | STANDARD |
| 4.14 | RUS / USDA Bulletins: 1751F-630/635, 1715E-110, Form 219 | 25 min | RUS 1751F-630 (aerial); 1751F-635 (underground); 1715E-110 (design guide); Form 219 → BICSI OSP-DRD Ch. 2.9; ANSI/TIA-758-C → All listed | Build a deliverable matrix for a RUS aerial project: which bulletin, which form, which deadline | Flashcards + MC quiz + scenario (RUS aerial + conduit project — map bulletin, form, and close-out sequence) | HIGH-INTENSITY |
| 4.15 | DOT, Railroad, and USACE Permit Code References | 20 min | 23 CFR Part 645; USACE 33 CFR 320–332 (NWP 12 + 0.1-acre limit + regional suspension caveat); AAR clearances → BICSI OSP-DRD Ch. 2.10; ANSI/TIA-758-C §6.1 → 1751F-630 §7, §10 | Given a route with multiple crossing types, identify controlling agency, permit type, and critical-path lead time | Flashcards + MC quiz + scenario (state highway + Class I railroad + navigable creek: full permit matrix + timeline) | HIGH-INTENSITY |

**Total duration: ~4.75 hrs. Lesson count: 15. Intensity breakdown: 8 HIGH-INTENSITY / 7 STANDARD.**

---

## §2 Final Exam Shape

- **Question count:** 25 (consistent with Topics 1–3)
- **Pass threshold:** 18/25 correct (70%)
- **Format:** Identical to Topics 1–3 — A–D options, `[CORRECT]` inline, `*Rationale:*` block with per-option citation sub-bullets, lesson-number-ordered in source file, randomized at Moodle import.
- **Type split:** ~60% recall/recognition, ~40% applied scenario. Scenario questions concentrated at L4.2, L4.3, L4.5, L4.8, L4.11, L4.14, L4.15.

| Lesson | Q Count |
|---|---|
| 4.1 NESC Overview | 1 |
| 4.2 NESC Part 2 Clearances | 2 |
| 4.3 NESC Part 3 Underground | 2 |
| 4.4 NESC Part 4 Work Rules | 1 |
| 4.5 NEC Art. 770 | 2 |
| 4.6 NEC Art. 800 + Ch. 8 | 2 |
| 4.7 NEC Art. 250 | 1 |
| 4.8 TIA-758-C | 2 |
| 4.9 TIA-568.3-D | 2 |
| 4.10 TIA-598-D + TIA-606-C | 2 |
| 4.11 TIA-526 Testing | 2 |
| 4.12 IEC Standards | 2 |
| 4.13 OSHA 1910/1926 | 1 |
| 4.14 RUS Bulletins | 2 |
| 4.15 DOT/Railroad/USACE | 1 |
| **Total** | **25** |

RUS bulletin citations appear in exam questions for L4.14 and wherever RUS imposes a stricter requirement than ANSI/TIA (L4.3 cover depth, L4.8 slack, L4.11 acceptance testing). Every question cites the exact standard section in the `*Rationale:*` block.

---

## §3 Framing Disagreements + Resolutions

| # | Topic | Framing A position | Framing B position | Material? | Resolution |
|---|---|---|---|---|---|
| D1 | NESC applicability framing for L4.1–4.4 | Teach NESC as the binding code for any work on utility ROW / joint-use poles; add IEEE Std 5 designation | Frame as "rules AHJs and inspectors cite" — option (b); customer-owned campus work uses TIA-758-C primarily | **YES** — affects how deeply learners are expected to derive calculations vs. just locate rule numbers | **Resolution:** Hybrid. L4.1 opens with applicability trigger (NESC mandatory when utility ROW / joint-use poles triggered; TIA-758-C governs customer-owned private easements). L4.2 goes to full clearance-calc depth (HIGH-INTENSITY) because the office stamps aerial submittals (CLAUDE.md §2 confirms). L4.4 stays code-citation-only (no field safety depth — that is Topic 9). The applicability trigger is stated once in L4.1 and cross-referenced in L4.2–4.4 rather than repeated. |
| D2 | L4.14 RUS scope depth | 25 min / four bulletins / Form 219 — current scope is sufficient | Flags 25 min may be too thin given daily-use frequency; proposes 35–40 min expansion OR a standalone future RUS Operations topic | **YES** — meaningful scope question | **Resolution:** Hold at 25 min for this topic. RUS-program work is the primary daily context (CLAUDE.md §2) and already receives primary treatment in L4.8, L4.9, L4.11, and L4.15 via cross-references. L4.14 is the definitional lesson (which bulletin controls which plant type + Form 219 chain). A standalone "RUS Program Operations" topic is appropriate for future scope but is not a Topic 4 decision. Note in escalation queue as a future topic proposal (see §5). |
| D3 | L4.12 IEC framing (procurement vs. specification) | Frame as datasheet literacy (read IEC ratings on imported hardware) | Same — both agree on "datasheet literacy" framing; B adds "if office has IEC-only suppliers, framing shifts" | **NO** — stylistic difference; both converge on datasheet literacy | **Resolution:** IEC 61753 P/O/G-class framing = datasheet literacy. Note in L4.12 that TIA-568.3-D is the authoring/specification standard; IEC class appears on procurement datasheets and must be validated against TIA performance tables. This avoids the false-equivalence risk Framing A raised. |

---

## §4 Resolved Open Questions

| # | Question | Resolution | Source |
|---|---|---|---|
| RQ1 | Does NESC apply to this office's project types? | NESC is mandatory on utility ROW / joint-use poles. The office stamps utility/RUS aerial submittals, performs railroad permit work, and traverses public ROW. L4.2 requires full calculation depth. TIA-758-C governs customer-owned private campus plant. Both apply; L4.1 teaches the applicability trigger explicitly. | CLAUDE.md §2 ("does stamp utility/RUS submittals ... depth required at L4.2 / L4.14 / Class A railroad permit work") + Framing A Q1 |
| RQ2 | RUS program frequency — is L4.14 scope sufficient? | RUS dominates the program mix. 25-min scope is sufficient for Topic 4 if L4.14 delivers the Form 219 scenario and bulletin-selection exercise. Expansion to a standalone RUS Operations topic is a future queue item, not a Topic 4 change. | CLAUDE.md §2 ("RUS is primary, not incidental") + Framing B Q2 |
| RQ3 | IEC vs. TIA as primary procurement reference | TIA-568.3-D is the specification instrument. IEC ratings appear on datasheets for imported and international-sourced hardware; L4.12 teaches cross-validation of IEC class against TIA performance tables. No international-primary procurement pattern is documented. | CLAUDE.md §2 (domestic RUS + TIA-758-C primary) — resolved by absence of counter-evidence; Framing B Q3 |
| RQ4 | TIA-526-14-B vs. TIA-526-14-C edition currency | Both framings cite "-14-B." Confirm the current edition before L4.11 is authored. If TIA-526-14-C is published, update the citation across L4.11, the exam, and any prior topic that cites the same series. Cross-check against Topic 2 L2.11 citation. Cannot resolve from existing context — remains open. | Framing A Q3 — escalated to §5 |
| RQ5 | IEC 61753 P/O/G vs. TIA-568.3-D false equivalence risk | The two frameworks are not directly equivalent. L4.12 will explicitly note the frameworks are parallel, not interchangeable. Authors must show a worked cross-validation example: "this IEC O-class connector — does it meet TIA-568.3-D Table 5 IL requirement for this channel?" | Framing A Q2 — resolved by framing the cross-validation as a required worked example in L4.12 |

---

## §5 Escalation Queue

Items that cannot be defensibly resolved from existing docs. Route to orchestrator + user before L4.11 and L4.4 are authored.

1. **TIA-526-14-B vs. -14-C edition:** Cannot confirm from context whether TIA-526-14-C is published and supersedes -14-B. If -14-C is current, citations in L4.11, the final exam, and any prior topic cross-reference must be updated. Confirm before authoring L4.11.

2. **NESC loading district for the office's primary service area:** L4.2 worked example uses "Medium loading district." The office's service territory (rural, likely Great Plains / Midwest / Mountain West given RUS program) may fall in Heavy or Extreme Wind district. If the worked calculation uses the wrong district, it teaches a wrong number. Confirm dominant NESC loading district before the L4.2 author writes the clearance scenario.

3. **Railroad classification for L4.15 scenario:** L4.15's scenario crosses "a Class I railroad." The office's primary crossing encounters (given RUS rural geography) are more likely short-line or regional carriers. Confirm whether the scenario should use Class I (90–180 day lead) or short-line (30–60 day lead) as the primary worked example, with the other as a secondary comparison. Internal consistency with L3.8 body values applies.

---

## §6 Authoring Conventions Inherited from Topics 1–3

Every lesson opens with a YAML frontmatter block (`title`, `duration_min`, `topic`, `order`, `bicsi_alignment` list, `sources` list). Section order is invariant: Learning Objectives → Reading Content → Key Terms (Flashcard Candidates) → Interactive(s) → Final Check (2 pulse questions with expected answers) → Glossary Cross-References. Inline bracketed citations appear at the end of the sentence or table note containing the claim — not in a separate footnote block. Quiz Q-structure is exactly: stem → A/B/C/D options → `[CORRECT]` inline on the correct option → `*Rationale:*` italic label → bold per-option sub-bullets `**A — Incorrect.**` or `**B — Correct.**` followed by one-line rationale and citation → `---` between questions. Pulse questions are `**Pulse N.**` bold label → question → blank line → `*Expected answer:*` italic label with full worked answer. RUS bulletin is cited alongside ANSI/TIA-758-C wherever both apply, and the RUS value is explicitly called out when stricter. Vendor-agnostic: no specific manufacturer products. Math verification before writing any `[CORRECT]` tag — derive independently, then write. Do not repeat the NESC vs. TIA-758-C applicability trigger in every lesson; establish it in L4.1 and cross-reference. Railroad lead times must split (short-line 30–60 days / Class I 90–180 days) to match L3.8 body-level framing — never use a flat value.

---

=== T4 CANONICAL BRIEF A END ===
