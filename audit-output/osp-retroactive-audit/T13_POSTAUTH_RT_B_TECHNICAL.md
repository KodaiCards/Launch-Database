# T13 Post-Author RT-β — Technical / Math / Citation / Cascade

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T13_POSTAUTH_RT_B_TECHNICAL.md` written.**

**Pair-mate:** RT-α (pedagogy/coverage/Flashcard framing — not read; independent verification)  
**Framing:** Technical accuracy, math, citation correctness, cascade-pattern sweep, safety-value verification  
**Vite build:** ✓ PASSES clean (built in 5.68s, zero errors)  
**Date:** 2026-05-18

---

## Section 1: Cascade-Pattern Sweep (known-cascade-patterns.md §14e, step 1)

### P1 — §32.2420 vs §32.2411

**CLEAN.** Full grep across all 12 T13 lessons:
- `§32.2420` appears ONLY in L08 and L10 in its correct context — as a teaching aid explaining what §32.2420 is NOT (the wrong account) vs §32.2411 (Poles, correct). The vocabulary_introduced in L08 correctly declares `47 CFR §32.2411 (Poles)`. L10 capstone quiz correctly identifies §32.2411 as correct and lists §32.2420 as a wrong-answer distractor.
- H-04 / C-14 fully applied.

### P2 — H₂S IDLH cascade

**PARTIALLY TRIGGERED — confirmed HIGH bug.** See Bug #1 below.

### P3 — ANSI Z359 mis-citation

**CLEAN.** No Z359.x citations appear in T13.

### P4 — Fabricated numeric value cascade

**CLEAN.** No fiber physics numerics in T13; no OM-grade EMB values cited.

### P5 — Federal Register page number cascade

**NOT APPLICABLE.** No Federal Register page citations in T13.

---

## Section 2: Critical Bugs Found

### BUG #1 — HIGH — T13.L04 atmospheric thresholds contradict T18.L03 (CASCADE SAFETY BUG)

**Verified by reading:** `osp-training/src/lessons/T13/L04-underground-construction-inspection.jsx:116`

```jsx
'✅ Stop work. Per 29 CFR 1910.268(o) ... Results within safe limits: O₂ 19.5–23.5%, 
CO <35 ppm (OSHA PEL), H₂S <10 ppm (OSHA ceiling), LEL <10% of LEL.'
```

**Contradiction:** T13.L04 `vocabulary_assumed: confined space, atmospheric testing, attendant → T18.L03`. T18.L03 (the authoritative source lesson) teaches:

```
CO: < 25 ppm (ACGIH TLV-TWA), exit at > 25 ppm
H₂S: < 1 ppm, exit at > 1 ppm
```

**Two errors in T13.L04 line 116:**

1. **CO < 35 ppm labeled "OSHA PEL" — WRONG.** T18.L03 uses 25 ppm (ACGIH TLV-TWA) as the entry threshold. Additionally, "OSHA PEL" for CO is actually 50 ppm TWA (29 CFR 1910.1000 / 1926.55), not 35 ppm — so the cited threshold value is also wrong (35 ppm does not correspond to any standard's PEL for CO).

2. **H₂S < 10 ppm labeled "OSHA ceiling" — WRONG on two counts.** (a) T18.L03 uses 1 ppm as the exit-threshold for H₂S in vault work — T13.L04 teaches 10 ppm, which is 10× more permissive and directly contradicts the source lesson. (b) The label "OSHA ceiling" is wrong: 10 ppm is the H₂S LEL sensor inhibition level mentioned in T18.L03 (at 10 ppm, pellistor sensors can be inhibited), and also the ACGIH TLV-TWA. OSHA's general industry H₂S ceiling is 20 ppm; OSHA construction TWA is 10 ppm — but neither is "OSHA ceiling."

**The DAG invariant is violated.** T13.L04 teaches atmospheric thresholds that contradict the source lesson (T18.L03) it declares as vocabulary_assumed. A learner reading T13.L04 would use CO <35 ppm and H₂S <10 ppm — not the T18.L03 values of CO <25 ppm and H₂S <1 ppm.

**Severity: HIGH (life safety — vault entry decision criteria).**

**Fix required:** Replace the threshold list in L04 line 116 to defer to T18.L03 values: O₂ 19.5–23.5%, CO <25 ppm (ACGIH TLV-TWA per T18.L03), H₂S <1 ppm (per T18.L03), LEL <10%. Add explicit parenthetical: "these thresholds from T18.L03 — refer to T18.L03 for full atmospheric safety protocol."

---

### BUG #2 — MED — T13.L04 vocabulary_introduced has `ASTM D1557 Modified Proctor` but key_terms definition says "introduced in T10.L08" (self-contradictory DAG)

**Verified by reading:** `osp-training/src/lessons/T13/L04-underground-construction-inspection.jsx:27-40`

```jsx
vocabulary_introduced: [
  'clamp-on ground resistance measurement procedure',
  'ASTM D1557 Modified Proctor',   // ← listed as introduced HERE
],
...
key_terms: [
  {
    term: 'ASTM D1557 Modified Proctor',
    definition: '...This term was introduced in T10.L08. In T13, we verify...'
    //           ↑ but definition says T10.L08 introduced it
  },
```

**Cross-check:** T10.L08 `vocabulary_introduced` array: `['trench backfill', 'pavement match', 'sod restoration', 'proctor density', 'ghost trench']` — `ASTM D1557 Modified Proctor` is NOT in T10.L08 vocabulary_introduced. T10.L08 only introduces the informal term `proctor density`.

**The issue:** Two interpretations exist:
- (A) `ASTM D1557 Modified Proctor` is genuinely first introduced in T13.L04 (the ASTM standard number is new, even if the concept of proctor density was in T10.L08). In this case the vocabulary_introduced is correct but the definition text saying "introduced in T10.L08" is wrong — should say "The underlying proctor density concept was introduced in T10.L08; T13 formally introduces the ASTM standard designation."
- (B) T10.L08 should also have `ASTM D1557 Modified Proctor` in its vocabulary_introduced and T13.L04 should move it to vocabulary_assumed.

**Either way, the current state is self-contradictory and will confuse learners.** The definition's own prose contradicts the vocabulary_introduced placement.

**Severity: MED (DAG inconsistency, self-referential definition).**

**Fix required:** Choose one interpretation and be consistent. Recommended: interpretation (A) — T13.L04 is the first formal introduction of the ASTM standard number. Correct the key_terms definition text to say "The `proctor density` concept (introduced in T10.L08) is the informal measure; ASTM D1557 Modified Proctor is the formal standard test method. First formally cited in T13."

---

### BUG #3 — LOW — T13.L05 quiz answer option embeds specific MSA numbers as "per the project MSA schedule from T10.L06" when T10.L06 labels them as "common industry bands, not a national standard"

**Verified by reading:**
- `osp-training/src/lessons/T13/L05-slack-storage-and-pedestal-inspection.jsx:50` (correct answer option)
- `osp-training/src/lessons/T10/L06*.jsx:202-203`

T13.L05 correct-answer option (correct: 1) text:
```
'50 feet at intermediate points, 100 feet at splice points per the project MSA schedule from T10.L06'
```

T10.L06 says:
```
Source: OFS IP-009 (underground placing guidance); carrier MSA schedules. 
These are common industry bands — the specific contract MSA schedule governs on your job.
```

**The issue:** The T13.L05 correct-answer option presents "50 ft intermediate / 100 ft splice" as if they ARE the T10.L06 MSA schedule values. But T10.L06 explicitly labels these as "common bands" that vary by contract. The explanation at line 56 correctly adds nuance ("The T10.L06 values (50 ft intermediate / 100 ft splice point) are common but the actual numbers for any project come from the project MSA schedule"). However the answer option text itself implies they ARE what T10.L06 specifies.

**This is borderline** — the explanation saves it partially. Severity: LOW (explanation is correct, option text could be more precise).

**Fix recommended (not blocking):** Rephrase answer option to: `"Verified against the project-specific MSA schedule per T10.L06 — common bands are 50 ft intermediate / 100 ft splice point but the contract governs"` to avoid the impression that 50/100 are T10.L06-mandated numbers.

---

## Section 3: Verified Clean (negative findings)

| Item | Verdict | Notes |
|---|---|---|
| H-23: NEC §250.53 → §250.56 | ✓ CLEAN | L04 correctly cites §250.56 throughout; L04 learning objective LO-1 explicitly names §250.56; quiz explanation distinguishes §250.53 (installation method) vs §250.56 (threshold) |
| H-04/C-14: §32.2411 in L08 | ✓ CLEAN | vocabulary_introduced, LO-3, body text, Flashcard, and quiz all use §32.2411; §32.2420 appears only in correct "this is what it's NOT" context |
| H-24: proctor density DAG fix | ✓ CLEAN | `proctor density → T10.L08` is in vocabulary_assumed; the bug was `ASTM D1557 Modified Proctor` placement (BUG #2 above) which is a separate but related issue |
| H-03 slack minimums | ✓ CLEAN | L05 vocabulary_introduced is empty; vocabulary_assumed has MSA → T10.L06; lesson does not introduce independent minimums |
| H-05: FCA vocabulary_assumed | ✓ CLEAN | L07 vocabulary_assumed: `FCA implied certification → T04.L09` correctly present (line 53) |
| H-16/H-17 Form 565 + Form chain | ✓ CLEAN | L11 fully authors Form 565 → Form 7d → Form 553a → Form 219 chain per canonical |
| H-18 Davis-Bacon L12 | ✓ CLEAN | 40 USC §3142 correctly cited; WH-347 weekly cadence taught; worker classification spot-check present |
| H-19 OTDR archive checklist | ✓ CLEAN | L07 lines 34-35 and body: SOR format, bidirectional, launch-cable subtracted, archive-to-owner all addressed |
| H-21/H-22 calibration | ✓ CLEAN | L07 cites Telcordia GR-196-CORE §5.5 (OTDR annual) and TIA-526-7 §8 (OLTS); witness obligation uses "SHALL" language per L-05 |
| H-13 confined space cross-ref structure | ✓ STRUCTURALLY CORRECT | vocabulary_assumed → T18.L03 present; BranchingScenario explicitly invokes T18.L03 protocol; the threshold values are wrong (BUG #1) but the structural requirement is there |
| 7 CFR §1755.404/407 SOR citation | ✓ CLEAN | L07 correctly cites §1755.404 (regulatory anchor) + §1755.407 Format V for SOR requirement + RUS 1753F-401 co-citation per L-03 |
| 7 CFR §1753.19/21/22 citations | ✓ CLEAN | L11 sources §1753.19 for Form 565 obligation; L07 sources §1753.21 and §1753.22 |
| 2 CFR §200.334 records retention | ✓ CLEAN | L12 correctly states 3-year minimum after final expenditure report with litigation/audit caveat |
| 31 USC §3729 FCA civil penalty | ✓ CLEAN | "up to three times" + $13,947–$27,894 per statement (2023 rates, verify-at-publication caveat present) |
| Teaching order (L11=2, L12=3) | ✓ CLEAN | meta.order values: L01=1, L11=2, L12=3, L02=4...L10=12 — exactly per canonical authoring order |
| Vite build | ✓ PASSES | 5.68s, zero errors, all 12 T13 lesson files compile |

---

## Section 4: Independent Gap-Research (directive 22)

**Davis-Bacon $2,000 threshold claim — NEEDS VERIFICATION FLAG:**

L12 teaches "no minimum dollar threshold for RUS loans" and contrasts with "$2,000 threshold [that] applies to other federal programs." The $2,000 threshold is in 40 USC §3142(a) — it's the STATUTE's threshold. What removes the threshold for RUS-financed work is the loan agreement/financial assistance instrument, which incorporates Davis-Bacon compliance as a condition regardless of contract size. The lesson's practical conclusion is correct (inspectors must treat ALL RUS construction as Davis-Bacon covered) but the framing suggests the $2,000 threshold doesn't apply to RUS at the statutory level, which is technically imprecise.

**Recommended addition:** One sentence clarifying that the $2,000 threshold is in the statute but RUS loan agreements incorporate Davis-Bacon compliance as a condition of financial assistance, effectively applying it regardless of contract size per 7 CFR Part 1780. This distinction matters in a federal compliance context.

**Severity:** LOW (practical conclusion is correct; technical mechanism explanation is imprecise).

**Primary-source web fetch failed (eCFR and uscode.house.gov returning 403).** This item is flagged for orchestrator to dispatch Haiku ground-truth for definitive resolution.

---

## Section 5: Coverage Gaps Not Reached

- L01 inspector-arrival workflow (H-11), L02 pre-construction conference (H-14), L03 pre-climb procedure detail verification, L09 DSC protocol (M-20), L10 capstone coverage of all 12 lessons — not verified in detail due to 200K token cap. RT-α framing is pedagogy/coverage and should cover these.
- L07 OTDR chain-of-custody documentation (M-03) — not independently verified.
- L08 learning objective LO-3 text for §32.2411 — verified through grep (correct) but not full LO text.

---

## Verdict

**YELLOW** — 1 HIGH, 1 MED, 2 LOW

| # | Sev | Lesson | Description |
|---|---|---|---|
| BUG-1 | HIGH | L04:116 | CO threshold labeled "OSHA PEL" at 35 ppm (wrong value AND wrong label); H₂S labeled "OSHA ceiling" at 10 ppm (wrong label, wrong threshold — contradicts T18.L03's 25 ppm CO / 1 ppm H₂S values) |
| BUG-2 | MED | L04:27-40 | `ASTM D1557 Modified Proctor` in vocabulary_introduced but key_terms definition says "introduced in T10.L08" — self-contradictory DAG |
| BUG-3 | LOW | L05:50 | Quiz correct-answer option implies 50/100 ft are T10.L06-mandated values; explanation partially corrects but answer option itself is imprecise |
| BUG-4 | LOW | L12 | Davis-Bacon "no threshold for RUS" framing is correct in practice but technically imprecise about mechanism (statute vs loan agreement); Haiku ground-truth recommended |

**Saturation verdict:** NOT yet saturated on technical framing. BUG-1 is safety-critical and high-confidence (confirmed by cross-reading T18.L03 actual values). BUG-2 is clear self-contradiction. BUGs 3-4 are low-confidence items pending primary-source confirmation. Recommend fix wave for BUG-1 and BUG-2, then fresh RT pair.

=== T13 RT-β TECHNICAL REPORT END ===
