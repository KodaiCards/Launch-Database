# SPLICE_BUILD_PLAN.md — Splice Matrix v2 roadmap

> Working roadmap for evolving the Phase 1 splice matrix into a competitive
> engineering-firm deliverable tool. Update as work lands; deviate when the
> facts on the ground change. End goal stays fixed: **premium splicer
> deliverable + faster engineer workflow.**

---

## ▶ RESUME HERE — current position

**Branch:** `claude/splice-matrix-railway-setup-IIG3Q`
**Last splice commit:** Phase 2B #5 — closure templates + project
clone (this commit; migration `0010_splice_templates.sql`).
**Status:** Phase 2A complete. Phase 2B #5 done. #6 + #7 remain.

**To pick this back up in a fresh session:**

1. Read this file top-to-bottom (it's the source of truth).
2. Glance at `routes/splice.js`, `routes/_splice_validation.js`,
   `public/splice.html`, `tests/splice*.test.js` to remember the
   shape of what's built.
3. The planned next item is **Phase 2B #6 — Versioning + diff PDF.**
   Migration slot allocated: `0011_splice_versions.sql`.
4. Phase 2B order if proceeding straight through: #6 versioning + diff
   PDF → #7 no-login QR markup. Each is its own commit + push.
5. Note: slot 0009 ended up holding the unrelated
   `rename_inspection_team_to_construction` migration (Path B admin
   work landed mid-stream); the `splice_pdf_templates` table the plan
   originally reserved 0009 for stayed deferred — multi-template PDF
   is still inline-coded and a table only needs cutting if templates
   gain rules of their own.

**Things NOT to lose track of:**

- The end goal is a premium splicer deliverable + faster engineer
  workflow. Anything that doesn't move one of those two is noise.
- The PDF is the product. The canvas is the editor for the artifact.
- No-login splicer feedback loop is a real differentiator — Phase 2B
  #7 is what makes the QR codes already in the PDF actually
  meaningful.
- File-lock + SSE is good enough for now; don't burn budget on
  Figma-style multi-cursor (CRDT).
- Splice service has no Railway volume; #7 needs to either route
  uploads through admin's volume OR store small images as BYTEA in
  Postgres. Default to BYTEA for v2.
- `SPLICE_PUBLIC_URL` env var should be set on the splice Railway
  service to `https://launchfiber-splicematrix.xyz` so QR codes
  encode the right absolute URL.

---

## North star

The splice matrix is **the engineering firm's deliverable tool**, not a
fiber operator's asset platform. The PDF is the product; the canvas is the
editor for that artifact. Two unique advantages we're doubling down on:

1. **Closure-internal physical realism** — tray-by-tray fill bars, ribbon
   stacking, slack indicators. Most commercial tools show connectivity
   schematics, not the inside of the closure.
2. **No-login splicer feedback loop** — splicers don't sign in. Field
   markup happens via QR-code-on-PDF + public photo upload, not an app.

Position rules out: GIS editing, asset lifecycle, FTTH auto-design,
splicer mobile app, DWDM planning, AI auto-routing, Salesforce-flavored
ticketing.

---

## What Phase 1 already shipped (don't undo)

- `splice_*` schema (migration 0001). Standalone — no FK to projects /
  contracts / billing.
- Project CRUD + full-state hydrate with computed warnings.
- File-lock + 60s heartbeat + 10-min stale window + take-over.
- Locations, cables (TIA-598 fiber + tube auto-generation), closures
  (auto-generates trays), single splice, ribbon splice (12 splices
  grouped under one `ribbon_group`).
- Closure-models picklist that grows organically.
- Server-Sent Events stream for committed actions.
- Konva canvas: locations as columns, cables as multi-strand pipes,
  closures as boxes with tray fill bars, splice lines as bezier curves.
- Inspector pane: closure, tray, cable, location — each with edit /
  delete + cascade-aware confirmation.
- Puppeteer Tabloid PDF: cover page with cable summary + per-closure
  tray-by-tray tables.
- `tests/splice.test.js` smoke suite.
- Dedicated Railway service (`PORTAL_MODE=splice`) at
  `launchfiber-splicematrix.xyz`.

---

## Phase 2A — polish what we have (highest leverage, no schema gymnastics)

These are the quick wins. Build first.

> Status: ALL FOUR ITEMS SHIPPED.
> - PDF polish (1a67433)
> - Validation engine (3309cdf)
> - Ring-cut three-lane (598dbba)
> - Strand circuit naming (this commit)

### 1. PDF ruthlessly polished

**Why:** every Capterra/G2 review of every commercial tool says the PDF is
the weakest link. VETRO can't produce a drawing cities accept. Engineering
firms still hand-edit Excel and Visio in 2026 because no commercial tool
nails the field-grade splicer document.

**Files:** `routes/splice.js#_renderSpliceHtml`, new
`migrations/0007_splice_pdf_templates.sql`.

**Scope:**
- Cover page: revision block, designer initials, project metadata, client
  logo placeholder, static map snapshot
- Color swatch + color name on every fiber row
- Per-tray pages with empty as-built markup column + signature line
- QR code per closure linking to a public-read URL (sets up #7 below)
- Page footer: project, closure, page x of y, generation hash for
  change-detection
- Multi-template support: `splice_pdf_templates` table seeded with
  "default", expandable for client-specific styles

### 2. Validation engine

**Why:** "$50k truck-roll triggered by a color mismatch nobody caught at
design time." Every commercial tool has shallow rules; ours can be the
loudest.

**Files:** new `routes/_splice_validation.js`, hooked into
`routes/splice.js` hydrate endpoint + PDF export gate.

**Rules to ship:**
- Capacity overrun (closure tray full, more splices assigned)
- Double-splice (one strand referenced by two splice rows)
- Orphan strand (cut but no destination, when ring-cut model lands)
- Color-code mismatch (strand 1 → strand 7 with no documented rotation)
- Polarity APC/PC mismatch (when connector tracking lands)
- Ribbon-group integrity (12 splices exist + same tray + same direction)
- Closure-without-incoming-cable, location-without-closure orphans

Surface in hydrate `warnings` payload. Hard-block PDF export when fatal
errors exist (return 422 with the error list).

### 3. Ring-cut three-lane model

**Why:** biggest gap in commercial tools. No tool models
express / spliced / stored properly; everyone fudges with "midspan."

**Migration:** `0008_splice_strand_state.sql` — new table
`splice_strand_states (id, cable_id, location_id, strand_position, state
CHECK IN ('express','spliced','stored'), stored_length_inches, notes)`
keyed on (cable_id, location_id, strand_position).

**Default behavior:** every strand-at-location is implicitly `spliced`
if a splice row exists, otherwise `express`. The stored state is opt-in.

**UI:** canvas renders express strands as continuous lines through the
closure (no break); spliced as the existing curves; stored as a coil
icon at the closure's location. PDF: per-tray table gets three lanes —
EXPRESS rows at top, then SPLICED, then STORED.

### 4. Strand-level circuit naming

**Why:** designers increasingly need to deliver "strand 17 = Customer ABC,
strand 18 = backbone east." Cheap schema change, big perceived value.

**Migration:** `0009_splice_strand_metadata.sql` — add `circuit_name`,
`customer`, `notes` columns to `splice_fibers` (or a sidecar table to
keep them sparse).

**UI:** inspector "edit circuit" affordance on each fiber. PDF includes
circuit column when set.

---

## Phase 2B — make designers fast (high office value, medium build cost)

### 5. Templates and project copy-paste

**Why:** designers splice 144→144 straight-through 80% of the time. This
shaves an hour per project. OZmap and netTerrain do this; VETRO and 3-GIS
poorly.

**Migration:** `0010_splice_templates.sql` — `splice_closure_templates
(id, name, scope_client_id NULLABLE, model, tray_count, tray_capacity,
default_splices_jsonb, created_at)`. Nullable client_id lets a template
be project-wide or client-specific.

**Endpoints:**
- `GET/POST/DELETE /api/splice/closure-templates`
- `POST /api/splice/locations/:id/closures/from-template/:templateId`
- `POST /api/splice/projects/:id/clone`

**UI:** "Save as template" on closure inspector, "Apply template"
cascade in `openAddClosure` modal, "Clone project" in project list.

### 6. Versioning + diff PDF

**Why:** "the client redlined the splice plan; show me what changed." No
commercial tool produces a clean rev-A vs rev-B diff PDF.

**Migration:** `0011_splice_versions.sql` — `splice_project_versions
(id, project_id, version_number, snapshot_jsonb, created_at,
created_by_staff_id, label)`.

**Behavior:** auto-snapshot on commit when ≥10 minutes since last one
(debounced); manual "Save revision" button for explicit checkpoints.

**Diff:** walks two snapshots, classifies splices/closures/cables as
added / changed / removed. Diff PDF: per-tray pages show prior splices
in light gray strikethrough + new splices highlighted.

### 7. No-login splicer field markup via QR

**Why:** the differentiator no commercial tool nails. Every vendor
fights to put splicers in their CRM; we let them stay outside it.

**Migration:** `0012_splice_field_markup.sql` —
`splice_closure_public_tokens (token PK, closure_id, project_id,
expires_at, created_at)` plus `splice_field_markups (id, closure_id,
image_data BYTEA OR image_path, uploaded_at, splicer_name)`.

**File storage decision:** splice service has no volume. Two options:
- **a)** route uploads through admin's volume via a signed URL
- **b)** store as base64/BYTEA in Postgres for small images, capped at
  ~2MB

