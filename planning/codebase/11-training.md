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