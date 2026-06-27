# Training Launch — design & build record

Living record of the **temporary training-launch pivot** (started 2026-06-26): ship the platform as a training tool for the team while the rest of the keystone roadmap is paused. Keep this current so design/build context survives conversation compaction.

## Goal (Carter, 2026-06-26)
1. Account **self-signup** live ASAP.
2. **Hide every tab except Training** (admins keep full access).
3. **Per-person progress** in the admin Training view, incl. drill-down (lessons complete, where they left off, progress by subject).
4. **Finish the training curriculum** — extensive, accurate (zero hallucinations), easy to learn. (C2 / Round 18.)

## What shipped (admin/platform side — CEO)
- **Self-signup:** new `trainee` role (`auth.js` `VALID_ROLES`). Public `POST /api/auth/register` (rate-limited, validates, bcrypt, auto-login via `lfs_session` cookie). `public/signup.html` (linked from `login.html`). New trainees land in `/training/`.
- **Training-only lockdown:** `/api/me/portals` filter in `server.js` — non-admin **employees** see only the Training tile; admins keep all; customers untouched. Flag `TRAINING_ONLY_LOCKDOWN` in `server.js` to revert. `/signup.html` whitelisted in `pageRequiresAuth`. The endpoint also returns **`can_request_access`** (true for locked-down employees) which the launcher uses to (a) skip the single-tile auto-redirect so trainees actually land on the launcher, and (b) show the request button.
- **"Request additional permissions" (launcher → admin):** locked-down users stay on the launcher (no auto-redirect) and get a **Request additional permissions** button + free-text modal (`public/launcher.html`) → `POST /api/access-requests`. Requests land in a new `access_requests` table (migration `0078_access_requests.sql`) and surface in the **admin Settings modal → Access Requests** section (`public/admin.html`, `loadAccessRequests`/`resolveAccessRequest`), with a pending-count badge that also lights the Settings gear dot (`refreshSettingsDot`). Routes: `routes/access_requests.js` — POST (any authed user, rate-limited), `GET /api/admin/access-requests` (+ `/count`), `PATCH /api/admin/access-requests/:id` (approved|dismissed|pending). Granting access stays manual (role change / Portal Access); the table is the inbox + audit trail.
- **Admin progress view:** `public/training-admin.html` (linked in the admin rail via `app_nav.js`, key `training`).
  - Overview: `GET /api/training/admin/overview` — every active non-customer user (incl. 0%/not-started), completed/in-progress counts, `last_seen_at`, `created_at`, plus `total_lessons`. Per-person progress bars + team stats.
  - Drill-down (click a row → drawer): `GET /api/training/admin/user/:userId/detail` — overall %, **where they left off** (most recent in-progress lesson, else most recent activity), **per-subject progress bars** (every available catalog course, completed/total), recent lessons, cert attempts.
  - **Denominator source of truth:** `osp-training/src/data/course-catalog.js`. `routes/training.js` parses it (`curriculumCourses` / `curriculumSubjects` / `curriculumTotalLessons`) — sum of `lesson_count` for `available:true` courses (currently **254** across 24 subjects).
  - Bug fixed in this pass: `:userId` detail + cert-attempts endpoints were `Number()`-ing a uuid (always 400). Now uuid-validated.

