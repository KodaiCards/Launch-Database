# Training Patch + Incremental Overhaul — the plan ("the training document")

> Owned by Planning. The first task: get the **OSP training** usable + trustworthy for the team ASAP, then overhaul the rest **piece by piece**. Government-grade accuracy is non-negotiable. **READ-ONLY to agents.** Last updated 2026-06-28. **When Carter signs off on this doc, it is "finished" → Planning fires the business/vision deep-dive commitment.**

## Goal
Patch the learning module so current employees can start training **now**, and roll out a full overhaul **one verified piece at a time** — content being worked on stays hidden until it clears the gate.

## Audience & priority
Current ~12 employees in downtime — **primarily inspectors learning OSP**. **OSP is the priority track.** ISP + CERTS exist in the catalog but are **not done** → hidden by default, built eventually.

## Success
Even **a couple of fully-verified, polished OSP subjects live + usable** is a win. Then a steady rollout cadence.

## The two axes (the model that fixes the original mistake)
Keep **content status** (is this lesson finished/verified?) separate from **user permission** (what may this person see?):
- **New user default:** signup → Launcher shows **only the Training tile** → inside, **only the OSP track** is visible. ISP + CERTS hidden until an admin grants them per person.
- **Status-driven visibility:** only **verified + published** lessons are visible to trainees; **WIP/unverified content is hidden.** This is also the rollout mechanism — flip a subject visible the moment it clears the gate.
- **Reuse, don't rebuild:** the per-user content-visibility system already exists (migration 0079, `routes/training.js`, `useMyContent`). Retarget the **default** to OSP-only; admin grants widen it. Don't reinvent it.

---