**(b) is simpler for v2; (a) is right for production scale.** Default
to (b); revisit when volume gets uncomfortable.

**Endpoints:**
- `GET /splice/field/:token` — public, no auth, renders minimal closure
  detail + photo upload form
- `POST /splice/field/:token/markup` — multer image upload, capped,
  rate-limited

**Abuse prevention:** rate-limit by IP (Express middleware), capped
file size, signed-token expiry, optional CAPTCHA layer if abuse appears.

---

## Phase 2C — depth (defer until 2A and 2B prove out)

### 8. Multi-cable closure scenarios with rich canvas
Three or four cables converging on one closure with mixed
express/splice/store mixes per cable. Data model already supports it —
purely a Konva rendering improvement.

### 9. Splitters for FTTH-adjacent jobs
Migration `0013_splice_splitters.sql` — `splice_splitters` table with
ratio (1×2 / 1×4 / … / 1×64) + `splice_splitter_outputs`.
Canvas + PDF + validation rules. Defer until a customer asks.

### 10. Slack / service loop modeling
Per-cable-at-closure attribute. Either extend `splice_strand_states`
with `slack_length_inches` or sibling `splice_cable_states` table.
Cleaner as sibling.

### 11. Path tracing across closures
Recursive graph walk; cache for performance on large projects. New
endpoint `GET /api/splice/fibers/:id/path` returning the full strand
chain. Canvas highlights all splices on the path when a fiber is
selected.

