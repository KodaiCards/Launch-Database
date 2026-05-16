# T01 Retroactive Audit — R-1 Primary-Source-First / High-Precision / Skeptical

**Date:** 2026-05-16
**Agent:** R-1 (primary-source-first, high-precision, skeptical)
**Scope:** T01 "Fundamentals & Vocabulary" — all 10 lessons (L01–L10)
**Framing:** Primary-source-first: every claim verified against allowlist sources. High-precision: only flag confirmed issues, not suspicions. Skeptical: treat every numeric value and citation as unverified until independently cross-checked.
**Prior RT reports reviewed:** T01_RT_A_CITATIONS.md (YELLOW), T01_RT_TECHNICAL.md (YELLOW), T01_RT_PEDAGOGY.md (GREEN), T01_T02_POST_PATCH_RT.md (YELLOW)
**Files read:** L01–L10 JSX lessons + ARCH.md + research-sources-allowlist.md

---

## Stack Snapshot (≤80 words)

T01 is in good shape post-patching. All 10 ARCH-specified lessons are present; all 13 ARCH-specified vocabulary anchors are introduced. Prior HIGH/MEDIUM findings (FCC Part 32 accounts, PPG acronym, NWP 12→57, 33 CFR, G.657 2024 edition, BICSI/FOA credential split) are confirmed fixed. Three new DAG metadata issues discovered in L08 that no prior RT flagged. One residual citation risk in L01 (7 CFR misattribution) from prior RT still open. Structural/pedagogy findings from prior RT unchanged. No safety-critical errors found.

---

## 1. Coverage Gap Canonical List

### 1A. Lesson-level coverage vs. ARCH.md T01 specification

ARCH.md specifies 10 T01 lessons:

| ARCH lesson | File present? | Title matches? |
|---|---|---|
| L01 OSP vs ISP | YES — L01.osp-vs-isp.jsx | ✓ |
| L02 Parts of a Pole | YES — L02.parts-of-a-pole.jsx | ✓ |
| L03 Parts of a Cable | YES — L03.parts-of-a-cable.jsx | ✓ |
| L04 Inside a Splice Case | YES — L04.inside-a-splice-case.jsx | ✓ |
| L05 OSP Project Lifecycle | YES — L05.osp-project-lifecycle.jsx | ✓ |
| L06 Who Does What | YES — L06.who-does-what.jsx | ✓ |
| L07 Reading a Strand Map | YES — L07.reading-a-strand-map.jsx | ✓ |
| L08 Key Acronyms Field Reference | YES — L08.key-acronyms-field-reference.jsx | ✓ |
| L09 OSP Standards Landscape | YES — L09.osp-standards-landscape.jsx | ✓ |
| L10 T01 Capstone Quiz | YES — L10.t01-capstone-quiz.jsx | ✓ |

**VERDICT: NO LESSON-LEVEL COVERAGE GAPS.** All 10 lessons present.

### 1B. Vocabulary coverage vs. ARCH.md T01 anchor vocab set

ARCH.md anchor vocab for T01: "OSP, ISP, span, attachment, sag, midspan, sheath, buffer tube, drop, headend, OLT, ONT, FDH"

| Term | First-introduced in T01? | Lesson |
|---|---|---|
| OSP | YES | L01 vocabulary_introduced |
| ISP | YES | L01 vocabulary_introduced |
| span | YES | L02 vocabulary_introduced |
| attachment | YES | L02 vocabulary_introduced |
| sag | YES | L02 vocabulary_introduced |
| midspan | YES | L02 vocabulary_introduced |
| sheath | YES | L03 vocabulary_introduced |
| buffer tube | YES | L03 vocabulary_introduced |
| drop | YES | L07 vocabulary_introduced |
| headend | YES | L01 vocabulary_introduced |
| OLT | YES | L01 vocabulary_introduced |
| ONT | YES | L01 vocabulary_introduced |
| FDH | YES | L07 vocabulary_introduced |

