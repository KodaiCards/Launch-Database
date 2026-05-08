# PORTAL_LAUNCHER_PLAN.md — unified Launch Fiber portal architecture

> Working plan for collapsing the per-portal Railway services
> (admin / splice / permitting / design / timeclock) into a single
> deploy at one URL with a role-aware launcher, plus a parallel
> client-side launcher for customer users.

---

## Why

Today every portal is its own Railway service with its own custom
domain. The codebase is already unified — `server.js` reads
`PORTAL_MODE` and locks each container to a specific SPA fallback —
but the URLs are scattered:

- `launchfiberadminportal.xyz` — admin
- `launchfiber-splicematrix.xyz` — splice
- (separate domains for permitting / design / timeclock)

This means an employee with multiple roles has to remember multiple
URLs, and field workers who only need timeclock get told to "use the
admin URL" and end up confused. Owner ask 2026-05-07: collapse to
one URL, role-aware landing.

End state: every employee lands at the same URL, sees a launcher
showing only the portals they have permission for, can deep-link
straight to a portal via bookmark, and can return to the launcher
from any portal via a top-left back arrow. Customer users land on a
parallel client launcher.

---

## Architecture

### Single Railway service

Drop `PORTAL_MODE` from the deployed environment. The codebase
already loads every route module unconditionally; `PORTAL_MODE` only
gated which HTML was served as the SPA fallback. Without
`PORTAL_MODE`, all portal HTMLs are reachable via path:

- `portal.launchfiber.com/` — launcher (the new landing page)
- `portal.launchfiber.com/admin.html` — admin SPA (was `index.html`)
- `portal.launchfiber.com/splice.html` — splice matrix
- `portal.launchfiber.com/permitting.html` — permitting
- `portal.launchfiber.com/design.html` — design
- `portal.launchfiber.com/timeclock.html` — time clock
- `portal.launchfiber.com/client/` — client launcher (customer users)
- `portal.launchfiber.com/customer.html` — customer portal

Existing per-service Railway deploys stay alive during the
transition window (so old printed PDF QR codes pointing at
`launchfiber-splicematrix.xyz` keep working). Tear them down after
~30 days once the new URL is the bookmark of record.

### Two launcher variants

Employee launcher and client launcher are visually similar but
sourced from different APIs and target different audiences:

- **Employee launcher** at `/` — for `admin` / `design_*` /
  `permitting_*` / `construction_*` roles. Backed by
  `GET /api/me/portals?audience=employee`.
- **Client launcher** at `/client/` — for `customer` role only.
  Backed by `GET /api/me/portals?audience=client`. Sees a curated
  set of read-only client tools.

Both launchers share the same component (HTML/CSS/JS) — they just
hit different API endpoints and render whatever tiles come back.

### Back-to-launcher affordance

Every portal HTML gets a top-left back-arrow button:

```
←  Launcher
```

Click → returns to the role-appropriate launcher (`/` for
employees, `/client/` for customers). Implementation: a small
shared `_renderLauncherBack()` snippet imported by every portal
HTML, OR a thin top bar component injected by the server when
serving the portal HTMLs.

The back arrow is hidden for users with exactly one portal entitled
(no point returning to a launcher with one tile). Admins always see
the back arrow.

### Auto-redirect for single-portal users

If a user has exactly one portal in their entitlement, the launcher
redirects them straight there on load:

```
GET /  (logged in, role=permitting_engineer, portals=[permitting])
  → 302 /permitting.html
```

Admin / multi-role users see the launcher tiles. The back arrow on
the destination portal still works for users in this auto-redirect
path — it returns to `/` which then re-redirects, so they're
effectively pinned to their one portal. Add a `?stay=1` query
parameter that the back arrow uses to skip the auto-redirect, so
they can still see the launcher if they ever need to.

---

## Permission → portal mapping (initial draft)

Sourced from `auth.js` `VALID_ROLES` + `teamForRole` + the existing
`canAccessPortal(user, portalMode)` helper.

