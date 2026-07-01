# 11 — Training (OSP SPA + backend) — ✅ COMPLETE (MECHANISM ONLY — R18 content quarantine honored)

> Mapped 2026-06-29. The current TOP-PRIORITY pivot (memory `project_training_launch_pivot`). **⛔ R18 quarantine respected: I mapped the MECHANISM (progress, gating, signup, admin overview, build) and did NOT ingest/evaluate lesson CONTENT** (the `lessons/*.jsx` + `*-flashcards.js` + `course-catalog.js` specifics). **Bottom line: training is a clean, self-contained, healthy subsystem — the ONE area NOT entangled in the legacy/keystone split — and the pivot requirements are all mechanically supported today.**

## How it fits together
- **SPA:** `osp-training/` = React + Vite + React-Query + Tailwind. `npm run build:osp` → `public/training/` (static bundle), served same-origin at `/training/` so the `lfs_session` httpOnly cookie travels on `/api/*` fetches. Rich interactive primitives (Quiz, BranchingScenario, Flashcard, OTDRTraceViewer, LinkBudgetCalculator, CertificationSim, TopologyCanvas) = the lesson-authoring toolkit (mechanism; not content).
- **Backend:** `routes/training.js` (945) — all behind `requireAuth()`; admin endpoints gated `['admin','design_manager','permitting_manager']`.
- **Admin UI:** `public/training-admin.html` (511) — presets + per-user access + the progress overview.

## Tables (all training-specific — NOT tied to projects/keystone; clean separation)
- `training_progress` (user×lesson: status, completion_pct, best_score, attempts, started_at, completed_at) — the core.
- `training_cert_attempts`, `training_topic_capstone_attempts` — exam/capstone history.
- **Gating:** `user_training_access(user_id, base, preset_id)` [base='all'|'preset'|'none', default 'all'] · `training_presets` + `training_preset_scopes(scope_type, scope_id)` [named visibility bundles, scope = track/subject/lesson] · `user_training_overrides(user_id, scope_type, scope_id, mode='show'|'hide')`.

