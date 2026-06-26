# Training Launch — design & build record

Living record of the **temporary training-launch pivot** (started 2026-06-26): ship the platform as a training tool for the team while the rest of the keystone roadmap is paused. Keep this current so design/build context survives conversation compaction.

## Goal (Carter, 2026-06-26)
1. Account **self-signup** live ASAP.
2. **Hide every tab except Training** (admins keep full access).
3. **Per-person progress** in the admin Training view, incl. drill-down (lessons complete, where they left off, progress by subject).
4. **Finish the training curriculum** — extensive, accurate (zero hallucinations), easy to learn. (C2 / Round 18.)

## What shipped (admin/platform side — CEO)
- **Self-signup:** new `trainee` role (`auth.js` `VALID_ROLES`). Public `POST /api/auth/register` (rate-limited, validates, bcrypt, auto-login via `lfs_session` cookie). `public/signup.html` (linked from `login.html`). New trainees land in `/training/`.
- **Training-only lockdown:** `/api/me/portals` filter in `server.js` — non-admin **employees** see only the Training tile; admins keep all; customers untouched. Flag `TRAINING_ONLY_LOCKDOWN` in `server.js` to revert. `/signup.html` whitelisted in `pageRequiresAuth`.
- **Admin progress view:** `public/training-admin.html` (linked in the admin rail via `app_nav.js`, key `training`).
  - Overview: `GET /api/training/admin/overview` — every active non-customer user (incl. 0%/not-started), completed/in-progress counts, `last_seen_at`, `created_at`, plus `total_lessons`. Per-person progress bars + team stats.
  - Drill-down (click a row → drawer): `GET /api/training/admin/user/:userId/detail` — overall %, **where they left off** (most recent in-progress lesson, else most recent activity), **per-subject progress bars** (every available catalog course, completed/total), recent lessons, cert attempts.
  - **Denominator source of truth:** `osp-training/src/data/course-catalog.js`. `routes/training.js` parses it (`curriculumCourses` / `curriculumSubjects` / `curriculumTotalLessons`) — sum of `lesson_count` for `available:true` courses (currently **254** across 24 subjects).
  - Bug fixed in this pass: `:userId` detail + cert-attempts endpoints were `Number()`-ing a uuid (always 400). Now uuid-validated.

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
