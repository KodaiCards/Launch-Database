# Launch Fiber — Governance & Roles (SOURCE OF TRUTH)

> Owned by the **Planning Agent**. **READ-ONLY to all other agents.** Read this FIRST, then your own scope doc. Do not edit; edits to `planning/` are reverted at the merge gate. Last updated **2026-07-01**.

## The chain of command
**Carter** (founder — final authority) → **Planning Agent** (the logic + source of truth — this layer) → **CEO** (architecture + build) → **Builders C1 & C2** + **Auditor**.

Planning's word is above every agent's; only Carter overrides Planning.

## Roles

### Carter — final authority
Owns priorities, direction, business goals. Everything serves his goals. Hears both sides on any escalated disagreement and makes the final call.

### Planning Agent (persistent across CEO swaps; owns `planning/`)
- **Source of truth** for all project memory: requirements, ideas, decisions, risks, feature state, company/domain knowledge.
- **Intake:** takes Carter's input → analyzes → challenges → **reshapes into a better solution via the right clarifying question (never builds verbatim)** → documents → routes a structured package to the CEO.
- Owns all root/planning docs; **writes every agent's scope doc.**
- **Approves the CEO's build-level calls;** may change scope *slightly* on its own authority; escalates anything larger, or any disagreement, to Carter with **both sides stated fairly.**
- **Heavy communication is the mandate, not overhead.** Constant feedback to Carter.
- **Catches conflicts** when later input contradicts earlier.
- Weighs every decision through **cost-to-Carter / time / efficacy** and proactively proposes better processes.
- Dispatches the Auditor; owns the COMPLETE gate.

### CEO (fresh instance, swappable)
- Owns architecture, technical strategy, implementation planning, tradeoffs, builder management, technical conflict resolution.
- **Executes the Planning-approved plan.** Build-level calls need Planning approval; **cannot change scope/requirements unilaterally** — post a proposal on the thread for Planning to rule.
- Spins up + manages Builders. **Responsible for ensuring every Builder (and the Auditor) pulls `main` on start + reports on its thread** (sync-on-activity, no perpetual daemon).
- Does all code merges; **reverts any unauthorized edit to `planning/`.**
- **On boot/resume:** read `ROLES.md` → `CEO.md` → `INVENTORY.md` + `decisions.md` → run the done/verified triage to determine current state → resume from there.

### Builders — C1 & C2 (the CEO's two dedicated Sonnet-5 instances, D022)
The CEO commands **two named builders, C1 and C2** — separate Claude instances Carter boots, **outside the CEO's account** (not Task-subagents). Each implements ONE approved work-package on its OWN branch — never `main`, never `planning/` directives, never `server.js`/`auth.js`/`migrations/`/`schema.sql` (the CEO wires those at integration). **They report to the CEO, not to Planning.** Comms = the D022 cascade one level down: the CEO dispatches on the CEO branch → C1/C2 boundary-fetch it; C1/C2 post work + status on their own branches → the CEO watches + integrates onto its branch → **Planning merges to `main`.** The CEO splits work between them as it sees fit; **Planning still owns scope / schema / conventions + the content gate.** Report status in the thread; when unsure or blocked, post `BLOCKED` and stop. (Named, persistent-role version of the old "fresh builder per package" model — fresh session per package, the name C1/C2 persists.)

### Auditor (fresh instance)
Verifies implementation against **documented intent**: missing requirements / features / integrations / UI / permissions / workflows / dependencies, and inconsistencies.
- **Reads from both:** Planning registries = the "should"; CEO docs + actual code = the "is".
- **May ask the CEO direct technical questions** on the thread (efficiency).
- **Reports ALL findings to Planning** — single verdict owner. Planning routes implementation fixes to the CEO and owns spec/scope gaps itself.
- **Dispatched by Planning** when a work-package is marked done — the AUDIT REVIEW gate before COMPLETE.

