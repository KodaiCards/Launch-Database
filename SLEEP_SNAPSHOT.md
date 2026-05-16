# SLEEP MODE SNAPSHOT

> Compact bridge file for the next Claude after compaction. Read this FIRST, then HANDOFF.md, then CLAUDE.md.
> Append-only. Latest entry at TOP.

---

## 2026-05-16 night — Carter entered sleep mode; orchestrator continuing the queue

### What's in flight right now
- T18 R-7 (field-crew worker perspective audit) — dispatched, waiting on result

### What's next (sequential, single-agent default)
1. T18 R-7 lands → consolidate T18 finding pool
2. T05 polish-3 micro-patch (1-line fix: T07/L02 `existing utilities → ` correct source_lesson_id; flagged during T05 polish-2 neighborhood scan)
3. T05 final-verify-2 RT-C (pedagogy, single agent)
4. T05 final-verify-2 RT-D (technical, sequential after RT-C)
5. If RT pair clean → T05 truly closes
6. T18 build fix-agent against full canonical (currently 26+ items + whatever R-7 adds)
7. T18 verify 2-RT pair → polish → final-verify 2-RT pair
8. Back-fill sweep: T01 + T04 + T19 retroactive checks under new rules (T04 has §32.2210 deferred CFR conflict needing Haiku eCFR ground-truth lookup)
9. T06 retroactive audit pipeline (full)
10. T07 + T08 retroactive (already audited under OLD pipeline; need re-audit under new rules — cross-topic DAG fixes touched their files)
11. Forward authoring T09 → T10-T17 → T20-T22 (T19 already done)
12. Cert prep tracks (OSP Designer + FOA CFOS/CFOT — RCDD migrated to future ISP)
13. Moodle teardown (OSP-RW.6)
14. E2E QA + production cut (OSP-RW.7)
15. Launch-DB queue Phases 1-11 + future builds (per directive 21 no-stop)

### Rules locked this session (read CLAUDE.md §3 for full text)
- Empirical saturation rule (no severity gate — ANY new finding triggers next round; saturate when next agent finds nothing new or only rediscoveries)
- 2-RT pair default for all post-fix waves (no pure-patch carveout — empirically proven this session, single-RT was a false economy)
- 5-role agent roster: research/audit, build fix-agent, verify RT pair, polish agent (NEW formal role, fresh eyes), final-verify RT pair
- Wave completion discipline: build → verify → polish → final-verify → move up (polish is in-wave, NOT a deferred queue)
- Default = 1 agent sequential; 10% discretion for significant-benefit parallelism only; sleep mode allows up to 2 agents
- Conflict-resolution rule: 2 agents disagree → mandatory tiebreaker (Haiku ground-truth for citation/fact; Sonnet different-framing for interpretation) BEFORE fix-agent
- Cross-topic DAG sweep mandatory in every retroactive audit
- Domain-physics framing required for safety RT
- Fix-agent prompts: "scan ±20 lines for same-pattern bugs in neighborhood after fix"
- Math re-derivation in fix-agent closeout (strongest verification tool)
- Polish Queue parking lot KILLED — errors of any severity fixed in-wave, never deferred

### Topics complete (retroactive)
- T01: audit + fix + verify clean (commits ending ~669114b)
- T04: audit + fix landed but §32.2210 CFR conflict UNRESOLVED → needs Haiku ground-truth before truly closed
- T19: full audit + fix + polish + RT pair clean
- T05: build + verify + polish-1 + polish-2 done; polish-3 pending (1 line) + final-verify RT pair pending

### Token burn this session (rough)
- T05 retroactive: ~1.9M cumulative
- T18 retroactive (audit phase only): ~750K through R-6
- T19 retroactive: ~600K total
- T01 + T04: smaller (~400-500K each)
- Total orchestrator session: ~5-6M+ (large session, includes multiple cap resets)

### What to NOT do
- Don't shortcut RT pair to single RT (empirically caught 4 NEW bugs on T05 in 2-RT vs 1-RT comparison)
- Don't defer LOWs to "next pass" / "polish queue" — fix in-wave
- Don't accept agent's "saturated" claim if it found new finds — apply rule mechanically
- Don't run >2 agents simultaneously in sleep mode (Carter's lock)
- Don't impersonate orchestrator in agent prompts; don't roleplay; don't fabricate
- Don't edit CLAUDE.md and forget to commit — background agents' `git fetch && git merge` can wipe uncommitted orchestrator edits (learned this twice this session)

### Carter's wake-up reference
When Carter checks back, this snapshot + git log --oneline = full picture. Commit messages have queue state encoded ("T05 closed: ..." etc).

---

(Earlier snapshots, if any, below this line — never overwrite past entries)
