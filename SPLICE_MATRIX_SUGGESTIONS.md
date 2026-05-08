# Splice Matrix Suggestions

**To:** the next Claude (likely a VM session) picking up the Splice Matrix tool.
**From:** Claude (1M-context Sonnet 4.7 session, 2026-05-07).
**Why this doc:** Carter wants a product on par with VETRO FiberMap. He asked me to audit the current state, play with the live UI on production (`launchfiberadminportal.xyz/splice.html`, authenticated as `ctrantham`), pull from the existing `research/01–07*.md` competitive corpus, and write you a punch list.

You did a lot of strong work. The bones are right, the design tokens are aligned to VETRO, the schema is well-thought-out, the canvas + map + matrix surfaces all work, and dark mode actually looks great. This document is **not** a re-architecture proposal — it's a tightly scoped list of bugs, UX gaps, and visual upgrades that, together, move the tool from "v1 internal" to "what Carter would pay $40k/year for if a vendor sold it."

Read top-to-bottom once, then attack §3 (critical bugs) before anything else. Everything below §3 is sequenced by impact-per-hour.

---

## 1. State of the art (what's already solid — don't break this)

What I confirmed live on production:

- **VETRO design-token alignment is real.** `#003F72` navy header, `#68BD45` route green, Inter typography, 4-px spacing grid, 260-px left rail, 320-px right inspector, 52-px header. The chrome reads like a professional GIS product, not a hand-drawn admin tool.
- **Dark mode works end-to-end.** Surfaces, text hierarchy, status pills, danger buttons, inspector field labels — all readable. None of the OSP competitors (per `research/06_ui_patterns.md` §5) ship a dark mode at all, so this is a real differentiator.
- **Four-view tab model (Diagram / Map / Split / Matrix) is the right primitive.** The Split view (left = schematic, right = satellite map) is the strongest single feature in the product right now. It nails the "spatial intuition + logical connectivity" tension that `research/06` §1 identifies as the gold standard, and that VETRO and OSPInsight each only solve halfway.
- **Inspector content for cables is dense and well-structured.** When I clicked Span 1: type badge, name, sub-line metrics (`144f · 12 tubes · 12f/tube · 256 ft`), a 3-tile stat row (TOTAL FIBERS / CLOSURES ON ROUTE / CIRCUITS SET), Route summary, collapsible Fiber Paths, Closures Along Route, BOM table, action buttons. This is at or above VETRO's documented inspector density (`research/07` §4).
- **The schema is generous.** Locations have 10+ types (handhole / manhole / pole / pedestal / vault / FDH / splice point / CO / terminal / ring cut), trayless splice support, ribbon groups, splitters, version history, public share tokens, comments, field markup, loss records from Fujikura Splice+. You went deeper on data depth than every competitor in `research/01–05` except OSPInsight on splice, and OSPInsight's UI is from 2008.
- **Migration count is real progress.** 0001 (initial schema) → 0025 (field loss records). That's eighteen schema iterations of real work. The slot ordering documented in `PROJECT_NORTH_STAR.md` §6.B is still correct; next free slot is 0026.

You are not behind. You are 80% of the way to a product. The remaining 20% is mostly the things below.

---

## 2. Executive summary — top 5 highest-leverage fixes

If you only have a day, do these five in order:

1. **Fix the standalone Map view's first-render bug.** Switching to Map directly after selecting a project shows an empty gray canvas. Map only renders after Split or Diagram has been visited first (or after some other UI event triggers a reflow). Confirmed twice on production. §3.1 below.
2. **Replace native `confirm()` dialogs.** "Delete project" / "Delete closure" / probably others fire `window.confirm()`, which (a) freezes the entire page including all instrumentation, (b) looks like a 1995 browser, (c) blocks the rest of the app's modal pattern. §3.2.
3. **Make `Add Location` show a "click the map to place it" affordance.** Currently it silently creates an orphan SP-N at no coordinates and opens the inspector — and the only hint is the small `📍 Not placed on map` line in the inspector body. I created an SP-10 by accident exploring this; reproducing the bug took zero effort. §4.1.
4. **Anchor the Diagram view's cables to their endpoint locations.** Right now four cable bars float at staggered Y positions in a sea of whitespace, with `HH-2` and `HH-4.1` floating as bare text labels at the very top. Cables should physically connect to a node representing each location, the way OSPInsight SpliceGUI does it. §5.1.
5. **Upgrade the PDF deliverable.** This is what the splicer holds in their hand in the field. It is the actual product. Current state isn't visible to me (the PDF tab opened in a Chrome PDF viewer the MCP can't introspect), but `routes/splice.js` shows it routes through `/api/splice/projects/:id/export-pdf` — confirm it carries title block, revision label, generated-by user, generated-at UTC, QR code linking to live record, and explicit "verify this is current" warning per `research/06_ui_patterns.md` §12 anti-pattern #7. §6.

