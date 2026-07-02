# T01 content audit — assessment pools (96Q) + O48 live-prose citation bonus

> Auditor working report (first CONTENT audit; graded vs Opus baseline `docs/audit/assignment-1.md` + my own `docs/audit/engine-verify.md`, same rigor). Detail here; thread carries a short summary + pointer (D018).
> Scope per dispatch: `content/training/assessment-pools/T01-L01..L09.json` + `T01-final.json` (96Q total) + `_research/T01.md` + `_research/T01-redteam.md`, on CEO branch `claude/ceo-fresh-instance-boot-u2zw28`. Author = C1 (Sonnet-5 builder), red-team = C2 (Sonnet-5 builder). Method: independent re-verification, not a re-read of C1/C2's word — ran the real engine loader + a fresh automated structural check, and independently re-derived every disputed CFR/RUS citation via WebSearch (WebFetch to primary hosts also 403s in my environment, matching C1/C2's logged constraint) rather than trusting their table. Last updated 2026-07-02.

## Headline

**The pool set clears the gate. My independent structural check and citation spot-checks match C2's re-check exactly — no daylight between my read and theirs.** The 6 originally-flagged items (2 uncited specific facts + 4 paper-trail gaps) are genuinely fixed, not relabeled. Separately, **O48 is real and bigger than scoped**: the "5" corrected citations from the pool-authoring pass are still live and asserted as fact in the lesson JSX prose (`osp-training/src/lessons/T01/*.jsx`) — I traced the exact locations and independently confirmed the correct replacement citation for all 5, including resolving the C1-vs-Planning disagreement on the pole-fee cite.

---

## 1. Pool set — independent structural re-check (own tooling, not trusting C2's report)