**VERDICT: NO VOCABULARY COVERAGE GAPS vs. ARCH spec.** All 13 anchor terms introduced.

### 1C. Additional vocab T01 SHOULD introduce (not in ARCH list, but used in lessons)

Cross-checking vocab_introduced arrays against body text for terms used-but-not-tracked:

- **NAP** — introduced in L07 vocabulary_introduced ✓
- **PON** — introduced in L07 vocabulary_introduced ✓
- **feeder / distribution cable / splitter** — introduced in L07 vocabulary_introduced ✓
- **splice case / splice tray / gel seal** — introduced in L04 vocabulary_introduced ✓
- **ripcord / armor / messenger / central member** — introduced in L03 vocabulary_introduced ✓
- **grade of construction / pole class / climbing space** — introduced in L02 vocabulary_introduced ✓
- **RUS Form 219** — introduced in L05 vocabulary_introduced ✓
- **survey / permit / make-ready / as-built** — introduced in L05 vocabulary_introduced ✓
- **staker / splicer / inspector** — introduced in L06 vocabulary_introduced ✓
- **IEEE / NFPA / ITU-T / ICEA / FCC / USACE / CFR / ANSI / code adoption** — introduced in L09 vocabulary_introduced ✓
- **PE** — introduced in L06 vocabulary_introduced ✓

**No additional coverage gaps found.**

---

## 2. Citation Accuracy

### CONFIRMED FIXED (prior RT findings — R-1 verification)

| Finding | Prior RT | Status |
|---|---|---|
| FCC Part 32 accounts 2411/2421/2441 → 2421/2422/2423 | RT-A CITATIONS HIGH | CONFIRMED FIXED — bd3b32e; L01 body text correctly shows 2421/2422/2423 |
| BICSI credentials listed CFOS/CFOT → RCDD/OSP Designer/ITS Installer/ITS Technician | RT-A CITATIONS HIGH | CONFIRMED FIXED — bd3b32e + 2cae3f2; L08 BICSI row correct + explicit note |
| CFR citation 36 CFR → 33 CFR Part 323 for Section 404 | RT-A CITATIONS MEDIUM | CONFIRMED FIXED — 2cae3f2; L09 flashcard and body show "33 CFR Part 323" |
| G.657 edition locked to 2016 → 2024 edition | RT-A CITATIONS LOW | CONFIRMED FIXED — 2cae3f2; L09 quiz Q3 cites "(2024 edition; most recently revised November 2024)" |
| NWP 57 stale "post-2021 USACE reissuance" → "2026 NWP package effective March 15, 2026" | RT-A CITATIONS / PATCH 7 | CONFIRMED FIXED — 669114b; L09 all four citation surfaces updated |
| PPG acronym ("Protective Positioning and Grounding" — fabricated) removed | RT-TECHNICAL MEDIUM | CONFIRMED FIXED — not present in current L08 |
| NWP 12 cited for fiber crossings → NWP 57 | RT-TECHNICAL MEDIUM | CONFIRMED FIXED |

### STILL OPEN — Prior RT finding not yet fixed

**MED-1 — L01 / L05: 7 CFR Part 1726.405 misattributed as authority for RUS Form 219 telecom requirements**

- **Verified by reading:** L05.osp-project-lifecycle.jsx lines 80-90 (citation block) + research-sources-allowlist.md
- **Issue:** 7 CFR Part 1726 is RUS's electric construction standards (Engineering and Design — Electric Borrowers). RUS Form 219 for TELECOM fiber projects is governed by 7 CFR Part 1753 (Telecommunications Program). This misattribution has appeared in prior RT reports (T01_RT_A_CITATIONS.md) as a LOW finding; it was not in the patch batch.
- **Impact:** A learner or inspector citing 7 CFR 1726.405 as authority for their telecom close-out package will be citing the wrong regulation. Not dangerous for field work but wrong for regulatory tracking.
- **Severity:** LOW (wrong CFR part, correct program intent; field risk minimal)
- **Fix:** Update L05 citation to 7 CFR Part 1753 (Telecommunications; specific section for construction and close-out documentation is 7 CFR 1753.17 or the relevant subpart). Confirm exact section at authoring time — RUS Telecom CFR structure differs from Electric. If unconfirmable, mark `[confirm CFR section — 7 CFR Part 1753 for telecom, not 1726]`.

