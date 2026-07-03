# System Review — 2026-07-01 (Fable pass)

> Requested by Carter after several compactions degraded the Planning role ("strayed from the path"). Scope: the whole operating system — docs, plans, processes, agent behavior, usage efficiency, product ideas. Reviewer: a fresh Fable instance grounded in the full doc set (PLANNING/ROLES/decisions/open_items/ideas/INVENTORY/BUSINESS/TRAINING_PLAN/CEO/AUDITOR/threads/HANDOFF/CLAUDE.md, `codebase/00-SYNTHESIS`, `codebase/USER_TEST`, `docs/audit/assignment-1`). Code state taken from the Auditor's independently-verified baseline + Planning's 23-screen live user test, per Carter's direction — not re-crawled.

## Verdict

**The system is fundamentally sound — unusually well-built for a solo founder — and the drift Carter felt is a structural boot/compaction-pipeline problem, not a broken process or a dumb model.** The evidence that the machine works: the Auditor's full independent baseline found **zero** "claimed-done-but-isn't" across the entire platform; the R18 incident produced a durable content gate; the O34 leak was caught by Planning's own user test and the "routed ≠ done" failure was caught and institutionalized; the decision log carries reasoning + alternatives so nothing gets relitigated. Most funded engineering orgs don't have this discipline.

What broke is narrower: **the behavioral layer of the Planning role (proactivity, pushback, idea generation, whole-picture synthesis) lives disproportionately in the live conversation, and that is exactly what compaction destroys.** Everything below is either (a) making that layer survive session boundaries, or (b) trimming cost.

---

## 1. Root cause of the drift (the mechanism, precisely)

Planning's calibration lives in three places with different survival properties:

| Where | Survives compaction? | Problem |
|---|---|---|
| The live conversation | ❌ lost | Where the *feel* of the role actually lives — tone, proactivity, the banked whole-picture |
| Memory files (`~/.claude/.../memory/`) | ✅ | ~50 entries now; overlapping feedback rules read as a list of past scoldings, not one identity; loaded as an index, read selectively under pressure |
| `planning/` docs | ✅ | The boot read is now **>100k tokens** (PLANNING → ROLES → BUSINESS → decisions(18) → INVENTORY → TRAINING_PLAN → CEO.md → threads/ceo.md(~25k) → open_items → ideas → codebase). Under context pressure a rebooted session *skims* — and the behavioral core is buried mid-doc under a 6-entry dated journal |

Compaction compounds this: the summary is written mid-thought at an arbitrary point, is task-focused (preserves "what was I doing" far better than "how do I behave"), and each cycle re-derives the role from a lossier base. Several compactions in a row = the drift Carter observed. **Model quality doesn't exempt the pipeline — this would degrade any model, including this one.**

Secondary rot found (evidence the maintenance load exceeded the habit):
- **`INVENTORY.md` — stale since 06-28.** Still says CI is billing-locked and "Railway startCommand skips auto-migrate" (corrected 06-29: migrations DO auto-run); missing WP-A/C/D, the assessment engine, O34–O41 outcomes. Its own header admits statuses aren't verified — but the Auditor has since verified them; the doc never absorbed it.
- **`HANDOFF.md` — stale since 06-27 and now actively misleading.** Describes the retired pre-Planning governance (CEO as top router, C2/C3/C6 worker roster, "audit in progress", CI dead, the wrong migration gotcha). `CLAUDE.md` sends every new head instance there FIRST.
- **`CLAUDE.md` — contradicts the live governance.** "How we work" says the CEO owns directives/merges and never mentions `planning/` or the Planning layer at all. The repo's front door describes the old org chart.
- **`commitments.md` — stale** (deep-dive still "IN PROGRESS"; it completed into BUSINESS.md on 06-28). Overlaps open_items' "re-raise when" semantics — two registries doing one job.
- **`planning/threads/ceo.md` — 415 lines / ~25k tokens**, read by every booting CEO and Planning session. Adjudicated history nobody needs live.

None of these are negligence — decisions.md and open_items.md were kept razor-sharp. It's that the doc set grew past what one role can maintain ad-hoc, and there was no *rule* forcing state docs current at merge time.

## 2. What is genuinely strong (do not churn)