Ran my own Node script against all 10 pool files (not C2's script, not their numbers taken on faith):
- **96 questions total**, 9×8 lesson pools + 24 topic-final — matches the readme launch dial exactly (draw-4/pool-8/pass-70 lessons; draw-15/pool-24/pass-80 final).
- **Zero banned types** (only `mc`/`drag-match` present).
- **Zero `answerIndex` out-of-range.**
- **Zero malformed `correctMap`** (every drag-match's map keys == its `targets` id set, every value a valid `items` id).
- **Loaded the real engine loader** (`routes/_assessment_pools.js` `listPools()`) against the file set — all 10 pools validate with no thrown errors, confirming no regression versus the merged engine.

**Result: matches C2's automated check exactly.** No independent finding here — this is a confirmation, not a rubber stamp (I wrote my own script rather than re-running theirs).

## 2. Re-check of the 6 fix-pass items (verify the fixes are real, not relabeled — Planning's specific ask)

Read the actual JSON for both flagged questions directly (not the fix-pass table's description of them):

- **`T01-L04-Q7`** (30mm bend radius) — confirmed: now carries a `citation` field describing the figure as an industry-vendor convention (not a formal standard clause), and the explanation text is hedged ("commonly cited around 30 mm... verify... against the specific tray manufacturer's datasheet") rather than asserted as settled fact. **Real fix, not cosmetic.**
- **`T01-L08-Q7`** (OS2 = G.652 mapping) — confirmed: `citation` field added; explanation corrected to "OS2 = G.652.C or G.652.D... OS1 maps to earlier G.652.A/B" (fixes the original's incorrect folding of G.652.C into OS1). **Real fix.** One cosmetic gap survives, same one C2 flagged: the answer **choice** text still says "G.652.D SMF" only, narrower than the now-broader explanation ("C or D"). Not a defect (D is still the unambiguous single correct choice) — noted for completeness, not re-flagging.
- **4 research-log backfill rows** (BICSI OSPDRM, ANSI/TIA-606-C, RCDD/CFOT-CFOS, NFPA-70/IEEE-C2 scope) — confirmed present in `T01.md`, and confirmed each pool question's `citation` text resolves to its backfilled row (`T01-L01-Q3`↔OSPDRM, `T01-L05-Q1`↔606-C, `T01-L08-Q3`↔RCDD/CFOT, `T01-L08-Q4`↔NFPA70/C2). **Real, not just added-and-unlinked.**

**Result: all 6 confirmed genuinely resolved.** Agrees with C2's re-check verdict independently.

## 3. Citation spot-checks — independently re-derived via WebSearch (not trusting C1's table)

I did not treat C1's `T01.md` pass/fail table as ground truth — I re-ran the searches myself for the highest-stakes corrected citations (the ones where getting it wrong would ship a *worse* error than the one being fixed):

| Citation claim | My independent WebSearch result | Verdict |
|---|---|---|
| RUS Form 219 = "Inventory of Work Orders," governed by 7 CFR 1726.405, **Electric** program — NOT a telecom close-out form | Confirmed verbatim via Cornell LII / eCFR: title, section number, and Part 1726 = "Electric System Construction Policies and Procedures." | ✅ C1's correction is right |
| RUS 1753F-201 = "Acceptance Tests and Measurements of Telecommunications Plant" (1997), a **testing** bulletin, not a materials-acceptance list | Confirmed verbatim (title match, codified at 7 CFR 1755.400). | ✅ C1's correction is right |
| RUS Form 515 = "Telecommunications System Construction Contract" (the correct telecom construction-contract form) | Confirmed via rd.usda.gov / Federal Register hits — matches exactly. | ✅ Right replacement |
| 7 CFR 1753.49 = "Closeout documents" (telecom, Subpart F) — the correct telecom closeout citation | Confirmed via eCFR/Cornell LII section title match. | ✅ Right replacement |
| Telcordia GR-771-CORE = "Generic Requirements for Fiber Optic Splice Closures" (mechanical/environmental testing scope) | Confirmed via Intertek/Telcordia listing — matches scope claimed (thermal aging, freeze-thaw, weather-tightness). | ✅ Right replacement |
| RUS 344-2 = "List of Materials Acceptable for Use on Telephone/Telecommunications Systems of RUS Borrowers" (the actual materials-acceptance list, under 7 CFR Part 1755) | Confirmed via govinfo/Stanford catalog hits. | ✅ Right replacement |
| 47 CFR 1.1409 = "Allocation of Unusable Space Costs" | Confirmed exact section title via Cornell LII/eCFR. **But** the search also surfaced that §1.1409 explicitly cross-references "the formula referenced in §1.1406(d)(2)" — i.e. §1.1406 is where the actual rate FORMULA lives; §1.1409 is a sub-component (apportioning the unusable-space cost input to that formula), not the formula section itself. | **C1's citation is topically adjacent but imprecise as "the" fee/rate section** — matches Planning's independent flag exactly (see §4 below, resolved). |
| 47 CFR 1.1411 = "Timeline for access to utility poles" (survey/estimate/OTMR procedural deadlines) — **not** a fee/rate section | Confirmed verbatim via Cornell LII/eCFR: covers 45-day survey, 14-day estimate, OTMR 15/30-day decision timelines. Zero fee/rate content. | ✅ Confirms the JSX's "attachment fees under 1.1411" framing is definitively wrong |

**No divergence found between C1's table and my independent re-derivation**, except the one Planning had already flagged (1.1409 precision) — which I now resolve below with a source-backed answer.

## 4. O48 resolution — the pole-fee citation (Carter/Planning's open question)

Planning's dispatch asked me to adjudicate between C1's proposed `47 CFR 1.1409` and Planning's own suspicion of `§1.1406 + §§1.1409/1.1410`. My independent search settled it:

- **§1.1406** ("Commission consideration of the complaint") is where the Commission's actual **rate formulas** live — the cable-service Space-Factor×Cost formula and the telecom/cable-telecom higher-of-two-formulas rule are both stated under 1.1406, per the eCFR text itself.
- **§1.1409** ("Allocation of Unusable Space Costs") and (by the same numbering logic) **§1.1410** are sub-rules that apportion specific cost *inputs* into that formula — not the formula's home section.

**Correct citation for "the pole attachment fee/rate formula": `47 CFR 1.1406` (general rate formula), with `§§1.1409–1.1410` as supporting citations for the unusable/usable-space cost apportionment specifically** — Planning's instinct was right; C1's `1.1409`-only citation, while about the same general topic (pole-attachment economics) and not "wrong" in the way `1.1411` is, is not the correct single anchor for a "what governs attachment fees" claim. This should be the correction that ships in the gated inc5 fix — not `1.1409` alone.

## 5. O48 — live JSX-prose citation errors: bigger footprint than scoped, all 5 confirmed + corrected

Planning named 4 locations (L04/L05/L06/L09); I grepped every T01 lesson JSX file directly and found the errors are **more widespread** than the dispatch listed. Full inventory:

### (a) `RUS Form 219` asserted as the telecom project-completion/close-out form
**WRONG** — it's the Electric program's "Inventory of Work Orders" (7 CFR 1726.405), not telecom. **Live in 6 files, not 4:** `L04.inside-a-splice-case.jsx:241`, `L05.osp-project-lifecycle.jsx` (learning objective l.29, table row l.74-76 — this one already carries a `[confirm specific section]` hedge and an explicit "do not cite 1726 for telecom" warning, suggesting a prior author suspected the problem but didn't resolve it — l.147, l.265, l.325 flashcard), `L06.who-does-what.jsx:303`, `L07.reading-a-strand-map.jsx:357` (a quiz **choice** text, not just prose), `L09.osp-standards-landscape.jsx:342,488`, `L10.t01-capstone-quiz.jsx:323,327` (capstone quiz explanation text — this one is graded content, highest-priority fix). **Correct citation: RUS Form 515 (construction contract) + 7 CFR 1753.49 (closeout documents) for telecom; RUS Form 219 is Electric-program-only.**

> **ADDENDUM (2026-07-02, post-inc5 verify) — this inventory was itself incomplete.** Verifying inc5 (C2's applied fix, C1's RT-PASS) against the current CEO branch, I found **inc5 fixed exactly what this report named — but this report didn't name every live occurrence.** `git show 1f56ca9 -- L06.who-does-what.jsx` is a 1-line diff (only the PE-signing line at the old l.303); it never touched **`L06.who-does-what.jsx:206-208`** ("Compiles the final as-built package... For RUS-program: assembles the RUS Form 219 documentation package" / "Delivers to: ... RUS (Form 219 package for fund advancement)") or **`L06:287`** ("Delivers final package to client and RUS (Form 219)") — both still assert Form 219 is the telecom close-out/fund-advancement document, unchanged. Similarly, inc5's L09 diff fixed the 1.1406/1.1411/1753F-201 items comprehensively plus **one** Form-219 quiz-choice, but never touched **`L09.osp-standards-landscape.jsx:73`** (vocab-list glossary term: "Form 219 — Final Inspection Report... triggers final RUS loan advancement"), **`:392`** (comparison-table row, same claim), **`:425`** ("Book vs. Field" narrative: "Form 219 (final close-out)"), or **`:463`** (flashcard, same wrong definition as l.73) — all four still live, unfixed. **Net: 6 live Form-219 misapplications remain on the CEO branch after inc5** (2 in L06, 4 in L09) — inc5's own scope-completeness claim ("every T01 lesson file... plus L08") is accurate for what it targeted, but C1's RT-PASS verdict overclaims full coverage of the O48 error class, because both this report and the RT check traced back to the narrower original inventory above rather than a fresh exhaustive grep at fix time. **T01 should not be considered flip-clean on this dimension yet** — see the auditor thread entry for the routing recommendation.

### (b) `RUS Bulletin 1751F-630` over-applied beyond its actual scope (aerial-plant design)
**WRONG in two distinct spots** (this is the pool research log's "5 errors" reaching 5 only if this is counted as 2, matching Planning's count of 5):
- `L01.osp-vs-isp.jsx:159,262,346,362` — cited for the *general* "scope of outside plant" claim. 1751F-630 is titled "Design of Aerial Plant" — aerial pole/messenger/sag/clearance design only. **Correct citation for general OSP/ISP scope: 47 CFR Part 32 §§32.2421–32.2423** (the FCC plant-account classification, which the pool set already uses correctly).
- `L04.inside-a-splice-case.jsx:262` — cited (§8) for splice-enclosure moisture/mechanical requirements. **Correct citation: Telcordia GR-771-CORE** (generic requirements for fiber optic splice closures — the actual document covering closure environmental/mechanical testing).
- (1751F-630's use in `L02`/`L05`/`L06`/`L09` for pole/clearance/PE-requirement content is **correctly scoped** — no fix needed there.)

### (c) `47 CFR 1.1411` asserted as governing pole-attachment **fees**
**WRONG** — confirmed above (§4): 1.1411 = access-timeline/OTMR procedure, contains zero fee content. **Live in:** `L02.parts-of-a-pole.jsx:43` (a **learning objective**, not just body prose — "the role of FCC Part 1.1411 in governing attachment fees"), l.246, l.282(indirectly via NESC-only cite, ok), l.302 flashcard, l.402-403; `L09.osp-standards-landscape.jsx:65,135,338,453` (glossary + comparison table); `L10.t01-capstone-quiz.jsx:304`. **1.1411's OTMR/timeline uses elsewhere (L05 OTMR content) are correctly scoped — no fix needed there.** **Correct citation for fees: `47 CFR 1.1406` (+ `§§1.1409–1.1410` for cost-apportionment detail), per §4 above.**

### (d) `RUS 1753F-201` asserted as the materials-acceptance/accepted-products-list bulletin
**WRONG** — its real title is "Acceptance Tests and Measurements of Telecommunications Plant" (a testing bulletin). **Live in:** `L09.osp-standards-landscape.jsx:180,214,216,310,502,508-509` (this is the densest single cluster — the whole "RUS materials acceptance program" subsection is built around the wrong document). **Correct citation: `7 CFR Part 1755` + `RUS Bulletin 344-2`** ("List of Materials Acceptable for Use on Telecommunications Systems of RUS Borrowers" — the actual accepted-products list).

**Net: the JSX-prose problem is real, confirmed, and touches every one of the 9 T01 lesson files plus the capstone quiz — not a contained 4-line fix.** `L10.t01-capstone-quiz.jsx` deserves priority since it's graded content a trainee's score depends on, not just background reading.

## 6. Gate integrity + pedagogy (remaining dispatch scope)

- **Author ≠ RT:** confirmed by commit provenance — C1's authoring commits (`0768776`, `0f3cd76`, etc.) and C2's red-team commits (`ce0cd99`, `dd12314`) are separately labeled and sequential (author → RT → author-fix → RT-re-check), matching the gate's required shape. (Git identity itself doesn't separate C1/C2 — both commit as the same bot account — so this is process/commit-message evidence, not a cryptographic guarantee; flagging as the honest basis for this PASS, not a gap.)
- **Pedagogy spot-check:** read a sample across L01/L03/L06/T01-final directly (not just C2's verdict) — every sampled question has one unambiguous correct answer and plausible, non-giveaway distractors. Matches C2's "no ambiguity" claim on the sample I drew.
- **SPA wiring:** confirmed all 9 lesson JSX files pass the matching `assessmentId="T01-L0N"` prop to `PooledAssessment`/`GatedAssessment` — the pools are actually reachable from the live lesson pages, not orphaned content.

## 7. CORRECTION (post-report) — the §1.1406/1.1409 imprecision is also IN the pools, not just the JSX prose

The CEO flagged (on its thread, after my first pass) that C1 used the `1.1409`-as-"the rate formula" citation inside the pools themselves, not only in the JSX prose I audited in §5. I checked — **this is real and I missed it in the initial pass.** Grepped all 10 pool files for `1.1409`/`1.1411`:

- **`T01-L02-Q4`** — the answer's `explanation`/`citation` states "*the rate/fee formula lives in 47 CFR 1.1409*" and frames the whole question as a binary "1.1409 (fees) vs 1.1411 (timeline)" contrast.
- **`T01-final-Q4`** — same "1.1409 (rate formula); 1.1411 (timeline)" framing, reused at the synthesis level.

**Verdict on these two, applying §4's finding:** the underlying **answer key is not broken** — as a binary choice between 1.1409 and 1.1411, 1.1409 is unambiguously the closer-to-correct pick (it genuinely is a fee-formula sub-rule; 1.1411 has zero fee content) — a trainee who picks 1.1409 here isn't being taught something false. But the **citation/explanation text over-claims precision**, asserting 1.1409 as "*the* pole attachment rate formula" when my independent research (§4) shows that's actually §1.1406, with §1.1409 as a supporting cost-apportionment sub-rule. Same imprecision pattern as the JSX prose, now confirmed to also be **in graded content** (not just background reading) in 2 places: `T01-L02-Q4` (lesson) and `T01-final-Q4` (synthesis, higher-stakes since topic-final gates completion at 80%).

**Recommend:** route back to C1 — reword both explanations to "§1.1406 is the rate formula; §1.1409 governs a specific cost-apportionment input to it" rather than "the rate/fee formula lives in 1.1409." No `answerIndex` change needed (the correct choice stays index 1 in both), only the explanation/citation text. This should ride the same fix pass as the O48 JSX-prose correction, not a separate cycle — same underlying source-precision gap, just two locations (prose + pools) instead of one.

## ADDENDUM 2 (2026-07-02) — Final T01 re-verify: capstone strip confirmed clean, T01 is now flip-ready

Checked the CEO branch tip (`60ce3a7c`) directly against code, not the thread's claims, for the last two open items:

**Capstone strip (D031) — CONFIRMED clean.** `L10.t01-capstone-quiz.jsx`: the graded `<Quiz>` block (which contained `T01-CAP-Q15`, the question with the Form-219 distractor addressed in Addendum 1) is fully removed — 0 `<Quiz` occurrences. `completesOnView: true` is set in `meta`. The file now reads as a legitimate review page (vocabulary/objective recap, explicit "this page is reading/review material, not a graded quiz" note) — prose retained, not gutted. Re-ran `vite build` (`npm run build` inside `osp-training/`) from a clean worktree: succeeds, no errors. `node --test tests/assessment_engine.test.js`: still 10/10 (capstone strip doesn't touch the pool engine, as expected).

**Same check extended to T18/T02/T03/T04's capstone strips** (all landed in the same commit, `4966de7d` integrated at `60ce3a7c`): all 5 files (`T01/L10`, `T18/L10-t18`, `T02/L12.t02`, `T03/L12.t03`, `T04/L10-t04`) have 0 `<Quiz` occurrences and `completesOnView: true` set. T04's capstone retains a `BranchingScenario` component — checked its implementation (`osp-training/src/components/primitives/BranchingScenario.jsx`): it's client-side localStorage-persisted narrative/formative content, not a graded/scored quiz (no answer-key, no server submission) — correctly left in place as non-graded review material, not a D031 violation.

**Final verdict on T01: flip-ready.** Both blockers from this report + the inc5-verify addendum are now genuinely resolved: (1) Form-219 fresh-grep fix — clean (Addendum 1); (2) capstone strip — clean (this addendum). No remaining findings on T01.

## Verdict

**Pool set (96Q): clear to flip visible, WITH ONE CITATION-PRECISION CAVEAT** — 94/96 questions have no finding; `T01-L02-Q4` + `T01-final-Q4` assert `47 CFR 1.1409` as "the" pole-attachment rate formula with more precision than my research supports (the correct anchor is §1.1406, per §4/§7) — answer keys are still correct (1.1409 beats the offered alternative 1.1411), only the explanation/citation text overclaims. Not a merge-blocker (no wrong answer ships), but should route to C1 alongside inc5. **O48 (live JSX-prose citations): CONFIRMED, real, and broader than scoped** — 5 distinct citation errors (RUS Form 219, 1751F-630×2 uses, 1.1411-for-fees, 1753F-201) spanning all 9 T01 lesson files + the capstone quiz, with source-verified correct replacements for all 5 (including resolving the 1.1409-vs-1.1406 ambiguity in Planning's favor — now confirmed to also apply inside the pool set itself, see §7). Recommend inc5 prioritize `L10.t01-capstone-quiz.jsx` first (graded content) then the `L09` materials-acceptance cluster (densest error concentration), and fold in the 2 pool-level precision fixes from §7.
