# T3 Trailer Fix Spec B — Cross-Lesson + Brief-Fidelity Framing

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Role:** Prep Agent B — READ-ONLY w.r.t. lesson content

---

## TF-1 — L3.8 intro "60–90 days" vs. body "30–60/90–180" split

**Cross-lesson echoes:**
- **L3.1, line 97** (fatal-flaw table): Batch A B7 fix updated this to "90–180 days (short-line railroads); 6–12 months (Class I: BNSF, CSX, NS, UP)." The body of L3.8 (line 76) is consistent with that corrected value. The intro phrase (line 37) is the only surviving flat-value inconsistency across the two lessons.
- **L3.11 (not yet authored):** Batch C brief §4 Red-Flag 1 and §6 Style Checklist item 4 explicitly require L3.11 to use the body-level split values ("short-line 30–60 days; Class I 90–180 days"). L3.11 must not repeat the intro's "60–90 days" framing.
- **Permit matrix example in L3.8 body (line 157):** The sample permit matrix already shows BNSF at "90–180 days" — consistent with the body. No change needed there.
- **Final exam (not yet authored):** Any L3.8 or L3.11 question on railroad permit timelines must use the split values. Fix-agent should note this to the Batch C author.

**Brief citation:** Batch C brief §4 Red-Flag 1 identifies this exact inconsistency and states the body is correct, the intro is the problem. Brief §6 Style item 4 locks the split framing for all future content.

**Convention compliance:** Fix must preserve the hedging convention ("the specific carrier should be confirmed") as per brief §6 item 4. Do not introduce a flat value anywhere.

**Forward-compatibility:** L3.11 authors will read L3.8. If L3.8 intro still says "60–90 days," the L3.11 author may inherit that as the general rule despite the brief's correction. Fix the intro before Batch C authoring begins.

**Style/voice:** The intro paragraph is narrative setup — one targeted sentence replacement will not affect voice. No structural change required.

**Risk:** LOW cross-lesson breakage. Only the intro phrase changes; nothing downstream in L3.8 or other already-published lessons references "60–90 days" as a canonical value.

---

## TF-2 — L3.5 Q3 option text "21.6%" vs. rationale "21.7%"

**Cross-lesson echoes:** The 21.7% fill ratio is L3.5-specific. No other lesson in L3.1–L3.8 quotes this figure. Flashcard in L3.5 Key Terms ("Conduit fill ratio — 40% rule") does not state the worked percentage — no flashcard fix needed. Body §Conduit Fill (line 114) correctly states the worked example reaches 21.7%; the body is internally consistent with the rationale. Only the Q3 option A text ("21.6%") is the discrepancy.

**Brief citation:** Discovery doc §3.5 — conduit fill ratio is a required topic. No brief guidance on precision-rounding convention exists. BATCH_B_REDTEAM_A finding #1 confirms neither rounding is arithmetically wrong (21.66% rounds either way), but the option text and its own rationale disagree within the same question.

**Convention compliance:** Q-structure format requires the option text and rationale to be mutually consistent. Current state fails that convention within a single question.

**Forward-compatibility:** L3.9 glossary cross-reference in L3.5 points to conduit fill for future splice closures — no quantitative carry-forward of the 21.66% value. No Batch C lesson reproduces this figure.

**Style/voice:** Changing "21.6%" to "21.7%" in the option text is a one-word number swap. Zero voice impact.

**Risk:** NONE. Isolated to one option text string in one question.

---

## TF-3 — L3.5 body "0.237 in²" vs. Q3 rationale "0.2376 in²"

**Cross-lesson echoes:** The 0.237 in² figure appears only in the body worked example (line 114). The Q3 rationale correctly uses 0.2376 in² (four sig-figs). No other lesson cites this cable cross-section figure. L3.9 cross-reference to conduit fill is conceptual ("conduit fill at splice locations") — no numerical carry-forward.

**Brief citation:** No brief guidance on sig-fig convention. Discovery doc §3.5 scopes conduit fill as a required topic but doesn't specify precision. Industry convention (BICSI OSP-DRD, NEC Ch. 9 examples) uses 4 sig-figs for cable OD calculations; 0.2376 in² is the more precise and standard value.

**Convention compliance:** No explicit lesson-level precision convention is locked. However, using 0.2376 consistently in body and rationale removes the internal inconsistency. Prefer fixing the body to match the rationale (upgrade body to 0.2376), not the other way around.

**Forward-compatibility:** No Batch C lesson inherits this figure.

**Style/voice:** Swapping "0.237" to "0.2376" in the body example text. Zero voice impact.

**Risk:** NONE. Cosmetic precision alignment.

