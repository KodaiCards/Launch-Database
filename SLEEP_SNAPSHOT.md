# SLEEP MODE SNAPSHOT

> Compact bridge file for the next Claude after compaction. Read this FIRST, then HANDOFF.md, then CLAUDE.md.
> Append-only. Latest entry at TOP.

---

## 2026-05-16 03:32 ET — Carter activated 2-hour throttle mode (intermittent small work)

### Pickup point (where to resume in 2 hours)

**T18 verify-2 result: YELLOW** — both RT-G (`3dbdd18`) and RT-H (`397f54b`) independently confirmed:
- **NEW-G1 MED:** ANSI Z359.4 citation in L04 at 3 locations has WRONG TITLE. Polish-2 fix-agent incorrectly replaced Z359.1 with Z359.4, but Z359.4 = "Assisted-Rescue and Self-Rescue Systems," NOT the "Use/Inspection/Maintenance" content described. Correct standard for the described content: **Z359.2** ("Minimum Requirements for a Comprehensive Managed Fall Protection Program") OR simplify to Z359.1 + Z359.11.
- **NEW-G2 LOW:** CO IDLH 1,200 ppm wording in L03 action column creates competing exit signal vs column 4's 25 ppm exit threshold. Non-blocking but per Carter's "fix everything" rule still needs polish.

### Next sequential dispatches (resume after 2h)

1. **T18 polish-3 fix-agent** — fix Z359.4 → Z359.2 (or Z359.1+Z359.11) at 3 locations in L04 + soften CO IDLH wording per NEW-G2. PROMPT MUST require fix-agent to verify the chosen citation against primary source before applying (counter-pattern to polish-2's introduced error).
2. **T18 final-verify-3 RT pair (RT-I + RT-J)** — sequential, on polish-3 state
3. If RT pair returns clean → **T18 truly closes**
4. Then T05 polish-3 (1-line fix for T07/L02 `existing utilities` source_lesson_id) + T05 final-verify-2 RT pair → T05 closes
5. **Back-fill sweep:** T01/T04/T19 retroactive — especially T04's §32.2210 deferred CFR conflict needs Haiku eCFR ground-truth (logged in CLAUDE.md)
6. T06 retroactive audit pipeline (full)
7. T07 + T08 re-audit under new pipeline (originally audited under old rules; touched by T05's cross-topic DAG fixes)
8. Forward authoring T09 → T10-T17 → T20-T22 (T19 done)
9. Cert prep tracks (OSP Designer + FOA CFOS/CFOT — RCDD migrated to future ISP)
10. Moodle teardown (OSP-RW.6)
11. E2E QA + production cut (OSP-RW.7)
12. Launch-DB queue Phases 1-11 + future builds (per directive 21)

### Timer status

2-hour Bash background timer started at 03:32 ET (07:32 UTC). Wake target: 2026-05-16 05:32 ET (09:32 UTC). Timer notification will arrive via Bash completion notification.

### Throttle mode rules (this 2-hour window)

- **30-50% utilization max.** Not continuous agent dispatches.
- **Small cheap work only:** doc maintenance, polish-queue audit, lesson logging, file cleanup, audit-report pattern review. NO new agent dispatches unless extremely small/cheap and high-value.
- **If nothing in scope → do nothing.** Silence is acceptable.
- **Sleep mode still active:** chat extremely minimal, files only for lessons/plans/improvements.
- **Resume full pipeline after timer fires** at ~05:32 ET.

### Rules locked this session (read CLAUDE.md §3 for full text)

- Empirical saturation rule (no severity gate — ANY new finding triggers next round; saturate when next agent finds nothing new or only rediscoveries)
- 2-RT pair default for all post-fix waves (no carveout — caught the Z359.4 polish-introduced bug)
- 5-role agent roster: research/audit, build fix-agent, verify RT pair, polish agent, final-verify RT pair
- Wave completion discipline: build → verify → polish → final-verify → move up (polish is in-wave)
- Default = 1 agent sequential; 10% discretion for significant-benefit parallelism only; sleep mode allows up to 2 agents
- Conflict-resolution rule: 2 agents disagree → mandatory tiebreaker (Haiku for citation/fact; Sonnet different-framing for interpretation) BEFORE fix-agent
- Cross-topic DAG sweep mandatory in every retroactive audit
- Domain-physics framing required for safety RT
- Fix-agent prompts: "scan ±20 lines for same-pattern bugs in neighborhood after fix"
- **NEW (from polish-2 Z359.4 bug):** fix-agent prompts that include citation corrections must verify the new citation against primary source in closeout
- Math re-derivation in fix-agent closeout (strongest verification tool)
- Polish Queue parking lot KILLED — errors of any severity fixed in-wave, never deferred
- STRICT WRITE-PATH ALLOWLIST in every audit/RT/fix prompt (after T18 R-7 rogue scope violation)
- Token-budget cap (200K) in every audit/RT/fix prompt to prevent mission-creep
- Audit/RT agents banned from creating *_CANONICAL.md (orchestrator work)

### Topics complete (retroactive)

- T01: audit + fix + verify clean
- T04: audit + fix landed but §32.2210 CFR conflict UNRESOLVED → needs Haiku eCFR ground-truth
- T19: full audit + fix + polish + RT pair clean
- T05: build + verify + 2 polish stages + 2 RT pair rounds done; polish-3 (1 line) + final-verify pair PENDING
- T18: 7-round audit + build (rogue) + verify pair + Haiku conflict res + polish + final-verify pair + polish-2 + final-verify-2 pair done; **polish-3 + final-verify-3 pair PENDING (Z359.4 citation regression)**

### Token burn snapshot (this session, ~9 hours in)

- T18 retroactive: ~3.6M Sonnet (most expensive — 11 verification passes triggered by 4 HIGH safety bugs + saturation rule)
- T05 retroactive: ~1.7M Sonnet
- T19 + T04 + T01 retroactive: ~1.5M combined
- Orchestrator (Opus) overhead: ~3-5M estimated
- **Total session: ~10-12M tokens** (large session with multiple cap resets + Carter sleeping)

### What to NOT do during throttle window

- Don't dispatch agents back-to-back continuously
- Don't dispatch agents for non-urgent work
- Don't break silence in chat unless true anomaly
- Don't violate write-path allowlists / sleep mode rules

---

(Earlier snapshots, if any, below this line — never overwrite past entries)
