# Claude 3 — Client portal: service-area status view (Phase 6)

**Status:** Tasks 1–24 DONE — ready for review (Phase 6 + Rounds 1–6) on `claude/inspiring-bell-7jiwdf`. Task 14 (site photos) DEFERRED → Phase 7.
**Branch:** `claude/inspiring-bell-7jiwdf` (harness-assigned; supersedes the original `claude-3/client-portal-status`)
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
- [x] **6. Per-area timeline.** Render each area's `start_date` → `completed_date` and a simple stage progression derived from job statuses. Frontend (data already fetched).

> Note: shim LIFTED by CEO 2026-06-23 — the portal is now live (WIP) at the URL, landing on the Service Areas tab. Data shows for `client_visible` areas only.

### Round 3 — portal depth (frontend, additive; no schema)
Reuse existing `/api/customer/*` data; no new money columns. Schema need → BLOCKED + ping.
- [x] **7. Client-facing invoice detail / print.** A clean printable invoice view (line items + totals) from existing `/api/customer/invoices` data + a Print button. No backend.
- [x] **8. Portal landing summary.** A top section across ALL the client's areas (active count, overall % complete, # ready/done) above the tabs. Frontend.
- [x] **9. Polish.** Responsive/mobile pass, a clear "no client-visible areas yet" empty state, and loading skeletons. Frontend.

> **CEO note (you hit usage limits mid-Round-3):** no problem — finish 7–9, push to your branch, and they'll be batch-merged when you're back. Nothing is blocked on you. The portal shim is lifted and live, so you can see your work at `/customer.html` (needs a `customer` login + a `client_visible` area).

---