Everything else can wait. The five above each compound: fixing them lifts the tool from "looks polished, reveals friction on use" to "a designer who's never seen it can ship a project in their first hour."

---

## 3. Critical bugs (fix first)

### 3.1 Map view empty on first render after project select

**Reproduce:** Hard reload `/splice.html` while authenticated → click a project in the left rail → click the `Map` view tab. **Result:** gray empty canvas with the zoom controls visible top-right but no basemap, no markers, no cables. **Workaround the user discovers:** click `Split` or `Diagram` first, then `Map` — now it renders correctly.

**Probable cause:** the MapLibre instance is constructed when the canvas pane has 0 width (because the project hadn't loaded yet, or the inspector hadn't reflowed yet), so MapLibre caches a (0,0) viewport. Switching to Split forces a reflow which fires `map.resize()` indirectly. Standalone Map view never triggers a resize.

**Fix:** call `map.resize()` and `fitBounds()` whenever the user switches into the Map view. Look in `splice.html` for the view-switch handler that toggles between Diagram / Map / Split / Matrix and wire a post-switch hook for Map specifically. The resize call is cheap and idempotent.

**Don't:** ship with a "click Split first" workaround comment in the code. The bug-once-on-first-Map-click is the kind of thing a procurement evaluator catches in their first 60 seconds.

### 3.2 Native `confirm()` dialogs freeze the page

**Reproduce:** open a location inspector → click `Delete`. **Result:** native `window.confirm()` dialog opens; if you don't click OK or Cancel within ~10 seconds, my MCP tooling times out. A real user can dismiss it but loses context every time.

**Why it matters beyond aesthetics:**
- VETRO and IQGeo both use in-app modals for destructive actions (research/06 §2).
- `window.confirm()` blocks all JS, all timers, all background polling. If you're holding a lock heartbeat (the schema has lock + 60-s heartbeat per `0001_splice_schema.sql`), it stops. A user who walks away from a confirm dialog drops their lock.
- Native confirms can't show contextual info: "this closure has 47 splices and 3 inbound cables — are you sure?" matters when the closure has data; the current dialog shows only a generic confirmation string.

**Fix:** there's already a modal-overlay pattern (the import-KMZ modal, the create-project modal, etc.). Build one `confirmDialog({title, body, confirmLabel, danger:true})` helper that returns a Promise<boolean>, replace every `confirm(` site in `public/splice.html` and any companion JS modules.

Search target:
```
grep -n "confirm(" public/splice.html public/splice_view.html
```
There were probably 10–20 sites. Do them in one pass.

### 3.3 Header in dark mode is too light

The dark-mode header is `#4A90D9`-ish (the dark-mode `--vetro-primary`). In light mode the header is the much-darker `#003F72`. Result: dark mode looks LESS premium than light because the header reads as washed-out. Compare to VETRO's own product surface — they keep a saturated dark navy in both themes per `research/07` §2.

**Fix:** in the `html[data-theme="dark"]` block, override `.header { background: var(--vetro-primary-dark); }` (`#002B50`) so the header stays a deep navy. Or define a `--header-bg` token that's `--vetro-primary` in light and `#0B1A2E` in dark.

### 3.4 View tabs collide with map / matrix toolbars

