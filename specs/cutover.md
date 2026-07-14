# SPEC — Keystone cutover: cleanup, completion, events + nudges, diagnostics logger (PLAN 2.2 / 2.3 / 2.4 / 2.12)

> ✔ **RATIFIED** — Carter, 2026-07-13 (Partner spec session, the succession-sprint batch). His rulings, verbatim where it matters:
> **Legacy data:** "all old data is test data, delete it" — clean-slate cutover, delete-not-archive. · **Redirect:** hard cutover at merge. · ***10:** migrate nothing extra. · **Nudges:** in-app only. · **Logger:** off by default, 30-day retention. · **2.2 kill list:** confirmed, all die. · **Events:** title + note + date + remind-in-X-days.
> Architecture source: `specs/ideas/cutover-architecture-facts.md` (O16–O20 — do not re-derive).

## Sequence (dependency-true)
1. **2.2 Legacy cleanup (first, clears the field) — AMENDED per #71 (f1's dependency check, Partner 2026-07-14; the original list was over-broad):**
   **Step-1 deletes (genuinely dead):** AI assistant · the **audit_log FEATURE** (viewer + its 11 red tests — the L-015 baseline shrinks) · the mount-shadowed dead `GET /api/billing/report` (O19). Unwire from server.js → grep-verify nothing live references → delete.
   **⚠ NOT step-1 — retire at steps 5–7 WITH their replacements (load-bearing on live surfaces until then):** `setting-requests` (real FK), the legacy **permits routes** (the live permitting pipeline), and `inspection.js` (admin KPI tiles). Deleting these before their cluster replacements land breaks live flows — they die when steps 5–7 retire their surfaces.
   **⚠ Two audit systems, never conflate (my original text did):** `audit_log` (the kill-listed viewer feature) DIES; **`time_entry_audit` (the timeclock trail) STAYS** — it is live integrity infrastructure, and `audit_cleanup.test.js` stays with it.
2. **O20 port (the #1 blocker, code-not-data):** invoice assembly + the RUS PDF currently read legacy projects ONLY (`invoice_generator.js`: zero service_area_job refs). Port assembly to keystone `service_area_jobs` BEFORE anything legacy retires — a keystone-billed invoice must produce a submittable RUS PDF. The invoice-template engine (I5) re-points here too.
3. **Invoice path consolidation:** six creation paths → ONE keystone path (`billing_keystone.js /run` + batch). `service_areas.js :id/bill` (orphans invoices — O16) retires or delegates. Money invariant: every invoice row links to keystone; reporting sees 100% of money.
4. **Parallel-structure reconciliation:** one written map (SA-ish ×3, contracts ×2, dashboards ×2, money reporting ×2) → keystone canonical, each legacy twin marked retire/port. Projections parity: legacy `automation.js` sparklines/forecast are RICHER than keystone `projections.js` — **port, don't reroute** (I6 engines stay).
5. **Cluster UI gap-close:** verify R10–R13 UI; build cluster UI for the stranded-backend features (pricing, jobs admin, invoice templates, CC catalog, client links, staff/user CRUD, portal access — backends exist per the chunk-16 inventory; this is UI work).
6. **Legacy data DELETE (Carter-ruled 2026-07-13):** all legacy project data is test data. #62-protocol execution: backup recency check → dry-run with exact per-table counts **posted to Carter for a final look before DELETE** (hard rule 9 — the standing ruling authorizes the plan, the run-time counts get eyes) → FK-order delete → VO post-state (no orphans, aggregates clean-empty).
7. **Hard redirect at merge (Carter-ruled):** admin.html → the cluster, same deploy as step 6. No parallel period. Risk accepted because nothing real can strand (all data test, all workflows rebuilt and verified in step 5).
8. **2.4 Events + nudges** and **2.12 logger** ride the same wave (below).

## 2.4 Events + nudges
- `events`: id · title (free text) · note (optional) · event_date · remind_days · entity link (nullable: job / SA / client) · created_by · done · created_at.
- **In-app only (Carter-ruled):** a notification center in the cluster header — badge count + list (due/overdue events, stale-job nudges). No email plumbing.
- Stale-job nudges: default **14 days** without activity on an active job → nudge row; threshold is config, not code.
- Done-when: create event on a job → appears in the center on its date; remind-in-X fires X days before; stale nudge appears for a 14-day-idle job; dismiss/done clears.

## 2.12 Diagnostics logger
- Master toggle **default OFF** (Carter-ruled); admin-only visibility; captures clickstream + JS errors when on; **30-day auto-purge** + one-click purge-now. It is a TESTING tool ("it broke" reports), never analytics.

## Done-when (the cutover itself)
- `admin.html` redirects; every daily workflow demonstrably possible in the cluster (VO playthrough: create client → EC → SA → jobs → hours → invoice with RUS PDF → money reports agree).
- Exactly ONE invoice-creation path remains reachable; O16 orphan path gone; legacy tables empty (step 6 verified) or dropped.
- Money math: keystone invoice totals = Σ jobs (SA rollup) — VO money lens on every step-2/3 package.
- **The three #71-deferred routes are DELETED (setting-requests, legacy permits routes, inspection.js)** — each dies in the same package that lands its cluster replacement (steps 5–7). **The cutover is NOT done while any of the three remains** — this line exists so the deferral can't be forgotten (Carter 2026-07-14).
- premerge green; live smoke post-deploy.

## Decomposition guidance (Registrar)
Packages in sequence-order above; steps 2–3 are money-critical (VO money lens mandatory, no self-certification anywhere). Steps 1, 4, 5 parallelize across foremen; 6–7 are one Registrar-supervised package (destructive + wiring). Queue position: **Track 2 opens after desktop D1/D2 + mini-jobs per the standing build queue — unless Carter reprioritizes at the board.**
