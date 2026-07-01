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
- **⛔ NO typed / free-text-answer questions (Carter 2026-06-29).** The field crew shouldn't have to *type* an answer — use multiple-choice, click/select, drag-order, hotspot, or other non-typing interactions. **Remove every existing typed-answer question** as each piece goes through the overhaul (and never author new ones). Tracked: `ideas.md` I10.
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

## ▶ Carter requirements added 2026-06-29 (capture — NOT yet built; do lesson-by-lesson, tell Carter when each is ready)
> Carter is worried compaction lost things from the original plan discussions → **everything he names goes here verbatim, and he'd rather re-walk the whole plan with Planning than risk missing items.** Planning to OFFER a full plan re-walk.

**Content fixes (per-lesson, through the gate):**
- **Remove ALL free-text "type the answer" questions** everywhere. ⚠ CROSS-IMPACT: the completion gate needs an assessment/competency interaction per lesson (PASS_THRESHOLD=70) — if a type-answer question was a lesson's ONLY assessment, **replace** it with an MC/interactive check, don't just delete, or the lesson can't gate completion. Catch this per lesson.
- **Randomize drag-and-drop answer order.** Today the DnD answers render in definition order (Q1's answer = leftmost, Q2's = next, …) → trivially gameable. **Shuffle on render.** ONE-SHOT component fix (the DnD/Sortable component) that fixes ALL drag-drop at once — NOT per-lesson — but verify no lesson relies on positional order.
- **Cadence (reinforced):** go **lesson by lesson**, make each **absolutely polished**, **tell Carter when each is ready to turn on.** Now executable via the per-lesson "Lesson visibility" toggle Planning built (publish = check the lesson).

**Training UI text:**
- **Remove the "suggested time to complete"** EVERYWHERE — it's on lessons, subjects, ~every page. Remove it (rendering + likely the catalog field).
- **Gold header:** "Launch Fiber Services · OSP Training" → **drop "OSP", just "Training".**

**Training progress dashboard — REDESIGN (current one "sucks"):**
- **Test/quiz SCORES in a highlighted, prominent place.**
- **Clear completed-lessons list**, each showing **how long it took.**
- **Time each lesson: lesson-open → test-complete. Pause if they leave the page** (Page Visibility API). **Red flag** next to anything **> 45 min.**
- ⚠ CROSS-IMPACT / BUILD: `training_progress` has NO per-lesson duration today (only status/score/started/completed) → needs new timing capture (SPA instruments open + test-complete + visibility-pause → stores duration) + a schema field/table + dashboard rework + scores surfaced. Real build → ideas **I11**.

**New training UI:** part of the whole-app UI redesign (**I10**) — Carter dislikes current colors; wants a new UI + the **transparent (no-background) logo**; plan together. ⚠ the training SPA (osp-training, Tailwind) is a SEPARATE style system from app-shell.css — redesign spans both.