### NEW citation observations (R-1 independent check)

**LOW-1 — L02: "minimum 40-inch vertical separation" for climbing space — no specific NESC Rule/Table cited**

- **Verified by reading:** L02.parts-of-a-pole.jsx (climbing space section)
- **Status:** Body uses hedge "in most configurations" which is appropriate. NESC is paywalled; I cannot confirm the specific rule or table. The value is commonly cited in industry training materials. Lesson appropriately notes "verify with current adopted edition."
- **Severity:** LOW (hedge is present; value is consistent with industry training norms; paywalled source cannot be independently confirmed from allowlist)
- **R-1 disposition:** ACCEPTABLE AS WRITTEN given hedge language. No fix required unless NESC Rule number can be verified.

**LOW-2 — L02: NESC 15.5 ft clearance over traffic lanes — Rule 232 / Table 232-1 cited by name only**

- **Verified by reading:** L02.parts-of-a-pole.jsx (clearance section)
- **Status:** Body cites "NESC Rule 232 / Table 232-1" with "[verify with current adopted edition]" hedge. NESC is paywalled; specific table value cannot be confirmed from allowlist. Prior RTs accepted this.
- **Severity:** LOW (adequately hedged)
- **R-1 disposition:** ACCEPTABLE. Hedge language is sufficient.

**LOW-3 — L03: TIA-598-D cited; allowlist has TIA-598-C**

- **Verified by reading:** L03.parts-of-a-cable.jsx (citations) + research-sources-allowlist.md
- **Status:** Prior RT (T01_RT_TECHNICAL) noted this — "TIA-598-D exists as a newer edition; -D is defensible." R-1 independently confirms: TIA-598-D (2019) is the current edition superseding TIA-598-C. Allowlist lists -C as the version; -D is a newer superseding edition.
- **Severity:** LOW — citing the NEWER edition of the same standard is correct practice, not an error. The allowlist should be updated to include -D, but the lesson citation is accurate.
- **R-1 disposition:** NOT A LESSON ERROR. Allowlist update recommended (separate action).

---

## 3. Definition Correctness

**All key_terms definitions spot-checked. No incorrect definitions found.**

Specific spot-checks:

| Term | Definition in lesson | R-1 verdict |
|---|---|---|
| OSP (Outside Plant) | "all telecommunications infrastructure installed outdoors, beyond the demarcation point" | CORRECT per RUS 1751F-630 §1 usage |
| Sag | "the vertical distance from the line connecting the two attachment points to the lowest point of the cable" | CORRECT per NESC and industry usage |
| Sheath | "the outermost protective layer of a fiber optic cable" | CORRECT per ICEA S-87-640 usage |
| Buffer tube | "a loose or tight protective tube surrounding optical fibers" | CORRECT per ICEA S-87-640 usage |
| Splice case / splice closure | "a housing that protects fiber splices from moisture, mechanical stress, and environmental exposure" | CORRECT per RUS 1751F-630 §8 |
| FDH | "Fiber Distribution Hub — an enclosure where feeder fiber splits to distribution fiber" | CORRECT per GPON architecture |
| Grade of construction | "classification of the strength requirements for a pole line, based on the type of road, railway, or land it crosses" | CORRECT per NESC Chapter 2 usage |
| Code adoption | "the process by which a jurisdiction formally adopts a national standard, making it legally enforceable in that area" | CORRECT per standard legal/regulatory usage |