### 12. KMZ/KML import for cable routes
`POST /api/splice/projects/:id/import-kmz` accepting multipart upload,
parsing via `togeojson`. No PostGIS needed — just LineString import.
Static map snapshot for PDF cover page.

### 13. CSV/Excel paste import
Frontend paste handler with column-mapping wizard. Server endpoint
`POST /api/splice/projects/:id/import-paste`. Realpolitik move to
migrate designers off Excel.

---

## Anti-features — DO NOT BUILD

- Login-required splicer mobile app. Splicers don't use them.
- Real-time multi-cursor (Figma-style CRDT). File-lock + SSE handles 95%.
- Real GIS map editing. PostGIS is a tech-stack change. Stop at
  KMZ import + static maps.
- AI auto-routing / auto-design. Wrong audience.
- Salesforce-flavored ticketing/asset lifecycle. SiteTracker owns this.
- DWDM channel planning. Wrong audience.

---

## Migration slot accounting

Slots allocated, in order:
- 0001 splice_schema (Phase 1, applied)
- 0002 engineering_contract_program (Path B)
- 0003 drop_clients_is_rus (Path B)
- 0004 drop_project_types_table (Path B)
- 0005 rus_pricing_seed_program (Path B)
- 0006 jobs_program_scope (Path B)
- 0007 splice_strand_state (Phase 2A #3, shipped — pdf_templates was
  deferred since multi-template support didn't need a table for v2)
- 0008 splice_strand_metadata (Phase 2A #4, shipped)
- 0009 rename_inspection_team_to_construction (Path B admin, shipped —
  not splice work; the slot the plan originally reserved for
  `splice_pdf_templates` got consumed by an unrelated rename. PDF
  templates remain deferred and unscheduled)
- 0010 splice_templates (Phase 2B #5, shipped — closure templates +
  project clone endpoints)
- 0011 splice_versions (Phase 2B #6)
- 0012 splice_field_markup (Phase 2B #7)
- 0013 splice_splitters (Phase 2C #9, when needed)
- 0014 splice_cable_states (Phase 2C #10, when needed)

Renumber if reality demands. The runner sorts by filename so as long as
allocations stay sequential within their landing window, ordering is
fine.

---

## Working principles for autonomous build

- Each feature gets its own commit with a self-contained scope. Push
  after each so progress is visible and reverts are easy.
- Schema changes + their backfill + the route work + the UI affordance
  all land together when feasible. A half-shipped migration is a trap.
- New tests for new features. Don't grow the test file past readability;
  split into `tests/splice_<feature>.test.js` if a single file exceeds
  ~300 lines.
- Hard-block boot only on bugs that affect existing services. Splice-
  specific bugs surface as 500s on splice endpoints; non-splice services
  stay healthy. The migration runner is transactional per file so a bad
  migration aborts itself.
- Update this doc as features land. Mark items shipped with a
  `(shipped: <commit>)` suffix so the next build session can pick up
  cleanly.
- Treat any field feedback (splicer or engineer) as the highest-priority
  redirect. The plan is a guide, not a contract.

---

*Last updated 2026-05-05 — initial draft after the splice tool research
pass. Phase 1 shipped at b61d00f; canvas + cable/location inspector
landed at 2a843a6.*