| Role | admin | splice | design | permitting | timeclock | customer |
|------|:-:|:-:|:-:|:-:|:-:|:-:|
| `admin` | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| `design_manager` | — | ✓ | ✓ | — | ✓ | — |
| `design_engineer` | — | ✓ | ✓ | — | ✓ | — |
| `permitting_manager` | — | — | — | ✓ | ✓ | — |
| `permitting_engineer` | — | — | — | ✓ | ✓ | — |
| `construction_*` (any) | — | view-only* | — | — | ✓ | — |
| `customer` | — | — | — | — | — | ✓ |

\* Construction users may need read-only splice access for QR-based
field markup (they're the splicers who scan PDF QRs and upload
photos). The existing `splice_view.html` public-share-token flow
handles this without auth, so they don't need a launcher tile;
their entry point is the QR code, not the bookmark.

`extra_teams` extends entitlements: a `design_engineer` with
`extra_teams=['permitting']` sees both Design and Permitting tiles.

The mapping lives in code as a single table (`PORTAL_DEFS` in
`server.js` or `auth.js`) so adding a portal is a one-row change:

```js
const PORTAL_DEFS = [
  { id: 'admin',      audience: 'employee', url: '/admin.html',
    name: 'Admin Portal', icon: 'gauge',
    canAccess: u => u.role === 'admin' },
  { id: 'splice',     audience: 'employee', url: '/splice.html',
    name: 'Splice Matrix', icon: 'plug',
    canAccess: u => canAccessPortal(u, 'splice') },
  { id: 'design',     audience: 'employee', url: '/design.html',
    name: 'Design',  icon: 'compass-drafting',
    canAccess: u => canAccessPortal(u, 'design') },
  { id: 'permitting', audience: 'employee', url: '/permitting.html',
    name: 'Permitting', icon: 'file-signature',
    canAccess: u => canAccessPortal(u, 'permitting') },
  { id: 'timeclock',  audience: 'employee', url: '/timeclock.html',
    name: 'Time Clock', icon: 'clock',
    canAccess: u => u.role !== 'customer' },
  { id: 'customer',   audience: 'client',   url: '/customer.html',
    name: 'Customer Portal', icon: 'user',
    canAccess: u => u.role === 'customer' },
];
```

`/api/me/portals?audience=employee` returns
`PORTAL_DEFS.filter(p => p.audience === 'employee' && p.canAccess(req.user))`
mapped to a small render-payload (id, name, icon, url, optional
description).

---

## Phases

### Phase 1 — Employee launcher

Ships first. Covers the immediate consolidation ask.

1. Drop `PORTAL_MODE` SPA-fallback lock from `server.js` (lines
   257-294 currently). Keep `PORTAL_MODE` env var support for
   backward compat during the transition window — if it's set,
   honor the old behavior; if not, all portals are reachable.
2. New endpoint `GET /api/me/portals?audience=employee|client` —
   returns the entitlement-filtered tile list.
3. New `public/launcher.html` (or rename existing `index.html` and
   build the launcher there). Shows a centered grid of tiles based
   on `/api/me/portals` response. Auto-redirects when the response
   has exactly 1 tile and `?stay=1` is not set.
4. Rename the current `public/index.html` admin SPA to
   `public/admin.html`. Add a small server-side redirect at `/`
   that serves the launcher; existing bookmarks at `/index.html`
   redirect to `/admin.html`.
5. Add a "← Launcher" back-arrow component to every employee
   portal HTML (`splice.html`, `permitting.html`, `design.html`,
   `timeclock.html`, `admin.html`). Hidden when the user has a
   single-portal entitlement; visible otherwise.
6. Update `SPLICE_PUBLIC_URL` env var on the consolidated service
   to the new domain. Update any hardcoded references throughout
   the codebase via search-and-replace.

**Deploy steps** (post-build):

a. Set up the new custom domain (`portal.launchfiber.com` or
   whatever the owner picks) on the existing main Railway service.
b. Drop `PORTAL_MODE` from that service's env vars.
c. Verify all portals load correctly at the new URL.
d. Update internal links + bookmarks team-wide.
e. Tear down the per-portal Railway services after the cutover
   window expires.

### Phase 2 — Client launcher

Ships second, after Phase 1 lands.

