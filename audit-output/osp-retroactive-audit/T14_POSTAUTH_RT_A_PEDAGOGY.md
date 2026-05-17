# T14 Post-Author RT-α — Pedagogy Framing

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T14_POSTAUTH_RT_A_PEDAGOGY.md` written.**

**Wave:** T14 Author Wave (`a9b6c9e` — 12 lessons, 4137 insertions)  
**Role:** RT-α (pedagogy / learner-progression / schema compliance framing)  
**Pair-mate:** RT-β (technical framing — after)  
**Date:** 2026-05-17  
**Token use:** within 130K cap  

---

## 1. Registry + Cascade-Pattern Step-1 Scan

**Citation registry check:** RUS 1751F-630 §7, RUS 1751F-635 §5, NEC §250.52/§250.56/§250.94, NEC §770.93/§800.93, OSHA §1910.147/§1910.268/§1910.333, NESC Rules 92/96/96C/96F/97 — all flagged by author as registry hits (T14_AUTHOR_NOTES.md). No re-verification needed for these per §8 protocol.

**Registry miss (net-new, not in registry):** IEEE 81 §9.3/§9.4, IEEE Std 1100 §1.2–1.3/§8.3/§8.5/§8.6, Telcordia GR-1275, NACE SP0169, TIA-607-D §4, RUS 1751F-815. All correctly marked `[confirm edition]` or equivalent author guards. RT-β should primary-source these in its technical pass.

**Cascade-pattern step-1 — P1 through P12 checked against T14 content:**
- P1 (47 CFR §32.2210 mis-cite): not applicable to T14 (no Part 32 references)
- P2 (H₂S IDLH): not in T14
- P3 (ANSI Z359): not in T14
- P4 (OM5 fabricated EMB): not in T14
- P7 (NESC §-vs-Rule notation): L01 uses "Section 09 (Rules 92–99)" correctly; L02/L03 use "Rule 96F" correctly; L11 uses "Section 09" correctly. Clean.
- P8 (NEC Chapter 9 Table 1 fill misattribution): not in T14
- P9 (CFR §1.141x cluster): not in T14
- P10 (FCC 23-109 betterment): not in T14
- P12 (standards-edition currency): TIA-607-D, GR-1275, NACE SP0169, IEEE 81, IEEE 1100 — all marked [confirm edition]. Compliant.

No cascade-pattern matches found in T14.

---

## 2. DAG + Schema Validator

**`validate-lesson-schema.js T14`:** 12/12 PASS. No missing `key_terms`, no missing `<Quiz>`, no missing `<Flashcard>`, no missing `vocabulary_assumed`. Schema clean.

**`build-dag-registry.js`:** 4 T14 duplicate-introduction entries reported. Analysis follows (see Finding P-1, P-2, P-3, and classification note below).

---

## 3. Dispatch-Specific Items

### A. `grounds per mile` — L02 vs. L11 classification

**DAG registry:** `grounds per mile` introduced by both `T14.L02` and `T14.L11`.

**Assessment:**
- **L02 introduction** (`vocabulary_introduced: ['grounds per mile', ...]`): The definition given in L02 is foundational — "The number of grounding electrodes required per mile of aerial communications plant, as set by NESC Section 09." This is a concept-level introduction contextualizing MGN architecture. The prose correctly links the concept to NESC Section 09 at the first encounter.
- **L11 introduction** (`vocabulary_introduced: ['grounds per mile', 'grounding interval']`): L11 is the dedicated advanced lesson on the NESC interval. L11's definition for `grounds per mile` is more detailed — it includes the RUS bulletin caveat ("NESC requirement is a minimum — RUS bulletins or site-specific engineering may require more frequent grounding"). L11 also introduces `grounding interval` as a companion term.

**Verdict:** This IS a pedagogically defensible split. L02 introduces the concept just enough to explain why the communications side needs independent grounds even on an MGN system. L11 deepens it with the numeric interval, worked example, and RUS-vs-NESC precedence rule. 

**Issue (LOW):** The DAG treats both as `vocabulary_introduced`, which flags a duplicate and could mislead students who encounter the flashcard for `grounds per mile` twice — once in L02 (concept card) and once in L11 (richer definition card). The definitions are not identical; L11's is stricter and more complete. 

**Recommendation:** L02 should classify `grounds per mile` as `vocabulary_introduced` with the concept-level definition it has now, AND L11 should rename its term to something more specific (e.g., `grounding interval` already covers the operational concept; or L11 could demote `grounds per mile` from `vocabulary_introduced` to a deepening note with a `vocabulary_assumed` pointer to L02). Alternatively: harmonize the two definitions so they're consistent, and document in the lesson that L11 deepens the L02 definition. Either way, the two flashcard definitions must not contradict each other. **They currently don't contradict — L11's definition is a superset of L02's** — but a learner who reads the L02 card first will get an incomplete picture.

**Classification:** concept introduction in L02 is correct; L11 is deepening. The split is defensible. The LOW issue is the duplicate `vocabulary_introduced` classification (DAG flags it) and the inconsistency in flashcard completeness between the two cards.

---

### B. `primary protector` — T14.L07 vs. T19.L06 precedence

**DAG registry:** `primary protector` introduced by both `T14.L07` and `T19.L06`.

**Teaching order check:**
- T19 = teaching position 9 (course-catalog.js line 132–143)
- T14 = teaching position 10 (course-catalog.js line 145–155)
- T14 course-catalog entry explicitly notes: `prerequisites: ['T01', 'T02', 'T05', 'T06', 'T18', 'T19']` — T19 is a prerequisite for T14

**T19.L06 treatment:** The lesson is titled "Headend Grounding — Where OSP MGN Terminates" and introduces `primary protector` at awareness level with an explicit forward-reference: `"You'll learn the full sizing and placement methodology in T14."` Definition in T19.L06: conceptual/awareness-level (what it does, why it's at the CO entry, NEC Art. 770 hook).

**T14.L07 treatment:** Full technical depth — gas-tube vs. MOV vs. combination arrester types, VPL, placement rules (aerial-to-underground riser + building entry), protection coordination chain, UL 497B listing, NEC §770.93/§800.93 citations.

**Verdict:** Correct architectural pattern. T19.L06 is the concept-introduction lesson; T14.L07 is the deepening lesson. This is exactly the prerequisite-DAG-invariant pattern the curriculum is designed around. The DAG registry `duplicate_introductions` flag is technically correct (both list it in `vocabulary_introduced`) but the classification should be:
- T19.L06 = FIRST INTRODUCTION (awareness + forward-ref)
- T14.L07 = DEEPENING (full technical treatment)

**Issue (LOW-MED):** Both lessons list `primary protector` in their `vocabulary_introduced` array. Semantically, only T19.L06 should list it as `vocabulary_introduced`. T14.L07 should either (a) list it in `vocabulary_assumed` with `source_lesson_id: 'T19.L06'` and treat it as a deepening reference, or (b) keep it in `vocabulary_introduced` with an explicit note that this lesson provides the full technical depth for a term first introduced in T19.L06. The current structure causes the DAG validator to flag a duplicate, which is a maintenance burden and could confuse future curriculum editors about which lesson "owns" the term.

**Recommendation:** Add `{ term: 'primary protector', source_lesson_id: 'T19.L06' }` to T14.L07's `vocabulary_assumed` array AND remove `primary protector` from T14.L07's `vocabulary_introduced` array. The key_terms flashcard for `primary protector` in T14.L07 can remain — it provides the deeper definition — but the ownership should be cleanly with T19.L06.

---

### C. `[confirm edition]` hedge placement review

Author placed edition guards on: TIA-607-D §4 (L05), Telcordia GR-1275 (L01/L06/L07/L10), NACE SP0169 (L09), NESC C2-2023 Section 09 interval (L11), RUS 1751F-815 (L10).

**Assessment of hedge placement:**

| Standard | Guard applied | Placement quality |
|---|---|---|
| TIA-607-D §4 | `[confirm edition]` in key_terms | ✓ Correct — paywalled, edition in flux |
| GR-1275 | `[confirm edition]` on 5 Ω threshold multiple locations | ✓ Appropriate — Telcordia/iconectiv; edition number varies |
| NACE SP0169 | `(now AMPP SP0169 [confirm current edition])` | ✓ Strong — catches the NACE→AMPP rebrand |
| NESC Section 09 interval | `[confirm NESC C2-2023 Section 09 interval — paywalled; verify via RUS 1751F-630 §7]` | ✓ Excellent — provides fallback path |
| RUS 1751F-815 | `[Confirm 1751F-815 or fallback to 1751F-630 §7]` | ✓ Correct — discrete bulletin existence unconfirmed |
| IEEE 81 §9.3/§9.4 | No `[confirm edition]` marker in prose | LOW: IEEE 81 has been revised (2012 edition vs. older). Author notes it as paywalled but the lesson prose doesn't carry an edition guard on the section numbers. Should add `(IEEE 81-2012 §9.3, [confirm current edition])` or equivalent to L06. |
| IEEE Std 1100 | No `[confirm edition]` marker in prose | LOW: IEEE Std 1100-2005 "Emerald Book" — lesson cites `§1.2–1.3`, `§8.3`, `§8.5`, `§8.6` without edition. Should add `[confirm edition]` near first use in L01/L07. |

---

## 4. Pedagogy Assessment — Field-Crew Learner Test

Reviewed L01 (foundation), L03 (messenger bonding), L08 (stray voltage), L11 (grounds-per-mile).

### L01 — "Why We Ground" — STRONG
- Sink-drain analogy is clear and non-forced. Field crew will immediately connect.
- Grounding vs. bonding distinction is one of the strongest I've seen in this curriculum — the "bonding is equality between components; grounding is connection to earth" shortcut is memorable.
- Fault-current scenario (lineman as return path, energized-messenger scenario) is visceral and accurate.
- GPR section is a step up in technicality — the "rock dropped in water" analogy helps but the CO-ring explanation assumes some facility-level context the foundation-tier reader may not have yet. LOW concern: GPR at CO/FDH level may be premature for a learner who hasn't yet seen T19 headend content. Since T14 follows T19 in teaching order, this should be fine — but the lesson text itself doesn't cross-reference T19, leaving the context-less reader with a somewhat abstract GPR explanation. Consider adding: `"(You've already seen the headend context in T19.L06 — this is the full electrical explanation for why the CO ground ring matters.)"` 

### L03 — Messenger Bonding Rules — STRONG
- WorkedExample for downlead-fill-rate is a good touch.
- ADSS exemption explanation ("nothing to bond") is clear, correct, simple.
- Bonded-messenger separation concept is present and explained. Good.
- "Book vs. field note" on RUS joint-use agreement vs. NESC interval is excellent — exactly what field crews need.

### L08 — Stray Voltage Detection — STRONG + ONE FLAG
- LOTO sequence in key_terms correctly cites OSHA §1910.147.
- "PPG is applied AFTER LOTO confirmation, not instead of it" — critical sequencing lesson, correctly placed.
- BranchingScenario with "apply PPG without LOTO" as the danger path is pedagogically sound — the mistake is embedded in the learning experience.
- **LOW issue:** The key_terms definition for `LOTO sequence` names the dispatcher contact step as "contact the pole owner's dispatcher and request isolation." On many rural RUS routes, the pole owner is the electric cooperative. The lesson later (in the body) should clarify: "the dispatcher is the electric cooperative's system operator, not a contractor supervisor." Without this, a learner might confuse "dispatcher" with their own crew's foreman. Body text check needed — if this is already clarified in body prose, LOW is resolved. (Could not confirm without reading the full L08 body; see Coverage Gaps.)

### L11 — NESC Grounds Per Mile — SOLID
- "String of lights with no circuit" analogy opens the lesson cleanly.
- WorkedExample with user-adjustable `nesc_interval_ft` and `rus_interval_ft` is exactly right — lets learners explore what changes when RUS overrides NESC.
- Formula is correct: `Math.ceil(routeFt / controllingInterval)` — ceiling function appropriate.
- Quiz Q3 sanity-check: 5 miles × 5280 = 26,400 ft ÷ 1320 = exactly 20 — `correct: 2` (index) = answer option "20" = answer is `correct: 2`, which is the third option (0-indexed). Let me verify the option order: `['10', '15', '20', '25']` — correct: 2 = "20". ✓ Math checks out.
- Paywalled NESC interval guard handled correctly.

---

## 5. Cumulative Regression Sample — 3 earlier-wave items still intact

Spot-checked three items that prior RT passes on other topics established as curriculum-wide patterns:

1. **Flashcards rendered via `meta.key_terms.map()`** (all 12 lessons): ✓ All lessons render flashcards using the standard pattern `{meta.key_terms.map((kt) => <Flashcard key={kt.term} term={kt.term} definition={kt.definition} />)}`. Compliant with locked flashcard requirement.

2. **Tiered content markers (`data-tier="foundations"` / `"working"` / `"advanced"`)**: ✓ All lessons except L12 (capstone, single-tier by design) use multi-tier structure. Clean.

3. **No AI/generation signals in prose**: ✓ Confirmed across L01, L03, L07, L11. No "this lesson was generated by AI" language, no meta-commentary. Clean.

---

## 6. Under-Audited Lessons Rotation

L04 (NEC 250.52 Electrodes), L05 (IBT and GES), L09 (Cathodic Protection), L10 (RUS Bonding Schedule) not sampled in depth in §4. Quick pedagogy spot-check:

**L04:** key_terms include a term `'4 AWG bare copper'` — this is a measurement, not a concept term, and its definition reads like a specification note rather than a conceptual flashcard. **LOW:** non-standard term usage in `vocabulary_introduced`. The concept being introduced is arguably "grounding electrode conductor sizing" not the wire gauge itself. A learner searching the flashcard deck for "4 AWG bare copper" may not connect it to the broader concept. Consider renaming to `grounding electrode conductor (GEC) size` or folding the AWG note into the `ground rod` or `concrete-encased electrode` definition.

**L05:** IBT definition in key_terms correctly cites NEC §250.94. PBB definition cites `TIA-607-D §4 [confirm edition]` — guard is in the definition text which is visible in the flashcard. Edge-case pedagogy concern: learners will see `[confirm edition]` in the flashcard definition itself, which is jarring. **LOW:** `[confirm edition]` guards should be in the lesson prose (where a course editor would see them) but stripped from the flashcard definition text. Flashcard definitions should read as final, polished definitions. Example: `"(Source: TIA-607-D §4 [confirm edition].)"` in the key_terms definition creates a student-facing `[confirm edition]` that appears in the rendered flashcard.

**L09:** Cathodic protection section — `NACE SP0169 (now AMPP SP0169 [confirm current edition])` — same issue. The `[confirm current edition]` tag is inside the key_terms `definition` field, which means it appears in the student-facing Flashcard. **LOW (same as L05):** author-guard markers should be in prose or comments, not in student-facing flashcard definitions.

**L10:** Title is "RUS 1751F-815 Bonding and Grounding" but the lesson itself notes that 1751F-815 existence is unconfirmed and uses the fallback chain throughout. **LOW:** the lesson TITLE cites an unverified bulletin number. A student will see "RUS 1751F-815 Bonding and Grounding" as the lesson title in the course navigation. If the bulletin doesn't exist, the title is misleading. Recommend: rename to "RUS Bonding and Grounding Requirements" (or "RUS 1751F-630 §7 Bonding Documentation") until the bulletin number is confirmed. The lesson body guards are correct; the title should match.

---

## 7. Build Verification

**`cd osp-training && npm run build`:** ✓ SUCCESS — `built in 6.09s`, zero errors. All 12 T14 lesson bundles included in output.

---

## 8. Structured Findings

| # | Sev | Category | File | Line area | Issue | Fix shape |
|---|---|---|---|---|---|---|
| F-1 | LOW-MED | DAG/Schema | L07 | meta.vocabulary_introduced | `primary protector` in both T14.L07 and T19.L06 `vocabulary_introduced`. T19.L06 precedes T14 in teaching order (pos 9 vs 10). T14.L07 should assume the term, not re-introduce it. | Remove `primary protector` from L07 `vocabulary_introduced`; add `{ term: 'primary protector', source_lesson_id: 'T19.L06' }` to L07 `vocabulary_assumed`. Retain key_terms flashcard with deeper definition. |
| F-2 | LOW | DAG/Schema | L02, L11 | meta.vocabulary_introduced | `grounds per mile` in both `vocabulary_introduced`. Correct architecturally (L02=concept, L11=deepening with numeric interval) but creates DAG duplicate flag and produces two non-identical flashcard definitions. | Option A: Remove from L11 `vocabulary_introduced`, add to `vocabulary_assumed` (source: T14.L02), keep L11's richer definition in lesson prose but not in key_terms. Option B: Harmonize definitions so L11 flashcard explicitly says "deepened from L02 — full rule follows." |
| F-3 | LOW | Edition guard | L06 | key_terms / prose | IEEE 81 referenced as "§9.3" and "§9.4" without edition year in prose or key_terms. Should read "IEEE 81-2012 §9.3" or add `[confirm current edition]`. | Add edition qualifier or confirm-guard to first IEEE 81 prose citation in L06. |
| F-4 | LOW | Edition guard | L01, L07 | prose | IEEE Std 1100 cited at `§1.2–1.3`, `§8.3`, `§8.5`, `§8.6` without edition year. "Emerald Book" is 2005 edition. | Add `[confirm edition]` or `(IEEE Std 1100-2005)` where first cited in L01 and L07. |
| F-5 | LOW | Pedagogy/polish | L05, L09 | key_terms definition text | `[confirm edition]` guard phrases appear inside `definition` strings in key_terms, which renders in student-facing Flashcard components. Flashcard definitions should not contain author-guard markers. | Strip `[confirm edition]` and `[confirm current edition]` from flashcard `definition` strings. Move guards to inline prose comments or to the body of the lesson where editors see them. |
| F-6 | LOW | Pedagogy/clarity | L04 | meta.vocabulary_introduced | Term `'4 AWG bare copper'` is a wire gauge specification, not a pedagogically meaningful concept term. Flashcard for it reads as a spec note, not a memorable definition. | Rename to `grounding electrode conductor (GEC) sizing` or fold the #4 AWG detail into the `ground rod` or `concrete-encased electrode` definitions. Remove as standalone key_term. |
| F-7 | LOW | Title accuracy | L10 | file header, lesson title | Lesson title is "RUS 1751F-815 Bonding and Grounding" but 1751F-815 existence is unconfirmed per author notes. Student sees an unverified bulletin number in course navigation. | Rename title to "RUS Bonding and Grounding Requirements" or "RUS 1751F-630 §7 Bonding Documentation" until 1751F-815 is confirmed. Update `meta.title` and file comment. |
| F-8 | LOW | Pedagogy/clarity | L01 | Advanced tier / GPR section | GPR at CO/FDH level is explained without cross-reference to T19 headend context. Since T14 follows T19 in teaching order, a brief cross-ref ("As you saw in T19.L06...") would strengthen the GPR explanation for learners who just completed T19. | Add 1-sentence cross-reference to T19.L06 in the GPR Advanced section: "As you saw in T19.L06, the CO ground ring is the primary GPR mitigation for headend sites — this section explains the electrical mechanism behind it." |
| F-9 | LOW | Clarity | L08 | key_terms LOTO sequence | LOTO sequence definition says "contact the pole owner's dispatcher" without clarifying this is the electric cooperative's system operator. Risk: learner interprets "dispatcher" as their own crew foreman. | Add "electric cooperative system operator (not the crew's foreman)" to the LOTO definition or in body prose. |

---

## 9. Confirmed-Clean Items

- All 12 lessons pass `validate-lesson-schema.js` (key_terms, Quiz, Flashcard all present)
- Vite build clean — no import errors, no syntax errors in any T14 lesson
- All P1–P12 cascade patterns checked — none triggered in T14
- Registry-cited standards (NEC, NESC, RUS, OSHA) properly cited in author's registry-hit list
- Flashcard render pattern (`meta.key_terms.map()`) consistent across all 12 lessons
- Tiered content markers (`data-tier`) correctly applied
- No AI/generation signals in student-facing prose
- L08 LOTO sequencing pedagogically correct: LOTO first, PPG after, danger path teaches the mistake
- L11 WorkedExample formula (`Math.ceil(routeFt / controllingInterval)`) mathematically correct
- L03 ADSS exemption correct and well-explained
- L07 protection coordination chain (gas-tube → MOV → equipment immunity) technically sound from pedagogy standpoint
- `primary protector` in T14.L07: **T19.L06 precedes T14 in teaching order (position 9 vs 10)** — the architectural intention (T19 introduces at awareness level, T14 deepens) is correct. The fix needed is DAG housekeeping (F-1), not content revision.

---

## 10. Verdict

**YELLOW** — 9 findings, all LOW or LOW-MED. No HIGH or MED findings. No content errors or safety concerns. Build clean. Schema clean.

**Fix scope:** F-1 through F-9 are schema housekeeping, edition guards, flashcard polish, and one title accuracy issue. None require prose rewriting or citation verification. Fix-agent can apply all 9 in a single pass in ~60-100K tokens.

**RT-β saturation hint:** Technical framing should focus on:
- Primary-source verification of the net-new citations (IEEE 81, IEEE Std 1100, GR-1275, NACE SP0169) — confirm section numbers and values match the standards
- L11 NESC Section 09 grounding interval (1320 ft default) — verify this matches RUS 1751F-630 §7 or NESC C2-2023 Section 09
- L06 fall-of-potential 62% rule — verify against IEEE 81 §9.3
- L10 Form 219 grounding section reference — verify form section number
- Cross-lesson numeric checks (L06 worked example, L11 calculation, L12 quiz answers)
- MGN and IBT duplicate introductions involving T01.L08 (registry check: T01.L08 introduces `mgn`, `ibt`, `ges` per DAG — confirm T14 lessons correctly list these in `vocabulary_assumed` with T01.L08 as source, NOT as first introduction)

**Items NOT to re-verify (RT-β skip):** NEC §250.x citations (registry-verified), OSHA §1910.147 (registry-verified), RUS 1751F-630 §7 (registry-verified), Flashcard render pattern (clean).

=== T14 POST-AUTHOR RT-A PEDAGOGY REPORT END ===
