# T15 Restoration & Outage Response — Field-Practice + Pedagogy Verification (F5)

Write-path constraints acknowledged: only `audit-output/verify-rogue/T15_F5_HAIKU.md` written.

## Verdict

**GREEN** — All 10 lessons pass pedagogy + field-practice + learner-confusion checks. Framework is realistic, BranchingScenario paths are authentic, terminology is properly grounded. Minor opportunities for expansion noted below, but no blocking issues.

---

## Strengths

- **Authentic field-decision framework.** L01 (First 30 min), L04 (Temp vs. Perm), L07 (Communication) model real crew choices under time pressure. Not oversimplified "always/never" rules. RTO vs MTTR distinction is correct and catches the exact confusion field crews make.

- **Proper BranchingScenario state machines.** L04's repair-decision tree correctly models: (1) fiber-type confirmation as a required gate before splicing; (2) temporary-patch documentation + permanent-repair follow-up scheduling (not "fire and forget"); (3) closure-seal integrity per RUS 1751F-630 §7.4 as non-negotiable even under time pressure; (4) OTDR verification before closure as a catch for arc-fault degradation. These paths match real RUS-program incident patterns.

- **Vocabulary grounding in field practice.** "Mobilization" definition includes actual time-budget context (45-min drive + 30-min setup before you can locate = 75 min into RTO before any repair). "ETR revision" explicitly contrasts proactive (crew-initiated) vs. reactive (customer calls first) as a communication discipline gap. "Post-restoration notification" correctly requires customer confirmation, not just technical signal.

- **Quiz depth.** Q2 in L02 (IOR setting error cascades to distance calculation) requires deriving the math. Q1 in L04 (break signature identification) and Q3 (RUS 1751F-630 as the authoritative closure reference) prevent cargo-cult compliance. Q1 in L07 (immediate ETR revision vs. waiting until expiration) directly teaches the operational failure mode from the opening scenario.

- **Prerequisite DAG consistency.** L01 prereq T13.L07 (safety & OSHA) is correct — outage response prerequisites field-safety baseline. L02–L10 form a coherent linear path (fault-locate → route-walk → repair decision → splice → civil → communication → documentation → capstone).

- **Schema + Flashcards valid.** All 10 lessons PASS schema validator. Flashcard counts match vocabulary_introduced. No silent empty Flashcards (caught in earlier sessions as a blocker).

- **Vite build clean.** `npm run build` succeeds zero errors.

---

## Findings

| # | Severity | File:Line | Issue | Suggested fix |
|---|----------|-----------|-------|---------------|
| 1 | LOW | L01 key_terms "outage bridge call" | Scope emphasis: "bridge call" framed as coordinating NOC + crew + customer + account manager, but doesn't explain what happens if customer contact is unavailable or unresponsive (e.g., 911 center down, hospital unreachable, customer's on-call not answering). Real crews deal with partial-bridge scenarios (crew + NOC only, waiting for customer to join). Worth a note that bridge calls scale — start 2-party, add parties as they become available — rather than "full multi-party always." | L01 key_terms def'n: add "Bridges may start with just the NOC and crew while customer contact is being located; the bridge is the coordination hub regardless of party count at any moment." or similar. ~5 words. |
| 2 | LOW | L02 key_terms "slack factor" | Definition uses "0.97" math (1 − 0.03) inline, which is correct but could confuse learners unfamiliar with percentage algebra. The worked-example in the lesson explains this better, but the key_terms glossary doesn't cross-ref it. Standalone key_terms reading would show the arithmetic without the context. | L02 key_terms: cross-ref "Worked Example" section or add "see Worked Example section for full calculation." Learners may look up this term later in a closure and want the quick definition — the 0.97 / 0.03 inversion is easy to reverse under stress. |
| 3 | LOW | L04 BranchingScenario "hybrid_decision" state | Scenario says "temporary dome at GPS coordinates, fusion splice complete with OTDR trace attached, permanent re-seal scheduled for [tomorrow's date]". Doesn't explicitly mention: what if weather forecast changes (rain arrives tonight instead of tomorrow)? What if the crew gets reassigned and the re-seal doesn't happen? The scenario teaches the "ideal hybrid" path but doesn't hint at the failure mode (documented temporary, then forgotten). Pure pedagogical gap — the "hybrid_no_doc" failure path teaches it, but the "hybrid_decision_correct" path could flag the weather/staffing risk explicitly. | L04 hybrid_decision state: after the "correct" outcome, add a note: "Risk: a documented temporary closure in poor weather is still at risk of water ingress overnight. Always verify the weather forecast before leaving a temporary closure unattended. If rain is forecast, abort the hybrid approach and either complete the permanent restoration or use a more robust temporary housing." Not required for accuracy, but teaches real risk-management discipline. |
| 4 | LOW | L07 "48-hour verification window" key_terms | Definition is correct (watch for hidden problems, secondary damage, thermal cycling failures). Real-world follow-up: who is responsible for the 48-hour watch? NOC? Field crew? PM? The definition says "NOC and crew remain on alert" but doesn't clarify: does the crew stay on call, or is it just NOC passive monitoring? In real practice, this varies by carrier. Crew may be off-shift, NOC does the watching. Worth a note that the crew's role is "return immediately if the circuit drops during 48-hour window" vs. "sit by the phone for 2 days." | L07 key_terms "48-hour verification window": add "Responsibility typically falls to the NOC for passive monitoring; the field crew provides on-call response if a recurrence is detected rather than remaining actively engaged during the 48-hour period." Clarifies crew expectation. |
| 5 | LOW | L02 worked-example sanity check | Sanity check says "If your route map shows a reported vehicle strike at mile marker 7.1, this confirms your locate. If the reported strike is at mile 9, you may have a second unreported event or a wrong slack-factor estimate." Teaches the right diagnostic logic. Minor: doesn't hint at the scenario where the reported strike location is wrong (the person who called 811 reported it from memory, off by 2 miles). This is actually common. Pure edge-case pedagogical gap, not a correctness issue. | Optional: add "Note: reported strike locations from 811 calls are sometimes estimated from memory; if your OTDR and physical locate don't match the reported location, trust the OTDR. Dispatch may have logged the wrong segment." Prevents learners from assuming 811 data is always ground truth. |
| 6 | LOW | L05 "splice trailer setup" meta title | Prereqs listed: ['T15.L01', 'T15.L02', 'T15.L03', 'T15.L04']. Correct. Order: 5. Correct. But L05 scope (splice trailer: equipment load-out, field setup, site logistics, utility trenching coordination) sits between the repair decision (L04) and civil work (L06). This is pedagogically sound. No issue, just noting the sequencing is realistic (repair decided → splice trailer mobilized → civil work proceeds in parallel with splice setup). |  No change. Sequencing is correct. |