In Diagram + Map + Split modes the `.view-tabs` strip is centered absolutely-positioned at the top, and the canvas's own `.toolbar` and `.map-toolbar` are also absolutely-positioned. On 1568×710 they don't quite collide; on 1366×768 (Carter's likely laptop), or with the inspector open (which shrinks the canvas-pane to ~1000px), they overlap. I saw "Add" get truncated behind the view-tab strip during my session.

**Fix:** put the view tabs into the section header chrome rather than overlaying the canvas. They're a global navigation primitive — they don't belong floating on a Konva stage. Move them to the right side of the project title bar, or as the first row inside the canvas-pane's flexbox column.

### 3.5 `Add Location` action silently creates a row

Clicking `Add Location` in the sidebar creates a new splice_point named SP-N at no coordinates and opens its inspector. There's no modal, no toast, no "where do you want to place it?" affordance. The only hint that the location exists in the database (and counts toward your 9-or-10 location count) is the inspector header showing "📍 Not placed on map".

This bit me — I clicked Add Location once during exploration, navigated away, and ended up with an SP-10 that wasn't visible anywhere (sidebar count went from 9 → 10 but I had to dig to find which one was new). When I tried to clean it up I deleted the wrong row.

**Fix:** Either (a) open the modal first asking for type + name and only create on submit, or (b) keep the silent-create but enter a "placement mode" where the next map click places the node, escape cancels and rolls back. Option (b) is what Katapult Pro does (research/04). Option (a) is what VETRO does (research/01 §4).

### 3.6 Diagram cables aren't visually anchored to locations

When you open the Diagram view, you see `HH-2` floating top-left and `HH-4.1` floating top-right, then four colored stripey cable bars stacked vertically at random horizontal offsets. There is no visible line connecting `Span 1` to `HH-2`. There is no node icon for `HH-2`. The labels are bare text.

This is the single biggest visual credibility gap. OSPInsight SpliceGUI (research/04 §1, research/06 §1) draws each closure as a rectangular block, each cable as a bar going INTO the block, and each individual fiber as a colored line connecting between blocks. VETRO Fiber Manager (research/01 §4) is described similarly. Even splice.me — a $99/year tool — draws each location as a node and each cable as a line attached to the node.

**Fix sketch:** in the Diagram-view Konva stage, place each location as a labeled node (rounded rectangle with type-badge color, location name in the title bar) at fixed columns. Draw each cable as a line from the source location's right edge to the destination location's left edge, with the colored stripe pattern overlaid. Stack multiple cables between the same endpoint pair vertically. The current bare-cable-bars rendering should be reserved for an "expanded cable detail" zoom level, not the default view.

---

## 4. UX gaps ranked by impact

### 4.1 Empty states are dead

- **No project selected** (initial load): canvas is one giant gray void; the only affordance is the small `+` next to PROJECTS in the sidebar. A first-time user has nothing to look at and no narrative of what this tool does.
- **Empty Matrix view** (no splices yet): says "No splices match the current filters" — but the user has no filters set, AND there are simply no splices at all. The message implies user error. It should differentiate between "you've filtered too narrowly" and "this project has zero splices, here's how to make one."
- **No closures yet on a project**: same problem. The tool is designed around closures hosting splices; if a project has 9 locations and 0 closures, the diagram view's most important objects (closures + their tray contents) are all missing, and the UI says nothing.

**Fix:** every empty state in the canvas pane should carry (a) a relevant illustration or icon, (b) one sentence explaining what should be there, (c) a CTA button that starts the most likely action. Pattern: Linear, Notion, Stripe Dashboard. See `research/06_ui_patterns.md` §8 for why this matters in OSP specifically — splice.me wins adoption partly on its self-serve empty state.

### 4.2 Sidebar is cluttered when a project is open

After opening Test, the left rail stacks vertically: Map Data label → Projects (search + filter dropdowns + list) → Project actions (6 buttons) → Pending imports → Loss records → Summary. On a 1080p laptop screen with the browser at 100% zoom, the bottom three sections are below the fold. The Layer panel (Fiber Cables / Network Points / Custom Layers tree) is even further down — I had to scroll to find it.

VETRO's Map Data panel (research/07 §2) is a single layer-tree section that defaults to expanded. Project actions are accessed from a `+` menu in the layer tree itself or from a top toolbar.

**Fix:** put Project Actions, Pending Imports, Loss Records, and Summary behind tabs at the top of the sidebar (Layers / Actions / Imports / Summary), so only one section shows at a time. Or collapse them all to chevron-headers by default and require an explicit click to expand. The current vertical-stack-everything pattern is the main reason the sidebar feels busy.

### 4.3 The "Editing · Release" pill is oversized

Top-right of the canvas-pane there's a green pill showing `Editing · Release`. It's wider than the Export PDF button. The pill's job is "tell the user they hold the lock" — that's a 14-px subtle status, not a hero element. Compare to VETRO's lock icon in the Sonar integration docs (research/07 §2): a single-icon button in the header.

**Fix:** shrink to icon + small text, or move into the header next to the user pill. It currently competes for attention with the view tabs that are 12px to its left.

### 4.4 Location markers on the map are undifferentiated

All 9 dots on the satellite basemap are identical solid blue circles. The schema supports 10 location types (handhole, pole, FDH, splice point, etc.) with semantically meaningful icons in the schema (see `migrations/0018_splice_location_types.sql`). Type information is rendered correctly in the inspector header pill, but not on the map.

**Fix:** map markers should use type-specific icons (handhole = small square, pole = vertical line, FDH = larger filled circle, splice point = diamond, etc.). Color by status (active / planned / in-construction). VETRO's network point styling (research/07 §3 — "Equipment Marker Style") is a directly copy-pasteable pattern.

### 4.5 No legend / key on any view

There's no place in the UI to see "what does the orange line mean? what does the red dot mean?" A splicer or new designer staring at the map has no way to interpret the symbology except by clicking each element to read its inspector. This is fine for a VETRO power-user but disastrous for the FTTH ISPs Carter's actually selling to.

**Fix:** small floating legend panel bottom-right of the map canvas, collapsible, listing the active layers + their colors/icons. The Layer panel in the sidebar already has this data; just project a compact rendering of it onto the canvas.

### 4.6 Cables on the map are nearly invisible

The dashed lines connecting location dots are ~1px and very faint. Distance labels (124 ft / 333 ft / 256 ft) are clearly visible, but the cable line connecting them isn't. On a satellite basemap this is the worst case — the network is exactly what should be most prominent, not the underlying earth.

**Fix:** cable lines should be 3–4 px at street zoom (z16+), 2 px at neighborhood zoom (z13–14). Use the `--vetro-route-active: #68BD45` token for in-service, and add a 1-px white halo underneath for satellite-basemap legibility. Per `research/07` §3 — directly the VETRO MapLibre layer config they recommend.

### 4.7 The Attribute Table toggle bar at the bottom is cryptic

A solid navy strip along the bottom of the canvas says `^ Attribute table`. There's no indication of how many rows are in it, what entity type it's keyed to, or what happens if you click it. Since the user has just selected a project, the most useful default would be "9 locations · 4 cables · 0 closures · 0 splices" — actual counts that the user can act on.

**Fix:** show entity counts in the toggle bar's label. On click, open the full bottom-docked grid (this part already works per research/07 §2).

### 4.8 No undo

I didn't see any Cmd-Z handling, no toast saying "deleted SP-1 — undo?". `migrations/0011_splice_versions.sql` exists, so the audit trail is in place, but there's no UI surface for "I just made a destructive change, take it back."

**Fix:** add a 5-second snackbar with `Undo` button after every delete / move / status change. Tie it to the existing version-history table — every undo is just a revert to revision N-1.

### 4.9 Search bar in the sidebar is unbacked by visible filters

The placeholder says "Search circuits, cables, closures…" but the dropdowns underneath are `All` / `Recent` (looks like a project filter, not a content filter). When I typed in the search field, no results dropdown rendered — possibly because Test was the only project and it was already visible. Without test data with 5+ projects I can't validate, but the discoverability of the filter scope is unclear.

**Fix:** the search bar should be project-scoped when a project is open, and show a result list that surfaces (Closure / Cable / Fiber-by-position / Service-area / Circuit-ID) per `research/06` §7. Otherwise rename to "Search projects…" so the scope is obvious.

---

## 5. Diagram view — make it look like a real splice editor

This section is its own sub-track because it's the single largest visual upgrade.

### 5.1 What it should look like

Per `research/06_ui_patterns.md` §1 + §9, and `research/07` §6, a professional splice diagram has three rendering layers:

- **Location nodes**: each closure / handhole / FDH / etc. is a rectangle with a colored title bar (status), a 3–6 line attribute strip (name, type, GPS), and a body that contains its trays.
- **Tray rows inside each closure**: each closure node expands to show 1..N tray rows, labeled `Tray 1 … Tray N`, each tray containing fiber slots in a row.
- **Cables and splices**: cables are drawn as bezier or polyline connections between closure nodes. When zoomed in, each individual fiber is a colored line; the splice point at each closure is a node where fibers cross.

You don't need all three from day one. The MVP is: location node + cable lines between them. Tray drill-down can come later (and may already exist behind a click — I didn't get to verify because the project had 0 closures).