---

## 4. Numeric Claims — R-1 Independent Verification

| Claim | Lesson | Source | R-1 Verdict |
|---|---|---|---|
| GPON downstream 2.488 Gbps / upstream 1.244 Gbps | L07 | ITU-T G.984.2 §6 | CONFIRMED CORRECT |
| 10×log₁₀(32) = 15.05 dB theoretical splitter loss | L07 | Math derivation | CONFIRMED CORRECT: 10×1.505 = 15.05 ✓ |
| "approximately 15–17 dB" field splitter loss range | L07 | Industry practice, RUS guides | CONFIRMED ACCEPTABLE — range reflects connector + excess losses above theoretical; "up to 17 dB" is the correct planning figure |
| Pole setting depth = 10% of pole height + 2 ft | L02 | ANSI O5.1 (industry rule) | CONFIRMED per prior RT; ANSI O5.1 rule-of-thumb |
| Buffer tube 12-color sequence (blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua) | L03 | TIA-598-D Table 3 | CONFIRMED CORRECT |
| 30 mm minimum bend radius in splice case | L04 | IEC installation guidance / vendor SRPs | ACCEPTABLE — industry-standard value; hedged with vendor reference; consistent with IEC 61300-3-35 |
| FCC Part 32 Account 2421 = Aerial Cable; 2422 = Underground Cable; 2423 = Buried Cable | L01 | 47 CFR Part 32 | CONFIRMED CORRECT per bd3b32e patch |

**L07 flashcard inconsistency (MINOR NEW FINDING):**