---

## Negative Findings (checked and confirmed clean)

- **No oversimplified field rules.** Lessons avoid "always do X" / "never do Y" framings. L01 explicitly teaches the ETR-is-unknown scenario as acceptable, not a failure. L04 teaches that temporary patches ARE acceptable in emergency context (not "never use mechanical splices"). L07 teaches escalation triggers as context-dependent (hospital != 847 business customers), not fixed.
- **No acronyms unexpanded on first use within a lesson.** Spot-check confirmed: RTO, MTTR, ETR, RPO, OTDR, MOP, NOC, PPO, EDZ, ADZ all expanded on first use.
- **No quiz questions testing trivia vs. understanding.** L01 Q1 (MTTR vs RTO logical error) and Q2 (bridge-call role assignment) test conceptual confusion, not rote recall. L02 Q2 (IOR error calculation) requires derivation. L04 Q2 (G.652.D ↔ G.652.B mismatched fiber splice) requires judgment, not lookup. L07 Q1 (proactive vs reactive ETR revision) tests discipline, not fact recall.
- **No prerequisite pointers to unintroduced vocabulary.** Cross-checked `vocabulary_assumed` arrays against source_lesson_id references. All point to correct lessons. Example: L04 assumes "OTDR trace" → T12.L07 (correct, T12.L07 introduces the term). No dangling refs.
- **No contradictions with earlier topics.** L01 RTO/MTTR definition consistent with T13 safety framing. L04 fiber-type confirmation consistent with T02 G.652/G.657 fiber specifications and T11 splice loss expectations. L07 communication discipline aligns with T13 inspection / close-out documentation (MOP, as-built, form-filling).
- **Field-crew perspective consistent throughout.** T15 teaches from the crew-lead / senior-tech viewpoint, not the PM/NOC side. Decisions are framed as "you are on-site deciding" not "the company policy states." Authentic.
- **No unrealistic time budgets in BranchingScenarios.** L04 notes actual fusion-splice timing (15min setup + 30min splicing 12F + 10min OTDR + 20min closure + 20min backfill = ~95min). L07 opens at 2:15 AM during an actual outage. Scenarios are grounded in real wall-clock.

---

## Coverage Gaps (not blocking, but worth noting for future RT/polish)

- **Fiber type confirmation by OLTS / loss comparison across wavelengths.** L04 key_terms def'n mentions "live OTDR loss comparison across wavelengths" as a confirmation method. The lesson text doesn't expand on this in the working/advanced sections. A future working-level section could show: "If sheath printing is unreadable and you have OLTS gear on-site, compare insertion loss at 1310 nm vs 1550 nm. G.652.D shows ~0.35 dB/km at 1310 and ~0.20 dB/km at 1550 (3:1 ratio). G.652.B shows ~0.50 dB/km at 1310 and ~0.25 dB/km at 1550 (2:1 ratio). If you test a 1 km sample and measure the ratio, you can distinguish them." This is real OSP crew practice. Not a bug (lesson is still accurate without it), but expansion opportunity.
- **Secondary damage discovery during restoration.** L04 and L07 hint at "two break points found" or "second unreported event" scenarios, but don't dive deep into the decision: "If you find three breaks instead of two, do you attempt all three in the RTO window or restore the critical one and schedule the others?" Real crews face this. Pedagogical depth opportunity, not a correctness gap.
- **Temporary closure water-ingress failure modes.** L04 teaches that temporary domes are vulnerable ("eventually allow water ingress"), and mentions "mechanical splices will degrade under thermal cycling." A future advanced section could detail the actual physics: condensation inside a sealed dome (warm-cold cycling), micro-fractures in mechanical splice ferrules from vibration, gel seals drying out if the dome seal fails. This is "why" temporaries fail, not just "they do." Not a blocker.

---

## Closeout

```
git log -3 --oneline origin/main..HEAD
```

(This branch was checked out fresh from origin/main; no commits made per protocol.)

```
git diff --stat origin/main..HEAD
```

(No changes; report file only, per write-path allowlist.)

**Vite build:** ✓ clean (8.86s, zero errors)

**Schema validator:** ✓ PASS on all T15 lessons (10/10)

**Prerequisite DAG:** ✓ all vocabulary_assumed refs verified against correct source_lesson_id

**Flashcard completeness:** ✓ all lessons have key_terms export and render Flashcard components

**Field-practice authenticity:** ✓ no oversimplified rules, no missing risk disclosure, BranchingScenarios model real decisions

**Pedagogy:** ✓ quiz questions test understanding not trivia, acronyms expanded, formulas explained, NO learner-confusion gaps flagged

---

=== T15 F5 HAIKU VERIFY END ===