### 5.2 Layout the schematic like a topology

Right now the four cables are stacked vertically with arbitrary horizontal offsets that don't correspond to anything physical. A user can't tell which cable connects which two locations without clicking on it.

The layout you want is a left-to-right topology graph:
- Locations on a horizontal axis ordered by sequence_index (or by user-controlled position).
- Each cable drawn as a horizontal line from its source's right edge to its destination's left edge.
- Multiple cables between the same pair stack vertically with a small gap.
- Branches drawn as forks at the splice closure they fan out from.

Konva supports this pattern natively with Stage / Layer / Group structure. The data already exists — `cables[].source_location_id` + `cables[].dest_location_id` (or whatever fields you actually use). Use a deterministic auto-layout (e.g., a left-to-right Sugiyama layout) or let users drag location nodes to position them and persist the position to the schema.

### 5.3 Ribbon-as-unit collapse

When a 144-fiber cable is drawn at fit-zoom, you can't see individual fibers. The current rendering shows the cable as a stripey bar (12 stripes for 12 tubes), which is a reasonable fit-zoom collapse. But the stripes are too thin to be readable — you can't tell whether 144f cable has 12 tubes of 12 fibers or 24 tubes of 6.

Three zoom levels per cable:
- **z = 0 (fit-zoom)**: cable shown as a single bar with the fiber count as a label `144f / 12T`.
- **z = 1 (mid-zoom)**: cable expands to show 12 tube rows, each tube colored to its TIA-598 buffer color.
- **z = 2 (max-zoom)**: each tube expands to show 12 fiber lines colored to TIA-598 fiber colors.

