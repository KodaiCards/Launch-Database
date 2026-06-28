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
- **A1. User/account management.** Admin can **add AND delete** staff *and* user accounts. *Triage note:* `DELETE /api/staff/:id` exists (`routes/staff.js`); **user-account delete + the admin UI appear to be the real gap** — confirm and build.
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

## Open inputs from Carter
- The **agent-concurrency cap** comfort number (Planning proposes ≤2–3).
- Which **OSP subjects inspectors most need first** (to prioritize Track C).