## Round 4 — queue (portal depth, when 7–9 are in)
Same guardrails: **read-only, `customer`-scoped, no $ beyond what the client is billed, NO schema/keystone changes.** Push per task; schema need → `BLOCKED — needs CEO` + ping. Pull `main` first each time.
- [x] **10. Per-area progress bar.** Jobs done / total as a visual bar on each area card (+ projected completion if start/completed dates allow). Frontend over data you already fetch.
- [x] **11. Status activity feed.** A simple "recent updates" list per area (latest job status changes / dates). If it needs a new read endpoint, add a `customer`-scoped one in `routes/customer_portal.js`; no new tables.
- [x] **12. Account panel polish.** Read-only profile (name, email, linked client(s), contact-your-PM block). Reuse existing account modal; no new auth.
- [x] **13. Portal accessibility + mobile.** Full a11y pass (labels, focus, contrast) + mobile layout across all tabs.
- [ ] **14. Site photos — `BLOCKED — needs CEO` (schema).** Checked `project_photos` (schema.sql): it links to `project_id` (legacy projects) only — **no `service_area_id` link and no `client_visible` flag**. To surface client-visible site photos per service area I'd need (CEO/schema, keystone is off-limits to me):
  - **(a)** `project_photos.service_area_id uuid REFERENCES public.service_areas(id) ON DELETE CASCADE` (and/or `service_area_job_id`), and
  - **(b)** `project_photos.client_visible boolean NOT NULL DEFAULT false` + an admin toggle to flip it (mirroring the `service_areas.client_visible` pattern).
  With those, I can add a `customer`-scoped, read-only `GET /api/customer/service-areas/:id/photos` (gated on the area being a linked client's + `client_visible`) plus a scoped image route reusing the map endpoint's UPLOAD_DIR/traversal guards. Skipped per instructions (nothing after this in the queue).

> **CEO DECISION 2026-06-23 — DEFER task 14 to Phase 7.** Your spec is correct and good — thank you. Reason for deferring: it's not just a portal task. To produce any data it needs (a) the migration, **plus** (b) an admin-side UI to attach photos to a service area and flip `client_visible`. That spans admin + schema + portal, so it belongs with **Phase 7 (file/KMZ + media attachment per service area)**, built as one coherent piece — not bolted on mid-Phase-6. Maps already attach per area (`map_file_path`); photos will ride the same Phase-7 attachment model. Nothing for you to do here now; the migration you specced is on record for Phase 7.

---

## Round 5 — portal depth (Sonnet @ medium; additive, `customer`-scoped, NO schema)
Same guardrails as before: read-only, customer-scoped, no $ beyond what the client is billed, no keystone/schema changes. Push per task to your branch; CEO batch-merges. Schema need → `BLOCKED — needs CEO` + ping, skip ahead. Pull `main` first.
- [x] **15. Multi-client switcher.** If a `customer` user is linked to >1 client, add a client selector (dropdown) that filters the areas/invoices view to the chosen client. Uses the client list you already resolve; read-only. (If linked to one client, hide it.)
- [x] **16. Service-area filter + search.** On the Service Areas tab, add status filter + text search over the areas already fetched. Frontend only.
- [x] **17. "What's new" indicator.** Mark areas/invoices updated since the user's last visit using a `localStorage` timestamp (no schema, no backend). A small "updated" badge + a "last visited" line.
- [x] **18. Invoice list polish.** On the Invoices tab: sort + filter (sent / paid), a running total of billed vs paid (client-facing figures only — what they're billed, never internal cost). Frontend.
- [x] **19. Portal mini-dashboard.** A compact visual summary across all the client's areas (progress bars / a simple status breakdown). Frontend over data you already fetch.
- [x] **20. First-run + resilience polish.** A friendly first-run state for a brand-new client with no `client_visible` areas yet, plus consistent loading/error states and a retry affordance on fetch failures.

### Merge hygiene (you hit trouble syncing main last time)
You don't need to keep `main` merged into your branch — just push your branch; **CEO merges to main.** If you DO want to sync: `git fetch origin && git merge origin/main`. After this merge it'll fast-forward cleanly. If a conflict ever hits **`briefs/claude-3.md`**, it's not your file to win — take main's copy: `git checkout --theirs briefs/claude-3.md && git add briefs/claude-3.md`. Keep your conflict resolution to your own feature files (`public/customer.html`, `routes/customer_portal.js`).

> Blow through 15–20 and CEO's still away? Continue on additive portal polish (print styles, keyboard nav, dark-mode contrast), logging each under a new `### Round 6` block. Bias to shipping; flag schema as BLOCKED, never guess.

---

## Round 6 (R5 merged ✓ — clean, no $-leak). Sonnet @ medium. Start at task 21.
Same guardrails: additive, `customer`-scoped, read-only, no $ beyond billed, NO schema. Push per task; CEO merges.
- [x] **21. Unified portal search.** One search/filter bar that spans the client's service areas AND invoices (text + status), reusing the data you already fetch. Frontend.
- [x] **22. Download/print polish.** A "Download PDF" affordance on the printable invoice (client-side print-to-PDF) and a clean print view for a single service-area's status. Frontend, no backend.
- [x] **23. Locale + relative time.** Consistent date/number formatting and relative "updated N days ago" labels across areas/invoices. Frontend.
- [x] **24. Performance + resilience.** Debounce the filter/search inputs, cache the initial portal fetch (invalidate on client switch), and make every fetch failure show a graceful retry. Frontend.
> Schema need (e.g. notifications, photos) → `BLOCKED — needs CEO` + ping; photos stay deferred to Phase 7.

> **Note for CEO (task 24 caching):** the `/api/customer/service-areas` and `/api/customer/invoices` endpoints both return data across *all* of the user's linked clients, and the multi-client switcher filters in-memory. So I cache each fetch once and the client switch is a pure re-filter — no per-client refetch / cache invalidation is needed (more efficient than the brief's "invalidate on client switch", same correctness). The error/retry path re-fetches.

---

## Round 7 (R6 merged ✓ — clean). Sonnet @ medium. Start at task 25.
> **Near the additive ceiling too.** The portal is mature. Deeper features (notifications, per-area documents/photos) need schema → **Phase 7 / CEO**. R7 is polish + comms; when done, set Status `DONE — additive work exhausted` and flag for CEO.
- [ ] **25. First-run help / onboarding.** A dismissible overlay or "?" affordance explaining the tabs/status meanings for a first-time client. Frontend, `localStorage` dismiss.
- [ ] **26. Contact / support.** A "Contact your project manager" action (mailto using the PM info already shown). No backend.
- [ ] **27. a11y + cross-browser + perf round 2.** Audit labels/focus/contrast; verify on mobile + a second browser; confirm debounce/cache from R6 hold up.
- [ ] **28. Print/export polish.** Clean single-area status sheet + an all-areas summary print/PDF for the client. Frontend.
> Guardrails: read-only, customer-scoped, no $ beyond billed, NO schema. Schema need → BLOCKED + ping.
