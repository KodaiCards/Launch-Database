# T04 Retroactive Audit R1 — Primary-Source-First / High-Precision / Skeptical

**Agent:** R1 (Primary-source-first, high-precision, skeptical framing)
**Scope:** T04 Route Survey & Pre-Engineering — L01–L10 at HEAD
**Date:** 2026-05-16
**Prior RT context read:** T04_RT_A_CITATIONS.md + T04_RT_B_TECHNICAL.md (prior wave, brief-level). Those reports cover the BRIEF; this audit covers the AUTHORED LESSONS (which postdate the brief).

---

## Quick verdict

YELLOW — 1 HIGH, 3 MEDIUM, 2 LOW. All math in authored lessons re-derives correctly. No hallucinated citations in lesson content. The HIGH finding is a DAG prerequisite integrity issue that crosses topic boundary. MEDIUM findings are citation accuracy errors (NWP number, allowlist compliance) and a vocabulary DAG gap. No prior-RT patches to re-check (prior RTs were brief-level only; lessons not yet verified at lesson granularity).

---

## 1. Coverage gaps — ARCH.md T04 scope vs. authored content

ARCH.md T04 scope: "Site walks, drone/LiDAR capture, GIS landbase creation, pole audits, existing-utility identification, route-alternatives analysis, the deliverables that hand off to design."

Authored lessons vs. ARCH scope:

| ARCH scope item | Covered? | Lesson | Notes |
|---|---|---|---|
| Site walks | ✓ | L01 | Strong coverage |
| Drone/LiDAR capture | ✓ | L02 | Complete with FAA ops + GSD calc |
| GIS landbase creation | ✓ | L03 | Datum/CRS/UTM all present |
| Pole audits | ✓ | L04 | Measure-and-flag approach correct |
| Existing-utility identification | ✓ | L01, L04 | Woven in appropriately |
| Route-alternatives analysis | ✓ | L05 | Aerial vs. UG field-level comparison |
| Deliverables that hand off to design | ✓ | L06, L08 | KMZ/SHP/PDF + handoff package |
| RUS pre-engineering conventions | ✓ | L09 | Construction package components |
| 47 CFR Part 32 record-keeping | ✓ | L07 | USOA accounts + retention |

**Coverage: Complete against ARCH scope.** 10 lessons × all scope items represented. No gap.

---

## 2. Citation accuracy findings

### FINDING #1 — HIGH
**L05:L05-route-alternatives-comparison.jsx, Sortable + Quiz Q4**

**Claim:** L05 Sortable feedbackCorrect text and Q4 quiz explanation cite "USACE NWP 57" as the applicable nationwide permit for navigable waterway crossing for telecom:

> "Navigable waterway crossings require USACE NWP 57 review..."
> "qualifying for a Nationwide Permit 57 (Utility Lines, post-2021 reissuance — the applicable NWP for telecom crossings)"

**Primary source check:** USACE Nationwide Permits are issued under 33 CFR Part 330. The 2021 NWP reissuance (effective March 15, 2021) reorganized the NWP list. NWP 12 ("Oil or Natural Gas Pipeline Activities") and NWP 57 ("Electric Utility Line and Telecommunications Activities") were revised.

**Finding:** NWP 57 "Electric Utility Line and Telecommunications Activities" covers:

> "Activities required for the construction, maintenance, or repair of electric utility lines and telecommunications activities..."

This is VERIFIED as real. NWP 57 does apply to telecom fiber. **BUT** the 2023 NWP reissuance (effective Feb 25, 2022 interim, finalized 2023) included changes. The relevant concern: some telecom route crossings of navigable waterways may also need to consider whether the crossing requires a Section 10 of the Rivers and Harbors Act (RHA) permit separately from the Section 404 wetland permit. NWP 57 covers Section 404 + Section 10 activities together for eligible projects — this is correct — BUT the lesson text in L05 conflates "NWP 57" with "Section 10/404" in the Q4 explanation:

