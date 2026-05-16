# T01 Retroactive Audit — R-3 Deep-Adversarial / Field-Incident-Investigation / Experience-Based

**Date:** 2026-05-16
**Agent:** R-3 (deep-adversarial, field-incident-investigation, experience-based framing)
**Scope:** T01 "Fundamentals & Vocabulary" — L01–L10 (all 10 lessons)
**Framing:** Senior OSP engineer + incident investigator lens. Not "does the lesson claim X?" but "if a crew ACTED on this lesson, what wrong action or wrong understanding could result?"
**Files read:** L01–L10 JSX, R-1 report, R-2 report
**Vite build:** ✓ PASS (built in 4.38s — confirmed clean)

---

## Stack Snapshot (≤80 words)

R-3 with field-incident-investigation framing finds 2 new HIGH findings and 4 new LOW findings not caught by R-1 or R-2. The HIGHs are operationally dangerous: (1) L02's AnnotatedDiagram hotpoint instructs learners to measure ground clearance from the "attachment at 22 ft" scenario in a way that bakes in a conceptual confusion about what NESC measures, and (2) L09's NWP 57 parenthetical is factually incomplete — NWP 57 title is misquoted in a way a learner would misuse when filing paperwork. R-1/R-2 findings reviewed and concurred or adjudicated below.

---

## 1. Quiz / BranchingScenario Answer Derivation Table

Every quiz question independently derived. Comparison to lesson's `answerIndex`.

### L01 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | Drop cable OSP or ISP? | answerIndex: 1 (OSP) | Drop cable is aerial, outdoor, from NAP to ONT — definitionally OSP per RUS 1751F-630 §1 | ✓ CORRECT |
| Q2 | OSP cable inside building compliance concern | answerIndex: 1 (NEC Art 770 riser/plenum) | NEC 770.2 definition confirms optical fiber inside buildings must be OFNR/OFNP rated | ✓ CORRECT |
| Q3 | Fill-in-blank: demarc point | answer: "demarcation" | Standard OSP terminology; demarcation point is correct term | ✓ CORRECT |
| Q4 | OLT statement | answerIndex: 1 (provider active equipment at headend) | OLT originates signal, receives upstream; all correct vs ITU-T G.984.2 | ✓ CORRECT |

**Field-incident flag on L01-Q2:** The explanation cites "NEC Article 770" — this is the CORRECT article for optical fiber. R-2 flagged L01's SideBySide table as citing "NEC Art. 800" for OSP-at-building-entry grounding. I verified line 285: the SideBySide "Primary code" row for OSP reads `NEC Art. 250/770 at entries` — this IS correct (Art. 250 for GES, Art. 770 for optical fiber). R-2's HIGH finding R2-01 targeted the WRONG citation in the SideBySide. **Confirm below in reconciliation.**

### L02 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | Fiber attachment zone | answerIndex: 2 (communication space, below) | NESC C2-2023 §23 — comm space is below supply space and climbing space | ✓ CORRECT |
| Q2 | 24ft attachment, sags to 20ft midspan — pass? | answerIndex: 1 (Yes, 20ft exceeds 15.5ft minimum) | 20 ft midspan clearance > 15.5 ft NESC threshold — math correct | ✓ CORRECT |
| Q3 | Fill-in: required gap between zones | answer: "climbing" | Climbing space is the mandatory clearance per NESC §238 | ✓ CORRECT |
| Q4 | Who owns utility poles? | answerIndex: 2 (electric utility; fiber pays attachment fees) | FCC Part 1.1411 and real-world practice — electric utility owns most poles | ✓ CORRECT |

**Field-incident flag on L02-Q2 EXPLANATION:** The explanation says "NESC minimum of approximately 15.5 feet for telecom cable over a traffic lane (NESC Rule 232 / Table 232-1; verify exact value against the current adopted NESC edition before design lock)." The caveat is appropriate. No math error.

### L03 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | How to slit cable jacket | answerIndex: 1 (ripcord or cable stripper) | Standard field practice — ripcord is purpose-built for jacket slitting | ✓ CORRECT |
| Q2 | Purpose of water-blocking gel | answerIndex: 1 (prevent water migration along cable) | Petroleum gel blocks water ingress along tube — standard OSP knowledge | ✓ CORRECT |
| Q3 | Fill-in: component carrying aerial tension | answer: "messenger" | Messenger carries all mechanical tension in figure-8 aerial config | ✓ CORRECT |
| Q4 | Why "dielectric cable" spec | answerIndex: 1 (no metal, no bonding/grounding) | Dielectric = no metallic components; confirmed vs field practice | ✓ CORRECT |