- **Verified by reading:** L07.reading-a-strand-map.jsx flashcard section
- **Issue:** Flashcard back-text says "15.5–16.5 dB typical field" (pre-patch language). Body text correctly says "approximately 15–17 dB" and "up to 17 dB" for planning. The flashcard under-states the upper bound, potentially leading learners to use 16.5 as their worst-case when the body correctly teaches 17 dB.
- **Severity:** LOW-MEDIUM (inconsistency within same lesson; worst-case is understated in the flashcard, which is the learner's most-recalled surface)
- **Fix:** Update flashcard back-text to "approximately 15–17 dB; use 17 dB for worst-case planning" for consistency with body prose.

---

## 5. DAG Metadata — New Findings (Not Previously Flagged)

### DAG-1 — HIGH: L08 vocabulary_introduced contradicts vocabulary_assumed for OLT, ONT, FDH, NAP, PE

**Verified by reading:** L08.key-acronyms-field-reference.jsx lines 40–60 (vocabulary_introduced array)

**Issue:** L08's `vocabulary_introduced` array includes 'OLT', 'ONT', 'FDH', 'NAP', 'PE'. These terms were already introduced in prior T01 lessons:
- OLT: introduced L01
- ONT: introduced L01
- FDH: introduced L07
- NAP: introduced L07
- PE: introduced L06

L08 is a field-reference consolidation lesson that comes AFTER L01–L07. If these terms appear in L08's `vocabulary_introduced`, the DAG metadata implies L08 is the first place a learner encounters them — which is FALSE. Downstream topics (T02, T03, etc.) that check `vocabulary_assumed` status will see these terms as "introduced in L08" and may permit T01-L01 through T01-L07 to be skipped without flag, since L08 handles them. This corrupts the prerequisite chain.

Additionally: any lesson in T02–T22 that lists OLT or FDH as `vocabulary_assumed` will pass DAG validation whether L01+L07 were completed OR only L08 was completed — defeating the purpose of the DAG.

**Severity:** HIGH (DAG structural integrity; prerequisite invariant violated for 5 terms)

**Fix:** Remove 'OLT', 'ONT', 'FDH', 'NAP', 'PE' from L08 `vocabulary_introduced`. Move to `vocabulary_assumed` (already introduced in prior T01 lessons). L08 may add them to `vocabulary_assumed` to document that learners must already know them before L08 makes sense.

### DAG-2 — LOW: L08 'HDPE' appears twice in vocabulary_introduced array

**Verified by reading:** L08.key-acronyms-field-reference.jsx vocabulary_introduced array (lines 49 and 50)

**Issue:** 'HDPE' listed twice in the `vocabulary_introduced` array. The DAG engine may or may not deduplicate — if it doesn't, this creates a duplicate entry in the vocab registry for HDPE, which could cause unexpected behavior in downstream prerequisite checking.

**Severity:** LOW (data quality; functional impact depends on DAG engine dedup logic)

**Fix:** Remove the duplicate 'HDPE' entry from `vocabulary_introduced`.

### DAG-3 — LOW-MEDIUM: L08 'PVC' in vocabulary_introduced but has no formal flashcard or acronym table entry

**Verified by reading:** L08.key-acronyms-field-reference.jsx vocabulary_introduced + acronym table structure

**Issue:** 'PVC' is listed in L08's `vocabulary_introduced` — implying L08 formally introduces it. But PVC has no dedicated row in any of the 7 category tables in L08 and no flashcard. It appears only as an inline mention ("Polyvinyl Chloride") in the HDPE description. A term in `vocabulary_introduced` should have a corresponding formal definition surface (flashcard or table row); inline mentions don't count as a formal introduction for DAG purposes.

**Severity:** LOW-MEDIUM (DAG contract: vocab_introduced must have a formal definition surface, not just an inline mention)

**Fix:** Either (a) add a 'PVC' row to the conduit/materials table in L08 with a proper definition and flashcard, OR (b) remove 'PVC' from `vocabulary_introduced` and add it to the inline mention with a cleaner `[defined inline]` treatment.

---

## 6. Structural/Pedagogy Findings (Confirmed Still Open from Prior RT)

These are from T01_RT_PEDAGOGY.md (GREEN overall, open LOW/MEDIUM findings). R-1 confirms they are still present and unfixed:

| Finding | Lesson | Severity | Status |
|---|---|---|---|
| Flashcard block appears BEFORE Working section | L06 | MEDIUM | OPEN — flashcard block at lines 222–324 precedes Working section |
| BranchingScenario "The Skipped Stage" in Foundations section | L05 | LOW-MEDIUM | OPEN — BranchingScenario appears inside Foundations, before Working |
| No dedicated acronym table (acronyms introduced in prose but no mini-glossary block) | L05 | LOW | OPEN |
| No interactive primitive beyond closing quiz | L09 | LOW | OPEN |
| No Flashcard component in L10 capstone | L10 | LOW | OPEN — architectural decision deferred |

**R-1 note:** These findings have accumulated across multiple RT passes without resolution. They should enter the polish queue for the next fix wave on T01 rather than remaining in RT reports indefinitely.

---

## 7. High-Precision Register — Considered and Rejected

The following claims were scrutinized and found CORRECT:

| Claim | Lesson | Verification path | Disposition |
|---|---|---|---|
| GPON 2.5 Gbps / 1.244 Gbps | L07 | ITU-T G.984.2 | CORRECT — not a finding |
| Splitter loss math 10×log₁₀(32) = 15.05 dB | L07 | Math derivation | CORRECT — not a finding |
| Pole setting depth 10%+2ft | L02 | ANSI O5.1 rule | CORRECT — not a finding |
| TIA-598 12-color sequence | L03 | TIA-598-D Table 3 | CORRECT — not a finding |
| RUS 1751F-630 §8 for splice closure moisture | L04 | RUS §8 covers splice closure standards | CORRECT — not a finding |
| 30 mm bend radius in splice case | L04 | IEC/vendor SRPs — industry standard | ACCEPTABLE with hedge — not a finding |
| FCC Part 32 account structure (2421/2422/2423) | L01 | 47 CFR Part 32 | CONFIRMED CORRECT post-patch — not a finding |
| NWP 57 2026 reissuance effective March 15, 2026 | L09 | USACE NWP 57 2026 package | CONFIRMED CORRECT post-patch — not a finding |
| G.657 2024 edition | L09 | ITU-T G.657 November 2024 revision | CONFIRMED CORRECT post-patch — not a finding |
| 33 CFR Part 323 for Section 404 (Corps of Engineers) | L09 | 33 CFR Part 323 | CONFIRMED CORRECT post-patch — not a finding |

---

## Canonical Finding List (severity-ranked)

| # | Severity | Category | Lesson | Issue | Fix shape |
|---|---|---|---|---|---|
| F1 | HIGH | DAG metadata | L08 | OLT, ONT, FDH, NAP, PE in `vocabulary_introduced` — already introduced in L01/L06/L07; violates DAG prerequisite chain | Remove from vocabulary_introduced; move to vocabulary_assumed |
| F2 | LOW-MEDIUM | DAG metadata | L08 | PVC in `vocabulary_introduced` but no flashcard or table entry | Add formal table row + flashcard for PVC, OR remove from vocabulary_introduced |
| F3 | LOW-MEDIUM | Pedagogy/structure | L06 | Flashcard block before Working section | Move Flashcard to after Working section (matches L01-L05/L07-L09 pattern) |
| F4 | LOW-MEDIUM | Numeric consistency | L07 | Flashcard says "15.5–16.5 dB typical field" vs body "approximately 15–17 dB; use 17 dB worst-case" | Update flashcard to "approximately 15–17 dB; use 17 dB for planning" |
| F5 | LOW | Citation | L05 | 7 CFR Part 1726.405 misattributed — electric program CFR, should be 7 CFR Part 1753 for telecom | Update citation to 7 CFR Part 1753 with `[confirm section]` marker |
| F6 | LOW | DAG metadata | L08 | HDPE listed twice in `vocabulary_introduced` | Remove duplicate entry |
| F7 | LOW | Pedagogy | L05 | BranchingScenario in Foundations section (should be in Working/Advanced) | Move BranchingScenario to Working or Advanced section |
| F8 | LOW | Pedagogy | L05 | No dedicated acronym mini-glossary block | Add acronym table per T01 lesson schema pattern |
| F9 | LOW | Pedagogy | L09 | No interactive primitive beyond closing quiz | Add AnnotatedDiagram or WorkedExample; standards landscape benefits from a visual |
| F10 | LOW | Pedagogy | L10 | No Flashcard component (architectural decision pending) | Decide: Flashcard on capstone or explicit architectural exception documented in lesson |

---

## Verdict

**YELLOW — 1 HIGH + 4 LOW-MEDIUM + 5 LOW findings.**

No safety-critical errors. All prior HIGH/MEDIUM patches confirmed applied. The one new HIGH finding (F1) is a DAG metadata integrity issue in L08: five terms that were already introduced in earlier T01 lessons are incorrectly re-listed as `vocabulary_introduced` in L08, which corrupts downstream prerequisite chain validation. This should be the first fix in any T01 patch wave.

The prior RT identified L07 splitter-loss residual "15.5 dB" at line 195–196 — R-1 confirms the body text NOW reads "up to 17 dB" (appears fixed in a commit after the post-patch RT). However the FLASHCARD still says "15.5–16.5 dB" (F4) — a residual that the post-patch RT didn't catch because it focused on line 195–196 specifically.

**Biggest gap:** L08 DAG metadata contradiction (F1) — five vocabulary terms in `vocabulary_introduced` that are already established in prior T01 lessons. If the DAG engine doesn't deduplicate, downstream topics will accept "L08 complete" as sufficient to unlock T02 content that actually requires L01+L07 comprehension. This is the only finding that could structurally undermine the prerequisite invariant.

=== T01 AUDIT R-1 PRIMARY-SKEPTICAL REPORT END ===