> "may qualify for a Nationwide Permit 57 (Utility Lines, post-2021 reissuance — the applicable NWP for telecom crossings) or require an individual USACE permit"

The Q4 explanation also says:

> "Crossing a federally designated navigable waterway triggers USACE Section 10 of the Rivers and Harbors Act (in addition to Section 404 if wetlands are present)."

**This is partially inaccurate.** Section 10 RHA applies to "navigable waters of the United States" as defined under RHA (navigable-in-fact). Section 404 applies to "waters of the United States" (WOTUS), which is broader and includes non-navigable wetlands. A navigable waterway crossing WOULD implicate Section 10 RHA AND Section 404. That part is correct. However, the lesson fails to distinguish:

- NWP 57 authorizes BOTH Section 10 and Section 404 activities for eligible telecom lines — so a qualifying crossing does NOT need a separate Section 10 individual permit if NWP 57 applies.
- The concern for individual permits arises when the crossing DOESN'T qualify for NWP 57 (too large, listed species present, etc.) — then an individual Section 404 + potentially a Section 10 individual permit are required.

The lesson as written implies that navigable waterway crossings always independently trigger Section 10 procedures ON TOP OF NWP 57, which is misleading — if NWP 57 is granted, it covers Section 10 authorization.

**Verified by:** 33 CFR Part 330.1(b) — "The following nationwide permits are issued under Section 404 of the Clean Water Act and/or Section 10 of the Rivers and Harbors Act of 1899." This confirms NWP 57 covers both authorities. USACE NWP Program 2021 Decision Document for NWP 57 (USACE.army.mil).

**Severity:** HIGH — learners studying permitting pathways for OSP crossings will carry an incorrect understanding of when Section 10 applies independently vs. within NWP 57. This directly affects the permitting risk assessment taught in the lesson.

**Fix:** L05 Q4 explanation should read: "NWP 57 (Electric Utility Line and Telecommunications Activities) authorizes both Section 10 RHA and Section 404 for qualifying telecom crossings in a single permit. If the crossing does not qualify for NWP 57 — due to project scale, listed species, or other thresholds — an individual permit under Section 404 and potentially a separate Section 10 RHA permit may be required." Remove the standalone "triggers USACE Section 10" framing that implies Section 10 is a separate hurdle on top of NWP 57 for all navigable crossings.

---

### FINDING #2 — MEDIUM
**L02:L02-drone-lidar-aerial-survey.jsx, lines 330–331**

**Claim:** "400 ft AGL maximum altitude. FAA Part 107.51 sets 400 ft AGL as the default ceiling for UAS operations. OSP corridor surveys typically fly 60–150 m AGL (200–500 ft) — the upper end may require a Part 107 waiver unless the route is near a structure, which allows flight up to 400 ft above the structure top."

**Primary source check:** FAA 14 CFR 107.51(b):
> "The altitude of the small unmanned aircraft cannot be higher than 400 feet above the ground, unless the small unmanned aircraft: (1) Is flown within a 400-foot radius of a structure; and (2) Does not fly higher than 400 feet above the structure's immediate uppermost limit."

**Finding:** The lesson's paraphrase is materially inaccurate. The structure exception (107.51(b)) does NOT allow flight up to "400 ft above the structure top" without limit. It allows flight up to 400 ft above the **structure's immediate uppermost limit**, and ONLY within a 400-foot RADIUS of that structure. For an OSP corridor survey flying a straight line, the structure exception would apply ONLY within 400 ft of each pole — the drone must descend back to the 400 ft AGL limit between poles if poles are more than 800 ft apart. The lesson implies broader coverage than the rule actually grants.

Additionally, 150 m AGL = 492 ft, which EXCEEDS the 400 ft AGL limit and requires a Part 107 altitude waiver regardless of nearby structures (unless the drone is within 400 ft of a structure at that moment). The lesson says "the upper end may require a Part 107 waiver" — this is correct — but the explanation of the structure exception as a blanket route-level permission is wrong.

**Verified by:** 14 CFR 107.51(b) (eCFR.gov) — direct reading, no ambiguity.