Konva supports per-layer caching so this is performant. VETRO's "lightning-fast image rendering" claim probably comes from exactly this kind of LOD model. See `research/07` §6.

### 5.4 TIA-598 fiber colors — pair with letter codes

The CSS root already defines all 12 TIA-598 hex values (`--fc-blue`, `--fc-orange`, etc.). Use them. **And** pair every color swatch with its 2-letter abbreviation per `research/06_ui_patterns.md` §9 and §12 anti-pattern #3:

```
BL  OR  GR  BR  SL  WH  RD  BK  YL  VT  RS  AQ
```

This is a hard requirement for monochrome printing, color-deficient users, and Slate-vs-White / Rose-vs-Red disambiguation. None of the competitors do this consistently — it's a real differentiation, and it costs ~30 minutes of work.

### 5.5 Splice connection rendering

When a splice exists between fiber A in cable 1 and fiber B in cable 2 at a closure, draw it as a curve that:
- starts at fiber A's slot on the left side of the closure
- ends at fiber B's slot on the right side of the closure
- is drawn in the source fiber's TIA color OR a neutral gray with a small color swatch midway (research is split — splice.me uses the source-fiber color, OSPInsight uses neutral gray)
- on hover, both endpoints highlight and the inspector shows the splice's loss measurement, splicer name, completion timestamp

Selection state: clicking a splice highlights the entire fiber path end-to-end across multiple cables and closures (this is the "trace" pattern from research/06 §7). The inspector shows the full path: `cable1.fiber5 → closure-A → cable2.fiber12 → closure-B → cable3.fiber7` with each segment clickable.

---

## 6. PDF deliverable — this is the actual product

The splicer in the field carries this document. They don't open the web app. The PDF is the contract between engineering and splicing. Per `research/06` §4 + §12 anti-pattern #2 and #7, this is the most-criticized failure mode across the entire OSP category.

I couldn't visually inspect the current PDF — Chrome's PDF viewer is in a different extension context that the MCP can't access. But I can see in `routes/splice.js` that there's an `/api/splice/projects/:id/export-pdf` endpoint, and I can predict from the data model what the document is shaped like. Verify the following are present; if any are missing, add them:

### 6.1 Cover page must carry

- Project name, client name (if linked), generated date/time UTC, generated-by user.
- A revision identifier — "Rev 7" or short git-style hash from `splice_versions` — so a splicer with two printouts can tell which is current.
- A QR code linking to the live record. Format: `https://launchfiberadminportal.xyz/splice.html?p=<id>&rev=<n>`. Phone-camera scan → opens the live, current state. **No competitor in `research/01–06` ships this.** It's a 30-minute add and a real differentiator.
- A clear staleness warning: "This document was generated from revision 7 on 2026-05-07 14:32 UTC. Verify it is current before splicing — scan the QR code or visit launchfiberadminportal.xyz/splice/<id>."

