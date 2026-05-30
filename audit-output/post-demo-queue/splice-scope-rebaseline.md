# Splice subsystem — scope re-baseline (W220)

**Verdict: INCREMENTAL improvements, NOT a rewrite.** Clean-sheet rewrite
risk exceeds the value. Recommend 6 small sequential waves over post-demo
backlog (lowest priority per Carter — splice rewrite explicitly LAST in
queue).

---

## Current state metrics (main HEAD)

| Surface | Lines | Notes |
|---|---|---|
| `/home/user/Launch-Database/routes/splice.js` | 7314 | Largest single file in repo |
| `/home/user/Launch-Database/public/splice.html` | 9763 | Largest portal HTML |
| `/home/user/Launch-Database/public/splice_view.html` | (separate) | Public contractor read-only view |
| Endpoints (`app.get`/`post`/`put`/`delete`/`patch`) | 104 | Counted via grep on `routes/splice.js` |
| Migrations | 21 | `0001` through `0027_splice_*` (non-contiguous; 0009, 0023 in unrelated waves) |

Migration list (chronological, for reference):

```
0001_splice_schema.sql                  0017_splice_cable_states.sql
0007_splice_strand_state.sql            0018_splice_location_types.sql
0008_splice_strand_metadata.sql         0019_splice_cable_types.sql
0010_splice_templates.sql               0020_splice_project_public_tokens.sql
0011_splice_versions.sql                0021_splice_comments.sql
0012_splice_field_markup.sql            0022_splice_templates_public.sql
0013_splice_geography.sql               0024_splice_trayless.sql
0014_splice_design_imports.sql          0025_splice_field_loss_records.sql
0015_splice_splitters.sql               0026_splice_cable_category.sql
0016_splice_csv_paste.sql               0027_splice_custom_layers.sql
```

(Confirm count: `ls migrations/ | grep -i splice | wc -l` = 21.)

---

## Top 3 risks of a clean-sheet rewrite

### Risk 1 — Data migration of live splice projects

Production has splice projects with shipped PDF deliverables that
contractors are actively executing in the field. A schema rewrite would
need:

- 100% data-preserving migration for every existing `splice_*` table
- Validation pass per project (locks intact, field markups attached,
  field loss records reconciled to the right strand)
- Rollback plan if a project's data round-trips lossy

Cost is large; benefit (cleaner code) is invisible to Carter's customers.

### Risk 2 — Public-token URL continuity

Contractors hold PRINTED PDFs with QR codes pointing at:

- `GET  /splice/field/:token` — `routes/splice.js:3261-3290`
- `POST /splice/field/:token/markup` — `routes/splice.js:3292-3334`
- `GET  /splice/field/:token/markups/:id/image` — `routes/splice.js:3336-3416`
- `POST /splice/field/:token/loss-records` — `routes/splice.js:3699+`
- `GET  /splice/view/:token` — `routes/splice.js:3056-3074`
- `GET  /api/splice/view/:token/hydrate` — `routes/splice.js:3083+`

These URLs are SACRED. If the rewrite changes them, every QR code in
every contractor truck becomes dead. We cannot reissue tokens en masse —
the splice tokens table (`splice_closure_public_tokens`,
`splice_project_public_tokens`) is the source of truth and the printed
PDF is the field-side mirror.

Any rewrite path MUST preserve these exact URL strings verbatim, the
exact response shapes (`/api/splice/view/:token/hydrate`), and the token
lookup semantics (rate-limited 5 req/10s per token per `routes/splice.js`
H-4 fix near `L3079-3089`).

### Risk 3 — PDF rendering parity

`splice.html` generates the field-deliverable PDF (Puppeteer-rendered).
A rewrite that changes the DOM structure breaks contractor expectations
of where strand callouts, splitter diagrams, and loss-budget rows print.
Field crews have learned to read these PDFs in a specific layout.

---

## Recommendation: 6-wave incremental plan

Land in queue order. Each wave is small (1-3 day cost), independently
deployable, and preserves the public-token URL contract.

### SR-1 — Extract public-token routes into `routes/splice_public.js`