---

## TF-4 — L3.5 flashcard "48 in below top of rail" vs. L3.8 "bottom of ties"

**Cross-lesson echoes:**
- **L3.5 burial depth table (line 48):** "48 in. (1,219 mm) minimum; railroad permit may require more" — reference point omitted.
- **L3.5 Key Terms flashcard ("Burial depth — under railroads," line 143):** "Minimum 48 in. (1,219 mm) below top of rail."
- **L3.8 body (line 84):** "ANSI/TIA-758-C §6.3 requires a minimum of 48 inches under the bottom of the railroad ties (or 48 inches below the top of rail as a conservative reference point)."
- **L3.8 Scenario Crossing 2 (line 218):** "60 in. below top of rail (BNSF specification)."

L3.8 correctly explains the standard measures from bottom of ties but clarifies top of rail is a conservative equivalent. L3.5 flashcard simply states "below top of rail" without this nuance — it creates a slightly inaccurate memory anchor. BATCH_B_REDTEAM_B finding B-2 confirms this cross-lesson inconsistency.

**Brief citation:** Batch C brief §6 Style item 4 addresses railroad timelines only; no specific brief guidance on depth reference point. Discovery doc §3.5 sources ANSI/TIA-758-C §6.3 and RUS Bulletin 1751F-635 §3.

**Convention compliance:** RUS-primary framing (brief §3 item 9): if RUS 1751F-635 §3 also uses bottom-of-ties language, that is the authoritative formulation. Fix should adopt the L3.8 formulation ("bottom of railroad ties; top of rail is a conservative reference") as the cross-lesson standard.

**Forward-compatibility:** L3.11 permit matrix content will likely reference railroad crossing depths. No authoring guidance conflict if L3.5 and L3.8 are aligned before L3.11 authoring begins.

**Style/voice:** Flashcard is a definition block — updating one reference point phrase preserves voice perfectly.

**Risk:** LOW. The existing "top of rail" phrasing in L3.5 is conservative and not dangerously wrong. But aligning both lessons on "bottom of ties" removes the learner confusion about measurement reference points.

---

## TF-5 — L3.7 NESC Rule 235G listed in sources but uncited in body

**Cross-lesson echoes:** NESC Rule 235G appears only in the L3.7 frontmatter sources list. NESC Rule 235 governs clearances from buildings and structures; Rule 235G likely addresses communication conductors in/on buildings or structures. The L3.7 body covers: riser conduit height (Rule 354), drip loop, weatherhead, ground bond (Rule 352), guy wire (Rule 261), continuous cable vs. splice. None of these explicitly cite Rule 235G.

**Brief citation:** DISCOVERY doc §3.7 sources list: "NESC C2-2023, Rules 235G, 352, 354." The brief specified 235G as a source for this lesson. BATCH_B_REDTEAM_A finding #13 and REDTEAM_B both flag this as an unused citation.

**Convention compliance:** Lesson frontmatter sources list should only contain standards actually cited in the body. Listing an uncited rule is either: (a) an oversight where 235G was intended to be cited for something in the riser assembly (most likely the riser conduit height or structure attachment context), or (b) a leftover from the brief that wasn't incorporated. The Q-structure convention and citation format convention don't address source-header accuracy directly, but "do not cite standards not used in the body" is an authoring discipline consistent with the RUS-primary framing.

**Possible intended use:** NESC Rule 235G may govern communication conductors attached to or passing through structures — potentially relevant to the riser conduit's attachment to the pole structure. If 235G is the governing rule for conduit-to-structure clearance, one citation should appear in the riser conduit section.

**Fix options:** (a) Add one inline citation to 235G in the appropriate body location (riser conduit attachment to pole face, or conduit height from structure); (b) Remove 235G from the frontmatter sources if no body citation can be justified. Fix agent must confirm which is appropriate. Do not leave the citation in sources-only limbo.

**Forward-compatibility:** No Batch C lesson inherits this rule citation. L3.9 cross-references L3.7 for drip loop — no Rule 235G dependency.

**Style/voice:** Either fix option is transparent to voice.

**Risk:** LOW. Unused source citation is a publishing quality issue, not a factual error. No wrong answer depends on it.

---

## TF-6 — L3.4 Q2 Option C: "9.5 ≈ 9.2" doesn't compute

**Cross-lesson echoes:** The L3.4 scenario (span-length decision from sag-tension table) establishes S_max = 9.5 ft and finds that 350-ft span (final sag 9.4 ft) is the compliant maximum. Q2 Option C's claim "9.5 ≈ 9.2" appears in the distractor set. BATCH_A_CANONICAL item #1 (HIGH) already addresses Q2 Q2 as part of the option-set reconstruction; however, TF-6 is a distinct claim within the option set. The L3.4 scenario text and body are consistent in establishing 9.5 ft as the critical S_max value. No other lesson reproduces the 9.5/9.4/9.2 figures.