## Track A — Usability / product (fast, isolated from content)
- **A1. Staff = ONE concept (no user/staff split).** Per Carter: *"users and staff shouldn't be separate to me — it's all staff, they just need perms and team designations which I should be able to create, edit and delete."* Deliver a single **Staff** management surface: a person with **login + permissions/role + team designation(s)**, admin can **create / edit / delete**. *Triage note:* today `staff` (table) and `users` (login accounts) are separate — `DELETE /api/staff/:id` exists but **user-account delete is missing**. **CEO decides** whether to merge the tables now or present a unified layer over both (weigh cost/risk — don't force a risky table-merge mid-patch if a clean unified layer ships faster). This is the **first slice of System F** (roles/capabilities) — build to extend, not throwaway.
- **A2. Default new-user experience.** Signup → training-only launcher → OSP-only inside (per the model above). Admin grants ISP/CERTS per person.
- **A3. Status-driven visibility / rollout switch.** Unverified or in-progress content never shows to trainees; verified subjects get flipped visible.
- **A4. Fix broken interactive tools.** Component health check → repair list → fix.

## Track B — UI beautification
Visual polish pass (typography, spacing, consistency, light/dark) + place the **Launch logo** (`public/img/launch-fiber-logo-transparent.png`) in the training UI + launcher. Scoped so it does **not** eat the content effort.

## Track C — Content overhaul (piece by piece, GATED — the heavy, ongoing work)
**Unit of rollout = one subject** (or a small lesson set) brought to full quality, then flipped visible.

**Quality bar per piece:**
- Fully **encapsulates the subject matter** (depth + completeness; add content to thin lessons where needed).
- **Builds logically** — the lessons read as a coherent lesson plan; prereqs valid.
- **Easy to learn** — plain verbiage, every acronym defined, scannable.
- **Good + varied interactivity** — the right interactive tool per concept (not just multiple-choice).
- **Accurate SVG diagrams** for technical visuals.
- Assessment floor met (graded or competency interaction per lesson — required by the completion gate).

**Reordering is allowed:** move subjects/lessons into logical/chronological teaching order. **Constraint:** `course-catalog.js` is parsed by the content-visibility system — reorder/retitle is fine, but keep it parseable (CEO owns that integration; don't break section grouping general→OSP / isp→ISP / cert→Cert).

**⛔ THE GATE (non-negotiable — government content):** every content piece ships **only** with a **research-log (citations)** + an **INDEPENDENT red-team report** (author ≠ red-teamer). No artifacts = not merged. **Never author from memory** (the R18 quarantine is why). Hide WIP; flip visible only when verified + polished.

---

## CEO execution constraints (MANDATORY — go verbatim into CEO.md)
- **⛔ NO mass parallel agent spawning.** Hard cap: **≤ ~2–3 agents at once**, only on a **confirmed, scoped piece**, and **verify real artifacts before spawning the next wave.** Never speculative fan-out. *(Past failure: dozens of agents spawned simultaneously burned all of Carter's usage before any real work happened. This must never recur.)*
- **Cost discipline:** cheapest tool that proves it; don't burn usage on agent setup/idle.
- **Tight-leash workers:** one small confirmed piece at a time, then stop + confirm.
- **Enforce the gate** on every content merge; verify via git + artifacts, never self-report.
- **Wire the watcher cascade** (CEO ensures every worker + the Auditor runs the git-fetch watcher).

## Sequence
1. **CEO done/verified triage** (leverage the in-progress `docs/audit/AUDIT_PLAN.md` — don't restart it): what OSP content exists, what's verified vs not, which tools are broken, current vs desired teaching order, what the default-visibility + user-mgmt code currently does.
2. **Track A + Track B** — usability + polish so the platform is usable and presentable (small parallel OK, within the cap).
3. **Track C** — lock teaching order → take OSP subjects through the gate **one at a time** → flip visible as each clears, prioritizing what inspectors need first.

## Done-when (this patch round)
Admin can add/delete staff + users; a new signup lands in a training-only launcher seeing only OSP; WIP hidden; broken tools fixed; UI polished with the logo; **≥ a couple of OSP subjects fully verified + polished + live**; a repeatable per-subject rollout pipeline is running.

## Teaching / rollout order (LOCKED — Foundations first, then DAG order)
Carter: start with **Foundations**, then the order an OSP expert would teach. **Cost win — that order is already research-grounded:** the catalog encodes a prerequisite DAG + topological sort (`ARCH.md §3`), so it isn't being invented from memory. Adopted rollout order (release each subject as it clears the gate):

**T01 Fundamentals & Vocabulary** (Foundations) → T18 Safety & OSHA → T02 Fiber Physics → T03 Cable Selection → T04 Route Survey → T09 Permitting → T05 Design–Aerial → T06 Design–Underground → T19 Headend/CO → T14 Bonding & Grounding → T07 Staking → T08 Make-Ready → T10 Construction → T11 Splicing → T12 Testing → T13 Inspection & QA → T15 Restoration → T16 As-Built/GIS → T17 Estimation → T20 RUS/Federal → cert prep (T21 CFOS/O · T22 CFOT · C04 BICSI mock · C05 final).

Prerequisites are real (e.g. T13 Inspection needs T01/T05/T10/T12/T18) → releasing in this order keeps the path unlocked. Inspectors start at Foundations and build toward Inspection naturally. *(Can sanity-check vs external OSP curricula on request — but it's a sound DAG; skip the spend unless Carter wants it.)*

## Content-visibility flip — Carter green-lights (LOCKED)
A subject goes visible **only** after it (1) clears the gate (research-log + independent RT), (2) the Auditor confirms it vs intent, and (3) **Carter green-lights it.** Carter owns the final flip. **Planning maintains a "pending flips" queue** — every subject sitting gate-passed + audited and waiting on Carter — and **proactively reminds him** what's waiting (he asked to be reminded any time). Flow: CEO builds+gates → Planning dispatches Auditor → on pass, Planning queues it + tells Carter → Carter green-lights → flip executed.

## Visibility reset (LOCKED — piece by piece)
Current `available:true` flags are optimistic (they predate the accuracy crisis; they don't mean "verified"). **Decision:** hide what isn't re-verified to the new bar, then **re-release in teaching order, one subject at a time, as each clears.** There's a little runway → the goal is **several subjects verified + live for launch, not just Foundations** (as many as clear the gate in time). WIP stays hidden.

## Locked this round (2026-06-28)
- Concurrency cap **≤2–3** (confirmed).
- **Staff = one concept** (A1) — no user/staff split.
- Teaching/rollout order = above (Foundations first). **Positions are fixed by the DAG; the CONTENT of every topic — Fundamentals included — still goes through the full overhaul + accuracy gate. Nothing is exempt.** (T01's *position* is first because it's the DAG root every topic depends on; its *content* is overhauled like the rest, and first in line because everyone hits it first.)
- **Flip authority: Carter green-lights every flip;** Planning keeps the pending-flips queue + reminds him.
- **Visibility reset: piece-by-piece, hide-then-release in teaching order; target several subjects live for launch.**

## Status
- **SIGNED OFF 2026-06-28 ~15:57 (Carter: "I'm ready").** Plan is live. CEO charter written (`planning/CEO.md`) + kickoff posted (`planning/threads/ceo.md`); Carter boots a CEO instance pointed at it. Business/vision deep-dive commitment **FIRED** (in progress — capturing to `planning/BUSINESS.md`).
- **CEO's first step = done/verified triage** (no content authoring until the grounded state + gate are confirmed by Planning).