1. **The decision log style** (decision · reasoning · alternatives, append-only, supersede-don't-overwrite) — directly kills relitigating and whiplash.
2. **open_items with re-raise triggers** — the "nothing gets dropped" machine works; the O-series survived compactions fine.
3. **The codebase map + live user test + independent Auditor triangle** — plan vs code vs claim reconciled three ways; this is why the baseline audit found nothing false.
4. **The content gate** (research-log + independent red-team, author≠RT, Carter green-lights flips) — right answer to R18, structurally enforced (fill-in-blank ban thrown at the pool loader).
5. **The git-thread comms + branch-scoped workers + Planning curation** — proven in-session; harness-level isolation beats trust.
6. **Design-first handshake with the CEO** (propose schema/endpoints → Planning rules → build) — the WP-A and assessment-engine exchanges are the exemplar; both produced correct builds with zero rework.
7. **The cost rules born from real incidents** (≤2–3 agent cap, no mass-spawn, verify-before-next-wave).
8. **Carter's multi-account instance model** — spreads usage, enforces write-isolation at the harness level.

## 3. Fix list (ranked; effort noted)

**F1 — Planned handoffs instead of riding compactions (free; process change).**
A deliberate handoff at a clean boundary — bank state to PLANNING.md → Carter starts a fresh session with the standard boot prompt — beats a mid-thought compaction every time: the docs were written by a well-calibrated Planning; the compaction summary is written under pressure by whatever remains. Norm: when a Planning session gets long (Carter sees context % in the UI; Planning self-reports at natural pauses), Carter says "hand off" → fresh boot. PLANNING.md's current line "prefer staying in-session [over a fresh boot]" is half-right; the true preference order is **stay-in-session (short) > planned handoff > compaction**. Update it.

**F2 — Rewrite PLANNING.md's top into a ~10-line OPERATING COVENANT (1 short session).**
Distill the ~10 overlapping feedback memories into one identity block at the very top (communicate fully with Carter / build to the vision not the words / drive priorities + recommend at every task-swap / never sit on ideas / synthesize the whole picture / bank everything before replying / verify user-facing / cost-to-Carter lens / push back / workers-chat-short-but-not-me). Long docs get skimmed; the top 20 lines get read. Individual memories become the archive behind it.

**F3 — Post-compaction/boot RECALIBRATION RECEIPT (free; ritual).**
First act after ANY compaction or fresh boot: re-read PLANNING.md top + MEMORY.md, then post Carter ~5 lines — standing duties (one-liners), current mission, in-flight work, next recommendation. Carter spots drift in 10 seconds instead of three tasks later. Make it a standing rule in PLANNING.md.

**F4 — Archive pass on the boot set (1 session; pays back every session forever).**
- `threads/*.md` → keep the live tail (~last 5 entries), move adjudicated history to `planning/threads/archive/`.
- `open_items.md` → move CLOSED/DONE rows to an archive section/file; keep the open table lean.
- PLANNING.md CURRENT STATE → ONE current entry + `planning/archive/` for the journal.
- Merge `commitments.md` into `open_items.md` (one re-raise registry; delete the file).
- MEMORY.md → trim to behavioral essentials + pointers; the repo is the mirror of record (PLANNING.md already says so).

**F5 — Doc-update-at-merge as a HARD exit criterion (free; rule).**
A merge isn't done until INVENTORY.md (status) + the touched `codebase/NN` chunk + open_items are updated in the same commit. This is the standing fix for INVENTORY rot — and it's Carter's literal ask ("keep the architecture in their notes so they can plan features before dispatching").

**F6 — Fix the repo front door (30 min).**
- CLAUDE.md: replace the stale "How we work" with the real chain (Carter > Planning > CEO > builders/Auditor) + point at `planning/ROLES.md`; fix the migration note.
- HANDOFF.md: retire to a short tombstone pointing at `planning/` (keep §7 gotchas + §9 relationship notes by moving anything still-true into planning docs). A misleading first-read doc is worse than none.

**F7 — `planning/BOOT_PROMPTS.md` (30 min).**
The exact first-message text for each role (Planning resume / fresh Planning / CEO boot / Auditor boot / post-compaction recalibrate). Variance in the first message = variance in behavior; Carter pastes instead of retyping.

## 4. Getting the Opus agents to behave better

What the thread evidence shows: the workers behave excellently when given (a) a short imperative charter, (b) a concrete mission with acceptance criteria, (c) the design-first handshake, (d) demanded verification evidence. WP-A and the assessment engine are proof. The failures were lifecycle, not intelligence:

- **Session death with uncommitted work (twice).** Already fixed by rule (commit incrementally) — keep enforcing. Add: post a thread entry BEFORE starting any long verify, so intent is on the wire when a session dies.
- **Don't "recover" stalled workers by redoing their verification.** That duplicated the CEO's work in Planning's expensive context, twice. The branch + thread carry the state — that's what they're for. Restart a fresh worker session on the branch instead; Planning reviews once, at the end.
- **Fresh sessions per mission > long-lived worker sessions.** Compaction degrades the CEO the same way it degrades Planning. Mission boundaries are natural restart points; the boot cost is bounded if F4 trims the boot set.
- **Keep charters checklist-first.** CEO.md/AUDITOR.md are good; keep the 6 hard rules at the very top of any future charter edits.
- **Keep the acceptance-criteria pattern** from WP-A ("USER-FACING acceptance tests: a fresh signup sees ONLY...") in every mission brief. It is the single strongest behavior lever observed in the whole thread.

## 5. Usage efficiency (ranked by expected savings)

1. **F4 boot-set trim** — every future session of every role pays less; the single biggest structural saving.
2. **F1 planned handoffs** — avoids paying to compact a bloated context AND the quality tax of the lossy summary.
3. **No-recovery rule (above)** — the two recovery episodes were the most expensive avoidable work in the record.
4. **Model tiering refresh (D011 is a Claude-4-era table).** Claude 5 family exists now: **trial the Auditor on Sonnet 5/High** for the next per-WP audit — its task (systematic code-vs-spec verification) is well within Sonnet 5, at a fraction of Opus cost; keep Opus for Planning (judgment) + CEO (architecture); builders → Sonnet 5 / Haiku 4.5. If the Sonnet-5 audit's quality matches the Opus baseline (it will be checked against a known-good prior), lock it in as D019.
5. **Audit scope discipline** — the full-platform baseline was worth it ONCE (it bought confidence + O41/O16/O18 sharpening); don't repeat it periodically. Per-work-package + content audits only, on dispatch. (Already the plan — recording it as a rule so a future Planning doesn't "be thorough" into a re-baseline.)
6. **Watcher cadence** — 120s polling is tighter than the work needs (CEO increments take hours). 5–10 min intervals cut wake-churn; Planning's wakes are cheap only if its own conversation stays lean (adjudicate short; docs carry detail — D018 already says this).
7. **Re-check GitHub Actions billing** — if CI is unlocked, every push gets free verification again and agents stop re-running suites. One-line question to Carter; INVENTORY still claims it's dead.
8. **Planning on Opus/Max stays justified** (it's the judgment layer) — but with F1–F4 in place, most sessions won't need Max-depth grounding re-reads, which is where Max actually costs.

## 6. Product plan + ideas — feedback and additions

**The sequence is right and I would not reorder it:** training launch-set (engine → gated content T18→T02→T03→T04→T09) → I3 billing tracker → keystone cutover (hours O23/O22/O24 → billing+RUS-PDF O20/O16 → config-UI O30 → portals O25) → map integration when the external artifact lands. Two pressure-points to keep hot:

- **I9 (RUS daily field paperwork) has a shelf-life nobody is watching.** RUS likely ends ~end-2026; build+adopt takes 1–2 months; the tool is valuable exactly when construction resumes with the next CC. **Tie the decision to the CC-approval event** (new commitment trigger: "next CC approved → decide I9 immediately, build-or-consciously-skip"). Parked-indefinitely is a silent no.
- **Interleave the cutover behind the content cadence.** Once the engine + T18 ship, content authoring is a gated, largely-parallel content track; the CEO has architecture capacity for the first cutover domino (hours unification) alongside it. Don't serialize the whole launch-set before touching the cutover — that's ~weeks of durable-win delay for no dependency reason.

**Idea-specific:**
- **I13 county lines:** the tool answer is **US Census TIGER/Line county boundaries** (free, public domain, GeoJSON) + point-in-polygon (turf.js) in the existing Leaflet stack → county autofill. County *data model* can land with the keystone county build (D014, reuse `potential_permits.county` per the Auditor); the boundary *layer* waits for the external map (D016). Banked so it isn't re-researched.
- **D015 invoices (custom fields + PDF/Excel):** right call; note the I5 template engine reads legacy-projects data (same O20 problem), so invoice-configurability **rides the billing port**, not before it.
- **O10 staging** — with backups (O11) done, this is the next infra gap; auto-deploy-on-main straight to prod is the remaining "one bad merge reaches the team" risk. Cheap on Railway. Queue behind the launch set, not urgent.
- **New: weekly digest.** A standing 5-line Planning→Carter digest (shipped / in-flight / decisions-needed / risks / spend notes) at a fixed rhythm. He's away for hours-days; a rhythm beats ad-hoc pings and is nearly free.
- **New: citation pre-check in the gate (optional).** Before the human-grade red-team pass, a cheap automated pass fetches each cited source and verifies the claim exists — filters lazy citations so the independent RT spends effort on substance. Marginal cost, likely raises gate throughput; try on T18 and drop if it doesn't pay.

## 7. Standing risks re-raised (unchanged, still open)

- **Rotate the Railway DB credential** that was injected into the Auditor's session transcript (flagged 07-01, not yet done).
- **O40** test-fixture junk cleanup (unblocked by backups; FK-aware, not blind cascade).
- **O8** ~17 stale branches.
- **O4/O5** billing samples + Workforce-CSV answer — needed before System A/D work starts, not before.

## 8. What to do with the Planner (the model question)

Keep **Opus as the daily Planning driver** — the drift was pipeline, not capability, and the fixes above are what actually address it. Use **Fable sparingly and deliberately**: phase-boundary system reviews like this one, post-compaction spot-audits of Planning's own calibration, and genuinely-hard architecture calls. That's the cost-right split: fix the pipeline so the cheaper model holds the role, rather than paying the top tier to compensate for a leaky boot process.

---

*Written 2026-07-01 by the Fable review pass. Fix list F1–F7 pending Carter's picks; execution is Planning-lane work (doc edits + rules), no CEO cycles needed except nothing at all.*
