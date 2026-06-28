# Decision Log (append-only)

> Owned by Planning. Never overwrite an entry — supersede it with a new one that references the old. Each: decision · reasoning · alternatives. Last updated 2026-06-28.

## D001 — Establish a Planning Agent layer above the CEO (2026-06-28)
**Decision:** New governance layer. Chain = Carter → Planning → CEO → Builders/Auditor. Planning is the logic + project memory; CEO is architecture + build.
**Reasoning:** Missed ideas/features + communication errors during the time-sensitive training pivot (e.g. a completion-tracking system shipped with no way to add staff). A dedicated analysis/memory layer prevents loss and reshapes requests before they're built.
**Alternatives:** Keep the CEO as top router (rejected — that's the structure that produced the misses).

## D002 — Planning is the absolute source of truth; owns all root/planning docs (2026-06-28)
**Decision:** Planning owns `planning/` + all root docs and writes every agent's scope doc. Agents treat them read-only.
**Reasoning:** Single source of truth; survives CEO swaps; prevents drift.

## D003 — All agents are fresh instances; "fresh" = new sessions, not a code wipe (2026-06-28)
**Decision:** Restart with fresh CEO + Builders + Auditor that boot from Planning's docs. Keep the existing codebase + verified work. Fresh CEO's first job within the plan = triage what's actually done + verified, then continue.
**Reasoning:** Reset the people/context, not the work. Carter confirmed.

## D004 — Comms over git; read-only plan vs writable threads; auto-pull watchers (2026-06-28)
**Decision:** `planning/` read-only to agents; `planning/threads/<agent>.md` append-only writable. Every instance runs a background git-fetch watcher (boot-block). Planning wires the CEO's watcher; the **CEO cascades watchers to all Builders + the Auditor.**
**Reasoning:** Git is the only reliable cross-machine substrate + gives an audit trail. Goal: no manual "pull main." Carter delegated the mechanism to Planning.
**Alternatives:** Cross-session message tools (rejected — unreliable across machines/accounts).

## D005 — Read-only protection = sole-Planning-commits + merge-gate revert (2026-06-28)
**Decision:** Only Planning commits to `planning/`; loud read-only headers; one agent-writable status section per scope doc; CEO merge-gate reverts unauthorized edits to `planning/`.
**Reasoning:** Git can't OS-lock files across clones; this is the strongest practical guard short of a separate locked repo (offered to Carter if he wants it harder).

## D006 — Auditor: dual access, single reporting line to Planning (2026-06-28)
**Decision:** Auditor reads from + may clarify with both Planning and CEO, but **reports all findings to Planning** (single verdict owner). Planning routes implementation fixes to the CEO and owns spec gaps. Planning dispatches the Auditor as the AUDIT REVIEW gate when a package is marked done.
**Reasoning:** It audits implementation-vs-intent, which spans both worlds — but a verifier shouldn't decide/split its own findings (it's a reader, not a decider); dual reporting lets findings fall through cracks or be dismissed as out-of-scope, the exact failure Planning exists to kill.
**Alternatives:** Equal dual-report (rejected — divided accountability); report to CEO who escalates (rejected — puts CEO between Auditor and Planning on completeness, Planning's own domain).

## D007 — Heavy communication required of Planning; decisions weigh all lenses (2026-06-28)
**Decision:** Planning↔Carter is intentionally high-communication (overrides the general brevity norm for this channel). Every decision weighed through cost-to-Carter / time / efficacy; Planning proactively proposes better processes and pushes back.
**Reasoning:** Carter wants a real second brain that catches conflicts and improves ideas, not an order-taker. (Compute-cost discipline — agent fan-out — still holds; the override is dialogue depth, not burning compute.)

## D008 — Authority + disagreement protocol (2026-06-28)
**Decision:** Planning may change scope *slightly* on its own; CEO build-level calls need Planning approval; disagreements → Carter notified, both sides fairly; rulings logged here.

## D009 — Planning runs the whole launch software (2026-06-28)
**Decision:** The entire launch platform is under Planning. Training is the trigger that brought the layer on now, not the scope. Planning must continuously deepen its knowledge of the business/domain.

## D010 — First task = full software plan, in normal mode (2026-06-28)
**Decision:** First task is a full in-depth plan for the ENTIRE software, meshed with current verified state, collaborative with Carter. Held in normal mode, not plan mode.
**Reasoning:** Plan mode blocks the doc/memory writes that are Planning's core function; the plan is a living doc, not a one-shot approval artifact.

## D011 — Ultracode / effort / model per agent (LIVING — exemplar decision record) (2026-06-28)
*All lenses banked here so new input updates the synthesis instead of replacing it.*
**Considerations (lenses):**
- **Cost:** Carter watches to the dollar; cost drivers = tokens + spawned agents; *effort* sets the thinking-token budget; **Ultracode is NOT a price multiplier** — with no agents it ≈ Max cost, adding only a slight overspend bias.
- **Burn risk:** a past CEO spawned dozens of agents and burned all usage — the cardinal incident ([[feedback_no_mass_agent_spawn]]).
- **Accuracy:** government training content cannot be wrong → needs rigorous, often multi-agent verification (the gate: author ≠ independent RT).
- **Role-fit:** Planning/Audit = analysis/verify → Ultracode's orchestrate-bias rarely/safely fires (proven: Planning ran Ultracode all session, zero fleets). CEO/builders = build/verify → the bias fires constantly and becomes real fleets.
- **Ultracode mechanics:** a behavioral bias, not a billing tier; "solo on conversational turns" is sanctioned; safe where the work isn't build work.

**Current call:**
- **Planning:** Opus / **Max** / Ultracode **OFF** (Max gives the depth; Ultracode adds ~no benefit solo + slight overspend bias).
- **CEO:** Opus / **high** / Ultracode **OFF** + explicit **bounded-orchestration mandate** (≤2–3 agents, scoped, verify-before-next-wave, gate enforced). Gets orchestration *capability* without the unbounded "cost-is-no-object" attitude.
- **Audit:** Opus / **high** / Ultracode **OFF** (default; the one safe place to enable later if desired — periodic, completeness-focused, spawns no builders).
- **Builders:** Sonnet/Haiku / **low–med** / off.

**Why CEO is Ultracode-off even though its work is multi-agent (Carter's "why not CEO?"):** his instinct is right that the CEO is the role that *needs* to orchestrate (the content gate is inherently multi-agent). But it needs **bounded** orchestration — which it gets from the capped mandate + high effort. Ultracode's standing "fan out by default, cost no object" posture directly **fights that cap on the exact role where over-spawning already burned Carter**, and the flag has *teeth* on the CEO (build tasks trigger it constantly) unlike on Planning (analysis tasks rarely trigger it). So: **capability via protocol, not via the flag.** Condition under which "Ultracode ON for CEO" becomes acceptable: only if the ≤2–3 cap is enforced as an *inviolable ceiling that overrides the flag*, stated explicitly in the CEO charter.
**Status: LOCKED 2026-06-28** — Carter: "CEO with no ultracode, High. Lock everything in." Final: Planning Opus/Max/off · CEO Opus/High/off + capped orchestration · Audit Opus/High/off (safe to enable later) · Builders cheap/low–med/off.

## D012 — Comms: threads live on `main`; fetch-on-demand while single-instance (2026-06-28)
**Decision:** The Planning↔agent thread channel lives on **`main`**, not on agent working-branches. The CEO (which has merge rights) commits its thread entries to main; Planning too; both pull main on activity. Builders post threads on their branches; the CEO surfaces/merges them. While only one other instance is active, **fetch-on-demand** replaces the perpetual git-fetch watcher (cost); wire the watcher + cascade when real parallel instances exist.
**Reasoning:** The CEO correctly posted its first triage to its own branch's thread (never pushed code to main, per the worker rule), so it didn't auto-reach Planning. Threads-on-main fixes auto-receipt without agents touching code on main. Also recorded via the CEO's grounded triage (2026-06-28): the 6-agent coverage audit never produced output and ~0 live topics are gated → approved going lean (P1), unified Staff layer (P2), and Track-A-early sequencing with the urgent visibility reset (P3).