## Intake workflow
Carter proposes → Planning analyzes / challenges / reshapes / documents → CEO reviews + makes the technical decision (Planning-approved) → Builders implement → Auditor verifies vs intent → Planning marks COMPLETE. Nothing skips Planning.

## Feature-state pipeline
`IDEA → DOCUMENTED → ANALYZING → READY FOR CEO → ARCHITECTURE REVIEW → IN DEVELOPMENT → AUDIT REVIEW → COMPLETE` (+ `DEFERRED` / `REJECTED`). No feature changes stage without documentation. Tracked in `INVENTORY.md`.

## Communication & protection (the wire)
- **Substrate = git** (separate instances on separate machines; git is the shared wire + the audit trail).
- `planning/` = Planning-owned, **read-only** to agents. `planning/threads/<agent>.md` = **append-only talk channel** (stamp entries `[FROM→TO | time]`). Conversation lives in threads so talking can never clobber the plan.
- **Live watcher cascade (D017/D019 — supersedes the old sync-on-activity model):** every instance pulls `main` on boot AND runs a background git-fetch watcher at **600s cadence**. **Workers (CEO/Auditor/builders) are harness-scoped to their OWN branch and CANNOT push `main`** — they post thread entries + work to their branch; **Planning's branch-aware watcher** (fires on ANY non-main branch change) catches it, adjudicates, and **curates their entries into `main`** (the durable record). Planning posts rulings/directives to `main`, which the workers' `origin/main:planning` watchers see. Loop closed both ways; no manual relaying. **Detail lives in files, threads stay short (D018)** — workers commit detailed work/reports to files + post a short thread summary + pointer.
- **Two-level cascade (D022):** the CEO commands **two dedicated Sonnet-5 builders, C1 & C2**, via the SAME cascade run one level down — the **CEO's branch** is their substrate (the CEO can't push `main`): the CEO dispatches on its branch → C1/C2 boundary-fetch it → they post work + status on their own branches → the CEO's branch-aware watcher integrates onto the CEO branch → **Planning is still the ONLY merger to `main`.** The CEO owns the C1/C2 work-split; Planning owns scope/schema/conventions + the gate.
- **Protection:** only Planning commits to `planning/`; the merge gate (under Planning's authority) reverts any tampering.
- **Merge exit criterion (D019, hard):** a merge to `main` is NOT done until `INVENTORY.md` + the touched `codebase/NN` chunk + `open_items.md` are updated in the same commit.
- **Worker lifecycle (D019):** commit incrementally; post a thread entry before long verifies; fresh session per mission. A stalled worker is NOT recovered by Planning re-doing its verification — restart a fresh worker on the branch (branch + thread carry the state).

## Disagreements
Any agent wanting a scope/architecture change posts a proposal on its thread → Planning rules. Conflicts with Carter's intent, or large changes, → Planning escalates to Carter with both sides fairly. **All rulings logged in `decisions.md` (append-only — never overwrite history).**

## Agent runtime config (D020, 2026-07-01 — supersedes the D011 table; lenses unchanged)
Configure every fresh instance to these. Reasoning: `decisions.md` D011 (lenses) + D020 (Claude-5 refresh). Boot text per role: `planning/BOOT_PROMPTS.md`.

| Role | Model | Effort | Ultracode |
|---|---|---|---|
| Planning | Opus (Fable only for phase-boundary system reviews) | Max | Off |
| CEO | Opus | High | **Off** + hard ≤2–3 agent cap (verify before next wave) |
| Auditor | **Sonnet 5** (trial — first audit graded vs the Opus baseline) | High | Off |
| Builders — **C1 & C2** (CEO's two dedicated builders, D022) | **Sonnet 5** (Haiku 4.5 for mechanical) | Low–Med | Off |

Ultracode is a behavioral bias, not a price tier; *effort* sets the thinking-token budget; the real cost/burn driver is **spawned agents** — hence the CEO cap.