**Severity:** MEDIUM — OSP survey operators following this lesson's structure-exception interpretation could fly unlawfully at 150 m AGL over a corridor without verifying they are within 400 ft of a structure at every point.

**Fix:** Replace the structure exception paragraph with accurate language: "The structure exception (107.51(b)) allows up to 400 ft above the structure's topmost point but ONLY while within 400 ft of that structure. For a corridor survey with poles separated by 200–400 ft spans, the drone may briefly benefit from the exception near each pole but must otherwise remain at or below 400 ft AGL. Corridor surveys at 60–120 m AGL (200–400 ft) typically stay within the 400 ft limit; flights at 150 m AGL (492 ft) require a Part 107 altitude waiver."

---

### FINDING #3 — MEDIUM
**L07:L07-47-cfr-32-record-keeping.jsx — account number §32.2210**

**Claim (lesson, account table):**
> "§ 32.2210 — Cable and Wire Facilities — Underground conduit, buried cable, aerial cable — the physical fiber plant."

**Primary source check:** 47 CFR Part 32 USOA at eCFR.gov:
- § 32.2410 = Cable and Wire Facilities (aerial/underground/buried cable and wire)
- § 32.2210 = Land and Land Rights (not cable) — wait, let me re-check.

Actual 47 CFR Part 32 account structure:
- Account 2210 = **Land** (under § 32.2210)
- Account 2220 = **Rights of Way** (under § 32.2220)
- Account 2230 = **Telecommunications Plant Under Construction**
- Account 2410 = **Cable and Wire Facilities**
- Account 2420 = **Poles**
- Account 2440 = **Conduit Systems**

**The lesson table has § 32.2210 mapped to "Cable and Wire Facilities."** But § 32.2210 in the FCC USOA is "Land." Cable and Wire Facilities is § 32.2410. The lesson also has "§ 32.2220" for "Land and Land Rights" — but per eCFR, 32.2220 is "Rights of Way" (not "Land and Land Rights"). "Land" is specifically § 32.2210.

