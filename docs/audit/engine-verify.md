# Engine verify — assessment engine (inc1–3) on `claude/ceo-fresh-boot-06gyuf`

> Auditor working report (first Sonnet-5 dispatch; graded vs Opus baseline `docs/audit/assignment-1.md` — same rigor/format). Detail here; thread carries a short summary + pointer (D018).
> Scope: code/schema only, per dispatch (no live DB — standing ceiling). Audited commits: inc1 `3558208`, inc2 `799592d`, inc3 `44a8f88a` on branch tip `1c0843e`. Method: source read (`routes/_assessment_pools.js`, `routes/training.js`, `migrations/0082_training_assessment_attempts.sql`, `content/training/assessment-pools/*`, `osp-training/src/hooks/useAssessment.js` + SPA primitives) + ran `node --test tests/assessment_engine.test.js` in an isolated worktree (`git worktree add`, no changes to my branch). Last updated 2026-07-01.

## Headline
**All 6 dispatched requirements PASS.** The engine is genuinely server-authoritative — no claimed-done-but-isn't. Found **one MEDIUM (real, will block CI as committed)** and **one LOW** divergence, both outside the 6-point scope but material to "done."

---

## Scope checklist (1–6, PASS/FAIL)

| # | Requirement | Verdict | Evidence |
|---|---|---|---|
| 1 | Server-authoritative draw + grade | ✅ PASS | `_assessment_pools.js` `drawQuestionIds`/`grade` — draw is server-side Fisher–Yates (`_shuffle`), grade recomputes from `drawn_question_ids` stored on the attempt row, never trusts client `answers`/`score`. `training.js:525` start draws + persists; `:579` submit reloads the attempt by `(id, user_id, assessment_id)`, ignores any client score. Confirmed by test `'a client-supplied score cannot fake a pass'` (10/10 tests pass, ran live). |
| 2 | Keys stripped on start | ✅ PASS | `ANSWER_KEY_FIELDS = ['answerIndex','correctMap','answer','answerDisplay']`; `stripAnswerKey` filters them before `drawnQuestionsForClient` ships questions in the `/start` response. Correctness is revealed only post-submit via `per_question` (`training.js:657`). Test `'drawnQuestionsForClient strips every answer key'` passes. |
| 3 | Ban-at-loader (typed/free-text throws) | ✅ PASS | `ALLOWED_TYPES = Set(['mc','multiple-choice','drag-match','dragdrop'])`; `validatePool` throws `type '...' not allowed (typed-answer ban...)` for anything else — structural, at load time, not a UI-only filter. Test `'validatePool rejects typed/free-text answers (Carter ban)'` passes with a `fill-in-blank` fixture. |
| 4 | Q2 repo-file pools | ✅ PASS | `POOL_DIR = content/training/assessment-pools/`; `_loadAll()` reads `fs.readdirSync` + `JSON.parse` per file — no DB table for pool content. `_fixture-demo.json` present as the mechanism-test fixture (2 mc + 1 drag-match), matches the documented format in `_readme.md`. |
| 5 | Unified attempts table + migration 0082 | ✅ PASS | `training_assessment_attempts`: `kind` CHECK `IN (lesson, topic_final)`, `status` CHECK `IN (open, submitted)`, `score` CHECK `0–100`, stores `drawn_question_ids`/`answers`/derived `score`/`correct_items`/`passed` — reproducible regrade + I11 replay. Idempotent (`CREATE TABLE/INDEX IF NOT EXISTS`). `training_cert_attempts` / `training_topic_capstone_attempts` untouched (no `ALTER`/`DROP` in the migration). |
| 6 | No-client-trust + gating | ✅ PASS | All 4 endpoints (`available`/`start`/`submit`/`attempts`) require `requireAuth()`. WP-A visibility honored: non-admin `/available` filters lesson-tied pools through `loadUserVisibility` (`v.all \|\| v.lessons.has(lessonId)`); `/start` re-checks the same gate server-side and returns **404** (not a leak — matches the WP-A hide-completely model) rather than silently allowing a direct-POST bypass. |

## Divergences (outside the 6-point checklist, found in the course of the audit)

### MEDIUM — `schema.sql` not regenerated; **will fail CI as committed**
`schema.sql` on this branch has **zero** references to `training_assessment_attempts` — migration `0082` was added but `npm run schema:sync` was never re-run/committed. `.github/workflows/test.yml:72-89` runs `npm run schema:sync` after tests and **hard-fails the build** (`git diff --exit-code schema.sql`) if the committed file doesn't match what regenerating from migrations produces. This isn't cosmetic — as-is, this branch cannot pass CI/merge to `main` without a `schema:sync` commit. Not a design flaw in the engine itself — a missed build step.

### LOW — mechanism-test fixture pool is exposed to trainees via the API (contradicts its own README)
`content/training/assessment-pools/_readme.md` states: *"Files prefixed `_` (like `_readme.md` and any `_fixture*`) are mechanism-only, NOT content, and are exempt — they must never be published to trainees."* But the loader only excludes files literally starting with `_readme` (`_assessment_pools.js:58`: `!f.startsWith('_readme')`) — `_fixture-demo.json` **is loaded as a real pool** and is **not filtered out** of `GET /assessment/available` or blocked from `POST /assessment/_fixture-demo/start` for a non-admin/trainee (it has no real catalog `lessonId`, so the WP-A visibility filter's `!tree.allLessons.has(...)` branch lets it through unconditionally). Not reachable via normal SPA navigation (no lesson wires to `_fixture-demo`), but any authenticated user (including a trainee) can list it and start/submit it via a direct API call. Content itself is trivial ("2+2=?") — no gated/government material at risk — but it's a real gap between the documented exemption rule and the loader's actual filter (`_readme` only, not `_*`).

## Not re-litigated (informational only, not a finding)
The migration header claims *"must NOT deploy until Carter confirms DB backups are on — apply to dev DB for build/verify only; production apply is gated."* There is no code-level enforcement of that gate (`run_migrations.js`/`auto_migrate.js` have no backup-check) — it's a process note, not a technical one. Not flagging as a finding since `CLAUDE.md` already states backups are on as of 2026-07-01, so the stated precondition is satisfied; noting only so Planning knows the "gate" is conventions-only if it ever matters again.

## Comparison to Opus baseline rigor
Same method as `assignment-1.md`: targeted source reads + line citations, ran the actual test suite rather than trusting it exists, cross-checked a documentation claim (`_readme.md`) against the loader's real filter logic instead of accepting the inline code comment at face value, and checked the CI gate definition rather than assuming `schema.sql` drift is harmless.
