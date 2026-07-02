# T01 inc5 — C1 red-team of C2's applied live-prose citation fixes

> Author of the fixes: C2. Red-team: C1 (author≠RT — this session did not author any of the T01 prose
> fixes being checked here; T01 pool authoring was C1's original inc4 work, but the inc5 prose-fix pass
> under review here is C2's, applied on the CEO branch commit `1f56ca9`).
> Spec checked against: `docs/audit/T01-content.md` (Planning's Auditor content-audit report).
> Method: read the actual diff (`git show 1f56ca9`) directly, file by file — not C2's or the Auditor's
> summary of it. Cross-referenced every changed citation against the Auditor report's verified answers.

## Verdict: **PASS**

Every applied cite matches the Auditor report's verified answers. No answer key (`answerIndex`/
`correctMap`) was touched anywhere in the commit (confirmed via `git show 1f56ca9 | grep -E
"^[+-].*answerIndex|^[+-].*correctMap"` — zero matches). Both correctly-scoped citations the Auditor
said should be left alone were in fact left alone.

## 1. Pool-level fixes (`T01-L02.json`, `T01-final.json`) — §7 of the Auditor report

- **`T01-L02-Q4`**: explanation/citation reworded from "the rate/fee formula lives in 47 CFR 1.1409"
  to "the core rate formula lives in 47 CFR 1.1406; 47 CFR 1.1409 governs a specific cost-apportionment
  input that feeds into that formula." Matches the Auditor's exact recommended wording pattern.
  `answerIndex` line not present in the diff (unchanged, still index 1). **PASS.**
- **`T01-final-Q4`**: identical reword pattern applied at the synthesis level, citation field now reads
  "47 CFR 1.1406 (rate formula); 47 CFR 1.1409 (cost-apportionment input); 47 CFR 1.1411 (access/
  make-ready timeline, incl. OTMR)." `answerIndex` unchanged (still index 0). **PASS.**
- Re-validated both files against the real loader (`routes/_assessment_pools.js` `validatePool`) as
  they exist on the CEO branch: `T01-L02` pool size 8, `T01-final` pool size 24 — both load cleanly,
  no regression.

## 2. JSX-prose fixes — §5 of the Auditor report (all 5 confirmed errors)

| Error (Auditor §5) | Files fixed | Verified correct replacement applied? |
|---|---|---|
| (a) RUS Form 219 misapplied as telecom close-out | L04, L05 (incl. table row, vocab, 2 flashcards), L06, L07 (quiz choice text), L09 (Q1 quiz choice), L10 (capstone quiz explanation — graded, highest priority) | Yes — replaced with RUS Form 515 / 7 CFR 1753.49, and where Form 219 is still mentioned it's now correctly scoped as "Electric Program... 7 CFR 1726.405... not telecom." |
| (b) RUS Bulletin 1751F-630 over-applied to general OSP/ISP scope | L01 (2 locations: prose + Q1 citation, plus L01 NEC-cite location) | Yes — replaced with 47 CFR Part 32 §§32.2421-32.2423. |
| (b) 1751F-630 over-applied to splice-enclosure moisture/mechanical reqs | L04 | Yes — replaced with Telcordia GR-771-CORE. |
| (c) 47 CFR 1.1411 misapplied to attachment **fees** | L02 (learning objective, prose, flashcard, quiz explanation+citation), L09 (FCC key-term definition, table row ×2, flashcard, glossary comparison table) | Yes — replaced with 47 CFR 1.1406 (+ §§1.1409-1.1410 for cost-apportionment detail) everywhere the fee/rate claim appeared. |
| (d) RUS 1753F-201 misapplied as the materials-acceptance list | L09 (dense cluster: prose, table row, Q2 quiz choice+explanation+citation) | Yes — replaced with 7 CFR Part 1755 + RUS Bulletin 344-2, and 1753F-201 is now correctly re-scoped in-text as the acceptance-*testing* bulletin, not the materials list. |
| L08 OS1/OS2↔G.652 mapping (bonus, not in Auditor's original 4-item list but flagged by C1 during T02 authoring and consistent with the T01-L08-Q7 pool fix from inc4) | L08 | Yes — "OS1 = G.652.A/B... OS2 = G.652.C/D" corrected in the lesson's own acronym table (was previously "OS2 = G.652.D only, OS1 = G.652.A/B/C" in the live JSX, inconsistent with the pool). |

**Confirmation the correctly-scoped uses were LEFT ALONE (Auditor §5(b)/(c) explicit instruction):**
- 1751F-630's use in L02 (pole/clearance content), L05 (aerial plant design references), L06, L09
  (pole design standards table) — spot-checked via the diff; none of these lines appear in the changed
  hunks, confirming they were correctly left untouched.
- 1.1411's OTMR/timeline uses in L05 (OTMR flashcard: "47 CFR 1.1411... allows a qualified contractor...
  single visit") and L09 (OTMR table row, NWP 57 quiz choice referencing "FCC Part 1.1411 — pole
  attachment authorization" in a timeline context) — confirmed untouched in the diff.

## 3. L10 capstone quiz — priority item, confirmed fixed

The Auditor report flagged `L10.t01-capstone-quiz.jsx` as highest priority since it's graded content.
Confirmed: the explanation for the capstone's synthesis question now correctly describes RUS Form 219
as "an Electric Program document... not a telecom close-out document," matching the corrected framing
used everywhere else. `answerIndex` for this question is unchanged (still 2 — Option C remains the
correct choice, the fix only touches why option D is wrong).

## 4. Scope/completeness check

`git show --stat 1f56ca9` shows exactly 11 files changed: the 2 pool JSON files (§1 above) + 9 lesson
JSX files (L01, L02, L04, L05, L06, L07, L08, L09, L10 — every T01 lesson file that the Auditor's
inventory named as carrying one of the 5 errors, plus L08 for the OS1/OS2 bonus fix). This matches the
Auditor's own finding that the JSX-prose problem "touches every one of the 9 T01 lesson files plus the
capstone quiz" — L03 was the only lesson with none of the flagged citations and correctly shows no
diff. Commit message explicitly notes "L06 hotfix preserved" (the D028 `TimelineSequence` `correctOrder`
fix from the earlier live-crash hotfix) and "vite build clean" — consistent with a build-verified
integration, not just a text edit.

## Conclusion

All items in the Auditor's PASS-with-caveat verdict are resolved: the O48 JSX-prose citation errors
(5 distinct corrections across 9 files + capstone) are confirmed fixed with source-verified correct
replacements, the 2 pool-level citation-precision items from Auditor §7 are confirmed fixed with the
exact recommended reword, and no answer key changed anywhere in the commit. **inc5 clears the RT gate
— T01 is flip-eligible on this dimension.**