## Mechanism ↔ the pivot requirements (all supported)
| Pivot requirement (memory) | Mechanism |
|---|---|
| **per-person progress bar in admin** | `GET /api/training/admin/overview` (users LEFT JOIN training_progress → completed/total) + `/admin/user/:userId/detail` + `/admin/progress-overview`. **Denominator is per-user visibility-aware** (`visibleTotalFor` = the user's visible lesson count, not the global total) — so a curated user's % is honest. |
| **training for everyone** | default `base='all'` + `requireAuth()` (any logged-in user sees content). |
| **hide all tabs but Training** | `TRAINING_ONLY_LOCKDOWN` (chunk 01, server-side nav lockdown). |
| **signup live ASAP** | signup = MAIN auth `/api/auth/register` (trainee role, pwd≥8, chunk 02) → a `users` row → **appears in `/admin/overview`** (which lists ALL users LEFT JOIN progress). So new signups DO surface in the training admin view (distinct from the chunk-04 People-page fix). |
| **green-light "flip content visible"** | = admin sets `user_training_access.base`/`preset_id` (assign a preset) and/or `user_training_overrides` (show/hide). `computeVisibleLessons(base, presetScopes, overrides)` = base ± overrides. THIS is the lever Carter green-lights. |

## Progress engine (well-built)
- `useProgress` (React-Query, optimistic + rollback + invalidate). **Status is MONOTONIC** — only advances not_started→in_progress→completed, never regresses; best_score=GREATEST; completion_pct=GREATEST; attempts++ (server upsert enforces the same via `GREATEST`/CASE). markSeen=≥10%, markComplete=100%(+score).
- **Completion is COMPETENCY-GATED** (Carter 2026-06-26): `PASS_THRESHOLD=70` — a lesson credits "completed" only with a passing quiz score / interactive competency flag, not mere viewing. Good (real learning signal, not click-through).
- `useMyContent` filters the SPA catalog/nav to the visible sets; **fails OPEN** (loading/error → show all).

## Findings
- **Training is HEALTHY + pivot-ready.** Monotonic competency-gated progress, visibility-aware admin denominators, preset-based curation, clean isolated schema. Nothing here blocks the launch pivot mechanically — remaining work is CONTENT (quarantined) + flips (Carter green-lights) + confirming TRAINING_ONLY_LOCKDOWN behaves on the live nav.
- **⚠ O26 (minor, by-design): content visibility is CURATION, not a security boundary.** Lessons ship as STATIC bundles in `/training/`; `my-content` only filters the nav, and it fails OPEN. So a "hidden" lesson's JS is still fetchable by URL. Fine for training (not secret), but Carter should know **"gated" ≠ "inaccessible"** — if any lesson is ever truly restricted (e.g. a paid cert), it needs server-enforced delivery, not just nav filtering. → open_items O26 (low).
- **Signup→admin flow works at the training-overview level** (users LEFT JOIN progress) — confirms the pivot's "I can see who signed up + their progress." (The chunk-04 People-page is a separate surface; both now show signups.)
- **Cleanest subsystem in the codebase:** training has its own schema, its own SPA, no projects/keystone/hours entanglement — which is exactly why it's the right time-sensitive first pivot (memory `project_commitments_register`: "Training = first task, isolated").
- **R18 honored:** no lesson content ingested/evaluated. The content gate (per-topic research-log + red-team before any content merge) remains the governance control; this map touched only architecture.

## Reapproach-if
- When the pivot resumes: verify TRAINING_ONLY_LOCKDOWN live (does the nav truly hide all non-Training tabs for the target roles?); confirm trainee role default `base='all'`; walk the admin progress overview live (feature_verify_user_facing).
- Chunk 15 (frontend): training-admin.html deep UI (preset/access toggles) + the SPA splash/course views — deferred (wiring captured).
- Content work stays gated (R18) — mechanism is ready to receive vetted content; do not author/merge content without the research-log + red-team.
- The "flip" UX: training-admin.html drives `user_training_access` + presets — this is where Carter's green-light actions happen; map its UI when content flips are queued.

## ▶ 2026-06-30 — WP-A VISIBILITY REBUILD (supersedes the old 5-base model above; main `b172cd87`)
The prior model (5 conflicting bases `all/preset/published/default/none` + hard-coded OSP `defaultVisibleLessons` + `useMyContent` fail-open) caused Carter's bugs (flash, uncurated default, revoke-doesn't-stick). Replaced with ONE server-authoritative model:
- **Migration `0080_training_visibility_settings.sql`:** singleton `training_visibility(published_preset_id, default_preset_id)` pinning two RESERVED presets — `__published__` (what's live at all; back-filled from the legacy 'Published' preset so **T01 curation carried over**) and `__default__` (a fresh signup's subjects; seeded `track:osp` — a SCOPE, so newly-published OSP flows in). Legacy `base='all'` rows deleted (resolve via default now; overrides preserved).
- **THE ONE RESOLVER** (`routes/training.js` `resolveVisibleLessons`): `visible(non-admin) = (default ∪ per-user SHOW − per-user HIDE) ∩ published`; **HIDE always wins** (recomputed every call → revoking already-seen content truly hides it); **∩ published** = the hard ceiling (line ~153, nothing unpublished leaks); **admin → {all:true}** (never hits the resolver).
- **Endpoints:** `GET /my-content` (server-authoritative; **503 on error, NEVER `all:true`**) · `GET/PUT /published` (Publish lessons/tracks — global) · `GET/PUT /default` (new-user default subjects; returns the full catalog tree + `default_scopes`) · `GET/PUT /access/:userId` (per-user show/hide overrides). PUT publish/default → `broadcast('training',…)`; PUT access → `broadcast('user:<id>',…)`.
- **SPA (`osp-training/src`):** `useMyContent` de-fail-open (`ready` gate → skeleton until resolved, kills the flash; keeps last-good on error) + `useVisibilityStream` (EventSource `/api/events/stream` → invalidate `['my-content']` on `training_visibility_changed` → **live, no refresh**). `LessonRouter` — hidden lesson = **completely gone: no lock screen**, doesn't load the chunk, **redirects** (course home if subject visible, else chooser). `ProductChooser`/`CourseView`/`Splash` gate on `ready`.
- **`_sse.js`:** added the `training` channel (all authed) alongside `user:<id>`.
- **Admin UI (`training-admin.html`):** 3 clean controls — **Publish** (lessons+tracks, bulk), **New-user default** (subjects, "typical = OSP"), per-person **grant/revoke** (Show/Hide/Default, hide-wins) in each row's drawer.
- **VERIFIED live** (Planning, preview + real accounts): fresh trainee = only published OSP/T01 (no ISP/Certs, `all:false`), no flash; revoke→gone live no-refresh; restore→back live; hidden-URL→redirect no lock screen; admin={all:true}. → O36 DONE, O37 phase-1 DONE, O26 UX-hide shipped (static-asset residual low/open).

## ▶ 2026-07-01 — ASSESSMENT ENGINE (server-authoritative; MID-BUILD on `claude/ceo-roleplay-planner-eoj4yd`, NOT merged/deployed)
Replaces the old assessment model (questions hard-coded inline in lesson `.jsx`, 100% client-side scoring, server stored only `best_score`, typed answers live, no topic-final construct). Approved design (decisions D-thread 2026-07-01 + `TRAINING_PLAN` "approved engine architecture"). Increment 1 shipped on the CEO branch:
- **Migration `0082_training_assessment_attempts.sql`** — unified attempt table (`kind` lesson|topic_final; `drawn_question_ids`+`answers` jsonb; server-derived `score/passed`; `duration_seconds` wired, SPA timing lands w/ I11). cert/capstone tables untouched. **Dev-only until the O11 backup gate clears.**
- **`routes/_assessment_pools.js`** — draw/strip/grade core; pools = version-controlled repo files under `content/training/assessment-pools/` (`{drawCount, passThreshold, pool}`, D013 per-file so gate artifacts travel w/ the questions). **Typed-answer ban enforced AT LOAD** (`mc`+`drag-match` only; `fill-in-blank` throws).
- **`routes/training.js`** — `POST /assessment/:id/start` (per-attempt random draw, keys stripped, visibility-gated) · `POST /assessment/:id/submit` (server recomputes from answers vs stored drawn ids → competency gate; client score never trusted) · `GET /assessment/attempts` (→ I11). `tests/assessment_engine.test.js` 10/10 green.
- **Launch dial:** lesson 4-of-8, topic-final 15-of-22 (tunable → 6/25 later). **Remaining (CEO inc 2→4):** quick fixes (DnD shuffle, remove "suggested time") · Quiz SPA refactor + `TopicFinal` + **remove `fill-in-blank` mode** · **gated live-T01 retrofit** (inc 3+4 land as ONE merge or live T01 breaks). Auditor to independently verify the engine pre-merge.