**Scope:** Move the 6 public-token routes (listed in Risk 2) into a
dedicated `routes/splice_public.js` file. PRESERVE URL strings exactly.
PRESERVE response shapes exactly. PRESERVE rate-limit behavior.

**Reduction:** ~600 lines out of `routes/splice.js`.

**Validation:** Run existing Playwright contractor-flow spec against new
file. Diff response bodies vs git HEAD per URL.

**Why first:** Lowest risk — the public-token routes have the cleanest
boundary (no auth, no shared state with the editor surface). They're the
sacred-URL surface that must be preserved, so extracting them first
isolates them from future editor changes.

### SR-2 — Extract validation logic into `routes/_splice_validation.js`

**Scope:** The existing `_splice_validation.js` helper already exists
(referenced in CLAUDE.md ledger). Audit which validation logic in
`routes/splice.js` should move into it. Likely candidates: strand
continuity checks, splitter mass-balance, cable-category rules.

**Reduction:** ~400-700 lines.

### SR-3 — Extract template + version routes into `routes/splice_templates.js`

**Scope:** `splice_templates` migrations 0010 + 0022 imply a coherent
sub-feature. Move CRUD for templates + versioning into a dedicated file.

**Reduction:** ~500-800 lines.

### SR-4 — Extract field-side write routes (markup, loss-records)

**Scope:** Field-side writes (contractor uploads photos, records loss
measurements) are coupled with the public-token surface but warrant
their own file once SR-1 lands. Includes `_field_markup.js` extraction.

**Reduction:** ~600-900 lines.

### SR-5 — Splice editor frontend refactor

**Scope:** `public/splice.html` is 9763 lines. Extract inline CSS into
`public/css/splice.css`, inline JS into `public/js/splice/*.js` modules.
Keep PDF rendering DOM unchanged (Risk 3).

**Reduction:** Frontend file shrinks dramatically; logic moves to
maintainable modules.

### SR-6 — Cleanup remainder of `routes/splice.js`

**Scope:** Whatever's left after SR-1 through SR-4. Should be the
authenticated editor API surface (lock/unlock, custom layers, validation
endpoints, strand state CRUD).

**Target final size:** `routes/splice.js` ≤ 3000 lines.

---

## Token URL contract (SACRED — do not modify)

These strings appear in printed PDFs in the field. Any change requires
re-issuing tokens AND reprinting all field deliverables — operationally
infeasible.

```
GET  /splice/field/:token                    — public HTML shell
POST /splice/field/:token/markup             — public photo upload
GET  /splice/field/:token/markups/:id/image  — public image fetch
POST /splice/field/:token/loss-records       — public loss recording
GET  /splice/view/:token                     — public read-only viewer HTML
GET  /api/splice/view/:token/hydrate         — public read-only data hydrate
```

Token tables (also fixed):
- `splice_closure_public_tokens` (migration 0020 → field markup tokens)
- `splice_project_public_tokens` (migration 0020 → view-share tokens)

The hydrate endpoint's response shape (`routes/splice.js:3083+`) is
ALSO fixed — contractor browsers cache structure expectations. Adding
optional fields is safe; renaming or removing fields breaks contractors
mid-job.

---

## Sequencing notes

- All SR-* waves are independent (different file extractions). Could
  run in parallel if push-contention managed — but recommend sequential
  to keep splice.js diffs reviewable.
- No wave touches the public-token URL strings or response shapes.
- No migration changes — pure code-organization refactor.
- Test coverage: existing Playwright `tests/browser/splice*.spec.js`
  must pass on every SR-* PR before merge.

---

## When to revisit "clean-sheet rewrite" verdict

Only if ALL of:

1. Per-wave incremental gains stall (we can't shrink `routes/splice.js`
   below ~3500 lines via extraction)
2. A material new feature (e.g. multi-cable splice cross-references)
   requires schema changes that the current schema can't accommodate
3. Carter has 3+ weeks of dedicated splice-rewrite budget AND a way to
   migrate the contractor printed-PDF QR codes (likely impossible)

Until then: incremental. Splice rewrite is explicitly lowest priority
in CLAUDE.md queue per Carter directive.
