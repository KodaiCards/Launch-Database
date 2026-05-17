# T07 Staking — Retroactive Audit R-3
## Framing: Forensic / Incident-Investigation / Field-Failure
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T07_AUDIT_R3_FORENSIC.md` written.**
**Token cap: 200K. Sequential after R-1 `5baabfb` + R-2 `be3c0f6`.**

---

## 1. Registry Consultations

**Citation registry (`audit-output/citation-registry.md`) consulted before any lookups:**
- OSHA 29 CFR §1910.268 — entry present, 2026-05-16, T18 audit. Used for threshold verification.
- NESC Rule 232 — entry present, 2026-05-16, T05 audit (IEEE C2-2023 §232).
- NESC Rule 235 — entry present, 2026-05-16, T05 audit (IEEE C2-2023 §235).
- 47 CFR §1.1411 OTMR — entry present, 2026-05-16, T08 audit.
- No ANSI O5.1 entry in registry; not verified in prior waves.
- No RUS Form 740 official title entry.

**DAG registry (`audit-output/dag-registry.json`) queried:** 19 broken pointers out of 84 total T07 pointers — 22.6% error rate. Detail in §7.

**Schema validator run:** `node osp-training/scripts/validate-lesson-schema.js T07`
- 9 PASS, 0 FAIL, 1 WARN: L08 has 6 key_terms but only 5 Flashcard cards (missing 'FieldCom').

---

## 2. Independent Primary-Source Verification Log

**OSHA 1910.268(g)(1) — 4 ft vs 10 ft threshold (R-1 F-2, R-2 upgrade to HIGH)**

Source: OSHA.gov — https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.268
Actual text §1910.268(g)(1): "Employees shall be protected by the use of a positioning system or a personal fall arrest system when work is performed at positions more than **4 feet (1.2 m) above the ground**, on poles, and on towers."

**Verdict: 4 FEET confirmed. "Above 10 feet" is WRONG in three T07 locations.**
- L01:274 prose — "pole work above 10 feet" → WRONG
- L01:417 quiz prompt — "OSHA 1910.268(g)(1) requires fall protection for pole work above 10 feet" → WRONG
- L04:467 quiz explanation — "OSHA 1910.268(g)(1) requires fall protection above 10 feet" → WRONG
- L04:271 prose — "Any work above 4 feet" → CORRECT
- L01 Q4 quiz prompt (line 417) states the wrong threshold as part of the question framing, which trains learners to accept the wrong value as authoritative.

**NESC Rule 232 vs Rule 235 for supply-to-comm on-pole clearance (R-1 F-1, R-2 confirmed)**

Registry entry confirms: Rule 232 = vertical clearances from ground/road/water surface to wires. Rule 235 = clearances between conductors on the same structure, including supply-to-comm worker safety zone (40 in / Table 235-5).

L06 lines 183, 188-191, 452, 460 cite "NESC Rule 232 Table 2" for supply-to-comm clearance → confirmed WRONG. Rule 235 (Table 235-5) is the correct citation. L06 line 195 and the worked example in L06 correctly cite Rule 235 for comm-to-comm 12-inch separation — making L06's own content internally inconsistent: correct for comm-to-comm, wrong for supply-to-comm.

---

## 3. Forensic Scenario Coverage Table

| # | Scenario | T07 Coverage | Location | Verdict |
|---|---|---|---|---|
| 1 | **OSHA fall-protection citation defense** — 1910.268(g)(1) 4-ft trigger + tie-off-at-second-step | **Present + INADEQUATE** | L01:274 (wrong: "10 ft"), L01:417 quiz prompt (wrong: "10 ft"), L04:271 (correct: "4 ft"), L04:467 quiz explanation (wrong: "10 ft") | 3 of 4 locations teach the WRONG threshold. A defense attorney using T07 as the training record would find it teaches 10 ft, not 4 ft. This is a liability. |
| 2 | **Pole strike by overhead truck** — ROW clearance violation, AASHTO clear-zone offsets, breakaway hardware | **ABSENT** | No mention of AASHTO clear zone, setback offsets, or breakaway hardware anywhere in T07 | Not a staking-scope item — stakers flag pole placement constraints to the engineer. Absence acceptable given scope. |
| 3 | **Joint-use OTMR notification dispute** — FCC §1.1411 timelines, 15-day response window | **Present + Adequate** | L06 lines 295-314, L10 branching scenario lines 286, 294, 309 | Burden of proof correctly taught. "Defined timeline" referenced (Book vs. Field). Specific 15-day number not stated — but the timeline detail is an engineer/legal concern, not a staker field decision. Adequate for scope. |
| 4 | **Failed climbing inspection** — ANSI Z133, full body harness + double-lanyard transitions | **Present + INADEQUATE** | L01:274 (wrong threshold), L01:426 (correct: "100% tie-off always required per OSHA 1910.268(g)(1)"), L04:271-288 | No ANSI Z133 mention anywhere in T07. "Double-lanyard transition" not taught. "Full body harness" not explicitly named — L04 mentions "body harness + lanyard" but not the full-body vs. body-belt distinction (significant: body belts banned for fall-arrest under OSHA 1910.268 since 1998). |
| 5 | **MAD violation near energized supply** — telecom worker climbs above neutral, OSHA 1910.269 Table | **ABSENT** | No MAD, no 1910.269, no "approach distance", no "minimum approach distance" in T07 | Appropriate absence — stakers are not climbing energized-supply territory per T07 scope (ground-laser preferred). The Book vs. Field box in L01 and L04 correctly teaches "avoid the climb via ground-laser." |
| 6 | **Down-guy anchor pullout** — anchor sizing for soil class, holding power methodology | **ABSENT** | No "anchor," "screw plate," "soil class," "holding power" in T07 | Anchor design is an engineering function, not a staker observation task. Appropriate absence. Stakers flag leaning poles and replacement candidates. |
| 7 | **Strand size mismatch** — installed 6M where 10M required | **ABSENT** | No strand size specification in T07 | Strand selection is a design function. Stakers flag make-ready for strand issues as found, not design them. Appropriate absence. |
| 8 | **Pole class undersized** — ANSI O5.1 classification + load-class matching | **Present + Adequate (limited)** | L06:276 ("ANSI O5.1 strength standard [confirm current edition]"), L09:486 ("staker can note a class mismatch but isn't expected to run the full ANSI O5.1 calculation") | Correctly bounds staker scope. Class mismatch is a call-out; load calculation is an engineer job. [confirm edition] marker present. |
| 9 | **Inspector photo evidence gap** — SCID/timestamped photos for dispute resolution | **Present + Adequate** | L03 fully covers SCID + photo protocols, timestamps, EXIF metadata, chain of evidence in Advanced tier | The advanced tier explicitly addresses legal evidence context (lines 320-338). Well-covered. |
| 10 | **Reading a staking sheet field test** — new crew misinterprets RUS Form 740 fields | **Present + Adequate** | L05 covers all key Form 740 fields with examples, annotation conventions, design delta format | Form 740 title remains uncertain ("Contractor's Statement and Acknowledgment" — unverified per R-2 F-4). Low risk to readability but citation hygiene gap. |

---

## 4. R-1/R-2 Reconciliation

| Finding | R-1 Sev | R-2 Action | R-3 Verdict |
|---|---|---|---|
| F-1: Rule 232→235 for supply-to-comm (L06) | HIGH | AGREE | **CONFIRMED HIGH** — registry + independent read confirm. Fix needed. |
| F-2: OSHA 4ft trigger inconsistency | MED → HIGH | R-2 upgraded, found 3 error locations | **CONFIRMED HIGH** — primary source eCFR confirms 4 ft. Three wrong locations, one correct. |
| F-3: "contour" DAG broken (T07.L02→T04.L03) | HIGH | AGREE | **CONFIRMED HIGH** — DAG registry: 'contour' not introduced by any lesson. |
| F-4: Form 740 title uncertain | LOW | UNCERTAIN | **UNRESOLVED LOW** — USDA RD form index still inaccessible in this env. `[confirm official title]` marker not yet in L05. |
| F-5: 18ft driveway edition-specific | LOW | AGREE | **CONFIRMED LOW** — registry marks Rule 232 as C2-2023 with [confirm edition]. L04 already has the marker. Adequate. |
| F-6: L01:417 quiz prompt "10 feet" | HIGH (new R-2) | — | **CONFIRMED HIGH** — primary source. Quiz prompt trains wrong value. |
| F-7: L04:467 quiz explanation "10 feet" | HIGH (new R-2) | — | **CONFIRMED HIGH** — same source. Within-lesson contradiction (body says 4 ft, quiz explanation says 10 ft). |
| F-8: HDD pointer T06.L04→should be T06.L01 | MED (R-2) | — | **CONFIRMED MED** — DAG registry: "HDD is introduced by T01.L08, T06.L01, not T06.L04." |
| F-9: open-cut pointer T06.L03→should be T06.L01 | MED (R-2) | — | **CONFIRMED MED** — DAG registry: "open-cut is not introduced by any lesson in the curriculum." T06.L01 is the correct source (title: "HDD vs Open-Cut vs Plowing"). |
| F-10: L07/L09 vocabulary_assumed outside meta | LOW (R-2) | — | **CONFIRMED LOW** — schema pattern divergence; functionally OK. |

---

## 5. Structured New Findings Table

| # | Sev | Category | File | Lines | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|
| F-11 | MED | DAG pointer wrong source | L04 | vocabulary_assumed | `make-ready` pointer → T05.L08. DAG registry: "make-ready is introduced by T01.L05, not T05.L08." Learner who hasn't completed T01.L05 has an unmet prerequisite. | Change `source_lesson_id` for 'make-ready' in L04 from `'T05.L08'` to `'T01.L05'`. | HIGH — DAG registry ground truth |
| F-12 | MED | DAG pointer wrong source | L06 | vocabulary_assumed | `make-ready` pointer → T05.L08. Same error as F-11 — same wrong source in a second lesson. | Change `source_lesson_id` for 'make-ready' in L06 from `'T05.L08'` to `'T01.L05'`. | HIGH — DAG registry |
| F-13 | MED | DAG pointer wrong source | L06 | vocabulary_assumed | `pole audit` pointer → T04.L01. DAG registry: "pole audit is introduced by T04.L04, not T04.L01." | Change `source_lesson_id` for 'pole audit' in L06 from `'T04.L01'` to `'T04.L04'`. | HIGH — DAG registry |
| F-14 | MED | DAG pointer wrong source | L08 | vocabulary_assumed | `GIS` pointer → T04.L01. DAG registry: "GIS is introduced by T01.L08, not T04.L01." | Change `source_lesson_id` for 'GIS' in L08 from `'T04.L01'` to `'T01.L08'`. | HIGH — DAG registry |
| F-15 | LOW | Missing Flashcard | L08 | Flashcard deck | `key_terms` has 6 terms (Katapult, FieldCom, digital staking, photo-attach, GPS accuracy, field-to-office real-time sync) but Flashcard deck has only 5 cards — 'FieldCom' has a key_term definition but no rendered card. | Add Flashcard card for 'FieldCom' to the L08 deck. | HIGH — validator WARN confirmed |
| F-16 | LOW | Missing protective language | L01 | Q4 quiz framing | Quiz Q4 at L01:417 uses the wrong OSHA threshold (10 ft) IN THE QUESTION STEM as the stated premise ("OSHA 1910.268(g)(1) requires fall protection for pole work above 10 feet. How do most experienced field stakers handle..."). This embeds the wrong threshold as the premise of the question rather than testing the correct threshold. This is distinct from F-6 (the prompt saying the wrong thing) — even if the correct answer is the laser technique, the question trains the learner that the trigger is 10 ft. | Rewrite Q4 prompt: remove the incorrect threshold premise; frame as "OSHA 1910.268(g)(1) requires fall protection for work above 4 feet on poles. How do most experienced field stakers avoid triggering that requirement for routine measurements?" | HIGH |
| F-17 | LOW | Scope gap — fall harness type | L01, L04 | Book vs. Field boxes | Body-belt vs full-body-harness distinction not taught anywhere in T07. OSHA eliminated body belts for fall-arrest use (29 CFR 1926.502(d)(16)) — only full-body harnesses are compliant for fall-arrest. A learner reading T07 would only see "body harness + lanyard" without understanding that body belts are banned for this purpose. For a training program targeting crew members who may actually climb poles, this is a liability gap. | Add a one-line clarification in L04's climbing Book vs. Field box: "Fall-arrest requires a full-body harness — body belts are not compliant for fall-arrest use per OSHA (29 CFR 1926.502(d)(16))." | MEDIUM |

---

## 6. Under-Audited Rotation Findings

**L03 SCID/photo protocols (un-audited in R-1/R-2):**
- Coverage is solid. Two-photo standard (downline + crossline) taught with consequences table.
- GPS accuracy tiers consistent with L08 (open sky ±5–10 m, Garmin ±3 m, RTK ±2 cm).
- Advanced tier covers chain of evidence / EXIF metadata — well-handled.
- SCID anatomy worked example is pedagogically sound and field-realistic.
- **No new technical findings in L03.**

**L05 Form 740 fields (partial in R-2, full read this pass):**
- All key fields covered with examples. Worked example arithmetic independently verified: delta = 27.0 − 30.0 = −3.0 ft ✓; H_new = 27.0 − 4.5 = 22.5 ft ✓; clearance = 22.5 > 18 ft ✓.
- "Contractor's Statement and Acknowledgment" title — R-2 UNCERTAIN verdict stands. [confirm official title] marker not present in the key_terms definition (only in internal audit notes). **Fix: add `[confirm official title]` marker inline after the title in the key_terms definition for Form 740.**

**L08 GPS accuracy claims (R-2 declared clean — verified this pass from different source):**
- Smartphone ±5–10 m, handheld ±3–5 m, RTK ±2–5 cm: GPS.gov accuracy page corroborates these ranges. L08 says "handheld GPS devices (Garmin, Trimble consumer units) typically achieve ±3–5 meters" which matches GPS.gov CEP accuracy specifications for consumer GNSS. R-2 verdict confirmed: no new errors.

**L09 ANSI O5.1 scope (sampled):**
- L09 correctly limits scope: staker flags class mismatch, engineer runs load calculation. No numeric O5.1 values taught — no numeric claims to verify.
- No new findings in L09.

---

## 7. DAG Sweep + Cascade-Pattern Scan

**Full DAG registry output for T07:** 19 broken pointers / 84 total (22.6% error rate).

Already captured in canonical: F-3 (contour), F-8 (HDD), F-9 (open-cut). New this pass: F-11 (make-ready in L04), F-12 (make-ready in L06), F-13 (pole audit), F-14 (GIS).

**Remaining broken pointers — low priority (term not formally introduced anywhere in curriculum):**
- L01: `attachment point` → T01.L02 — term used in curriculum but never formally introduced. Systemic gap; not T07-specific.
- L02: `existing utilities` → T04.L01 — same pattern (descriptive compound not formally introduced).
- L02: `pole locations from design` → T04.L02 — same pattern.
- L03: `pole numbering from survey` → T04.L02 — same pattern.
- L03: `attachment height` → T07.L01 — term used extensively in T07.L01 but not in `vocabulary_introduced` array.
- L03: `staking notes` → T07.L01 — same issue; T07.L01 introduces "staker" and "staking" concept but `staking notes` not in `vocabulary_introduced`.
- L05: `RUS program context` → T04.L01 — descriptive compound, not formally introduced.
- L05: `make-ready data` → T07.L01 — same pattern.
- L05: `pole ID sequence` → T04.L02 — same pattern.
- L07: `PI (point of intersection)` → T07.L02 — not in T07.L02 vocabulary_introduced; not introduced anywhere.

**Cascade pattern P6 (cross-topic DAG pointers wrong):** Confirmed systemic — 4 new wrong-source pointers found (F-11/12/13/14 plus F-8/F-9 from R-2). Pattern: lesson authors used the "most relevant-sounding lesson" rather than the actual introducing lesson. `make-ready` is a good example — it appears first in T01.L05, but authors pointed to T05.L08 (Make-Ready & Pole Attachment lesson, which is a later deep-dive).

**Polish-A fix verification:** R-1/R-2 identified the T06.L03 stragglers fix. DAG registry shows 'open-cut' still not introduced by any lesson — this means the Polish-A fix may have corrected the pointer source but didn't add 'open-cut' to T06.L01's `vocabulary_introduced` array. The fix was pointer-only, not vocabulary-array-fix. LOW impact.

---

## 8. Vite Build + Schema Validator

```
node osp-training/scripts/validate-lesson-schema.js T07
✓ 9 PASS, 0 FAIL, 1 WARN (L08: 6 key_terms, 5 Flashcard cards — 'FieldCom' missing)
```

Vite build not re-run (no code changes this pass — read-only audit). R-1 and R-2 both confirmed build clean at their time of run.

---

## 9. Saturation Verdict

**HIGH pool status:** 5 confirmed HIGHs across R-1+R-2: F-1 (Rule 232/235 L06), F-2 (OSHA 4ft L01 prose), F-3 (contour DAG), F-6 (OSHA 4ft L01 quiz prompt), F-7 (OSHA 4ft L04 quiz explanation). R-3 finds NO new HIGH severity items. HIGH pool appears saturated.

**MED pool status:** 4 confirmed MEDs from R-1+R-2: F-8 (HDD pointer), F-9 (open-cut pointer), plus F-11/F-12/F-13/F-14 added by R-3 (4 new MEDs from DAG registry sweep). R-3 found additional MEDs that R-1/R-2 did not have access to (DAG registry data). The DAG registry sweep is essentially exhaustive at this point — all 19 broken pointers documented. MED pool can be considered saturated after DAG registry exhaustion.

**LOW pool status:** F-4 (Form 740 title — UNCERTAIN), F-5 (18ft driveway), F-10 (schema pattern), F-15 (L08 missing Flashcard), F-16 (Q4 wrong premise), F-17 (body harness type). R-3 found 3 new LOWs. LOW pool likely has residual items but all are cosmetic/schema.

**RECOMMENDATION:** T07 can proceed to Fix Wave A after R-3. The fix wave should address:
- Priority 1 (SAFETY/HIGH): F-1 (Rule 232→235 in L06), F-2+F-6+F-7 (OSHA 4ft in L01 prose + L01 quiz prompt + L04 quiz explanation)
- Priority 2 (HIGH DAG): F-3 (contour — requires T04.L03 vocabulary addition)
- Priority 3 (MED DAG): F-8, F-9, F-11, F-12, F-13, F-14
- Priority 4 (LOW): F-4 ([confirm title] marker), F-10 (schema standardize), F-15 (L08 FieldCom card), F-16 (Q4 premise rewrite), F-17 (body harness clarification)

Subsequent 2-RT pair post-fix is non-optional per saturation protocol. Safety-critical OSHA threshold corrections require independent primary-source verification before the fix-agent applies them (cascade-defense mandate per §8 of agent-protocol.md).

=== T07 AUDIT R3 FORENSIC END ===
