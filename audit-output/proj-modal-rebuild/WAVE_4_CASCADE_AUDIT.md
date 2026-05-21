# WAVE 4 CASCADE UX PARITY AUDIT

**Audit Date:** 2026-05-21 (agent/wave-4-cascade-audit)  
**Scope:** Compare CREATE-project flows across permitting, design, and timeclock portals to identify missing fields relative to admin's rebuilt modal.  
**Goal:** Determine exact scope for Wave 4 fix to expose the same 6-row field set + EC vs no-EC mode handling.

---

## Executive Summary

The **admin portal rebuilt the project modal as a 6-row form with EC vs no-EC mode toggle + auto-derived WO# + Engineering Contract cascade** (Wave 1 Phase A). The **three user-facing portals (permitting, design, timeclock) were NOT updated yet** — each still uses a simplified 4-tier cascade picker (Client → Program → SA → Job) that only works for EC clients and does not expose Engineering Contract selection.

**Missing parity gaps:**
1. **EC vs no-EC mode switch** — only admin has it; portals default to EC-only
2. **Engineering Contract dropdown** — only admin exposes it; portals assume EC is auto-selected
3. **Work Order Number display** — only admin shows it; portals pass it hidden in the backend
4. **Service Area free-text input** — only admin has it for no-EC clients; portals cannot create no-EC projects
5. **Status + Start Date fields** — permitting/design expose them in EDIT mode, but NOT in CREATE mode via cascade

**Endpoint limitation:** `/api/projects/resolve-or-create` is **EC-scoped only** — accepts `(client_id, program, service_area_id, job_name)`. Does NOT handle no-EC creation path (which would need `service_area_label` instead of `service_area_id`).

---

## Per-Portal Detailed Findings

### PERMITTING.HTML

**Create flow location:** Lines 1406–1460 (`ppCascadeSubmit()` function)

**Current field set:**
- Client (select) — required
- Program (select) — required  
- Service Area (select from dropdown) — required
- Job Name (text input + datalist) — required

**Missing vs admin:**
- [ ] Engineering Contract dropdown (not exposed; assumed from client+program)
- [ ] Work Order Number display (collected via hidden backend, not shown to user)
- [ ] Service Area free-text input (no-EC mode fallback)
- [ ] EC vs no-EC mode toggle (assumed EC for all clients)
- [ ] Status dropdown (hidden in cascade mode; only visible in edit modal)
- [ ] Start Date picker (hidden in cascade mode; only visible in edit modal)

**Endpoint call:** `POST /api/projects/resolve-or-create` (line 1420)  
**Payload structure:**
```javascript
{
  client_id: clientId,
  program: program,  // 'rus' | 'bau' | 'gfr' | 'other'
  service_area_id: saId,  // UUID from EC-scoped SA dropdown
  job_name: jobName
}
```

**No-EC handling:** BLOCKED. If a client has no EC, the program dropdown loads empty; permitting cannot create projects for that client.

**Modal HTML structure:**
- Cascade picker wrapped in `#pp-cascade-wrap` (lines 442–478)
- 4 dropdowns in 2×2 grid: Client, Program, Service Area, Job Name
- Error banner + submit button below
- Hidden from edit mode (edit uses a flat modal at lines 479–530)

**Field count for create:** 4 + error display + button = minimal UX

**Gap priority:**
- **HIGH:** EC vs no-EC mode handling (blocks no-EC clients entirely)
- **HIGH:** Service Area free-text for no-EC
- **MED:** Status + Start Date in cascade mode
- **LOW:** WO# display (cosmetic, auto-derived on backend)

---

### DESIGN.HTML

**Create flow location:** Lines 1435–1476 (`dpSubmitCascade()` function)

**Current field set:**
- Client (select, auto-filled from cascade) — required  
- Program (hardcoded as `proj-ptype` select, lines 447–453) — required
- Service Area (select from dropdown) — required
- Job Name (text input + datalist) — required

**Missing vs admin:**
- [ ] Engineering Contract dropdown (not exposed; assumed from client+program)
- [ ] Work Order Number display (not shown)
- [ ] Service Area free-text input (no-EC mode)
- [ ] EC vs no-EC mode toggle (assumed EC)
- [ ] Status dropdown (hidden in cascade; only in edit modal)
- [ ] Start Date picker (hidden in cascade; only in edit modal)

