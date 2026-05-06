# SPLICE_BUILD_PLAN.md — Splice Matrix v2 roadmap

> Working roadmap for evolving the Phase 1 splice matrix into a competitive
> engineering-firm deliverable tool. Update as work lands; deviate when the
> facts on the ground change. End goal stays fixed: **premium splicer
> deliverable + faster engineer workflow.**

---

## ▶ RESUME HERE — current position

**Branch:** `claude/splice-matrix-railway-setup-IIG3Q`
**Last splice commits:** Phase 2C #9 splitters (`5bd51d1`) +
Phase 2C #13 CSV paste (`24897b6`) + ISSUE-3 epsilon-comparison
fix (`3c8e6c8`) + tests for #9/#11/#13 (`10db713`/`9f4bf2a`/
`751f978`).

**Status:** Phase 2A complete. Phase 2B complete. Phase 3
complete (3A–3E shipped; 3F DWG intentionally skipped).
Phase 2C: #9 splitters + #11 path tracing + #13 CSV paste all
shipped + tested. #10 slack modeling in flight. #8 multi-cable
canvas not yet started.

**To pick this back up in a fresh session:**

1. Read this file top-to-bottom (it's the source of truth).
2. Glance at `routes/splice.js`, `routes/_splice_validation.js`,
   `public/splice.html`, `tests/splice*.test.js` to remember the
   shape of what's built.
3. Pending items: 2C #8 multi-cable canvas, #10 slack/service
   loop (in flight). When 2C is fully shipped, the next horizon
   is owner-driven from production feedback.
4. Worker dispatch lessons: (a) the worktree harness sometimes
   bases off stale `main`. Every dispatch prompt now embeds an
   `expected_parent_sha` pre-flight check; the project-tracking
   persona has the same check built in. (b) Workers given an
   absolute repo path in their prompt ignore the harness-assigned
   worktree and operate on the orchestrator's main worktree —
   benign when only one worker is active, races on git's index
   if two run concurrently. Sequential dispatch is safer than
   isolated-worktree parallel right now.
4. Note: slot 0009 ended up holding the unrelated
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

### 12. (Folded into Phase 3.) KMZ/KML import lives in 3B/3C now.

### 13. CSV/Excel paste import
Frontend paste handler with column-mapping wizard. Server endpoint
`POST /api/splice/projects/:id/import-paste`. Realpolitik move to
migrate designers off Excel.

---

## Phase 3 — Geographic editor + ACAD/KMZ design ingest

End goal: a satellite-map view where closures are clickable markers,
cables are polylines that follow the actual fiber route to the C.O.,
and the same closure row is the one in the tray editor and on the
splicer field-markup QR. Multi-engineer ingest: AutoCAD designers
submit DXFs (or KMZs) into a staging area; the master designer
reviews the diff and merges.

The differentiator: in OZmap and netTerrain the "map" and the
"splice plan" are parallel datasets that drift. Here the closure on
the satellite tile IS the closure in the tray editor — one row, two
views. Saves the designer from the "now reconcile" step that kills
weekends.

Owner direction 2026-05-06: build straight through 3A → 3E. DWG via
OdaFileConverter (3F) is skipped — designers can export DXF or KMZ
from any modern AutoCAD/Civil 3D and that covers the workflow.

### 3A. Foundations: schema + map view

Migration `0013_splice_geography.sql`:
- `splice_locations.latitude  DECIMAL(10,7) NULL`
- `splice_locations.longitude DECIMAL(10,7) NULL`
- `splice_cables.path_geojson JSONB NULL` — LineString GeoJSON

No PostGIS. Plain DECIMAL columns + GeoJSON in JSONB keep the stack
unchanged — every consumer that doesn't care about geography just
ignores the new columns. Adding PostGIS later is a non-breaking
upgrade if we hit query volume that needs it.

Frontend: a "Map" tab in the splice editor (alongside the existing
Konva canvas). MapLibre GL JS via CDN. Esri World Imagery as the
default basemap (free, attributed, the OSP standard). Closure
markers, cable polylines from the new columns. Click marker → opens
the existing closure inspector (no parallel UI to maintain). Edit
mode: drag a marker to update lat/lon, draw a polyline along the
satellite to set a cable path, snap-to-marker for endpoints.

API:
- `PUT /api/splice/locations/:id/coords` — `{ latitude, longitude }`
- `PUT /api/splice/cables/:id/path` — `{ path_geojson: <LineString> }`

### 3B. KMZ export

Generate KML from the schema (locations as `Placemark`+`Point`,
cables as `Placemark`+`LineString`, splice metadata in
`ExtendedData`), zip via `archiver`. The KMZ opens in Google Earth,
ArcGIS, QGIS — the one format the splicer's GIS person will accept.
No new schema. Round-trip test: a KMZ exported from this same tool,
re-imported, should produce the same locations/cables.

Endpoint: `GET /api/splice/projects/:id/export-kmz`.

### 3C. KMZ import + import-staging schema

Migration `0014_splice_design_imports.sql`:
- `splice_design_imports (id, project_id, source_filename,
   source_format, uploaded_by_staff_id, uploaded_at, status,
   decision_at, decision_by_staff_id, summary_jsonb)` —
   status ∈ `'pending', 'applied', 'partially_applied',
   'rejected'`.
- `splice_design_import_changes (id, import_id, change_type,
   target_table, target_id, payload_jsonb, decision)` —
   change_type ∈ `'add', 'update', 'delete'`,
   decision ∈ `'pending', 'approved', 'skipped'`.

Endpoint `POST /api/splice/projects/:id/imports` accepts multipart
upload of a KMZ or DXF. Server parses (KMZ via `@tmcw/togeojson`;
DXF in 3D), produces a diff against the live tree, stores the
proposed changes as `splice_design_import_changes` rows. The
endpoint DOES NOT mutate the live tree — it stages.

UI: review modal lists the staged changes with per-row checkboxes
(approve / skip), shows a side-by-side preview where applicable.
Apply commits the approved subset in a transaction.

### 3D. DXF import + georeferencing

`dxf-parser` reads geometry. Two paths:

1. DXF in true geographic coordinates (state plane / UTM): resolve
   via `proj4js` to lat/lon. The header WCS is usually enough.
2. DXF in "model space" units (the typical OSP designer workflow):
   the import wizard prompts for two control points — pick a known
   feature in the DXF, click the corresponding spot on the
   satellite map, repeat. Compute affine transform, apply to all
   geometry.

Layer mapping: per import the user picks "which AutoCAD layer is
closures, which is fiber routes, which is conduit." The mapping
saves per-client so a returning engineer's second import is one
click. Stored in a small `splice_client_layer_mappings` table or
inline on `clients.splice_layer_mapping_jsonb` — pick the lighter
option at build time.

### 3E. Submit-and-review merge UX

The actual workflow piece that keeps a master map clean:

- Each engineer uploads a DXF/KMZ → server stages a pending import.
- Master designer reviews staged imports, sees:
  - "Adds: 12 closures, 3 cables"
  - "Updates: 4 closure positions moved"
  - "Removes: 2 closures (in master, not in submission)"
- Per-row approve/skip with optional comment.
- Approved subset commits; the rest stays staged or gets rejected.
- Audit log: the `splice_design_imports` row is the durable trace
  of who submitted what when.

No real-time conflict resolution in v1 — the file lock from Phase 1
covers concurrent edits during merge. Two engineers submitting the
same import at the same time both end up in `pending`; the master
designer picks one, applies, then handles the other.

### 3F. (Skipped.) DWG via OdaFileConverter sidecar

DXF + KMZ cover the workflow. Reconsider only if a customer can't
be persuaded to export one of those.

---

## Anti-features — DO NOT BUILD

- Login-required splicer mobile app. Splicers don't use them.
- Real-time multi-cursor (Figma-style CRDT). File-lock + SSE handles 95%.
- AI auto-routing / auto-design. Wrong audience.
- Salesforce-flavored ticketing/asset lifecycle. SiteTracker owns this.
- DWDM channel planning. Wrong audience.

(Earlier drafts of this list parked "real GIS map editing" as
out-of-scope; owner reversed that 2026-05-06. Phase 3 IS real GIS
editing, just without PostGIS for now.)

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
- 0011 splice_versions (Phase 2B #6, shipped — version snapshots +
  diff PDF)
- 0012 splice_field_markup (Phase 2B #7, shipped — public field
  tokens + photo upload to BYTEA)
- 0013 splice_geography (Phase 3A — lat/lon on locations,
  path_geojson on cables)
- 0014 splice_design_imports (Phase 3C — staging + audit table for
  KMZ/DXF submit-and-review)
- 0015 splice_splitters (Phase 2C #9, when needed — was 0013 in an
  earlier draft, bumped because Phase 3 took the slot)
- 0016 splice_cable_states (Phase 2C #10, when needed — was 0014)

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