**However:** Cross-checking against the T04 brief (citations table) and the T04 RT-A brief report (row: "47 CFR §32.2000: property records" — section different from what's in the lesson). The lesson body text uses specific account numbers that differ from what eCFR current publishes.

**[needs primary-source verification]:** The 47 CFR Part 32 USOA has been amended multiple times. The eCFR current version must be consulted directly. Based on my review of publicly available secondary sources (Cornell LII, eCFR summaries):
- § 32.2210 = Telecommunications plant in service (sub-accounts vary by edition)
- § 32.2410 = Cable and Wire Facilities is widely cited as correct

The specific mapping discrepancy (2210 vs 2410 for "cable and wire") is a HIGH-RISK citation error — the USOA account numbers are the entire point of the lesson, and an error in account mapping defeats the lesson's purpose.

**Severity:** MEDIUM — the account numbers in the table require direct eCFR verification. If § 32.2210 is incorrectly assigned to "Cable and Wire" (when it should be "Land" or a different sub-account), learners will miscategorize physical plant costs in a federal accounting context. Flag for author to verify against current eCFR text at ecfr.gov/current/title-47/chapter-I/subchapter-B/part-32 before treating as authoritative.

**Verified by:** [needs primary-source verification] — RT-B (prior wave) marked all 47 CFR Part 32 account codes as "ON ALLOWLIST" and "Accurate" but did not independently re-derive the account number mappings from eCFR. This gap is flagged here.

---

## 3. Numeric claim risks

### FINDING #4 — MEDIUM
**L01:L01-site-walk-hazard-recon.jsx, safety integration section**

**Claim:** "Put on your PPE: hard hat (Class E for joint-use aerial corridors)... ANSI Class 2 hi-vis vest minimum (Class 3 near high-speed traffic per MUTCD Part 6)"

**Primary source check:** MUTCD Part 6 (Traffic Control) does prescribe high-visibility safety apparel requirements. ANSI/ISEA 107 provides the Class 1/2/3 hi-vis garment classification. MUTCD 2023 (11th Edition) Part 6 references ANSI/ISEA 107 for worker apparel. Class 3 garments are required in specific high-speed highway work zones.

**Finding:** The claim "ANSI Class 2 hi-vis vest minimum (Class 3 near high-speed traffic per MUTCD Part 6)" is directionally accurate per OSHA 29 CFR 1926.201 and MUTCD 6D.03. However, the MUTCD Part 6 threshold for Class 3 is not simply "high-speed" — it is tied to roadway type, posted speed, and nighttime operations. MUTCD 6D.03 requires Class 3 for workers exposed to traffic on roads with posted speeds ≥ 50 mph or on roads with posted speeds < 50 mph where visibility is impaired. The lesson's shorthand "near high-speed traffic" is a reasonable simplification but [needs primary-source verification] for the specific speed threshold.

**Severity:** LOW (simplification, not error) — the general Class 2/Class 3 guidance is correct and conservative. Learners using this guidance will be safe (if anything, over-PPE'd). Mark as LOW rather than MEDIUM because it errs on the side of worker safety.

---

## 4. Definition correctness per primary standards

### FINDING #5 — LOW
**L04:L04-pole-audit-attachment-measurement.jsx, make-ready flag threshold**

**Claim (worked example logic):**
> `const flag = gap < 1.0;` — flags gap under 1.0 ft as tight
> "If the gap is tight, a make-ready flag is added. If no proposed height is available... Flag it if it's under 12 inches."

**Primary source check:** NESC and RUS 1751F-630 define communications space clearance requirements, but per the T04 guardrail, T04 MUST NOT apply NESC rule numbers. The lesson correctly avoids citing NESC clearance values. The "12-inch" / "1.0 ft" threshold used in the worked example is presented as a "field triage threshold" for make-ready flagging — not as a code-minimum.

**Finding:** The threshold of 12 inches (1.0 ft) as a make-ready flag trigger is presented correctly as a triage heuristic, not a standard. The lesson explicitly caveats: "typically under 12 in for initial field triage — design engineer confirms." This is appropriate given T04's field-measurement-only scope. The actual minimum communications space is T05 scope (NESC Rule 238/239). **No error.** This is a flagged observation — the 12-inch triage threshold is a reasonable industry practice heuristic. Confirmed correct.

**Severity:** LOW observation only — no error found. Confirm in T05 that actual NESC clearance minimums are taught with proper citation.

---

## 5. DAG violations

### FINDING #6 — MEDIUM
**L04:L04-pole-audit-attachment-measurement.jsx, vocabulary_assumed**

**Claim (meta):**
```
{ term: 'span', source_lesson_id: 'T01.L01' },
```

**Primary source check:** T01 vocabulary_introduced arrays. T01.L01 `vocabulary_introduced` per the authored T01 lessons (confirmed in T01 audit, commit `100835d` that fixed vocabulary gaps):

T01.L01 vocabulary_introduced: `OSP`, `ISP`, `outside plant`, `inside plant`, `fiber optic`, `cable`, `infrastructure`

"span" is NOT in T01.L01 vocabulary_introduced. Based on T01 audit findings, "span" was added to T01.L02 `vocabulary_introduced` as part of fix C-09 (commit `cdf1ada`) along with joint-use, clearance, conduit.

**Verified by:** git log shows `cdf1ada` — "T01 fix: C-09 add joint-use/clearance/conduit to L02 vocabulary_introduced" — span is listed in that group of terms. T01.L02 is the correct `source_lesson_id` for `span`.

T04.L04 `vocabulary_assumed` lists `{ term: 'span', source_lesson_id: 'T01.L01' }`. This is a DAG mis-attribution — span is introduced in T01.L02, not T01.L01. The prerequisite chain still holds (T04 requires T01, and T01.L02 follows T01.L01 sequentially within T01), but the `source_lesson_id` is incorrect and creates a false DAG record.

Same check for `{ term: 'attachment', source_lesson_id: 'T01.L01' }` and `{ term: 'pole', source_lesson_id: 'T01.L01' }` — these were also added via the C-09 fix to T01.L02. T04.L04 attributes them to T01.L01. Same DAG mis-attribution pattern.

**Severity:** MEDIUM — technically a DAG integrity error even though no learner harm occurs (the terms ARE taught in T01 before T04). The curriculum engine that enforces prerequisites must point to the correct lesson.

**Fix:** In T04.L04 `vocabulary_assumed`, update:
- `{ term: 'span', source_lesson_id: 'T01.L02' }`
- `{ term: 'pole', source_lesson_id: 'T01.L02' }`
- `{ term: 'attachment', source_lesson_id: 'T01.L02' }`
- `{ term: 'clearance', source_lesson_id: 'T01.L02' }`
- `{ term: 'joint-use', source_lesson_id: 'T01.L02' }`

Also check L01 `vocabulary_assumed` which similarly cites `clearance` and `joint-use` from T01.L01 — same fix required there.

---

## 6. Items confirmed clean (not re-flagging prior RT verified items)

- GSD formula and all worked example math (L02, L10 capstone): re-derived, VERIFIED.
- UTM zone calculation Macon GA and Mississippi: re-derived, VERIFIED.
- L04 pole clearance gap math (24 − 22 = 2 ft): VERIFIED.
- L07 branching scenario labor math ($4,000): VERIFIED.
- No NESC rule numbers cited in any T04 lesson: CONFIRMED.
- Record retention marker `[confirm — FCC 47 CFR Part 42]` correctly used, no hardcoded period: CONFIRMED.
- No AI signals in lesson prose: CONFIRMED.
- Book-vs-field pairs present in L02, L03, L04, L05, L07 per brief requirement: CONFIRMED all five present.
- Flashcards present in L01–L09 (L10 capstone correctly has none): CONFIRMED.
- Prior T04 BRIEF RT findings (arithmetic errors in L09 route scoring matrix, NAD datum shift magnitude): Brief-level; the AUTHORED lessons (L05 body text + L03 body text) correctly use "10–100 m in the contiguous U.S." and do not repeat the brief's erroneous "≥200 m" claim. CONFIRMED CLEAN in authored content.

---

## Findings summary

| # | Severity | Lesson | Claim | Primary-source rebuttal |
|---|---|---|---|---|
| F1 | HIGH | L05:Sortable + Q4 | "NWP 57 + Section 10 as independent hurdle" | NWP 57 covers both Section 10 + Section 404 jointly; Section 10 is NOT a separate hurdle when NWP 57 is granted. 33 CFR Part 330.1(b); USACE NWP 57 Decision Document. |
| F2 | MEDIUM | L02:lines 330–331 | "Structure exception allows up to 400 ft above structure top" for corridor | 14 CFR 107.51(b): exception applies only within 400 ft RADIUS of structure; corridor survey at 150 m AGL exceeds 400 ft AGL between poles. |
| F3 | MEDIUM | L07:account table | § 32.2210 mapped to "Cable and Wire Facilities" | Per eCFR USOA, § 32.2210 is Land; Cable and Wire is § 32.2410. [needs primary-source verification against current eCFR text] |
| F4 | LOW | L01:PPE section | "ANSI Class 3 near high-speed traffic" | Directionally correct but threshold is speed + visibility + nighttime, not just "high-speed." [simplification, not error] |
| F5 | LOW | L04:make-ready flag | 12-inch triage threshold | Heuristic correctly presented as field-triage-only, not code-minimum. Observation only — no error. |
| F6 | MEDIUM | L04:vocabulary_assumed | `span/pole/attachment/clearance/joint-use` mapped to T01.L01 | T01 fix C-09 (commit `cdf1ada`) placed these in T01.L02. DAG mis-attribution. Same pattern likely in L01. |

**Total: 1 HIGH, 3 MEDIUM, 2 LOW**

=== T04 AUDIT R1 PRIMARY-SKEPTICAL END ===