**Endpoint call:** `POST /api/projects/resolve-or-create` (line 1453)  
**Payload structure:**
```javascript
{
  client_id: clientId,
  program: program,  // from proj-ptype select
  service_area_id: saId,
  job_name: jobName
}
```

**Session persistence:** Design saves cascade selections to `sessionStorage` (lines 1456–1459) for sticky UX — this is a DESIGN-SPECIFIC pattern not present in permitting/timeclock.

**No-EC handling:** BLOCKED (same as permitting).

**Modal HTML structure:**
- Cascade picker wrapped in `#dp-cascade-wrap` (lines 443–471)
- Program + Service Area in first row (2-column), Job in second row (full-width)
- Error banner + submit button below
- Hidden from edit mode

**Field count for create:** 4 + error display + button

**UNIQUE to design:** sessionStorage persistence across page reloads (lines 1479–1505 `dpRestoreSession()`). This should be replicated to permitting + timeclock once the cascade is unified.

**Gap priority:**
- **HIGH:** EC vs no-EC mode (blocks no-EC clients)
- **HIGH:** Service Area free-text for no-EC
- **MED:** Status + Start Date in cascade mode
- **LOW:** WO# display

---

### TIMECLOCK.HTML

**Create flow:** TWO separate paths — (a) cascade for EC clients (lines 1415–1442), (b) "Request New Project" modal for admin approval (lines 1453–1494)

**Path A — Cascade picker for EC clients:**

**Flow location:** Lines 1415–1442 (`resolveOrCreateFromCascade()` helper)  
**Current field set:**
- Client (implied from context; not explicitly shown in the helper) — required
- Program (passed as parameter) — required
- Service Area (from option dataset, line 1430) — required
- Job Name (text input) — required

**Endpoint call:** `POST /api/projects/resolve-or-create` (line 1438)  
**Payload:**
```javascript
{
  client_id,
  program,
  service_area_id,
  job_name
}
```

**No-EC handling:** BLOCKED (cannot reach this code path if client has no EC).

**Field count for cascade:** 4 inputs (all required)

**Missing vs admin:**
- [ ] Engineering Contract dropdown
- [ ] Work Order Number display
- [ ] Service Area free-text for no-EC
- [ ] EC vs no-EC mode toggle
- [ ] Status / Start Date options

**Path B — "Request New Project" modal for non-EC or user-initiated requests:**

**Modal location:** Lines 406–443 (`#rnp-modal`)  
**Current field set:**
- Client (select, auto-filled from context) — required
- Project Name (text input) — required
- Service Area (select for PSC/RUS only, optional, lines 425–426) — optional
- Work Order Number (text input, optional) — optional
- Notes (textarea, optional) — optional

**Endpoint call:** `POST /api/portal/projects/request-create` (line 1480) — DIFFERENT endpoint from resolve-or-create  
**Payload structure:**
```javascript
{
  name,
  work_order_number,
  client_id,
  notes
}
```

**Outcome:** Submits a request that enters a pending queue (admin approval required). The request is stored as `setting_change_requests` with type `project_create` (implied by handler). On approval, a new project is created + time entries retro-attach.

**Field count for request:** 5 fields (2 required, 3 optional)

**This is intentionally DIFFERENT from admin's create modal** — it's a lightweight proposal form, not a full project create. Timeclock intentionally keeps it simple because non-admin engineers cannot create projects directly; they must request.