## Completion gating + pedagogy (Carter 2026-06-26)
- **Completion is competency-gated, enforced server-side** in `POST /api/training/progress` (`routes/training.js`): `status:'completed'` is only credited when the body has **`score` ≥ 70** (`PASS_THRESHOLD`) OR **`competency: true`**. Otherwise it's stored as `in_progress`. Response carries `completion_credited`, `credit_blocked`, `pass_threshold`. So every lesson needs a graded assessment or a competency-proving interaction, and the SPA must send the proof + only show "done" when credited.
- **SPA completion wiring (now on main):** `osp-training/src/components/LessonLayout.jsx` exposes a `LessonProgressContext` with `reportScore(pct)`; `primitives/Quiz.jsx` calls it on finish. A ≥70% quiz auto-credits (`markComplete(pct)` → server gate) and the footer shows a "✓ Complete" badge; below 70% it shows a "need 70%" hint. **The manual "Mark complete" button is removed entirely** (completion is solely testing/interactive, per Carter). Brought over from C2's R18 branch (minus the button) so the live app's admin progress bars actually fill. `Quiz.jsx` also normalizes the `{id,text}` + `correctId` option format used by ~24 lesson files.
- **Teaching-quality bar** (content/SPA = C2's R18 scope): easier plain-language verbiage (define jargon, scannable); more + varied interactivity beyond multiple-choice (drag-drop, label-the-diagram/hotspot, matching, ordering, scenarios, calculators/simulators); deeper assessment that's **cumulative within a subject and interleaves prior subjects**; polished consistent look; accurate **authored SVG diagrams** for technical visuals (no AI-generated raster for facts). Full spec in `briefs/claude-2.md` → Round 18 → "Pedagogy, interactivity & assessment".

## Per-staff content visibility (Carter 2026-06-26)
Admin can control what training each person sees — **track (OSP/ISP/Cert) → subject (course) → lesson** — with cascade. Default = **see all**; restrict per person.
- **Model** (migration `0079_training_content_access.sql`): `training_presets` + `training_preset_scopes` (reusable allow-lists), `user_training_access` (base `all|preset|none` + `preset_id`), `user_training_overrides` (per-user `show|hide`). Resolution + endpoints in `routes/training.js`: `GET /my-content` (fails open — curation, not security; admins always see all), `GET /catalog-tree`, presets CRUD, `GET/PUT /access/:userId` (admin-gated). Admin overview + per-user detail denominators now use the per-user **visible** lesson count.
- **Admin UI** (`public/training-admin.html`): "Content access" → Presets modal (full track→subject→lesson checkbox tree); per-person detail drawer → base = See all / a preset + advanced show/hide override tree.
- **SPA enforcement** (`osp-training`, `useMyContent` hook): ProductChooser hides unavailable tracks; Splash filters subjects; CourseView filters lessons + scopes %; LessonRouter locks hidden lessons; CertTrackChooser filters cert content. Lessons ship as static bundles → this is *what each person sees/is assigned*, not DRM.
- Verified live: OSP-only trainee sees only OSP tile; cert course/lesson blocked; per-user denominator reflects the visible set.

## ⛔ R18 content incident — QUARANTINED (2026-06-27)
C2 deviated from the mandated **research → author → red-team** process and authored/expanded training content **from memory** (no research, no RT). Objective evidence from git (`origin/main...origin/claude-2/training-curriculum`): **81 lesson files / ~1,700 lines changed, but 0 research-logs and only 1 red-team report**; C2's own last commit was `revert: remove unverified prose content from T20/T21/T22`. For "cannot-be-wrong" government/team training, this content is **rejected**.
- **Containment (verified):** none of it is on `main` or live. Main carries the prior properly-audited content. R17 (`claude-2/contractor-timeclock`) is fully merged and never touched training. The only R18 artifacts on main are 2 **code** files (LessonLayout.jsx + primitives/Quiz.jsx — the completion-gating wiring; no factual claims).
- **Decision (Carter, option A):** **QUARANTINE the whole R18 content branch — do NOT merge it, do NOT delete it** (forensic record). Re-author R18 improvements properly later. Salvage only specific accuracy *corrections* that come with a real citation, each **re-verified by the CEO** before cherry-pick.
- **HARD MERGE GATE (now standing):** no training content merges without a per-topic **research-log (citations) + red-team report**. No artifacts = not merged. Quiz questions / "expanded detail" count as content and need the same backing. See `briefs/claude-2.md` top (STOP block).
- The R18 *teaching-quality goals* (easier verbiage, varied interactivity, cumulative assessment, SVG diagrams) remain valid — but must be delivered through the gated process, not from memory.

## Curriculum buildout (content side — C2, Round 18)
Brief: `briefs/claude-2.md` → "Round 18". Scope = `osp-training/` content only (off-limits to C2: `routes/training.js`, `public/training-admin.html`, `server.js`, `auth.js`, `app_nav.js`).
- **Established process (do not reinvent):** research → author → red-team (RT) verify.
  - Editorial rulebook: `osp-training/docs/field-vs-textbook-research.md`.
  - Lesson format: `osp-training/src/lessons/schema.md`; template = `T01`.
  - Sources/citations: `osp-training/docs/research-logs/moduleNN-*.md`.
  - Accuracy verification: `osp-training/docs/red-team-reports/*` (nothing ships with an open hallucination flag).
- **Gaps:** topics flagged `available:false` / "coming soon" in the catalog (T10–T17 range) + open red-team findings. Carter: parallel research sub-agents + independent RT pass; data must not be wrong; easy-to-learn formatting.
- Cadence: C2 branch `claude-2/training-curriculum`, delivers per-topic, CEO reviews/merges.

## After the pivot (do not lose)
Resume **Phase D** (keystone inspection coverage by SA/WO# → delete legacy `routes/inspection.js` + `routes/permits.js`; **deletion pre-authorized**), then the rest of the keystone/billing/client-portal roadmap. Projects Phases A/B/C done+merged. See `HANDOFF.md`, memory `project_keystone_status`, `project_training_launch_pivot`.

## Deploy/cost notes
- Railway cost driver = **44GB Postgres volume backed up continuously** (~$26/mo) for a 15MB DB. Fix: disable + delete volume backups (test data only). See memory `reference_deployment`.
- Start command `node server.js` skips `prestart` auto-migrate; training pivot added **no** migrations (the `trainee` role is just a value; `training_progress` already exists).
