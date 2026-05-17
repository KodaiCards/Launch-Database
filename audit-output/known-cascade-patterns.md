# Known Cascade-Bug Patterns

> Living registry of cascade-pattern bugs caught in OSP curriculum audits.
> Every retroactive audit / RT framing MUST check this list FIRST before generic primary-source verification.
> When a new cascade pattern is identified, append it here with topic + locations + SHA + verified-resolution URL.

---

## How to use this file

**For audit agents (R-1..R-N):**
- Step 1 of every audit: grep the topic under audit against every pattern below. Report occurrences.
- Pattern-match-first is cheaper than rediscovery.

**For RT agents (post-fix or final-verify):**
- Step 1 of every RT: verify fix-agent's changes did NOT introduce or perpetuate any cascade pattern.

**For fix-agents:**
- Before applying a citation/value/regulation replacement, check whether the source bug appears in this registry.
- If your fix introduces a value identical to a known wrong-value, STOP and report.

---

## P1 — `47 CFR §32.2210` mis-cited as "Cable and Wire Facilities"

**Truth:** `§32.2210` = "Central office—switching" (per Cornell LII + eCFR).
**Correct citation for cable/wire plant records:** `§32.2410` = "Cable and wire facilities".
**Also correct:** `§32.2411` = "Poles" (per T01 polish-3 verification).
**Also note:** `§32.2420` (which T04 wrongly claimed = Poles) is parent "Cable and wire facilities" category.

**Caught in:**
- T04 L07 (R-1/R-2 dispute → Haiku tiebreaker `a42e9f8` 2026-05-16)
- T06 L09 (R2-N1 `7df11fa` 2026-05-17 — same bug propagated)
- T01 L01 cross-topic (`d7161ad` 2026-05-16)

**Pattern:** when an OSP lesson cites Part 32 sub-sections for plant records / cable / pole accounting, verify against eCFR primary source. The §32.22xx (CO/switching) vs §32.24xx (cable/wire) vs §32.2411 (poles) cluster is easy to mis-cite.

**Mitigation:** Haiku ground-truth lookup before applying any Part 32 fix.

---

## P2 — H₂S IDLH value cascade

**Truth:** NIOSH IDLH for hydrogen sulfide = **100 ppm** (NIOSH NPG NPGD0337).
**Wrong values that have appeared:**
- "100 ppm IDLH" → corrected to "50 ppm" via R-2 misidentification (50 ppm = OSHA 10-min STEL ceiling, NOT IDLH).
- Cascade: 4 separate RT rounds (RT-C/D/F/H) accepted the wrong 50 ppm value before RT-J (round 5) caught it via NIOSH NPG + CDC IDLH docs + OSHA H₂S page.

**Caught in:**
- T18 L03 (cascade across H-1 fix → RT-D/F/H accept → RT-J catch → re-correction)

**Pattern:** safety-critical numeric values (IDLH, TLV, exposure limits, fall-arrest forces, MAD/MAB, atmospheric thresholds) cascade through RT framings if first replacement is wrong. STEL ≠ IDLH; instantaneous ≠ time-weighted-average; ceiling ≠ peak.

**Mitigation:** any fix-agent prompt that includes a numeric replacement for safety values MUST verify the REPLACEMENT against primary source (NIOSH/CDC/OSHA) BEFORE applying, not in closeout. Per agent-protocol.md §8.

---

## P3 — ANSI Z359 standards mis-cited

**Truth:**
- Z359.1 = "Fall Protection Code" — umbrella standard (older / superseded reference base)
- Z359.2 = "Minimum Requirements for a Comprehensive Managed Fall Protection Program" — managed program
- Z359.4 = "Assisted-Rescue and Self-Rescue Systems"
- Z359.11 = "Full Body Harnesses"

**Wrong citation cascade:**
- T18 L04 "imprecise Z359.1 citation" → polish-2 fix-agent "corrected" to Z359.4 → but the content described (use/inspection/maintenance) is Z359.2, NOT Z359.4 → RT-G caught at final-verify-2

**Pattern:** when "improving" an ANSI Z359 citation, verify the NEW citation's title from a primary source — Z359 sub-numbers are easy to swap incorrectly.

**Mitigation:** any Z359.x citation change requires primary-source verify before apply.

---

## P4 — Fabricated numeric value cascade (T02 OM5)

**Truth:** OM5 EMB @ 850 nm = **4700 MHz·km** (same as OM4 by backward-compat design); @ 953 nm = 2470 MHz·km (SWDM4 spec).
**Wrong value:** "28000 MHz·km @ 850 nm" — FABRICATED. Likely R-2 conflated SWDM4 aggregate throughput with per-wavelength EMB.