**Missing vs admin:**
- [ ] Program selector (request doesn't include program — admin infers from client or defaults)
- [ ] Engineering Contract (request doesn't include it)
- [ ] Service Area (request includes it optionally, but ONLY for PSC/RUS)
- [ ] Status + Start Date (not needed in request; admin sets on approval)
- [ ] Job type (not in request; admin assigns on approval)

**No-EC handling:** Timeclock's request path partially handles it — name + client + WO# + notes is enough for admin to create a no-EC project. But timeclock ALSO cascades via resolve-or-create for EC clients, so there's a TWO-PATH design.

---

## Field Set Comparison Table

| Field | Admin (6-row rebuild) | Permitting (cascade) | Design (cascade) | Timeclock (cascade) | Timeclock (request) |
|-------|---|---|---|---|---|
| **Client** | ✓ select | ✓ select | ✓ select (hidden in cascade, pre-filled) | ✓ implied | ✓ select |
| **Program** | ✓ select (row 2) | ✓ select | ✓ select (inline as proj-ptype) | ✓ parameter | — |
| **Engineering Contract** | ✓ select (row 3a, EC-mode) | ✗ | ✗ | ✗ | ✗ |
| **Service Area (EC)** | ✓ select (row 3a, EC-mode, concentrator) | ✓ select | ✓ select | ✓ select | ✓ select (PSC/RUS only) |
| **Service Area (no-EC)** | ✓ text input (row 3b, no-EC-mode) | ✗ | ✗ | ✗ | Implied in request |
| **Work Order Number** | ✓ auto-derived display (row 3a) | ✗ hidden backend | ✗ hidden backend | ✗ hidden backend | ✓ optional input |
| **Job / Job Name** | ✓ typeahead (row 4) | ✓ text+datalist | ✓ text+datalist | ✓ text input | ✗ (request doesn't include) |
| **Status** | ✓ select (row 5) | ✗ (edit-mode only) | ✗ (edit-mode only) | ✗ | ✗ (admin sets on approval) |
| **Start Date** | ✓ date picker (row 5) | ✗ (edit-mode only) | ✗ (edit-mode only) | ✗ | ✗ |
| **Notes** | ✓ textarea (row 6) | ✗ (edit-mode only) | ✗ (edit-mode only) | ✗ | ✓ optional textarea |
| **EC vs no-EC toggle** | ✓ mode switch | ✗ assumes EC | ✗ assumes EC | ✗ assumes EC | Partial (request fallback) |

---

## Build Scope Recommendation

### OPTION A: Backend change ONLY (lowest cost, highest leverage)

**Extend `/api/projects/resolve-or-create` to handle no-EC clients:**

1. Add new optional parameter: `service_area_label` (string, for no-EC clients)
2. Add new optional parameter: `ec_id` (UUID, explicit override if admin wants to specify)
3. Update validation: if `service_area_id` provided, use EC path; if `service_area_label` provided, use no-EC path; if neither, 400 error
4. Update the "service-area folder" lookup: for no-EC, auto-create or fetch the service-area rollup under (client_id → program → service-area-label) instead of under an EC

**Pros:**
- No FE changes needed on permitting/design/timeclock for MVP
- All portals automatically gain no-EC support
- Minimal backend code change

**Cons:**
- Portals still don't expose the free-text service-area input (UX gap)
- Users can't SEE what SA they're creating under in no-EC mode
- Status + Start Date fields remain hidden in cascade mode

**Cost estimate:** 1 backend fix-agent commit, ~80-120K Sonnet, 1 RT pair (verify EC vs no-EC path logic)

**Ship timeline:** 2-3 hours wall-clock

---

### OPTION B: FE updates + Backend support (medium cost, full UX parity)

**Update all 3 portals + endpoint:**

1. **Backend:** Extend endpoint per Option A above
2. **Permitting.html:** (a) add Engineering Contract dropdown pre-program; (b) add Service Area free-text input for no-EC; (c) add mode toggle (EC vs no-EC); (d) add Status/Start Date fields in cascade area (optional)
3. **Design.html:** same as permitting + preserve sessionStorage persistence
4. **Timeclock.html:** (a) unify cascade + request flows (single create modal instead of two); (b) add free-text SA for no-EC; (c) add mode toggle; (d) optional: add Status/Start Date

**Pros:**
- Full UX parity with admin
- Users see SA input + WO# display + status options
- Cleaner, unified create flow per portal

**Cons:**
- 3 portals × 3-4 hour refactor each = 10-12 hours FE work
- Timeclock refactor is highest-risk (merging two distinct flows)
- More tests needed (EC vs no-EC mode switching)

**Cost estimate:** 
- FE work: 3 portal-focused agents, ~2-3 hours each, ~80-100K Sonnet each
- Backend: 1 agent, ~80K Sonnet  
- Testing: +1 agent, ~60K Sonnet
- Total: ~550-700K Sonnet

**Ship timeline:** 8-10 hours wall-clock

---

### OPTION C: Backend + Timeclock only (compromise, quick no-EC unblock)

**Why:** Timeclock is the primary non-EC use case (crew logs hours). Design/Permitting are 90% PSC (EC client). Unblocking timeclock unlocks real no-EC workflow.

1. **Backend:** Extend endpoint per Option A
2. **Timeclock.html ONLY:** (a) merge cascade + request flows into a single modal; (b) add mode toggle; (c) add free-text SA input for no-EC; (d) always include program selector

**Pros:**
- Design/Permitting unchanged (admin can use admin portal for complex creates)
- Timeclock crew gets full no-EC support
- Significant wall-clock savings vs Option B

**Cons:**
- Design/Permitting users still see "no EC" error → must use admin portal
- Inconsistent UX across portals

**Cost estimate:**
- Backend: ~80K Sonnet
- Timeclock FE: 1 agent, ~100-120K Sonnet
- Testing: +50K Sonnet
- Total: ~250-300K Sonnet

**Ship timeline:** 4-5 hours wall-clock

---

## Recommendation: OPTION B (Full Parity)

**Rationale:**
- Admin rebuilt the modal specifically to unify the UX. Portals should match.
- EC vs no-EC toggle is low-risk FE (a single `if` statement toggling row visibility).
- Design's sessionStorage persistence is already a strength — replicating to permitting/timeclock is +5 lines per portal.
- Status + Start Date in cascade mode is OPTIONAL (can defer to Phase 2 if time-constrained).
- Tests are straightforward (EC client → contract displays; no-EC client → free-text displays; submit works for both).

**If time is constrained:** Start with OPTION A (backend) + Timeclock FE (Option C subset), then Phase 4b upgrades Design/Permitting.

---

## Endpoint Contract Changes Required

### Current `/api/projects/resolve-or-create`

```javascript
POST /api/projects/resolve-or-create
body: {
  client_id: UUID,
  program: 'rus' | 'bau' | 'gfr' | 'other',
  service_area_id: UUID,  // REQUIRED
  job_name: string
}
response: { id, name, status, created }
```

**Limitation:** Requires `service_area_id` (EC-only path).

### Proposed NEW signature

```javascript
POST /api/projects/resolve-or-create
body: {
  client_id: UUID,
  program: 'rus' | 'bau' | 'gfr' | 'other',
  // EITHER service_area_id (EC path) OR service_area_label (no-EC path)
  service_area_id?: UUID,
  service_area_label?: string,
  job_name: string,
  // OPTIONAL admin-level fields
  ec_id?: UUID,  // explicit EC override (admin-only)
  engineering_contract_id?: UUID  // alias for ec_id
}
response: { id, name, status, created, ec_id?, service_area_id, work_order_number? }
```

**Backend logic:**
1. If `service_area_id` provided: use EC path (current behavior)
2. Else if `service_area_label` provided:
   - Find or create no-EC rollup chain: Client → Program → ServiceAreaLabel (no EC)
   - Create leaf under that SA folder
3. Else: 400 error (one of the two is required)

**Validation:**
- If both `service_area_id` and `service_area_label` provided: 400 (mutually exclusive)
- If neither: 400
- If `service_area_id` provided but EC doesn't exist: 404 (current behavior)
- If `service_area_label` provided but client+program has NO no-EC rollup: auto-create it

---

## Cascade-Specific Patterns to Preserve

### Permitting.html (`pp` prefix)
- **Session state:** NONE (stateless form)
- **Error handling:** ppSetError() / ppClearError()
- **Loading state:** ppSetLoading(true/false)
- **On success:** dismisses modal, reloads loadProjects() + loadPipeline()

### Design.html (`dp` prefix)
- **Session state:** sessionStorage persistence (UNIQUE, should be replicated)
- **Error handling:** dpClearError() / dpShowError()
- **Loading state:** implicit (no loading spinner shown)
- **On success:** dismisses modal, reloads loadProjects() + loadPipeline()
- **Toast:** dpShowToast() on success

### Timeclock.html (dual path)
- **Cascade path:** resolveOrCreateFromCascade() helper (used by saveEntry())
- **Request path:** openRequestNewProjectModal() + submitRequestNewProject()
- **Session state:** NONE (request flow is stateless)
- **On success:** stashes request_id, shows pending banner, returns from modal

**Wave 4 build must preserve all these patterns** (don't flatten into a generic handler).

---

## Known Issues to Address During Build

1. **Wave 5 picker bug:** Lines 1560 (permitting) and 1618 (design) have unfiltered cache-reload fallbacks. Wave 4 refactor should fix these to use `?leaves_only=true`.

2. **Permitting contract field:** Permitting edit modal has a `#proj-contract` select (line 436) that's hidden. If EC clients have multiple contracts, Wave 4 should expose that in cascade mode too (not just admin).

3. **Timeclock dual-path complexity:** Merging cascade + request flows adds state complexity. Be disciplined about when each path fires (cascade on existing SA selection, request on manual entry).

---

## Test Coverage Checklist for Wave 4

**EC-mode (existing contract exists):**
- [ ] Client select → Program select populates
- [ ] Program select → EC auto-selected (display shows contract details)
- [ ] Program select → Service Area select populates with EC's SAs
- [ ] Service Area select → Job name datalist populates
- [ ] Submit → project created under SA rollup
- [ ] Session persists (design/timeclock) across reload

**No-EC-mode (no contract for client+program):**
- [ ] Client select → Program select populates
- [ ] Program select → "No EC" banner shows + free-text SA input appears
- [ ] Free-text SA input → user can type custom SA name
- [ ] Job name datalist populates (generic, not EC-scoped)
- [ ] Submit → project created under (Client → Program → CustomSA) rollup
- [ ] Error handling if SA folder doesn't exist (auto-create? or error?)

**Cross-portal consistency:**
- [ ] Permitting cascade UX matches Design cascade UX
- [ ] Design cascade UX matches Timeclock cascade UX (after merge)
- [ ] All show same error messages on failure
- [ ] All auto-clear error on field change
- [ ] All reload projects list on success

**Permitting-specific:**
- [ ] Contract field visible + selectable for EC clients
- [ ] WO# display reads from contract / SA

**Design-specific:**
- [ ] sessionStorage persists selections across page reloads
- [ ] sessionStorage clears on cancel/escape

**Timeclock-specific:**
- [ ] Cascade path + Request path both work
- [ ] Request creates pending project (not merged)
- [ ] Cascade creates merged project immediately
- [ ] can't mix cascade + request in same entry

---

## Estimated Changes per Portal

### Permitting.html
**Lines affected:** 442–478 (cascade picker HTML) + 1267–1460 (cascade JS functions)  
**Changes:**
- Add mode toggle (EC vs no-EC)
- Add Engineering Contract dropdown (appears after Program selection in EC mode)
- Add Service Area free-text input (appears in no-EC mode)
- Add Status/Start Date fields (optional, can defer)
- Update ppCascadeSubmit() to handle both paths
- Add EC validation error handling

**Estimated lines changed:** ~150 lines (50 HTML, 100 JS)

### Design.html
**Lines affected:** 443–471 (cascade picker HTML) + 1300–1510 (cascade JS functions)  
**Changes:**
- Add mode toggle
- Add Engineering Contract dropdown
- Add Service Area free-text input
- Update dpSubmitCascade() to handle both paths
- Preserve sessionStorage for BOTH modes (EC + no-EC selections)

**Estimated lines changed:** ~140 lines (50 HTML, 90 JS)

### Timeclock.html
**Lines affected:** 406–443 (request modal HTML) + 1415–1495 (both path JS functions)  
**Changes:**
- Merge cascade + request flows into single unified modal (higher-risk refactor)
- Add mode toggle
- Add Engineering Contract dropdown (cascade mode only)
- Add Service Area free-text input (no-EC mode)
- Update resolveOrCreateFromCascade() to use new backend contract
- Update submitRequestNewProject() to be optional (only used if user explicitly chooses "request" tab)

**Estimated lines changed:** ~200 lines (60 HTML, 140 JS) — highest complexity due to dual-path merge

### Backend (routes/projects.js)
**Lines affected:** resolve-or-create endpoint (~50 current lines)  
**Changes:**
- Add service_area_label parameter
- Add conditional logic: if service_area_id use EC path, else use no-EC path
- Update SA folder lookup for no-EC (may need to auto-create root SA)
- Update response to include work_order_number (derived from SA or contract)

**Estimated lines changed:** ~30 lines new/modified (refactor slightly, add path branching)

---

## Git State

```bash
$ git log -1 --oneline origin/main
<current main SHA>

$ git log -3 --oneline agent/wave-4-cascade-audit
<pending: will show this audit file on merge>
```

---

## Next Steps (Orchestrator Decision)

1. **Confirm Option B** (full parity build) vs. Option A (backend-only) vs. Option C (timeclock-focused)
2. **Assign Wave 4 fix-agent** with chosen scope — dispatch with detailed per-portal specs
3. **Follow with Wave 4 RT pair** (verify EC vs no-EC toggle works, session persistence persists, no regressions on existing portals)
4. **If Option B:** allocate 2 fix-agents in parallel (permitting + design) + 1 timeclock-specific agent (higher complexity), then 2 RT pairs, then CI-green check
5. **If Option A:** Single fix-agent on backend + 1 RT pair, fast ship (3-4 hours)

=== WAVE 4 CASCADE AUDIT END ===