### 6.2 Per-closure pages must carry

Recommended column layout (research/07 §10):

| Tray | Fiber # | In Color | In Cable | In Tube | Splice Type | Out Cable | Out Tube | Out Color | Circuit |

- Color swatch + 2-letter code in the In Color and Out Color columns.
- Tray header rows in the navy primary background with white text.
- Alternating row background (white / `#F4F5F7`) for legibility.
- 8-pt body font; portrait orientation; landscape only when fiber count exceeds the per-page row limit.

### 6.3 Map snippet on cover page

A small (3×2 inch) inset of the project's map extent showing the closures' GPS positions, with the closure being detailed on the next page highlighted. Static raster from MapLibre's `getCanvas().toDataURL()` is sufficient.

### 6.4 Don't ship a "screenshot of a spreadsheet"

`research/06` §12 explicitly calls this out as the dominant antipattern in the category. If the current PDF is an HTML-table-rendered-to-PDF with no chrome, no logo, no metadata, no QR — that's a disqualifying gap. Even a one-day Puppeteer template upgrade resolves it.

---

## 7. Things that are good — don't break them

Tempting refactor traps to leave alone:

- **The 4-view (Diagram / Map / Split / Matrix) tab model.** Don't merge them into one view or hide them behind a hamburger. Each is the right primitive; the bug is in how the chrome positions them.
- **The right-inspector content layout** — type badge → name → metric tiles → grouped sections → action buttons. This is VETRO-grade and matches what `research/07` §4 specifies. Don't reshuffle it.
- **The `--vetro-*` design tokens.** The token names map cleanly to research/07's recommendations. Don't rename them mid-flight; just override values per-theme.
- **Konva for the splice editor canvas.** The decision was made deliberately (see PROJECT_NORTH_STAR §6.B answer #2). Don't swap to D3 / Pixi / native SVG. Konva's layer caching is the right tool for the LOD rendering described in §5.3.
- **The schema's audit / lock / version / share-token / comments / loss-records primitives.** This is the data foundation of the product. Don't simplify it because the UI hasn't surfaced all of it yet.
- **The split between `splice.html` (editor) and `splice_view.html` (read-only stakeholder view).** That's the right boundary.

---

## 8. Things to NOT add (yet)

The temptation to gold-plate is real. Skip these until §3 + §4 are clean:

- AI-assisted splice planning. Cool, but the existing AI-assistant approval gate is non-trivially load-bearing in the rest of the app and the splice flow doesn't have the schema for "Claude proposes a splice plan, user approves" yet. Ship the manual flow first.
- Real-time multi-user editing with operational transforms. The schema already supports project-level locks + 60-s heartbeats per `0001_splice_schema.sql` decision #5. That's enough for v1. Don't get into CRDT.
- Mobile native app. `research/06` §6 identifies the splice-diagram-on-mobile gap as an opportunity, but it's a 2027 problem.
- Phase 2 ring-cut UI. PROJECT_NORTH_STAR §6.B explicitly defers it to migration slot 0026+. The current schema doesn't model ring cuts yet; don't drift into it.

---

## 9. How to verify your changes (the loop the previous Claude was using)

Per `PROJECT_NORTH_STAR.md` §7 "Verifying changes against the live deployed app":

1. **No local Node** — push to `main`, Railway redeploys.
2. **Watch CI** — `gh run list --branch main` and `gh run view <id> --log-failed`.
3. **Hit production via Claude in Chrome MCP** — there's a paired browser already authenticated to `launchfiberadminportal.xyz` as `ctrantham`. Use `tabs_context_mcp` then `javascript_tool` to fetch any `/api/splice/...` endpoint. **Hard-reload after every deploy** (Ctrl-F5) — Railway edge cache holds the old HTML for hours.
4. **Sandbox data on production is OK** — create test projects, just clean them up afterward. Use names with `AUDIT-` or `(sandbox - delete me)` prefix so anything you orphan is easy to find.

Two concrete loops worth setting up early:

- **Visual regression**: take a screenshot of the splice editor in light + dark mode after every deploy and store them in `research/regression/<date>/`. A diff between deploys is the fastest way to catch "I just broke the dark-mode header" type regressions.
- **PDF regression**: every time you touch the export endpoint, fetch the resulting PDF and store a hash. A changed hash without an intentional reason is a regression.

---

## 10. Test data state (as of 2026-05-07 ~01:35 UTC)

I created and deleted some data while exploring. Final state:

- **Test project (id `f7f828be-...`)**: 9 locations, 4 cables, 0 closures, 0 splices, 480 fibers total. Composition: HH-1, HH-2, HH-3, HH-4.1, HH-5, HH-6, SP-1, SP-8, SP-9. **Note**: I accidentally deleted the original SP-1 during cleanup and recreated a new one with the same name (no coordinates, no notes — same as before, just a new UUID `fe26127a-...`). All other rows are the user's original data, untouched.
- **No closures or splices were created or modified by me.** The 0sp / 0 closures count is the project's true state — the splicing UI hasn't been exercised yet on production.
- **Two browser tabs left open**: tabId 1391974403 (frozen behind a confirm dialog from my Delete-location attempt — will dismiss itself in a few minutes or on the next page reload) and 1391974404 (clean state). Plus tabId 1391974405 holds the export PDF I generated. Carter can close these any time.

If you need a test project with closures + splices to validate the splice rendering improvements in §5, create a sandbox project named `AUDIT-splice-render` with 3 closures along a 96f cable, splice 24 fibers in the middle closure, and exercise both Diagram and Matrix views.

---

## 11. Sequencing recommendation

If you have a week:

- **Day 1** — §3.1 (Map first-render) + §3.2 (replace confirm) + §3.3 (dark-mode header) + §3.4 (view-tab collision). All four are bug fixes; they should land in one PR each.
- **Day 2** — §3.5 (Add Location modal) + §3.6 (Diagram cables anchored to locations — the small version: just add a colored title bar above each cable showing source/dest names so the visual link is restored, even before the topology rewrite).
- **Day 3** — §4.1 (empty states) + §4.7 (attribute table counts) + §4.8 (undo snackbar). All small UX wins.
- **Day 4** — §6 (PDF deliverable). Title block, revision label, QR code, generated-by metadata, basic per-closure layout. This is the longest single task.
- **Day 5** — §5.1–5.5 (Diagram view as a real splice editor). The biggest visual upgrade. Start with the topology layout, defer ribbon LOD to a later iteration.

Everything else (§4.2 sidebar tabs, §4.4 location marker icons, §4.5 legend, §4.6 cable visibility on map) is week 2.

---

## 12. Things I didn't get to verify

Listing these so you don't waste time re-checking what I did:

- **Closure inspector content** — there were 0 closures on the Test project. I looked at the markup in `splice.html` but didn't open one in production.
- **Tray inspector / per-fiber drill-down** — same, requires an actual closure.
- **The drag-drop splice creation flow** — depends on having a closure with cables routed through it.
- **The `Split` view's interaction synchronization** (does clicking a closure on the map highlight it on the diagram?) — looked at the markup but didn't exercise it.
- **The `Manage templates` admin flow** — hidden behind admin role; I'm admin but didn't open it.
- **Public share tokens** (migration 0020) — didn't generate one.
- **Loss records upload** (Fujikura Splice+ JSON, migration 0025) — didn't have a sample file.
- **Comments + Field markup** (migrations 0021 + 0012) — didn't exercise.
- **Field loss records report PDF** (migration 0025) — didn't see the rendering.

These are likely already solid; I just can't claim it from data. Worth a 30-minute pass once the test data has closures.

---

## 13. Final note

The reason I'm writing this rather than fixing it directly is that Carter wants you on a VM with a fresh context, not me eating his 1M-context window further. You have full latitude to disagree with anything in here — these are observations from one session, not gospel. PROJECT_NORTH_STAR.md §10 ("To the next Claude") applies; I'm just one more next-Claude.

You've already built the hard parts. The chrome is right. The schema is right. The Konva canvas works. Dark mode works. Versions, locks, share tokens, comments — all in. The remaining work is closing the gap between "engineer-grade tool that I've explained to you" and "vendor-grade product that sells itself in a 90-second demo." That gap is 30–50 hours of focused polish, not another month of architecture.

Make the splicer's PDF good. Make the empty states helpful. Make the Diagram view a real topology graph. Everything else compounds from there.

— Claude, 2026-05-07