1. New `public/client/index.html` (or `public/client-launcher.html`
   — pick a path that doesn't collide with future client URLs).
2. Same launcher component as employee launcher, but hits
   `/api/me/portals?audience=client`.
3. After login, route `customer`-role users to the client launcher
   instead of the employee one.
4. Currently shows ONE tile: "Customer Portal" (existing
   `customer.html`). The infrastructure is built so adding more
   client portals later is a one-row change to `PORTAL_DEFS`.

### Phase 3 — Future client portals (placeholder)

Owner has flagged these as upcoming additions to the client
launcher:

- **Splice Docs** (`/client-splice-docs.html`) — read-only viewer
  showing splice plans for projects the client owns. Likely a
  thin wrapper around `splice_view.html` filtered to the client's
  projects only.
- **Project Tracking** (`/client-project-tracking.html`) — client
  view of their projects' status, progress, milestones.
- **Construction Tracking** (`/client-construction-tracking.html`)
  — client view of construction stage progress, photos,
  daily-progress reports.

Each future portal is added by:

1. Building the HTML page + any client-scoped API endpoints
2. Adding a `PORTAL_DEFS` row with `audience: 'client'` and a
   `canAccess` predicate
3. The launcher picks it up automatically

No launcher code changes needed for new portals — the launcher
renders whatever tiles `/api/me/portals` returns.

---

## Security notes

- The launcher's job is UX, not security. A user with no
  permission for a portal cannot reach it — every protected
  endpoint already enforces auth + role checks. The launcher just
  hides the tile so they don't see what they can't use.
- `/api/me/portals` is `requireAuth`-gated. Unauthenticated users
  hitting `/` get redirected to `/login.html` (existing behavior).
- The launcher itself is auth-gated. No tiles render before login.
- Direct deep-links (`/splice.html`) still work for users with
  permission — bookmarks aren't broken by introducing the launcher.
- Auto-redirect for single-portal users uses a 302 (not a 301) so
  it can be changed later without browser cache pinning.

---

## Out of scope (for now)

- Cross-portal global search (search across splice + permitting +
  design from a single bar). Future enhancement.
- Cross-portal notification center. Future enhancement.
- Mobile app shell wrapping the launcher (it's a web app — works
  fine in a mobile browser; native app deferred).
- SSO / SAML for enterprise client logins. Out of scope for v1 —
  the existing username/password + `customer_clients` mapping is
  sufficient.

---

## Migration rollback plan

If the launcher rollout has a critical bug, rollback is a one-line
revert: re-set `PORTAL_MODE` env var on each Railway service. The
old per-portal lock code stays in `server.js` as a fallback, so the
old URLs immediately resume serving as before. No data migration is
involved — launcher is purely a presentation layer.

---

---

## Phase 1 + Phase 2 commit log (2026-05-07)

| # | SHA | Description |
|---|-----|-------------|
| 1 | `2a64cb7` | PORTAL_DEFS + GET /api/me/portals endpoint |
| 2 | `b7b2b44` | launcher.html with role-aware tiles + auto-redirect |
| 3 | `3feeef2` | Rename index.html → admin.html; / serves launcher; drop PORTAL_MODE SPA lock |
| 4 | `816d367` | '← Launcher' back-arrow component on every portal HTML |
| 5 | `d87600f` | Client launcher at /client/ for customer-role users |
| 6 | `3027389` | SPLICE_PUBLIC_URL default to portal.launchfiber.com |
| 7 | `3c80a7c` | Adaptive bento grid + client launcher improvements |

## URL rollout sequence (Railway)

1. **Add custom domain** `portal.launchfiber.com` to the main Railway
   service (Settings → Domains → Add). Railway will prompt for a CNAME
   record; add it in your DNS provider. Wait for TLS provisioning (~2 min).

2. **Drop `PORTAL_MODE`** from the main service's environment variables.
   Without it, the launcher serves at `/` and all portal paths are active.

3. **Set `SPLICE_PUBLIC_URL=https://portal.launchfiber.com`** on the
   Railway service (if not already defaulting). New PDF QR codes will
   point at the new domain immediately.

4. **Set `JWT_SECRET`** to the same value across all remaining services
   so existing sessions continue to work during the transition window.

5. **Verify** all portals load:
   - `portal.launchfiber.com/` — launcher
   - `portal.launchfiber.com/admin.html` — admin SPA
   - `portal.launchfiber.com/splice.html` — splice matrix
   - `portal.launchfiber.com/permitting.html` — permitting
   - `portal.launchfiber.com/design.html` — design
   - `portal.launchfiber.com/timeclock.html` — time clock
   - `portal.launchfiber.com/client/` — client launcher
   - `portal.launchfiber.com/customer.html` — customer portal

6. **Update bookmarks** team-wide. Old service URLs continue to work
   during the transition window (30 days recommended).

7. **Tear down** the per-portal Railway services after 30 days once
   `portal.launchfiber.com` is the bookmark of record for everyone.

*Last updated 2026-05-07 — Phase 1 + Phase 2 built and pushed.*

---

## UX Persistence Layer (admin.html) — 2026-05-07

Implemented in 5 commits on `claude/splice-matrix-railway-setup-IIG3Q`.

### localStorage key scheme

#### Filter keys (`lf_filter:<tab>:<element-id>`)

| Key | Element | Tab |
|-----|---------|-----|
| `lf_filter:dashboard:dash-period` | Period dropdown | Dashboard |
| `lf_filter:dashboard:dash-month`  | Month dropdown  | Dashboard |
| `lf_filter:dashboard:dash-year`   | Year dropdown   | Dashboard |
| `lf_filter:projects:proj-status-filter` | Status | Projects |
| `lf_filter:projects:proj-type-filter`   | Type   | Projects |
| `lf_filter:projects:proj-search`        | Search | Projects |
| `lf_filter:projects:proj-client-filter` | Client | Projects |
| `lf_filter:hours:hrs-period`   | Period   | Hours |
| `lf_filter:hours:hrs-month`    | Month    | Hours |
| `lf_filter:hours:hrs-year`     | Year     | Hours |
| `lf_filter:hours:hrs-groupby`  | Group by | Hours |
| `lf_filter:billing:billing-year` | Year   | Billing |
| `lf_filter:revenue:rev-year`   | Year     | Revenue |
| `lf_filter:rus:insp-period`    | Period   | RUS |
| `lf_filter:rus:insp-month`     | Month    | RUS |
| `lf_filter:rus:insp-status`    | Status   | RUS |

Values capped at 200 characters. Per-tab filter-xmark icon buttons
appear in the tab toolbar whenever any key for that tab is stored.

#### Form draft keys (`lf_form:<modal-id>`)

| Key | Modal | Notes |
|-----|-------|-------|
| `lf_form:project-modal` | Add Project | New records only; edit uses server autosave |

Draft JSON is capped at 50 KB. A yellow banner ("Draft restored —
saved N min ago | Discard?") appears at the top of the modal body
when a draft is found. Draft is cleared on successful save;
survives Cancel/Close so the next open re-offers it.

### Tab persistence

`showView(view)` calls `history.replaceState(null, '', '#' + view)`.
`init()` reads `location.hash` and routes to that view on load.
`popstate` listener handles browser back/forward.

### Clearing all state

Settings modal footer → **Clear all saved UI state** button calls
`clearAllPersistedUiState()` which removes every `lf_filter:*` and
`lf_form:*` key and alerts the count. Page reload applies the reset.

---

## Live Updates (SSE)

Real-time propagation across all portals without manual refresh. Every
data-write on the server fires a Server-Sent Event; every open browser
tab receives it and refreshes the affected view within 500 ms.

### Server — `routes/_sse.js`

Exports two functions:

| Function | Signature | Purpose |
|---|---|---|
| `attach(app, mw)` | `mw.requireAuth` from auth.js | Registers `GET /api/events/stream` |
| `broadcast(channel, event, payload)` | string, string, object | Sends a named SSE event to all subscribers on that channel |

Registered in `server.js` AFTER `installAuthRoutes` (so `req.user` is
populated) and BEFORE `express.static`.

#### Channels

| Channel | Subscribers |
|---|---|
| `admin` | admin role + both manager roles (design_manager, permitting_manager) |
| `team:design` | admin + design_manager + design_engineer |
| `team:permitting` | admin + permitting_manager + permitting_engineer |
| `team:construction` | admin only (construction team not yet a portal role) |

Admin gets all channels (subscribes to all four). A role can appear on
multiple channels; over-broadcast from the server is harmless since the
client only acts on events it cares about.

Heartbeat: `: ping\n\n` every 25 s. Keeps Railway/nginx proxies from
closing idle connections. `X-Accel-Buffering: no` disables nginx
response buffering so events arrive immediately.

#### Event catalogue

| Event name | Channel | Fired from |
|---|---|---|
| `project_added` | admin | routes/projects.js POST |
| `project_updated` | admin | routes/projects.js PUT |
| `project_deleted` | admin | routes/projects.js DELETE (all variants) |
| `time_entry_added` | admin + all team channels | routes/time_entries.js POST + bulk |
| `time_entry_updated` | admin + all team channels | routes/time_entries.js PUT |
| `time_entry_deleted` | admin + all team channels | routes/time_entries.js DELETE |
| `time_entries_bulk_deleted` | admin + all team channels | routes/time_entries.js DELETE /by-staff |
| `contract_added` | admin | routes/contracts.js POST |
| `contract_updated` | admin | routes/contracts.js PUT |
| `contract_deleted` | admin | routes/contracts.js DELETE |
| `engineering_contract_added` | admin | routes/engineering_contracts.js POST |
| `engineering_contract_updated` | admin | routes/engineering_contracts.js PUT |
| `engineering_contract_deleted` | admin | routes/engineering_contracts.js DELETE |
| `client_added` | admin | routes/clients.js POST |
| `client_updated` | admin | routes/clients.js PUT |
| `client_deleted` | admin | routes/clients.js DELETE |
| `staff_added` | admin + all team channels | routes/staff.js POST |
| `staff_updated` | admin + all team channels | routes/staff.js PUT |
| `staff_deleted` | admin + all team channels | routes/staff.js DELETE (hard + soft) |
| `permit_updated` | admin + team:permitting | routes/permits.js advance/regress/doc upload |
| `invoice_created` | admin | routes/billing.js bill-multiple + batch confirm |
| `invoice_voided` | admin | routes/invoices.js DELETE |
| `batch_committed` | admin | routes/billing.js batch POST + batch confirm |
| `batch_voided` | admin | routes/billing.js batch DELETE |

Note: `permit_added` and `permit_deleted` event names are registered in
the client but currently the server only fires `permit_updated` (the
permitting pipeline advances/regresses stages rather than adding/deleting
permits as separate entities). Reserved for future expansion.

Note: `job_added/updated/deleted` events are registered in the client
event listener list in admin.html but are not currently fired server-side
(jobs are a static config list, admin-managed, rarely changes, and already
refreshed on the polling tick). Reserved for future expansion.

### Client — subscriber pattern

Each portal HTML file contains a self-contained IIFE that calls
`startSse()` on `window.load`. The pattern:

```js
(function() {
  let _sseSource = null;

  function startSse() {
    if (_sseSource) return;
    if (!('EventSource' in window)) return;  // IE fallback guard
    _sseSource = new EventSource('/api/events/stream', { withCredentials: true });
    _sseSource.addEventListener('error', () => {
      _sseSource.close();
      _sseSource = null;
      setTimeout(startSse, 5000);  // auto-reconnect
    });
    // Wire events...
  }

  window.addEventListener('load', startSse);
})();
```

#### admin.html — full event bus

Subscribes to all 24+ event names and re-emits each as a
`CustomEvent` on `document`:

```js
document.dispatchEvent(new CustomEvent('sse:' + name, { detail }));
```

Tab modules listen to these custom events independently.

#### Tab module pattern (debounced + visibility-aware)

```js
let _tabStaleTimer = null;
let _tabStale = false;

function _tabDebounce() {
  if (currentView !== 'my-tab') {
    _tabStale = true;   // defer until tab is active
    return;
  }
  clearTimeout(_tabStaleTimer);
  _tabStaleTimer = setTimeout(loadMyTab, 500);  // 500 ms debounce
}

SSE_EVENTS.forEach(ev => document.addEventListener('sse:' + ev, _tabDebounce));

// Wrap showView to detect stale-on-activate
const _prev = window.showView;
window.showView = function(view) {
  _prev(view);
  if (view === 'my-tab' && _tabStale) {
    _tabStale = false;
    clearTimeout(_tabStaleTimer);
    _tabStaleTimer = setTimeout(loadMyTab, 100);
  }
};
```

500 ms debounce: if 10 events arrive in quick succession (e.g., a bulk
CSV import), only one reload fires. Visibility-aware: if the affected
tab is not the active view, the flag `_*Stale` is set to true instead of
refetching. When the user switches to that tab, `showView` detects the
stale flag and triggers a 100 ms deferred reload.

#### Tab-to-event mapping summary

| Tab / module | SSE events that trigger a reload |
|---|---|
| `dashboard_views.js` | project_*, time_entry_*, invoice_*, batch_* |
| `projects_tab.js` | project_*, client_*, contract_* |
| `inspection_tab.js` | time_entry_*, project_updated/deleted |
| `hours_tab.js` | time_entry_*, project_updated/deleted, staff_* |
| `revenue_tab.js` | project_updated/deleted, invoice_*, time_entry_* |
| `billing_tab.js` | invoice_*, batch_*, project_updated/deleted |
| `clients_settings.js` | client_* |
| `engineering_contracts.js` | engineering_contract_*, client_* |
| `construction_contracts.js` | contract_*, engineering_contract_*, client_* |
| `jobs_settings.js` | job_* |
| timeclock portal | time_entry_*, project_*, staff_* |
| permitting portal | permit_*, time_entry_*, project_* |
| design portal | time_entry_*, project_*, staff_* |

### Coverage commitment

**Every interactive view that reads data MUST refresh via SSE. Polling is a
recovery heartbeat only — never the primary refresh mechanism.**

- Default poll interval is 60 s, intended solely to recover from a silently
  dropped EventSource (proxy reset, suspend/resume, network blip). It is NOT
  a substitute for SSE coverage.
- A view added without SSE wiring is a regression — reviewers should reject
  the PR and ask "what events does this view need to subscribe to?"

#### Outstanding views to migrate (admin portal)

These admin-portal handlers are still polling-only — each needs broadcast hooks
in the matching write path AND a `document.addEventListener('sse:<event>', …)`
subscription in the tab module:

| Handler | Likely events to subscribe |
|---|---|
| `loadPipeline` (permit pipeline view) | `permit_*`, `project_updated/deleted` |
| `loadPotential` (potential permits) | `project_*` (filter on `project_type='potential_permit'`), `permit_*` |
| `loadDesign` (admin design view) | `project_*` (design-typed), `time_entry_*` |
| `loadPermits` (permits list) | `permit_*`, `project_updated/deleted` |
| `refreshProjectDetail` (project detail popup) | `project_*`, `time_entry_*`, `invoice_*` (scoped to the open project_id) |
| `refreshApprovalsBadge` (top-bar approvals counter) | `pending_*` events when the approvals routes broadcast |

For each row above:
1. Confirm the corresponding write routes already broadcast — if not, add the
   `broadcast('admin', '<event>', { id })` line at the end of the success path.
2. Subscribe in the module, debounce through the existing 500 ms `_tabDebounce`
   helper, and respect the visibility-aware staleness flag pattern.
3. After SSE is wired, drop the `setInterval(loadX, POLL_MS)` call (or keep it
   as a 60 s recovery heartbeat — match whatever the rest of admin.html does).

#### Out-of-scope (intentionally polling)

Views that genuinely don't need real-time updates and stay on a slow poll or
no poll at all:

- One-shot dialogs / modal pickers (open-fetch-close — not subscribed).
- Customer portal (`public/customer.html`) — read-only, low-frequency.
- Splice tool — has its own project-scoped SSE channel; not bridged into admin.

### Scope boundaries

- `routes/splice.js` has its own project-scoped SSE (`GET /api/splice/projects/:id/events`). Splice events are NOT bridged into the admin SSE — the two systems are intentionally separate.
- `public/splice.html` has its own `EventSource` subscriber. No changes made.
- Customer portal (`public/customer.html`) has no SSE — it is read-only and low-frequency. No changes made.
