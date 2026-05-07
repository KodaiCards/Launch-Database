# SPLICE_BUILD_PLAN.md — Splice Matrix v2 roadmap

> Working roadmap for evolving the Phase 1 splice matrix into a competitive
> engineering-firm deliverable tool. Update as work lands; deviate when the
> facts on the ground change. End goal stays fixed: **premium splicer
> deliverable + faster engineer workflow.**

---

## ▶ RESUME HERE — current position

**Branch:** `claude/splice-matrix-railway-setup-IIG3Q`
**Last splice commit:** Phase 2C #8 multi-cable canvas (`ed91a0c`).

**Status:** Phase 1, Phase 2A, Phase 2B, Phase 2C, and Phase 3 are
all complete on this branch. #8 multi-cable canvas, #9 splitters,
#10 slack modeling, #11 path tracing, and #13 CSV paste all
shipped + tested. #12 was folded into Phase 3. 3F (DWG sidecar)
intentionally skipped. The branch is at a natural pause — next
work is owner-driven from production feedback.

**To pick this back up in a fresh session:**

1. Read this file top-to-bottom (it's the source of truth).
2. Glance at `routes/splice.js`, `routes/_splice_validation.js`,
   `public/splice.html`, `tests/splice*.test.js` to remember the
   shape of what's built.
3. Phase 2C now shipped end-to-end. The branch contains the
   full splice tool roadmap minus deferred items. Open a PR to
   `main` when ready for human review.
4. Worker dispatch lessons learned this session:
   (a) The worktree harness sometimes bases off stale `main`.
   Every dispatch prompt now embeds an `expected_parent_sha`
   pre-flight check; the project-tracking persona has it baked
   into its body.
   (b) Workers given an absolute repo path in their prompt ignore
   the harness-assigned worktree and operate on the orchestrator's
   main worktree — benign for a single worker, but two parallel
   workers race on git's index. Sequential dispatch is safer than
   isolated-worktree parallel until the harness behavior is
   pinned down.
   (c) `git diff --stat` against an agent commit can show enormous
   bogus deltas if the agent's branch was based on stale `main`.
   Always reach for `git diff <orchestrator-HEAD>..<agent-commit>`
   to see the real change set.
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

## Phase 4 — competitive-research-driven roadmap

Owner-approved 2026-05-06 after the May 2026 competitive research
sweep (`research/01-06_*.md`). Each item below corresponds to a real
gap, anti-pattern, or differentiator the survey surfaced.

Priority within tiers is build-order. Tier 1 → Tier 2 → Tier 3.

### Tier 1 — high leverage, low–medium effort

#### 4.1 No-login read-only web view of a splice project
Replaces the KMZ-by-email stakeholder loop the industry uses today.
A signed-token URL renders the whole project (map + closure
inspectors + tray view) in read-only mode with no auth required.
Reuses the Phase 2B #7 token mechanism (`splice_closure_public_
tokens`) but at the project level.

- New migration `0020_splice_project_public_tokens.sql` mirroring
  the closure-token table but keyed on `project_id`.
- New endpoints: `POST /api/splice/projects/:id/public-tokens`
  (mint), `GET /splice/view/:token` (public, no auth, render).
- New file `public/splice_view.html` — read-only map + diagram +
  closure inspector. Lazily loads MapLibre, uses the same hydrate
  endpoint, no Konva editing layer, no inspector edit controls.
- `pageRequiresAuth()` in `server.js` allows `/splice/view/`.

#### 4.2 Two-letter TIA-598 codes overlaid on color fills
Splice.me does this; we don't. Important for grayscale print,
color-deficient users, and Slate/White confusion at fast-glance.

- Update Konva canvas: render a 2-char abbreviation (`BL`/`OR`/`GR`
  /`BR`/`SL`/`WH`/`RD`/`BK`/`YL`/`VL`/`RS`/`AQ`) inside or adjacent
  to each fiber/tube color chip.
- Update splicer-PDF render in `_renderSpliceHtml` (`routes/
  splice.js`): strand color cells get the same 2-letter code.
- Render a high-contrast border around each color block so the fill
  reproduces well in grayscale.

#### 4.3 Map ↔ diagram split view
IQGeo and netTerrain show this pattern; we have map + diagram as
separate tabs today. A split mode where selecting on one highlights
on the other is what the top tools do.

- Add a third view-tab "Split" alongside Diagram + Map.
- 50/50 horizontal split (configurable via drag-divider).
- Selection sync: clicking a closure on the map highlights its tray
  block on the diagram, scrolls it into view, and inverse.
- No new schema. No new endpoints. Pure UI.

### Tier 2 — medium effort, real differentiation

#### 4.4 Splice matrix tabular editor
Adjacent-tools shard #1 finding: every shop maintains an Excel
splice matrix AND a separate visual diagram, and they always
diverge. A tabular editor that mirrors the same data model
eliminates the dual-artifact problem.

- New view-tab "Matrix" alongside Diagram + Map + Split.
- Renders splices as rows: Cable A · Tube · Fiber · ↔ · Cable B ·
  Tube · Fiber · Splice type · Tray · Closure · Circuit · Customer.
- Inline edit each cell; bulk select for delete; filter/sort by any
  column; export to CSV.
- No schema change — the splice rows are already there. The matrix
  is a different read of the same data, with edits going through
  the existing splice/PUT/DELETE endpoints.

#### 4.5 Threaded comments on closures + splices
Replaces the "see email re: closure 14" workflow. No competitor in
the OSP space has this; it's the GitHub PR-comment pattern adapted.

- New migration `0021_splice_comments.sql`:
  `splice_comments(id, project_id, target_table, target_id, body,
   created_by_user_id, created_at, resolved_at, resolved_by_user_id,
   parent_comment_id NULL FOR THREADING)`.
- Endpoints: `POST/GET/DELETE /api/splice/comments` with the
  filter `?target_table=splice_closures&target_id=...`.
- UI: a comment thread under each closure inspector + each tray /
  splice row. Resolve toggle. New comment notifications via SSE.

#### 4.6 Public template library (cross-account closure templates)
Phase 2B #5 added per-client closure templates. Make a "public"
scope (visible across all accounts) so a community library forms.
Network-effect hook with low schema lift.

- Add a `published_at` + `published_by_staff_id` + `download_count`
  to `splice_closure_templates` (migration 0022).
- New endpoint `POST /api/splice/closure-templates/:id/publish`
  (admin-only) flips a template into the public pool.
- The closure-template picker (Apply Template modal) gets a third
  scope tab: Personal | Client | Public Library.
- Each apply increments the template's download_count.

### Tier 3 — high leverage, high effort

#### 4.7 Fujikura Splice+ fusion-splicer integration
Adjacent shard #2 finding: fusion splicers capture per-splice GPS
+ loss data, but nothing ingests it back into the design model. No
competitor closes this loop. Real moat if shipped.

- New migration `0023_splice_field_loss_records.sql`:
  `splice_loss_records(id, splice_id NULL, closure_id NULL,
   project_id, splicer_serial, gps_lat, gps_lon, splice_loss_db,
   measured_at, raw_payload_jsonb)`.
- Ingest endpoint `POST /api/splice/projects/:id/loss-records`
  accepting Fujikura Splice+ JSON exports (the format their cloud
  app produces). Auto-binds each record to the closest splice in
  the project by GPS distance + matching cable/fiber metadata when
  the splicer payload includes it.
- UI: per-splice row shows a loss badge (green ≤ 0.10 dB,
  yellow ≤ 0.25 dB, red > 0.25 dB) when a loss record is bound.
- The splicer field markup page (Phase 2B #7) gains a "Upload
  Splice+ JSON" affordance alongside the photo upload.

### Tier 4 — backlog (deprioritized 2026-05-06)

#### 4.8 (DEFERRED.) AI splice-photo validation
IQGeo shipped this in their July 2024 Workflow Manager — visual AI
analyzes field photos of a splice tray and validates against the
plan. Owner explicitly skipped this in favor of Tier 1-3 above.
Reconsider when Tier 1-3 ships and we have a corpus of photos
worth training/grading against.

---

## Phase 5 — Owner feedback (2026-05-06 PM)

Verbatim feedback after Phase 4 Tier 1 + Tier 2 shipped. Owner
hands-on session surfaced both bug-fixes and a request to
reshape the splice-creation UX toward the VETRO model. Recorded
here so nothing gets lost. Workers below dispatched in two
bundles (FIX-A small fixes, FIX-B UX overhaul).

### 5.A Bug bundle (FIX-A — smoke + small fixes)

1. **Smoke test failed** (CI red). Investigate root cause first
   — likely a regression introduced by 4.4/4.5/4.6 shipping
   touching shared state.
2. **Hybrid map basemap doesn't show streets.** Phase 3A added
   the hybrid toggle (satellite + street labels overlay); the
   labels overlay isn't actually rendering. Likely a tile URL
   or zindex issue.
3. **Warning bar must be dismissible.** Validation warnings at
   the top of the project view persist; need an X to dismiss
   per-session (not per-project, just hide until next reload).
4. **"24f" verbiage is hardcoded** across the cable-summary
   chips — should reflect the cable's actual `tube_size_fibers`
   when that's not 12 (so a 24-fiber-per-tube cable says "24f
   per tube", not "12f per tube" in the summary).
5. **Shift-click to multi-select fibers in single-splice mode.**
   Today only one fiber selectable at a time on each side.
   Shift-click should add to selection; selecting N on each
   side and clicking Splice should create N pairwise splices in
   the order picked (just like the existing batch mode but
   faster to invoke).
6. **Traceable unspliced/express/dead fibers.** The fiber
   trace tool currently only follows fibers that have at least
   one splice. Engineers need to trace a fiber that runs
   express through a closure (no splice — just a pass-through),
   AND fibers that are dead (intentionally unspliced) so they
   can audit "where does this fiber physically exist". The
   trace should walk the cable graph, not the splice graph.

### 5.B UX overhaul (FIX-B — VETRO-like flow)

Owner explicit ask: "Honestly if you can make the UI more
similar or just like vetros that'd be great." Concrete asks:

1. **Adding a Handhole shouldn't pop up closure prompts
   multiple times.** Today the HH-add wizard prompts for
   closure type / model repeatedly. Once the location is on
   the map it should sit there as a bare HH; closures get
   added LATER by clicking the HH and adding from its own
   inspector. Locations and closures are separate concepts
   and the UI should reflect that.
2. **Kill the file-ingest naming popup.** When a KMZ/DXF
   import lands, the current flow pops a modal asking the
   designer to name every newly-discovered location/cable.
   Owner hates this — wants the items to land as standalone
   shapes with placeholder names. Clicking on each opens its
   own dashboard where you can rename + add equipment from a
   persistent panel.
3. **Splice without trays.** Today every splice must live in a
   tray. Owner wants a "tray-less" splice mode: just say
   "Cable A fiber 7 ↔ Cable B fiber 23" with an optional note,
   no tray required. Useful for quick express-pass-through
   documentation and for splicing in handholes that are too
   small for an enclosure.
4. **Click-on-item shows the fiber paths within it clearly.**
   Already partially done for closures (shows splice rows);
   needs to extend to cables (show every fiber's path through
   every closure it traverses) and locations (every fiber that
   passes through, spliced or not).
5. **VETRO-style drag-and-drop multi-fiber splicing.** This is
   the headline ask:
   - Open a closure or HH inspector.
   - Left side shows Cable A's fibers as a stack of color
     swatches (with TIA-598 abbrev, per Phase 4.2).
   - Right side shows Cable B's fibers similarly.
   - Shift-click on Cable A picks N fibers in the order
     clicked.
   - Drag the selection over to Cable B; drop on a starting
     fiber. The N selected fibers splice in pairwise order
     starting from that drop point.
   - Visual feedback: selected fibers glow; valid drop
     targets highlight; invalid drops (already-spliced fiber)
     show a red overlay.
6. **Drag-and-drop at every handhole**, not just enclosure-
   model closures. The same drag-drop affordance should work
   in the HH inspector even when there's no formal closure
   shell.

### 5.C VETRO visual match + Handhole Inventory dashboard

Owner follow-up after dispatching FIX-B (2026-05-06 PM): the
behavior changes in 5.B are good, but they want the FULL VETRO
match — visual tokens, map style, layout, AND a Handhole
Inventory dashboard that doesn't exist today. Verbatim:
"I just want you to match vetros UI, map style, splicing drag
and drop, Handhole inventory all of it."

5.B already covers the splicing drag-and-drop. 5.C covers the
rest:

1. **Visual tokens to match VETRO.** Color palette, typography
   stack, density, button/chip/badge styles, panel chrome.
   Source the visual references from
   `research/07_vetro_visual_match.md` (a research shard
   dispatched in parallel with FIX-B to gather concrete VETRO
   screenshots and inferred design tokens).

2. **Map style match.** VETRO renders fiber routes as colored
   polylines on a clean street/satellite basemap with
   equipment markers as standard GIS symbols. Match this:
   route-line styling (color by fiber count or status, width
   by capacity), location markers as filled circles colored
   by type, hover-state highlighting. Replace any improvised
   styling with VETRO-equivalent.

3. **Layout match.** VETRO uses persistent right-pane
   inspector + bottom attribute table + left toolbar (the
   GIS-standard pattern). We already have the right-pane;
   add the bottom attribute table (matrix view from 4.4 was
   a tab — VETRO docks it as a peekable bottom panel) and a
   left-rail icon nav for view switches.

4. **Handhole Inventory dashboard.** When a handhole or
   location is opened, show a true inventory dashboard
   (replacing the current spare inspector):
   - Cables in/out summary with fiber-count totals
   - Fiber breakdown: N spliced, N express, N dead (clickable
     to filter the per-cable list)
   - Equipment installed: closures (with model/capacity),
     splitters, slack records
   - Photos uploaded (Phase 2B #7 field markups)
   - Loss records bound to this location (after 4.7 lands)
   - Comments thread (Phase 4.5)
   - GPS coordinates + last-edited metadata
   - Action bar: Edit, Add closure, Add splice, Add slack,
     Add splitter, Upload photo, Generate splicer page, Delete

5. **Cable inventory dashboard.** Same treatment for cables:
   route summary, fiber-by-fiber path table, all closures
   passing through, all locations passed, total length, BOM
   contribution.

### 5.D Workstream split

- **FIX-A** (Sonnet, ships first): items 1–6 of 5.A. Bundled
  into one worker because they share file surface
  (`routes/splice.js` + `public/splice.html`) and bundling
  cuts dispatch overhead.
- **FIX-B** (Sonnet, ships second): items 1–6 of 5.B. Single
  worker because the whole thing is one coherent flow redesign.
- **VETRO research shard** (Sonnet, parallel-safe with FIX-B):
  read-only web research, writes only `research/07_vetro_
  visual_match.md`. Gathers VETRO visual references for
  FIX-C to use.
- **P3 retry** (Sonnet, queued, fires when FIX-B lands): the
  Fujikura Splice+ integration (Phase 4.7).
- **FIX-C** (Sonnet, queued, fires when both P3 and the VETRO
  research shard land): items 1–5 of 5.C. Builds on top of
  FIX-B's behavior changes + uses the VETRO research as the
  visual reference.

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

## Phase 5.D — Functional VETRO UX overhaul

**Owner's complaints cleared:**
1. "I don't have a way to change the color or transparency of the lines" → Style Editor
2. "I don't have layer" → Functional layer-visibility tree (replaces decorative)
3. "I can't click on lines and it bring up the properties" → cable click fixed
4. "It's not customizable, I need to be able to add everything" → Custom layer creation MVP
5. "I NEED A MAP THAT ALSO HAS THE SMALL ROAD NAMES" → Mapbox Streets v12
6. "It also lags out when I zoom and the map disappears" → split dasharray layers + debounce

**Commits (all on `claude/splice-matrix-railway-setup-IIG3Q`):**

| # | SHA | Description |
|---|-----|-------------|
| 1 | `9ac6cf7` | Mapbox `/api/config/mapbox` server endpoint |
| 2 | `12f831b` | splice.html: Mapbox migration, zoom-lag fixes, layer tree, style editor (full overhaul) |
| 3 | `e6d21ec` | Schema 0026: cable category + splice_layer_styles; new API endpoints |
| 4 | `2faa542` | Schema 0027: custom layers + features tables; custom layer endpoints |
| 5 | `3a34d50` | Click-on-cable opens inspector; category in Add Cable form; setCableCategory |
| 6 | `ea7d453` | Layer tree: apply saved styles on load; visibility persistence fix |
| 7 | `d5af100` | Style editor: category badge in cable inspector header |
| 8 | *(this commit)* | SPLICE_BUILD_PLAN.md Phase 5.D documentation |

**Key architectural decisions:**

- **Mapbox token**: Delivered via `GET /api/config/mapbox` (requireAuth).
  Set `MAPBOX_TOKEN` env var in Railway. Without it, Esri raster fallback
  with a toast notification — dev environments work without the token.
- **Layer model**: One MapLibre line layer per cable category (cables-backbone,
  cables-lateral, etc.) each with a CONSTANT `line-dasharray`. This eliminates
  the data-driven `case` expression that caused GPU tessellation zoom lag.
- **Style persistence**: `splice_layer_styles` table keyed by (project_id, layer_id).
  Styles hydrate with the project; live-apply via `map.setPaintProperty()`.
- **cable.category column**: New `VARCHAR(20) NOT NULL DEFAULT 'unclassified'`.
  Existing cables get 'unclassified'. Re-categorize via cable inspector dropdown.
  Valid values: backbone, lateral, drop, pigtail, conduit, legacy, unclassified.
- **Custom layers**: `splice_custom_layers` table per project. Feature-add UI
  (drawing tool integration) is Phase 5.E — marked with `// TODO Phase 5.E`
  comments in the code.
- **basemap toggle**: Mapbox path cycles streets ↔ satellite-streets-v12 via
  `map.setStyle()` + `styledata` event handler that re-adds network layers.
  Esri fallback keeps original sat/hybrid toggle via `setLayoutProperty`.

**MAPBOX_TOKEN env var:**
Set in Railway (or other deployment) environment variables panel.
Without it, the tool falls back to Esri World Imagery + Reference Overlay
(the pre-5.D behavior). With it, uses Mapbox Streets v12 vector tiles which
provide road labels at every zoom level, building footprints at z15+, and
client-side vector rendering that never blanks on zoom.

**Existing cable re-categorization:**
All cables before migration 0026 land with `category = 'unclassified'` and
appear in the "Unclassified" map layer (purple). Owners can re-categorize
individual cables via the cable inspector Category dropdown, or via
`PUT /api/splice/cables/:id/category`. No bulk re-categorization UI yet
(Phase 5.E candidate).

---

## Phase 5.E — Critical bug fixes + UX polish + multi-fiber range selection

**Audit reference:** `SPLICE_MATRIX_SUGGESTIONS.md` (landed on `main` at commit `8c1857c`) — a full UI audit by Claude Sonnet 4.7 on the production deployment. Read sections 3.1–3.5 and 4.7–4.8 for the detailed rationale behind each fix.

**Owner additions:** Two fiber-picker ergonomics features requested directly by Carter:
- Excel-style shift-click range selection in the drag-drop picker
- Manual range text input ("1-72, 97-144" syntax)

### Commits

| # | SHA | Task |
|---|-----|------|
| 1 | `4c60c58` | §3.1 — Map view empty on first render: call `map.resize()` + `mapFitData()` in the `isMap` branch of `switchView` |
| 2 | `359a3ce` | §3.2 — Replace all `window.confirm()` calls (17 sites) with `confirmDialog()` Promise helper — preserves lock heartbeat |
| 3 | `97b98cd` | §3.3 — Dark-mode header: add `--header-bg:#0B1A2E` token, apply it to `.header` via `var(--header-bg, var(--vetro-primary))` |
| 4 | `1ab1d36` | §3.4 — Move view-tabs into canvas-pane chrome as first flex row (removed absolute positioning, eliminated toolbar collision) |
| 5 | `0a04eb1` | §3.5 — Add Location enters placement mode: type-selector chips, crosshair cursor, Esc cancels, click-to-place |
| 6 | `da8e928` | §4.7 — Attribute-table toggle bar shows live entity counts ("9 locations · 4 cables · 0 closures · 0 splices") |
| 7 | `c5c885e` | §4.8 — Undo snackbar: 5s bottom-center bar after every delete; `POST /api/splice/projects/:id/undo-last` reverts to N-1 version snapshot |
| 8 | `a6e145e` | Owner ask: Excel-style shift-click range fill + `parseRangeSpec` helper + range text input above each fiber picker column |
| 9 | *(this commit)* | Plan doc — Phase 5.E documentation |

### Key design decisions

- **`confirmDialog` styling:** reuses existing `modal-overlay` + `--vetro-*` tokens. Danger button uses `.btn-danger` (red). Resolves via Promise so callers `await` it — all enclosing functions were already async.
- **View-tabs position:** chose option (b) — first flex row inside `.canvas-pane` (not the title bar). Canvas-pane was changed from `position:relative` to `display:flex;flex-direction:column`. The inner `.canvas-pane-body` div holds all the canvas/map content and takes `flex:1`.
- **Snackbar:** bottom-center fixed, slides up with `cubic-bezier(0.34,1.56,0.64,1)`. Stacks vertically if multiple in-flight. Countdown ticks every 1s. Does NOT use `toast()` to avoid collision with existing toast element.
- **Undo-last endpoint:** full transaction — deletes live rows, re-inserts from snapshot JSONB. Pre-snapshots current state so undo is itself undoable. Broadcasts `state_reverted` SSE.
- **Range selection anchor:** tracked in `state._ddropAnchor[ddKey+'|'+side]`. Plain click sets anchor + clears selection. Shift-click fills range from anchor. Ctrl/⌘-click toggles individual fiber (replaces old shift-click additive behavior).

---

## Phase 5.F — Diagram view topology graph

Konva canvas rewrite: location nodes + cable edges with LOD zoom.
Parallel with Phase 5.G. Modifies `public/splice.html` Konva regions only.

| # | SHA | Task |
|---|-----|------|
| 1 | `b1a4d8d` | Topology graph layout — location nodes + cable edges on Konva canvas |
| 2 | `263a668` | Cable LOD zoom — thin line → tube rows → fiber lines |

---

## Phase 5.G — PDF deliverable v2

**Audit reference:** `SPLICE_MATRIX_SUGGESTIONS.md §6` — "this is the actual product."
Splicers carry this document in the field. Ran in parallel with Phase 5.F.
**Files touched:** `routes/splice.js` (PDF render path + export endpoint), `package.json`.

### Commits

| # | SHA | Task |
|---|-----|------|
| 1 | `8eb9a69` | Cover page metadata block: navy table with Revision label (Rev N), Project, Designer, Exported-by user, Generated UTC, gen hash, Status. Staleness warning. Flex layout. |
| 2 | `0f40c2d` | QR code on cover page: 240px raster PNG, navy modules, URL text label below for manual fallback. Points to `/splice/view/:project_token`. |
| 3 | `8549523` | Mapbox Static map on cover: 600×300 @2x with pin markers, 15% bbox padding, 8s timeout, content-type guard, graceful skip when no token or no GPS coords. |
| 4 | `c0cf31c` | Per-closure page polish: explicit navy thead (Puppeteer-safe), alternating row bg (#F4F5F7 / white), 8pt body font, color swatch + 2-letter TIA-598 code verified. |
| 5 | `494a87b` | Per-closure QR deep-links: each closure QR encodes `/splice/view/:token?closure=<id>`. Splicer scans → opens live record scoped to that closure. QR label updated. |
| 6 | *(this commit)* | Plan doc — Phase 5.G documentation |

### Key design decisions

- **`qrcode` package:** already listed in `package.json` (v1.5.4); `npm install` run to add to `node_modules`. The existing `_qr()` lazy-loader + `_renderQrSvg()` were extended; no new lazy-loader needed.
- **Cover QR vs per-closure QR:** Cover QR → project-level public view (`/splice/view/:token`). Per-closure QR → same view with `?closure=<id>` query param for scoped deep-link. Field markup upload URL (`/splice/field/:closure_token`) is fallback when no project token exists.
- **Mint-on-export:** If the project has no active public token, one is minted automatically when PDF is exported. Label: "Auto-minted on PDF export". No expiry.
- **Map bbox padding:** 15% on each side (minimum 0.002° to handle co-located points). Single-location projects use zoom-14 instead of bbox fit.
- **Per-closure QR placement:** top-right of closure page header (existing `.qr` div position unchanged). Label updated to "live record / this closure" when project token is available.
- **`designerName` conflict:** existing `const designerName` in `_renderSpliceHtml` renamed to `effectiveDesignerName`; the new `designerName` from opts takes precedence.

### Owner-test checklist

1. Cover page shows project name + client + `Rev N` + generated UTC + generated-by user — YES
2. Cover page has a QR code linking to public read view — YES (240px navy PNG + URL text)
3. Cover page has Mapbox Static map snippet — YES (skip gracefully when no token / no GPS)
4. Cover page has staleness warning — YES (amber banner with project token URL)
5. Per-closure pages have navy headers + alternating row bg + 10 cols — YES
6. Color columns show swatch + 2-letter code — YES (Phase 4.2, verified in PDF path)
7. Each closure page has its own QR linking to that closure on public view — YES
8. PDF generation works without MAPBOX_TOKEN — YES (graceful skip)

---

*Last updated 2026-05-07 — Phase 5.G PDF v2 complete (5 commits).*
*Phase 5.F ran in parallel at b1a4d8d–263a668.*
*Phase 5.E shipped at 4c60c58–2268ca9.*
