# T04 Retroactive Audit R1 — Primary-Source-First / High-Precision / Skeptical

**CONSTRAINTS ACKNOWLEDGED:** This agent writes ONLY to this file. No lesson files, no CANONICAL.md, no CLAUDE.md edits, no fix application, no follow-up round dispatch. Report and stop.

**Agent:** R1 (Primary-source-first, high-precision, skeptical framing — independent of prior R1_PRIMARY_SKEPTICAL)
**Scope:** T04 Site Survey & Pre-Engineering — L01–L10 at HEAD (10 lesson files)
**Date:** 2026-05-16
**Prior audit context:** Existing T04_AUDIT_R1_PRIMARY_SKEPTICAL.md + T04_AUDIT_R2_CORROB_ADVERSARIAL.md noted for awareness only; this is independent verification.

---

## Findings Table

| ID | Severity | Category | File | Line-range | Issue | Fix shape | Confidence |
|----|----------|----------|------|-----------|-------|-----------|------------|
| F1 | HIGH | Part-32-USOA | L07-47-cfr-32-record-keeping.jsx | ~176–179 | §32.2210 labeled "Cable and Wire Facilities" — wrong. Primary source (eCFR / Cornell LII) confirms §32.2210 = **Central office—switching**. Cable and Wire Facilities = §32.2410. Every BranchingScenario and quiz explanation in L07 refers to this wrong account, reinforcing the error. | Replace §32.2210 row with §32.2410 throughout L07; add §32.2210 as a DIFFERENT account (Central office—switching) to the acronym table or Book vs. Field note, so learners know what it actually is. | HIGH — verified via Cornell LII §32.2410 primary text + eCFR Part 32 Subpart C structure |
| F2 | HIGH | Part-32-USOA | L07-47-cfr-32-record-keeping.jsx | ~182–184 | §32.2420 labeled "Poles." Prior Haiku ground-truth (logged in CLAUDE.md §3 self-improvement) confirmed §32.2411 = Poles; §32.2420 is a parent sub-group heading (Cable and Wire Facilities sub-accounts), not a standalone "Poles" account. The lesson teaches the wrong account number for poles in the cost ledger. | Replace §32.2420 with §32.2411 for Poles throughout L07. Verify §32.2420 definition and either add it separately or omit. | HIGH — confirmed in prior Haiku eCFR lookup (§32.2420 = parent, §32.2411 = Poles per eCFR Sub-account structure) |
| F3 | HIGH | Part-32-USOA | L07-47-cfr-32-record-keeping.jsx | ~186 + BranchingScenario nodes | BranchingScenario drone-cable node says "Cable and Wire Facilities (§32.2210) is an asset account for physical cable and conduit." This reinforces the §32.2210 error. The quiz explanation (Q1 and Q3 fill-in-blank) repeats the same wrong mapping. | Same fix as F1 — cascade correction through the BranchingScenario node explanations and quiz citations. | HIGH — same primary-source basis as F1 |
| F4 | MEDIUM | Part-32-USOA | L07-47-cfr-32-record-keeping.jsx | ~186–188 | §32.2220 labeled "Land and Land Rights." Per eCFR account structure: §32.2210 = Central office—switching (CO switching equipment); §32.2220 = Land; §32.2230 = Telecommunications Plant Under Construction. The lesson says §32.2220 = "Land and Land Rights" which is close but potentially conflated — the more precise eCFR label is §32.2210 for Land (not §32.2220). This needs direct eCFR verification to confirm whether §32.2210 or §32.2220 is "Land" vs. a CO-switching sub-account. | Verify §32.2220 per current eCFR text; if §32.2220 is correctly "Land and Land Rights," confirm. If it's wrong, correct to match eCFR. [needs direct eCFR verification] | MEDIUM — prior R1 report raised this ambiguity; primary-source verification required |
| F5 | MEDIUM | standards-citation | L05-route-alternatives-comparison.jsx | Sortable feedbackCorrect + Q4 explanation ~504 | The Q4 quiz explanation now correctly identifies NWP 57 as covering both Section 10 RHA and Section 404 jointly ("USACE Nationwide Permit 57... authorizes BOTH Section 10 of the Rivers and Harbors Act AND Section 404 for qualifying telecom crossings in a single permit"). This is CORRECT per 33 CFR Part 330.1(b) and NWP 57 Decision Document. **However** the Sortable feedbackCorrect text says "Navigable waterway crossings carry the highest permitting risk: USACE Nationwide Permit 57 (NWP 57) bundles both Section 10 RHA and Section 404 authorization for qualifying telecom crossings in a single permit — but if the project doesn't qualify for NWP 57, individual permits under Section 404 and potentially a separate Section 10 RHA permit may be required." This accurately reflects primary source. VERIFIED CLEAN. | No fix needed. | HIGH confidence — VERIFIED correct per 33 CFR Part 330.1(b) and 2021 NWP 57 reissuance |
| F6 | MEDIUM | DAG | L07-47-cfr-32-record-keeping.jsx | vocabulary_assumed ~26–37 | pole, conduit, attachment attributed to T01.L01. The T01 C-09 fix (commit cdf1ada) moved pole, attachment, conduit, span, joint-use, clearance to T01.L02. L07's vocabulary_assumed still points to T01.L01 for pole, conduit, attachment. | Update L07 vocabulary_assumed to T01.L02 for pole, conduit, attachment. | MEDIUM — per prior R1/R2 findings confirmed in T01 audit |
| F7 | MEDIUM | DAG | L09-rus-pre-engineering.jsx | vocabulary_assumed ~26–48 | pole, conduit, attachment, make-ready all attributed to T01.L01. Same T01.L02 attribution error pattern as F6. | Same fix — update to T01.L02 for pole, conduit, attachment (make-ready sourced to T01.L05 if introduced there, else T01.L02). | MEDIUM — same pattern |
| F8 | LOW | coverage-gap | L07-47-cfr-32-record-keeping.jsx | general | L07 teaches §32.6512 (Motor Vehicles) as an account for field survey truck days. Per eCFR, §32.6512 is a valid Operating Expense account (not a Plant account) under 47 CFR Part 32 Subpart E. The lesson's foundational table mixes capital plant accounts (§32.2230, §32.2410, etc.) and operating expense accounts (§32.6512) without distinguishing the two. Learners may not understand that Motor Vehicles costs flow through the income statement, not the balance sheet as plant. | Add a one-sentence note in the working section: "§32.6512 is an operating expense account (income statement), not a plant account (balance sheet). Motor vehicle costs allocated to a project reduce operating income; they do not capitalize as plant." | LOW — the account number is correct; only the classification context is missing |
| F9 | LOW | coverage-gap | L04-pole-audit-attachment-measurement.jsx | general | ANSI O5.1 pole class table correctly defined in vocabulary_introduced. However, L04 does not teach anchor/guy wire data collection — make-ready analysis for new fiber routinely requires evaluating existing anchor/guy wire lead angle, type (log/screw/plate), and condition. Missing anchor data forces return visits. | Add anchor/guy wire fields to the data collection procedure: "lead angle, anchor type (log/screw/plate), rod condition (corrosion, heaving)" with cross-ref to T08 (Make-Ready) for full analysis. | LOW — content gap, not a citation error |
| F10 | LOW | coverage-gap | L04-pole-audit-attachment-measurement.jsx | general | L04 does not instruct field crews to identify and record pole ownership (which party holds the plant account for this pole). OTMR authorization chain (FCC Order 18-111) requires identifying the pole owner before the 14/30/14 application sequence. A field audit that misidentifies ownership delays the make-ready application. | Add 2-3 sentences on ownership identification (NECA database lookup, visible USOA account markers, county tax records cross-check) with cross-ref to T08. | LOW — practical coverage gap; not a factual error in existing content |