## ▶ Carter answers + new requirement (2026-06-30 walkthrough)
**Resolved during the plan walkthrough:**
- **T01-only is INTENTIONAL, not a bug.** Carter set **T01 (Fundamentals) as the demo AND the starting point** so anyone who needs something tomorrow has it. (Resolves U18 "investigate why only T01" + O32 curation — Carter curated it himself; T01 is the one published lesson set.)
- **Launch posture confirmed:** OK to start trainees on **Foundations-only for now**, BUT **"we need more out soon"** → ⭐ **near-term priority: push more OSP subjects through the gate + live, fast.** Logged as a standing priority (the gate is the throughput limiter; bias agent budget here once UI co-design is underway). Re-raise at every training-work checkpoint.
- **Typed-answer removal = replace-not-delete CONFIRMED** (when a typed Q was the lesson's only graded check, swap in an interactive one; handle per-lesson).

**⭐ NEW REQUIREMENT — randomized question POOLS per test (anti-cheat, Carter 2026-06-30):**
> "For all the tests add a couple different questions and answers in a pool to randomize from. I want different questions for different accounts if possible. Just to prevent cheating."
- **Mechanism:** author each assessment as a **question BANK (pool of N)**; each attempt **draws a random subset (M of N)** → different accounts (and different retries) get different question sets. **Generalizes/supersedes the 2026-06-29 "randomize drag-and-drop order" ask** — same anti-cheat goal, stronger (randomizes *which* questions, not just their order; order-shuffle still applies within).
- **Recommended design = per-ATTEMPT random draw** (not a fixed per-account set): strongest anti-cheat (even the same person's retries differ; two accounts almost never collide), and no per-account assignment table to maintain — "different per account" falls out for free. Store the drawn question-set + answers in the attempt record so grading + the I11 dashboard stay reproducible.
- **Scope:** per-lesson assessments **AND** the cert/capstone exams (higher-stakes → larger pools).
- **⭐ CONCRETE SIZING (Carter 2026-06-30):** **every lesson test = 6 questions shown**; **every TOPIC final quiz = 25 questions shown.** Pools sized "randomized enough, not overboard": **lesson test = 6 of a ~10-question pool**; **topic final = 25 of a ~35-question pool** (≈1.5×). Carter delegated the exact pool size to Planning ("make the needed pool… don't go overboard") — these are the defaults; the multiplier is the dial.
  - ⭐ **LAUNCH DIAL (Carter 2026-07-01, supersedes 6/25 for launch):** to cut time-to-launch, ship with **LIGHTER pools — lesson test = 4 shown / pool of 8; topic final = 15 shown / pool of ~22** (still per-attempt random draw, still data-driven per D013). ~Halves the gated-authoring per subject. **Deepen toward the full 6/25 post-launch.** The engine builds these as tunable config defaults, so deepening later = a data change, not a rebuild.
  - ⭐ **LAUNCH SET (Carter 2026-07-01):** get the first ~6 subjects live fast — **T01 (done) → T18 → T02 → T03 → T04 → T09** — rather than grinding all 20 before anyone benefits. Still gated + green-lit each.
  - ⭐ **APPROVED ASSESSMENT-ENGINE ARCHITECTURE (Planning ✔ CEO design, 2026-07-01 — full record in `threads/ceo.md` 10:35):** **server-authoritative draw + grade** (client-side scoring removed — it can't do anti-cheat or reproducible I11 scores, and answer keys can't ship in a fetchable bundle, O26). **Pools = version-controlled REPO data modules** (`lesson:<id>` / `final:<courseId>` = `{drawCount, pool:[{id,type,prompt,choices,answerIndex,explanation,citation}]}`) so the research-log + red-team artifacts + citations travel WITH the questions in git history = the gate's audit trail. Server draws per-attempt (answers stripped before shipping) + grades on submit. **One additive migration `0082` — unified `training_assessment_attempts`** (drawn_question_ids + answers jsonb → reproducible grading + I11 data; `duration_seconds` column wired now, SPA timing added in the I11 wave); cert/capstone tables left intact. **New `TopicFinal` construct** (15-of-22 draw). **`fill-in-blank`/typed mode removed from `Quiz` platform-wide** (the ban). Sequence: engine + quick fixes → **gated live-T01 retrofit** (re-author T01's Qs into a ban-clean starter pool through the gate) → I11 → content cadence (T02 retrofit + T18 onward). Migration held until backups confirmed (O11).
  - ⚠ **NEW STRUCTURAL LAYER:** a **per-TOPIC 25-question final quiz** doesn't exist today (current model = per-lesson assessments + cert/capstone). CEO build = lesson pool-draw (6) **+ a new topic-final construct** (25-draw) between lesson and cert. Ties **I11** (the 25-q topic final is the big "highlighted score"; the 6-q lesson tests feed completion).
  - ⚠ **AUTHORING SCALE (the real throttle on "more out soon"):** a ~10-lesson topic = **~10×10 lesson-test questions + ~35 final = ~135 GATED questions/topic** (all sourced + red-teamed). Incremental per topic as each clears the gate, but it's the main thing competing with launch speed → **smaller pools = faster launch** is the lever if Carter wants to accelerate.
  - **RETROFIT:** T01 (live) + T02 (next) get rebuilt to this structure too once the engine exists ("when we finish we will do t01 and t02 like that too").
- **D013 (configurable):** pool + draw-count are **data per lesson/topic**, not hard-coded; engine random-samples per attempt.
- ⚠ **CROSS-IMPACT — authoring cost vs "more out soon" (the real tension):** every pooled question is **GATED content** (sourced + independently red-teamed like everything else) → a pool **~doubles+ authoring per lesson.** That directly competes with "more subjects out soon." **Rec: modest pools at launch** (e.g. show 3, pool of ~6) to break answer-sharing without doubling time-to-live; **deepen pools later.** Flag to Carter as a speed↔anti-cheat dial.
- ⚠ **CROSS-IMPACT — I11 dashboard:** %-scores stay comparable across accounts (score is score); only per-*question* analytics vary by account — note in the dashboard build.
- **Build owner:** assessment-engine change (random-draw + attempt-record) = CEO scope; the per-lesson pools = content-authoring spec through the gate. Plan with I11 (both touch the assessment/score layer).

## Status
- **SIGNED OFF 2026-06-28 ~15:57 (Carter: "I'm ready").** Plan is live. CEO charter written (`planning/CEO.md`) + kickoff posted (`planning/threads/ceo.md`); Carter boots a CEO instance pointed at it. Business/vision deep-dive commitment **FIRED** (in progress — capturing to `planning/BUSINESS.md`).
- **CEO's first step = done/verified triage** (no content authoring until the grounded state + gate are confirmed by Planning).