**Brief citation:** Batch C brief §6 item 2 ("Math verification before committing") and §1 item 4 ("Q-structure fidelity") — distractors must be wrong for demonstrably wrong reasons. A distractor that claims a non-equivalence (9.5 ≈ 9.2) that doesn't hold even as a rounding statement introduces a factually broken distractor, which undermines learner trust in the option set.

**Convention compliance:** Q-structure convention: each distractor rationale must state "A — Incorrect. [reason]." A distractor whose claimed numeric relationship is simply false (9.5 does not approximately equal 9.2 by any standard rounding) fails the "wrong for demonstrably wrong reasons" standard.

**Forward-compatibility:** No Batch C lesson reproduces this Q or these values.

**Style/voice:** Distractor text correction only. No structural change.

**Risk:** LOW in isolation. Linked to the A1+A2+A4 canonical cluster fix — fix agent handling TF-6 must coordinate with the broader Q2 option-set reconstruction to avoid re-introducing inconsistencies.

---

## TF-7 — L3.4 Q2 Option D: two derivation paths, only one yields 12.3 ft

**Cross-lesson echoes:** The 12.3 ft figure appears in the L3.4 scenario sag table (400-ft span final sag = 12.3 ft) and in L3.4 Q2 Option D. BATCH_A_CANONICAL item #1 (HIGH) addresses the Q2 option-set as a cluster. The concern here is that Option D's rationale may claim to arrive at 12.3 ft through the parabolic formula directly, when in fact 12.3 ft comes from the manufacturer table for 400-ft span — two different derivation paths that happen to yield the same number. If the rationale conflates the table-lookup result with a formula result, learners will form an incorrect mental model of when to use the formula vs. the table.

**Cross-lesson check:** L3.3 worked example uses the midspan clearance formula; L3.4 body explicitly explains the formula is a "starting point" and manufacturer tables provide final sag. The lesson's own pedagogy requires distinguishing formula-derived values from table-derived values. A distractor rationale that blurs this distinction contradicts the lesson's own body content.

**Brief citation:** Batch C brief §6 item 2 — derive numeric answers independently before writing options. If two paths yield 12.3 ft, the fix should clarify which path is correct in the distractor's rationale (the table, not the formula with the given inputs) and make the distractor wrong for the right reason.

**Forward-compatibility:** No Batch C lesson inherits the specific 12.3 ft figure. L3.9 references sag conceptually for splice point placement — no numeric dependency.

**Style/voice:** Rationale block correction only.

**Risk:** LOW. The learner impact is a subtle conceptual confusion about formula vs. table lookup, not a wrong final answer propagating downstream.

---

## Scope Expansion Candidates

These items go beyond the cited TF-1 through TF-7 but emerge directly from cross-lesson analysis. Fix agent should address unless explicitly deferred.

**SE-1 — L3.5 burial depth table reference point (railroad row):** The table at line 48 says "48 in. (1,219 mm) minimum; railroad permit may require more" without specifying the measurement datum (top of rail vs. bottom of ties). The L3.8 body establishes the correct datum. Aligning the L3.5 table to match ("48 in. below bottom of railroad ties; railroad permit may require more") closes the cross-lesson inconsistency flagged in TF-4 and by REDTEAM_B finding B-2. This is distinct from TF-4 (which targets the flashcard) — both the table row and the flashcard need the fix.

**SE-2 — L3.1 fatal-flaw table row B7 (already Batch A fixed, verify not regressed):** Batch A B7 fix updated L3.1 line 97 to "90–180 days (short-line); 6–12 months (Class I)." The current file at `/tmp/osp-prep-b/content/osp-survey-route/01-pre-survey-desk-research.md` line 97 shows the corrected value is present. No re-fix needed — but fix agent should confirm the B7 fix was applied during post-push verification since the TF-1 fix modifies a neighboring lesson.

**SE-3 — Batch C authoring note (non-code, documentation):** The fix agent should add a brief comment to `audit-output/wave-osp-topic3/BATCH_C_BRIEF.md` or an equivalent note confirming that TF-1 (L3.8 intro) has been corrected, so the Batch C author has confidence that L3.8 body is the authoritative railroad-timeline source. This prevents the Batch C author from hedging L3.11 against an intro phrase that no longer exists. (This is a doc-only update, not a lesson-content change.)

---

=== T3 TRAILER FIX SPEC B END ===