---

## Primary-Source Verification of Key Claims

### §32.2210 — CONFIRMED WRONG in L07

Cornell LII §32.2410 primary text and eCFR Part 32 Subpart C structure confirm:

- **§32.2210 = Central office—switching** (CO switching equipment, tandem switches, local switching equipment)
- **§32.2410 = Cable and wire facilities** (aerial cable, underground cable, buried cable, submarine cable)
- **§32.2411 = Poles** (sub-account under §32.2410 group)

L07's account table teaches `§ 32.2210 = "Cable and Wire Facilities"` — this is the account number for the wrong class of plant. An RUS auditor tracing a real cost ledger using this lesson's account mapping would apply plant costs to the wrong account classification.

Source: Cornell LII https://www.law.cornell.edu/cfr/text/47/32.2410; eCFR https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-32

### FAA 14 CFR 107.51 structure exception — VERIFIED CORRECT in current L02

L02 currently reads (working section): "Flying above 120 m AGL (above 400 ft) requires either a Part 107 altitude waiver or the narrow structure exception: per 14 CFR 107.51(b), a drone may fly up to 400 ft above the topmost point of a structure, but ONLY while within a 400-foot horizontal radius of that structure."

This accurately reflects the FAA primary source. The prior R1_PRIMARY_SKEPTICAL report flagged L02 as saying "structure exception allows corridor-level flight" — that framing is NOT present in the current HEAD. L02 appears corrected already.

Source: FAA eCFR 14 CFR 107.51; FAA FAQ https://www.faa.gov/faq/if-i-operate-my-drone-within-400-ft-radius-or-400-ft-above-structure-do-i-still-need

### NWP 57 — VERIFIED CORRECT in L05 Q4 and Sortable