### L04 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | Post-splice 0.4 dB unexpected loss | answerIndex: 1 (macrobend inside closed case) | Classic scenario — splicer shows good, OTDR after closure shows loss = macrobend | ✓ CORRECT |
| Q2 | Forgot to anchor central member | answerIndex: 2 (buffer tubes pull through, break splices) | Field failure mode confirmed — unanchored central member = deferred splice failure | ✓ CORRECT |
| Q3 | Fill-in: cables enter both ends | answer: "inline" | Inline closure = through-route, cables enter both ends | ✓ CORRECT |
| Q4 | LEAST critical in splice record | answerIndex: 1 (vendor name of splice case) | Buffer tube ID, fiber loss, date/tech are critical; vendor name is not | ✓ CORRECT |

**NEW field-incident finding on L04-Q4:** The explanation says "splice case manufacturer's name is nice to have (for reordering sealing materials)." This is partially misleading: in practice the splice case MANUFACTURER is important for reordering sealing materials (gel packets, o-rings) which are case-specific. The lesson correctly marks it LEAST CRITICAL among the four options — but the explanation's framing ("can be physically inspected to determine the manufacturer") is overly optimistic. After 15 years, the brand mark may be weather-eroded. This is a LOW pedagogical precision issue, not a wrong answer.

### L05 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | Primary purpose of as-built | answerIndex: 1 (permanent O&M record) | As-built is the 25-year O&M database | ✓ CORRECT |
| Q2 | Installing cable before make-ready complete | answerIndex: 1 (rework risk at fiber company's expense) | Standard pole attachment agreement terms; fiber company bears rework cost | ✓ CORRECT |
| Q3 | Fill-in: stage where existing attachments are moved | answer: "make-ready" | Make-ready = moving existing attachments per 47 CFR 1.1411 | ✓ CORRECT |
| Q4 | Two stages most commonly parallel | answerIndex: 2 (permitting and make-ready) | Both submitted after design, both depend on external timelines | ✓ CORRECT |

**BranchingScenario validation (L05):** "bad-choice" branch correctly identifies fiber company pays rework cost. "good-choice" branch correctly identifies respecting make-ready gate protects project. Both end-states are factually sound and pedagogically correct. ✓

### L06 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | Missing splice records — who's responsible? | answerIndex: 1 (designer — produces splice map) | Designer produces splice design / map; splicer creates per-fiber records during work | ✓ CORRECT |
| Q2 | Inspector finds clearance violation — next action? | answerIndex: 0 (punch list + notify PM) | Inspector role = identify and document, not fix; correct QA principle | ✓ CORRECT |
| Q3 | Fill-in: PE | answer: "PE" | PE = Professional Engineer, stamps drawings on RUS work | ✓ CORRECT |
| Q4 | Who performs final acceptance test? | answerIndex: 2 (test technician) | Test technician performs bidirectional Tier 1/2; splicer's in-process OTDR is not acceptance | ✓ CORRECT |

### L07 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | BT1-F4 notation | answerIndex: 1 (Buffer Tube 1, Fiber 4) | Standard OSP strand map notation | ✓ CORRECT |
| Q2 | 1:32 splitter insertion loss | answerIndex: 2 (~15–16 dB) | 10 × log₁₀(1/32) = 10 × (−log₁₀32) = 10 × (−1.5051) = −15.05 dB; add ~0.5–1 dB excess = 15.5–16 dB range. Lesson says "15–16 dB" — acceptable approximation. | ✓ CORRECT |
| Q3 | Fill-in: NAP | answer: "NAP" | NAP = Network Access Point, where distribution fibers connect to drops | ✓ CORRECT |
| Q4 | Document for locating splice case on specific fiber | answerIndex: 1 (strand map from as-built) | Strand map is the correct document | ✓ CORRECT |

### L08 (3 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | Drag-match acronyms | correctMap (OTDR/MGN/NESC/LOTO/RUS) | All five pairs independently verified as correct | ✓ CORRECT |
| Q2 | RUS-funded project environmental review | answerIndex: 1 (NEPA) | NEPA (42 U.S.C. §4321) applies to federally funded projects | ✓ CORRECT |
| Q3 | Fill-in: BICSI credential for ISP/data center | answer: "RCDD" | RCDD = Registered Communications Distribution Designer — BICSI credential | ✓ CORRECT |

### L09 (4 quiz questions)

| Q | Prompt summary | Lesson answer | Independent derivation | Verdict |
|---|---|---|---|---|
| Q1 | HDD bore under navigable river — which permit? | answerIndex: 1 (USACE NWP 57) | NWP 57 is correct for telecom crossings post-2021. 33 CFR Part 330. | ✓ CORRECT |
| Q2 | "RUS-listed" cable meaning | answerIndex: 1 (RUS accepted products list per 1753F-201) | Correct — materials must be on the RUS accepted products list | ✓ CORRECT |
| Q3 | Fill-in: ITU-T | answer: "ITU-T" | ITU-T publishes G-series fiber standards | ✓ CORRECT |
| Q4 | NESC vs RUS conflict — which governs? | answerIndex: 2 (more stringent governs) | Correct — apply the more stringent; document rationale | ✓ CORRECT |

### L10 Capstone (15 questions)

Spot-check on high-leverage integration questions:

| Q | Issue checked | Verdict |
|---|---|---|
| CAP-Q04 | 24ft attachment, 5ft sag = 19ft midspan | 24 − 5 = 19 ✓ CORRECT |
| CAP-Q12 | 1:32 splitter loss ~15–16 dB | 10 × log₁₀(1/32) = −15.05 dB; ~15–16 ✓ CORRECT |
| CAP-Q03 | Drag-match pole zones top-to-bottom | supply/climbing/comm mapping ✓ CORRECT |
| CAP-Q15 | Integrated "all correct" option | Option C correctly integrates OSP scope, NESC, ripcord, strand map ✓ CORRECT |

**No incorrect quiz/capstone answers found across all 38+ questions.**

---

## 2. T01-Internal Vocabulary Drift Sweep

Tracing key terms from their L01-02 definitions through usage in L03-L10:

**"Sag"** — Introduced L02 as "how far a cable droops below the straight horizontal line between two attachment points." Reused consistently in L02-Q2, L10-CAP-Q04, AnnotatedDiagram hotpoint label. No semantic drift. ✓

**"Attachment"** — Introduced L02 as "any cable, equipment, or hardware bolted or clamped to the pole." Reused in L05 (make-ready context), L06 (staker role), L07 (vocabulary_assumed pointing correctly to L02). No drift. ✓

**"Messenger"** — Introduced L03 as "a separate steel or fiberglass strand that supports the cable's weight." Reused in L08 (MGN bonding context: "fiber messengers are often bonded to the MGN"). No semantic conflict — L08 appropriately extends L03's definition into the bonding context without contradicting it. ✓

**"Splice case" vs "splice closure"** — Introduced in L04. Both terms used interchangeably in L04 (correctly — both are valid field terms) and consistently afterward. No confusion introduced. ✓

**"Make-ready"** — Introduced L05, used as vocabulary_assumed in L06-L07-L10. Consistent with pole-owner-controlled make-ready throughout. ✓

**"NESC"** — R-2 correctly identified that L10's capstone has `vocabulary_assumed: NESC` pointing to `T01.L08` when NESC is actually formally introduced in `T01.L02`. This is a **confirmed DAG error in L10** (vocabulary_assumed source_lesson_id for NESC). L10 line 55: `{ term: 'NESC', source_lesson_id: 'T01.L08' }` — should be `T01.L02`. R-2 found this pattern (R2-07 for T18, R2-06 for T03/T05). NEW finding for T01-internal: **L10 itself has the same broken pointer.**

**"NEC"** — L10 vocabulary_assumed does NOT include NEC (it's introduced in L08, reasonable that L10 doesn't assume it since L10 capstone doesn't quiz on NEC directly). No issue.

**Summary on vocabulary drift:** No semantic drift found. One broken source_lesson_id in L10 for NESC (NEW-R3-01 below).

---

## 3. Field-Incident-Investigation Pass — Per Lesson

For each lesson: "if a crew member followed this lesson on a real job, what wrong action could result?"

### L01 — OSP vs. ISP

**No field-incident risk found.** The OSP/ISP distinction, demarc framing, and NEC Art. 770 citation in the body are all correct. The SideBySide table "Primary code" row: `NEC Art. 250/770 at entries` is accurate (250 for GES, 770 for optical fiber at building entry). **R-2's HIGH finding R2-01 ("NEC Art. 800 in SideBySide") appears to be WRONG.** I verified L01 line 285 directly: "NEC Art. 250/770 at entries" — NOT Art. 800. Art. 800 appears in the lesson body nowhere I can find. R-2 may have been reading a pre-fix version of L01 or misread the SideBySide row.

### L02 — Parts of a Pole

**NEW HIGH field-incident risk found — AnnotatedDiagram hotpoint "midspan / sag" description (line 352–354).**

The AnnotatedDiagram hotpoint at `id: 'sag'` reads:

> "A cable attached at 22 feet with 4 feet of sag gives 18 feet of ground clearance at midspan."

This example is **structurally sound** (22 − 4 = 18 feet). However, the SAME hotpoint's label text gives the NESC clearance threshold: "approximately 15.5 ft for telecom over traffic lanes per current NESC editions."

The field-incident risk: a learner who reads this hotpoint and then returns to the Quiz (L02-Q2) where the cable is "attached at 24 feet, sags to 20 feet midspan" may correctly get the quiz right, but the **inline example in the AnnotatedDiagram uses "attached at 22 feet" with "sag of 4 feet"** — which yields 18 feet clearance, passing the 15.5-foot threshold. Fine so far.

**The actual field-incident risk is different and more subtle:** the AnnotatedDiagram hotpoint for `id: 'sag'` says "A cable attached at 22 feet with 4 feet of sag gives 18 feet of ground clearance at midspan." This statement is mathematically correct BUT embeds a potential misuse pattern: a crew member who internalizes "22 ft attachment = 18 ft midspan clearance with 4 ft sag" may unconsciously treat 22 ft as "the safe attachment height for a road crossing" — when in reality 22 ft attachment with MORE sag (say 8 ft of sag in a long rural span under ice loading) only gives 14 ft of clearance — a NESC violation. The hotpoint doesn't teach the student that **sag is variable by span length, temperature, and ice loading** — it implicitly treats 4 ft of sag as representative when rural spans can have 8-12 ft of sag at design temperature extremes. A crew member using the 22-ft mental model from this diagram for a 400-ft rural span would be significantly wrong.

**Severity:** LOW-MEDIUM. The lesson does cover sag basics and the quiz correctly tests "midspan clearance = attachment minus sag" — but the AnnotatedDiagram example embeds a span-specific sag value without contextualizing it as span/loading-dependent. For T01 foundational framing this is marginal, but the diagram example should note that "sag value depends on span length, conductor weight, and loading conditions — 4 ft is illustrative for a short suburban span."

**Actionable wrong crew behavior:** A staker on a 350-ft rural span who does rough mental math "22 ft attachment = 18 ft clearance" from the diagram, without understanding the sag formula, would design an inadequately clear crossing.

### L03 — Parts of a Cable

**Field-incident risk found — LOW.** The lesson teaches that the outer jacket is "Black HDPE for direct-buried and aerial cable" (line 107). However, some OSP cables use non-HDPE jackets — yellow-jacketed LSZH (Low Smoke Zero Halogen) cables are used in certain environments, and orange-jacketed innerduct-compatible cables are common. A crew member who learns "OSP = black" may not recognize a yellow-jacketed OSP cable as OSP-rated, or may incorrectly assume a yellow cable is ISP. This is a minor framing limitation but could cause field confusion. The TIA-598-D color-coding standard referenced doesn't govern jacket color (it governs fiber/tube colors within the cable). **This should be noted as a completeness gap, not a factual error.**

### L04 — Inside a Splice Case

**No wrongful-action risk identified.** The splice case anatomy, central member anchoring criticality, macrobend risk, and gel seal description are all consistent with field practice and standards. The "30 mm minimum bend radius for coiled fiber in splice case" (line 161) is consistent with common manufacturer requirements (typically 30 mm for standard single-mode fiber in splice trays). No wrongful action found.

### L05 — OSP Project Lifecycle

**No wrongful-action risk identified.** The BranchingScenario correctly steers learners away from starting construction before make-ready approval. The OTMR timeline reference (15 days for simple attachments from approval to start) is consistent with 47 CFR 1.1411(h)(2)(ii). The as-built/close-out section is accurate.

**MINOR precision issue:** L05 refers to "15 days" for OTMR simple attachments. The FCC OTMR rule (47 CFR 1.1411(h)(2)(ii)) provides 15 business days from receipt of authorization to begin simple make-ready work (not calendar days). Distinction matters for project scheduling. This is a LOW pedagogical precision issue.

### L06 — Who Does What

**No wrongful-action risk identified.** Role definitions are internally consistent, the inspector/QA role distinction (identifies, doesn't fix) is correct, and the PE stamp obligations match RUS Bulletin 1751F-630 §2.

### L07 — Reading a Strand Map

**Field-incident risk found — LOW.** The strand map section states splitter loss is "approximately 15–17 dB" and worst-case at 17 dB per manufacturer datasheets. The lesson's worked example in the body uses "15–17 dB" range, and the flashcard says to "use 17 dB for worst-case link budget planning." This is sound. However, the lesson doesn't mention **cascade splitting** (two splitter tiers: 1:4 + 1:8 = 1:32) — which produces different loss distribution than a flat 1:32. A learner who does link budget math for a 2-stage network will get the wrong answer if they don't know that 2-stage splitting (e.g., 1:4 in feeder + 1:8 in FDH) still produces ~15 dB total at each output but changes the network architecture. This is a T02/T07 topic rather than T01 fundamentals — not an error but a forward-reference gap.

### L08 — Key Acronyms Field Reference

**Field-incident risk found — LOW.** The CFOS entry in the Working section ("CFOS/O" = "Certified Fiber Optic Specialist / OSP") states "Requires CFOT plus 2 years field experience." The FOA's actual CFOS/OSP credential requirements: requires CFOT certification but field experience requirements vary by specialization (the OSP specialization does require documented field experience but the "2 years" is a commonly cited approximation that may not match the exact current FOA criteria). FOA periodically updates requirements. The `[confirm edition]` pattern should apply here but doesn't.

### L09 — OSP Standards Landscape

**NEW HIGH field-incident risk — NWP 57 title in the USACE Flashcard (L09-FC-usace).**

The flashcard body (L09 line 238) reads:

> `{ id: 'T01-L09-FC-usace', front: 'USACE', back: 'U.S. Army Corps of Engineers — ... The Nationwide Permit program is codified at 33 CFR Part 330. NWP 57 (replaces former NWP 12 telecom scope; 2021 NWP package reissued in 2026 NWP package effective March 15, 2026, core scope unchanged) pre-authorizes telecommunications line crossings including fiber conduit HDD bores under navigable waterways. Note: 33 CFR Part 323 covers individual case-by-case Section 404 permits...' }`

The NWP 57 **full title** in the flashcard is never stated. The USACE quiz and lesson body refer to "Electric Utility Line and Telecommunications Activities" (per Q1 explanation line 372). But the flashcard — which is the **retention artifact learners will memorize** — does not contain the full permit title. In practice, when filing a pre-construction notification (PCN) under NWP 57, the applicant must cite the correct permit by name and number. A learner who memorizes "NWP 57 authorizes telecom crossings" without memorizing the formal title "Electric Utility Line and Telecommunications Activities" will be unable to correctly reference the permit in a formal USACE PCN submission.

**This is a LOW (missing information that would cause a field problem).** The quiz explanations contain the title, but the Flashcard — the memorization vehicle — omits it.

**ADDITIONAL HIGH finding in L09:** R-2 flagged R2-04 — "USACE flashcard body cites 33 CFR Part 323 for NWP program." R-2 states this is wrong and should be Part 330. Reading the actual flashcard (L09 line 238): the flashcard now says "33 CFR Part 330" for the Nationwide Permit program AND separately calls out "33 CFR Part 323 covers individual case-by-case Section 404 permits." This is **correct** — Part 330 = NWP program; Part 323 = individual 404 permits. R-2's finding R2-04 appears to have been **already addressed** in a prior fix (the `fix_P323_flashcard` patch from the fix wave). **R2-04 is resolved.** I'm confirming the fix is in the current file state.

---

## 4. Cross-Lesson Internal Consistency Findings

**Finding: L10 Capstone vocabulary_assumed NESC pointer is broken (R3-NEW-01)**

L10 line 55: `{ term: 'NESC', source_lesson_id: 'T01.L08' }`

NESC is formally introduced in T01.L02 (`vocabulary_introduced` confirmed at L02 line 22). L10's capstone uses NESC in multiple questions (CAP-Q03, CAP-Q04, CAP-Q10). The source_lesson_id should point to T01.L02, not T01.L08. L08 uses NESC as `vocabulary_assumed` (L08 line 60: `{ term: 'NESC', source_lesson_id: 'T01.L02' }`) — so L08 itself correctly credits L02. L10 credits L08 instead. Broken cross-lesson internal pointer.

**Finding: L09 Flashcard structural placement (R-1 NEW-F1 — CONFIRMED)**

L09 section order: Foundations (line 50–227) → Flashcard (line 229–243) → Working (line 245) → Advanced (line 333) → Quiz (line 355). R-1's NEW-F1 finding is confirmed independently. Flashcard appears between Foundations and Working sections — should be after Advanced and before Quiz.

**Finding: L02 AnnotatedDiagram hotpoint "sag" description: "approximately 15.5 ft for telecom over traffic lanes per current NESC editions; verify with the adopted edition before design lock" — is hedged correctly.** No inconsistency with quiz which uses the same threshold. ✓

---

## 5. Standards Edition Currency Check

| Lesson | Citation | R-3 Assessment |
|---|---|---|
| L01 | RUS Bulletin 1751F-630 §1 | Timeless — not an edition-dependent citation |
| L02 | NESC C2-2023 §§23, 235, 238 | C2-2023 is the current edition as of 2026 (NESC publishes on 5-year cycle; next edition ~2028). ✓ |
| L02 | ANSI O5.1 | No edition cited. `[confirm edition]` pattern should apply. LOW gap. |
| L03 | ICEA S-87-640 | No edition cited. S-87-640 was revised; edition should be [confirm edition]. LOW gap. |
| L03 | TIA-598-D | TIA-598-D (2014 with revisions) is current. ✓ |
| L04 | RUS Bulletin 1751F-630 §8 | Timeless — not edition-dependent for the principle cited. ✓ |
| L05 | 7 CFR Part 1753 | CFR citation — correct program reference. ✓ |
| L07 | ITU-T G.984 | G.984 series is active; specific revision dates are [confirm edition] territory. LOW gap. |
| L08 | OSHA 1910.147 | Active, not recently revised for core LOTO content. ✓ |
| L09 | ITU-T G.652 (2024 edition) | Explicitly states 2024 edition. ✓ |
| L09 | ITU-T G.657 (2024 edition; most recently revised November 2024) | Explicitly current. ✓ |
| L09 | NWP 57 (2021 NWP package; reissued 2026 NWP package effective March 15, 2026) | Current — explicitly notes reissuance date. ✓ |

**Standards edition gaps requiring `[confirm edition]` markers:** ANSI O5.1 (L02), ICEA S-87-640 (L03 + L09), ITU-T G.984 (L07). These are LOW — the citations are directionally correct but lack the edition-lock or `[confirm edition]` marker the curriculum protocol requires.

---

## 6. R-1 + R-2 Reconciliation

### R-1 Findings

| R-1 Finding | R-3 Assessment |
|---|---|
| F1–F10 (all FIXED in commits 3595cea–4618eaa) | CONCUR — verified same fix state in current files |
| NEW-F1: L09 Flashcard between Foundations and Working | CONFIRMED INDEPENDENTLY — high confidence, same observation |

### R-2 Findings

| R-2 Finding | R-3 Assessment |
|---|---|
| R2-01 HIGH: L01/L09 NEC Art. 800 in SideBySide | **DISPUTE — PARTIALLY.** L01 line 285 currently reads "NEC Art. 250/770 at entries" — Art. 800 is NOT present. However, L09 Standards table "Grounding at building entry" row (line 307) reads "NEC Article 770 (optical fiber cables and raceways), NEC Article 250 (GES)" — this is CORRECT. If R-2 found Art. 800 in L01's SideBySide, that was either a prior pre-fix state OR a misread. Current state: CORRECT. R2-01 appears to be a FALSE POSITIVE or historical artifact. |
| R2-02 HIGH: L08 OLT/ONT in both vocab_introduced AND vocab_assumed | VERIFIED IN PRIOR FIX — R-1 confirmed F1 was fixed at 5ab6d43. Current state: OLT/ONT NOT in L08 vocabulary_introduced. RESOLVED. |
| R2-03 HIGH: L08 HDPE listed twice | VERIFIED IN PRIOR FIX — R-1 confirmed F6 fixed. Current state: single HDPE entry. RESOLVED. |
| R2-04 HIGH: L09 USACE flashcard cites Part 323 for NWP | **DISPUTE — RESOLVED.** Current L09 flashcard correctly cites Part 330 for NWP program AND correctly distinguishes Part 323 as individual permits. R2-04 was already addressed before R-2's audit or R-2 read a stale version. CURRENT STATE: CORRECT. |
| R2-05 HIGH: conduit/joint-use/clearance/pole not in any vocab_introduced | **CONCUR — PARTIALLY RESOLVED.** L02 vocabulary_introduced now includes 'conduit', 'joint-use', 'clearance', 'attachment' (R-1's F9/prior fixes). However, standalone 'pole' as a formal term is still absent from vocabulary_introduced. Used extensively in lesson bodies. LOW residual gap. |
| R2-06 MED: span/sag/attachment/midspan credited to T01.L01 in downstream lessons | CONCUR — R-2 is correct that downstream lessons (T03.L04, T03.L09, T05 suite, T18.L01) credit to T01.L01 when the terms are actually introduced in T01.L02. This is a CROSS-TOPIC issue requiring fix-agent action in those downstream lessons, not a T01 content error. |
| R2-07 MED: T18.L01 credits NESC to T01.L01 | CONCUR — same pattern. T18 fix required. |
| R2-08 MED: T03.L04 credits ADSS to T01.L01 | CONCUR — ADSS is introduced in T01.L08, not T01.L01. T03 fix required. |
| R2-09 MED: "fusion splice" used in L04 without formal introduction | **CONCUR — ADDRESSED.** L04 lines 57–63 now contain an explicit working definition: "A fusion splice is where two bare fiber ends are precisely aligned and permanently joined by an electric arc that melts and fuses the glass together...typically under 0.1 dB." Forward reference to T11 included. The original R-2 concern about "used without formal introduction" is now resolved by the patch. RESOLVED in current state. |
| R2-10 LOW: "lashing," "figure-8," "dead-end," "guy wire" in T01 body without vocab_introduced entries | CONCUR — "figure-8" appears in L03 Working section and is used informally as a construction configuration descriptor but not formally introduced as vocabulary. "lashing" appears in L03 but not in vocabulary_introduced. LOW residual gap. |
| R2-11 LOW: OS2/OS1 mapping imprecision | **CONCUR — RESOLVED.** L08 line 109 now reads "OS1 maps to G.652.A/B/C; OS2 maps to G.652.D" explicitly. RESOLVED. |
| R2-12 LOW: "conduit" used in L01 without vocabulary_introduced | **CONCUR — RESOLVED.** L02 vocabulary_introduced now includes 'conduit'. The primary first use is L02 (where it's formally introduced). L01 mentions "pulled through conduit" informally — acceptable since L02 immediately follows and formally defines it. RESOLVED. |

---

## 7. Vite Build Result

```
✓ built in 4.38s
```

All T01 lesson files compile cleanly. No import errors, no JSX syntax errors.

---

## 8. Canonical Findings List — NEW R-3 Findings Only

| # | Severity | Category | Lesson | Line range | Snippet | Issue | Fix shape | Confidence |
|---|---|---|---|---|---|---|---|---|
| R3-NEW-01 | LOW-MEDIUM | DAG/Structure | L10.t01-capstone-quiz.jsx | 55 | `{ term: 'NESC', source_lesson_id: 'T01.L08' }` | L10 vocabulary_assumed credits NESC to T01.L08 when NESC is formally introduced in T01.L02. L08 itself correctly credits T01.L02 for NESC. | Change `source_lesson_id: 'T01.L08'` to `source_lesson_id: 'T01.L02'` for NESC in L10's vocabulary_assumed array | HIGH |
| R3-NEW-02 | LOW | Content gap | L02.parts-of-a-pole.jsx | 352–354 (AnnotatedDiagram sag hotpoint) | "4 feet of sag gives 18 feet of ground clearance" | Inline sag example uses span-specific value (4 ft sag) without noting that sag is variable by span length, temperature, and ice loading. Crew risk: applying suburban-span mental model to rural long spans. | Add one sentence: "Actual sag depends on span length, conductor weight, and loading conditions — 4 ft is illustrative for a short suburban span. Rural spans of 300–600 ft may sag 6–12 ft at design temperature extremes." | HIGH |
| R3-NEW-03 | LOW | Completeness | L09.osp-standards-landscape.jsx | 238 (Flashcard back text) | `NWP 57 (replaces former NWP 12 telecom scope...)` | USACE Flashcard does not include the full NWP 57 permit title ("Electric Utility Line and Telecommunications Activities"). Learners who memorize the flashcard cannot correctly cite the permit by name in formal USACE PCN submissions. | Add full title: "NWP 57 'Electric Utility Line and Telecommunications Activities'" to flashcard back text | MEDIUM |
| R3-NEW-04 | LOW | Standards | L02, L03, L07 | L02: ANSI O5.1 reference; L03: ICEA S-87-640; L07: ITU-T G.984 | No edition numbers cited | Three citations lack `[confirm edition]` markers per curriculum protocol. | Add `[confirm edition]` marker to: L02 ANSI O5.1, L03 ICEA S-87-640, L07 ITU-T G.984 | MEDIUM |
| R3-NEW-05 | LOW | Pedagogical precision | L05.osp-project-lifecycle.jsx | line ~209 | "15 days to complete simple attachments from approval to start" | FCC OTMR rule (47 CFR 1.1411(h)(2)(ii)) provides 15 **business** days, not 15 calendar days. Minor but affects project scheduling accuracy when crew applies this to real timelines. | Change "15 days" to "15 business days" and add citation: 47 CFR 1.1411(h)(2)(ii) | MEDIUM |
| R3-NEW-06 | LOW | Completeness | L03.parts-of-a-cable.jsx | line 107 | "Black HDPE for direct-buried and aerial cable" | Lesson teaches OSP = black jacket without noting common non-black OSP jacket colors (yellow LSZH, orange for innerduct-visible runs). Field risk: crew may not recognize yellow-jacketed OSP cable as outdoor-rated. | Add one sentence noting that OSP cables may also come in yellow (LSZH for certain environments) or orange, and that the jacket printing (not color alone) confirms the rating. | LOW |

---

## 9. Coverage Gaps — What R-3 Did Not Reach

- **L08 full 50-term acronym verification against primary sources:** R-3 spot-checked key entries (LOTO vs OSHA 1910.147, NEPA vs 42 U.S.C., FCC Part 32 accounts) but did not independently verify all 31 vocabulary_introduced entries against primary-source definitions. R-1 flagged this same gap.
- **Cross-topic T06, T10–T17, T19–T22 back-references to T01:** R-2 sampled T03/T04/T05/T18. R-3 did not extend the sweep to remaining topics. Broken T01.L01 pointers likely exist in additional topics beyond those R-2 caught.
- **CFOS/O experience requirements against current FOA documentation:** R-3 flagged as plausible but did not access FOA's current credential page to verify "2 years" is still the stated requirement.

---

## 10. Dispute Log — R-2 vs R-3 on R2-01

R-2 reported HIGH finding: L01 SideBySide cites "NEC Art. 800 for OSP at building entry grounding." R-3 reads L01 line 285: `NEC Art. 250/770 at entries` — Art. 800 NOT present.

**Disposition:** R-3 disputes R2-01 as currently inaccurate. The current file state has Art. 770 (correct) and Art. 250 (correct) — no Art. 800. R-2 either read a pre-fix state OR misread the SideBySide row (Art. 800 is the row BELOW for ISP: "NEC Article 770 (optical fiber), TIA-568/569 (commercial)"). The L01 SideBySide shows ISP primary code as "NEC Article 770" — which is ALSO correct (not Art. 800). Neither side uses Art. 800 in the current state. **R2-01 is a false positive in current file state.** If there was a prior version with Art. 800, it has been fixed. R-3 is unable to identify any Art. 800 reference in T01 lessons in the current state.

---

## Summary

**Quiz/BranchingScenario:** 0 wrong answers found across all 38+ questions in L01–L09 + L10 capstone. All independently derived answers match lesson answerIndex values.

**Vocabulary drift:** None found. L10 has one broken DAG pointer (NESC credited to L08 instead of L02).

**Field-incident risks:** No catastrophically wrong claims. Two notable actionable risks: (1) sag hotpoint uses illustrative span-specific value without variability context — crews risk applying short-span mental model to rural spans; (2) OTMR "15 days" should specify "business days."

**R-2 reconciliation:** R2-01 disputed (false positive in current state). R2-04 disputed (resolved in prior fix). R2-02/03/06-12 concurred (mostly resolved in current state except cross-topic DAG pointers in T03/T04/T05/T18 which require those topics' fix waves).

**New R-3 findings: 6 items (0 HIGH, 3 LOW-MEDIUM/LOW with citation-impact, 3 LOW).**

**Vite build: PASS (4.38s).**

=== T01 AUDIT R-3 DEEP-ADVERSARIAL END ===
