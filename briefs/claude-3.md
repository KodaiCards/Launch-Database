# Claude 3 — Client portal: service-area status view (Phase 6)

**Status:** NOT STARTED
**Branch:** `claude-3/client-portal-status`
**Read first:** `CLAUDE.md`, `ROADMAP.md` (Phase 6), `briefs/README.md`.

## Goal
A client-facing, read-only view: a `customer`-role user sees **their own clients' service areas** with each one's status / progress (done vs remaining). No internal rates, costs, or $ amounts — clients see *status*, not money. (Map per area comes later in Phase 7; leave a placeholder.)

## Build
1. Customer endpoint: `GET /api/customer/service-areas` → service areas for the clients linked to the logged-in user via `customer_clients` (`user_id` → `client_id`s), each with: name, program (RUS vs not), per-team job statuses, and a simple progress figure (e.g. jobs done / total). **Filter to `client_visible = true`** (CEO decision 2026-06-23: clients see only areas we choose to expose; the admin toggle to set the flag is CEO scope — head Claude adds it. Test by flagging a couple areas true.) **Exclude `rate`, `estimated_amount`, `actual_amount`, invoices.** Put it in `routes/customer_portal.js` (exists) — match its existing scope pattern.
2. Client page: in `public/customer.html` (exists) **add a new "Service Areas" tab** — additive and non-destructive — that lists the client's service areas with status + a small progress indicator. App-shell themed. (CEO decision 2026-06-23: additive only. **Leave the legacy Projects tab exactly as-is — don't reorder, demote, or replace existing tabs.** CEO retires/hides the legacy Projects tab at merge when the projects-tree cutover lands.)

## Boundaries
- **No financials leaked** — status/progress only. Double-check the SELECT excludes money columns.
- Respect the role guard: `customer`-role users can only hit `/api/customer/*` (see `server.js` customer scope guard + `routes/customer_portal.js`). Don't loosen it.
- Don't change the keystone model/schema/migrations. Read-only.
- Test in-process: mount your endpoint vs the dev DB, seed a `customer_clients` link + a service area, confirm a customer sees only their linked client's areas and no $ fields. CEO wires any `server.js` change at merge.

## Acceptance
- A `customer`-role user sees only their linked clients' service areas with status/progress; an admin/other client cannot see another client's areas; no rates/amounts/invoices appear anywhere in the response or page.

---

## Next up — work top-to-bottom, DON'T wait for CEO between tasks
Keep pushing to your **same branch** after **each** task (tell Carter the branch name once so CEO can fetch it); tick the checkbox; start the next. CEO batch-merges. Schema/convention change → STOP, set Status `BLOCKED — needs CEO`, ping Carter. All additive, read-only, `customer`-scoped; keystone schema/migrations off-limits. Test each in-process vs dev DB.

- [x] **1. Per-area detail expand.** Click a service-area card → expand to job-by-job status + start/completed dates (data you already fetch — pure frontend, no new $). Keep it inside the under-construction shim.
- [x] **2. Portal invoices from keystone.** Confirm `/api/customer/invoices` surfaces invoices created by the service-area billing flow; render sent/paid status + line items (never drafts). Customer-scoped, no internal cost columns beyond what the client is billed.
- [x] **3. Map link (read-only).** When `service_areas.map_file_path` is set AND the area is `client_visible`, replace the "Map view coming soon" placeholder with a download/preview link. Additive; any file-serving route stays `customer`-scoped + read-only.

### Round 2 (1–3 merged ✓ — map endpoint security was clean: traversal guard, nosniff, scoped)
- [x] **4. Summary header + robust states.** On the Service Areas tab add a header (total areas, overall % complete across all areas) and proper loading / empty / error states. Frontend only.
- [x] **5. Inline map preview.** Add `?inline=1` to your `GET /api/customer/service-areas/:id/map` — for `image/*` and `application/pdf` ONLY, serve inline with the correct `Content-Type` (keep `nosniff`); default (no param) stays `attachment`. Add a modal viewer on the card. Keep all the existing scope/traversal guards.
- [ ] **6. Per-area timeline.** Render each area's `start_date` → `completed_date` and a simple stage progression derived from job statuses. Frontend (data already fetched).

> Note: the portal stays behind the under-construction shim until CEO flips it on (tied to readiness + the `client_visible` admin toggle CEO is adding). Build against flagged test areas.