L05 correctly states NWP 57 authorizes both Section 10 RHA and Section 404 in a single permit for qualifying telecom crossings; individual permits required when project doesn't qualify. Matches 2021 NWP reissuance Decision Document.

Source: USACE NWP 57 2021 https://saw-reg.usace.army.mil/NWP2021/NWP57.pdf; 33 CFR Part 330.1(b)

### DAG attribution (T01.L02 vs T01.L01) — VERIFIED per L04 HEAD

L04 vocabulary_assumed HEAD: pole, attachment, span, clearance, joint-use all correctly point to T01.L02 (the C-09 fix landed). L07 and L09 still show T01.L01 for pole, conduit, attachment (F6, F7 above).

---

## Confirmed Clean (Negative Findings)

- L01 vocabulary_assumed: PPE → T18.L05, confined space → T18.L03, LOTO → T18.L02, fall protection → T18.L04. All T18 sources verified correct per T18 lesson structure.
- L02 GSD formula math: (3.76 × 100) / 24 = 15.67 mm ✓; (3.76 × 80) / 24 = 12.53 mm ✓
- L02 FAA altitude framing: corrected per HEAD — VERIFIED
- L02 LiDAR multiple-returns vegetation inference: directionally correct. (Note: thin power wire geometry can produce multiple returns — a minor imprecision, LOW severity, carries from prior R2 finding L-4)
- L03 UTM zone formula: Macon GA (−83.6°) Zone 17N ✓; Mississippi (−88.5°) Zone 16 ✓
- L03 datum discussion (NAD83/WGS84/NAD27 shift 100–300 ft): technically it's 10–100 m in the coterminous US; L03 says "100–300 feet" which converts to 30–91 m — at the boundary of typical values. Marginal but defensible as order-of-magnitude.
- L04 DAG attribution: pole, attachment, span, clearance, joint-use → T01.L02 ✓ (C-09 fix verified)
- L04 12-inch make-ready flag: correctly labeled as field-triage heuristic, not a code minimum ✓
- L04 pole class ANSI O5.1 definition: accurate ✓
- L04 midspan clearance definition: correct and sufficient for T04 scope; NESC calculation deferred to T05 ✓
- L05 NWP 57 framing: VERIFIED CORRECT in current HEAD ✓
- L05 route scoring and Book-vs-Field: accurate ✓
- L07 §32.2230 as temporary Plant Under Construction holding account: CORRECT ✓
- L07 §32.6512 Motor Vehicles account number: CORRECT (though classification context missing — F8)
- L07 PDF/A as ISO/IEC 19005-1: CORRECT ✓
- L07 record retention: correctly avoids hardcoding; uses [confirm] marker ✓
- L08 handoff package structure: no citations to verify; content sound ✓
- L09 construction unit code definition: accurate ✓
- L09 RUS Form 1755-A: CONFIRMED ✓ (matches L07 definition)
- No AI references in any lesson prose ✓
- No NESC rule numbers cited in any T04 lesson ✓

---

## Stack Snapshot (≤80 words)

T04 is a technically sound 10-lesson field-survey topic with one HIGH-severity citation error cluster (§32.2210 wrong account for Cable/Wire — 3 manifestations in L07 prose, branching scenario, and quiz) plus one additional account number error (§32.2420 vs §32.2411 for Poles). DAG attribution errors persist in L07 and L09 for pole/conduit/attachment (T01.L01 vs T01.L02). The FAA altitude framing in L02 and NWP 57 framing in L05 appear corrected from prior audit findings.

---

## Coverage Gaps (≤120 words)

**Checked:** All 10 T04 JSX files. §32.2210, §32.2410, §32.2411, §32.2420 via Cornell LII + eCFR primary source. FAA 107.51 structure exception via FAA primary source. NWP 57 via USACE 2021 Decision Document. DAG attribution for pole/attachment/span/clearance/joint-use (T01.L02 vs T01.L01). GSD formula math re-derived. UTM zone math re-derived. All vocabulary_assumed cross-referenced.

**Not checked:** L10 capstone quiz answer derivations (only meta structure reviewed). RUS Bulletin 1751F-815 existence (survey-deliverable bulletin — whether it exists as a discrete RUS publication). §32.2220 exact label per current eCFR text (flagged in F4 as [needs verification]). 7 CFR Part 1755 citation in L07.

---

## Saturation Hint (≤80 words)

R-2 should probe: (1) §32.2220 exact eCFR label — is it "Land and Land Rights" or "Land" or "Rights of Way"? Direct eCFR text lookup required. (2) The L09 citation of "RUS Form 307" as a construction-package checklist form — corroboration against RUS forms index required (prior R2 flagged this as L-2, could not confirm). (3) L04 anchor/guy wire gap (F9) — verify whether RUS 1751F-630 §7 explicitly requires anchor data collection. (4) Any content in L10 capstone not covered by this framing.

=== T04 AUDIT R1 PRIMARY SOURCE END ===