**Cascade:** survived "Fix Wave A primary-source verified" closeout + RT-α + RT-β + Polish-A + RT-γ + RT-δ (5 RT rounds all accepted "28000 verified") before Polish-D's RT-θ caught via independent primary-source lookup from DIFFERENT sources.

**Caught in:** T02 L08

**Pattern:** when an agent claims "primary-source verified" for a numeric value, do NOT trust the claim — re-verify the value against a DIFFERENT primary source in next RT framing. Especially for values where the order of magnitude is suspicious vs typical industry-standard ranges.

**Mitigation:** post-fix RT prompts MUST mandate independent primary-source lookup for numerically-claimed values, explicitly forbidding trust in prior agent's "verified" claim.

---

## P5 — Federal Register page-number cascade (T09 Biden PM)

**Truth:** Biden Presidential Memorandum on Tribal Consultation (Jan 26, 2021) appears at **86 FR 7491**.
**Wrong value:** "86 FR 7667" — Fix Wave A's claimed primary-source verification was wrong. RT-β caught it via independent FR archive lookup.

**Caught in:** T09 L09 (cascade across Fix Wave A primary-source claim → RT-α didn't catch → RT-β independent verify caught)

**Pattern:** Federal Register page numbers are easy to mis-cite; the actual primary source (federalregister.gov or GovInfo) must be checked, not secondary blog citations.

**Mitigation:** any FR citation change requires direct federalregister.gov / GovInfo lookup before apply.

---

## P6 — Broken DAG pointers (vocab_assumed claiming unintroduced terms)

**Pattern:** Lesson author claims `vocabulary_assumed: [{term: 'X', source_lesson_id: 'TYY.LZZ'}]` but the target lesson never introduces term X.

**Specific instances:**
- T01.L05 "OTMR" claimed `vocabulary_introduced` but actually missing (T04 polish-C `435194b` 2026-05-16)
- T06.L01 "soil type" → T04.L03 (GIS) — soil type not introduced anywhere (T06 R-1 H-2 2026-05-17)
- T06.L01 "route alignment" → T04.L02 (Drone/LiDAR) — not introduced (T06 R-1 H-3)
- T06.L01 "conduit" → T04.L01 — should be T01.L02 (T06 R-1 M-4)
- T07.L02 "contour" → T04.L03 — not introduced (T07 R-1 F-3)
- T07.L07 "HDD" → T06.L04 (conduit fill) — should be T06.L01 (T07 R-2 F-8)
- T07.L07 "open-cut" → T06.L03 (conduit selection) — should be T06.L01 (T07 R-2 F-9)
- T08 sag/span/attachment_point/clearance pointers wrong in L01 prose (T05 RT-A BUG-C, fix wave caught only 1 of 4)
- T03.L02 NEC → T01.L09 — should be T01.L08 (T03 R-1 F-3)
- T05 cross-topic 7 pointers wrong into T07 + T08

**Pattern:** vocab_assumed pointers are the #1 source of DAG breaks across all topics. Authors guess at source lesson without verifying.

**Mitigation:** automated DAG registry (in-flight via infra-build agent) eliminates this entire pattern via deterministic check. Once `dag-registry.json` exists, audits skip manual DAG walks.

---

## P7 — NESC §-vs-Rule notation conflation

**Truth:**
- NESC uses BOTH "Section X" (broad topic area, e.g., Section 24 = Grades of Construction) AND "Rule X" (specific provision within section, e.g., Rule 232 = vertical clearance, Rule 261 = strength requirements)
- Section ≠ Rule. Examples:
  - Section 24 = Grades of Construction (Grade B, C, N)
  - Section 25 = Loadings for Grades B and C
  - Section 26 = Strength Requirements (Rule 261 within)
  - Rule 232 = Vertical clearances
  - Rule 235 = Communication-worker safety zone (40-inch minimum)
  - Rule 250 = Loading districts criteria
  - Rule 261 = Strength of line supports

**Wrong usages:**
- T08 L06 "§24 sets maximum stress requirements" (4 locations) — wrong; Section 26 / Rule 261 governs strength
- T07 L06 supply-to-comm 40-in/3.33-ft cited as "Rule 232 Table 2" (4 locations) — wrong; Rule 235 Table 235-5 governs (T07 R-1 F-1)
- Various "NESC §23" shorthand — converts to Rule 235 (communication-worker zone) per context

**Pattern:** authors swap Section ↔ Rule numbers; shorthand `§XX` ambiguous between the two; cross-lesson contradictions when one lesson uses Rule and another uses Section for same content.

**Mitigation:** standardize on full notation ("NESC Section 26" or "NESC Rule 261") in all new content. Audit fix waves convert any `§XX` shorthand to proper form.

---

## P8 — NEC Chapter 9 Table 1 fill misattribution

**Truth:** NEC 770.110(B) and 800.110(B) **exempt** communications cables from Chapter 9 Table 1 fill tables. The "40% fill" rule is an INDUSTRY CONVENTION for fiber conduit, NOT a NEC mandate.

**Wrong attribution:** lesson cites "40% fill — NEC Chapter 9 Table 1" as mandatory NEC requirement.

**Caught in:** T06 L04 (T06 R-1 M-1 2026-05-17)

**Mitigation:** any "40% fill" reference in T06/T08/T13 etc. needs primary-source check — convention vs mandate.

---

## P9 — CFR §1.141x pole-attachment citation cluster

**Truth (per Cornell LII + eCFR + FCC ECFS):**
- §1.1411 = "Timeline for access to utility poles"; §1.1411(i) = self-help cost recovery
- §1.1404 = "Pole attachment complaint proceedings" (dispute resolution)
- §1.1413 = "Complaints by incumbent local exchange carriers" (ILEC-specific, NOT general)
- §1.1414 = "Review period for pole attachment complaints" (180-day clock, NOT dispute framework)

**Wrong usages caught:**
- T08 L02 §1.1413 cited as self-help recovery → corrected to §1.1411(i) (T08 R-2 H-1)
- T08 L03 §1.1414 cited as dispute resolution → corrected to §1.1404 (T08 R-2 H-2)

**Pattern:** 47 CFR §1.141x sections are easy to swap incorrectly because they're all in the pole-attachment subpart. Cluster needs special care.

**Mitigation:** any T08/T06/T14 (pole-attachment-relevant) fix involving §1.141x requires eCFR ground-truth lookup before apply.

---

## P10 — FCC 23-109 betterment exemptions

**Truth:** FCC 23-109 (December 2023, Fourth R&O) introduced "necessitated solely" standard for pole-replacement cost causation. 5 exemptions: (1) pole already on replacement schedule, (2) road expansions/property development/government-imposed, (3) storm hardening, (4) current pole fails NESC/applicable engineering standards, (5) utility's own change to internal construction standards.

**Coverage gap caught:** T08 L06 originally missed this entirely; added in Fix Wave A.

**Pattern:** new FCC orders (2023+) often missing from older lesson content; check FCC ECFS for any pole-attachment / make-ready / cost-allocation lesson against current order set.

**Mitigation:** topic-by-topic review of FCC order currency for any T07/T08/T14 (FCC-relevant) lessons.

---

## P11 — NWP 12 vs NWP 57 (telecom HDD)

**Truth:** Federal Register 2021-27441 split NWP 12 — telecom fiber HDD across waters/wetlands now requires **NWP 57**, not NWP 12.

**Pattern caught:** T06 L07 cites NWP conditions generically without distinguishing NWP 12 (pipeline) from NWP 57 (telecom). Per T06 R-3 R3-N1.

**Mitigation:** any HDD / wetland-crossing / NWP-cited content needs NWP 57 specificity check.

---

## P12 — Standards-edition currency

**Truth:** standards have published editions. Lesson should cite the current edition OR mark `[confirm edition]` for editions in flux.

**Caught:**
- TIA-526 edition (T02 L11 hardcoded `-14B`; T4 L4.11 correctly used `[confirm edition]`)
- CGA Best Practices (T06 L07 cited v19; current 20.0 per 2024 release — T06 R-1 M-3)
- NESC C2 edition (currently 2023; check for "2017" stragglers)

**Pattern:** lesson author at time T cites edition E; standards body releases edition E+1 between authoring and audit; lesson becomes stale.

**Mitigation:** audits flag any standards citation without edition marker; new content uses `[confirm edition]` for in-flux standards.

---

## Adding to this file

When a new cascade pattern is identified in an audit:
1. Append a new `## P-N — <title>` section
2. Include: Truth (primary-source) / Wrong values / Caught in (topic + SHA) / Pattern / Mitigation
3. Commit with `git -c commit.gpgsign=false`
4. Reference the new pattern ID in the audit report that caught it

This file is the orchestrator's permanent memory across audits. Future agents check here FIRST.
